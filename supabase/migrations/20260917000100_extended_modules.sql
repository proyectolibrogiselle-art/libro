-- ==============================================================================
-- MIGRACIÓN EXTENDIDA: MÓDULOS DEL ECOSISTEMA CARMEN IBÁÑEZ
-- Archivo: 20260917000100_extended_modules.sql
-- Tablas: autores, noticias, eventos, galeria, club_lectura
-- Enfoque: Schema-Driven Development (SDD) & Row Level Security (RLS)
-- Proyecto Supabase ID: zflljndvanqcnfcpciqb
-- ==============================================================================

-- 1. TABLA: AUTORES
CREATE TABLE IF NOT EXISTS public.autores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bio_short TEXT,
    bio_long TEXT,
    profile_image_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TABLA: NOTICIAS
CREATE TABLE IF NOT EXISTS public.noticias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT NOT NULL, -- Formato RichText / Markdown / HTML
    image_url TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT noticias_slug_unique UNIQUE (slug)
);

-- 3. TABLA: EVENTOS
CREATE TABLE IF NOT EXISTS public.eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    registration_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA: GALERÍA
CREATE TABLE IF NOT EXISTS public.galeria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT chk_galeria_category CHECK (
        category IN ('Inspiración', 'Fanart', 'Eventos')
    )
);

-- 5. TABLA: CLUB DE LECTURA
CREATE TABLE IF NOT EXISTS public.club_lectura (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    external_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT chk_club_lectura_status CHECK (
        status IN ('active', 'completed', 'upcoming', 'archived')
    )
);

-- ==============================================================================
-- ÍNDICES DE RENDIMIENTO (B-TREE)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_noticias_slug ON public.noticias (slug);
CREATE INDEX IF NOT EXISTS idx_noticias_published_at ON public.noticias (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_event_date ON public.eventos (event_date ASC);
CREATE INDEX IF NOT EXISTS idx_galeria_category ON public.galeria (category);
CREATE INDEX IF NOT EXISTS idx_club_lectura_book_id ON public.club_lectura (book_id);
CREATE INDEX IF NOT EXISTS idx_club_lectura_status ON public.club_lectura (status);

-- ==============================================================================
-- TRIGGERS DE ACTUALIZACIÓN AUTOMÁTICA (updated_at)
-- ==============================================================================
DROP TRIGGER IF EXISTS trigger_autores_updated_at ON public.autores;
CREATE TRIGGER trigger_autores_updated_at
    BEFORE UPDATE ON public.autores
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_noticias_updated_at ON public.noticias;
CREATE TRIGGER trigger_noticias_updated_at
    BEFORE UPDATE ON public.noticias
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_eventos_updated_at ON public.eventos;
CREATE TRIGGER trigger_eventos_updated_at
    BEFORE UPDATE ON public.eventos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_galeria_updated_at ON public.galeria;
CREATE TRIGGER trigger_galeria_updated_at
    BEFORE UPDATE ON public.galeria
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_club_lectura_updated_at ON public.club_lectura;
CREATE TRIGGER trigger_club_lectura_updated_at
    BEFORE UPDATE ON public.club_lectura
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Lectura pública para frontend | Escritura exclusiva para Antigravity Service Role
-- ==============================================================================

-- RLS: autores
ALTER TABLE public.autores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Autores"
    ON public.autores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role Full Access for Autores"
    ON public.autores FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RLS: noticias
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Noticias"
    ON public.noticias FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role Full Access for Noticias"
    ON public.noticias FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RLS: eventos
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Eventos"
    ON public.eventos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role Full Access for Eventos"
    ON public.eventos FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RLS: galeria
ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Galeria"
    ON public.galeria FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role Full Access for Galeria"
    ON public.galeria FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RLS: club_lectura
ALTER TABLE public.club_lectura ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Club Lectura"
    ON public.club_lectura FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service Role Full Access for Club Lectura"
    ON public.club_lectura FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- BUCKETS DE ALMACENAMIENTO (SUPABASE STORAGE)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('autores', 'autores', true),
    ('noticias', 'noticias', true),
    ('galeria', 'galeria', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de lectura pública en Storage
CREATE POLICY "Public Read for Autores Storage"
    ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'autores');
CREATE POLICY "Public Read for Noticias Storage"
    ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'noticias');
CREATE POLICY "Public Read for Galeria Storage"
    ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'galeria');

-- Políticas de escritura administrativa (Service Role) en Storage
CREATE POLICY "Admin Upload for Autores Storage"
    ON storage.objects FOR ALL TO service_role USING (bucket_id = 'autores') WITH CHECK (bucket_id = 'autores');
CREATE POLICY "Admin Upload for Noticias Storage"
    ON storage.objects FOR ALL TO service_role USING (bucket_id = 'noticias') WITH CHECK (bucket_id = 'noticias');
CREATE POLICY "Admin Upload for Galeria Storage"
    ON storage.objects FOR ALL TO service_role USING (bucket_id = 'galeria') WITH CHECK (bucket_id = 'galeria');
