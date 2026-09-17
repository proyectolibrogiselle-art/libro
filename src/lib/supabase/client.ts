import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno públicas de Supabase (NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY)'
  );
}

/**
 * Cliente público de Supabase para operaciones de lectura del frontend.
 * Respeta estrictamente Row Level Security (RLS).
 */
export const supabasePublicClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
