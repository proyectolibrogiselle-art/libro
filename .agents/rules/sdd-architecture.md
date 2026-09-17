# REGLAS DE ARQUITECTURA: SCHEMA-DRIVEN DEVELOPMENT (SDD)
Proyecto: carmenibanez.cl
Backend/CMS: Antigravity
Base de Datos: Supabase (PostgreSQL)

## Principios Fundamentales
1. **Única Fuente de Verdad (Single Source of Truth)**:
   - Todo cambio estructural debe originarse en la base de datos Supabase a través de migraciones SQL en `supabase/migrations/`.
   - Ninguna entidad en TypeScript puede crearse sin su contraparte en `database.types.ts`.

2. **Validación en Tiempo de Ejecución (Runtime Validation)**:
   - Toda entrada de datos en Antigravity CMS o Server Actions DEBE validarse mediante Zod (`src/schemas/book.schema.ts`).
   - El campo `slug` debe cumplir estrictamente la RFC 1123 para subdominios DNS (minúsculas, caracteres alfanuméricos y guiones, longitud máxima 63 caracteres).
   - Slugs reservados (`www`, `api`, `admin`, etc.) quedan terminantemente bloqueados.

3. **Separación de Privilegios y Seguridad**:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Solo consultas públicas de lectura (filtradas por RLS `status = 'published'`).
   - `SUPABASE_SERVICE_ROLE_KEY`: Restringido al Backend de Antigravity CMS para mutaciones, drafts y administración.
   - NUNCA exponer la Service Role Key al bundle de cliente.

4. **Soporte de Subdominios Wildcard en Vercel**:
   - Cada libro con estado `published` y un `slug` válido (ej. `giselle`) responderá automáticamente a `giselle.carmenibanez.cl`.
