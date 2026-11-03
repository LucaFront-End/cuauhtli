import React, { useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  createIso,
  seg,
  lerp,
  easeInOut,
  clamp,
  cctvClock,
  useSceneClock,
} from '../services/heroes/iso/engine';
import {
  IsoDefs,
  Box,
  OBox,
  Car,
  Person,
  Tree,
  Bush,
  DetectBox,
  GroundRing,
  AirRing,
  faceY,
  faceX,
  flat,
  planeY,
  planeX,
  personRect,
  MONO,
} from '../services/heroes/iso/primitives';
import '../services/heroes/IsometricHeroes.css';

const clamp01 = (v) => clamp(v, 0, 1);
const smooth = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
function carRect(iso, x, y) {
  const [sx, sy] = iso.p(x, y, 0.45);
  return { x: sx - 32, y: sy - 20, w: 64, h: 42 };
}

/* ==========================================================================
   5 ARCHITECTURALLY COHERENT, DEPTH-SORTED ISOMETRIC SCENES
   Every scene uses:
   - True 2:1 isometric projection (x: down-right, y: down-left, z: up)
   - Strict Painter's Algorithm depth sorting (items.sort((a, b) => a.k - b.k))
   - Zero object clipping: actors stop at barriers/turnstiles/airlocks and
     only advance once gates/doors are physically open.
   ========================================================================== */

function SceneHudHeader({ code, status, metric, t }) {
  return (
    <>
      <div className="prj-iso-glass-pill" style={{ top: 16, left: 16 }}>
        <span className="prj-iso-live-dot" />
        <span className="prj-iso-pill-strong">{code}</span>
        <span className="prj-iso-pill-sep" />
        <span className="prj-iso-pill-mono">{cctvClock(t)}</span>
      </div>
      <div className="prj-iso-glass-pill" style={{ top: 16, right: 16 }}>
        <ShieldCheck size={13} color="#A6192E" />
        <span className="prj-iso-pill-mono">{status}</span>
        {metric && (
          <>
            <span className="prj-iso-pill-sep" />
            <span className="prj-iso-pill-strong" style={{ color: '#A6192E' }}>
              {metric}
            </span>
          </>
        )}
      </div>
    </>
  );
}

/* ==========================================================================
   SHARED BESPOKE 3D ISOMETRIC ACTORS (WHEELED & PERSPECTIVE-ACCURATE)
   ========================================================================== */

/**
 * Motorized Barrier Gate with Pivot Pedestal and Lifting Boom Arm.
 * Pedestal sits at (px, py); arm extends along -x (if dirX = -1) or +x (if dirX = 1)
 * and lifts into +z as `open` goes 0 -> 1.
 */
function IsoBarrierGate({ iso, px, py, armLen = 2.0, dirX = -1, open = 0, accent = '#A6192E' }) {
  // Angle from horizontal (0 rad) to vertical (1.42 rad = ~81 deg)
  const theta = open * 1.42;
  const reachX = Math.cos(theta) * armLen * dirX;
  const reachZ = Math.sin(theta) * armLen;
  const pivotX = px + (dirX > 0 ? 0.34 : 0.04);
  const pivotY = py + 0.19;
  const pivotZ = 0.82;
  const [p0x, p0y] = iso.p(pivotX, pivotY, pivotZ);
  const [p1x, p1y] = iso.p(pivotX + reachX, pivotY, pivotZ + reachZ);
  const [p2x, p2y] = iso.p(pivotX + reachX, pivotY, pivotZ + reachZ + 0.11);
  const [p3x, p3y] = iso.p(pivotX, pivotY, pivotZ + 0.11);

  return (
    <g>
      {/* Heavy concrete & steel pedestal */}
      <Box iso={iso} x={px - 0.04} y={py - 0.04} w={0.46} d={0.46} h={0.12} color="#64748B" />
      <Box iso={iso} x={px} y={py} w={0.38} d={0.38} h={1.08} z={0.12} color="#1E293B" top="#334155" />
      <Box iso={iso} x={px + 0.03} y={py + 0.03} w={0.32} d={0.32} h={0.16} z={1.2} color={accent} />
      {/* Status LED on front of pedestal */}
      <polygon
        points={faceY(iso, py + 0.385, px + 0.08, px + 0.3, 0.92, 1.06)}
        fill={open > 0.65 ? '#10B981' : '#EF4444'}
      />
      {/* Boom arm in true 3D space */}
      <polygon
        points={`${p0x.toFixed(1)},${p0y.toFixed(1)} ${p1x.toFixed(1)},${p1y.toFixed(1)} ${p2x.toFixed(1)},${p2y.toFixed(1)} ${p3x.toFixed(1)},${p3y.toFixed(1)}`}
        fill="#FFFFFF"
        stroke="#A6192E"
        strokeWidth="1.2"
      />
      {/* High-visibility red safety stripes along the boom */}
      {[0.2, 0.5, 0.8].map((f, idx) => {
        const f0 = f;
        const f1 = f + 0.12;
        const [sx0, sy0] = iso.p(pivotX + reachX * f0, pivotY, pivotZ + reachZ * f0);
        const [sx1, sy1] = iso.p(pivotX + reachX * f1, pivotY, pivotZ + reachZ * f1);
        const [sx2, sy2] = iso.p(pivotX + reachX * f1, pivotY, pivotZ + reachZ * f1 + 0.11);
        const [sx3, sy3] = iso.p(pivotX + reachX * f0, pivotY, pivotZ + reachZ * f0 + 0.11);
        return (
          <polygon
            key={idx}
            points={`${sx0.toFixed(1)},${sy0.toFixed(1)} ${sx1.toFixed(1)},${sy1.toFixed(1)} ${sx2.toFixed(1)},${sy2.toFixed(1)} ${sx3.toFixed(1)},${sy3.toFixed(1)}`}
            fill="#A6192E"
          />
        );
      })}
    </g>
  );
}

/**
 * Wheeled Industrial Counterbalance Forklift moving along the X axis (heading = 0 -> +x).
 * Includes 4 rubber tires, counterweight body, ROPS roll cage, vertical mast, and lifting forks + pallet.
 */
function IsoForklift({ iso, x, y, forkZ = 0.25 }) {
  return (
    <g>
      {/* Ground shadow */}
      <polygon
        points={flat(iso, x - 0.65, y - 0.42, x + 0.85, y + 0.42, 0.015)}
        fill="#0F172A"
        opacity="0.22"
      />
      {/* 4 Rubber Wheels */}
      <Box iso={iso} x={x - 0.48} y={y - 0.38} w={0.26} d={0.12} h={0.26} z={0.02} color="#0F172A" />
      <Box iso={iso} x={x + 0.18} y={y - 0.38} w={0.28} d={0.12} h={0.28} z={0.02} color="#0F172A" />
      <Box iso={iso} x={x - 0.48} y={y + 0.26} w={0.26} d={0.12} h={0.26} z={0.02} color="#0F172A" />
      <Box iso={iso} x={x + 0.18} y={y + 0.26} w={0.28} d={0.12} h={0.28} z={0.02} color="#0F172A" />
      {/* Rear Counterweight & Main Chassis */}
      <Box iso={iso} x={x - 0.55} y={y - 0.32} w={0.42} d={0.64} h={0.58} z={0.14} color="#D97706" top="#F59E0B" />
      <Box iso={iso} x={x - 0.13} y={y - 0.32} w={0.55} d={0.64} h={0.38} z={0.14} color="#F59E0B" top="#FBBF24" />
      {/* Operator Seat & Overhead Guard (ROPS Pillars) */}
      <Box iso={iso} x={x - 0.12} y={y - 0.16} w={0.24} d={0.32} h={0.28} z={0.52} color="#1E293B" />
      <Box iso={iso} x={x - 0.38} y={y - 0.28} w={0.05} d={0.05} h={0.68} z={0.52} color="#1E293B" />
      <Box iso={iso} x={x - 0.38} y={y + 0.23} w={0.05} d={0.05} h={0.68} z={0.52} color="#1E293B" />
      <Box iso={iso} x={x + 0.28} y={y - 0.28} w={0.05} d={0.05} h={0.68} z={0.52} color="#1E293B" />
      <Box iso={iso} x={x + 0.28} y={y + 0.23} w={0.05} d={0.05} h={0.68} z={0.52} color="#1E293B" />
      <Box iso={iso} x={x - 0.4} y={y - 0.3} w={0.74} d={0.6} h={0.06} z={1.2} color="#1E293B" />
      {/* Amber Safety Beacon */}
      <Box iso={iso} x={x - 0.08} y={y - 0.05} w={0.1} d={0.1} h={0.12} z={1.26} color="#F59E0B" />
      {/* Front Dual Hydraulic Mast Rails */}
      <Box iso={iso} x={x + 0.42} y={y - 0.26} w={0.07} d={0.07} h={1.38} z={0.12} color="#0F172A" />
      <Box iso={iso} x={x + 0.42} y={y + 0.19} w={0.07} d={0.07} h={1.38} z={0.12} color="#0F172A" />
      {/* Lifting Forks + Wooden Pallet + Export Box */}
      <Box iso={iso} x={x + 0.49} y={y - 0.24} w={0.52} d={0.08} h={0.05} z={forkZ} color="#334155" />
      <Box iso={iso} x={x + 0.49} y={y + 0.16} w={0.52} d={0.08} h={0.05} z={forkZ} color="#334155" />
      <Box iso={iso} x={x + 0.52} y={y - 0.28} w={0.48} d={0.56} h={0.08} z={forkZ + 0.05} color="#B45309" />
      <Box iso={iso} x={x + 0.55} y={y - 0.24} w={0.42} d={0.48} h={0.44} z={forkZ + 0.13} color="#D97706" top="#FBBF24" />
    </g>
  );
}

/**
 * Wheeled Articulated Freight Truck (53' Box Trailer + Day-Cab Tractor) oriented along the Y axis.
 * Rear of trailer is at `rearY`; tractor nose is at `rearY + 3.45` (facing +y, backing into -y dock).
 */
