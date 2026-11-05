import type { MetadataRoute } from 'next';
import { BooksService } from '@/lib/supabase/books.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://carmenibanez.cl';

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/giselle`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  try {
    const publishedBooks = await BooksService.getPublishedBooks();
    for (const book of publishedBooks) {
      if (book.slug && book.slug.toLowerCase() !== 'giselle') {
        sitemapEntries.push({
          url: `${baseUrl}/${book.slug}`,
          lastModified: book.updated_at ? new Date(book.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // Fallback silencioso en caso de conexión pendiente
  }

  return sitemapEntries;
}
