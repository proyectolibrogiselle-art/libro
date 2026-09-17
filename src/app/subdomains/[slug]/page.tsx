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
    // Silently continue to fallback
  }

  const title = book ? book.title : slug.charAt(0).toUpperCase() + slug.slice(1);
  const description = book ? book.synopsis : `Sitio oficial del libro ${title} por Carmen Ibáñez.`;

  return {
    title: `${title} — Novela de Carmen Ibáñez`,
    description,
    openGraph: {
      title,
      description,
      images: book?.cover_url ? [book.cover_url] : [],
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

  // Fallback demo para desarrollo si se consulta "giselle" antes de conectar Supabase
  if (!book && slug.toLowerCase() === 'giselle') {
    book = {
      id: 'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
      title: 'Giselle',
      slug: 'giselle',
      synopsis: 'Una conmovedora travesía literaria entre la luz y las sombras del destino. En las profundidades de un París decimonónico, un pacto silencioso cambiará para siempre el curso de dos almas destinadas a encontrarse.\n\nEscrita con una prosa evocadora, Giselle indaga en la fragilidad humana, el arte sublime y los misterios que habitan tras los telones de la ópera.',
      status: 'published',
      cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (!book) {
    notFound();
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'carmenibanez.cl';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior de navegación */}
      <nav style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(13, 15, 20, 0.8)', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href={`https://${rootDomain}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          ← Volver a Carmen Ibáñez
        </a>
        <span className="gold-badge">Subdominio Dedicado: {book.slug}.{rootDomain}</span>
      </nav>

      {/* Contenido principal del libro */}
      <main style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 24px', flex: 1, width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 420px) 1fr', gap: '60px', alignItems: 'start' }}>
          {/* Portada */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)' }}>
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)', display: 'block', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}
              />
            ) : (
              <div style={{ height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Sin portada cargada</p>
              </div>
            )}
          </div>

          {/* Detalles del Libro */}
          <div>
            <div className="gold-badge" style={{ marginBottom: '16px' }}>
              Novela
            </div>
            <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', fontWeight: 700, marginBottom: '24px', lineHeight: 1.1 }}>
              {book.title}
            </h1>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', marginBottom: '32px', fontWeight: 400 }}>
              Por Carmen Ibáñez
            </h2>

            <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                Sinopsis de la Obra
              </h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {book.synopsis}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#comprar" className="btn-gold">
                Comprar Ejemplar
              </a>
              <a href="#fragmento" className="btn-secondary">
                Leer Primer Capítulo
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer del Subdominio */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '30px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} Carmen Ibáñez — Todos los derechos reservados. Micro-sitio oficial de {book.title}.
      </footer>
    </div>
  );
}
