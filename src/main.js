import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource/anton/index.css';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/manrope/index.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/inter-tight/wght.css';
import '@fontsource-variable/bodoni-moda/standard.css';
import '@fontsource-variable/bodoni-moda/standard-italic.css';
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import './styles/base.css';
import './styles/themes.css';
import './styles/components.css';
import './styles/premium.css';
import { getConceptId } from './core/concepts.js';

const loaders = {
  cigkofte: () => import('./concepts/cigkofte/index.js'),
  durum: () => import('./concepts/durum/index.js'),
  kafe: () => import('./concepts/kafe/index.js'),
  'cigkofte-premium': () => import('./concepts/cigkofte-premium/index.js'),
  'durum-premium': () => import('./concepts/durum-premium/index.js'),
  'kafe-premium': () => import('./concepts/kafe-premium/index.js'),
  'cigkofte-butik': () => import('./concepts/cigkofte-butik/index.js'),
  'durum-butik': () => import('./concepts/durum-butik/index.js'),
  'kafe-butik': () => import('./concepts/kafe-butik/index.js'),
};

(async () => {
  const id = getConceptId();
  document.documentElement.dataset.concept = id;
  const [mod, app] = await Promise.all([loaders[id](), import('./app.js')]);
  await app.boot(mod.default);
})().catch((err) => {
  console.error(err);
  const pre = document.getElementById('preloader');
  if (pre) {
    pre.innerHTML =
      '<p style="max-width:32ch;text-align:center;font-family:system-ui;padding:24px">Sayfa yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.</p>';
  }
});
