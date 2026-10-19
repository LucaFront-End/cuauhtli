import React from 'react';
import { shade, screenFacing, C30, S30 } from './engine';

/* ==========================================================================
   ISO PRIMITIVES · reusable shaded isometric building blocks
   ========================================================================== */

const EDGE = 'rgba(15,23,42,0.10)';
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* ---------- face helpers (return SVG points strings) ---------- */
export const faceY = (iso, y, x0, x1, z0, z1) => iso.pts([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]);
export const faceX = (iso, x, y0, y1, z0, z1) => iso.pts([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]]);
export const flat = (iso, x0, y0, x1, y1, z = 0) => iso.pts([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]);

/** SVG matrix that maps flat 2D drawing onto a vertical iso plane */
export const planeY = (iso, x, y, z) => {
  const [a, b] = iso.p(x, y, z);
  return `matrix(${C30},${S30},0,1,${a},${b})`; // runs along +x
};
export const planeX = (iso, x, y, z) => {
  const [a, b] = iso.p(x, y, z);
  return `matrix(${C30},${-S30},0,1,${a},${b})`; // runs along -y (readable on x-facing walls)
};
export const planeFloor = (iso, x, y, z = 0) => {
  const [a, b] = iso.p(x, y, z);
  return `matrix(${C30},${S30},${-C30},${S30},${a},${b})`;
};

/* ---------- shared defs (gradients / filters) ---------- */
export function IsoDefs() {
  return (
    <defs>
      <radialGradient id="iso-sphere" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
        <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
      </radialGradient>
      <linearGradient id="iso-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#CFE3F1" />
        <stop offset="55%" stopColor="#7FA6C2" />
        <stop offset="100%" stopColor="#3D6886" />
      </linearGradient>
      <linearGradient id="iso-glass-dark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5B7A90" />
        <stop offset="100%" stopColor="#14202B" />
      </linearGradient>
      <linearGradient id="iso-glass-clear" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="iso-window-lit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFE7B0" />
        <stop offset="100%" stopColor="#F6B85C" />
      </linearGradient>
      <radialGradient id="iso-pool">
        <stop offset="0%" stopColor="#FFE2A8" stopOpacity="0.75" />
        <stop offset="60%" stopColor="#FFD58A" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#FFD58A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="iso-red-pool">
        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="iso-heat">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#FDE047" />
        <stop offset="55%" stopColor="#F97316" />
        <stop offset="80%" stopColor="#DC2626" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
      </radialGradient>
      <filter id="iso-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
      <filter id="iso-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id="iso-glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="iso-thermal-env">
        <feColorMatrix
          type="matrix"
          values="0.10 0.10 0.10 0 0.02
                  0.05 0.08 0.10 0 0.02
                  0.30 0.35 0.40 0 0.12
                  0    0    0    1 0"
        />
      </filter>
      <pattern id="iso-hatch-red" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="rgba(166,25,46,0.10)" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(166,25,46,0.55)" strokeWidth="2" />
      </pattern>
    </defs>
  );
}

/* ---------- axis aligned shaded box ---------- */
export function Box({ iso, x, y, z = 0, w, d, h, color = '#E2E8F0', top, left, right, stroke = EDGE, opacity = 1, sw = 0.6 }) {
  const t = top || shade(color, 0.22);
  const l = left || shade(color, 0.04);
  const r = right || shade(color, -0.14);
  return (
    <g opacity={opacity}>
      <polygon points={faceY(iso, y + d, x, x + w, z, z + h)} fill={l} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <polygon points={faceX(iso, x + w, y, y + d, z, z + h)} fill={r} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <polygon points={flat(iso, x, y, x + w, y + d, z + h)} fill={t} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </g>
  );
}

