import React, { useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  createIso,
  makePath,
  seg,
  lerp,
  easeInOut,
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

/* ==========================================================================
   5 COMPLETELY DISTINCT ISOMETRIC WORLDS FOR THE STICKY-SCROLL SHOWCASE
   Each scene has its own unique architecture, vehicles, machinery, and
   choreographed 60fps animation tailored to its exact case study story.
   ========================================================================== */

/* Shared Top-Left & Top-Right Frosted Light HUD Wrapper */
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
   SCENE 01: MEGA-CEDIS LOGÍSTICO & ADUANA CTPAT
   - Cutaway logistics warehouse with 3-tier industrial pallet racks
   - Animated Forklift moving pallets inside the warehouse aisle
   - 53-ft Articulated Freight Trailer backing into Loading Dock #2
   - Overhead LPR Container Scanner Portal & PTZ 32x Laser Sweep
   ========================================================================== */
const cedisIso = createIso({ ox: 285, oy: 74, s: 20.5 });

export function CedisLogisticsIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 6.0 });
  const lt = t % 16;

  // Freight Trailer backing into Dock 2 (y goes from 9.2 -> 5.6 -> 9.2)
  const dockIn = easeInOut(seg(lt, 0.8, 6.2));
  const dockOut = easeInOut(seg(lt, 11.5, 15.2));
  const truckY = lerp(8.8, 5.55, dockIn - dockOut);
  const isDocked = lt >= 6.0 && lt <= 11.4;

  // Forklift patrolling inside the cutaway warehouse aisle (x from 2.6 to 8.4)
  const forkX = 5.4 + Math.sin(t * 0.9) * 2.4;
  const forkLiftZ = 0.15 + (Math.sin(t * 1.8) + 1) * 0.35;

  // PTZ Scanner Cone in Freight Yard
  const scanAngle = 1.1 + Math.sin(t * 1.1) * 0.55;
  const [ptzSx, ptzSy] = cedisIso.p(10.8, 4.8, 3.8);
  const [coneAx, coneAy] = cedisIso.p(
    10.8 + Math.cos(scanAngle - 0.26) * 4.8,
    4.8 + Math.sin(scanAngle - 0.26) * 4.8,
    0.05
  );
  const [coneBx, coneBy] = cedisIso.p(
    10.8 + Math.cos(scanAngle + 0.26) * 4.8,
    4.8 + Math.sin(scanAngle + 0.26) * 4.8,
    0.05
  );

  const [truckSx, truckSy] = cedisIso.p(5.5, truckY, 1.85);
  const [forkSx, forkSy] = cedisIso.p(forkX, 2.7, 1.4);

  return (
    <div ref={wrapRef} className="iso-scene-wrap prj-clean-iso-bg">
      <SceneHudHeader
        code="CEDIS CUAUTITLÁN // CTPAT TIER-3"
        status="24 ANDENES TRAZADOS"
        metric="0% MERMA"
        t={t}
      />

      <svg viewBox="0 0 580 440" className="iso-svg-canvas">
        <IsoDefs />

        {/* Diorama Base Slab */}
        <polygon points={faceY(cedisIso, 12, 0, 13.5, -0.5, 0)} fill="#E2E8F0" />
        <polygon points={faceX(cedisIso, 13.5, 0, 12, -0.5, 0)} fill="#CBD5E1" />
        <polygon points={flat(cedisIso, 0, 0, 13.5, 12)} fill="#F8FAFC" />

        {/* Concrete Warehouse Floor (Interior Cutaway y: 0.6..4.8) */}
        <polygon points={flat(cedisIso, 1.0, 0.6, 11.2, 4.8, 0.02)} fill="#E2E8F0" />
        {/* Yellow Safety Aisle Lines Inside Warehouse */}
        <polygon points={flat(cedisIso, 1.4, 2.1, 10.6, 2.18, 0.03)} fill="#F59E0B" />
        <polygon points={flat(cedisIso, 1.4, 3.3, 10.6, 3.38, 0.03)} fill="#F59E0B" />

        {/* Exterior Asphalt Maneuvering Yard (y: 4.8..11.4) */}
        <polygon points={flat(cedisIso, 0.8, 4.8, 12.6, 11.4, 0.015)} fill="#475569" />
        {/* Reverse Guide Stripes for 3 Loading Docks */}
        {[2.4, 3.8, 4.8, 6.2, 7.4, 8.8].map((lx, i) => (
          <polygon
            key={i}
            points={flat(cedisIso, lx, 5.0, lx + 0.08, 8.8, 0.025)}
            fill={i === 2 || i === 3 ? '#38BDF8' : '#F8FAFC'}
            opacity="0.75"
          />
        ))}

        {/* Back & Left Cutaway Walls of the Mega-Warehouse */}
        <Box iso={cedisIso} x={1.0} y={0.4} w={10.2} d={0.25} h={3.8} color="#FFFFFF" />
        <Box iso={cedisIso} x={1.0} y={0.4} w={0.25} d={4.4} h={3.8} color="#F1F5F9" />

        {/* 3 Multi-Tier Industrial Pallet Racks Inside Cutaway */}
        {[2.0, 4.8, 7.6].map((rx) => (
          <g key={rx}>
            {/* Rack Uprights & Beams */}
            <Box iso={cedisIso} x={rx} y={0.85} w={2.1} d={0.95} h={0.12} z={0.1} color="#EA580C" />
            <Box iso={cedisIso} x={rx} y={0.85} w={2.1} d={0.95} h={0.12} z={1.3} color="#EA580C" />
            <Box iso={cedisIso} x={rx} y={0.85} w={2.1} d={0.95} h={0.12} z={2.5} color="#EA580C" />
            {/* Pallets / Cargo Boxes on Racks */}
            <Box iso={cedisIso} x={rx + 0.15} y={0.95} w={0.8} d={0.75} h={0.75} z={0.22} color="#D97706" />
            <Box iso={cedisIso} x={rx + 1.1} y={0.95} w={0.8} d={0.75} h={0.75} z={0.22} color="#B45309" />
            <Box iso={cedisIso} x={rx + 0.15} y={0.95} w={0.8} d={0.75} h={0.75} z={1.42} color="#94A3B8" />
            <Box iso={cedisIso} x={rx + 1.1} y={0.95} w={0.8} d={0.75} h={0.75} z={1.42} color="#D97706" />
            <Box iso={cedisIso} x={rx + 0.25} y={0.95} w={1.5} d={0.75} h={0.65} z={2.62} color="#2B5672" />
          </g>
        ))}

        {/* Animated Forklift Moving in the Warehouse Aisle */}
        <g>
          <Box iso={cedisIso} x={forkX - 0.45} y={2.4} w={0.9} d={0.65} h={0.55} color="#F59E0B" />
          <Box iso={cedisIso} x={forkX - 0.25} y={2.45} w={0.55} d={0.55} h={0.55} z={0.55} color="#1E293B" />
          {/* Carried Pallet */}
          <Box
            iso={cedisIso}
            x={forkX + 0.45}
            y={2.42}
            w={0.55}
            d={0.6}
            h={0.5}
            z={forkLiftZ}
            color="#38BDF8"
          />
          {/* AI Tracking Tag on Forklift */}
          <g transform={`translate(${(forkSx - 34).toFixed(1)},${(forkSy - 24).toFixed(1)})`}>
            <rect width="70" height="13" rx="3" fill="#10B981" />
            <text x="5" y="9" fill="#FFFFFF" fontSize="5.5" fontWeight="800" fontFamily={MONO}>
              MONTACARGAS #04
            </text>
          </g>
        </g>

        {/* Front Loading Dock Facade Frame (Semi-transparent cutaway roof beam + 3 Dock Portals) */}
        <Box iso={cedisIso} x={1.0} y={4.65} w={10.2} d={0.25} h={0.55} z={3.25} color="#A6192E" />
        <g transform={planeY(cedisIso, 1.5, 4.92, 3.4)}>
          <text x="0" y="0" fill="#FFFFFF" fontSize="5.8" fontWeight="800" fontFamily={MONO} letterSpacing="1.5">
            ADUANA INTERIOR · ANDENES LPR 4K
          </text>
        </g>

        {/* Dock Pillars & Status Semaphores */}
        {[1.8, 4.4, 6.6, 9.2].map((px, idx) => (
          <g key={px}>
            <Box iso={cedisIso} x={px} y={4.65} w={0.45} d={0.25} h={3.25} color="#CBD5E1" />
            {idx < 3 && (
              <polygon
                points={faceY(cedisIso, 4.91, px + 0.85, px + 1.35, 2.75, 2.95)}
                fill={idx === 1 && isDocked ? '#10B981' : '#38BDF8'}
              />
            )}
          </g>
        ))}

        {/* PTZ Laser Scan Cone in Freight Yard */}
        <polygon
          points={`${ptzSx},${ptzSy} ${coneAx},${coneAy} ${coneBx},${coneBy}`}
          fill="rgba(37, 99, 235, 0.14)"
          stroke="#2563EB"
          strokeWidth="0.9"
          strokeDasharray="3 2"
        />

        {/* 53-FT Articulated Freight Truck Backing into Dock 02 */}
        <g>
          {/* Trailer Box */}
          <Box
            iso={cedisIso}
            x={4.95}
            y={truckY}
            w={1.15}
            d={2.9}
            h={1.55}
            z={0.25}
            color="#FFFFFF"
            left="#FFFFFF"
            right="#E2E8F0"
            top="#F8FAFC"
          />
          {/* Crimson Logistics Stripe on Trailer */}
          <polygon
            points={faceX(cedisIso, 6.11, truckY + 0.2, truckY + 2.7, 0.85, 1.15)}
            fill="#A6192E"
          />
          {/* Tractor Cab */}
          <Box
            iso={cedisIso}
            x={5.02}
            y={truckY + 2.95}
            w={1.0}
            d={1.1}
            h={1.2}
            z={0.22}
            color="#2B5672"
          />
          {/* Docked Seal Pulse Ring */}
          {isDocked && (
            <GroundRing iso={cedisIso} x={5.5} y={5.1} t={t} maxR={2.2} color="#10B981" />
          )}

          {/* Floating LPR & Container Seal Callout */}
          <g transform={`translate(${(truckSx - 48).toFixed(1)},${(truckSy - 28).toFixed(1)})`}>
            <rect
              width="98"
              height="22"
              rx="5"
              fill="rgba(255, 255, 255, 0.96)"
              stroke={isDocked ? '#10B981' : '#2563EB'}
              strokeWidth="1.2"
            />
            <text
              x="6"
              y="9"
              fill={isDocked ? '#059669' : '#2563EB'}
              fontSize="5.5"
              fontWeight="800"
              fontFamily={MONO}
            >
              {isDocked ? 'ANDÉN 02 · SELLO OK' : 'RETROCESO ASISTIDO IA'}
            </text>
            <text x="6" y="17.5" fill="#0F172A" fontSize="6.4" fontWeight="800" fontFamily={MONO}>
              CONT: CUA-8841-MX
            </text>
          </g>
        </g>

        {/* Overhead LPR Entry Gantry at Yard Entrance */}
        <Box iso={cedisIso} x={1.2} y={9.8} w={0.3} d={0.3} h={2.3} color="#1E293B" />
        <Box iso={cedisIso} x={4.2} y={9.8} w={0.3} d={0.3} h={2.3} color="#1E293B" />
        <Box iso={cedisIso} x={1.2} y={9.75} w={3.3} d={0.4} h={0.35} z={2.3} color="#2B5672" />
      </svg>
    </div>
  );
}

