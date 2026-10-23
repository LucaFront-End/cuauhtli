"use client";
import React, { useEffect, useRef, useState, useId } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  Scale, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  FileText
} from "lucide-react";
import "./horizontal-feature-reveal.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface FeatureRevealProperty {
  id?: string;
  number: string;
  badge: string;
  badgeType?: "warning" | "danger" | "cyan" | "success";
  title: string;
  description: string;
  highlightText: string;
  image: string;
  accentColor: string;
}

const DEFAULT_PHASES: FeatureRevealProperty[] = [
  {
    id: "fase-1",
    number: "01",
    badge: "Fase Actual · Ventana 2026",
    badgeType: "warning",
    title: "Auditoría Previa y Adecuación de Accesos",
    description:
      "Diagnóstico exhaustivo de puntos de entrada, torniquetes y checadores. Revisión de contratos individuales y actualización obligatoria del Reglamento Interior de Trabajo ante el Centro Federal Laboral (CFCRL).",
    highlightText: "Levantamiento técnico sin costo y adecuación del Reglamento Interior",
    image: "/assets/images/reforma/paso-1-auditoria.jpg",
    accentColor: "#F59E0B",
  },
  {
    id: "fase-2",
    number: "02",
    badge: "1 de Enero de 2027 · Día Cero Legal",
    badgeType: "danger",
    title: "Obligatoriedad de Registro Electrónico",
    description:
      "Entrada en vigor del criterio vinculante STPS: prohibición absoluta de firmas en papel o registros en Excel. Es obligatorio contar con terminales biométricas inalterables con hash criptográfico SHA-256 y sellos horarios NTP oficiales.",
    highlightText: "Multas de 250 a 5,000 UMA ($29,327 a $586,550+ MXN) por trabajador",
    image: "/assets/images/reforma/paso-2-biometrico.jpg",
    accentColor: "#A6192E",
  },
  {
    id: "fase-3",
    number: "03",
    badge: "Transición Escalonada LFT",
    badgeType: "cyan",
    title: "Reducción Progresiva: 48h ➔ 40h Semanales",
    description:
      "Reconfiguración operativa de turnos y cuadrillas laborales sin reducción de sueldo. Fiscalización diaria del nuevo tope de jornada y cálculo automatizado de horas extra dobles y triples para blindar la nómina.",
    highlightText: "Integración directa con CONTPAQi, Aspel NOI y SAP",
    image: "/assets/images/reforma/paso-3-turnos.jpg",
    accentColor: "#0284C7",
  },
  {
    id: "fase-4",
    number: "04",
    badge: "Permanente · Blindaje Jurídico",
    badgeType: "success",
    title: "Inspecciones STPS y Juicios Laborales",
    description:
      "Auditorías laborales federales extraordinarias y defensa ante los Tribunales Laborales. La empresa debe emitir bitácoras digitales instantáneas en menos de 60 segundos con plena validez probatoria oficial.",
    highlightText: "100% de blindaje legal frente a requerimientos extraordinarios",
    image: "/assets/images/reforma/paso-4-blindaje.jpg",
    accentColor: "#10B981",
  },
];

export interface HorizontalFeatureRevealProps {
  properties?: FeatureRevealProperty[];
  bgColor?: string;
  onOpenQuote?: (subject?: string) => void;
}

