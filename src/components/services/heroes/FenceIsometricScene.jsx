import React, { useState } from 'react';
import { Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import './IsometricHeroes.css';

export default function FenceIsometricScene() {
  const [sparkActive, setSparkActive] = useState(false);
  const [wireCut, setWireCut] = useState(false);
  const [voltage, setVoltage] = useState(13800);

  const triggerSpark = () => {
    setSparkActive(true);
    setTimeout(() => setSparkActive(false), 2600);
  };

  const toggleCut = () => {
    if (!wireCut) {
      setWireCut(true);
      setVoltage(0);
    } else {
      setWireCut(false);
      setVoltage(13800);
    }
  };

  return (
    <div className="iso-scene-wrap">
      
      {/* 2.5D ISOMETRIC VECTOR ILLUSTRATION */}
      <svg
        className="iso-svg-canvas"
        viewBox="0 0 600 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wallTextureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="fencePostSteel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="voltageWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#93C5FD" stopOpacity="1" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
          </linearGradient>

          <filter id="sparkGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. ISOMETRIC GROUND SLAB */}
        <g id="iso-ground">
          <polygon points="300,410 520,300 520,320 300,430" fill="#CBD5E1" />
          <polygon points="300,410 80,300 80,320 300,430" fill="#94A3B8" />
          <polygon points="300,170 520,300 300,410 80,300" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
        </g>

        {/* 2. ISOMETRIC CONCRETE PERIMETER WALL */}
        <g id="iso-perimeter-wall">
          {/* Wall Left Face (Shadowed) */}
          <polygon points="120,320 480,140 480,200 120,380" fill="url(#wallTextureGrad)" stroke="#94A3B8" strokeWidth="1" />
          {/* Wall Top Crest */}
          <polygon points="110,315 120,320 480,140 470,135" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
          {/* Front Wall Face (Highlight) */}
          <polygon points="110,315 470,135 470,195 110,375" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          
          {/* Expansion Joint Grooves */}
          <line x1="230" y1="255" x2="230" y2="315" stroke="#94A3B8" strokeWidth="0.8" />
          <line x1="350" y1="195" x2="350" y2="255" stroke="#94A3B8" strokeWidth="0.8" />
        </g>

        {/* 3. 3 ISOMETRIC TENSION POSTS (CEDULA 30 GALVANIZED) */}
        {/* Post 1 (Left) */}
        <g id="fence-post-1" transform="translate(160, 240)">
          <polygon points="-4,50 4,50 4,-50 -4,-50" fill="url(#fencePostSteel)" stroke="#475569" strokeWidth="0.8" />
          {/* Insulator Brackets */}
          {[-40, -22, -4, 14, 32].map((y, idx) => (
            <g key={idx} transform={`translate(0, ${y})`}>
              <rect x="2" y="-4" width="10" height="8" rx="2" fill="#1D1E1B" />
              <circle cx="7" cy="0" r="2.5" fill="#FACC15" />
            </g>
          ))}
        </g>

        {/* Post 2 (Center) */}
        <g id="fence-post-2" transform="translate(290, 175)">
          <polygon points="-4,50 4,50 4,-50 -4,-50" fill="url(#fencePostSteel)" stroke="#475569" strokeWidth="0.8" />
          {[-40, -22, -4, 14, 32].map((y, idx) => (
            <g key={idx} transform={`translate(0, ${y})`}>
              <rect x="2" y="-4" width="10" height="8" rx="2" fill="#1D1E1B" />
              <circle cx="7" cy="0" r="2.5" fill="#FACC15" />
            </g>
          ))}
          {/* Official Danger High Voltage Sign on Center Post */}
          <rect x="-18" y="-12" width="36" height="24" rx="3" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          <text x="-14" y="2" fill="#000000" fontSize="7" fontWeight="bold" fontFamily="monospace">PELIGRO</text>
          <text x="-12" y="9" fill="#000000" fontSize="5.5" fontWeight="bold" fontFamily="monospace">14,000 V</text>
        </g>

        {/* Post 3 (Right) */}
        <g id="fence-post-3" transform="translate(420, 110)">
          <polygon points="-4,50 4,50 4,-50 -4,-50" fill="url(#fencePostSteel)" stroke="#475569" strokeWidth="0.8" />
          {[-40, -22, -4, 14, 32].map((y, idx) => (
            <g key={idx} transform={`translate(0, ${y})`}>
              <rect x="2" y="-4" width="10" height="8" rx="2" fill="#1D1E1B" />
              <circle cx="7" cy="0" r="2.5" fill="#FACC15" />
            </g>
          ))}
        </g>

        {/* 4. 5 HIGH-VOLTAGE WIRE STRANDS ACROSS POSTS */}
        <g id="iso-wires">
          {[-40, -22, -4, 14, 32].map((yOffset, idx) => {
            const isCutLine = idx === 2 && wireCut;
            return (
              <g key={idx}>
                {isCutLine ? (
                  /* Broken Wire with Spark & Warning */
                  <>
                    <line x1="167" y1={240 + yOffset} x2="250" y2={200 + yOffset} stroke="#A6192E" strokeWidth="1.8" strokeDasharray="4 2" />
                    <line x1="330" y1={150 + yOffset} x2="427" y2={110 + yOffset} stroke="#A6192E" strokeWidth="1.8" strokeDasharray="4 2" />
                    <circle cx="250" cy={200 + yOffset} r="4" fill="#EF4444" filter="url(#sparkGlow)" />
                  </>
                ) : (
                  /* Intact Energized Aluminum Wire */
                  <>
                    <line
                      x1="167"
                      y1={240 + yOffset}
                      x2="427"
                      y2={110 + yOffset}
                      stroke={sparkActive ? '#60A5FA' : '#94A3B8'}
                      strokeWidth={sparkActive ? "2.2" : "1.4"}
                    />
                    {/* Energy wave pulse dot moving along the wire */}
                    <circle
                      cx={297 + Math.sin(idx) * 20}
                      cy={175 + yOffset + Math.sin(idx) * 10}
                      r="2"
                      fill={sparkActive ? '#93C5FD' : '#2B5672'}
                      filter="url(#sparkGlow)"
                    />
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* 5. ELECTRIC SPARK ARCS (ANIMATED LIGHTNING ON TEST TRIGGER) */}
        {sparkActive && (
          <g className="iso-spark-anim" id="iso-electric-sparks">
            <path
              d="M 230,195 L 245,188 L 240,175 L 255,168 L 248,155 L 260,145"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#sparkGlow)"
            />
            <path
              d="M 330,145 L 345,138 L 340,125 L 355,118"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#sparkGlow)"
            />
            <circle cx="245" cy="175" r="8" fill="rgba(96, 165, 250, 0.4)" filter="url(#sparkGlow)" />
            <circle cx="340" cy="130" r="6" fill="rgba(147, 197, 253, 0.4)" filter="url(#sparkGlow)" />
          </g>
        )}

        {/* 6. TELEMETRY BADGE ON WALL */}
        <g transform="translate(180, 310)" className="iso-float-slow">
          <rect
            x="0"
            y="0"
            width="175"
            height="32"
            rx="6"
            fill="rgba(29, 30, 27, 0.94)"
            stroke={wireCut ? '#A6192E' : '#10B981'}
            strokeWidth="1.2"
          />
          <circle cx="16" cy="16" r="5" fill={wireCut ? '#A6192E' : '#10B981'} />
          <text x="28" y="14" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">
            {wireCut ? '¡ALERTA! CORTE DE ALAMBRE' : 'ENERGIZADOR: 13,800 VOLTS'}
          </text>
          <text x="28" y="24" fill="#94A3B8" fontSize="7" fontFamily="monospace">
            {wireCut ? 'ZONA PERÍMETRO OESTE · ALARMA' : 'IMPULSO 1.0 HZ · TIERRA OK'}
          </text>
        </g>

      </svg>

      {/* FLOATING CYBER HUD TELEMETRY */}
      <div className="iso-hud-overlay">
        <div className="iso-hud-status-row">
          <span 
            className="iso-hud-dot" 
            style={{ 
              color: wireCut ? '#A6192E' : '#10B981',
              backgroundColor: wireCut ? '#A6192E' : '#10B981' 
            }} 
          />
          <strong style={{ color: '#F1F5F9' }}>
            {wireCut ? 'SABOTAJE: CORTE DE LÍNEA' : 'CERCA ENERGIZADA: NOM-001'}
          </strong>
        </div>
        <div className="iso-hud-meta">
          <span>TENSIÓN: {voltage} V</span>
          <span>LAZO: {wireCut ? 'ABIERTO' : 'CERRADO (OK)'}</span>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS BAR */}
      <div className="iso-controls-bar">
        <button
          type="button"
          onClick={triggerSpark}
          className="iso-btn"
          style={{
            background: sparkActive ? '#2B5672' : '#F1F5F9',
            color: sparkActive ? '#FFFFFF' : '#1D1E1B',
          }}
        >
          <Zap size={13} />
          <span>Probar Descarga (13.8 kV)</span>
        </button>

        <button
          type="button"
          onClick={toggleCut}
          className="iso-btn"
          style={{
            background: wireCut ? '#A6192E' : '#FFF1F2',
            color: wireCut ? '#FFFFFF' : '#A6192E',
          }}
        >
          <AlertTriangle size={13} />
          <span>{wireCut ? 'Restablecer Alambre' : 'Simular Corte de Cable'}</span>
        </button>
      </div>

    </div>
  );
}
