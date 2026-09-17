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

  const title = book ? book.title : 'Giselle';
  const description = book
    ? book.synopsis
    : 'En los salones de una aristocracia decadente, Giselle teje su música entre hilos de secretos y pasiones prohibidas. Novela de Carmen Ibáñez.';

  return {
    title: `${title} — Novela de Carmen Ibáñez`,
    description,
    openGraph: {
      title: `${title} — Carmen Ibáñez`,
      description,
      images: book?.cover_url
        ? [book.cover_url]
        : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop'],
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

  // Datos editoriales ricos de demostración para 'Giselle' (Romance Oscuro / Drama Cinematográfico)
  if (!book && slug.toLowerCase() === 'giselle') {
    book = {
      id: 'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
      title: 'Giselle',
      slug: 'giselle',
      synopsis:
        'En los salones de una aristocracia decadente, Giselle teje su música entre hilos de secretos y pasiones prohibidas. Cuando el telón caiga, el drama de su realidad superará la ficción de su arte. Una novela inmersiva sobre el peso de las decisiones y la búsqueda de la redención.',
      status: 'published',
      cover_url:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (!book) {
    notFound();
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'carmenibanez.cl';

  return (
    <div
      style={{
        backgroundColor: '#0D0D0C',
        color: '#FBFBF9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          radial-gradient(circle at 15% 15%, rgba(140, 45, 56, 0.12) 0%, transparent 45%),
          radial-gradient(circle at 85% 80%, rgba(140, 45, 56, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(13, 13, 12, 0.95) 0%, #0D0D0C 100%)
        `,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 1. NAVEGACIÓN CINEMATOGRÁFICA OSCURA */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(13, 13, 12, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '18px 36px',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a
            href={`https://${rootDomain}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              color: '#C5C5C5',
              letterSpacing: '0.04em',
              transition: 'color 0.25s ease',
            }}
          >
            ← Carmen Ibáñez
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(140, 45, 56, 0.2)',
                color: '#E06B78',
                border: '1px solid rgba(140, 45, 56, 0.35)',
              }}
            >
              Micro-sitio exclusivo · {book.slug}.{rootDomain}
            </span>
          </div>
        </div>
      </nav>

      {/* 2. HERO DEL LIBRO: CINEMATIC DRAMA */}
      <header
        style={{
          maxWidth: '1200px',
          margin: '50px auto 100px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Portada en Cristal Oscuro */}
          <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto', width: '100%' }}>
            <div
              style={{
                backgroundColor: 'rgba(20, 20, 19, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(140, 45, 56, 0.3)',
                padding: '16px',
                borderRadius: '16px',
              }}
            >
              <img
                src={book.cover_url || ''}
                alt={`Portada oficial de ${book.title}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  display: 'block',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
                }}
              />
            </div>

            {/* Sello de Género */}
            <div
              style={{
                position: 'absolute',
                top: '-14px',
                left: '-10px',
                padding: '6px 18px',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                backgroundColor: '#8C2D38',
                color: '#FBFBF9',
                boxShadow: '0 8px 20px rgba(140, 45, 56, 0.5)',
                fontWeight: 600,
              }}
            >
              Romance Oscuro
            </div>
          </div>

          {/* Detalles Editoriales y Acciones */}
          <div>
            <p
              className="cinzel-heading"
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.2em',
                color: '#E06B78',
                marginBottom: '16px',
              }}
            >
              Novela de Carmen Ibáñez
            </p>

            {/* Título en Cinzel Decorative grande y estilizado en Tipo Oración */}
            <h1
              className="cinzel-decorative"
              style={{
                fontSize: 'clamp(3.8rem, 8vw, 6.2rem)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '0.03em',
                color: '#FBFBF9',
                marginBottom: '28px',
              }}
            >
              {book.title}
            </h1>

            {/* Divisor Borgoña */}
            <div style={{ width: '50px', height: '2px', backgroundColor: '#8C2D38', marginBottom: '32px' }} />

            {/* Sinopsis Argumental */}
            <div
              style={{
                backgroundColor: 'rgba(20, 20, 19, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '30px 32px',
                borderRadius: '14px',
                marginBottom: '40px',
              }}
            >
              <h2
                className="cinzel-heading"
                style={{ fontSize: '0.9rem', letterSpacing: '0.12em', color: '#FBFBF9', marginBottom: '14px' }}
              >
                Sinopsis argumental
              </h2>
              <p
                className="montserrat-body"
                style={{
                  color: '#C5C5C5',
                  fontSize: '1.05rem',
                  lineHeight: 1.85,
                  margin: 0,
                }}
              >
                {book.synopsis}
              </p>
            </div>

            {/* Botones de Acción Borgoña */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="https://amazon.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px 36px',
                  backgroundColor: '#8C2D38',
                  color: '#FBFBF9',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  boxShadow: '0 10px 25px -4px rgba(140, 45, 56, 0.5)',
                  transition: 'all 0.3s ease',
                }}
              >
                Comprar en Amazon →
              </a>

              <a
                href="#primer-capitulo"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 32px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#FBFBF9',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                }}
              >
                Leer primer capítulo
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 3. SECCIÓN: AVANCE EXCLUSIVO (CAPÍTULO 1: EL ECO DEL SILENCIO) */}
      <section
        id="primer-capitulo"
        style={{
          maxWidth: '960px',
          margin: '0 auto 120px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(20, 20, 19, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.7)',
            padding: '56px 48px',
            borderRadius: '16px',
            position: 'relative',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#E06B78',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Avance exclusivo de lectura
            </span>
            <h2
              className="cinzel-decorative"
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 500,
                color: '#FBFBF9',
                marginBottom: '18px',
              }}
            >
              Capítulo 1: El eco del silencio
            </h2>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#8C2D38', margin: '0 auto' }} />
          </div>

          <div
            className="montserrat-body"
            style={{
              color: '#C5C5C5',
              fontSize: '1.08rem',
              lineHeight: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <p>
              La niebla sobre el Sena no era más que un velo de gasa que ocultaba las vergüenzas de la noche parisina. En el interior del Gran Salón, el aroma a cera derretida y jazmín silvestre se mezclaba con el murmullo de conversaciones ahogadas por la música de cámara. Giselle acarició las teclas de marfil del piano de cola como quien toca la herida viva de un pasado que se niega a cicatrizar. Cada nota era una confesión que ninguno de los presentes se atrevía a descifrar, un réquiem silencioso para los sueños que habían ardido antes del amanecer.
            </p>
            <p>
              Él la observaba desde la penumbra de las cortinas de terciopelo, con esa mirada que desnudaba los secretos mejor guardados de su partitura. No hacían falta palabras entre dos fugitivos del destino; la partitura ya estaba escrita con sangre, tinta y una promesa que ninguno de los dos podría cumplir cuando el invierno terminara de helar las aguas del invierno.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <p style={{ color: '#8C827A', fontSize: '0.9rem', marginBottom: '20px', fontStyle: 'italic' }}>
              ¿Deseas sumergirte en la historia completa de Giselle?
            </p>
            <a
              href="https://amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                backgroundColor: '#8C2D38',
                color: '#FBFBF9',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
              Obtener ejemplar en Amazon
            </a>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: CRÍTICAS Y RESEÑAS (SOCIAL PROOF EN CRISTAL OSCURO) */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto 130px',
          padding: '0 24px',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#E06B78',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            Recepción crítica
          </span>
          <h2
            className="serif-delicate"
            style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 2.9rem)',
              color: '#FBFBF9',
              fontWeight: 500,
            }}
          >
            Palabras de la crítica y lectores
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
          }}
        >
          {/* Crítica 1 */}
          <div
            style={{
              backgroundColor: 'rgba(20, 20, 19, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '36px 32px',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.6)',
            }}
          >
            <p
              className="serif-delicate"
              style={{
                fontSize: '1.2rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: '#FBFBF9',
                marginBottom: '24px',
              }}
            >
              “Una obra desgarradora y elegante que se lee como poesía en movimiento. Carmen Ibáñez reinventa la tragedia romántica con un pulso magnético.”
            </p>
            <div>
              <p style={{ color: '#E06B78', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                Crítica Literaria & Cuadernos de Ficción
              </p>
              <span style={{ color: '#7E776F', fontSize: '0.75rem' }}>Reseña destacada</span>
            </div>
          </div>

          {/* Crítica 2 */}
          <div
            style={{
              backgroundColor: 'rgba(20, 20, 19, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '36px 32px',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.6)',
            }}
          >
            <p
              className="serif-delicate"
              style={{
                fontSize: '1.2rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: '#FBFBF9',
                marginBottom: '24px',
              }}
            >
              “Carmen Ibáñez logra un pulso narrativo donde cada acorde musical es una sentencia emocional. Imposible soltar el libro hasta su última página.”
            </p>
            <div>
              <p style={{ color: '#E06B78', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                Revista Letras del Sur
              </p>
              <span style={{ color: '#7E776F', fontSize: '0.75rem' }}>Publicación Cultural</span>
            </div>
          </div>

          {/* Crítica 3 */}
          <div
            style={{
              backgroundColor: 'rgba(20, 20, 19, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '36px 32px',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.6)',
            }}
          >
            <p
              className="serif-delicate"
              style={{
                fontSize: '1.2rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: '#FBFBF9',
                marginBottom: '24px',
              }}
            >
              “La atmósfera decadente y la fragilidad de Giselle te atrapan desde la primera línea hasta su trágico e inolvidable desenlace.”
            </p>
            <div>
              <p style={{ color: '#E06B78', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                Círculo de Lectores Beta
              </p>
              <span style={{ color: '#7E776F', fontSize: '0.75rem' }}>Comunidad Exclusiva</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER CINEMATOGRÁFICO */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 24px',
          textAlign: 'center',
          backgroundColor: '#090908',
          color: '#7E776F',
        }}
      >
        <p
          className="cinzel-decorative"
          style={{ fontSize: '1.3rem', color: '#FBFBF9', marginBottom: '8px' }}
        >
          {book.title}
        </p>
        <p className="montserrat-body" style={{ fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} Carmen Ibáñez — Todos los derechos reservados. Micro-sitio oficial alojado bajo Wildcard DNS.
        </p>
      </footer>
    </div>
  );
}