/* ---------- yaw-rotated (optionally tapered) box ---------- */
export function OBox({ iso, cx, cy, z = 0, len, wid, h, yaw = 0, color = '#E2E8F0', top, side, tlen, twid, toff = 0, stroke = EDGE, opacity = 1 }) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const tl = tlen ?? len;
  const tw = twid ?? wid;
  const cornerAt = (L, W, off) => {
    const hl = L / 2;
    const hw = W / 2;
    return [[hl, -hw], [hl, hw], [-hl, hw], [-hl, -hw]].map(([u, v]) => [cx + (u + off) * c - v * s, cy + (u + off) * s + v * c]);
  };
  const b = cornerAt(len, wid, 0);
  const tp = cornerAt(tl, tw, toff);
  const normals = [[c, s], [-s, c], [-c, -s], [s, -c]];
  const faces = [];
  for (let i = 0; i < 4; i++) {
    const [nx, ny] = normals[i];
    if (nx + ny <= 0.001) continue;
    const j = (i + 1) % 4;
    const light = (ny - nx) / 2; // left-facing faces receive more light
    const base = side || color;
    faces.push(
      <polygon
        key={i}
        points={iso.pts([[b[i][0], b[i][1], z], [b[j][0], b[j][1], z], [tp[j][0], tp[j][1], z + h], [tp[i][0], tp[i][1], z + h]])}
        fill={base.startsWith('url') ? base : shade(base, -0.05 + light * 0.16)}
        stroke={stroke}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    );
  }
  return (
    <g opacity={opacity}>
      {faces}
      <polygon points={iso.pts(tp.map(([px, py]) => [px, py, z + h]))} fill={top || shade(color, 0.2)} stroke={stroke} strokeWidth="0.6" strokeLinejoin="round" />
    </g>
  );
}

/* ---------- ground contact shadow ---------- */
export function Shadow({ iso, x, y, rx = 1, ry, opacity = 0.2 }) {
  const [sx, sy] = iso.p(x, y, 0);
  const R = rx * iso.s * 1.22;
  return <ellipse cx={sx} cy={sy} rx={R} ry={ry ? ry * iso.s : R * 0.58} fill={`rgba(15,23,42,${opacity})`} filter="url(#iso-soft)" />;
}

/* ---------- foliage ---------- */
export function Tree({ iso, x, y, size = 1, color = '#4E8A5B', trunk = '#7A5A3C' }) {
  const [sx, sy] = iso.p(x, y, 0);
  const k = iso.s * size;
  return (
    <g>
      <ellipse cx={sx + k * 0.25} cy={sy + 1} rx={k * 1.1} ry={k * 0.5} fill="rgba(15,23,42,0.18)" filter="url(#iso-soft)" />
      <rect x={sx - k * 0.09} y={sy - k * 1.5} width={k * 0.18} height={k * 1.5} rx={k * 0.05} fill={trunk} />
      {[[-0.38, -1.7, 0.72], [0.4, -1.85, 0.66], [0, -2.45, 0.82]].map(([dx, dy, r], i) => (
        <g key={i}>
          <circle cx={sx + dx * k} cy={sy + dy * k} r={r * k} fill={i === 2 ? shade(color, 0.08) : color} />
          <circle cx={sx + dx * k} cy={sy + dy * k} r={r * k} fill="url(#iso-sphere)" />
        </g>
      ))}
    </g>
  );
}

export function Bush({ iso, x, y, size = 1, color = '#5A9466' }) {
  const [sx, sy] = iso.p(x, y, 0);
  const k = iso.s * size;
  return (
    <g>
      <ellipse cx={sx} cy={sy + 1} rx={k * 0.7} ry={k * 0.3} fill="rgba(15,23,42,0.16)" filter="url(#iso-soft)" />
      {[[-0.3, -0.35, 0.42], [0.3, -0.38, 0.4], [0, -0.62, 0.45]].map(([dx, dy, r], i) => (
        <g key={i}>
          <circle cx={sx + dx * k} cy={sy + dy * k} r={r * k} fill={color} />
          <circle cx={sx + dx * k} cy={sy + dy * k} r={r * k} fill="url(#iso-sphere)" />
        </g>
      ))}
    </g>
  );
}

export function Planter({ iso, x, y, size = 1 }) {
  const w = 0.55 * size;
  return (
    <g>
      <Box iso={iso} x={x - w / 2} y={y - w / 2} w={w} d={w} h={0.5 * size} color="#E7E2DA" />
      <Bush iso={iso} x={x} y={y} size={0.75 * size} color="#4F8B5E" />
    </g>
  );
}

