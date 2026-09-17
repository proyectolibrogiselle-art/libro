import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().trim().min(3, 'El título del evento debe tener al menos 3 caracteres').max(255),
  description: z.string().trim().min(5, 'La descripción es obligatoria'),
  event_date: z.string({ required_error: 'La fecha del evento es obligatoria' }),
  location: z.string().trim().min(2, 'La ubicación es obligatoria'),
  registration_url: z.string().url('URL de registro inválida').nullable().optional().or(z.literal('')),
});

export const updateEventSchema = eventSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
});

export type EventInput = z.infer<typeof eventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
