import { NextRequest, NextResponse } from 'next/server';
import { BooksService } from '@/lib/supabase/books.service';
import { createBookSchema } from '@/schemas/book.schema';

/**
 * Endpoint de la API Headless para gestión de libros en Antigravity CMS
 */

// GET /api/books - Consulta pública de libros publicados
export async function GET() {
  try {
    const books = await BooksService.getPublishedBooks();
    return NextResponse.json({ success: true, data: books });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/books - Creación de libro desde Antigravity CMS (protegido con Service Role)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validación estricta Zod en tiempo de ejecución (SDD)
    const parseResult = createBookSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 2. Inserción con Service Role Client
    const newBook = await BooksService.createBook(parseResult.data);

    return NextResponse.json(
      {
        success: true,
        message: `Libro '${newBook.title}' creado exitosamente. Resolverá a: ${newBook.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'carmenibanez.cl'}`,
        data: newBook,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
