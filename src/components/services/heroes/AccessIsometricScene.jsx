import React, { useRef, useState } from 'react';
import { UserX, CreditCard, Flame } from 'lucide-react';
import { createIso, makePath, seg, lerp, easeInOut, clamp, cctvClock, debugParam, useSceneClock } from './iso/engine';
import { IsoDefs, Box, Person, Planter, DetectBox, faceY, faceX, flat, planeY, planeX, personRect, MONO } from './iso/primitives';
import './IsometricHeroes.css';

/* ==========================================================================
   ACCESS CONTROL · Corporate lobby with 3 optical speed-gate lanes
   Each lane loops (9s): person approaches → face / card verification →
   glass wings retract → walks to the elevators (doors open on arrival).
   ========================================================================== */

const iso = createIso({ ox: 296, oy: 90, s: 24 });
const G = 12;
const WALL_H = 3.4;
const CYCLE = 9;
const CAB_X = [3.4, 5.4, 7.4, 9.4];
const CAB_W = 0.5;
const CAB_Y0 = 5.6;
const CAB_Y1 = 7.6;
const WING_Y = 6.6;
const LANES = [0, 1, 2].map((i) => ({ i, x: CAB_X[i] + CAB_W + 0.75, off: i * 3.05 + 0.4 }));
const STOP_Y = 8.15;
const ELEV = [{ x0: 7.4, x1: 8.6 }, { x0: 9.3, x1: 10.5 }];

const LOOKS = [
  { shirt: '#2B5672', pants: '#1F2937', hair: '#231F20', skin: '#D9A98A', name: 'ING. C. MENA' },
  { shirt: '#F8FAFC', pants: '#334155', hair: '#6B4226', skin: '#E8C2A6', name: 'L. ROBLES' },
  { shirt: '#A6192E', pants: '#1E293B', hair: '#1A1A1A', skin: '#B9805E', name: 'A. FUENTES' },
  { shirt: '#475569', pants: '#0F172A', hair: '#2E2A27', skin: '#C99474', name: 'M. ORTIZ' },
  { shirt: '#0F766E', pants: '#1F2937', hair: '#3D2B1F', skin: '#E3B796', name: 'R. SALAS' },
  { shirt: '#D6D3D1', pants: '#3F3F46', hair: '#141414', skin: '#A86F4F', name: 'D. VEGA' },
  { shirt: '#1E3A5F', pants: '#27272A', hair: '#5A3A22', skin: '#DDB08F', name: 'P. NAVA' },
];

const entryPath = (lane) => makePath([[lane.x + 0.35, 12.9], [lane.x, 10.6], [lane.x, STOP_Y]], 1.2);
const exitPath = (lane, elev) => {
  const ex = (ELEV[elev].x0 + ELEV[elev].x1) / 2;
  return makePath([[lane.x, STOP_Y], [lane.x, 3.6], [ex, 1.6], [ex, 0.7]], 1.4);
};
const backPath = (lane) => makePath([[lane.x, STOP_Y], [lane.x + 0.5, 10.4], [lane.x + 1.1, 12.9]], 1.0);
const PATHS = LANES.map((l) => ({ entry: entryPath(l), exit: [exitPath(l, 0), exitPath(l, 1)], back: backPath(l) }));

