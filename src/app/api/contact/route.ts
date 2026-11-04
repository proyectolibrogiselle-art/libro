import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/schemas/contact.schema';

// Estructura de Rate Limiting en memoria (Límite: 5 envíos por cada 10 minutos por IP)
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { timestamps: [now] });
    return false;
  }

  // Filtrar marcas de tiempo fuera de la ventana
  const recentTimestamps = record.timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, { timestamps: recentTimestamps });
    return true;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, { timestamps: recentTimestamps });
  return false;
}

// Limpieza periódica cada 15 minutos para evitar saturación de memoria
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    const valid = record.timestamps.filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, { timestamps: valid });
    }
  }
}, 15 * 60 * 1000);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtmlEmail(data: {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}): string {
  const safeNombre = escapeHtml(data.nombre);
  const safeCorreo = escapeHtml(data.correo);
  const safeAsunto = escapeHtml(data.asunto);
  const safeMensaje = escapeHtml(data.mensaje).replace(/\n/g, '<br/>');
  const fechaChile = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Mensaje desde carmenibanez.cl</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0E2223; margin: 0; padding: 24px; color: #FAF7F2; }
        .card { max-width: 620px; margin: 0 auto; background-color: #173B3C; border-radius: 12px; border: 1px solid rgba(184, 176, 156, 0.35); overflow: hidden; box-shadow: 0 16px 36px rgba(0,0,0,0.4); }
        .header { background: linear-gradient(135deg, #112F30 0%, #173B3C 100%); padding: 32px 32px 24px; border-bottom: 2px solid #A9785C; }
        .header h1 { margin: 0 0 6px; font-size: 22px; color: #E1D4BC; font-weight: 600; letter-spacing: 0.04em; }
        .header p { margin: 0; font-size: 13px; color: #B9AE9B; }
        .body { padding: 32px; }
        .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .meta-table td { padding: 8px 0; font-size: 14px; border-bottom: 1px solid rgba(184, 176, 156, 0.15); }
        .meta-label { width: 120px; color: #A9785C; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; }
        .meta-value { color: #FAF7F2; }
        .meta-value a { color: #E1D4BC; text-decoration: underline; }
        .message-box { background-color: #214C4B; border-left: 3px solid #A9785C; padding: 20px; border-radius: 6px; font-size: 15px; line-height: 1.7; color: #FAF7F2; white-space: normal; }
        .footer { padding: 20px 32px; background-color: #112F30; border-top: 1px solid rgba(184, 176, 156, 0.2); font-size: 12px; color: #8E8676; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Carmen Ibáñez · Correspondencia</h1>
          <p>Nuevo mensaje recibido desde el formulario público de carmenibanez.cl</p>
        </div>
        <div class="body">
          <table class="meta-table">
            <tr>
              <td class="meta-label">Remitente:</td>
              <td class="meta-value"><strong>${safeNombre}</strong></td>
            </tr>
            <tr>
              <td class="meta-label">Correo:</td>
              <td class="meta-value"><a href="mailto:${safeCorreo}">${safeCorreo}</a></td>
            </tr>
            <tr>
              <td class="meta-label">Asunto:</td>
              <td class="meta-value"><strong>${safeAsunto}</strong></td>
            </tr>
            <tr>
              <td class="meta-label">Fecha:</td>
              <td class="meta-value">${fechaChile}</td>
            </tr>
          </table>

          <div style="margin-bottom: 10px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #A9785C;">
            Contenido del mensaje:
          </div>
          <div class="message-box">
            ${safeMensaje}
          </div>
        </div>
        <div class="footer">
          Puedes responder directamente a este correo para comunicarte con ${safeNombre}.<br/>
          Identificador de seguridad y trazabilidad: carmenibanez.cl/contact
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Obtener IP y aplicar Rate Limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'anonymous-ip');

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ha enviado varias solicitudes recientemente. Por favor, espere unos minutos antes de intentar de nuevo.',
        },
        { status: 429 }
      );
    }

    // 2. Extracción segura del cuerpo
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Cuerpo de solicitud inválido o con formato erróneo.' },
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

    const { nombre, correo, asunto, mensaje, website_hp } = parseResult.data;

    // 4. Protección contra bots: Honeypot
    if (website_hp && website_hp.length > 0) {
      // Bloqueo silencioso: simula respuesta positiva para neutralizar reintentos automatizados
      console.warn(`[Contact API] Solicitud bloqueada por Honeypot desde IP: ${clientIp}`);
      return NextResponse.json({
        success: true,
        message: 'Su mensaje ha sido recibido exitosamente.',
      });
    }

    // 5. Configuración del servicio transaccional (Resend)
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'contacto@carmenibanez.cl';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Carmen Ibáñez <contacto@carmenibanez.cl>';

    if (!resendApiKey) {
      console.error(
        '[Contact API] Variable RESEND_API_KEY no configurada en las variables de entorno del servidor.'
      );
      return NextResponse.json(
        {
          success: false,
          message:
            'El servicio de correspondencia directa se encuentra en proceso de configuración técnica. Por favor, escriba directamente a contacto@carmenibanez.cl.',
        },
        { status: 503 }
      );
    }

    // 6. Envío del correo transaccional vía Resend REST API
    const plainText = `Nuevo mensaje desde carmenibanez.cl\n\nRemitente: ${nombre}\nCorreo: ${correo}\nAsunto: ${asunto}\n\nMensaje:\n${mensaje}\n`;
    const htmlContent = buildHtmlEmail({ nombre, correo, asunto, mensaje });

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: correo,
        subject: `[carmenibanez.cl] ${asunto}`,
        text: plainText,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({}));
      console.error('[Contact API] Error de envío en proveedor Resend:', {
        status: resendResponse.status,
        error: errorData,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            'No fue posible transmitir su mensaje en este momento. Por favor intente más tarde o escríbanos directamente a contacto@carmenibanez.cl.',
        },
        { status: 502 }
      );
    }

    const resendResult = await resendResponse.json().catch(() => ({}));
    console.info(`[Contact API] Mensaje enviado exitosamente. ID: ${resendResult.id || 'N/A'}`);

    return NextResponse.json(
      {
        success: true,
        message: '¡Gracias por su mensaje! Ha sido enviado exitosamente a la autora.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Contact API] Error interno no controlado:', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message:
          'Ocurrió un inconveniente al procesar su solicitud. Por favor intente más tarde o comuníquese a contacto@carmenibanez.cl.',
      },
      { status: 500 }
    );
  }
}
