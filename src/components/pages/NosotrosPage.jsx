import React, { useState, useEffect, useRef } from 'react';
import {
  HeroLifetimeShieldAnimation,
  OpticsWaterShockAnimation,
  LuxometryRadarAnimation,
  CybersecurityHardeningAnimation,
  ClimaticBurnInAnimation
} from '../ui/SecurityHudAnimations';
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const benchRefs = useRef([]);
  const labSectionRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // SCROLL-BASED DETECTION FOR HARDWARE STRESS LAB
  useEffect(() => {
    const handleScroll = () => {
      if (!labSectionRef.current) return;
      const rect = labSectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      
      // Calculate overall progress through the lab section
      const totalScroll = rect.height - windowH;
      if (totalScroll > 0) {
        const currentScroll = -rect.top;
        const prog = Math.min(Math.max(currentScroll / totalScroll, 0), 1);
        setScrollProgress(prog);
      }

      // Determine which bench card is currently closest to viewport focus
      let closestIdx = 0;
      let minDistance = Infinity;
      const targetY = windowH * 0.42;

      benchRefs.current.forEach((el, idx) => {
        if (!el) return;
        const cardRect = el.getBoundingClientRect();
        const cardCenter = cardRect.top + cardRect.height * 0.5;
        const dist = Math.abs(cardCenter - targetY);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      setActiveBench(closestIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBench = (idx) => {
    const el = benchRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const telemetryStats = [
    { val: '+10', lbl: 'Años de Trayectoria (2014 – 2025)', icon: Award },
    { val: '+1,200', lbl: 'Infraestructuras Activas Blindadas', icon: Building2 },
    { val: '99.98%', lbl: 'Disponibilidad Operativa en C4', icon: Activity },
    { val: '< 300ms', lbl: 'Latencia de IA Perimetral en Borde', icon: Zap },
  ];

  const testBenches = [
    {
      id: 'b1',
      code: 'BENCH-01 // OPTICS & WATER RESISTANCE',
      title: 'Cámara Estanca & Hermeticidad IP67 / IK10',
      subtitle: 'Inmersión en Agua a 1m & Choque Mecánico de 20 Joules',
      desc: 'Inmersión continua en agua a 1m de profundidad, chorro a presión de 100 kPa y choque mecánico de 20 Joules (impacto directo de 5 kg a 40 cm). Cero condensación en lente óptico, cero fisura en domo óptico.',
      status: 'TEST PASSED (100%)',
      component: OpticsWaterShockAnimation,
      metricA: 'IP67 / IK10',
      lblA: 'Protección Mecánica',
      metricB: '20 Joules',
      lblB: 'Resistencia a Impacto',
      specs: ['Presión: 100 kPa', 'Inmersión: 1.0 m', 'Sellos: EPDM C4', 'Lente: Anti-Vaho']
    },
    {
      id: 'b2',
      code: 'BENCH-02 // LUXOMETRY & THERMAL RADAR',
      title: 'Luxometría Crítica & Detección Térmica 300m',
      subtitle: 'Sensibilidad 0.0005 Lux en Oscuridad Total & Radar 360°',
      desc: 'Calibración en laboratorio de oscuridad extrema (0.0005 Lux). Ajuste milimétrico de sensores ColorVu y térmicos Bi-Spectrales para identificación humana y vehicular nítida a más de 300 metros sin iluminación auxiliar.',
      status: 'CALIBRATED (0.0005 lx)',
      component: LuxometryRadarAnimation,
      metricA: '0.0005 Lux',
      lblA: 'Sensibilidad Nocturna',
      metricB: '300+ m',
      lblB: 'Rango Térmico Humano',
      specs: ['Sensor: Bi-Spectral', 'Rango: 300m Radio', 'ColorVu: F1.0 Ultra', 'FOV: 110° Wide']
    },
    {
      id: 'b3',
      code: 'BENCH-03 // CYBERSECURITY & HARDENING',
      title: 'Auditoría de Ciberseguridad & Firmware Hardening',
      subtitle: 'Cifrado de Video TLS 1.3 & Cierre Total de Puertos Inseguros',
      desc: 'Escaneo integral de vulnerabilidades previo a entrega: cierre de puertos Telnet / UPnP inseguros, cifrado TLS 1.3 de extremo a extremo en streaming de video y cambio estricto de contraseñas de fábrica bajo norma de ciberseguridad.',
      status: 'SECURE // TLS 1.3',
      component: CybersecurityHardeningAnimation,
      metricA: 'TLS 1.3',
      lblA: 'Cifrado de Video',
      metricB: '0 Puertos',
      lblB: 'Backdoors Abiertos',
      specs: ['Norma: ISO 27001', 'Cifrado: AES-256', 'Protocolo: HTTPS/TLS', 'Firewall: Borde C4']
    },
    {
      id: 'b4',
      code: 'BENCH-04 // CLIMATIC BURN-IN 72H',
      title: 'Prueba de Estrés Térmico & Carga Continua 72h',
      subtitle: 'Operación Extrema de -20°C a +60°C en Grabación RAID Continua',
      desc: 'Operación continua en cámara climática a temperaturas extremas (-20°C a +60°C) con grabación RAID intensiva simultánea al 100% de CPU para asegurar total estabilidad en naves industriales sin aire acondicionado.',
      status: '72H CONTINUOUS BURN-IN',
      component: ClimaticBurnInAnimation,
      metricA: '-20° a +60°C',
      lblA: 'Rango Térmico',
      metricB: '0 Dropouts',
      lblB: 'Pérdida de Cuadros',
      specs: ['Tiempo: 72 Horas', 'RAID: 100% I/O', 'Disponibilidad: 99.99%', 'Póliza: $10M MXN']
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

            {/* Right Column: Lifetime Shield Security Card */}
            <div>
              <div className="nos-hero-lottie-card">
                <div className="nos-hero-lottie-glow" />
                <div className="nos-lottie-box">
                  <HeroLifetimeShieldAnimation />
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

      {/* 4. SECCIÓN SCROLL-BASED: LABORATORIO DE PRUEBAS & HOMOLOGACIÓN C4 */}
      <section className="nos-lab-sec" ref={labSectionRef}>
        <div className="nos-lab-glow-top" />
        <div className="nos-lab-glow-bottom" />
        <div className="container">
          
          <div className="nos-lab-header">
            <div className="nos-lab-badge">
              <Terminal size={14} />
              <span>HARDWARE STRESS LAB // SCROLL-BASED BENCHMARK C4</span>
            </div>
            
            <h2 className="nos-lab-title">
              Ningún equipo entra a tu empresa <span className="nos-lab-title-accent">sin pasar por nuestro laboratorio</span>.
            </h2>
            <p className="nos-lab-desc">
              Desplaza hacia abajo para auditar cómo sometemos cada componente a 72 horas de tortura ambiental, choque cinético, luxometría extrema y auditoría de ciberseguridad.
            </p>

            {/* Scroll Indicator & Progress */}
            <div className="nos-lab-scroll-hint">
              <div className="nos-scroll-hint-pill">
                <span className="nos-scroll-dot" />
                <span>Scroll Interactivo · Banco 0{activeBench + 1} de 0{testBenches.length}</span>
              </div>
              <div className="nos-scroll-bar-wrap">
                <div 
                  className="nos-scroll-bar-fill" 
                  style={{ width: `${Math.max(scrollProgress * 100, 15)}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="nos-lab-scroll-layout">
            
            {/* Left Column: Continuous Scroll Benches Track */}
            <div className="nos-benches-track">
              <div className="nos-benches-rail-line">
                <div 
                  className="nos-benches-rail-progress" 
                  style={{ height: `${Math.max(scrollProgress * 100, 8)}%` }}
                />
              </div>

              {testBenches.map((b, idx) => {
                const isActive = activeBench === idx;
                const isPassed = activeBench > idx;
                return (
                  <div 
                    key={b.id} 
                    ref={(el) => (benchRefs.current[idx] = el)}
                    className={`nos-bench-card-scroll ${isActive ? 'is-active' : ''} ${isPassed ? 'is-passed' : ''}`}
                    onClick={() => scrollToBench(idx)}
                  >
                    <div className="nos-bench-marker">
                      <span className="nos-bench-num">0{idx + 1}</span>
                    </div>

                    <div className="nos-bench-inner">
                      <div className="nos-bench-top">
                        <span className="nos-bench-code">{b.code}</span>
                        <span className={`nos-bench-status-badge ${isActive ? 'is-live' : ''}`}>
                          <span className="nos-status-beacon" />
                          <span>{isActive ? 'EVALUANDO EN VIVO' : b.status}</span>
                        </span>
                      </div>

                      <h3 className="nos-bench-title">{b.title}</h3>
                      <div className="nos-bench-subtitle">{b.subtitle}</div>
                      <p className="nos-bench-p">{b.desc}</p>

                      {/* Technical Specs Tags */}
                      <div className="nos-bench-specs">
                        {b.specs.map((spec, sIdx) => (
                          <span key={sIdx} className="nos-spec-tag">
                            <Check size={11} color="#60A5FA" />
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>

                      {/* Metrics comparison */}
                      <div className="nos-bench-metrics-row">
                        <div className="nos-bench-m-box">
                          <div className="nos-bench-m-val">{b.metricA}</div>
                          <div className="nos-bench-m-lbl">{b.lblA}</div>
                        </div>
                        <div className="nos-bench-m-box">
                          <div className="nos-bench-m-val">{b.metricB}</div>
                          <div className="nos-bench-m-lbl">{b.lblB}</div>
                        </div>
                      </div>

                      {/* Mobile Inline HUD Player */}
                      <div className="nos-bench-mobile-lottie">
                        <div style={{ width: '100px', height: '100px', margin: '12px auto 0 auto' }}>
                          {React.createElement(b.component)}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: STICKY C4 DIAGNOSTICS & LOTTIE CONSOLE */}
            <div className="nos-lab-sticky-col">
              <div className="nos-lab-sticky-console">
                <div className="nos-console-glow" />

                {/* Console Header Bar */}
                <div className="nos-console-top-bar">
                  <div className="nos-console-tag">
                    <Activity size={13} color="#60A5FA" />
                    <span>C4 LIVE TELEMETRY // CDMX</span>
                  </div>
                  <div className="nos-console-equalizer">
                    <span className="eq-bar eq-1" />
                    <span className="eq-bar eq-2" />
                    <span className="eq-bar eq-3" />
                    <span className="eq-bar eq-4" />
                  </div>
                </div>

                {/* Animated Diagnostics HUD Stage */}
                <div className="nos-lab-lottie-stage">
                  <div className="nos-lottie-reticle" />
                  <div className="nos-lottie-display-box">
                    {React.createElement(currentBench.component)}
                  </div>
                </div>

                {/* Bench Telemetry Readout */}
                <div className="nos-console-info">
                  <div className="nos-console-stage-num">
                    FASE 0{activeBench + 1} DE 04 · PROTOCOLO EN CURSO
                  </div>
                  <h3 className="nos-console-title">{currentBench.title}</h3>
                  <p className="nos-console-desc">{currentBench.subtitle}</p>

                  <div className="nos-console-data-grid">
                    <div className="nos-cdata-item">
                      <span className="nos-cdata-lbl">{currentBench.lblA}</span>
                      <span className="nos-cdata-val">{currentBench.metricA}</span>
                    </div>
                    <div className="nos-cdata-item">
                      <span className="nos-cdata-lbl">{currentBench.lblB}</span>
                      <span className="nos-cdata-val">{currentBench.metricB}</span>
                    </div>
                  </div>

                  {/* Quick-Switch Pills */}
                  <div className="nos-console-nav-pills">
                    <span className="nos-nav-pills-lbl">Banco:</span>
                    {testBenches.map((tb, idx) => (
                      <button
                        key={tb.id}
                        type="button"
                        onClick={() => scrollToBench(idx)}
                        className={`nos-nav-pill-btn ${activeBench === idx ? 'is-active' : ''}`}
                        title={tb.title}
                      >
                        0{idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenQuote?.(`Auditoría de Laboratorio (${currentBench.code})`)}
                    className="nos-console-cta"
                  >
                    <span>Auditar este Componente en tu Proyecto</span>
                    <ArrowRight size={14} />
                  </button>
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
