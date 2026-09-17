import { z } from 'zod';

export const GALLERY_CATEGORIES = ['Inspiración', 'Fanart', 'Eventos'] as const;

export const gallerySchema = z.object({
  title: z.string().trim().min(2, 'El título debe tener al menos 2 caracteres').max(255),
  description: z.string().trim().nullable().optional(),
  image_url: z.string().url('URL de imagen obligatoria'),
  category: z.enum(GALLERY_CATEGORIES, {
    errorMap: () => ({ message: 'Categoría debe ser: Inspiración, Fanart o Eventos' }),
  }),
});

export const updateGallerySchema = gallerySchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

export type GalleryInput = z.infer<typeof gallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
