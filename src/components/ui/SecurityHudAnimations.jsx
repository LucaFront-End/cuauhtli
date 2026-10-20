import React from 'react';
import './SecurityHudAnimations.css';

/* --------------------------------------------------------------------------
   1. HERO ANIMATION: GARANTÍA VITALICIA & BLINDAJE HOMOLOGADO
   Directly relates to: Póliza vitalicia de mano de obra y certificación C4
   -------------------------------------------------------------------------- */
export function HeroLifetimeShieldAnimation({ className = '' }) {
  return (
    <div className={`sec-hud-wrap ${className}`}>
      <svg viewBox="0 0 200 200" className="sec-hud-svg" aria-label="Garantía Vitalicia Homologada">
        <defs>
          <linearGradient id="heroCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A6192E" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#C8102E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2B5672" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="heroCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E11D48" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A6192E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Halo Glow */}
        <circle cx="100" cy="100" r="60" fill="url(#heroCoreGlow)" className="sec-pulse-glow" />

        {/* Outer Rotating Calibration Rings */}
        <circle cx="100" cy="100" r="88" className="sec-ring-cw" />
        <circle cx="100" cy="100" r="76" className="sec-ring-ccw" />

        {/* Corner Reticles */}
        <path d="M 28 44 L 28 28 L 44 28" className="sec-corner-reticle" />
        <path d="M 172 44 L 172 28 L 156 28" className="sec-corner-reticle" />
        <path d="M 28 156 L 28 172 L 44 172" className="sec-corner-reticle" />
        <path d="M 172 156 L 172 172 L 156 172" className="sec-corner-reticle" />

        {/* Outer Heavy Armor Shield Outline */}
        <path 
          d="M 100 42 Q 132 48 150 44 C 150 96 136 134 100 162 C 64 134 50 96 50 44 Q 68 48 100 42 Z" 
          className="sec-shield-outer"
        />

        {/* Inner Shield Body with Brand Crimson/Navy Gradient */}
        <path 
          d="M 100 54 Q 124 59 138 56 C 138 96 126 126 100 148 C 74 126 62 96 62 56 Q 76 59 100 54 Z" 
          fill="url(#heroCrimsonGrad)"
          className="sec-shield-body"
        />

        {/* Golden Certification Star & Lock Emblem */}
        <g className="sec-shield-emblem">
          <circle cx="100" cy="95" r="16" fill="rgba(255, 255, 255, 0.18)" stroke="#F8FAFC" strokeWidth="1.5" />
          {/* Keyhole / Shield Check */}
          <path d="M 94 96 L 98 100 L 108 90" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 92 84 Q 100 80 108 84" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Vertical Laser Verification Sweep */}
        <line x1="48" y1="95" x2="152" y2="95" className="sec-laser-sweep" />

        {/* Certified Coordinates / Blips */}
        <circle cx="68" cy="74" r="2.5" className="sec-blip-a" />
        <circle cx="132" cy="74" r="2.5" className="sec-blip-b" />
        <circle cx="100" cy="138" r="2.5" className="sec-blip-c" />
      </svg>
      <div className="sec-hud-badge">
        <span className="sec-hud-live-dot crimson" />
        <span>GARANTÍA VITALICIA HOMOLOGADA · C4</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   2. BENCH 01 ANIMATION: CÁMARA ESTANCA & HERMETICIDAD IP67 / IK10
   Directly relates to: Inmersión en agua 1m, chorro 100 kPa y choque de 20 Joules
   -------------------------------------------------------------------------- */
export function OpticsWaterShockAnimation({ className = '' }) {
  return (
    <div className={`sec-hud-wrap ${className}`}>
      <svg viewBox="0 0 200 200" className="sec-hud-svg" aria-label="Hermeticidad IP67 y Choque IK10">
        <defs>
          <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="impactRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#EF4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Water Immersion Waves (expanding rings) */}
        <circle cx="100" cy="100" r="84" className="sec-water-wave sec-ww-1" />
        <circle cx="100" cy="100" r="72" className="sec-water-wave sec-ww-2" />
        <circle cx="100" cy="100" r="60" className="sec-water-wave sec-ww-3" />

        {/* 20 Joules Mechanical Shockwave Pulse */}
        <circle cx="100" cy="100" r="48" fill="url(#impactRadial)" className="sec-impact-burst" />

        {/* Heavy Casing / Dome Camera Base */}
        <rect x="52" y="116" width="96" height="20" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
        <line x1="60" y1="126" x2="140" y2="126" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

        {/* IP67 Reinforced Optical Dome */}
        <path 
          d="M 64 116 C 64 74 136 74 136 116 Z" 
          fill="rgba(56, 189, 248, 0.15)" 
          stroke="#60A5FA" 
          strokeWidth="2" 
          className="sec-optical-dome"
        />

        {/* Internal High-Def Optical Lens & Aperture */}
        <circle cx="100" cy="104" r="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.8" />
        <circle cx="100" cy="104" r="10" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.2" />
        <circle cx="100" cy="104" r="4" fill="#38BDF8" className="sec-lens-aperture" />

        {/* Water Jet Pressure Streams (100 kPa) */}
        <path d="M 28 68 Q 60 76 80 88" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" className="sec-water-jet" fill="none" />
        <path d="M 172 68 Q 140 76 120 88" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" className="sec-water-jet" fill="none" />

        {/* Kinetic Impact Hammer Vectors (20 Joules) */}
        <g className="sec-impact-arrow">
          <line x1="100" y1="32" x2="100" y2="60" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="96,56 100,66 104,56" fill="#F59E0B" />
        </g>

        {/* IK10 Hermetic Seal Status Chip */}
        <rect x="68" y="146" width="64" height="14" rx="4" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
        <text x="100" y="156" textAnchor="middle" fill="#34D399" fontSize="7" fontWeight="bold" fontFamily="monospace">
          IP67 · IK10 OK
        </text>
      </svg>
      <div className="sec-hud-badge">
        <span className="sec-hud-live-dot emerald" />
        <span>ESTANCA IP67 · CHOQUE 20J (IK10)</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   3. BENCH 02 ANIMATION: LUXOMETRÍA CRÍTICA & TERMOGRAFÍA 300M
   Directly relates to: Calibración en 0.0005 Lux y rango térmico humano 300m
   -------------------------------------------------------------------------- */
export function LuxometryRadarAnimation({ className = '' }) {
  return (
    <div className={`sec-hud-wrap ${className}`}>
      <svg viewBox="0 0 200 200" className="sec-hud-svg" aria-label="Luxometría y Radar Térmico 300m">
        <defs>
          <linearGradient id="radarSweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#34D399" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Concentric Thermal Range Rings (100m, 200m, 300m) */}
        <circle cx="100" cy="100" r="86" className="sec-radar-ring" strokeDasharray="3 4" />
        <circle cx="100" cy="100" r="62" className="sec-radar-ring" />
        <circle cx="100" cy="100" r="38" className="sec-radar-ring" />
        <circle cx="100" cy="100" r="14" className="sec-radar-ring" />

        {/* Range Distance Labels */}
        <text x="104" y="65" fill="#64748B" fontSize="6.5" fontFamily="monospace">100m</text>
        <text x="104" y="41" fill="#64748B" fontSize="6.5" fontFamily="monospace">200m</text>
        <text x="104" y="17" fill="#64748B" fontSize="6.5" fontFamily="monospace">300m</text>

        {/* Crosshair Axes */}
        <line x1="14" y1="100" x2="186" y2="100" className="sec-radar-axis" />
        <line x1="100" y1="14" x2="100" y2="186" className="sec-radar-axis" />

        {/* 360° Tactical Thermal Radar Sweep Rotor */}
        <g className="sec-radar-rotor">
          <path d="M 100 100 L 100 14 A 86 86 0 0 1 176 56 Z" fill="url(#radarSweepGradient)" />
          <line x1="100" y1="100" x2="100" y2="14" stroke="#34D399" strokeWidth="1.8" />
        </g>

        {/* Acquired Human Target at 300m (Bi-Spectral Detection) */}
        <g className="sec-target-lock" transform="translate(138, 54)">
          <circle cx="0" cy="0" r="4" fill="#EF4444" className="sec-target-core" />
          <circle cx="0" cy="0" r="9" fill="none" stroke="#EF4444" strokeWidth="1.2" className="sec-target-wave" />
          <path d="M -8 -8 L -4 -8 M -8 -8 L -8 -4" stroke="#EF4444" strokeWidth="1" />
          <path d="M 8 -8 L 4 -8 M 8 -8 L 8 -4" stroke="#EF4444" strokeWidth="1" />
          <path d="M -8 8 L -4 8 M -8 8 L -8 4" stroke="#EF4444" strokeWidth="1" />
          <path d="M 8 8 L 4 8 M 8 8 L 8 4" stroke="#EF4444" strokeWidth="1" />
        </g>

        {/* Acquired Vehicle Target at 150m */}
        <g className="sec-target-lock" transform="translate(68, 128)">
          <circle cx="0" cy="0" r="3" fill="#38BDF8" className="sec-target-core" />
          <circle cx="0" cy="0" r="7" fill="none" stroke="#38BDF8" strokeWidth="1" className="sec-target-wave" />
        </g>

        {/* Luxometer Readout Chip */}
        <rect x="58" y="148" width="84" height="15" rx="4" fill="#0F172A" stroke="#34D399" strokeWidth="1" />
        <text x="100" y="158" textAnchor="middle" fill="#34D399" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
          0.0005 LUX · TÉRMICO
        </text>
      </svg>
      <div className="sec-hud-badge">
        <span className="sec-hud-live-dot emerald" />
        <span>LUXOMETRÍA 0.0005 LX · RANGO 300M</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   4. BENCH 03 ANIMATION: AUDITORÍA DE CIBERSEGURIDAD & TLS 1.3
   Directly relates to: Cifrado de video TLS 1.3, firmware hardening y 0 backdoors
   -------------------------------------------------------------------------- */
export function CybersecurityHardeningAnimation({ className = '' }) {
  return (
    <div className={`sec-hud-wrap ${className}`}>
      <svg viewBox="0 0 200 200" className="sec-hud-svg" aria-label="Ciberseguridad y Cifrado TLS 1.3">
        <defs>
          <linearGradient id="cyberHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Rotating Cipher Matrix Ring */}
        <circle cx="100" cy="100" r="86" stroke="#3B82F6" strokeWidth="1" strokeDasharray="6 6" fill="none" className="sec-cipher-ring" />
        <circle cx="100" cy="100" r="70" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="16 8 4 8" fill="none" className="sec-cipher-ring-rev" />

        {/* PCB Bus Trace Lines */}
        <path d="M 24 100 L 58 100 L 72 80" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
        <path d="M 176 100 L 142 100 L 128 120" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="100" r="3" fill="#38BDF8" />
        <circle cx="176" cy="100" r="3" fill="#38BDF8" />

        {/* Central Cryptographic Hexagon Vault */}
        <polygon 
          points="100,52 136,73 136,115 100,136 64,115 64,73" 
          fill="url(#cyberHexGrad)" 
          stroke="#60A5FA" 
          strokeWidth="2" 
          className="sec-vault-hex"
        />

        {/* Hardened Security Padlock Icon */}
        <g transform="translate(100, 94)">
          {/* Shackle */}
          <path d="M -10 -4 L -10 -14 C -10 -22 10 -22 10 -14 L 10 -4" fill="none" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          {/* Lock Body */}
          <rect x="-16" y="-4" width="32" height="24" rx="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Keyhole */}
          <circle cx="0" cy="6" r="3" fill="#0F172A" />
          <line x1="0" y1="8" x2="0" y2="13" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Binary / Data Stream Bits Passing Through Firewall */}
        <text x="36" y="68" fill="#38BDF8" fontSize="7" fontFamily="monospace" className="sec-bit-stream">10110</text>
        <text x="144" y="68" fill="#38BDF8" fontSize="7" fontFamily="monospace" className="sec-bit-stream">TLS1.3</text>
        <text x="36" y="136" fill="#10B981" fontSize="7" fontFamily="monospace" className="sec-bit-stream">PASS</text>
        <text x="144" y="136" fill="#10B981" fontSize="7" fontFamily="monospace" className="sec-bit-stream">0_PORT</text>

        {/* Hardware TLS 1.3 Chip */}
        <rect x="58" y="150" width="84" height="15" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
        <text x="100" y="160" textAnchor="middle" fill="#60A5FA" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
          TLS 1.3 · HARDENED
        </text>
      </svg>
      <div className="sec-hud-badge">
        <span className="sec-hud-live-dot blue" />
        <span>FIRMWARE HARDENING · TLS 1.3</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   5. BENCH 04 ANIMATION: CÁMARA CLIMÁTICA & ESTRÉS CONTINUO 72H
   Directly relates to: -20°C a +60°C en grabación continua RAID 72h sin dropouts
   -------------------------------------------------------------------------- */
export function ClimaticBurnInAnimation({ className = '' }) {
  return (
    <div className={`sec-hud-wrap ${className}`}>
      <svg viewBox="0 0 200 200" className="sec-hud-svg" aria-label="Estrés Térmico 72h y Grabación RAID">
        <defs>
          <linearGradient id="thermalDialGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Dual Temperature Arc: -20°C to +60°C */}
        <circle cx="100" cy="100" r="82" fill="none" stroke="#1E293B" strokeWidth="8" />
        <circle 
          cx="100" 
          cy="100" 
          r="82" 
          fill="none" 
          stroke="url(#thermalDialGrad)" 
          strokeWidth="7" 
          strokeDasharray="280 400"
          strokeLinecap="round"
          className="sec-thermal-arc"
        />

        {/* Temperature Indicators */}
        <text x="36" y="152" fill="#38BDF8" fontSize="8" fontWeight="bold" fontFamily="monospace">-20°C</text>
        <text x="142" y="152" fill="#EF4444" fontSize="8" fontWeight="bold" fontFamily="monospace">+60°C</text>

        {/* 72H Continuous Burn-In Rotor Ring */}
        <g className="sec-burnin-clock">
          <circle cx="100" cy="94" r="50" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
          <circle cx="100" cy="94" r="42" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" />
          
          {/* Clock rotating hand */}
          <line x1="100" y1="94" x2="100" y2="60" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" className="sec-clock-hand" />
          <circle cx="100" cy="94" r="4" fill="#F59E0B" />
        </g>

        {/* RAID Storage Activity Beacons (0 Dropouts) */}
        <g transform="translate(68, 88)">
          <rect x="0" y="0" width="12" height="6" rx="1.5" fill="#10B981" className="sec-raid-led-1" />
          <rect x="18" y="0" width="12" height="6" rx="1.5" fill="#10B981" className="sec-raid-led-2" />
          <rect x="36" y="0" width="12" height="6" rx="1.5" fill="#10B981" className="sec-raid-led-3" />
          <rect x="54" y="0" width="12" height="6" rx="1.5" fill="#10B981" className="sec-raid-led-4" />
        </g>

        {/* Center 72H Badge */}
        <text x="100" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="monospace">
          72H
        </text>
        <text x="100" y="122" textAnchor="middle" fill="#10B981" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
          0 DROPOUTS · RAID
        </text>

        {/* Bottom Certification Banner */}
        <rect x="52" y="152" width="96" height="15" rx="4" fill="#0F172A" stroke="#10B981" strokeWidth="1" />
        <text x="100" y="162" textAnchor="middle" fill="#34D399" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
          CERTIFICACIÓN 100% OK
        </text>
      </svg>
      <div className="sec-hud-badge">
        <span className="sec-hud-live-dot gold" />
        <span>ESTRÉS 72H · -20°C A +60°C</span>
      </div>
    </div>
  );
}
