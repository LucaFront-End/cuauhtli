// src/components/industries/IndustryPage.jsx
import React, { useEffect } from 'react';
import { 
  Landmark, 
  GraduationCap, 
  Warehouse, 
  Building2, 
  Stethoscope, 
  Home, 
  HardHat, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  KeyRound, 
  ShieldAlert, 
  Network, 
  Radio, 
  Navigation, 
  Monitor, 
  BellRing,
  Clock,
  Layers,
  Phone,
  MessageSquare,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { INDUSTRIES } from '../../data/industriesData';
import './IndustryPage.css';

const ICON_MAP = {
  Landmark,
  GraduationCap,
  Warehouse,
  Building2,
  Stethoscope,
  Home,
  HardHat,
  ShoppingBag,
  Camera,
  KeyRound,
  ShieldAlert,
  Network,
  Radio,
  Navigation,
  Monitor,
  BellRing,
  Clock
};

export default function IndustryPage({ 
  industryId = 'bancos', 
  onOpenQuote, 
  onNavigateHome, 
  onSelectIndustry 
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [industryId]);

  const industry = INDUSTRIES.find((i) => i.id === industryId || i.slug === industryId) || INDUSTRIES[0];
  const MainIcon = ICON_MAP[industry.iconName] || Building2;

  const handleSelectOther = (slug) => {
    if (onSelectIndustry) {
      onSelectIndustry(slug);
    } else {
      window.location.hash = `industria-${slug}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="ind-page">
      
      {/* 1. TOP BREADCRUMBS & NAVIGATION */}
      <div className="ind-page-topbar">
        <div className="container ind-page-topbar-inner">
          <nav className="ind-breadcrumbs" aria-label="Ruta de navegación">
            <button type="button" onClick={onNavigateHome} className="ind-crumb-btn">
              Inicio
            </button>
            <span className="ind-crumb-sep">/</span>
            <span className="ind-crumb-text">Industrias</span>
            <span className="ind-crumb-sep">/</span>
            <span className="ind-crumb-current">{industry.name}</span>
          </nav>

          <button type="button" onClick={onNavigateHome} className="ind-back-home-btn">
            <ArrowLeft size={14} />
            <span>Volver al Inicio</span>
          </button>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="ind-page-hero">
        <div className="container">
          <div className="ind-hero-content">
            
            <div className="ind-hero-badge">
              <Sparkles size={13} />
              <span>{industry.complianceBadge}</span>
            </div>

            <h1 className="ind-hero-title">
              Ingeniería en Seguridad Electrónica para{' '}
              <em>{industry.name}.</em>
            </h1>

            <p className="ind-hero-lead">
              {industry.description}
            </p>

            {/* QUICK STATS STRIP */}
            <div className="ind-hero-stats">
              <div className="ind-hero-stat">
                <strong>{industry.statMetric}</strong>
                <span>{industry.statLabel}</span>
              </div>
              <div className="ind-hero-stat-sep" />
              <div className="ind-hero-stat">
                <strong>Garantía Vitalicia</strong>
                <span>En mano de obra certificada</span>
              </div>
              <div className="ind-hero-stat-sep" />
              <div className="ind-hero-stat">
                <strong>&lt; 2 Horas</strong>
                <span>SLA de respuesta en sitio</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="ind-hero-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.(`Solución Especializada para ${industry.shortName}`)}
                className="ind-primary-quote-btn"
              >
                <span>Agendar Levantamiento para {industry.shortName}</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={`https://wa.me/525585262115?text=${encodeURIComponent(`Hola Sistemas Cuauhtli, me interesa una propuesta técnica de seguridad para el sector de ${industry.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ind-whatsapp-quote-btn"
              >
                <MessageSquare size={16} />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HORIZONTAL SECTOR SWITCHER */}
      <section className="ind-page-switcher">
        <div className="container">
          <div className="ind-switcher-header">
            <span>Explorar otros giros e industrias:</span>
          </div>
          <div className="ind-switcher-pills">
            {INDUSTRIES.map((ind) => {
              const TabIcon = ICON_MAP[ind.iconName] || Building2;
              const isActive = ind.id === industry.id;

              return (
                <button
                  key={ind.id}
                  type="button"
                  className={`ind-switch-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectOther(ind.slug)}
                >
                  <TabIcon size={14} />
                  <span>{ind.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CORE INTEGRATED SOLUTIONS BREAKDOWN */}
      <section className="ind-page-solutions">
        <div className="container">
          <div className="ind-section-header">
            <span className="ind-sec-eyebrow">ARQUITECTURA DE INTEGRACIÓN</span>
            <h2 className="ind-sec-title">
              Sistemas Especializados para <em>{industry.shortName}</em>
            </h2>
            <p className="ind-sec-sub">
              Equipamiento homologado de grado industrial diseñado para tolerar alta exigencia operativa:
            </p>
          </div>

          <div className="ind-solutions-cards-grid">
            {industry.keySolutions.map((sol, idx) => {
              const SolIcon = ICON_MAP[sol.icon] || ShieldCheck;

              return (
                <div key={idx} className="ind-sol-detail-card">
                  <div className="ind-sol-detail-head">
                    <div className="ind-sol-detail-icon">
                      <SolIcon size={22} />
                    </div>
                    <span className="ind-sol-detail-badge">{sol.badge}</span>
                  </div>

                  <h3 className="ind-sol-detail-title">{sol.title}</h3>
                  <p className="ind-sol-detail-desc">{sol.desc}</p>

                  <div className="ind-sol-detail-footer">
                    <CheckCircle2 size={14} className="ind-sol-check" />
                    <span>Integración nativa con Central C4 Cuauhtli</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. RECOMMENDED EQUIPMENT & NORMATIVE TABLE */}
      <section className="ind-page-hardware">
        <div className="container">
          <div className="ind-hardware-box">
            
            <div className="ind-hardware-left">
              <span className="ind-hw-eyebrow">EQUIPAMIENTO HOMOLOGADO</span>
              <h3 className="ind-hw-title">
                Hardware y Componentes Típicos para {industry.shortName}
              </h3>
              <p className="ind-hw-desc">
                No instalamos marcas genéricas. Toda nuestra ingeniería se basa en marcas líderes mundiales (Hikvision, Dahua, ZKTeco, Ubiquiti, Honeywell, DSC) con garantía directa de fábrica y stock local en México.
              </p>

              <ul className="ind-hw-list">
                {industry.recommendedEquip.map((item, i) => (
                  <li key={i} className="ind-hw-item">
                    <CheckCircle2 size={16} className="ind-hw-check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ind-hardware-right">
              <div className="ind-normative-card">
                <div className="ind-norm-top">
                  <FileCheck2 size={24} className="ind-norm-icon" />
                  <h4>Memoria Técnica & Planos en AutoCAD</h4>
                </div>
                <p>
                  Cada proyecto para {industry.shortName} se entrega con carpeta técnica ejecutiva: cálculo de ancho de banda, diagramas unifilares, planos de canalización y memoria de almacenamiento conforme a normativas oficiales.
                </p>
                <div className="ind-norm-tags">
                  <span>Norma Oficial Mexicana (NOM)</span>
                  <span>Protección Civil</span>
                  <span>Garantía Vitalicia</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenQuote?.(`Levantamiento para ${industry.shortName}`)}
                  className="ind-norm-btn"
                >
                  <span>Solicitar Auditoría en Sitio</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TURNKEY PACKAGES */}
      <section className="ind-page-packages">
        <div className="container">
          <div className="ind-section-header">
            <span className="ind-sec-eyebrow">ESQUEMAS LLAVE EN MANO</span>
            <h2 className="ind-sec-title">
              Topologías Sugeridas para <em>{industry.shortName}</em>
            </h2>
            <p className="ind-sec-sub">
              Configuraciones modulares adaptables a la escala de tu instalación:
            </p>
          </div>

          <div className="ind-packages-grid">
            {industry.packages.map((pkg, idx) => (
              <div key={idx} className="ind-package-card">
                <div className="ind-pkg-head">
                  <span className="ind-pkg-badge">Paquete Recomendado</span>
                  <h3 className="ind-pkg-title">{pkg.name}</h3>
                  <span className="ind-pkg-scope-tag">{pkg.scope}</span>
                </div>

                <div className="ind-pkg-body">
                  <div className="ind-pkg-spec">
                    <strong>Alcance Técnico:</strong>
                    <p>{pkg.points}</p>
                  </div>
                  <div className="ind-pkg-sla-box">
                    <Clock size={14} />
                    <span>{pkg.sla}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenQuote?.(`${pkg.name} - ${industry.shortName}`)}
                  className="ind-pkg-action-btn"
                >
                  <span>Cotizar este Esquema</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CONVERSION BANNER */}
      <section className="ind-page-cta">
        <div className="container">
          <div className="ind-cta-box">
            <div className="ind-cta-glow" />
            <div className="ind-cta-left">
              <span className="ind-cta-badge">
                <Sparkles size={13} />
                <span>Levantamiento Técnico Sin Costo ni Compromiso</span>
              </span>
              <h2 className="ind-cta-title">
                ¿Requieres blindar tus instalaciones de {industry.shortName}?
              </h2>
              <p className="ind-cta-desc">
                Un ingeniero de Sistemas Cuauhtli acudirá a tu predio en CDMX, Querétaro, Monterrey, Guadalajara o Bajío para realizar el levantamiento en sitio y entregarte un anteproyecto formal con planos en AutoCAD.
              </p>
            </div>

            <div className="ind-cta-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.(`Propuesta para ${industry.shortName}`)}
                className="ind-cta-quote-btn"
              >
                <span>Agendar Levantamiento en Sitio</span>
                <ArrowRight size={16} />
              </button>
              
              <a href="tel:5585262115" className="ind-cta-phone">
                <Phone size={14} />
                <span>Atención Telefónica Directa: (55) 8526-2115</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
