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
  Building2,
  Award,
  MessageSquare,
  Lock,
  Activity,
  X,
} from 'lucide-react';
import AlliesMarquee from '../AlliesMarquee';
import {
  CedisLogisticsIsoScene,
  FinancialVaultIsoScene,
  AutomotivePlantIsoScene,
  ResidentialBoulevardIsoScene,
  HospitalBiosecurityIsoScene,
} from './ProjectsIsometricScenes';
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

const PROJECTS_DATA = [
  {
    id: 'cedis-cuautitlan',
    folio: 'PRJ-2026-084',
    category: 'industrial',
    categoryLabel: 'Logística & CEDIS',
    shortTitle: 'Mega-CEDIS Logístico & Aduana CTPAT',
    title: 'Mega-CEDIS Logístico & Aduana Interior',
    clientType: 'Operador Logístico 3PL Transnacional',
    location: 'Cuautitlán Izcalli, Edo. Méx.',
    surface: '48,500 m²',
    duration: '6 Semanas',
    compliance: 'CTPAT Tier-3',
    CustomIsoScene: CedisLogisticsIsoScene,
    image: '/assets/features/warehouse.jpg',
    secondaryImage: '/assets/images/cctv_ptz.jpg',
    challenge:
      'Merma hormiga en 24 andenes simultáneos, puntos ciegos en racks de 14 metros y demoras de 18 minutos por tráiler en esclusa vehicular.',
    solution:
      'Trazabilidad total en patio de maniobras con lectura LPR de contenedores en retroceso, seguimiento de montacargas en pasillos de racks y domos PTZ 32x.',
    metrics: [
      { value: '0%', label: 'Merma en 24 meses' },
      { value: '1.4 s', label: 'Esclusa LPR IA' },
      { value: '100%', label: 'Andenes trazados' },
    ],
    hardware: [
      '42 Cámaras Bullet 4K ColorVu IP67',
      '8 Domos PTZ 32x con Seguimiento IA',
      '4 Esclusas LPR + Barreras de Tráfico Pesado',
      '1,800m Cerca Electrificada 14kV Homologada',
    ],
    detBoxes: [
      { x: 22, y: 36, w: 22, h: 32, label: 'Andén 02 · Sello OK', tone: 'blue' },
      { x: 58, y: 44, w: 18, h: 28, label: 'Montacargas #04', tone: 'green' },
    ],
  },
  {
    id: 'torre-reforma',
    folio: 'PRJ-2026-112',
    category: 'corporativo',
    categoryLabel: 'Corporativo & Banca',
    shortTitle: 'Torre Financiera & Bóveda Bancaria CNBV',
    title: 'Torre Financiera & Bóveda de Datos CNBV',
    clientType: 'Institución Financiera Regulada',
    location: 'Paseo de la Reforma, CDMX',
    surface: '22 Niveles · 31,000 m²',
    duration: '5 Semanas',
    compliance: 'Norma CNBV & ISO 27001',
    CustomIsoScene: FinancialVaultIsoScene,
    image: '/assets/features/lobby.jpg',
    secondaryImage: '/assets/images/access_control.jpg',
    challenge:
      'Flujo diario de 3,400 empleados y visitantes con cuellos de botella en recepción y exigencia de auditoría biométrica en bóveda bancaria y centro de datos.',
    solution:
      'Carriles motorizados Flap Barrier con biometría facial 3D (<0.18 s), matriz láser en bóveda grado 10 y cuarto de servidores RAID-6 encriptado a 120 días.',
    metrics: [
      { value: '0.18 s', label: 'Cruce facial 3D' },
      { value: '45/min', label: 'Flujo por carril' },
      { value: '120 d', label: 'Bóveda CNBV' },
    ],
    hardware: [
      '12 Torniquetes Flap Barrier AISI 304',
      '24 Terminales Faciales MinMoe Dual-IR',
      'Sensores Sísmicos y Matriz Láser en Bóveda',
      'Servidor VMS Redundante RAID-6 + TLS 1.3',
    ],
    detBoxes: [
      { x: 30, y: 38, w: 20, h: 36, label: 'ID Facial · 0.18s', tone: 'green' },
      { x: 60, y: 42, w: 22, h: 30, label: 'Carril AISI 304', tone: 'blue' },
    ],
  },
  {
    id: 'planta-bajio',
    folio: 'PRJ-2025-209',
    category: 'industrial',
    categoryLabel: 'Manufactura & Planta',
    shortTitle: 'Planta Automotriz & Subestación Térmica',
    title: 'Complejo Automotriz Tier-1 & Control STPS',
    clientType: 'Armadora de Autopartes de Exportación',
    location: 'Parque Industrial Querétaro, Qro.',
    surface: '62,000 m²',
    duration: '8 Semanas',
    compliance: 'STPS & T-MEC',
    CustomIsoScene: AutomotivePlantIsoScene,
    image: '/assets/images/perimeter_fence.jpg',
    secondaryImage: '/assets/features/face.jpg',
    challenge:
      'Riesgo de sobrecalentamiento en subestación eléctrica de alta tensión, monitoreo de línea de ensamble robotizada y control de asistencia en 3 turnos.',
    solution:
      'Cámaras termográficas bi-espectrales vigilando transformadores las 24 h, supervisión de línea de producción y esclusa biométrica STPS para 1,800 operadores.',
    metrics: [
      { value: '-34%', label: 'Horas extra fantasma' },
      { value: '58.4°C', label: 'Monitoreo térmico' },
      { value: '99.99%', label: 'Uptime en planta' },
    ],
    hardware: [
      '6 Cámaras Termográficas Bi-Espectrales',
      '18 Terminales Biométricas de Asistencia STPS',
      '56 Cámaras en Tubería Conduit Pared Gruesa',
      '2.4 km de Canalización Galvanizada Certificada',
    ],
    detBoxes: [
      { x: 25, y: 30, w: 26, h: 34, label: 'Termografía IA · OK', tone: 'green' },
      { x: 58, y: 46, w: 22, h: 28, label: 'Perímetro 14,000V', tone: 'blue' },
    ],
  },
  {
    id: 'privada-bosques',
    folio: 'PRJ-2026-041',
    category: 'residencial',
    categoryLabel: 'Residencial Premium',
    shortTitle: 'Macro-Privada & Doble Esclusa UHF / QR',
    title: 'Macro-Privada Residencial & Esclusa Inteligente',
    clientType: 'Comité de Colonos & Administración',
    location: 'Bosques de las Lomas, CDMX',
    surface: '140 Residencias · 4 Accesos',
    duration: '4 Semanas',
    compliance: 'Blindaje Vecinal C4',
    CustomIsoScene: ResidentialBoulevardIsoScene,
    image: '/assets/features/entrance.jpg',
    secondaryImage: '/assets/images/videodoorbell.jpg',
    challenge:
      'Filas de 15 minutos en horas pico mezclando colonos y repartidores, e ingreso de visitas sin validación fotográfica de placa y rostro.',
    solution:
      'Bulevar de doble carril: acceso exprés sin detenerse con antena UHF a 12 metros para residentes (1.2 s) y carril exclusivo de visitas con QR por WhatsApp y SIP 2.0.',
    metrics: [
      { value: '1.2 s', label: 'Apertura Tag UHF' },
      { value: '100%', label: 'Visitas con QR' },
      { value: '< 45m', label: 'SLA en sitio' },
    ],
    hardware: [
      '4 Barreras Vehiculares Brushless Intensivas',
      '4 Antenas UHF Largo Alcance (12m) + LPR',
      'Frentes de Calle IP Antivandálicos IK10 SIP 2.0',
      'Consola Maestra Touchscreen 10" en Caseta',
    ],
    detBoxes: [
      { x: 34, y: 42, w: 24, h: 32, label: 'Tag UHF 12m · 1.2s', tone: 'green' },
      { x: 64, y: 36, w: 20, h: 28, label: 'Carril Visitas QR', tone: 'blue' },
    ],
  },
  {
    id: 'hospital-bioseguridad',
    folio: 'PRJ-2026-063',
    category: 'institucional',
    categoryLabel: 'Salud & Hospitales',
    shortTitle: 'Centro Hospitalario & Esclusa Zero-Touch',
    title: 'Centro Hospitalario & Esclusas COFEPRIS',
    clientType: 'Grupo Hospitalario de Alta Especialidad',
    location: 'Zona de Hospitales, CDMX',
    surface: '24,000 m² · 9 Quirófanos',
    duration: '5 Semanas',
    compliance: 'Norma COFEPRIS',
    CustomIsoScene: HospitalBiosecurityIsoScene,
    image: '/assets/industries/hospitales.jpg',
    secondaryImage: '/assets/images/camera_hero_isolated.jpg',
    challenge:
      'Control de acceso a quirófanos y farmacia controlada sin contacto físico para preservar la asepsia, más monitoreo térmico de cadena de frío y bahía de ambulancias.',
    solution:
      'Puertas herméticas corredizas con lectura facial Zero-Touch compatible con cubrebocas y gorro quirúrgico, telemetría de crioconservación (-4.0°C) y esclusa LPR de urgencias.',
    metrics: [
      { value: '100%', label: 'Acceso Zero-Touch' },
      { value: '99.9%', label: 'ID con cubrebocas' },
      { value: '-4.0°C', label: 'Cadena frío trazada' },
    ],
    hardware: [
      '16 Lectores Faciales con Detección de Cubrebocas',
      'Sensores de Apertura No-Touch para Quirófanos',
      '52 Micro-Domos Antibacteriales de Bajo Perfil',
      'Telemetría Continua en Farmacia COFEPRIS',
    ],
    detBoxes: [
      { x: 35, y: 36, w: 24, h: 34, label: 'Esclusa Quirófano OK', tone: 'green' },
      { x: 64, y: 48, w: 20, h: 26, label: 'Cadena Frío · -4°C', tone: 'blue' },
    ],
  },
  {
    id: 'campus-valle',
    folio: 'PRJ-2025-178',
    category: 'institucional',
    categoryLabel: 'Educación & Campus',
    shortTitle: 'Campus Universitario & Entrega Segura',
    title: 'Campus Educativo & Entrega Segura de Alumnos',
    clientType: 'Red Educativa Privada',
    location: 'Coyoacán / Del Valle, CDMX',
    surface: '18,000 m² · 2,600 Alumnos',
    duration: '3 Semanas',
    compliance: 'Protección Civil & SEP',
    CustomIsoScene: HospitalBiosecurityIsoScene,
    image: '/assets/industries/escuelas.jpg',
    secondaryImage: '/assets/images/alarm_center.jpg',
    challenge:
      'Garantizar que ningún menor sea entregado a personas no autorizadas, eliminar puntos ciegos en patios y automatizar la alerta sísmica.',
    solution:
      'Kioscos biométricos de tutores vinculados a pantallas en aulas, domos panorámicos 360° y sistema de voceo IP sincronizado con SASMEX y C4.',
    metrics: [
      { value: '2,600', label: 'Alumnos con ID' },
      { value: '0', label: 'Incidentes acceso' },
      { value: '60 s', label: 'Evacuación IP' },
    ],
    hardware: [
      '8 Terminales Faciales para Tutores Autorizados',
      '38 Cámaras Domo 4K con Analítica de Merodeo',
      'Sistema de Voceo IP y Alerta Sísmica Automatizada',
      'Botones de Pánico Inalámbricos con Enlace C4',
    ],
    detBoxes: [
      { x: 28, y: 40, w: 22, h: 30, label: 'Tutor Verificado', tone: 'green' },
      { x: 60, y: 34, w: 20, h: 26, label: 'Patio 360° · Activo', tone: 'blue' },
    ],
  },
];

