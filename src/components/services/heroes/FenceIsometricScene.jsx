import React, { useRef } from 'react';
import { createIso, makePath, seg, lerp, cctvClock, useSceneClock } from './iso/engine';
import { IsoDefs, Box, Person, Tree, Lamp, Car, faceY, faceX, flat, planeY, planeX, MONO } from './iso/primitives';
import './IsometricHeroes.css';

/* ==========================================================================
   ELECTRIC FENCE · Industrial Campus High-Voltage Perimeter Protection
   Continuous Autonomous 60fps Animation:
   - 10,000V to 14,000V pulsed high voltage traveling continuously along
     all 6 strands with glowing energy waves.
   - Dual-zone perimeter sensor monitoring (Z1 & Z2) under NOM-001-SEDE.
   - Security guard on active walking patrol along the perimeter sidewalk.
   - Perimeter avenue with circulating vehicles.
   - Real-time oscilloscope monitor drawing active 1 Hz energizer pulses.
   - Zero awkward manual toggles; continuous high-tech security operation.
   ========================================================================== */

const iso = createIso({ ox: 306, oy: 92, s: 24 });
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
const CYCLE = 12;
const GATE = { x0: 2.6, x1: 5.0 };
const WH_ = { x0: 0.8, x1: 6.2, y0: 0.6, y1: 3.6, h: 3.2 };
const GH = { x0: 4.6, x1: 5.8, y0: 5.4, y1: 6.6, h: 2.35 };
const ENERG = { y0: 0.75, y1: 1.3, z0: 1.05, z1: 1.7 };

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

/* ---------- patrol paths ---------- */
// Continuous loop of security guard patrolling perimeter
const GUARD_PATH = makePath([
  [9.7, 1.2],
  [9.7, 9.8],
  [1.2, 9.8],
  [9.7, 9.8],
  [9.7, 1.2],
], 0.6);

// Avenue traffic loop
const CAR_PATH = makePath([
  [11.2, 13.0],
  [11.2, -1.8],
], 0);

/* ---------- static layers ---------- */
const Ground = React.memo(function Ground() {
  const joints = [];
  for (let x = 2; x < WX; x += 2) joints.push(<polygon key={`jx${x}`} points={flat(iso, x, 0, x + 0.03, WY, 0.005)} fill="#C5C1BA" />);
  for (let y = 2; y < WY; y += 2) joints.push(<polygon key={`jy${y}`} points={flat(iso, 0, y, WX, y + 0.03, 0.005)} fill="#C5C1BA" />);
  const walkJ = [];
  for (let y = 0.9; y < 10.6; y += 1.0) walkJ.push(<polygon key={`wr${y}`} points={flat(iso, WX + WT, y, 10.2, y + 0.025, 0.006)} fill="#C2BDB4" />);
  for (let x = 0.9; x < 10.2; x += 1.0) walkJ.push(<polygon key={`wf${x}`} points={flat(iso, x, WY + WT, x + 0.025, 10.6, 0.006)} fill="#C2BDB4" />);
  const dashes = [];
  for (let y = 0.3; y < 10.2; y += 1.3) dashes.push(<polygon key={`dr${y}`} points={flat(iso, 11.08, y, 11.16, y + 0.65, 0.008)} fill="#E5E7EB" opacity="0.85" />);
  for (let x = 0.3; x < 10.0; x += 1.3) dashes.push(<polygon key={`df${x}`} points={flat(iso, x, 11.26, x + 0.65, 11.34, 0.008)} fill="#E5E7EB" opacity="0.85" />);
  const zebra = [];
  for (let x = 8.95; x < 10.1; x += 0.34) zebra.push(<polygon key={`z${x}`} points={flat(iso, x, 10.75, x + 0.17, 11.9, 0.009)} fill="#F1F5F9" opacity="0.9" />);

  return (
    <g>
      {/* Slab */}
      <polygon points={faceY(iso, G, 0, G, -0.6, 0)} fill="#8E949C" />
      <polygon points={faceX(iso, G, 0, G, -0.6, 0)} fill="#757B84" />
      <polygon points={flat(iso, 0, 0, G, G)} fill="#474D57" />
      {dashes}
      {zebra}
      {/* Sidewalks + curbs */}
      <polygon points={flat(iso, WX + WT, 0, 10.2, 10.6, 0.004)} fill="#D8D3CB" />
      <polygon points={flat(iso, 0, WY + WT, 10.2, 10.6, 0.004)} fill="#D8D3CB" />
      {walkJ}
      <polygon points={flat(iso, 10.12, 0, 10.24, 10.66, 0.01)} fill="#B9B3A9" />
      <polygon points={flat(iso, 0, 10.54, 10.24, 10.66, 0.01)} fill="#B9B3A9" />
      {/* Yard ground */}
      <polygon points={flat(iso, 0, 0, WX, WY, 0.003)} fill="#D6D3CD" />
      {joints}
      {/* Loading bay yellow safety lines */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <polygon key={i} points={iso.pts([[1.15 + i * 0.28, 3.65, 0.007], [1.3 + i * 0.28, 3.65, 0.007], [1.0 + i * 0.28, 4.4, 0.007], [0.85 + i * 0.28, 4.4, 0.007]])} fill="#EAB308" opacity="0.75" />
      ))}
      <polygon points={flat(iso, 0.6, 4.55, 6.4, 4.62, 0.007)} fill="#EAB308" opacity="0.85" />
    </g>
  );
});

