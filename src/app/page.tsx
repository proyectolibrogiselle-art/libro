import Link from 'next/link';
import HeaderNav from '@/components/HeaderNav';
import { BooksService } from '@/lib/supabase/books.service';
import { AuthorsService, EventsService, GalleryService, NewsService } from '@/lib/supabase/modules.service';
import { Book } from '@/types/book';
import { Author, EventItem, GalleryItem, News } from '@/types/entities';
import PublicationsCarousel from '@/components/PublicationsCarousel';
import GalleryMarquee from '@/components/GalleryMarquee';
import {
  CalendarIcon,
  PinIcon,
  ArrowRightIcon,
  BookIcon,
  QuillIcon
} from '@/components/Icons';

// Revalidación periódica (ISR)
export const revalidate = 60;

export default async function HomePage() {
  let author: Author | null = null;
  let books: Book[] = [];
  let newsList: News[] = [];
  let eventsList: EventItem[] = [];
  let galleryList: GalleryItem[] = [];

  try {
    author = await AuthorsService.getPrimaryAuthor();
  } catch (err) {
    console.warn('Conexión con Supabase (autores) en curso, usando fallback:', err);
  }

  try {
    books = await BooksService.getPublishedBooks();
  } catch (err) {
    console.warn('Conexión con Supabase (libros) en curso, usando fallback:', err);
  }

  try {
    newsList = await NewsService.getAllNews();
  } catch (err) {
    console.warn('Conexión con Supabase (noticias) en curso, usando fallback:', err);
  }

  try {
    eventsList = await EventsService.getUpcomingEvents();
  } catch (err) {
    console.warn('Conexión con Supabase (eventos) en curso, usando fallback:', err);
  }

  try {
    galleryList = await GalleryService.getItemsByCategory();
  } catch (err) {
    console.warn('Conexión con Supabase (galería) en curso, usando fallback:', err);
  }

  // Obra emblemática oficial con imagen real y sinopsis aprobada
  const displayBooks: Book[] = books.length > 0 ? books : [
    {
      id: 'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
      title: 'Giselle',
      slug: 'giselle',
      synopsis:
        'Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas. En una época marcada por las apariencias, las convenciones familiares y aquello que se esperaba de una mujer, Giselle intenta construir su vida bajo sus propias reglas. Amores, decisiones, deseos, pérdidas y contradicciones irán trazando un camino en el que cada elección tendrá consecuencias.',
      status: 'published',
      cover_url: '/images/giselle-2.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Fallbacks editoriales para Eventos si aún no hay registros creados en Supabase
  const displayEvents: EventItem[] = eventsList.length > 0 ? eventsList : [
    {
      id: 'evento-1',
      title: 'Presentación Oficial de Giselle',
      description: 'Lanzamiento editorial íntimo y conversatorio sobre la libertad femenina y las decisiones de vida.',
      event_date: '2026-10-18T19:00:00Z',
      location: 'Salón de Honor, Centro Cultural Gabriela Mistral (GAM), Santiago',
      registration_url: '#contacto',
      image_url: '/images/giselle-portada.png',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'evento-2',
      title: 'Firma de Ejemplares y Diálogo con Lectoras',
      description: 'Espacio de dedicatorias personales y lectura comentada de los primeros capítulos de la novela.',
      event_date: '2026-11-05T18:30:00Z',
      location: 'Librería Metáfora, Providencia, Santiago',
      registration_url: '#contacto',
      image_url: '/images/giselle-2.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'evento-3',
      title: 'Feria Internacional del Libro de Santiago (FILSA)',
      description: 'Mesa redonda: "El universo femenino en la narrativa contemporánea chilena".',
      event_date: '2026-11-22T17:00:00Z',
      location: 'Estación Mapocho, Santiago',
      registration_url: '#contacto',
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Fallbacks de alta estética para Galería Visual si aún no hay registros en Supabase
  const displayGallery: GalleryItem[] = galleryList.length > 0 ? galleryList : [
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

  const authorPhoto = author?.profile_image_url || '/images/giselle-portada.png';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 1. NAVEGACIÓN PRINCIPAL: AZUL PETRÓLEO / PLATINO */}
      <HeaderNav />

      {/* 2. HERO EDITORIAL: TEXTO A LA IZQUIERDA + FOTOGRAFÍA A LA DERECHA */}
      <section
        id="inicio"
        style={{
          padding: '0 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div className="hero-editorial-container">
          {/* Columna Izquierda: Identidad y Proclama Literaria */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Badge Cobre Discreto */}
            <div style={{ marginBottom: '22px' }}>
              <span className="petrol-badge-copper">
                Autora chilena · Narrativa contemporánea
              </span>
            </div>

            {/* Nombre Monumental */}
            <h1
              className="cinzel-decorative"
              style={{
                fontSize: 'clamp(2.8rem, 5.2vw, 4.4rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '0.04em',
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}
            >
              {author?.name || 'Carmen Ibáñez'}
            </h1>

            {/* Lema Poético */}
            <p
              className="serif-delicate"
              style={{
                fontSize: 'clamp(1.4rem, 2.4vw, 2.05rem)',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: 1.4,
                marginBottom: '26px',
                fontWeight: 500,
              }}
            >
              &ldquo;Historias que también viven en nosotras&rdquo;
            </p>

            {/* Filete Platino Sutil */}
            <div
              style={{
                width: '80px',
                height: '1.5px',
                backgroundColor: 'var(--border-platinum-strong)',
                marginBottom: '26px',
              }}
            />

            {/* Párrafo Introductorio */}
            <p
              className="montserrat-body"
              style={{
                fontSize: '1.02rem',
                lineHeight: 1.9,
                color: 'var(--text-secondary)',
                maxWidth: '560px',
                marginBottom: '38px',
              }}
            >
              Una exploración literaria íntima de los vínculos, las emociones ocultas y aquellas elecciones capaces de transformar el destino de las personas.
            </p>

            {/* Botones de Acción */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '44px',
              }}
            >
              <Link href="/subdomains/giselle" className="btn-copper">
                <span>Ingresar a la obra Giselle</span>
                <ArrowRightIcon size={16} />
              </Link>
              <a href="#la-autora" className="btn-platinum-outline">
                <span>Conocer su trayectoria</span>
              </a>
            </div>

            {/* Cita en Bloque con Borde Platino */}
            <div
              style={{
                borderLeft: '2px solid var(--accent-copper)',
                paddingLeft: '20px',
                maxWidth: '540px',
              }}
            >
              <p
                className="serif-delicate"
                style={{
                  fontSize: '1.08rem',
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                &ldquo;Escribe desde la observación de las emociones y de aquello que muchas veces permanece oculto detrás de las apariencias.&rdquo;
              </p>
            </div>
          </div>

          {/* Columna Derecha: Fotografía Protagonista con Marco Fino Platino */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="hero-portrait-frame-petrol">
              {/* Esquinas Platino */}
              <span className="petrol-corner-mark petrol-corner-tl" />
              <span className="petrol-corner-mark petrol-corner-tr" />
              <span className="petrol-corner-mark petrol-corner-bl" />
              <span className="petrol-corner-mark petrol-corner-br" />

              <div className="hero-portrait-inner-petrol">
                <img
                  src={authorPhoto}
                  alt={`${author?.name || 'Carmen Ibáñez'} — Retrato oficial de la autora`}
                  className="hero-portrait-img-petrol"
                />
              </div>

              {/* Pie de Foto Editorial Platino */}
              <div
                style={{
                  padding: '16px 12px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-platinum)',
                  marginTop: '10px',
                }}
              >
                <span
                  className="cinzel-heading"
                  style={{
                    fontSize: '0.82rem',
                    letterSpacing: '0.08em',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  Carmen Ibáñez
                </span>
                <span
                  className="montserrat-body"
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-copper)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Retrato Oficial
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: LA AUTORA (AZUL SECUNDARIO + SUPERFICIES PLATINO) */}
      <section
        id="la-autora"
        style={{
          padding: '110px 24px',
          borderTop: '1px solid var(--border-platinum)',
          borderBottom: '1px solid var(--border-platinum)',
          backgroundColor: 'var(--petrol-secondary)',
        }}
      >
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span
              className="petrol-badge-platinum"
              style={{ marginBottom: '14px' }}
            >
              Semblanza literaria
            </span>
            <h2
              className="serif-delicate"
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 600,
                lineHeight: 1.2,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              Sobre Carmen Ibáñez
            </h2>
            <p
              className="serif-delicate"
              style={{
                fontSize: '1.15rem',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
              }}
            >
              Voz literaria de la narrativa contemporánea chilena
            </p>
          </div>

          {/* Biografía en Tarjeta Petrol Surface */}
          <div
            className="petrol-card"
            style={{
              padding: '48px 44px',
              marginBottom: '48px',
            }}
          >
            <p
              className="montserrat-body"
              style={{
                fontSize: '1.02rem',
                lineHeight: 2.0,
                color: 'var(--text-primary)',
                marginBottom: '24px',
              }}
            >
              {author?.bio_long ||
                'Carmen Ibáñez es una escritora y autora cuya obra se sumerge en las profundidades de la experiencia humana, las complejidades de los lazos afectivos y la búsqueda irrevocable de autonomía femenina. Con una mirada aguda, sensible y sin concesiones, su literatura explora aquellos momentos bisagra en los que una decisión íntima altera para siempre el rumbo de una vida.'}
            </p>
            <p
              className="montserrat-body"
              style={{
                fontSize: '1.02rem',
                lineHeight: 2.0,
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              {author?.bio_short ||
                'A través de su primera novela, Giselle, consolida una propuesta narrativa de atmósferas envolventes, donde las expectativas familiares, los amores silenciosos y los dilemas morales se entrelazan con la fuerza de una prosa elegante y evocadora.'}
            </p>
          </div>

          {/* Grilla con los 3 Pilares Temáticos */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '28px',
            }}
          >
            <div
              className="petrol-card"
              style={{
                padding: '32px 28px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-copper)',
                  color: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <QuillIcon size={20} />
              </div>
              <h3
                className="cinzel-heading"
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                Narrativa íntima
              </h3>
              <p
                className="montserrat-body"
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                Exploración psicológica de los afectos, los silencios compartidos y las tensiones que habitan los vínculos humanos más cercanos.
              </p>
            </div>

            <div
              className="petrol-card"
              style={{
                padding: '32px 28px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-copper)',
                  color: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <BookIcon size={20} />
              </div>
              <h3
                className="cinzel-heading"
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                Ficción y realidad
              </h3>
              <p
                className="montserrat-body"
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                Tramas tejidas con el pulso de las vivencias reales, ancladas en épocas de transformación cultural y arquitecturas con memoria.
              </p>
            </div>

            <div
              className="petrol-card"
              style={{
                padding: '32px 28px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-copper)',
                  color: '#FAF7F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <span style={{ fontSize: '1.1rem', color: '#FAF7F2' }}>✦</span>
              </div>
              <h3
                className="cinzel-heading"
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                Dilemas humanos
              </h3>
              <p
                className="montserrat-body"
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                Elecciones trascendentales donde la libertad, el perdón y el anhelo de autenticidad se enfrentan a los mandatos sociales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: MANIFIESTO EDITORIAL (LÍNEAS PLATINO Y COMPOSICIÓN MINIMALISTA) */}
      <section
        id="manifiesto"
        style={{
          padding: '130px 24px',
          maxWidth: '920px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            padding: '56px 48px',
            borderTop: '1.5px solid var(--border-platinum-strong)',
            borderBottom: '1.5px solid var(--border-platinum-strong)',
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--petrol-deep)',
              padding: '0 18px',
              color: 'var(--accent-copper)',
              fontSize: '1rem',
            }}
          >
            ✦
          </span>

          <span
            className="cinzel-heading"
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent-platinum)',
              display: 'block',
              marginBottom: '24px',
              fontWeight: 600,
            }}
          >
            Manifiesto Literario
          </span>

          <blockquote
            className="serif-delicate"
            style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              margin: '0 auto 28px',
              maxWidth: '720px',
            }}
          >
            &ldquo;Escribir no es inventar vidas ajenas, sino encender una lámpara en los rincones donde todas nos reconocemos.&rdquo;
          </blockquote>

          <div
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'var(--border-platinum)',
              margin: '0 auto 20px',
            }}
          />

          <p
            className="cinzel-heading"
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.06em',
              margin: 0,
            }}
          >
            Carmen Ibáñez
          </p>

          <span
            style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--petrol-deep)',
              padding: '0 18px',
              color: 'var(--accent-copper)',
              fontSize: '1rem',
            }}
          >
            ✦
          </span>
        </div>
      </section>

      {/* 5. SECCIÓN: PUBLICACIONES (COVER FLOW 3D AZUL PETRÓLEO / PLATINO) */}
      <section
        id="publicaciones"
        style={{
          padding: '110px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            className="petrol-badge-platinum"
            style={{ marginBottom: '14px' }}
          >
            Catálogo de Obras
          </span>
          <h2
            className="serif-delicate"
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
              fontWeight: 600,
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              marginBottom: '14px',
            }}
          >
            Publicaciones
          </h2>
          <p
            className="montserrat-body"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              maxWidth: '580px',
              margin: '0 auto',
            }}
          >
            Cada novela constituye un universo narrativo independiente alojado en su propio micro-sitio inmersivo.
          </p>
        </div>

        {/* Componente Interactivo Cover Flow 3D */}
        <PublicationsCarousel books={displayBooks} />
      </section>

      {/* 6. SECCIÓN: NOTICIAS Y PRENSA */}
      <section
        id="noticias"
        style={{
          padding: '110px 24px',
          borderTop: '1px solid var(--border-platinum)',
          borderBottom: '1px solid var(--border-platinum)',
          backgroundColor: 'var(--petrol-secondary)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span
              className="petrol-badge-platinum"
              style={{ marginBottom: '14px' }}
            >
              Actualidad editorial
            </span>
            <h2
              className="serif-delicate"
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 600,
                lineHeight: 1.2,
                color: 'var(--text-primary)',
              }}
            >
              Noticias y Prensa
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {newsList.length > 0 ? (
              newsList.map((item) => (
                <article
                  key={item.id}
                  className="petrol-card"
                  style={{
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--accent-copper)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '14px',
                        fontWeight: 600,
                      }}
                    >
                      <CalendarIcon size={14} />
                      {new Date(item.published_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    <h3
                      className="serif-delicate"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        marginBottom: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.92rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.75,
                      }}
                    >
                      {item.content.slice(0, 160) + '...'}
                    </p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <Link
                      href="/subdomains/giselle"
                      className="montserrat-body"
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--accent-copper)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Leer artículo</span>
                      <ArrowRightIcon size={14} />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <>
                <article
                  className="petrol-card"
                  style={{
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--accent-copper)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '14px',
                        fontWeight: 600,
                      }}
                    >
                      <CalendarIcon size={14} />
                      24 de Septiembre, 2026
                    </span>
                    <h3
                      className="serif-delicate"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        marginBottom: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      Entrevista exclusiva: El nacimiento del universo de Giselle
                    </h3>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.92rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.75,
                      }}
                    >
                      Carmen Ibáñez reflexiona sobre la génesis de su novela, las complejidades de ambientar una historia de época y la rebeldía de sus personajes.
                    </p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <Link
                      href="/subdomains/giselle"
                      className="montserrat-body"
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--accent-copper)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Leer artículo</span>
                      <ArrowRightIcon size={14} />
                    </Link>
                  </div>
                </article>

                <article
                  className="petrol-card"
                  style={{
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--accent-copper)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '14px',
                        fontWeight: 600,
                      }}
                    >
                      <CalendarIcon size={14} />
                      15 de Septiembre, 2026
                    </span>
                    <h3
                      className="serif-delicate"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        marginBottom: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      Crítica literaria: La vigencia del deseo de libertad femenina
                    </h3>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.92rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.75,
                      }}
                    >
                      Un análisis detallado de los hilos temáticos que tejen la trama de Giselle y su diálogo con los desafíos afectivos contemporáneos.
                    </p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <Link
                      href="/subdomains/giselle"
                      className="montserrat-body"
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--accent-copper)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Leer artículo</span>
                      <ArrowRightIcon size={14} />
                    </Link>
                  </div>
                </article>

                <article
                  className="petrol-card"
                  style={{
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--accent-copper)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '14px',
                        fontWeight: 600,
                      }}
                    >
                      <CalendarIcon size={14} />
                      02 de Septiembre, 2026
                    </span>
                    <h3
                      className="serif-delicate"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        marginBottom: '14px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      Edición especial de colección en preparación
                    </h3>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.92rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.75,
                      }}
                    >
                      Detalles de la primera tirada encuadernada con tipografías históricas y papel libre de ácido para coleccionistas y amantes de la narrativa.
                    </p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <Link
                      href="/subdomains/giselle"
                      className="montserrat-body"
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--accent-copper)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Leer artículo</span>
                      <ArrowRightIcon size={14} />
                    </Link>
                  </div>
                </article>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 7. SECCIÓN: EVENTOS Y FIRMAS */}
      <section
        id="eventos"
        style={{
          padding: '110px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span
            className="petrol-badge-platinum"
            style={{ marginBottom: '14px' }}
          >
            Agenda literaria
          </span>
          <h2
            className="serif-delicate"
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
              fontWeight: 600,
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              marginBottom: '14px',
            }}
          >
            Eventos y Firmas
          </h2>
          <p
            className="montserrat-body"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Encuentros presenciales, firmas de ejemplares y presentaciones en librerías y festivales literarios.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
          }}
        >
          {displayEvents.map((ev) => {
            const formattedDate = new Date(ev.event_date).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });

            return (
              <article
                key={ev.id}
                className="petrol-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Imagen del evento */}
                {ev.image_url && (
                  <div
                    style={{
                      height: '210px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--petrol-secondary)',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={ev.image_url}
                      alt={`Afiche o fotografía de ${ev.title}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'contrast(105%)',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        backgroundColor: 'var(--accent-copper)',
                        color: '#FAF7F2',
                        padding: '4px 14px',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        letterSpacing: '0.04em',
                        fontWeight: 600,
                        border: '1px solid rgba(184, 176, 156, 0.4)',
                      }}
                    >
                      Evento presencial
                    </div>
                  </div>
                )}

                <div style={{ padding: '32px 28px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <span
                    className="montserrat-body"
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--accent-copper)',
                      textTransform: 'capitalize',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '10px',
                      fontWeight: 600,
                    }}
                  >
                    <CalendarIcon size={14} />
                    {formattedDate}
                  </span>

                  <h3
                    className="serif-delicate"
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                      marginBottom: '10px',
                    }}
                  >
                    {ev.title}
                  </h3>

                  <p
                    className="montserrat-body"
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 500,
                    }}
                  >
                    <PinIcon size={14} style={{ color: 'var(--accent-copper)' }} />
                    {ev.location}
                  </p>

                  <p
                    className="montserrat-body"
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      flexGrow: 1,
                    }}
                  >
                    {ev.description}
                  </p>

                  <div style={{ marginTop: '24px' }}>
                    <a
                      href={ev.registration_url || '#contacto'}
                      className="btn-copper-outline"
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '0.88rem',
                        padding: '11px 20px',
                      }}
                    >
                      <span>Confirmar asistencia</span>
                      <ArrowRightIcon size={15} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 8. SECCIÓN: GALERÍA VISUAL */}
      <section
        id="galeria"
        style={{
          padding: '110px 24px',
          borderTop: '1px solid var(--border-platinum)',
          borderBottom: '1px solid var(--border-platinum)',
          backgroundColor: 'var(--petrol-secondary)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span
              className="petrol-badge-platinum"
              style={{ marginBottom: '14px' }}
            >
              Atmósferas y memoria
            </span>
            <h2
              className="cinzel-heading"
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 600,
                lineHeight: 1.2,
                color: 'var(--text-primary)',
                marginBottom: '14px',
              }}
            >
              Galería
            </h2>
            <p
              className="montserrat-body"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              Una ventana al universo estético, inspiraciones y registros fotográficos de la obra de Carmen Ibáñez.
            </p>
          </div>

          {/* Cinta continua interactiva con modal Lightbox */}
          <GalleryMarquee items={displayGallery} />
        </div>
      </section>

      {/* 9. SECCIÓN: CONTACTO Y CORRESPONDENCIA */}
      <section
        id="contacto"
        style={{
          padding: '110px 24px',
          maxWidth: '820px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '46px' }}>
          <span
            className="petrol-badge-platinum"
            style={{ marginBottom: '14px' }}
          >
            Correspondencia
          </span>
          <h2
            className="serif-delicate"
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
              fontWeight: 600,
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              marginBottom: '14px',
            }}
          >
            Contacto
          </h2>
          <p
            className="montserrat-body"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            Para consultas editoriales, correspondencia de lectoras, invitaciones académicas o prensa literaria.
          </p>
        </div>

        {/* Formulario en Tarjeta Petrol */}
        <form
          action="#"
          method="POST"
          className="petrol-card"
          style={{
            padding: '44px 38px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}
        >
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
                style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}
              >
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                placeholder="Su nombre"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-platinum)',
                  fontSize: '0.92rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  backgroundColor: 'var(--petrol-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label
                htmlFor="correo"
                className="montserrat-body"
                style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                required
                placeholder="ejemplo@correo.com"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-platinum)',
                  fontSize: '0.92rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  backgroundColor: 'var(--petrol-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="asunto"
              className="montserrat-body"
              style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}
            >
              Asunto
            </label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              required
              placeholder="Consulta editorial / Invitación / Correspondencia"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-platinum)',
                fontSize: '0.92rem',
                fontFamily: 'inherit',
                outline: 'none',
                backgroundColor: 'var(--petrol-secondary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="mensaje"
              className="montserrat-body"
              style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}
            >
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              required
              placeholder="Escriba su mensaje aquí..."
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-platinum)',
                fontSize: '0.92rem',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                backgroundColor: 'var(--petrol-secondary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-copper"
            style={{
              padding: '15px',
              fontSize: '0.96rem',
              width: '100%',
              marginTop: '4px',
            }}
          >
            <span>Enviar mensaje</span>
            <ArrowRightIcon size={16} />
          </button>
        </form>
      </section>

      {/* 10. FOOTER: AZUL PETRÓLEO PROFUNDO Y PLATINO */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: '#112D2E',
          color: '#FAF7F2',
          padding: '70px 24px 40px',
          borderTop: '1px solid var(--border-platinum)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <img
            src="/images/logo-ci.png"
            alt="Monograma Carmen Ibáñez"
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'contain',
              marginBottom: '18px',
              filter: 'brightness(1.8) contrast(90%) drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
            }}
          />

          <p
            className="cinzel-heading"
            style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              marginBottom: '6px',
              color: 'var(--text-primary)',
            }}
          >
            Carmen Ibáñez
          </p>

          <p
            className="serif-delicate"
            style={{
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: 'var(--accent-platinum)',
              marginBottom: '36px',
            }}
          >
            Historias que también viven en nosotras
          </p>

          {/* Enlaces de correspondencia y redes */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '32px',
              marginBottom: '44px',
            }}
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="montserrat-body petrol-footer-link"
            >
              Instagram
            </a>
            <a
              href="https://goodreads.com"
              target="_blank"
              rel="noopener noreferrer"
              className="montserrat-body petrol-footer-link"
            >
              Goodreads
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="montserrat-body petrol-footer-link"
            >
              TikTok Literario
            </a>
            <a
              href="mailto:contacto@carmenibanez.cl"
              className="montserrat-body petrol-footer-link"
            >
              Contacto Editorial / Prensa
            </a>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              height: '1px',
              backgroundColor: 'var(--border-platinum-subtle)',
              marginBottom: '28px',
            }}
          />

          <p
            className="montserrat-body"
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            © 2026 Carmen Ibáñez. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
