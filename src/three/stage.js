import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { fit, contactShadow, tickAll } from './kit.js';

export function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

function makeRenderer({ alpha = true, preserve = false } = {}) {
  const r = new THREE.WebGLRenderer({
    antialias: true,
    alpha,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: preserve,
  });
  r.setClearColor(0x000000, 0);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NeutralToneMapping;
  r.toneMappingExposure = 1;
  r.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault());
  return r;
}

function makeEnvironment(renderer, scene, intensity = 1) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new RoomEnvironment();
  scene.environment = pmrem.fromScene(env, 0.04).texture;
  scene.environmentIntensity = intensity;
  env.dispose?.();
  pmrem.dispose();
}

function addLights(scene, { key = '#fff1dc', keyI = 2.1, rim = '#ffffff', rimI = 1.1, fill = null, fillI = 0 } = {}) {
  const k = new THREE.DirectionalLight(key, keyI);
  k.position.set(3, 5, 4);
  const r = new THREE.DirectionalLight(rim, rimI);
  r.position.set(-4, 2, -3);
  scene.add(k, r, k.target);
  let f = null;
  if (fill) {
    f = new THREE.PointLight(fill, fillI, 12, 1.4);
    f.position.set(0, -2.4, 2);
    scene.add(f);
  }
  return { key: k, rim: r, fill: f };
}

function enableShadows(renderer, light, size = 2048) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  light.castShadow = true;
  light.shadow.mapSize.set(size, size);
  light.shadow.bias = -0.0004;
  light.shadow.normalBias = 0.02;
  light.shadow.radius = 6;
}

// Stüdyo fonu: ortası açık, kenarları koyulaşan yumuşak degrade
function studioBackground(inner, outer) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(256, 210, 20, 256, 256, 380);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function castAll(obj) {
  obj.traverse((o) => {
    if (o.isMesh && !o.userData.isShadow && !(o.material && o.material.transparent && o.material.opacity < 0.5)) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
}

export function disposeObject(obj, { materials = true } = {}) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (materials && o.material) {
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    }
  });
}