// Top 5 flagship projects for the Sticky-Scroll Isometric Showcase (each has its own unique Isometric World)
const STICKY_PROJECTS = PROJECTS_DATA.slice(0, 5);

const FILTER_CATEGORIES = [
  { id: 'all', label: 'Todos (6)' },
  { id: 'industrial', label: 'Logística & Planta' },
  { id: 'corporativo', label: 'Corporativo & Banca' },
  { id: 'institucional', label: 'Salud & Educación' },
  { id: 'residencial', label: 'Residencial Premium' },
];

export default function ProyectosPage({
  onOpenQuote,
  onNavigateHome,
}) {
  const isDesktop = useIsDesktop();

  // --- STICKY SECTION: 5 BESPOKE ISOMETRIC CASE STUDIES ---
  const showcaseRef = useRef(null);
  const [activeCase, setActiveCase] = useState(0);
  const caseProgress = useMotionValue(0);

  const { scrollYProgress: caseScrollY } = useScroll({
    target: showcaseRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(caseScrollY, 'change', (v) => {
    if (!isDesktop) return;
    const scaled = Math.min(Math.max(v, 0), 0.9999) * STICKY_PROJECTS.length;
    const idx = Math.floor(scaled);
    caseProgress.set(scaled - idx);
    setActiveCase((prev) => (prev === idx ? prev : idx));
  });

  const goToCase = (index) => {
    setActiveCase(index);
    if (!isDesktop) return;
    const el = showcaseRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + distance * ((index + 0.02) / STICKY_PROJECTS.length),
      behavior: 'smooth',
    });
  };

  // --- BENTO CATALOG & MODAL STATE ---
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalProject, setModalProject] = useState(null);
  const [modalMediaTab, setModalMediaTab] = useState('photo1');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!modalProject) return undefined;
    setModalMediaTab('photo1');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalProject(null);
      } else if (e.key === 'ArrowRight') {
        const idx = PROJECTS_DATA.findIndex((p) => p.id === modalProject.id);
        if (idx !== -1) {
          setModalProject(PROJECTS_DATA[(idx + 1) % PROJECTS_DATA.length]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = PROJECTS_DATA.findIndex((p) => p.id === modalProject.id);
        if (idx !== -1) {
          setModalProject(PROJECTS_DATA[(idx - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalProject]);

  const filteredProjects =
    activeCategory === 'all'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategory);

  const currentCaseProject = STICKY_PROJECTS[activeCase] || STICKY_PROJECTS[0];
  const ActiveIsoScene = currentCaseProject.CustomIsoScene;

  return (
    <div className="prj-page-root">
      {/* 1. MINIMALIST STICKY SUB-NAVBAR */}
      <nav className="prj-subnav-bar" aria-label="Navegación de proyectos">
        <div className="container prj-subnav-inner">
          <div className="prj-breadcrumbs">
            <button
              type="button"
              onClick={onNavigateHome}
              className="prj-back-btn"
              title="Volver al Inicio"
            >
              <ArrowLeft size={14} />
              <span>Inicio</span>
            </button>
            <span className="prj-crumb-sep">/</span>
            <span className="prj-crumb-current">Proyectos &amp; Casos de Éxito</span>
          </div>

          <div className="prj-subnav-links">
            <a href="#casos-sticky" className="prj-subnav-anchor">
              Casos Interactivos
            </a>
            <a href="#catalogo-obras" className="prj-subnav-anchor">
              Archivo de Obras
            </a>
            <div className="prj-live-pill">
              <span className="prj-live-dot" />
              <span>+1,200 PROYECTOS ENTREGADOS</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. MINIMALIST LIGHT EDITORIAL HERO (CLEAN PHOTOGRAPHIC COMPOSITION, NO EXTRA ANIMATION) */}
      <section className="prj-hero-section">
        <div className="prj-hero-dot-grid" />
        <div className="prj-hero-ambient-glow" />

        <div className="container prj-hero-grid">
          {/* Left Editorial Column */}
          <div className="prj-hero-left">
            <div className="prj-eyebrow-pill">
              <span className="prj-eyebrow-dot" />
              <span>PORTAFOLIO DE INGENIERÍA APLICADA</span>
            </div>

            <h1 className="prj-hero-h1">
              Proyectos ejecutados con <em>precisión quirúrgica.</em>
            </h1>

            <p className="prj-hero-lead">
              Explora nuestros despliegues reales en centros logísticos, corporativos bancarios,
              plantas automotrices y complejos residenciales, respaldados por cuadrillas propias y{' '}
              <strong>Garantía Vitalicia</strong> en mano de obra.
            </p>

            {/* Minimalist Light KPI Strip */}
            <div className="prj-kpi-row">
              <div className="prj-kpi-item">
                <strong>+1,200</strong>
                <span>Obras entregadas</span>
              </div>
              <div className="prj-kpi-divider" />
              <div className="prj-kpi-item">
                <strong>99.98%</strong>
                <span>Disponibilidad C4</span>
              </div>
              <div className="prj-kpi-divider" />
              <div className="prj-kpi-item">
                <strong>0%</strong>
                <span>Subcontratación</span>
              </div>
              <div className="prj-kpi-divider" />
              <div className="prj-kpi-item">
                <strong>Vitalicia</strong>
                <span>Póliza de instalación</span>
              </div>
            </div>

            {/* Clean CTA Row */}
            <div className="prj-hero-cta-row">
              <button
                type="button"
                onClick={() => onOpenQuote?.('Proyecto Integral a Medida')}
                className="btn btn-primary prj-btn-main"
              >
                <span>Cotizar Proyecto a Medida</span>
                <ArrowUpRight size={18} />
              </button>

              <a href="#casos-sticky" className="btn btn-secondary prj-btn-ghost">
                <span>Explorar Casos Destacados</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Right Clean Architectural Photographic Bento Showcase */}
          <div className="prj-hero-right">
            <div className="prj-hero-photo-bento">
              <div className="prj-hpb-main">
                <img
                  src="/assets/features/warehouse.jpg"
                  alt="Infraestructura Logística Blindada Sistemas Cuauhtli"
                />
                <div className="prj-hpb-scrim" />
                <div className="prj-hpb-badge-top">
                  <span className="prj-iso-live-dot" />
                  <span>OBRA CERTIFICADA TIA-568-C.2</span>
                </div>
                <div className="prj-hpb-caption">
                  <strong>Mega-CEDIS &amp; Parques Industriales</strong>
                  <span>Cuautitlán · Querétaro · Monterrey · Guadalajara</span>
                </div>
              </div>

              <div className="prj-hpb-subgrid">
                <div className="prj-hpb-subcard">
                  <img src="/assets/features/lobby.jpg" alt="Control Biométrico Corporativo" />
                  <div className="prj-hpb-scrim" />
                  <div className="prj-hpb-sublabel">
                    <span>Corporativo &amp; Banca CNBV</span>
                    <strong>0.18s Cruce Facial</strong>
                  </div>
                </div>

                <div className="prj-hpb-subcard">
                  <img src="/assets/images/perimeter_fence.jpg" alt="Blindaje Perimetral 14,000V" />
                  <div className="prj-hpb-scrim" />
                  <div className="prj-hpb-sublabel">
                    <span>Ingeniería Perimetral</span>
                    <strong>Garantía Vitalicia</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 TECHNOLOGY ALLIES MARQUEE */}
      <AlliesMarquee />

      {/* ====================================================================
          3. SECOND SECTION: THE STICKY-SCROLL ISOMETRIC SHOWCASE
          Each of the 5 steps renders its own 100% distinct isometric world
          custom-crafted for what that specific case study describes!
          ==================================================================== */}
      <section
        id="casos-sticky"
        ref={showcaseRef}
        className={`prj-sticky-sec${isDesktop ? ' prj-sticky-sec--pinned' : ''}`}
        style={
          isDesktop
            ? { height: `calc(100vh + ${STICKY_PROJECTS.length} * 62vh)` }
            : undefined
        }
      >
        <div className="prj-sticky-viewport">
          <div className="prj-sticky-grid">
            {/* LEFT COLUMN: Minimalist Rail, Counter & Accordion */}
            <div className="prj-sticky-left">
              <div className="prj-sticky-top">
                <span className="prj-eyebrow-pill">
                  <span className="prj-eyebrow-dot" />
                  Casos de Éxito Auditados
                </span>

                <span className="prj-sticky-counter">
                  <span className="prj-sticky-counter-win">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={activeCase}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {pad(activeCase + 1)}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  / {pad(STICKY_PROJECTS.length)}
                </span>
              </div>

              <h2 className="prj-sticky-heading">
                Ingeniería probada en <em>misión crítica.</em>
              </h2>
              <p className="prj-sticky-sub">
                Cada proyecto se diseña a la medida de la operación del cliente. Desplaza para ver
                la arquitectura isométrica específica de cada caso.
              </p>

              <ul className="prj-rail-list">
                {STICKY_PROJECTS.map((item, index) => {
                  const isActive = activeCase === index;
                  const isDone = index < activeCase;
                  const ItemScene = item.CustomIsoScene;

                  return (
                    <motion.li
                      key={item.id}
                      className={`prj-rail-item${isActive ? ' is-active' : ''}${
                        isDone ? ' is-done' : ''
                      }`}
                      onClick={() => goToCase(index)}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
                    >
                      <span className="prj-rail-line">
                        <motion.span
                          className="prj-rail-fill"
                          style={{
                            scaleY: isActive ? (isDesktop ? caseProgress : 1) : isDone ? 1 : 0,
                          }}
                        />
                      </span>
                      <span className="prj-rail-node" />

                      <div className="prj-rail-head">
                        <span className="prj-rail-num">{pad(index + 1)}</span>
                        <span className="prj-rail-title">{item.shortTitle}</span>
                        <span className="prj-rail-tag">{item.categoryLabel}</span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            className="prj-rail-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="prj-rail-loc">
                              <MapPin size={12} />
                              <span>
                                {item.location} · {item.surface}
                              </span>
                            </div>

                            <p className="prj-rail-desc">{item.solution}</p>

                            {/* 3 Clean Metric Chips */}
                            <div className="prj-rail-metrics">
                              {item.metrics.map((m, mIdx) => (
                                <div key={mIdx} className="prj-rail-metric-chip">
                                  <strong>{m.value}</strong>
                                  <span>{m.label}</span>
                                </div>
                              ))}
                            </div>

                            <div className="prj-rail-actions">
                              <button
                                type="button"
                                className="prj-rail-cta"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenQuote?.(`Proyecto similar a ${item.title}`);
                                }}
                              >
                                <span>Cotizar similar</span>
                                <ArrowRight size={13} />
                              </button>

                              <button
                                type="button"
                                className="prj-rail-cta is-secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalProject(item);
                                }}
                              >
                                <span>Ver fotografías y expediente →</span>
                              </button>
                            </div>

                            {!isDesktop && (
                              <div className="prj-sticky-panel prj-sticky-panel--inline">
                                <ItemScene />
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

            {/* RIGHT STICKY BESPOKE ISOMETRIC STAGE (Desktop) */}
            {isDesktop && (
              <div className="prj-sticky-panel">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCaseProject.id}
                    className="prj-sticky-panel-inner"
                    initial={{ opacity: 0, y: 12, scale: 0.98, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <ActiveIsoScene />

                    {/* Floating Picture-in-Picture Real Site Photo Card */}
                    <div
                      className="prj-pip-card"
                      onClick={() => setModalProject(currentCaseProject)}
                      title="Ver fotografías reales y ficha técnica"
                    >
                      <div className="prj-pip-thumb">
                        <img src={currentCaseProject.image} alt={currentCaseProject.title} />
                        <span className="prj-pip-badge">FOTO REAL</span>
                      </div>
                      <div className="prj-pip-info">
                        <strong>{currentCaseProject.location}</strong>
                        <span>{currentCaseProject.surface} · Ver ficha →</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. VISUAL BENTO GALLERY OF VERIFIED WORKS (CLEAN LIGHT AESTHETIC)
          ==================================================================== */}
      <section id="catalogo-obras" className="prj-gallery-section">
        <div className="container">
          <div className="prj-gallery-header">
            <div>
              <span className="prj-eyebrow-pill">
                <span className="prj-eyebrow-dot" />
                Archivo Visual de Obras
              </span>
              <h2 className="prj-section-h2">
                Explora cada despliegue por <em>sector e industria.</em>
              </h2>
            </div>

            {/* Clean Light Filter Pills */}
            <div className="prj-filter-pills" role="tablist" aria-label="Filtrar obras por sector">
              {FILTER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`prj-filter-pill ${activeCategory === cat.id ? 'is-active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimalist Visual Bento Grid */}
          <motion.div layout className="prj-bento-grid">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.32 }}
                  className="prj-bento-card"
                  onClick={() => setModalProject(project)}
                >
                  {/* Visual Image Header with Subtle AI Detection Overlay */}
                  <div className="prj-card-visual">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="prj-card-img"
                      loading="lazy"
                    />
                    <div className="prj-card-scrim" />

                    {/* Top Glass Badges */}
                    <div className="prj-card-top-row">
                      <span className="prj-glass-tag">{project.folio}</span>
                      <span className="prj-glass-tag is-emerald">
                        <CheckCircle2 size={11} />
                        {project.compliance}
                      </span>
                    </div>

                    {/* Hover AI Detection Box Preview */}
                    {project.detBoxes?.[0] && (
                      <div
                        className="prj-card-ai-box"
                        style={{
                          left: `${project.detBoxes[0].x}%`,
                          top: `${project.detBoxes[0].y}%`,
                          width: `${project.detBoxes[0].w}%`,
                          height: `${project.detBoxes[0].h}%`,
                        }}
                      >
                        <i className="tl" />
                        <i className="tr" />
                        <i className="bl" />
                        <i className="br" />
                        <span>{project.detBoxes[0].label}</span>
                      </div>
                    )}

                    {/* Bottom Location Pill */}
                    <div className="prj-card-loc-bar">
                      <span>
                        <MapPin size={12} /> {project.location}
                      </span>
                      <span>{project.surface}</span>
                    </div>
                  </div>

                  {/* Clean White Card Body */}
                  <div className="prj-card-content">
                    <div>
                      <span className="prj-card-sector">{project.categoryLabel}</span>
                      <h3 className="prj-card-h3">{project.title}</h3>
                    </div>

                    <p className="prj-card-desc">{project.solution}</p>

                    {/* 3 Clean Metrics */}
                    <div className="prj-card-stats">
                      {project.metrics.map((m, idx) => (
                        <div key={idx} className="prj-card-stat">
                          <strong>{m.value}</strong>
                          <span>{m.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Minimalist Card Footer */}
                    <div className="prj-card-actions">
                      <span className="prj-card-explore-link">
                        <span>Ver ficha técnica y fotografías</span>
                      </span>
                      <span className="prj-card-arrow">
                        <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          5. FINAL SECTION: LIGHT & AIRY ARCHITECTURAL CTA CARD
          ==================================================================== */}
      <section className="prj-light-cta-sec">
        <div className="container">
          <div className="prj-light-cta-card">
            <div className="prj-light-cta-grid-bg" />

            <div className="prj-light-cta-left">
              <span className="prj-eyebrow-pill">
                <span className="prj-eyebrow-dot" />
                Levantamiento Técnico Sin Costo
              </span>

              <h2 className="prj-light-cta-h2">
                Proyectemos el blindaje de tu <em>próxima obra.</em>
              </h2>

              <p className="prj-light-cta-p">
                Un ingeniero especialista acudirá a tus instalaciones para evaluar puntos ciegos,
                diseñar el sembrado CAD y entregarte una propuesta técnica llave en mano.
              </p>

              <div className="prj-hero-cta-row">
                <button
                  type="button"
                  onClick={() => onOpenQuote?.('Levantamiento y Anteproyecto en Sitio')}
                  className="btn btn-primary prj-btn-main"
                >
                  <span>Agendar Levantamiento en Sitio</span>
                  <ArrowUpRight size={18} />
                </button>

                <a
                  href="https://wa.me/525585262115?text=Hola%20Sistemas%20Cuauhtli,%20vi%20su%20p%C3%A1gina%20de%20proyectos%20y%20me%20gustar%C3%ADa%20agendar%20un%20levantamiento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary prj-btn-ghost"
                >
                  <MessageSquare size={16} color="#10B981" />
                  <span>Hablar con Ingeniería por WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="prj-light-cta-right">
              <div className="prj-trust-pill-card">
                <div className="prj-trust-icon">
                  <Award size={18} color="#A6192E" />
                </div>
                <div>
                  <strong>Garantía Vitalicia en Mano de Obra</strong>
                  <span>
                    Canalización conduit, conectores y peinado de rack garantizados de por vida.
                  </span>
                </div>
              </div>

              <div className="prj-trust-pill-card">
                <div className="prj-trust-icon">
                  <Activity size={18} color="#10B981" />
                </div>
                <div>
                  <strong>SLA &lt; 60 Minutos en CDMX y Hubs</strong>
                  <span>
                    7 centros operativos con cuadrillas propias en Valle de México, Bajío, MTY y
                    GDL.
                  </span>
                </div>
              </div>

              <div className="prj-trust-pill-card">
                <div className="prj-trust-icon">
                  <Lock size={18} color="#2563EB" />
                </div>
                <div>
                  <strong>Arquitectura Abierta sin Ataduras</strong>
                  <span>
                    Equipos homologados ONVIF / OSDP donde tú conservas el 100% de las claves.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. ULTRA-MINIMALIST ARCHITECTURAL DOSSIER POP-UP (WOW MODAL)
          ==================================================================== */}
      <AnimatePresence>
        {modalProject && (() => {
          const modalIdx = PROJECTS_DATA.findIndex((p) => p.id === modalProject.id);
          const ModalIsoScene = modalProject.CustomIsoScene;
          const stepPrev = () => {
            const nextIdx = (modalIdx - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
            setModalProject(PROJECTS_DATA[nextIdx]);
          };
          const stepNext = () => {
            const nextIdx = (modalIdx + 1) % PROJECTS_DATA.length;
            setModalProject(PROJECTS_DATA[nextIdx]);
          };

          return (
            <motion.div
              className="prj-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              onClick={() => setModalProject(null)}
            >
              <motion.div
                className="prj-modal-card"
                role="dialog"
                aria-modal="true"
                aria-label={`Expediente técnico ${modalProject.title}`}
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.97 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. Minimalist Floating Top Bar */}
                <div className="prj-modal-topbar">
                  <div className="prj-modal-meta">
                    <span className="prj-modal-folio-pill">
                      <span className="prj-live-dot" />
                      {modalProject.folio}
                    </span>
                    <span className="prj-modal-compliance-pill">
                      <ShieldCheck size={12} />
                      {modalProject.compliance}
                    </span>
                    <span className="prj-modal-loc">
                      <MapPin size={12} />
                      {modalProject.location}
                    </span>
                  </div>

                  <div className="prj-modal-controls">
                    <div className="prj-modal-stepper" aria-label="Navegar entre expedientes">
                      <button
                        type="button"
                        onClick={stepPrev}
                        className="prj-modal-step-btn"
                        title="Expediente anterior (←)"
                      >
                        <ArrowLeft size={13} />
                      </button>
                      <span className="prj-modal-step-count">
                        {pad(modalIdx + 1)} / {pad(PROJECTS_DATA.length)}
                      </span>
                      <button
                        type="button"
                        onClick={stepNext}
                        className="prj-modal-step-btn"
                        title="Siguiente expediente (→)"
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalProject(null)}
                      className="prj-modal-close"
                      aria-label="Cerrar expediente"
                      title="Cerrar (ESC)"
                    >
                      <span className="prj-modal-esc">ESC</span>
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* 2. Two-Column Architectural Split */}
                <div className="prj-modal-grid">
                  {/* LEFT: Interactive Media Canvas + Thumbnail Switcher + Spec Ledger */}
                  <div className="prj-modal-visuals">
                    <div className="prj-modal-stage">
                      <AnimatePresence mode="wait">
                        {modalMediaTab === 'iso' && ModalIsoScene ? (
                          <motion.div
                            key={`iso-${modalProject.id}`}
                            className="prj-modal-stage-layer"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.24 }}
                          >
                            <ModalIsoScene />
                          </motion.div>
                        ) : (
                          <motion.div
                            key={`${modalMediaTab}-${modalProject.id}`}
                            className="prj-modal-stage-layer"
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.28 }}
                          >
                            <img
                              src={
                                modalMediaTab === 'photo2'
                                  ? modalProject.secondaryImage
                                  : modalProject.image
                              }
                              alt={modalProject.title}
                              className="prj-modal-stage-img"
                            />
                            <div className="prj-modal-stage-scrim" />

                            {/* Subtle AI Telemetry Bounding Boxes on Primary Photo */}
                            {modalMediaTab === 'photo1' &&
                              modalProject.detBoxes?.map((b, bIdx) => (
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

                            {/* Bottom Floating Camera Caption */}
                            <div className="prj-modal-stage-caption">
                              <span className="prj-modal-cam-tag">
                                {modalMediaTab === 'photo2'
                                  ? 'DETALLE DE INGENIERÍA · AS-BUILT'
                                  : 'EVIDENCIA EN SITIO · VERIFICADA'}
                              </span>
                              <span>{modalProject.clientType}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Interactive Thumbnail & View Selector */}
                    <div className="prj-modal-media-switcher">
                      <button
                        type="button"
                        onClick={() => setModalMediaTab('photo1')}
                        className={`prj-modal-media-btn ${
                          modalMediaTab === 'photo1' ? 'is-active' : ''
                        }`}
                      >
                        <img src={modalProject.image} alt="" />
                        <div>
                          <strong>Vista General</strong>
                          <span>Obra entregada</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalMediaTab('photo2')}
                        className={`prj-modal-media-btn ${
                          modalMediaTab === 'photo2' ? 'is-active' : ''
                        }`}
                      >
                        <img src={modalProject.secondaryImage} alt="" />
                        <div>
                          <strong>Detalle Técnico</strong>
                          <span>Equipamiento</span>
                        </div>
                      </button>

                      {ModalIsoScene && (
                        <button
                          type="button"
                          onClick={() => setModalMediaTab('iso')}
                          className={`prj-modal-media-btn is-iso ${
                            modalMediaTab === 'iso' ? 'is-active' : ''
                          }`}
                        >
                          <div className="prj-modal-iso-icon">3D</div>
                          <div>
                            <strong>Gemelo Digital</strong>
                            <span>Plano en vivo</span>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Architectural Spec Ledger */}
                    <div className="prj-modal-spec-ledger">
                      <div className="prj-modal-spec-cell">
                        <span>SUPERFICIE</span>
                        <strong>{modalProject.surface}</strong>
                      </div>
                      <div className="prj-modal-spec-cell">
                        <span>EJECUCIÓN</span>
                        <strong>{modalProject.duration}</strong>
                      </div>
                      <div className="prj-modal-spec-cell">
                        <span>PÓLIZA</span>
                        <strong>Garantía Vitalicia</strong>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Swiss Editorial Dossier */}
                  <div className="prj-modal-info">
                    <div className="prj-modal-header-group">
                      <div className="prj-modal-eyebrow-row">
                        <span className="prj-card-sector">{modalProject.categoryLabel}</span>
                        <span className="prj-modal-client-chip">
                          <Building2 size={12} />
                          {modalProject.clientType}
                        </span>
                      </div>
                      <h3 className="prj-modal-title">{modalProject.title}</h3>
                    </div>

                    {/* Prominent Audited Impact / ROI Strip */}
                    <div className="prj-modal-roi">
                      {modalProject.metrics.map((m, i) => (
                        <div key={i} className="prj-modal-roi-item">
                          <strong>{m.value}</strong>
                          <span>{m.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Clean Two-Step Narrative Timeline (Challenge -> Engineering Solution) */}
                    <div className="prj-modal-narrative">
                      <div className="prj-modal-narrative-step">
                        <span className="prj-modal-step-badge">01</span>
                        <div>
                          <strong>Diagnóstico &amp; Reto Operativo</strong>
                          <p>{modalProject.challenge}</p>
                        </div>
                      </div>

                      <div className="prj-modal-narrative-step is-solution">
                        <span className="prj-modal-step-badge is-crimson">02</span>
                        <div>
                          <strong>Ingeniería Aplicada Cuauhtli</strong>
                          <p>{modalProject.solution}</p>
                        </div>
                      </div>
                    </div>

                    {/* 2x2 Numbered Hardware Grid */}
                    <div className="prj-modal-hw">
                      <div className="prj-modal-hw-head">
                        <strong>Arquitectura &amp; Hardware Homologado</strong>
                        <span>100% Cuadrillas Propias</span>
                      </div>
                      <div className="prj-modal-hw-grid">
                        {modalProject.hardware.map((hw, i) => (
                          <div key={i} className="prj-modal-hw-card">
                            <span className="prj-modal-hw-idx">{pad(i + 1)}</span>
                            <span className="prj-modal-hw-text">{hw}</span>
                            <CheckCircle2 size={13} className="prj-modal-hw-check" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Minimalist Action Footer */}
                    <div className="prj-modal-actions">
                      <button
                        type="button"
                        onClick={() => {
                          const title = modalProject.title;
                          setModalProject(null);
                          onOpenQuote?.(`Proyecto similar a ${title}`);
                        }}
                        className="btn btn-primary prj-modal-cta-primary"
                      >
                        <span>Cotizar un Proyecto Similar</span>
                        <ArrowUpRight size={17} />
                      </button>

                      <a
                        href={`https://wa.me/525585262115?text=${encodeURIComponent(
                          `Hola Sistemas Cuauhtli, me interesa cotizar un proyecto similar a "${modalProject.title}" (${modalProject.folio}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary prj-modal-cta-wa"
                      >
                        <MessageSquare size={15} color="#10B981" />
                        <span>Ingeniería vía WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
