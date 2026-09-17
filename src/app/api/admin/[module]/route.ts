import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { BooksService } from '@/lib/supabase/books.service';
import {
  AuthorsService,
  NewsService,
  EventsService,
  GalleryService,
  BookClubService,
} from '@/lib/supabase/modules.service';

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
      case 'books':
        query = admin.from('books').select('*').order('created_at', { ascending: false });
        break;
      case 'autores':
        query = admin.from('autores').select('*').order('created_at', { ascending: false });
        break;
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

  try {
    const body = await req.json();

    switch (module) {
      case 'books': {
        const result = await BooksService.createBook(body);
        return NextResponse.json({ success: true, data: result });
      }
      case 'autores': {
        const result = await AuthorsService.upsertAuthor(body, body.id);
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
