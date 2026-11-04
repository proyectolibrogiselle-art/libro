-- ==============================================================================
-- MIGRACIÓN: RATE LIMITING PERSISTENTE PARA FORMULARIO DE CONTACTO
-- Proyecto: carmenibanez.cl
-- Enfoque: Control de abuso por IP con anonimización HMAC (2 intentos / 24 hrs)
-- ==============================================================================

-- 1. TABLA DE REGISTRO DE RATE LIMITING
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
    -- Hash HMAC SHA-256 de la dirección IP anonimizada con secreto de servidor
    ip_hash VARCHAR(64) PRIMARY KEY,
    -- Contador de solicitudes autorizadas dentro de la ventana de tiempo activa
    attempt_count INT NOT NULL DEFAULT 1,
    -- Marca de inicio de la ventana de 24 horas
    first_attempt_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Marca del intento más reciente
    last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. ÍNDICES DE RENDIMIENTO Y LIMPIEZA
CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_first_attempt
    ON public.contact_rate_limits (first_attempt_at);

-- 3. SEGURIDAD A NIVEL DE FILAS (RLS) - ACCESO RESTRINGIDO EXCLUSIVAMENTE A SERVICE ROLE
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- Ningún usuario público (anon) ni autenticado puede consultar o alterar la tabla
DROP POLICY IF EXISTS "Deny all public access to contact rate limits" ON public.contact_rate_limits;
CREATE POLICY "Deny all public access to contact rate limits"
    ON public.contact_rate_limits
    FOR ALL
    TO anon, authenticated
    USING (false)
    WITH CHECK (false);

-- Acceso total reservado para el backend a través de Service Role
DROP POLICY IF EXISTS "Service role access only for contact rate limits" ON public.contact_rate_limits;
CREATE POLICY "Service role access only for contact rate limits"
    ON public.contact_rate_limits
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. FUNCIÓN ATÓMICA DE CONSULTA E INCREMENTO
CREATE OR REPLACE FUNCTION public.check_and_consume_contact_rate_limit(
    p_ip_hash VARCHAR(64),
    p_max_attempts INT DEFAULT 2,
    p_window_hours INT DEFAULT 24
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_record RECORD;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
    v_window_interval INTERVAL := (p_window_hours || ' hours')::INTERVAL;
    v_reset_at TIMESTAMPTZ;
BEGIN
    -- Bloqueo atómico a nivel de fila para prevenir condiciones de carrera
    SELECT * INTO v_record
    FROM public.contact_rate_limits
    WHERE ip_hash = p_ip_hash
    FOR UPDATE;

    -- Caso 1: Primera solicitud registrada para este hash de IP
    IF NOT FOUND THEN
        INSERT INTO public.contact_rate_limits (ip_hash, attempt_count, first_attempt_at, last_attempt_at)
        VALUES (p_ip_hash, 1, v_now, v_now);

        RETURN jsonb_build_object(
            'allowed', TRUE,
            'attempts', 1,
            'remaining', p_max_attempts - 1,
            'reset_at', v_now + v_window_interval
        );
    END IF;

    -- Caso 2: La ventana previa de 24 horas ya expiró -> Reiniciar ciclo
    IF (v_now - v_record.first_attempt_at) >= v_window_interval THEN
        UPDATE public.contact_rate_limits
        SET attempt_count = 1,
            first_attempt_at = v_now,
            last_attempt_at = v_now
        WHERE ip_hash = p_ip_hash;

        RETURN jsonb_build_object(
            'allowed', TRUE,
            'attempts', 1,
            'remaining', p_max_attempts - 1,
            'reset_at', v_now + v_window_interval
        );
    END IF;

    -- Caso 3: Dentro de la ventana de 24 horas
    v_reset_at := v_record.first_attempt_at + v_window_interval;

    IF v_record.attempt_count < p_max_attempts THEN
        -- Cuota disponible: incrementar de forma atómica
        UPDATE public.contact_rate_limits
        SET attempt_count = v_record.attempt_count + 1,
            last_attempt_at = v_now
        WHERE ip_hash = p_ip_hash;

        RETURN jsonb_build_object(
            'allowed', TRUE,
            'attempts', v_record.attempt_count + 1,
            'remaining', p_max_attempts - (v_record.attempt_count + 1),
            'reset_at', v_reset_at
        );
    ELSE
        -- Cuota agotada (límite de 2 intentos alcanzado)
        RETURN jsonb_build_object(
            'allowed', FALSE,
            'attempts', v_record.attempt_count,
            'remaining', 0,
            'reset_at', v_reset_at
        );
    END IF;
END;
$$;

-- 5. PERMISOS DE EJECUCIÓN RESTRICTIVOS
REVOKE ALL ON FUNCTION public.check_and_consume_contact_rate_limit(VARCHAR, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_consume_contact_rate_limit(VARCHAR, INT, INT) TO service_role;
