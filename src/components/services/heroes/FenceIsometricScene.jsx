import React, { useRef, useState } from 'react';
import { AlertTriangle, Scissors, Moon } from 'lucide-react';
import { createIso, makePath, seg, lerp, easeInOut, easeIn, easeOut, rand, screenFacing, cctvClock, debugParam, useSceneClock } from './iso/engine';
import { IsoDefs, Box, Person, Tree, Lamp, LampPool, Car, CarBeam, faceY, faceX, flat, planeY, planeX, MONO } from './iso/primitives';
import './IsometricHeroes.css';

/* ==========================================================================
   ELECTRIC FENCE · Industrial site, block wall + 6-strand fence (2 zones)
   Loop (16s): intruder walks in with a ladder → leans it on the wall →
   climbs → touches the wires → shock + spark burst → falls and flees.
   Siren, strobe and floodlights fire, the event goes to C4 and the guard
   leaves the booth with a flashlight. Energizer pulses run at 1 Hz.
   ========================================================================== */

const iso = createIso({ ox: 306, oy: 88, s: 24 });
const G = 12;
const WX = 8.6;
const WY = 9.0;
const WT = 0.25;
const WH = 2.2;
const RX = WX + WT / 2;
const FY = WY + WT / 2;
const OFF = 0.1;
const STRANDS = [0, 1, 2, 3, 4, 5].map((i) => 2.42 + i * 0.19);
const POST_TOP = 3.5;
const SAG = 0.05;
const CYCLE = 16;
const ZAP = 7.0;
const ALARM_END = 14.5;
const GATE = { x0: 2.6, x1: 5.0 };
const WH_ = { x0: 0.8, x1: 6.2, y0: 0.6, y1: 3.6, h: 3.2 };
const GH = { x0: 4.6, x1: 5.8, y0: 5.4, y1: 6.6, h: 2.35 };
const ENERG = { y0: 0.75, y1: 1.3, z0: 1.05, z1: 1.7 };
const POLES = [
  { x: 7.4, y: 0.95, dir: [1, 0.15], pool: [9.9, 3.8, 3.1] },
  { x: 4.1, y: 7.75, dir: [0.1, 1], pool: [4.9, 10.3, 2.8] },
];

const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

/* ---------- fence geometry ---------- */
const POSTS = [
  ...[0, 1.5, 3, 4.5, 6, 7.5].map((y) => ({ x: RX, y, side: 'r' })),
  { x: RX, y: FY, side: 'c' },
  ...[7.5, 6, 4.5, 3, 1.5, 0].map((x) => ({ x, y: FY, side: 'f' })),
];
const anchor = (p) => [p.x + (p.side !== 'f' ? OFF : 0), p.y + (p.side !== 'r' ? OFF : 0)];
const SPANS = (() => {
  const out = [];
  let acc = 0;
  for (let i = 0; i < POSTS.length - 1; i++) {
    const a = anchor(POSTS[i]);
    const b = anchor(POSTS[i + 1]);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const zone = i < 6 ? 1 : 2;
    out.push({ a, b, len, d0: acc, zone, n: zone === 1 ? i + 1 : i - 5 });
    acc += len;
  }
  return out;
})();
const WIRE_LEN = SPANS[SPANS.length - 1].d0 + SPANS[SPANS.length - 1].len;
const HIT = 3; // Z1 · tramo 4 (y 4.5 → 6.0)
const CUT = 7; // Z2 · tramo 2 (x 7.5 → 6.0)

const spanPt = (sp, u, z) => [lerp(sp.a[0], sp.b[0], u), lerp(sp.a[1], sp.b[1], u), z - SAG * 4 * u * (1 - u)];
const pointAt = (d, z) => {
  let i = 0;
  while (i < SPANS.length - 1 && SPANS[i].d0 + SPANS[i].len < d) i++;
  const sp = SPANS[i];
  return spanPt(sp, Math.min(1, Math.max(0, (d - sp.d0) / sp.len)), z);
};
const strandStr = (z, from, to) => {
  const pts = [];
  for (let k = from; k <= to; k++) {
    for (let j = k === from ? 0 : 1; j <= 8; j++) pts.push(spanPt(SPANS[k], j / 8, z));
  }
  return iso.pts(pts);
};
const WIRE_FULL = STRANDS.map((z) => strandStr(z, 0, SPANS.length - 1));
const WIRE_A = STRANDS.map((z) => strandStr(z, 0, CUT - 1));
const WIRE_B = STRANDS.map((z) => strandStr(z, CUT + 1, SPANS.length - 1));
const WIRE_HIT = STRANDS.map((z) => strandStr(z, HIT, HIT));
const WIRE_Z1 = STRANDS.map((z) => strandStr(z, 0, 5));

/* ---------- choreography ---------- */
const WALK = makePath([[10.6, 12.7], [9.78, 10.6], [9.78, 4.6]], 1.0);
const RUN = makePath([[10.05, 4.6], [9.8, 5.8], [9.8, 10.4], [10.7, 12.8]], 1.0);
const LAD_BASE = [9.56, 4.6, 0];
const LAD_TOP = [8.92, 4.6, 2.15];
const LAD_H = LAD_TOP[2];
const ladderX = (f) => LAD_BASE[0] + (LAD_TOP[0] - LAD_BASE[0]) * f;
const CLIMB_F = 0.36;
const GPATH = makePath([[5.86, 6.07], [6.15, 6.0], [6.25, 5.0]], 0.4);

function intruderState(lt) {
  if (lt < 0.6 || lt > 11.2) return null;
  const base = { heading: Math.PI, moving: false, phase: 0, pose: 'walk', lean: 0, op: 1 };
  if (lt < 4.0) {
    const d = seg(lt, 0.6, 4.0) * WALK.length;
    const p = WALK.at(d);
    return { ...base, x: p.x, y: p.y, z: 0, heading: p.angle, moving: true, phase: d * 4.3, op: seg(lt, 0.6, 1.1), stage: 'walk' };
  }
  if (lt < 5.0) return { ...base, x: 9.78, y: 4.6, z: 0, stage: 'prop' };
  if (lt < 6.4) {
    const k = seg(lt, 5.0, 6.4);
    const f = CLIMB_F * easeInOut(k);
    return { ...base, x: ladderX(f) + 0.24, y: 4.6, z: f * LAD_H, moving: true, phase: k * 16, stage: 'climb' };
  }
  const top = { x: ladderX(CLIMB_F) + 0.24, y: 4.6, z: CLIMB_F * LAD_H };
  if (lt < ZAP) return { ...base, ...top, pose: 'reach', stage: 'reach' };
  if (lt < ZAP + 0.3) return { ...base, ...top, x: top.x + Math.sin(lt * 95) * 0.035, pose: 'recoil', lean: Math.sin(lt * 80) * 5, stage: 'zap' };
  if (lt < 7.9) {
    const k = seg(lt, ZAP + 0.3, 7.9);
    return {
      ...base,
      x: lerp(top.x, 10.05, easeOut(k)),
      y: 4.6,
      z: Math.max(0, top.z * (1 - k * k) + 0.25 * Math.sin(k * Math.PI)),
      pose: 'recoil',
      lean: -26 * k,
      stage: 'fall',
    };
  }
  if (lt < 8.6) {
    const k = seg(lt, 7.9, 8.6);
    return { ...base, x: 10.05, y: 4.6, z: 0, lean: -26 * (1 - easeOut(k)), stage: 'recover' };
  }
  const d = seg(lt, 8.6, 11.0) * RUN.length;
  const p = RUN.at(d);
  return { ...base, x: p.x, y: p.y, z: 0, heading: p.angle, moving: true, phase: d * 3.2, pose: 'run', op: 1 - seg(lt, 10.4, 11.0), stage: 'run' };
}

