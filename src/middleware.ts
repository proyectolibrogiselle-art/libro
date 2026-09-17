import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware para Vercel Wildcard DNS & Subdominios Dinámicos
 * 
 * Flujo:
 * - giselle.carmenibanez.cl/capitulo-1 -> Reescribe internamente a: /subdomain/giselle/capitulo-1
 * - carmenibanez.cl -> Sirve el sitio principal / home
 */
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * 1. /api (rutas API)
     * 2. /_next (archivos estáticos de Next.js)
     * 3. /_static (archivos públicos estáticos)
     * 4. archivos con extensiones (.svg, .png, .jpg, .ico, etc.)
     */
    '/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Dominio raíz configurado en variables de entorno (ej: carmenibanez.cl o localhost:3000)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'carmenibanez.cl';

  // Normalizar hostname removiendo puertos en caso de desarrollo local
  const currentHost = hostname.split(':')[0].toLowerCase();
  const cleanRootDomain = rootDomain.split(':')[0].toLowerCase();

  // Caso 1: Dominio raíz principal o 'www'
  if (currentHost === cleanRootDomain || currentHost === `www.${cleanRootDomain}` || currentHost === 'localhost') {
    return NextResponse.next();
  }

  // Caso 2: Extracción de subdominio dinámico
  // Si currentHost es "giselle.carmenibanez.cl", el subdominio es "giselle"
  let subdomain = currentHost.replace(`.${cleanRootDomain}`, '');

  // Soporte para pruebas locales: ej "giselle.localhost"
  if (currentHost.endsWith('.localhost')) {
    subdomain = currentHost.replace('.localhost', '');
  }

  // Si no hay subdominio válido o es un subdominio reservado, continuar normalmente
  if (!subdomain || subdomain === currentHost) {
    return NextResponse.next();
  }

  // Reescribir internamente la petición hacia la carpeta de rutas de subdominio
  // Por ejemplo: /subdomains/[slug] en App Router
  const rewriteUrl = new URL(`/subdomains/${subdomain}${url.pathname}${url.search}`, req.url);
  return NextResponse.rewrite(rewriteUrl);
}
