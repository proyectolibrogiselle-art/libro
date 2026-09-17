import { z } from 'zod';

export const newsSchema = z.object({
  title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres').max(255),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido. Solo minúsculas, números y guiones'),
  content: z.string().trim().min(10, 'El contenido debe tener al menos 10 caracteres'),
  image_url: z.string().url('URL de imagen inválida').nullable().optional().or(z.literal('')),
  published_at: z.string().datetime().optional(),
});

export const updateNewsSchema = newsSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

export type NewsInput = z.infer<typeof newsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
