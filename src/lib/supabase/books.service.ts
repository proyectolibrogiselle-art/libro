import { supabasePublicClient } from './client';
import { getSupabaseAdminClient } from './admin';
import { Book, BookStatus } from '@/types/book';
import { Database } from '@/types/database.types';
import { createBookSchema, updateBookSchema, CreateBookInput, UpdateBookInput } from '@/schemas/book.schema';

type BookUpdate = Database['public']['Tables']['books']['Update'];

/**
 * Servicio de Libros - Capa de Acceso a Datos y Dominio (SDD)
 */
export class BooksService {
  /**
   * Obtiene un libro por su slug (utilizado para resolver el subdominio dinámico)
   * Respeta RLS: en lectura pública solo retornará libros en estado 'published'.
   */
  static async getPublishedBookBySlug(slug: string): Promise<Book | null> {
    const cleanSlug = slug.toLowerCase().trim();

    const { data, error } = await supabasePublicClient
      .from('books')
      .select('*')
      .eq('slug', cleanSlug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.error(`[BooksService] Error obteniendo libro por slug '${cleanSlug}':`, error.message);
      return null;
    }

    return data as Book | null;
  }

  /**
   * Obtiene todos los libros publicados para la página principal (carmenibanez.cl)
   */
  static async getPublishedBooks(): Promise<Book[]> {
    const { data, error } = await supabasePublicClient
      .from('books')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[BooksService] Error listando libros publicados:', error.message);
      return [];
    }

    return (data || []) as Book[];
  }

  /**
   * Crea un nuevo libro a través de Antigravity CMS (valida con Zod y usa Service Role)
   */
  static async createBook(input: CreateBookInput): Promise<Book> {
    // 1. Validación estricta con Zod en tiempo de ejecución (SDD)
    const validatedData = createBookSchema.parse(input);

    const adminClient = getSupabaseAdminClient();
    const { data, error } = await adminClient
      .from('books')
      .insert({
        title: validatedData.title,
        slug: validatedData.slug,
        synopsis: validatedData.synopsis,
        status: validatedData.status as BookStatus,
        cover_url: validatedData.cover_url || null,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Error en base de datos al crear libro: ${error.message}`);
    }

    return data as Book;
  }

  /**
   * Actualiza un libro existente desde Antigravity CMS
   */
  static async updateBook(input: UpdateBookInput): Promise<Book> {
    const validatedData = updateBookSchema.parse(input);
    const { id, ...updateFields } = validatedData;

    const updatePayload: BookUpdate = {};
    if (updateFields.title !== undefined) updatePayload.title = updateFields.title;
    if (updateFields.slug !== undefined) updatePayload.slug = updateFields.slug;
    if (updateFields.synopsis !== undefined) updatePayload.synopsis = updateFields.synopsis;
    if (updateFields.status !== undefined) updatePayload.status = updateFields.status as BookStatus;
    if (updateFields.cover_url !== undefined) updatePayload.cover_url = updateFields.cover_url || null;

    const adminClient = getSupabaseAdminClient();
    const { data, error } = await adminClient
      .from('books')
      .update(updatePayload as any)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Error actualizando libro ID ${id}: ${error.message}`);
    }

    return data as Book;
  }
}
