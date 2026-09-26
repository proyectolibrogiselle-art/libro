-- ==============================================================================
-- MIGRACIÓN: AÑADIR SUBTITLE Y HERO_QUOTE A PUBLIC.BOOKS
-- ==============================================================================

-- 1. Añadir columnas subtitle y hero_quote si no existen
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'books' 
        AND column_name = 'subtitle'
    ) THEN
        ALTER TABLE public.books ADD COLUMN subtitle TEXT DEFAULT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'books' 
        AND column_name = 'hero_quote'
    ) THEN
        ALTER TABLE public.books ADD COLUMN hero_quote TEXT DEFAULT NULL;
    END IF;
END $$;

-- 2. Poblar valores iniciales para el libro 'giselle'
UPDATE public.books
SET 
    hero_quote = COALESCE(hero_quote, 'Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas.'),
    subtitle = COALESCE(subtitle, 'Una inmersión literaria nocturna en los pasillos de la culpa, el deseo y la búsqueda irrevocable de autonomía.')
WHERE slug = 'giselle';
