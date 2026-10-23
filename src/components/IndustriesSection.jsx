import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Check
} from 'lucide-react';
import { INDUSTRIES } from '../data/industriesData';
import './IndustriesSection.css';

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

export default function IndustriesSection({ onOpenQuote, onSelectIndustry }) {
  const [activeTab, setActiveTab] = useState('bancos');

  const currentIndustry = INDUSTRIES.find((ind) => ind.id === activeTab) || INDUSTRIES[0];
  const MainIcon = ICON_MAP[currentIndustry.iconName] || Building2;

  const handleNavigate = (slug) => {
    if (onSelectIndustry) {
      onSelectIndustry(slug);
    } else {
      window.location.hash = `industria-${slug}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="industrias" className="ind-section" aria-labelledby="ind-heading">
      <div className="ind-container">
        
        {/* EDITORIAL HEADER */}
        <div className="ind-header">
          <div className="ind-eyebrow">
            <Sparkles size={12} className="ind-eyebrow-icon" />
            <span>Soluciones por Giro</span>
          </div>

          <h2 id="ind-heading" className="ind-heading">
            Tenemos la solución perfecta{' '}
            <em>para tu giro o industria.</em>
          </h2>

          <p className="ind-sub">
            Arquitecturas de seguridad electrónica diseñadas según la normativa y nivel de riesgo de cada sector.
          </p>
        </div>

        {/* SINGLE-LINE TABS NAVIGATION */}
        <div className="ind-tabs-wrapper">
          <div className="ind-tabs-nav" role="tablist" aria-label="Sectores e industrias">
            {INDUSTRIES.map((ind) => {
              const TabIcon = ICON_MAP[ind.iconName] || Building2;
              const isActive = ind.id === activeTab;

              return (
                <button
                  key={ind.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`ind-tab-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(ind.id)}
                >
                  <TabIcon size={14} className="ind-tab-icon" />
                  <span>{ind.shortName}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="indTabIndicator"
                      className="ind-tab-indicator" 
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MINIMALIST VISUAL STAGE */}
        <div className="ind-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndustry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="ind-panel"
            >
              
              {/* LEFT: VISUAL IMAGE SHOWCASE */}
              <div className="ind-visual-col">
                <div className="ind-image-frame">
                  <img 
                    src={currentIndustry.heroImage} 
                    alt={`Seguridad para ${currentIndustry.name}`}
                    className="ind-facility-img"
                    loading="lazy"
                  />
                  <div className="ind-image-overlay" />

                  {/* Discrete bottom tag */}
                  <div className="ind-image-badge">
                    <ShieldCheck size={13} className="ind-badge-icon" />
                    <span>{currentIndustry.complianceBadge}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: CLEAN & CONCISE EDITORIAL CONTENT */}
              <div className="ind-content-col">
                
                {/* Sector Header */}
                <div className="ind-sector-top">
                  <div className="ind-sector-pill">
                    <MainIcon size={14} />
                    <span>{currentIndustry.name}</span>
                  </div>
                  <h3 className="ind-sector-tagline">{currentIndustry.tagline}</h3>
                  <p className="ind-sector-desc">{currentIndustry.description}</p>
                </div>

                {/* Sleek Minimalist Key Points (3 Highlights) */}
                <div className="ind-features-list">
                  {currentIndustry.keySolutions.slice(0, 3).map((sol, idx) => {
                    const SolIcon = ICON_MAP[sol.icon] || ShieldCheck;
                    return (
                      <div key={idx} className="ind-feature-item">
                        <div className="ind-feature-icon-box">
                          <SolIcon size={14} />
                        </div>
                        <div className="ind-feature-body">
                          <div className="ind-feature-title-row">
                            <span className="ind-feature-title">{sol.title}</span>
                            <span className="ind-feature-badge">{sol.badge}</span>
                          </div>
                          <p className="ind-feature-summary">{sol.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Concise Metric Pill + Hardware Tags */}
                <div className="ind-tags-row">
                  <div className="ind-metric-chip">
                    <span className="ind-metric-num">{currentIndustry.statMetric}</span>
                    <span className="ind-metric-text">{currentIndustry.statLabel}</span>
                  </div>

                  <div className="ind-hw-chips">
                    {currentIndustry.recommendedEquip.slice(0, 2).map((eq, i) => (
                      <span key={i} className="ind-hw-chip">
                        <Check size={11} className="ind-hw-check" />
                        <span>{eq}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clean Actions */}
                <div className="ind-actions-footer">
                  <button
                    type="button"
                    onClick={() => handleNavigate(currentIndustry.slug)}
                    className="ind-primary-action-btn"
                  >
                    <span>Ver Solución de {currentIndustry.shortName}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenQuote?.(`Solución para ${currentIndustry.shortName}`)}
                    className="ind-secondary-action-btn"
                  >
                    <span>Cotizar Proyecto</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
