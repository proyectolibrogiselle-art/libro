'use client';

import React, { useState, useEffect } from 'react';
import { GalleryItem } from '@/types/entities';

interface GalleryMarqueeProps {
  items: GalleryItem[];
}

export default function GalleryMarquee({ items }: GalleryMarqueeProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

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
      description: 'Sesión oficial en blanco y negro para la presentación de la obra.',
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
      description: 'Luces cálidas, arquitectura clásica y claroscuros que inspiraron el mundo de Giselle.',
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
      {/* Sombras difuminadas en los extremos para un fade editorial impecable */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '80px',
          background: 'linear-gradient(to right, #FFFFFF 20%, transparent 100%)',
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
          width: '80px',
          background: 'linear-gradient(to left, #FFFFFF 20%, transparent 100%)',
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
              onClick={() => setSelectedItem(item)}
              className="gallery-marquee-card"
              role="button"
              tabIndex={0}
              aria-label={`Ver ${item.title} en tamaño completo`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedItem(item);
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
                    color: '#C5C5C5',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  {item.category || 'Archivo visual'}
                </span>
                <p
                  className="cinzel-heading"
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    color: '#FAFAFA',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </p>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#E0E0E0',
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  🔍 Ver detalle
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
            {/* Botón de cierre */}
            <button
              onClick={() => setSelectedItem(null)}
              aria-label="Cerrar imagen"
              className="gallery-lightbox-close-btn"
            >
              ✕
            </button>

            {/* Imagen en alta resolución */}
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0', backgroundColor: '#0A0A0A' }}>
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
                padding: '24px 28px',
                backgroundColor: '#161616',
                color: '#FAFAFA',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#A3A3A3',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedItem.category || 'Galería Oficial'}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#737373' }}>
                  Presione ESC o haga clic fuera para salir
                </span>
              </div>
              <h4
                className="cinzel-heading"
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  margin: 0,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                }}
              >
                {selectedItem.title}
              </h4>
              {selectedItem.description && (
                <p
                  className="montserrat-body"
                  style={{
                    fontSize: '0.9rem',
                    color: '#CCCCCC',
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