function IsoFreightTruck({ iso, x, rearY, docked = false, braking = false }) {
  // x is center of truck; width is 1.24 (x - 0.62 .. x + 0.62)
  const x0 = x - 0.62;
  const w = 1.24;
  return (
    <g>
      {/* Full ground shadow */}
      <polygon
        points={flat(iso, x0 - 0.08, rearY - 0.08, x0 + w + 0.08, rearY + 3.55, 0.015)}
        fill="#0F172A"
        opacity="0.24"
      />
      {/* Rear Tandem Axles & 8 Tires */}
      {[rearY + 0.35, rearY + 0.72, rearY + 2.35, rearY + 3.05].map((wy, idx) => (
        <React.Fragment key={idx}>
          <Box iso={iso} x={x0 - 0.03} y={wy} w={0.16} d={0.28} h={0.32} z={0.02} color="#0F172A" />
          <Box iso={iso} x={x0 + w - 0.13} y={wy} w={0.16} d={0.28} h={0.32} z={0.02} color="#0F172A" />
        </React.Fragment>
      ))}
      {/* Undercarriage Chassis Frame */}
      <Box iso={iso} x={x0 + 0.12} y={rearY + 0.1} w={w - 0.24} d={3.25} h={0.22} z={0.16} color="#1E293B" />

      {/* 53' Refrigerated / Dry-Van Trailer Container (rearY .. rearY + 2.25) */}
      <Box
        iso={iso}
        x={x0}
        y={rearY}
        w={w}
        d={2.25}
        h={1.58}
        z={0.34}
        color="#F8FAFC"
        top="#FFFFFF"
      />
      {/* Brand Crimson Stripe & Corrugation ribs on Trailer +X Side Wall */}
      <polygon
        points={faceX(iso, x0 + w + 0.01, rearY + 0.08, rearY + 2.18, 1.02, 1.24)}
        fill="#A6192E"
      />
      <g transform={planeX(iso, x0 + w + 0.02, rearY + 1.85, 1.56)}>
        <text fill="#0F172A" fontSize="6.5" fontWeight="800" fontFamily={MONO} letterSpacing="0.08em">
          CTPAT · LOGISTICS
        </text>
      </g>
      {/* Rear Trailer Brake / Dock Lock Indicators */}
      {braking && (
        <>
          <polygon
            points={faceX(iso, x0 + w + 0.01, rearY + 0.02, rearY + 0.12, 0.42, 0.56)}
            fill="#EF4444"
          />
          <polygon
            points={faceY(iso, rearY + 2.26, x0 + 0.08, x0 + 0.26, 0.42, 0.54)}
            fill="#F59E0B"
          />
        </>
      )}
      {docked && (
        <polygon
          points={faceX(iso, x0 + w + 0.01, rearY + 0.02, rearY + 0.16, 1.62, 1.82)}
          fill="#10B981"
        />
      )}

      {/* Tractor Cab Aerodynamic Roof Fairing & Cabin (rearY + 2.38 .. rearY + 3.45) */}
      <Box
        iso={iso}
        x={x0 + 0.06}
        y={rearY + 2.38}
        w={w - 0.12}
        d={0.56}
        h={1.26}
        z={0.34}
        color="#CBD5E1"
        top="#F8FAFC"
      />
      {/* Tractor Engine Hood */}
      <Box
        iso={iso}
        x={x0 + 0.08}
        y={rearY + 2.94}
        w={w - 0.16}
        d={0.52}
        h={0.72}
        z={0.34}
        color="#E2E8F0"
        top="#F8FAFC"
      />
      {/* Tractor Front Windshield (+y face) */}
      <polygon
        points={faceY(iso, rearY + 2.945, x0 + 0.14, x0 + w - 0.14, 1.08, 1.52)}
        fill="#1E293B"
      />
      {/* Tractor Chrome Grille & LED Headlights (+y face at rearY + 3.46) */}
      <polygon
        points={faceY(iso, rearY + 3.465, x0 + 0.26, x0 + w - 0.26, 0.44, 0.96)}
        fill="#334155"
      />
      <polygon
        points={faceY(iso, rearY + 3.468, x0 + 0.11, x0 + 0.24, 0.52, 0.68)}
        fill="#FEF08A"
      />
      <polygon
        points={faceY(iso, rearY + 3.468, x0 + w - 0.24, x0 + w - 0.11, 0.52, 0.68)}
        fill="#FEF08A"
      />
      {/* Front License Plate with LPR Tag */}
      <polygon
        points={faceY(iso, rearY + 3.47, x - 0.16, x + 0.16, 0.36, 0.46)}
        fill="#FFFFFF"
      />
    </g>
  );
}

/**
 * Wheeled Emergency Ambulance oriented along the Y axis (driving toward -y, nose at `frontY`).
 * Rear is at `frontY + 2.35`.
 */
function IsoAmbulance({ iso, x, frontY, emergencyActive = true, t = 0 }) {
  const x0 = x - 0.56;
  const w = 1.12;
  const flash = Math.sin(t * 14) > 0;
  return (
    <g>
      {/* Ground shadow */}
      <polygon
        points={flat(iso, x0 - 0.08, frontY - 0.08, x0 + w + 0.08, frontY + 2.45, 0.015)}
        fill="#0F172A"
        opacity="0.23"
      />
      {/* 4 Wheels */}
      {[frontY + 0.32, frontY + 1.82].map((wy, idx) => (
        <React.Fragment key={idx}>
          <Box iso={iso} x={x0 - 0.03} y={wy} w={0.14} d={0.28} h={0.3} z={0.02} color="#0F172A" />
          <Box iso={iso} x={x0 + w - 0.11} y={wy} w={0.14} d={0.28} h={0.3} z={0.02} color="#0F172A" />
        </React.Fragment>
      ))}
      {/* Front Cab (frontY .. frontY + 0.72) */}
      <Box
        iso={iso}
        x={x0 + 0.04}
        y={frontY}
        w={w - 0.08}
        d={0.72}
        h={0.88}
        z={0.22}
        color="#F8FAFC"
        top="#FFFFFF"
      />
      {/* Patient Medical Module Box (frontY + 0.68 .. frontY + 2.35) */}
      <Box
        iso={iso}
        x={x0}
        y={frontY + 0.68}
        w={w}
        d={1.67}
        h={1.24}
        z={0.22}
        color="#FFFFFF"
        top="#F8FAFC"
      />
      {/* Red Paramedic Stripe & Medical Cross on +X Side Wall */}
      <polygon
        points={faceX(iso, x0 + w + 0.01, frontY + 0.72, frontY + 2.3, 0.68, 0.88)}
        fill="#DC2626"
      />
      <polygon
        points={faceX(iso, x0 + w + 0.015, frontY + 1.35, frontY + 1.65, 0.96, 1.32)}
        fill="#DC2626"
      />
      {/* Side Cab Window */}
      <polygon
        points={faceX(iso, x0 + w - 0.03, frontY + 0.18, frontY + 0.62, 0.68, 1.02)}
        fill="#1E293B"
      />
      {/* Rear Doors & Tail Lights (+Y face at frontY + 2.35) */}
      <polygon
        points={faceY(iso, frontY + 2.355, x0 + 0.12, x - 0.03, 0.78, 1.32)}
        fill="#1E293B"
      />
      <polygon
        points={faceY(iso, frontY + 2.355, x + 0.03, x0 + w - 0.12, 0.78, 1.32)}
        fill="#1E293B"
      />
      <polygon
        points={faceY(iso, frontY + 2.358, x0 + 0.08, x0 + w - 0.08, 0.48, 0.64)}
        fill="#DC2626"
      />
      {/* Emergency Roof Lightbar */}
      <Box
        iso={iso}
        x={x - 0.34}
        y={frontY + 0.74}
        w={0.32}
        d={0.18}
        h={0.12}
        z={1.46}
        color={emergencyActive && flash ? '#EF4444' : '#991B1B'}
      />
      <Box
        iso={iso}
        x={x + 0.02}
        y={frontY + 0.74}
        w={0.32}
        d={0.18}
        h={0.12}
        z={1.46}
        color={emergencyActive && !flash ? '#38BDF8' : '#0284C7'}
      />
    </g>
  );
}

/* ==========================================================================
   SCENE 01: MEGA-CEDIS LOGÍSTICO & ADUANA CTPAT
   - Back-left warehouse with 2 dock bays + cutaway internal pallet rack bay
   - Wheeled Forklift moving along a clear aisle (x: 5.5 -> 8.2, y: 2.85)
   - Articulated 53' Freight Truck backing into Dock Bay #1 (x: 2.35):
     pauses at the LPR checkpoint (y = 8.4) until the barrier opens, then
     backs cleanly up to the rubber dock bumpers (y = 4.35) without clipping!
   ========================================================================== */
const cedisIso = createIso({ ox: 292, oy: 66, s: 20.5 });

