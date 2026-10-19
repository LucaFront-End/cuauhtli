import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Wrench,
  Cpu,
  Radio,
  Sparkles,
  Award,
  Activity,
  Layers,
  Check
} from 'lucide-react';
import './ServiceProcessTimeline.css';

/* -------------------------------------------------------------------------- */
/* Tailored turnkey deliverables & metadata for each solution                */
/* -------------------------------------------------------------------------- */
const PROCESS_METADATA = {
  cctv: [
    {
      phase: 'Fase 01 · Auditoría Óptica',
      duration: 'Día 1 · 24 Horas',
      icon: Search,
      kpi: '0% Puntos Ciegos',
      deliverables: [
        'Levantamiento 3D y análisis de sombras',
        'Cálculo de luxometría y deslumbramiento',
        'Plano preliminar de conos de visión'
      ],
      standard: 'NOM-001-SCFI / NDAA'
    },
    {
      phase: 'Fase 02 · Infraestructura',
      duration: 'Día 2 - 3',
      icon: Layers,
      kpi: '100% Cobre Puro Cat6',
      deliverables: [
        'Tubería conduit pared gruesa galvanizada',
        'Supresores de picos grado atmosférico',
        'Etiquetado bajo norma TIA/EIA-606'
      ],
      standard: 'TIA/EIA-568-C.2'
    },
    {
      phase: 'Fase 03 · Montaje & Enfoque',
      duration: 'Día 4',
      icon: Wrench,
      kpi: 'Grado IK10 / IP67',
      deliverables: [
        'Fijación antivandálica con sellado hermético',
        'Arreglo RAID redundante en NVR central',
        'Calibración de lentes varifocales 4K'
      ],
      standard: 'Prueba de Hermeticidad IP67'
    },
    {
      phase: 'Fase 04 · Despliegue & C4',
      duration: 'Día 5 · Entrega',
      icon: ShieldCheck,
      kpi: 'Respuesta < 0.3s',
      deliverables: [
        'Reglas de cruce de línea y merodeo IA',
        'Enlace seguro a Central de Monitoreo C4',
        'Póliza de garantía vitalicia firmada'
      ],
      standard: 'Protocolo de Alta C4 Cuauhtli'
    }
  ],

  'control-acceso': [
    {
      phase: 'Fase 01 · Análisis de Flujo',
      duration: 'Día 1 · 24 Horas',
      icon: Search,
      kpi: 'Cero Cuellos de Botella',
      deliverables: [
        'Simulación de aforo en horarios pico',
        'Mapeo de rutas de evacuación y emergencia',
        'Definición de carriles peatonales y TAG'
      ],
      standard: 'Protección Civil / STPS'
    },
    {
      phase: 'Fase 02 · Obra Civil & Anclaje',
      duration: 'Día 2 - 3',
      icon: Layers,
      kpi: 'Anclaje Químico Antisísmico',
      deliverables: [
        'Fijación con resina química Hilti en piso',
        'Canalización subterránea oculta de control',
        'Nivelación milimétrica de speed gates'
      ],
      standard: 'Grado Industrial Acero SUS304'
    },
    {
      phase: 'Fase 03 · Electrónica & OSDP',
      duration: 'Día 4',
      icon: Cpu,
      kpi: 'Cifrado AES-128',
      deliverables: [
        'Protocolo OSDP v2.2 anti-intercepción',
        'Respaldos continuos por batería AGM',
        'Calibración de electroimanes de 600 lbs'
      ],
      standard: 'SIA OSDP Verified v2.2'
    },
    {
      phase: 'Fase 04 · Digitalización & Rollout',
      duration: 'Día 5 · Entrega',
      icon: ShieldCheck,
      kpi: 'Apertura en < 0.2s',
      deliverables: [
        'Enrolamiento facial 3D anti-spoofing',
        'Configuración de perfiles y roles de RH',
        'Capacitación presencial al personal'
      ],
      standard: 'Certificación ISO/IEC 30107'
    }
  ],

  alarmas: [
    {
      phase: 'Fase 01 · Zonificación Crítica',
      duration: 'Día 1 · 24 Horas',
      icon: Search,
      kpi: 'Particiones 100% Flexibles',
      deliverables: [
        'Mapeo de puntos ciegos y cortinas perimetrales',
        'Zonificación independiente por áreas operativas',
        'Cálculo de alcances PIR y microondas'
      ],
      standard: 'Norma UL 1610 Grado Comercial'
    },
    {
      phase: 'Fase 02 · Tendido Supervisado',
      duration: 'Día 2',
      icon: Layers,
      kpi: 'Supervisión EOL Doble',
      deliverables: [
        'Cable blindado FPL retardante al fuego',
        'Resistencias fin de línea anti-puenteo',
        'Protección aislada contra inducción'
      ],
      standard: 'NFPA 72 Código de Alarmas'
    },
    {
      phase: 'Fase 03 · Disuasión & Sensores',
      duration: 'Día 3',
      icon: Radio,
      kpi: 'Potencia 120 dB',
      deliverables: [
        'Montaje de sirena bitonal con tamper de pared',
        'Calibración de ruptura de cristal y contactos',
        'Instalación de botones de pánico silenciosos'
      ],
      standard: 'Test Acústico de 120 dB'
    },
    {
      phase: 'Fase 04 · Enlace C4 & Monitoreo',
      duration: 'Día 4 · Entrega',
      icon: ShieldCheck,
      kpi: 'Transmisión Dual 4G/IP',
      deliverables: [
        'Simulacro de sabotaje y corte eléctrico',
        'Homologación Contact ID / SIA con Central C4',
        'Despacho de patrulla y entrega de app móvil'
      ],
      standard: 'Homologación Central C4 24/7'
    }
  ],

  'cercas-electrificadas': [
    {
      phase: 'Fase 01 · Ingeniería Mecánica',
      duration: 'Día 1 · 24 Horas',
      icon: Search,
      kpi: 'Vida Útil 15+ Años',
      deliverables: [
        'Estudio de longitudes y postes de esquina',
        'Cálculo de tensión mecánica sin combas',
        'Selección de joules según perímetro'
      ],
      standard: 'NOM-001-SEDE-2012'
    },
    {
      phase: 'Fase 02 · Estructura & Postería',
      duration: 'Día 2 - 3',
      icon: Layers,
      kpi: 'Galvanizado en Caliente',
      deliverables: [
        'Fijación sobre barda con soldadura o taquete',
        'Aisladores de polipropileno con filtro UV',
        'Inclinación exterior disuasiva a 45°'
      ],
      standard: 'Protección Civil Estatal'
    },
    {
      phase: 'Fase 03 · Tendido de Líneas',
      duration: 'Día 4',
      icon: Wrench,
      kpi: '4x Más Conductividad',
      deliverables: [
        'Alambre de aluminio triple torsión sin óxido',
        'Resortes tensores de acero inoxidable',
        'Colocación de letreros oficiales de advertencia'
      ],
      standard: 'IEC 60335-2-76 Internacional'
    },
    {
      phase: 'Fase 04 · Tierra Física & Alta',
      duration: 'Día 5 · Entrega',
      icon: ShieldCheck,
      kpi: 'Resistencia < 10 Ω',
      deliverables: [
        'Instalación de varilla Copperweld 1.5m',
        'Prueba de corte y derivación instantánea',
        'Certificado formal de cumplimiento normativo'
      ],
      standard: 'Dictamen de Seguridad Eléctrica'
    }
  ],

  videoporteros: [
    {
      phase: 'Fase 01 · Arquitectura IP & Red',
      duration: 'Día 1 · 24 Horas',
      icon: Search,
      kpi: 'Gigabit PoE Certificado',
      deliverables: [
        'Cálculo de ancho de banda y latencia de red',
        'Tendido de cable UTP Cat6 100% cobre',
        'Distribución de switches PoE administrables'
      ],
      standard: 'Protocolo IEEE 802.3at PoE+'
    },
    {
      phase: 'Fase 02 · Hardware Exterior',
      duration: 'Día 2',
      icon: Layers,
      kpi: 'Protección IK08 / IP65',
      deliverables: [
        'Fijación en muro con chasis de aluminio',
        'Visera protectora solar y lluvia extrema',
        'Calibración de ángulo de visión 180°'
      ],
      standard: 'Grado Antivandálico IK08'
    },
    {
      phase: 'Fase 03 · Monitores & Cerraduras',
      duration: 'Día 3',
      icon: Wrench,
      kpi: 'Audio SIP 2.0 Full Duplex',
      deliverables: [
        'Instalación de pantallas táctiles interiores',
        'Integración con chapa magnética y cierra-puertas',
        'Calibración de cancelación de eco acústico'
      ],
      standard: 'Protocolo SIP 2.0 / RFC 3261'
    },
    {
      phase: 'Fase 04 · Despliegue App & Cloud',
      duration: 'Día 4 · Entrega',
      icon: ShieldCheck,
      kpi: 'Llamada Push < 1s',
      deliverables: [
        'Configuración de servidor cloud P2P sin renta',
        'Enrolamiento de smartphones mediante QR seguro',
        'Pruebas de apertura remota por 4G / WiFi'
      ],
      standard: 'Cifrado de Video TLS / AES-128'
    }
  ]
};

