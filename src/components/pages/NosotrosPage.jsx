import React, { useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  Cpu, 
  Building2, 
  Sparkles,
  FileCheck2,
  Lock,
  Layers,
  Check
} from 'lucide-react';
import './NosotrosPage.css';

export default function NosotrosPage({ onOpenQuote, onNavigateHome, onNavigateService }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const metrics = [
    { num: '+10', lbl: 'Años de Trayectoria (2014 – 2025)', icon: Award },
    { num: '+1,200', lbl: 'Proyectos y Naves Blindadas en México', icon: Building2 },
    { num: '99.8%', lbl: 'Efectividad en Alertas con IA', icon: Cpu },
    { num: '< 1 hr', lbl: 'SLA de Respuesta en Sitio (CDMX y EdoMéx)', icon: Clock },
  ];

  const commitments = [
    {
      title: 'Ingeniería de Planta Certificada',
      desc: 'Nuestros ingenieros cuentan con certificaciones directas de fábrica (Hikvision Platinum, Dahua Tier-1, Honeywell, Ajax, ZKTeco). Cero subcontratación precaria.'
    },
    {
      title: 'Garantía Vitalicia de Mano de Obra',
      desc: 'Sellamos cada canalización, peinado de rack y empalme con garantía de calidad total de por vida. Cualquier vicio de origen se repara sin costo.'
    },
    {
      title: 'Protocolos Abiertos Sin Amarres',
      desc: 'Sistemas 100% interoperables (ONVIF, Wiegand, OSDP). El cliente es el dueño legítimo de sus contraseñas, equipos y arquitectura de red.'
    },
    {
      title: 'Respaldo C4 y Despacho en Minutos',
      desc: 'Monitoreo redundante con analítica de visión artificial y enlace directo para el envío inmediato de cuadrillas en corredores industriales clave.'
    }
  ];

  const pillars = [
    {
      id: 'ingenieria',
      tag: 'Certificación Tier-1',
      title: 'Ingeniería Propia & Cuadrillas Certificadas',
      desc: 'No delegamos tu seguridad en técnicos independientes sin respaldo. Todo nuestro personal pasa por pruebas de control de confianza y capacitación continua en laboratorios de prueba.',
      badge: 'Personal con control de confianza',
      icon: Award,
    },
    {
      id: 'garantia',
      tag: 'Póliza Exclusiva',
      title: 'Póliza Vitalicia de Mano de Obra',
      desc: 'Una mala instalación inutiliza el mejor equipo. Por eso, en Sistemas Cuauhtli garantizamos de por vida la mano de obra, tubería conduit, soportería y etiquetado normativo de cada proyecto.',
      badge: 'Cero costos ocultos o sorpresas',
      icon: ShieldCheck,
    },
    {
      id: 'sla',
      tag: 'Cobertura Operativa',
      title: 'Central C4 & Respuesta Inmediata',
      desc: 'SLA garantizado por contrato con arribo en menos de 1 hora en CDMX/EdoMex y menos de 2 horas en corredores del Bajío, Monterrey y Guadalajara. Monitoreo redundante y enlace de zona 24/7/365.',
      badge: 'Cuadrillas móviles en campo',
      icon: Clock,
    },
    {
      id: 'abierto',
      tag: 'Soberanía Tecnológica',
      title: 'Protocolos Abiertos Sin Dependencias',
      desc: 'Instalamos tecnología con arquitectura estándar (ONVIF, Wiegand, OSDP). Nunca te atamos a licencias propietarias abusivas: mantienes el control total e interoperabilidad de tus sistemas.',
      badge: '100% interoperable con VMS globales',
      icon: Wrench,
    },
  ];

  return (
    <div className="nos-page-root">
      
      {/* 1. SUB-NAV BREADCRUMBS */}
      <nav className="nos-subnav-bar">
        <div className="container nos-subnav-inner">
          <div className="nos-breadcrumbs">
            <button 
              type="button" 
              onClick={onNavigateHome} 
              className="nos-back-btn"
              title="Volver al Inicio"
            >
              <ArrowLeft size={14} />
              <span>Inicio</span>
            </button>
            <span className="nos-breadcrumb-sep">/</span>
            <span className="nos-breadcrumb-current">Sobre Nosotros</span>
          </div>

          <div className="nos-subnav-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span>Póliza de Garantía Vitalicia Activa</span>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="nos-hero">
        <div className="container">
          <div className="nos-hero-content">
            <div className="nos-hero-badge">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A6192E', display: 'inline-block' }} />
              <span>Sistemas Cuauhtli · Ingeniería Electrónica desde 2014</span>
            </div>

            <h1 className="nos-hero-title">
              Ingeniería mexicana de élite que <span className="nos-hero-title-accent">protege lo que más importa</span>.
            </h1>

            <p className="nos-hero-desc">
              Fundada en la Ciudad de México, Sistemas Cuauhtli nació para erradicar las fallas, la improvisación 
              y los falsos disparos en la seguridad electrónica. Hoy blindamos la continuidad operativa 
              de más de 1,200 industrias, centros logísticos CEDIS y corporativos en todo el país.
            </p>

            <div className="nos-hero-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.('Solución Integral Completa')}
                className="btn btn-primary"
                style={{ padding: '15px 32px' }}
              >
                <span>Solicitar Levantamiento Técnico</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                className="btn btn-secondary"
                style={{ padding: '15px 24px' }}
              >
                <span>Ver Soluciones y Casos</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRICS NUMBERS STRIP */}
      <section className="nos-metrics-sec">
        <div className="container">
          <div className="nos-metrics-grid">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="nos-metric-card">
                  <div className="nos-metric-icon">
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="nos-metric-num">{m.num}</div>
                    <div className="nos-metric-lbl">{m.lbl}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. STORY & MANIFESTO */}
      <section className="nos-story-sec">
        <div className="container">
          <div className="nos-story-grid">
            <div>
              <div className="nos-story-badge">
                <FileCheck2 size={14} />
                <span>NUESTRO MANIFIESTO DE INGENIERÍA</span>
              </div>
              <h2 className="nos-story-title">
                La seguridad bien diseñada no debe notarse hasta el momento en que se necesita.
              </h2>
              <p className="nos-story-p">
                Durante más de una década, hemos visto cómo empresas invierten millones en cámaras y sensores que terminan desconectados por saturación de falsas alarmas o por instalaciones mal ejecutadas que fallan ante el primer corte eléctrico.
              </p>
              <p className="nos-story-p">
                En Sistemas Cuauhtli aplicamos una metodología rigurosa: levantamiento tridimensional en sitio, cálculo de luxometría, cableado bajo norma TIA/EIA-568-C.2 y configuración de inteligencia artificial en el borde para que cada alerta sea 100% verificada.
              </p>
            </div>

            <div className="nos-story-box">
              <h3 className="nos-story-box-title">
                <ShieldCheck size={22} color="var(--primary, #A6192E)" />
                <span>Nuestros 4 Compromisos Inquebrantables</span>
              </h3>
              <ul className="nos-commitments-list">
                {commitments.map((c, i) => (
                  <li key={i} className="nos-commitment-item">
                    <div className="nos-commitment-check">
                      <Check size={14} />
                    </div>
                    <div className="nos-commitment-text">
                      <strong>{c.title}</strong>
                      <span>{c.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4 PILLARS GRID */}
      <section className="nos-pillars-sec">
        <div className="container">
          <div className="nos-pillars-sec-head">
            <span className="section-label">PILARES CORPORATIVOS</span>
            <h2 className="section-title">
              ¿Por qué las organizaciones líderes eligen a <span className="nos-hero-title-accent">Sistemas Cuauhtli</span>?
            </h2>
          </div>

          <div className="nos-pillars-grid">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="nos-pillar-card">
                  <div>
                    <div className="nos-pillar-top">
                      <div className="nos-pillar-icon-box">
                        <Icon size={26} />
                      </div>
                      <div>
                        <div className="nos-pillar-tag">{item.tag}</div>
                        <h3 className="nos-pillar-title">{item.title}</h3>
                      </div>
                    </div>
                    <p className="nos-pillar-desc">{item.desc}</p>
                  </div>

                  <div className="nos-pillar-footer">
                    <span className="nos-pillar-badge">
                      <CheckCircle2 size={16} color="var(--primary, #A6192E)" />
                      <span>{item.badge}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CONVERSION BANNER */}
      <section className="nos-bottom-cta">
        <div className="container">
          <div className="nos-cta-box">
            <div className="nos-cta-glow" />
            <div className="nos-cta-left">
              <span className="nos-cta-badge">
                <Sparkles size={13} />
                <span>Levantamiento Técnico Gratuito en Todo México</span>
              </span>
              <h2 className="nos-cta-title">
                Protege tu infraestructura con ingeniería de precisión.
              </h2>
              <p className="nos-cta-desc">
                Un ingeniero especialista visitará tus instalaciones para realizar el estudio de viabilidad sin ningún costo ni compromiso.
              </p>
            </div>

            <div className="nos-cta-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.('Solución Integral Completa')}
                className="nos-cta-btn"
              >
                <span>Agendar Visita Técnica</span>
                <ArrowRight size={16} />
              </button>
              <a href="tel:5585262115" className="nos-cta-tel">
                <Phone size={13} />
                <span>Atención Telefónica Directa: (55) 8526-2115</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
