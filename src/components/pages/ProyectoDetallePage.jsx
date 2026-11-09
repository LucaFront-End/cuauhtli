import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  MessageSquare,
  Maximize2,
  X,
} from 'lucide-react';
import { PROJECTS_DATA } from './ProyectosPage';
import './ProyectosPage.css';

const DESKTOP_QUERY = '(min-width: 1024px)';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}

const pad = (n) => String(n).padStart(2, '0');

export default function ProyectoDetallePage({
  projectId,
  onOpenQuote,
  onNavigateHome,
  onNavigateProjects,
  onSelectProject,
}) {
  const isDesktop = useIsDesktop();

  const projectIndex = Math.max(
    0,
    PROJECTS_DATA.findIndex((p) => p.id === projectId)
  );
  const project = PROJECTS_DATA[projectIndex] || PROJECTS_DATA[0];
  const prevProject =
    PROJECTS_DATA[(projectIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length];
  const nextProject = PROJECTS_DATA[(projectIndex + 1) % PROJECTS_DATA.length];

  const steps = project.storySteps || [];
  const gallery = project.gallery || [];

  // --- STICKY SCROLL VISUAL TOUR ---
  const tourRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepProgress = useMotionValue(0);

  const { scrollYProgress: tourScrollY } = useScroll({
    target: tourRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(tourScrollY, 'change', (v) => {
    if (!isDesktop || steps.length === 0) return;
    const scaled = Math.min(Math.max(v, 0), 0.9999) * steps.length;
    const idx = Math.floor(scaled);
    stepProgress.set(scaled - idx);
    setActiveStep((prev) => (prev === idx ? prev : idx));
  });

  const goToStep = (index) => {
    setActiveStep(index);
    if (!isDesktop || !tourRef.current) return;
    const el = tourRef.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + distance * ((index + 0.02) / steps.length),
      behavior: 'smooth',
    });
  };

  // --- LIGHTBOX FOR GALLERY ---
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    setActiveStep(0);
    setLightboxIdx(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  useEffect(() => {
    if (lightboxIdx === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, gallery.length]);

  const goToProject = (id) => {
    if (onSelectProject) {
      onSelectProject(id);
    } else {
      window.location.hash = `proyecto/${id}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const backToPortfolio = () => {
    if (onNavigateProjects) {
      onNavigateProjects();
    } else {
      window.location.hash = 'proyectos';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ProjectIsoScene = project.CustomIsoScene;
  const currentStep = steps[activeStep] || steps[0];

  return (
    <div className="prj-page-root prj-detail-root">
      {/* 1. MINIMALIST STICKY SUB-NAVBAR */}
      <nav className="prj-subnav-bar" aria-label="Navegación de caso de éxito">
        <div className="container prj-subnav-inner">
          <div className="prj-breadcrumbs">
            <button type="button" onClick={onNavigateHome} className="prj-back-btn">
              <span>Inicio</span>
            </button>
            <span className="prj-crumb-sep">/</span>
            <button type="button" onClick={backToPortfolio} className="prj-back-btn">
              <ArrowLeft size={13} />
              <span>Proyectos</span>
            </button>
            <span className="prj-crumb-sep">/</span>
            <span className="prj-crumb-current">{project.shortTitle}</span>
          </div>

          <div className="prj-subnav-links">
            <div className="prj-det-nav-stepper">
              <button
                type="button"
                onClick={() => goToProject(prevProject.id)}
                className="prj-det-step-btn"
                title={prevProject.shortTitle}
              >
                <ArrowLeft size={13} />
              </button>
              <span className="prj-det-step-count">
                {pad(projectIndex + 1)} / {pad(PROJECTS_DATA.length)}
              </span>
              <button
                type="button"
                onClick={() => goToProject(nextProject.id)}
                className="prj-det-step-btn"
                title={nextProject.shortTitle}
              >
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="prj-live-pill">
              <span className="prj-live-dot" />
              <span>{project.folio}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          2. ULTRA-MINIMALIST VISUAL HERO + CINEMATIC PANORAMA
          ==================================================================== */}
      <section className="prj-det-minimal-hero">
        <div className="prj-hero-dot-grid" />

        <div className="container">
          {/* Top Minimalist Header Bar */}
          <div className="prj-det-header-split">
            <div className="prj-det-header-left">
              <div className="prj-det-eyebrow-row">
                <span className="prj-eyebrow-pill">
                  <span className="prj-eyebrow-dot" />
                  {project.categoryLabel}
                </span>
                <span className="prj-det-compliance-pill">
                  <ShieldCheck size={13} />
                  {project.compliance}
                </span>
                <span className="prj-det-loc-inline">
                  <MapPin size={13} /> {project.location} · {project.surface}
                </span>
              </div>

              <h1 className="prj-det-h1">{project.title}</h1>
              <p className="prj-det-tagline">{project.tagline}</p>
            </div>

            <div className="prj-det-header-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.(`Proyecto similar a ${project.title}`)}
                className="btn btn-primary prj-btn-main"
              >
                <span>Cotizar Similar</span>
                <ArrowUpRight size={17} />
              </button>

              <a
                href={`https://wa.me/525585262115?text=${encodeURIComponent(
                  `Hola Sistemas Cuauhtli, vi el proyecto "${project.title}" (${project.folio}) y quiero cotizar algo similar.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary prj-btn-ghost"
              >
                <MessageSquare size={15} color="#10B981" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Full-Width Panoramic Cinema Frame */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="prj-det-cinema-frame"
          >
            <img src={project.image} alt={project.title} className="prj-det-cinema-img" />
            <div className="prj-det-cinema-scrim" />

            {/* Subtle AI Detection Bounding Boxes */}
            {project.detBoxes?.map((b, bIdx) => (
              <div
                key={bIdx}
                className={`prj-ai-det prj-ai-det--${b.tone || 'green'}`}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.w}%`,
                  height: `${b.h}%`,
                }}
              >
                <i className="tl" />
                <i className="tr" />
                <i className="bl" />
                <i className="br" />
                <span className="prj-ai-det-label">{b.label}</span>
              </div>
            ))}

            {/* Top Glass Hardware Chips */}
            <div className="prj-det-cinema-top">
              {project.hardware.map((hw, idx) => (
                <span key={idx} className="prj-det-hw-glass-pill">
                  <CheckCircle2 size={11} color="#10B981" />
                  {hw}
                </span>
              ))}
            </div>

            {/* Bottom Floating 3-KPI Glass Dock */}
            <div className="prj-det-cinema-dock">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="prj-det-dock-metric">
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </div>
              ))}
              <div className="prj-det-dock-metric is-meta">
                <strong>{project.duration}</strong>
                <span>Tiempo de entrega</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          3. STICKY SCROLL-BASED VISUAL STORYBOARD (4 CHAPTERS, MINIMAL TEXT)
          ==================================================================== */}
      <section
        ref={tourRef}
        className={`prj-sticky-sec prj-det-tour-sec${isDesktop ? ' prj-sticky-sec--pinned' : ''}`}
        style={
          isDesktop
            ? { height: `calc(100vh + ${steps.length} * 56vh)` }
            : undefined
        }
      >
        <div className="prj-sticky-viewport">
          <div className="prj-sticky-grid">
            {/* LEFT: Ultra-Clean Minimalist 4-Step Rail */}
            <div className="prj-sticky-left">
              <div className="prj-sticky-top">
                <span className="prj-eyebrow-pill">
                  <span className="prj-eyebrow-dot" />
                  Recorrido del Proyecto
                </span>

                <span className="prj-sticky-counter">
                  {pad(activeStep + 1)} / {pad(steps.length)}
                </span>
              </div>

              <h2 className="prj-sticky-heading">
                Arquitectura <em>paso a paso.</em>
              </h2>

              <ul className="prj-rail-list">
                {steps.map((step, index) => {
                  const isActive = activeStep === index;
                  const isDone = index < activeStep;

                  return (
                    <li
                      key={step.id}
                      className={`prj-rail-item${isActive ? ' is-active' : ''}${
                        isDone ? ' is-done' : ''
                      }`}
                      onClick={() => goToStep(index)}
                    >
                      <span className="prj-rail-line">
                        <motion.span
                          className="prj-rail-fill"
                          style={{
                            scaleY: isActive ? (isDesktop ? stepProgress : 1) : isDone ? 1 : 0,
                          }}
                        />
                      </span>
                      <span className="prj-rail-node" />

                      <div className="prj-rail-head">
                        <span className="prj-rail-num">{pad(index + 1)}</span>
                        <span className="prj-rail-title">{step.title}</span>
                        <span className="prj-rail-tag">{step.kpi}</span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            className="prj-rail-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p className="prj-rail-desc">{step.caption}</p>

                            {!isDesktop && (
                              <div className="prj-sticky-panel prj-sticky-panel--inline">
                                {step.type === 'iso' && ProjectIsoScene ? (
                                  <ProjectIsoScene />
                                ) : (
                                  <img
                                    src={step.src || project.image}
                                    alt={step.title}
                                    className="prj-det-tour-img"
                                  />
                                )}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* RIGHT: Pinned Sticky Visual Canvas (Morphs between 3D Iso & High-Res Photos) */}
            {isDesktop && currentStep && (
              <div className="prj-sticky-panel">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${project.id}-step-${activeStep}`}
                    className="prj-sticky-panel-inner"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.01, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {currentStep.type === 'iso' && ProjectIsoScene ? (
                      <ProjectIsoScene />
                    ) : (
                      <div className="prj-det-tour-photo-stage">
                        <img
                          src={currentStep.src || project.image}
                          alt={currentStep.title}
                          className="prj-det-tour-img"
                        />
                        <div className="prj-det-tour-scrim" />

                        {activeStep === 1 &&
                          project.detBoxes?.map((b, bIdx) => (
                            <div
                              key={bIdx}
                              className={`prj-ai-det prj-ai-det--${b.tone || 'green'}`}
                              style={{
                                left: `${b.x}%`,
                                top: `${b.y}%`,
                                width: `${b.w}%`,
                                height: `${b.h}%`,
                              }}
                            >
                              <i className="tl" />
                              <i className="tr" />
                              <i className="bl" />
                              <i className="br" />
                              <span className="prj-ai-det-label">{b.label}</span>
                            </div>
                          ))}

                        <div className="prj-det-tour-badge-bar">
                          <span className="prj-det-tour-pill">{currentStep.badge}</span>
                          <span className="prj-det-tour-kpi">{currentStep.kpi}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. ASYMMETRIC MOSAIC VISUAL GALLERY WITH LIGHTBOX ZOOM
          ==================================================================== */}
      <section className="prj-det-gallery-sec">
        <div className="container">
          <div className="prj-det-gallery-head">
            <div>
              <span className="prj-eyebrow-pill">
                <span className="prj-eyebrow-dot" />
                GALERÍA DE CAMPO
              </span>
              <h2 className="prj-section-h2">
                Evidencia <em>visual.</em>
              </h2>
            </div>

            <span className="prj-det-gallery-hint">
              Haz clic en cualquier toma para ampliar
            </span>
          </div>

          <div className="prj-det-mosaic">
            {gallery.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.36, delay: idx * 0.06 }}
                className={`prj-det-mosaic-item is-${item.span || 'normal'}`}
                onClick={() => setLightboxIdx(idx)}
              >
                <img src={item.src} alt={item.tag} loading="lazy" />
                <div className="prj-det-mosaic-scrim" />

                <div className="prj-det-mosaic-bar">
                  <span className="prj-det-mosaic-tag">
                    {pad(idx + 1)} · {item.tag}
                  </span>
                  <span className="prj-det-mosaic-zoom">
                    <Maximize2 size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. MINIMALIST NEXT PROJECT BANNER & QUICK CTA
          ==================================================================== */}
      <section className="prj-det-next-sec">
        <div className="container">
          <div className="prj-det-bottom-split">
            <div className="prj-det-minimal-cta-card">
              <span className="prj-eyebrow-pill">
                <span className="prj-eyebrow-dot" />
                Garantía Vitalicia
              </span>
              <h3>¿Buscas un despliegue similar?</h3>
              <p>Levantamiento y sembrado CAD sin costo con nuestros ingenieros.</p>

              <div className="prj-hero-cta-row">
                <button
                  type="button"
                  onClick={() => onOpenQuote?.(`Proyecto similar a ${project.title}`)}
                  className="btn btn-primary prj-btn-main"
                >
                  <span>Agendar Levantamiento</span>
                  <ArrowUpRight size={17} />
                </button>
              </div>
            </div>

            <div
              className="prj-det-next-card"
              onClick={() => goToProject(nextProject.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') goToProject(nextProject.id);
              }}
            >
              <div className="prj-det-next-img-wrap">
                <img src={nextProject.image} alt={nextProject.title} />
                <div className="prj-det-next-scrim" />
                <span className="prj-det-next-folio">{nextProject.folio}</span>
              </div>

              <div className="prj-det-next-body">
                <span className="prj-det-next-eyebrow">SIGUIENTE OBRA →</span>
                <h3>{nextProject.shortTitle}</h3>
                <p>
                  {nextProject.location} · {nextProject.surface}
                </p>

                <div className="prj-det-next-cta">
                  <span>Explorar</span>
                  <span className="prj-spotlight-open-circle">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX OVERLAY FOR PHOTO GALLERY */}
      <AnimatePresence>
        {lightboxIdx !== null && gallery[lightboxIdx] && (
          <motion.div
            className="prj-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
          >
            <div className="prj-lightbox-topbar" onClick={(e) => e.stopPropagation()}>
              <span className="prj-lightbox-caption">
                {pad(lightboxIdx + 1)} / {pad(gallery.length)} · {gallery[lightboxIdx].tag}
              </span>
              <div className="prj-lightbox-controls">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((i) => (i - 1 + gallery.length) % gallery.length)
                  }
                  className="prj-lightbox-btn"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIdx((i) => (i + 1) % gallery.length)}
                  className="prj-lightbox-btn"
                >
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIdx(null)}
                  className="prj-lightbox-btn"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <motion.img
              key={lightboxIdx}
              src={gallery[lightboxIdx].src}
              alt={gallery[lightboxIdx].tag}
              className="prj-lightbox-img"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.24 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
