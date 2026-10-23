import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  KeyRound, 
  ShieldAlert, 
  Radio, 
  Network, 
  Building, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Calendar, 
  MessageSquare, 
  Copy,
  Navigation,
  Monitor,
  BellRing,
  Plus,
  X
} from 'lucide-react';
import './MultiStepQuoteForm.css';

/* --------------------------------------------------------------------------
   INTERACTIVE CYBER ANIMATIONS (BESPOKE VECTOR HUDS)
   Smooth 60fps CSS/SVG animations — 100% reliable, zero freeze, pure WOW
   -------------------------------------------------------------------------- */

function Step1ShieldAnimation() {
  return (
    <div className="msf-hud-wrap">
      <svg viewBox="0 0 200 200" className="msf-hud-svg">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient pulse halo */}
        <circle cx="100" cy="100" r="55" fill="url(#coreGlow)" className="msf-core-glow" />

        {/* Outer tech ring (clockwise) */}
        <circle cx="100" cy="100" r="86" className="msf-ring-cw" />
        
        {/* Inner dashed ring (counter-clockwise) */}
        <circle cx="100" cy="100" r="74" className="msf-ring-ccw" />

        {/* HUD Corner Reticles */}
        <path d="M 32 46 L 32 32 L 46 32" className="msf-hud-reticle" />
        <path d="M 168 46 L 168 32 L 154 32" className="msf-hud-reticle" />
        <path d="M 32 154 L 32 168 L 46 168" className="msf-hud-reticle" />
        <path d="M 168 154 L 168 168 L 154 168" className="msf-hud-reticle" />

        {/* Outer Shield Outline */}
        <path 
          d="M 100 46 Q 128 52 144 48 C 144 94 132 130 100 154 C 68 130 56 94 56 48 Q 72 52 100 46 Z" 
          className="msf-shield-outer"
        />

        {/* Inner Shield Mesh */}
        <path 
          d="M 100 58 Q 122 63 132 60 C 132 94 122 122 100 142 C 78 122 68 94 68 60 Q 78 63 100 58 Z" 
          fill="url(#shieldGrad)"
          className="msf-shield-inner"
        />

        {/* Central Camera / Eye Reticle */}
        <circle cx="100" cy="96" r="14" className="msf-eye-ring" />
        <circle cx="100" cy="96" r="6" className="msf-eye-pupil" />

        {/* Laser Sweep Scanner */}
        <line x1="48" y1="96" x2="152" y2="96" className="msf-shield-laser" />

        {/* Pulsing Coordinate Blips */}
        <circle cx="70" cy="80" r="2.5" className="msf-blip-pulse-1" />
        <circle cx="130" cy="80" r="2.5" className="msf-blip-pulse-2" />
        <circle cx="100" cy="136" r="2.5" className="msf-blip-pulse-3" />
      </svg>

      <div className="msf-hud-status-strip">
        <span className="msf-hud-live-dot" />
        <span>AI VISION · DETECCIÓN ACTIVA</span>
      </div>
    </div>
  );
}

function Step2RadarAnimation() {
  return (
    <div className="msf-hud-wrap">
      <svg viewBox="0 0 200 200" className="msf-hud-svg">
        <defs>
          <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Radar concentric range circles */}
        <circle cx="100" cy="100" r="86" className="msf-radar-circle msf-radar-outer" />
        <circle cx="100" cy="100" r="64" className="msf-radar-circle" />
        <circle cx="100" cy="100" r="42" className="msf-radar-circle" />
        <circle cx="100" cy="100" r="20" className="msf-radar-circle" />

        {/* Crosshair Axes */}
        <line x1="14" y1="100" x2="186" y2="100" className="msf-radar-axis" />
        <line x1="100" y1="14" x2="100" y2="186" className="msf-radar-axis" />

        {/* 45 degree ticks */}
        <line x1="39" y1="39" x2="161" y2="161" className="msf-radar-axis-subtle" />
        <line x1="161" y1="39" x2="39" y2="161" className="msf-radar-axis-subtle" />

        {/* 360° Rotating Radar Sweep */}
        <g className="msf-radar-sweep-rotor">
          <path 
            d="M 100 100 L 100 14 A 86 86 0 0 1 176 56 Z" 
            fill="url(#radarSweepGrad)"
          />
          <line x1="100" y1="100" x2="100" y2="14" className="msf-radar-sweep-lead" />
        </g>

        {/* Detected Targets (Perimeter Blips) */}
        <g className="msf-target-blip msf-tblip-1">
          <circle cx="136" cy="62" r="3.5" className="msf-tblip-core" />
          <circle cx="136" cy="62" r="8" className="msf-tblip-wave" />
        </g>
        <g className="msf-target-blip msf-tblip-2">
          <circle cx="68" cy="132" r="3" className="msf-tblip-core" />
          <circle cx="68" cy="132" r="7" className="msf-tblip-wave" />
        </g>
        <g className="msf-target-blip msf-tblip-3">
          <circle cx="146" cy="120" r="3" className="msf-tblip-core" />
          <circle cx="146" cy="120" r="7" className="msf-tblip-wave" />
        </g>

        {/* Origin / Tower marker */}
        <circle cx="100" cy="100" r="4" className="msf-radar-center-dot" />
      </svg>

      <div className="msf-hud-status-strip">
        <span className="msf-hud-live-dot" />
        <span>RADAR 360° · COBERTURA 250M</span>
      </div>
    </div>
  );
}

