import React, { useEffect } from 'react';
import { 
  Users, 
  Radio, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Building,
  Sparkles,
  Share2,
  FileText
} from 'lucide-react';
import './ComunidadPage.css';

export default function ComunidadPage({ onOpenQuote, onNavigateHome, onNavigateService }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const metrics = [
    { num: '1,200+', lbl: 'Empresas y Naves en la Red', icon: Building },
    { num: '4', lbl: 'Grandes Corredores Conectados', icon: Radio },
    { num: '12', lbl: 'Masterclasses Técnicas al Año', icon: GraduationCap },
    { num: '100%', lbl: 'Acceso Gratuito para Clientes', icon: ShieldCheck },
  ];

  const pillars = [
    {
      id: 'alerta',
      tag: 'Inteligencia Compartida',
      title: 'Red de Alerta Temprana & Corredores',
      desc: 'Monitoreo preventivo y reporte de incidencias en tiempo real entre parques industriales del Valle de México, Bajío, Monterrey y Guadalajara para anticipar modus operandi delictivo.',
      icon: Radio,
      items: [
        'Avisos preventivos en corredores logísticos e industriales',
        'Coordinación directa con cámaras de seguridad y C4',
        'Protocolos de reacción rápida ante alertas de intrusión'
      ]
    },
    {
      id: 'capacitacion',
      tag: 'Formación Continua',
      title: 'Mesas Técnicas & Capacitación C4',
      desc: 'Masterclasses mensuales, actualización en normativas STPS / NOM y entrenamiento técnico para que el personal de monitoreo de nuestros clientes opere con el máximo estándar.',
      icon: GraduationCap,
      items: [
        'Talleres sobre analítica de video perimetral con IA',
        'Auditorías de ciberseguridad en redes CCTV IP',
        'Certificación de operadores en plataformas VMS'
      ]
    },
    {
      id: 'benchmarking',
      tag: 'Círculo de Seguridad',
      title: 'Casos de Éxito & Benchmarking Industrial',
      desc: 'Espacio de intercambio de mejores prácticas entre más de 1,200 directores de seguridad patrimonial, administradores de CEDIS y corporativos de todo México.',
      icon: Users,
      items: [
        'Métricas reales de retorno de inversión (ROI en seguridad)',
        'Reportes trimestrales de tendencias y riesgos de zona',
        'Acceso preferente a pruebas beta con marcas líderes'
      ]
    }
  ];

  return (
    <div className="com-page-root">
      
      {/* 1. SUB-NAV BREADCRUMBS */}
      <nav className="com-subnav-bar">
        <div className="container com-subnav-inner">
          <div className="com-breadcrumbs">
            <button 
              type="button" 
              onClick={onNavigateHome} 
              className="com-back-btn"
              title="Volver al Inicio"
            >
              <ArrowLeft size={14} />
              <span>Inicio</span>
            </button>
            <span className="com-breadcrumb-sep">/</span>
            <span className="com-breadcrumb-current">Comunidad Cuauhtli</span>
          </div>

          <div className="com-subnav-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2B5672', display: 'inline-block' }} />
            <span>Red Activa 24/7 en 4 Corredores</span>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="com-hero">
        <div className="container">
          <div className="com-hero-content">
            <div className="com-hero-badge">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2B5672', display: 'inline-block' }} />
              <span>Red Nacional de Seguridad Industrial & Corporativa</span>
            </div>

            <h1 className="com-hero-title">
              Comunidad Cuauhtli: Más de <span className="com-hero-title-accent">1,200 empresas</span> blindando el país juntas.
            </h1>

            <p className="com-hero-desc">
              No solo instalamos tecnología; creamos un ecosistema colaborativo que conecta a directores 
              de seguridad patrimonial, gerentes de operaciones y administradores industriales en una 
              sólida red de prevención, capacitación técnica y alertas tempranas en corredores estratégicos.
            </p>

            <div className="com-hero-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.('Comunidad Cuauhtli')}
                className="btn btn-primary"
                style={{ padding: '15px 32px' }}
              >
                <span>Unirse a la Red Cuauhtli</span>
                <ArrowRight size={16} />
              </button>

              <a
                href="https://wa.link/bzxy8p"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '15px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageSquare size={16} color="#25D366" />
                <span>WhatsApp Comunidad</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRICS STRIP */}
      <section className="com-metrics-sec">
        <div className="container">
          <div className="com-metrics-grid">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="com-metric-card">
                  <div className="com-metric-icon">
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="com-metric-num">{m.num}</div>
                    <div className="com-metric-lbl">{m.lbl}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PILLARS GRID */}
      <section className="com-pillars-sec">
        <div className="container">
          <div className="com-pillars-sec-head">
            <span className="section-label">INICIATIVAS DE LA COMUNIDAD</span>
            <h2 className="section-title">
              Pilares de la red de prevención y <span className="com-hero-title-accent">seguridad colaborativa</span>
            </h2>
          </div>

          <div className="com-pillars-grid">
            {pillars.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.id} className="com-pillar-card">
                  <div>
                    <div className="com-pillar-icon-box">
                      <Icon size={26} />
                    </div>
                    <div className="com-pillar-tag">{c.tag}</div>
                    <h3 className="com-pillar-title">{c.title}</h3>
                    <p className="com-pillar-desc">{c.desc}</p>
                  </div>

                  <ul className="com-pillar-list">
                    {c.items.map((item, i) => (
                      <li key={i}>
                        <CheckCircle2 size={15} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CONVERSION BANNER */}
      <section className="com-bottom-cta">
        <div className="container">
          <div className="com-cta-box">
            <div className="com-cta-glow" />
            <div className="com-cta-left">
              <span className="com-cta-badge">
                <Sparkles size={13} />
                <span>Ecosistema Sin Costo Adicional para Clientes</span>
              </span>
              <h2 className="com-cta-title">
                ¿Gestionas la seguridad o infraestructura de una organización?
              </h2>
              <p className="com-cta-desc">
                Súmate a la Comunidad Cuauhtli y accede a alertas de zona, mesas de análisis técnico 
                y al canal prioritario de enlace con ingenieros especialistas.
              </p>
            </div>

            <div className="com-cta-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.('Comunidad Cuauhtli')}
                className="com-cta-btn"
              >
                <span>Solicitar Acceso a la Red</span>
                <ArrowRight size={16} />
              </button>
              <a
                href="https://wa.link/bzxy8p"
                target="_blank"
                rel="noopener noreferrer"
                className="com-cta-wa"
              >
                <MessageSquare size={16} color="#15803D" />
                <span>WhatsApp de Comunidad</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
