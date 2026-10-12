import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource/anton/index.css';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/manrope/index.css';
import './styles/base.css';
import './styles/themes.css';
import './styles/components.css';
import { getConceptId } from './core/concepts.js';

const loaders = {
  cigkofte: () => import('./concepts/cigkofte/index.js'),
  durum: () => import('./concepts/durum/index.js'),
  kafe: () => import('./concepts/kafe/index.js'),
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
