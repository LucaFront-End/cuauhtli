import React, { useRef, useState } from 'react';
import { Moon, Thermometer, Zap } from 'lucide-react';
import {
  createIso, makePath, seg, lerp, easeInOut, clamp, cctvClock, rand, debugParam, useSceneClock,
} from './iso/engine';
import {
  IsoDefs, Box, OBox, Car, CarBeam, Person, Tree, Bush, Lamp, LampPool, DetectBox, GroundRing,
  faceY, faceX, flat, planeY, personRect, MONO,
} from './iso/primitives';
import './IsometricHeroes.css';

/* ==========================================================================
   CCTV · Corporate campus with PTZ tracking, LPR barrier and AI analytics
   Loop (20s): car arrives → plate read → barrier lifts → parks →
   driver walks to lobby. A pedestrian patrols the sidewalk constantly.
   ========================================================================== */

const iso = createIso({ ox: 286, oy: 78, s: 21 });
const CYCLE = 20;
const GX = 14;
const GY = 12.5;

const CAR_PATH = makePath([[1.3, -1.8], [1.3, 8.35], [9.6, 8.35], [9.6, 6.1]], 1.3);
const STOP_D = (() => {
  for (let d = 0; d < CAR_PATH.length; d += 0.02) if (CAR_PATH.at(d).x >= 2.7) return d;
  return CAR_PATH.length * 0.5;
})();
const DRIVER_PATH = makePath([[10.65, 6.5], [10.65, 4.4], [7.7, 4.4], [7.7, 3.7]], 0.5);
const PED_PATH = makePath([[14.4, 9.95], [2.8, 9.95], [2.8, 13.2]], 0.5);
const INTRUDER_PATH = makePath([[14.4, 9.2], [13.1, 7.0], [13.1, 1.6]], 0.9);
const ZONE_ENTER_D = (() => {
  for (let d = 0; d < INTRUDER_PATH.length; d += 0.02) if (INTRUDER_PATH.at(d).y < 5.5) return d;
  return 4;
})();

const PTZ = { x: 3.0, y: 10.1, h: 4.1 };

/* ---------- building facade data (shared by day + night layers) ---------- */
const FACADE_Y = 3.8;
const B = { x0: 3.6, x1: 12, y0: 0, y1: FACADE_Y, h: 4.3 };
const UPPER_WINDOWS = Array.from({ length: 11 }, (_, i) => B.x0 + 0.35 + i * 0.75).map((x0, i) => ({ x0, x1: x0 + 0.55, lit: rand(i + 3) > 0.28 }));
const LOWER_WINDOWS = [[3.95, 6.85], [8.55, 11.7]];
const END_WINDOWS = [0.4, 1.35, 2.3, 3.0].map((y0, i) => ({ y0, y1: y0 + 0.55, lit: rand(i + 21) > 0.35 }));

