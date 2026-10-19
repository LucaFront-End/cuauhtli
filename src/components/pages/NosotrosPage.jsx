import React, { useState, useEffect } from 'react';
import { Lottie } from 'lottie-react';
import shieldLottie from '../../assets/lottie/shield-step.json';
import radarLottie from '../../assets/lottie/radar-step.json';
import securityLottie from '../../assets/lottie/security-step.json';
import checkLottie from '../../assets/lottie/success-check.json';
import { 
  Award, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  Cpu, 
  Building2, 
  Sparkles,
  FileCheck2,
  Lock,
  Layers,
  Check,
  X as CloseIcon,
  Activity,
  Terminal,
  Server,
  Zap,
  ShieldAlert,
  UserCheck,
  FileBadge2
} from 'lucide-react';
import './NosotrosPage.css';

export default function NosotrosPage({ onOpenQuote, onNavigateHome, onNavigateService }) {
  const [activeBench, setActiveBench] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const telemetryStats = [
    { val: '+10', lbl: 'Años de Trayectoria (2014 – 2025)', icon: Award },
    { val: '+1,200', lbl: 'Infraestructuras Activas Blindadas', icon: Building2 },
    { val: '99.98%', lbl: 'Disponibilidad Operativa en C4', icon: Activity },
    { val: '< 300ms', lbl: 'Latencia de IA Perimetral en Borde', icon: Zap },
  ];

  const testBenches = [
    {
      id: 'b1',
      code: 'BENCH-01 // OPTICS',
      title: 'Cámara Estanca & Hermeticidad IP67 / IK10',
      desc: 'Prueba de inmersión total en agua, chorro a presión de 100 kPa y choque mecánico de 20 Joules (impacto de 5 kg a 40 cm). Cero condensación en lente ni fisura en domo óptico.',
      status: 'TEST PASSED (100%)',
      metricA: 'IP67 / IK10',
      lblA: 'Protección Mecánica',
      metricB: '20 Joules',
      lblB: 'Resistencia a Impacto'
    },
    {
      id: 'b2',
      code: 'BENCH-02 // LUXOMETRY',
      title: 'Luxometría Crítica & Detección Térmica 300m',
      desc: 'Calibración en laboratorio de oscuridad extrema (0.0005 Lux). Ajuste fino de sensores ColorVu y térmicos Bi-Spectrales para identificación humana sin lámparas auxiliares.',
      status: 'CALIBRATED (0.0005 lx)',
      metricA: '0.0005 Lux',
      lblA: 'Sensibilidad Nocturna',
      metricB: '300+ m',
      lblB: 'Rango Térmico Humano'
    },
    {
      id: 'b3',
      code: 'BENCH-03 // CYBERSECURITY',
      title: 'Auditoría de Ciberseguridad & Firmware Hardening',
      desc: 'Escaneo de vulnerabilidades antes de instalación: cierre de puertos Telnet / UPnP inseguros, cifrado TLS 1.3 en streaming de video y cambio de contraseñas de fábrica bajo norma.',
      status: 'SECURE // TLS 1.3',
      metricA: 'TLS 1.3',
      lblA: 'Cifrado de Video',
      metricB: '0 Puertos',
      lblB: 'Backdoors Abiertos'
    },
    {
      id: 'b4',
      code: 'BENCH-04 // STRESS 72H',
      title: 'Prueba de Estrés Térmico & Carga Continua 72h',
      desc: 'Operación continua en cámara climática a temperaturas extremas (-20°C a +60°C) con grabación RAID intensiva simultánea para asegurar estabilidad en naves industriales sin clima artificial.',
      status: '72H CONTINUOUS BURN-IN',
      metricA: '-20° a +60°C',
      lblA: 'Rango Térmico',
      metricB: '0 Dropouts',
      lblB: 'Pérdida de Cuadros'
    },
  ];

  const comparisons = [
    {
      param: 'Canalización & Infraestructura',
      cuauhtli: 'Tubería conduit pared gruesa galvanizada y cableado Cat6 FTP blindado bajo norma TIA/EIA-568-C.2.',
      generic: 'Cable UTP genérico grapado por plafones o a la intemperie vulnerable a roedores, lluvia y cortes.'
    },
    {
      param: 'Analítica de IA Perimetral',
      cuauhtli: 'Algoritmos Deep Learning calibrados para clasificar humanos y vehículos con < 1% de falsas alarmas.',
      generic: 'Sensores de movimiento PIR básicos o cámaras con detección de píxeles que alertan con lluvia y viento.'
    },
    {
      param: 'Póliza y Garantía de Instalación',
      cuauhtli: 'Garantía Vitalicia en Mano de Obra: canalizaciones, conectores y peinados de rack cubiertos de por vida.',
      generic: 'Garantías estándar de 30 a 90 días; cualquier falla posterior se cobra como visita técnica independiente.'
    },
    {
      param: 'Soberanía y Licenciamiento',
      cuauhtli: 'Protocolos abiertos ONVIF, Wiegand y OSDP. El cliente mantiene el control total de sus claves y equipos.',
      generic: 'Sistemas cerrados propietarios con pagos forzosos anuales para renovar licencias de software.'
    },
    {
      param: 'Personal Técnico en Sitio',
      cuauhtli: 'Ingenieros de planta certificados con control de confianza, uniforme oficial y póliza civil de $10M MXN.',
      generic: 'Técnicos subcontratados sin verificación de antecedentes ni póliza de seguro de responsabilidad.'
    }
  ];

  const pillars = [
    {
      id: 'p1',
      tag: 'Certificación Tier-1',
      title: 'Ingeniería Propia & Cuadrillas Certificadas',
      desc: 'No delegamos tu seguridad en técnicos independientes sin respaldo. Todo nuestro personal pasa por pruebas de control de confianza y capacitación continua en laboratorios de prueba.',
      badge: 'Personal con control de confianza',
      icon: Award,
    },
    {
      id: 'p2',
      tag: 'Póliza Exclusiva',
      title: 'Póliza Vitalicia de Mano de Obra',
      desc: 'Una mala instalación inutiliza el mejor equipo. Por eso, en Sistemas Cuauhtli garantizamos de por vida la mano de obra, tubería conduit, soportería y etiquetado normativo de cada proyecto.',
      badge: 'Cero costos ocultos o sorpresas',
      icon: ShieldCheck,
    },
    {
      id: 'p3',
      tag: 'Cobertura Operativa',
      title: 'Central C4 & Respuesta Inmediata',
      desc: 'SLA garantizado por contrato con arribo en menos de 1 hora en CDMX/EdoMex y menos de 2 horas en corredores del Bajío, Monterrey y Guadalajara. Monitoreo redundante y enlace de zona 24/7/365.',
      badge: 'Cuadrillas móviles en campo',
      icon: Clock,
    },
    {
      id: 'p4',
      tag: 'Soberanía Tecnológica',
      title: 'Protocolos Abiertos Sin Dependencias',
      desc: 'Instalamos tecnología con arquitectura estándar (ONVIF, Wiegand, OSDP). Nunca te atamos a licencias propietarias abusivas: mantienes el control total e interoperabilidad de tus sistemas.',
      badge: '100% interoperable con VMS globales',
      icon: Wrench,
    },
  ];

  const currentBench = testBenches[activeBench];

  return (
    <div className="nos-page-root">
      
      {/* 1. SUB-NAV / BREADCRUMB BAR */}
      <nav className="nos-subnav-bar">
        <div className="container nos-subnav-inner">
          <div className="nos-breadcrumbs">
            <button 
              type="button" 
              onClick={onNavigateHome} 
              className="nos-back-btn"
              title="Volver al Inicio"
            >
              <ArrowLeft size={14} />
              <span>Inicio</span>
            </button>
            <span className="nos-breadcrumb-sep">/</span>
            <span className="nos-breadcrumb-current">Sobre Nosotros</span>
          </div>

          <div className="nos-subnav-badges">
            <div className="nos-live-pill">
              <span className="nos-live-dot" />
              <span>Central C4 Operativa 24/7</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO CINEMÁTICO & MINIMALISTA CON LOTTIE */}
      <section className="nos-hero-cinematic">
        <div className="container">
          <div className="nos-hero-grid">
            
            {/* Left Column: Authoritative Copy */}
            <div>
              <div className="nos-hero-tag">
                <ShieldCheck size={14} />
                <span>Sistemas Cuauhtli · Ingeniería Electrónica desde 2014</span>
              </div>

              <h1 className="nos-hero-h1">
                Seguridad de élite donde el <span className="nos-hero-accent">margen de error es cero</span>.
              </h1>

              <p className="nos-hero-p">
                Diseñamos e integramos infraestructura de protección electrónica invisible para más de 1,200 industrias, centros logísticos CEDIS y corporativos en todo México. En misión crítica, la perfección no es negociable.
              </p>

              <div className="nos-hero-cta-group">
                <button
                  type="button"
                  onClick={() => onOpenQuote?.('Solución Integral Completa')}
                  className="btn btn-primary"
                  style={{ padding: '15px 32px' }}
                >
                  <span>Solicitar Levantamiento Técnico</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="tel:5585262115"
                  className="btn btn-secondary"
                  style={{ padding: '15px 22px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Phone size={15} color="var(--primary, #A6192E)" />
                  <span>(55) 8526-2115</span>
                </a>
              </div>
            </div>

            {/* Right Column: Lottie Security Card */}
            <div>
              <div className="nos-hero-lottie-card">
                <div className="nos-hero-lottie-glow" />
                <div className="nos-lottie-box">
                  <Lottie 
                    animationData={shieldLottie} 
                    loop={true} 
                    autoplay={true} 
                    style={{ width: '100%', height: '100%' }} 
                  />
                </div>
                <h3 className="nos-hero-lottie-title">Garantía Vitalicia Homologada</h3>
                <p className="nos-hero-lottie-sub">
                  Cada canalización, soporte y peinado de rack respaldado por póliza legal de mano de obra de por vida.
                </p>
                <div className="nos-hero-lottie-chips">
                  <span className="nos-chip"><Lock size={12} /> Cero Obsolescencia</span>
                  <span className="nos-chip"><Zap size={12} /> SLA &lt; 1 hr CDMX</span>
                  <span className="nos-chip"><CheckCircle2 size={12} /> 100% C4 Ready</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TELEMETRÍA OPERATIVA EN TIEMPO REAL */}
      <section className="nos-telemetry-sec">
        <div className="container">
          <div className="nos-telemetry-grid">
            {telemetryStats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="nos-telemetry-card">
                  <div className="nos-telemetry-icon">
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="nos-telemetry-val">{s.val}</div>
                    <div className="nos-telemetry-lbl">{s.lbl}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. NUEVA SECCIÓN 1: LABORATORIO DE PRUEBAS & HOMOLOGACIÓN C4 */}
      <section className="nos-lab-sec">
        <div className="nos-lab-glow-top" />
        <div className="nos-lab-glow-bottom" />
        <div className="container">
          
          <div className="nos-lab-header">
            <div className="nos-lab-badge">
              <Terminal size={14} />
              <span>HARDWARE STRESS LAB // CDMX FACILITY</span>
            </div>
            <h2 className="nos-lab-title">
              Ningún equipo entra a tu empresa <span className="nos-lab-title-accent">sin pasar por nuestro laboratorio</span>.
            </h2>
            <p className="nos-lab-desc">
              Antes de que una sola cámara o sensor sea montado en tus instalaciones, pasa por 72 horas continuas de pruebas de tortura ambiental, luxometría extrema y auditoría de ciberseguridad en nuestro banco de pruebas.
            </p>
          </div>

          <div className="nos-lab-split">
            {/* Left: 4 Interactive Test Benches */}
            <div className="nos-benches-grid">
              {testBenches.map((b, idx) => {
                const isActive = activeBench === idx;
                return (
                  <div 
                    key={b.id} 
                    className={`nos-bench-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveBench(idx)}
                  >
                    <div className="nos-bench-top">
                      <span className="nos-bench-code">{b.code}</span>
                      <span className="nos-bench-status">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                        <span>TEST VERIFIED</span>
                      </span>
                    </div>
                    <h3 className="nos-bench-title">{b.title}</h3>
                    <p className="nos-bench-p">{b.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Right: Radar Lottie Console with Dynamic Metrics */}
            <div className="nos-lab-console">
              <div className="nos-lab-radar-wrap">
                <Lottie 
                  animationData={radarLottie} 
                  loop={true} 
                  autoplay={true} 
                  style={{ width: '100%', height: '100%' }} 
                />
              </div>
              <h3 className="nos-lab-console-title">{currentBench.title}</h3>
              <p className="nos-lab-console-sub">{currentBench.code} · Protocolo de Inspección Rigurosa</p>
              
              <div className="nos-lab-metrics-strip">
                <div className="nos-lab-m-item">
                  <div className="nos-lab-m-val">{currentBench.metricA}</div>
                  <div className="nos-lab-m-lbl">{currentBench.lblA}</div>
                </div>
                <div className="nos-lab-m-item">
                  <div className="nos-lab-m-val">{currentBench.metricB}</div>
                  <div className="nos-lab-m-lbl">{currentBench.lblB}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. NUEVA SECCIÓN 2: PROTOCOLO DE CONFIANZA & EQUIPO HUMANO ($10M MXN) */}
      <section className="nos-trust-sec">
        <div className="container">
          <div className="nos-trust-grid">
            
            {/* Left: Manifesto & Policy */}
            <div>
              <div className="nos-trust-badge">
                <UserCheck size={14} />
                <span>PROTOCOLOS DE CONFIANZA & CONTROL HUMANO</span>
              </div>

              <h2 className="nos-trust-title">
                En seguridad crítica, <span style={{ color: 'var(--primary, #A6192E)' }}>quién ingresa a tu planta</span> lo es todo.
              </h2>

              <p className="nos-trust-desc">
                Un sistema de seguridad vulnerado por personal no verificado es el mayor riesgo patrimonial. En Sistemas Cuauhtli no existe la subcontratación precaria: cada técnico es colaborador de nómina con acreditaciones oficiales.
              </p>

              <div className="nos-trust-policy-banner">
                <FileBadge2 size={32} color="var(--primary, #A6192E)" style={{ flexShrink: 0 }} />
                <div>
                  <div className="nos-trust-policy-val">$10,000,000 MXN</div>
                  <div className="nos-trust-policy-lbl">
                    Póliza de Responsabilidad Civil y Fianza de Cumplimiento que ampara todas nuestras intervenciones en sitio.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3 Verification Items */}
            <div className="nos-trust-cards-col">
              <div className="nos-trust-item">
                <div className="nos-trust-item-icon">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="nos-trust-item-title">Exámenes de Control de Confianza Periódicos</h3>
                  <p className="nos-trust-item-p">
                    Polígrafo, antidoping y carta de antecedentes no penales actualizada semestralmente para el 100% de nuestras cuadrillas operativas.
                  </p>
                </div>
              </div>

              <div className="nos-trust-item">
                <div className="nos-trust-item-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="nos-trust-item-title">Acreditación QR y Verificación Biométrica</h3>
                  <p className="nos-trust-item-p">
                    Antes del arribo, tu departamento de seguridad recibe la ficha técnica del personal con fotografía, credencial oficial y validación en tiempo real.
                  </p>
                </div>
              </div>

              <div className="nos-trust-item">
                <div className="nos-trust-item-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="nos-trust-item-title">SLA Contractual & Cuadrillas Propias en Corredores</h3>
                  <p className="nos-trust-item-p">
                    Cuadrillas con vehículos utilitarios equipados con refacciones en caliente listas para arribo en &lt; 1 hora en CDMX y &lt; 2 horas en el Bajío y Norte.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SCROLL-BASED COMPARISON: EL ESTÁNDAR CUAUTHLI VS LA INDUSTRIA GENÉRICA */}
      <section className="nos-compare-sec">
        <div className="container">
          
          <div className="nos-compare-head">
            <span className="section-label">COMPARATIVA DE INGENIERÍA</span>
            <h2 className="section-title">
              El Estándar Cuauhtli vs <span style={{ color: 'var(--primary, #A6192E)' }}>La Industria Genérica</span>
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Descubre por qué las principales plantas y corporativos migran su infraestructura de seguridad hacia Sistemas Cuauhtli.
            </p>
          </div>

          <div className="nos-compare-table-card">
            
            <div className="nos-compare-row-header">
              <span className="c-param">Parámetro Técnico</span>
              <span className="c-cuauhtli">Sistemas Cuauhtli (Misión Crítica)</span>
              <span className="c-generic">Instaladores Genéricos</span>
            </div>

            <div className="nos-compare-list">
              {comparisons.map((item, idx) => (
                <div key={idx} className="nos-compare-row">
                  <div className="nos-compare-param">{item.param}</div>
                  <div className="nos-compare-val cuauhtli">
                    <Check size={16} />
                    <span>{item.cuauhtli}</span>
                  </div>
                  <div className="nos-compare-val generic">
                    <CloseIcon size={16} />
                    <span>{item.generic}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 7. LOS 4 PILARES DE MISIÓN CRÍTICA */}
      <section className="nos-pillars-sec">
        <div className="container">
          
          <div className="nos-pillars-head">
            <span className="section-label">PILARES CORPORATIVOS</span>
            <h2 className="section-title">
              Arquitectura de Respaldo <span style={{ color: 'var(--primary, #A6192E)' }}>Sistemas Cuauhtli</span>
            </h2>
          </div>

          <div className="nos-pillars-grid">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="nos-pillar-card">
                  <div>
                    <div className="nos-pillar-top">
                      <div className="nos-pillar-icon-box">
                        <Icon size={26} />
                      </div>
                      <div>
                        <div className="nos-pillar-tag">{item.tag}</div>
                        <h3 className="nos-pillar-title">{item.title}</h3>
                      </div>
                    </div>
                    <p className="nos-pillar-desc">{item.desc}</p>
                  </div>

                  <div className="nos-pillar-footer">
                    <span className="nos-pillar-badge">
                      <CheckCircle2 size={16} color="var(--primary, #A6192E)" />
                      <span>{item.badge}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. BOTTOM CONVERSION BANNER */}
      <section className="nos-bottom-cta">
        <div className="container">
          <div className="nos-cta-box">
            <div className="nos-cta-glow" />
            <div className="nos-cta-left">
              <span className="nos-cta-badge">
                <Sparkles size={13} />
                <span>Auditoría Técnica en Sitio Sin Costo ni Compromiso</span>
              </span>
              <h2 className="nos-cta-title">
                ¿Listo para blindar tu infraestructura con ingeniería de élite?
              </h2>
              <p className="nos-cta-desc">
                Un ingeniero especialista de nuestro laboratorio visitará tu inmueble en CDMX o corredores nacionales, 
                detectará puntos ciegos y te entregará un anteproyecto con planos en AutoCAD sin costo.
              </p>
            </div>

            <div className="nos-cta-actions">
              <button
                type="button"
                onClick={() => onOpenQuote?.('Solución Integral Completa')}
                className="nos-cta-btn"
              >
                <span>Agendar Levantamiento en Sitio</span>
                <ArrowRight size={16} />
              </button>
              <a href="tel:5585262115" className="nos-cta-tel">
                <Phone size={13} />
                <span>Atención Telefónica Directa: (55) 8526-2115</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
