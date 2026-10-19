import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Cctv,
  MonitorDot,
  Fingerprint,
  Zap,
  Siren,
  Smartphone,
  Warehouse,
  Eye,
  Server,
  LayoutGrid,
} from 'lucide-react';
import DynamicFrameLayout from './ui/dynamic-frame-layout';
import './CoverageGrid.css';

const mixkit = (id) => `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;

const FRAMES = [
  {
    id: 1, cam: '01', zone: 'Perímetro norte',
    label: 'Videovigilancia con IA',
    desc: 'Seguimiento automático de personas y vehículos.',
    solution: 'Circuito Cerrado (CCTV) con IA',
    video: mixkit(48922), defaultPos: { x: 0, y: 0 },
  },
  {
    id: 2, cam: '02', zone: 'Central de monitoreo',
    label: 'Monitoreo 24/7',
    desc: 'Operadores certificados vigilando en tiempo real.',
    solution: 'Alarmas Inteligentes & Monitoreo 24/7',
    video: mixkit(23673), defaultPos: { x: 4, y: 0 },
  },
  {
    id: 3, cam: '03', zone: 'Acceso principal',
    label: 'Control biométrico',
    desc: 'Huella y rostro verificados en menos de 0.2 s.',
    solution: 'Control de Acceso Biométrico',
    video: mixkit(47323), defaultPos: { x: 8, y: 0 },
  },
  {
    id: 4, cam: '04', zone: 'Cerca perimetral',
    label: 'Cercas electrificadas',
    desc: 'Detecta cortes, flexión e intentos de escalamiento.',
    solution: 'Cercas Electrificadas Homologadas',
    video: mixkit(17536), defaultPos: { x: 0, y: 4 },
  },
  {
    id: 5, cam: '05', zone: 'Centro de control C4',
    label: 'Instalación de salas de monitoreo',
    desc: 'Diseño, video walls 24/7, consolas ergonómicas y software VMS para C4.',
    solution: 'Instalación de Salas de Monitoreo',
    video: mixkit(23988), defaultPos: { x: 4, y: 4 },
  },
  {
    id: 6, cam: '06', zone: 'App Cuauthli',
    label: 'Todo desde tu celular',
    desc: 'Abre, arma y revisa desde cualquier lugar.',
    solution: 'Videoporteros IP & Intercom',
    video: mixkit(5733), defaultPos: { x: 8, y: 4 },
  },
  {
    id: 7, cam: '07', zone: 'Nave industrial',
    label: 'Industria y almacenes',
    desc: 'Cobertura total en naves y patios de maniobra.',
    solution: 'Circuito Cerrado (CCTV) con IA',
    video: mixkit(45848), defaultPos: { x: 0, y: 8 },
  },
  {
    id: 8, cam: '08', zone: 'Exterior',
    label: 'Visión a color 24/7',
    desc: 'Imagen nítida incluso sin luz visible.',
    solution: 'Circuito Cerrado (CCTV) con IA',
    video: mixkit(32695), defaultPos: { x: 4, y: 8 },
  },
  {
    id: 9, cam: '09', zone: 'Site de datos',
    label: 'Grabación redundante',
    desc: 'NVR local y respaldo cifrado en la nube.',
    solution: 'Circuito Cerrado (CCTV) con IA',
    video: mixkit(23282), defaultPos: { x: 8, y: 8 },
  },
];

const EASE = [0.22, 1, 0.36, 1];

function LiveClock({ className = 'cg-clock' }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className={className}>{now.toLocaleTimeString('es-MX', { hour12: false })}</span>;
}

const ICONS = {
  1: Cctv,
  2: MonitorDot,
  3: Fingerprint,
  4: Zap,
  5: LayoutGrid,
  6: Smartphone,
  7: Warehouse,
  8: Eye,
  9: Server,
};

function FrameHud(frame, { isActive, hasActive, isAuto }) {
  const dimmed = hasActive && !isActive;
  const Icon = ICONS[frame.id];
  return (
    <div className={`cg-hud ${isActive ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`}>
      {/* cover: tinted layer + centred label, lifts on focus */}
      <div className="cg-cover" aria-hidden="true" />
      {Icon && (
        <span className="cg-cover-icon" aria-hidden="true">
          <Icon size={20} strokeWidth={1.6} />
        </span>
      )}
      <span className="cg-cover-meta" aria-hidden="true">
        CAM {frame.cam} · {frame.zone}
      </span>

      <div className="cg-hud-top">
        <span className="cg-cam">
          <span className="cg-cam-id">{frame.cam}</span>
          <span className="cg-cam-zone">{frame.zone}</span>
        </span>
        <span className="cg-rec">
          <span className="cg-rec-dot" />
          {isAuto ? 'AUTO' : 'LIVE'}
        </span>
      </div>

      {/* single title element that travels centre → bottom-left */}
      <h3 className="cg-title">{frame.label}</h3>

      <div className="cg-hud-bottom">
        <div className="cg-reveal-inner">
          <p className="cg-desc">{frame.desc}</p>
          <span className="cg-cta">
            Cotizar <ArrowUpRight size={12} strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, delay: i * 0.08, ease: EASE },
  }),
};

const inViewProps = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } };

export default function CoverageGrid({ onSelectSolutionForQuote, onOpenQuote }) {
  const [active, setActive] = useState(null);
  const monitorRef = useRef(null);

  // cursor spotlight that leaks through the gaps between screens
  const handleMove = (e) => {
    const el = monitorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  return (
    <section id="soluciones" className="cg" aria-labelledby="cg-heading">
      <div className="cg-inner">
        <header className="cg-head">
          <div className="cg-head-main">
            <motion.span className="cg-eyebrow" variants={fadeUp} {...inViewProps}>
              <span className="cg-eyebrow-dot" />
              Cobertura en vivo
            </motion.span>
            <motion.h2 id="cg-heading" className="cg-heading" variants={fadeUp} custom={1} {...inViewProps}>
              Cada rincón,
              <br />
              <em>bajo control.</em>
            </motion.h2>
          </div>

          <motion.div className="cg-head-side" variants={fadeUp} custom={2} {...inViewProps}>
            <p className="cg-sub">
              Cámaras, accesos, perímetro y alarmas en una sola plataforma, vigilada 24/7 desde CDMX.
            </p>
            <span className="cg-hint">
              <span className="cg-hint-mouse"><span /></span>
              Explora cada cámara
            </span>
          </motion.div>
        </header>

        <motion.div
          ref={monitorRef}
          className="cg-monitor"
          onMouseMove={handleMove}
          initial={{ opacity: 0, y: 30, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="cg-bar">
            <span className="cg-bar-brand">
              <span className="cg-bar-logo" />
              Cuauthli <span className="cg-bar-dim">VMS</span>
            </span>

            <span className="cg-bar-now" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active ? active.id : 'all'}
                  className="cg-bar-now-text"
                  initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {active ? (
                    <>
                      <span className="cg-bar-dim">CAM {active.cam}</span> · {active.zone}
                    </>
                  ) : (
                    <>Vista general · <span className="cg-bar-dim">9 cámaras</span></>
                  )}
                </motion.span>
              </AnimatePresence>
            </span>

            <span className="cg-bar-status">
              <span className="cg-bar-online"><span className="cg-bar-online-dot" />9/9</span>
              <span className="cg-bar-sep" />
              <LiveClock className="cg-bar-clock" />
            </span>
          </div>

          <div className="cg-stage">
            <DynamicFrameLayout
              frames={FRAMES}
              hoverSize={6}
              gapSize={6}
              autoCycle={3800}
              showFrames
              renderOverlay={FrameHud}
              onActiveChange={setActive}
              onFrameClick={(frame) => onSelectSolutionForQuote?.(frame.solution)}
            />
          </div>
        </motion.div>

        <motion.div className="cg-foot" variants={fadeUp} custom={1} {...inViewProps}>
          <ul className="cg-stats">
            <li><strong>4K</strong><span>Resolución</span></li>
            <li><strong>99.8%</strong><span>Menos falsas alarmas</span></li>
            <li><strong>24/7</strong><span>Monitoreo activo</span></li>
          </ul>
          <button type="button" className="cg-btn" onClick={() => onOpenQuote?.()}>
            Diseñar mi sistema
            <span className="cg-btn-icon"><ArrowUpRight size={13} strokeWidth={2.4} /></span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
