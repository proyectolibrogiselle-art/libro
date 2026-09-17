'use client';

import React, { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';

type ModuleTab = 'books' | 'autores' | 'noticias' | 'eventos' | 'galeria' | 'club_lectura';

export default function AntigravityAdminPanel() {
  const [activeTab, setActiveTab] = useState<ModuleTab>('books');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados de formularios para cada módulo
  const [bookForm, setBookForm] = useState({
    title: '',
    slug: '',
    synopsis: '',
    status: 'draft',
    cover_url: '',
  });

  const [authorForm, setAuthorForm] = useState({
    name: 'Carmen Ibáñez',
    bio_short: '',
    bio_long: '',
    profile_image_url: '',
    twitter_url: '',
    instagram_url: '',
    facebook_url: '',
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    slug: '',
    content: '',
    image_url: '',
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    registration_url: '',
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'Inspiración',
  });

  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    status: 'active',
    external_link: '',
    book_id: '',
  });

  const handleSubmit = async (module: ModuleTab, payload: any) => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/admin/${module}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al guardar registro');
      }

      setStatusMessage({
        type: 'success',
        text: `Registro guardado exitosamente en el módulo [${module.toUpperCase()}].`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Error de validación o base de datos: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: ModuleTab; label: string; icon: string }[] = [
    { id: 'books', label: 'Libros (Subdominios)', icon: '📖' },
    { id: 'autores', label: 'Autores & Bio', icon: '✍️' },
    { id: 'noticias', label: 'Noticias & Prensa', icon: '📰' },
    { id: 'eventos', label: 'Eventos & Firmas', icon: '🗓️' },
    { id: 'galeria', label: 'Galería Visual', icon: '🖼️' },
    { id: 'club_lectura', label: 'Club de Lectura', icon: '👥' },
  ];

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    marginBottom: '16px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px 80px' }}>
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <div>
          <div className="gold-badge" style={{ marginBottom: '8px' }}>
            Antigravity Native CMS
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 600 }}>Panel de Control Headless</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Gestión sincronizada con Supabase (ID: <code>zflljndvanqcnfcpciqb</code>)
          </p>
        </div>
        <a href="/" className="btn-secondary" style={{ fontSize: '0.85rem' }}>
          ← Ver Web Pública
        </a>
      </div>

      {/* Alerta de Feedback */}
      {statusMessage && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            backgroundColor: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: statusMessage.type === 'success' ? '#10b981' : '#ef4444',
            fontSize: '0.95rem',
          }}
        >
          {statusMessage.type === 'success' ? '✓ ' : '⚠️ '} {statusMessage.text}
        </div>
      )}

      {/* Navegación por Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setStatusMessage(null);
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              border: activeTab === tab.id ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
              background: activeTab === tab.id ? 'var(--accent-gold-glow)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Contenedor del Formulario Activo */}
      <div className="glass-panel" style={{ padding: '36px' }}>
        {/* TAB 1: LIBROS */}
        {activeTab === 'books' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('books', bookForm);
            }}
          >
            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Registrar Nueva Obra / Libro</h2>

            <label style={labelStyle}>Título de la Obra *</label>
            <input
              type="text"
              required
              placeholder="Ej: Giselle"
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Slug de Subdominio (RFC 1123) *</label>
            <input
              type="text"
              required
              placeholder="Ej: giselle (resolverá a giselle.carmenibanez.cl)"
              value={bookForm.slug}
              onChange={(e) => setBookForm({ ...bookForm, slug: e.target.value.toLowerCase().trim() })}
              style={inputStyle}
            />

            <label style={labelStyle}>Sinopsis (Rich Text) *</label>
            <textarea
              required
              rows={4}
              placeholder="Escribe la sinopsis del libro..."
              value={bookForm.synopsis}
              onChange={(e) => setBookForm({ ...bookForm, synopsis: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <label style={labelStyle}>Estado Editorial</label>
            <select
              value={bookForm.status}
              onChange={(e) => setBookForm({ ...bookForm, status: e.target.value })}
              style={inputStyle}
            >
              <option value="draft">Borrador (Draft)</option>
              <option value="writing">En Escritura (Writing)</option>
              <option value="published">Publicado (Published)</option>
            </select>

            <FileUploader
              bucket="book-covers"
              label="Portada del Libro"
              value={bookForm.cover_url}
              onUploaded={(url) => setBookForm({ ...bookForm, cover_url: url })}
            />

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%' }}>
              {loading ? 'Guardando en Supabase...' : 'Publicar Obra en Antigravity'}
            </button>
          </form>
        )}

        {/* TAB 2: AUTORES */}
        {activeTab === 'autores' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('autores', authorForm);
            }}
          >
            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Perfil de Autor / Biografía</h2>

            <label style={labelStyle}>Nombre Completo *</label>
            <input
              type="text"
              required
              value={authorForm.name}
              onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Biografía Corta (Extracto)</label>
            <textarea
              rows={2}
              placeholder="Breve presentación para encabezados..."
              value={authorForm.bio_short}
              onChange={(e) => setAuthorForm({ ...authorForm, bio_short: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <label style={labelStyle}>Biografía Completa (Rich Text)</label>
            <textarea
              rows={5}
              placeholder="Trayectoria literaria completa..."
              value={authorForm.bio_long}
              onChange={(e) => setAuthorForm({ ...authorForm, bio_long: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={authorForm.instagram_url}
                  onChange={(e) => setAuthorForm({ ...authorForm, instagram_url: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Twitter / X URL</label>
                <input
                  type="url"
                  placeholder="https://x.com/..."
                  value={authorForm.twitter_url}
                  onChange={(e) => setAuthorForm({ ...authorForm, twitter_url: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Facebook URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={authorForm.facebook_url}
                  onChange={(e) => setAuthorForm({ ...authorForm, facebook_url: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <FileUploader
              bucket="autores"
              label="Foto de Perfil Oficial"
              value={authorForm.profile_image_url}
              onUploaded={(url) => setAuthorForm({ ...authorForm, profile_image_url: url })}
            />

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%' }}>
              {loading ? 'Actualizando...' : 'Guardar Perfil de Autor'}
            </button>
          </form>
        )}

        {/* TAB 3: NOTICIAS */}
        {activeTab === 'noticias' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('noticias', newsForm);
            }}
          >
            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Nueva Noticia o Comunicado</h2>

            <label style={labelStyle}>Titular de la Noticia *</label>
            <input
              type="text"
              required
              placeholder="Ej: Carmen Ibáñez presenta su nueva edición en la Feria del Libro"
              value={newsForm.title}
              onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Slug de la Noticia (URL) *</label>
            <input
              type="text"
              required
              placeholder="presentacion-feria-libro"
              value={newsForm.slug}
              onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value.toLowerCase().trim() })}
              style={inputStyle}
            />

            <label style={labelStyle}>Cuerpo de la Noticia (Rich Text) *</label>
            <textarea
              required
              rows={6}
              placeholder="Contenido redactado..."
              value={newsForm.content}
              onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <FileUploader
              bucket="noticias"
              label="Imagen Destacada de la Noticia"
              value={newsForm.image_url}
              onUploaded={(url) => setNewsForm({ ...newsForm, image_url: url })}
            />

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%' }}>
              {loading ? 'Publicando...' : 'Publicar Noticia'}
            </button>
          </form>
        )}

        {/* TAB 4: EVENTOS */}
        {activeTab === 'eventos' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('eventos', eventForm);
            }}
          >
            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Agendar Evento / Firma de Libros</h2>

            <label style={labelStyle}>Título del Evento *</label>
            <input
              type="text"
              required
              placeholder="Firma de Ejemplares y Conversatorio"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              style={inputStyle}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  required
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Ubicación / Sala *</label>
                <input
                  type="text"
                  required
                  placeholder="Centro Cultural Estación Mapocho"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <label style={labelStyle}>Descripción del Evento *</label>
            <textarea
              required
              rows={3}
              placeholder="Detalles sobre el encuentro..."
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <label style={labelStyle}>Enlace de Registro / Entradas</label>
            <input
              type="url"
              placeholder="https://welcu.com/..."
              value={eventForm.registration_url}
              onChange={(e) => setEventForm({ ...eventForm, registration_url: e.target.value })}
              style={inputStyle}
            />

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%' }}>
              {loading ? 'Agendando...' : 'Guardar Evento'}
            </button>
          </form>
        )}

        {/* TAB 5: GALERÍA */}
        {activeTab === 'galeria' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('galeria', galleryForm);
            }}
          >
            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Subir Imagen a la Galería</h2>

            <label style={labelStyle}>Título de la Ilustración / Fotografía *</label>
            <input
              type="text"
              required
              placeholder="Boceto conceptual del capítulo 3"
              value={galleryForm.title}
              onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Categoría *</label>
            <select
              value={galleryForm.category}
              onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
              style={inputStyle}
            >
              <option value="Inspiración">Inspiración</option>
              <option value="Fanart">Fanart</option>
              <option value="Eventos">Eventos</option>
            </select>

            <label style={labelStyle}>Descripción o Créditos</label>
            <textarea
              rows={2}
              placeholder="Créditos del artista o contexto visual..."
              value={galleryForm.description}
              onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <FileUploader
              bucket="galeria"
              label="Archivo de Imagen *"
              value={galleryForm.image_url}
              onUploaded={(url) => setGalleryForm({ ...galleryForm, image_url: url })}
            />

            <button
              type="submit"
              disabled={loading || !galleryForm.image_url}
              className="btn-gold"
              style={{ width: '100%' }}
            >
              {loading ? 'Guardando en Galería...' : 'Añadir a Galería'}
            </button>
          </form>
        )}

        {/* TAB 6: CLUB DE LECTURA */}
        {activeTab === 'club_lectura' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('club_lectura', clubForm);
            }}
          >
            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Configurar Club de Lectura</h2>

            <label style={labelStyle}>Nombre del Círculo / Club *</label>
            <input
              type="text"
              required
              placeholder="Círculo de Lectores Giselle"
              value={clubForm.name}
              onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Estado</label>
            <select
              value={clubForm.status}
              onChange={(e) => setClubForm({ ...clubForm, status: e.target.value })}
              style={inputStyle}
            >
              <option value="active">Activo (En Lectura)</option>
              <option value="upcoming">Próximo a Iniciar</option>
              <option value="completed">Completado</option>
              <option value="archived">Archivado</option>
            </select>

            <label style={labelStyle}>Descripción y Metodología *</label>
            <textarea
              required
              rows={4}
              placeholder="Sesiones semanales vía Discord/Zoom, cronograma de capítulos..."
              value={clubForm.description}
              onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <label style={labelStyle}>Enlace Externo (Discord, WhatsApp, Telegram, Zoom)</label>
            <input
              type="url"
              placeholder="https://discord.gg/..."
              value={clubForm.external_link}
              onChange={(e) => setClubForm({ ...clubForm, external_link: e.target.value })}
              style={inputStyle}
            />

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%' }}>
              {loading ? 'Creando...' : 'Crear Club de Lectura'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
