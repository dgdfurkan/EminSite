import * as THREE from 'three';

// Ürün fotoğrafçılığı stüdyosu: degrade kubbe + büyük softbox'lar + şerit ışıklar.
// Porselen, cam ve metallerde uzun, yumuşak ve gerçekçi yansımalar üretir.

const domeVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const domeFrag = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  varying vec3 vDir;
  void main() {
    float y = vDir.y;
    vec3 c = y > 0.0 ? mix(uHorizon, uTop, pow(y, 0.7)) : mix(uHorizon, uGround, pow(-y, 0.45));
    gl_FragColor = vec4(c, 1.0);
  }
`;

const cache = new WeakMap();

export function studioEnvironment(renderer, { warmth = 0.5, strength = 1, dark = false } = {}) {
  const key = `${warmth}|${strength}|${dark}`;
  let perRenderer = cache.get(renderer);
  if (!perRenderer) cache.set(renderer, (perRenderer = new Map()));
  if (perRenderer.has(key)) return perRenderer.get(key);

  const warm = new THREE.Color().setRGB(1, 0.96 - 0.04 * warmth, 0.9 - 0.1 * warmth);
  const cool = new THREE.Color().setRGB(0.92, 0.95, 1);
  const scene = new THREE.Scene();

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(30, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: (dark ? new THREE.Color(0.22, 0.21, 0.2) : new THREE.Color(0.85, 0.83, 0.8)).multiplyScalar(strength) },
        uHorizon: { value: (dark ? new THREE.Color(0.1, 0.095, 0.09) : new THREE.Color(0.52, 0.49, 0.46)).multiplyScalar(strength) },
        uGround: { value: (dark ? new THREE.Color(0.02, 0.02, 0.02) : new THREE.Color(0.16, 0.14, 0.12)).multiplyScalar(strength) },
      },
      vertexShader: domeVert,
      fragmentShader: domeFrag,
    })
  );
  scene.add(dome);

  const softbox = (w, h, pos, color, intensity) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(intensity * strength), side: THREE.DoubleSide })
    );
    m.position.set(pos[0], pos[1], pos[2]);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  // ana ışık: sol üst önde büyük softbox
  softbox(9, 7, [-8, 9, 8], warm, dark ? 5 : 4.2);
  // dolgu: sağda dikey şerit
  softbox(2.4, 12, [11, 2, 3], cool, dark ? 2.2 : 2.6);
  // kontur: arkada yatay şerit
  softbox(14, 2.2, [0, 7, -11], warm, dark ? 4 : 3.2);
  // tavan: yumuşak genel aydınlık
  softbox(16, 16, [0, 16, 0], warm, dark ? 0.9 : 1.6);
  // zemin sekmesi
  softbox(14, 14, [0, -14, 2], warm, dark ? 0.12 : 0.35);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(scene, 0.035, 0.1, 100).texture;
  pmrem.dispose();
  scene.traverse((o) => {
    o.geometry?.dispose();
    o.material?.dispose();
  });
  perRenderer.set(key, tex);
  return tex;
}
