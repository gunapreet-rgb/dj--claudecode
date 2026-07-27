/* Bundles index.html + styles.css + script.js into one self-contained file
   for sharing (Claude Artifacts, email attachment, any static host).

   Fonts are inlined as base64 so the page needs no network at all —
   Artifact's CSP blocks font CDNs, and an attached file may be opened offline.

   Usage: node build-share.mjs   ->  writes dist/k2-share.html            */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(join(root, f), 'utf8');

const html = read('index.html');
const css = read('styles.css');
const js = read('script.js');

/* --- fonts -------------------------------------------------------------- */
const font = (f) => readFileSync(join(root, 'fonts', f)).toString('base64');

const faces = `
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(data:font/woff2;base64,${font('inter.woff2')}) format('woff2');
}
@font-face {
  font-family: 'Syne';
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url(data:font/woff2;base64,${font('syne.woff2')}) format('woff2');
}
/* The brand runs its own light and dark grounds section by section, so the
   page presents identically regardless of the viewer's OS theme. Pinning
   color-scheme stops the browser dark-styling the newsletter input. */
:root { color-scheme: light; }
`;

/* --- assemble ----------------------------------------------------------- */
const body = html
  .slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'))
  .replace(/\s*<script src="script\.js"><\/script>/, ''); // inlined below instead
const title = /<title>([^<]+)<\/title>/.exec(html)[1];

const out = `<title>${title}</title>
<style>
${faces}
${css}
</style>
${body}
<script>
${js}
</script>
`;

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'k2-share.html'), out);

console.log(`dist/k2-share.html — ${(out.length / 1024).toFixed(0)} KB`);
