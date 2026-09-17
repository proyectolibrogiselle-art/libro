import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Carmen Ibáñez',
    default: 'Carmen Ibáñez — Escritora & Autora',
  },
  description: 'Sitio oficial de la escritora Carmen Ibáñez. Obras literarias, sinopsis y universos narrativos.',
  metadataBase: new URL(`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'carmenibanez.cl'}`),
  openGraph: {
    title: 'Carmen Ibáñez — Escritora',
    description: 'Explora las novelas y creaciones literarias de Carmen Ibáñez.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
