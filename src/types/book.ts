/**
 * ==============================================================================
 * ESQUEMA DE DOMINIO: LIBROS (BOOKS)
 * Proyecto: carmenibanez.cl
 * Arquitectura: Headless CMS con soporte para subdominios dinámicos (SDD)
 * ==============================================================================
 */

import { Database } from './database.types';

// Enum estricto para el ciclo de vida del libro
export type BookStatus = Database['public']['Enums']['book_status'];

export const BOOK_STATUSES: readonly BookStatus[] = ['draft', 'writing', 'published'] as const;

// Entidad principal Libro (Lectura directa desde Supabase)
export interface Book {
  /** Identificador único (UUID v4) */
  id: string;

  /** Título de la obra (Ej: "Giselle") */
  title: string;

  /** 
   * Slug único en minúsculas para resolución de subdominio (Ej: "giselle").
   * Resolverá a: giselle.carmenibanez.cl
   */
  slug: string;

  /** Sinopsis y contenido en formato Rich Text (Markdown o HTML enriquecido) */
  synopsis: string;

  /** Estado de publicación en el CMS */
  status: BookStatus;

  /** URL pública de la imagen de portada almacenada en el bucket de Supabase */
  cover_url: string | null;

  /** Fecha ISO de creación */
  created_at: string;

  /** Fecha ISO de última actualización */
  updated_at: string;
}

// DTO para creación de un libro a través de Antigravity CMS
export interface CreateBookDTO {
  title: string;
  slug: string;
  synopsis: string;
  status?: BookStatus;
  cover_url?: string | null;
}

// DTO para actualización parcial de un libro
export interface UpdateBookDTO extends Partial<CreateBookDTO> {
  id: string;
}

// Contexto resuelto para la navegación por subdominio
export interface BookSubdomainContext {
  subdomain: string;
  book: Book | null;
  isCustomDomain: boolean;
}
