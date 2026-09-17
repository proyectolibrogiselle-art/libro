-- ==============================================================================
-- MIGRACIÓN INICIAL: ESQUEMA DE LIBROS (BOOKS) & SUBDOMINIOS
-- Proyecto: carmenibanez.cl
-- Enfoque: Schema-Driven Development (SDD) & Headless CMS
-- ==============================================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPO ENUM PARA ESTADO DEL LIBRO
DO $$ BEGIN
    CREATE TYPE book_status AS ENUM ('draft', 'writing', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLA DE LIBROS (BOOKS)
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    -- Slug único utilizado para resolución de subdominio dinámico (ej: giselle.carmenibanez.cl)
    slug VARCHAR(63) NOT NULL,
    -- Contenido Rich Text (Markdown / HTML / JSON serializado)
    synopsis TEXT NOT NULL,
    status book_status NOT NULL DEFAULT 'draft',
    -- URL pública de la imagen en Supabase Storage (bucket 'book-covers')
    cover_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Restricciones de integridad (SDD)
    CONSTRAINT books_slug_unique UNIQUE (slug),
    -- Validación de formato de subdominio DNS compatible (RFC 1123: minúsculas, números, guiones)
    CONSTRAINT books_slug_format CHECK (
        slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'
    ),
    -- Slugs reservados que no pueden usarse como subdominio
    CONSTRAINT books_slug_not_reserved CHECK (
        slug NOT IN ('www', 'api', 'admin', 'app', 'mail', 'auth', 'staging', 'dev', 'static')
    )
);

-- 4. ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_books_slug ON public.books (slug);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books (status);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON public.books (created_at DESC);

-- 5. FUNCIÓN Y TRIGGER PARA AUTO-ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_books_updated_at ON public.books;
CREATE TRIGGER trigger_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Política 1: Lectura pública solo para libros en estado 'published' (Visitantes / Subdominios)
CREATE POLICY "Public Read Access for Published Books"
    ON public.books
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- Política 2: Acceso total para Antigravity Backend / Headless CMS vía Service Role
CREATE POLICY "Service Role Full Access"
    ON public.books
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 7. BUCKET DE SUPABASE STORAGE PARA PORTADAS ('book-covers')
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Política de Storage: Lectura pública de portadas
CREATE POLICY "Public Access to Book Covers"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'book-covers');

-- Política de Storage: Subida y mutación solo para administradores / Service Role
CREATE POLICY "Admin Upload to Book Covers"
    ON storage.objects
    FOR ALL
    TO service_role
    USING (bucket_id = 'book-covers')
    WITH CHECK (bucket_id = 'book-covers');