/* ==========================================================================
   SCENE 02: TORRE FINANCIERA & BÓVEDA BANCARIA CNBV
   - High-security cutaway of a Bank Vault + Data Center + Speedgate Atrium
   - Circular armored steel Vault Door with active laser grid beams
   - Encrypted RAID-6 Server Racks with pulsing telemetry
   - Executive crossing motorized Flap Barrier Speedgates in <0.18s
   ========================================================================== */
const bankIso = createIso({ ox: 285, oy: 78, s: 21 });

export function FinancialVaultIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 5.5 });
  const lt = t % 12;

  // Executive walking through Speedgate Lane 2 (y from 9.8 -> 4.8)
  const walkK = easeInOut(seg(lt, 0.8, 7.5));
  const execY = lerp(9.8, 4.9, walkK);
  const execFade = 1 - seg(lt, 9.2, 11.2);
  const gatePassed = execY < 7.5;
  const execBox = personRect(bankIso, 4.5, execY, 0.95);

  const [vaultSx, vaultSy] = bankIso.p(3.2, 2.2, 2.8);
  const [raidSx, raidSy] = bankIso.p(8.8, 2.0, 3.0);

  return (
    <div ref={wrapRef} className="iso-scene-wrap prj-clean-iso-bg">
      <SceneHudHeader
        code="TORRE REFORMA // NORMA CNBV"
        status="RETENCIÓN 120 DÍAS"
        metric="0.18s FACIAL"
        t={t}
      />

      <svg viewBox="0 0 580 440" className="iso-svg-canvas">
        <IsoDefs />

        {/* Marble & Steel Podium Base */}
        <polygon points={faceY(bankIso, 11.5, 0.5, 12.5, -0.5, 0)} fill="#CBD5E1" />
        <polygon points={faceX(bankIso, 12.5, 0.5, 11.5, -0.5, 0)} fill="#94A3B8" />
        <polygon points={flat(bankIso, 0.5, 0.5, 12.5, 11.5)} fill="#F8FAFC" />

        {/* Polished Marble Lobby Grid */}
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={i}
            x1={bankIso.p(1.0 + i * 1.1, 4.2, 0.01)[0]}
            y1={bankIso.p(1.0 + i * 1.1, 4.2, 0.01)[1]}
            x2={bankIso.p(1.0 + i * 1.1, 11.2, 0.01)[0]}
            y2={bankIso.p(1.0 + i * 1.1, 11.2, 0.01)[1]}
            stroke="rgba(15,23,42,0.06)"
            strokeWidth="0.7"
          />
        ))}

        {/* REAR LEFT CHAMBER: ARMORED BANK VAULT & LASER MATRIX */}
        <g>
          {/* Reinforced Vault Floor & Walls */}
          <polygon points={flat(bankIso, 1.0, 0.8, 6.4, 4.2, 0.03)} fill="#E2E8F0" />
          <Box iso={bankIso} x={1.0} y={0.8} w={5.4} d={0.3} h={3.4} color="#334155" />
          <Box iso={bankIso} x={1.0} y={0.8} w={0.3} d={3.4} h={3.4} color="#475569" />

          {/* Safety Deposit Modules Inside Vault */}
          <Box iso={bankIso} x={1.6} y={1.3} w={1.8} d={0.8} h={2.2} color="#94A3B8" top="#CBD5E1" />
          <Box iso={bankIso} x={3.8} y={1.3} w={1.8} d={0.8} h={2.2} color="#94A3B8" top="#CBD5E1" />

          {/* Active Red/Cyan Laser Security Grid Inside Vault */}
          {[1.8, 2.5, 3.2].map((ly, i) => (
            <line
              key={i}
              x1={bankIso.p(1.4, ly, 0.4 + i * 0.5)[0]}
              y1={bankIso.p(1.4, ly, 0.4 + i * 0.5)[1]}
              x2={bankIso.p(6.0, ly, 0.4 + i * 0.5)[0]}
              y2={bankIso.p(6.0, ly, 0.4 + i * 0.5)[1]}
              stroke={i % 2 === 0 ? '#A6192E' : '#2563EB'}
              strokeWidth="1.2"
              strokeDasharray="4 2"
              opacity={0.65 + Math.sin(t * 4 + i) * 0.3}
            />
          ))}

          {/* Circular Armored Vault Door on Front Partition */}
          <Box iso={bankIso} x={1.0} y={4.0} w={5.4} d={0.28} h={0.9} z={2.5} color="#1E293B" />
          {(() => {
            const [vx, vy] = bankIso.p(3.6, 4.2, 1.35);
            return (
              <g>
                <circle cx={vx} cy={vy} r="22" fill="#475569" stroke="#1E293B" strokeWidth="3" />
                <circle cx={vx} cy={vy} r="15" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
                <circle cx={vx} cy={vy} r="4" fill="#10B981" />
              </g>
            );
          })()}

          <g transform={`translate(${(vaultSx - 42).toFixed(1)},${(vaultSy - 26).toFixed(1)})`}>
            <rect width="88" height="15" rx="4" fill="#0F172A" />
            <text x="6" y="10.2" fill="#FFFFFF" fontSize="5.8" fontWeight="800" fontFamily={MONO}>
              BÓVEDA GRADO 10 · OK
            </text>
          </g>
        </g>

        {/* REAR RIGHT CHAMBER: CNBV RAID-6 ENCRYPTED SERVER ROOM */}
        <g>
          <polygon points={flat(bankIso, 6.6, 0.8, 11.8, 4.2, 0.03)} fill="#0F172A" />
          <Box iso={bankIso} x={6.6} y={0.8} w={5.2} d={0.3} h={3.4} color="#1E293B" />

          {/* 4 High-Density RAID-6 Server Racks */}
          {[7.2, 8.3, 9.4, 10.5].map((sx, idx) => (
            <g key={sx}>
              <Box
                iso={bankIso}
                x={sx}
                y={1.4}
                w={0.8}
                d={1.1}
                h={2.4}
                color="#1E293B"
                top="#334155"
              />
              {/* Pulsing Server Blade LEDs */}
              {[0.5, 1.0, 1.5, 2.0].map((sz, k) => (
                <polygon
                  key={k}
                  points={faceY(bankIso, 2.51, sx + 0.12, sx + 0.68, sz, sz + 0.12)}
                  fill={(idx + k + Math.floor(t * 3)) % 3 === 0 ? '#38BDF8' : '#10B981'}
                />
              ))}
            </g>
          ))}

          <g transform={`translate(${(raidSx - 52).toFixed(1)},${(raidSy - 24).toFixed(1)})`}>
            <rect width="106" height="15" rx="4" fill="#2563EB" />
            <text x="6" y="10.2" fill="#FFFFFF" fontSize="5.8" fontWeight="800" fontFamily={MONO}>
              BÓVEDA VIDEO RAID-6 · TLS 1.3
            </text>
          </g>
        </g>

        {/* FOREGROUND ATRIUM: 4 MOTORIZED FLAP-BARRIER SPEEDGATE PEDESTALS */}
        {[2.4, 3.8, 5.2, 6.6, 8.0].map((tx, idx) => (
          <g key={tx}>
            <Box
              iso={bankIso}
              x={tx}
              y={6.8}
              w={0.32}
              d={1.65}
              h={0.98}
              color="#E2E8F0"
              left="#FFFFFF"
              right="#CBD5E1"
              top="#0F172A"
            />
            {/* Top LED Strip on Turnstile (Green on active lane) */}
            <polygon
              points={flat(bankIso, tx + 0.05, 6.9, tx + 0.27, 8.35, 0.99)}
              fill={idx === 1 || idx === 2 ? '#10B981' : '#38BDF8'}
            />
            {/* MinMoe Facial Reader Totem */}
            <Box iso={bankIso} x={tx + 0.08} y={8.1} w={0.16} d={0.12} h={0.48} z={0.98} color="#0F172A" />
          </g>
        ))}

        {/* Executive Crossing the Biometric Speedgate */}
        <g opacity={execFade}>
          <Person
            iso={bankIso}
            x={4.5}
            y={execY}
            heading={-Math.PI / 2}
            moving={walkK > 0.02 && walkK < 0.98}
            phase={t * 7}
            shirt="#2B5672"
            pants="#0F172A"
          />
          <DetectBox
            x={execBox.x}
            y={execBox.y}
            w={execBox.w}
            h={execBox.h}
            color={gatePassed ? '#10B981' : '#2563EB'}
            label={gatePassed ? 'ACCESO CONCEDIDO' : 'MINMOE 3D · 0.18s'}
            sub="NIVEL EJECUTIVO CNBV"
          />
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   SCENE 03: COMPLEJO AUTOMOTRIZ TIER-1 & SUBESTACIÓN TÉRMICA
   - Industrial assembly conveyor moving car bodies through robotic gantry
   - High-voltage Electrical Substation monitored by Bi-Spectral Thermal Camera
   - 14,000V Perimeter Fence & STPS Biometric Shift Portal
   ========================================================================== */
