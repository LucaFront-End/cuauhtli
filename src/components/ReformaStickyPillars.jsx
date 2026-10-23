import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { ArrowRight, Check, Sparkles, Scale, Clock, ShieldCheck, Lock } from "lucide-react";
import "./ReformaStickyPillars.css";

const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

const pad = (n) => String(n).padStart(2, "0");

const PILLARS = [
  {
    id: 1,
    num: "01",
    eyebrow: "Obligatoriedad 2027",
    title: "Registro Electrónico & Biometría Facial",
    shortTitle: "Biometría Facial Inalterable",
    slug: "01-acceso-facial",
    desc: "A partir del 1 de enero de 2027, el control de asistencia debe ser obligatoriamente digital, trazable y sin posibilidad técnica de alteración manual.",
    bullets: [
      "Logs criptográficos inmutables con sello de tiempo sincronizado NTP oficial.",
      "Biometría facial con IA anti-suplantación (\"buddy punching\") en <0.2 s.",
      "Respaldo redundante local y en nube con cifrado bancario SHA-256."
    ],
    highlight: "0% Margen de Alteración",
    badgeTone: "cyan",
  },
  {
    id: 2,
    num: "02",
    eyebrow: "Artículos 66, 67 y 68 LFT",
    title: "Control Estricto de Jornada & Horas Extra 40h",
    shortTitle: "Control de Horas Extra 40h",
    slug: "02-jornada-horas-extra",
    desc: "Auditoría matemática en tiempo real para respetar los topes legales de 40 horas (máximo 3h diarias y no más de 3 veces por semana), desglosando remuneraciones dobles y triples.",
    bullets: [
      "Cálculo contable automatizado de horas dobles y triples según la LFT.",
      "Alertas preventivas automáticas a supervisores antes de exceder los topes.",
      "Integración directa con CONTPAQi Nóminas, Aspel NOI, Meta4 y SAP ERP."
    ],
    highlight: "Cómputo 100% Automatizado",
    badgeTone: "amber",
  },
  {
    id: 3,
    num: "03",
    eyebrow: "Certidumbre Jurídica",
    title: "Actualización Jurídica & Validez Pericial Plena",
    shortTitle: "Validez Pericial Plena",
    slug: "03-boveda-criptografica",
    desc: "Alineación de contratos y del Reglamento Interior depositado ante el Centro Federal de Conciliación y Registro Laboral (CFCRL) con plena eficacia probatoria.",
    bullets: [
      "Evidencia digital admitida con pleno valor probatorio en juicios orales.",
      "Cumplimiento estricto con la Ley de Protección de Datos Personales (LFPDPPP).",
      "Reducción de hasta un 92% en demandas por reclamo infundado de tiempo extra."
    ],
    highlight: "Plena Eficacia Probatoria",
    badgeTone: "blue",
  },
  {
    id: 4,
    num: "04",
    eyebrow: "Blindaje Sancionatorio STPS",
    title: "Blindaje Total contra Multas STPS ($586k+ MXN)",
    shortTitle: "Blindaje Total ante STPS",
    slug: "04-red-multisede",
    desc: "Erradicación de contingencias financieras de 250 a 5,000 UMA por trabajador ante inspecciones ordinarias o extraordinarias de la Secretaría del Trabajo.",
    bullets: [
      "Generación inmediata de bitácora oficial STPS en formato PDF firmado en 1 clic.",
      "Cero discrepancias entre registros de planta y recibos de nómina CFDI timbrados.",
      "Paz laboral y respaldo institucional sólido ante auditorías y comisiones mixtas."
    ],
    highlight: "100% Cumplimiento STPS",
    badgeTone: "green",
  },
];