export default function ServiceProcessTimeline({ 
  serviceId = 'cctv', 
  architecture = [], 
  onOpenQuote 
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const entryRefs = useRef([]);
  const [trackHeight, setTrackHeight] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Fallback metadata if service not found
  const metaList = PROCESS_METADATA[serviceId] || PROCESS_METADATA.cctv;

  // Track height calculation for scroll beam
  useEffect(() => {
    const updateHeight = () => {
      if (trackRef.current) {
        setTrackHeight(trackRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [architecture]);

  // Framer-Motion Scroll Beam Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 35%', 'end 75%']
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, trackHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  // Active step highlight on scroll
  useEffect(() => {
    const handleScroll = () => {
      const triggerY = window.innerHeight * 0.42;
      entryRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          setActiveStepIndex(idx);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [architecture]);

  return (
    <section className="spt-section" id="metodologia-llave-en-mano">
      <div className="spt-container" ref={containerRef}>
        
        {/* 1. SECTION HEADER */}
        <div className="spt-header">
          <div className="spt-eyebrow">
            <span className="spt-eyebrow-pulse" />
            <span>Metodología de Ingeniería Cuauhtli</span>
          </div>
          <h2 className="spt-title">
            Protocolo de despliegue <span className="svc-cursive-accent">llave en mano</span>
          </h2>
          <p className="spt-desc">
            Desde la auditoría técnica hasta la entrega formal con póliza de garantía y enlace activo al C4. Cero improvisación, máxima trazabilidad.
          </p>

          <div className="spt-pills-bar">
            <span className="spt-guarantee-pill">
              <CheckCircle2 size={13} />
              Levantamiento en 24h
            </span>
            <span className="spt-guarantee-pill">
              <CheckCircle2 size={13} />
              Instalación sin paros operativos
            </span>
            <span className="spt-guarantee-pill">
              <CheckCircle2 size={13} />
              Pruebas de estrés certificadas
            </span>
            <span className="spt-guarantee-pill">
              <CheckCircle2 size={13} />
              Garantía vitalicia en mano de obra
            </span>
          </div>
        </div>

        {/* 2. TIMELINE TRACK & ENTRIES */}
        <div className="spt-track-wrapper" ref={trackRef}>
          
          {/* Animated Scroll Beam */}
          <div className="spt-beam-track" aria-hidden="true">
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform
              }}
              className="spt-beam-glow"
            >
              <span className="spt-beam-tip" />
            </motion.div>
          </div>

          {/* Steps Loop */}
          {architecture.map((step, index) => {
            const meta = metaList[index] || metaList[metaList.length - 1];
            const StepIcon = meta.icon || Wrench;
            const isActive = activeStepIndex === index;
            const isPassed = activeStepIndex > index;

            return (
              <div
                key={step.step || index}
                ref={(el) => (entryRefs.current[index] = el)}
                className={`spt-entry ${isActive ? 'is-active' : ''} ${isPassed ? 'is-passed' : ''}`}
              >
                {/* Left Column: Sticky Node & Milestone Info */}
                <div className="spt-node-col">
                  {/* Central Node Circle */}
                  <div className="spt-node-anchor">
                    <div className="spt-node-inner">
                      <div className="spt-node-dot" />
                    </div>
                  </div>

                  {/* Desktop Metadata */}
                  <div className="spt-milestone-info">
                    <span className="spt-step-tag">{meta.phase}</span>
                    <span className="spt-step-num-huge">{step.step}</span>
                    <span className="spt-step-duration">
                      <Clock size={11} />
                      {meta.duration}
                    </span>
                  </div>
                </div>

                {/* Right Column: Minimalist "WOW" Card */}
                <div className="spt-card-col">
                  <div className="spt-card">
                    
                    {/* Header Row */}
                    <div className="spt-card-meta-row">
                      <span className="spt-phase-chip">
                        <StepIcon size={12} />
                        {meta.phase}
                      </span>
                      <span className="spt-kpi-badge">
                        <Activity size={12} />
                        {meta.kpi}
                      </span>
                    </div>

                    {/* Step Title & Narrative */}
                    <h3 className="spt-card-title">{step.title}</h3>
                    <p className="spt-card-desc">{step.desc}</p>

                    {/* Entregables Certificados (3 Deliverable Pills) */}
                    <div className="spt-deliverables-title">Entregables de Ingeniería:</div>
                    <div className="spt-deliverables-grid">
                      {meta.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="spt-deliverable-item">
                          <Check size={12} strokeWidth={3} />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Verification Strip */}
                    <div className="spt-card-footer">
                      <span className="spt-verified-tag">
                        <ShieldCheck size={14} />
                        Entrega Llave en Mano Certificada
                      </span>
                      <span className="spt-standard-tag">
                        Norma: {meta.standard}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. BOTTOM TURNKEY ACTION BANNER */}
        <div className="spt-cta-banner">
          <div>
            <h4 className="spt-cta-title">¿Listo para implementar con metodología llave en mano?</h4>
            <p className="spt-cta-desc">
              Un ingeniero certificado visita tus instalaciones sin costo para realizar el levantamiento técnico inicial.
            </p>
          </div>
          {onOpenQuote && (
            <button
              type="button"
              className="spt-cta-btn"
              onClick={() => onOpenQuote('Proyecto Llave en Mano')}
            >
              <span>Solicitar Levantamiento en Sitio</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
