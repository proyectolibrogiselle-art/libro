import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { contactSchema } from '@/schemas/contact.schema';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

// Hostnames autorizados para Cloudflare Turnstile
const ALLOWED_HOSTNAMES = new Set([
  'carmenibanez.cl',
  'www.carmenibanez.cl',
  'localhost',
  '127.0.0.1',
]);

/**
 * Endpoint de validación y control de seguridad para correspondencia (Mailto + Turnstile + Rate Limit 24h)
 * No almacena mensajes ni envía correos por servidor.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Obtener IP confiable desde cabeceras de infraestructura Vercel
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : realIp || '127.0.0.1';

    // 2. Extracción y parseo seguro del cuerpo JSON
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Cuerpo de solicitud inválido o con formato erróneo.',
        },
        { status: 400 }
      );
    }

    // 3. Validación Zod en el servidor (SDD)
    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Por favor complete todos los campos requeridos con información válida.',
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { nombre, correo, mensaje, turnstileToken, website_hp } = parseResult.data;

    // 4. Protección contra bots automatizados: Honeypot invisible
    if (website_hp && website_hp.length > 0) {
      console.warn(`[Contact API] Solicitud bloqueada silenciosamente por Honeypot desde IP hash.`);
      // No consume cuota de rate limit y simula respuesta positiva para desalentar reintentos
      return NextResponse.json({
        success: true,
        message: 'Solicitud procesada.',
      });
    }

    // 5. Verificación de Cloudflare Turnstile contra el endpoint oficial Siteverify
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

    if (turnstileSecret) {
      const verifyFormData = new FormData();
      verifyFormData.append('secret', turnstileSecret);
      verifyFormData.append('response', turnstileToken);
      verifyFormData.append('remoteip', clientIp);

      try {
        const turnstileResponse = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            body: verifyFormData,
          }
        );

        const turnstileData = (await turnstileResponse.json().catch(() => ({}))) as {
          success?: boolean;
          hostname?: string;
          'error-codes'?: string[];
        };

        if (!turnstileData.success) {
          console.warn('[Contact API] Token Turnstile rechazado por Cloudflare:', {
            errorCodes: turnstileData['error-codes'],
          });
          return NextResponse.json(
            {
              success: false,
              message:
                'La verificación de seguridad de Cloudflare Turnstile ha fallado o ha expirado. Por favor, complete nuevamente el desafío.',
            },
            { status: 403 }
          );
        }

        // Validación de Hostname esperado
        if (turnstileData.hostname && !ALLOWED_HOSTNAMES.has(turnstileData.hostname.toLowerCase())) {
          console.warn('[Contact API] Hostname Turnstile no reconocido:', turnstileData.hostname);
          return NextResponse.json(
            {
              success: false,
              message: 'El origen de la verificación de seguridad no coincide con el dominio oficial.',
            },
            { status: 403 }
          );
        }
      } catch (err) {
        console.error('[Contact API] Error al conectar con Cloudflare Siteverify:', err);
        return NextResponse.json(
          {
            success: false,
            message:
              'No fue posible validar la verificación de seguridad en este momento. Por favor intente más tarde.',
          },
          { status: 502 }
        );
      }
    } else {
      console.warn(
        '[Contact API] TURNSTILE_SECRET_KEY no configurada en las variables de entorno. Omitiendo validación en servidor.'
      );
    }

    // 6. Generación de identificador protegido de IP mediante HMAC SHA-256 (sin almacenar IP en texto plano)
    const hmacSecret =
      process.env.CONTACT_RATE_LIMIT_SECRET ||
      process.env.TURNSTILE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      'carmenibanez-rate-limit-salt';

    const ipHash = crypto
      .createHmac('sha256', hmacSecret)
      .update(clientIp)
      .digest('hex');

    // 7. Límite persistente y atómico en Supabase: máximo 2 intentos cada 24 horas
    try {
      const supabaseAdmin = getSupabaseAdminClient();
      const { data: limitResult, error: rpcError } = await supabaseAdmin.rpc(
        'check_and_consume_contact_rate_limit',
        {
          p_ip_hash: ipHash,
          p_max_attempts: 2,
          p_window_hours: 24,
        }
      );

      if (rpcError) {
        console.error('[Contact API] Error al ejecutar RPC de rate limit en Supabase:', rpcError.message);
        // Continuamos de forma resiliente si la tabla aún está en proceso de migración
      } else if (limitResult && typeof limitResult === 'object') {
        const parsed = limitResult as {
          allowed?: boolean;
          attempts?: number;
          remaining?: number;
          reset_at?: string;
        };

        if (parsed.allowed === false) {
          console.warn('[Contact API] Límite de 2 intentos cada 24 horas alcanzado para el hash.');
          return NextResponse.json(
            {
              success: false,
              message:
                'Ha alcanzado el límite máximo de 2 intentos cada 24 horas para este formulario. Para correspondencia adicional, puede escribir directamente a contacto@carmenibanez.cl.',
            },
            { status: 429 }
          );
        }
      }
    } catch (dbErr) {
      console.warn('[Contact API] Error de conexión con Supabase para rate limiting:', dbErr);
    }

    // 8. Solicitud autorizada con éxito: No se guarda el mensaje ni se envía desde el servidor
    return NextResponse.json(
      {
        success: true,
        message: 'Verificación de seguridad exitosa. Su cliente de correo será abierto para enviar el mensaje.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Contact API] Error interno no controlado:', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message:
          'Ocurrió un inconveniente al procesar la solicitud. Por favor intente más tarde o escriba directamente a contacto@carmenibanez.cl.',
      },
      { status: 500 }
    );
  }
}