const plantIso = createIso({ ox: 285, oy: 76, s: 20.5 });

export function AutomotivePlantIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 6.2 });

  // Car chassis moving along the automated assembly conveyor (x from 2.0 to 7.2)
  const chassisX = 2.2 + ((t * 0.75) % 4.6);

  // Thermal Camera scanning the electrical transformer substation
  const [thermCamX, thermCamY] = plantIso.p(8.2, 4.5, 3.6);
  const [subAx, subAy] = plantIso.p(9.6, 2.0, 0.2);
  const [subBx, subBy] = plantIso.p(11.8, 4.2, 0.2);
  const [subLabelX, subLabelY] = plantIso.p(10.6, 2.6, 2.5);

  return (
    <div ref={wrapRef} className="iso-scene-wrap prj-clean-iso-bg">
      <SceneHudHeader
        code="PLANTA QUERÉTARO // T-MEC & STPS"
        status="TERMOGRAFÍA IA ACTIVA"
        metric="-34% HORAS EXTRA"
        t={t}
      />

      <svg viewBox="0 0 580 440" className="iso-svg-canvas">
        <IsoDefs />

        {/* Industrial Slab */}
        <polygon points={faceY(plantIso, 11.8, 0.5, 13.2, -0.5, 0)} fill="#CBD5E1" />
        <polygon points={faceX(plantIso, 13.2, 0.5, 11.8, -0.5, 0)} fill="#94A3B8" />
        <polygon points={flat(plantIso, 0.5, 0.5, 13.2, 11.8)} fill="#F1F5F9" />

        {/* ZONE A: AUTOMOTIVE ASSEMBLY HALL (LEFT) */}
        <g>
          <polygon points={flat(plantIso, 1.0, 1.2, 8.2, 6.2, 0.02)} fill="#E2E8F0" />
          {/* Sawtooth Factory Rear Wall */}
          <Box iso={plantIso} x={1.0} y={1.0} w={7.2} d={0.3} h={3.5} color="#FFFFFF" />
          {/* Assembly Conveyor Belt Track */}
          <Box iso={plantIso} x={1.6} y={3.1} w={6.0} d={1.3} h={0.35} color="#334155" top="#475569" />

          {/* Moving Car Chassis on Assembly Line */}
          <Box
            iso={plantIso}
            x={chassisX}
            y={3.25}
            w={1.5}
            d={0.95}
            h={0.65}
            z={0.36}
            color="#A6192E"
            top="#F8FAFC"
          />

          {/* Robotic Inspection Arch Over Conveyor */}
          <Box iso={plantIso} x={4.3} y={2.8} w={0.35} d={0.35} h={2.2} color="#F59E0B" />
          <Box iso={plantIso} x={4.3} y={4.4} w={0.35} d={0.35} h={2.2} color="#F59E0B" />
          <Box iso={plantIso} x={4.2} y={2.8} w={0.55} d={1.95} h={0.35} z={2.2} color="#1E293B" />
        </g>

        {/* ZONE B: HIGH-VOLTAGE ELECTRICAL SUBSTATION + THERMAL CAMERA (RIGHT) */}
        <g>
          {/* Hazard Hatch Pad */}
          <polygon points={flat(plantIso, 8.8, 1.2, 12.6, 5.4, 0.03)} fill="url(#iso-hatch-red)" />
          {/* Transformer Coils & Cooling Fins */}
          <Box iso={plantIso} x={9.5} y={1.8} w={2.2} d={1.8} h={2.1} color="#475569" top="#64748B" />
          {[9.8, 10.5, 11.2].map((tx) => (
            <Box key={tx} iso={plantIso} x={tx} y={2.2} w={0.3} d={0.3} h={0.85} z={2.1} color="#A6192E" />
          ))}

          {/* Bi-Spectral Thermal Camera Cone */}
          <polygon
            points={`${thermCamX},${thermCamY} ${subAx},${subAy} ${subBx},${subBy}`}
            fill="rgba(249, 115, 22, 0.18)"
            stroke="#F97316"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <GroundRing iso={plantIso} x={10.6} y={2.8} t={t} maxR={2.1} color="#F97316" />

          <g transform={`translate(${(subLabelX - 50).toFixed(1)},${(subLabelY - 26).toFixed(1)})`}>
            <rect width="102" height="21" rx="5" fill="rgba(255,255,255,0.96)" stroke="#F97316" strokeWidth="1" />
            <text x="6" y="8.8" fill="#EA580C" fontSize="5.5" fontWeight="800" fontFamily={MONO}>
              SUBESTACIÓN · TÉRMICA IA
            </text>
            <text x="6" y="16.8" fill="#0F172A" fontSize="6.4" fontWeight="800" fontFamily={MONO}>
              58.4°C · SIN RIESGO ✓
            </text>
          </g>
        </g>

        {/* ZONE C: STPS BIOMETRIC SHIFT TURNSTILE MODULE (FOREGROUND) */}
        <g>
          <Box iso={plantIso} x={3.2} y={7.4} w={4.8} d={1.8} h={2.1} color="#2B5672" top="#FFFFFF" />
          <polygon points={faceY(plantIso, 9.21, 3.2, 8.0, 1.75, 2.1)} fill="#A6192E" />
          <g transform={planeY(plantIso, 3.6, 9.24, 1.82)}>
            <text x="0" y="0" fill="#FFFFFF" fontSize="5.4" fontWeight="800" fontFamily={MONO}>
              ACCESO BIOMÉTRICO STPS · 3 TURNOS
            </text>
          </g>
          <GroundRing iso={plantIso} x={5.6} y={9.6} t={t} maxR={2.3} color="#10B981" />
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   SCENE 04: MACRO-PRIVADA RESIDENCIAL & ESCLUSA DOBLE CARRIL (UHF + QR SIP)
   - Tree-lined residential avenue with modern cantilevered gatehouse
   - Lane 1 (Residentes): Non-stop 12m UHF RFID wave lifting barrier in 1.2s
   - Lane 2 (Visitas): SIP 2.0 Intercom + Dynamic QR validation
   ========================================================================== */
const resIso = createIso({ ox: 285, oy: 74, s: 20.5 });

const RES_FAST_LANE = makePath(
  [
    [3.8, 11.4],
    [3.8, 1.2],
  ],
  0.2
);

export function ResidentialBoulevardIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 5.0 });
  const lt = t % 12;

  // Resident SUV cruising smoothly through UHF Fast Lane (x=3.8)
  const suvU = (lt / 12);
  const suvPos = RES_FAST_LANE.atU(suvU);
  const barrierLift = seg(lt, 2.5, 3.6) * (1 - seg(lt, 6.8, 7.8));

  const [suvSx, suvSy] = resIso.p(suvPos.x, suvPos.y, 0.9);
  const [visitorSx, visitorSy] = resIso.p(8.2, 7.8, 0.95);
  const [uhfSx, uhfSy] = resIso.p(5.2, 6.2, 2.5);

  return (
    <div ref={wrapRef} className="iso-scene-wrap prj-clean-iso-bg">
      <SceneHudHeader
        code="BOSQUES DE LAS LOMAS // 4 ACCESOS"
        status="DOBLE ESCLUSA UHF + QR"
        metric="1.2s APERTURA"
        t={t}
      />

      <svg viewBox="0 0 580 440" className="iso-svg-canvas">
        <IsoDefs />

        {/* Lush Green Park & Boulevard Slab */}
        <polygon points={faceY(resIso, 12, 0.5, 13.0, -0.5, 0)} fill="#CBD5E1" />
        <polygon points={faceX(resIso, 13.0, 0.5, 12, -0.5, 0)} fill="#94A3B8" />
        <polygon points={flat(resIso, 0.5, 0.5, 13.0, 12)} fill="#94BD88" />

        {/* Lane 1: Resident Fast Lane (x: 2.6..4.9) */}
        <polygon points={flat(resIso, 2.6, 0.5, 4.9, 12, 0.02)} fill="#334155" />
        {/* Lane 2: Visitor QR & SIP Lane (x: 7.0..9.3) */}
        <polygon points={flat(resIso, 7.0, 0.5, 9.3, 12, 0.02)} fill="#475569" />

        {/* Center Median Island & Architectural Gatehouse */}
        <polygon points={flat(resIso, 4.9, 1.5, 7.0, 11.0, 0.03)} fill="#E2E8F0" />
        <Box
          iso={resIso}
          x={5.15}
          y={4.8}
          w={1.6}
          d={2.8}
          h={2.3}
          color="#FFFFFF"
          left="#FFFFFF"
          right="#CBD5E1"
          top="#F1F5F9"
        />
        {/* Glass Guardhouse Windows */}
        <polygon points={faceY(resIso, 7.61, 5.3, 6.6, 0.8, 2.0)} fill="url(#iso-glass)" />

        {/* Cantilevered Architectural Canopy Spanning Both Lanes */}
        <Box
          iso={resIso}
          x={2.2}
          y={5.3}
          w={7.5}
          d={1.5}
          h={0.38}
          z={2.3}
          color="#1E293B"
          top="#2B5672"
        />
        <polygon points={faceY(resIso, 6.81, 2.2, 9.7, 2.52, 2.68)} fill="#A6192E" />

        {/* UHF Long-Range Wave Pulses on Lane 1 */}
        <AirRing cx={uhfSx - 28} cy={uhfSy + 12} t={t} period={1.4} maxR={28} color="#10B981" />

        {/* High-Speed Brushless Barrier on Lane 1 */}
        {(() => {
          const [bx, by] = resIso.p(4.85, 6.6, 1.0);
          const [ex, ey] = resIso.p(
            4.85 - Math.cos(barrierLift * 1.35) * 2.0,
            6.6,
            1.0 + Math.sin(barrierLift * 1.35) * 2.0
          );
          return (
            <line
              x1={bx}
              y1={by}
              x2={ex}
              y2={ey}
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          );
        })()}

        {/* Resident SUV Cruising Non-Stop on Lane 1 */}
        <Car iso={resIso} x={suvPos.x} y={suvPos.y} yaw={-Math.PI / 2} color="#FFFFFF" />
        <g transform={`translate(${(suvSx - 42).toFixed(1)},${(suvSy - 32).toFixed(1)})`}>
          <rect width="86" height="16" rx="4" fill="#10B981" />
          <text x="6" y="10.8" fill="#FFFFFF" fontSize="5.8" fontWeight="800" fontFamily={MONO}>
            TAG UHF 12M · 1.2s ✓
          </text>
        </g>

        {/* Visitor Vehicle Validating WhatsApp QR on Lane 2 */}
        <Car iso={resIso} x={8.15} y={7.9} yaw={-Math.PI / 2} color="#2B5672" />
        <Box iso={resIso} x={9.35} y={7.4} w={0.28} d={0.28} h={1.35} color="#A6192E" />
        <g transform={`translate(${(visitorSx - 44).toFixed(1)},${(visitorSy - 32).toFixed(1)})`}>
          <rect
            width="94"
            height="21"
            rx="5"
            fill="rgba(255,255,255,0.96)"
            stroke="#2563EB"
            strokeWidth="1"
          />
          <text x="6" y="8.8" fill="#2563EB" fontSize="5.5" fontWeight="800" fontFamily={MONO}>
            CARRIL VISITAS · SIP 2.0
          </text>
          <text x="6" y="16.8" fill="#0F172A" fontSize="6.2" fontWeight="800" fontFamily={MONO}>
            QR + FOTO VERIFICADA
          </text>
        </g>

        {/* Landscape Trees */}
        <Tree iso={resIso} x={1.4} y={3.2} size={0.88} />
        <Tree iso={resIso} x={1.4} y={8.8} size={0.82} />
        <Tree iso={resIso} x={11.2} y={3.4} size={0.9} />
        <Tree iso={resIso} x={11.2} y={8.6} size={0.84} />
        <Bush iso={resIso} x={5.95} y={9.5} size={0.8} />
      </svg>
    </div>
  );
}

