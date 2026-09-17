import { z } from 'zod';

export const authorSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(255),
  bio_short: z.string().trim().max(500, 'La biografía corta no puede superar 500 caracteres').nullable().optional(),
  bio_long: z.string().trim().nullable().optional(),
  profile_image_url: z.string().url('URL de imagen inválida').nullable().optional().or(z.literal('')),
  twitter_url: z.string().url('URL de Twitter/X inválida').nullable().optional().or(z.literal('')),
  instagram_url: z.string().url('URL de Instagram inválida').nullable().optional().or(z.literal('')),
  facebook_url: z.string().url('URL de Facebook inválida').nullable().optional().or(z.literal('')),
});

export const updateAuthorSchema = authorSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

export type AuthorInput = z.infer<typeof authorSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>;