/* ---------- static ground layer ---------- */
const Ground = React.memo(function Ground() {
  const stripes = [];
  for (let y = -0.2; y < GY; y += 1.3) {
    stripes.push(<polygon key={`c${y}`} points={flat(iso, 1.25, y, 1.35, Math.min(y + 0.65, GY))} fill="#F8FAFC" opacity="0.85" />);
  }
  const slotLines = [3.9, 5.3, 6.7, 8.9, 10.3, 11.7].map((x) => (
    <polygon key={`s${x}`} points={flat(iso, x, 4.95, x + 0.07, 7.25)} fill="#F8FAFC" opacity="0.9" />
  ));
  const zebra = [];
  for (let y = 5.1; y < 9.3; y += 0.5) zebra.push(<polygon key={`z${y}`} points={flat(iso, 7.15, y, 8.25, y + 0.26)} fill="#F8FAFC" opacity="0.85" />);

  return (
    <g>
      {/* diorama slab */}
      <polygon points={faceY(iso, GY, 0, GX, -0.7, 0)} fill="#C9C4BB" />
      <polygon points={faceX(iso, GX, 0, GY, -0.7, 0)} fill="#A9A399" />
      <polygon points={faceY(iso, GY, 0, GX, -0.7, -0.45)} fill="#8E8A80" />
      <polygon points={faceX(iso, GX, 0, GY, -0.7, -0.45)} fill="#7B776E" />
      <polygon points={flat(iso, 0, 0, GX, GY)} fill="#DCD8D0" />

      {/* road (runs along y) */}
      <polygon points={flat(iso, 0, 0, 2.6, GY)} fill="#3E4652" />
      {stripes}
      <polygon points={flat(iso, 2.6, 0, 3.3, GY)} fill="#E7E4DE" />
      <polygon points={faceX(iso, 2.6, 0, GY, -0.01, 0.06)} fill="#B9B4AB" />

      {/* plaza in front of facade */}
      <polygon points={flat(iso, 3.3, FACADE_Y, 12.2, 4.9)} fill="#EDEAE4" />
      {Array.from({ length: 12 }, (_, i) => (
        <polygon key={`p${i}`} points={flat(iso, 3.3 + i * 0.75, FACADE_Y, 3.32 + i * 0.75, 4.9)} fill="#D6D1C8" />
      ))}

      {/* parking lot */}
      <polygon points={flat(iso, 3.3, 4.9, 12.2, 9.4)} fill="#4A515C" />
      <polygon points={flat(iso, 3.3, 7.25, 12.2, 9.4)} fill="#525A66" />
      {slotLines}
      {zebra}
      <polygon points={flat(iso, 4.6, 8.25, 6.0, 8.45)} fill="#F8FAFC" opacity="0.55" />
      <polygon points={flat(iso, 10, 8.25, 11.4, 8.45)} fill="#F8FAFC" opacity="0.55" />

      {/* loading dock / restricted zone base */}
      <polygon points={flat(iso, 12.2, 0, GX, 9.4)} fill="#C7C2B9" />
      <polygon points={flat(iso, 12.2, 0, GX, 5.5)} fill="url(#iso-hatch-red)" opacity="0.6" />

      {/* front sidewalk + lawn */}
      <polygon points={flat(iso, 3.3, 9.4, GX, 10.5)} fill="#E7E4DE" />
      <polygon points={faceY(iso, 9.4, 3.3, GX, -0.01, 0.06)} fill="#B9B4AB" />
      <polygon points={flat(iso, 3.3, 10.5, GX, GY)} fill="#8DB57C" />
      <polygon points={flat(iso, 3.3, 10.5, GX, 10.62)} fill="#7AA36A" />
    </g>
  );
});

