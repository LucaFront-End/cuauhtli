import React, { useRef, useState } from 'react';
import { PhoneCall, PhoneOff, Unlock, Mic, Moon, Video, Volume2, ShieldCheck, Wifi, Bell } from 'lucide-react';
import { createIso, makePath, seg, lerp, easeInOut, easeIn, easeOut, rand, screenFacing, cctvClock, debugParam, useSceneClock } from './iso/engine';
import { IsoDefs, Box, Person, Tree, Bush, Planter, Lamp, LampPool, DetectBox, AirRing, faceY, faceX, flat, planeY, planeX, MONO } from './iso/primitives';
import './IsometricHeroes.css';

/* ==========================================================================
   IP VIDEO INTERCOM · High-End Architectural Portal & SIP 2.0 Access
   Loop (15s):
   1. Courier arrives with package along entrance sidewalk.
   2. Stops at IP Video Intercom station and presses the backlit call button.
   3. Intercom chimes, SIP wireless waves radiate, and floating 2.5D monitor
      displays the crystal-clear 2K live feed with AI face box & audio waves.
   4. Resident grants remote unlock via mobile app:
      - 12V voltage pulse races down the conduit.
      - 300kg magnetic lock indicator snaps from RED to GREEN.
      - Heavy tempered glass door smoothly swings inward.
   5. Courier walks through threshold into the residential/office lobby.
   6. Door closer pulls door shut, maglock clicks locked, system resets.
   ========================================================================== */

const iso = createIso({ ox: 285, oy: 95, s: 23 });
const G = 12;
const CYCLE = 15;

// Architectural dimensions
const WALL_Y = 5.5;
const WALL_H = 3.4;
const DOOR = { x0: 4.8, x1: 7.0, w: 2.2, h: 3.15 };
const INTERCOM = { x: 4.15, y: WALL_Y + 0.05, z: 1.4 };
const MAGLOCK = { x: 6.75, y: WALL_Y + 0.04, z: 3.16 };

// Timings in cycle
const T_PRESS = 3.6;
const T_RING = 4.0;
const T_ANSWER = 5.2;
const T_UNLOCK = 7.2;
const T_ENTER = 8.2;
const T_CLOSE = 12.0;
const T_RESET = 14.2;

// Visitor Choreography Paths
const PATH_APPROACH = makePath([
  [1.4, 10.6],
  [2.4, 8.8],
  [3.6, 6.8],
], 0.6);

const PATH_ENTER = makePath([
  [3.6, 6.8],
  [4.5, 6.2],
  [5.8, 5.5],
  [5.8, 2.2],
], 0.5);

function visitorState(lt) {
  if (lt < 0.4 || lt > T_RESET) return null;
  const base = { moving: false, phase: 0, pose: 'walk', op: 1, carry: true, heading: -Math.PI / 3 };

  // 1. Approaching intercom
  if (lt < T_PRESS) {
    const k = seg(lt, 0.4, T_PRESS);
    const d = k * PATH_APPROACH.length;
    const p = PATH_APPROACH.at(d);
    return {
      ...base,
      x: p.x,
      y: p.y,
      z: 0,
      heading: p.angle,
      moving: true,
      phase: d * 4.6,
      op: seg(lt, 0.4, 1.0),
      stage: 'approach',
    };
  }

  // 2. Pressing the button
  if (lt < T_RING + 0.6) {
    const isPressing = lt >= T_PRESS && lt < T_PRESS + 0.7;
    return {
      ...base,
      x: 3.6,
      y: 6.8,
      z: 0,
      heading: -Math.PI * 0.38,
      moving: false,
      pose: isPressing ? 'press' : 'stand',
      stage: 'calling',
    };
  }

  // 3. Waiting for answer & unlock
  if (lt < T_ENTER) {
    return {
      ...base,
      x: 3.6,
      y: 6.8,
      z: 0,
      heading: -Math.PI * 0.38,
      moving: false,
      pose: 'stand',
      stage: 'waiting',
    };
  }

  // 4. Walking through the open door into the building
  if (lt < T_CLOSE + 0.6) {
    const k = seg(lt, T_ENTER, T_CLOSE);
    const d = k * PATH_ENTER.length;
    const p = PATH_ENTER.at(d);
    return {
      ...base,
      x: p.x,
      y: p.y,
      z: 0,
      heading: p.angle,
      moving: true,
      phase: d * 4.6,
      op: 1 - seg(lt, T_CLOSE - 0.4, T_CLOSE + 0.5),
      stage: 'enter',
    };
  }

  return null;
}

