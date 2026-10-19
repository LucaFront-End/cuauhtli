import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Video, 
  Maximize2, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  ShieldCheck, 
  Scan, 
  Cpu, 
  Crosshair,
  RefreshCw,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export default function LiveCctvSimulator() {
  const [activeChannel, setActiveChannel] = useState(0);
  const [nightVisionMode, setNightVisionMode] = useState('day'); // 'day', 'colorvu', 'ir'
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [timeString, setTimeString] = useState('');
  const [simulatedAlert, setSimulatedAlert] = useState(false);

  // Real-time live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0') + ' CST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const channels = [
    {
      id: 'cam1',
      name: 'CAM-01: Acceso Vehicular Principal',
      image: '/assets/images/cctv_ptz.jpg',
      location: 'Acceso Norte - Puerta A',
      aiTarget: 'VEHÍCULO DETECTADO',
      plate: 'PLACA: ABC-729-M [AUTORIZADA]',
      confidence: '99.8%',
      status: 'SEGURO',
      fps: '60.0 FPS',
      bitrate: '8,420 Kbps',
      box: { top: '35%', left: '30%', width: '38%', height: '42%' }
    },
    {
      id: 'cam2',
      name: 'CAM-02: Control de Acceso Biométrico',
      image: '/assets/images/access_control.jpg',
      location: 'Torniquetes Lobby Ejecutivo',
      aiTarget: 'ROSTRO VERIFICADO',
      plate: 'ID: ING. ROBERTO SALAS · RRHH',
      confidence: '99.9%',
      status: 'ACCESO CONCEDIDO',
      fps: '60.0 FPS',
      bitrate: '6,210 Kbps',
      box: { top: '25%', left: '42%', width: '22%', height: '35%' }
    },
    {
      id: 'cam3',
      name: 'CAM-03: Perímetro Electrificado',
      image: '/assets/images/perimeter_fence.jpg',
      location: 'Perímetro Poniente - 10,000V',
      aiTarget: 'INTEGRIDAD DE LÍNEA',
      plate: 'VOLTAJE NOMINAL: 10.4 kV',
      confidence: '100%',
      status: 'LÍNEA ARMADA',
      fps: '30.0 FPS',
      bitrate: '4,100 Kbps',
      box: { top: '40%', left: '25%', width: '50%', height: '30%' }
    },
    {
      id: 'cam4',
      name: 'CAM-04: Video Portero IP Ejecutivo',
      image: '/assets/images/videodoorbell.jpg',
      location: 'Entrada Dirección General',
      aiTarget: 'VISITA RECONOCIDA',
      plate: 'ESTADO: INTERCOM STANDBY',
      confidence: '99.4%',
      status: 'LISTO',
      fps: '30.0 FPS',
      bitrate: '3,850 Kbps',
      box: { top: '20%', left: '35%', width: '28%', height: '55%' }
    }
  ];

  const current = channels[activeChannel];

  const triggerTestAlert = () => {
    setSimulatedAlert(true);
    setTimeout(() => {
      setSimulatedAlert(false);
    }, 3500);
  };

  // Image filters based on night vision mode
  const getImageFilter = () => {
    if (nightVisionMode === 'ir') {
      return 'grayscale(100%) contrast(140%) brightness(90%) sepia(20%) hue-rotate(80deg)';
    }
    if (nightVisionMode === 'colorvu') {
      return 'brightness(110%) saturate(130%) contrast(105%)';
    }
    return 'none';
  };

  return (
    <section 
      id="simulador"
      style={{
        padding: '100px 0',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="badge-tag" style={{ marginBottom: '14px' }}>
            <Scan size={14} />
            <span>CONSOLA EN VIVO · SISTEMAS CUAUTHLI</span>
          </div>
          <h2 className="section-title">
            Simulador de Analítica e Inteligencia Artificial
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Experimenta en tiempo real cómo nuestros sistemas detectan, analizan y clasifican 
            eventos sin demora humana. Cambia de canal, prueba la visión nocturna o activa una prueba de alerta.
          </p>
        </div>

        {/* SIMULATOR INTERFACE WRAPPER */}
        <div
          style={{
            backgroundColor: '#0B1120',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #1E293B',
            boxShadow: '0 25px 60px -15px rgba(11, 17, 32, 0.35)',
            overflow: 'hidden',
            color: '#FFFFFF'
          }}
        >
          {/* CONSOLE TOP BAR */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: '#0F172A',
              borderBottom: '1px solid #1E293B',
              gap: '16px'
            }}
          >
            {/* LEFT: LIVE RECORDING STATUS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    boxShadow: '0 0 10px #EF4444',
                    animation: 'pulseBeacon 1.2s infinite'
                  }} 
                />
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#EF4444' }}>
                  REC 4K
                </span>
              </div>

              <div style={{ height: '16px', width: '1px', backgroundColor: '#334155' }} />

              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>
                {timeString || '2026-10-18 14:00:00 CST'}
              </span>
            </div>

            {/* RIGHT: CONTROLS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              
              {/* TOGGLE AI BOXES */}
              <button
                onClick={() => setShowAiBoxes(!showAiBoxes)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: showAiBoxes ? 'rgba(37, 99, 235, 0.25)' : '#1E293B',
                  border: showAiBoxes ? '1px solid #3B82F6' : '1px solid #334155',
                  color: showAiBoxes ? '#60A5FA' : '#94A3B8',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Cpu size={14} />
                <span>IA Bounding Box: {showAiBoxes ? 'ON' : 'OFF'}</span>
              </button>

              {/* NIGHT VISION SELECTOR */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#1E293B',
                  borderRadius: '6px',
                  padding: '2px',
                  border: '1px solid #334155'
                }}
              >
                <button
                  onClick={() => setNightVisionMode('day')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: nightVisionMode === 'day' ? '#3B82F6' : 'transparent',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                  title="Modo Día estándar"
                >
                  <Sun size={13} />
                </button>
                <button
                  onClick={() => setNightVisionMode('colorvu')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: nightVisionMode === 'colorvu' ? '#3B82F6' : 'transparent',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                  title="Modo ColorVu (visión nocturna a color)"
                >
                  <Moon size={13} /> ColorVu
                </button>
                <button
                  onClick={() => setNightVisionMode('ir')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: nightVisionMode === 'ir' ? '#3B82F6' : 'transparent',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                  title="Modo Infrarrojo B/N Térmico"
                >
                  IR B/N
                </button>
              </div>

              {/* TEST ALERT TRIGGER */}
              <button
                onClick={triggerTestAlert}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)'
                }}
              >
                <ShieldAlert size={14} />
                <span>Simular Alerta</span>
              </button>
            </div>
          </div>

          {/* MAIN MONITOR SCREEN AREA */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              backgroundColor: '#000000',
              overflow: 'hidden'
            }}
          >
            {/* BACKGROUND CAMERA STILL WITH DYNAMIC FILTER */}
            <img 
              src={current.image} 
              alt={current.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: getImageFilter(),
                transition: 'filter 0.4s ease'
              }}
            />

            {/* SCANNING LASER EFFECT */}
            <div className="scan-laser" />

            {/* SCREEN GRID OVERLAY */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
                backgroundSize: '100% 4px, 6px 100%',
                pointerEvents: 'none'
              }}
            />

            {/* TOP OVERLAY DATA */}
            <div 
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#38BDF8', fontWeight: 700 }}>{current.name}</span>
                <span style={{ color: '#94A3B8' }}>[{current.location}]</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                CODEC: H.265+ · {current.fps} · BITRATE: {current.bitrate}
              </div>
            </div>

            {/* CROSSHAIRS IN CENTER */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                opacity: 0.35,
                color: '#38BDF8'
              }}
            >
              <Crosshair size={42} strokeWidth={1} />
            </div>

            {/* AI BOUNDING BOX SIMULATION */}
            {showAiBoxes && (
              <div
                style={{
                  position: 'absolute',
                  top: current.box.top,
                  left: current.box.left,
                  width: current.box.width,
                  height: current.box.height,
                  border: simulatedAlert ? '2px solid #EF4444' : '2px solid #10B981',
                  boxShadow: simulatedAlert ? '0 0 15px rgba(239, 68, 68, 0.7)' : '0 0 15px rgba(16, 185, 129, 0.5)',
                  backgroundColor: simulatedAlert ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.08)',
                  pointerEvents: 'none',
                  transition: 'all 0.3s ease',
                  borderRadius: '4px'
                }}
              >
                {/* BOUNDING BOX CORNERS */}
                <div style={{ position: 'absolute', top: -1, left: -1, width: 8, height: 8, borderTop: '3px solid #FFFFFF', borderLeft: '3px solid #FFFFFF' }} />
                <div style={{ position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderTop: '3px solid #FFFFFF', borderRight: '3px solid #FFFFFF' }} />
                <div style={{ position: 'absolute', bottom: -1, left: -1, width: 8, height: 8, borderBottom: '3px solid #FFFFFF', borderLeft: '3px solid #FFFFFF' }} />
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, borderBottom: '3px solid #FFFFFF', borderRight: '3px solid #FFFFFF' }} />

                {/* TARGET HUD LABEL */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-26px',
                    left: 0,
                    backgroundColor: simulatedAlert ? '#EF4444' : '#10B981',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '2px',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Cpu size={11} />
                  <span>{simulatedAlert ? 'ALERTA DE INTRUSIÓN DETECTADA' : `${current.aiTarget} · ${current.confidence}`}</span>
                </div>

                <div 
                  style={{
                    position: 'absolute',
                    bottom: '-22px',
                    left: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#E2E8F0',
                    padding: '2px 8px',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '2px'
                  }}
                >
                  {current.plate}
                </div>
              </div>
            )}

            {/* SIMULATED ALERT POPUP BANNER */}
            {simulatedAlert && (
              <div 
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(220, 38, 38, 0.95)',
                  border: '2px solid #FCA5A5',
                  padding: '20px 32px',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  boxShadow: '0 0 50px rgba(220, 38, 38, 0.8)',
                  animation: 'pulseBeacon 0.8s infinite',
                  zIndex: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
                  <ShieldAlert size={28} />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    ¡PROTOCOLO DE SEGURIDAD DISPARADO!
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem' }}>
                  Notificación enviada a Central Cuauhtli 24/7 y dispositivos móviles de seguridad.
                </p>
              </div>
            )}

            {/* BOTTOM STREAM HUD */}
            <div 
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #334155',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-beacon" />
                {current.status}
              </span>
              <span style={{ color: '#64748B' }}>|</span>
              <span style={{ color: '#94A3B8' }}>LATENCIA: 12ms</span>
            </div>
          </div>

          {/* CHANNEL SELECTOR TABS AT BOTTOM */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              backgroundColor: '#0F172A',
              borderTop: '1px solid #1E293B'
            }}
          >
            {channels.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(idx)}
                style={{
                  padding: '16px 20px',
                  backgroundColor: activeChannel === idx ? '#1E293B' : 'transparent',
                  border: 'none',
                  borderBottom: activeChannel === idx ? '3px solid #3B82F6' : '3px solid transparent',
                  borderRight: idx < channels.length - 1 ? '1px solid #1E293B' : 'none',
                  color: activeChannel === idx ? '#FFFFFF' : '#94A3B8',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
              >
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: activeChannel === idx ? '#2563EB' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  <Video size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '2px' }}>
                    {ch.name.split(':')[0]}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: activeChannel === idx ? '#93C5FD' : '#64748B' }}>
                    {ch.location}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
