import React, { useState } from 'react';
import { 
  Smartphone, 
  Lock, 
  Unlock, 
  Bell, 
  Video, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Zap, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function MobileAppPreview({ onOpenQuote }) {
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [alarmArmed, setAlarmArmed] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  const handleToggleGate = () => {
    setGateUnlocked(true);
    setActionNotice('¡Portón Principal abierto remotamente!');
    setTimeout(() => {
      setGateUnlocked(false);
      setActionNotice('');
    }, 4000);
  };

  const handleToggleAlarm = () => {
    setAlarmArmed(!alarmArmed);
    setActionNotice(alarmArmed ? 'Perímetro desarmado manualmente' : '¡Perímetro armado con éxito!');
    setTimeout(() => {
      setActionNotice('');
    }, 3000);
  };

  return (
    <section 
      id="app"
      style={{
        padding: '100px 0',
        backgroundColor: 'var(--bg-main)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            alignItems: 'center'
          }}
          className="app-grid"
        >
          {/* LEFT: INTERACTIVE SMARTPHONE MOCKUP */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{
                width: '320px',
                height: '640px',
                backgroundColor: '#0F172A',
                borderRadius: '48px',
                border: '6px solid #1E293B',
                boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.4), inset 0 0 0 2px rgba(255, 255, 255, 0.1)',
                padding: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                color: '#FFFFFF'
              }}
            >
              {/* PHONE DYNAMIC ISLAND / SPEAKER */}
              <div 
                style={{
                  width: '90px',
                  height: '24px',
                  backgroundColor: '#000000',
                  borderRadius: '12px',
                  margin: '0 auto 12px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1E293B' }} />
              </div>

              {/* PHONE HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                    CUAUTHLI CLOUD OS
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800 }}>
                    Mi Corporativo CDMX
                  </div>
                </div>
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bell size={16} color="#38BDF8" />
                </div>
              </div>

              {/* STATUS CARD */}
              <div 
                style={{
                  backgroundColor: alarmArmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: alarmArmed ? '1px solid #10B981' : '1px solid #EF4444',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                    ESTADO GENERAL
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: alarmArmed ? '#34D399' : '#F87171' }}>
                    {alarmArmed ? 'Escudo Activo 24/7' : 'Sistema en Desarme'}
                  </div>
                </div>
                <ShieldCheck size={24} color={alarmArmed ? '#34D399' : '#F87171'} />
              </div>

              {/* MINI LIVE VIDEO STREAM PREVIEW */}
              <div 
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <img 
                  src="/assets/images/cctv_ptz.jpg" 
                  alt="Streaming Stream"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#38BDF8'
                  }}
                >
                  ● VIVO · CAM 01
                </div>
              </div>

              {/* INTERACTIVE CONTROLS IN APP */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <button
                  onClick={handleToggleGate}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: gateUnlocked ? '#10B981' : '#1E293B',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  {gateUnlocked ? <Unlock size={18} /> : <Lock size={18} />}
                  <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                    {gateUnlocked ? 'Portón Abierto' : 'Abrir Portón'}
                  </span>
                </button>

                <button
                  onClick={handleToggleAlarm}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: alarmArmed ? '#2563EB' : '#475569',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Zap size={18} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                    {alarmArmed ? 'Perímetro ON' : 'Perímetro OFF'}
                  </span>
                </button>
              </div>

              {/* RECENT ACTIVITY FEED */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  Eventos Recientes
                </div>
                
                {actionNotice && (
                  <div 
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid #38BDF8',
                      fontSize: '0.72rem',
                      color: '#E0F2FE',
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                  >
                    {actionNotice}
                  </div>
                )}

                <div 
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    fontSize: '0.72rem',
                    color: '#CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Acceso Biométrico Aprobado</span>
                  <span style={{ color: '#64748B', fontSize: '0.65rem' }}>14:22</span>
                </div>

                <div 
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    fontSize: '0.72rem',
                    color: '#CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Cerca 10kV: Test OK</span>
                  <span style={{ color: '#64748B', fontSize: '0.65rem' }}>13:50</span>
                </div>
              </div>

              {/* HOME INDICATOR BAR */}
              <div 
                style={{
                  width: '120px',
                  height: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '2px',
                  margin: '10px auto 0 auto'
                }}
              />
            </div>
          </div>

          {/* RIGHT: DESCRIPTIVE TEXT & BENEFITS */}
          <div>
            <div className="badge-tag" style={{ marginBottom: '14px' }}>
              <Smartphone size={14} />
              <span>CONTROL TOTAL EN TU DISPOSITIVO</span>
            </div>

            <h2 className="section-title">
              La Inteligencia de tu Empresa al Alcance de tus Manos
            </h2>

            <p className="section-desc" style={{ marginBottom: '32px' }}>
              Olvídate de monitores estáticos en cuartos oscuros. Con la plataforma móvil de Sistemas Cuauhtli, 
              accedes a streams de video 4K en vivo, abres puertas a visitantes y recibes alertas push 
              instantáneas con foto o video verificación desde cualquier parte del mundo.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Video size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Visualización Multidispositivo Simultánea
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Acceso para múltiples usuarios con niveles de permisos diferenciados (Directores, Seguridad, Administradores).
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Bell size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Alertas Críticas con Verificación de Video
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Si se detecta un intruso o se corta un cable perimetral, recibes una notificación en menos de 2 segundos.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <button onClick={onOpenQuote} className="btn btn-primary btn-lg">
                <span>Solicitar Demo de la App</span>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .app-grid {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
      `}</style>
    </section>
  );
}
