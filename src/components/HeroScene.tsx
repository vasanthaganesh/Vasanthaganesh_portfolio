"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* Ashima 3D simplex noise (MIT) */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// Ridge geometry spans z ∈ [Z_CREST, Z_NEAR]; crest is the far edge (horizon line).
const Z_CREST = -6;
const Z_NEAR = 5;
const X_HALF = 16;

const ridgeVert = /* glsl */ `
uniform float uTime;
uniform float uPixel;
attribute float aSeed;
varying vec3 vColor;
varying float vAlpha;
${NOISE}
vec3 pal(float t){ return .5+.5*cos(6.2831*(vec3(1.)*t+vec3(.0,.33,.67))); }
void main(){
  vec3 p = position;
  float t = (p.z - ${Z_CREST.toFixed(1)}) / ${(Z_NEAR - Z_CREST).toFixed(1)}; // 0 crest → 1 near
  float y = -t*t*2.4;

  // Organic undulating wave that gives dynamic depth and curvature to the horizon crest
  float w1 = sin(p.x * 0.18 + uTime * 0.04) * 0.65;
  float w2 = sin(p.x * 0.38 - uTime * 0.028 + 1.2) * 0.35;
  float w3 = cos(p.x * 0.09 + uTime * 0.018) * 0.40;
  float horizonWave = w1 + w2 + w3;

  // Flowing depth wave across the dune field
  float duneFlow = sin(p.x * 0.22 + p.z * 0.35 + uTime * 0.045) * 0.42 * smoothstep(0.0, 0.4, t);

  // Simplex noise displacement for organic terrain texture
  float amp = 0.30 + 0.70 * smoothstep(0.0, 0.35, t);
  float n1 = snoise(vec3(p.x * 0.20, p.z * 0.30, uTime * 0.035));
  float n2 = snoise(vec3(p.x * 0.85 + n1, p.z * 1.0, uTime * 0.055));

  y += horizonWave + duneFlow + amp * (0.55 * n1 + 0.12 * n2);
  p.y = y;

  // flowing iridescent "liquid light" veins
  float v = snoise(vec3(p.x*.22 + y*1.4, p.z*.38, uTime*.04));
  float vein = pow(1. - abs(v), 7.);
  float v2 = snoise(vec3(p.x*.5 - y, p.z*.8 + 3., uTime*.05));
  vein = max(vein, .6*pow(1. - abs(v2), 10.));
  vec3 iri = pal(v*.9 + p.x*.035 + p.z*.05 + uTime*.02);
  iri = mix(iri, vec3(.7,.8,1.), .25);
  float rim = smoothstep(.07, .0, t);
  float glow = exp(-p.x*p.x*.015) * (1. - smoothstep(.0,.6,t));
  // facing light: surfaces tilted toward the crest catch more light
  float shade = .5 + .5*n1;

  vec3 base = vec3(.6,.66,.8) * (.22 + .38*aSeed) * (.55 + .6*shade);
  vColor = base + iri*vein*1.4 + vec3(.78,.87,1.)*(rim*1.6 + glow*.7);
  vAlpha = clamp(.35 + .45*aSeed + vein*.85 + rim + glow*.6, 0., 1.);

  vec4 mv = modelViewMatrix * vec4(p,1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.2 + aSeed*1.4 + vein*1.6) * uPixel * (5.5 / -mv.z);
}`;

