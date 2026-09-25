import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { BooksService } from '@/lib/supabase/books.service';
import {
  AuthorsService,
  NewsService,
  EventsService,
  GalleryService,
  BookClubService,
} from '@/lib/supabase/modules.service';

function checkAdminAuth(req: NextRequest): boolean {
  const token = req.headers.get('x-cms-auth');
  return token === 'ci-editorial-session-authenticated';
}

export type ValidTableName = 'books' | 'autores' | 'noticias' | 'eventos' | 'galeria' | 'club_lectura';

interface RouteProps {
  params: Promise<{
    module: string;
  }>;
}

// GET /api/admin/[module] - Listar registros para visualización
export async function GET(req: NextRequest, { params }: RouteProps) {
  const { module } = await params;
  const admin = getSupabaseAdminClient();

  try {
    let query;
    switch (module) {
      case 'books': {
        const booksResult = await admin.from('books').select('*').order('created_at', { ascending: false });
        let booksData = booksResult.data || [];

        // Garantizar persistencia física real de "Giselle" en public.books
        const hasGiselle = booksData.some((b: any) => b.slug === 'giselle');
        if (!hasGiselle) {
          try {
            await admin.from('books').upsert({
              id: 'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
              title: 'Giselle',
              slug: 'giselle',
              synopsis:
                'Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas. En una época marcada por las apariencias, las convenciones familiares y aquello que se esperaba de una mujer, Giselle intenta construir su vida bajo sus propias reglas. Amores, decisiones, deseos, pérdidas y contradicciones irán trazando un camino en el que cada elección tendrá consecuencias. A su alrededor, otras historias también avanzan: familias que se forman, relaciones que se transforman y personajes que aman, juzgan, perdonan o abandonan. Giselle es una novela sobre la libertad, el amor, la dependencia y las decisiones que pueden acompañarnos durante toda una vida. Pero, sobre todo, es la historia de una mujer que quiso vivir sin pedir permiso.',
              status: 'published',
              cover_url: '/images/giselle-2.jpg',
            }, { onConflict: 'slug' });

            const recheck = await admin.from('books').select('*').order('created_at', { ascending: false });
            booksData = recheck.data || booksData;
          } catch (seedErr) {
            console.warn('[AdminAPI GET] No se pudo auto-sembrar Giselle:', seedErr);
          }
        }
        return NextResponse.json({ success: true, data: booksData });
      }
      case 'autores': {
        const autoresResult = await admin.from('autores').select('*').order('created_at', { ascending: false });
        let autoresData = autoresResult.data || [];

        // Garantizar persistencia física real del registro oficial de Carmen Ibáñez en public.autores
        if (autoresData.length === 0) {
          const nowIso = new Date().toISOString();
          const canonicalAuthor = {
            id: 'c0a80101-0000-4000-a000-000000000001',
            name: 'Carmen Ibáñez',
            bio_short: 'Autora y escritora chilena.',
            bio_long:
              'Carmen Ibáñez es una autora chilena que encuentra en la escritura una forma de explorar las emociones, las decisiones y las contradicciones que marcan la vida de las personas, especialmente el universo femenino. Su narrativa pone especial atención en los vínculos, el amor, la familia, la libertad, la culpa y aquellas elecciones capaces de cambiar una vida completa. Escribe desde la observación de las emociones y de aquello que muchas veces permanece oculto detrás de las apariencias.',
            profile_image_url: '/images/giselle-portada.png',
            twitter_url: '',
            instagram_url: '',
            facebook_url: '',
            created_at: nowIso,
            updated_at: nowIso,
          };
          try {
            await admin.from('autores').upsert(canonicalAuthor, { onConflict: 'id' });
            const recheck = await admin.from('autores').select('*').order('created_at', { ascending: false });
            if (recheck.data && recheck.data.length > 0) {
              autoresData = recheck.data;
            } else {
              autoresData = [canonicalAuthor];
            }
          } catch (seedErr) {
            console.warn('[AdminAPI GET] No se pudo auto-sembrar Carmen Ibáñez:', seedErr);
            autoresData = [canonicalAuthor];
          }
        }
        return NextResponse.json({ success: true, data: autoresData });
      }
      case 'noticias':
        query = admin.from('noticias').select('*').order('published_at', { ascending: false });
        break;
      case 'eventos':
        query = admin.from('eventos').select('*').order('event_date', { ascending: true });
        break;
      case 'galeria':
        query = admin.from('galeria').select('*').order('created_at', { ascending: false });
        break;
      case 'club_lectura':
        query = admin.from('club_lectura').select('*, books(id, title, slug)').order('created_at', { ascending: false });
        break;
      default:
        return NextResponse.json({ success: false, error: 'Módulo no válido' }, { status: 404 });
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error(`[AdminAPI GET] Error en módulo ${module}:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/[module] - Crear o actualizar registro
export async function POST(req: NextRequest, { params }: RouteProps) {
  const { module } = await params;

  if (!checkAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: 'Acceso no autorizado a la Zona Editorial Privada' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    switch (module) {
      case 'books': {
        const result = await BooksService.createBook(body);
        return NextResponse.json({ success: true, data: result });
      }
      case 'autores': {
        const result = await AuthorsService.upsertAuthor(body, body.id);
        try {
          revalidatePath('/');
          revalidatePath('/zona-editorial-privada-ci');
        } catch (revalErr) {
          console.warn('[AdminAPI POST] Error revalidando rutas:', revalErr);
        }
        return NextResponse.json({ success: true, data: result });
      }
      case 'noticias': {
        const result = await NewsService.createNews(body);
        return NextResponse.json({ success: true, data: result });
      }
      case 'eventos': {
        const result = await EventsService.createEvent(body);
        return NextResponse.json({ success: true, data: result });
      }
      case 'galeria': {
        const result = await GalleryService.createGalleryItem(body);
        return NextResponse.json({ success: true, data: result });
      }
      case 'club_lectura': {
        const result = await BookClubService.createClub(body);
        return NextResponse.json({ success: true, data: result });
      }
      default:
        return NextResponse.json(
          { success: false, error: `Módulo desconocido: ${module}` },
          { status: 404 }
        );
    }
  } catch (error: any) {
    console.error(`[AdminAPI POST] Error procesando módulo ${module}:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/admin/[module]?id=UUID - Eliminar registro
export async function DELETE(req: NextRequest, { params }: RouteProps) {
  const { module } = await params;

  if (!checkAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: 'Acceso no autorizado a la Zona Editorial Privada' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Falta el parámetro ID' }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdminClient();
    const tableMap: Record<string, ValidTableName> = {
      books: 'books',
      autores: 'autores',
      noticias: 'noticias',
      eventos: 'eventos',
      galeria: 'galeria',
      club_lectura: 'club_lectura',
    };

    const tableName = tableMap[module];
    if (!tableName) {
      return NextResponse.json({ success: false, error: 'Módulo no válido' }, { status: 404 });
    }

    const validTable: ValidTableName = tableName;
    const { error } = await admin.from(validTable).delete().eq('id', id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, message: 'Registro eliminado' });
  } catch (error: any) {
    console.error(`[AdminAPI DELETE] Error en módulo ${module}:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/[module] - Actualizar registro existente
export async function PUT(req: NextRequest, { params }: RouteProps) {
  const { module } = await params;

  if (!checkAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: 'Acceso no autorizado a la Zona Editorial Privada' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Falta el ID del registro para actualizar' }, { status: 400 });
    }

    switch (module) {
      case 'books': {
        const result = await BooksService.updateBook(body);
        try {
          revalidatePath('/');
          revalidatePath('/zona-editorial-privada-ci');
          if (result.slug) {
            revalidatePath(`/subdomains/${result.slug}`);
          }
        } catch (revalErr) {
          console.warn('[AdminAPI PUT] Error revalidando rutas de libros:', revalErr);
        }
        return NextResponse.json({ success: true, data: result });
      }
      case 'autores': {
        const result = await AuthorsService.upsertAuthor(body, id);
        try {
          revalidatePath('/');
          revalidatePath('/zona-editorial-privada-ci');
        } catch (revalErr) {
          console.warn('[AdminAPI PUT] Error revalidando rutas:', revalErr);
        }
        return NextResponse.json({ success: true, data: result });
      }
      case 'noticias': {
        const result = await NewsService.updateNews(id, body);
        return NextResponse.json({ success: true, data: result });
      }
      case 'eventos': {
        const result = await EventsService.updateEvent(id, body);
        return NextResponse.json({ success: true, data: result });
      }
      case 'galeria': {
        const result = await GalleryService.updateGalleryItem(id, body);
        return NextResponse.json({ success: true, data: result });
      }
      case 'club_lectura': {
        const result = await BookClubService.updateClub(id, body);
        return NextResponse.json({ success: true, data: result });
      }
      default:
        return NextResponse.json(
          { success: false, error: `Módulo desconocido: ${module}` },
          { status: 404 }
        );
    }
  } catch (error: any) {
    console.error(`[AdminAPI PUT] Error actualizando módulo ${module}:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export const PATCH = PUT;