// ============================================================================
// Ana sahne: hero ve hikâye bölümlerinin arkasındaki sabit tuval
// ============================================================================
export class Stage {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;
    this.isMobile = window.innerWidth < 768;
    this.renderer = makeRenderer();
    container.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    makeEnvironment(this.renderer, this.scene, opts.envIntensity ?? 0.9);
    this.lights = addLights(this.scene, opts.lights);
    if (opts.shadows) enableShadows(this.renderer, this.lights.key, this.isMobile ? 1024 : 2048);
    this.camera = new THREE.PerspectiveCamera(opts.fov ?? 30, 1, 0.1, 100);
    this.camera.position.set(0, 0, 12);
    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    this.active = true;
    this.hidden = false;
    this.updaters = new Set();
    this.resizers = new Set();
    this.elapsed = 0;
    this._last = performance.now();
    // Uyarlanabilir çözünürlük: yavaş cihazda piksel oranını kademeli düşür
    this.maxPR = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.35 : 1.5);
    this.pr = this.maxPR;
    this._slow = 0;
    this._frames = 0;

    this._onPointer = (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', this._onPointer, { passive: true });

    this._lastW = 0;
    this._lastH = 0;
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize(true);

    this._onVis = () => (this.hidden = document.hidden);
    document.addEventListener('visibilitychange', this._onVis);

    this.tick = this.tick.bind(this);
    gsap.ticker.add(this.tick);
  }

  get view() {
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    return { width: h * this.camera.aspect, height: h, aspect: this.camera.aspect };
  }

  resize(force) {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    // Mobil tarayıcı adres çubuğu açılıp kapanınca gereksiz yeniden boyutlandırma yapma
    if (force !== true && w === this._lastW && Math.abs(h - this._lastH) < 140) return;
    this._lastW = w;
    this._lastH = h;
    this.isMobile = w < 768;
    this.renderer.setPixelRatio(this.pr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.resizers.forEach((fn) => fn(this.view, this.isMobile));
  }

  onUpdate(fn) {
    this.updaters.add(fn);
    return () => this.updaters.delete(fn);
  }

  onResize(fn) {
    this.resizers.add(fn);
    fn(this.view, this.isMobile);
    return () => this.resizers.delete(fn);
  }

  setActive(v) {
    if (this.active === v) return;
    this.active = v;
    this.container.style.visibility = v ? 'visible' : 'hidden';
    this._last = performance.now();
  }

  adapt(dt) {
    // 60 karede bir ortalamaya bak; 45 FPS altındaysa çözünürlüğü düşür
    this._frames += 1;
    if (dt > 1 / 45) this._slow += 1;
    if (this._frames >= 60) {
      if (this._slow > 30 && this.pr > 1) {
        this.pr = Math.max(1, +(this.pr - 0.2).toFixed(2));
        this.resize(true);
      }
      this._frames = 0;
      this._slow = 0;
    }
  }

  tick() {
    const now = performance.now();
    const raw = (now - this._last) / 1000;
    const dt = Math.min(0.05, raw);
    this._last = now;
    if (!this.active || this.hidden) return;
    if (raw < 0.25) this.adapt(raw);
    this.elapsed += dt;
    const p = this.pointer;
    p.sx += (p.x - p.sx) * Math.min(1, dt * 3.5);
    p.sy += (p.y - p.sy) * Math.min(1, dt * 3.5);
    this.updaters.forEach((fn) => fn(this.elapsed, dt));
    tickAll(this.root, this.elapsed);
    this.renderer.render(this.scene, this.camera);
  }

  // İlk karede tüm shader'ları derle (kaydırırken takılma olmasın)
  warmup() {
    this.renderer.compile(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
  }
}

// ============================================================================
// Ürün görselleri: modelleri tek tek çizip görsele dönüştürür.
// studio seçeneğiyle fonlu, gerçek gölgeli "ürün fotoğrafı" üretir.
// ============================================================================
export class ThumbRenderer {
  constructor(width = 512, height = width, opts = {}) {
    this.w = width;
    this.h = height;
    this.studio = opts.studio || null;
    this.renderer = makeRenderer({ preserve: true, alpha: !this.studio });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height, false);
    this.scene = new THREE.Scene();
    makeEnvironment(this.renderer, this.scene, opts.envIntensity ?? 0.95);
    this.lights = addLights(this.scene, opts.lights);
    this.camera = new THREE.PerspectiveCamera(opts.fov ?? 26, width / height, 0.1, 100);
    this.shadowOpacity = opts.shadowOpacity ?? 0.34;
    if (this.studio) {
      this.scene.background = studioBackground(this.studio.inner, this.studio.outer);
      enableShadows(this.renderer, this.lights.key, 2048);
      this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.ShadowMaterial({ opacity: this.studio.shadow ?? 0.32, color: this.studio.shadowColor || '#000000' })
      );
      this.floor.rotation.x = -Math.PI / 2;
      this.floor.receiveShadow = true;
      this.scene.add(this.floor);
    }
  }

  async render(build, view = {}) {
    const obj = build();
    const holder = fit(obj, 2);
    if (view.rot) holder.rotation.set(view.rot[0] || 0, view.rot[1] || 0, view.rot[2] || 0);
    this.scene.add(holder);
    holder.updateMatrixWorld(true);
    if (this.studio) castAll(holder);

    const box = new THREE.Box3().setFromObject(holder);
    const center = box.getCenter(new THREE.Vector3());
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    let shadow = null;
    if (view.shadow !== false) {
      const sz = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) * 1.25;
      shadow = contactShadow(sz, this.studio ? this.shadowOpacity * 0.6 : this.shadowOpacity);
      shadow.position.set(center.x, box.min.y + 0.002, center.z);
      this.scene.add(shadow);
    }
    if (this.studio) {
      this.floor.position.y = box.min.y;
      const key = this.lights.key;
      key.position.copy(center).add(new THREE.Vector3(2.2, 4.5, 3.2));
      key.target.position.copy(center);
      const cam = key.shadow.camera;
      const r = sphere.radius * 1.6;
      cam.left = -r;
      cam.right = r;
      cam.top = r;
      cam.bottom = -r;
      cam.near = 0.1;
      cam.far = 20;
      cam.updateProjectionMatrix();
    }

    const el = view.el ?? 0.42;
    const az = view.az ?? 0.5;
    const fov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const fovX = Math.atan(Math.tan(fov) * this.camera.aspect);
    const zoom = (view.zoom ?? 1) * (this.studio ? this.studio.zoom ?? 0.82 : 1);
    const dist = (sphere.radius / Math.sin(Math.min(fov, fovX))) * (0.98 / zoom);
    const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
    this.camera.position.copy(center).addScaledVector(dir, dist);
    this.camera.lookAt(center.x, center.y - (view.lookDown ?? 0), center.z);

    tickAll(holder, 1.2);
    this.renderer.render(this.scene, this.camera);
    const type = this.studio ? 'image/jpeg' : 'image/webp';
    const blob = await new Promise((res) => this.renderer.domElement.toBlob(res, type, 0.9));

    this.scene.remove(holder);
    disposeObject(holder, { materials: false });
    if (shadow) {
      this.scene.remove(shadow);
      disposeObject(shadow, { materials: false });
    }
    return blob ? URL.createObjectURL(blob) : null;
  }

  dispose() {
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
  }
}

