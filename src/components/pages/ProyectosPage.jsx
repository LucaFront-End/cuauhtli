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
  Award,
  MessageSquare,
  Lock,
  Activity,
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

export const PROJECTS_DATA = [
  {
    id: 'cedis-cuautitlan',
    folio: 'PRJ-2026-084',
    category: 'industrial',
    categoryLabel: 'Logística & CEDIS',
    shortTitle: 'Mega-CEDIS Logístico & Aduana CTPAT',
    title: 'Mega-CEDIS Logístico & Aduana Interior',
    clientType: 'Operador Logístico 3PL',
    location: 'Cuautitlán Izcalli, Edo. Méx.',
    surface: '48,500 m²',
    duration: '6 Semanas',
    compliance: 'CTPAT Tier-3',
    relatedService: 'cctv',
    CustomIsoScene: CedisLogisticsIsoScene,
    image: '/assets/features/warehouse.jpg',
    secondaryImage: '/assets/images/cctv_ptz.jpg',
    tagline: '24 andenes blindados con lectura LPR y trazabilidad total de montacargas.',
    metrics: [
      { value: '0%', label: 'Merma en 24 meses' },
      { value: '1.4 s', label: 'Esclusa LPR IA' },
      { value: '100%', label: 'Andenes trazados' },
    ],
    hardware: [
      '42 Cámaras Bullet 4K',
      '8 Domos PTZ 32x IA',
      '4 Esclusas LPR Pesadas',
      '1,800m Cerca 14kV',
    ],
    gallery: [
      { src: '/assets/features/warehouse.jpg', tag: 'NAVE PRINCIPAL · 48,500 M²', span: 'wide' },
      { src: '/assets/images/cctv_ptz.jpg', tag: 'DOMO PTZ 32X · PATIO', span: 'tall' },
      { src: '/assets/industries/almacenes.jpg', tag: 'PASILLOS RACK · 14M', span: 'normal' },
      { src: '/assets/features/parking.jpg', tag: 'ESCLUSA LPR · TRÁILERES', span: 'normal' },
    ],
    storySteps: [
      {
        id: 'iso',
        badge: '01 · ARQUITECTURA 3D',
        title: 'Gemelo Digital en Vivo',
        caption: 'Simulación isométrica de esclusa LPR, acoplamiento en andén y pasillos.',
        kpi: '24 Andenes',
        type: 'iso',
      },
      {
        id: 'site',
        badge: '02 · COBERTURA EN SITIO',
        title: 'Visión 4K sin Puntos Ciegos',
        caption: 'Monitoreo simultáneo de maniobras y carga con analítica perimetral.',
        kpi: '0% Merma',
        type: 'photo',
        src: '/assets/features/warehouse.jpg',
      },
      {
        id: 'detail',
        badge: '03 · HARDWARE GRADO IP67',
        title: 'Seguimiento Óptico PTZ 32x',
        caption: 'Lectura automática de sellos fiscales y placas en menos de 1.4 segundos.',
        kpi: '1.4 s LPR',
        type: 'photo',
        src: '/assets/images/cctv_ptz.jpg',
      },
      {
        id: 'ops',
        badge: '04 · AUDITORÍA CTPAT',
        title: 'Trazabilidad en Racks de 14m',
        caption: 'Cada pallet escaneado queda vinculado en video a su guía de embarque.',
        kpi: '90 Días RAID',
        type: 'photo',
        src: '/assets/industries/almacenes.jpg',
      },
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
    clientType: 'Institución Financiera',
    location: 'Paseo de la Reforma, CDMX',
    surface: '31,000 m² · 22 Niveles',
    duration: '5 Semanas',
    compliance: 'CNBV & ISO 27001',
    relatedService: 'control-de-acceso',
    CustomIsoScene: FinancialVaultIsoScene,
    image: '/assets/features/lobby.jpg',
    secondaryImage: '/assets/images/access_control.jpg',
    tagline: 'Acceso facial en 0.18 segundos para 3,400 ejecutivos y bóveda bancaria grado 10.',
    metrics: [
      { value: '0.18 s', label: 'Cruce facial 3D' },
      { value: '45/min', label: 'Flujo por carril' },
      { value: '120 d', label: 'Bóveda CNBV' },
    ],
    hardware: [
      '12 Carriles Flap AISI 304',
      '24 Terminales Faciales 3D',
      'Matriz Láser en Bóveda',
      'Cluster VMS AES-256',
    ],
    gallery: [
      { src: '/assets/features/lobby.jpg', tag: 'LOBBY CORPORATIVO · REFORMA', span: 'wide' },
      { src: '/assets/images/access_control.jpg', tag: 'BIOMETRÍA FACIAL · 0.18S', span: 'tall' },
      { src: '/assets/industries/bancos.jpg', tag: 'BÓVEDA GRADO X · CNBV', span: 'normal' },
      { src: '/assets/industries/oficinas.jpg', tag: 'ESCLUSAS EJECUTIVAS · PISO 22', span: 'normal' },
    ],
    storySteps: [
      {
        id: 'iso',
        badge: '01 · ARQUITECTURA 3D',
        title: 'Esclusas & Bóveda CNBV',
        caption: 'Planta isométrica de carriles ópticos, bóveda blindada y cluster de datos.',
        kpi: '0.18 s Cruce',
        type: 'iso',
      },
      {
        id: 'site',
        badge: '02 · FLUJO EJECUTIVO',
        title: 'Recepción sin Cuellos de Botella',
        caption: '12 carriles motorizados en acero inoxidable con validación facial al caminar.',
        kpi: '3,400 Usuarios',
        type: 'photo',
        src: '/assets/features/lobby.jpg',
      },
      {
        id: 'detail',
        badge: '03 · BIOMETRÍA ANTI-SPOOFING',
        title: 'Lectura Dual-IR en Movimiento',
        caption: 'Sincronización instantánea con Active Directory y pases QR para visitas.',
        kpi: '99.98% Precisión',
        type: 'photo',
        src: '/assets/images/access_control.jpg',
      },
      {
        id: 'ops',
        badge: '04 · NORMATIVA BANCARIA',
        title: 'Retención Cifrada 120 Días',
        caption: 'Grabación redundante bajo estándar CNBV con firma criptográfica.',
        kpi: 'AES-256',
        type: 'photo',
        src: '/assets/industries/bancos.jpg',
      },
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
    clientType: 'Armadora Autopartes',
    location: 'Parque Industrial Querétaro',
    surface: '62,000 m²',
    duration: '8 Semanas',
    compliance: 'STPS & T-MEC',
    relatedService: 'cercas-electrificadas',
    CustomIsoScene: AutomotivePlantIsoScene,
    image: '/assets/images/perimeter_fence.jpg',
    secondaryImage: '/assets/features/face.jpg',
    tagline: 'Termografía radiométrica en subestación de 115 kV y asistencia STPS en 3 turnos.',
    metrics: [
      { value: '-34%', label: 'Horas extra fantasma' },
      { value: '58.4°C', label: 'Monitoreo térmico' },
      { value: '99.99%', label: 'Uptime en planta' },
    ],
    hardware: [
      '6 Cámaras Termográficas',
      '18 Terminales STPS',
      '56 Cámaras en Conduit',
      '2.4 km Cerca 14,000V',
    ],
    gallery: [
      { src: '/assets/images/perimeter_fence.jpg', tag: 'BLINDAJE PERIMETRAL · 14KV', span: 'wide' },
      { src: '/assets/features/face.jpg', tag: 'ASISTENCIA STPS · 1,800 OPS', span: 'tall' },
      { src: '/assets/industries/constructoras.jpg', tag: 'NAVE DE ENSAMBLE · TIER-1', span: 'normal' },
      { src: '/assets/images/reforma/paso-3-turnos.jpg', tag: 'CONTROL DE TURNOS · SAP', span: 'normal' },
    ],
    storySteps: [
      {
        id: 'iso',
        badge: '01 · ARQUITECTURA 3D',
        title: 'Línea Robotizada & Subestación',
        caption: 'Monitoreo isométrico de nave automotriz, transformadores y acceso STPS.',
        kpi: '115 kV Vigilados',
        type: 'iso',
      },
      {
        id: 'site',
        badge: '02 · DEFENSA PERIMETRAL',
        title: '2.4 km de Cerca Zonificada',
        caption: 'Canalización galvanizada de pared gruesa y disuasión activa de 14,000V.',
        kpi: '8 Sectores',
        type: 'photo',
        src: '/assets/images/perimeter_fence.jpg',
      },
      {
        id: 'detail',
        badge: '03 · CONTROL LABORAL',
        title: '1,800 Operadores en 3 Turnos',
        caption: 'Eliminación inmediata de horas extra fantasma con exportación a nómina.',
        kpi: '-34% Sobrecosto',
        type: 'photo',
        src: '/assets/features/face.jpg',
      },
      {
        id: 'ops',
        badge: '04 · CONTINUIDAD OPERATIVA',
        title: 'Alertas Térmicas Preventivas',
        caption: 'Detección de puntos calientes antes de cualquier paro no programado.',
        kpi: '99.99% Uptime',
        type: 'photo',
        src: '/assets/industries/constructoras.jpg',
      },
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
    clientType: 'Comité de Colonos',
    location: 'Bosques de las Lomas, CDMX',
    surface: '140 Residencias',
    duration: '4 Semanas',
    compliance: 'Blindaje Vecinal C4',
    relatedService: 'interfon',
    CustomIsoScene: ResidentialBoulevardIsoScene,
    image: '/assets/features/entrance.jpg',
    secondaryImage: '/assets/images/videodoorbell.jpg',
    tagline: 'Doble carril inteligente: lectura UHF a 12 metros para colonos y QR temporal para visitas.',
    metrics: [
      { value: '1.2 s', label: 'Apertura Tag UHF' },
      { value: '100%', label: 'Visitas con QR' },
      { value: '< 45m', label: 'SLA en sitio' },
    ],
    hardware: [
      '4 Barreras Brushless',
      '4 Antenas UHF 12m + LPR',
      'Interfonos IP IK10 SIP',
      'Consola Maestra C4',
    ],
    gallery: [
      { src: '/assets/features/entrance.jpg', tag: 'PÓRTICO PRINCIPAL · DOBLE CARRIL', span: 'wide' },
      { src: '/assets/images/videodoorbell.jpg', tag: 'TÓTEM QR · SIP 2.0 IK10', span: 'tall' },
      { src: '/assets/industries/residencias.jpg', tag: 'VIALIDAD INTERIOR · 140 CASAS', span: 'normal' },
      { src: '/assets/features/parking.jpg', tag: 'LECTURA LPR · PLACAS', span: 'normal' },
    ],
    storySteps: [
      {
        id: 'iso',
        badge: '01 · ARQUITECTURA 3D',
        title: 'Flujo Separado Colonos / Visitas',
        caption: 'Apertura anticipada UHF en carril izquierdo y validación QR en carril derecho.',
        kpi: '1.2 s Cruce',
        type: 'iso',
      },
      {
        id: 'site',
        badge: '02 · PÓRTICO BLINDADO',
        title: 'Cero Filas en Hora Pico',
        caption: 'Barreras brushless de uso continuo sincronizadas con lectura de placa y tag.',
        kpi: '420 Autos',
        type: 'photo',
        src: '/assets/features/entrance.jpg',
      },
      {
        id: 'detail',
        badge: '03 · VIDEO-INTERFONÍA',
        title: 'Autorización Móvil con QR',
        caption: 'El residente recibe video en vivo en su celular y genera pases por WhatsApp.',
        kpi: 'SIP 2.0 HD',
        type: 'photo',
        src: '/assets/images/videodoorbell.jpg',
      },
      {
        id: 'ops',
        badge: '04 · TRANQUILIDAD VECINAL',
        title: 'Monitoreo Perimetral 24/7',
        caption: 'Bitácora fotográfica de cada vehículo, repartidor y proveedor que ingresa.',
        kpi: '100% Trazado',
        type: 'photo',
        src: '/assets/industries/residencias.jpg',
      },
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
    clientType: 'Grupo Hospitalario',
    location: 'Zona de Hospitales, CDMX',
    surface: '24,000 m² · 9 Quirófanos',
    duration: '5 Semanas',
    compliance: 'Norma COFEPRIS',
    relatedService: 'control-de-acceso',
    CustomIsoScene: HospitalBiosecurityIsoScene,
    image: '/assets/industries/hospitales.jpg',
    secondaryImage: '/assets/images/camera_hero_isolated.jpg',
    tagline: 'Esclusas quirúrgicas sin contacto físico, cadena de frío a -4.0°C y bahía de urgencias.',
    metrics: [
      { value: '100%', label: 'Acceso Zero-Touch' },
      { value: '99.9%', label: 'ID con cubrebocas' },
      { value: '-4.0°C', label: 'Cadena frío trazada' },
    ],
    hardware: [
      '16 Lectores Zero-Touch',
      'Sensores Quirófano IR',
      '52 Micro-Domos Clínicos',
      'Telemetría COFEPRIS',
    ],
    gallery: [
      { src: '/assets/industries/hospitales.jpg', tag: 'ÁREA QUIRÚRGICA · ZERO-TOUCH', span: 'wide' },
      { src: '/assets/images/camera_hero_isolated.jpg', tag: 'DOMO CLÍNICO · ANTIBACTERIAL', span: 'tall' },
      { src: '/assets/images/access_control.jpg', tag: 'LECTURA CON CUBREBOCAS · 99.9%', span: 'normal' },
      { src: '/assets/images/alarm_center.jpg', tag: 'TELEMETRÍA CADENA FRÍO · -4°C', span: 'normal' },
    ],
    storySteps: [
      {
        id: 'iso',
        badge: '01 · ARQUITECTURA 3D',
        title: 'Esclusa Aséptica & Urgencias',
        caption: 'Apertura hermética sin contacto para cirujanos y bahía prioritaria de ambulancias.',
        kpi: 'Zero-Touch',
        type: 'iso',
      },
      {
        id: 'site',
        badge: '02 · BIOSEGURIDAD CLÍNICA',
        title: 'Asepsia Total en 9 Quirófanos',
        caption: 'Reconocimiento periocular aún con gorro quirúrgico y cubrebocas N95.',
        kpi: '99.9% ID',
        type: 'photo',
        src: '/assets/industries/hospitales.jpg',
      },
      {
        id: 'detail',
        badge: '03 · GRADO SANITARIO',
        title: 'Óptica Antibacterial Silenciosa',
        caption: 'Micro-domos sellados libres de polvo con cableado libre de halógenos.',
        kpi: 'COFEPRIS OK',
        type: 'photo',
        src: '/assets/images/camera_hero_isolated.jpg',
      },
      {
        id: 'ops',
        badge: '04 · FARMACIA CONTROLADA',
        title: 'Monitoreo Continuo a -4.0°C',
        caption: 'Alertas instantáneas y bitácora auditable de cada apertura de crioconservación.',
        kpi: '-4.0°C Fijos',
        type: 'photo',
        src: '/assets/images/alarm_center.jpg',
      },
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
    relatedService: 'alarmas',
    CustomIsoScene: HospitalBiosecurityIsoScene,
    image: '/assets/industries/escuelas.jpg',
    secondaryImage: '/assets/images/alarm_center.jpg',
    tagline: 'Validación biométrica de tutores, cobertura 360° en patios y alerta sísmica SASMEX.',
    metrics: [
      { value: '2,600', label: 'Alumnos con ID' },
      { value: '0', label: 'Incidentes acceso' },
      { value: '60 s', label: 'Evacuación IP' },
    ],
    hardware: [
      '8 Kioscos de Tutores',
      '38 Domos 4K en Patios',
      'Voceo IP + SASMEX',
      'Botones Pánico C4',
    ],
    gallery: [
      { src: '/assets/industries/escuelas.jpg', tag: 'CAMPUS CENTRAL · 18,000 M²', span: 'wide' },
      { src: '/assets/images/alarm_center.jpg', tag: 'ALERTA SÍSMICA · SASMEX IP', span: 'tall' },
      { src: '/assets/images/access_control.jpg', tag: 'ENTREGA VERIFICADA · TUTORES', span: 'normal' },
      { src: '/assets/industries/plazas.jpg', tag: 'PATIOS & ÁREAS COMUNES · 360°', span: 'normal' },
    ],
    storySteps: [
      {
        id: 'iso',
        badge: '01 · ARQUITECTURA 3D',
        title: 'Esclusas Peatonales & Emergencia',
        caption: 'Flujo controlado de comunidad escolar y liberación automática en evacuación.',
        kpi: '2,600 Alumnos',
        type: 'iso',
      },
      {
        id: 'site',
        badge: '02 · CAMPUS PROTEGIDO',
        title: 'Cero Puntos Ciegos en Patios',
        caption: 'Domos panorámicos 4K con analítica de merodeo en bardas perimetrales.',
        kpi: '38 Domos 4K',
        type: 'photo',
        src: '/assets/industries/escuelas.jpg',
      },
      {
        id: 'detail',
        badge: '03 · PROTOCOLO SÍSMICO',
        title: 'Automatización SASMEX en 60s',
        caption: 'Apertura inmediata de torniquetes y voceo IP ante sismo confirmado.',
        kpi: '60 s Evacuación',
        type: 'photo',
        src: '/assets/images/alarm_center.jpg',
      },
      {
        id: 'ops',
        badge: '04 · PADRES CONECTADOS',
        title: 'Notificación Push al Instante',
        caption: 'Confirmación en el celular de los padres en cada entrada y salida.',
        kpi: '0 Incidentes',
        type: 'photo',
        src: '/assets/images/access_control.jpg',
      },
    ],
    detBoxes: [
      { x: 28, y: 40, w: 22, h: 30, label: 'Tutor Verificado', tone: 'green' },
      { x: 60, y: 34, w: 20, h: 26, label: 'Patio 360° · Activo', tone: 'blue' },
    ],
  },
];

const STICKY_PROJECTS = PROJECTS_DATA.slice(0, 5);

const FILTER_CATEGORIES = [
  { id: 'all', label: 'Todos', count: 6 },
  { id: 'industrial', label: 'Industrial & Logística', count: 2 },
  { id: 'corporativo', label: 'Corporativo', count: 1 },
  { id: 'institucional', label: 'Salud & Educación', count: 2 },
  { id: 'residencial', label: 'Residencial', count: 1 },
];

export default function ProyectosPage({
  onOpenQuote,
  onNavigateHome,
  onSelectProject,
}) {
  const isDesktop = useIsDesktop();

  const openProjectPage = (projectId) => {
    if (onSelectProject) {
      onSelectProject(projectId);
    } else {
      window.location.hash = `proyecto/${projectId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  // --- ARCHIVO DE OBRAS: FILTER ---
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
            <span className="prj-crumb-current">Proyectos</span>
          </div>

          <div className="prj-subnav-links">
            <a href="#casos-sticky" className="prj-subnav-anchor">
              Interactivo 3D
            </a>
            <a href="#catalogo-obras" className="prj-subnav-anchor">
              Galería de Obras
            </a>
            <div className="prj-live-pill">
              <span className="prj-live-dot" />
              <span>+1,200 OBRAS</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. MINIMALIST LIGHT EDITORIAL HERO */}
      <section className="prj-hero-section">
        <div className="prj-hero-dot-grid" />
        <div className="prj-hero-ambient-glow" />

        <div className="container prj-hero-grid">
          <div className="prj-hero-left">
            <div className="prj-eyebrow-pill">
              <span className="prj-eyebrow-dot" />
              <span>PORTAFOLIO DE INGENIERÍA</span>
            </div>

            <h1 className="prj-hero-h1">
              Obras diseñadas con <em>precisión quirúrgica.</em>
            </h1>

            <p className="prj-hero-lead">
              Despliegues reales en centros logísticos, banca, industria y residenciales con
              cuadrillas propias y <strong>Garantía Vitalicia</strong>.
            </p>

            <div className="prj-kpi-row">
              <div className="prj-kpi-item">
                <strong>+1,200</strong>
                <span>Obras</span>
              </div>
              <div className="prj-kpi-divider" />
              <div className="prj-kpi-item">
                <strong>99.98%</strong>
                <span>Uptime C4</span>
              </div>
              <div className="prj-kpi-divider" />
              <div className="prj-kpi-item">
                <strong>0%</strong>
                <span>Subcontratos</span>
              </div>
              <div className="prj-kpi-divider" />
              <div className="prj-kpi-item">
                <strong>Vitalicia</strong>
                <span>Garantía</span>
              </div>
            </div>

            <div className="prj-hero-cta-row">
              <button
                type="button"
                onClick={() => onOpenQuote?.('Proyecto Integral a Medida')}
                className="btn btn-primary prj-btn-main"
              >
                <span>Cotizar Proyecto</span>
                <ArrowUpRight size={18} />
              </button>

              <a href="#catalogo-obras" className="btn btn-secondary prj-btn-ghost">
                <span>Ver Galería</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="prj-hero-right">
            <div className="prj-hero-photo-bento">
              <div
                className="prj-hpb-main"
                onClick={() => openProjectPage('cedis-cuautitlan')}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src="/assets/features/warehouse.jpg"
                  alt="Infraestructura Logística Blindada"
                />
                <div className="prj-hpb-scrim" />
                <div className="prj-hpb-badge-top">
                  <span className="prj-iso-live-dot" />
                  <span>PRJ-2026-084 · CTPAT</span>
                </div>
                <div className="prj-hpb-caption">
                  <strong>Mega-CEDIS &amp; Aduana ↗</strong>
                  <span>Cuautitlán Izcalli · 48,500 m²</span>
                </div>
              </div>

              <div className="prj-hpb-subgrid">
                <div
                  className="prj-hpb-subcard"
                  onClick={() => openProjectPage('torre-reforma')}
                  style={{ cursor: 'pointer' }}
                >
                  <img src="/assets/features/lobby.jpg" alt="Control Biométrico Corporativo" />
                  <div className="prj-hpb-scrim" />
                  <div className="prj-hpb-sublabel">
                    <span>Torre Reforma ↗</span>
                    <strong>0.18s Facial</strong>
                  </div>
                </div>

                <div
                  className="prj-hpb-subcard"
                  onClick={() => openProjectPage('planta-bajio')}
                  style={{ cursor: 'pointer' }}
                >
                  <img src="/assets/images/perimeter_fence.jpg" alt="Blindaje Perimetral" />
                  <div className="prj-hpb-scrim" />
                  <div className="prj-hpb-sublabel">
                    <span>Planta Bajío ↗</span>
                    <strong>62,000 m²</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AlliesMarquee />

      {/* ====================================================================
          3. STICKY-SCROLL ISOMETRIC SHOWCASE (CONCISE & VISUAL)
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
            <div className="prj-sticky-left">
              <div className="prj-sticky-top">
                <span className="prj-eyebrow-pill">
                  <span className="prj-eyebrow-dot" />
                  Arquitectura Interactiva
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
                Ingeniería en <em>tiempo real.</em>
              </h2>

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
                            <p className="prj-rail-desc">{item.tagline}</p>

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
                                  openProjectPage(item.id);
                                }}
                              >
                                <span>Ver caso completo</span>
                                <ArrowUpRight size={14} />
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

                    <div
                      className="prj-pip-card"
                      onClick={() => openProjectPage(currentCaseProject.id)}
                      title="Abrir proyecto"
                    >
                      <div className="prj-pip-thumb">
                        <img src={currentCaseProject.image} alt={currentCaseProject.title} />
                        <span className="prj-pip-badge">VER OBRA</span>
                      </div>
                      <div className="prj-pip-info">
                        <strong>{currentCaseProject.shortTitle}</strong>
                        <span>{currentCaseProject.surface} · Explorar ↗</span>
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
          4. MINIMALIST ASYMMETRIC VISUAL LOOKBOOK (#catalogo-obras)
          90% Visual Photography + Asymmetric 7/5 & 5/7 Rhythm + Zero Text Clutter
          ==================================================================== */}
      <section id="catalogo-obras" className="prj-lookbook-sec">
        <div className="container">
          <div className="prj-lookbook-header">
            <div>
              <span className="prj-eyebrow-pill">
                <span className="prj-eyebrow-dot" />
                GALERÍA SELECCIONADA
              </span>
              <h2 className="prj-section-h2">
                Archivo <em>visual de obras.</em>
              </h2>
            </div>

            <div className="prj-filter-pills" role="tablist" aria-label="Filtrar obras">
              {FILTER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`prj-filter-pill ${activeCategory === cat.id ? 'is-active' : ''}`}
                >
                  <span>{cat.label}</span>
                  <span className="prj-filter-count">{pad(cat.count)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric 12-Column Visual Lookbook Grid */}
          <motion.div layout className="prj-lookbook-grid">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                // Alternating wide (7 cols) and narrow (5 cols) rhythm:
                // Row 0: 7 + 5, Row 1: 5 + 7, Row 2: 7 + 5
                const isWide = idx % 4 === 0 || idx % 4 === 3;
                const globalNum = PROJECTS_DATA.findIndex((p) => p.id === project.id) + 1;

                return (
                  <motion.article
                    layout
                    key={project.id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className={`prj-lookbook-card ${isWide ? 'is-wide' : 'is-narrow'}`}
                    onClick={() => openProjectPage(project.id)}
                  >
                    {/* Large Pure Visual Stage */}
                    <div className="prj-lookbook-frame">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="prj-lookbook-img"
                        loading="lazy"
                      />
                      <div className="prj-lookbook-scrim" />

                      {/* Top Minimalist Glass Tags */}
                      <div className="prj-lookbook-top">
                        <span className="prj-lookbook-idx-pill">
                          <strong>{pad(globalNum)}</strong>
                          <span>{project.folio}</span>
                        </span>

                        <span className="prj-lookbook-comp-pill">
                          <ShieldCheck size={12} />
                          {project.compliance}
                        </span>
                      </div>

                      {/* Subtle AI Telemetry Bounding Box on Hover */}
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

                      {/* Floating Secondary Detail Thumbnail on Hover */}
                      <div className="prj-lookbook-pip">
                        <img src={project.secondaryImage} alt="" />
                      </div>

                      {/* Floating KPI Glass Pill inside Bottom-Left of Frame */}
                      <div className="prj-lookbook-kpi-float">
                        {project.metrics.slice(0, 2).map((m, mIdx) => (
                          <div key={mIdx} className="prj-lookbook-kpi-chip">
                            <strong>{m.value}</strong>
                            <span>{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ultra-Clean Minimalist Caption Row below the Frame */}
                    <div className="prj-lookbook-caption">
                      <div className="prj-lookbook-caption-left">
                        <div className="prj-lookbook-meta">
                          <span className="prj-lookbook-sector">{project.categoryLabel}</span>
                          <span className="prj-lookbook-dot">·</span>
                          <span className="prj-lookbook-loc">
                            <MapPin size={12} /> {project.location}
                          </span>
                          <span className="prj-lookbook-dot">·</span>
                          <span className="prj-lookbook-surf">{project.surface}</span>
                        </div>
                        <h3 className="prj-lookbook-title">{project.title}</h3>
                      </div>

                      <div className="prj-lookbook-arrow">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
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
                Levantamiento Sin Costo
              </span>

              <h2 className="prj-light-cta-h2">
                Proyectemos tu <em>próxima obra.</em>
              </h2>

              <p className="prj-light-cta-p">
                Sembrado CAD, ingeniería en sitio y propuesta llave en mano sin compromiso.
              </p>

              <div className="prj-hero-cta-row">
                <button
                  type="button"
                  onClick={() => onOpenQuote?.('Levantamiento y Anteproyecto en Sitio')}
                  className="btn btn-primary prj-btn-main"
                >
                  <span>Agendar Levantamiento</span>
                  <ArrowUpRight size={18} />
                </button>

                <a
                  href="https://wa.me/525585262115?text=Hola%20Sistemas%20Cuauhtli,%20vi%20su%20p%C3%A1gina%20de%20proyectos%20y%20me%20gustar%C3%ADa%20agendar%20un%20levantamiento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary prj-btn-ghost"
                >
                  <MessageSquare size={16} color="#10B981" />
                  <span>WhatsApp Ingeniería</span>
                </a>
              </div>
            </div>

            <div className="prj-light-cta-right">
              <div className="prj-trust-pill-card">
                <div className="prj-trust-icon">
                  <Award size={18} color="#A6192E" />
                </div>
                <div>
                  <strong>Garantía Vitalicia en Obra</strong>
                  <span>Canalización y montaje garantizados de por vida.</span>
                </div>
              </div>

              <div className="prj-trust-pill-card">
                <div className="prj-trust-icon">
                  <Activity size={18} color="#10B981" />
                </div>
                <div>
                  <strong>SLA &lt; 60 Minutos</strong>
                  <span>7 centros operativos con cuadrillas propias.</span>
                </div>
              </div>

              <div className="prj-trust-pill-card">
                <div className="prj-trust-icon">
                  <Lock size={18} color="#2563EB" />
                </div>
                <div>
                  <strong>Arquitectura Abierta</strong>
                  <span>Tú conservas el 100% de las claves y licencias.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
