import React, { useState, useEffect } from 'react';
import { 
  SERVICES_DATA 
} from './servicesData';
import CctvIsometricScene from './heroes/CctvIsometricScene';
import AccessIsometricScene from './heroes/AccessIsometricScene';
import AlarmIsometricScene from './heroes/AlarmIsometricScene';
import FenceIsometricScene from './heroes/FenceIsometricScene';
import IntercomIsometricScene from './heroes/IntercomIsometricScene';
import ServiceProcessTimeline from './ServiceProcessTimeline';
import NosotrosSection from '../NosotrosSection';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  Layers, 
  Award, 
  Building2, 
  Zap, 
  Check, 
  X as CloseIcon, 
  ArrowRight,
  Camera,
  KeyRound,
  ShieldAlert,
  Radio,
  Monitor
} from 'lucide-react';
import './ServicePage.css';

export default function ServicePage({ serviceId = 'cctv', onOpenQuote, onNavigateHome, onSelectService }) {
  const [openFaq, setOpenFaq] = useState(null);

  // Scroll to top when service changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpenFaq(null);
  }, [serviceId]);

  const service = SERVICES_DATA[serviceId] || SERVICES_DATA['cctv'];

  const serviceNav = [
    { id: 'cctv', label: 'CCTV con IA', icon: Camera },
    { id: 'control-acceso', label: 'Control de Acceso', icon: KeyRound },
    { id: 'alarmas', label: 'Alarmas & C4', icon: Radio },
    { id: 'cercas-electrificadas', label: 'Cercas de Alto Voltaje', icon: ShieldAlert },
    { id: 'videoporteros', label: 'Videoporteros IP', icon: Monitor },
  ];

  // Render isometric Lottie-style vector hero according to service
  const renderHeroScene = () => {
    switch (service.id) {
      case 'cctv':
        return <CctvIsometricScene />;
      case 'control-acceso':
        return <AccessIsometricScene />;
      case 'alarmas':
        return <AlarmIsometricScene />;
      case 'cercas-electrificadas':
        return <FenceIsometricScene />;
      case 'videoporteros':
        return <IntercomIsometricScene />;
      default:
        return <CctvIsometricScene />;
    }
  };

  return (
    <div className="svc-page-root">
      
      {/* 1. SUB-NAV / BREADCRUMB & SERVICE SWITCHER */}
      <nav className="svc-subnav-bar">
        <div className="container svc-subnav-inner">
          {/* Breadcrumbs */}
          <div className="svc-breadcrumbs">
            <button 
              type="button" 
              onClick={onNavigateHome} 
              className="svc-back-btn"
              title="Volver a la página principal"
            >
              <ArrowLeft size={14} />
              <span>Inicio</span>
            </button>
            <span className="svc-breadcrumb-sep">/</span>
            <span className="svc-breadcrumb-parent">Soluciones</span>
            <span className="svc-breadcrumb-sep">/</span>
            <span className="svc-breadcrumb-current">{service.shortTitle}</span>
          </div>

          {/* Quick Service Switcher Tabs */}
          <div className="svc-switcher-tabs">
            {serviceNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === service.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectService?.(item.id)}
                  className={`svc-switch-tab ${isActive ? 'is-active' : ''}`}
                >
                  <Icon size={13} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. SERVICE HERO WITH DEDICATED 3D HARDWARE ANIMATION */}
      <section className="svc-hero-section">
        <div className="container svc-hero-grid">
          
          {/* Left Column: Technical Overview */}
          <div className="svc-hero-content">
            <div className="svc-hero-badge">
              <span className="svc-pulse-dot" />
              <span>{service.badge}</span>
            </div>

            <h1 className="svc-hero-title">
              {service.name.split('&')[0]}
              {service.name.includes('&') && (
                <>
                  <br />
                  <span className="svc-cursive-accent">& {service.name.split('&')[1]}</span>
                </>
              )}
            </h1>

            <p className="svc-hero-tagline">{service.tagline}</p>
            <p className="svc-hero-desc">{service.heroDescription}</p>

            {/* Technical Stats Grid */}
            <div className="svc-stats-grid">
              {service.stats.map((stat, idx) => (
                <div key={idx} className="svc-stat-card">
                  <strong className="svc-stat-val">{stat.value}</strong>
                  <span className="svc-stat-lbl">{stat.label}</span>
                  <span className="svc-stat-sub">{stat.sub}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="svc-hero-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.(service.name)}
                className="btn btn-primary svc-cta-btn"
              >
                <span>Cotizar Proyecto {service.shortTitle}</span>
                <ChevronRight size={16} />
              </button>

              <a
                href="https://wa.link/bzxy8p"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary svc-wa-btn"
              >
                <MessageSquare size={16} color="#25D366" />
                <span>Hablar con Ingeniero C4</span>
              </a>
            </div>
          </div>

          {/* Right Column: Isometric Lottie-style Interactive Scene */}
          <div className="svc-hero-canvas-wrap">
            <div className="svc-canvas-card">
              {renderHeroScene()}
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE TECHNICAL ADVANTAGES */}
      <section className="svc-features-section">
        <div className="container">
          <div className="svc-sec-head">
            <span className="section-label">VENTAJAS DE INGENIERÍA</span>
            <h2 className="section-title">
              Capacidades avanzadas <span className="svc-cursive-accent">sin puntos ciegos</span>
            </h2>
            <p className="section-desc">
              Cada componente cumple con estándares industriales internacionales y normativas mexicanas vigentes.
            </p>
          </div>

          <div className="svc-features-grid">
            {service.features.map((feat, idx) => (
              <div key={idx} className="svc-feature-card">
                <div className="svc-feat-icon-wrap">
                  <ShieldCheck size={22} color="var(--primary)" />
                </div>
                <h3 className="svc-feat-title">{feat.title}</h3>
                <p className="svc-feat-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEPLOYMENT PIPELINE (SCROLL-BASED TURNKEY TIMELINE) */}
      <ServiceProcessTimeline
        serviceId={service.id}
        architecture={service.architecture}
        onOpenQuote={onOpenQuote}
      />

      {/* 5. TECHNICAL SPECIFICATIONS TABLE */}
      <section className="svc-specs-section">
        <div className="container">
          <div className="svc-specs-box">
            <div className="svc-specs-header">
              <div>
                <span className="section-label">FICHA TÉCNICA HOMOLOGADA</span>
                <h3 className="svc-specs-title">Especificaciones de Grado Industrial</h3>
              </div>
              <div className="svc-specs-pill">
                <Award size={14} />
                <span>Normativa Oficial Mexicana</span>
              </div>
            </div>

            <div className="svc-specs-table">
              {service.techSpecs.map((spec, idx) => (
                <div key={idx} className="svc-table-row">
                  <span className="svc-row-param">{spec.param}</span>
                  <strong className="svc-row-val">{spec.spec}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL-WORLD USE CASES BY INDUSTRY */}
      <section className="svc-usecases-section">
        <div className="container">
          <div className="svc-sec-head">
            <span className="section-label">APLICACIÓN REAL</span>
            <h2 className="section-title">
              Casos de éxito <span className="svc-cursive-accent">por sector</span>
            </h2>
            <p className="section-desc">
              Soluciones específicas probadas en más de una década de operaciones críticas en México.
            </p>
          </div>

          <div className="svc-usecases-grid">
            {service.useCases.map((uc, idx) => (
              <div key={idx} className="svc-usecase-card">
                <div className="svc-uc-sector">
                  <Building2 size={16} color="var(--primary)" />
                  <strong>{uc.sector}</strong>
                </div>
                <div className="svc-uc-challenge">
                  <span className="svc-uc-tag alert">Desafío Operativo</span>
                  <p>{uc.challenge}</p>
                </div>
                <div className="svc-uc-solution">
                  <span className="svc-uc-tag success">Solución Cuauhtli</span>
                  <p>{uc.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMPARISON MATRIX: CUAUTHLI VS GENERIC */}
      <section className="svc-compare-section">
        <div className="container">
          <div className="svc-compare-box">
            <h3 className="svc-compare-heading">
              ¿Por qué elegir <span className="svc-cursive-accent">Sistemas Cuauhtli</span>?
            </h3>
            
            <div className="svc-compare-grid">
              <div className="svc-compare-col cuauhtli">
                <div className="svc-col-header">
                  <strong>SISTEMAS CUAUTHLI PRO</strong>
                  <span>Ingeniería & Póliza C4</span>
                </div>
                <ul className="svc-col-list">
                  <li><Check size={16} color="#10B981" /> <span>Garantía vitalicia en mano de obra certificada</span></li>
                  <li><Check size={16} color="#10B981" /> <span>Central de monitoreo propia con SLA de arribo garantizado</span></li>
                  <li><Check size={16} color="#10B981" /> <span>Cero puntos ciegos avalado por luxometría y cálculo óptico</span></li>
                  <li><Check size={16} color="#10B981" /> <span>Refacciones y equipo de relevo inmediato en almacén propio</span></li>
                  <li><Check size={16} color="#10B981" /> <span>Cumplimiento estricto con NOM, Protección Civil y NDAA</span></li>
                </ul>
              </div>

              <div className="svc-compare-col generic">
                <div className="svc-col-header">
                  <strong>PROVEEDOR GENÉRICO</strong>
                  <span>Técnicos independientes o sin póliza</span>
                </div>
                <ul className="svc-col-list">
                  <li><CloseIcon size={16} color="#EF4444" /> <span>Garantías de solo 30 a 90 días</span></li>
                  <li><CloseIcon size={16} color="#EF4444" /> <span>Sin enlace C4 ni cuadrillas de respuesta en sitio</span></li>
                  <li><CloseIcon size={16} color="#EF4444" /> <span>Puntos ciegos por instalación intuitiva sin ingeniería previa</span></li>
                  <li><CloseIcon size={16} color="#EF4444" /> <span>Semanas de espera para reemplazo de cámaras o sensores dañados</span></li>
                  <li><CloseIcon size={16} color="#EF4444" /> <span>Instalaciones sin certificar vulnerables a multas civiles</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SOBRE NOSOTROS & RESPALDO TÉCNICO CUAUTHLI */}
      <NosotrosSection onOpenQuote={() => onOpenQuote?.(service.name)} compact={true} />

      {/* 9. TECHNICAL FAQ ACCORDION */}
      <section className="svc-faq-section">
        <div className="container">
          <div className="svc-sec-head">
            <span className="section-label">RESOLUCIÓN DE DUDAS</span>
            <h2 className="section-title">
              Preguntas técnicas <span className="svc-cursive-accent">frecuentes</span>
            </h2>
          </div>

          <div className="svc-faq-list">
            {service.faq.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`svc-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="svc-faq-question"
                  >
                    <span>{item.q}</span>
                    <ChevronRight 
                      size={18} 
                      style={{ 
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }} 
                    />
                  </button>
                  {isOpen && (
                    <div className="svc-faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CONVERSION CTA BANNER */}
      <section className="svc-bottom-cta">
        <div className="container">
          <div className="svc-bottom-card">
            <div>
              <span className="svc-bottom-badge">
                <Sparkles size={13} />
                <span>Levantamiento Técnico Gratuito en CDMX y Corredores Nacionales</span>
              </span>
              <h2 className="svc-bottom-title">
                Protege tu infraestructura con <span className="svc-cursive-accent">{service.shortTitle}</span>
              </h2>
              <p className="svc-bottom-desc">
                Un ingeniero especialista visitará tus instalaciones para realizar el estudio de viabilidad sin ningún costo ni compromiso.
              </p>
            </div>

            <div className="svc-bottom-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.(service.name)}
                className="btn btn-primary svc-bottom-btn"
              >
                <span>Solicitar Levantamiento Ahora</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                className="btn btn-secondary"
              >
                <span>Volver a Inicio</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
