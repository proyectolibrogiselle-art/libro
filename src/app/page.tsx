import Link from 'next/link';
import { BooksService } from '@/lib/supabase/books.service';
import { EventsService, GalleryService, NewsService } from '@/lib/supabase/modules.service';
import { Book } from '@/types/book';
import { EventItem, GalleryItem, News } from '@/types/entities';
import PublicationsCarousel from '@/components/PublicationsCarousel';

// Revalidación periódica (ISR)
export const revalidate = 60;

export default async function HomePage() {
  let books: Book[] = [];
  let newsList: News[] = [];
  let eventsList: EventItem[] = [];
  let galleryList: GalleryItem[] = [];

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

  // Fallbacks de alta estética editorial para Eventos si aún no hay registros creados en Supabase
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
      title: 'Manuscritos y Notas de Creación',
      description: 'Anotaciones sobre los vínculos, mandatos familiares y la voz de Giselle.',
      image_url: '/images/giselle-portada.png',
      category: 'Eventos',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FAFAFA',
        color: '#121212',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 1. NAVEGACIÓN PRINCIPAL SOBRIA EN BLANCO Y NEGRO (MEJORA 4: MENÚ OFICIAL REESTRUCTURADO) */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(250, 250, 250, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(18, 18, 18, 0.08)',
          padding: '16px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Logotipo / Monograma de Carmen Ibáñez */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#121212',
              flexShrink: 0,
            }}
          >
            <img
              src="/images/logo-ci.png"
              alt="Monograma Carmen Ibáñez"
              style={{
                width: '38px',
                height: '38px',
                objectFit: 'contain',
                filter: 'grayscale(100%) brightness(0.2)',
              }}
            />
            <span
              className="cinzel-heading"
              style={{
                fontSize: '1.26rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              Carmen Ibáñez
            </span>
          </Link>

          {/* MENÚ OFICIAL REESTRUCTURADO EN ORDEN EXACTO (MEJORA 4: SIN BOTÓN AISLADO 'GISELLE') */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="#inicio"
              className="montserrat-body"
              style={{
                fontSize: '0.88rem',
                color: '#262626',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
            >
              Inicio
            </a>
            <a
              href="#la-autora"
              className="montserrat-body"
              style={{
                fontSize: '0.88rem',
                color: '#262626',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
            >
              La Autora
            </a>
            <a
              href="#publicaciones"
              className="montserrat-body"
              style={{
                fontSize: '0.88rem',
                color: '#262626',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
            >
              Publicaciones
            </a>
            <a
              href="#noticias"
              className="montserrat-body"
              style={{
                fontSize: '0.88rem',
                color: '#262626',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
            >
              Noticias
            </a>
            <a
              href="#eventos"
              className="montserrat-body"
              style={{
                fontSize: '0.88rem',
                color: '#262626',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
            >
              Eventos
            </a>
            <a
              href="#galeria"
              className="montserrat-body"
              style={{
                fontSize: '0.88rem',
                color: '#262626',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
            >
              Galería
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION: LOOK EDITORIAL EN BLANCO Y NEGRO (#INICIO) */}
      <section
        id="inicio"
        style={{
          padding: '80px 24px 100px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Columna Izquierda: Identidad y Proclama Literaria */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid rgba(18, 18, 18, 0.15)',
                backgroundColor: 'rgba(18, 18, 18, 0.03)',
                marginBottom: '28px',
              }}
            >
              <span style={{ fontSize: '0.72rem', color: '#121212', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                Autora chilena · Narrativa contemporánea
              </span>
            </div>

            <div className="ink-stroke-wrapper" style={{ marginBottom: '18px' }}>
              <h1
                className="cinzel-heading ink-stroke-text"
                style={{
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)',
                  fontWeight: 600,
                  lineHeight: 1.12,
                  letterSpacing: '0.03em',
                  margin: 0,
                  color: '#1A1A1A',
                }}
              >
                Carmen Ibáñez
              </h1>
              <span className="ink-pen-tip" aria-hidden="true" />
            </div>

            <div className="fade-in-ink-hero-details">
              <p
                className="serif-delicate"
                style={{
                  fontSize: '1.45rem',
                  fontStyle: 'italic',
                  color: '#404040',
                  lineHeight: 1.5,
                  marginBottom: '24px',
                }}
              >
                Historias que también viven en nosotras
              </p>

              <p
                className="montserrat-body"
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.9,
                  color: '#525252',
                  maxWidth: '520px',
                  marginBottom: '36px',
                }}
              >
                Una exploración literaria íntima de los vínculos, las emociones ocultas y aquellas elecciones capaces de transformar el destino de las personas.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <Link href="/subdomains/giselle" className="btn-noir">
                  Ingresar a la obra Giselle →
                </Link>
                <a href="#la-autora" className="btn-noir-outline">
                  Sobre la autora
                </a>
              </div>

              {/* Cita en bloque tipográfico */}
              <div
                style={{
                  marginTop: '44px',
                  paddingLeft: '20px',
                  borderLeft: '2px solid #121212',
                }}
              >
                <p
                  className="serif-delicate"
                  style={{
                    fontSize: '1.08rem',
                    fontStyle: 'italic',
                    color: '#262626',
                    lineHeight: 1.7,
                  }}
                >
                  &ldquo;Escribe desde la observación de las emociones y de aquello que muchas veces permanece oculto detrás de las apariencias.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Fotografía Oficial en Blanco y Negro */}
          <div style={{ position: 'relative' }} className="fade-in-ink-hero-details">
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#121212',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(18, 18, 18, 0.12)',
              }}
            >
              <img
                src="/images/giselle-portada.png"
                alt="Carmen Ibáñez — Fotografía oficial de la autora"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '620px',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'grayscale(100%) contrast(108%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                  padding: '30px 24px 20px',
                  color: '#FAFAFA',
                }}
              >
                <p className="cinzel-heading" style={{ fontSize: '1rem', letterSpacing: '0.04em', margin: 0 }}>
                  Carmen Ibáñez
                </p>
                <p className="montserrat-body" style={{ fontSize: '0.82rem', color: '#D4D4D4', margin: 0 }}>
                  Retrato literario oficial
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: SOBRE LA AUTORA (MEJORA 4: #LA-AUTORA) */}
      <section
        id="la-autora"
        className="fade-in-editorial-sobre-mi"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '110px 24px',
          borderTop: '1px solid rgba(18, 18, 18, 0.08)',
          borderBottom: '1px solid rgba(18, 18, 18, 0.08)',
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
              className="cinzel-heading"
              style={{
                fontSize: '0.82rem',
                color: '#737373',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Semblanza literaria
            </span>
            <h2
              className="serif-delicate"
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: '#121212',
              }}
            >
              Sobre la autora
            </h2>
          </div>

          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
            }}
          >
            {/* Texto Real Oficial */}
            <p
              className="montserrat-body"
              style={{
                fontSize: '1.18rem',
                lineHeight: 2.1,
                color: '#262626',
                textAlign: 'justify',
                marginBottom: '32px',
                fontWeight: 300,
              }}
            >
              Carmen Ibáñez es una autora chilena que encuentra en la escritura una forma de explorar las emociones, las decisiones y las contradicciones que marcan la vida de las personas, especialmente el universo femenino. Su narrativa pone especial atención en los vínculos, el amor, la familia, la libertad, la culpa y aquellas elecciones capaces de cambiar una vida completa. Escribe desde la observación de las emociones y de aquello que muchas veces permanece oculto detrás de las apariencias.
            </p>

            {/* Pilares Temáticos en Tarjetas Escala de Grises */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
                marginTop: '48px',
              }}
            >
              <div
                className="glass-ivory-card"
                style={{
                  padding: '28px 24px',
                  border: '1px solid rgba(18, 18, 18, 0.08)',
                }}
              >
                <p className="cinzel-heading" style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '10px', color: '#121212' }}>
                  El universo femenino
                </p>
                <p className="montserrat-body" style={{ fontSize: '0.88rem', color: '#525252', lineHeight: 1.7 }}>
                  La mirada íntima sobre los anhelos, contradicciones y mandatos que atraviesan la vida de las mujeres.
                </p>
              </div>

              <div
                className="glass-ivory-card"
                style={{
                  padding: '28px 24px',
                  border: '1px solid rgba(18, 18, 18, 0.08)',
                }}
              >
                <p className="cinzel-heading" style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '10px', color: '#121212' }}>
                  Vínculos y libertad
                </p>
                <p className="montserrat-body" style={{ fontSize: '0.88rem', color: '#525252', lineHeight: 1.7 }}>
                  El amor, la familia y la búsqueda constante de vivir bajo las propias reglas sin pedir permiso.
                </p>
              </div>

              <div
                className="glass-ivory-card"
                style={{
                  padding: '28px 24px',
                  border: '1px solid rgba(18, 18, 18, 0.08)',
                }}
              >
                <p className="cinzel-heading" style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '10px', color: '#121212' }}>
                  Decisiones y destino
                </p>
                <p className="montserrat-body" style={{ fontSize: '0.88rem', color: '#525252', lineHeight: 1.7 }}>
                  Elecciones trascendentales y aquello que permanece oculto detrás de la superficie social.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: PUBLICACIONES CON CARRUSEL COVER FLOW TRIDIMENSIONAL (MEJORAS 4 Y 5: #PUBLICACIONES) */}
      <section
        id="publicaciones"
        className="fade-in-editorial-novela"
        style={{
          padding: '110px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            className="cinzel-heading"
            style={{
              fontSize: '0.82rem',
              color: '#737373',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Catálogo de Obras
          </span>
          <h2
            className="serif-delicate"
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: '#121212',
              marginBottom: '14px',
            }}
          >
            Publicaciones
          </h2>
          <p
            className="montserrat-body"
            style={{
              color: '#666666',
              fontSize: '1rem',
              maxWidth: '580px',
              margin: '0 auto',
            }}
          >
            Cada novela constituye un universo narrativo independiente alojado en su propio micro-sitio inmersivo.
          </p>
        </div>

        {/* COMPONENTE INTERACTIVO 3D STACKED / COVER FLOW */}
        <PublicationsCarousel books={displayBooks} />
      </section>

      {/* 5. SECCIÓN: NOTICIAS Y PRENSA (MEJORA 4: #NOTICIAS) */}
      <section
        id="noticias"
        className="fade-in-editorial-novedades"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '110px 24px',
          borderTop: '1px solid rgba(18, 18, 18, 0.08)',
          borderBottom: '1px solid rgba(18, 18, 18, 0.08)',
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
              className="cinzel-heading"
              style={{
                fontSize: '0.82rem',
                color: '#737373',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Actualidad editorial
            </span>
            <h2
              className="serif-delicate"
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: '#121212',
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
                  className="glass-ivory-card"
                  style={{
                    padding: '36px 30px',
                    border: '1px solid rgba(18, 18, 18, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: '#737373',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '12px',
                      }}
                    >
                      {new Date(item.published_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    <h3
                      className="serif-delicate"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        marginBottom: '14px',
                        color: '#121212',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.92rem',
                        color: '#525252',
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
                        fontWeight: 500,
                        color: '#121212',
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                      }}
                    >
                      Leer artículo completo →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <>
                {/* Noticia Curada 1 */}
                <article
                  className="glass-ivory-card"
                  style={{
                    padding: '36px 30px',
                    border: '1px solid rgba(18, 18, 18, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: '#737373',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '12px',
                      }}
                    >
                      Lanzamiento oficial
                    </span>
                    <h3
                      className="serif-delicate"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        marginBottom: '14px',
                        color: '#121212',
                        lineHeight: 1.3,
                      }}
                    >
                      La gestación de Giselle: un viaje hacia la libertad personal
                    </h3>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.92rem',
                        color: '#525252',
                        lineHeight: 1.75,
                      }}
                    >
                      Un recorrido por el proceso creativo detrás de la novela, las preguntas iniciales sobre el universo femenino y las decisiones que marcaron a sus personajes.
                    </p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <Link
                      href="/subdomains/giselle"
                      className="montserrat-body"
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 500,
                        color: '#121212',
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                      }}
                    >
                      Conocer más →
                    </Link>
                  </div>
                </article>

                {/* Noticia Curada 2 */}
                <article
                  className="glass-ivory-card"
                  style={{
                    padding: '36px 30px',
                    border: '1px solid rgba(18, 18, 18, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: '#737373',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '12px',
                      }}
                    >
                      Club de lectura
                    </span>
                    <h3
                      className="serif-delicate"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        marginBottom: '14px',
                        color: '#121212',
                        lineHeight: 1.3,
                      }}
                    >
                      Primer capítulo disponible para lectoras registradas
                    </h3>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.92rem',
                        color: '#525252',
                        lineHeight: 1.75,
                      }}
                    >
                      Acceso prioritario a las páginas de apertura antes de la llegada de la novela a las librerías. Inscripciones abiertas a la comunidad de lectoras.
                    </p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <Link
                      href="/subdomains/giselle#club-lectura"
                      className="montserrat-body"
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 500,
                        color: '#121212',
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                      }}
                    >
                      Unirse al club →
                    </Link>
                  </div>
                </article>

                {/* Noticia Curada 3 */}
                <article
                  className="glass-ivory-card"
                  style={{
                    padding: '36px 30px',
                    border: '1px solid rgba(18, 18, 18, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: '#737373',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '12px',
                      }}
                    >
                      Encuentros literarios
                    </span>
                    <h3
                      className="serif-delicate"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        marginBottom: '14px',
                        color: '#121212',
                        lineHeight: 1.3,
                      }}
                    >
                      Ciclo de conversaciones sobre emociones y narrativa femenina
                    </h3>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.92rem',
                        color: '#525252',
                        lineHeight: 1.75,
                      }}
                    >
                      Espacios de diálogo íntimo sobre los vínculos, la culpa, el amor y los mandatos que inspiraron la creación de los personajes de Giselle.
                    </p>
                  </div>
                  <div style={{ marginTop: '24px' }}>
                    <a
                      href="#contacto"
                      className="montserrat-body"
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 500,
                        color: '#121212',
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                      }}
                    >
                      Consultar fechas →
                    </a>
                  </div>
                </article>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN: EVENTOS Y FIRMAS (MEJORA 4: #EVENTOS - CON IMAGEN DE EVENTO SOPORTADA) */}
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
            className="cinzel-heading"
            style={{
              fontSize: '0.82rem',
              color: '#737373',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Agenda literaria
          </span>
          <h2
            className="serif-delicate"
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: '#121212',
              marginBottom: '14px',
            }}
          >
            Eventos y Firmas
          </h2>
          <p
            className="montserrat-body"
            style={{
              color: '#666666',
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
                className="glass-ivory-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(18, 18, 18, 0.09)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                }}
              >
                {/* Imagen del evento (MEJORA 2: CAMPO IMAGE_URL) */}
                {ev.image_url && (
                  <div
                    style={{
                      height: '210px',
                      overflow: 'hidden',
                      backgroundColor: '#121212',
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
                        filter: 'grayscale(70%) contrast(105%)',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        backgroundColor: 'rgba(18, 18, 18, 0.85)',
                        color: '#FAFAFA',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        letterSpacing: '0.04em',
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
                      color: '#737373',
                      textTransform: 'capitalize',
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}
                  >
                    📅 {formattedDate}
                  </span>

                  <h3
                    className="serif-delicate"
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 600,
                      color: '#121212',
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
                      color: '#666666',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    📍 {ev.location}
                  </p>

                  <p
                    className="montserrat-body"
                    style={{
                      fontSize: '0.92rem',
                      color: '#404040',
                      lineHeight: 1.7,
                      flexGrow: 1,
                    }}
                  >
                    {ev.description}
                  </p>

                  <div style={{ marginTop: '24px' }}>
                    <a
                      href={ev.registration_url || '#contacto'}
                      className="btn-noir-outline"
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '0.86rem',
                        padding: '10px 20px',
                      }}
                    >
                      Confirmar asistencia →
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 7. SECCIÓN: GALERÍA VISUAL (MEJORA 4: #GALERIA) */}
      <section
        id="galeria"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '110px 24px',
          borderTop: '1px solid rgba(18, 18, 18, 0.08)',
          borderBottom: '1px solid rgba(18, 18, 18, 0.08)',
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
              className="cinzel-heading"
              style={{
                fontSize: '0.82rem',
                color: '#737373',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Atmósferas y memoria
            </span>
            <h2
              className="serif-delicate"
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: '#121212',
                marginBottom: '14px',
              }}
            >
              Galería Visual
            </h2>
            <p
              className="montserrat-body"
              style={{
                color: '#666666',
                fontSize: '1rem',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              Una ventana al universo estético, inspiraciones y registros fotográficos de la obra de Carmen Ibáñez.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {displayGallery.map((item) => (
              <figure
                key={item.id}
                className="group"
                style={{
                  margin: 0,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundColor: '#121212',
                  border: '1px solid rgba(18, 18, 18, 0.1)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.06)',
                  position: 'relative',
                }}
              >
                <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(100%) contrast(106%)',
                      transition: 'transform 0.5s ease, filter 0.5s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '24px 20px',
                      color: '#FAFAFA',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color: '#A3A3A3',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      {item.category || 'Archivo visual'}
                    </span>
                    <h3
                      className="cinzel-heading"
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        margin: 0,
                        marginBottom: '4px',
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className="montserrat-body"
                        style={{
                          fontSize: '0.82rem',
                          color: '#D4D4D4',
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FORMULARIO MINIMALISTA DE CONTACTO */}
      <section
        id="contacto"
        className="fade-in-editorial-contacto"
        style={{
          padding: '110px 24px',
          maxWidth: '820px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span
            className="cinzel-heading"
            style={{
              fontSize: '0.82rem',
              color: '#737373',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Correspondencia
          </span>
          <h2
            className="serif-delicate"
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: '#121212',
              marginBottom: '14px',
            }}
          >
            Contacto
          </h2>
          <p
            className="montserrat-body"
            style={{
              color: '#525252',
              fontSize: '0.98rem',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            Para consultas editoriales, correspondencia de lectoras, entrevistas o invitaciones a conversatorios, por favor complete el siguiente formulario.
          </p>
        </div>

        <form
          action="#"
          method="POST"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '44px 38px',
            borderRadius: '16px',
            border: '1px solid rgba(18, 18, 18, 0.08)',
            boxShadow: '0 15px 40px -10px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label
                htmlFor="nombre"
                className="montserrat-body"
                style={{ fontSize: '0.84rem', fontWeight: 500, color: '#121212', display: 'block', marginBottom: '8px' }}
              >
                Nombre y apellido
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                placeholder="Ej. Francisca Valenzuela"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgba(18, 18, 18, 0.2)',
                  fontSize: '0.92rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  backgroundColor: '#FAFAFA',
                }}
              />
            </div>
            <div>
              <label
                htmlFor="correo"
                className="montserrat-body"
                style={{ fontSize: '0.84rem', fontWeight: 500, color: '#121212', display: 'block', marginBottom: '8px' }}
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
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgba(18, 18, 18, 0.2)',
                  fontSize: '0.92rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  backgroundColor: '#FAFAFA',
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="asunto"
              className="montserrat-body"
              style={{ fontSize: '0.84rem', fontWeight: 500, color: '#121212', display: 'block', marginBottom: '8px' }}
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
                padding: '12px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(18, 18, 18, 0.2)',
                fontSize: '0.92rem',
                fontFamily: 'inherit',
                outline: 'none',
                backgroundColor: '#FAFAFA',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="mensaje"
              className="montserrat-body"
              style={{ fontSize: '0.84rem', fontWeight: 500, color: '#121212', display: 'block', marginBottom: '8px' }}
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
                border: '1px solid rgba(18, 18, 18, 0.2)',
                fontSize: '0.92rem',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                backgroundColor: '#FAFAFA',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-noir"
            style={{
              padding: '14px',
              fontSize: '0.94rem',
              width: '100%',
            }}
          >
            Enviar mensaje
          </button>
        </form>
      </section>

      {/* 9. FOOTER: ENLACES TIPOGRÁFICOS Y REDES SOCIALES */}
      <footer
        className="fade-in-editorial-footer"
        style={{
          marginTop: 'auto',
          backgroundColor: '#121212',
          color: '#FAFAFA',
          padding: '70px 24px 40px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
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
              filter: 'brightness(1.5)',
            }}
          />

          <p
            className="cinzel-heading"
            style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: '6px',
            }}
          >
            Carmen Ibáñez
          </p>

          <p
            className="serif-delicate"
            style={{
              fontSize: '1.05rem',
              fontStyle: 'italic',
              color: '#A3A3A3',
              marginBottom: '36px',
            }}
          >
            Historias que también viven en nosotras
          </p>

          {/* Enlaces a Redes Sociales y Editorial */}
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
              className="montserrat-body"
              style={{
                fontSize: '0.86rem',
                color: '#D4D4D4',
                letterSpacing: '0.04em',
              }}
            >
              Instagram
            </a>
            <a
              href="https://goodreads.com"
              target="_blank"
              rel="noopener noreferrer"
              className="montserrat-body"
              style={{
                fontSize: '0.86rem',
                color: '#D4D4D4',
                letterSpacing: '0.04em',
              }}
            >
              Goodreads
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="montserrat-body"
              style={{
                fontSize: '0.86rem',
                color: '#D4D4D4',
                letterSpacing: '0.04em',
              }}
            >
              TikTok Literario
            </a>
            <a
              href="mailto:contacto@carmenibanez.cl"
              className="montserrat-body"
              style={{
                fontSize: '0.86rem',
                color: '#D4D4D4',
                letterSpacing: '0.04em',
              }}
            >
              Contacto Editorial / Prensa
            </a>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              marginBottom: '28px',
            }}
          />

          <p
            className="montserrat-body"
            style={{
              fontSize: '0.78rem',
              color: '#737373',
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
