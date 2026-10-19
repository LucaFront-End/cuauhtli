import React, { useRef, useState } from 'react';
import { ShieldCheck, ShieldOff, AlertOctagon, Siren } from 'lucide-react';
import { createIso, makePath, seg, easeInOut, clamp, cctvClock, debugParam, useSceneClock } from './iso/engine';
import { IsoDefs, Box, Person, Tree, Bush, Planter, DetectBox, AirRing, faceY, faceX, flat, planeX, personRect, MONO } from './iso/primitives';
import './IsometricHeroes.css';

/* ==========================================================================
   ALARMS · Architectural cut-away house monitored by a C4 central station
   Armed loop (18s): back door forced → contact sensor → PIR detection →
   siren + strobe → event reported to C4 over 4G/IP → intruder flees.
   ========================================================================== */

const iso = createIso({ ox: 292, oy: 96, s: 22 });
const G = 12;
const WALL = 3.0;
const CYCLE = 18;
const H = { x0: 1.2, x1: 10.2, y0: 1.2, y1: 9.6 };
const DOOR = { x0: 8.25, x1: 9.2 };
const PIR = { x: 1.3, y: 5.3, z: 2.7 };
const KEYPAD = { y0: 8.55, y1: 9.0, z0: 1.3, z1: 1.78 };

const INTR_IN = makePath([[8.72, 0.8], [8.72, 4.9], [7.2, 6.6], [6.6, 7.0]], 1.0);
const PIR_HIT_D = (() => {
  for (let d = 0; d < INTR_IN.length; d += 0.02) if (INTR_IN.at(d).y > 5.25) return d;
  return 4;
})();
const RESIDENT = makePath([[4.9, 5.75], [7.4, 5.9], [8.95, 4.5], [8.95, 2.6], [8.0, 4.6], [5.4, 5.6], [4.9, 5.75]], 0.8);

const LIVING_CLIP = flat(iso, H.x0, 5.2, H.x1, H.y1, 0.02);

