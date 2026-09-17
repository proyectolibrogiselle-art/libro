import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Cliente administrativo de Supabase con Service Role.
 * Se utiliza EXCLUSIVAMENTE en el entorno del Backend / Antigravity CMS / Server Actions.
 * Tiene privilegios completos para gestionar borradores, publicaciones y almacenamiento.
 */
export function getSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY requerida para Antigravity CMS'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
