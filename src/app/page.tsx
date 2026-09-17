import Link from 'next/link';
import { BooksService } from '@/lib/supabase/books.service';
import { Book } from '@/types/book';

// Revalidación periódica (ISR)
export const revalidate = 60;

export default async function HomePage() {
  let books: Book[] = [];

  try {
    books = await BooksService.getPublishedBooks();
  } catch (err) {
    console.warn('Conexión con Supabase en curso, usando registro fallback:', err);
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
      {/* 1. NAVEGACIÓN PRINCIPAL SOBRIA EN BLANCO Y NEGRO */}
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
          }}
        >
          {/* Logotipo / Nombre de la Autora */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#121212',
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
                fontSize: '1.28rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              Carmen Ibáñez
            </span>
          </Link>

          {/* Menú de Navegación */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            <a
              href="#sobre-mi"
              className="montserrat-body"
              style={{ fontSize: '0.88rem', color: '#404040', fontWeight: 400 }}
            >
              Sobre la autora
            </a>
            <a
              href="#novela"
              className="montserrat-body"
              style={{ fontSize: '0.88rem', color: '#404040', fontWeight: 400 }}
            >
              Giselle
            </a>
            <a
              href="#novedades"
              className="montserrat-body"
              style={{ fontSize: '0.88rem', color: '#404040', fontWeight: 400 }}
            >
              Novedades
            </a>
            <a
              href="#contacto"
              className="montserrat-body"
              style={{ fontSize: '0.88rem', color: '#404040', fontWeight: 400 }}
            >
              Contacto
            </a>
            <Link
              href="/subdomains/giselle"
              className="btn-noir"
              style={{
                padding: '9px 20px',
                fontSize: '0.84rem',
              }}
            >
              Ingresar a Giselle →
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION: LOOK EDITORIAL EN BLANCO Y NEGRO */}
      <section
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
                <a href="#sobre-mi" className="btn-noir-outline">
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

      {/* 3. SECCIÓN: SOBRE LA AUTORA (TEXTO REAL OFICIAL) */}
      <section
        id="sobre-mi"
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

      {/* 4. SECCIÓN: BIBLIOTECA (LA NOVELA GISELLE) */}
      <section
        id="novela"
        className="fade-in-editorial-novela"
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
            Obra literaria
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
            Biblioteca de la autora
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

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {displayBooks.map((book) => {
            const isGiselle = book.slug === 'giselle';
            const bookCover = isGiselle ? '/images/giselle-2.jpg' : (book.cover_url || '/images/giselle-2.jpg');
            const targetUrl = `/subdomains/${book.slug || 'giselle'}`;

            return (
              <article
                key={book.id}
                style={{
                  maxWidth: '920px',
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(18, 18, 18, 0.1)',
                  boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.08)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  alignItems: 'stretch',
                }}
              >
                {/* Portada Oficial de la Novela */}
                <div
                  style={{
                    backgroundColor: '#0A0A0A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    position: 'relative',
                  }}
                >
                  <img
                    src={bookCover}
                    alt={`Portada oficial de ${book.title}`}
                    style={{
                      width: '100%',
                      maxHeight: '480px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                    }}
                  >
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                        color: '#121212',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      Próximo lanzamiento
                    </span>
                  </div>
                </div>

                {/* Información y Acción */}
                <div
                  style={{
                    padding: '44px 36px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    className="cinzel-heading"
                    style={{
                      fontSize: '0.78rem',
                      color: '#737373',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Novela · Ficción literaria
                  </span>

                  <h3
                    className="cinzel-decorative"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      lineHeight: 1.15,
                      marginBottom: '10px',
                      color: '#121212',
                    }}
                  >
                    {book.title}
                  </h3>

                  <p
                    className="montserrat-body"
                    style={{
                      fontSize: '0.84rem',
                      color: '#737373',
                      marginBottom: '20px',
                    }}
                  >
                    Por Carmen Ibáñez
                  </p>

                  <p
                    className="montserrat-body"
                    style={{
                      color: '#404040',
                      fontSize: '0.96rem',
                      lineHeight: 1.85,
                      marginBottom: '32px',
                    }}
                  >
                    {book.synopsis}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link
                      href={targetUrl}
                      className="btn-noir"
                      style={{
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      Ingresar a la obra →
                    </Link>
                    <p
                      className="montserrat-body"
                      style={{
                        fontSize: '0.76rem',
                        color: '#8C8C8C',
                        textAlign: 'center',
                        margin: 0,
                      }}
                    >
                      Explora el universo narrativo y la sinopsis completa de Giselle
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. SECCIÓN: AVANCES Y NOVEDADES */}
      <section
        id="novedades"
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
              Avances y novedades
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Novedad 1 */}
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

            {/* Novedad 2 */}
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

            {/* Novedad 3 */}
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
          </div>
        </div>
      </section>

      {/* 6. FORMULARIO MINIMALISTA DE CONTACTO */}
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

      {/* 7. FOOTER: ENLACES TIPOGRÁFICOS Y REDES SOCIALES */}
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