/* ---------- street lamp ---------- */
export function Lamp({ iso, x, y, h = 3.4, on = false }) {
  const [bx, by] = iso.p(x, y, 0);
  const [hx, hy] = iso.p(x, y, h);
  return (
    <g>
      <ellipse cx={bx} cy={by} rx="5" ry="2.5" fill="rgba(15,23,42,0.25)" />
      <line x1={bx} y1={by} x2={hx} y2={hy} stroke="#475569" strokeWidth="2.2" strokeLinecap="round" />
      <line x1={hx} y1={hy} x2={hx + 9} y2={hy + 4} stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <rect x={hx + 5} y={hy + 2.5} width="9" height="3.5" rx="1.5" fill="#1F2937" />
      <rect x={hx + 6} y={hy + 5} width="7" height="1.6" rx="0.8" fill={on ? '#FFF3C4' : '#CBD5E1'} filter={on ? 'url(#iso-glow)' : undefined} />
    </g>
  );
}

export function LampPool({ iso, x, y, r = 2.6, opacity = 1 }) {
  const [sx, sy] = iso.p(x + 0.35, y - 0.05, 0);
  const R = r * iso.s * 1.22;
  return <ellipse cx={sx} cy={sy} rx={R} ry={R * 0.58} fill="url(#iso-pool)" opacity={opacity} style={{ mixBlendMode: 'screen' }} />;
}

/* ---------- people ---------- */
/**
 * Stylised isometric person with a procedural walk cycle.
 * pose: 'walk' | 'stand' | 'reach' | 'press' | 'carry' | 'recoil' | 'run'
 */