/* ---------- static room ---------- */
const Room = React.memo(function Room() {
  const tiles = [];
  for (let x = 0; x < G; x++) {
    for (let y = 0; y < G; y++) {
      if ((x + y) % 2 === 0) tiles.push(<polygon key={`${x}-${y}`} points={flat(iso, x, y, x + 1, y + 1)} fill="#ECE8E1" />);
    }
  }
  const mullions = [];
  for (let y = 3.5; y <= 11.5; y += 1) mullions.push(<polygon key={y} points={faceX(iso, 0.012, y, y + 0.06, 0.1, 3.1)} fill="#E2E8F0" />);
  return (
    <g>
      {/* slab */}
      <polygon points={faceY(iso, G, 0, G, -0.6, 0)} fill="#BDB6AA" />
      <polygon points={faceX(iso, G, 0, G, -0.6, 0)} fill="#9F988C" />
      <polygon points={flat(iso, 0, 0, G, G)} fill="#F5F3EF" />
      {tiles}
      {/* soft floor reflection under walls */}
      <polygon points={flat(iso, 0, 0, G, 1.4)} fill="#FFFFFF" opacity="0.35" />
      {/* entrance mat */}
      <polygon points={flat(iso, 3.2, 10.4, 10.2, 11.8)} fill="#3F4652" />
      <polygon points={flat(iso, 3.35, 10.55, 10.05, 11.65)} fill="none" stroke="#596170" strokeWidth="1" />
      {/* lane guidance */}
      {LANES.map((l) => (
        <g key={l.i}>
          <polygon points={flat(iso, l.x - 0.55, 7.75, l.x + 0.55, 9.9)} fill="#2B5672" opacity="0.08" />
          <polygon points={iso.pts([[l.x - 0.25, 9.3, 0], [l.x + 0.25, 9.3, 0], [l.x, 8.8, 0]])} fill="#2B5672" opacity="0.35" />
        </g>
      ))}

      {/* left glass curtain wall */}
      <Box iso={iso} x={-0.35} y={0} w={0.35} d={G} h={WALL_H} color="#E7E3DC" right="#F3F1ED" />
      <polygon points={faceX(iso, 0.01, 3.4, 11.6, 0.08, 3.12)} fill="url(#iso-glass)" />
      <polygon points={faceX(iso, 0.011, 3.4, 11.6, 0.08, 1.2)} fill="#9DBF9B" opacity="0.35" />
      {mullions}
      <polygon points={faceX(iso, 0.012, 3.4, 11.6, 2.25, 2.3)} fill="#E2E8F0" />

      {/* back wall */}
      <Box iso={iso} x={-0.35} y={-0.35} w={G + 0.35} d={0.35} h={WALL_H} color="#EEEBE5" left="#F4F2EE" />
      {/* wood feature panel */}
      <polygon points={faceY(iso, 0.01, 0.6, 6.6, 0, WALL_H)} fill="#B88B5E" />
      {Array.from({ length: 16 }, (_, i) => (
        <polygon key={i} points={faceY(iso, 0.012, 0.75 + i * 0.37, 0.79 + i * 0.37, 0, WALL_H)} fill="#9C7149" />
      ))}
      {/* brand */}
      <g transform={planeY(iso, 3.6, 0.02, 2.55)}>
        <rect x="-6" y="-10" width="96" height="16" rx="2" fill="#1D1E1B" opacity="0.9" />
        <text x="0" y="1.5" fontSize="9" fontWeight="800" letterSpacing="2.6" fill="#FFFFFF" fontFamily="Inter, system-ui, sans-serif">CUAUHTLI</text>
        <rect x="70" y="-6.5" width="13" height="9" rx="1.5" fill="#A6192E" />
      </g>
      {/* elevator frames */}
      {ELEV.map((e, i) => (
        <g key={i}>
          <polygon points={faceY(iso, 0.01, e.x0 - 0.12, e.x1 + 0.12, 0, 2.45)} fill="#CBD5E1" />
          <polygon points={faceY(iso, 0.012, e.x0, e.x1, 0, 2.3)} fill="#1E293B" />
          <g transform={planeY(iso, (e.x0 + e.x1) / 2 - 0.2, 0.015, 2.85)}>
            <rect x="-2" y="-7" width="16" height="9" rx="1.5" fill="#0F172A" />
            <text x="1" y="0" fontSize="6" fontWeight="700" fill="#F87171" fontFamily={MONO}>{i === 0 ? '▲3' : '▼1'}</text>
          </g>
        </g>
      ))}

      {/* reception desk */}
      <polygon points={flat(iso, 1.0, 1.3, 4.9, 2.9)} fill="#D9D4CC" opacity="0.5" />
    </g>
  );
});

