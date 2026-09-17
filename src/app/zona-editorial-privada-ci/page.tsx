'use client';

import React, { useState, useEffect } from 'react';
import { FileUploader } from '@/components/FileUploader';

type ModuleTab = 'books' | 'autores' | 'noticias' | 'eventos' | 'galeria' | 'club_lectura';

export default function AntigravityAdminPanel() {
  // 1. Estado de Autenticación con Credenciales Estrictas
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // 2. Estado del Panel y Módulos
  const [activeTab, setActiveTab] = useState<ModuleTab>('books');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [fetchingRecords, setFetchingRecords] = useState(false);

  // Formularios de Creación
  const [bookForm, setBookForm] = useState({ title: '', slug: '', synopsis: '', status: 'draft', cover_url: '' });
  const [authorForm, setAuthorForm] = useState({ name: 'Carmen Ibáñez', bio_short: '', bio_long: '', profile_image_url: '', twitter_url: '', instagram_url: '', facebook_url: '' });
  const [newsForm, setNewsForm] = useState({ title: '', slug: '', content: '', image_url: '' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', location: '', registration_url: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', image_url: '', category: 'Inspiración' });
  const [clubForm, setClubForm] = useState({ name: '', description: '', status: 'active', external_link: '', book_id: '' });

  // Manejador de Login con Credenciales Estrictas para Presentación
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor, ingresa el correo y la contraseña.');
      return;
    }

    // Validación estricta de credenciales
    if (loginEmail.trim() === 'proyectolibrogiselle@gmail.com' && loginPassword.trim() === '20181860') {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Credenciales de seguridad incorrectas.');
    }
  };

  // Cargar registros del módulo activo desde Supabase
  const loadModuleRecords = async (module: ModuleTab) => {
    setFetchingRecords(true);
    try {
      const res = await fetch(`/api/admin/${module}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data || []);
      }
    } catch (err) {
      console.warn(`Error cargando registros de ${module}:`, err);
    } finally {
      setFetchingRecords(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadModuleRecords(activeTab);
    }
  }, [activeTab, isAuthenticated]);

  // Manejo de envío (Guardar registro)
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
        text: `Registro guardado exitosamente en [${module.toUpperCase()}]. Sincronizado con Supabase.`,
      });

      // Recargar registros actualizados
      loadModuleRecords(module);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Error de validación o base de datos: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar registro
  const handleDelete = async (module: ModuleTab, id: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro permanentemente de Supabase?')) return;

    try {
      const res = await fetch(`/api/admin/${module}?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Registro eliminado con éxito.' });
        loadModuleRecords(module);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error eliminando: ${err.message}` });
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

  // ============================================================================
  // VISTA 1: PANTALLA VISUAL DE LOGIN / INICIO DE SESIÓN CON SEGURIDAD REFORZADA
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '40px', textAlign: 'center' }}>
          <div className="gold-badge" style={{ marginBottom: '16px' }}>
            Acceso Privado &middot; Zona Editorial
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 600 }}>
            Carmen Ibáñez CMS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px' }}>
            Portal Administrativo Headless & Supabase Cloud
          </p>

          {loginError && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444',
                fontSize: '0.88rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ textAlign: 'left', marginBottom: '16px' }}>
              <label style={labelStyle}>Correo de Administrador</label>
              <input
                type="email"
                required
                placeholder="proyectolibrogiselle@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <label style={labelStyle}>Contraseña de Acceso</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button type="submit" className="btn-noir" style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}>
              Ingresar al Panel Privado →
            </button>
          </form>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ← Regresar al sitio público
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VISTA 2: PANEL COMPLETO DE GESTIÓN Y VISUALIZACIÓN DE LOS 6 MÓDULOS
  // ============================================================================
  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px 80px' }}>
      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <div>
          <div className="gold-badge" style={{ marginBottom: '8px' }}>
            Sesión Activa: {loginEmail}
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 600 }}>Zona Editorial Privada</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Infraestructura Cloud: Supabase (<code>zflljndvanqcnfcpciqb</code>) &amp; Subdominios
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/" target="_blank" className="btn-noir-outline" style={{ fontSize: '0.85rem' }}>
            🌐 Ver Web
          </a>
          <button onClick={() => setIsAuthenticated(false)} className="btn-noir-outline" style={{ fontSize: '0.85rem', color: '#ef4444' }}>
            Cerrar Sesión
          </button>
        </div>
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

      {/* Navegación por Tabs (Los 6 Módulos) */}
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
              border: activeTab === tab.id ? '1px solid #121212' : '1px solid var(--border-color)',
              background: activeTab === tab.id ? '#121212' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 1.2fr', gap: '32px', alignItems: 'start' }}>
        {/* COLUMNA 1: FORMULARIO DE ENTRADA CON UPLOADER */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {/* TAB 1: LIBROS */}
          {activeTab === 'books' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('books', bookForm); }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Publicar Nueva Obra</h2>
              <label style={labelStyle}>Título de la Obra *</label>
              <input type="text" required placeholder="Giselle" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} style={inputStyle} />
              
              <label style={labelStyle}>Slug para Subdominio *</label>
              <input type="text" required placeholder="giselle (subdominio)" value={bookForm.slug} onChange={(e) => setBookForm({ ...bookForm, slug: e.target.value.toLowerCase().trim() })} style={inputStyle} />

              <label style={labelStyle}>Sinopsis *</label>
              <textarea rows={3} required value={bookForm.synopsis} onChange={(e) => setBookForm({ ...bookForm, synopsis: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <label style={labelStyle}>Estado</label>
              <select value={bookForm.status} onChange={(e) => setBookForm({ ...bookForm, status: e.target.value })} style={inputStyle}>
                <option value="draft">Borrador</option>
                <option value="writing">En Escritura</option>
                <option value="published">Publicado</option>
              </select>

              <FileUploader bucket="book-covers" label="Portada del Libro" value={bookForm.cover_url} onUploaded={(url) => setBookForm({ ...bookForm, cover_url: url })} />
              <button type="submit" disabled={loading} className="btn-noir" style={{ width: '100%' }}>{loading ? 'Guardando...' : 'Guardar Libro'}</button>
            </form>
          )}

          {/* TAB 2: AUTORES */}
          {activeTab === 'autores' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('autores', authorForm); }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Perfil de Autora</h2>
              <label style={labelStyle}>Nombre *</label>
              <input type="text" required value={authorForm.name} onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Biografía Corta</label>
              <textarea rows={2} value={authorForm.bio_short} onChange={(e) => setAuthorForm({ ...authorForm, bio_short: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <label style={labelStyle}>Biografía Extendida</label>
              <textarea rows={4} value={authorForm.bio_long} onChange={(e) => setAuthorForm({ ...authorForm, bio_long: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <FileUploader bucket="autores" label="Foto de Perfil" value={authorForm.profile_image_url} onUploaded={(url) => setAuthorForm({ ...authorForm, profile_image_url: url })} />
              <button type="submit" disabled={loading} className="btn-noir" style={{ width: '100%' }}>{loading ? 'Guardando...' : 'Actualizar Biografía'}</button>
            </form>
          )}

          {/* TAB 3: NOTICIAS */}
          {activeTab === 'noticias' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('noticias', newsForm); }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Nueva Noticia</h2>
              <label style={labelStyle}>Titular *</label>
              <input type="text" required placeholder="Lanzamiento oficial..." value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Slug *</label>
              <input type="text" required placeholder="lanzamiento-oficial" value={newsForm.slug} onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value.toLowerCase().trim() })} style={inputStyle} />

              <label style={labelStyle}>Contenido (Rich Text) *</label>
              <textarea rows={4} required value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <FileUploader bucket="noticias" label="Imagen de Noticia" value={newsForm.image_url} onUploaded={(url) => setNewsForm({ ...newsForm, image_url: url })} />
              <button type="submit" disabled={loading} className="btn-noir" style={{ width: '100%' }}>{loading ? 'Publicando...' : 'Publicar Noticia'}</button>
            </form>
          )}

          {/* TAB 4: EVENTOS */}
          {activeTab === 'eventos' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('eventos', eventForm); }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Agendar Evento</h2>
              <label style={labelStyle}>Título del Evento *</label>
              <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Fecha y Hora *</label>
              <input type="datetime-local" required value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Ubicación *</label>
              <input type="text" required value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Descripción *</label>
              <textarea rows={3} required value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <button type="submit" disabled={loading} className="btn-noir" style={{ width: '100%' }}>{loading ? 'Agendando...' : 'Guardar Evento'}</button>
            </form>
          )}

          {/* TAB 5: GALERÍA */}
          {activeTab === 'galeria' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('galeria', galleryForm); }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Añadir a Galería</h2>
              <label style={labelStyle}>Título *</label>
              <input type="text" required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Categoría *</label>
              <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} style={inputStyle}>
                <option value="Inspiración">Inspiración</option>
                <option value="Fanart">Fanart</option>
                <option value="Eventos">Eventos</option>
              </select>

              <FileUploader bucket="galeria" label="Archivo de Imagen" value={galleryForm.image_url} onUploaded={(url) => setGalleryForm({ ...galleryForm, image_url: url })} />
              <button type="submit" disabled={loading || !galleryForm.image_url} className="btn-noir" style={{ width: '100%' }}>{loading ? 'Subiendo...' : 'Añadir a Galería'}</button>
            </form>
          )}

          {/* TAB 6: CLUB DE LECTURA */}
          {activeTab === 'club_lectura' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('club_lectura', clubForm); }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Nuevo Club de Lectura</h2>
              <label style={labelStyle}>Nombre del Club *</label>
              <input type="text" required value={clubForm.name} onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Descripción *</label>
              <textarea rows={3} required value={clubForm.description} onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <label style={labelStyle}>Enlace Externo (Discord / Zoom)</label>
              <input type="url" placeholder="https://..." value={clubForm.external_link} onChange={(e) => setClubForm({ ...clubForm, external_link: e.target.value })} style={inputStyle} />

              <button type="submit" disabled={loading} className="btn-noir" style={{ width: '100%' }}>{loading ? 'Creando...' : 'Crear Club'}</button>
            </form>
          )}
        </div>

        {/* COLUMNA 2: VISUALIZACIÓN DE REGISTROS EN TIEMPO REAL (SUPABASE) */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem' }}>Registros Almacenados en Supabase</h3>
            <button onClick={() => loadModuleRecords(activeTab)} className="btn-noir-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              🔄 Refrescar
            </button>
          </div>

          {fetchingRecords ? (
            <p style={{ color: '#121212', fontWeight: 500 }}>Cargando registros de Supabase...</p>
          ) : records.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
              No hay registros creados aún en este módulo. Usa el formulario de la izquierda para ingresar el primero.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '600px', overflowY: 'auto' }}>
              {records.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    {(item.cover_url || item.image_url || item.profile_image_url) && (
                      <img
                        src={item.cover_url || item.image_url || item.profile_image_url}
                        alt="Thumbnail"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>{item.title || item.name}</h4>
                      {item.slug && <span style={{ fontSize: '0.75rem', color: '#121212', fontWeight: 600 }}>Subdominio: {item.slug}</span>}
                      {item.category && <span className="luxury-badge" style={{ fontSize: '0.65rem', marginLeft: '6px' }}>{item.category}</span>}
                      {item.status && <span style={{ fontSize: '0.75rem', color: '#10b981', marginLeft: '8px' }}>• {item.status}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(activeTab, item.id)}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
