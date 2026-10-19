import React, { useState } from 'react';
import { PhoneCall, Unlock, Mic, Moon, ShieldCheck, Video, PhoneOff } from 'lucide-react';
import './IsometricHeroes.css';

export default function IntercomIsometricScene() {
  const [callStatus, setCallStatus] = useState('standby'); // 'standby' | 'calling' | 'connected' | 'unlocked'
  const [nightVision, setNightVision] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  const triggerCall = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
    }, 1800);
  };

  const triggerUnlock = () => {
    setCallStatus('unlocked');
    setTimeout(() => {
      setCallStatus('standby');
      setAudioActive(false);
    }, 3200);
  };

  const toggleAudio = () => {
    setAudioActive(!audioActive);
  };

  const endCall = () => {
    setCallStatus('standby');
    setAudioActive(false);
  };

  const isUnlocked = callStatus === 'unlocked';
  const isRinging = callStatus === 'calling';
  const isConnected = callStatus === 'connected';

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
          <linearGradient id="intercomWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          <linearGradient id="intercomSteelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="screenGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={nightVision ? '#059669' : '#0284C7'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={nightVision ? '#064E3B' : '#0369A1'} stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="doorGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.18" />
          </linearGradient>

          <linearGradient id="signalWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A6192E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2B5672" stopOpacity="0.1" />
          </linearGradient>

          <filter id="intercomGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. ISOMETRIC FLOOR SLAB */}
        <g id="iso-floor">
          <polygon points="300,410 520,300 520,320 300,430" fill="#CBD5E1" />
          <polygon points="300,410 80,300 80,320 300,430" fill="#94A3B8" />
          
          <polygon points="300,170 520,300 300,410 80,300" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Entrance Pavers Grid */}
          <path
            d="
              M 190,235 L 410,355
              M 245,202 L 465,327
              M 135,267 L 355,382
              M 410,235 L 190,355
              M 355,202 L 135,327
              M 465,267 L 245,382
            "
            stroke="#CBD5E1"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            strokeOpacity="0.6"
          />

          {/* Welcome Mat / Access Footprint */}
          <polygon
            points="290,285 360,325 310,352 240,312"
            fill={isUnlocked ? '#D1FAE5' : '#E2E8F0'}
            stroke={isUnlocked ? '#10B981' : '#94A3B8'}
            strokeWidth="1.2"
          />
          <text x="290" y="322" fill={isUnlocked ? '#065F46' : '#64748B'} fontSize="7" fontWeight="bold" textAnchor="middle" transform="rotate(-15 290 322)">
            {isUnlocked ? 'PASE ADELANTE' : 'ZONA ACCESO'}
          </text>
        </g>

        {/* 2. ISOMETRIC ARCHITECTURAL ENTRANCE PORTAL & WALL */}
        <g id="iso-portal">
          {/* Main Left Pillar / Wall */}
          <polygon points="170,110 230,75 230,270 170,305" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
          <polygon points="230,75 250,86 250,281 230,270" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />

          {/* Lintle Top Beam */}
          <polygon points="230,75 390,165 390,195 230,105" fill="#94A3B8" />
          <polygon points="170,110 330,200 330,215 170,125" fill="#64748B" />

          {/* Right Pillar */}
          <polygon points="390,195 430,218 430,378 390,355" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
          <polygon points="370,207 390,195 390,355 370,367" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

          {/* Tempered Glass Entrance Door (Swings open if unlocked) */}
          <g transform={isUnlocked ? "translate(-15, -10) rotate(-14 250 281)" : "translate(0, 0)"} style={{ transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <polygon
              points="248,115 372,185 372,360 248,290"
              fill="url(#doorGlassGrad)"
              stroke="#60A5FA"
              strokeWidth="1.5"
            />
            {/* Stainless Steel Pull Handle */}
            <line x1="355" y1="230" x2="355" y2="290" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="354" y1="230" x2="354" y2="290" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
            
            {/* Magnetic Lock on Door Frame */}
            <rect
              x="358"
              y="172"
              width="18"
              height="8"
              rx="2"
              fill={isUnlocked ? '#10B981' : '#A6192E'}
              filter="url(#intercomGlow)"
            />
          </g>
        </g>

        {/* 3. OUTDOOR IP VIDEOPORTERO STATION (Mounted on Left Pillar) */}
        <g id="iso-intercom-station" transform="translate(195, 160)">
          {/* Backplate / Housing */}
          <polygon points="0,0 26,-15 26,60 0,75" fill="url(#intercomSteelGrad)" stroke="#64748B" strokeWidth="1.2" />
          <polygon points="26,-15 32,-11 32,64 26,60" fill="#0F172A" />

          {/* 2K Ultra-Wide Camera Lens */}
          <circle cx="13" cy="14" r="7" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
          <circle cx="13" cy="14" r="4" fill="#0284C7" />
          <circle cx="14.5" cy="12.5" r="1.5" fill="#FFFFFF" opacity="0.9" />

          {/* Night Vision Infrared LEDs */}
          <circle cx="6" cy="14" r="1.5" fill={nightVision ? '#EF4444' : '#475569'} />
          <circle cx="20" cy="14" r="1.5" fill={nightVision ? '#EF4444' : '#475569'} />

          {/* High-Resolution OLED Micro-Display */}
          <polygon points="4,27 22,17 22,42 4,52" fill="url(#screenGlassGrad)" />
          {/* Display text simulation */}
          <line x1="7" y1="33" x2="19" y2="26" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="7" y1="39" x2="16" y2="34" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" />

          {/* Backlit Touch Call Button */}
          <circle
            cx="13"
            cy="62"
            r="6"
            fill={isRinging ? '#A6192E' : isConnected ? '#10B981' : '#2B5672'}
            stroke="#FFFFFF"
            strokeWidth="1"
            className={isRinging ? 'iso-spark-anim' : ''}
          />
          {/* Bell Icon inside button */}
          <path d="M 11,61 Q 13,59 15,61 L 15,63 L 11,63 Z" fill="#FFFFFF" />
        </g>

        {/* 4. SIP CALL RIPPLE & WIRELESS WAVES (Floating when ringing/calling) */}
        {(isRinging || isConnected) && (
          <g id="iso-signal-waves" transform="translate(210, 220)">
            <ellipse cx="0" cy="0" rx="35" ry="18" fill="none" stroke="#A6192E" strokeWidth="1.5" strokeOpacity="0.8" className="iso-ripple-wave" />
            <ellipse cx="0" cy="0" rx="60" ry="30" fill="none" stroke="#2B5672" strokeWidth="1" strokeOpacity="0.5" className="iso-ripple-wave" style={{ animationDelay: '0.6s' }} />
          </g>
        )}

        {/* 5. FLOATING 2.5D ISOMETRIC CLIENT SMARTPHONE / MONITOR TABLET */}
        <g id="iso-mobile-monitor" className="iso-float-slow" transform="translate(390, 80)">
          {/* Tablet Shadow */}
          <ellipse cx="60" cy="180" rx="55" ry="18" fill="rgba(15, 23, 42, 0.12)" />

          {/* Phone / Screen Body */}
          <polygon points="10,30 95,-18 135,10 50,58" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <polygon points="10,30 50,58 50,158 10,130" fill="#0F172A" />
          <polygon points="50,58 135,10 135,110 50,158" fill="#334155" />

          {/* Screen Face */}
          <polygon
            points="18,34 92,-8 127,14 53,56"
            fill={nightVision ? '#064E3B' : '#0F172A'}
          />

          {/* Live Video Feed Image inside screen */}
          <g transform="translate(30, 10)">
            {/* Simulated Visitor Silhouette in 2K video feed */}
            <circle cx="42" cy="16" r="9" fill={nightVision ? '#34D399' : '#38BDF8'} />
            <path d="M 28,38 C 28,26 56,26 56,38" fill={nightVision ? '#059669' : '#0284C7'} />

            {/* Video Live Badge */}
            <rect x="18" y="2" width="22" height="7" rx="2" fill="#A6192E" />
            <text x="29" y="7" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle">LIVE 2K</text>
          </g>

          {/* Call Status Banner on Phone */}
          <g transform="translate(30, 48)">
            <rect x="0" y="0" width="76" height="14" rx="3" fill="rgba(15, 23, 42, 0.85)" />
            <text x="38" y="9" fill={isUnlocked ? '#34D399' : '#F8FAFC'} fontSize="6" fontWeight="bold" textAnchor="middle">
              {isRinging ? 'LLAMADA ENTRANTE...' : isConnected ? 'AUDIO CONECTADO (2K)' : isUnlocked ? '¡PUERTA ABIERTA!' : 'SISTEMA CUAUTHLI SIP'}
            </text>
          </g>

          {/* Audio Waveform if Audio Active */}
          {audioActive && (
            <g transform="translate(42, 38)">
              <rect x="0" y="2" width="2" height="6" fill="#38BDF8" className="iso-spark-anim" />
              <rect x="5" y="0" width="2" height="10" fill="#38BDF8" className="iso-spark-anim" style={{ animationDelay: '0.2s' }} />
              <rect x="10" y="3" width="2" height="5" fill="#38BDF8" className="iso-spark-anim" style={{ animationDelay: '0.4s' }} />
              <rect x="15" y="1" width="2" height="8" fill="#38BDF8" className="iso-spark-anim" style={{ animationDelay: '0.1s' }} />
              <rect x="20" y="4" width="2" height="4" fill="#38BDF8" className="iso-spark-anim" style={{ animationDelay: '0.3s' }} />
            </g>
          )}
        </g>

        {/* 6. MAGNETIC STRIKE VOLTAGE PULSE & STATUS */}
        <g id="iso-maglock-status" transform="translate(370, 155)">
          <circle cx="0" cy="0" r="10" fill={isUnlocked ? '#10B981' : '#A6192E'} fillOpacity="0.2" />
          <circle cx="0" cy="0" r="4" fill={isUnlocked ? '#10B981' : '#A6192E'} />
          <text x="14" y="3" fill={isUnlocked ? '#059669' : '#A6192E'} fontSize="7" fontWeight="bold">
            {isUnlocked ? 'DESBLOQUEADO' : 'BLOQUEO 300KG'}
          </text>
        </g>
      </svg>

      {/* LIVE TELEMETRY HUD */}
      <div className="iso-hud-overlay">
        <div className="iso-hud-status-row">
          <span 
            className="iso-hud-dot" 
            style={{ 
              backgroundColor: isUnlocked ? '#10B981' : isConnected ? '#38BDF8' : isRinging ? '#A6192E' : '#2B5672' 
            }} 
          />
          <strong style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}>
            {isUnlocked ? 'ACCESO CONCEDIDO' : isConnected ? 'EN LLAMADA SIP' : isRinging ? 'TIMBRANDO...' : 'PORTERO IP ACTIVO'}
          </strong>
        </div>
        <div className="iso-hud-meta">
          <span>PROTOCOLO: SIP 2.0 / P2P</span>
          <span>VIDEO: 2K QHD (1440p) WDR</span>
        </div>
        <div className="iso-hud-meta">
          <span>AUDIO: DÚPLEX CANCELACIÓN ECO</span>
          <span>CHAPA: {isUnlocked ? 'ABIERTA' : 'ENERGIZADA (NO/NC)'}</span>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS BAR */}
      <div className="iso-controls-bar">
        {callStatus === 'standby' ? (
          <button 
            type="button" 
            onClick={triggerCall}
            className="iso-btn"
            style={{ background: '#A6192E', color: '#FFFFFF' }}
          >
            <PhoneCall size={13} />
            <span>Timbrar Portero</span>
          </button>
        ) : (
          <button 
            type="button" 
            onClick={endCall}
            className="iso-btn"
            style={{ background: '#1D1E1B', color: '#FFFFFF' }}
          >
            <PhoneOff size={13} />
            <span>Colgar</span>
          </button>
        )}

        <button 
          type="button" 
          onClick={triggerUnlock}
          className="iso-btn"
          style={{ 
            background: isUnlocked ? '#10B981' : '#2B5672', 
            color: '#FFFFFF' 
          }}
        >
          <Unlock size={13} />
          <span>{isUnlocked ? '¡Abierto!' : 'Abrir Chapa Magnética'}</span>
        </button>

        <button 
          type="button" 
          onClick={toggleAudio}
          className="iso-btn"
          style={{ 
            background: audioActive ? '#0284C7' : '#F1F5F9', 
            color: audioActive ? '#FFFFFF' : '#1D1E1B' 
          }}
        >
          <Mic size={13} />
          <span>{audioActive ? 'Micrófono Mute' : 'Audio 2 Vías'}</span>
        </button>

        <button 
          type="button" 
          onClick={() => setNightVision(!nightVision)}
          className="iso-btn"
          style={{ 
            background: nightVision ? '#15803D' : '#F1F5F9', 
            color: nightVision ? '#FFFFFF' : '#1D1E1B' 
          }}
        >
          <Moon size={13} />
          <span>{nightVision ? 'IR Noche ON' : 'Modo Noche'}</span>
        </button>
      </div>

    </div>
  );
}