function carried(x, y, heading) {
  const c = Math.cos(heading);
  const s = Math.sin(heading);
  const side = [-s * 0.24, c * 0.24];
  return {
    base: [x - c * 1.0 + side[0], y - s * 1.0 + side[1], 0.92],
    top: [x + c * 1.25 + side[0], y + s * 1.25 + side[1], 0.92],
    w: [0, 0, 0.17],
  };
}

function ladderState(lt, intr) {
  if (lt < 0.6 || lt > 15.4) return null;
  const lean = { base: LAD_BASE, top: LAD_TOP, w: [0, 0.21, 0] };
  if (lt < 4.0) return intr ? { ...carried(intr.x, intr.y, intr.heading), op: intr.op, carried: true } : null;
  if (lt < 5.0) {
    const from = carried(9.78, 4.6, -Math.PI / 2);
    const k = easeInOut(seg(lt, 4.0, 5.0));
    return { base: lerp3(from.base, lean.base, k), top: lerp3(from.top, lean.top, k), w: lerp3(from.w, lean.w, k), op: 1 };
  }
  if (lt < 7.3) return { ...lean, op: 1 };
  const fallen = { base: [9.66, 4.62, 0], top: [9.82, 6.8, 0.04], w: [0.21, 0, 0] };
  const k = easeIn(seg(lt, 7.3, 8.1));
  return { base: lerp3(lean.base, fallen.base, k), top: lerp3(lean.top, fallen.top, k), w: lerp3(lean.w, fallen.w, k), op: 1 - seg(lt, 14.8, 15.4) };
}

function guardState(lt) {
  if (lt < 8.6 || lt > 15.4) return null;
  if (lt < 9.9) {
    const d = seg(lt, 8.6, 9.9) * GPATH.length;
    const p = GPATH.at(d);
    return { x: p.x, y: p.y, heading: p.angle, moving: true, phase: d * 4.6, pose: 'walk', op: seg(lt, 8.6, 8.85), light: false };
  }
  if (lt < 13.9) return { x: 6.25, y: 5.0, heading: -0.1 + Math.sin(lt * 1.3) * 0.1, moving: false, phase: 0, pose: 'press', op: 1, light: true };
  const d = (1 - seg(lt, 13.9, 15.2)) * GPATH.length;
  const p = GPATH.at(d);
  return { x: p.x, y: p.y, heading: p.angle + Math.PI, moving: true, phase: d * 4.6, pose: 'walk', op: 1 - seg(lt, 14.9, 15.3), light: false };
}

/* ---------- static layers ---------- */
const Ground = React.memo(function Ground() {
  const joints = [];
  for (let x = 2; x < WX; x += 2) joints.push(<polygon key={`jx${x}`} points={flat(iso, x, 0, x + 0.03, WY, 0.005)} fill="#C5C1BA" />);
  for (let y = 2; y < WY; y += 2) joints.push(<polygon key={`jy${y}`} points={flat(iso, 0, y, WX, y + 0.03, 0.005)} fill="#C5C1BA" />);
  const walkJ = [];
  for (let y = 0.9; y < 10.6; y += 1.0) walkJ.push(<polygon key={`wr${y}`} points={flat(iso, WX + WT, y, 10.2, y + 0.025, 0.006)} fill="#C2BDB4" />);
  for (let x = 0.9; x < 10.2; x += 1.0) walkJ.push(<polygon key={`wf${x}`} points={flat(iso, x, WY + WT, x + 0.025, 10.6, 0.006)} fill="#C2BDB4" />);
  const dashes = [];
  for (let y = 0.3; y < 10.2; y += 1.3) dashes.push(<polygon key={`dr${y}`} points={flat(iso, 11.08, y, 11.16, y + 0.65, 0.008)} fill="#E5E7EB" opacity="0.75" />);
  for (let x = 0.3; x < 10.0; x += 1.3) dashes.push(<polygon key={`df${x}`} points={flat(iso, x, 11.26, x + 0.65, 11.34, 0.008)} fill="#E5E7EB" opacity="0.75" />);
  const zebra = [];
  for (let x = 8.95; x < 10.1; x += 0.34) zebra.push(<polygon key={`z${x}`} points={flat(iso, x, 10.75, x + 0.17, 11.9, 0.009)} fill="#F1F5F9" opacity="0.85" />);
  return (
    <g>
      {/* slab */}
      <polygon points={faceY(iso, G, 0, G, -0.6, 0)} fill="#8E949C" />
      <polygon points={faceX(iso, G, 0, G, -0.6, 0)} fill="#757B84" />
      <polygon points={flat(iso, 0, 0, G, G)} fill="#474D57" />
      {dashes}
      {zebra}
      {/* sidewalks + curbs */}
      <polygon points={flat(iso, WX + WT, 0, 10.2, 10.6, 0.004)} fill="#D8D3CB" />
      <polygon points={flat(iso, 0, WY + WT, 10.2, 10.6, 0.004)} fill="#D8D3CB" />
      {walkJ}
      <polygon points={flat(iso, 10.12, 0, 10.24, 10.66, 0.01)} fill="#B9B3A9" />
      <polygon points={flat(iso, 0, 10.54, 10.24, 10.66, 0.01)} fill="#B9B3A9" />
      {/* storm drain */}
      <polygon points={flat(iso, 10.25, 6.2, 10.55, 6.9, 0.009)} fill="#2A2F37" />
      {/* interior yard */}
      <polygon points={flat(iso, 0, 0, WX, WY, 0.003)} fill="#D6D3CD" />
      {joints}
      {/* loading bay hatch + walkway */}
      <polygon points={flat(iso, 1.2, WH_.y1, 2.8, 4.6, 0.006)} fill="url(#iso-hatch-red)" opacity="0.0" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <polygon key={i} points={iso.pts([[1.15 + i * 0.28, 3.65, 0.007], [1.3 + i * 0.28, 3.65, 0.007], [1.0 + i * 0.28, 4.4, 0.007], [0.85 + i * 0.28, 4.4, 0.007]])} fill="#EAB308" opacity="0.7" />
      ))}
      <polygon points={flat(iso, 0.6, 4.55, 6.4, 4.62, 0.007)} fill="#EAB308" opacity="0.85" />
      <ellipse cx={iso.p(2.9, 5.8)[0]} cy={iso.p(2.9, 5.8)[1]} rx="9" ry="4" fill="#1F2937" opacity="0.12" />
      {/* energizer conduit (buried) */}
      <polyline points={iso.pts([[WH_.x1, 1.0, 0.01], [7.6, 1.0, 0.01], [WX, 0.25, 0.01]])} fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 2" />
    </g>
  );
});

