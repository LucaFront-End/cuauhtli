import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Wrench, 
  Clock, 
  Award,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

export default function WhyCuauhtli({ onOpenQuote }) {
  const pillars = [
    {
      id: 'inversion',
      title: 'Inversión Rentable con ROI Claro',
      desc: 'Evitamos gastos superfluos con ingeniería precisa y equipamiento homologado de alta durabilidad sin obsolescencia programada.',
      icon: TrendingUp,
      stat: '100%',
      statLabel: 'Transparencia de Costos'
    },
    {
      id: 'tecnologia',
      title: 'Tecnología de Vanguardia',
      desc: 'Trabajamos exclusivamente con las marcas líderes mundiales (Hikvision, Dahua, Honeywell, Ajax, ZKTeco) para garantizar interoperabilidad.',
      icon: Cpu,
      stat: '4K AI',
      statLabel: 'Estándar Mínimo Óptico'
    },
    {
      id: 'servicio',
      title: 'Servicio Integral Llave en Mano',
      desc: 'Nos encargamos de todo: diagnóstico técnico en sitio, diseño de planos, canalización e instalación certificada, configuración y capacitación a tu personal.',
      icon: Wrench,
      stat: 'Llave en Mano',
      statLabel: 'Desde Diseño a Entrega'
    },
    {
      id: 'respuesta',
      title: 'Respuesta Rápida en CDMX',
      desc: 'Tiempos de atención técnica garantizados por contrato en CDMX y Área Metropolitana. Cuadrillas móviles listas para soporte inmediato.',
      icon: Clock,
      stat: '< 4 Horas',
      statLabel: 'SLA de Soporte Crítico'
    }
  ];

  return (
    <section 
      id="nosotros"
      style={{
        padding: '100px 0',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge-tag" style={{ marginBottom: '14px' }}>
            <Award size={14} />
            <span>MÁS DE 10 AÑOS DE EXPERIENCIA EN MÉXICO</span>
          </div>
          <h2 className="section-title">
            Garantía de Seguridad Total Cuauhtli
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Nuestra misión es lograr que la incorporación de sistemas de seguridad para tu empresa o residencia 
            deje de ser un dolor de cabeza; nos encargamos de hacer fácil lo que antes era complejo.
          </p>
        </div>

        {/* 4 PILLARS GRID */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '60px'
          }}
        >
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="card-modern"
                style={{
                  padding: '32px 24px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div 
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                    {item.desc}
                  </p>
                </div>

                <div 
                  style={{
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    {item.stat}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.statLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA BANNER (INSPIRED BY REF 2 & REF 3) */}
        <div
          style={{
            backgroundColor: '#0F172A',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 40px',
            color: '#FFFFFF',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* BACKGROUND ACCENT GLOW */}
          <div 
            style={{
              position: 'absolute',
              right: '-10%',
              top: '-50%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: '#60A5FA',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                padding: '4px 12px',
                borderRadius: '9999px',
                marginBottom: '14px'
              }}
            >
              <FileCheck2 size={14} />
              <span>DIAGNÓSTICO TÉCNICO EN SITIO SIN COSTO</span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>
              ¿Listo para blindar tus instalaciones con tecnología de vanguardia?
            </h3>
            <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Un ingeniero especialista visitará tu inmueble en CDMX o Estado de México, 
              detectará vulnerabilidades y te entregará una propuesta formal con especificaciones exactas.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={onOpenQuote}
              className="btn btn-primary btn-lg"
              style={{ padding: '18px 36px', fontSize: '1.05rem' }}
            >
              <span>Agendar Visita Técnica</span>
              <ShieldCheck size={20} />
            </button>
            <span style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>
              Respuesta en menos de 15 minutos hábiles.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
