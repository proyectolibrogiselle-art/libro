'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Book } from '@/types/book';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons';

interface PublicationsCarouselProps {
  books: Book[];
}

export default function PublicationsCarousel({ books }: PublicationsCarouselProps) {
  // Catálogo editorial completo con soporte de fallback
  const fallbackList: Book[] = [
    {
      id: 'giselle-official',
      title: 'Giselle',
      slug: 'giselle',
      synopsis:
        'Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas. En una época marcada por las apariencias, las convenciones familiares y aquello que se esperaba de una mujer, Giselle intenta construir su vida bajo sus propias reglas. Amores, decisiones, deseos, pérdidas y contradicciones irán trazando un camino en el que cada elección tendrá consecuencias.',
      status: 'published',
      cover_url: '/images/giselle-2.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'el-eco-del-silencio',
      title: 'El eco del silencio',
      slug: 'giselle',
      synopsis:
        'Una novela sobre las palabras no dichas y los secretos guardados durante generaciones en una antigua casona del valle central. Un íntimo relato de redención y memoria.',
      status: 'published',
      cover_url: '/images/giselle-portada.png',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'la-herencia-invisible',
      title: 'La herencia invisible',
      slug: 'giselle',
      synopsis:
        'Un viaje emocional a través de tres generaciones de mujeres unidas por una promesa inquebrantable y el anhelo irrenunciable de libertad en una sociedad en transformación.',
      status: 'published',
      cover_url: '/images/giselle-2.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const carouselBooks = books && books.length >= 3 
    ? books 
    : books && books.length > 0 
      ? [
          ...books,
          ...fallbackList.filter((fb) => !books.some((b) => b.slug === fb.slug || b.title === fb.title)),
        ].slice(0, Math.max(3, books.length))
      : fallbackList;

  const [activeIndex, setActiveIndex] = useState(0);

  // Inicializar en el libro 'Giselle' si está presente
  useEffect(() => {
    const giselleIdx = carouselBooks.findIndex((b) => b.slug === 'giselle');
    if (giselleIdx !== -1) {
      setActiveIndex(giselleIdx);
    }
  }, [carouselBooks.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : carouselBooks.length - 1));
  }, [carouselBooks.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < carouselBooks.length - 1 ? prev + 1 : 0));
  }, [carouselBooks.length]);

  const currentBook = carouselBooks[activeIndex] || carouselBooks[0];

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
      {/* ESCENARIO COVER FLOW 3D: AZUL PETRÓLEO / PLATINO */}
      <div
        className="cover-flow-stage"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          minHeight: '490px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'visible',
          padding: '20px 0 40px',
        }}
      >
        {carouselBooks.map((book, idx) => {
          const offset = idx - activeIndex;

          let visualOffset = offset;
          if (activeIndex === 0 && idx === carouselBooks.length - 1 && carouselBooks.length > 2) {
            visualOffset = -1;
          } else if (activeIndex === carouselBooks.length - 1 && idx === 0 && carouselBooks.length > 2) {
            visualOffset = 1;
          }

          const isVisible = Math.abs(visualOffset) <= 2;
          if (!isVisible) return null;

          const isCurrent = visualOffset === 0;

          // Cálculo 3D de traslación, escala y rotación
          let translateX = '0px';
          let translateZ = '0px';
          let rotateY = '0deg';
          let scale = 1;
          let zIndex = 30;
          let opacity = 1;
          let filter = 'none';

          if (isCurrent) {
            translateX = '0px';
            translateZ = '0px';
            rotateY = '0deg';
            scale = 1.0;
            zIndex = 30;
            opacity = 1;
            filter = 'brightness(100%) contrast(105%)';
          } else if (visualOffset < 0) {
            const factor = Math.abs(visualOffset);
            translateX = `-${factor === 1 ? '170px' : '280px'}`;
            translateZ = `-${factor * 90}px`;
            rotateY = `${factor * 18}deg`;
            scale = factor === 1 ? 0.86 : 0.72;
            zIndex = 30 - factor * 10;
            opacity = factor === 1 ? 0.76 : 0.42;
            filter = 'brightness(75%) contrast(108%)';
          } else if (visualOffset > 0) {
            const factor = visualOffset;
            translateX = `${factor === 1 ? '170px' : '280px'}`;
            translateZ = `-${factor * 90}px`;
            rotateY = `-${factor * 18}deg`;
            scale = factor === 1 ? 0.86 : 0.72;
            zIndex = 30 - factor * 10;
            opacity = factor === 1 ? 0.76 : 0.42;
            filter = 'brightness(75%) contrast(108%)';
          }

          const bookCover = book.slug === 'giselle' 
            ? '/images/giselle-2.jpg' 
            : (book.cover_url || '/images/giselle-2.jpg');

          return (
            <div
              key={book.id || idx}
              onClick={() => setActiveIndex(idx)}
              className="cover-flow-card"
              style={{
                position: 'absolute',
                width: '270px',
                height: '400px',
                borderRadius: '14px',
                cursor: isCurrent ? 'default' : 'pointer',
                transform: `translateX(${translateX}) translateZ(${translateZ}) rotateY(${rotateY}) scale(${scale})`,
                zIndex,
                opacity,
                filter,
                transition: 'all 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
                boxShadow: isCurrent
                  ? '0 28px 65px -12px rgba(10, 24, 25, 0.75), 0 0 0 1px rgba(184, 176, 156, 0.45)'
                  : '0 16px 36px -8px rgba(10, 24, 25, 0.5)',
                backgroundColor: 'var(--petrol-secondary)',
                border: isCurrent ? '1.5px solid var(--accent-platinum-bright)' : '1px solid var(--border-platinum)',
                overflow: 'hidden',
                userSelect: 'none',
              }}
            >
              <img
                src={bookCover}
                alt={`Portada de ${book.title}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
              
              {/* Overlay arquitectónico suave */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isCurrent
                    ? 'linear-gradient(to top, rgba(23, 59, 60, 0.8) 0%, rgba(23, 59, 60, 0.15) 50%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(17, 47, 48, 0.9) 0%, rgba(17, 47, 48, 0.4) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Etiqueta flotante inferior */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  color: '#FAF7F2',
                  textAlign: 'center',
                }}
              >
                <p
                  className="cinzel-heading"
                  style={{
                    fontSize: '0.96rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    margin: 0,
                    textShadow: '0 2px 8px rgba(10, 24, 25, 0.9)',
                  }}
                >
                  {book.title}
                </p>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--accent-copper)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {book.slug === 'giselle' ? 'Obra disponible' : 'Catálogo editorial'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTROLES DE NAVEGACIÓN Y PAGINACIÓN */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '10px',
          marginBottom: '40px',
        }}
      >
        <button
          onClick={handlePrev}
          aria-label="Obra anterior"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'var(--petrol-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-platinum)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(10, 24, 25, 0.4)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.backgroundColor = 'var(--accent-copper)';
            e.currentTarget.style.borderColor = 'var(--accent-platinum-bright)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'var(--petrol-surface)';
            e.currentTarget.style.borderColor = 'var(--border-platinum)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          <ArrowLeftIcon size={18} />
        </button>

        {/* Indicadores de posición (Dots) */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {carouselBooks.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveIndex(dotIdx)}
              aria-label={`Ir al libro ${dotIdx + 1}`}
              style={{
                width: dotIdx === activeIndex ? '28px' : '9px',
                height: '9px',
                borderRadius: '9999px',
                backgroundColor: dotIdx === activeIndex ? 'var(--accent-copper)' : 'rgba(184, 176, 156, 0.25)',
                border: dotIdx === activeIndex ? '1px solid var(--accent-platinum-bright)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Siguiente obra"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'var(--petrol-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-platinum)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(10, 24, 25, 0.4)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.backgroundColor = 'var(--accent-copper)';
            e.currentTarget.style.borderColor = 'var(--accent-platinum-bright)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'var(--petrol-surface)';
            e.currentTarget.style.borderColor = 'var(--border-platinum)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          <ArrowRightIcon size={18} />
        </button>
      </div>

      {/* FICHA EDITORIAL DE LA OBRA ACTIVA */}
      {currentBook && (
        <div
          className="petrol-card"
          style={{
            padding: '42px 38px',
            maxWidth: '820px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <span
            className="petrol-badge-copper"
            style={{ marginBottom: '14px' }}
          >
            Novela · Ficción literaria
          </span>

          <h3
            className="cinzel-decorative"
            style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 2.9rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '6px',
              color: 'var(--text-primary)',
            }}
          >
            {currentBook.title}
          </h3>

          <p
            className="serif-delicate"
            style={{
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: 'var(--accent-platinum)',
              marginBottom: '22px',
            }}
          >
            Por Carmen Ibáñez
          </p>

          <p
            className="montserrat-body"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.85,
              maxWidth: '680px',
              margin: '0 auto 32px',
              textAlign: 'center',
            }}
          >
            {currentBook.synopsis}
          </p>

          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Link
              href={`/subdomains/${currentBook.slug || 'giselle'}`}
              className="btn-copper"
              style={{
                padding: '14px 38px',
                fontSize: '0.94rem',
              }}
            >
              <span>Ingresar a la obra</span>
              <ArrowRightIcon size={16} />
            </Link>
            <p
              className="montserrat-body"
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              Explora el universo narrativo y la sinopsis completa de {currentBook.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