const Warehouse = React.memo(function Warehouse() {
  const { x0, x1, y0, y1, h } = WH_;
  const ribsY = [];
  for (let x = x0 + 0.15; x < x1; x += 0.3) ribsY.push(<polygon key={x} points={faceY(iso, y1 + 0.004, x, x + 0.05, 0.35, h)} fill="#B9C0CA" opacity="0.8" />);
  const ribsX = [];
  for (let y = y0 + 0.15; y < y1; y += 0.3) ribsX.push(<polygon key={y} points={faceX(iso, x1 + 0.004, y, y + 0.05, 0.35, h)} fill="#A1A9B4" opacity="0.8" />);
  const slats = (a, b, top) => {
    const out = [];
    for (let z = 0.15; z < top; z += 0.16) out.push(<polygon key={z} points={faceY(iso, y1 + 0.012, a, b, z, z + 0.02)} fill="#C3C9D1" />);
    return out;
  };
  const ridges = [];
  for (let y = y0 + 0.25; y < y1; y += 0.25) ridges.push(<polygon key={y} points={flat(iso, x0, y, x1, y + 0.02, h + 0.002)} fill="#CED3DA" />);
  return (
    <g>
      <Box iso={iso} x={x0} y={y0} w={x1 - x0} d={y1 - y0} h={h} color="#C9CED6" left="#D9DDE3" right="#B3BAC4" top="#E4E7EB" />
      {ribsY}
      {ribsX}
      <polygon points={faceY(iso, y1 + 0.006, x0, x1, 0, 0.35)} fill="#8F97A3" />
      <polygon points={faceX(iso, x1 + 0.006, y0, y1, 0, 0.35)} fill="#7D8692" />
      {/* clerestory windows */}
      <polygon points={faceY(iso, y1 + 0.008, 1.0, 6.0, 2.42, 2.82)} fill="#4F6B80" />
      {[1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5].map((x) => <polygon key={x} points={faceY(iso, y1 + 0.01, x, x + 0.04, 2.42, 2.82)} fill="#C9CED6" />)}
      {/* roll-up doors */}
      {[[1.25, 2.65], [3.35, 4.75]].map(([a, b]) => (
        <g key={a}>
          <polygon points={faceY(iso, y1 + 0.01, a - 0.08, b + 0.08, 0, 2.25)} fill="#64748B" />
          <polygon points={faceY(iso, y1 + 0.011, a, b, 0, 2.15)} fill="#E2E6EB" />
          {slats(a, b, 2.15)}
        </g>
      ))}
      {/* personnel door + light */}
      <polygon points={faceY(iso, y1 + 0.01, 5.3, 5.8, 0, 1.95)} fill="#2B5672" />
      <polygon points={faceY(iso, y1 + 0.012, 5.72, 5.76, 0.9, 1.05)} fill="#E5E7EB" />
      {/* sign */}
      <g transform={planeY(iso, 3.45, y1 + 0.014, 3.1)}>
        <rect x="0" y="-6.5" width="44" height="8.5" rx="1.5" fill="#1D1E1B" />
        <text x="4" y="0" fontSize="5.6" fontWeight="800" letterSpacing="1.2" fill="#FFFFFF" fontFamily="Inter, system-ui, sans-serif">NAVE 3</text>
        <rect x="35" y="-4.5" width="5.5" height="4.5" rx="0.8" fill="#A6192E" />
      </g>
      {/* roof */}
      {ridges}
      {[0, 1, 2].map((i) => <polygon key={i} points={flat(iso, 1.4 + i * 1.5, 1.3, 2.1 + i * 1.5, 2.9, h + 0.004)} fill="#A9BED0" stroke="#E5E7EB" strokeWidth="0.6" />)}
      <Box iso={iso} x={5.0} y={1.0} w={0.75} d={0.6} h={0.42} z={h} color="#9CA3AF" />
      <Box iso={iso} x={5.15} y={1.12} w={0.45} d={0.36} h={0.05} z={h + 0.42} color="#4B5563" />
      {/* energizer + conduit */}
      <polygon points={faceX(iso, x1 + 0.01, 0.98, 1.03, 0, ENERG.z0)} fill="#475569" />
      <polygon points={faceX(iso, x1 + 0.012, ENERG.y0, ENERG.y1, ENERG.z0, ENERG.z1)} fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.5" />
      <polygon points={faceX(iso, x1 + 0.014, ENERG.y0 + 0.08, ENERG.y1 - 0.08, ENERG.z1 - 0.28, ENERG.z1 - 0.1)} fill="#0F172A" />
      <polygon points={faceX(iso, x1 + 0.014, ENERG.y0 + 0.06, ENERG.y1 - 0.06, ENERG.z0 + 0.06, ENERG.z0 + 0.14)} fill="#FACC15" />
      <g transform={planeX(iso, x1 + 0.016, ENERG.y1 + 0.05, ENERG.z0 - 0.12)}>
        <text x="0" y="0" fontSize="3.6" fontWeight="700" fill="#475569" fontFamily={MONO}>ENERGIZADOR</text>
      </g>
    </g>
  );
});

const Truck = React.memo(function Truck() {
  return (
    <g>
      <polygon points={flat(iso, 1.3, 3.7, 2.7, 7.7, 0.01)} fill="rgba(15,23,42,0.18)" />
      {[4.25, 5.75, 7.0].map((y) => <Box key={y} iso={iso} x={2.48} y={y} w={0.12} d={0.52} h={0.5} color="#111827" top="#1F2937" />)}
      <Box iso={iso} x={1.4} y={3.75} w={1.15} d={2.85} h={1.85} z={0.38} color="#F8FAFC" right="#E2E8F0" />
      <polygon points={faceX(iso, 2.552, 3.75, 6.6, 0.9, 1.05)} fill="#A6192E" />
      <polygon points={faceX(iso, 2.552, 3.75, 6.6, 1.12, 1.17)} fill="#2B5672" />
      <Box iso={iso} x={1.45} y={6.62} w={1.05} d={0.95} h={1.3} z={0.32} color="#2B5672" />
      <polygon points={faceY(iso, 7.572, 1.55, 2.42, 1.0, 1.5)} fill="url(#iso-glass-dark)" />
      <polygon points={faceX(iso, 2.502, 6.72, 7.25, 1.02, 1.5)} fill="url(#iso-glass-dark)" />
      <polygon points={faceY(iso, 7.574, 1.55, 2.42, 0.4, 0.55)} fill="#1E293B" />
    </g>
  );
});