/* ---------- static house ---------- */
const House = React.memo(function House() {
  const planks = [];
  for (let y = 5.25; y < H.y1; y += 0.42) planks.push(<polygon key={y} points={flat(iso, H.x0, y, H.x1, y + 0.02)} fill="#B08359" opacity="0.35" />);
  const kitchenTiles = [];
  for (let x = 5.8; x < H.x1; x += 0.7) for (let y = H.y0; y < 5.0; y += 0.7) {
    if (Math.round((x + y) / 0.7) % 2) kitchenTiles.push(<polygon key={`${x}-${y}`} points={flat(iso, x, y, Math.min(x + 0.7, H.x1), Math.min(y + 0.7, 5.0))} fill="#E3E0DA" />);
  }
  return (
    <g>
      {/* diorama slab + lawn */}
      <polygon points={faceY(iso, G, 0, G, -0.7, 0)} fill="#8A6F52" />
      <polygon points={faceX(iso, G, 0, G, -0.7, 0)} fill="#735C44" />
      <polygon points={faceY(iso, G, 0, G, -0.12, 0)} fill="#6E9A5C" />
      <polygon points={faceX(iso, G, 0, G, -0.12, 0)} fill="#5E8750" />
      <polygon points={flat(iso, 0, 0, G, G)} fill="#93BE7F" />
      {/* stepping stones + patio */}
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={flat(iso, 10.6 + i * 0.35, 10.1 + i * 0.45, 11.2 + i * 0.35, 10.45 + i * 0.45)} fill="#D6D1C8" />
      ))}
      <polygon points={flat(iso, H.x0 - 0.5, H.y1, H.x1 + 0.4, H.y1 + 0.45)} fill="#CFC9BE" />

      {/* floors */}
      <polygon points={flat(iso, H.x0, H.y0, H.x1, H.y1, 0.02)} fill="#C99A6B" />
      {planks}
      <polygon points={flat(iso, H.x0, H.y0, 5.8, 5.0, 0.03)} fill="#D9D3EA" />
      <polygon points={flat(iso, 5.8, H.y0, H.x1, 5.0, 0.03)} fill="#F1EEE9" />
      {kitchenTiles}
      <polygon points={flat(iso, 2.6, 6.2, 5.4, 9.0, 0.04)} fill="#2B5672" opacity="0.85" />
      <polygon points={flat(iso, 2.8, 6.4, 5.2, 8.8, 0.045)} fill="none" stroke="#E8E6E6" strokeWidth="0.8" opacity="0.6" />

      {/* back walls */}
      <Box iso={iso} x={H.x0 - 0.25} y={H.y0} w={0.25} d={H.y1 - H.y0} h={WALL} color="#EDEAE4" right="#F6F4F0" top="#3F3F46" />
      <Box iso={iso} x={H.x0 - 0.25} y={H.y0 - 0.25} w={H.x1 - H.x0 + 0.25} d={0.25} h={WALL} color="#EDEAE4" left="#F8F6F2" top="#3F3F46" />
      {/* skirting */}
      <polygon points={faceY(iso, H.y0 + 0.01, H.x0, H.x1, 0, 0.12)} fill="#D6D1C8" />
      <polygon points={faceX(iso, H.x0 + 0.01, H.y0, H.y1, 0, 0.12)} fill="#D6D1C8" />

      {/* windows */}
      <polygon points={faceY(iso, H.y0 + 0.012, 3.9, 5.3, 1.0, 2.4)} fill="url(#iso-glass)" stroke="#F8FAFC" strokeWidth="1.2" />
      <polygon points={faceY(iso, H.y0 + 0.014, 4.58, 4.62, 1.0, 2.4)} fill="#F8FAFC" />
      <polygon points={faceX(iso, H.x0 + 0.012, 2.3, 4.0, 1.0, 2.4)} fill="url(#iso-glass)" stroke="#F8FAFC" strokeWidth="1.2" />

      {/* back door frame */}
      <polygon points={faceY(iso, H.y0 + 0.01, DOOR.x0 - 0.08, DOOR.x1 + 0.08, 0, 2.3)} fill="#E2DED7" />
      <polygon points={faceY(iso, H.y0 + 0.012, DOOR.x0, DOOR.x1, 0, 2.22)} fill="#BFE0F5" />
      <polygon points={faceY(iso, H.y0 + 0.013, DOOR.x0, DOOR.x1, 0, 0.7)} fill="#8DB57C" opacity="0.8" />

      {/* kitchen wall units */}
      <polygon points={faceY(iso, H.y0 + 0.01, 5.95, 8.0, 1.85, 2.65)} fill="#F4F2EE" stroke="#D6D1C8" strokeWidth="0.6" />
      {[6.6, 7.3].map((x) => <polygon key={x} points={faceY(iso, H.y0 + 0.012, x, x + 0.02, 1.85, 2.65)} fill="#C9C3B9" />)}

      {/* TV on left wall */}
      <polygon points={faceX(iso, H.x0 + 0.012, 6.5, 8.3, 1.15, 2.1)} fill="#0F172A" />
      <polygon points={faceX(iso, H.x0 + 0.014, 6.56, 8.24, 1.2, 2.05)} fill="#1E3A5F" opacity="0.8" />
    </g>
  );
});