export function CedisLogisticsIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 7.2 });
  const lt = t % 16;

  // Truck Choreography (16s cycle):
  // 0.0..1.8s: Truck waits at LPR line (rearY = 6.35) while LPR scans plate
  // 1.8..2.6s: Barrier arm opens (0 -> 1)
  // 2.6..6.8s: Truck backs smoothly through open barrier to Dock #1 bumpers (rearY = 4.38)
  // 6.8..11.2s: Docked at Bay #1 (dock lock green, roll-up door opens)
  // 11.2..14.6s: Truck pulls forward back to rearY = 6.35
  // 14.6..16.0s: Barrier closes
  const backIn = easeInOut(seg(lt, 2.5, 6.8));
  const pullOut = easeInOut(seg(lt, 11.4, 14.6));
  const dockProgress = clamp01(backIn - pullOut);
  const truckRearY = lerp(6.35, 4.38, dockProgress);

  const isScanningLpr = lt >= 0.3 && lt < 2.5;
  const barrierOpen = clamp01(seg(lt, 1.6, 2.4) - seg(lt, 14.8, 15.6));
  const isDocked = lt >= 6.6 && lt <= 11.4;
  const dockDoorOpen = clamp01(seg(lt, 6.2, 7.2) - seg(lt, 11.0, 12.0));

  // Forklift patrolling inside the unobstructed cutaway warehouse aisle (x: 5.6..8.1, y: 2.95)
  const forkX = 6.85 + Math.sin(t * 0.95) * 1.15;
  const forkZ = 0.22 + (Math.sin(t * 1.9) + 1) * 0.24;

  // Corner PTZ Camera at (10.8, 9.6, z=3.9) tracking the freight truck
  const truckCenterX = 2.45;
  const truckCenterY = truckRearY + 1.7;
  const ptzYaw = Math.atan2(truckCenterY - 9.6, truckCenterX - 10.8);
  const [ptzSx, ptzSy] = cedisIso.p(10.8, 9.6, 3.85);
  const [fovAx, fovAy] = cedisIso.p(2.45 - 0.9, truckRearY + 0.4, 0.04);
  const [fovBx, fovBy] = cedisIso.p(2.45 + 0.9, truckRearY + 3.1, 0.04);

  // Depth-sorted 3D items (Painter's Algorithm k = x + y)
  const items = [];

  // 1. Rear-left closed Warehouse Volume (x: 0.6..5.0, y: 0.6..4.3)
  items.push({
    k: 2.8 + 2.4,
    el: (
      <g key="wh-main">
        <Box iso={cedisIso} x={0.6} y={0.6} w={4.4} d={3.7} h={3.5} color="#CBD5E1" top="#E2E8F0" />
        {/* Rooftop Parapet & HVAC Units */}
        <Box iso={cedisIso} x={0.6} y={0.6} w={4.4} d={3.7} h={0.22} z={3.5} color="#1E293B" top="#334155" />
        <Box iso={cedisIso} x={1.2} y={1.2} w={1.1} d={0.9} h={0.42} z={3.72} color="#64748B" />
        <Box iso={cedisIso} x={2.8} y={1.2} w={1.1} d={0.9} h={0.42} z={3.72} color="#64748B" />
        {/* Crimson Architecture Band */}
        <polygon points={faceY(cedisIso, 4.31, 0.6, 5.0, 2.95, 3.28)} fill="#A6192E" />
        <g transform={planeY(cedisIso, 0.85, 4.33, 3.2)}>
          <text fill="#FFFFFF" fontSize="6.5" fontWeight="800" fontFamily={MONO} letterSpacing="0.08em">
            CEDIS ADUANAL CTPAT · ANDENES 01-02
          </text>
        </g>

        {/* DOCK BAY #1 (x: 1.75..3.15, y: 4.31) */}
        <polygon points={faceY(cedisIso, 4.32, 1.72, 3.18, 0.35, 2.55)} fill="#0F172A" />
        {/* Roll-up corrugated door that lifts when truck is docked */}
        <polygon
          points={faceY(cedisIso, 4.33, 1.78, 3.12, 0.38 + dockDoorOpen * 1.75, 2.48)}
          fill="#94A3B8"
          stroke="#475569"
          strokeWidth="0.8"
        />
        {/* Dock #1 Yellow Apron Guides & Rubber Bumpers */}
        <Box iso={cedisIso} x={1.72} y={4.28} w={0.14} d={0.12} h={0.34} color="#0F172A" />
        <Box iso={cedisIso} x={3.04} y={4.28} w={0.14} d={0.12} h={0.34} color="#0F172A" />
        {/* Dock #1 Traffic Light (Red/Green) */}
        <polygon
          points={faceY(cedisIso, 4.33, 3.26, 3.4, 1.6, 1.95)}
          fill={isDocked ? '#10B981' : '#EF4444'}
        />

        {/* DOCK BAY #2 (x: 3.55..4.75, y: 4.31 - closed standby bay) */}
        <polygon points={faceY(cedisIso, 4.32, 3.55, 4.75, 0.35, 2.55)} fill="#1E293B" />
        <polygon
          points={faceY(cedisIso, 4.33, 3.6, 4.7, 0.38, 2.48)}
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth="0.8"
        />
      </g>
    ),
  });

  // 2. Cutaway Warehouse Right Wing Back & Side Walls (x: 5.0..9.6, y: 0.6..4.3)
  items.push({
    k: 7.3 + 0.7,
    el: (
      <g key="wh-cutaway-back">
        {/* Polished concrete interior floor */}
        <polygon points={flat(cedisIso, 5.0, 0.6, 9.6, 4.3, 0.03)} fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        {/* Yellow forklift aisle safety lines (y: 2.35 and y: 3.65) */}
        <polygon points={flat(cedisIso, 5.15, 2.35, 9.4, 2.42, 0.04)} fill="#F59E0B" />
        <polygon points={flat(cedisIso, 5.15, 3.65, 9.4, 3.72, 0.04)} fill="#F59E0B" />
        {/* Back wall of cutaway bay */}
        <Box iso={cedisIso} x={5.0} y={0.6} w={4.6} d={0.22} h={3.5} color="#CBD5E1" top="#1E293B" />
        {/* Right perimeter wall of cutaway bay */}
        <Box iso={cedisIso} x={9.38} y={0.82} w={0.22} d={3.48} h={3.5} color="#CBD5E1" top="#1E293B" />
      </g>
    ),
  });

  // 3. Industrial Pallet Racks inside Cutaway Bay (Row at y: 1.0..1.85, well behind forklift aisle y=2.95)
  [5.4, 6.8, 8.1].forEach((rx, idx) => {
    items.push({
      k: rx + 0.5 + 1.4,
      el: (
        <g key={`rack-${idx}`}>
          {/* Blue steel uprights */}
          <Box iso={cedisIso} x={rx} y={1.05} w={0.08} d={0.75} h={2.5} color="#1E3A8A" />
          <Box iso={cedisIso} x={rx + 0.95} y={1.05} w={0.08} d={0.75} h={2.5} color="#1E3A8A" />
          {/* Orange load beams */}
          <Box iso={cedisIso} x={rx} y={1.05} w={1.03} d={0.75} h={0.08} z={0.95} color="#EA580C" />
          <Box iso={cedisIso} x={rx} y={1.05} w={1.03} d={0.75} h={0.08} z={1.85} color="#EA580C" />
          {/* Export Pallets on Tier 1 & Tier 2 */}
          <Box iso={cedisIso} x={rx + 0.12} y={1.12} w={0.36} d={0.58} h={0.52} z={0.08} color="#D97706" top="#FBBF24" />
          <Box iso={cedisIso} x={rx + 0.54} y={1.12} w={0.36} d={0.58} h={0.48} z={0.08} color="#B45309" top="#F59E0B" />
          <Box iso={cedisIso} x={rx + 0.14} y={1.12} w={0.76} d={0.58} h={0.55} z={1.03} color="#D97706" top="#FBBF24" />
          <Box iso={cedisIso} x={rx + 0.18} y={1.12} w={0.68} d={0.58} h={0.46} z={1.93} color="#92400E" top="#D97706" />
        </g>
      ),
    });
  });

  // 4. Wheeled Forklift inside the clear warehouse aisle (x = forkX, y = 2.98)
  items.push({
    k: forkX + 2.98,
    el: <IsoForklift key="forklift" iso={cedisIso} x={forkX} y={2.98} forkZ={forkZ} />,
  });

  // 5. LPR Checkpoint Booth & Motorized Barrier at y = 5.95 (to the right of the truck lane x = 3.55)
  items.push({
    k: 3.85 + 5.95,
    el: (
      <g key="lpr-gate">
        {/* LPR Camera Totem */}
        <Box iso={cedisIso} x={3.85} y={6.55} w={0.26} d={0.26} h={1.55} color="#0F172A" />
        <Box iso={cedisIso} x={3.8} y={6.5} w={0.36} d={0.36} h={0.22} z={1.55} color="#A6192E" />
        {/* Motorized Barrier Gate extending across the truck lane (x: 3.45 -> 1.45) */}
        <IsoBarrierGate
          iso={cedisIso}
          px={3.45}
          py={5.85}
          armLen={2.05}
          dirX={-1}
          open={barrierOpen}
        />
      </g>
    ),
  });

  // 6. Articulated 53' Freight Truck in Dock Lane #1 (x = 2.45, rearY = truckRearY)
  items.push({
    k: 2.45 + truckRearY + 1.8,
    el: (
      <IsoFreightTruck
        key="freight-truck"
        iso={cedisIso}
        x={2.45}
        rearY={truckRearY}
        docked={isDocked}
        braking={isScanningLpr || isDocked}
      />
    ),
  });

  // 7. Perimeter Trees & Corner PTZ Mast (x = 10.8, y = 9.6)
  items.push({
    k: 11.4 + 2.2,
    el: <Tree key="t1" iso={cedisIso} x={11.4} y={2.2} r={0.75} h={1.5} />,
  });
  items.push({
    k: 11.4 + 5.2,
    el: <Tree key="t2" iso={cedisIso} x={11.4} y={5.2} r={0.78} h={1.6} />,
  });
  items.push({
    k: 10.8 + 9.6,
    el: (
      <g key="ptz-mast">
        <Box iso={cedisIso} x={10.55} y={9.35} w={0.5} d={0.5} h={0.22} color="#475569" />
        <Box iso={cedisIso} x={10.72} y={9.52} w={0.16} d={0.16} h={3.8} z={0.22} color="#1E293B" />
        {/* Yaw-rotating PTZ Dome Head aimed at the freight truck */}
        <OBox
          iso={cedisIso}
          cx={10.8}
          cy={9.6}
          z={3.85}
          len={0.55}
          wid={0.32}
          h={0.28}
          yaw={ptzYaw}
          color="#F8FAFC"
          top="#FFFFFF"
        />
      </g>
    ),
  });

  items.sort((a, b) => a.k - b.k);

  const [trkHudX, trkHudY] = cedisIso.p(2.45, truckRearY + 1.5, 2.25);
  const [forkHudX, forkHudY] = cedisIso.p(forkX, 2.98, 1.65);

  return (
    <div ref={wrapRef} className="prj-iso-scene-wrap">
      <SceneHudHeader
        code="CAM-01 · CEDIS CTPAT · ANDÉN 01"
        status={isDocked ? 'ANDÉN 01 ACOPLADO · SELLO OK' : 'ESCANEO LPR + OCR CONTENEDOR'}
        metric="0 MERMAS"
        t={t}
      />

      <svg className="iso-svg" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid meet">
        <IsoDefs />

        {/* GROUND SLAB & APRON LAYER */}
        <polygon points={flat(cedisIso, 0, 0, 12.6, 11.8, -0.18)} fill="#CBD5E1" />
        <polygon points={faceY(cedisIso, 11.8, 0, 12.6, -0.18, 0)} fill="#94A3B8" />
        <polygon points={faceX(cedisIso, 12.6, 0, 11.8, -0.18, 0)} fill="#64748B" />
        <polygon points={flat(cedisIso, 0, 0, 12.6, 11.8, 0)} fill="#E2E8F0" />

        {/* Heavy-Duty Asphalt Maneuvering Yard */}
        <polygon points={flat(cedisIso, 0.6, 4.3, 10.2, 11.4, 0.01)} fill="#334155" />
        {/* Dock Bay #1 Yellow Reversing Guide Stripes */}
        <polygon points={flat(cedisIso, 1.68, 4.35, 1.76, 10.6, 0.02)} fill="#F59E0B" />
        <polygon points={flat(cedisIso, 3.14, 4.35, 3.22, 10.6, 0.02)} fill="#F59E0B" />
        {/* LPR Stop Line at y = 6.1 */}
        <polygon points={flat(cedisIso, 1.76, 6.08, 3.14, 6.18, 0.022)} fill="#FFFFFF" />

        {/* Ground-plane PTZ Volumetric Tracking Cone */}
        <polygon
          points={`${ptzSx.toFixed(1)},${ptzSy.toFixed(1)} ${fovAx.toFixed(1)},${fovAy.toFixed(1)} ${fovBx.toFixed(1)},${fovBy.toFixed(1)}`}
          fill="url(#iso-fov)"
        />
        <line
          x1={ptzSx}
          y1={ptzSy}
          x2={(fovAx + fovBx) / 2}
          y2={(fovAy + fovBy) / 2}
          stroke="#A6192E"
          strokeWidth="1.1"
          strokeDasharray="4 3"
          opacity="0.75"
        />

        {/* PAINTER'S ALGORITHM SORTED 3D OBJECTS */}
        {items.map((it) => it.el)}

        {/* FOREGROUND TELEMETRY HUD OVERLAYS */}
        <AirRing cx={trkHudX} cy={trkHudY + 18} t={t} period={1.8} maxR={24} color={isDocked ? '#10B981' : '#38BDF8'} />
        <g transform={`translate(${(trkHudX - 66).toFixed(1)},${(trkHudY - 18).toFixed(1)})`}>
          <rect
            width="134"
            height="19"
            rx="4"
            fill="#0F172A"
            fillOpacity="0.92"
            stroke={isDocked ? '#10B981' : '#38BDF8'}
            strokeWidth="1"
          />
          <text x="7" y="12.5" fill="#FFFFFF" fontSize="6.3" fontWeight="800" fontFamily={MONO}>
            {isDocked
              ? 'ANDÉN 01 · SELLO CTPAT OK'
              : isScanningLpr
                ? 'LPR: TR-9482-MX · VERIFICANDO'
                : 'MANIOBRA REVERSA ASISTIDA'}
          </text>
        </g>

        <g transform={`translate(${(forkHudX - 48).toFixed(1)},${(forkHudY - 12).toFixed(1)})`}>
          <rect width="96" height="15" rx="3.5" fill="#FFFFFF" fillOpacity="0.94" stroke="#D97706" strokeWidth="1" />
          <text x="6" y="10.2" fill="#0F172A" fontSize="5.6" fontWeight="800" fontFamily={MONO}>
            MONTACARGAS #04 · RFID OK
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   SCENE 02: TORRE FINANCIERA & BÓVEDA BANCARIA CNBV
   - Cutaway high-security bank floor (12 x 12 grid)
   - Rear-Left: Armored Bank Vault with isometric circular steel vault door
     (rendered via `planeY` so it lies strictly in the isometric wall plane!)
     and internal laser grid.
   - Rear-Right: Encrypted CNBV Server & SOC Control Room behind glass wall.
   - Foreground: 3-Lane Speed-Gate Turnstile Lobby where executives walk down
     dedicated lanes (x = 3.6, 5.6, 7.6), STOP at the optical sensor line
     (y = 8.55), get scanned by the MinMoe biometric terminal, wait for the
     glass wings to retract, and walk cleanly into the secure zone!
   ========================================================================== */
const vaultIso = createIso({ ox: 300, oy: 54, s: 22 });

const VAULT_CAB_X = [2.35, 4.35, 6.35, 8.35];
const VAULT_CAB_W = 0.5;
const VAULT_LANE_X = [3.6, 5.6, 7.6];
const VAULT_WING_Y = 7.35;
const VAULT_STOP_Y = 8.55;

function evalBankWalker(t, offset) {
  const lt = (t + offset) % 10.5;
  const STOP_T = 2.6;
  const OPEN_T = 3.9;
  const END_T = 8.6;
  const startY = 11.1;
  const endY = 4.65;

  let y;
  let moving;
  if (lt < STOP_T) {
    y = lerp(startY, VAULT_STOP_Y, smooth(lt / STOP_T));
    moving = true;
  } else if (lt < OPEN_T) {
    y = VAULT_STOP_Y;
    moving = false;
  } else if (lt < END_T) {
    y = lerp(VAULT_STOP_Y, endY, (lt - OPEN_T) / (END_T - OPEN_T));
    moving = true;
  } else {
    y = endY;
    moving = false;
  }

  const open = clamp01(seg(lt, 3.5, 3.95) - seg(lt, 5.8, 6.4));
  const scanning = lt >= STOP_T - 0.15 && lt < OPEN_T;
  const granted = lt >= 3.45 && lt < 6.4;
  const fade = clamp01(lt / 0.5) * clamp01((END_T - lt) / 0.6);

  return { y, moving, open, scanning, granted, fade };
}

export function FinancialVaultIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 3.8 });

  const walkers = [
    {
      lane: 0,
      x: VAULT_LANE_X[0],
      offset: 0,
      name: 'DIR. TESORERÍA',
      shirt: '#1E293B',
      pants: '#0F172A',
      skin: '#F1C27D',
      hair: '#1E293B',
    },
    {
      lane: 1,
      x: VAULT_LANE_X[1],
      offset: 3.5,
      name: 'AUDITOR CNBV',
      shirt: '#A6192E',
      pants: '#1E293B',
      skin: '#E0AC69',
      hair: '#27272A',
    },
    {
      lane: 2,
      x: VAULT_LANE_X[2],
      offset: 7.0,
      name: 'OFICIAL CUSTODIA',
      shirt: '#0284C7',
      pants: '#0F172A',
      skin: '#F1C27D',
      hair: '#475569',
    },
  ].map((w) => ({ ...w, ...evalBankWalker(t, w.offset) }));

  // Laser grid sweeping vertically inside the vault (z: 0.45..1.85)
  const laserZ = 0.55 + (Math.sin(t * 2.2) + 1) * 0.55;

  const items = [];

  // 1. Rear-Left Armored Bank Vault Room (x: 0.4..5.5, y: 0.4..3.85)
  items.push({
    k: 2.9 + 2.1,
    el: (
      <g key="vault-room">
        {/* Reinforced concrete left & back vault walls */}
        <Box iso={vaultIso} x={0.4} y={0.4} w={5.1} d={0.35} h={3.2} color="#334155" top="#475569" />
        <Box iso={vaultIso} x={0.4} y={0.75} w={0.35} d={3.1} h={3.2} color="#334155" top="#475569" />
        <Box iso={vaultIso} x={5.15} y={0.75} w={0.35} d={3.1} h={3.2} color="#334155" top="#475569" />

        {/* Gold / Bullion Safe Deposit Lockers along the rear wall */}
        {[1.0, 2.2, 3.4].map((bx, idx) => (
          <g key={idx}>
            <Box iso={vaultIso} x={bx} y={0.82} w={0.95} d={0.55} h={2.2} color="#475569" top="#64748B" />
            <polygon
              points={faceY(vaultIso, 1.38, bx + 0.08, bx + 0.87, 0.25, 2.05)}
              fill="#D97706"
              opacity="0.88"
            />
          </g>
        ))}

        {/* Active Laser Beams strictly inside the vault (x: 0.8..5.1, y: 2.3) */}
        {[0.55, 1.15, 1.75].map((lz, idx) => {
          const [lx0, ly0] = vaultIso.p(0.8, 2.4, lz);
          const [lx1, ly1] = vaultIso.p(5.1, 2.4, lz);
          return (
            <line
              key={idx}
              x1={lx0}
              y1={ly0}
              x2={lx1}
              y2={ly1}
              stroke="#EF4444"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              opacity="0.85"
            />
          );
        })}
        {/* Moving vertical scan laser inside the vault */}
        {(() => {
          const [sx0, sy0] = vaultIso.p(0.8, 2.8, laserZ);
          const [sx1, sy1] = vaultIso.p(5.1, 2.8, laserZ);
          return <line x1={sx0} y1={sy0} x2={sx1} y2={sy1} stroke="#F43F5E" strokeWidth="1.8" />;
        })()}

        {/* Front Armored Vault Wall with Isometric Circular Vault Door (y = 3.5..3.85) */}
        <Box iso={vaultIso} x={0.4} y={3.5} w={1.55} d={0.35} h={3.2} color="#475569" top="#64748B" />
        <Box iso={vaultIso} x={3.95} y={3.5} w={1.55} d={0.35} h={3.2} color="#475569" top="#64748B" />
        <Box iso={vaultIso} x={1.95} y={3.5} w={2.0} d={0.35} h={0.65} z={2.55} color="#475569" top="#64748B" />

        {/* ISOMETRIC CIRCULAR VAULT DOOR projected via planeY onto the +Y vault face! */}
        <g transform={planeY(vaultIso, 2.95, 3.87, 1.32)}>
          {/* Outer steel vault frame ring */}
          <circle cx="0" cy="0" r="24" fill="#1E293B" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="19" fill="#334155" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Locking bolts around circumference */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2={Math.cos((deg * Math.PI) / 180) * 18}
              y2={Math.sin((deg * Math.PI) / 180) * 18}
              stroke="#E2E8F0"
              strokeWidth="1.6"
            />
          ))}
          <circle cx="0" cy="0" r="8" fill="#A6192E" stroke="#F8FAFC" strokeWidth="1.5" />
        </g>

        <g transform={planeY(vaultIso, 0.75, 3.88, 2.98)}>
          <text fill="#FFFFFF" fontSize="6" fontWeight="800" fontFamily={MONO} letterSpacing="0.08em">
            BÓVEDA GRADO X · ESCLUSA BIOMÉTRICA
          </text>
        </g>
      </g>
    ),
  });

  // 2. Rear-Right Encrypted CNBV Server & SOC Room (x: 6.1..11.3, y: 0.6..3.85)
  [6.4, 7.6, 8.8, 10.0].forEach((rx, idx) => {
    items.push({
      k: rx + 0.4 + 1.4,
      el: (
        <g key={`srv-${idx}`}>
          <Box iso={vaultIso} x={rx} y={0.85} w={0.88} d={0.95} h={2.45} color="#0F172A" top="#1E293B" />
          {/* Blinking encrypted server blades on +Y front face */}
          {[0.45, 0.85, 1.25, 1.65, 2.05].map((bz, bIdx) => (
            <polygon
              key={bIdx}
              points={faceY(vaultIso, 1.81, rx + 0.12, rx + 0.76, bz, bz + 0.12)}
              fill={(idx + bIdx + Math.floor(t * 3)) % 3 === 0 ? '#10B981' : '#38BDF8'}
            />
          ))}
        </g>
      ),
    });
  });

  // Glass partition in front of the CNBV Server Room (y = 3.75)
  items.push({
    k: 8.7 + 3.75,
    el: (
      <g key="srv-glass">
        <polygon
          points={faceY(vaultIso, 3.75, 6.1, 11.3, 0.05, 2.85)}
          fill="url(#iso-glass-clear)"
          stroke="#38BDF8"
          strokeWidth="1"
        />
        <Box iso={vaultIso} x={6.1} y={3.7} w={5.2} d={0.12} h={0.22} z={2.85} color="#1E293B" />
        <g transform={planeY(vaultIso, 6.45, 3.84, 3.02)}>
          <text fill="#38BDF8" fontSize="5.8" fontWeight="800" fontFamily={MONO} letterSpacing="0.08em">
            CLUSTER AES-256 · RETENCIÓN CNBV 90 DÍAS
          </text>
        </g>
      </g>
    ),
  });

  // 3. Speed-Gate Turnstile Cabinets & Retractable Glass Wings (y: 6.5..7.9)
  VAULT_CAB_X.forEach((cx, i) => {
    const leftWalker = i > 0 ? walkers[i - 1] : null;
    const rightWalker = i < 3 ? walkers[i] : null;
    const activeWalker = rightWalker || leftWalker;
    const accent = activeWalker?.granted
      ? '#10B981'
      : activeWalker?.scanning
        ? '#F59E0B'
        : '#38BDF8';

    // Left & right glass wings attached to this cabinet
    const leftWingLen = leftWalker ? 0.68 * (1 - leftWalker.open * 0.88) : 0;
    const rightWingLen = rightWalker ? 0.68 * (1 - rightWalker.open * 0.88) : 0;

    items.push({
      k: cx + VAULT_CAB_W * 0.5 + 7.2,
      el: (
        <g key={`cab-${i}`}>
          {/* Left wing extending into lane i-1 */}
          {leftWingLen > 0.04 && (
            <polygon
              points={faceY(vaultIso, VAULT_WING_Y, cx - leftWingLen, cx, 0.14, 0.92)}
              fill={leftWalker?.granted ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.26)'}
              stroke={leftWalker?.granted ? '#10B981' : '#EF4444'}
              strokeWidth="1.3"
            />
          )}
          {/* Stainless-Steel Speed Gate Pedestal */}
          <Box
            iso={vaultIso}
            x={cx}
            y={6.45}
            w={VAULT_CAB_W}
            d={1.55}
            h={1.04}
            color="#CBD5E1"
            top="#F8FAFC"
          />
          <Box
            iso={vaultIso}
            x={cx + 0.04}
            y={6.52}
            w={VAULT_CAB_W - 0.08}
            d={1.41}
            h={0.07}
            z={1.04}
            color="#0F172A"
          />
          {/* LED status bar on front of cabinet */}
          <polygon
            points={faceY(vaultIso, 8.01, cx + 0.07, cx + VAULT_CAB_W - 0.07, 0.86, 0.98)}
            fill={accent}
          />
          {/* Gooseneck MinMoe Facial Terminal on Cabinets 0, 1, 2 */}
          {i < 3 && (
            <g>
              <Box
                iso={vaultIso}
                x={cx + 0.19}
                y={7.65}
                w={0.12}
                d={0.12}
                h={0.42}
                z={1.11}
                color="#334155"
              />
              <Box
                iso={vaultIso}
                x={cx + 0.11}
                y={7.6}
                w={0.28}
                d={0.14}
                h={0.44}
                z={1.53}
                color="#0F172A"
              />
              <polygon
                points={faceY(vaultIso, 7.75, cx + 0.14, cx + 0.36, 1.57, 1.93)}
                fill="#0F172A"
                stroke={accent}
                strokeWidth="1"
              />
            </g>
          )}
          {/* Right wing extending into lane i */}
          {rightWingLen > 0.04 && (
            <polygon
              points={faceY(
                vaultIso,
                VAULT_WING_Y,
                cx + VAULT_CAB_W,
                cx + VAULT_CAB_W + rightWingLen,
                0.14,
                0.92
              )}
              fill={rightWalker?.granted ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.26)'}
              stroke={rightWalker?.granted ? '#10B981' : '#EF4444'}
              strokeWidth="1.3"
            />
          )}
        </g>
      ),
    });
  });

  // 4. Executives Walking Through Lanes (Sorted by k = x + y so cabinets properly occlude them!)
  walkers.forEach((w) => {
    if (w.fade <= 0.02) return;
    items.push({
      k: w.x + w.y,
      el: (
        <g key={`walker-${w.lane}`} opacity={w.fade}>
          {(w.scanning || w.granted) && (
            <GroundRing
              iso={vaultIso}
              x={w.x}
              y={w.y}
              t={t}
              maxR={0.95}
              color={w.granted ? '#10B981' : '#F59E0B'}
            />
          )}
          <Person
            iso={vaultIso}
            x={w.x}
            y={w.y}
            heading={-Math.PI / 2}
            moving={w.moving}
            phase={t * 7 + w.lane}
            shirt={w.shirt}
            pants={w.pants}
            skin={w.skin}
            hair={w.hair}
          />
        </g>
      ),
    });
  });

  items.sort((a, b) => a.k - b.k);

  return (
    <div ref={wrapRef} className="prj-iso-scene-wrap">
      <SceneHudHeader
        code="CAM-02 · BÓVEDA & ESCLUSAS CNBV"
        status="RECONOCIMIENTO FACIAL 0.2s"
        metric="AES-256 ACTIVO"
        t={t}
      />

      <svg className="iso-svg" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid meet">
        <IsoDefs />

        {/* MARBLE BANK FLOOR & CUTAWAY WALLS */}
        <polygon points={flat(vaultIso, 0, 0, 11.8, 11.6, -0.18)} fill="#CBD5E1" />
        <polygon points={faceY(vaultIso, 11.6, 0, 11.8, -0.18, 0)} fill="#94A3B8" />
        <polygon points={faceX(vaultIso, 11.8, 0, 11.6, -0.18, 0)} fill="#64748B" />
        <polygon points={flat(vaultIso, 0, 0, 11.8, 11.6, 0)} fill="#F1F5F9" />

        {/* Subtle Marble Tile Grid */}
        {Array.from({ length: 11 }).map((_, r) =>
          Array.from({ length: 11 }).map((__, c) =>
            (r + c) % 2 === 0 ? (
              <polygon
                key={`${r}-${c}`}
                points={flat(vaultIso, c, r, c + 1, r + 1, 0.005)}
                fill="#E2E8F0"
                opacity="0.55"
              />
            ) : null
          )
        )}

        {/* Lane Guidance Carpets & Optical Stop Lines */}
        {VAULT_LANE_X.map((lx, idx) => (
          <g key={idx}>
            <polygon
              points={flat(vaultIso, lx - 0.55, 5.2, lx + 0.55, 11.2, 0.012)}
              fill="#CBD5E1"
              opacity="0.45"
            />
            <polygon
              points={flat(vaultIso, lx - 0.5, VAULT_STOP_Y + 0.25, lx + 0.5, VAULT_STOP_Y + 0.34, 0.018)}
              fill="#F59E0B"
            />
          </g>
        ))}

        {/* PAINTER'S ALGORITHM SORTED 3D OBJECTS */}
        {items.map((it) => it.el)}

        {/* FOREGROUND BIOMETRIC TELEMETRY BOXES */}
        {walkers.map((w) => {
          if (w.fade <= 0.1 || (!w.scanning && !w.granted)) return null;
          const rect = personRect(vaultIso, w.x, w.y);
          return (
            <DetectBox
              key={`det-${w.lane}`}
              x={rect.x}
              y={rect.y}
              w={rect.w}
              h={rect.h}
              color={w.granted ? '#10B981' : '#F59E0B'}
              label={w.name}
              sub={w.granted ? 'ACCESO CONCEDIDO · 99.8%' : 'VERIFICANDO PLANTILLA'}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ==========================================================================
   SCENE 03: PLANTA AUTOMOTRIZ & SUBESTACIÓN TÉRMICA
   - Back-Left: Sawtooth Industrial Assembly Plant with wide cutaway bay
     showing elevated conveyor rail + vehicle body-in-white moving smoothly
     between robotic stations with full vertical clearance.
   - Back-Right: High-Voltage Electrical Substation Yard with 2 detailed
     3-phase transformers, radiator banks, and porcelain HV bushings.
   - Center-Right: Tall Bi-Spectral Thermal Mast (8.6, 7.2) with yaw-tracking
     camera head sweeping a ground-clipped thermal cone across the transformers.
   - Foreground-Left: STPS Employee Walkway & Biometric Turnstile Portal where
     operators pause for verification before entering the plant floor.
   ========================================================================== */
const plantIso = createIso({ ox: 294, oy: 64, s: 20.5 });

export function AutomotivePlantIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 4.5 });

  // Assembly line car chassis moving along elevated conveyor (x: 1.5 -> 6.4, y: 2.85)
  const chassisProgress = (t * 0.14) % 1;
  const chassisX = lerp(1.5, 6.2, chassisProgress);
  const chassisFade = clamp01(chassisProgress / 0.1) * clamp01((1 - chassisProgress) / 0.1);

  // Thermal camera mast at (8.5, 7.2, z=3.75) sweeping between Transformer #1 and Transformer #2
  const targetTx = 10.6;
  const targetTy = 2.6 + Math.sin(t * 1.15) * 1.1;
  const camYaw = Math.atan2(targetTy - 7.2, targetTx - 8.5);
  const [camSx, camSy] = plantIso.p(8.5, 7.2, 3.75);
  const [thAx, thAy] = plantIso.p(9.4, targetTy - 0.85, 0.05);
  const [thBx, thBy] = plantIso.p(11.8, targetTy + 0.85, 0.05);
  const [txHudX, txHudY] = plantIso.p(10.6, targetTy, 2.25);

  // Operator walking along foreground STPS walkway (y = 8.8, x: 1.2 -> 7.2), pausing at x = 4.2
  const opLt = t % 9.5;
  let opX;
  let opMoving;
  if (opLt < 2.8) {
    opX = lerp(1.2, 3.85, smooth(opLt / 2.8));
    opMoving = true;
  } else if (opLt < 4.2) {
    opX = 3.85;
    opMoving = false;
  } else if (opLt < 8.4) {
    opX = lerp(3.85, 7.2, (opLt - 4.2) / 4.2);
    opMoving = true;
  } else {
    opX = 7.2;
    opMoving = false;
  }
  const opGranted = opLt >= 3.8 && opLt < 6.5;
  const opScanning = opLt >= 2.7 && opLt < 3.8;
  const opGateOpen = clamp01(seg(opLt, 3.8, 4.2) - seg(opLt, 5.8, 6.3));
  const opFade = clamp01(opLt / 0.5) * clamp01((8.4 - opLt) / 0.6);

  const items = [];

  // 1. Back-Left Assembly Plant Structure (x: 0.6..7.8, y: 0.6..4.5)
  items.push({
    k: 4.2 + 1.2,
    el: (
      <g key="plant-shell">
        {/* Interior epoxy floor */}
        <polygon points={flat(plantIso, 0.6, 0.6, 7.8, 4.5, 0.03)} fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        {/* Back & Left Structural Walls */}
        <Box iso={plantIso} x={0.6} y={0.6} w={7.2} d={0.28} h={3.5} color="#CBD5E1" top="#334155" />
        <Box iso={plantIso} x={0.6} y={0.88} w={0.28} d={3.62} h={3.5} color="#CBD5E1" top="#334155" />
        <Box iso={plantIso} x={7.52} y={0.88} w={0.28} d={3.62} h={3.5} color="#CBD5E1" top="#334155" />
        {/* High Cutaway Front Header Beam (z = 2.85..3.5, well above conveyor & robots!) */}
        <Box iso={plantIso} x={0.6} y={4.22} w={7.2} d={0.28} h={0.65} z={2.85} color="#1E293B" top="#334155" />
        <polygon points={faceY(plantIso, 4.51, 0.6, 7.8, 2.92, 3.18)} fill="#A6192E" />
        <g transform={planeY(plantIso, 0.95, 4.53, 3.12)}>
          <text fill="#FFFFFF" fontSize="6.2" fontWeight="800" fontFamily={MONO} letterSpacing="0.08em">
            NAVE ENSAMBLE AUTOMOTRIZ · TELEMETRÍA SCADA
          </text>
        </g>

        {/* Continuous Elevated Conveyor Track Bed inside the plant (y: 2.55..3.25) */}
        <Box iso={plantIso} x={1.1} y={2.55} w={6.2} d={0.7} h={0.28} z={0.03} color="#334155" top="#475569" />
        {/* Yellow Conveyor Guide Rails */}
        <polygon points={flat(plantIso, 1.1, 2.52, 7.3, 2.58, 0.32)} fill="#F59E0B" />
        <polygon points={flat(plantIso, 1.1, 3.22, 7.3, 3.28, 0.32)} fill="#F59E0B" />

        {/* 2 Robotic Welding Pedestals positioned behind the conveyor (y = 1.45, never blocking the car!) */}
        {[2.8, 5.1].map((rx, idx) => (
          <g key={idx}>
            <Box iso={plantIso} x={rx} y={1.35} w={0.55} d={0.55} h={0.35} z={0.03} color="#1E293B" />
            <Box iso={plantIso} x={rx + 0.12} y={1.47} w={0.3} d={0.3} h={1.25} z={0.38} color="#EA580C" top="#F97316" />
            {/* Articulated boom reaching out over the conveyor at z = 1.65 (above car height 1.15) */}
            <Box iso={plantIso} x={rx + 0.14} y={1.55} w={0.24} d={1.15} h={0.2} z={1.55} color="#F97316" />
          </g>
        ))}
      </g>
    ),
  });

  // 2. Moving Car Body-in-White on the Conveyor Track (y = 2.62, z = 0.32)
  items.push({
    k: chassisX + 2.9,
    el: (
      <g key="conveyor-car" opacity={chassisFade}>
        {/* Conveyor skid */}
        <Box iso={plantIso} x={chassisX} y={2.6} w={1.15} d={0.6} h={0.08} z={0.31} color="#94A3B8" />
        {/* Lower vehicle body shell */}
        <Box iso={plantIso} x={chassisX + 0.05} y={2.64} w={1.05} d={0.52} h={0.36} z={0.39} color="#CBD5E1" top="#F8FAFC" />
        {/* Upper cabin greenhouse */}
        <Box iso={plantIso} x={chassisX + 0.26} y={2.68} w={0.58} d={0.44} h={0.3} z={0.75} color="#94A3B8" top="#E2E8F0" />
      </g>
    ),
  });

  // 3. Back-Right High-Voltage Electrical Substation Yard (x: 8.6..12.2, y: 0.8..5.0)
  [1.35, 3.25].forEach((ty, idx) => {
    items.push({
      k: 10.4 + ty + 0.6,
      el: (
        <g key={`transformer-${idx}`}>
          {/* Concrete blast pad */}
          <Box iso={plantIso} x={9.3} y={ty} w={2.2} d={1.35} h={0.14} color="#94A3B8" top="#CBD5E1" />
          {/* Main Transformer Oil Tank */}
          <Box iso={plantIso} x={9.55} y={ty + 0.18} w={1.45} d={0.95} h={1.55} z={0.14} color="#334155" top="#475569" />
          {/* Cooling Radiator Fin Banks on Left & Right */}
          <Box iso={plantIso} x={9.35} y={ty + 0.26} w={0.2} d={0.78} h={1.25} z={0.22} color="#1E293B" />
          <Box iso={plantIso} x={11.0} y={ty + 0.26} w={0.2} d={0.78} h={1.25} z={0.22} color="#1E293B" />
          {/* 3 High-Voltage Porcelain Bushings on Top */}
          {[9.78, 10.22, 10.66].map((bx, bIdx) => (
            <Box
              key={bIdx}
              iso={plantIso}
              x={bx}
              y={ty + 0.55}
              w={0.14}
              d={0.14}
              h={0.58}
              z={1.69}
              color="#78350F"
              top="#F59E0B"
            />
          ))}
          {/* Thermal Heat Glow on Front of Transformer */}
          <polygon
            points={faceY(plantIso, ty + 1.14, 9.65, 10.9, 0.35, 1.5)}
            fill="url(#iso-heat)"
            opacity={0.55 + Math.sin(t * 2.5 + idx) * 0.2}
          />
        </g>
      ),
    });
  });

  // 4. Bi-Spectral Thermal Camera Mast at (8.5, 7.2)
  items.push({
    k: 8.5 + 7.2,
    el: (
      <g key="thermal-mast">
        <Box iso={plantIso} x={8.25} y={6.95} w={0.5} d={0.5} h={0.22} color="#475569" />
        <Box iso={plantIso} x={8.42} y={7.12} w={0.16} d={0.16} h={3.65} z={0.22} color="#1E293B" />
        <OBox
          iso={plantIso}
          cx={8.5}
          cy={7.2}
          z={3.72}
          len={0.58}
          wid={0.34}
          h={0.28}
          yaw={camYaw}
          color="#A6192E"
          top="#F8FAFC"
        />
      </g>
    ),
  });

  // 5. Foreground STPS Biometric Turnstile Gatehouse on the Pedestrian Walkway (x = 4.35, y = 8.75)
  items.push({
    k: 4.35 + 8.35,
    el: (
      <g key="stps-portal-back">
        {/* Back cabinet of pedestrian turnstile */}
        <Box iso={plantIso} x={4.15} y={8.05} w={0.65} d={0.35} h={1.05} color="#CBD5E1" top="#F8FAFC" />
        <Box iso={plantIso} x={4.35} y={8.12} w={0.18} d={0.18} h={0.48} z={1.05} color="#0F172A" />
        <polygon
          points={faceX(plantIso, 4.34, 8.14, 8.28, 1.12, 1.48)}
          fill={opGranted ? '#10B981' : opScanning ? '#F59E0B' : '#38BDF8'}
        />
      </g>
    ),
  });

  // 6. Operator Walking Along Pedestrian Path (y = 8.85, x = opX)
  if (opFade > 0.02) {
    items.push({
      k: opX + 8.85,
      el: (
        <g key="plant-operator" opacity={opFade}>
          {(opScanning || opGranted) && (
            <GroundRing
              iso={plantIso}
              x={opX}
              y={8.85}
              t={t}
              maxR={0.95}
              color={opGranted ? '#10B981' : '#F59E0B'}
            />
          )}
          <Person
            iso={plantIso}
            x={opX}
            y={8.85}
            heading={0}
            moving={opMoving}
            phase={t * 6.8}
            shirt="#F97316"
            pants="#1E293B"
            cap="#FACC15"
          />
        </g>
      ),
    });
  }

  // 7. Front cabinet of pedestrian turnstile + retracting glass wing (y = 9.25, in front of operator!)
  items.push({
    k: 4.35 + 9.35,
    el: (
      <g key="stps-portal-front">
        {1 - opGateOpen > 0.06 && (
          <polygon
            points={faceX(plantIso, 4.45, 8.42, 8.42 + (1 - opGateOpen) * 0.78, 0.14, 0.92)}
            fill={opGranted ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.28)'}
            stroke={opGranted ? '#10B981' : '#EF4444'}
            strokeWidth="1.3"
          />
        )}
        <Box iso={plantIso} x={4.15} y={9.22} w={0.65} d={0.35} h={1.05} color="#CBD5E1" top="#F8FAFC" />
      </g>
    ),
  });

  items.sort((a, b) => a.k - b.k);

  const opRect = personRect(plantIso, opX, 8.85);

  return (
    <div ref={wrapRef} className="prj-iso-scene-wrap">
      <SceneHudHeader
        code="CAM-03 · SUBESTACIÓN TÉRMICA 115kV"
        status="TERMOGRAFÍA BI-ESPECTRAL"
        metric="58.4°C NOMINAL"
        t={t}
      />

      <svg className="iso-svg" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid meet">
        <IsoDefs />

        {/* INDUSTRIAL CAMPUS GROUND SLAB */}
        <polygon points={flat(plantIso, 0, 0, 12.6, 11.6, -0.18)} fill="#CBD5E1" />
        <polygon points={faceY(plantIso, 11.6, 0, 12.6, -0.18, 0)} fill="#94A3B8" />
        <polygon points={faceX(plantIso, 12.6, 0, 11.6, -0.18, 0)} fill="#64748B" />
        <polygon points={flat(plantIso, 0, 0, 12.6, 11.6, 0)} fill="#E2E8F0" />

        {/* Substation Crushed Gravel Pad (x: 8.6..12.2, y: 0.8..5.2) */}
        <polygon
          points={flat(plantIso, 8.6, 0.8, 12.2, 5.2, 0.015)}
          fill="#94A3B8"
          stroke="#F59E0B"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />

        {/* Foreground STPS Pedestrian Safety Walkway (y: 8.2..9.5) */}
        <polygon points={flat(plantIso, 0.8, 8.2, 7.8, 9.5, 0.015)} fill="#CBD5E1" />
        <polygon points={flat(plantIso, 0.8, 8.15, 7.8, 8.22, 0.02)} fill="#F59E0B" />
        <polygon points={flat(plantIso, 0.8, 9.48, 7.8, 9.55, 0.02)} fill="#F59E0B" />

        {/* Ground-Clipped Bi-Spectral Thermal Cone */}
        <polygon
          points={`${camSx.toFixed(1)},${camSy.toFixed(1)} ${thAx.toFixed(1)},${thAy.toFixed(1)} ${thBx.toFixed(1)},${thBy.toFixed(1)}`}
          fill="url(#iso-fov)"
        />
        <line
          x1={camSx}
          y1={camSy}
          x2={txHudX}
          y2={txHudY + 22}
          stroke="#EF4444"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />

        {/* PAINTER'S ALGORITHM SORTED 3D OBJECTS */}
        {items.map((it) => it.el)}

        {/* FOREGROUND THERMAL & STPS TELEMETRY */}
        <AirRing cx={txHudX} cy={txHudY + 14} t={t} period={1.5} maxR={22} color="#F59E0B" />
        <g transform={`translate(${(txHudX - 58).toFixed(1)},${(txHudY - 16).toFixed(1)})`}>
          <rect width="118" height="18" rx="4" fill="#0F172A" fillOpacity="0.92" stroke="#F59E0B" strokeWidth="1" />
          <text x="7" y="12" fill="#FEF08A" fontSize="6.1" fontWeight="800" fontFamily={MONO}>
            DEVANADO HV · 58.4°C OK
          </text>
        </g>

        {opFade > 0.15 && (opScanning || opGranted) && (
          <DetectBox
            x={opRect.x}
            y={opRect.y}
            w={opRect.w}
            h={opRect.h}
            color={opGranted ? '#10B981' : '#F59E0B'}
            label="OPERADOR PLANTA · EPP OK"
            sub={opGranted ? 'BITÁCORA STPS REGISTRADA' : 'ESCANEANDO CASCO + ROSTRO'}
          />
        )}
      </svg>
    </div>
  );
}

/* ==========================================================================
   SCENE 04: MACRO-PRIVADA RESIDENCIAL & DOBLE CARRIL UHF / QR
   - Two-lane residential avenue along Y:
     - Lane 1 (x = 3.35, Residentes TAG UHF 900MHz): Vehicle approaches from
       y = 11.4; overhead UHF reader detects tag at y = 9.6; barrier arm at
       y = 7.2 lifts to 82° BEFORE the vehicle arrives (y = 7.8) and stays
       open until the vehicle clears y = 4.6!
     - Central Landscaped Island (x: 4.65..6.35): Guardhouse & C4 Monitoring Booth.
     - Lane 2 (x = 7.65, Visitas QR SIP 2.0): Visitor vehicle approaches from
       y = 11.4, STOPS completely at STOP_Y = 8.75 in front of the SIP 2.0
       Intercom Totem and closed barrier (y = 7.2), waits while the QR code
       is validated, and only drives through AFTER the visitor barrier opens!
   ========================================================================== */
const resIso = createIso({ ox: 296, oy: 60, s: 20.5 });

export function ResidentialBoulevardIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 3.4 });

  // LANE 1: Resident UHF Fast-Pass (9.5s cycle, no stopping required, barrier opens early!)
  const resLt = t % 9.5;
  const resProgress = clamp01(resLt / 8.2);
  const resY = lerp(11.3, 0.8, resProgress);
  // Barrier opens when car is between y=9.8 and y=4.6 (resLt 1.1s .. 5.4s)
  const resBarrierOpen = clamp01(seg(resLt, 1.0, 1.7) - seg(resLt, 5.2, 6.0));
  const resTagReading = resLt >= 0.8 && resLt <= 3.8;
  const resFade = clamp01(resLt / 0.5) * clamp01((8.2 - resLt) / 0.6);

  // LANE 2: Visitor QR SIP 2.0 (12s cycle, STOPS at y = 8.85 until barrier opens!)
  const visLt = (t + 2.2) % 12.0;
  const VIS_STOP_Y = 8.85;
  let visY;
  let visBraking = false;
  if (visLt < 2.8) {
    visY = lerp(11.4, VIS_STOP_Y, smooth(visLt / 2.8));
    visBraking = visLt > 1.8;
  } else if (visLt < 5.6) {
    visY = VIS_STOP_Y;
    visBraking = true;
  } else if (visLt < 10.6) {
    visY = lerp(VIS_STOP_Y, 0.8, easeInOut((visLt - 5.6) / 5.0));
    visBraking = false;
  } else {
    visY = 0.8;
  }
  const visScanning = visLt >= 2.6 && visLt < 4.8;
  const visGranted = visLt >= 4.8 && visLt < 8.0;
  const visBarrierOpen = clamp01(seg(visLt, 4.8, 5.5) - seg(visLt, 8.2, 9.0));
  const visFade = clamp01(visLt / 0.5) * clamp01((10.6 - visLt) / 0.6);

  const items = [];

  // 1. Interior Luxury Residences in the Background (y: 0.7..3.4, outside the road lanes)
  items.push({
    k: 1.2 + 2.0,
    el: (
      <g key="villa-left">
        <Box iso={resIso} x={0.5} y={0.8} w={1.4} d={2.2} h={2.2} color="#F8FAFC" top="#CBD5E1" />
        <polygon points={faceX(resIso, 1.91, 1.0, 2.7, 0.2, 1.8)} fill="url(#iso-glass-warm)" />
        <Tree iso={resIso} x={1.2} y={3.8} r={0.68} h={1.35} />
      </g>
    ),
  });
  items.push({
    k: 10.6 + 2.0,
    el: (
      <g key="villa-right">
        <Box iso={resIso} x={9.6} y={0.8} w={2.2} d={2.2} h={2.35} color="#F8FAFC" top="#CBD5E1" />
        <polygon points={faceY(resIso, 3.01, 9.8, 11.5, 0.2, 1.9)} fill="url(#iso-glass-warm)" />
        <Tree iso={resIso} x={10.5} y={4.2} r={0.74} h={1.45} />
      </g>
    ),
  });

  // 2. Central Architectural Guardhouse on the Median Island (x: 4.75..6.25, y: 5.2..7.5)
  items.push({
    k: 5.5 + 6.4,
    el: (
      <g key="guardhouse">
        {/* Raised stone island curb */}
        <Box iso={resIso} x={4.6} y={4.6} w={1.8} d={3.8} h={0.14} color="#CBD5E1" top="#E2E8F0" />
        {/* Guardhouse volume */}
        <Box iso={resIso} x={4.8} y={5.3} w={1.4} d={2.1} h={2.45} z={0.14} color="#1E293B" top="#334155" />
        {/* Panoramic guard windows on Front (+Y) and Sides (+X) */}
        <polygon points={faceY(resIso, 7.41, 4.92, 6.08, 0.95, 2.15)} fill="url(#iso-glass-tint)" />
        <polygon points={faceX(resIso, 6.21, 5.5, 7.2, 0.95, 2.15)} fill="url(#iso-glass-tint)" />
        {/* High-Clearance Architectural Canopy Roof (z = 2.6..2.95, well above cars z=1.05!) */}
        <Box iso={resIso} x={1.85} y={5.6} w={7.3} d={1.6} h={0.32} z={2.6} color="#0F172A" top="#1E293B" />
        <polygon points={faceY(resIso, 7.21, 1.85, 9.15, 2.66, 2.86)} fill="#A6192E" />
        <g transform={planeY(resIso, 2.45, 7.23, 2.82)}>
          <text fill="#FFFFFF" fontSize="5.8" fontWeight="800" fontFamily={MONO} letterSpacing="0.08em">
            ACCESO UHF 900MHz · INTERFONÍA QR SIP 2.0
          </text>
        </g>
        {/* Outer Curb Support Columns (x = 1.85 and x = 8.95, completely outside road lanes!) */}
        <Box iso={resIso} x={1.85} y={6.2} w={0.24} d={0.24} h={2.6} color="#334155" />
        <Box iso={resIso} x={8.91} y={6.2} w={0.24} d={0.24} h={2.6} color="#334155" />
        {/* Overhead UHF 900MHz Long-Range Reader mounted under Lane 1 canopy */}
        <Box iso={resIso} x={3.15} y={7.05} w={0.42} d={0.18} h={0.22} z={2.38} color="#F8FAFC" />
      </g>
    ),
  });

  // 3. Lane 1 Motorized Barrier Gate at y = 7.15 (pedestal on median x = 4.45, arm extends to x = 2.45)
  items.push({
    k: 3.5 + 7.15,
    el: (
      <IsoBarrierGate
        key="barrier-uhf"
        iso={resIso}
        px={4.35}
        py={7.05}
        armLen={1.95}
        dirX={-1}
        open={resBarrierOpen}
        accent="#10B981"
      />
    ),
  });

  // 4. Lane 2 Motorized Barrier Gate at y = 7.15 (pedestal on median x = 6.25, arm extends to x = 8.25)
  items.push({
    k: 7.2 + 7.15,
    el: (
      <IsoBarrierGate
        key="barrier-qr"
        iso={resIso}
        px={6.25}
        py={7.05}
        armLen={1.95}
        dirX={1}
        open={visBarrierOpen}
        accent="#38BDF8"
      />
    ),
  });

  // 5. Visitor SIP 2.0 QR Intercom Totem on the Right Curb at (8.85, 8.55)
  items.push({
    k: 8.85 + 8.55,
    el: (
      <g key="sip-totem">
        <Box iso={resIso} x={8.75} y={8.45} w={0.32} d={0.32} h={1.38} color="#0F172A" top="#1E293B" />
        <polygon
          points={faceY(resIso, 8.78, 8.8, 9.02, 0.88, 1.26)}
          fill={visGranted ? '#10B981' : visScanning ? '#38BDF8' : '#A6192E'}
        />
      </g>
    ),
  });

  // 6. Lane 1 Resident Vehicle (x = 3.35, y = resY)
  if (resFade > 0.02) {
    items.push({
      k: 3.35 + resY,
      el: (
        <g key="car-res" opacity={resFade}>
          <Car
            iso={resIso}
            x={3.35}
            y={resY}
            yaw={-Math.PI / 2}
            color="#1E293B"
            lights={true}
          />
        </g>
      ),
    });
  }

  // 7. Lane 2 Visitor Vehicle (x = 7.65, y = visY)
  if (visFade > 0.02) {
    items.push({
      k: 7.65 + visY,
      el: (
        <g key="car-vis" opacity={visFade}>
          {(visScanning || visGranted) && (
            <GroundRing
              iso={resIso}
              x={7.65}
              y={visY}
              t={t}
              maxR={1.45}
              color={visGranted ? '#10B981' : '#38BDF8'}
            />
          )}
          <Car
            iso={resIso}
            x={7.65}
            y={visY}
            yaw={-Math.PI / 2}
            color="#E2E8F0"
            lights={true}
            brake={visBraking}
          />
        </g>
      ),
    });
  }

  // 8. Foreground Landscaping
  items.push({
    k: 1.1 + 9.2,
    el: <Tree key="tr-fg-l" iso={resIso} x={1.1} y={9.2} r={0.78} h={1.55} />,
  });
  items.push({
    k: 10.6 + 9.4,
    el: <Tree key="tr-fg-r" iso={resIso} x={10.6} y={9.4} r={0.82} h={1.6} />,
  });
  items.push({
    k: 5.5 + 9.4,
    el: <Bush key="bush-med" iso={resIso} x={5.5} y={9.4} r={0.48} h={0.42} />,
  });

  items.sort((a, b) => a.k - b.k);

  const [uhfAntX, uhfAntY] = resIso.p(3.35, 7.15, 2.45);
  const [resCarFrontX, resCarFrontY] = resIso.p(3.35, resY - 0.5, 0.85);
  const resRect = carRect(resIso, 3.35, resY);
  const visRect = carRect(resIso, 7.65, visY);

  return (
    <div ref={wrapRef} className="prj-iso-scene-wrap">
      <SceneHudHeader
        code="CAM-04 · PÓRTICO RESIDENCIAL DOBLE CARRIL"
        status="TAG UHF 8M + QR SIP 2.0"
        metric="1.8s CRUCE"
        t={t}
      />

      <svg className="iso-svg" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid meet">
        <IsoDefs />

        {/* BOULEVARD BASE & LANDSCAPING */}
        <polygon points={flat(resIso, 0, 0, 12.2, 11.8, -0.18)} fill="#CBD5E1" />
        <polygon points={faceY(resIso, 11.8, 0, 12.2, -0.18, 0)} fill="#94A3B8" />
        <polygon points={faceX(resIso, 12.2, 0, 11.8, -0.18, 0)} fill="#64748B" />
        <polygon points={flat(resIso, 0, 0, 12.2, 11.8, 0)} fill="#DCE7DC" />

        {/* Lane 1: Resident UHF Asphalt Roadway (x: 2.2..4.55) */}
        <polygon points={flat(resIso, 2.2, 0.4, 4.55, 11.6, 0.012)} fill="#334155" />
        {/* Lane 2: Visitor QR Asphalt Roadway (x: 6.45..8.8) */}
        <polygon points={flat(resIso, 6.45, 0.4, 8.8, 11.6, 0.012)} fill="#334155" />
        {/* Visitor Stop Line at y = 7.75 */}
        <polygon points={flat(resIso, 6.55, 7.65, 8.7, 7.78, 0.02)} fill="#F59E0B" />

        {/* PAINTER'S ALGORITHM SORTED 3D OBJECTS */}
        {items.map((it) => it.el)}

        {/* UHF 900MHz RF Beam Line when Resident Vehicle is in read zone */}
        {resTagReading && resFade > 0.2 && (
          <>
            <line
              x1={uhfAntX}
              y1={uhfAntY}
              x2={resCarFrontX}
              y2={resCarFrontY}
              stroke="#10B981"
              strokeWidth="1.6"
              strokeDasharray="4 3"
            />
            <AirRing cx={resCarFrontX} cy={resCarFrontY} t={t} period={1.2} maxR={20} color="#10B981" />
          </>
        )}

        {/* FOREGROUND VEHICLE DETECTION BOXES */}
        {resTagReading && resFade > 0.2 && (
          <DetectBox
            x={resRect.x}
            y={resRect.y}
            w={resRect.w}
            h={resRect.h}
            color="#10B981"
            label="RESIDENTE · TAG UHF OK"
            sub="APERTURA ANTICIPADA 8M"
          />
        )}

        {(visScanning || visGranted) && visFade > 0.2 && (
          <DetectBox
            x={visRect.x}
            y={visRect.y}
            w={visRect.w}
            h={visRect.h}
            color={visGranted ? '#10B981' : '#38BDF8'}
            label={visGranted ? 'VISITA AUTORIZADA · QR OK' : 'VALIDANDO QR TEMPORAL'}
            sub={visGranted ? 'CASA 104 · BARRERA ABIERTA' : 'INTERFONO SIP 2.0 ACTIVO'}
          />
        )}
      </svg>
    </div>
  );
}

