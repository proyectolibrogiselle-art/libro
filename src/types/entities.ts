import { Database, GaleriaCategory, ClubLecturaStatus } from './database.types';

export type Author = Database['public']['Tables']['autores']['Row'];
export type News = Database['public']['Tables']['noticias']['Row'];
export type EventItem = Database['public']['Tables']['eventos']['Row'];
export type GalleryItem = Database['public']['Tables']['galeria']['Row'];
export type BookClub = Database['public']['Tables']['club_lectura']['Row'];

export { GaleriaCategory, ClubLecturaStatus };
