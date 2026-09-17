import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'galeria';

    const validBuckets = ['autores', 'noticias', 'galeria', 'book-covers'];
    if (!validBuckets.includes(bucket)) {
      return NextResponse.json(
        { success: false, error: `Bucket inválido. Debe ser: ${validBuckets.join(', ')}` },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }

    // Normalizar nombre de archivo seguro
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${cleanFileName}`;

    const admin = getSupabaseAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await admin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('[UploadAPI] Error en Supabase Storage:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const { data: publicUrlData } = admin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (error: any) {
    console.error('[UploadAPI] Excepción capturada:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al subir archivo' },
      { status: 500 }
    );
  }
}