const Reception = React.memo(function Reception() {
  return (
    <g>
      <Person iso={iso} x={2.9} y={1.05} heading={Math.PI / 2} shirt="#1D1E1B" pants="#1D1E1B" hair="#3B2A20" skin="#D2A07F" />
      <Box iso={iso} x={1.2} y={1.5} w={3.4} d={0.85} h={1.1} color="#F4F2EE" right="#DCD7CF" />
      <polygon points={faceY(iso, 2.351, 1.2, 4.6, 0.32, 0.44)} fill="#A6192E" />
      <Box iso={iso} x={1.2} y={1.45} w={3.4} d={0.95} h={0.06} z={1.1} color="#2B2D2A" />
      <Box iso={iso} x={2.2} y={1.6} w={0.6} d={0.08} h={0.42} z={1.16} color="#111827" left="#0F172A" />
      <polygon points={faceY(iso, 1.682, 2.25, 2.75, 1.2, 1.55)} fill="#2B5672" />
    </g>
  );
});

/* static props in depth list */
const STATIC_ITEMS = [
  { k: 0.8 + 11.0, el: <Planter key="p1" iso={iso} x={0.8} y={11.0} size={1.25} /> },
  { k: 11.2 + 1.0, el: <Planter key="p2" iso={iso} x={11.2} y={0.9} size={1.25} /> },
  { k: 0.8 + 4.0, el: <Planter key="p3" iso={iso} x={0.8} y={4.0} size={1.0} /> },
  {
    k: 11.0 + 9.6,
    el: (
      <g key="sofa">
        <Box iso={iso} x={10.4} y={8.4} w={1.0} d={2.4} h={0.45} color="#2B5672" />
        <Box iso={iso} x={11.15} y={8.4} w={0.3} d={2.4} h={0.95} color="#24495F" />
        <Box iso={iso} x={9.3} y={9.0} w={0.7} d={1.0} h={0.42} color="#E7E3DC" />
      </g>
    ),
  },
  { k: 11.0 + 6.5, el: <Person key="guard" iso={iso} x={11.1} y={6.3} heading={Math.PI} shirt="#111827" pants="#111827" hair="#1A1A1A" cap="#111827" skin="#B07A58" /> },
];

/* ---------- lane state machine ---------- */
function laneState(lane, t, deny) {
  const g = t + lane.off;
  const idx = Math.floor(g / CYCLE);
  const u = g - idx * CYCLE;
  const look = LOOKS[(idx * 3 + lane.i * 2) % LOOKS.length];
  const denied = deny && deny.lane === lane.i && deny.idx === idx;
  const P = PATHS[lane.i];
  let pos;
  let moving = false;
  let phase = 0;
  let opacity = 1;
  let status = 'idle';
  let open = 0;
  if (u < 3) {
    const d = (u / 3) * P.entry.length;
    pos = P.entry.at(d);
    moving = true;
    phase = d * 4.3;
    opacity = seg(u, 0, 0.5);
  } else if (u < 4.1 || (denied && u < 4.9)) {
    pos = { x: lane.x, y: STOP_Y, angle: -Math.PI / 2 };
    status = u < 3.7 ? 'scan' : denied ? 'denied' : 'granted';
  } else if (!denied) {
    const k = clamp((u - 4.1) / 3.9);
    const path = P.exit[idx % 2];
    const d = k * path.length;
    pos = path.at(d);
    moving = k < 1;
    phase = d * 4.3;
    opacity = 1 - seg(u, 7.6, 8.1);
    status = u < 4.8 ? 'granted' : 'idle';
  } else {
    const k = clamp((u - 4.9) / 3.0);
    const d = k * P.back.length;
    const p = P.back.at(d);
    pos = p;
    moving = k < 1;
    phase = d * 4.3;
    opacity = 1 - seg(u, 7.4, 7.9);
    status = u < 6 ? 'denied' : 'idle';
  }
  if (!denied) open = easeInOut(seg(u, 3.75, 4.15)) * (1 - easeInOut(seg(u, 6.0, 6.5)));
  return { idx, u, look, denied, pos, moving, phase, opacity, status, open, elev: idx % 2 };
}

