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

  // Estado para Edición CRUD Completa (MEJORA 1)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formularios de Creación / Edición
  const [bookForm, setBookForm] = useState({ title: '', slug: '', synopsis: '', cover_url: '' });
  const [editorialStatus, setEditorialStatus] = useState<'draft' | 'writing' | 'published'>('draft');
  const [isPublicSwitch, setIsPublicSwitch] = useState(false);
  const [authorForm, setAuthorForm] = useState({ name: 'Carmen Ibáñez', bio_short: '', bio_long: '', profile_image_url: '', twitter_url: '', instagram_url: '', facebook_url: '' });
  const [newsForm, setNewsForm] = useState({ title: '', slug: '', content: '', image_url: '' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', location: '', registration_url: '', image_url: '' });
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

  // Función para Iniciar Edición de un Registro (MEJORA 1)
  const handleStartEdit = (module: ModuleTab, item: any) => {
    setEditingId(item.id);
    setActiveTab(module);
    setStatusMessage(null);

    if (module === 'books') {
      setBookForm({
        title: item.title || '',
        slug: item.slug || '',
        synopsis: item.synopsis || '',
        cover_url: item.cover_url || '',
      });
      setEditorialStatus(item.status || 'draft');
      setIsPublicSwitch(item.status === 'published');
    } else if (module === 'noticias') {
      setNewsForm({
        title: item.title || '',
        slug: item.slug || '',
        content: item.content || '',
        image_url: item.image_url || '',
      });
    } else if (module === 'eventos') {
      setEventForm({
        title: item.title || '',
        description: item.description || '',
        event_date: item.event_date ? item.event_date.slice(0, 16) : '',
        location: item.location || '',
        registration_url: item.registration_url || '',
        image_url: item.image_url || '',
      });
    } else if (module === 'galeria') {
      setGalleryForm({
        title: item.title || '',
        description: item.description || '',
        image_url: item.image_url || '',
        category: item.category || 'Inspiración',
      });
    } else if (module === 'autores') {
      setAuthorForm({
        name: item.name || '',
        bio_short: item.bio_short || '',
        bio_long: item.bio_long || '',
        profile_image_url: item.profile_image_url || '',
        twitter_url: item.twitter_url || '',
        instagram_url: item.instagram_url || '',
        facebook_url: item.facebook_url || '',
      });
    } else if (module === 'club_lectura') {
      setClubForm({
        name: item.name || '',
        description: item.description || '',
        status: item.status || 'active',
        external_link: item.external_link || '',
        book_id: item.book_id || '',
      });
    }

    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Cancelar Edición y limpiar formularios
  const handleCancelEdit = () => {
    setEditingId(null);
    setBookForm({ title: '', slug: '', synopsis: '', cover_url: '' });
    setEditorialStatus('draft');
    setIsPublicSwitch(false);
    setNewsForm({ title: '', slug: '', content: '', image_url: '' });
    setEventForm({ title: '', description: '', event_date: '', location: '', registration_url: '', image_url: '' });
    setGalleryForm({ title: '', description: '', image_url: '', category: 'Inspiración' });
    setStatusMessage(null);
  };

  // Manejo de envío (Crear o Actualizar registro vía PUT/POST)
  const handleSubmit = async (module: ModuleTab, payload: any) => {
    setLoading(true);
    setStatusMessage(null);

    const isEditing = Boolean(editingId);
    const method = isEditing ? 'PUT' : 'POST';
    const bodyData = isEditing ? { ...payload, id: editingId } : payload;

    try {
      const res = await fetch(`/api/admin/${module}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar registro');
      }

      setStatusMessage({
        type: 'success',
        text: isEditing
          ? `Registro [${module.toUpperCase()}] actualizado exitosamente en Supabase.`
          : `Registro guardado exitosamente en [${module.toUpperCase()}]. Sincronizado con Supabase.`,
      });

      // Limpiar formulario y modo edición
      handleCancelEdit();
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
        if (editingId === id) handleCancelEdit();
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
              handleCancelEdit();
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

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 1fr) 1.2fr', gap: '32px', alignItems: 'start' }}>
        {/* COLUMNA 1: FORMULARIO DE ENTRADA CON UPLOADER */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {/* TAB 1: LIBROS */}
          {activeTab === 'books' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Lógica estricta de visibilidad: si el switch está apagado se fuerza draft; si está encendido se envía published
                const finalStatus = isPublicSwitch ? 'published' : 'draft';
                handleSubmit('books', {
                  ...bookForm,
                  status: finalStatus,
                });
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>
                  {editingId ? 'Editar Obra Literaria' : 'Publicar Nueva Obra'}
                </h2>
                {editingId && (
                  <span className="luxury-badge" style={{ fontSize: '0.72rem' }}>
                    Modo Edición
                  </span>
                )}
              </div>
              
              <label style={labelStyle}>Título de la Obra *</label>
              <input
                type="text"
                required
                placeholder="Giselle"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                style={inputStyle}
              />
              
              <label style={labelStyle}>Slug para Subdominio *</label>
              <input
                type="text"
                required
                placeholder="giselle (subdominio)"
                value={bookForm.slug}
                onChange={(e) => setBookForm({ ...bookForm, slug: e.target.value.toLowerCase().trim() })}
                style={inputStyle}
              />

              <label style={labelStyle}>Sinopsis *</label>
              <textarea
                rows={3}
                required
                placeholder="Sinopsis literaria de la obra..."
                value={bookForm.synopsis}
                onChange={(e) => setBookForm({ ...bookForm, synopsis: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }}
              />

              {/* COMPONENTE 1: SELECTOR DE ESTATUS EDITORIAL */}
              <label style={labelStyle}>Estatus actual del libro *</label>
              <select
                value={editorialStatus}
                onChange={(e) => {
                  const val = e.target.value as 'draft' | 'writing' | 'published';
                  setEditorialStatus(val);
                  if (val === 'published') {
                    setIsPublicSwitch(true);
                  } else if (val === 'draft' || val === 'writing') {
                    setIsPublicSwitch(false);
                  }
                }}
                style={inputStyle}
              >
                <option value="draft">Borrador (Draft)</option>
                <option value="writing">Escribiendo (Writing)</option>
                <option value="published">Terminado / Listo para publicación</option>
              </select>

              {/* COMPONENTE 2: INTERRUPTOR DE VISIBILIDAD (SWITCH / TOGGLE) */}
              <div
                style={{
                  backgroundColor: isPublicSwitch ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                  border: isPublicSwitch ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 18px',
                  marginBottom: '20px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        ...labelStyle,
                        marginBottom: '4px',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                      }}
                      onClick={() => setIsPublicSwitch(!isPublicSwitch)}
                    >
                      ¿Desea publicar esta obra en la web pública ahora mismo?
                    </label>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: isPublicSwitch ? '#10b981' : 'var(--text-muted)',
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {isPublicSwitch
                        ? '● SÍ — Obra pública (visible de inmediato en la sección Biblioteca)'
                        : '○ NO — Obra en borrador privado (oculta de la Home por seguridad)'}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPublicSwitch}
                    onClick={() => setIsPublicSwitch(!isPublicSwitch)}
                    style={{
                      width: '52px',
                      height: '28px',
                      borderRadius: '9999px',
                      backgroundColor: isPublicSwitch ? '#121212' : '#D1D5DB',
                      border: isPublicSwitch ? '1px solid #121212' : '1px solid #9CA3AF',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: isPublicSwitch ? '27px' : '3px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: isPublicSwitch ? '#FFFFFF' : '#6B7280',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease',
                      }}
                    />
                  </button>
                </div>
              </div>

              <FileUploader bucket="book-covers" label="Portada del Libro" value={bookForm.cover_url} onUploaded={(url) => setBookForm({ ...bookForm, cover_url: url })} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={loading} className="btn-noir" style={{ flex: 1 }}>
                  {loading ? 'Guardando...' : editingId ? '✓ Actualizar Obra' : 'Guardar Libro'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-noir-outline" style={{ padding: '12px 18px' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: AUTORES */}
          {activeTab === 'autores' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('autores', authorForm); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>Perfil de Autora</h2>
                {editingId && <span className="luxury-badge" style={{ fontSize: '0.72rem' }}>Modo Edición</span>}
              </div>

              <label style={labelStyle}>Nombre *</label>
              <input type="text" required value={authorForm.name} onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Biografía Corta</label>
              <textarea rows={2} value={authorForm.bio_short} onChange={(e) => setAuthorForm({ ...authorForm, bio_short: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <label style={labelStyle}>Biografía Extendida</label>
              <textarea rows={4} value={authorForm.bio_long} onChange={(e) => setAuthorForm({ ...authorForm, bio_long: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <FileUploader bucket="autores" label="Foto de Perfil" value={authorForm.profile_image_url} onUploaded={(url) => setAuthorForm({ ...authorForm, profile_image_url: url })} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={loading} className="btn-noir" style={{ flex: 1 }}>
                  {loading ? 'Guardando...' : editingId ? '✓ Actualizar Biografía' : 'Actualizar Biografía'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-noir-outline" style={{ padding: '12px 18px' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 3: NOTICIAS */}
          {activeTab === 'noticias' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('noticias', newsForm); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>
                  {editingId ? 'Editar Noticia / Prensa' : 'Nueva Noticia'}
                </h2>
                {editingId && <span className="luxury-badge" style={{ fontSize: '0.72rem' }}>Modo Edición</span>}
              </div>

              <label style={labelStyle}>Titular *</label>
              <input type="text" required placeholder="Lanzamiento oficial..." value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Slug *</label>
              <input type="text" required placeholder="lanzamiento-oficial" value={newsForm.slug} onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value.toLowerCase().trim() })} style={inputStyle} />

              <label style={labelStyle}>Contenido (Rich Text) *</label>
              <textarea rows={4} required value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <FileUploader bucket="noticias" label="Imagen de Noticia" value={newsForm.image_url} onUploaded={(url) => setNewsForm({ ...newsForm, image_url: url })} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={loading} className="btn-noir" style={{ flex: 1 }}>
                  {loading ? 'Publicando...' : editingId ? '✓ Actualizar Noticia' : 'Publicar Noticia'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-noir-outline" style={{ padding: '12px 18px' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 4: EVENTOS Y FIRMAS (CON CAMPO DE IMAGEN - MEJORA 2) */}
          {activeTab === 'eventos' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('eventos', eventForm); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>
                  {editingId ? 'Editar Evento / Firma' : 'Agendar Evento'}
                </h2>
                {editingId && <span className="luxury-badge" style={{ fontSize: '0.72rem' }}>Modo Edición</span>}
              </div>

              <label style={labelStyle}>Título del Evento *</label>
              <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Fecha y Hora *</label>
              <input type="datetime-local" required value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Ubicación *</label>
              <input type="text" required placeholder="Librería / Centro Cultural, Santiago" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Descripción *</label>
              <textarea rows={3} required value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              {/* MEJORA 2: CAMPO DE IMAGEN EN EVENTOS */}
              <FileUploader
                bucket="galeria"
                label="Foto o Afiche de la Librería / Evento"
                value={eventForm.image_url}
                onUploaded={(url) => setEventForm({ ...eventForm, image_url: url })}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={loading} className="btn-noir" style={{ flex: 1 }}>
                  {loading ? 'Guardando...' : editingId ? '✓ Actualizar Evento' : 'Guardar Evento'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-noir-outline" style={{ padding: '12px 18px' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 5: GALERÍA */}
          {activeTab === 'galeria' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('galeria', galleryForm); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>
                  {editingId ? 'Editar Elemento de Galería' : 'Añadir a Galería'}
                </h2>
                {editingId && <span className="luxury-badge" style={{ fontSize: '0.72rem' }}>Modo Edición</span>}
              </div>

              <label style={labelStyle}>Título *</label>
              <input type="text" required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Categoría *</label>
              <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} style={inputStyle}>
                <option value="Inspiración">Inspiración</option>
                <option value="Fanart">Fanart</option>
                <option value="Eventos">Eventos</option>
              </select>

              <label style={labelStyle}>Descripción</label>
              <textarea rows={2} value={galleryForm.description} onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <FileUploader bucket="galeria" label="Archivo de Imagen" value={galleryForm.image_url} onUploaded={(url) => setGalleryForm({ ...galleryForm, image_url: url })} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={loading || !galleryForm.image_url} className="btn-noir" style={{ flex: 1 }}>
                  {loading ? 'Guardando...' : editingId ? '✓ Actualizar Imagen' : 'Añadir a Galería'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-noir-outline" style={{ padding: '12px 18px' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 6: CLUB DE LECTURA */}
          {activeTab === 'club_lectura' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('club_lectura', clubForm); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>
                  {editingId ? 'Editar Club de Lectura' : 'Nuevo Club de Lectura'}
                </h2>
                {editingId && <span className="luxury-badge" style={{ fontSize: '0.72rem' }}>Modo Edición</span>}
              </div>

              <label style={labelStyle}>Nombre del Club *</label>
              <input type="text" required value={clubForm.name} onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })} style={inputStyle} />

              <label style={labelStyle}>Descripción *</label>
              <textarea rows={3} required value={clubForm.description} onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />

              <label style={labelStyle}>Enlace Externo (Discord / Zoom)</label>
              <input type="url" placeholder="https://..." value={clubForm.external_link} onChange={(e) => setClubForm({ ...clubForm, external_link: e.target.value })} style={inputStyle} />

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={loading} className="btn-noir" style={{ flex: 1 }}>
                  {loading ? 'Guardando...' : editingId ? '✓ Actualizar Club' : 'Crear Club'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-noir-outline" style={{ padding: '12px 18px' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* COLUMNA 2: VISUALIZACIÓN DE REGISTROS EN TIEMPO REAL CON BOTÓN EDITAR (MEJORA 1) */}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '650px', overflowY: 'auto' }}>
              {records.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: editingId === item.id ? 'rgba(18, 18, 18, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                    border: editingId === item.id ? '2px solid #121212' : '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    {(item.cover_url || item.image_url || item.profile_image_url) && (
                      <img
                        src={item.cover_url || item.image_url || item.profile_image_url}
                        alt="Miniatura"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title || item.name}
                      </h4>
                      {item.slug && <span style={{ fontSize: '0.75rem', color: '#121212', fontWeight: 600 }}>Subdominio: {item.slug}</span>}
                      {item.category && <span className="luxury-badge" style={{ fontSize: '0.65rem', marginLeft: '6px' }}>{item.category}</span>}
                      {item.status && <span style={{ fontSize: '0.75rem', color: item.status === 'published' ? '#10b981' : '#f59e0b', marginLeft: '8px' }}>• {item.status}</span>}
                      {item.event_date && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{new Date(item.event_date).toLocaleDateString('es-CL')}</span>}
                    </div>
                  </div>

                  {/* BOTONES DE ACCIÓN: EDITAR Y ELIMINAR (MEJORA 1) */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(activeTab, item)}
                      className="btn-noir-outline"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      ✎ Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(activeTab, item.id)}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