/* ---------- static environment ---------- */
const Ground = React.memo(function Ground() {
  // Paving joints
  const paversOut = [];
  for (let x = 1.0; x < G; x += 1.2) {
    paversOut.push(<polygon key={`px${x}`} points={flat(iso, x, WALL_Y, x + 0.025, 10.6, 0.005)} fill="#D1CCC2" />);
  }
  for (let y = WALL_Y + 1.0; y < 10.6; y += 1.0) {
    paversOut.push(<polygon key={`py${y}`} points={flat(iso, 0, y, G, y + 0.025, 0.005)} fill="#D1CCC2" />);
  }

  const lobbyTiles = [];
  for (let x = 1.0; x < G; x += 1.5) {
    for (let y = 0.5; y < WALL_Y; y += 1.5) {
      if (Math.round((x + y) / 1.5) % 2 === 0) {
        lobbyTiles.push(<polygon key={`lb${x}-${y}`} points={flat(iso, x, y, Math.min(x + 1.5, G), Math.min(y + 1.5, WALL_Y), 0.008)} fill="#F1ECE4" />);
      }
    }
  }

  return (
    <g>
      {/* Diorama base slab */}
      <polygon points={faceY(iso, G, 0, G, -0.6, 0)} fill="#78716C" />
      <polygon points={faceX(iso, G, 0, G, -0.6, 0)} fill="#57534E" />

      {/* Street / Curb in foreground */}
      <polygon points={flat(iso, 0, 10.6, G, G, 0.002)} fill="#374151" />
      <polygon points={flat(iso, 0, 10.5, G, 10.6, 0.012)} fill="#9CA3AF" />

      {/* Sidewalk / Forecourt */}
      <polygon points={flat(iso, 0, WALL_Y, G, 10.5, 0.004)} fill="#E7E2D8" />
      {paversOut}

      {/* Tactile guidance strip */}
      <polygon points={flat(iso, 1.2, 10.0, 1.6, 10.4, 0.008)} fill="#F59E0B" opacity="0.8" />
      <polygon points={flat(iso, 2.4, 8.4, 2.8, 8.8, 0.008)} fill="#F59E0B" opacity="0.8" />

      {/* Interior Lobby Floor */}
      <polygon points={flat(iso, 0, 0, G, WALL_Y, 0.006)} fill="#EAE5DC" />
      {lobbyTiles}

      {/* Entrance Welcome Zone */}
      <polygon points={flat(iso, DOOR.x0 + 0.1, WALL_Y - 1.2, DOOR.x1 - 0.1, WALL_Y + 1.2, 0.01)} fill="#D8D3C8" />
      <polygon points={flat(iso, DOOR.x0 + 0.25, WALL_Y + 0.2, DOOR.x1 - 0.25, WALL_Y + 1.0, 0.012)} fill="#1E293B" opacity="0.08" />
    </g>
  );
});

/* ---------- architectural portal & walls ---------- */
const PortalStructure = React.memo(function PortalStructure() {
  const revealsL = [];
  for (let z = 0.6; z < WALL_H; z += 0.6) {
    revealsL.push(<polygon key={`rl${z}`} points={faceY(iso, WALL_Y + 0.002, 0.8, DOOR.x0, z, z + 0.02)} fill="#B3ACA0" />);
  }
  const revealsR = [];
  for (let z = 0.6; z < WALL_H; z += 0.6) {
    revealsR.push(<polygon key={`rr${z}`} points={faceY(iso, WALL_Y + 0.002, DOOR.x1, 10.8, z, z + 0.02)} fill="#B3ACA0" />);
  }

  return (
    <g>
      {/* Left architectural stone wall */}
      <Box iso={iso} x={0.8} y={WALL_Y - 0.35} w={DOOR.x0 - 0.8} d={0.4} h={WALL_H} color="#ECE7DE" left="#F4F0E8" right="#D8D2C6" top="#C7C1B4" />
      {revealsL}

      {/* Right architectural stone wall */}
      <Box iso={iso} x={DOOR.x1} y={WALL_Y - 0.35} w={10.8 - DOOR.x1} d={0.4} h={WALL_H} color="#ECE7DE" left="#F4F0E8" right="#D8D2C6" top="#C7C1B4" />
      {revealsR}

      {/* Backlit Building Identity Sign */}
      <g transform={planeY(iso, 1.4, WALL_Y + 0.06, 2.75)}>
        <rect x="0" y="-14" width="56" height="16" rx="2" fill="#1D1E1B" />
        <text x="5" y="-3.5" fontSize="7" fontWeight="800" fill="#FFFFFF" fontFamily="Inter, sans-serif" letterSpacing="0.8">TORRE 04</text>
        <text x="51" y="-4" fontSize="5" fontWeight="700" fill="#A6192E" fontFamily={MONO}>A</text>
        <line x1="5" y1="-1" x2="51" y2="-1" stroke="#334155" strokeWidth="0.6" />
      </g>
      <g transform={planeY(iso, 1.4, WALL_Y + 0.06, 2.2)}>
        <text x="0" y="0" fontSize="4.6" fontWeight="700" fill="#64748B" fontFamily={MONO} letterSpacing="0.5">ACCESO PEATONAL CONTROLADO</text>
      </g>

      {/* Overhead Portal Canopy Beam */}
      <Box iso={iso} x={0.6} y={WALL_Y - 0.55} w={10.4} d={0.8} h={0.35} z={WALL_H} color="#1E293B" left="#334155" right="#0F172A" top="#475569" />

      {/* Door Frame Headers & Posts */}
      <Box iso={iso} x={DOOR.x0 - 0.08} y={WALL_Y - 0.12} w={0.16} d={0.24} h={WALL_H} color="#334155" />
      <Box iso={iso} x={DOOR.x1 - 0.08} y={WALL_Y - 0.12} w={0.16} d={0.24} h={WALL_H} color="#334155" />
      <Box iso={iso} x={DOOR.x0} y={WALL_Y - 0.12} w={DOOR.w} d={0.24} h={0.25} z={DOOR.h} color="#1E293B" />

      {/* Door Closer Body (Hydraulic) on frame header */}
      <Box iso={iso} x={DOOR.x0 + 0.15} y={WALL_Y - 0.18} w={0.7} d={0.12} h={0.12} z={DOOR.h - 0.02} color="#64748B" />

      {/* Conduit from intercom up to canopy and across to maglock */}
      <polyline
        points={iso.pts([
          [INTERCOM.x, WALL_Y + 0.01, INTERCOM.z + 0.5],
          [INTERCOM.x, WALL_Y + 0.01, WALL_H - 0.05],
          [MAGLOCK.x, WALL_Y + 0.01, WALL_H - 0.05],
          [MAGLOCK.x, WALL_Y + 0.01, MAGLOCK.z + 0.1],
        ])}
        fill="none"
        stroke="#64748B"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
    </g>
  );
});