/* ---------- static building ---------- */
const Building = React.memo(function Building() {
  const { x0, x1, y0, y1, h } = B;
  return (
    <g>
      <polygon points={iso.pts([[x0, y1, 0], [x1, y1, 0], [x1 + 0.6, y1 + 0.6, 0], [x0 + 0.6, y1 + 0.6, 0]])} fill="rgba(15,23,42,0.10)" filter="url(#iso-soft)" />
      <Box iso={iso} x={x0} y={y0} w={x1 - x0} d={y1 - y0} h={h} color="#F2F0EC" left="#F4F2EE" right="#D9D5CE" top="#E8E5DF" />

      {/* ground floor curtain wall */}
      {LOWER_WINDOWS.map(([a, b]) => (
        <g key={a}>
          <polygon points={faceY(iso, y1 + 0.01, a, b, 0.25, 1.9)} fill="url(#iso-glass)" />
          {Array.from({ length: Math.round((b - a) / 0.58) }, (_, i) => (
            <polygon key={i} points={faceY(iso, y1 + 0.012, a + i * 0.58, a + i * 0.58 + 0.04, 0.25, 1.9)} fill="#E5E7EB" />
          ))}
          <polygon points={faceY(iso, y1 + 0.012, a, b, 1.85, 1.92)} fill="#E5E7EB" />
        </g>
      ))}
      {/* entrance canopy */}
      <polygon points={iso.pts([[6.85, y1, 2.25], [8.55, y1, 2.25], [8.55, y1 + 0.75, 2.25], [6.85, y1 + 0.75, 2.25]])} fill="#2B5672" />
      <polygon points={faceY(iso, y1 + 0.75, 6.85, 8.55, 2.12, 2.25)} fill="#1F4058" />
      <polygon points={faceX(iso, 8.55, y1, y1 + 0.75, 2.12, 2.25)} fill="#183447" />

      {/* upper ribbon windows */}
      {UPPER_WINDOWS.map((w, i) => (
        <polygon key={i} points={faceY(iso, y1 + 0.01, w.x0, w.x1, 2.55, 3.6)} fill="url(#iso-glass)" />
      ))}
      <polygon points={faceY(iso, y1 + 0.01, x0, x1, 2.4, 2.47)} fill="#D6D1C8" />

      {/* brand parapet */}
      <polygon points={faceY(iso, y1 + 0.01, x0, x1, 3.92, h)} fill="#A6192E" />
      <polygon points={faceX(iso, x1 + 0.01, y0, y1, 3.92, h)} fill="#8C1527" />
      <g transform={planeY(iso, 4.0, y1 + 0.02, 4.0)}>
        <text x="0" y="0" fill="#FFFFFF" fontSize="6.4" fontWeight="800" letterSpacing="2.2" fontFamily="Inter, system-ui, sans-serif">CUAUHTLI · CORPORATIVO</text>
      </g>

      {/* end facade: windows + roll-up dock door */}
      {END_WINDOWS.map((w, i) => (
        <polygon key={i} points={faceX(iso, x1 + 0.01, w.y0, w.y1, 2.55, 3.6)} fill="url(#iso-glass)" />
      ))}
      <polygon points={faceX(iso, x1 + 0.01, 1.0, 3.0, 0, 2.0)} fill="#9AA3AE" />
      {Array.from({ length: 9 }, (_, i) => (
        <polygon key={i} points={faceX(iso, x1 + 0.012, 1.0, 3.0, 0.2 + i * 0.2, 0.23 + i * 0.2)} fill="#7B8591" />
      ))}

      {/* roof equipment */}
      <polygon points={flat(iso, x0 + 0.15, y0 + 0.15, x1 - 0.15, y1 - 0.15, h)} fill="#DCD8D0" />
      <Box iso={iso} x={5.0} y={0.8} w={1.4} d={1.0} h={0.55} z={h} color="#CBD5E1" />
      <Box iso={iso} x={6.9} y={0.9} w={0.9} d={0.9} h={0.4} z={h} color="#B8C2CE" />
      {[0, 1, 2].map((i) => (
        <OBox key={i} iso={iso} cx={9.2 + i * 0.85} cy={1.8} z={h} len={0.7} wid={1.6} h={0.18} yaw={0} color="#2B5672" top="#34617F" tlen={0.7} twid={1.6} />
      ))}
    </g>
  );
});