const Guardhouse = React.memo(function Guardhouse() {
  const { x0, x1, y0, y1, h } = GH;
  return (
    <g>
      <Box iso={iso} x={x0} y={y0} w={x1 - x0} d={y1 - y0} h={h} color="#EDEAE4" left="#F4F2EE" right="#DCD7CF" />
      <polygon points={faceY(iso, y1 + 0.004, x0, x1, 0, 0.3)} fill="#A6192E" />
      <polygon points={faceX(iso, x1 + 0.004, y0, y1, 0, 0.3)} fill="#8C1527" />
      <polygon points={faceY(iso, y1 + 0.006, x0 + 0.12, x1 - 0.12, 1.0, 1.85)} fill="url(#iso-glass)" stroke="#F8FAFC" strokeWidth="0.8" />
      <polygon points={faceX(iso, x1 + 0.006, y0 + 0.08, y0 + 0.36, 1.0, 1.85)} fill="url(#iso-glass)" stroke="#F8FAFC" strokeWidth="0.6" />
      <polygon points={faceX(iso, x1 + 0.006, 5.8, 6.32, 0, 1.95)} fill="#2B5672" />
      <Box iso={iso} x={x0 - 0.12} y={y0 - 0.12} w={x1 - x0 + 0.24} d={y1 - y0 + 0.24} h={0.12} z={h} color="#3F3F46" />
      <g transform={planeY(iso, x0 + 0.2, y1 + 0.13, h - 0.12)}>
        <text x="0" y="0" fontSize="4.4" fontWeight="800" letterSpacing="0.8" fill="#1D1E1B" fontFamily={MONO}>CASETA 1</text>
      </g>
    </g>
  );
});

const Pallets = React.memo(function Pallets() {
  return (
    <g>
      <Box iso={iso} x={3.6} y={4.0} w={0.7} d={0.7} h={0.14} color="#B08359" />
      <Box iso={iso} x={3.65} y={4.05} w={0.6} d={0.6} h={0.5} z={0.14} color="#C89B6D" />
      <Box iso={iso} x={3.75} y={4.12} w={0.4} d={0.45} h={0.32} z={0.64} color="#D7B48A" />
      {[3.25, 4.85].map((x) => <Box key={x} iso={iso} x={x} y={3.72} w={0.12} d={0.12} h={0.6} color="#EAB308" top="#1F2937" />)}
    </g>
  );
});

function Pole({ p, on }) {
  const [bx, by] = iso.p(p.x, p.y, 0);
  const [tx, ty] = iso.p(p.x, p.y, 4.3);
  const hx = p.x + p.dir[0] * 0.38;
  const hy = p.y + p.dir[1] * 0.38;
  const [lx, ly] = iso.p(hx, hy, 4.25);
  return (
    <g>
      <ellipse cx={bx} cy={by} rx="5" ry="2.5" fill="rgba(15,23,42,0.25)" />
      <line x1={bx} y1={by} x2={tx} y2={ty} stroke="#4B5563" strokeWidth="2.4" strokeLinecap="round" />
      <line x1={tx} y1={ty} x2={lx} y2={ly} stroke="#4B5563" strokeWidth="1.8" strokeLinecap="round" />
      <rect x={lx - 4.5} y={ly - 2.5} width="9" height="5" rx="1" fill="#1F2937" />
      <rect x={lx - 3.5} y={ly + 0.8} width="7" height="1.8" rx="0.8" fill={on ? '#FFF7D6' : '#CBD5E1'} />
    </g>
  );
}

const WarnSign = ({ transform }) => (
  <g transform={transform}>
    <rect x="0" y="-15" width="27" height="15" rx="1.2" fill="#FACC15" stroke="#1D1E1B" strokeWidth="0.6" />
    <path d="M 5 -4 L 8.5 -11.5 L 12 -4 Z" fill="#1D1E1B" />
    <path d="M 8.9 -10 L 7.8 -7.4 L 9 -7.4 L 8 -5" stroke="#FACC15" strokeWidth="0.6" fill="none" />
    <text x="13.5" y="-8.2" fontSize="3.4" fontWeight="800" fill="#1D1E1B" fontFamily={MONO}>PELIGRO</text>
    <text x="13.5" y="-4.2" fontSize="2.5" fontWeight="700" fill="#1D1E1B" fontFamily={MONO}>ALTO VOLT.</text>
  </g>
);

const Walls = React.memo(function Walls() {
  const mortarX = [];
  const mortarY = [];
  for (let z = 0.44; z < WH; z += 0.44) {
    mortarX.push(<polygon key={z} points={faceX(iso, WX + WT + 0.003, 0, WY + WT, z, z + 0.018)} fill="#CFC7B9" />);
    mortarY.push(<polygon key={`a${z}`} points={faceY(iso, WY + WT + 0.003, 0, GATE.x0, z, z + 0.018)} fill="#CFC7B9" />);
    mortarY.push(<polygon key={`b${z}`} points={faceY(iso, WY + WT + 0.003, GATE.x1, WX + WT, z, z + 0.018)} fill="#CFC7B9" />);
  }
  const bars = [];
  for (let x = GATE.x0 + 0.08; x < GATE.x1; x += 0.15) {
    const [a0, a1] = iso.p(x, FY, 0.08);
    const [b0, b1] = iso.p(x, FY, 2.06);
    bars.push(<line key={x} x1={a0} y1={a1} x2={b0} y2={b1} stroke="#334155" strokeWidth="1.1" />);
  }
  const rail = (z, w = 1.6) => {
    const [a0, a1] = iso.p(GATE.x0, FY, z);
    const [b0, b1] = iso.p(GATE.x1, FY, z);
    return <line key={z} x1={a0} y1={a1} x2={b0} y2={b1} stroke="#1F2937" strokeWidth={w} />;
  };
  return (
    <g>
      {/* right wall (zone 1) */}
      <Box iso={iso} x={WX} y={0} w={WT} d={WY + WT} h={WH} color="#E9E4DA" right="#DCD5C8" top="#C7BFB1" />
      {mortarX}
      <polygon points={faceX(iso, WX + WT + 0.005, 0, WY + WT, 0, 0.24)} fill="#B8B0A2" />
      {[0.05, 3.0, 6.0].map((y) => <Box key={y} iso={iso} x={WX + WT} y={y} w={0.09} d={0.32} h={WH + 0.06} color="#E2DCD0" right="#D3CBBC" top="#BDB4A5" />)}
      <WarnSign transform={planeX(iso, WX + WT + 0.012, 2.75, 1.85)} />
      <WarnSign transform={planeX(iso, WX + WT + 0.012, 7.55, 1.85)} />

      {/* gate + overhead beam */}
      {rail(0.12)}
      {bars}
      {rail(1.05, 1.2)}
      {rail(2.06)}
      <Box iso={iso} x={GATE.x0} y={WY + 0.05} w={GATE.x1 - GATE.x0} d={0.15} h={0.1} z={WH - 0.04} color="#374151" />
      {/* front wall (zone 2) */}
      <Box iso={iso} x={0} y={WY} w={GATE.x0} d={WT} h={WH} color="#EFEBE3" left="#F2EEE6" top="#C7BFB1" />
      <Box iso={iso} x={GATE.x1} y={WY} w={WX + WT - GATE.x1} d={WT} h={WH} color="#EFEBE3" left="#F2EEE6" top="#C7BFB1" />
      {mortarY}
      <polygon points={faceY(iso, WY + WT + 0.005, 0, GATE.x0, 0, 0.24)} fill="#C2BAAC" />
      <polygon points={faceY(iso, WY + WT + 0.005, GATE.x1, WX + WT, 0, 0.24)} fill="#C2BAAC" />
      {[GATE.x0 - 0.3, GATE.x1, 7.1].map((x) => <Box key={x} iso={iso} x={x} y={WY + WT} w={0.3} d={0.09} h={WH + 0.06} color="#E7E1D6" left="#ECE6DB" top="#BDB4A5" />)}
      <WarnSign transform={planeY(iso, 0.7, WY + WT + 0.012, 1.85)} />
      <WarnSign transform={planeY(iso, 5.6, WY + WT + 0.012, 1.85)} />
      {/* corner cap with beacon base */}
      <Box iso={iso} x={WX - 0.06} y={WY - 0.06} w={WT + 0.12} d={WT + 0.12} h={0.12} z={WH} color="#9CA3AF" />
    </g>
  );
});