/* ---------- outdoor video intercom station ---------- */
function IntercomStation({ ringing, connected, unlocked, night }) {
  const { x, y, z } = INTERCOM;
  const [sx, sy] = iso.p(x, y, z);

  const ringHalo = ringing
    ? '#F59E0B'
    : connected
    ? '#38BDF8'
    : unlocked
    ? '#10B981'
    : '#0284C7';

  return (
    <g>
      {/* Wall Mounting Plate */}
      <Box iso={iso} x={x - 0.22} y={y - 0.02} w={0.44} d={0.06} h={0.92} z={z - 0.46} color="#0F172A" left="#1E293B" right="#020617" top="#334155" />

      {/* 2K Wide Angle Camera Lens */}
      <g transform={planeY(iso, x, y + 0.05, z + 0.3)}>
        <circle cx="0" cy="0" r="7.5" fill="#020617" stroke="#334155" strokeWidth="1" />
        <circle cx="0" cy="0" r="4.8" fill="#0369A1" />
        <circle cx="0" cy="0" r="2.8" fill="#0C4A6E" />
        <circle cx="1.4" cy="-1.4" r="1.3" fill="#FFFFFF" opacity="0.85" />
        {/* IR LEDs (glow dim red in night mode) */}
        {[-4.5, 4.5].map((dx) => (
          <circle key={dx} cx={dx} cy="0" r="1.2" fill={night ? '#EF4444' : '#475569'} opacity={night ? 0.9 : 0.4} filter={night ? 'url(#iso-glow)' : undefined} />
        ))}
      </g>

      {/* OLED Information Screen */}
      <g transform={planeY(iso, x - 0.16, y + 0.05, z + 0.05)}>
        <rect x="0" y="-12" width="22" height="15" rx="1.5" fill="#0B132B" stroke="#1E293B" strokeWidth="0.6" />
        <text x="3" y="-7.5" fontSize="3.2" fontWeight="700" fill="#38BDF8" fontFamily={MONO}>
          {unlocked ? 'PASE ADEL.' : ringing ? 'LLAMANDO' : connected ? 'EN LINEA' : 'CUAUTHLI'}
        </text>
        <line x1="3" y1="-4.5" x2="19" y2="-4.5" stroke={unlocked ? '#10B981' : ringing ? '#F59E0B' : '#38BDF8'} strokeWidth="0.8" />
        <text x="3" y="-1" fontSize="2.6" fill="#94A3B8" fontFamily={MONO}>
          {unlocked ? 'CHAPA 12V' : ringing ? 'DEPTO 304' : connected ? 'AUDIO 2K' : 'IP SIP 2.0'}
        </text>
      </g>

      {/* Backlit Touch Call Button */}
      <g transform={planeY(iso, x, y + 0.05, z - 0.28)}>
        <circle cx="0" cy="0" r="6" fill="#1E293B" stroke={ringHalo} strokeWidth="1.2" filter={ringing || unlocked ? 'url(#iso-glow)' : undefined} />
        <circle cx="0" cy="0" r="3.8" fill={ringing ? '#F59E0B' : unlocked ? '#10B981' : '#334155'} />
        {/* Bell glyph */}
        <path d="M -1.8 1.2 L 1.8 1.2 L 1.2 -1.2 Q 0 -2.4 -1.2 -1.2 Z" fill="#FFFFFF" />
      </g>

      {/* Station RFID reader icon & speaker grilles */}
      <g transform={planeY(iso, x - 0.14, y + 0.05, z - 0.4)}>
        <line x1="0" y1="0" x2="18" y2="0" stroke="#475569" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
        <line x1="0" y1="2" x2="18" y2="2" stroke="#475569" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
      </g>
    </g>
  );
}