/* furniture & low partitions — sortable */
const FURNITURE = [
  // bedroom
  { k: 2.9 + 2.3, el: (
    <g key="bed">
      <Box iso={iso} x={2.0} y={H.y0} w={1.9} d={0.18} h={1.1} color="#8C6A4A" />
      <Box iso={iso} x={2.0} y={1.38} w={1.9} d={2.1} h={0.42} color="#F1F5F9" />
      <Box iso={iso} x={2.0} y={2.25} w={1.9} d={1.23} h={0.08} z={0.42} color="#2B5672" />
      <Box iso={iso} x={2.15} y={1.45} w={0.75} d={0.45} h={0.12} z={0.42} color="#FFFFFF" />
      <Box iso={iso} x={3.0} y={1.45} w={0.75} d={0.45} h={0.12} z={0.42} color="#FFFFFF" />
    </g>
  ) },
  { k: 1.6 + 1.6, el: <Box key="ns" iso={iso} x={1.3} y={1.3} w={0.55} d={0.5} h={0.55} color="#A07A55" /> },
  // bedroom partition (cut section)
  { k: 2.9 + 5.1, el: <Box key="pt1" iso={iso} x={H.x0} y={5.0} w={3.4} d={0.2} h={1.25} color="#EDEAE4" left="#F4F2EE" top="#3F3F46" /> },
  { k: 5.7 + 3.1, el: <Box key="pt2" iso={iso} x={5.6} y={H.y0} w={0.2} d={3.8} h={1.25} color="#EDEAE4" right="#E2DED7" top="#3F3F46" /> },
  // kitchen
  { k: 7.0 + 1.5, el: (
    <g key="counter">
      <Box iso={iso} x={5.95} y={H.y0} w={2.05} d={0.65} h={0.95} color="#F4F2EE" right="#DCD7CF" />
      <Box iso={iso} x={5.95} y={H.y0} w={2.05} d={0.68} h={0.06} z={0.95} color="#2B2D2A" />
      <Box iso={iso} x={6.6} y={1.35} w={0.5} d={0.35} h={0.04} z={1.01} color="#94A3B8" />
    </g>
  ) },
  { k: 9.8 + 1.6, el: <Box key="fridge" iso={iso} x={9.4} y={H.y0} w={0.72} d={0.72} h={2.1} color="#E5E7EB" right="#CBD5E1" /> },
  { k: 7.05 + 3.4, el: (
    <g key="island">
      <Box iso={iso} x={6.2} y={3.0} w={1.7} d={0.8} h={0.95} color="#2B5672" />
      <Box iso={iso} x={6.15} y={2.95} w={1.8} d={0.9} h={0.06} z={0.95} color="#F1F5F9" />
    </g>
  ) },
  { k: 6.6 + 4.15, el: <Box key="st1" iso={iso} x={6.45} y={4.0} w={0.35} d={0.35} h={0.65} color="#1F2937" /> },
  { k: 7.5 + 4.15, el: <Box key="st2" iso={iso} x={7.3} y={4.0} w={0.35} d={0.35} h={0.65} color="#1F2937" /> },
  // living
  { k: 1.45 + 7.4, el: <Box key="tvc" iso={iso} x={H.x0} y={6.3} w={0.45} d={2.2} h={0.5} color="#A07A55" /> },
  { k: 4.2 + 7.6, el: <Box key="table" iso={iso} x={3.6} y={7.0} w={1.2} d={1.2} h={0.38} color="#E8E6E6" top="#FFFFFF" /> },
  { k: 6.05 + 7.6, el: (
    <g key="sofa">
      <Box iso={iso} x={5.7} y={6.2} w={0.85} d={2.8} h={0.45} color="#A6192E" />
      <Box iso={iso} x={6.3} y={6.2} w={0.32} d={2.8} h={0.95} color="#8C1527" />
      <Box iso={iso} x={5.7} y={6.0} w={0.9} d={0.22} h={0.68} color="#8C1527" />
      <Box iso={iso} x={5.7} y={9.0} w={0.9} d={0.22} h={0.68} color="#8C1527" />
    </g>
  ) },
  { k: 1.8 + 9.0, el: <Planter key="pl" iso={iso} x={1.75} y={9.0} size={1.0} /> },
  // front + right stub walls (section cut)
  { k: 5.7 + 9.6, el: <Box key="sf" iso={iso} x={H.x0 - 0.25} y={H.y1} w={H.x1 - H.x0 + 0.5} d={0.22} h={0.45} color="#EDEAE4" top="#3F3F46" /> },
  { k: 10.3 + 5.4, el: <Box key="sr" iso={iso} x={H.x1} y={H.y0 - 0.25} w={0.25} d={H.y1 - H.y0 + 0.25} h={0.45} color="#EDEAE4" top="#3F3F46" /> },
  // garden
  { k: 11.3 + 11.0, el: <Tree key="tr" iso={iso} x={11.2} y={11.0} size={0.85} /> },
  { k: 3 + 11.2, el: <Bush key="b1" iso={iso} x={3.0} y={11.0} size={0.85} /> },
  { k: 6.5 + 11.1, el: <Bush key="b2" iso={iso} x={6.5} y={11.0} size={0.75} /> },
  { k: 11.3 + 3.0, el: <Bush key="b3" iso={iso} x={11.2} y={3.0} size={0.85} /> },
  { k: 11.1 + 6.5, el: <Bush key="b4" iso={iso} x={11.1} y={6.0} size={0.7} /> },
];