export default function ReformaStickyPillars({ onOpenQuote }) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const isDesktop = useIsDesktop();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const itemProgress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isDesktop) return;
    const scaled = Math.min(Math.max(v, 0), 0.9999) * PILLARS.length;
    const idx = Math.floor(scaled);
    itemProgress.set(scaled - idx);
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const goTo = (index) => {
    setActive(index);
    if (!isDesktop) return;
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + distance * ((index + 0.02) / PILLARS.length),
      behavior: "smooth",
    });
  };

  const currentPillar = PILLARS[active];

  return (
    <section
      id="pilares-cumplimiento"
      ref={sectionRef}
      className={`rsp-fwp${isDesktop ? " rsp-fwp--pinned" : ""}`}
      style={isDesktop ? { height: `calc(100vh + ${PILLARS.length} * 65vh)` } : undefined}
    >
      <div className="rsp-fwp-sticky">
        <div className="rsp-fwp-grid">
          
          {/* LEFT COLUMN: IDENTICAL IN CLASS & POLISH TO HOME */}
          <div className="rsp-fwp-left">
            <div className="rsp-fwp-top">
              <span className="rsp-fwp-eyebrow">
                <span className="rsp-fwp-eyebrow-dot" />
                Marco STPS 2027
              </span>
              <span className="rsp-fwp-counter">
                <span className="rsp-fwp-counter-win">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {pad(active + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                / {pad(PILLARS.length)}
              </span>
            </div>

            <h2 className="rsp-fwp-heading">
              Los 4 Pilares del <em>Nuevo Marco Laboral.</em>
            </h2>
            <p className="rsp-fwp-sub">
              Tecnología biométrica inalterable, cálculo contable LFT y validez pericial plena para operar con cero contingencias.
            </p>

            <ul className="rsp-fwp-list">
              {PILLARS.map((item, index) => {
                const isActive = active === index;
                const isDone = index < active;
                return (
                  <motion.li
                    key={item.slug}
                    className={`rsp-fwp-item${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
                    onClick={() => goTo(index)}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                  >
                    {/* Vertical Rail Line */}
                    <span className="rsp-fwp-rail">
                      <motion.span
                        className="rsp-fwp-rail-fill"
                        style={{ scaleY: isActive ? (isDesktop ? itemProgress : 1) : isDone ? 1 : 0 }}
                      />
                    </span>
                    <span className="rsp-fwp-node" />

                    {/* Item Header */}
                    <div className="rsp-fwp-head">
                      <span className="rsp-fwp-num">{item.num}</span>
                      <span className="rsp-fwp-title">{item.shortTitle}</span>
                      <span className={`rsp-fwp-badge rsp-fwp-badge--${item.badgeTone}`}>
                        {item.highlight}
                      </span>
                    </div>

                    {/* Accordion Expand Body */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          className="rsp-fwp-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className="rsp-fwp-desc">{item.desc}</p>
                          
                          <ul className="rsp-fwp-bullets">
                            {item.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="rsp-fwp-bullet">
                                <span className="rsp-bullet-check-circle">
                                  <Check size={11} strokeWidth={3} />
                                </span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="rsp-fwp-cta-row">
                            <button
                              type="button"
                              className="rsp-fwp-cta"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenQuote?.(`Asesoría Técnica sobre ${item.title}`);
                              }}
                            >
                              <Sparkles size={13} />
                              <span>Solicitar Dictamen para este Pilar</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>

                          {/* Mobile inline fallback */}
                          {!isDesktop && (
                            <div className="rsp-floating-stage rsp-floating-stage--mobile">
                              <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="rsp-pure-transparent-video"
                                poster={`/assets/cuatro-pilares/${item.slug}-transparente.png`}
                              >
                                <source
                                  src={`/assets/cuatro-pilares/${item.slug}-transparente.webm`}
                                  type="video/webm"
                                />
                                <source
                                  src={`/assets/cuatro-pilares/${item.slug}.mp4`}
                                  type="video/mp4"
                                />
                              </video>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT COLUMN: 100% BORDERLESS, FLOATING 3D MODEL ("SIN FONDO") */}
          {isDesktop && (
            <div className="rsp-fwp-right">
              <div className="rsp-floating-stage">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className="rsp-floating-inner"
                    initial={{ opacity: 0, y: 14, scale: 0.96, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, scale: 0.96, filter: "blur(4px)" }}
                    transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="rsp-pure-transparent-video"
                      poster={`/assets/cuatro-pilares/${currentPillar.slug}-transparente.png`}
                    >
                      <source
                        src={`/assets/cuatro-pilares/${currentPillar.slug}-transparente.webm`}
                        type="video/webm"
                      />
                      <source
                        src={`/assets/cuatro-pilares/${currentPillar.slug}.mp4`}
                        type="video/mp4"
                      />
                      {/* WebGL 3D fallback iframe */}
                      <iframe
                        src={`/assets/cuatro-pilares/${currentPillar.slug}.html?embed=1&background=transparent`}
                        title={currentPillar.title}
                        className="rsp-pure-transparent-iframe"
                      />
                    </video>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