/* ---------- static sortable props (created once → React skips re-render) ---------- */
const STATIC_PROPS = [
  { k: 4.6 + 6.1, el: <Car key="c1" iso={iso} x={4.6} y={6.1} yaw={-Math.PI / 2} color="#F1F5F9" /> },
  { k: 6.0 + 6.1, el: <Car key="c2" iso={iso} x={6.0} y={6.1} yaw={-Math.PI / 2} color="#2B5672" /> },
  { k: 11.0 + 6.1, el: <Car key="c3" iso={iso} x={11.0} y={6.1} yaw={-Math.PI / 2} color="#3F4652" /> },
  { k: 6.4 + 11.9, el: <Tree key="t1" iso={iso} x={6.4} y={11.9} size={0.78} /> },
  { k: 10.6 + 11.8, el: <Tree key="t2" iso={iso} x={10.6} y={11.8} size={0.85} color="#4A8456" /> },
  { k: 13.4 + 11.6, el: <Tree key="t3" iso={iso} x={13.4} y={11.6} size={0.8} /> },
  { k: 4.4 + 11.6, el: <Bush key="b1" iso={iso} x={4.4} y={11.6} size={0.8} /> },
  { k: 8.5 + 11.7, el: <Bush key="b2" iso={iso} x={8.5} y={11.7} size={0.85} /> },
  { k: 12.2 + 11.5, el: <Bush key="b3" iso={iso} x={12.2} y={11.5} size={0.7} /> },
  { k: 13.4 + 0.6, el: <Box key="crate1" iso={iso} x={12.6} y={0.3} w={0.8} d={0.8} h={0.7} color="#B08A5B" /> },
  { k: 13.6 + 1.4, el: <Box key="crate2" iso={iso} x={12.7} y={1.25} w={0.7} d={0.7} h={0.55} color="#C29A68" /> },
];

const LAMPS = [[5.2, 9.55], [9.0, 9.55], [12.6, 9.55]];

const PLATE = 'NLV-842-C';