function Step3SurveyAnimation() {
  return (
    <div className="msf-hud-wrap">
      <svg viewBox="0 0 200 200" className="msf-hud-svg">
        <defs>
          <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Blueprint outer frame */}
        <rect x="24" y="24" width="152" height="152" rx="14" className="msf-bp-frame" />

        {/* Blueprint Grid Lines */}
        <line x1="30" y1="65" x2="170" y2="65" className="msf-bp-grid" />
        <line x1="30" y1="100" x2="170" y2="100" className="msf-bp-grid" />
        <line x1="30" y1="135" x2="170" y2="135" className="msf-bp-grid" />
        <line x1="65" y1="30" x2="65" y2="170" className="msf-bp-grid" />
        <line x1="100" y1="30" x2="100" y2="170" className="msf-bp-grid" />
        <line x1="135" y1="30" x2="135" y2="170" className="msf-bp-grid" />

        {/* Isometric Facility Footprint */}
        <polygon points="100,52 144,78 100,104 56,78" className="msf-iso-top" />
        <polygon points="56,78 100,104 100,146 56,120" className="msf-iso-left" />
        <polygon points="144,78 100,104 100,146 144,120" className="msf-iso-right" />

        {/* Laser Scanning Line */}
        <line x1="28" y1="78" x2="172" y2="78" className="msf-bp-laser" />

        {/* Field Engineer Survey Pin with Ring */}
        <g className="msf-bp-pin">
          <circle cx="100" cy="78" r="14" className="msf-pin-ripple" />
          <circle cx="100" cy="78" r="5" className="msf-pin-dot" />
        </g>

        {/* Corner GPS Coordinates */}
        <text x="32" y="38" className="msf-bp-txt">LAT 19.4326° N</text>
        <text x="32" y="47" className="msf-bp-txt">LON 99.1332° W</text>
        <text x="132" y="38" className="msf-bp-txt">SLA: &lt; 2h</text>
      </svg>

      <div className="msf-hud-status-strip">
        <span className="msf-hud-live-dot" />
        <span>LEVANTAMIENTO EN SITIO · DISPONIBLE</span>
      </div>
    </div>
  );
}

