import { z } from 'zod';

export const BOOK_CLUB_STATUSES = ['active', 'completed', 'upcoming', 'archived'] as const;

export const bookClubSchema = z.object({
  book_id: z.string().uuid('ID de libro inválido').nullable().optional().or(z.literal('')),
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres').max(255),
  description: z.string().trim().min(5, 'La descripción es obligatoria'),
  status: z.enum(BOOK_CLUB_STATUSES, {
    errorMap: () => ({ message: 'Estado inválido' }),
  }).default('active'),
  external_link: z.string().url('Enlace externo inválido').nullable().optional().or(z.literal('')),
});

export const updateBookClubSchema = bookClubSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

export type BookClubInput = z.infer<typeof bookClubSchema>;
export type UpdateBookClubInput = z.infer<typeof updateBookClubSchema>;
