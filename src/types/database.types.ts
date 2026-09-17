/**
 * Tipos generados para la base de datos de Supabase.
 * Proyecto Supabase ID: zflljndvanqcnfcpciqb
 * Enfoque: Schema-Driven Development (SDD)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookStatus = 'draft' | 'writing' | 'published';
export type GaleriaCategory = 'Inspiración' | 'Fanart' | 'Eventos';
export type ClubLecturaStatus = 'active' | 'completed' | 'upcoming' | 'archived';

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          slug: string;
          synopsis: string;
          status: BookStatus;
          cover_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          synopsis: string;
          status?: BookStatus;
          cover_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          synopsis?: string;
          status?: BookStatus;
          cover_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      autores: {
        Row: {
          id: string;
          name: string;
          bio_short: string | null;
          bio_long: string | null;
          profile_image_url: string | null;
          twitter_url: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio_short?: string | null;
          bio_long?: string | null;
          profile_image_url?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio_short?: string | null;
          bio_long?: string | null;
          profile_image_url?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      noticias: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          image_url: string | null;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          image_url?: string | null;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          image_url?: string | null;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      eventos: {
        Row: {
          id: string;
          title: string;
          description: string;
          event_date: string;
          location: string;
          registration_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          event_date: string;
          location: string;
          registration_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          event_date?: string;
          location?: string;
          registration_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      galeria: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: GaleriaCategory;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          category: GaleriaCategory;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          category?: GaleriaCategory;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_lectura: {
        Row: {
          id: string;
          book_id: string | null;
          name: string;
          description: string;
          status: ClubLecturaStatus;
          external_link: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id?: string | null;
          name: string;
          description: string;
          status?: ClubLecturaStatus;
          external_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string | null;
          name?: string;
          description?: string;
          status?: ClubLecturaStatus;
          external_link?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'club_lectura_book_id_fkey';
            columns: ['book_id'];
            isOneToOne: false;
            referencedRelation: 'books';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      book_status: BookStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