function SuccessCelebrationAnimation() {
  return (
    <div className="msf-hud-wrap msf-success-hud-wrap">
      <svg viewBox="0 0 160 160" className="msf-success-svg">
        <circle cx="80" cy="80" r="70" className="msf-succ-wave-1" />
        <circle cx="80" cy="80" r="58" className="msf-succ-wave-2" />
        <circle cx="80" cy="80" r="46" className="msf-succ-circle" />
        <path d="M 58 80 L 73 95 L 105 63" className="msf-succ-checkmark" />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------------------
   FORM CONFIGURATION
   -------------------------------------------------------------------------- */

const SOLUTIONS = [
  {
    id: 'cctv',
    title: 'CCTV & Cámaras IA',
    desc: 'Cobertura por áreas, analítica inteligente y visión 4K',
    icon: Camera,
  },
  {
    id: 'access',
    title: 'Control de Acceso & Videoporteros',
    desc: 'Biometría peatonal, vehicular y videoporteros IP',
    icon: KeyRound,
  },
  {
    id: 'perimeter',
    title: 'Cercas Eléctricas',
    desc: 'Metros lineales disuasivos y energizador inteligente',
    icon: ShieldAlert,
  },
  {
    id: 'cabling',
    title: 'Cableado Estructurado',
    desc: 'Site, racks certificados, perifoneo y voz/datos',
    icon: Network,
  },
  {
    id: 'mesh',
    title: 'Red Mesh & Wi-Fi',
    desc: 'Cobertura de alta densidad y roaming sin cortes',
    icon: Radio,
  },
  {
    id: 'gps',
    title: 'GPS & Telemetría Vehicular',
    desc: 'Rastreo satelital para camiones, trailers y autos',
    icon: Navigation,
  },
  {
    id: 'led',
    title: 'Pantallas LED Publicitarias',
    desc: 'Módulos LED de alto brillo interior y exterior',
    icon: Monitor,
  },
  {
    id: 'alarms',
    title: 'Alarmas & Central C4 24/7',
    desc: 'Monitoreo ininterrumpido y respuesta en sitio',
    icon: BellRing,
  },
];

const SECTORS = [
  { id: 'industrial', label: 'Parque Industrial / CEDIS', icon: '🏭' },
  { id: 'corporate', label: 'Edificio Corporativo / Oficinas', icon: '🏢' },
  { id: 'residential', label: 'Privada / Fraccionamiento', icon: '🏡' },
  { id: 'retail', label: 'Comercio / Cadena Retail', icon: '🛍️' },
];

const CCTV_AREA_OPTIONS = [
  'Almacén',
  'Pasillo',
  'Entrada',
  'Escaleras',
  'Exterior',
  'Interior',
  'Bodega',
  'Lobby',
  'Elevadores',
  'Casa o Departamento'
];

const URGENCIES = [
  '⚡ Inmediata (< 1 semana)',
  '📅 En este mes',
  '📊 Planificación / Licitación',
];

export default function MultiStepQuoteForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [folio, setFolio] = useState('');
  const [copied, setCopied] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState('');

  // Selected Solutions in Step 1
  const [selectedSolutions, setSelectedSolutions] = useState(['cctv']);

  // Active solution tab in Step 2 if multiple selected
  const [activeSubSection, setActiveSubSection] = useState('all');

  // Subsección 1: Cámaras (CCTV) - Áreas a cubrir
  const [cctvAreas, setCctvAreas] = useState(['Entrada', 'Exterior', 'Lobby']);

  // Subsección 2: Cableado estructurado
  const [cablingHasSite, setCablingHasSite] = useState('si'); // 'si' | 'no'
  const [cablingSystems, setCablingSystems] = useState(['CCTV', 'Antenas de Internet']);
  const [cablingShowOther, setCablingShowOther] = useState(false);
  const [cablingOtherText, setCablingOtherText] = useState('');

  // Subsección 3: Cercas eléctricas
  const [fenceMeters, setFenceMeters] = useState(60);
  const [fenceBase, setFenceBase] = useState('Muro');
  const [fenceShowOther, setFenceShowOther] = useState(false);
  const [fenceBaseOther, setFenceBaseOther] = useState('');

  // Subsección 4: GPS Vehicular
  const [gpsVehicleTypes, setGpsVehicleTypes] = useState(['Camión']);
  const [gpsVehicleCount, setGpsVehicleCount] = useState('5 a 10');
  const [gpsEnergyType, setGpsEnergyType] = useState('Combustible');

  // Subsección 5: Red Mesh
  const [meshDevicesCount, setMeshDevicesCount] = useState(25);
  const [meshAreasCount, setMeshAreasCount] = useState('4 a 10');

  // Subsección 6: Control de Acceso
  const [intercomType, setIntercomType] = useState('Multiapartamental');
  const [personalAccessMethods, setPersonalAccessMethods] = useState(['Biométricos', 'Sin tacto']);
  const [vehicularAudience, setVehicularAudience] = useState('Ambos');
  const [vehicularBarrier, setVehicularBarrier] = useState('Pluma');
  const [vehicularSensor, setVehicularSensor] = useState('Identificación de placa');

  // Subsección 7: Pantallas LED
  const [ledEnvironment, setLedEnvironment] = useState('Exterior');
  const [ledViewDistance, setLedViewDistance] = useState(25);

  // Subsección 8: Alarmas C4
  const [alarmZones, setAlarmZones] = useState('Ambos');
  const [alarmMonitoring, setAlarmMonitoring] = useState('Monitoreo Cuauhtli C4 24/7');

  // General parameters
  const [sector, setSector] = useState('industrial');
  const [urgency, setUrgency] = useState('⚡ Inmediata (< 1 semana)');
  const [location, setLocation] = useState('CDMX / Valle de México');

  // Contact Info
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    notes: '',
    needsSiteSurvey: true,
  });

  const [errors, setErrors] = useState({});

  const toggleSolution = (id) => {
    setSelectedSolutions((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  // Toggle helpers for subsections
  const toggleCctvArea = (area) => {
    setCctvAreas((prev) => 
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleCablingSystem = (sys) => {
    setCablingSystems((prev) => 
      prev.includes(sys) ? prev.filter((s) => s !== sys) : [...prev, sys]
    );
  };

  const toggleGpsVehicleType = (vt) => {
    setGpsVehicleTypes((prev) => 
      prev.includes(vt) ? (prev.length > 1 ? prev.filter((v) => v !== vt) : prev) : [...prev, vt]
    );
  };

  const togglePersonalAccess = (m) => {
    setPersonalAccessMethods((prev) => 
      prev.includes(m) ? (prev.length > 1 ? prev.filter((item) => item !== m) : prev) : [...prev, m]
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Ingresa tu nombre';
    if (!formData.phone.trim() || formData.phone.length < 8) errs.phone = 'Ingresa un teléfono válido';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Ingresa un correo corporativo';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && selectedSolutions.length === 0) return;
    if (step === 3) {
      if (!validateStep3()) return;
      handleSubmit();
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const generateSummaryText = () => {
    const lines = [];
    const secName = SECTORS.find((s) => s.id === sector)?.label || sector;
    lines.push(`🏢 Inmueble: ${secName}`);
    lines.push(`📍 Ubicación: ${location} | ⏱️ Urgencia: ${urgency}`);
    
    if (selectedSolutions.includes('cctv')) {
      lines.push(`📹 Cámaras (CCTV): Áreas: ${cctvAreas.join(', ') || 'Ninguna especificada'}`);
    }
    if (selectedSolutions.includes('cabling')) {
      const otherPart = cablingShowOther && cablingOtherText ? `, Otra: ${cablingOtherText}` : '';
      lines.push(`🔌 Cableado Estructurado: Site: ${cablingHasSite === 'si' ? 'Sí cuenta' : 'No cuenta'} | Sistemas: ${cablingSystems.join(', ')}${otherPart}`);
    }
    if (selectedSolutions.includes('perimeter')) {
      const basePart = fenceBase === 'Otro' && fenceBaseOther ? `Base: ${fenceBaseOther}` : `Base: ${fenceBase}`;
      lines.push(`⚡ Cercas Eléctricas: ${fenceMeters}m lineales sobre ${basePart}`);
    }
    if (selectedSolutions.includes('gps')) {
      lines.push(`🛰️ GPS Vehicular: ${gpsVehicleTypes.join(', ')} (${gpsVehicleCount} vehículos, Energía: ${gpsEnergyType})`);
    }
    if (selectedSolutions.includes('mesh')) {
      lines.push(`📶 Red Mesh: ${meshDevicesCount} equipos a conectar en ${meshAreasCount} áreas`);
    }
    if (selectedSolutions.includes('access')) {
      lines.push(`🔑 Control de Acceso: Videoportero: ${intercomType} | Personal: ${personalAccessMethods.join(', ')} | Vehicular: Para ${vehicularAudience} (${vehicularBarrier}, Sensor: ${vehicularSensor})`);
    }
    if (selectedSolutions.includes('led')) {
      lines.push(`📺 Pantallas LED: ${ledEnvironment} (Distancia visual: ${ledViewDistance}m)`);
    }
    if (selectedSolutions.includes('alarms')) {
      lines.push(`🚨 Alarmas C4: Zonas: ${alarmZones} | Esquema: ${alarmMonitoring}`);
    }
    return lines.join('\n');
  };

  const handleSubmit = () => {
    // Generate clean folio
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newFolio = `CUAUHTLI-2025-${randomNum}`;
    setFolio(newFolio);

    const summary = generateSummaryText();
    const fullMsg = encodeURIComponent(
      `Hola Sistemas Cuauhtli! 👋 Solicito propuesta técnica y levantamiento en sitio:\n` +
      `📋 Folio: ${newFolio}\n\n` +
      `${summary}\n\n` +
      `👤 Contacto: ${formData.name}\n` +
      `🏢 Empresa / Privada: ${formData.company || 'No especificada'}\n` +
      `📞 Teléfono: ${formData.phone}\n` +
      `📧 Correo: ${formData.email}\n` +
      `📍 Levantamiento físico: ${formData.needsSiteSurvey ? 'Sí solicitado (Sin costo)' : 'No necesario'}`
    );
    setWhatsappMsg(fullMsg);
    setSubmitted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A6192E', '#2B5672', '#10B981', '#FFFFFF'],
      });
    } catch {
      // fallback
    }
  };

  const handleCopyFolio = () => {
    if (folio) {
      navigator.clipboard?.writeText(folio);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="cotizador" className="msf-section" aria-labelledby="msf-title">
      <div className="msf-container">
        
        {/* SECTION HEADER (EDITORIAL & MINIMALIST) */}
        <div className="msf-header">
          <div className="msf-eyebrow">
            <Sparkles size={12} className="msf-eyebrow-icon" />
            <span>Diagnóstico & Levantamiento en 3 Pasos</span>
          </div>

          <h2 id="msf-title" className="msf-heading">
            Configura tu proyecto de seguridad{' '}
            <em>en menos de 2 minutos.</em>
          </h2>

          <p className="msf-sub">
            Levantamiento técnico sin costo en CDMX y principales corredores industriales. Selecciona tus necesidades y recibe una propuesta con memoria técnica.
          </p>
        </div>

        {/* MAIN MULTI-STEP CARD */}
        <div className="msf-card">
          
          {!submitted ? (
            <>
              {/* TOP STEPPER PROGRESS BAR */}
              <div className="msf-stepper">
                <div className={`msf-step-item ${step >= 1 ? 'is-active' : ''} ${step > 1 ? 'is-completed' : ''}`}>
                  <div className="msf-step-circle">
                    {step > 1 ? <Check size={12} strokeWidth={3} /> : '1'}
                  </div>
                  <span className="msf-step-name">Soluciones</span>
                </div>

                <div className={`msf-step-track ${step >= 2 ? 'is-filled' : ''}`} />

                <div className={`msf-step-item ${step >= 2 ? 'is-active' : ''} ${step > 2 ? 'is-completed' : ''}`}>
                  <div className="msf-step-circle">
                    {step > 2 ? <Check size={12} strokeWidth={3} /> : '2'}
                  </div>
                  <span className="msf-step-name">Dimensiones</span>
                </div>

                <div className={`msf-step-track ${step >= 3 ? 'is-filled' : ''}`} />

                <div className={`msf-step-item ${step >= 3 ? 'is-active' : ''}`}>
                  <div className="msf-step-circle">
                    3
                  </div>
                  <span className="msf-step-name">Agenda & Contacto</span>
                </div>
              </div>

              {/* CARD SPLIT CONTENT (VISUAL ANIMATION SIDEBAR + FORM CONTROLS) */}
              <div className="msf-split">
                
                {/* LEFT INTERACTIVE ANIMATION SHOWCASE */}
                <div className="msf-visual-col">
                  <div className="msf-lottie-wrap">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`hud-step-${step}`}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.28 }}
                        className="msf-hud-motion-box"
                      >
                        {step === 1 && <Step1ShieldAnimation />}
                        {step === 2 && <Step2RadarAnimation />}
                        {step === 3 && <Step3SurveyAnimation />}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="msf-visual-info">
                    {step === 1 && (
                      <>
                        <h4 className="msf-vinfo-title">Tecnología Homologada</h4>
                        <p className="msf-vinfo-desc">
                          Equipamiento de grado industrial con analítica de Inteligencia Artificial para evitar falsas alarmas.
                        </p>
                        <div className="msf-vinfo-badge">
                          <ShieldCheck size={13} />
                          <span>Garantía vitalicia en mano de obra</span>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <h4 className="msf-vinfo-title">Ingeniería a la Medida</h4>
                        <p className="msf-vinfo-desc">
                          Calculamos ancho de banda, almacenamiento y cobertura angular en planos para cero puntos ciegos.
                        </p>
                        <div className="msf-vinfo-badge">
                          <Clock size={13} />
                          <span>SLA de atención en menos de 2 horas</span>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <h4 className="msf-vinfo-title">Diagnóstico en Sitio Sin Costo</h4>
                        <p className="msf-vinfo-desc">
                          Un ingeniero de campo acudirá a tu instalación con equipo de prueba para validar canalizaciones y ángulos.
                        </p>
                        <div className="msf-vinfo-badge">
                          <CheckCircle2 size={13} />
                          <span>Memoria técnica y cotización formal</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* RIGHT FORM INTERACTION AREA */}
                <div className="msf-form-col">
                  <AnimatePresence mode="wait">
                    
                    {/* STEP 1: SOLUCIONES */}
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.22 }}
                        className="msf-step-content"
                      >
                        <div className="msf-prompt">
                          <h3>¿Qué sistemas requieres integrar o modernizar?</h3>
                          <p>Puedes seleccionar una o varias soluciones para tu instalación:</p>
                        </div>

                        <div className="msf-solutions-grid">
                          {SOLUTIONS.map((sol) => {
                            const isChecked = selectedSolutions.includes(sol.id);
                            const IconComponent = sol.icon;

                            return (
                              <button
                                key={sol.id}
                                type="button"
                                className={`msf-sol-card ${isChecked ? 'is-selected' : ''}`}
                                onClick={() => toggleSolution(sol.id)}
                              >
                                <div className="msf-sol-icon">
                                  <IconComponent size={18} />
                                </div>
                                <div className="msf-sol-body">
                                  <strong>{sol.title}</strong>
                                  <span>{sol.desc}</span>
                                </div>
                                <div className={`msf-checkbox ${isChecked ? 'is-checked' : ''}`}>
                                  {isChecked && <Check size={11} strokeWidth={3} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: DIMENSIONES & ALCANCE POR SOLUCIÓN */}
                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.22 }}
                        className="msf-step-content"
                      >
                        <div className="msf-prompt">
                          <h3>Alcance y configuración por solución</h3>
                          <p>Define las especificaciones técnicas para cada área de tu proyecto:</p>
                        </div>

                        {/* Tipo de Inmueble */}
                        <div className="msf-field-group">
                          <label className="msf-group-label">Tipo de inmueble / predio:</label>
                          <div className="msf-pills-row">
                            {SECTORS.map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                className={`msf-pill ${sector === s.id ? 'is-active' : ''}`}
                                onClick={() => setSector(s.id)}
                              >
                                <span>{s.icon}</span>
                                <span>{s.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Soluciones Switcher (if multiple selected) */}
                        {selectedSolutions.length > 1 && (
                          <div className="msf-solutions-switcher">
                            <span className="msf-switcher-label">Filtrar sección a configurar:</span>
                            <div className="msf-switcher-pills">
                              <button
                                type="button"
                                className={`msf-sub-tab-btn ${activeSubSection === 'all' ? 'is-active' : ''}`}
                                onClick={() => setActiveSubSection('all')}
                              >
                                Ver Todas ({selectedSolutions.length})
                              </button>
                              {selectedSolutions.map((solId) => {
                                const solObj = SOLUTIONS.find((s) => s.id === solId);
                                if (!solObj) return null;
                                const Icon = solObj.icon;
                                return (
                                  <button
                                    key={solId}
                                    type="button"
                                    className={`msf-sub-tab-btn ${activeSubSection === solId ? 'is-active' : ''}`}
                                    onClick={() => setActiveSubSection(solId)}
                                  >
                                    <Icon size={12} />
                                    <span>{solObj.title.split('&')[0].trim()}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* ---------------- 1. SUBSECCIÓN CÁMARAS (CCTV) ---------------- */}
                        {(activeSubSection === 'all' || activeSubSection === 'cctv') && selectedSolutions.includes('cctv') && (
                          <div className="msf-sub-panel">
                            <div className="msf-sub-head">
                              <div className="msf-sub-title-wrap">
                                <Camera size={16} className="msf-sub-icon" />
                                <h4>Cámaras & Circuito Cerrado (CCTV)</h4>
                              </div>
                              <span className="msf-sub-badge">{cctvAreas.length} áreas seleccionadas</span>
                            </div>
                            <p className="msf-sub-desc">
                              Selecciona las áreas que requieres cubrir (haz clic para agregar o eliminar):
                            </p>

                            <div className="msf-chips-grid">
                              {CCTV_AREA_OPTIONS.map((area) => {
                                const isSelected = cctvAreas.includes(area);
                                return (
                                  <button
                                    key={area}
                                    type="button"
                                    className={`msf-chip-btn ${isSelected ? 'is-selected' : ''}`}
                                    onClick={() => toggleCctvArea(area)}
                                    title={isSelected ? 'Clic para eliminar área' : 'Clic para agregar área'}
                                  >
                                    <span>{area}</span>
                                    <span className="msf-chip-state">
                                      {isSelected ? <X size={11} strokeWidth={2.5} /> : <Plus size={11} strokeWidth={2.5} />}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* ---------------- 2. SUBSECCIÓN CABLEADO ESTRUCTURADO ---------------- */}
                        {(activeSubSection === 'all' || activeSubSection === 'cabling') && selectedSolutions.includes('cabling') && (
                          <div className="msf-sub-panel">
                            <div className="msf-sub-head">
                              <div className="msf-sub-title-wrap">
                                <Network size={16} className="msf-sub-icon" />
                                <h4>Cableado Estructurado & Site</h4>
                              </div>
                            </div>

                            <div className="msf-field-group">
                              <label className="msf-group-label">¿Cuentan con site estructurado?</label>
                              <div className="msf-pills-row">
                                <button
                                  type="button"
                                  className={`msf-pill ${cablingHasSite === 'si' ? 'is-active' : ''}`}
                                  onClick={() => setCablingHasSite('si')}
                                >
                                  ✅ Sí, contamos con Site estructurado
                                </button>
                                <button
                                  type="button"
                                  className={`msf-pill ${cablingHasSite === 'no' ? 'is-active' : ''}`}
                                  onClick={() => setCablingHasSite('no')}
                                >
                                  ❌ No contamos con Site (requiere instalación)
                                </button>
                              </div>
                            </div>

                            <div className="msf-field-group" style={{ marginBottom: 0 }}>
                              <label className="msf-group-label">¿Qué tipo de sistemas tienen o requieren enlazar?</label>
                              <div className="msf-pills-row">
                                {['CCTV', 'Antenas de Internet', 'Perifoneo', 'Contra incendios'].map((sys) => {
                                  const isSelected = cablingSystems.includes(sys);
                                  return (
                                    <button
                                      key={sys}
                                      type="button"
                                      className={`msf-pill ${isSelected ? 'is-active' : ''}`}
                                      onClick={() => toggleCablingSystem(sys)}
                                    >
                                      {isSelected && <Check size={12} strokeWidth={3} />}
                                      <span>{sys}</span>
                                    </button>
                                  );
                                })}
                                <button
                                  type="button"
                                  className={`msf-pill ${cablingShowOther ? 'is-active' : ''}`}
                                  onClick={() => setCablingShowOther(!cablingShowOther)}
                                >
                                  <span>+ Otra</span>
                                </button>
                              </div>
                              {cablingShowOther && (
                                <div className="msf-other-input-wrap">
                                  <input
                                    type="text"
                                    placeholder="Escribe el otro sistema (ej. Telefonía IP, Control de Acceso)..."
                                    value={cablingOtherText}
                                    onChange={(e) => setCablingOtherText(e.target.value)}
                                    className="msf-inline-text-input"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ---------------- 3. SUBSECCIÓN CERCAS ELÉCTRICAS ---------------- */}
                        {(activeSubSection === 'all' || activeSubSection === 'perimeter') && selectedSolutions.includes('perimeter') && (
                          <div className="msf-sub-panel">
                            <div className="msf-sub-head">
                              <div className="msf-sub-title-wrap">
                                <ShieldAlert size={16} className="msf-sub-icon" />
                                <h4>Cercas Eléctricas & Perímetro</h4>
                              </div>
                              <span className="msf-sub-badge">{fenceMeters} Metros Lineales</span>
                            </div>

                            <div className="msf-field-group">
                              <div className="msf-slider-header">
                                <label className="msf-group-label">Metros lineales a proteger (Interactivo):</label>
                                <span className="msf-slider-val">{fenceMeters} m</span>
                              </div>
                              <input
                                type="range"
                                min={10}
                                max={500}
                                step={5}
                                value={fenceMeters}
                                onChange={(e) => setFenceMeters(Number(e.target.value))}
                                className="msf-range-bar"
                              />
                              <div className="msf-slider-presets">
                                {[25, 50, 100, 200, 350, 500].map((m) => (
                                  <button
                                    key={m}
                                    type="button"
                                    className={`msf-preset-btn ${fenceMeters === m ? 'is-active' : ''}`}
                                    onClick={() => setFenceMeters(m)}
                                  >
                                    {m}m
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="msf-field-group" style={{ marginBottom: 0 }}>
                              <label className="msf-group-label">Tipo de base en que quieres colocar:</label>
                              <div className="msf-pills-row">
                                {['Muro', 'Tejado', 'Cerco'].map((b) => (
                                  <button
                                    key={b}
                                    type="button"
                                    className={`msf-pill ${fenceBase === b ? 'is-active' : ''}`}
                                    onClick={() => { setFenceBase(b); setFenceShowOther(false); }}
                                  >
                                    {b}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  className={`msf-pill ${fenceBase === 'Otro' ? 'is-active' : ''}`}
                                  onClick={() => { setFenceBase('Otro'); setFenceShowOther(true); }}
                                >
                                  + Otro
                                </button>
                              </div>
                              {fenceShowOther && (
                                <div className="msf-other-input-wrap">
                                  <input
                                    type="text"
                                    placeholder="Especifique el tipo de base (ej. Barda perimetral tubular, reja de herrería)..."
                                    value={fenceBaseOther}
                                    onChange={(e) => setFenceBaseOther(e.target.value)}
                                    className="msf-inline-text-input"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ---------------- 4. SUBSECCIÓN GPS VEHICULAR ---------------- */}
                        {(activeSubSection === 'all' || activeSubSection === 'gps') && selectedSolutions.includes('gps') && (
                          <div className="msf-sub-panel">
                            <div className="msf-sub-head">
                              <div className="msf-sub-title-wrap">
                                <Navigation size={16} className="msf-sub-icon" />
                                <h4>GPS & Rastreo Satelital</h4>
                              </div>
                            </div>

                            <div className="msf-field-group">
                              <label className="msf-group-label">Tipo de vehículo:</label>
                              <div className="msf-pills-row">
                                {['Camión', 'Trailer', 'Camioneta', 'Auto'].map((vt) => {
                                  const isSelected = gpsVehicleTypes.includes(vt);
                                  return (
                                    <button
                                      key={vt}
                                      type="button"
                                      className={`msf-pill ${isSelected ? 'is-active' : ''}`}
                                      onClick={() => toggleGpsVehicleType(vt)}
                                    >
                                      {isSelected && <Check size={12} strokeWidth={3} />}
                                      <span>{vt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="msf-field-group">
                              <label className="msf-group-label">¿Cuántos vehículos requieren equipar?</label>
                              <div className="msf-pills-row">
                                {['1 a 5', '5 a 10', '10 a 20', '+ de 20'].map((vc) => (
                                  <button
                                    key={vc}
                                    type="button"
                                    className={`msf-pill ${gpsVehicleCount === vc ? 'is-active' : ''}`}
                                    onClick={() => setGpsVehicleCount(vc)}
                                  >
                                    {vc} vehículos
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="msf-field-group" style={{ marginBottom: 0 }}>
                              <label className="msf-group-label">Tipo de energía / motorización:</label>
                              <div className="msf-pills-row">
                                {['Combustible', 'Eléctrico', 'Híbrido'].map((energy) => (
                                  <button
                                    key={energy}
                                    type="button"
                                    className={`msf-pill ${gpsEnergyType === energy ? 'is-active' : ''}`}
                                    onClick={() => setGpsEnergyType(energy)}
                                  >
                                    {energy === 'Combustible' && '⛽ '}
                                    {energy === 'Eléctrico' && '⚡ '}
                                    {energy === 'Híbrido' && '🔋 '}
                                    <span>{energy}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ---------------- 5. SUBSECCIÓN RED MESH ---------------- */}
                        {(activeSubSection === 'all' || activeSubSection === 'mesh') && selectedSolutions.includes('mesh') && (
                          <div className="msf-sub-panel">
                            <div className="msf-sub-head">
                              <div className="msf-sub-title-wrap">
                                <Radio size={16} className="msf-sub-icon" />
                                <h4>Red Mesh & Cobertura Wi-Fi</h4>
                              </div>
                              <span className="msf-sub-badge">{meshDevicesCount} equipos</span>
                            </div>

                            <div className="msf-field-group">
                              <div className="msf-slider-header">
                                <label className="msf-group-label">¿Cuántos equipos necesitas conectar? (Línea de tiempo):</label>
                                <span className="msf-slider-val">{meshDevicesCount} dispositivos</span>
                              </div>
                              <input
                                type="range"
                                min={5}
                                max={150}
                                step={5}
                                value={meshDevicesCount}
                                onChange={(e) => setMeshDevicesCount(Number(e.target.value))}
                                className="msf-range-bar"
                              />
                              <div className="msf-slider-presets">
                                {[10, 25, 50, 100, 150].map((num) => (
                                  <button
                                    key={num}
                                    type="button"
                                    className={`msf-preset-btn ${meshDevicesCount === num ? 'is-active' : ''}`}
                                    onClick={() => setMeshDevicesCount(num)}
                                  >
                                    {num} equipos
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="msf-field-group" style={{ marginBottom: 0 }}>
                              <label className="msf-group-label">¿Cuántas áreas necesitas cubrir?</label>
                              <div className="msf-pills-row">
                                {['1 a 3', '4 a 10', '+ de 10'].map((a) => (
                                  <button
                                    key={a}
                                    type="button"
                                    className={`msf-pill ${meshAreasCount === a ? 'is-active' : ''}`}
                                    onClick={() => setMeshAreasCount(a)}
                                  >
                                    {a} áreas
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ---------------- 6. SUBSECCIÓN CONTROL DE ACCESO ---------------- */}
                        {(activeSubSection === 'all' || activeSubSection === 'access') && selectedSolutions.includes('access') && (
                          <div className="msf-sub-panel">
                            <div className="msf-sub-head">
                              <div className="msf-sub-title-wrap">
                                <KeyRound size={16} className="msf-sub-icon" />
                                <h4>Control de Acceso & Videoporteros</h4>
                              </div>
                            </div>

                            {/* A: Videoporteros */}
                            <div className="msf-field-group">
                              <label className="msf-group-label">Videoporteros:</label>
                              <div className="msf-pills-row">
                                {['Multiapartamental', 'Un-apartamental', 'No requerido'].map((v) => (
                                  <button
                                    key={v}
                                    type="button"
                                    className={`msf-pill ${intercomType === v ? 'is-active' : ''}`}
                                    onClick={() => setIntercomType(v)}
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* B: Controles de acceso personal */}
                            <div className="msf-field-group">
                              <label className="msf-group-label">Controles de acceso personal:</label>
                              <div className="msf-pills-row">
                                {['Biométricos', 'Tarjeta', 'Código', 'Sin tacto'].map((m) => {
                                  const isSelected = personalAccessMethods.includes(m);
                                  return (
                                    <button
                                      key={m}
                                      type="button"
                                      className={`msf-pill ${isSelected ? 'is-active' : ''}`}
                                      onClick={() => togglePersonalAccess(m)}
                                    >
                                      {isSelected && <Check size={12} strokeWidth={3} />}
                                      <span>{m}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* C: Control de acceso vehicular */}
                            <div className="msf-field-group msf-vehicular-group" style={{ marginBottom: 0 }}>
                              <label className="msf-group-label" style={{ marginBottom: 4 }}>Control de acceso vehicular:</label>
                              
                              <div className="msf-subgroup-row">
                                <span className="msf-sublabel">Destinado para:</span>
                                <div className="msf-pills-row">
                                  {['Visitantes', 'Residentes', 'Ambos'].map((dest) => (
                                    <button
                                      key={dest}
                                      type="button"
                                      className={`msf-pill ${vehicularAudience === dest ? 'is-active' : ''}`}
                                      onClick={() => setVehicularAudience(dest)}
                                    >
                                      {dest}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="msf-subgroup-row">
                                <span className="msf-sublabel">Mecanismo de barrera:</span>
                                <div className="msf-pills-row">
                                  {['Pluma', 'Cadena', 'Brazos'].map((mech) => (
                                    <button
                                      key={mech}
                                      type="button"
                                      className={`msf-pill ${vehicularBarrier === mech ? 'is-active' : ''}`}
                                      onClick={() => setVehicularBarrier(mech)}
                                    >
                                      {mech}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="msf-subgroup-row">
                                <span className="msf-sublabel">Sensor / Validación de paso:</span>
                                <div className="msf-pills-row">
                                  {['Sensor', 'Identificación de placa', 'Tarjeta', 'Boletos', 'Varias'].map((sens) => (
                                    <button
                                      key={sens}
                                      type="button"
                                      className={`msf-pill ${vehicularSensor === sens ? 'is-active' : ''}`}
                                      onClick={() => setVehicularSensor(sens)}
                                    >
                                      {sens}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ---------------- 7. SUBSECCIÓN PANTALLAS LED ---------------- */}
                        {(activeSubSection === 'all' || activeSubSection === 'led') && selectedSolutions.includes('led') && (
                          <div className="msf-sub-panel">
                            <div className="msf-sub-head">
                              <div className="msf-sub-title-wrap">
                                <Monitor size={16} className="msf-sub-icon" />
                                <h4>Pantallas LED Publicitarias & Video</h4>
                              </div>
                              <span className="msf-sub-badge">{ledViewDistance}m distancia</span>
                            </div>

                            <div className="msf-field-group">
                              <label className="msf-group-label">Entorno de instalación:</label>
                              <div className="msf-pills-row">
                                {['Exterior', 'Interior'].map((env) => (
                                  <button
                                    key={env}
                                    type="button"
                                    className={`msf-pill ${ledEnvironment === env ? 'is-active' : ''}`}
                                    onClick={() => setLedEnvironment(env)}
                                  >
                                    {env === 'Exterior' ? '☀️ Exterior (Outdoor)' : '🏢 Interior (Indoor)'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="msf-field-group" style={{ marginBottom: 0 }}>
                              <div className="msf-slider-header">
                                <label className="msf-group-label">¿A cuánta distancia te interesa que se vea? (Barrita interactiva):</label>
                                <span className="msf-slider-val">{ledViewDistance} metros</span>
                              </div>
                              <input
                                type="range"
                                min={2}
                                max={100}
                                step={2}
                                value={ledViewDistance}
                                onChange={(e) => setLedViewDistance(Number(e.target.value))}
                                className="msf-range-bar"
                              />
                              <div className="msf-slider-presets">
                                {[5, 15, 30, 50, 100].map((d) => (
                                  <button
                                    key={d}
                                    type="button"
                                    className={`msf-preset-btn ${ledViewDistance === d ? 'is-active' : ''}`}
                                    onClick={() => setLedViewDistance(d)}
                                  >
                                    {d}m
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ---------------- 8. SUBSECCIÓN ALARMAS C4 ---------------- */}
                        {(activeSubSection === 'all' || activeSubSection === 'alarms') && selectedSolutions.includes('alarms') && (
                          <div className="msf-sub-panel">
                            <div className="msf-sub-head">
                              <div className="msf-sub-title-wrap">
                                <BellRing size={16} className="msf-sub-icon" />
                                <h4>Alarmas & Central de Monitoreo C4</h4>
                              </div>
                            </div>

                            <div className="msf-field-group">
                              <label className="msf-group-label">Zonas a proteger:</label>
                              <div className="msf-pills-row">
                                {['Interior', 'Perimetral exterior', 'Ambos'].map((z) => (
                                  <button
                                    key={z}
                                    type="button"
                                    className={`msf-pill ${alarmZones === z ? 'is-active' : ''}`}
                                    onClick={() => setAlarmZones(z)}
                                  >
                                    {z}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="msf-field-group" style={{ marginBottom: 0 }}>
                              <label className="msf-group-label">Tipo de enlace y monitoreo:</label>
                              <div className="msf-pills-row">
                                {['Monitoreo Cuauhtli C4 24/7', 'Auto-monitoreo App Móvil'].map((mon) => (
                                  <button
                                    key={mon}
                                    type="button"
                                    className={`msf-pill ${alarmMonitoring === mon ? 'is-active' : ''}`}
                                    onClick={() => setAlarmMonitoring(mon)}
                                  >
                                    {mon}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Urgencia y Zona */}
                        <div className="msf-inline-fields" style={{ marginTop: '16px' }}>
                          <div className="msf-field-group">
                            <label className="msf-group-label">Urgencia requerida:</label>
                            <select
                              className="msf-select"
                              value={urgency}
                              onChange={(e) => setUrgency(e.target.value)}
                            >
                              {URGENCIES.map((u) => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          </div>

                          <div className="msf-field-group">
                            <label className="msf-group-label">Ubicación aproximada:</label>
                            <select
                              className="msf-select"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            >
                              <option value="CDMX / Valle de México">CDMX / Valle de México</option>
                              <option value="Querétaro / Bajío">Querétaro / Bajío</option>
                              <option value="Monterrey / Norte">Monterrey / Norte</option>
                              <option value="Guadalajara / Occidente">Guadalajara / Occidente</option>
                              <option value="Puebla / Altiplano">Puebla / Altiplano</option>
                              <option value="Otro Estado">Otro Estado de la República</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: CONTACTO & AGENDA */}
                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.22 }}
                        className="msf-step-content"
                      >
                        <div className="msf-prompt">
                          <h3>¿A dónde enviamos la propuesta y planos?</h3>
                          <p>Un ingeniero certificado coordinará el diagnóstico en sitio:</p>
                        </div>

                        <div className="msf-inputs-grid">
                          <div className="msf-input-field">
                            <label htmlFor="msf-name">Nombre completo *</label>
                            <input
                              id="msf-name"
                              type="text"
                              name="name"
                              placeholder="Ej. Ing. Carlos Mendoza"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={errors.name ? 'has-error' : ''}
                            />
                            {errors.name && <span className="msf-err">{errors.name}</span>}
                          </div>

                          <div className="msf-input-field">
                            <label htmlFor="msf-company">Empresa o Privada</label>
                            <input
                              id="msf-company"
                              type="text"
                              name="company"
                              placeholder="Ej. Logística Continental / Fracc. Álamos"
                              value={formData.company}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="msf-input-field">
                            <label htmlFor="msf-phone">WhatsApp / Teléfono *</label>
                            <input
                              id="msf-phone"
                              type="tel"
                              name="phone"
                              placeholder="55 1234 5678"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={errors.phone ? 'has-error' : ''}
                            />
                            {errors.phone && <span className="msf-err">{errors.phone}</span>}
                          </div>

                          <div className="msf-input-field">
                            <label htmlFor="msf-email">Correo corporativo *</label>
                            <input
                              id="msf-email"
                              type="email"
                              name="email"
                              placeholder="carlos@empresa.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={errors.email ? 'has-error' : ''}
                            />
                            {errors.email && <span className="msf-err">{errors.email}</span>}
                          </div>
                        </div>

                        <div className="msf-check-option">
                          <label className="msf-checkbox-label">
                            <input
                              type="checkbox"
                              name="needsSiteSurvey"
                              checked={formData.needsSiteSurvey}
                              onChange={handleInputChange}
                            />
                            <span>Solicitar levantamiento físico en sitio (Sin costo en CDMX y Hubs)</span>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="msf-actions-bar">
                    {step > 1 ? (
                      <button
                        type="button"
                        className="msf-back-btn"
                        onClick={handlePrev}
                      >
                        <ArrowLeft size={14} />
                        <span>Atrás</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      className="msf-next-btn"
                      onClick={handleNext}
                    >
                      <span>{step === 3 ? 'Generar Propuesta y Agendar' : 'Continuar al siguiente paso'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* SUCCESS CONFIRMATION STATE WITH CELEBRATION HUD */
            <div className="msf-success-wrap">
              <div className="msf-success-lottie">
                <SuccessCelebrationAnimation />
              </div>

              <div className="msf-success-badge">
                <CheckCircle2 size={14} />
                <span>Solicitud Registrada con Éxito</span>
              </div>

              <h3 className="msf-success-title">
                ¡Gracias {formData.name || 'por tu interés'}! Hemos asignado tu folio de proyecto.
              </h3>

              <div className="msf-folio-card" onClick={handleCopyFolio} title="Clic para copiar folio">
                <span className="msf-folio-label">Folio Técnico Asignado:</span>
                <strong className="msf-folio-code">{folio}</strong>
                <button type="button" className="msf-folio-copy-btn">
                  <Copy size={13} />
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <p className="msf-success-desc">
                Un ingeniero especialista de Sistemas Cuauhtli se comunicará contigo vía WhatsApp o llamada en <strong>menos de 15 minutos</strong> para confirmar detalles técnicos y agendar el levantamiento en sitio.
              </p>

              <div className="msf-success-actions">
                <a
                  href={`https://wa.me/525585262115?text=${whatsappMsg || encodeURIComponent(`Hola Cuauhtli, registré mi proyecto con folio ${folio}. Me gustaría atención inmediata.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="msf-whatsapp-btn"
                >
                  <MessageSquare size={16} />
                  <span>Priorizar por WhatsApp directo</span>
                </a>

                <button
                  type="button"
                  className="msf-reset-form-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setFormData({ name: '', company: '', phone: '', email: '', notes: '', needsSiteSurvey: true });
                  }}
                >
                  Configurar otro proyecto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
