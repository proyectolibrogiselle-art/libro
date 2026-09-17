import { BooksService } from '@/lib/supabase/books.service';
import { Book } from '@/types/book';

// Revalidación cada 60 segundos para actualización en vivo desde Supabase
export const revalidate = 60;

export default async function HomePage() {
  let books: Book[] = [];

  try {
    books = await BooksService.getPublishedBooks();
  } catch (err) {
    console.warn('Conexión con Supabase en curso, usando registro fallback:', err);
  }

  // Obra inicial emblemática si la base de datos está recién inicializada
  const displayBooks: Book[] = books.length > 0 ? books : [
    {
      id: 'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
      title: 'Giselle',
      slug: 'giselle',
      synopsis: 'Una conmovedora travesía literaria entre la luz y las sombras del destino. En las profundidades de un París decimonónico, un pacto silencioso cambiará para siempre el curso de dos almas destinadas a encontrarse tras los telones del drama y la pasión.',
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
      {/* 1. NAVEGACIÓN EDITORIAL SUTIL */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(251, 251, 249, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(194, 141, 117, 0.15)',
          padding: '18px 32px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '1.4rem', letterSpacing: '0.12em', textTransform: 'uppercase' }} className="serif-font">
            Carmen Ibáñez
          </a>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', fontSize: '0.9rem', letterSpacing: '0.04em' }}>
            <a href="#biblioteca" style={{ color: 'var(--text-secondary)' }}>Biblioteca</a>
            <a href="#sobre-mi" style={{ color: 'var(--text-secondary)' }}>Sobre Mí</a>
            <a href="#club-lectura" style={{ color: 'var(--text-secondary)' }}>Club de Lectura</a>
            <a href="/admin" className="btn-outline-editorial" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
              Panel CMS
            </a>
          </div>
        </div>
      </nav>

      {/* 2. CABECERA (HERO SECTION) - ROMÁNTICO / POÉTICO / DRAMA */}
      <header
        style={{
          textAlign: 'center',
          padding: '100px 24px 80px',
          maxWidth: '960px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div className="poetic-badge" style={{ marginBottom: '28px' }}>
          Escritora & Autora
        </div>

        <h1
          className="serif-font"
          style={{
            fontSize: 'clamp(3.2rem, 8vw, 5.8rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '0.08em',
            color: 'var(--text-primary)',
            marginBottom: '32px',
          }}
        >
          Carmen Ibáñez
        </h1>

        <div style={{ width: '60px', height: '1px', backgroundColor: 'var(--accent-rose)', margin: '0 auto 32px' }} />

        <p
          className="serif-font"
          style={{
            fontSize: 'clamp(1.25rem, 2.8vw, 1.85rem)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '780px',
            margin: '0 auto 48px',
          }}
        >
          “Palabras que tejen puentes entre las sombras del alma y la luz de los recuerdos.”
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <a href="#biblioteca" className="btn-terracotta">
            Explorar Biblioteca
          </a>
          <a href="#sobre-mi" className="btn-outline-editorial">
            Conocer a la Autora
          </a>
        </div>
      </header>

      {/* 3. SECCIÓN: BIBLIOTECA EN VIVO (CONEXIÓN SUPABASE) */}
      <section id="biblioteca" style={{ maxWidth: '1200px', margin: '40px auto 120px', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="poetic-badge" style={{ marginBottom: '14px' }}>
            Obras Publicadas
          </span>
          <h2 className="serif-font" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 400, letterSpacing: '0.04em' }}>
            Biblioteca Literaria
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '10px' }}>
            Cada libro habita su propio universo y micro-sitio dedicado.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px' }}>
          {displayBooks.map((book) => {
            const subdomainUrl = isDev
              ? `/subdomains/${book.slug}`
              : `https://${book.slug}.${rootDomain}`;

            return (
              <article key={book.id} className="book-card-poetic">
                {book.cover_url && (
                  <div style={{ height: '380px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-secondary)' }}>
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
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      <span className="poetic-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        {book.status === 'published' ? 'Publicado' : book.status}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--accent-rose)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Novela Oficial
                  </p>

                  <h3 className="serif-font" style={{ fontSize: '2.2rem', lineHeight: 1.15, marginBottom: '10px', color: 'var(--text-primary)' }}>
                    {book.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px', fontStyle: 'italic' }}>
                    Subdominio: {book.slug}.{rootDomain}
                  </p>

                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.98rem',
                      lineHeight: 1.7,
                      marginBottom: '28px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {book.synopsis}
                  </p>

                  <a href={subdomainUrl} className="btn-terracotta" style={{ width: '100%', textAlign: 'center' }}>
                    Visitar Micro-sitio de la Novela →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. SECCIÓN: SOBRE MÍ (MAQUETACIÓN EDITORIAL A DOS COLUMNAS) */}
      <section
        id="sobre-mi"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '100px 24px',
          borderTop: '1px solid rgba(194, 141, 117, 0.15)',
          borderBottom: '1px solid rgba(194, 141, 117, 0.15)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Columna 1: Retrato / Composición Visual */}
          <div style={{ position: 'relative' }}>
            <div
              className="glass-panel"
              style={{
                padding: '18px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=900&auto=format&fit=crop"
                alt="Carmen Ibáñez en su escritorio literario"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                  display: 'block',
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-10px',
                background: 'var(--glass-card)',
                backdropFilter: 'blur(12px)',
                padding: '14px 24px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--shadow-subtle)',
              }}
            >
              <span className="serif-font" style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--accent-rose)' }}>
                Santiago de Chile
              </span>
            </div>
          </div>

          {/* Columna 2: Texto Biográfico Editorial */}
          <div>
            <span className="poetic-badge" style={{ marginBottom: '18px' }}>
              Biografía de Autora
            </span>
            <h2
              className="serif-font"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', lineHeight: 1.15, marginBottom: '28px', color: 'var(--text-primary)' }}
            >
              El latido tras cada página
            </h2>

            <div style={{ width: '45px', height: '1px', backgroundColor: 'var(--accent-rose)', marginBottom: '28px' }} />

            <blockquote
              className="serif-font"
              style={{
                fontSize: '1.35rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: 'var(--accent-rose-hover)',
                marginBottom: '28px',
                borderLeft: '2px solid var(--accent-rose)',
                paddingLeft: '20px',
              }}
            >
              “Escritora de historias cotidianas e intensas. Creo en la literatura como un reflejo de nuestras propias batallas emocionales, transformando el drama de la vida en poesía tangible.”
            </blockquote>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '32px' }}>
              A través de una prosa íntima y meticulosa, Carmen Ibáñez explora los recovecos de la vulnerabilidad humana, el desarraigo, las pasiones truncadas y la redención estética. Sus obras proponen un viaje inmersivo donde el lector no es un mero testigo, sino un cómplice emocional de cada desenlace.
            </p>

            <a href="#club-lectura" className="btn-terracotta">
              Unirse al Círculo Literario →
            </a>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN: COMPONENTE NEWSLETTER / CLUB DE LECTURA FLOTANTE */}
      <section
        id="club-lectura"
        style={{
          maxWidth: '900px',
          margin: '100px auto 140px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '56px 40px',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: 'var(--shadow-hover)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Adorno decorativo de luz sutil */}
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '400px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(194, 141, 117, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <span className="poetic-badge" style={{ marginBottom: '18px' }}>
            Comunidad de Lectura
          </span>

          <h2 className="serif-font" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.2, marginBottom: '16px' }}>
            Cartas Íntimas & Club de Lectura
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: '0 auto 36px',
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            Suscríbete para recibir capítulos inéditos, notas personales de autoría, fechas de próximos encuentros y ser parte del análisis colectivo de cada novela.
          </p>

          <form
            action="#"
            method="POST"
            style={{
              display: 'flex',
              gap: '12px',
              maxWidth: '520px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <input
              type="email"
              required
              placeholder="Escribe tu correo electrónico..."
              style={{
                flex: '1 1 280px',
                padding: '14px 20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(194, 141, 117, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-terracotta">
              Suscribirme al Club
            </button>
          </form>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '20px' }}>
            Sin spam. Solo reflexiones sinceras, literatura y anuncios de lanzamientos.
          </p>
        </div>
      </section>

      {/* 6. PIE DE PÁGINA EDITORIAL */}
      <footer
        style={{
          borderTop: '1px solid rgba(194, 141, 117, 0.15)',
          padding: '40px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}
      >
        <p className="serif-font" style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
          Carmen Ibáñez
        </p>
        <p>© {new Date().getFullYear()} Todos los derechos reservados. Arquitectura Headless literaria con Supabase & Next.js.</p>
      </footer>
    </div>
  );
}
