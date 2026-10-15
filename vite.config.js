import { defineConfig } from 'vite';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// Yalnızca geliştirmede: tools/foto.html'in ürettiği ürün fotoğraflarını public/foto altına yazar.
// Sadece bu bilgisayardan gelen isteği ve foto/<konsept>/<ürün>.webp biçimindeki yolu kabul eder.
function fotoKaydet() {
  const root = resolve(import.meta.dirname, 'public/foto');
  return {
    name: 'foto-kaydet',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__foto', (req, res) => {
        const ip = req.socket.remoteAddress || '';
        const local = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
        const rel = new URL(req.url, 'http://x').searchParams.get('path') || '';
        if (req.method !== 'POST' || !local || !/^[a-z-]+\/[a-z0-9-]+\.webp$/.test(rel)) {
          res.statusCode = 400;
          res.end('reddedildi');
          return;
        }
        const chunks = [];
        let size = 0;
        req.on('data', (c) => {
          size += c.length;
          if (size < 4e6) chunks.push(c);
        });
        req.on('end', () => {
          if (size >= 4e6) {
            res.statusCode = 413;
            res.end('çok büyük');
            return;
          }
          const file = resolve(root, rel);
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(file, Buffer.concat(chunks));
          res.end('ok');
        });
      });
    },
  };
}

// base: './' sayesinde site GitHub Pages'te /repo-adi/ alt yolunda da çalışır.
export default defineConfig({
  base: './',
  plugins: [fotoKaydet()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: true,
  },
});