const Warehouse = React.memo(function Warehouse() {
  const { x0, x1, y0, y1, h } = WH_;
  const ribsY = [];
  for (let x = x0 + 0.15; x < x1; x += 0.3) ribsY.push(<polygon key={x} points={faceY(iso, y1 + 0.004, x, x + 0.05, 0.35, h)} fill="#B9C0CA" opacity="0.8" />);
  const ribsX = [];
  for (let y = y0 + 0.15; y < y1; y += 0.3) ribsX.push(<polygon key={y} points={faceX(iso, x1 + 0.004, y, y + 0.05, 0.35, h)} fill="#A1A9B4" opacity="0.8" />);

  return (
    <g>
      <Box iso={iso} x={x0} y={y0} w={x1 - x0} d={y1 - y0} h={h} color="#C9CED6" left="#D9DDE3" right="#B3BAC4" top="#E4E7EB" />
      {ribsY}
      {ribsX}
      <polygon points={faceY(iso, y1 + 0.006, x0, x1, 0, 0.35)} fill="#8F97A3" />
      <polygon points={faceX(iso, x1 + 0.006, y0, y1, 0, 0.35)} fill="#7D8692" />
      {/* Windows & Doors */}
      <polygon points={faceY(iso, y1 + 0.008, 1.0, 6.0, 2.42, 2.82)} fill="#4F6B80" />
      {[[1.25, 2.65], [3.35, 4.75]].map(([a, b]) => (
        <g key={a}>
          <polygon points={faceY(iso, y1 + 0.01, a - 0.08, b + 0.08, 0, 2.25)} fill="#64748B" />
          <polygon points={faceY(iso, y1 + 0.011, a, b, 0, 2.15)} fill="#E2E6EB" />
        </g>
      ))}
      {/* Warehouse identity */}
      <g transform={planeY(iso, 3.45, y1 + 0.014, 3.1)}>
        <rect x="0" y="-6.5" width="44" height="8.5" rx="1.5" fill="#1D1E1B" />
        <text x="4" y="0" fontSize="5.6" fontWeight="800" letterSpacing="1.2" fill="#FFFFFF" fontFamily="Inter, sans-serif">CEDIS NORTE</text>
        <rect x="35" y="-4.5" width="5.5" height="4.5" rx="0.8" fill="#A6192E" />
      </g>
      {/* Energizer panel box */}
      <polygon points={faceX(iso, x1 + 0.012, ENERG.y0, ENERG.y1, ENERG.z0, ENERG.z1)} fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.5" />
      <polygon points={faceX(iso, x1 + 0.014, ENERG.y0 + 0.06, ENERG.y1 - 0.06, ENERG.z0 + 0.06, ENERG.z0 + 0.14)} fill="#FACC15" />
      <g transform={planeX(iso, x1 + 0.016, ENERG.y1 + 0.05, ENERG.z0 - 0.12)}>
        <text x="0" y="0" fontSize="3.6" fontWeight="700" fill="#475569" fontFamily={MONO}>ENERGIZADOR 14kV</text>
      </g>
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
      <Box iso={iso} x={x0 - 0.12} y={y0 - 0.12} w={x1 - x0 + 0.24} d={y1 - y0 + 0.24} h={0.12} z={h} color="#3F3F46" />
      <g transform={planeY(iso, x0 + 0.2, y1 + 0.13, h - 0.12)}>
        <text x="0" y="0" fontSize="4.4" fontWeight="800" letterSpacing="0.8" fill="#1D1E1B" fontFamily={MONO}>CASETA 01</text>
      </g>
    </g>
  );
});

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
  const bars = [];
  for (let x = GATE.x0 + 0.08; x < GATE.x1; x += 0.15) {
    const [a0, a1] = iso.p(x, FY, 0.08);
    const [b0, b1] = iso.p(x, FY, 2.06);
    bars.push(<line key={x} x1={a0} y1={a1} x2={b0} y2={b1} stroke="#334155" strokeWidth="1.1" />);
  }
  return (
    <g>
      {/* Right perimeter wall (Zone 1) */}
      <Box iso={iso} x={WX} y={0} w={WT} d={WY + WT} h={WH} color="#E9E4DA" right="#DCD5C8" top="#C7BFB1" />
      {[0.05, 3.0, 6.0].map((y) => <Box key={y} iso={iso} x={WX + WT} y={y} w={0.09} d={0.32} h={WH + 0.06} color="#E2DCD0" right="#D3CBBC" top="#BDB4A5" />)}
      <WarnSign transform={planeX(iso, WX + WT + 0.012, 2.75, 1.85)} />
      <WarnSign transform={planeX(iso, WX + WT + 0.012, 7.55, 1.85)} />

      {/* Sliding gate */}
      {bars}
      <line x1={iso.p(GATE.x0, FY, 0.12)[0]} y1={iso.p(GATE.x0, FY, 0.12)[1]} x2={iso.p(GATE.x1, FY, 0.12)[0]} y2={iso.p(GATE.x1, FY, 0.12)[1]} stroke="#1F2937" strokeWidth="1.6" />
      <line x1={iso.p(GATE.x0, FY, 2.06)[0]} y1={iso.p(GATE.x0, FY, 2.06)[1]} x2={iso.p(GATE.x1, FY, 2.06)[0]} y2={iso.p(GATE.x1, FY, 2.06)[1]} stroke="#1F2937" strokeWidth="1.6" />

      {/* Front perimeter wall (Zone 2) */}
      <Box iso={iso} x={0} y={WY} w={GATE.x0} d={WT} h={WH} color="#EFEBE3" left="#F2EEE6" top="#C7BFB1" />
      <Box iso={iso} x={GATE.x1} y={WY} w={WX + WT - GATE.x1} d={WT} h={WH} color="#EFEBE3" left="#F2EEE6" top="#C7BFB1" />
      <WarnSign transform={planeY(iso, 0.7, WY + WT + 0.012, 1.85)} />
      <WarnSign transform={planeY(iso, 5.6, WY + WT + 0.012, 1.85)} />
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

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
export default function FenceIsometricScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 3.5 });

  // 1. Continuous patrol guard
  const guardDist = ((t * 0.75) % GUARD_PATH.length);
  const guardPt = GUARD_PATH.at(guardDist);

  // 2. Continuous vehicle traffic
  const carK = ((t * 0.16) % 1);
  const carY = lerp(13.0, -1.8, carK);

  // 3. Continuous high voltage energy wave (1 Hz loop)
  const pulseK = (t % 1) / 0.8;
  const pulseD = pulseK * WIRE_LEN;
  const pulses = [];
  if (pulseK < 1) {
    const d1 = pulseD;
    const d0 = Math.max(0, pulseD - 1.8);
    STRANDS.forEach((z, i) => {
      const pts = [];
      for (let k = 0; k <= 8; k++) pts.push(pointAt(lerp(d0, d1, k / 8), z));
      pulses.push(
        <polyline
          key={i}
          points={iso.pts(pts)}
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.8"
          strokeLinecap="round"
          filter="url(#iso-glow)"
          opacity="0.95"
        />
      );
    });
  }

  // 4. Continuous oscilloscope waveform (1 Hz clean impulse)
  const trace = [];
  for (let j = 0; j <= 96; j++) {
    const tau = t - 2.5 + (j / 96) * 2.5;
    const ph = ((tau % 1) + 1) % 1;
    const v = ph < 0.02 ? ph / 0.02 : Math.exp(-(ph - 0.02) * 36);
    trace.push(`${(8 + (j / 96) * 108).toFixed(1)},${(42 - v * 22).toFixed(1)}`);
  }

  // Active status readings
  const kv1 = (10.2 + Math.sin(t * 1.7) * 0.05).toFixed(1);
  const kv2 = (9.9 + Math.cos(t * 1.3) * 0.05).toFixed(1);

  return (
    <div className="iso-scene-wrap" ref={wrapRef}>
      <svg
        className="iso-svg-canvas iso-svg-canvas--wide"
        viewBox="0 0 600 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animación isométrica continua de cerca electrificada de alto voltaje"
      >
        <IsoDefs />

        {/* 1. Ground & Yard */}
        <Ground />

        {/* 2. Warehouse & Caseta */}
        <Warehouse />
        <Guardhouse />

        {/* 3. Truck parked in loading bay */}
        <Box iso={iso} x={1.4} y={3.75} w={1.15} d={2.85} h={1.85} z={0.38} color="#F8FAFC" right="#E2E8F0" />
        <polygon points={faceX(iso, 2.552, 3.75, 6.6, 0.9, 1.05)} fill="#A6192E" />
        <Box iso={iso} x={1.45} y={6.62} w={1.05} d={0.95} h={1.3} z={0.32} color="#2B5672" />

        {/* 4. Perimeter Walls & Posts */}
        <Walls />
        <Posts />

        {/* 5. Tensioned 6-Strand Wires */}
        {WIRE_FULL.map((str, i) => (
          <polyline key={i} points={str} fill="none" stroke="#64748B" strokeWidth="0.9" strokeLinejoin="round" />
        ))}

        {/* 6. Active Pulsing Energy Waves Traveling along Wires */}
        {pulses}

        {/* 7. Active Perimeter Infrared Microwave Sensor Beam */}
        {(() => {
          const scanU = (Math.sin(t * 1.5) + 1) / 2;
          const [sx, sy] = iso.p(
            lerp(RX, 0.5, scanU > 0.5 ? (scanU - 0.5) * 2 : 0),
            lerp(0.5, FY, scanU <= 0.5 ? scanU * 2 : 1),
            POST_TOP + 0.1
          );
          return (
            <g>
              <line
                x1={iso.p(RX, 0.2, POST_TOP + 0.05)[0]}
                y1={iso.p(RX, 0.2, POST_TOP + 0.05)[1]}
                x2={iso.p(RX, FY, POST_TOP + 0.05)[0]}
                y2={iso.p(RX, FY, POST_TOP + 0.05)[1]}
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                opacity="0.65"
              />
              <line
                x1={iso.p(RX, FY, POST_TOP + 0.05)[0]}
                y1={iso.p(RX, FY, POST_TOP + 0.05)[1]}
                x2={iso.p(0.2, FY, POST_TOP + 0.05)[0]}
                y2={iso.p(0.2, FY, POST_TOP + 0.05)[1]}
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                opacity="0.65"
              />
              <circle cx={sx} cy={sy} r="3" fill="#38BDF8" filter="url(#iso-glow)" />
            </g>
          );
        })()}

        {/* 8. Landscaping & Street Furniture */}
        <Tree iso={iso} x={1.2} y={10.3} size={0.72} />
        <Tree iso={iso} x={7.2} y={10.3} size={0.66} color="#5A9466" />
        <Tree iso={iso} x={9.9} y={1.0} size={0.7} />
        <Lamp iso={iso} x={9.98} y={8.2} h={3.6} />

        {/* 9. Security Guard in Uniform on Patrol */}
        <Person
          iso={iso}
          x={guardPt.x}
          y={guardPt.y}
          heading={guardPt.angle}
          moving
          phase={guardDist * 4.4}
          shirt="#1E293B"
          pants="#0F172A"
          cap="#0F172A"
          skin="#C99474"
        />

        {/* 10. Moving Avenue Traffic */}
        <Car
          iso={iso}
          x={11.2}
          y={carY}
          yaw={-Math.PI / 2}
          color="#F1F5F9"
          opacity={Math.min(seg(carK, 0, 0.08), 1 - seg(carK, 0.92, 1))}
        />

        {/* 11. Energizer Oscilloscope Real-Time Badge */}
        <g transform="translate(460, 320)">
          <rect width="128" height="52" rx="8" fill="rgba(29,30,27,0.92)" stroke="#2B5672" strokeWidth="1.2" />
          <text x="8" y="13" fontSize="6.4" fontWeight="800" fill="#FFFFFF" fontFamily={MONO}>ENERGIZADOR</text>
          <text x="120" y="13" textAnchor="end" fontSize="5.6" fill="#38BDF8" fontFamily={MONO}>1 Hz · ACTIVO</text>
          <line x1="8" y1="40" x2="118" y2="40" stroke="#334155" strokeWidth="0.6" />
          <polyline points={trace.join(' ')} fill="none" stroke="#38BDF8" strokeWidth="1.4" strokeLinejoin="round" />
          <text x="8" y="49" fontSize="5.4" fill="#CBD5E1" fontFamily={MONO}>Z1 {kv1} kV</text>
          <text x="120" y="49" textAnchor="end" fontSize="5.4" fill="#CBD5E1" fontFamily={MONO}>Z2 {kv2} kV</text>
        </g>
      </svg>

      {/* Telemetry HUD */}
      <div className="iso-hud-overlay">
        <div className="iso-hud-status-row">
          <span className="iso-hud-dot iso-hud-dot--rec" style={{ backgroundColor: '#22C55E' }} />
          <strong>CERCA ENERGIZADA · 2 ZONAS</strong>
          <span className="iso-hud-clock">{cctvClock(t, 14 * 3600 + 8 * 60)}</span>
        </div>
        <div className="iso-hud-meta">
          <span>Z1: {kv1} kV</span>
          <span>Z2: {kv2} kV</span>
          <span>TIERRA: 8 Ω OK</span>
          <span>NOM-001-SEDE</span>
        </div>
        <ul className="iso-event-log">
          <li><i style={{ background: '#34D399' }} />AUTOPRUEBA OK · 10.0 kV ACTIVO</li>
          <li><i style={{ background: '#38BDF8' }} />CIRCUITO CERRADO · 1 Hz EN LÍNEA</li>
          <li><i style={{ background: '#34D399' }} />MONITOREO C4 · 24/7 ENLACE 4G</li>
        </ul>
      </div>
    </div>
  );
}
