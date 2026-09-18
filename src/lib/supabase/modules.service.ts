import { supabasePublicClient } from './client';
import { getSupabaseAdminClient } from './admin';
import { Author, News, EventItem, GalleryItem, BookClub, GaleriaCategory, ClubLecturaStatus } from '@/types/entities';
import {
  authorSchema,
  AuthorInput,
  newsSchema,
  NewsInput,
  eventSchema,
  EventInput,
  gallerySchema,
  GalleryInput,
  bookClubSchema,
  BookClubInput,
} from '@/schemas';

/**
 * ==============================================================================
 * SERVICIOS DE CONSULTA Y MUTACIÓN SUPABASE (SDD)
 * ==============================================================================
 */

// 1. SERVICIO: AUTORES
export class AuthorsService {
  static async getPrimaryAuthor(): Promise<Author | null> {
    const { data, error } = await supabasePublicClient
      .from('autores')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[AuthorsService] Error consultando autor principal:', error.message);
      return null;
    }
    return data;
  }

  static async upsertAuthor(input: AuthorInput, existingId?: string): Promise<Author> {
    const validated = authorSchema.parse(input);
    const admin = getSupabaseAdminClient();

    if (existingId) {
      const { data, error } = await admin
        .from('autores')
        .update(validated)
        .eq('id', existingId)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      return data;
    } else {
      const { data, error } = await admin
        .from('autores')
        .insert(validated)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  }
}

// 2. SERVICIO: NOTICIAS
export class NewsService {
  static async getAllNews(): Promise<News[]> {
    const { data, error } = await supabasePublicClient
      .from('noticias')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[NewsService] Error obteniendo noticias:', error.message);
      return [];
    }
    return data || [];
  }

  static async getNewsBySlug(slug: string): Promise<News | null> {
    const { data, error } = await supabasePublicClient
      .from('noticias')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .maybeSingle();

    if (error) return null;
    return data;
  }

  static async createNews(input: NewsInput): Promise<News> {
    const validated = newsSchema.parse(input);
    const admin = getSupabaseAdminClient();

    const { data, error } = await admin
      .from('noticias')
      .insert(validated)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateNews(id: string, input: Partial<NewsInput>): Promise<News> {
    const admin = getSupabaseAdminClient();
    const updateData: Record<string, any> = { ...input, updated_at: new Date().toISOString() };
    const { data, error } = await admin
      .from('noticias')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

// 3. SERVICIO: EVENTOS
export class EventsService {
  static async getUpcomingEvents(): Promise<EventItem[]> {
    const { data, error } = await supabasePublicClient
      .from('eventos')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('[EventsService] Error obteniendo eventos:', error.message);
      return [];
    }
    return data || [];
  }

  static async createEvent(input: EventInput): Promise<EventItem> {
    const validated = eventSchema.parse(input);
    const admin = getSupabaseAdminClient();

    const { data, error } = await admin
      .from('eventos')
      .insert({
        title: validated.title,
        description: validated.description,
        event_date: validated.event_date,
        location: validated.location,
        registration_url: validated.registration_url || null,
        image_url: validated.image_url || null,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateEvent(id: string, input: Partial<EventInput>): Promise<EventItem> {
    const admin = getSupabaseAdminClient();
    const updateData: Record<string, any> = { ...input, updated_at: new Date().toISOString() };
    const { data, error } = await admin
      .from('eventos')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

// 4. SERVICIO: GALERÍA
export class GalleryService {
  static async getItemsByCategory(category?: 'Inspiración' | 'Fanart' | 'Eventos'): Promise<GalleryItem[]> {
    let query = supabasePublicClient
      .from('galeria')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[GalleryService] Error obteniendo galería:', error.message);
      return [];
    }
    return data || [];
  }

  static async createGalleryItem(input: GalleryInput): Promise<GalleryItem> {
    const validated = gallerySchema.parse(input);
    const admin = getSupabaseAdminClient();

    const { data, error } = await admin
      .from('galeria')
      .insert({
        title: validated.title,
        description: validated.description || null,
        image_url: validated.image_url,
        category: validated.category as GaleriaCategory,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateGalleryItem(id: string, input: Partial<GalleryInput>): Promise<GalleryItem> {
    const admin = getSupabaseAdminClient();
    const updateData: Record<string, any> = { ...input, updated_at: new Date().toISOString() };
    const { data, error } = await admin
      .from('galeria')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

// 5. SERVICIO: CLUB DE LECTURA
export class BookClubService {
  static async getAllClubs(): Promise<BookClub[]> {
    const { data, error } = await supabasePublicClient
      .from('club_lectura')
      .select('*, books(id, title, slug, cover_url)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[BookClubService] Error obteniendo clubes de lectura:', error.message);
      return [];
    }
    return (data || []) as unknown as BookClub[];
  }

  static async createClub(input: BookClubInput): Promise<BookClub> {
    const validated = bookClubSchema.parse(input);
    const admin = getSupabaseAdminClient();

    const payload = {
      name: validated.name,
      description: validated.description,
      status: (validated.status || 'active') as ClubLecturaStatus,
      book_id: validated.book_id || null,
      external_link: validated.external_link || null,
    };

    const { data, error } = await admin
      .from('club_lectura')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateClub(id: string, input: Partial<BookClubInput>): Promise<BookClub> {
    const admin = getSupabaseAdminClient();
    const updateData: Record<string, any> = { ...input, updated_at: new Date().toISOString() };
    const { data, error } = await admin
      .from('club_lectura')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}
