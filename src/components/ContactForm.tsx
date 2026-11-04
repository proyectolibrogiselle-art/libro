'use client';

import React, { useState } from 'react';
import { ArrowRightIcon, CheckIcon, SpinnerIcon } from '@/components/Icons';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: '',
    website_hp: '', // Honeypot antispam
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

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
    setStatus('loading');
    setMessage('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setStatus('error');
        setMessage(
          data.message ||
            'Ocurrió un error al enviar el mensaje. Por favor intente más tarde o escríbanos directamente a contacto@carmenibanez.cl.'
        );
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        return;
      }

      setStatus('success');
      setMessage(data.message || 'Su mensaje ha sido enviado exitosamente.');
      setFormData({
        nombre: '',
        correo: '',
        asunto: '',
        mensaje: '',
        website_hp: '',
      });
    } catch {
      setStatus('error');
      setMessage(
        'Inconveniente de conexión temporal. Por favor intente de nuevo o comuníquese a contacto@carmenibanez.cl.'
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setMessage('');
    setFieldErrors({});
  };

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
          Mensaje Recibido
        </h3>

        <p
          className="montserrat-body"
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {message}
        </p>

        <p
          className="serif-delicate"
          style={{
            fontSize: '0.95rem',
            fontStyle: 'italic',
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          La correspondencia es revisada periódicamente y recibirá respuesta a su correo electrónico.
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="btn-platinum-outline"
          style={{ marginTop: '12px', fontSize: '0.9rem' }}
        >
          <span>Enviar otro mensaje</span>
        </button>
      </div>
    );
  }

  const isLoading = status === 'loading';

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

      {/* Asunto */}
      <div>
        <label
          htmlFor="asunto"
          className="montserrat-body"
          style={{
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Asunto
        </label>
        <input
          type="text"
          id="asunto"
          name="asunto"
          required
          disabled={isLoading}
          value={formData.asunto}
          onChange={handleChange}
          placeholder="Consulta editorial / Invitación / Correspondencia"
          style={{
            width: '100%',
            padding: '13px 16px',
            borderRadius: '6px',
            border: fieldErrors.asunto
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
        {fieldErrors.asunto && (
          <span
            style={{
              fontSize: '0.78rem',
              color: 'var(--accent-copper)',
              marginTop: '4px',
              display: 'block',
            }}
          >
            {fieldErrors.asunto[0]}
          </span>
        )}
      </div>

      {/* Mensaje */}
      <div>
        <label
          htmlFor="mensaje"
          className="montserrat-body"
          style={{
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          disabled={isLoading}
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="Escriba su mensaje aquí..."
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

      {/* Botón de Envío */}
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
            <span>Enviando mensaje...</span>
          </>
        ) : (
          <>
            <span>Enviar mensaje</span>
            <ArrowRightIcon size={16} />
          </>
        )}
      </button>
    </form>
  );
}
