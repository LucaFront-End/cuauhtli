// src/components/ReformaStickyTimeline.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import './ReformaStickyTimeline.css';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PHASES = [
  {
    id: 'fase-1',
    number: '01',
    tag: 'En Curso · 2026',
    title: 'Auditoría y Adecuación',
    description: 'Diagnóstico técnico de accesos y actualización del Reglamento Interior ante el CFCRL.',
    isMandatory: false
  },
  {
    id: 'fase-2',
    number: '02',
    tag: '1 Ene 2027 · Obligatorio',
    title: 'Registro Electrónico Inalterable',
    description: 'Criterio STPS: prohibición de listas en papel y validez con hash SHA-256 y sellos NTP.',
    isMandatory: true
  },
  {
    id: 'fase-3',
    number: '03',
    tag: 'Transición Gradual',
    title: 'Reducción 48h ➔ 40h',
    description: 'Reconfiguración operativa de turnos y fiscalización automática del tope de horas extra.',
    isMandatory: false
  },
  {
    id: 'fase-4',
    number: '04',
    tag: 'Permanente',
    title: 'Inspecciones y Blindaje',
    description: 'Emisión digital inmediata de reportes con plena validez probatoria ante la STPS.',
    isMandatory: false
  }
];

export default function ReformaStickyTimeline({ onOpenQuote }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(trackWidth - viewportWidth + 100);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 96px",
          end: () => `+=${Math.max(track.scrollWidth - window.innerWidth + 200, 1100)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setProgress(p);
            const stepIdx = Math.min(
              PHASES.length - 1,
              Math.floor(p * PHASES.length)
            );
            setActiveStep(stepIdx);
          }
        }
      });
    }, containerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const scrollToStep = (index) => {
    setActiveStep(index);
    const isMobile = window.innerWidth < 1024;
    
    if (isMobile && trackRef.current) {
      const card = trackRef.current.children[index];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      return;
    }

    if (containerRef.current) {
      const st = ScrollTrigger.getAll().find(s => s.trigger === containerRef.current);
      if (st) {
        const targetScroll = st.start + (st.end - st.start) * (index / (PHASES.length - 1));
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="reforma-mini-timeline-root"
      id="cronograma-reforma"
    >
      <div className="reforma-mini-inner">
        {/* COMPACT MINIMAL HEADER */}
        <div className="reforma-mini-header">
          <div className="reforma-mini-header-info">
            <span className="reforma-mini-tag">Cronograma STPS</span>
            <h2 className="reforma-mini-title">Ruta de Transición 48h a 40h</h2>
          </div>

          {/* MINIMAL STEP NUMBERS NAV */}
          <div className="reforma-mini-steps-nav" role="tablist">
            {PHASES.map((phase, idx) => (
              <button
                key={phase.id}
                type="button"
                role="tab"
                aria-selected={activeStep === idx}
                className={`mini-step-btn ${activeStep === idx ? 'is-active' : ''}`}
                onClick={() => scrollToStep(idx)}
              >
                <span className="mini-step-num">{phase.number}</span>
                <span className="mini-step-name">{phase.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ULTRA-THIN PROGRESS HAIRLINE */}
        <div className="reforma-mini-progress-track" aria-hidden="true">
          <div 
            className="reforma-mini-progress-bar"
            style={{ width: `${Math.max(progress * 100, 12)}%` }}
          />
        </div>

        {/* HORIZONTAL CARDS TRACK */}
        <div className="reforma-mini-viewport">
          <div ref={trackRef} className="reforma-mini-track">
            {PHASES.map((phase, idx) => {
              const isActive = activeStep === idx;

              return (
                <div 
                  key={phase.id}
                  className={`reforma-mini-card ${isActive ? 'is-active' : ''} ${phase.isMandatory ? 'is-mandatory' : ''}`}
                  onClick={() => scrollToStep(idx)}
                >
                  <div className="mini-card-top">
                    <span className="mini-card-num">{phase.number}</span>
                    <span className={`mini-card-tag ${phase.isMandatory ? 'is-mandatory' : ''}`}>
                      {phase.tag}
                    </span>
                  </div>

                  <h3 className="mini-card-title">{phase.title}</h3>
                  <p className="mini-card-desc">{phase.description}</p>

                  <div className="mini-card-footer">
                    <button
                      type="button"
                      className="mini-card-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuote?.(`Planificación ${phase.title}`);
                      }}
                    >
                      <span>Diagnóstico</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
