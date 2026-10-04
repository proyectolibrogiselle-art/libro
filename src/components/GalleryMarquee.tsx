'use client';

import React, { useState, useEffect } from 'react';
import { GalleryItem } from '@/types/entities';
import { SearchIcon, CloseIcon } from '@/components/Icons';

interface GalleryMarqueeProps {
  items: GalleryItem[];
}

export default function GalleryMarquee({ items }: GalleryMarqueeProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Cerrar modal al presionar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    if (selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [selectedItem]);

  // Si no hay ítems suficientes, triplicamos para garantizar un desplazamiento infinito fluido
  const displayItems = items && items.length > 0 ? items : [
    {
      id: 'gal-1',
      title: 'Retrato de Autor: Mirada Literaria',
      description: 'Sesión oficial en tonalidad platino para la presentación de la obra.',
      image_url: '/images/giselle-portada.png',
      category: 'Inspiración',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'gal-2',
      title: 'La Esencia de Giselle',
      description: 'Composición tipográfica y portada original de la novela.',
      image_url: '/images/giselle-2.jpg',
      category: 'Inspiración',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'gal-3',
      title: 'Atmósferas y Escenarios de Época',
      description: 'Luces nocturnas, arquitectura clásica y claroscuros que inspiraron el mundo de Giselle.',
      image_url: '/images/giselle-portada.png',
      category: 'Eventos',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Duplicar el conjunto de tarjetas para la cinta continua (seamless loop)
  const marqueeItems = [...displayItems, ...displayItems, ...displayItems, ...displayItems];

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '16px 0 32px' }}>
      {/* Sombras difuminadas en los extremos con tono azul petróleo */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '90px',
          background: 'linear-gradient(to right, var(--petrol-deep) 20%, transparent 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '90px',
          background: 'linear-gradient(to left, var(--petrol-deep) 20%, transparent 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* CINTA HORIZONTAL INFINITA CON PAUSA AL HOVER */}
      <div className="gallery-marquee-container">
        <div className="gallery-marquee-track">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedItem(item as any)}
              className="gallery-marquee-card"
              role="button"
              tabIndex={0}
              aria-label={`Ver ${item.title} en tamaño completo`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(item as any);
                }
              }}
            >
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="gallery-card-img"
              />
              
              {/* Overlay y tipografía en tarjeta */}
              <div className="gallery-card-overlay">
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--accent-copper)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    display: 'block',
                    fontWeight: 600,
                  }}
                >
                  {item.category || 'Archivo visual'}
                </span>
                <p
                  className="cinzel-heading"
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    color: '#FAF7F2',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </p>
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--accent-platinum-bright)',
                    marginTop: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 500,
                  }}
                >
                  <SearchIcon size={13} style={{ color: 'var(--accent-copper)' }} />
                  <span>Explorar detalle</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL LIGHTBOX INTERACTIVO */}
      {selectedItem && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cierre con icono SVG */}
            <button
              onClick={() => setSelectedItem(null)}
              aria-label="Cerrar imagen"
              className="gallery-lightbox-close-btn"
            >
              <CloseIcon size={18} />
            </button>

            {/* Imagen en alta resolución */}
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px 14px 0 0', backgroundColor: '#0C1E1F' }}>
              <img
                src={selectedItem.image_url}
                alt={selectedItem.title}
                style={{
                  width: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Pie de foto editorial del Lightbox */}
            <div
              style={{
                padding: '26px 30px',
                backgroundColor: 'var(--petrol-deep)',
                color: '#FAF7F2',
                borderTop: '1px solid var(--border-platinum)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-copper)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {selectedItem.category || 'Galería Oficial'}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Presione ESC o haga clic fuera para salir
                </span>
              </div>
              <h4
                className="cinzel-heading"
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  margin: 0,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em',
                }}
              >
                {selectedItem.title}
              </h4>
              {selectedItem.description && (
                <p
                  className="montserrat-body"
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
