import { BooksService } from '@/lib/supabase/books.service';
import {
  AuthorsService,
  NewsService,
  EventsService,
  GalleryService,
  BookClubService,
} from '@/lib/supabase/modules.service';
import { Book } from '@/types/book';

export const revalidate = 60;

export default async function HomePage() {
  let books: Book[] = [];
  let author: any = null;
  let newsList: any[] = [];
  let eventsList: any[] = [];
  let galleryList: any[] = [];
  let clubsList: any[] = [];

  try {
    const [b, a, n, e, g, c] = await Promise.allSettled([
      BooksService.getPublishedBooks(),
      AuthorsService.getPrimaryAuthor(),
      NewsService.getAllNews(),
      EventsService.getUpcomingEvents(),
      GalleryService.getItemsByCategory(),
      BookClubService.getAllClubs(),
    ]);

    if (b.status === 'fulfilled') books = b.value;
    if (a.status === 'fulfilled') author = a.value;
    if (n.status === 'fulfilled') newsList = n.value;
    if (e.status === 'fulfilled') eventsList = e.value;
    if (g.status === 'fulfilled') galleryList = g.value;
    if (c.status === 'fulfilled') clubsList = c.value;
  } catch (err) {
    console.warn('Conexión inicial con Supabase en curso:', err);
  }

  // Fallbacks de demostración si la base de datos está recién inicializada
  const displayBooks = books.length > 0 ? books : [
    {
      id: 'd9b1c720-3b6a-4f51-8b22-e7df12908f91',
      title: 'Giselle',
      slug: 'giselle',
      synopsis: 'Una conmovedora travesía literaria entre la luz y las sombras del destino. En las profundidades de un París decimonónico, un pacto silencioso cambiará para siempre el curso de dos almas destinadas a encontrarse.',
      status: 'published' as const,
      cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'carmenibanez.cl';
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra de navegación superior */}
      <header style={{ borderBottom: '1px solid var(--border-color)', padding: '18px 24px', backdropFilter: 'blur(12px)', backgroundColor: 'rgba(13, 15, 20, 0.85)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.05em' }} className="serif-font">
            Carmen Ibáñez
          </a>
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '0.9rem' }}>
            <a href="#obras" style={{ color: 'var(--text-secondary)' }}>Obras</a>
            <a href="#noticias" style={{ color: 'var(--text-secondary)' }}>Noticias</a>
            <a href="#eventos" style={{ color: 'var(--text-secondary)' }}>Eventos</a>
            <a href="#galeria" style={{ color: 'var(--text-secondary)' }}>Galería</a>
            <a href="#club" style={{ color: 'var(--text-secondary)' }}>Club de Lectura</a>
            <a href="/admin" className="btn-gold" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
              ⚙️ CMS Admin
            </a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 100px', width: '100%' }}>
        {/* HERO AUTORA */}
        <section style={{ textAlign: 'center', marginBottom: '100px' }}>
          <div className="gold-badge" style={{ marginBottom: '20px' }}>
            Escritora & Creadora
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '20px' }}>
            {author?.name || 'Carmen Ibáñez'}
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.7 }}>
            {author?.bio_short || 'Universos literarios, ficción y narrativas poéticas. Cada novela cuenta con su propio micro-sitio y subdominio dedicado.'}
          </p>
        </section>

        {/* SECCIÓN 1: OBRAS Y SUBDOMINIOS */}
        <section id="obras" style={{ marginBottom: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '2.2rem' }}>Obras y Micro-sitios</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {displayBooks.length} {displayBooks.length === 1 ? 'obra disponible' : 'obras disponibles'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
            {displayBooks.map((book) => {
              const subdomainUrl = isDev
                ? `/subdomains/${book.slug}`
                : `https://${book.slug}.${rootDomain}`;

              return (
                <article key={book.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {book.cover_url && (
                    <div style={{ height: '340px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-secondary)' }}>
                      <img
                        src={book.cover_url}
                        alt={`Portada de ${book.title}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                        <span className="gold-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                          {book.status}
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{book.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      {book.slug}.{rootDomain}
                    </p>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {book.synopsis}
                    </p>

                    <a href={subdomainUrl} className="btn-gold" style={{ width: '100%', textAlign: 'center' }}>
                      Entrar al Sitio de la Obra →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECCIÓN 2: NOTICIAS Y PRENSA */}
        <section id="noticias" style={{ marginBottom: '100px' }}>
          <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '2.2rem' }}>Noticias y Novedades</h2>
          </div>

          {newsList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {newsList.map((item) => (
                <div key={item.id} className="glass-panel" style={{ padding: '24px' }}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}
                    />
                  )}
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '12px' }}>
                    {new Date(item.published_at).toLocaleDateString('es-CL')}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Próximamente comunicados oficiales y artículos de prensa. Puedes publicar el primero desde el <a href="/admin" style={{ color: 'var(--accent-gold)' }}>Panel CMS</a>.
            </div>
          )}
        </section>

        {/* SECCIÓN 3: EVENTOS */}
        <section id="eventos" style={{ marginBottom: '100px' }}>
          <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '2.2rem' }}>Agenda y Eventos</h2>
          </div>

          {eventsList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {eventsList.map((evt) => (
                <div key={evt.id} className="glass-panel" style={{ padding: '28px' }}>
                  <div className="gold-badge" style={{ marginBottom: '12px' }}>
                    {new Date(evt.event_date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{evt.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>📍 {evt.location}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>{evt.description}</p>
                  {evt.registration_url && (
                    <a href={evt.registration_url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.85rem', width: '100%', textAlign: 'center' }}>
                      Registrarse al Evento
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No hay eventos agendados en este momento. Consulta el calendario próximamente.
            </div>
          )}
        </section>

        {/* SECCIÓN 4: GALERÍA */}
        <section id="galeria" style={{ marginBottom: '100px' }}>
          <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '2.2rem' }}>Galería Visual</h2>
          </div>

          {galleryList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {galleryList.map((item) => (
                <div key={item.id} className="glass-panel" style={{ overflow: 'hidden' }}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '16px' }}>
                    <span className="gold-badge" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', marginTop: '6px' }}>{item.title}</h4>
                    {item.description && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Ilustraciones, fotografías de eventos y fanart serán publicadas aquí mediante el <a href="/admin" style={{ color: 'var(--accent-gold)' }}>CMS de Galería</a>.
            </div>
          )}
        </section>

        {/* SECCIÓN 5: CLUB DE LECTURA */}
        <section id="club" style={{ marginBottom: '80px' }}>
          <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '2.2rem' }}>Club de Lectura</h2>
          </div>

          {clubsList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {clubsList.map((club) => (
                <div key={club.id} className="glass-panel" style={{ padding: '28px' }}>
                  <span className="gold-badge" style={{ marginBottom: '12px' }}>
                    Estado: {club.status}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{club.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>{club.description}</p>
                  {club.external_link && (
                    <a href={club.external_link} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: '0.85rem' }}>
                      Unirse al Círculo →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Los círculos de lectura para las novelas se coordinarán a través de esta sección.
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', backgroundColor: 'var(--bg-secondary)' }}>
        <p>© {new Date().getFullYear()} Carmen Ibáñez. Todos los derechos reservados. Plataforma Headless con Antigravity & Supabase.</p>
      </footer>
    </div>
  );
}