/* ==========================================================================
   SCENE 05: CENTRO HOSPITALARIO & BIOSEGURIDAD COFEPRIS
   - Cutaway Surgical & Controlled Pharmacy Airlock with Zero-Touch Sliding Doors
   - Surgeon in medical scrubs verified hands-free with mask
   - Cold-Chain Vaccine Vault telemetry (-4.0°C) + Emergency Ambulance Bay
   ========================================================================== */
const hospIso = createIso({ ox: 285, oy: 76, s: 20.5 });

export function HospitalBiosecurityIsoScene() {
  const wrapRef = useRef(null);
  const t = useSceneClock(wrapRef, { still: 5.5 });
  const lt = t % 12;

  // Surgeon walking hands-free through Zero-Touch Airlock (y from 8.4 -> 3.0)
  const docK = easeInOut(seg(lt, 0.8, 7.2));
  const docY = lerp(8.4, 3.0, docK);
  const docFade = 1 - seg(lt, 9.0, 11.0);

  // Sliding hermetic glass doors part open as surgeon approaches y=5.5
  const doorSlide = seg(lt, 2.4, 3.5) * (1 - seg(lt, 6.2, 7.2)) * 0.95;
  const docBox = personRect(hospIso, 4.6, docY, 0.95);

  const [coldSx, coldSy] = hospIso.p(2.4, 2.2, 2.8);
  const [ambSx, ambSy] = hospIso.p(10.2, 6.8, 1.6);

  return (
    <div ref={wrapRef} className="iso-scene-wrap prj-clean-iso-bg">
      <SceneHudHeader
        code="HOSPITAL ALTA ESPECIALIDAD // COFEPRIS"
        status="ACCESO ZERO-TOUCH"
        metric="99.9% CON CUBREBOCAS"
        t={t}
      />

      <svg viewBox="0 0 580 440" className="iso-svg-canvas">
        <IsoDefs />

        {/* Clinical White & Sterile Blue Platform */}
        <polygon points={faceY(hospIso, 11.5, 0.5, 13.0, -0.5, 0)} fill="#CBD5E1" />
        <polygon points={faceX(hospIso, 13.0, 0.5, 11.5, -0.5, 0)} fill="#94A3B8" />
        <polygon points={flat(hospIso, 0.5, 0.5, 13.0, 11.5)} fill="#F8FAFC" />

        {/* Sterile Surgical & Pharmacy Zone Floor (Rear Left) */}
        <polygon points={flat(hospIso, 1.0, 0.8, 8.2, 5.2, 0.02)} fill="#E0F2FE" />
        <Box iso={hospIso} x={1.0} y={0.8} w={7.2} d={0.3} h={3.5} color="#FFFFFF" />
        <Box iso={hospIso} x={1.0} y={0.8} w={0.3} d={4.4} h={3.5} color="#F1F5F9" />

        {/* COFEPRIS Cold-Chain Cryo/Vaccine Chamber */}
        <Box
          iso={hospIso}
          x={1.6}
          y={1.3}
          w={2.2}
          d={1.5}
          h={2.4}
          color="#FFFFFF"
          left="url(#iso-glass-clear)"
          right="#BAE6FD"
          top="#0284C7"
        />
        <g transform={`translate(${(coldSx - 46).toFixed(1)},${(coldSy - 22).toFixed(1)})`}>
          <rect width="96" height="16" rx="4" fill="#0284C7" />
          <text x="6" y="10.8" fill="#FFFFFF" fontSize="5.6" fontWeight="800" fontFamily={MONO}>
            CADENA FRÍO · -4.0°C OK
          </text>
        </g>

        {/* HERMETIC ZERO-TOUCH SLIDING GLASS AIRLOCK PARTITION (y=5.2) */}
        <Box iso={hospIso} x={1.0} y={5.1} w={2.1} d={0.25} h={3.2} color="#FFFFFF" />
        <Box iso={hospIso} x={6.1} y={5.1} w={2.1} d={0.25} h={3.2} color="#FFFFFF" />
        <Box iso={hospIso} x={1.0} y={5.1} w={7.2} d={0.28} h={0.5} z={2.7} color="#2B5672" />

        {/* Left & Right Automated Sliding Glass Leaves */}
        <polygon
          points={faceY(hospIso, 5.25, 3.1 - doorSlide, 4.6 - doorSlide, 0.05, 2.7)}
          fill="url(#iso-glass-clear)"
          stroke="#0284C7"
          strokeWidth="1"
        />
        <polygon
          points={faceY(hospIso, 5.25, 4.6 + doorSlide, 6.1 + doorSlide, 0.05, 2.7)}
          fill="url(#iso-glass-clear)"
          stroke="#0284C7"
          strokeWidth="1"
        />

        {/* Non-Touch Infrared & Facial Medical Scanner Totem */}
        <Box iso={hospIso} x={6.25} y={5.35} w={0.22} d={0.15} h={0.55} z={1.1} color="#0F172A" />
        <GroundRing iso={hospIso} x={4.6} y={5.4} t={t} maxR={2.0} color="#10B981" />

        {/* Surgeon in Medical Scrubs Crossing Hands-Free */}
        <g opacity={docFade}>
          <Person
            iso={hospIso}
            x={4.6}
            y={docY}
            heading={-Math.PI / 2}
            moving={docK > 0.02 && docK < 0.98}
            phase={t * 6.8}
            shirt="#0284C7"
            pants="#0369A1"
            cap="#38BDF8"
          />
          <DetectBox
            x={docBox.x}
            y={docBox.y}
            w={docBox.w}
            h={docBox.h}
            color="#10B981"
            label="ZERO-TOUCH · ASÉPTICO"
            sub="ID CON CUBREBOCAS OK"
          />
        </g>

        {/* RIGHT WING: EMERGENCY AMBULANCE BAY & PRIORITY LPR */}
        <polygon points={flat(hospIso, 8.4, 2.0, 12.6, 11.2, 0.015)} fill="#475569" />
        {/* Emergency Canopy */}
        <Box iso={hospIso} x={8.2} y={2.0} w={3.8} d={2.2} h={0.35} z={2.6} color="#A6192E" />
        {/* Ambulance Unit in Bay */}
        <Box
          iso={hospIso}
          x={9.5}
          y={5.4 + Math.sin(t * 1.2) * 0.25}
          w={1.3}
          d={2.5}
          h={1.45}
          z={0.2}
          color="#FFFFFF"
          top="#F8FAFC"
        />
        <polygon
          points={faceX(
            hospIso,
            10.81,
            5.6 + Math.sin(t * 1.2) * 0.25,
            7.7 + Math.sin(t * 1.2) * 0.25,
            0.75,
            1.0
          )}
          fill="#EF4444"
        />
        <AirRing cx={ambSx} cy={ambSy} t={t} period={1.1} maxR={22} color="#EF4444" />
        <g transform={`translate(${(ambSx - 44).toFixed(1)},${(ambSy - 26).toFixed(1)})`}>
          <rect width="90" height="15" rx="4" fill="#A6192E" />
          <text x="6" y="10.2" fill="#FFFFFF" fontSize="5.6" fontWeight="800" fontFamily={MONO}>
            ESCLUSA URGENCIAS C4
          </text>
        </g>
      </svg>
    </div>
  );
}