const C4_POS = { x: 452, y: 30 };

export default function AlarmIsometricScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 9.2 });
  const initial = debugParam('isoState') || '';
  const [armed, setArmed] = useState(!initial.includes('disarmed'));
  const [off, setOff] = useState(0);
  const [panicAt, setPanicAt] = useState(null);

  const lt = (((t - off) % CYCLE) + CYCLE) % CYCLE;

  /* ---------- intruder timeline (armed only) ---------- */
  const doorOpen = armed ? easeInOut(seg(lt, 5.4, 6.2)) * (1 - easeInOut(seg(lt, 15.5, 16.5))) : 0;
  let intr = null;
  let intrPose = 'walk';
  let intrMoving = false;
  let intrPhase = 0;
  let intrOpacity = 0;
  const walkIn = [6.0, 9.6];
  const flee = [10.6, 13.2];
  if (armed && lt > walkIn[0] && lt < flee[1] + 0.4) {
    if (lt < walkIn[1]) {
      const d = seg(lt, walkIn[0], walkIn[1]) * INTR_IN.length;
      intr = INTR_IN.at(d);
      intrMoving = true;
      intrPhase = d * 4.4;
    } else if (lt < flee[0]) {
      intr = { ...INTR_IN.at(INTR_IN.length), angle: Math.PI * 0.75 + Math.sin(lt * 5) * 0.6 };
      intrPose = 'recoil';
    } else {
      const d = INTR_IN.length * (1 - seg(lt, flee[0], flee[1]));
      const p = INTR_IN.at(d);
      intr = { ...p, angle: p.angle + Math.PI };
      intrPose = 'run';
      intrMoving = true;
      intrPhase = d * 3.4;
    }
    intrOpacity = Math.min(seg(lt, walkIn[0], walkIn[0] + 0.5), 1 - seg(lt, flee[1] - 0.3, flee[1] + 0.3));
  }
  const pirHitT = walkIn[0] + (PIR_HIT_D / INTR_IN.length) * (walkIn[1] - walkIn[0]);
  const contact = armed && lt > 5.5 && lt < 16.4;
  const entryDelay = armed && lt > 5.5 && lt < pirHitT;
  const pt = panicAt == null ? -1 : t - panicAt;
  const panic = pt >= 0 && pt < 7;
  const alarm = (armed && lt >= pirHitT && lt < 16) || panic;
  const reported = (armed && lt >= pirHitT + 1.6 && lt < 16) || (panic && pt > 1.4);
  const patrol = (armed && lt >= pirHitT + 3.6 && lt < 16) || (panic && pt > 3.5);

  /* ---------- resident (disarmed) ---------- */
  const resK = ((t * 0.055) % 1);
  const res = RESIDENT.atU(resK);

  /* ---------- sorted scene ---------- */
  const items = [...FURNITURE];
  // door leaf (swings into the kitchen)
  const ang = doorOpen * 1.35;
  const leafW = DOOR.x1 - DOOR.x0;
  const hx = DOOR.x0;
  const hy = H.y0 + 0.02;
  const ex = hx + Math.cos(ang) * leafW;
  const ey = hy + Math.sin(ang) * leafW;
  items.push({
    k: (hx + ex) / 2 + (hy + ey) / 2 - 0.3,
    el: (
      <g key="door">
        <polygon points={iso.pts([[hx, hy, 0], [ex, ey, 0], [ex, ey, 2.2], [hx, hy, 2.2]])} fill="#8C6A4A" stroke="#6E5238" strokeWidth="0.6" />
        <circle cx={iso.p(ex - Math.cos(ang) * 0.12, ey - Math.sin(ang) * 0.12 + 0.02, 1.05)[0]} cy={iso.p(ex - Math.cos(ang) * 0.12, ey - Math.sin(ang) * 0.12 + 0.02, 1.05)[1]} r="1.3" fill="#E5E7EB" />
      </g>
    ),
  });
  if (intr && intrOpacity > 0) {
    items.push({
      k: intr.x + intr.y,
      el: <Person key="intr" iso={iso} x={intr.x} y={intr.y} heading={intr.angle} moving={intrMoving} phase={intrPhase} pose={intrPose} shirt="#111827" pants="#0B0F17" hair="#0B0F17" cap="#1F2937" opacity={intrOpacity} />,
    });
  }
  if (!armed) {
    items.push({
      k: res.x + res.y,
      el: <Person key="res" iso={iso} x={res.x} y={res.y} heading={res.angle} moving phase={resK * RESIDENT.length * 4.4} shirt="#F59E0B" pants="#334155" hair="#3B2A20" skin="#E0B394" />,
    });
  }
  items.sort((a, b) => a.k - b.k);

  /* ---------- PIR detection fan ---------- */
  const pirColor = alarm ? '#EF4444' : !armed ? '#F59E0B' : '#38BDF8';
  const arcs = [];
  for (let i = 0; i < 6; i++) {
    const r = 1.2 + i * 1.25;
    const pts = [];
    for (let a = 0.02; a <= Math.PI / 2 - 0.02; a += 0.08) pts.push([PIR.x + Math.cos(a) * r, PIR.y + Math.sin(a) * r * 0.85, 0.05]);
    const wave = clamp(1 - Math.abs(((t * (alarm ? 2.6 : 1.1)) % 1) * 6 - i));
    arcs.push(<polyline key={i} points={iso.pts(pts)} fill="none" stroke={pirColor} strokeWidth={1 + wave * 1.2} strokeDasharray="4 3" opacity={0.18 + wave * 0.6} />);
  }
  const [psx, psy] = iso.p(PIR.x, PIR.y, PIR.z);

  /* siren strobe */
  const [ssx, ssy] = iso.p(7.3, H.y0 - 0.12, WALL + 0.22);
  const strobeOn = alarm && Math.floor(t * 7) % 2 === 0;
  const [kx, ky] = iso.p(H.x0 + 0.02, (KEYPAD.y0 + KEYPAD.y1) / 2, (KEYPAD.z0 + KEYPAD.z1) / 2);
  const [cx, cy] = iso.p(DOOR.x1 + 0.06, H.y0 + 0.03, 2.28);

  /* signal path keypad → C4 */
  const c4x = C4_POS.x + 8;
  const c4y = C4_POS.y + 22;
  const ctrlX = (kx + c4x) / 2 - 40;
  const ctrlY = Math.min(ky, c4y) - 70;
  const qb = (k) => [
    (1 - k) * (1 - k) * kx + 2 * (1 - k) * k * ctrlX + k * k * c4x,
    (1 - k) * (1 - k) * ky + 2 * (1 - k) * k * ctrlY + k * k * c4y,
  ];

  const intrRect = intr ? personRect(iso, intr.x, intr.y) : null;
  const countdown = Math.max(0, Math.ceil(10 - (lt - 5.5) * 3));

  const status = panic ? 'PÁNICO · C4 NOTIFICADO' : alarm ? 'ALARMA DE ROBO · Z4' : entryDelay ? `RETARDO DE ENTRADA ${countdown}s` : armed ? 'ARMADO TOTAL · 8 ZONAS' : 'DESARMADO · MODO HOGAR';

  const events = [];
  if (armed) {
    if (lt > 5.5) events.push({ txt: 'Z3 · CONTACTO PUERTA TRASERA', c: '#FBBF24' });
    if (lt >= pirHitT && lt < 16) events.push({ txt: 'Z4 · PIR SALA · DISPARO', c: '#F87171' });
    if (reported) events.push({ txt: 'REPORTE C4 · 4G + IP · 1.8s', c: '#38BDF8' });
    if (patrol) events.push({ txt: 'PATRULLA ASIGNADA · ETA 6 MIN', c: '#34D399' });
    if (lt >= 16) events.push({ txt: 'EVENTO CERRADO · VERIFICADO', c: '#34D399' });
  } else {
    events.push({ txt: 'Z4 · MOVIMIENTO (SOLO REGISTRO)', c: '#FBBF24' });
  }
  if (panic) events.push({ txt: 'BOTÓN DE PÁNICO · LLAVERO', c: '#F87171' });
  const log = events.slice(-3).reverse();

  return (
    <div className="iso-scene-wrap" ref={wrapRef}>
      <svg className="iso-svg-canvas iso-svg-canvas--wide" viewBox="0 0 600 440" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animación isométrica de sistema de alarma con monitoreo C4">
        <IsoDefs />
        <defs>
          <clipPath id="alarm-living-clip"><polygon points={LIVING_CLIP} /></clipPath>
        </defs>
        <House />

        {/* devices on walls */}
        <g>
          {/* PIR sensor */}
          <path d={`M ${psx - 5} ${psy - 3} h 10 v 4 a 5 5 0 0 1 -10 0 z`} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.6" />
          <circle cx={psx} cy={psy + 2} r="1.4" fill={pirColor} filter="url(#iso-glow)" opacity={alarm || Math.floor(t * 2) % 2 ? 1 : 0.35} />
          {/* keypad */}
          <polygon points={faceX(iso, H.x0 + 0.015, KEYPAD.y0, KEYPAD.y1, KEYPAD.z0, KEYPAD.z1)} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
          <polygon points={faceX(iso, H.x0 + 0.02, KEYPAD.y0 + 0.05, KEYPAD.y1 - 0.05, KEYPAD.z1 - 0.2, KEYPAD.z1 - 0.05)} fill={alarm ? '#DC2626' : entryDelay ? '#F59E0B' : armed ? '#16A34A' : '#64748B'} />
          {/* door contact */}
          <rect x={cx - 3} y={cy - 2} width="6" height="2.4" rx="0.6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.4" />
          <circle cx={cx + 3.8} cy={cy - 0.8} r="1.2" fill={contact ? '#F59E0B' : '#22C55E'} filter="url(#iso-glow)" />
        </g>

        {/* PIR fan on living floor */}
        <g clipPath="url(#alarm-living-clip)">{arcs}</g>
        <line x1={psx} y1={psy + 2} x2={iso.p(PIR.x + 7.4, PIR.y, 0)[0]} y2={iso.p(PIR.x + 7.4, PIR.y, 0)[1]} stroke={pirColor} strokeOpacity="0.18" />
        <line x1={psx} y1={psy + 2} x2={iso.p(PIR.x, PIR.y + 4.2, 0)[0]} y2={iso.p(PIR.x, PIR.y + 4.2, 0)[1]} stroke={pirColor} strokeOpacity="0.18" />

        {/* red wash on floor during alarm */}
        {alarm && <polygon points={flat(iso, H.x0, H.y0, H.x1, H.y1, 0.05)} fill="#EF4444" opacity={0.08 + 0.08 * Math.sin(t * 14)} />}

        {items.map((i) => i.el)}

        {/* siren + strobe on wall head */}
        <g>
          <Box iso={iso} x={7.0} y={H.y0 - 0.32} w={0.6} d={0.32} h={0.45} z={WALL} color="#F8FAFC" />
          <polygon points={faceY(iso, H.y0 + 0.001, 7.08, 7.52, WALL + 0.12, WALL + 0.34)} fill={strobeOn ? '#FF3B3B' : '#991B1B'} />
          {alarm && (
            <g>
              {strobeOn && <circle cx={ssx} cy={ssy} r="34" fill="url(#iso-red-pool)" />}
              <AirRing cx={ssx} cy={ssy} t={t} period={1.1} maxR={46} color="#EF4444" />
              <AirRing cx={ssx} cy={ssy} t={t} period={1.1} maxR={46} color="#EF4444" delay={0.55} />
            </g>
          )}
        </g>

        {/* detection overlay */}
        {intr && intrOpacity > 0.3 && lt > pirHitT - 0.2 && (
          <DetectBox x={intrRect.x} y={intrRect.y} w={intrRect.w} h={intrRect.h} color="#F87171" label="Z4 · PIR + MICROONDAS" opacity={intrOpacity} />
        )}

        {/* uplink to C4 */}
        {(alarm || reported) && (
          <g>
            <path d={`M ${kx} ${ky} Q ${ctrlX} ${ctrlY} ${c4x} ${c4y}`} stroke="#EF4444" strokeWidth="1" strokeDasharray="3 4" opacity="0.55" />
            {[0, 0.25, 0.5, 0.75].map((o) => {
              const [px, py] = qb((t * 0.9 + o) % 1);
              return <circle key={o} cx={px} cy={py} r="2.2" fill="#FCA5A5" filter="url(#iso-glow)" />;
            })}
          </g>
        )}

        {/* C4 central badge */}
        <g transform={`translate(${C4_POS.x},${C4_POS.y})`}>
          <rect width="128" height="44" rx="8" fill="rgba(29,30,27,0.92)" stroke={alarm ? '#EF4444' : '#2B5672'} strokeWidth={alarm ? 1.6 : 1} />
          <g transform="translate(10,9)">
            <path d="M 8 26 L 12 4 L 16 26 M 9.5 18 h 5 M 10.5 11 h 3" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />
            <AirRing cx={12} cy={4} t={t} period={1.6} maxR={8} color={alarm ? '#F87171' : '#38BDF8'} width={1} />
          </g>
          <text x="34" y="17" fontSize="7.5" fontWeight="800" fill="#FFFFFF" fontFamily={MONO}>CENTRAL C4</text>
          <text x="34" y="28" fontSize="6" fill={alarm ? '#FCA5A5' : '#94A3B8'} fontFamily={MONO}>
            {patrol ? 'PATRULLA EN CAMINO' : reported ? 'EVENTO RECIBIDO' : alarm ? 'RECIBIENDO…' : 'MONITOREO 24/7'}
          </text>
          <text x="34" y="37" fontSize="5.4" fill="#64748B" fontFamily={MONO}>CTA #4471 · 4G/IP OK</text>
        </g>

        {/* keypad label */}
        <g transform={planeX(iso, H.x0 + 0.03, KEYPAD.y1 + 0.02, KEYPAD.z0 - 0.15)} opacity="0.8">
          <text x="0" y="0" fontSize="4.6" fontWeight="700" fill="#475569" fontFamily={MONO}>PANEL</text>
        </g>

        {alarm && <rect x="-400" y="-400" width="1400" height="1240" fill="#DC2626" opacity={strobeOn ? 0.07 : 0.02} style={{ mixBlendMode: 'multiply' }} />}
      </svg>

      <div className={`iso-hud-overlay ${alarm ? 'is-alert' : ''}`}>
        <div className="iso-hud-status-row">
          <span className="iso-hud-dot iso-hud-dot--rec" style={{ backgroundColor: alarm ? '#EF4444' : entryDelay ? '#F59E0B' : armed ? '#22C55E' : '#94A3B8' }} />
          <strong>{status}</strong>
          <span className="iso-hud-clock">{cctvClock(t, 2 * 3600 + 14 * 60)}</span>
        </div>
        <div className="iso-hud-meta">
          <span>PANEL DSC NEO</span>
          <span>4G + IP DUAL PATH</span>
          <span>BATERÍA 24h</span>
        </div>
        <ul className="iso-event-log">
          {log.map((e) => <li key={e.txt}><i style={{ background: e.c }} />{e.txt}</li>)}
        </ul>
      </div>

      <div className="iso-controls-bar">
        <button
          type="button"
          className="iso-btn iso-btn--primary"
          onClick={() => {
            setArmed(true);
            setOff(t - 4.6);
          }}
        >
          <AlertOctagon size={13} /><span>Simular intrusión</span>
        </button>
        <button type="button" className={`iso-btn ${armed ? 'is-on' : ''}`} onClick={() => setArmed((v) => !v)} aria-pressed={armed}>
          {armed ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}<span>{armed ? 'Armado' : 'Desarmado'}</span>
        </button>
        <button type="button" className={`iso-btn ${panic ? 'is-on is-amber' : ''}`} onClick={() => setPanicAt(panic ? null : t)}>
          <Siren size={13} /><span>Pánico</span>
        </button>
      </div>
    </div>
  );
}
