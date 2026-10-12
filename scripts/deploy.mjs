// Siteyi derler ve GitHub Pages'in yayın yaptığı gh-pages dalına gönderir.
// Kullanım: npm run deploy
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const work = join(root, '.deploy');
const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: 'inherit' });
const out = (cmd, cwd = root) => execSync(cmd, { cwd }).toString().trim();

const remote = out('git remote get-url origin');
const sha = out('git rev-parse --short HEAD');

run('npx vite build');
writeFileSync(join(dist, '.nojekyll'), '');

// gh-pages dalını çalışma klasörüne getir (yoksa yeni oluştur)
if (!existsSync(join(work, '.git'))) {
  rmSync(work, { recursive: true, force: true });
  const exists = out(`git ls-remote --heads ${remote} gh-pages`).length > 0;
  if (exists) run(`git clone --quiet --branch gh-pages --single-branch ${remote} .deploy`);
  else {
    mkdirSync(work);
    run('git init --quiet -b gh-pages', work);
    run(`git remote add origin ${remote}`, work);
  }
} else {
  run('git pull --quiet --ff-only origin gh-pages', work);
}

// Eski yayını temizle, yeni derlemeyi kopyala
for (const f of readdirSync(work)) if (f !== '.git') rmSync(join(work, f), { recursive: true, force: true });
cpSync(dist, work, { recursive: true });

run('git add -A', work);
const changed = out('git status --porcelain', work).length > 0;
if (!changed) {
  console.log('Yayında zaten en güncel sürüm var.');
} else {
  run(`git commit --quiet -m "Yayın: ${sha}"`, work);
  run('git push --quiet origin gh-pages', work);
  console.log('Yayınlandı: gh-pages dalı güncellendi.');
}
