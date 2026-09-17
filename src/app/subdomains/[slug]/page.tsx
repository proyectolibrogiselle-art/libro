import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BooksService } from '@/lib/supabase/books.service';
import { Book } from '@/types/book';

interface SubdomainPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SubdomainPageProps): Promise<Metadata> {
  const { slug } = await params;
  let book: Book | null = null;

  try {
    book = await BooksService.getPublishedBookBySlug(slug);
  } catch {
    // Silencioso para fallback
  }

  const title = book?.title || (slug.toLowerCase() === 'giselle' ? 'Giselle' : slug);
  const description =
    'Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas. Novela oficial de Carmen Ibáñez.';

  return {
    title: `${title} — Novela de Carmen Ibáñez`,
    description,
    openGraph: {
      title: `${title} — Carmen Ibáñez`,
      description,
      images: ['/images/giselle-2.jpg'],
    },
  };
}

export default async function BookSubdomainPage({ params }: SubdomainPageProps) {
  const { slug } = await params;
  let book: Book | null = null;

  try {
    book = await BooksService.getPublishedBookBySlug(slug);
  } catch (err) {
    console.warn(`[Subdomain] Error cargando libro '${slug}':`, err);
  }

  // Datos editoriales oficiales y definitivos de 'Giselle'
  if (!book && slug.toLowerCase() === 'giselle') {
    book = {
      id: 'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
      title: 'Giselle',
      slug: 'giselle',
      synopsis:
        'Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas. En una época marcada por las apariencias, las convenciones familiares y aquello que se esperaba de una mujer, Giselle intenta construir su vida bajo sus propias reglas. Amores, decisiones, deseos, pérdidas y contradicciones irán trazando un camino en el que cada elección tendrá consecuencias. A su alrededor, otras historias también avanzan: familias que se forman, relaciones que se transforman y personajes que aman, juzgan, perdonan o abandonan. Giselle es una novela sobre la libertad, el amor, la dependencia y las decisiones que pueden acompañarnos durante toda una vida. Pero, sobre todo, es la historia de una mujer que quiso vivir sin pedir permiso.',
      status: 'published',
      cover_url: '/images/giselle-2.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (!book) {
    notFound();
  }

  const isGiselle = slug.toLowerCase() === 'giselle';
  const coverImage = isGiselle ? '/images/giselle-2.jpg' : (book.cover_url || '/images/giselle-2.jpg');

  return (
    <div
      style={{
        backgroundColor: '#0A0A0A',
        color: '#EAEAEA',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.04) 0%, transparent 60%),
          radial-gradient(circle at 10% 40%, rgba(255, 255, 255, 0.02) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 40%)
        `,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 1. NAVEGACIÓN CINEMATOGRÁFICA OSCURA */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
          {/* Retorno al Sitio de la Autora */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#A0A0A0',
              fontSize: '0.86rem',
              letterSpacing: '0.03em',
            }}
            className="montserrat-body"
          >
            <span style={{ fontSize: '1rem' }}>←</span>
            <span>Carmen Ibáñez (Inicio)</span>
          </Link>

          {/* Marca de la Novela */}
          <span
            className="cinzel-decorative"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
            }}
          >
            {book.title}
          </span>

          {/* Acciones Rápidas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a
              href="#sinopsis"
              className="montserrat-body"
              style={{ fontSize: '0.84rem', color: '#B0B0B0' }}
            >
              Sinopsis
            </a>
            <a
              href="#avances"
              className="montserrat-body"
              style={{ fontSize: '0.84rem', color: '#B0B0B0' }}
            >
              Avances
            </a>
            <a
              href="#club-lectura"
              className="btn-ivory"
              style={{
                padding: '8px 18px',
                fontSize: '0.8rem',
              }}
            >
              Club de lectura
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO DEL LIBRO: LUXURY DARK CINEMATOGRÁFICO EN BLANCO Y NEGRO */}
      <section
        style={{
          padding: '70px 24px 100px',
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
          {/* Zona Destacada: Portada de la Novela (La escena nocturna bajo la lluvia con el taxi y el hotel) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 255, 255, 0.03)',
              }}
            >
              <img
                src={coverImage}
                alt="Portada oficial de Giselle — Carmen Ibáñez"
                style={{
                  width: '100%',
                  maxWidth: '430px',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'block',
                  filter: 'contrast(105%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  backgroundColor: 'rgba(10, 10, 10, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                }}
              >
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.06em', color: '#EAEAEA' }}>
                  Edición oficial
                </span>
              </div>
            </div>
          </div>

          {/* Información Principal del Hero */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                marginBottom: '24px',
              }}
            >
              <span style={{ fontSize: '0.72rem', color: '#D4D4D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Novela · Ficción dramática
              </span>
            </div>

            <h1
              className="cinzel-decorative"
              style={{
                fontSize: 'clamp(3.2rem, 6vw, 4.8rem)',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                marginBottom: '16px',
              }}
            >
              {book.title}
            </h1>

            <p
              className="cinzel-heading"
              style={{
                fontSize: '1.2rem',
                color: '#A0A0A0',
                letterSpacing: '0.06em',
                marginBottom: '28px',
              }}
            >
              Una novela de Carmen Ibáñez
            </p>

            <blockquote
              style={{
                borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
                paddingLeft: '20px',
                marginBottom: '36px',
              }}
            >
              <p
                className="serif-delicate"
                style={{
                  fontSize: '1.35rem',
                  fontStyle: 'italic',
                  color: '#FFFFFF',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                &ldquo;Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas.&rdquo;
              </p>
            </blockquote>

            <p
              className="montserrat-body"
              style={{
                fontSize: '0.98rem',
                lineHeight: 1.85,
                color: '#B0B0B0',
                marginBottom: '40px',
                maxWidth: '540px',
              }}
            >
              Una inmersión literaria nocturna en los pasillos de la culpa, el deseo y la búsqueda irrevocable de autonomía.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <a href="#sinopsis" className="btn-ivory">
                Leer sinopsis completa →
              </a>
              <a href="#club-lectura" className="btn-dark-outline">
                Unirse al Club de Lectura
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: SINOPSIS REAL INTEGRADA */}
      <section
        id="sinopsis"
        style={{
          backgroundColor: '#0E0E0E',
          padding: '120px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span
              className="cinzel-heading"
              style={{
                fontSize: '0.78rem',
                color: '#8A8A8A',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Argumento oficial
            </span>
            <h2
              className="serif-delicate"
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: '#FFFFFF',
              }}
            >
              Sinopsis de la obra
            </h2>
          </div>

          <div
            className="glass-noir-card"
            style={{
              padding: '52px 48px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Texto Real Oficial Íntegro */}
            <p
              className="montserrat-body"
              style={{
                fontSize: '1.14rem',
                lineHeight: 2.15,
                color: '#D8D8D8',
                textAlign: 'justify',
                marginBottom: '32px',
                fontWeight: 300,
              }}
            >
              Hay mujeres que nacen dispuestas a aceptar el mundo que les tocó vivir. Giselle no es una de ellas. En una época marcada por las apariencias, las convenciones familiares y aquello que se esperaba de una mujer, Giselle intenta construir su vida bajo sus propias reglas. Amores, decisiones, deseos, pérdidas y contradicciones irán trazando un camino en el que cada elección tendrá consecuencias. A su alrededor, otras historias también avanzan: familias que se forman, relaciones que se transforman y personajes que aman, juzgan, perdonan o abandonan. Giselle es una novela sobre la libertad, el amor, la dependencia y las decisiones que pueden acompañarnos durante toda una vida. Pero, sobre todo, es la historia de una mujer que quiso vivir sin pedir permiso.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '36px 0 20px',
              }}
            >
              <div
                style={{
                  height: '1px',
                  width: '80px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
              <span style={{ margin: '0 16px', color: '#888888', fontSize: '0.9rem' }}>✦</span>
              <div
                style={{
                  height: '1px',
                  width: '80px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            <p
              className="serif-delicate"
              style={{
                textAlign: 'center',
                fontSize: '1.35rem',
                fontStyle: 'italic',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              &ldquo;Quiso vivir sin pedir permiso.&rdquo;
            </p>
          </div>

          {/* Ejes Temáticos de Giselle */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginTop: '48px',
            }}
          >
            <div
              style={{
                padding: '24px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <p className="cinzel-heading" style={{ fontSize: '0.88rem', color: '#FFFFFF', marginBottom: '8px' }}>
                La libertad
              </p>
              <p className="montserrat-body" style={{ fontSize: '0.84rem', color: '#999999', lineHeight: 1.7, margin: 0 }}>
                La resistencia frente a los mandatos impuestos y la valentía de construir un destino propio.
              </p>
            </div>

            <div
              style={{
                padding: '24px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <p className="cinzel-heading" style={{ fontSize: '0.88rem', color: '#FFFFFF', marginBottom: '8px' }}>
                Amor y dependencia
              </p>
              <p className="montserrat-body" style={{ fontSize: '0.84rem', color: '#999999', lineHeight: 1.7, margin: 0 }}>
                Las complejidades afectivas donde la devoción y la necesidad de autonomía entran en pugna.
              </p>
            </div>

            <div
              style={{
                padding: '24px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <p className="cinzel-heading" style={{ fontSize: '0.88rem', color: '#FFFFFF', marginBottom: '8px' }}>
                Elecciones de vida
              </p>
              <p className="montserrat-body" style={{ fontSize: '0.84rem', color: '#999999', lineHeight: 1.7, margin: 0 }}>
                Decisiones individuales que arrastran consecuencias irrevocables para una vida entera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DE AVANCES EXCLUSIVOS & CLUB DE LECTURA */}
      <section
        id="avances"
        style={{
          padding: '120px 24px',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span
            className="cinzel-heading"
            style={{
              fontSize: '0.78rem',
              color: '#8A8A8A',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Comunidad literaria
          </span>
          <h2
            className="serif-delicate"
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: '#FFFFFF',
            }}
          >
            Avances y club de lectura
          </h2>
        </div>

        {/* Tarjeta de Cristal Oscuro con Desenfoque (Glassmorphism Dark) */}
        <div
          id="club-lectura"
          className="glass-noir-card"
          style={{
            padding: '54px 44px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#A0A0A0',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                Acceso prioritario
              </span>
              <h3
                className="cinzel-heading"
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginBottom: '14px',
                  lineHeight: 1.3,
                }}
              >
                Club de lectura de Giselle
              </h3>
              <p
                className="montserrat-body"
                style={{
                  fontSize: '0.94rem',
                  color: '#B0B0B0',
                  lineHeight: 1.8,
                  marginBottom: '20px',
                }}
              >
                Inscríbete para recibir los fragmentos de apertura antes de la salida comercial, acceder a notas exclusivas del manuscrito de Carmen Ibáñez y formar parte del conversatorio digital de lanzamiento.
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <li className="montserrat-body" style={{ fontSize: '0.84rem', color: '#D4D4D4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✓</span> Lectura anticipada de los primeros capítulos
                </li>
                <li className="montserrat-body" style={{ fontSize: '0.84rem', color: '#D4D4D4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✓</span> Invitaciones a encuentros privados con la autora
                </li>
                <li className="montserrat-body" style={{ fontSize: '0.84rem', color: '#D4D4D4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✓</span> Notificación de preventa numerada y firmada
                </li>
              </ul>
            </div>

            {/* Formulario de Suscripción al Club */}
            <form
              action="#"
              method="POST"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                padding: '36px 30px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <div>
                <label
                  htmlFor="club-nombre"
                  className="montserrat-body"
                  style={{ fontSize: '0.82rem', color: '#D4D4D4', display: 'block', marginBottom: '8px' }}
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="club-nombre"
                  name="nombre"
                  required
                  placeholder="Tu nombre"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="club-correo"
                  className="montserrat-body"
                  style={{ fontSize: '0.82rem', color: '#D4D4D4', display: 'block', marginBottom: '8px' }}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="club-correo"
                  name="correo"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-ivory"
                style={{
                  padding: '13px',
                  fontSize: '0.9rem',
                  marginTop: '6px',
                  width: '100%',
                }}
              >
                Unirme al club de lectura →
              </button>

              <p
                className="montserrat-body"
                style={{
                  fontSize: '0.74rem',
                  color: '#737373',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                Respetamos tu privacidad. Solo comunicaciones literarias exclusivas.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* 5. FOOTER DEL SUBDOMINIO */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: '#050505',
          color: '#8A8A8A',
          padding: '60px 24px 36px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
          <span
            className="cinzel-decorative"
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              marginBottom: '8px',
            }}
          >
            {book.title}
          </span>

          <p
            className="serif-delicate"
            style={{
              fontSize: '1rem',
              fontStyle: 'italic',
              color: '#A8A8A8',
              marginBottom: '28px',
            }}
          >
            Una novela de Carmen Ibáñez
          </p>

          <div style={{ marginBottom: '32px' }}>
            <Link
              href="/"
              className="montserrat-body"
              style={{
                fontSize: '0.86rem',
                color: '#D4D4D4',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}
            >
              ← Regresar al sitio principal de la autora (carmenibanez.cl)
            </Link>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              marginBottom: '24px',
            }}
          />

          <p
            className="montserrat-body"
            style={{
              fontSize: '0.76rem',
              color: '#666666',
              margin: 0,
            }}
          >
            © 2026 Carmen Ibáñez. Micro-sitio literario de Giselle. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
