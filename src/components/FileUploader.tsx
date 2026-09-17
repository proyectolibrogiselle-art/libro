'use client';

import React, { useState } from 'react';

interface FileUploaderProps {
  bucket: 'autores' | 'noticias' | 'galeria' | 'book-covers';
  label: string;
  value?: string;
  onUploaded: (url: string) => void;
}

export function FileUploader({ bucket, label, value, onUploaded }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      setPreview(data.url);
      onUploaded(data.url);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        {label} (Bucket: <code>{bucket}</code>)
      </label>

      <div
        style={{
          border: '1px dashed var(--border-accent)',
          borderRadius: 'var(--radius-sm)',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />

        {uploading ? (
          <p style={{ color: 'var(--accent-gold)' }}>⏳ Subiendo archivo a Supabase Storage...</p>
        ) : preview ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
            />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>✓ Imagen cargada</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {preview}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textDecoration: 'underline' }}>
                Clic para cambiar
              </span>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '4px' }}>
              Arrastra una imagen o haz clic para seleccionar
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              PNG, JPG, WEBP hasta 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