// ============================================================================
// Ürün penceresindeki canlı, sürüklenebilir 3D görüntüleyici
// ============================================================================
export class Viewer {
  constructor(opts = {}) {
    this.studio = opts.studio || null;
    this.renderer = makeRenderer({ alpha: !this.studio });
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    this.scene = new THREE.Scene();
    makeEnvironment(this.renderer, this.scene, opts.envIntensity ?? 0.95);
    this.lights = addLights(this.scene, opts.lights);
    if (this.studio) {
      this.scene.background = studioBackground(this.studio.inner, this.studio.outer);
      enableShadows(this.renderer, this.lights.key, 1024);
      this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.ShadowMaterial({ opacity: this.studio.shadow ?? 0.3, color: this.studio.shadowColor || '#000000' })
      );
      this.floor.rotation.x = -Math.PI / 2;
      this.floor.receiveShadow = true;
      this.scene.add(this.floor);
    }
    this.camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);
    this.rotY = 0;
    this.velY = 0;
    this.tilt = 0;
    this.dragging = false;
    this.running = false;
    this.elapsed = 0;
    this.view = {};
    this.shadowOpacity = opts.shadowOpacity ?? 0.3;
    this.loop = this.loop.bind(this);
    this.resize = this.resize.bind(this);
    this._ro = new ResizeObserver(this.resize);
  }

  // Tuvali verilen kaba yerleştirir ve sürükleme olaylarını bağlar
  attach(container) {
    this._abort?.abort();
    this._ro.disconnect();
    this.container = container;
    container.prepend(this.renderer.domElement);
    this._ro.observe(container);
    const ac = new AbortController();
    this._abort = ac;
    const o = { signal: ac.signal };
    let lastX = 0;
    let lastY = 0;
    container.addEventListener(
      'pointerdown',
      (e) => {
        this.dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        container.setPointerCapture?.(e.pointerId);
      },
      o
    );
    container.addEventListener(
      'pointermove',
      (e) => {
        if (!this.dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        this.velY = dx * 0.012;
        this.rotY += this.velY;
        this.tilt = Math.max(-0.35, Math.min(0.35, this.tilt + dy * 0.004));
      },
      o
    );
    const end = () => (this.dragging = false);
    container.addEventListener('pointerup', end, o);
    container.addEventListener('pointercancel', end, o);
    container.addEventListener('lostpointercapture', end, o);
  }

  resize() {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.frame();
  }

  frame() {
    if (!this.sphere) return;
    const fov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const fovX = Math.atan(Math.tan(fov) * this.camera.aspect);
    const dist = (this.sphere.radius / Math.sin(Math.min(fov, fovX))) * (this.studio ? 1.12 : 1.02);
    const el = this.view.el ?? 0.38;
    this.camera.position.set(0, Math.sin(el) * dist + this.sphere.center.y, Math.cos(el) * dist);
    this.camera.lookAt(0, this.sphere.center.y, 0);
  }

  show(build, view = {}) {
    this.clear();
    this.view = view;
    const holder = fit(build(), 2);
    if (view.rot) holder.rotation.set(view.rot[0] || 0, view.rot[1] || 0, view.rot[2] || 0);
    holder.updateMatrixWorld(true);
    if (this.studio) castAll(holder);
    const box = new THREE.Box3().setFromObject(holder);
    const c = box.getCenter(new THREE.Vector3());
    holder.position.x -= c.x;
    holder.position.z -= c.z;
    this.pivot.add(holder);
    const sz = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) * 1.25;
    const sh = contactShadow(sz, this.studio ? this.shadowOpacity * 0.6 : this.shadowOpacity);
    sh.position.y = box.min.y + 0.002;
    this.pivot.add(sh);
    this.holder = holder;
    this.shadow = sh;
    this.pivot.rotation.set(0, 0, 0);
    this.pivot.updateMatrixWorld(true);
    box.setFromObject(this.pivot);
    this.sphere = box.getBoundingSphere(new THREE.Sphere());
    if (this.studio) {
      this.floor.position.y = box.min.y;
      const key = this.lights.key;
      key.position.set(2.2, 4.5 + this.sphere.center.y, 3.2);
      key.target.position.copy(this.sphere.center);
      const cam = key.shadow.camera;
      const r = this.sphere.radius * 1.8;
      cam.left = -r;
      cam.right = r;
      cam.top = r;
      cam.bottom = -r;
      cam.far = 20;
      cam.updateProjectionMatrix();
    }
    this.rotY = view.az ?? 0.5;
    this.velY = 0.004;
    this.tilt = 0;
    this.resize();
    if (!this.running) {
      this.running = true;
      this._last = performance.now();
      gsap.ticker.add(this.loop);
    }
  }

  loop() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - this._last) / 1000);
    this._last = now;
    this.elapsed += dt;
    if (!this.dragging) {
      this.velY += (0.0035 - this.velY) * Math.min(1, dt * 1.5);
      this.rotY += this.velY;
      this.tilt += (0 - this.tilt) * Math.min(1, dt * 2);
    }
    this.pivot.rotation.y = this.rotY;
    this.pivot.rotation.x = this.tilt;
    tickAll(this.pivot, this.elapsed);
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    if (this.holder) {
      this.pivot.remove(this.holder);
      disposeObject(this.holder, { materials: false });
      this.holder = null;
    }
    if (this.shadow) {
      this.pivot.remove(this.shadow);
      disposeObject(this.shadow, { materials: false });
      this.shadow = null;
    }
  }

  stop() {
    if (this.running) {
      gsap.ticker.remove(this.loop);
      this.running = false;
    }
    this.clear();
  }
}
