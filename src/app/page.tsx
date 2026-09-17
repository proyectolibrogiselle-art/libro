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
      {/* 1. NAVEGACIÓN DELICADA EN TIPO ORACIÓN */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(251, 251, 249, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(194, 141, 117, 0.18)',
          padding: '20px 36px',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" className="serif-delicate" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Carmen Ibáñez
          </a>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#biblioteca" className="cinzel-heading" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Biblioteca
            </a>
            <a href="#sobre-mi" className="cinzel-heading" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Sobre mí
            </a>
            <a href="#circulo" className="cinzel-heading" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Club de lectura
            </a>
            <a href="/admin" className="btn-outline-luxury" style={{ padding: '7px 18px', fontSize: '0.84rem' }}>
              Panel CMS
            </a>
          </div>
        </div>
      </nav>

      {/* 2. CABECERA HERO - NOMBRE ESTRICTAMENTE EN TIPO ORACIÓN */}
      <header
        style={{
          textAlign: 'center',
          padding: '100px 24px 70px',
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div className="luxury-badge" style={{ marginBottom: '26px' }}>
          Edición de autora · Narrativa contemporánea
        </div>

        {/* Nombre estricto en Tipo Oración (Carmen Ibáñez) sin mayúsculas sostenidas ni tracking excesivo */}
        <h1
          className="serif-delicate"
          style={{
            fontSize: 'clamp(3.4rem, 7vw, 5.6rem)',
            fontWeight: 500,
            lineHeight: 1.12,
            letterSpacing: '0.02em',
            color: 'var(--text-primary)',
            marginBottom: '26px',
          }}
        >
          Carmen Ibáñez
        </h1>

        {/* Divisor sutil y armónico */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', margin: '0 auto 32px', maxWidth: '240px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--accent-terracotta-border)' }} />
          <span style={{ color: 'var(--accent-terracotta)', fontSize: '0.75rem' }}>✦</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--accent-terracotta-border)' }} />
        </div>

        {/* Frase poética en bajorrelieve suave */}
        <div className="stone-engraving" style={{ maxWidth: '820px', margin: '0 auto 44px' }}>
          <p
            className="serif-delicate"
            style={{
              fontSize: 'clamp(1.2rem, 2.3vw, 1.65rem)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            “Palabras que tejen puentes entre las sombras del alma y la luz de los recuerdos.”
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <a href="#biblioteca" className="btn-terracotta-gold">
            Explorar biblioteca
          </a>
          <a href="#sobre-mi" className="btn-outline-luxury">
            Conocer a la autora
          </a>
        </div>
      </header>

      {/* 3. SECCIÓN: BIBLIOTECA DE LA AUTORA (TIPO ORACIÓN) */}
      <section id="biblioteca" style={{ maxWidth: '1240px', margin: '50px auto 120px', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="luxury-badge" style={{ marginBottom: '14px' }}>
            Obras publicadas
          </span>
          <h2 className="serif-delicate" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 500, marginBottom: '12px' }}>
            Biblioteca de la autora
          </h2>
          <p className="montserrat-body" style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            Cada obra constituye un universo narrativo independiente alojado bajo su propio subdominio dinámico.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {displayBooks.map((book) => {
            const subdomainUrl = isDev
              ? `/subdomains/${book.slug}`
              : `https://${book.slug}.${rootDomain}`;

            return (
              <article key={book.id} className="book-card-luxury">
                {book.cover_url && (
                  <div style={{ height: '400px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-secondary)' }}>
                    <img
                      src={book.cover_url}
                      alt={`Portada de ${book.title}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      <span className="luxury-badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.94)' }}>
                        {book.status === 'published' ? 'Publicación oficial' : book.status}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p className="cinzel-heading" style={{ fontSize: '0.8rem', color: 'var(--accent-terracotta)', marginBottom: '8px' }}>
                    Novela
                  </p>

                  <h3 className="serif-delicate" style={{ fontSize: '2.2rem', fontWeight: 600, lineHeight: 1.15, marginBottom: '8px' }}>
                    {book.title}
                  </h3>

                  <p className="montserrat-body" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    Subdominio: {book.slug}.{rootDomain}
                  </p>

                  <p
                    className="montserrat-body"
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.96rem',
                      lineHeight: 1.8,
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

                  <a href={subdomainUrl} className="btn-terracotta-gold" style={{ width: '100%', textAlign: 'center' }}>
                    Ingresar a la obra →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. SECCIÓN: SOBRE MÍ (TIPO ORACIÓN, RITMO EDITORIAL LIMPIO) */}
      <section
        id="sobre-mi"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '110px 24px',
          borderTop: '1px solid rgba(194, 141, 117, 0.16)',
          borderBottom: '1px solid rgba(194, 141, 117, 0.16)',
        }}
      >
        <div
          style={{
            maxWidth: '1140px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
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
                  height: '470px',
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
                bottom: '-18px',
                right: '-10px',
                padding: '14px 26px',
                border: '1px solid var(--accent-terracotta-border)',
              }}
            >
              <span className="serif-delicate" style={{ fontSize: '1.25rem', color: 'var(--accent-terracotta)', fontWeight: 600 }}>
                Carmen Ibáñez
              </span>
            </div>
          </div>

          {/* Columna 2: Biografía de la Autora */}
          <div>
            <span className="luxury-badge" style={{ marginBottom: '16px' }}>
              Semblanza literaria
            </span>

            <h2 className="serif-delicate" style={{ fontSize: 'clamp(2.3rem, 4.2vw, 3.2rem)', lineHeight: 1.18, marginBottom: '24px' }}>
              Sobre mí
            </h2>

            <div style={{ width: '45px', height: '2px', backgroundColor: 'var(--accent-terracotta)', marginBottom: '28px' }} />

            <blockquote
              className="serif-delicate"
              style={{
                fontSize: '1.35rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: 'var(--accent-terracotta-hover)',
                marginBottom: '28px',
                borderLeft: '2px solid var(--accent-terracotta)',
                paddingLeft: '22px',
              }}
            >
              “Escritora de historias cotidianas e intensas. Creo en la literatura como un reflejo de nuestras propias batallas emocionales, transformando el drama de la vida en poesía tangible.”
            </blockquote>

            <p className="montserrat-body" style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.9, marginBottom: '32px' }}>
              A través de una prosa íntima, meticulosa y profundamente humana, Carmen Ibáñez explora los recovecos de la vulnerabilidad, las pasiones truncadas y la redención estética. Sus obras proponen un viaje inmersivo donde el lector no es un mero espectador, sino un cómplice emocional de cada desenlace.
            </p>

            <a href="#circulo" className="btn-terracotta-gold">
              Conocer el club de lectura →
            </a>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN: CARTAS ÍNTIMAS Y CLUB DE LECTURA (TIPO ORACIÓN) */}
      <section
        id="circulo"
        style={{
          maxWidth: '900px',
          margin: '100px auto 130px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '60px 40px',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: 'var(--shadow-hover)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Luz radial suave decorativa */}
          <div
            style={{
              position: 'absolute',
              top: '-45%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '420px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(194, 141, 117, 0.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <span className="luxury-badge" style={{ marginBottom: '16px' }}>
            Comunidad de lectores
          </span>

          <h2 className="serif-delicate" style={{ fontSize: 'clamp(2.1rem, 3.8vw, 2.9rem)', lineHeight: 1.22, marginBottom: '18px' }}>
            Cartas íntimas y club de lectura
          </h2>

          <p
            className="montserrat-body"
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: '0 auto 36px',
              fontSize: '1rem',
              lineHeight: 1.85,
            }}
          >
            Accede a notas de autoría de Carmen Ibáñez, fechas de encuentros presenciales y virtuales, lecturas conjuntas y primicias editoriales de cada nuevo título.
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
              placeholder="Ingresa tu correo electrónico..."
              className="montserrat-body"
              style={{
                flex: '1 1 280px',
                padding: '14px 20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(194, 141, 117, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'var(--text-primary)',
                fontSize: '0.94rem',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-terracotta-gold">
              Suscribirme al club
            </button>
          </form>

          <p className="montserrat-body" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '20px' }}>
            Privacidad garantizada. Solo literatura, cartas sinceras y anuncios oficiales.
          </p>
        </div>
      </section>

      {/* 6. PIE DE PÁGINA */}
      <footer
        style={{
          borderTop: '1px solid rgba(194, 141, 117, 0.16)',
          padding: '44px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="serif-delicate" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Carmen Ibáñez
        </p>
        <p className="montserrat-body" style={{ fontSize: '0.86rem' }}>
          © {new Date().getFullYear()} Todos los derechos reservados. Arquitectura Headless literaria de alta gama.
        </p>
      </footer>
    </div>
  );
}