/* ==========================================================================
   SCENE 05: CENTRO HOSPITALARIO & ESCLUSAS ZERO-TOUCH COFEPRIS
   - Left/Center Wing (x: 0.6..8.2, y: 0.6..9.6):
     - Rear Sterile Zone (y: 0.6..4.8): Operating Theater (left) with surgical
       table & shadowless lamp + COFEPRIS Cold-Chain Pharmacy (right) with
       monitored vaccine refrigerators (-4.0°C).
     - Middle Hermetic Airlock Wall (y = 4.8): Solid side walls with a central
       sliding glass airlock (x: 3.1..5.5). Doors slide strictly into the wall
       pockets (never protruding outside x: 0.6..8.2!).
     - Surgeon in medical scrubs walks up x = 4.3 from y = 8.9, STOPS at
       y = 5.85 in front of the closed airlock while the contactless facial/mask
       reader scans, waits for the glass doors to slide open, and walks cleanly
       into the sterile surgical corridor!
   - Right Wing (x: 8.8..12.2):
     - Dedicated Emergency Ambulance Driveway with a wheeled Ambulance that
       drives in from y = 11.2, parks under the Emergency Triage Canopy at
       y = 3.6 with flashing emergency beacons, and then departs cleanly.
   ========================================================================== */
const hospIso = createIso({ ox: 294, oy: 62, s: 20.5 });

