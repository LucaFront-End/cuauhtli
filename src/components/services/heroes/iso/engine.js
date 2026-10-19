import { useEffect, useState } from 'react';

/* ==========================================================================
   ISO ENGINE · Sistemas Cuauhtli
   Real isometric projection (world units → SVG px), shading helpers,
   path sampling and a Lottie-like looping timeline clock.
   World axes:  x → down-right · y → down-left · z → up
   ========================================================================== */

export const C30 = Math.cos(Math.PI / 6);
export const S30 = 0.5;

export function createIso({ ox = 300, oy = 110, s = 20 } = {}) {
  const p = (x, y, z = 0) => [ox + (x - y) * C30 * s, oy + (x + y) * S30 * s - z * s];
  const pts = (list) =>
    list
      .map(([x, y, z = 0]) => {
        const [a, b] = p(x, y, z);
        return `${a.toFixed(1)},${b.toFixed(1)}`;
      })
      .join(' ');
  return { p, pts, s, ox, oy };
}

/* ---------- math ---------- */
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const easeOut = (k) => 1 - Math.pow(1 - k, 3);
export const easeIn = (k) => k * k * k;
export const pulse = (t, period, duty = 0.5) => ((t % period) / period < duty ? 1 : 0);

/** Deterministic pseudo random (for sparks / jitter that must not flicker per render) */
export function rand(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Mix a 6-digit hex color with white (amt > 0) or black (amt < 0) */
export function shade(hex, amt) {
  if (!hex || hex[0] !== '#' || hex.length !== 7) return hex;
  const n = parseInt(hex.slice(1), 16);
  const target = amt >= 0 ? 255 : 0;
  const k = Math.abs(amt);
  const ch = (c) => Math.round(c + (target - c) * k);
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

/** Screen-space facing for a world heading angle (radians, atan2(dy, dx)) */
export function screenFacing(angle) {
  const dx = Math.cos(angle) - Math.sin(angle);
  const dy = Math.cos(angle) + Math.sin(angle);
  return { flip: dx < -0.01 ? -1 : 1, away: dy < -0.01 };
}

/* ---------- paths ---------- */
/** Polyline path with rounded corners, sampled by distance → {x, y, angle} */
export function makePath(points, radius = 0) {
  let pts = [];
  if (radius > 0 && points.length > 2) {
    pts.push(points[0]);
    for (let i = 1; i < points.length - 1; i++) {
      const [px, py] = points[i - 1];
      const [cx, cy] = points[i];
      const [nx, ny] = points[i + 1];
      const d1 = Math.hypot(cx - px, cy - py);
      const d2 = Math.hypot(nx - cx, ny - cy);
      const r = Math.min(radius, d1 / 2, d2 / 2);
      const a = [cx + ((px - cx) / d1) * r, cy + ((py - cy) / d1) * r];
      const b = [cx + ((nx - cx) / d2) * r, cy + ((ny - cy) / d2) * r];
      for (let k = 0; k <= 10; k++) {
        const u = k / 10;
        pts.push([
          (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * cx + u * u * b[0],
          (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * cy + u * u * b[1],
        ]);
      }
    }
    pts.push(points[points.length - 1]);
  } else {
    pts = points.slice();
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const length = cum[cum.length - 1];
  const at = (dist) => {
    const d = clamp(dist, 0, length);
    let i = 1;
    while (i < cum.length - 1 && cum[i] < d) i++;
    const segLen = cum[i] - cum[i - 1] || 1;
    const k = (d - cum[i - 1]) / segLen;
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    return { x: lerp(x0, x1, k), y: lerp(y0, y1, k), angle: Math.atan2(y1 - y0, x1 - x0) };
  };
  return { length, at, atU: (u) => at(u * length) };
}

/* ---------- debug params (?isoT=8&isoState=night) ---------- */
export function debugParam(name) {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

/* ---------- Lottie-like timeline clock ---------- */
/**
 * Returns elapsed seconds, driven by requestAnimationFrame.
 * Pauses when the scene is off-screen or the tab is hidden and
 * freezes on a representative frame for prefers-reduced-motion users.
 */
export function useSceneClock(ref, { still = 6 } = {}) {
  const [t, setT] = useState(() => {
    const forced = parseFloat(debugParam('isoT'));
    return Number.isFinite(forced) ? forced : 0;
  });

  useEffect(() => {
    const forced = parseFloat(debugParam('isoT'));
    if (Number.isFinite(forced)) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setT(still);
      return undefined;
    }

    let visible = true;
    let raf;
    let last = performance.now();
    let acc = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 });
    if (ref.current) io.observe(ref.current);

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible && !document.hidden) {
        acc += dt;
        setT(acc);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ref, still]);

  return t;
}

/** Formats a running HH:MM:SS security clock starting at a base time */
export function cctvClock(t, base = 8 * 3600 + 42 * 60 + 5) {
  const total = Math.floor(base + t);
  const h = String(Math.floor(total / 3600) % 24).padStart(2, '0');
  const m = String(Math.floor(total / 60) % 60).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}
