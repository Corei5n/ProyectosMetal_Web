import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://example.com/').replace(/\/?$/, '/');

await mkdir(resolve(root, 'public'), { recursive: true });

const robots = `User-agent: *
Allow: /
Sitemap: ${siteUrl}sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

await writeFile(resolve(root, 'public/robots.txt'), robots, 'utf8');
await writeFile(resolve(root, 'public/sitemap.xml'), sitemap, 'utf8');
