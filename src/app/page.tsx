import { BooksService } from '@/lib/supabase/books.service';
import { Book } from '@/types/book';

// Revalidación cada 60 segundos (ISR)
export const revalidate = 60;

export default async function HomePage() {
  let books: Book[] = [];

  try {
    books = await BooksService.getPublishedBooks();
  } catch (err) {
    console.warn('Conexión con Supabase en curso, usando registro fallback:', err);
  }

  // Obra inicial emblemática
  const displayBooks: Book[] = books.length > 0 ? books : [
    {
      id: 'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
      title: 'Giselle',
      slug: 'giselle',
      synopsis: 'Una conmovedora travesía literaria entre la luz y las sombras del destino. En las profundidades de un París decimonónico, un pacto silencioso cambiará para siempre el curso de dos almas destinadas a encontrarse tras los telones del drama y la pasión más visceral.',
      status: 'published',
      cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'carmenibanez.cl';
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 1. NAVEGACIÓN DE ALTA JOYERÍA */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(251, 251, 249, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(194, 141, 117, 0.2)',
          padding: '20px 36px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" className="cinzel-decorative" style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '0.22em', color: 'var(--text-primary)' }}>
            <span style={{ fontSize: '1.6rem', color: 'var(--accent-terracotta)' }}>C</span>ARMEN{' '}
            <span style={{ fontSize: '1.6rem', color: 'var(--accent-terracotta)' }}>I</span>BÁÑEZ
          </a>

          <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
            <a href="#biblioteca" className="cinzel-heading" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Biblioteca
            </a>
            <a href="#sobre-mi" className="cinzel-heading" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Biografía
            </a>
            <a href="#circulo" className="cinzel-heading" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Círculo
            </a>
            <a href="/admin" className="btn-outline-luxury" style={{ padding: '8px 20px', fontSize: '0.74rem' }}>
              Panel CMS
            </a>
          </div>
        </div>
      </nav>

      {/* 2. CABECERA HERO MAJESTUOSA (LOOK QUANTUM / IMPERIO) */}
      <header
        style={{
          textAlign: 'center',
          padding: '110px 24px 70px',
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div className="luxury-badge" style={{ marginBottom: '32px' }}>
          Edición de Autor · Literatura de Alta Gama
        </div>

        {/* Hero Name con Cinzel Decorative en Bold y letter-spacing 0.25em */}
        <h1
          className="cinzel-decorative"
          style={{
            fontSize: 'clamp(2.8rem, 7.5vw, 5.8rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '0.25em',
            color: 'var(--text-primary)',
            marginBottom: '36px',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ fontSize: '1.18em', color: 'var(--accent-terracotta)' }}>C</span>ARMEN{' '}
          <span style={{ fontSize: '1.18em', color: 'var(--accent-terracotta)' }}>I</span>BÁÑEZ
        </h1>

        {/* Divisor ornamental de joyería */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: '0 auto 36px', maxWidth: '300px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--accent-terracotta-border)' }} />
          <span style={{ color: 'var(--accent-terracotta)', fontSize: '0.9rem' }}>✦</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--accent-terracotta-border)' }} />
        </div>

        {/* Cita en Grabado de Piedra Poético */}
        <div className="stone-engraving" style={{ maxWidth: '840px', margin: '0 auto 48px' }}>
          <p
            className="cinzel-decorative"
            style={{
              fontSize: 'clamp(1.15rem, 2.4vw, 1.7rem)',
              fontWeight: 400,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
          >
            “Palabras que tejen puentes entre las sombras del alma y la luz de los recuerdos.”
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="#biblioteca" className="btn-terracotta-gold">
            Explorar Biblioteca Privada
          </a>
          <a href="#sobre-mi" className="btn-outline-luxury">
            Biografía de la Autora
          </a>
        </div>
      </header>

      {/* 3. SECCIÓN: BIBLIOTECA PRIVADA (CONSUMIENDO SUPABASE) */}
      <section id="biblioteca" style={{ maxWidth: '1240px', margin: '60px auto 130px', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="luxury-badge" style={{ marginBottom: '16px' }}>
            Catálogo Exclusivo
          </span>
          <h2 className="cinzel-heading" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 600, marginBottom: '14px' }}>
            Biblioteca Privada
          </h2>
          <p className="montserrat-body" style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '600px', margin: '0 auto' }}>
            Cada obra constituye un universo narrativo independiente alojado bajo su propio subdominio dinámico.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '44px' }}>
          {displayBooks.map((book) => {
            const subdomainUrl = isDev
              ? `/subdomains/${book.slug}`
              : `https://${book.slug}.${rootDomain}`;

            return (
              <article key={book.id} className="book-card-luxury">
                {book.cover_url && (
                  <div style={{ height: '420px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-secondary)' }}>
                    <img
                      src={book.cover_url}
                      alt={`Portada de ${book.title}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                    <div style={{ position: 'absolute', top: '18px', right: '18px' }}>
                      <span className="luxury-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
                        {book.status === 'published' ? 'Publicación Oficial' : book.status}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p className="cinzel-heading" style={{ fontSize: '0.72rem', color: 'var(--accent-terracotta)', marginBottom: '8px' }}>
                    Novela Magistral
                  </p>

                  <h3 className="cinzel-decorative" style={{ fontSize: '2.1rem', fontWeight: 700, lineHeight: 1.15, marginBottom: '10px' }}>
                    {book.title}
                  </h3>

                  <p className="cinzel-heading" style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
                    Subdominio: {book.slug}.{rootDomain}
                  </p>

                  <p
                    className="montserrat-body"
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.96rem',
                      lineHeight: 1.85,
                      marginBottom: '32px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {book.synopsis}
                  </p>

                  <a href={subdomainUrl} className="btn-terracotta-gold" style={{ width: '100%', textAlign: 'center' }}>
                    Ingresar al Micro-sitio de la Obra →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. SECCIÓN: BIOGRAFÍA DE LA AUTORA (DOS COLUMNAS EDITORIAL) */}
      <section
        id="sobre-mi"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '120px 24px',
          borderTop: '1px solid rgba(194, 141, 117, 0.2)',
          borderBottom: '1px solid rgba(194, 141, 117, 0.2)',
        }}
      >
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '70px',
            alignItems: 'center',
          }}
        >
          {/* Columna 1: Retrato de la Autora */}
          <div style={{ position: 'relative' }}>
            <div
              className="glass-panel"
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: 'var(--shadow-hover)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=900&auto=format&fit=crop"
                alt="Carmen Ibáñez"
                style={{
                  width: '100%',
                  height: '490px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                  display: 'block',
                }}
              />
            </div>
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                bottom: '-22px',
                right: '-12px',
                padding: '16px 28px',
                border: '1px solid var(--accent-terracotta-border)',
              }}
            >
              <span className="cinzel-decorative" style={{ fontSize: '1.15rem', color: 'var(--accent-terracotta)', fontWeight: 700 }}>
                Carmen Ibáñez
              </span>
            </div>
          </div>

          {/* Columna 2: Texto Biográfico con Montserrat */}
          <div>
            <span className="luxury-badge" style={{ marginBottom: '18px' }}>
              Semblanza Literaria
            </span>

            <h2 className="cinzel-heading" style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', lineHeight: 1.15, marginBottom: '28px' }}>
              Biografía de la Autora
            </h2>

            <div style={{ width: '50px', height: '2px', backgroundColor: 'var(--accent-terracotta)', marginBottom: '32px' }} />

            <blockquote
              className="cinzel-decorative"
              style={{
                fontSize: '1.28rem',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--accent-terracotta-hover)',
                marginBottom: '32px',
                borderLeft: '2px solid var(--accent-terracotta)',
                paddingLeft: '24px',
              }}
            >
              “Escritora de historias cotidianas e intensas. Creo en la literatura como un reflejo de nuestras propias batallas emocionales, transformando el drama de la vida en poesía tangible.”
            </blockquote>

            <p className="montserrat-body" style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.9, marginBottom: '36px' }}>
              A través de una prosa íntima, meticulosa y profundamente humana, Carmen Ibáñez explora los recovecos de la vulnerabilidad, las pasiones truncadas y la redención estética. Sus obras proponen un viaje inmersivo donde el lector no es un mero espectador, sino un cómplice emocional de cada desenlace.
            </p>

            <a href="#circulo" className="btn-terracotta-gold">
              Conocer Eventos Exclusivos →
            </a>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN: CARTAS ÍNTIMAS & CÍRCULO LITERARIO (NEWSLETTER FLOTANTE) */}
      <section
        id="circulo"
        style={{
          maxWidth: '920px',
          margin: '110px auto 140px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '64px 44px',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: 'var(--shadow-hover)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Luz radial decorativa */}
          <div
            style={{
              position: 'absolute',
              top: '-45%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '450px',
              height: '320px',
              background: 'radial-gradient(circle, rgba(194, 141, 117, 0.16) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <span className="luxury-badge" style={{ marginBottom: '18px' }}>
            Círculo de Lectores
          </span>

          <h2 className="cinzel-heading" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', lineHeight: 1.25, marginBottom: '20px' }}>
            Cartas Íntimas & Club de Lectura
          </h2>

          <p
            className="montserrat-body"
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              margin: '0 auto 40px',
              fontSize: '1.02rem',
              lineHeight: 1.85,
            }}
          >
            Accede a fragmentos inéditos, notas personales de redacción de Carmen Ibáñez, convocatorias para lecturas conjuntas y anuncios preferenciales de cada nuevo lanzamiento editorial.
          </p>

          <form
            action="#"
            method="POST"
            style={{
              display: 'flex',
              gap: '14px',
              maxWidth: '540px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <input
              type="email"
              required
              placeholder="Ingresa tu correo electrónico..."
              className="montserrat-body"
              style={{
                flex: '1 1 290px',
                padding: '14px 22px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(194, 141, 117, 0.35)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'var(--text-primary)',
                fontSize: '0.94rem',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-terracotta-gold">
              Suscribirme al Círculo
            </button>
          </form>

          <p className="montserrat-body" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '22px' }}>
            Privacidad absoluta. Solo literatura, reflexiones y anuncios oficiales.
          </p>
        </div>
      </section>

      {/* 6. FOOTER MONUMENTAL */}
      <footer
        style={{
          borderTop: '1px solid rgba(194, 141, 117, 0.2)',
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="cinzel-decorative" style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-primary)', marginBottom: '10px' }}>
          CARMEN IBÁÑEZ
        </p>
        <p className="montserrat-body" style={{ fontSize: '0.86rem', letterSpacing: '0.04em' }}>
          © {new Date().getFullYear()} Todos los derechos reservados. Arquitectura Headless literaria de alta gama.
        </p>
      </footer>
    </div>
  );
}
