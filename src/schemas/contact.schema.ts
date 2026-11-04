import { z } from 'zod';

export const contactSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(100, { message: 'El nombre no puede exceder los 100 caracteres' }),
  correo: z
    .string({ required_error: 'El correo electrónico es obligatorio' })
    .trim()
    .email({ message: 'Ingrese una dirección de correo válida' })
    .max(150, { message: 'El correo no puede exceder los 150 caracteres' }),
  mensaje: z
    .string({ required_error: 'El mensaje es obligatorio' })
    .trim()
    .min(10, { message: 'El mensaje debe contener al menos 10 caracteres' })
    .max(500, { message: 'El mensaje no puede exceder los 500 caracteres' }),
  // Token de verificación de Cloudflare Turnstile
  turnstileToken: z
    .string({ required_error: 'La verificación de seguridad es obligatoria' })
    .min(1, { message: 'Complete la verificación de seguridad' }),
  // Campo Honeypot para neutralizar bots automatizados
  website_hp: z
    .string()
    .max(0, { message: 'Envío no autorizado' })
    .optional()
    .or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactSchema>;