const pointFrag = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - .5;
  float d = length(c);
  if(d > .5) discard;
  gl_FragColor = vec4(vColor, vAlpha * smoothstep(.5,.0,d));
}`;

const starVert = /* glsl */ `
uniform float uTime;
uniform float uPixel;
attribute float aSeed;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec4 mv = modelViewMatrix * vec4(position,1.);
  gl_Position = projectionMatrix * mv;
  float tw = .55 + .45*sin(uTime*(.6+aSeed*1.8) + aSeed*40.);
  vColor = mix(vec3(.75,.85,1.), vec3(1.), aSeed);
  vAlpha = tw * (.25 + .75*aSeed*aSeed);
  gl_PointSize = (1. + aSeed*1.8) * uPixel;
}`;

type Props = { onCrest?: (x: number, y: number) => void };


export default function HeroScene({ onCrest }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const crestCb = useRef(onCrest);
  crestCb.current = onCrest;

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    const camBase = new THREE.Vector3(0, 0.9, 6.5);
    const target = new THREE.Vector3(0, mobile ? 2.85 : 1.75, -6);
    camera.position.copy(camBase);

    // --- Ridge particles
    const cols = mobile ? 230 : 400;
    const rows = mobile ? 150 : 260;
    const count = cols * rows;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    let k = 0;
    for (let r = 0; r < rows; r++) {
      // denser toward crest
      const rz = Math.pow(r / (rows - 1), 1.6);
      for (let c = 0; c < cols; c++) {
        const jx = (Math.random() - 0.5) * (2 * X_HALF) / cols * 1.6;
        const jz = (Math.random() - 0.5) * 0.06;
        pos[k * 3] = -X_HALF + (c / (cols - 1)) * 2 * X_HALF + jx;
        pos[k * 3 + 1] = 0;
        pos[k * 3 + 2] = Z_CREST + rz * (Z_NEAR - Z_CREST) + jz;
        seed[k] = Math.random();
        k++;
      }
    }
    const ridgeGeo = new THREE.BufferGeometry();
    ridgeGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    ridgeGeo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const uniforms = { uTime: { value: 0 }, uPixel: { value: dpr } };
    const ridgeMat = new THREE.ShaderMaterial({
      vertexShader: ridgeVert,
      fragmentShader: pointFrag,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ridge = new THREE.Points(ridgeGeo, ridgeMat);
    ridge.rotation.z = mobile ? 0.14 : 0.20; // undulating diagonal horizon with organic wave depth
    ridge.frustumCulled = false;
    scene.add(ridge);

    // --- Stars
    const sCount = mobile ? 500 : 900;
    const sPos = new Float32Array(sCount * 3);
    const sSeed = new Float32Array(sCount);
    for (let i = 0; i < sCount; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 120;
      sPos[i * 3 + 1] = Math.random() * 50 - 4;
      sPos[i * 3 + 2] = -30 - Math.random() * 40;
      sSeed[i] = Math.random();
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute("aSeed", new THREE.BufferAttribute(sSeed, 1));
    const starMat = new THREE.ShaderMaterial({
      vertexShader: starVert,
      fragmentShader: pointFrag,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // --- Sizing
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.fov = w / h < 1 ? 62 : 50;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // --- Pointer parallax
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // --- Crest wave tracker for human silhouette
    const getCrestWave = (x: number, t: number) => {
      const w1 = Math.sin(x * 0.18 + t * 0.04) * 0.65;
      const w2 = Math.sin(x * 0.38 - t * 0.028 + 1.2) * 0.35;
      const w3 = Math.cos(x * 0.09 + t * 0.018) * 0.40;
      return w1 + w2 + w3;
    };

    // --- Crest anchor (for the silhouette overlay)
    const crestLocal = new THREE.Vector3(mobile ? 0.6 : 1.1, 0, Z_CREST);
    const tmp = new THREE.Vector3();
    const reportCrest = () => {
      crestLocal.y = getCrestWave(crestLocal.x, uniforms.uTime.value);
      ridge.updateMatrixWorld();
      tmp.copy(crestLocal).applyMatrix4(ridge.matrixWorld).project(camera);
      crestCb.current?.((tmp.x + 1) / 2, (1 - tmp.y) / 2);
    };

    // --- Loop (paused when offscreen)
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.set(camBase.x + mouse.x * 0.35, camBase.y - mouse.y * 0.15, camBase.z);
      camera.lookAt(target);
      stars.rotation.z = uniforms.uTime.value * 0.004;
      renderer.render(scene, camera);
      if (crestCb.current) reportCrest();
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible) render();
    };
    if (reduced) {
      uniforms.uTime.value = 12;
      render();
      const onR = () => render();
      window.addEventListener("resize", onR);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      ridgeGeo.dispose();
      starGeo.dispose();
      ridgeMat.dispose();
      starMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className={`absolute inset-0 ${failed ? "sky-fallback" : ""}`} aria-hidden />;
}
