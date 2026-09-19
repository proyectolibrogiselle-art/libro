# carmenibanez.cl - Arquitectura Headless (SDD)

Base del proyecto para la plataforma de la autora **Carmen Ibáñez**, implementando una arquitectura **Headless** basada en esquemas estrictos (**Schema-Driven Development - SDD**), con soporte para subdominios dinámicos por libro (ej. `giselle.carmenibanez.cl`).

## Stack Tecnológico
- **Backend / CMS**: Antigravity Agent & Headless API
- **Base de Datos & Almacenamiento**: Supabase (PostgreSQL 15+, Storage Bucket)
- **Frontend**: Next.js (App Router, React Server Components)
- **Despliegue**: Vercel (Wildcard DNS `*.carmenibanez.cl`)

---

## 1. Inicialización y Ejecución Local

### Prerrequisitos
- Node.js v18.17+ o v20+
- Cuenta en [Supabase](https://supabase.com)
- Supabase CLI (opcional, para migraciones locales)

### Instalación de Dependencias
```bash
npm install
```

### Configuración de Entorno
Copia la plantilla de variables de entorno y completa las credenciales de tu proyecto de Supabase:
```bash
cp .env.example .env.local
```

---

## 2. Configuración de Base de Datos (Supabase)

Aplica el esquema SQL ubicado en `supabase/migrations/20260917000000_init_books.sql` desde el **SQL Editor** del dashboard de Supabase o mediante la CLI:

```bash
supabase db push
```

Este script configura:
1. El tipo `ENUM` `book_status` (`'draft'`, `'writing'`, `'published'`).
2. La tabla `public.books` con validaciones RFC 1123 para subdominios DNS.
3. Políticas de seguridad **Row Level Security (RLS)**:
   - Lectura pública solo para libros en estado `'published'`.
   - Control total de mutaciones restringido al `service_role` (Antigravity CMS).
4. El bucket de almacenamiento público `book-covers` en Supabase Storage.

---

## 3. Estructura del Proyecto

```text
├── .agents/
│   └── rules/
│       └── sdd-architecture.md      # Reglas para Antigravity CMS & SDD
├── supabase/
│   └── migrations/
│       └── 20260917000000_init_books.sql  # DDL SQL de PostgreSQL
├── src/
│   ├── types/
│   │   ├── database.types.ts        # Tipos generados de Supabase
│   │   └── book.ts                  # Interfaces de dominio (Book, BookStatus)
│   ├── schemas/
│   │   └── book.schema.ts           # Validadores Zod de tiempo de ejecución
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts            # Cliente público (Anon Key, RLS activo)
│   │       ├── admin.ts             # Cliente administrativo (Service Role)
│   │       └── books.service.ts     # Capa de servicio tipada
│   └── middleware.ts                # Detección y reescritura de subdominios
├── .env.example                     # Plantilla de variables de entorno
├── package.json
└── tsconfig.json
```

---

## 4. Subdominios Dinámicos (Wildcard DNS)

El enrutamiento de subdominios se resuelve mediante [src/middleware.ts](file:///c:/libro/src/middleware.ts):
- Si el usuario visita `carmenibanez.cl` -> Se sirve la página principal.
- Si el usuario visita `giselle.carmenibanez.cl` -> El middleware extrae `giselle` y reescribe internamente la petición a `/subdomains/giselle`.

---

## 5. Pipeline y Despliegue CI/CD
Flujo de integración y despliegue continuo activo sincronizado con el repositorio oficial y Vercel.

