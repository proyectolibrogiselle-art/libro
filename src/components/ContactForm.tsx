'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckIcon, SpinnerIcon } from '@/components/Icons';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const DEST_EMAIL = 'contacto@carmenibanez.cl';
const MAX_MESSAGE_LENGTH = 500;

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    mensaje: '',
    website_hp: '', // Honeypot invisible
  });

  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [lastMailtoUrl, setLastMailtoUrl] = useState<string>('');

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAAxxxxxxxxxxxxxx';

  // Carga y montaje del widget de Cloudflare Turnstile
  useEffect(() => {
    let script = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null;

    const renderWidget = () => {
      if (
        window.turnstile &&
        turnstileContainerRef.current &&
        !widgetIdRef.current
      ) {
        try {
          const id = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            theme: 'dark',
            callback: (token: string) => {
              setTurnstileToken(token);
              if (fieldErrors.turnstileToken) {
                setFieldErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.turnstileToken;
                  return copy;
                });
              }
            },
            'expired-callback': () => {
              setTurnstileToken('');
            },
            'error-callback': () => {
              setTurnstileToken('');
            },
          });
          widgetIdRef.current = id;
        } catch (e) {
          console.warn('[Turnstile] Error al inicializar widget:', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderWidget();
      };
      document.body.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Limpieza silenciosa
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({});

    // Validar Turnstile antes de enviar al servidor
    if (!turnstileToken) {
      setStatus('error');
      setMessage('Por favor, complete la verificación de seguridad de Cloudflare antes de continuar.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setStatus('error');
        setMessage(
          data.message ||
            'No fue posible autorizar la solicitud. Por favor verifique los datos o escriba directamente a contacto@carmenibanez.cl.'
        );
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        // Reiniciar Turnstile para permitir reintentar con un nuevo token
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
          setTurnstileToken('');
        }
        return;
      }

      // Preparación y codificación segura del mailto:
      const cleanNombre = formData.nombre.trim();
      const cleanCorreo = formData.correo.trim();
      const cleanMensaje = formData.mensaje.trim();

      const mailSubject = `[carmenibanez.cl] Contacto de ${cleanNombre}`;
      const mailBody = `Nombre: ${cleanNombre}\nCorreo: ${cleanCorreo}\n\nMensaje:\n${cleanMensaje}\n\n---\nCorrespondencia enviada desde carmenibanez.cl`;

      const mailtoUrl = `mailto:${DEST_EMAIL}?subject=${encodeURIComponent(
        mailSubject
      )}&body=${encodeURIComponent(mailBody)}`;

      setLastMailtoUrl(mailtoUrl);
      setStatus('success');

      // Abrir el cliente de correo del visitante
      window.location.href = mailtoUrl;
    } catch {
      setStatus('error');
      setMessage(
        'Inconveniente temporal de conexión. Por favor intente de nuevo o escriba a contacto@carmenibanez.cl.'
      );
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken('');
      }
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setMessage('');
    setFieldErrors({});
    setFormData({
      nombre: '',
      correo: '',
      mensaje: '',
      website_hp: '',
    });
    setTurnstileToken('');
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  // Pantalla de confirmación tras generar el correo
  if (status === 'success') {
    return (
      <div
        className="petrol-card"
        style={{
          padding: '48px 36px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
        role="alert"
        aria-live="polite"
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-copper-light)',
            border: '1.5px solid var(--accent-copper)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-copper)',
          }}
        >
          <CheckIcon size={28} />
        </div>

        <h3
          className="cinzel-heading"
          style={{
            fontSize: '1.4rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          Borrador de Correo Preparado
        </h3>

        <p
          className="montserrat-body"
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            lineHeight: 1.85,
            margin: 0,
          }}
        >
          Se ha abierto su programa de correo electrónico predeterminado con los datos de su mensaje completados.
        </p>

        <div
          style={{
            padding: '16px 20px',
            borderRadius: '8px',
            backgroundColor: 'rgba(169, 120, 92, 0.14)',
            border: '1px solid var(--border-copper)',
            maxWidth: '540px',
            margin: '4px 0',
          }}
        >
          <p
            className="montserrat-body"
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <strong>Paso final obligatorio:</strong> Por favor, pulse <strong>«Enviar»</strong> dentro de su programa de correo para que el mensaje llegue a <em>contacto@carmenibanez.cl</em>.
          </p>
        </div>

        {lastMailtoUrl && (
          <a
            href={lastMailtoUrl}
            className="montserrat-body"
            style={{
              fontSize: '0.86rem',
              color: 'var(--accent-copper)',
              textDecoration: 'underline',
              marginTop: '4px',
            }}
          >
            ¿No se abrió su programa de correo? Pulse aquí para abrirlo nuevamente
          </a>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="btn-platinum-outline"
          style={{ marginTop: '14px', fontSize: '0.9rem' }}
        >
          <span>Preparar otro mensaje</span>
        </button>
      </div>
    );
  }

  const isLoading = status === 'loading';
  const remainingChars = MAX_MESSAGE_LENGTH - formData.mensaje.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="petrol-card"
      noValidate
      aria-busy={isLoading}
      style={{
        padding: '44px 38px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
      }}
    >
      {/* Campo Honeypot Oculto (Antispam) */}
      <div
        style={{
          display: 'none',
          visibility: 'hidden',
          position: 'absolute',
          left: '-9999px',
        }}
        aria-hidden="true"
      >
        <label htmlFor="website_hp">No complete este campo</label>
        <input
          type="text"
          id="website_hp"
          name="website_hp"
          value={formData.website_hp}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Alerta de Error Visible */}
      {status === 'error' && message && (
        <div
          role="alert"
          style={{
            padding: '14px 18px',
            borderRadius: '6px',
            backgroundColor: 'rgba(169, 120, 92, 0.16)',
            border: '1px solid var(--accent-copper)',
            color: '#FAF7F2',
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--accent-copper)' }}>Aviso: </span>
          {message}
        </div>
      )}

      {/* Grid de Nombre y Correo */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        <div>
          <label
            htmlFor="nombre"
            className="montserrat-body"
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Nombre completo
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            disabled={isLoading}
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Su nombre"
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: '6px',
              border: fieldErrors.nombre
                ? '1px solid var(--accent-copper)'
                : '1px solid var(--border-platinum)',
              fontSize: '0.92rem',
              fontFamily: 'inherit',
              outline: 'none',
              backgroundColor: 'var(--petrol-secondary)',
              color: 'var(--text-primary)',
              opacity: isLoading ? 0.7 : 1,
            }}
          />
          {fieldErrors.nombre && (
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--accent-copper)',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {fieldErrors.nombre[0]}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="correo"
            className="montserrat-body"
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            required
            disabled={isLoading}
            value={formData.correo}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: '6px',
              border: fieldErrors.correo
                ? '1px solid var(--accent-copper)'
                : '1px solid var(--border-platinum)',
              fontSize: '0.92rem',
              fontFamily: 'inherit',
              outline: 'none',
              backgroundColor: 'var(--petrol-secondary)',
              color: 'var(--text-primary)',
              opacity: isLoading ? 0.7 : 1,
            }}
          />
          {fieldErrors.correo && (
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--accent-copper)',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {fieldErrors.correo[0]}
            </span>
          )}
        </div>
      </div>

      {/* Mensaje con Contador de Caracteres (Hasta 500) */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <label
            htmlFor="mensaje"
            className="montserrat-body"
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Mensaje
          </label>
          <span
            className="montserrat-body"
            style={{
              fontSize: '0.76rem',
              color: remainingChars < 0 ? 'var(--accent-copper)' : 'var(--text-muted)',
            }}
          >
            {formData.mensaje.length} / {MAX_MESSAGE_LENGTH} caracteres
          </span>
        </div>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={isLoading}
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="Escriba su mensaje aquí (hasta 500 caracteres)..."
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '6px',
            border: fieldErrors.mensaje
              ? '1px solid var(--accent-copper)'
              : '1px solid var(--border-platinum)',
            fontSize: '0.92rem',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'vertical',
            backgroundColor: 'var(--petrol-secondary)',
            color: 'var(--text-primary)',
            opacity: isLoading ? 0.7 : 1,
          }}
        />
        {fieldErrors.mensaje && (
          <span
            style={{
              fontSize: '0.78rem',
              color: 'var(--accent-copper)',
              marginTop: '4px',
              display: 'block',
            }}
          >
            {fieldErrors.mensaje[0]}
          </span>
        )}
      </div>

      {/* Widget de Cloudflare Turnstile */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div ref={turnstileContainerRef} />
        {fieldErrors.turnstileToken && (
          <span
            style={{
              fontSize: '0.78rem',
              color: 'var(--accent-copper)',
              display: 'block',
            }}
          >
            {fieldErrors.turnstileToken[0]}
          </span>
        )}
      </div>

      {/* Botón de Preparación y Apertura */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-copper"
        style={{
          padding: '15px',
          fontSize: '0.96rem',
          width: '100%',
          marginTop: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.8 : 1,
        }}
      >
        {isLoading ? (
          <>
            <SpinnerIcon size={16} />
            <span>Verificando y preparando correo...</span>
          </>
        ) : (
          <>
            <span>Abrir en mi correo para enviar</span>
            <ArrowRightIcon size={16} />
          </>
        )}
      </button>

      <p
        className="montserrat-body"
        style={{
          fontSize: '0.76rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Límite de seguridad: hasta 2 preparaciones de correo cada 24 horas por visitante. El mensaje se remitirá directamente desde su aplicación de correo a <em>contacto@carmenibanez.cl</em>.
      </p>
    </form>
  );
}