/* ---------- magnetic lock (300kg) ---------- */
function Maglock({ unlocked, t }) {
  const { x, y, z } = MAGLOCK;
  const [lx, ly] = iso.p(x, y, z);
  const color = unlocked ? '#10B981' : '#EF4444';

  return (
    <g>
      {/* Armature Plate on Header */}
      <Box iso={iso} x={x - 0.35} y={y - 0.06} w={0.7} d={0.14} h={0.16} z={z} color="#334155" left="#475569" right="#1E293B" top="#64748B" />

      {/* Status LED */}
      <g transform={planeY(iso, x + 0.22, y + 0.09, z + 0.08)}>
        <circle cx="0" cy="0" r="2.4" fill={color} filter="url(#iso-glow)" />
        <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" />
      </g>

      {/* Specification / Warning Label */}
      <g transform={planeY(iso, x - 0.32, y + 0.09, z + 0.05)}>
        <text x="0" y="0" fontSize="2.8" fontWeight="800" fill="#CBD5E1" fontFamily={MONO} letterSpacing="0.4">
          MAGLOCK 300KG · {unlocked ? 'LIBERADA' : 'BLOQUEADA'}
        </text>
      </g>

      {/* Voltage release wave on unlock */}
      {unlocked && (
        <AirRing cx={lx} cy={ly} t={t} period={1.2} maxR={22} color="#10B981" width={1.2} />
      )}
    </g>
  );
}

