import React, { useEffect } from 'react';
import {
  Scale,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Lock
} from 'lucide-react';
import { CinematicHero } from '../ui/cinematic-landing-hero';
import HorizontalFeatureReveal from '../ui/horizontal-feature-reveal';
import ReformaMultiStepCalc from '../ReformaMultiStepCalc';
import ReformaStickyPillars from '../ReformaStickyPillars';
import ReformaComparisonMatrix from '../ReformaComparisonMatrix';
import './ReformaLaboralPage.css';

export default function ReformaLaboralPage({ onOpenQuote, onNavigateHome, onNavigateService }) {
  // Navigation to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Reforma Laboral 40 Horas & Reloj Checador Biométrico STPS | Sistemas Cuauhtli';
  }, []);


  return (
    <div className="reforma-page">

      {/* 1. SUBNAV BREADCRUMBS BAR (Subtle, sleek blur bar) */}
      <nav className="reforma-subnav-bar">
        <div className="container reforma-subnav-inner">
          <div className="reforma-breadcrumbs">
            <button 
              type="button" 
              onClick={() => onNavigateHome?.()} 
              className="reforma-back-btn"
              title="Volver al Inicio"
            >
              <ArrowLeft size={14} />
              <span>Inicio</span>
            </button>
            <span className="reforma-breadcrumb-sep">/</span>
            <span>Soluciones Especiales</span>
            <span className="reforma-breadcrumb-sep">/</span>
            <span className="reforma-breadcrumb-current">Reforma Laboral 40 Horas</span>
          </div>

          <div className="reforma-subnav-badges">
            <div className="reforma-live-pill">
              <span className="reforma-live-dot" />
              <span>Criterio STPS 2027</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. CINEMATIC 3D SCROLL HERO (ADAPTED FOR REFORMA LABORAL & CUAUTHLI) */}
      <CinematicHero 
        brandName="CUAUTHLI"
        tagline1="Transición de 48 a 40 Horas,"
        tagline2="Blindaje Biométrico STPS."
        cardHeading="Control de Asistencia Inalterable."
        cardDescription={
          <>
            <strong style={{ color: "#FFFFFF" }}>Sistemas Cuauhtli</strong> implementa terminales faciales Hikvision MinMoe AI con hash criptográfico SHA-256 y sellos NTP oficiales para cumplir con la nueva jornada laboral mexicana y evitar sanciones de hasta 5,000 UMA.
          </>
        }
        metricValue={40}
        metricLabel="Horas / Semana"
        ctaHeading="Protege a tu empresa de multas STPS."
        ctaDescription="A partir del 1 de enero de 2027 el registro electrónico inalterable es obligatorio ante la STPS. Solicita tu levantamiento técnico sin costo."
        onOpenQuote={() => onOpenQuote?.('Control de Asistencia Biométrico (Reforma 40 Horas / STPS)')}
        onSimulate={() => {
          const el = document.getElementById('simulador-multas');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. CRONOGRAMA & RUTA CRÍTICA DE LA REFORMA (HORIZONTAL FEATURE REVEAL) */}
      <HorizontalFeatureReveal onOpenQuote={onOpenQuote} />

      {/* 4. SIMULADOR INTERACTIVO DE RIESGO Y MULTAS STPS (MINIMALISTA Y MULTIPASO) */}
      <section className="reforma-section reforma-section-calc" id="simulador-multas">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <Scale size={14} />
            <span>Herramienta de Diagnóstico Preliminar</span>
          </div>
          <h2 className="reforma-section-title">
            Calculadora de <em>Exposición Legal STPS.</em>
          </h2>
          <p className="reforma-section-subtitle">
            Calcule en 4 pasos el impacto financiero para su empresa y reciba su dictamen legal preliminar.
          </p>
        </div>

        <ReformaMultiStepCalc onOpenQuote={onOpenQuote} />
      </section>

      {/* 5. LOS 4 PILARES EXIGIDOS POR LA AUTORIDAD LABORAL (STICKY SPLIT CON DIORAMA 3D ISOMÉTRICO) */}
      <ReformaStickyPillars onOpenQuote={onOpenQuote} />

      {/* 6. COMPARATIVA: MÉTODO TRADICIONAL VS SOLUCIÓN CUAUTHLI (OVERHAUL MINIMALISTA) */}
      <ReformaComparisonMatrix onOpenQuote={onOpenQuote} />

      {/* 7. FINAL CONVERSION CTA (MINIMALISTA, ESTÉTICO Y ELEGANTE) */}
      <section className="reforma-section reforma-final-cta-section">
        <div className="container">
          <div className="reforma-final-cta-card">
            
            {/* Ambient Background Aura */}
            <div className="reforma-final-cta-glow" />

            <div className="reforma-final-cta-content">
              {/* Live Pill Badge */}
              <div className="reforma-final-cta-badge">
                <span className="reforma-final-badge-dot" />
                <span>Atención Prioritaria STPS 2027 · CDMX y Cobertura Nacional</span>
              </div>

              {/* Title with editorial italic */}
              <h2 className="reforma-final-cta-title">
                Proteja su empresa contra <em>sanciones STPS hoy mismo.</em>
              </h2>

              {/* Subtitle */}
              <p className="reforma-final-cta-desc">
                No espere a recibir una notificación de inspección federal ni a la entrada en vigor de la norma. 
                Nuestros ingenieros certificados visitan sus instalaciones y entregan un diagnóstico pericial 
                con anteproyecto sin costo ni compromiso.
              </p>

              {/* Value Pills / Trust Badges */}
              <div className="reforma-final-cta-trust">
                <div className="reforma-final-trust-item">
                  <ShieldCheck size={16} className="reforma-final-trust-icon" />
                  <span>Cero multas LFT (250 a 5,000 UMA)</span>
                </div>
                <div className="reforma-final-trust-item">
                  <Lock size={16} className="reforma-final-trust-icon" />
                  <span>Terminales MinMoe con hash SHA-256</span>
                </div>
                <div className="reforma-final-trust-item">
                  <Sparkles size={16} className="reforma-final-trust-icon" />
                  <span>Diagnóstico y levantamiento presencial sin costo</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="reforma-final-cta-actions">
                <button
                  type="button"
                  onClick={() => onOpenQuote?.('Levantamiento Técnico Biométrico (Reforma 40 Horas / STPS)')}
                  className="reforma-final-btn-primary"
                >
                  <ShieldCheck size={18} />
                  <span>Solicitar Levantamiento Técnico Gratuito</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="https://wa.me/525585262115?text=Hola%20Sistemas%20Cuauhtli,%20solicito%20asesor%C3%ADa%20urgente%20para%20cumplir%20con%20la%20Reforma%20Laboral%2040%20Horas%20y%20Registro%20STPS."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reforma-final-btn-whatsapp"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp Urgente: (55) 8526-2115</span>
                </a>
              </div>

              {/* Bottom Subtle Navigation / Guarantee */}
              <div className="reforma-final-cta-footer">
                <button 
                  type="button" 
                  onClick={() => onNavigateHome?.()} 
                  className="reforma-final-back-link"
                >
                  <ArrowLeft size={13} />
                  <span>Volver al Sitio Principal</span>
                </button>
                <span className="reforma-final-footer-dot">·</span>
                <span className="reforma-final-guarantee">Respuesta de ingeniería garantizada en menos de 2 horas hábiles</span>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