export default function HorizontalFeatureReveal({
  properties = DEFAULT_PHASES,
  bgColor,
  onOpenQuote,
}: HorizontalFeatureRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const uid = useId().replace(/:/g, "");
  const sectionId = `hfr-section-${uid}`;

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;

      const totalSlides = properties.length;
      // Scroll length: 900px per slide for a comfortable, deliberate pace
      const scrollDistance = (totalSlides - 1) * 950;

      // Master ScrollTrigger timeline with PIN
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 76px",
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setProgress(p);

            // Calculate active step with smooth hysteresis
            const currentIdx = Math.min(
              totalSlides - 1,
              Math.floor(p * totalSlides + 0.15)
            );
            setActiveStep(currentIdx);
          },
        },
      });

      // Build step-by-step transition animations: 1 -> 2 -> 3 -> 4
      // For each step transition: Slide out current, slide in next with subtle scale and fade
      for (let i = 0; i < totalSlides - 1; i++) {
        const currentSlide = slidesRef.current[i];
        const nextSlide = slidesRef.current[i + 1];

        // 1. Move track by 100% of slide width
        tl.to(
          track,
          {
            xPercent: -(i + 1) * 100,
            ease: "power2.inOut",
            duration: 1.2,
          },
          `step-${i}`
        );

        // 2. Subtle exit animation on current slide
        if (currentSlide) {
          const currentImg = currentSlide.querySelector(".hfr-slide-image");
          const currentText = currentSlide.querySelector(".hfr-slide-text");
          if (currentImg) {
            tl.to(
              currentImg,
              {
                scale: 0.94,
                opacity: 0.35,
                filter: "blur(4px)",
                ease: "power2.inOut",
                duration: 1.2,
              },
              `step-${i}`
            );
          }
          if (currentText) {
            tl.to(
              currentText,
              {
                opacity: 0.25,
                y: -30,
                ease: "power2.inOut",
                duration: 1.2,
              },
              `step-${i}`
            );
          }
        }

        // 3. Subtle entry animation on next slide
        if (nextSlide) {
          const nextImg = nextSlide.querySelector(".hfr-slide-image");
          const nextText = nextSlide.querySelector(".hfr-slide-text");
          if (nextImg) {
            tl.fromTo(
              nextImg,
              { scale: 1.08, opacity: 0.4, filter: "blur(6px)" },
              {
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                ease: "power2.out",
                duration: 1.2,
              },
              `step-${i}`
            );
          }
          if (nextText) {
            tl.fromTo(
              nextText,
              { opacity: 0, y: 35 },
              {
                opacity: 1,
                y: 0,
                ease: "power2.out",
                duration: 1.2,
              },
              `step-${i}`
            );
          }
        }

        // 4. Comfortable pause on each slide so the user can read it
        tl.to({}, { duration: 1.0 });
      }
    }, rootRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [properties]);

  // Click to jump smoothly to any step
  const scrollToStep = (index: number) => {
    setActiveStep(index);
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      const card = slidesRef.current[index];
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
      return;
    }

    if (rootRef.current) {
      const st = ScrollTrigger.getAll().find((s) => s.trigger === rootRef.current);
      if (st) {
        const total = properties.length;
        const targetScroll = st.start + (st.end - st.start) * (index / (total - 1));
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={rootRef}
      id={sectionId}
      className="hfr-section-root"
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="hfr-pinned-container">
        {/* COMPACT TOP NAVIGATION BAR */}
        <div className="hfr-nav-bar">
          <div className="hfr-nav-left">
            <div className="hfr-nav-tag">
              <Clock size={13} />
              <span>Cronograma Oficial STPS</span>
            </div>
            <h2 className="hfr-nav-title">
              Ruta de Transición 48h a 40h: <em>Pasos Clave.</em>
            </h2>
          </div>

          {/* STEP SELECTOR BUTTONS */}
          <div className="hfr-nav-steps" role="tablist">
            {properties.map((phase, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={phase.number}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`hfr-step-btn ${isActive ? "is-active" : ""}`}
                  onClick={() => scrollToStep(idx)}
                >
                  <span
                    className="hfr-step-dot"
                    style={{ backgroundColor: isActive ? phase.accentColor : "#94A3B8" }}
                  />
                  <span className="hfr-step-number">{phase.number}</span>
                  <span className="hfr-step-label">{phase.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROGRESS HAIRLINE BEAM */}
        <div className="hfr-progress-hairline" aria-hidden="true">
          <div
            className="hfr-progress-fill"
            style={{ width: `${Math.max(progress * 100, 10)}%` }}
          />
        </div>

        {/* FULL-WIDTH SLIDES VIEWPORT */}
        <div className="hfr-viewport">
          <div ref={trackRef} className="hfr-track">
            {properties.map((phase, idx) => {
              const isActive = activeStep === idx;

              return (
                <div
                  key={phase.number}
                  ref={(el) => (slidesRef.current[idx] = el)}
                  className={`hfr-slide-panel ${isActive ? "is-active" : ""}`}
                >
                  {/* LEFT: VISUAL IMAGE CARD WITH AMBIENT GLOW */}
                  <div className="hfr-image-card-wrap">
                    <div
                      className="hfr-image-card-ambient"
                      style={{
                        background: `radial-gradient(circle, ${phase.accentColor}33 0%, transparent 70%)`,
                      }}
                    />
                    <div className="hfr-slide-image-box">
                      <img
                        src={phase.image}
                        alt={phase.title}
                        className="hfr-slide-image"
                        loading="lazy"
                      />
                      <div className="hfr-image-overlay-badge">
                        <span className="hfr-badge-num">{phase.number}</span>
                        <span className="hfr-badge-tag">{phase.badge.split("·")[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: TEXT CONTENT & TECHNICAL REQUIREMENTS */}
                  <div className="hfr-slide-text">
                    <div className="hfr-slide-header-row">
                      <span className="hfr-slide-giant-num" style={{ color: phase.accentColor }}>
                        {phase.number}
                      </span>
                      <div className={`hfr-slide-badge ${phase.badgeType || "warning"}`}>
                        {phase.badgeType === "danger" && <ShieldAlert size={14} />}
                        {phase.badgeType === "warning" && <AlertTriangle size={14} />}
                        {phase.badgeType === "cyan" && <TrendingDown size={14} />}
                        {phase.badgeType === "success" && <ShieldCheck size={14} />}
                        <span>{phase.badge}</span>
                      </div>
                    </div>

                    <h3 className="hfr-slide-title">{phase.title}</h3>
                    <p className="hfr-slide-desc">{phase.description}</p>

                    {/* KEY HIGHLIGHT / WARNING BOX */}
                    <div
                      className="hfr-slide-highlight"
                      style={{ borderLeftColor: phase.accentColor }}
                    >
                      <CheckCircle2 size={16} color={phase.accentColor} className="hfr-check-icon" />
                      <span>{phase.highlightText}</span>
                    </div>

                    {/* ACTION BUTTON */}
                    <div className="hfr-slide-action-row">
                      <button
                        type="button"
                        className="hfr-action-btn"
                        onClick={() =>
                          onOpenQuote?.(`Diagnóstico Técnico Paso ${phase.number} - ${phase.title}`)
                        }
                      >
                        <FileText size={16} />
                        <span>Solicitar Diagnóstico Técnico para Paso {phase.number}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM STEP COUNTER & MOBILE SWIPE HINT */}
        <div className="hfr-bottom-bar">
          <div className="hfr-counter-dots">
            {properties.map((p, idx) => (
              <button
                key={p.number}
                type="button"
                className={`hfr-dot-btn ${activeStep === idx ? "is-active" : ""}`}
                onClick={() => scrollToStep(idx)}
                aria-label={`Ir al paso ${p.number}`}
              >
                <span className="hfr-dot-inner" />
              </button>
            ))}
          </div>
          <div className="hfr-step-counter-text">
            <span>Paso {activeStep + 1} de {properties.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HorizontalFeatureReveal };