/* ---------- swinging tempered glass door ---------- */
function TemperedGlassDoor({ openK, unlocked }) {
  // Pivot hinge is at (DOOR.x0 + 0.08, WALL_Y, 0.05)
  // Swing inward into lobby (-Y direction).
  // At openK=0: angle = 0. At openK=1: angle = 70° (1.22 rad)
  const angle = openK * (Math.PI * 0.40);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const hx = DOOR.x0 + 0.08;
  const hy = WALL_Y;
  const W = DOOR.w - 0.16;

  // Latch edge coordinates in world
  const lx = hx + W * cos;
  const ly = hy - W * sin;

  // 4 corners of door leaf
  const c0 = [hx, hy, 0.06];
  const c1 = [lx, ly, 0.06];
  const c2 = [lx, ly, DOOR.h - 0.06];
  const c3 = [hx, hy, DOOR.h - 0.06];

  // Handle position (at 85% width)
  const hdx = hx + W * 0.86 * cos;
  const hdy = hy - W * 0.86 * sin;
  const [hp0x, hp0y] = iso.p(hdx, hdy, 1.0);
  const [hp1x, hp1y] = iso.p(hdx, hdy, 2.0);

  return (
    <g>
      {/* Swing arc guide on floor */}
      {openK > 0.05 && (
        <path
          d={(() => {
            const pts = [];
            for (let a = 0; a <= angle; a += 0.1) {
              const [px, py] = iso.p(hx + W * Math.cos(a), hy - W * Math.sin(a), 0.015);
              pts.push(`${a === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
            }
            return pts.join(' ');
          })()}
          fill="none"
          stroke="#10B981"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          opacity={openK * 0.6}
        />
      )}

      {/* Stainless steel pivots / hinges */}
      <Box iso={iso} x={hx - 0.04} y={hy - 0.04} w={0.08} d={0.08} h={0.14} z={0.05} color="#94A3B8" />
      <Box iso={iso} x={hx - 0.04} y={hy - 0.04} w={0.08} d={0.08} h={0.14} z={DOOR.h - 0.15} color="#94A3B8" />

      {/* Hydraulic closer arm linkage */}
      <line
        x1={iso.p(DOOR.x0 + 0.45, WALL_Y - 0.12, DOOR.h - 0.02)[0]}
        y1={iso.p(DOOR.x0 + 0.45, WALL_Y - 0.12, DOOR.h - 0.02)[1]}
        x2={iso.p(hx + W * 0.3 * cos, hy - W * 0.3 * sin, DOOR.h - 0.05)[0]}
        y2={iso.p(hx + W * 0.3 * cos, hy - W * 0.3 * sin, DOOR.h - 0.05)[1]}
        stroke="#64748B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Tempered Glass Leaf */}
      <polygon
        points={iso.pts([c0, c1, c2, c3])}
        fill="url(#iso-glass-clear)"
        stroke="#60A5FA"
        strokeWidth="1.2"
        strokeOpacity="0.8"
      />

      {/* Perimeter black frame strip */}
      <polyline
        points={iso.pts([c0, c1, c2, c3, c0])}
        fill="none"
        stroke="#1E293B"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Vertical Stainless Steel Pull Handle */}
      <line x1={hp0x} y1={hp0y} x2={hp1x} y2={hp1y} stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <line x1={hp0x} y1={hp0y} x2={hp1x} y2={hp1y} stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
      {/* Handle standoff brackets */}
      <circle cx={hp0x} cy={hp0y} r="1.8" fill="#334155" />
      <circle cx={hp1x} cy={hp1y} r="1.8" fill="#334155" />
    </g>
  );
}

/* ---------- floating 2.5D monitor / smartphone card ---------- */
function FloatingMonitor({ callState, unlocked, night, t }) {
  // Positioned in upper right quadrant (x: 436, y: 55)
  const bob = Math.sin(t * 1.8) * 3;
  const isCalling = callState === 'calling';
  const isConnected = callState === 'connected';

  // Audio equalizer bars
  const eqBars = [0, 1, 2, 3, 4].map((i) => {
    const h = isConnected ? 3 + Math.abs(Math.sin(t * 12 + i * 1.4)) * 9 : 2;
    return <rect key={i} x={i * 4} y={12 - h} width="2.4" height={h} rx="1" fill="#38BDF8" />;
  });

  return (
    <g transform={`translate(444, ${72 + bob}) scale(0.91)`}>
      {/* Device Shadow */}
      <ellipse cx="68" cy="188" rx="55" ry="14" fill="rgba(15,23,42,0.18)" filter="url(#iso-soft)" />

      {/* Smartphone / Monitor Shell */}
      <rect width="138" height="172" rx="14" fill="#0F172A" stroke="#334155" strokeWidth="1.4" />
      <rect x="5" y="5" width="128" height="162" rx="10" fill="#020617" />

      {/* Speaker / Sensor Notch */}
      <rect x="54" y="8" width="30" height="3.5" rx="1.7" fill="#1E293B" />
      <circle cx="92" cy="10" r="1.8" fill="#0284C7" />

      {/* Screen Top Status Bar */}
      <g transform="translate(12, 22)">
        <text x="0" y="0" fontSize="5.4" fontWeight="700" fill="#94A3B8" fontFamily={MONO}>SIP 2K</text>
        <rect x="36" y="-5.5" width="28" height="7" rx="2" fill="#A6192E" />
        <text x="50" y="-0.5" fontSize="4.6" fontWeight="800" fill="#FFFFFF" fontFamily={MONO} textAnchor="middle">
          {night ? 'IR 1440p' : 'LIVE 60FPS'}
        </text>
        <text x="114" y="0" fontSize="5.2" fill="#34D399" fontFamily={MONO} textAnchor="end">98% 5G</text>
      </g>

      {/* Live Video Viewport (Simulating outdoor camera) */}
      <g transform="translate(10, 27)">
        <rect
          width="118"
          height="76"
          rx="6"
          fill={night ? '#061A14' : '#0B1D28'}
          stroke="#1E293B"
          strokeWidth="0.8"
        />

        {/* Video Background (Simulated portal & pavers) */}
        <path d="M 0 54 L 118 54 L 118 76 L 0 76 Z" fill={night ? '#09251D' : '#102A38'} />
        <line x1="0" y1="54" x2="118" y2="54" stroke={night ? '#134E3E' : '#1E3A4B'} strokeWidth="0.8" />
        <line x1="42" y1="54" x2="28" y2="76" stroke={night ? '#134E3E' : '#1E3A4B'} strokeWidth="0.8" />
        <line x1="78" y1="54" x2="92" y2="76" stroke={night ? '#134E3E' : '#1E3A4B'} strokeWidth="0.8" />

        {/* Visitor Silhouette / Avatar in video feed */}
        <g transform="translate(59, 44)">
          {/* Head & Cap */}
          <circle cx="0" cy="-15" r="9" fill={night ? '#34D399' : '#FDBA74'} />
          <path d="M -9 -17 Q 0 -22 9 -17 Q 4 -25 -9 -17 Z" fill="#1E293B" />
          <rect x="-10" y="-18" width="14" height="3" rx="1.5" fill="#0F172A" />

          {/* Shoulders & Uniform */}
          <path d="M -18 10 C -18 -4 18 -4 18 10 Z" fill={night ? '#059669' : '#2B5672'} />

          {/* Package in hands */}
          <rect x="-8" y="2" width="16" height="11" rx="1" fill="#C89B6D" />
          <line x1="-8" y1="5" x2="8" y2="5" stroke="#9A6B42" strokeWidth="1" />
        </g>

        {/* Face Detection Bounding Box */}
        <g transform="translate(45, 23)">
          <rect width="28" height="34" rx="2" fill="none" stroke={night ? '#34D399' : '#38BDF8'} strokeWidth="1.2" strokeDasharray="3 2" />
          <rect x="0" y="-8" width="28" height="7" rx="1.5" fill={night ? '#065F46' : '#0369A1'} />
          <text x="14" y="-3" fontSize="4.2" fontWeight="800" fill="#FFFFFF" fontFamily={MONO} textAnchor="middle">
            COURIER · 99%
          </text>
        </g>

        {/* Camera OSD timestamp */}
        <text x="6" y="70" fontSize="4.6" fill="#94A3B8" fontFamily={MONO}>
          CAM 01 · TORRE 04
        </text>
      </g>

      {/* Call Info Banner */}
      <g transform="translate(10, 108)">
        <text x="0" y="0" fontSize="6.4" fontWeight="800" fill="#FFFFFF" fontFamily="Inter, sans-serif">
          {unlocked ? '¡ACCESO CONCEDIDO!' : isCalling ? 'TIMBRANDO…' : isConnected ? 'AUDIO CONECTADO' : 'TORRE 04 · DEPTO 304'}
        </text>
        <text x="0" y="9" fontSize="5.2" fill={unlocked ? '#34D399' : isCalling ? '#FBBF24' : '#94A3B8'} fontFamily={MONO}>
          {unlocked ? 'CHAPA 12V LIBERADA' : isCalling ? 'VISITANTE EN PUERTA' : isConnected ? 'DÚPLEX ECO-CANCEL' : 'INTERFÓN IP STANDBY'}
        </text>
      </g>

      {/* Audio Waveform Widget (when active) */}
      {isConnected && (
        <g transform="translate(108, 103)">
          {eqBars}
        </g>
      )}

      {/* Action Controls Inside Smartphone Screen */}
      <g transform="translate(10, 126)">
        {/* Remote Unlock Button */}
        <g>
          <rect
            width="118"
            height="18"
            rx="5"
            fill={unlocked ? '#10B981' : '#2B5672'}
            stroke={unlocked ? '#34D399' : '#38BDF8'}
            strokeWidth="0.8"
          />
          <text x="59" y="11.5" fontSize="6.2" fontWeight="800" fill="#FFFFFF" fontFamily={MONO} textAnchor="middle">
            {unlocked ? '✓ PUERTA ABIERTA' : 'ABRIR CHAPA MAGNÉTICA'}
          </text>
        </g>

        {/* Small in-call action pills */}
        <g transform="translate(0, 23)">
          <rect width="56" height="12" rx="3" fill="#1E293B" />
          <text x="28" y="8" fontSize="4.6" fontWeight="700" fill="#94A3B8" fontFamily={MONO} textAnchor="middle">
            MUTE MIC
          </text>

          <rect x="62" width="56" height="12" rx="3" fill="#991B1B" />
          <text x="90" y="8" fontSize="4.6" fontWeight="700" fill="#FFFFFF" fontFamily={MONO} textAnchor="middle">
            COLGAR
          </text>
        </g>
      </g>
    </g>
  );
}

/* ==========================================================================
   MAIN SCENE COMPONENT
   ========================================================================== */
export default function IntercomIsometricScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 5.6 });
  const initial = debugParam('isoState') || '';

  const [night, setNight] = useState(initial.includes('night'));
  const [forceUnlock, setForceUnlock] = useState(initial.includes('unlock'));
  const [audioActive, setAudioActive] = useState(true);
  const [off, setOff] = useState(0);

  // Time in current choreography cycle
  const lt = ((t - off) % CYCLE + CYCLE) % CYCLE;

  const visitor = visitorState(lt);

  // Call status derivation
  const isRinging = lt >= T_RING && lt < T_ANSWER;
  const isConnected = (lt >= T_ANSWER && lt < T_CLOSE) || forceUnlock;
  const isUnlockedAuto = lt >= T_UNLOCK && lt < T_CLOSE;
  const unlocked = isUnlockedAuto || forceUnlock;

  const callState = isRinging ? 'calling' : isConnected ? 'connected' : 'standby';

  // Door swing factor (0 = closed, 1 = fully open)
  const openK = unlocked
    ? easeInOut(seg(lt, T_UNLOCK, T_UNLOCK + 0.8))
    : easeInOut(seg(lt, T_CLOSE, T_CLOSE + 0.9));

  // Conduit energy pulse when unlocking
  const unlockPulse = seg(lt, T_UNLOCK - 0.2, T_UNLOCK + 0.4);
  const pulseActive = isUnlockedAuto && unlockPulse > 0 && unlockPulse < 1;

  // Outdoor illumination
  const [sconceX, sconceY] = iso.p(INTERCOM.x, WALL_Y + 0.05, 2.5);

  const status = unlocked
    ? 'ACCESO CONCEDIDO · CHAPA 12V'
    : isRinging
    ? 'LLAMADA ENTRANTE · DEPTO 304'
    : isConnected
    ? 'EN LLAMADA SIP · AUDIO DÚPLEX'
    : 'PORTERO IP ACTIVO · SIP 2.0';

  const events = [
    { txt: 'AUTOPRUEBA SIP 2.0 · EN LÍNEA', c: '#34D399' },
    { txt: 'CÁMARA 2K WDR · 1440p ACTIVA', c: '#34D399' },
  ];
  if (lt >= T_RING) events.push({ txt: 'TIMBRE ACCESO A · DEPTO 304', c: '#FBBF24' });
  if (lt >= T_ANSWER) events.push({ txt: 'AUDIO DÚPLEX · CANCELACIÓN ECO', c: '#38BDF8' });
  if (unlocked) events.push({ txt: 'APERTURA REMOTA APP · 12V DC', c: '#34D399' });
  if (lt >= T_CLOSE) events.push({ txt: 'PUERTA CERRADA · REASEGURADO', c: '#34D399' });
  const log = events.slice(-3).reverse();

  // Trigger manual call simulation
  const handleTriggerCall = () => {
    setOff(t - T_PRESS + 0.2);
    setForceUnlock(false);
  };

  // Toggle remote unlock
  const handleToggleUnlock = () => {
    setForceUnlock((prev) => !prev);
  };

  return (
    <div className="iso-scene-wrap" ref={wrapRef}>
      <svg
        className="iso-svg-canvas iso-svg-canvas--wide"
        viewBox="0 0 600 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animación isométrica de videoportero IP con llamada SIP 2K y apertura remota de chapa magnética"
      >
        <IsoDefs />
        <defs>
          <linearGradient id="intercom-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF4C8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFE2A8" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ir-beam">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#0284C7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Ground & Floor slabs */}
        <Ground />

        {/* 2. Lobby Interior Architectural Details (y < 5.0) */}
        {/* Interior back glass wall / lobby curtain wall */}
        <polygon points={faceY(iso, 0.4, 0.8, 10.8, 0, 3.4)} fill="#CBD5E1" opacity="0.3" />
        <polygon points={faceY(iso, 0.42, 0.8, 10.8, 0.4, 3.2)} fill="url(#iso-glass)" opacity="0.45" />
        {[2.5, 4.5, 6.5, 8.5].map((x) => (
          <line
            key={`mullion${x}`}
            x1={iso.p(x, 0.42, 0)[0]}
            y1={iso.p(x, 0.42, 0)[1]}
            x2={iso.p(x, 0.42, 3.4)[0]}
            y2={iso.p(x, 0.42, 3.4)[1]}
            stroke="#94A3B8"
            strokeWidth="1.2"
          />
        ))}

        {/* Lobby Planters & Interior Benches */}
        <Box iso={iso} x={1.8} y={1.6} w={1.6} d={0.6} h={0.42} color="#D6D1C7" left="#E5E0D6" right="#C2BCB0" top="#ECE7DD" />
        <Planter iso={iso} x={1.2} y={3.6} size={0.85} />
        <Bush iso={iso} x={1.4} y={1.8} size={0.7} color="#4F8B5E" />
        <Tree iso={iso} x={9.4} y={3.4} size={0.75} />
        <Planter iso={iso} x={9.8} y={7.2} size={0.8} />

        {/* 3. Architectural Portal & Walls */}
        <PortalStructure />

        {/* 4. IP Video Intercom Station on Entrance Wall */}
        <IntercomStation ringing={isRinging} connected={isConnected} unlocked={unlocked} night={night} />

        {/* 5. Magnetic Lock on Header */}
        <Maglock unlocked={unlocked} t={t} />

        {/* 6. Conduit Energy Pulse when unlocking */}
        {pulseActive && (
          <polyline
            points={iso.pts([
              [INTERCOM.x, WALL_Y + 0.01, INTERCOM.z + 0.5],
              [INTERCOM.x, WALL_Y + 0.01, WALL_H - 0.05],
              [MAGLOCK.x, WALL_Y + 0.01, WALL_H - 0.05],
              [MAGLOCK.x, WALL_Y + 0.01, MAGLOCK.z + 0.1],
            ])}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.4"
            filter="url(#iso-glow)"
          />
        )}

        {/* 7. Tempered Glass Door with Interactive Swing */}
        <TemperedGlassDoor openK={openK} unlocked={unlocked} />

        {/* 8. Visitor / Courier Character */}
        {visitor && (
          <Person
            iso={iso}
            x={visitor.x}
            y={visitor.y}
            z={visitor.z}
            heading={visitor.heading}
            moving={visitor.moving}
            phase={visitor.phase}
            pose={visitor.pose}
            shirt="#2B5672"
            pants="#1E293B"
            cap="#1D1E1B"
            carry={visitor.carry}
            opacity={visitor.op}
          />
        )}

        {/* 9. SIP Calling Waves & Audio Radiations */}
        {isRinging && (
          <g>
            <AirRing cx={iso.p(INTERCOM.x, WALL_Y, INTERCOM.z)[0]} cy={iso.p(INTERCOM.x, WALL_Y, INTERCOM.z)[1]} t={t} period={1.2} maxR={30} color="#F59E0B" width={1.4} />
            <AirRing cx={iso.p(INTERCOM.x, WALL_Y, INTERCOM.z)[0]} cy={iso.p(INTERCOM.x, WALL_Y, INTERCOM.z)[1]} t={t} period={1.2} delay={0.4} maxR={48} color="#0284C7" width={1} />
          </g>
        )}

        {/* 10. Night Gradient Grade */}
        {night && (
          <rect x="-400" y="-400" width="1400" height="1240" fill="#0B1733" opacity="0.64" style={{ mixBlendMode: 'multiply' }} />
        )}

        {/* 11. Emissive Architectural Lighting in Night Mode */}
        {night && (
          <g style={{ mixBlendMode: 'screen' }}>
            {/* Wall Sconce illumination pool */}
            <polygon
              points={`${sconceX},${sconceY} ${sconceX - 35},${sconceY + 65} ${sconceX + 35},${sconceY + 65}`}
              fill="url(#intercom-beam)"
              opacity="0.85"
              filter="url(#iso-soft)"
            />
            <ellipse cx={sconceX} cy={sconceY + 65} rx="35" ry="18" fill="url(#iso-pool)" opacity="0.9" />
            <circle cx={sconceX} cy={sconceY} r="3" fill="#FFF7D6" filter="url(#iso-glow)" />

            {/* Camera IR Illumination on visitor */}
            {visitor && (
              <ellipse
                cx={iso.p(visitor.x, visitor.y, 0.9)[0]}
                cy={iso.p(visitor.x, visitor.y, 0.9)[1]}
                rx="24"
                ry="18"
                fill="url(#ir-beam)"
                opacity="0.8"
                filter="url(#iso-soft)"
              />
            )}
          </g>
        )}

        {/* 12. Floating 2.5D Mobile / Tablet Monitor UI */}
        <FloatingMonitor callState={callState} unlocked={unlocked} night={night} t={t} />
      </svg>

      {/* Telemetry HUD Overlay */}
      <div className={`iso-hud-overlay ${unlocked ? 'is-alert' : ''}`}>
        <div className="iso-hud-status-row">
          <span
            className="iso-hud-dot iso-hud-dot--rec"
            style={{ backgroundColor: unlocked ? '#10B981' : isRinging ? '#F59E0B' : isConnected ? '#38BDF8' : '#22C55E' }}
          />
          <strong>{status}</strong>
          <span className="iso-hud-clock">{cctvClock(t, night ? 22 * 3600 + 15 * 60 : 11 * 3600 + 42 * 60)}</span>
        </div>
        <div className="iso-hud-meta">
          <span>PROTOCOLO: SIP 2.0 / P2P</span>
          <span>VIDEO: 2K QHD (1440p) WDR</span>
          <span>CHAPA: {unlocked ? 'LIBERADA (12V)' : '300KG ENERGIZADA'}</span>
        </div>
        <ul className="iso-event-log">
          {log.map((e) => (
            <li key={e.txt}>
              <i style={{ background: e.c }} />
              {e.txt}
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Controls Bar */}
      <div className="iso-controls-bar">
        <button
          type="button"
          className="iso-btn iso-btn--primary"
          onClick={handleTriggerCall}
        >
          <Bell size={13} />
          <span>Timbrar portero</span>
        </button>

        <button
          type="button"
          className={`iso-btn ${unlocked ? 'is-on is-amber' : ''}`}
          onClick={handleToggleUnlock}
          aria-pressed={unlocked}
        >
          <Unlock size={13} />
          <span>{unlocked ? 'Chapa Liberada' : 'Abrir Chapa'}</span>
        </button>

        <button
          type="button"
          className={`iso-btn ${audioActive ? 'is-on' : ''}`}
          onClick={() => setAudioActive((v) => !v)}
          aria-pressed={audioActive}
        >
          <Mic size={13} />
          <span>{audioActive ? 'Audio Dúplex' : 'Mute'}</span>
        </button>

        <button
          type="button"
          className={`iso-btn ${night ? 'is-on' : ''}`}
          onClick={() => setNight((v) => !v)}
          aria-pressed={night}
        >
          <Moon size={13} />
          <span>{night ? 'Día' : 'Noche (IR)'}</span>
        </button>
      </div>
    </div>
  );
}
