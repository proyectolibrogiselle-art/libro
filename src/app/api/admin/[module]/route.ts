import { NextRequest, NextResponse } from 'next/server';
import { BooksService } from '@/lib/supabase/books.service';
import {
  AuthorsService,
  NewsService,
  EventsService,
  GalleryService,
  BookClubService,
} from '@/lib/supabase/modules.service';

interface RouteProps {
  params: Promise<{
    module: string;
  }>;
}

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
        const result = await AuthorsService.upsertAuthor(body);
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
    console.error(`[AdminAPI] Error procesando módulo ${module}:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