export default function CctvIsometricScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 8.4 });
  const night = false;
  const thermal = false;
  const yawRef = useRef({ t: -1, yaw: 0.6 });

  const lt = t % CYCLE;

  /* ---------- car timeline ---------- */
  const carDist = (k) => {
    if (k < 5) return STOP_D * (1 - Math.pow(1 - k / 5, 2));
    if (k < 7) return STOP_D;
    if (k < 10.5) return lerp(STOP_D, CAR_PATH.length, easeInOut(seg(k, 7, 10.5)));
    return CAR_PATH.length;
  };
  const cd = carDist(lt);
  const car = CAR_PATH.at(cd);
  const carSpeed = Math.max(0, (carDist(lt + 0.05) - cd) / 0.05) * 7.2;
  const carOpacity = Math.min(seg(lt, 0, 0.8), 1 - seg(lt, 19.2, 20));
  const braking = (lt > 3.6 && lt < 7.1) || (lt > 9.6 && lt < 11);
  const barrierUp = easeInOut(seg(lt, 5.9, 6.8)) * (1 - easeInOut(seg(lt, 9.2, 10.0)));
  const lprRead = seg(lt, 5.0, 6.2);

  /* ---------- driver timeline ---------- */
  const driverOn = lt > 11 && lt < 16.4;
  const drvD = clamp((lt - 11.3) / 4.5) * DRIVER_PATH.length;
  const drv = DRIVER_PATH.at(drvD);
  const drvOpacity = Math.min(seg(lt, 11, 11.4), 1 - seg(lt, 15.9, 16.4));
  const doorOpen = easeInOut(seg(lt, 14.9, 15.6)) * (1 - easeInOut(seg(lt, 16.6, 17.4)));

  /* ---------- pedestrian loop ---------- */
  const pedK = (t % 15) / 15;
  const ped = PED_PATH.atU(pedK);
  const pedOpacity = Math.min(seg(pedK, 0, 0.04), 1 - seg(pedK, 0.94, 1));

  /* ---------- tracking target ---------- */
  let target;
  if (lt < 11) target = car;
  else if (lt < 16.2) {
    const k = easeInOut(seg(lt, 11, 11.8));
    target = { x: lerp(car.x, drv.x, k), y: lerp(car.y, drv.y, k) };
  } else {
    target = ped;
  }
  const goalYaw = Math.atan2(target.y - PTZ.y, target.x - PTZ.x);
  if (yawRef.current.t !== t) {
    const dt = clamp(t - yawRef.current.t, 0, 0.1);
    let diff = goalYaw - yawRef.current.yaw;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    yawRef.current.yaw += diff * clamp(dt * 5.5, 0, 1);
    yawRef.current.t = t;
  }
  const yaw = yawRef.current.yaw;
  const tDist = clamp(Math.hypot(target.x - PTZ.x, target.y - PTZ.y), 2.5, 11);

  /* ---------- cone geometry ---------- */
  const half = 0.27;
  const r0 = Math.max(0.6, tDist - 2.4);
  const r1 = tDist + 2.2;
  const far = [];
  const near = [];
  for (let i = 0; i <= 10; i++) {
    const a = yaw - half + (i / 10) * half * 2;
    far.push([PTZ.x + Math.cos(a) * r1, PTZ.y + Math.sin(a) * r1, 0]);
    near.push([PTZ.x + Math.cos(a) * r0, PTZ.y + Math.sin(a) * r0, 0]);
  }
  const lens = [PTZ.x + Math.cos(yaw) * 0.38, PTZ.y + Math.sin(yaw) * 0.38, PTZ.h + 0.05];
  const coneColor = '#38BDF8';
  const [lsx, lsy] = iso.p(...lens);

  /* ---------- sortable dynamic scene ---------- */
  const items = [...STATIC_PROPS];
  LAMPS.forEach(([x, y], i) => items.push({ k: x + y, el: <Lamp key={`l${i}`} iso={iso} x={x} y={y} on={night} /> }));

  // barrier (pivot at curb, arm across lane)
  const armLen = 1.95;
  const ang = barrierUp * (Math.PI / 2.15);
  const armEnd = [4.1, 9.25 - Math.cos(ang) * armLen, 0.95 + Math.sin(ang) * armLen];
  items.push({
    k: 4.1 + 9.1,
    el: (
      <g key="barrier">
        <Box iso={iso} x={3.95} y={9.15} w={0.32} d={0.32} h={1.05} color="#E5E7EB" />
        <polygon points={faceY(iso, 9.471, 3.98, 4.24, 0.82, 0.92)} fill="#A6192E" />
        {(() => {
          const [ax, ay] = iso.p(4.1, 9.25, 0.95);
          const [bx, by] = iso.p(...armEnd);
          return (
            <g>
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#F8FAFC" strokeWidth="3.4" strokeLinecap="round" />
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#A6192E" strokeWidth="3.4" strokeDasharray="5 5" strokeLinecap="butt" />
            </g>
          );
        })()}
        {/* LPR camera on post */}
        <Box iso={iso} x={3.98} y={9.0} w={0.26} d={0.18} h={0.14} z={1.1} color="#1F2937" />
        <circle cx={iso.p(4.24, 9.08, 1.17)[0]} cy={iso.p(4.24, 9.08, 1.17)[1]} r="1.4" fill={lprRead > 0 && lprRead < 1 ? '#22D3EE' : '#475569'} filter="url(#iso-glow)" />
      </g>
    ),
  });

  // PTZ pole + head
  items.push({
    k: PTZ.x + PTZ.y,
    el: (
      <g key="ptz">
        <Box iso={iso} x={PTZ.x - 0.22} y={PTZ.y - 0.22} w={0.44} d={0.44} h={0.12} color="#94A3B8" />
        <Box iso={iso} x={PTZ.x - 0.08} y={PTZ.y - 0.08} w={0.16} d={0.16} h={PTZ.h - 0.25} color="#CBD5E1" />
        <Box iso={iso} x={PTZ.x - 0.16} y={PTZ.y - 0.16} w={0.32} d={0.32} h={0.12} z={PTZ.h - 0.3} color="#E2E8F0" />
        <OBox iso={iso} cx={PTZ.x + Math.cos(yaw) * 0.1} cy={PTZ.y + Math.sin(yaw) * 0.1} z={PTZ.h - 0.18} len={0.62} wid={0.34} h={0.36} yaw={yaw} color="#F8FAFC" />
        <OBox iso={iso} cx={PTZ.x + Math.cos(yaw) * 0.14} cy={PTZ.y + Math.sin(yaw) * 0.14} z={PTZ.h + 0.18} len={0.78} wid={0.4} h={0.05} yaw={yaw} color="#E2E8F0" />
        {Math.cos(yaw) + Math.sin(yaw) > -0.3 && (
          <g>
            <circle cx={lsx} cy={lsy} r="3" fill="#0F172A" />
            <circle cx={lsx} cy={lsy} r="1.6" fill={night ? '#7F1D1D' : '#1E3A5F'} />
            <circle cx={lsx - 0.6} cy={lsy - 0.7} r="0.6" fill="#FFFFFF" opacity="0.8" />
          </g>
        )}
        {night && [-1, 1].map((sgn) => (
          <circle key={sgn} cx={lsx + sgn * 4} cy={lsy} r="1.2" fill="#F87171" filter="url(#iso-glow)" />
        ))}
      </g>
    ),
  });

  // moving car
  if (carOpacity > 0) {
    items.push({
      k: car.x + car.y,
      el: <Car key="mcar" iso={iso} x={car.x} y={car.y} yaw={car.angle} color="#A6192E" opacity={carOpacity} brake={braking} lights={night} />,
    });
  }
  if (driverOn) {
    items.push({
      k: drv.x + drv.y,
      el: <Person key="drv" iso={iso} x={drv.x} y={drv.y} heading={drv.angle} moving={lt > 11.3 && lt < 15.8} phase={drvD * 4.2} shirt="#F8FAFC" pants="#1E293B" hair="#3B2A20" opacity={drvOpacity} />,
    });
  }
  if (pedOpacity > 0) {
    items.push({
      k: ped.x + ped.y,
      el: <Person key="ped" iso={iso} x={ped.x} y={ped.y} heading={ped.angle} moving phase={pedK * PED_PATH.length * 4.3} shirt="#C2410C" pants="#334155" skin="#B9805E" opacity={pedOpacity} />,
    });
  }
  items.sort((a, b) => a.k - b.k);

  /* ---------- overlays ---------- */
  const carScreen = iso.p(car.x, car.y, 0.5);
  const showCarBox = carOpacity > 0.6 && lt < 10.8;
  const drvRect = personRect(iso, drv.x, drv.y);
  const pedRect = personRect(iso, ped.x, ped.y);
  const plateText = PLATE.slice(0, Math.round(lprRead * PLATE.length));

  const events = [
    { at: 0.9, txt: 'VEHÍCULO DETECTADO · ACCESO NORTE', c: '#38BDF8' },
    { at: 6.2, txt: `LPR ${PLATE} · AUTORIZADO`, c: '#34D399' },
    { at: 11.4, txt: 'PERSONA · ID-0472 EMPLEADO', c: '#38BDF8' },
    { at: 15.2, txt: 'PUERTA LOBBY · APERTURA', c: '#CBD5E1' },
  ].filter((e) => lt >= e.at);
  const log = events.slice(-3).reverse();

  return (
    <div className="iso-scene-wrap" ref={wrapRef}>
      <svg className="iso-svg-canvas iso-svg-canvas--wide" viewBox="0 0 600 440" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animación isométrica de videovigilancia con seguimiento PTZ y lectura de placas">
        <IsoDefs />
        <defs>
          <clipPath id="cctv-ground-clip">
            <polygon points={flat(iso, 0, 0, GX, GY)} />
          </clipPath>
          <linearGradient id="cctv-cone-vol" gradientUnits="userSpaceOnUse" x1={lsx} y1={lsy} x2={iso.p(target.x, target.y)[0]} y2={iso.p(target.x, target.y)[1]}>
            <stop offset="0%" stopColor={coneColor} stopOpacity="0.38" />
            <stop offset="100%" stopColor={coneColor} stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <g filter={thermal ? 'url(#iso-thermal-env)' : undefined}>
          <Ground />

          <g clipPath="url(#cctv-ground-clip)">
            <polygon points={iso.pts([...far, ...near.reverse()])} fill={coneColor} opacity="0.22" />
          </g>
          <polygon points={flat(iso, 7.15, FACADE_Y, 8.25, 4.85)} fill="#38BDF8" opacity={0.08 + doorOpen * 0.12} />

          <Building />

          {/* sliding lobby doors */}
          <g>
            <polygon points={faceY(iso, FACADE_Y + 0.02, 7.1, 8.3, 0, 1.95)} fill="#1E293B" />
            <polygon points={faceY(iso, FACADE_Y + 0.03, 7.1 - doorOpen * 0.55, 7.7 - doorOpen * 0.55, 0.02, 1.9)} fill="url(#iso-glass-clear)" stroke="#CBD5E1" strokeWidth="0.6" />
            <polygon points={faceY(iso, FACADE_Y + 0.03, 7.7 + doorOpen * 0.55, 8.3 + doorOpen * 0.55, 0.02, 1.9)} fill="url(#iso-glass-clear)" stroke="#CBD5E1" strokeWidth="0.6" />
          </g>

          {/* facade dome camera */}
          {(() => {
            const [dx, dy] = iso.p(7.7, FACADE_Y + 0.25, 2.05);
            return (
              <g>
                <path d={`M ${dx - 4.5} ${dy} A 4.5 4 0 0 0 ${dx + 4.5} ${dy} Z`} fill="#1F2937" />
                <rect x={dx - 5} y={dy - 1.5} width="10" height="1.8" rx="0.8" fill="#E5E7EB" />
                <circle cx={dx} cy={dy + 1.8} r="1" fill={night ? '#F87171' : '#38BDF8'} filter="url(#iso-glow)" />
              </g>
            );
          })()}

          {items.map((i) => i.el)}

          {/* status beacon on building corner */}
          {(() => {
            const [sx, sy] = iso.p(B.x1 - 0.2, FACADE_Y - 0.2, B.h);
            return (
              <g>
                <rect x={sx - 3} y={sy - 6} width="6" height="6" rx="1.5" fill="#2B5672" />
                <circle cx={sx} cy={sy - 3} r="1.6" fill="#38BDF8" filter="url(#iso-glow)" />
              </g>
            );
          })()}
        </g>

        {/* camera light volume (above objects, very subtle) */}
        <polygon points={`${lsx},${lsy} ${iso.pts([far[0], far[far.length - 1]])}`} fill="url(#cctv-cone-vol)" style={{ mixBlendMode: night ? 'screen' : 'multiply' }} />
        <line x1={lsx} y1={lsy} x2={iso.p(...far[0])[0]} y2={iso.p(...far[0])[1]} stroke={coneColor} strokeWidth="0.8" strokeOpacity="0.55" />
        <line x1={lsx} y1={lsy} x2={iso.p(...far[far.length - 1])[0]} y2={iso.p(...far[far.length - 1])[1]} stroke={coneColor} strokeWidth="0.8" strokeOpacity="0.55" />

        {/* night grade + emissive lights */}
        {night && (
          <g>
            <rect x="-400" y="-400" width="1400" height="1240" fill="#0B1733" opacity="0.62" style={{ mixBlendMode: 'multiply' }} />
            {UPPER_WINDOWS.filter((w) => w.lit).map((w, i) => (
              <polygon key={i} points={faceY(iso, FACADE_Y + 0.015, w.x0, w.x1, 2.55, 3.6)} fill="url(#iso-window-lit)" opacity="0.85" />
            ))}
            {LOWER_WINDOWS.map(([a, b]) => (
              <polygon key={a} points={faceY(iso, FACADE_Y + 0.015, a, b, 0.25, 1.9)} fill="url(#iso-window-lit)" opacity="0.55" />
            ))}
            {END_WINDOWS.filter((w) => w.lit).map((w, i) => (
              <polygon key={i} points={faceX(iso, B.x1 + 0.015, w.y0, w.y1, 2.55, 3.6)} fill="url(#iso-window-lit)" opacity="0.7" />
            ))}
            {LAMPS.map(([x, y], i) => <LampPool key={i} iso={iso} x={x} y={y} r={2.8} />)}
            {carOpacity > 0 && lt < 10.6 && <CarBeam iso={iso} x={car.x} y={car.y} yaw={car.angle} opacity={carOpacity} />}
          </g>
        )}

        {/* thermal heat signatures */}
        {thermal && (
          <g style={{ mixBlendMode: 'screen' }}>
            {carOpacity > 0 && (() => {
              const [hx, hy] = iso.p(car.x + Math.cos(car.angle) * 0.7, car.y + Math.sin(car.angle) * 0.7, 0.5);
              return <ellipse cx={hx} cy={hy} rx="20" ry="12" fill="url(#iso-heat)" opacity={carOpacity * (lt < 14 ? 1 : 0.6)} />;
            })()}
            {[driverOn && drvOpacity > 0 ? drvRect : null, pedOpacity > 0 ? pedRect : null]
              .filter(Boolean)
              .map((r, i) => (
                <ellipse key={i} cx={r.x + r.w / 2} cy={r.y + r.h * 0.45} rx={r.w * 0.55} ry={r.h * 0.55} fill="url(#iso-heat)" />
              ))}
          </g>
        )}

        {/* AI analytics overlays */}
        {showCarBox && (
          <DetectBox
            x={carScreen[0] - 26} y={carScreen[1] - 24} w={52} h={36}
            color={lprRead > 0 && lt < 7 ? '#34D399' : '#38BDF8'}
            label={lt >= 5 && lt < 7 ? `LPR · ${plateText || '···'}` : 'VEHÍCULO · 98%'}
            sub={`${Math.round(carSpeed)} km/h`}
            opacity={carOpacity}
          />
        )}
        {driverOn && drvOpacity > 0.3 && (
          <DetectBox x={drvRect.x} y={drvRect.y} w={drvRect.w} h={drvRect.h} color="#38BDF8" label="PERSONA · 97%" sub="ID-0472" opacity={drvOpacity} />
        )}
        {pedOpacity > 0.3 && !thermal && (
          <DetectBox x={pedRect.x} y={pedRect.y} w={pedRect.w} h={pedRect.h} color="#A5B4FC" label="PERSONA · 94%" opacity={pedOpacity * 0.85} dashed />
        )}
        {/* zone label */}
        <g transform={`translate(${iso.p(13.1, 4.3)[0] - 4},${iso.p(13.1, 4.3)[1] + 4})`}>
          <rect width="58" height="10" rx="2.5" fill="rgba(29,30,27,0.75)" />
          <text x="4" y="7" fontSize="5.6" fontWeight="700" fill="#FFFFFF" fontFamily={MONO}>ZONA RESTRINGIDA</text>
        </g>
      </svg>

      {/* HUD */}
      <div className="iso-hud-overlay">
        <div className="iso-hud-status-row">
          <span className="iso-hud-dot iso-hud-dot--rec" style={{ backgroundColor: '#22C55E' }} />
          <strong>CAM-03 · PTZ 4K · SEGUIMIENTO IA</strong>
          <span className="iso-hud-clock">REC {cctvClock(t)}</span>
        </div>
        <div className="iso-hud-meta">
          <span>IA ACUSENSE · 4K 60FPS</span>
          <span>ZOOM {(1 + tDist * 0.9).toFixed(1)}×</span>
          <span>PAN {Math.round(((yaw * 180) / Math.PI + 360) % 360)}°</span>
        </div>
        <ul className="iso-event-log">
          {log.map((e) => (
            <li key={e.txt}><i style={{ background: e.c }} />{e.txt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