export function HospitalBiosecurityIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 4.8 });

  // Surgeon Choreography (10.5s cycle):
  // 0.0..2.8s: Walks from y = 8.9 to STOP_Y = 5.85 (in front of airlock at y = 4.85)
  // 2.8..4.2s: Stops at y = 5.85; contactless infrared + facial-with-mask scan runs
  // 3.8..4.4s: Hermetic glass doors slide open into wall pockets (doorOpen: 0 -> 1)
  // 4.2..8.2s: Surgeon walks cleanly through open doorway (y = 5.85 -> 2.15)
  // 6.4..7.1s: Hermetic doors close behind surgeon
  const docLt = t % 10.5;
  const DOC_STOP_Y = 5.85;
  let docY;
  let docMoving;
  if (docLt < 2.8) {
    docY = lerp(8.9, DOC_STOP_Y, smooth(docLt / 2.8));
    docMoving = true;
  } else if (docLt < 4.2) {
    docY = DOC_STOP_Y;
    docMoving = false;
  } else if (docLt < 8.2) {
    docY = lerp(DOC_STOP_Y, 2.15, (docLt - 4.2) / 4.0);
    docMoving = true;
  } else {
    docY = 2.15;
    docMoving = false;
  }

  const docScanning = docLt >= 2.6 && docLt < 4.0;
  const docGranted = docLt >= 3.8 && docLt < 6.8;
  const doorOpen = clamp01(seg(docLt, 3.7, 4.3) - seg(docLt, 6.4, 7.1));
  const docFade = clamp01(docLt / 0.5) * clamp01((8.2 - docLt) / 0.6);

  // Ambulance Choreography along the Right Emergency Driveway (x = 10.35, 12s cycle)
  const ambLt = t % 12.0;
  let ambFrontY;
  if (ambLt < 3.4) {
    ambFrontY = lerp(8.8, 3.85, easeInOut(ambLt / 3.4));
  } else if (ambLt < 8.4) {
    ambFrontY = 3.85;
  } else if (ambLt < 11.4) {
    ambFrontY = lerp(3.85, 8.8, easeInOut((ambLt - 8.4) / 3.0));
  } else {
    ambFrontY = 8.8;
  }
  const ambParked = ambLt >= 3.3 && ambLt <= 8.5;

  const items = [];

  // 1. Rear Sterile Wing Perimeter Walls (x: 0.6..8.2, y: 0.6..4.8)
  items.push({
    k: 4.4 + 1.0,
    el: (
      <g key="hosp-rear-walls">
        {/* Clinical sterile blue-white floor */}
        <polygon points={flat(hospIso, 0.6, 0.6, 8.2, 4.85, 0.02)} fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1" />
        {/* Back & Left Sterile Walls */}
        <Box iso={hospIso} x={0.6} y={0.6} w={7.6} d={0.26} h={3.3} color="#F8FAFC" top="#E2E8F0" />
        <Box iso={hospIso} x={0.6} y={0.86} w={0.26} d={8.4} h={3.3} color="#F8FAFC" top="#E2E8F0" />
        <Box iso={hospIso} x={7.94} y={0.86} w={0.26} d={8.4} h={3.3} color="#F8FAFC" top="#E2E8F0" />

        {/* Left Rear: Operating Theater Surgical Table & Shadowless Lamp (x: 1.3..3.1, y: 1.5..2.8) */}
        <Box iso={hospIso} x={1.65} y={1.85} w={1.35} d={0.65} h={0.68} z={0.03} color="#0284C7" top="#38BDF8" />
        <Box iso={hospIso} x={2.15} y={2.05} w={0.35} d={0.35} h={0.14} z={2.35} color="#F8FAFC" top="#FEF08A" />

        {/* Right Rear: COFEPRIS Cold-Chain Vaccine Refrigerators (x: 5.2..7.6, y: 0.95..1.85) */}
        {[5.35, 6.55].map((fx, idx) => (
          <g key={idx}>
            <Box iso={hospIso} x={fx} y={0.95} w={0.98} d={0.82} h={2.35} z={0.03} color="#E2E8F0" top="#F8FAFC" />
            <polygon
              points={faceY(hospIso, 1.78, fx + 0.1, fx + 0.88, 0.25, 2.1)}
              fill="url(#iso-glass-clear)"
              stroke="#0284C7"
              strokeWidth="1"
            />
          </g>
        ))}
        <g transform={planeY(hospIso, 5.4, 1.82, 2.55)}>
          <rect width="74" height="13" rx="3" fill="#0F172A" />
          <text x="5" y="9.2" fill="#38BDF8" fontSize="5.4" fontWeight="800" fontFamily={MONO}>
            CADENA FRÍO -4.0°C OK
          </text>
        </g>
      </g>
    ),
  });

  // 2. Surgeon at y <= 4.85 (when inside the sterile zone, sorted behind the airlock wall!)
  if (docFade > 0.02 && docY <= 4.85) {
    items.push({
      k: 4.3 + docY,
      el: (
        <g key="doc-inside" opacity={docFade}>
          <Person
            iso={hospIso}
            x={4.3}
            y={docY}
            heading={-Math.PI / 2}
            moving={docMoving}
            phase={t * 6.8}
            shirt="#0284C7"
            pants="#0369A1"
            cap="#38BDF8"
          />
        </g>
      ),
    });
  }

  // 3. Hermetic Zero-Touch Airlock Partition Wall at y = 4.85 (x: 0.86..7.94)
  // Doorway opening is x: 3.2..5.4 (width 2.2); each leaf is width 1.1 and slides 0.98 into the wall pocket!
  const slideOffset = doorOpen * 0.98;
  items.push({
    k: 4.4 + 4.85,
    el: (
      <g key="airlock-partition">
        {/* Left & Right Solid Partition Wall Sections */}
        <Box iso={hospIso} x={0.86} y={4.72} w={2.34} d={0.26} h={2.75} color="#FFFFFF" top="#CBD5E1" />
        <Box iso={hospIso} x={5.4} y={4.72} w={2.54} d={0.26} h={2.75} color="#FFFFFF" top="#CBD5E1" />
        {/* Continuous Upper Header Transom across the Airlock */}
        <Box iso={hospIso} x={0.86} y={4.72} w={7.08} d={0.28} h={0.55} z={2.75} color="#1E293B" top="#334155" />
        <polygon points={faceY(hospIso, 5.01, 0.86, 7.94, 2.82, 3.08)} fill="#0284C7" />
        <g transform={planeY(hospIso, 1.35, 5.03, 3.02)}>
          <text fill="#FFFFFF" fontSize="5.8" fontWeight="800" fontFamily={MONO} letterSpacing="0.08em">
            ESCLUSA QUIRÚRGICA ZERO-TOUCH · COFEPRIS
          </text>
        </g>

        {/* Left & Right Hermetic Sliding Glass Leaves (strictly inside x: 2.1..6.5!) */}
        <polygon
          points={faceY(hospIso, 4.86, 3.2 - slideOffset, 4.3 - slideOffset, 0.04, 2.72)}
          fill="url(#iso-glass-clear)"
          stroke={docGranted ? '#10B981' : '#0284C7'}
          strokeWidth="1.4"
        />
        <polygon
          points={faceY(hospIso, 4.86, 4.3 + slideOffset, 5.4 + slideOffset, 0.04, 2.72)}
          fill="url(#iso-glass-clear)"
          stroke={docGranted ? '#10B981' : '#0284C7'}
          strokeWidth="1.4"
        />

        {/* Contactless Infrared + Facial-with-Mask Terminal mounted on Right Wall Frame */}
        <Box iso={hospIso} x={5.58} y={4.96} w={0.28} d={0.14} h={0.52} z={1.18} color="#0F172A" />
        <polygon
          points={faceY(hospIso, 5.11, 5.62, 5.82, 1.24, 1.62)}
          fill={docGranted ? '#10B981' : docScanning ? '#F59E0B' : '#38BDF8'}
        />
      </g>
    ),
  });

  // 4. Surgeon at y > 4.85 (when in the foreground pre-surgical corridor, sorted in front of the airlock!)
  if (docFade > 0.02 && docY > 4.85) {
    items.push({
      k: 4.3 + docY,
      el: (
        <g key="doc-outside" opacity={docFade}>
          {(docScanning || docGranted) && (
            <GroundRing
              iso={hospIso}
              x={4.3}
              y={docY}
              t={t}
              maxR={1.15}
              color={docGranted ? '#10B981' : '#38BDF8'}
            />
          )}
          <Person
            iso={hospIso}
            x={4.3}
            y={docY}
            heading={-Math.PI / 2}
            moving={docMoving}
            phase={t * 6.8}
            shirt="#0284C7"
            pants="#0369A1"
            cap="#38BDF8"
          />
        </g>
      ),
    });
  }

  // 5. Right Wing Emergency Triage Canopy (x: 8.2..11.8, y: 1.8..3.6, z = 2.55 — well above ambulance height 1.58!)
  items.push({
    k: 10.0 + 2.7,
    el: (
      <g key="emergency-canopy">
        <Box iso={hospIso} x={8.2} y={1.8} w={3.6} d={1.85} h={0.36} z={2.55} color="#A6192E" top="#1E293B" />
        {/* Canopy outer support columns at x = 11.55 (outside ambulance lane x = 10.35!) */}
        <Box iso={hospIso} x={11.55} y={1.95} w={0.22} d={0.22} h={2.55} color="#334155" />
        <Box iso={hospIso} x={11.55} y={3.35} w={0.22} d={0.22} h={2.55} color="#334155" />
        <g transform={planeY(hospIso, 8.5, 3.68, 2.78)}>
          <text fill="#FFFFFF" fontSize="6" fontWeight="800" fontFamily={MONO}>
            BAHÍA URGENCIAS C4
          </text>
        </g>
      </g>
    ),
  });

  // 6. Wheeled Emergency Ambulance on the Right Driveway (x = 10.35, frontY = ambFrontY)
  items.push({
    k: 10.35 + ambFrontY + 1.2,
    el: (
      <IsoAmbulance
        key="ambulance"
        iso={hospIso}
        x={10.35}
        frontY={ambFrontY}
        emergencyActive={ambParked}
        t={t}
      />
    ),
  });

  items.sort((a, b) => a.k - b.k);

  const docRect = personRect(hospIso, 4.3, docY);
  const [ambHudX, ambHudY] = hospIso.p(10.35, ambFrontY + 1.2, 1.85);

  return (
    <div ref={wrapRef} className="prj-iso-scene-wrap">
      <SceneHudHeader
        code="CAM-05 · ESCLUSA QUIRÚRGICA ZERO-TOUCH"
        status="APERTURA SIN CONTACTO"
        metric="COFEPRIS 100%"
        t={t}
      />

      <svg className="iso-svg" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid meet">
        <IsoDefs />

        {/* HOSPITAL BASE SLAB */}
        <polygon points={flat(hospIso, 0, 0, 12.6, 11.8, -0.18)} fill="#CBD5E1" />
        <polygon points={faceY(hospIso, 11.8, 0, 12.6, -0.18, 0)} fill="#94A3B8" />
        <polygon points={faceX(hospIso, 12.6, 0, 11.8, -0.18, 0)} fill="#64748B" />
        <polygon points={flat(hospIso, 0, 0, 12.6, 11.8, 0)} fill="#F8FAFC" />

        {/* Pre-Surgical Corridor Floor (x: 0.6..8.2, y: 4.85..9.4) */}
        <polygon points={flat(hospIso, 0.6, 4.85, 8.2, 9.4, 0.015)} fill="#E2E8F0" />
        {/* Zero-Touch Sensor Mat in front of Airlock (x: 3.3..5.3, y: 5.3..6.3) */}
        <polygon
          points={flat(hospIso, 3.35, 5.35, 5.25, 6.25, 0.022)}
          fill={docGranted ? '#10B981' : '#0284C7'}
          opacity="0.24"
        />

        {/* Right Emergency Ambulance Asphalt Driveway (x: 8.8..11.9, y: 1.8..11.6) */}
        <polygon points={flat(hospIso, 8.8, 1.8, 11.9, 11.6, 0.012)} fill="#334155" />
        <polygon points={flat(hospIso, 9.1, 3.7, 11.5, 6.5, 0.018)} fill="none" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="4 2" />

        {/* PAINTER'S ALGORITHM SORTED 3D OBJECTS */}
        {items.map((it) => it.el)}

        {/* FOREGROUND BIOSECURITY & AMBULANCE HUD OVERLAYS */}
        {docFade > 0.15 && (docScanning || docGranted) && (
          <DetectBox
            x={docRect.x}
            y={docRect.y}
            w={docRect.w}
            h={docRect.h}
            color={docGranted ? '#10B981' : '#38BDF8'}
            label="CIRUJANO ADSCRITO · ID CON CUBREBOCAS"
            sub={docGranted ? 'ESCLUSA ASÉPTICA ABIERTA' : 'LECTURA FACIAL SIN CONTACTO'}
          />
        )}

        {ambParked && (
          <>
            <AirRing cx={ambHudX} cy={ambHudY} t={t} period={1.2} maxR={22} color="#EF4444" />
            <g transform={`translate(${(ambHudX - 58).toFixed(1)},${(ambHudY - 24).toFixed(1)})`}>
              <rect width="118" height="17" rx="4" fill="#A6192E" stroke="#FCA5A5" strokeWidth="1" />
              <text x="7" y="11.5" fill="#FFFFFF" fontSize="5.8" fontWeight="800" fontFamily={MONO}>
                PRIORIDAD CÓDIGO ROJO · LPR
              </text>
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