const LED = { idle: '#38BDF8', scan: '#FBBF24', granted: '#22C55E', denied: '#EF4444' };

export default function AccessIsometricScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 3.9 });
  const cardMode = false;
  const deny = null;
  const evac = false;

  const lanes = LANES.map((l) => laneState(l, t, deny));

  /* elevator doors open when someone arrives */
  const elevOpen = ELEV.map((_, e) =>
    Math.max(0, ...lanes.map((s) => (s.elev === e && !s.denied ? easeInOut(seg(s.u, 6.6, 7.2)) * (1 - easeInOut(seg(s.u, 8.2, 8.9))) : 0)))
  );

  const items = [...STATIC_ITEMS];

  /* cabinets with LED strips + terminals */
  CAB_X.forEach((cx, ci) => {
    const leftLane = lanes[ci - 1];
    const rightLane = lanes[ci];
    const ledR = evac ? (Math.floor(t * 3) % 2 ? '#22C55E' : '#065F46') : rightLane ? LED[rightLane.status] : '#94A3B8';
    const ledL = evac ? ledR : leftLane ? LED[leftLane.status] : '#94A3B8';
    items.push({
      k: cx + CAB_W / 2 + (CAB_Y0 + CAB_Y1) / 2,
      el: (
        <g key={`cab${ci}`}>
          <Box iso={iso} x={cx} y={CAB_Y0} w={CAB_W} d={CAB_Y1 - CAB_Y0} h={1.05} color="#E5E7EB" left="#F1F5F9" right="#CBD5E1" />
          <Box iso={iso} x={cx} y={CAB_Y0} w={CAB_W} d={CAB_Y1 - CAB_Y0} h={0.05} z={1.05} color="#1F2937" top="#334155" />
          {/* LED strips on top edges */}
          <line x1={iso.p(cx + CAB_W, CAB_Y0, 1.1)[0]} y1={iso.p(cx + CAB_W, CAB_Y0, 1.1)[1]} x2={iso.p(cx + CAB_W, CAB_Y1, 1.1)[0]} y2={iso.p(cx + CAB_W, CAB_Y1, 1.1)[1]} stroke={ledR} strokeWidth="1.6" filter="url(#iso-glow)" />
          <line x1={iso.p(cx, CAB_Y0, 1.1)[0]} y1={iso.p(cx, CAB_Y0, 1.1)[1]} x2={iso.p(cx, CAB_Y1, 1.1)[0]} y2={iso.p(cx, CAB_Y1, 1.1)[1]} stroke={ledL} strokeWidth="1.2" opacity="0.7" />
          {/* front pictogram */}
          <polygon points={faceY(iso, CAB_Y1 + 0.01, cx + 0.1, cx + 0.4, 0.62, 0.86)} fill="#0F172A" />
          <circle cx={iso.p(cx + 0.25, CAB_Y1 + 0.02, 0.74)[0]} cy={iso.p(cx + 0.25, CAB_Y1 + 0.02, 0.74)[1]} r="1.6" fill={ledR} filter="url(#iso-glow)" />
          {/* face terminal on gooseneck (serves the lane on the right) */}
          {rightLane && (() => {
            const tx = cx + CAB_W / 2;
            const ty = CAB_Y1 - 0.15;
            const [p0x, p0y] = iso.p(tx, ty, 1.1);
            const [p1x, p1y] = iso.p(tx, ty, 1.42);
            const st = rightLane.status;
            const scanY = 1.48 + ((t * 1.6) % 1) * 0.36;
            return (
              <g>
                <line x1={p0x} y1={p0y} x2={p1x} y2={p1y} stroke="#475569" strokeWidth="1.8" />
                <polygon points={faceY(iso, ty + 0.05, tx - 0.2, tx + 0.2, 1.4, 1.9)} fill="#111827" stroke="#334155" strokeWidth="0.5" />
                <polygon points={faceX(iso, tx + 0.2, ty, ty + 0.05, 1.4, 1.9)} fill="#0B0F17" />
                <polygon points={faceY(iso, ty + 0.06, tx - 0.17, tx + 0.17, 1.44, 1.86)} fill={st === 'granted' ? '#064E3B' : st === 'denied' ? '#450A0A' : '#0F2A3D'} />
                {st === 'scan' && !cardMode && (
                  <polygon points={faceY(iso, ty + 0.065, tx - 0.17, tx + 0.17, scanY, scanY + 0.02)} fill="#38BDF8" filter="url(#iso-glow)" />
                )}
                <g transform={planeY(iso, tx - 0.1, ty + 0.07, 1.6)}>
                  {cardMode ? (
                    <rect x="0" y="-5" width="7" height="5" rx="1" fill="none" stroke={LED[st]} strokeWidth="0.8" />
                  ) : (
                    <ellipse cx="3.6" cy="-3" rx="2.4" ry="3" fill="none" stroke={LED[st]} strokeWidth="0.8" />
                  )}
                </g>
              </g>
            );
          })()}
        </g>
      ),
    });
  });

  /* wings */
  lanes.forEach((s, i) => {
    const open = evac ? 1 : s.open;
    const xL = CAB_X[i] + CAB_W;
    const xR = CAB_X[i + 1];
    const ext = 0.7 * (1 - open) + 0.04;
    const edge = evac ? '#22C55E' : LED[s.status];
    items.push({
      k: LANES[i].x + WING_Y + 0.02,
      el: (
        <g key={`wing${i}`}>
          <polygon points={faceY(iso, WING_Y, xL, xL + ext, 0.28, 1.28)} fill="url(#iso-glass-clear)" stroke="#BAE6FD" strokeWidth="0.6" />
          <polygon points={faceY(iso, WING_Y, xR - ext, xR, 0.28, 1.28)} fill="url(#iso-glass-clear)" stroke="#BAE6FD" strokeWidth="0.6" />
          <line x1={iso.p(xL + ext, WING_Y, 0.3)[0]} y1={iso.p(xL + ext, WING_Y, 0.3)[1]} x2={iso.p(xL + ext, WING_Y, 1.26)[0]} y2={iso.p(xL + ext, WING_Y, 1.26)[1]} stroke={edge} strokeWidth="1.2" opacity="0.9" />
          <line x1={iso.p(xR - ext, WING_Y, 0.3)[0]} y1={iso.p(xR - ext, WING_Y, 0.3)[1]} x2={iso.p(xR - ext, WING_Y, 1.26)[0]} y2={iso.p(xR - ext, WING_Y, 1.26)[1]} stroke={edge} strokeWidth="1.2" opacity="0.9" />
        </g>
      ),
    });
  });

  /* people */
  lanes.forEach((s, i) => {
    if (s.opacity <= 0 || s.u > 8.3) return;
    const pressing = cardMode && s.status === 'scan';
    items.push({
      k: s.pos.x + s.pos.y,
      el: (
        <Person
          key={`p${i}`}
          iso={iso}
          x={s.pos.x}
          y={s.pos.y}
          heading={s.pos.angle}
          moving={s.moving}
          phase={s.phase}
          pose={pressing ? 'press' : 'walk'}
          {...s.look}
          opacity={s.opacity}
        />
      ),
    });
  });
  items.sort((a, b) => a.k - b.k);

  /* recognition cards */
  const cards = lanes
    .filter((s) => s.status === 'scan' || s.status === 'granted' || s.status === 'denied')
    .filter((s) => s.u >= 3 && s.u < (s.denied ? 5.6 : 4.9))
    .map((s) => {
      const r = personRect(iso, s.pos.x, s.pos.y);
      const c = s.status === 'scan' ? '#FBBF24' : LED[s.status];
      const label = s.status === 'scan' ? (cardMode ? 'LEYENDO MIFARE…' : 'ANALIZANDO ROSTRO…') : s.status === 'granted' ? `${s.look.name} · ${cardMode ? 'TARJETA OK' : '99.2%'}` : 'NO REGISTRADO';
      return { r, c, label, s };
    });

  const granted = LANES.reduce((acc, l) => {
    const g = t + l.off;
    return acc + Math.max(0, Math.floor((g - 3.7) / CYCLE) + 1);
  }, 0);
  const deniedNow = lanes.some((s) => s.status === 'denied');

  const log = [];
  LANES.forEach((l, i) => {
    const g = t + l.off;
    const idx = Math.floor((g - 3.7) / CYCLE);
    for (let k = idx; k > idx - 2 && k >= 0; k--) {
      const at = k * CYCLE + 3.7 - l.off;
      const look = LOOKS[(k * 3 + i * 2) % LOOKS.length];
      const den = deny && deny.lane === i && deny.idx === k;
      log.push({ at, txt: den ? `T${i + 1} · ROSTRO NO REGISTRADO` : `T${i + 1} · ${look.name} · ${cardMode ? 'RFID' : 'FACIAL 0.2s'}`, c: den ? '#F87171' : '#34D399' });
    }
  });
  log.sort((a, b) => b.at - a.at);

  return (
    <div className="iso-scene-wrap" ref={wrapRef}>
      <svg className="iso-svg-canvas iso-svg-canvas--wide" viewBox="0 0 600 440" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animación isométrica de control de acceso con torniquetes y reconocimiento facial">
        <IsoDefs />
        <Room />

        {/* elevator doors */}
        {ELEV.map((e, i) => {
          const o = elevOpen[i] * ((e.x1 - e.x0) / 2 - 0.05);
          const mid = (e.x0 + e.x1) / 2;
          return (
            <g key={i}>
              {elevOpen[i] > 0.02 && <polygon points={faceY(iso, 0.013, mid - o, mid + o, 0, 2.3)} fill="#FDE9C4" opacity={0.85} />}
              <polygon points={faceY(iso, 0.015, e.x0, mid - o, 0, 2.3)} fill="#B8C2CE" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points={faceY(iso, 0.015, mid + o, e.x1, 0, 2.3)} fill="#AEB8C4" stroke="#94A3B8" strokeWidth="0.5" />
            </g>
          );
        })}

        <Reception />
        {evac && <polygon points={flat(iso, 3.2, 5.2, 10.2, 8.0)} fill="#22C55E" opacity={0.1 + 0.08 * Math.sin(t * 6)} />}
        {items.map((i) => i.el)}

        {/* recognition overlays */}
        {cards.map(({ r, c, label, s }) => (
          <g key={s.idx + label}>
            <DetectBox x={r.x} y={r.y} w={r.w} h={r.h * 0.42} color={c} label={label} />
            {s.status === 'granted' && (
              <path d={`M ${r.x + r.w / 2 - 4} ${r.y + 8} l 3 3 l 6 -6`} stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </g>
        ))}

        {/* floor labels */}
        <g transform={planeX(iso, 12, 11.6, 0.02)} opacity="0" />
      </svg>

      <div className={`iso-hud-overlay ${deniedNow ? 'is-alert' : ''}`}>
        <div className="iso-hud-status-row">
          <span className="iso-hud-dot iso-hud-dot--rec" style={{ backgroundColor: evac ? '#22C55E' : deniedNow ? '#EF4444' : '#38BDF8' }} />
          <strong>{evac ? 'MODO EVACUACIÓN · LIBRE' : deniedNow ? 'ACCESO DENEGADO · T2' : 'LOBBY · 3 TORNIQUETES'}</strong>
          <span className="iso-hud-clock">{cctvClock(t)}</span>
        </div>
        <div className="iso-hud-meta">
          <span>ACCESOS HOY {1248 + granted}</span>
          <span>{cardMode ? 'MIFARE DESFire EV3' : 'FACIAL 3D LIVENESS'}</span>
        </div>
        <ul className="iso-event-log">
          {log.slice(0, 3).map((e) => (
            <li key={e.at + e.txt}><i style={{ background: e.c }} />{e.txt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
