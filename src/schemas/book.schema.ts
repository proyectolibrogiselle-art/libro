import { z } from 'zod';
import { BOOK_STATUSES } from '../types/book';

/**
 * Slugs reservados que no pueden asignarse a ningún libro para evitar
 * conflictos con subdominios de infraestructura en Vercel / DNS.
 */
export const RESERVED_SLUGS = [
  'www',
  'api',
  'admin',
  'app',
  'mail',
  'auth',
  'staging',
  'dev',
  'static',
  'assets',
  'cms',
] as const;

/**
 * Expresión regular compatible con especificación DNS RFC 1123 para subdominios:
 * - Solo caracteres alfanuméricos en minúsculas y guiones.
 * - No puede comenzar ni terminar con guion.
 * - Longitud entre 2 y 63 caracteres.
 */
export const SUBDOMAIN_SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Esquema base estricto de validación Zod para libros (SDD)
 */
export const bookBaseSchema = z.object({
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .trim()
    .min(1, 'El título no puede estar vacío')
    .max(255, 'El título no puede exceder 255 caracteres'),

  slug: z
    .string({ required_error: 'El slug es obligatorio' })
    .trim()
    .toLowerCase()
    .min(2, 'El slug debe tener al menos 2 caracteres')
    .max(63, 'El slug no puede exceder 63 caracteres (límite RFC 1123)')
    .regex(
      SUBDOMAIN_SLUG_REGEX,
      'El slug solo puede contener letras minúsculas, números y guiones (sin empezar ni terminar con guion)'
    )
    .refine(
      (slug) => !RESERVED_SLUGS.includes(slug as (typeof RESERVED_SLUGS)[number]),
      {
        message: 'El slug ingresado coincide con un subdominio reservado del sistema',
      }
    ),

  synopsis: z
    .string({ required_error: 'La sinopsis es obligatoria' })
    .trim()
    .min(10, 'La sinopsis debe contener al menos 10 caracteres'),

  status: z.enum(BOOK_STATUSES, {
    errorMap: () => ({ message: 'El estado debe ser: draft, writing o published' }),
  }).default('draft'),

  cover_url: z
    .string()
    .url('La URL de la portada debe ser una URL válida')
    .nullable()
    .optional()
    .or(z.literal('')),
});

/**
 * Esquema para inserción / creación de libro desde Antigravity CMS
 */
export const createBookSchema = bookBaseSchema;

/**
 * Esquema para actualización de libro
 */
export const updateBookSchema = bookBaseSchema.partial().extend({
  id: z.string().uuid('El ID debe ser un UUID válido'),
});

/**
 * Inferencia de tipos estáticos a partir de Zod
 */
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
