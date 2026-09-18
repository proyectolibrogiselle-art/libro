-- ==============================================================================
-- MIGRACIÓN: AÑADIR CAMPO IMAGE_URL A EVENTOS Y PERSISTENCIA DE GISELLE
-- ==============================================================================

-- 1. Añadir columna image_url a la tabla public.eventos si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'eventos' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE public.eventos ADD COLUMN image_url TEXT DEFAULT NULL;
    END IF;
END $$;

-- 2. Asegurar persistencia real del libro emblemático "Giselle" en public.books
INSERT INTO public.books (
    id,
    title,
    slug,
    synopsis,
    status,
    cover_url,
    created_at,
    updated_at
)
VALUES (
    'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
    'Giselle',
    'giselle',
    'Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas. En una época marcada por las apariencias, las convenciones familiares y aquello que se esperaba de una mujer, Giselle intenta construir su vida bajo sus propias reglas. Amores, decisiones, deseos, pérdidas y contradicciones irán trazando un camino en el que cada elección tendrá consecuencias. A su alrededor, otras historias también avanzan: familias que se forman, relaciones que se transforman y personajes que aman, juzgan, perdonan o abandonan. Giselle es una novela sobre la libertad, el amor, la dependencia y las decisiones que pueden acompañarnos durante toda una vida. Pero, sobre todo, es la historia de una mujer que quiso vivir sin pedir permiso.',
    'published',
    '/images/giselle-2.jpg',
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    synopsis = EXCLUDED.synopsis,
    status = EXCLUDED.status,
    cover_url = EXCLUDED.cover_url,
    updated_at = NOW();