export function Person({
  iso, x, y, z = 0, heading = 0, phase = 0, moving = false, pose = 'walk',
  shirt = '#2B5672', pants = '#1F2937', skin = '#D9A98A', hair = '#231F20',
  cap = null, scale = 1, opacity = 1, carry = false, lean = 0,
}) {
  const [sx, sy] = iso.p(x, y, z);
  const H = 1.72 * iso.s * scale;
  const { flip, away } = screenFacing(heading);
  const run = pose === 'run';
  const amp = moving ? (run ? 1.5 : 1) : 0;
  const sw = Math.sin(phase) * amp;
  const bob = moving ? Math.abs(Math.cos(phase)) * H * (run ? 0.04 : 0.022) : 0;

  const hipY = -0.5 * H;
  const shY = -0.81 * H;
  const headY = -0.915 * H;
  const legW = 0.105 * H;
  const armW = 0.075 * H;

  const leg = (dir, color) => {
    const fx = dir * sw * 0.15 * H;
    const kx = fx * 0.55 + (moving ? 0.025 * H * Math.max(0, dir * Math.cos(phase)) : 0);
    return (
      <polyline
        points={`${dir * 0.02 * H},${hipY} ${kx},${-0.25 * H} ${fx},${-0.02 * H}`}
        fill="none" stroke={color} strokeWidth={legW} strokeLinecap="round" strokeLinejoin="round"
      />
    );
  };

  const armPts = (dir) => {
    if (pose === 'reach' || pose === 'recoil') {
      const spread = pose === 'recoil' ? 0.16 : 0.05;
      return `0,${shY + 0.02 * H} ${dir * spread * H + 0.06 * H},${-1.0 * H} ${dir * spread * 1.3 * H + 0.08 * H},${-1.16 * H}`;
    }
    if (pose === 'press' && dir === 1) return `0,${shY + 0.02 * H} ${0.12 * H},${-0.7 * H} ${0.24 * H},${-0.74 * H}`;
    if (carry || pose === 'carry') return `0,${shY + 0.02 * H} ${0.1 * H},${-0.62 * H} ${0.2 * H},${-0.66 * H}`;
    const hx = -dir * sw * 0.13 * H;
    return `0,${shY + 0.02 * H} ${hx * 0.6},${-0.63 * H} ${hx},${-0.49 * H}`;
  };

  const handOf = (str) => str.split(' ').pop().split(',').map(Number);
  const back = armPts(-1);
  const front = armPts(1);
  const [bhx, bhy] = handOf(back);
  const [fhx, fhy] = handOf(front);

  return (
    <g opacity={opacity} transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)})`}>
      <ellipse cx={0.05 * H} cy="0" rx={0.2 * H} ry={0.075 * H} fill="rgba(15,23,42,0.24)" filter="url(#iso-soft)" />
      <g transform={`scale(${flip},1) translate(0,${(-bob).toFixed(2)}) rotate(${lean},0,${hipY})`}>
        {leg(-1, shade(pants, -0.25))}
        <polyline points={back} fill="none" stroke={shade(shirt, -0.22)} strokeWidth={armW} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={bhx} cy={bhy} r={armW * 0.55} fill={shade(skin, -0.12)} />
        {leg(1, pants)}
        {/* torso */}
        <rect x={-0.1 * H} y={-0.86 * H} width={0.2 * H} height={0.4 * H} rx={0.07 * H} fill={shirt} />
        <rect x={-0.1 * H} y={-0.86 * H} width={0.08 * H} height={0.4 * H} rx={0.05 * H} fill={shade(shirt, -0.2)} opacity="0.55" />
        <rect x={-0.1 * H} y={-0.52 * H} width={0.2 * H} height={0.045 * H} fill={shade(pants, -0.1)} opacity="0.8" />
        {/* neck + head */}
        <rect x={-0.025 * H} y={-0.88 * H} width={0.05 * H} height={0.05 * H} fill={shade(skin, -0.1)} />
        <circle cx={0.01 * H} cy={headY} r={0.078 * H} fill={skin} />
        {away ? (
          <circle cx={0.01 * H} cy={headY - 0.004 * H} r={0.08 * H} fill={hair} />
        ) : (
          <path
            d={`M ${-0.07 * H} ${headY + 0.01 * H} A ${0.08 * H} ${0.08 * H} 0 0 1 ${0.088 * H} ${headY - 0.012 * H} Q ${0.02 * H} ${headY - 0.03 * H} ${-0.03 * H} ${headY + 0.04 * H} Z`}
            fill={hair}
          />
        )}
        {cap && (
          <g>
            <path d={`M ${-0.075 * H} ${headY - 0.01 * H} A ${0.082 * H} ${0.082 * H} 0 0 1 ${0.09 * H} ${headY - 0.01 * H} Z`} fill={cap} />
            <rect x={0.04 * H} y={headY - 0.018 * H} width={0.09 * H} height={0.022 * H} rx={0.01 * H} fill={shade(cap, -0.2)} />
          </g>
        )}
        {/* carried parcel */}
        {(carry || pose === 'carry') && (
          <g>
            <rect x={0.06 * H} y={-0.76 * H} width={0.22 * H} height={0.17 * H} rx="1" fill="#C89B6D" />
            <rect x={0.06 * H} y={-0.76 * H} width={0.22 * H} height={0.04 * H} fill="#B07F52" />
            <rect x={0.15 * H} y={-0.76 * H} width={0.035 * H} height={0.17 * H} fill="#E9D8B4" />
          </g>
        )}
        <polyline points={front} fill="none" stroke={shirt} strokeWidth={armW} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={fhx} cy={fhy} r={armW * 0.55} fill={skin} />
      </g>
    </g>
  );
}

/** Screen-space rectangle that wraps a person standing at world (x,y) */
export function personRect(iso, x, y, scale = 1) {
  const [sx, sy] = iso.p(x, y, 0);
  const H = 1.72 * iso.s * scale;
  return { x: sx - 0.3 * H, y: sy - 1.08 * H, w: 0.6 * H, h: 1.14 * H };
}

/* ---------- vehicles ---------- */
export function CarBeam({ iso, x, y, yaw = 0, opacity = 1 }) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const at = (u, v) => [x + u * c - v * s, y + u * s + v * c, 0];
  const L = 2.35;
  return (
    <polygon
      points={iso.pts([at(L / 2, -0.4), at(L / 2, 0.4), at(L / 2 + 4.4, 1.6), at(L / 2 + 4.4, -1.6)])}
      fill="rgba(255,236,170,0.42)"
      opacity={opacity}
      filter="url(#iso-soft)"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

export function Car({ iso, x, y, yaw = 0, color = '#E5E7EB', lights = false, brake = false, opacity = 1, beams = false }) {
  const L = 2.35;
  const W = 1.1;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const at = (u, v) => [x + u * c - v * s, y + u * s + v * c];
  const wheels = [[0.72, 0.5], [0.72, -0.5], [-0.72, 0.5], [-0.72, -0.5]];
  const lamp = (u, v, z, fill, r = 1.8) => {
    const [wx, wy] = at(u, v);
    const [px, py] = iso.p(wx, wy, z);
    return <ellipse cx={px} cy={py} rx={r} ry={r * 0.7} fill={fill} filter="url(#iso-glow)" />;
  };
  const frontVisible = c + s > -0.2;
  const backVisible = c + s < 0.2;
  return (
    <g opacity={opacity}>
      {beams && <CarBeam iso={iso} x={x} y={y} yaw={yaw} />}
      <OBox iso={iso} cx={x} cy={y} z={0} len={L + 0.25} wid={W + 0.2} h={0.01} yaw={yaw} color="#0F172A" top="rgba(15,23,42,0.22)" side="rgba(0,0,0,0)" stroke="none" />
      {wheels.map(([u, v], i) => {
        const [wx, wy] = at(u, v);
        return <OBox key={i} iso={iso} cx={wx} cy={wy} z={0} len={0.52} wid={0.2} h={0.42} yaw={yaw} color="#111827" top="#1F2937" stroke="none" />;
      })}
      <OBox iso={iso} cx={x} cy={y} z={0.2} len={L} wid={W} h={0.42} yaw={yaw} color={color} tlen={L - 0.08} twid={W - 0.04} />
      <OBox iso={iso} cx={x} cy={y} z={0.62} len={1.4} wid={W - 0.12} h={0.4} yaw={yaw} color={color} side="url(#iso-glass-dark)" top={shade(color, 0.12)} tlen={0.95} twid={W - 0.3} toff={-0.12} />
      {frontVisible && (
        <g>
          {lamp(L / 2, -0.38, 0.48, lights ? '#FFF7D6' : '#E2E8F0', lights ? 2.4 : 1.5)}
          {lamp(L / 2, 0.38, 0.48, lights ? '#FFF7D6' : '#E2E8F0', lights ? 2.4 : 1.5)}
        </g>
      )}
      {backVisible && (
        <g>
          {lamp(-L / 2, -0.38, 0.5, brake ? '#FF3B3B' : '#B91C1C', brake ? 2.4 : 1.5)}
          {lamp(-L / 2, 0.38, 0.5, brake ? '#FF3B3B' : '#B91C1C', brake ? 2.4 : 1.5)}
        </g>
      )}
    </g>
  );
}

/* ---------- AI detection overlay ---------- */
export function DetectBox({ x, y, w, h, color = '#22D3EE', label, sub, opacity = 1, dashed = false }) {
  const k = Math.min(w, h) * 0.28;
  const corners = [
    `M ${x} ${y + k} V ${y} H ${x + k}`,
    `M ${x + w - k} ${y} H ${x + w} V ${y + k}`,
    `M ${x + w} ${y + h - k} V ${y + h} H ${x + w - k}`,
    `M ${x + k} ${y + h} H ${x} V ${y + h - k}`,
  ];
  const tw = Math.max(46, (label?.length || 0) * 4.7 + 12);
  return (
    <g opacity={opacity} style={{ pointerEvents: 'none' }}>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.07" stroke={color} strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray={dashed ? '3 2' : undefined} />
      {corners.map((d, i) => <path key={i} d={d} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />)}
      {label && (
        <g transform={`translate(${x},${y - 13})`}>
          <rect width={tw} height="11" rx="2.5" fill={color} />
          <text x="5" y="7.8" fill="#04121A" fontSize="6.6" fontWeight="700" fontFamily={MONO}>{label}</text>
        </g>
      )}
      {sub && (
        <g transform={`translate(${x},${y + h + 3})`}>
          <rect width={Math.max(40, sub.length * 4.3 + 10)} height="10" rx="2.5" fill="rgba(4,18,26,0.82)" />
          <text x="5" y="7" fill={color} fontSize="6" fontWeight="700" fontFamily={MONO}>{sub}</text>
        </g>
      )}
    </g>
  );
}

/** Expanding ground ring (radio / alarm pulse) */
export function GroundRing({ iso, x, y, t, period = 1.6, maxR = 3, color = '#A6192E', width = 1.4, delay = 0 }) {
  const k = (((t - delay) % period) + period) % period / period;
  const [sx, sy] = iso.p(x, y, 0);
  const R = k * maxR * iso.s * 1.22;
  return <ellipse cx={sx} cy={sy} rx={R} ry={R * 0.58} fill="none" stroke={color} strokeWidth={width} opacity={(1 - k) * 0.9} />;
}

/** Air ring around a point in space (screen-aligned) */
export function AirRing({ cx, cy, t, period = 1.4, maxR = 26, color = '#A6192E', delay = 0, width = 1.4 }) {
  const k = (((t - delay) % period) + period) % period / period;
  return <circle cx={cx} cy={cy} r={4 + k * maxR} fill="none" stroke={color} strokeWidth={width} opacity={(1 - k) * 0.85} />;
}

export { MONO };