const Posts = React.memo(function Posts() {
  return (
    <g>
      {POSTS.map((p, i) => {
        const [a0, a1] = iso.p(p.x, p.y, WH);
        const [b0, b1] = iso.p(p.x, p.y, POST_TOP);
        const [an0, an1] = anchor(p);
        return (
          <g key={i}>
            <line x1={a0} y1={a1} x2={b0} y2={b1} stroke="#4B5563" strokeWidth={p.side === 'c' ? 2.6 : 1.9} strokeLinecap="round" />
            {STRANDS.map((z) => {
              const [ix, iy] = iso.p(an0, an1, z);
              return <rect key={z} x={ix - 1.4} y={iy - 0.9} width="2.8" height="1.8" rx="0.6" fill="#1F2937" />;
            })}
          </g>
        );
      })}
    </g>
  );
});

/* ---------- ladder ---------- */
function Ladder({ L }) {
  const { base, top, w, op = 1 } = L;
  const P = (q, sgn) => iso.p(q[0] + w[0] * sgn, q[1] + w[1] * sgn, q[2] + w[2] * sgn);
  const len = Math.hypot(top[0] - base[0], top[1] - base[1], top[2] - base[2]);
  const n = Math.max(2, Math.round(len / 0.3));
  const rungs = [];
  for (let k = 1; k < n; k++) {
    const q = lerp3(base, top, k / n);
    const [a0, a1] = P(q, -1);
    const [b0, b1] = P(q, 1);
    rungs.push(<line key={k} x1={a0} y1={a1} x2={b0} y2={b1} stroke="#94A3B8" strokeWidth="1.1" />);
  }
  const [a0, a1] = P(base, -1);
  const [a2, a3] = P(top, -1);
  const [b0, b1] = P(base, 1);
  const [b2, b3] = P(top, 1);
  const [s0, s1] = iso.p(base[0], base[1], 0);
  const [s2, s3] = iso.p(top[0] + top[2] * 0.25, top[1] + top[2] * 0.15, 0);
  return (
    <g opacity={op}>
      <line x1={s0} y1={s1} x2={s2} y2={s3} stroke="rgba(15,23,42,0.18)" strokeWidth="4" filter="url(#iso-soft)" />
      <line x1={a0} y1={a1} x2={a2} y2={a3} stroke="#8B95A3" strokeWidth="1.7" strokeLinecap="round" />
      {rungs}
      <line x1={b0} y1={b1} x2={b2} y2={b3} stroke="#D7DEE7" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/* ---------- energizer trace ---------- */
const wrap = (v) => ((v % CYCLE) + CYCLE) % CYCLE;
function traceVal(tau, ltau) {
  const ph = ((tau % 1) + 1) % 1;
  let v = ph < 0.015 ? ph / 0.015 : Math.exp(-(ph - 0.015) * 38);
  if (ltau >= ZAP && ltau < ZAP + 0.45) v = Math.abs(Math.sin(tau * 160)) * (0.7 + rand(Math.floor(tau * 60)) * 0.7);
  else if (ltau >= ZAP + 0.45 && ltau < 8.6) v *= 0.62;
  return v;
}

/* ==========================================================================
   SCENE
   ========================================================================== */
export default function FenceIsometricScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 7.12 });
  const initial = debugParam('isoState') || '';
  const [night, setNight] = useState(initial.includes('night'));
  const [cutAt, setCutAt] = useState(() => (initial.includes('cut') ? (parseFloat(debugParam('isoT')) || 0) - 10 : null));
  const [off, setOff] = useState(0);
  const cut = cutAt != null;
  const lt = wrap(t - off);

  const intr = intruderState(lt);
  const lad = ladderState(lt, intr);
  const guard = guardState(lt);
  const zapT = lt - ZAP;
  const alarmZap = lt >= ZAP && lt < ALARM_END;
  const alarm = alarmZap || cut;
  const lightsOn = night || alarm;
  const strobeOn = alarm && Math.floor(t * 6) % 2 === 0;

  /* ---------- outside (sorted) ---------- */
  const outside = [
    { k: 1.2 + 10.3, el: <Tree key="t1" iso={iso} x={1.2} y={10.3} size={0.72} /> },
    { k: 7.2 + 10.3, el: <Tree key="t2" iso={iso} x={7.2} y={10.3} size={0.66} color="#5A9466" /> },
    { k: 9.9 + 1.0, el: <Tree key="t3" iso={iso} x={9.9} y={1.0} size={0.7} /> },
    { k: 9.98 + 8.2, el: <Lamp key="lamp" iso={iso} x={9.98} y={8.2} h={3.6} on={night} /> },
    { k: 10.0 + 10.3, el: <Box key="hyd" iso={iso} x={9.95} y={10.2} w={0.16} d={0.16} h={0.36} color="#DC2626" /> },
  ];
  const pp = wrap(lt - 11.4);
  if (pp < 7) {
    const px = lerp(0.3, 7.9, pp / 7);
    outside.push({
      k: px + 9.9,
      el: <Person key="ped" iso={iso} x={px} y={9.9} heading={0} moving phase={px * 4.3} shirt="#0F766E" pants="#1F2937" hair="#3D2B1F" skin="#E3B796" opacity={Math.min(seg(pp, 0, 0.5), 1 - seg(pp, 6.4, 7))} />,
    });
  }
  let carS = null;
  if (lt > 11.4 && lt < 15.8) {
    const k = seg(lt, 11.4, 15.8);
    carS = { x: 11.2, y: lerp(12.8, -1.4, k), op: Math.min(seg(k, 0.02, 0.09), 1 - seg(k, 0.84, 0.93)) };
    outside.push({ k: carS.x + carS.y, el: <Car key="car" iso={iso} x={carS.x} y={carS.y} yaw={-Math.PI / 2} color="#E5E7EB" lights={night} opacity={carS.op} /> });
  }
  if (intr && intr.op > 0) {
    outside.push({
      k: intr.x + intr.y + 0.01,
      el: (
        <Person
          key="intr" iso={iso} x={intr.x} y={intr.y} z={intr.z} heading={intr.heading} moving={intr.moving} phase={intr.phase}
          pose={intr.pose} lean={intr.lean} shirt="#1F2937" pants="#0B0F17" hair="#0B0F17" cap="#111827" skin="#B07A58" opacity={intr.op}
        />
      ),
    });
  }
  if (lad && lad.op > 0) {
    const mid = lerp3(lad.base, lad.top, 0.5);
    outside.push({ k: lad.carried && intr ? intr.x + intr.y + 0.02 : mid[0] + mid[1], el: <Ladder key="lad" L={lad} /> });
  }
  outside.sort((a, b) => a.k - b.k);

  /* ---------- interior (sorted) ---------- */
  const interior = [
    { k: 5.6, el: <Warehouse key="wh" /> },
    { k: 7.6, el: <Truck key="truck" /> },
    { k: 8.4, el: <Pallets key="pal" /> },
    { k: 11.2, el: <Guardhouse key="gh" /> },
    ...POLES.map((p, i) => ({ k: p.x + p.y, el: <Pole key={`pole${i}`} p={p} on={lightsOn} /> })),
  ];
  if (guard && guard.op > 0) {
    interior.push({
      k: guard.x + guard.y + 0.05,
      el: <Person key="guard" iso={iso} x={guard.x} y={guard.y} heading={guard.heading} moving={guard.moving} phase={guard.phase} pose={guard.pose} shirt="#1E293B" pants="#0F172A" hair="#1A1A1A" cap="#0F172A" skin="#C99474" opacity={guard.op} />,
    });
  }
  interior.sort((a, b) => a.k - b.k);

  /* ---------- zap geometry ---------- */
  const contactU = (4.6 - SPANS[HIT].a[1]) / SPANS[HIT].len;
  const [cx, cy] = iso.p(...spanPt(SPANS[HIT], contactU, STRANDS[2]));
  let hand = null;
  if (intr && (intr.stage === 'reach' || intr.stage === 'zap')) {
    const [sx, sy] = iso.p(intr.x, intr.y, intr.z);
    const H = 1.72 * iso.s;
    hand = [sx + screenFacing(intr.heading).flip * 0.145 * H, sy - 1.16 * H];
  }
  const bolts = [];
  if (zapT >= 0 && zapT < 0.5 && Math.floor(lt * 24) % 3 !== 2) {
    const fr = Math.floor(lt * 24);
    const from = hand || [cx + 8, cy + 4];
    const main = [from];
    for (let k = 1; k < 5; k++) {
      main.push([lerp(from[0], cx, k / 5) + (rand(fr * 13 + k) - 0.5) * 7, lerp(from[1], cy, k / 5) + (rand(fr * 17 + k) - 0.5) * 7]);
    }
    main.push([cx, cy]);
    bolts.push(main);
    for (let b = 0; b < 4; b++) {
      const ang = rand(fr * 7 + b) * Math.PI * 2;
      const L = 12 + rand(fr * 3 + b) * 16;
      const pts = [[cx, cy]];
      for (let k = 1; k <= 3; k++) {
        pts.push([cx + Math.cos(ang) * L * (k / 3) + (rand(fr * 29 + b * 5 + k) - 0.5) * 6, cy + Math.sin(ang) * L * (k / 3) * 0.7 + (rand(fr * 31 + b * 5 + k) - 0.5) * 6]);
      }
      bolts.push(pts);
    }
  }
  const sparks = [];
  if (zapT >= 0 && zapT < 1.1) {
    for (let i = 0; i < 18; i++) {
      const ang = -Math.PI / 2 + (rand(i + 1) - 0.5) * 2.8;
      const sp = 50 + rand(i + 21) * 95;
      const vx = Math.cos(ang) * sp;
      const vy = Math.sin(ang) * sp;
      const tt = zapT * (0.8 + rand(i + 41) * 0.4);
      const px = cx + vx * tt;
      const py = cy + vy * tt + 150 * tt * tt;
      const qx = px - vx * 0.035;
      const qy = py - (vy + 300 * tt) * 0.035;
      sparks.push({ px, py, qx, qy, c: tt < 0.25 ? '#FEF3C7' : '#FB923C', o: Math.max(0, 1 - zapT / 1.1) });
    }
  }

  /* ---------- energy pulse ---------- */
  const pulseK = (t % 1) / 0.75;
  const pulseD = pulseK * WIRE_LEN;
  const pulseLimit = cut ? SPANS[CUT].d0 : WIRE_LEN;
  const pulses = [];
  if (pulseK < 1 && pulseD - 1.3 < pulseLimit) {
    const d1 = Math.min(pulseD, pulseLimit);
    const d0 = Math.max(0, pulseD - 1.3);
    STRANDS.forEach((z, i) => {
      const pts = [];
      for (let k = 0; k <= 6; k++) pts.push(pointAt(lerp(d0, d1, k / 6), z));
      pulses.push(<polyline key={i} points={iso.pts(pts)} fill="none" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" filter="url(#iso-glow)" opacity={night ? 1 : 0.85} />);
    });
  }

  /* ---------- cut (Z2 · tramo 2) ---------- */
  const droop = cut ? easeOut(seg(t - cutAt, 0, 0.6)) : 0;
  const dangling = [];
  if (cut) {
    const sp = SPANS[CUT];
    STRANDS.forEach((z, i) => {
      [[sp.a, 0.42], [sp.b, 0.58]].forEach(([o, u], s) => {
        const m = spanPt(sp, u, z);
        const hang = [o[0] + (m[0] - o[0]) * 0.32, o[1] + 0.16, z - 0.9 - i * 0.05];
        const e = lerp3(m, hang, droop);
        const c = [o[0] + (e[0] - o[0]) * 0.65, o[1] + (e[1] - o[1]) * 0.65, z];
        const pts = [];
        for (let k = 0; k <= 6; k++) {
          const u2 = k / 6;
          pts.push([
            (1 - u2) * (1 - u2) * o[0] + 2 * (1 - u2) * u2 * c[0] + u2 * u2 * e[0],
            (1 - u2) * (1 - u2) * o[1] + 2 * (1 - u2) * u2 * c[1] + u2 * u2 * e[1],
            (1 - u2) * (1 - u2) * z + 2 * (1 - u2) * u2 * c[2] + u2 * u2 * e[2],
          ]);
        }
        dangling.push({ key: `${i}-${s}`, str: iso.pts(pts), end: iso.p(...e), i, s });
      });
    });
  }

  /* ---------- lights ---------- */
  const [bx, by] = iso.p(RX, FY, WH + 0.34);
  let flash = null;
  if (guard && guard.light) {
    const [gx, gy] = iso.p(guard.x, guard.y, 0);
    const H = 1.72 * iso.s;
    const hx = gx + screenFacing(guard.heading).flip * 0.24 * H;
    const hy = gy - 0.74 * H;
    const t1 = iso.p(8.72, 4.15 + Math.sin(t * 1.3) * 0.25, 3.15);
    const t2 = iso.p(8.72, 5.15 + Math.sin(t * 1.3) * 0.25, 2.3);
    const spot = iso.p(8.74, 4.65 + Math.sin(t * 1.3) * 0.25, 2.72);
    flash = { hx, hy, t1, t2, spot };
  }

  /* ---------- readings ---------- */
  const kv1 = zapT >= 0 && zapT < 0.45 ? '—' : zapT >= 0.45 && lt < 8.6 ? '6.1' : (9.8 + Math.sin(t * 1.7) * 0.06).toFixed(1);
  const kv2 = cut ? '0.0' : (9.6 + Math.sin(t * 1.3 + 1) * 0.06).toFixed(1);
  const trace = [];
  let traceHot = false;
  for (let j = 0; j <= 96; j++) {
    const tau = t - 3 + (j / 96) * 3;
    const ltau = wrap(lt - (t - tau));
    if (ltau >= ZAP && ltau < ZAP + 0.45) traceHot = true;
    trace.push(`${(8 + (j / 96) * 108).toFixed(1)},${(42 - traceVal(tau, ltau) * 17).toFixed(1)}`);
  }

  const status = alarmZap
    ? lt < ZAP + 1.2 ? 'DESCARGA · ESCALAMIENTO Z1' : 'ALARMA PERIMETRAL · Z1'
    : cut ? 'SABOTAJE · CORTE EN Z2' : 'CERCA ENERGIZADA · 2 ZONAS';
  const events = [
    { txt: 'AUTOPRUEBA OK · 10.0 kV', c: '#34D399' },
    { txt: 'TIERRA FÍSICA 9 Ω · OK', c: '#34D399' },
  ];
  if (lt >= ZAP) events.push({ txt: 'Z1 · DESCARGA EN TRAMO 4', c: '#F87171' });
  if (lt >= ZAP + 0.4) events.push({ txt: 'SIRENA + ESTROBO + REFLECTORES', c: '#FBBF24' });
  if (lt >= 8.3) events.push({ txt: 'REPORTE C4 · 4G/IP · 1.2s', c: '#38BDF8' });
  if (lt >= 8.6) events.push({ txt: 'GUARDIA EN RONDA · CASETA 1', c: '#34D399' });
  if (lt >= ALARM_END) events.push({ txt: 'EVENTO CERRADO · LÍNEA OK', c: '#34D399' });
  if (cut) events.push({ txt: 'Z2 · LAZO ABIERTO · TRAMO 2', c: '#F87171' });
  const log = events.slice(-3).reverse();
  const tagOp = Math.min(seg(lt, ZAP + 0.2, ZAP + 0.5), 1 - seg(lt, 13.2, 13.8));
  const [cutTx, cutTy] = iso.p(...spanPt(SPANS[CUT], 0.5, 3.2));

  return (
    <div className="iso-scene-wrap" ref={wrapRef}>
      <svg className="iso-svg-canvas iso-svg-canvas--wide" viewBox="0 0 600 440" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animación isométrica de cerca electrificada con detección de escalamiento y corte de línea">
        <IsoDefs />
        <defs>
          <linearGradient id="fence-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF4C8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFE2A8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Ground />
        {interior.map((i) => i.el)}
        <Walls />
        <Posts />

        {/* wires */}
        <g>
          {(cut ? [...WIRE_A, ...WIRE_B] : WIRE_FULL).map((str, i) => (
            <polyline key={i} points={str} fill="none" stroke="#5B6470" strokeWidth="0.85" strokeLinejoin="round" />
          ))}
          {dangling.map((d) => <polyline key={d.key} points={d.str} fill="none" stroke="#5B6470" strokeWidth="0.85" />)}
        </g>

        {outside.map((i) => i.el)}

        {/* night grade */}
        {night && <rect x="-400" y="-400" width="1400" height="1240" fill="#0B1733" opacity="0.62" style={{ mixBlendMode: 'multiply' }} />}

        {/* emissive layer */}
        {night && (
          <g>
            <polygon points={faceY(iso, WH_.y1 + 0.012, 1.0, 6.0, 2.42, 2.82)} fill="url(#iso-window-lit)" opacity="0.85" />
            <polygon points={faceY(iso, GH.y1 + 0.008, GH.x0 + 0.12, GH.x1 - 0.12, 1.0, 1.85)} fill="url(#iso-window-lit)" opacity="0.9" />
            <polygon points={faceX(iso, GH.x1 + 0.008, GH.y0 + 0.08, GH.y0 + 0.36, 1.0, 1.85)} fill="url(#iso-window-lit)" opacity="0.8" />
            <LampPool iso={iso} x={9.98} y={8.2} r={2.4} />
            {carS && <CarBeam iso={iso} x={carS.x} y={carS.y} yaw={-Math.PI / 2} opacity={carS.op} />}
          </g>
        )}
        {lightsOn && POLES.map((p, i) => {
          const [lx, ly] = iso.p(p.x + p.dir[0] * 0.38, p.y + p.dir[1] * 0.38, 4.2);
          const [px, py] = iso.p(p.pool[0], p.pool[1], 0);
          const R = p.pool[2] * iso.s * 1.22;
          return (
            <g key={i} style={{ mixBlendMode: 'screen' }}>
              <polygon points={`${lx},${ly} ${px - R * 0.85},${py} ${px + R * 0.85},${py}`} fill="url(#fence-beam)" opacity={night ? 0.55 : 0.28} filter="url(#iso-soft)" />
              <ellipse cx={px} cy={py} rx={R} ry={R * 0.58} fill="url(#iso-pool)" opacity={night ? 1 : 0.45} />
              <circle cx={lx} cy={ly + 1.6} r="2.6" fill="#FFF7D6" filter="url(#iso-glow)" />
            </g>
          );
        })}
        {flash && (
          <g style={{ mixBlendMode: 'screen' }} opacity={night ? 1 : 0.6}>
            <polygon points={`${flash.hx},${flash.hy} ${flash.t1[0]},${flash.t1[1]} ${flash.t2[0]},${flash.t2[1]}`} fill="rgba(255,244,200,0.42)" filter="url(#iso-soft)" />
            <ellipse cx={flash.spot[0]} cy={flash.spot[1]} rx="7" ry="9" fill="#FFF7D6" opacity="0.7" filter="url(#iso-soft)" />
            <circle cx={flash.hx} cy={flash.hy} r="1.6" fill="#FFFFFF" />
          </g>
        )}

        {/* energizer LED */}
        {(() => {
          const [ex, ey] = iso.p(WH_.x1 + 0.016, ENERG.y0 + 0.14, ENERG.z1 - 0.19);
          const beat = (t % 1) < 0.12;
          return <circle cx={ex} cy={ey} r="1.5" fill={alarm ? '#EF4444' : beat ? '#4ADE80' : '#166534'} filter={beat || alarm ? 'url(#iso-glow)' : undefined} />;
        })()}

        {pulses}
        {alarmZap && lt > ZAP + 0.4 && WIRE_HIT.map((str, i) => (
          <polyline key={i} points={str} fill="none" stroke="#EF4444" strokeWidth="1.3" opacity={0.45 + 0.4 * Math.sin(t * 10)} filter="url(#iso-glow)" />
        ))}
        {zapT >= 0 && zapT < 0.5 && WIRE_Z1.map((str, i) => (
          <polyline key={i} points={str} fill="none" stroke="#E0F2FE" strokeWidth="1.6" opacity={1 - zapT / 0.5} filter="url(#iso-glow)" />
        ))}
        {cut && dangling.map((d) => (
          Math.floor(t * 9 + d.i * 3 + d.s) % 5 === 0 ? <circle key={d.key} cx={d.end[0]} cy={d.end[1]} r="2.2" fill="#FDE68A" filter="url(#iso-glow)" /> : null
        ))}

        {/* corner beacon */}
        <g>
          <ellipse cx={bx} cy={by + 1.5} rx="3.6" ry="1.6" fill="#374151" />
          <path d={`M ${bx - 3.2} ${by + 1.4} L ${bx - 3.2} ${by - 2} A 3.2 3.2 0 0 1 ${bx + 3.2} ${by - 2} L ${bx + 3.2} ${by + 1.4} Z`} fill={strobeOn ? '#FF3B3B' : '#7F1D1D'} />
          {alarm && (
            <g>
              {strobeOn && <circle cx={bx} cy={by} r="30" fill="url(#iso-red-pool)" />}
              {[0, 0.55].map((dl) => {
                const k = (((t - dl) % 1.1) + 1.1) % 1.1 / 1.1;
                return <circle key={dl} cx={bx} cy={by} r={4 + k * 40} fill="none" stroke="#EF4444" strokeWidth="1.3" opacity={(1 - k) * 0.85} />;
              })}
            </g>
          )}
        </g>

        {/* shock fx */}
        {bolts.map((pts, i) => {
          const str = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
          return (
            <g key={i}>
              <polyline points={str} fill="none" stroke="#0284C7" strokeWidth={i === 0 ? 4.2 : 2.6} strokeLinejoin="round" opacity={night ? 0.5 : 0.75} filter="url(#iso-soft)" />
              <polyline points={str} fill="none" stroke="#38BDF8" strokeWidth={i === 0 ? 2.6 : 1.6} strokeLinejoin="round" />
              <polyline points={str} fill="none" stroke={i === 0 ? '#FFFFFF' : '#E0F2FE'} strokeWidth={i === 0 ? 1.2 : 0.7} strokeLinejoin="round" filter="url(#iso-glow)" />
            </g>
          );
        })}
        {zapT >= 0 && zapT < 0.6 && <circle cx={cx} cy={cy} r={6 + zapT * 50} fill="#E0F2FE" opacity={0.7 * (1 - zapT / 0.6)} filter="url(#iso-blur-lg)" />}
        {sparks.map((s, i) => <line key={i} x1={s.qx} y1={s.qy} x2={s.px} y2={s.py} stroke={s.c} strokeWidth="1.2" strokeLinecap="round" opacity={s.o} />)}
        {zapT >= 0 && zapT < 0.18 && <rect x="-400" y="-400" width="1400" height="1240" fill="#F0F9FF" opacity={0.32 * (1 - zapT / 0.18)} />}
        {alarm && <rect x="-400" y="-400" width="1400" height="1240" fill="#DC2626" opacity={strobeOn ? 0.06 : 0.015} style={{ mixBlendMode: 'multiply' }} />}

        {/* event tags */}
        {tagOp > 0 && (
          <g opacity={tagOp} style={{ pointerEvents: 'none' }}>
            <polyline points={`${cx},${cy} ${cx + 18},${cy - 24} ${cx + 30},${cy - 24}`} fill="none" stroke="#F87171" strokeWidth="0.9" />
            <circle cx={cx} cy={cy} r="2" fill="#F87171" />
            <g transform={`translate(${cx + 30},${cy - 34})`}>
              <rect width="84" height="20" rx="3" fill="rgba(29,30,27,0.92)" stroke="#F87171" strokeWidth="0.8" />
              <text x="5" y="8.4" fontSize="6.2" fontWeight="800" fill="#FFFFFF" fontFamily={MONO}>Z1 · TRAMO 4</text>
              <text x="5" y="15.8" fontSize="5.2" fill="#FCA5A5" fontFamily={MONO}>DESCARGA 9.8 kV · 0.3 J</text>
            </g>
          </g>
        )}
        {cut && (
          <g style={{ pointerEvents: 'none' }}>
            <polyline points={`${cutTx},${cutTy} ${cutTx - 14},${cutTy - 26} ${cutTx - 24},${cutTy - 26}`} fill="none" stroke="#FBBF24" strokeWidth="0.9" />
            <g transform={`translate(${cutTx - 108},${cutTy - 36})`}>
              <rect width="84" height="20" rx="3" fill="rgba(29,30,27,0.92)" stroke="#FBBF24" strokeWidth="0.8" />
              <text x="5" y="8.4" fontSize="6.2" fontWeight="800" fill="#FFFFFF" fontFamily={MONO}>Z2 · LAZO ABIERTO</text>
              <text x="5" y="15.8" fontSize="5.2" fill="#FDE68A" fontFamily={MONO}>CORTE DETECTADO · 0.4 s</text>
            </g>
          </g>
        )}

        {/* energizer oscilloscope */}
        <g transform="translate(462,312)">
          <rect width="126" height="54" rx="8" fill="rgba(29,30,27,0.92)" stroke={alarm ? '#EF4444' : '#2B5672'} strokeWidth={alarm ? 1.4 : 1} />
          <text x="8" y="12" fontSize="6.2" fontWeight="800" fill="#FFFFFF" fontFamily={MONO}>ENERGIZADOR</text>
          <text x="118" y="12" textAnchor="end" fontSize="5.6" fill="#94A3B8" fontFamily={MONO}>1 Hz</text>
          <line x1="8" y1="42" x2="116" y2="42" stroke="#334155" strokeWidth="0.6" />
          <polyline points={trace.join(' ')} fill="none" stroke={traceHot ? '#F87171' : '#38BDF8'} strokeWidth="1.1" strokeLinejoin="round" />
          <text x="8" y="51" fontSize="5.4" fill={kv1 === '—' ? '#F87171' : '#CBD5E1'} fontFamily={MONO}>Z1 {kv1} kV</text>
          <text x="118" y="51" textAnchor="end" fontSize="5.4" fill={cut ? '#FBBF24' : '#CBD5E1'} fontFamily={MONO}>Z2 {cut ? 'ABIERTO' : `${kv2} kV`}</text>
        </g>
      </svg>

      <div className={`iso-hud-overlay ${alarm ? 'is-alert' : ''}`}>
        <div className="iso-hud-status-row">
          <span className="iso-hud-dot iso-hud-dot--rec" style={{ backgroundColor: alarm ? '#EF4444' : '#22C55E' }} />
          <strong>{status}</strong>
          <span className="iso-hud-clock">{cctvClock(t, night ? 23 * 3600 + 41 * 60 : 14 * 3600 + 8 * 60)}</span>
        </div>
        <div className="iso-hud-meta">
          <span>Z1 {kv1} kV</span>
          <span>Z2 {cut ? 'ABIERTO' : `${kv2} kV`}</span>
          <span>NOM-001-SEDE</span>
        </div>
        <ul className="iso-event-log">
          {log.map((e) => <li key={e.txt}><i style={{ background: e.c }} />{e.txt}</li>)}
        </ul>
      </div>

      <div className="iso-controls-bar">
        <button type="button" className="iso-btn iso-btn--primary" onClick={() => setOff(t - 0.4)}>
          <AlertTriangle size={13} /><span>Simular escalamiento</span>
        </button>
        <button type="button" className={`iso-btn ${cut ? 'is-on is-amber' : ''}`} onClick={() => setCutAt(cut ? null : t)} aria-pressed={cut}>
          <Scissors size={13} /><span>{cut ? 'Reparar línea' : 'Cortar cable'}</span>
        </button>
        <button type="button" className={`iso-btn ${night ? 'is-on' : ''}`} onClick={() => setNight((v) => !v)} aria-pressed={night}>
          <Moon size={13} /><span>Noche</span>
        </button>
      </div>
    </div>
  );
}
