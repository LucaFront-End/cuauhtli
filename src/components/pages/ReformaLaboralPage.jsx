import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  Clock,
  AlertTriangle,
  FileCheck2,
  Cpu,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Phone,
  MessageSquare,
  Network,
  Lock,
  Layers,
  FileText,
  BadgeAlert,
  ScanFace,
  Fingerprint,
  Radio,
  Warehouse,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Hammer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './ReformaLaboralPage.css';

export default function ReformaLaboralPage({ onOpenQuote, onNavigateHome, onNavigateService }) {
  // Navigation to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Reforma Laboral 40 Horas & Reloj Checador Biométrico STPS | Sistemas Cuauhtli';
  }, []);

  // Live HUD simulated clock
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString('es-MX'));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-MX'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero Master Switch & Radial Ripple Wave (Idea 3: Todo el Hero)
  const [heroMode, setHeroMode] = useState('compliant'); // 'compliant' | 'vulnerable'
  const [isWiping, setIsWiping] = useState(false);
  const [rippleClass, setRippleClass] = useState('');

  const triggerHeroTransition = (targetMode) => {
    if (targetMode === heroMode || isWiping) return;
    setIsWiping(true);
    setRippleClass(`animating-${targetMode}`);

    // Sincronizar el cambio de contenido en la cresta de la onda expansiva
    setTimeout(() => {
      setHeroMode(targetMode);
    }, 180);

    setTimeout(() => {
      setIsWiping(false);
      setRippleClass('');
    }, 650);
  };

  // Simulator State
  const [employees, setEmployees] = useState(65);
  const [branches, setBranches] = useState(2);
  const [currentMethod, setCurrentMethod] = useState('paper'); // 'paper' | 'excel' | 'rfid' | 'standalone'

  // Hardware Tab State
  const [activeHwTab, setActiveHwTab] = useState('facial'); // 'facial' | 'hybrid' | 'software' | 'turnstile'

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Quick Inline Form State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmployees, setFormEmployees] = useState('50-150');
  const [formSent, setFormSent] = useState(false);

  // Dynamic STPS Fine and Risk Calculations
  // Valor UMA diario 2026/2027 aprox = $117.31 MXN
  // Multas LFT: de 250 a 5,000 UMA por trabajador/infracción = $29,327 a $586,550+ MXN
  const calculateRisk = () => {
    const umaUnit = 117.31;
    let baseUmaMin = 250;
    let baseUmaMax = 5000;
    let riskLevel = 'CRÍTICO';
    let riskClass = 'critico';
    let legalDiagnosis = '';

    if (currentMethod === 'paper') {
      riskLevel = 'RIESGO CRÍTICO';
      riskClass = 'critico';
      baseUmaMin = 500;
      baseUmaMax = 5000;
      legalDiagnosis = 'Las listas en papel carecen de validez legal ante el Tribunal Laboral y la STPS. Al no ser inalterables ni contar con sellos de tiempo, la empresa queda indefensa ante reclamos de horas extraordinarias y multas directas de hasta 5,000 UMA.';
    } else if (currentMethod === 'excel') {
      riskLevel = 'RIESGO ALTO';
      riskClass = 'alto';
      baseUmaMin = 350;
      baseUmaMax = 4200;
      legalDiagnosis = 'Los archivos de Excel son editables y fácilmente manipulables. La STPS exige sistemas electrónicos cerrados, encriptados y con bitácoras de auditoría no modificables a partir del 1 de enero de 2027.';
    } else if (currentMethod === 'rfid') {
      riskLevel = 'RIESGO ELEVADO (SUPLANTACIÓN)';
      riskClass = 'alto';
      baseUmaMin = 250;
      baseUmaMax = 3000;
      legalDiagnosis = 'Las tarjetas o PIN permiten la checada cruzada entre compañeros ("buddy punching"), inflando falsamente el cómputo de horas extra sin presencia física comprobable.';
    } else {
      riskLevel = 'RIESGO MODERADO';
      riskClass = 'moderado';
      baseUmaMin = 250;
      baseUmaMax = 1800;
      legalDiagnosis = 'El equipo biométrico actual no está centralizado ni homologado para calcular automáticamente la transición de 48 a 40 horas ni separar horas dobles y triples según la LFT.';
    }

    const minFineMxn = Math.round(baseUmaMin * umaUnit);
    const maxFineMxn = Math.round(baseUmaMax * umaUnit);
    // Contingencia por horas extras estimadas
    const overtimeExposure = Math.round(employees * 1250 * (currentMethod === 'paper' ? 2.5 : 1.2));
    const suggestedTerminals = Math.max(branches, Math.ceil(employees / 60));

    return {
      riskLevel,
      riskClass,
      minFineMxn,
      maxFineMxn,
      baseUmaMin,
      baseUmaMax,
      legalDiagnosis,
      overtimeExposure,
      suggestedTerminals
    };
  };

  const riskData = calculateRisk();

  const handleInlineFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const msg = encodeURIComponent(
      `Hola Sistemas Cuauhtli! 👋 Solicito Asesoría y Levantamiento Técnico para la Reforma Laboral 40 Horas / Registro STPS 2027:\n` +
      `🏢 Empresa: ${formCompany || 'No especificada'}\n` +
      `👤 Contacto: ${formName}\n` +
      `📞 Teléfono: ${formPhone}\n` +
      `👥 Rango de Colaboradores: ${formEmployees}\n` +
      `⚖️ Método actual: ${currentMethod}\n` +
      `📍 Solicitud urgente de blindaje ante multas STPS.`
    );

    setTimeout(() => {
      window.open(`https://wa.me/525585262115?text=${msg}`, '_blank');
      setTimeout(() => {
        setFormSent(false);
      }, 3000);
    }, 1000);
  };

  const hardwareCatalog = {
    facial: {
      title: 'Terminal Facial MinMoe con Inteligencia Artificial',
      tagline: 'Reconocimiento biométrico <0.2s con Deep Learning Anti-Spoofing',
      desc: 'Ideal para accesos corporativos, plantas y naves industriales. Su algoritmo de inteligencia artificial verifica el rostro vivo e impide fraudes con fotos, videos o máscaras. Opera sin contacto físico (zero-touch), garantizando máxima higiene y rapidez en cambios de turno masivos.',
      specs: [
        { label: 'Velocidad de Verificación', val: '< 0.2 segundos por persona' },
        { label: 'Cámara Dual con IA', val: 'Lente infrarrojo para cero luz o contraluz' },
        { label: 'Capacidad de Usuarios', val: 'Hasta 10,000 rostros y 150,000 eventos' },
        { label: 'Registro Inalterable STPS', val: 'Firma criptográfica con marca de tiempo' },
      ],
      icon: ScanFace
    },
    hybrid: {
      title: 'Terminal Híbrida Huella Dactilar + Tarjeta RFID IP65',
      tagline: 'Grado rudo para entornos de manufactura, talleres y bodegas',
      desc: 'Diseñada específicamente para entornos agresivos con polvo, grasa o humedad. Combina un lector de huella óptico patentado resistente a rayones con lectura de tarjetas Mifare/Desfire de alta seguridad.',
      specs: [
        { label: 'Protección Ambiental', val: 'Grado IP65 e impacto IK08' },
        { label: 'Sensor Biométrico', val: 'Lector óptico con detección de huella viva' },
        { label: 'Memoria Offline', val: 'Hasta 100,000 marcajes sin conexión' },
        { label: 'Batería de Respaldo', val: 'Operación continua ante cortes de luz' },
      ],
      icon: Fingerprint
    },
    software: {
      title: 'Plataforma Centralizada Multi-Sede (HikCentral / Cloud)',
      tagline: 'Control total de todas sus sucursales desde la oficina central',
      desc: 'Administre empleados, turnos escalonados de 40 horas, retardos y horas extras de 1 a más de 50 sucursales en toda la República Mexicana sin necesidad de desplazarse. Descargue reportes ejecutivos listos para inspecciones de la STPS.',
      specs: [
        { label: 'Gestión Multi-Sucursal', val: 'Concentración en un solo servidor o nube' },
        { label: 'Auditoría de Horas Extra', val: 'Cálculo automático de horas dobles y triples' },
        { label: 'Integración a Nómina', val: 'Exportación a CONTPAQi, Aspel NOI, SAP' },
        { label: 'Alertas en Tiempo Real', val: 'Aviso inmediato si un empleado rebasa topes LFT' },
      ],
      icon: Network
    },
    turnstile: {
      title: 'Torniquetes y Barreras Peatonales de Acero Inoxidable',
      tagline: 'Control de paso físico estricto de hasta 45 personas por minuto',
      desc: 'Integración mecánica y electrónica directa con los relojes checadores Hikvision. Impide físicamente el ingreso a las instalaciones a personal no autorizado o fuera de su turno asignado, asegurando que nadie labore horas no programadas.',
      specs: [
        { label: 'Material de Fabricación', val: 'Acero inoxidable AISI 304 anti-corrosión' },
        { label: 'Flujo de Personal', val: '35 a 45 personas por minuto por carril' },
        { label: 'Mecanismo Bidireccional', val: 'Control de entrada y salida independiente' },
        { label: 'Desbloqueo de Emergencia', val: 'Apertura automática ante alarma de incendios' },
      ],
      icon: Building2
    }
  };

  const faqs = [
    {
      q: '¿Por qué la reforma laboral de 48 a 40 horas hace indispensable un reloj checador biométrico electrónico?',
      a: 'Con la reducción gradual de la jornada semanal de 48 a 40 horas, el margen para tolerar discrepancias en el horario se reduce a cero. Si su empresa no cuenta con un sistema electrónico exacto, cualquier retraso o tiempo adicional se considerará hora extra sujeta a demandas laborales. Además, a partir del 1 de enero de 2027, la STPS exige que el registro sea 100% digital, trazable y no alterable.'
    },
    {
      q: '¿Las listas de asistencia en papel o firmas en libreta siguen teniendo validez jurídica?',
      a: 'No. En los juicios individuales y colectivos ante los Tribunales Laborales y el Centro Federal de Conciliación y Registro Laboral (CFCRL), las listas de papel son fácilmente objetadas por falsedad de firma o alteración manual. La carga de la prueba recae 100% sobre el patrón (Artículo 784 de la LFT). Sin un registro electrónico inalterable con biometría, el juez condenará automáticamente al pago íntegro de las horas extras reclamadas por el trabajador.'
    },
    {
      q: '¿A cuánto pueden ascender las multas de la STPS por no contar con registro de asistencia electrónico?',
      a: 'El marco sancionador de la Ley Federal del Trabajo (Artículos 992, 1000 y 1002) establece multas de 250 a 5,000 Unidades de Medida y Actualización (UMA). Esto equivale a sanciones económicas que van desde los $29,300 hasta superar los $586,000 MXN por cada centro de trabajo o colaborador auditado, acumulándose en caso de reincidencia o desacato a la inspección federal.'
    },
    {
      q: '¿Cómo controla el sistema las horas extras dobles y triples bajo los topes de la LFT?',
      a: 'La Ley Federal del Trabajo establece que el tiempo extraordinario no puede exceder de 3 horas diarias ni de 3 veces a la semana (máximo 9 horas semanales pagaderas al 200%). El excedente debe liquidarse al 300% (horas triples). Nuestra solución audita cada marcaje en tiempo real, bloquea excesos no autorizados y emite reportes desglosados exactos compatibles con su sistema de nómina (CONTPAQi, Aspel NOI, SAP).'
    },
    {
      q: 'Tengo sucursales en CDMX, Monterrey, Guadalajara y Querétaro. ¿Cómo se administra?',
      a: 'Implementamos la plataforma centralizada Hikvision (HikCentral o Cloud). Todos los relojes checadores de sus diferentes sedes reportan a través de una red segura hacia su servidor corporativo. Desde la oficina central, el área de Recursos Humanos puede monitorear las checadas en tiempo real, registrar altas de empleados y descargar reportes consolidados sin tener que trasladarse a ninguna sucursal.'
    },
    {
      q: '¿Qué sucede si se interrumpe el internet o el suministro eléctrico en una de nuestras plantas?',
      a: 'Los equipos Hikvision que suministramos en Sistemas Cuauhtli cuentan con memoria interna no volátil capaz de almacenar hasta 100,000 marcajes de manera offline. En cuanto se restablece la red, los datos se sincronizan automáticamente con el servidor central con su timestamp original. Asimismo, instalamos baterías de respaldo UPS para garantizar operación ininterrumpida.'
    },
    {
      q: '¿Cumple la solución con la Ley Federal de Protección de Datos Personales (LFPDPPP)?',
      a: 'Absolutamente. Las terminales faciales y de huella dactilar de Hikvision no almacenan imágenes de las fotografías ni huellas en formato editable; convierten los rasgos biométricos en un hash matemático unidireccional encriptado (algoritmo AES-256), asegurando estricto cumplimiento con las regulaciones mexicanas e internacionales en materia de privacidad de datos.'
    }
  ];

  const currentHw = hardwareCatalog[activeHwTab];
  const CurrentHwIcon = currentHw.icon;

  return (
    <div className="reforma-page">

      {/* 0. SUBNAV BREADCRUMBS BAR */}
      <div className="reforma-subnav-bar">
        <div className="reforma-subnav-inner">
          <nav className="reforma-breadcrumbs" aria-label="Breadcrumb">
            <button className="reforma-back-btn" onClick={() => onNavigateHome?.()}>
              <ArrowLeft size={14} />
              <span>Inicio</span>
            </button>
            <span className="reforma-breadcrumb-sep">/</span>
            <span>Soluciones Especiales</span>
            <span className="reforma-breadcrumb-sep">/</span>
            <span className="reforma-breadcrumb-current">Reforma Laboral 40 Horas & STPS 2027</span>
          </nav>
          <div className="reforma-subnav-badge">
            <ShieldCheck size={13} color="#991B1B" />
            <span>NORMA OFICIAL VIGENTE</span>
          </div>
        </div>
      </div>

      {/* 1. TOP REGULATORY ALERT TICKER */}
      <div className="reforma-top-ticker">
        <div className="reforma-ticker-inner">
          <div className="reforma-ticker-tag">
            <span className="reforma-ticker-pulse" />
            <span>STPS & LFT • Criterio de Cumplimiento 2026-2027</span>
          </div>
          <div className="reforma-ticker-text">
            <strong>AVISO OBLIGATORIO:</strong> A partir del 1 de enero de 2027 es obligatorio contar con registro electrónico inalterable de asistencia. Sanciones de <strong>250 a 5,000 UMA ($586,000+ MXN)</strong> por incumplimiento.
          </div>
          <button 
            className="reforma-ticker-action"
            onClick={() => {
              const el = document.getElementById('simulador-multas');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Calcular Multa</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 2. HERO SECTION CON MASTER TOGGLE Y ONDA EXPANSIVA FORENSE (IDEA 3) */}
      <header className={`reforma-hero ${heroMode}`}>
        
        {/* Radial Ripple Wave Overlay */}
        <div className={`reforma-ripple-wave ${rippleClass}`} />

        {/* Master Switch Bar (Centrado arriba del Hero) */}
        <div className="reforma-master-switch-bar">
          <div className="reforma-master-switch-container">
            <button
              type="button"
              className={`reforma-master-toggle-btn ${heroMode === 'vulnerable' ? 'active vulnerable' : ''}`}
              onClick={() => triggerHeroTransition('vulnerable')}
            >
              <AlertTriangle size={15} />
              <span>Escenario A: Sin Registro Homologado (Riesgo)</span>
            </button>

            <button
              type="button"
              className={`reforma-master-toggle-btn ${heroMode === 'compliant' ? 'active compliant' : ''}`}
              onClick={() => triggerHeroTransition('compliant')}
            >
              <ShieldCheck size={15} />
              <span>Escenario B: Con Sistemas Cuauhtli (Blindado)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Hero Content Container with smooth fade on wipe */}
        <div className={`reforma-hero-dynamic-content ${isWiping ? 'fading' : ''}`}>
          <div className="reforma-hero-container">
            
            {/* LEFT COLUMN: DYNAMIC VALUE PROPOSITION */}
            <div>
              {heroMode === 'vulnerable' ? (
                <>
                  <div className="reforma-hero-badge vulnerable">
                    <AlertTriangle size={14} />
                    <span>DIAGNÓSTICO STPS: ALTO RIESGO DE INFRACCIÓN LABORAL</span>
                  </div>

                  <h1 className="reforma-hero-title">
                    De 48 a 40 Horas: <span className="reforma-title-alert">La Falta de Registro Electrónico</span> Expone a tu Empresa a Multas de $586,000+ MXN
                  </h1>

                  <p className="reforma-hero-desc">
                    Operar con listas de papel, firmas en libreta o archivos de Excel 
                    <strong> carece de validez probatoria ante el Tribunal Laboral</strong>. 
                    Bajo el Artículo 784 de la LFT, el patrón tiene la carga de la prueba; sin un sistema digital inalterable, 
                    cualquier controversia sobre la nueva jornada reducida se resuelve automáticamente a favor del trabajador.
                  </p>

                  {/* 4 Metric Pills: Vulnerable */}
                  <div className="reforma-hero-metrics-pill">
                    <div className="reforma-hero-pill-item vulnerable-pill">
                      <ShieldAlert className="reforma-pill-icon" size={20} />
                      <div className="reforma-pill-text alert-text">
                        <strong>Hasta 5,000 UMA ($586k)</strong>
                        Sanciones acumulables por inspección STPS.
                      </div>
                    </div>
                    <div className="reforma-hero-pill-item vulnerable-pill">
                      <Clock className="reforma-pill-icon" size={20} />
                      <div className="reforma-pill-text alert-text">
                        <strong>Litigios de Horas Extra</strong>
                        Disputas por horas dobles y triples no auditadas.
                      </div>
                    </div>
                    <div className="reforma-hero-pill-item vulnerable-pill">
                      <XCircle className="reforma-pill-icon" size={20} />
                      <div className="reforma-pill-text alert-text">
                        <strong>Nula Validez ante Juez</strong>
                        Listas de papel desechadas por fragilidad pericial.
                      </div>
                    </div>
                    <div className="reforma-hero-pill-item vulnerable-pill">
                      <Users className="reforma-pill-icon" size={20} />
                      <div className="reforma-pill-text alert-text">
                        <strong>Suplantación Continua</strong>
                        Checadas cruzadas entre compañeros en planta.
                      </div>
                    </div>
                  </div>

                  {/* Actions: Vulnerable */}
                  <div className="reforma-hero-actions">
                    <button 
                      className="reforma-btn-primary"
                      style={{ background: 'linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)' }}
                      onClick={() => onOpenQuote('Diagnóstico de Riesgo Urgente (Reforma 40H / Sin Registro STPS)')}
                    >
                      <ShieldAlert size={18} />
                      <span>Eliminar este Riesgo: Solicitar Auditoría Gratuita</span>
                    </button>

                    <button 
                      className="reforma-btn-secondary"
                      onClick={() => {
                        const el = document.getElementById('simulador-multas');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <Scale size={16} />
                      <span>Simular Multa Específica</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="reforma-hero-badge compliant">
                    <ShieldCheck size={14} />
                    <span>CERTIFICACIÓN OFICIAL: BLINDAJE STPS & LFT 2027</span>
                  </div>

                  <h1 className="reforma-hero-title">
                    De 48 a 40 Horas: <span className="reforma-title-gradient">Blindaje Biométrico Inalterable</span> y Cero Sanciones con Cuauhtli
                  </h1>

                  <p className="reforma-hero-desc">
                    Garantizamos certeza jurídica y operativa total mediante terminales 
                    <strong> Hikvision MinMoe AI con reconocimiento en menos de 0.2 segundos</strong>. 
                    Bitácoras electrónicas selladas con hash criptográfico SHA-256, auditoría automática de horas dobles y triples, 
                    y reportes ejecutivos listos en 1 clic ante cualquier inspección federal del trabajo.
                  </p>

                  {/* 4 Metric Pills: Compliant */}
                  <div className="reforma-hero-metrics-pill">
                    <div className="reforma-hero-pill-item compliant-pill">
                      <ShieldCheck className="reforma-pill-icon" size={20} />
                      <div className="reforma-pill-text success-text">
                        <strong>$0 MXN en Sanciones</strong>
                        100% blindado ante inspecciones STPS 2027.
                      </div>
                    </div>
                    <div className="reforma-hero-pill-item compliant-pill">
                      <Clock className="reforma-pill-icon" size={20} />
                      <div className="reforma-pill-text success-text">
                        <strong>Auditoría Automática LFT</strong>
                        Desglose exacto y topes de 3h diarias respetados.
                      </div>
                    </div>
                    <div className="reforma-hero-pill-item compliant-pill">
                      <Lock className="reforma-pill-icon" size={20} />
                      <div className="reforma-pill-text success-text">
                        <strong>Plena Validez Jurídica</strong>
                        Prueba pericial digital con sello de tiempo NTP inmutable.
                      </div>
                    </div>
                    <div className="reforma-hero-pill-item compliant-pill">
                      <ScanFace className="reforma-pill-icon" size={20} />
                      <div className="reforma-pill-text success-text">
                        <strong>Facial AI en &lt; 0.2s</strong>
                        Algoritmo anti-spoofing con 99.98% de rostro vivo.
                      </div>
                    </div>
                  </div>

                  {/* Actions: Compliant */}
                  <div className="reforma-hero-actions">
                    <button 
                      className="reforma-btn-primary"
                      onClick={() => onOpenQuote('Control de Asistencia Biométrico (Reforma Laboral 40 Horas / STPS)')}
                    >
                      <FileCheck2 size={18} />
                      <span>Solicitar Levantamiento Técnico Sin Costo</span>
                    </button>

                    <button 
                      className="reforma-btn-secondary"
                      onClick={() => {
                        const el = document.getElementById('simulador-multas');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <Scale size={16} />
                      <span>Simulador de Riesgo y Sanciones</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT COLUMN: DYNAMIC STATE CARD (IDEA 3) */}
            <div className={`reforma-hero-state-card ${heroMode}`}>
              
              <div className="reforma-state-card-header">
                <span className="reforma-state-card-lbl">
                  {heroMode === 'vulnerable' ? (
                    <>
                      <AlertTriangle size={15} />
                      <span>Expediente de Auditoría STPS</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={15} />
                      <span>Dictamen Técnico Cuauhtli</span>
                    </>
                  )}
                </span>

                <span className={`reforma-state-badge ${heroMode}`}>
                  {heroMode === 'vulnerable' ? 'No Conforme' : 'Conforme STPS'}
                </span>
              </div>

              <h3 className="reforma-state-card-title">
                {heroMode === 'vulnerable' 
                  ? 'Diagnóstico: Empresa en Riesgo Crítico' 
                  : 'Certificación: Empresa Blindada ante la Ley'}
              </h3>
              
              <p className="reforma-state-card-desc">
                {heroMode === 'vulnerable'
                  ? 'La empresa opera sin infraestructura biométrica inalterable, dejándola desprotegida ante multas federales y demandas laborales.'
                  : 'Infraestructura biométrica de grado pericial instalada, centralizada y homologada conforme a los criterios STPS 2027.'}
              </p>

              {/* Checklist */}
              <ul className="reforma-state-checklist">
                {heroMode === 'vulnerable' ? (
                  <>
                    <li className="reforma-state-check-item">
                      <XCircle size={17} className="reforma-check-icon bad" />
                      <div>
                        <strong>Registro manual en papel o Excel:</strong> Fácilmente alterable sin valor probatorio ante el juez.
                      </div>
                    </li>
                    <li className="reforma-state-check-item">
                      <XCircle size={17} className="reforma-check-icon bad" />
                      <div>
                        <strong>Horas extras sin auditar:</strong> Reclamos de horas triples acumuladas por falta de bitácora digital.
                      </div>
                    </li>
                    <li className="reforma-state-check-item">
                      <XCircle size={17} className="reforma-check-icon bad" />
                      <div>
                        <strong>Sanción federal potencial:</strong> Multas de 250 a 5,000 UMA ($29,327 a $586,550+ MXN).
                      </div>
                    </li>
                    <li className="reforma-state-check-item">
                      <XCircle size={17} className="reforma-check-icon bad" />
                      <div>
                        <strong>Carga de la prueba patronal perdida:</strong> Condena automática al pago del tiempo reclamado por el empleado.
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="reforma-state-check-item">
                      <CheckCircle2 size={17} className="reforma-check-icon good" />
                      <div>
                        <strong>Terminal Facial MinMoe con IA:</strong> Autenticación en &lt; 0.2s sin contacto ni filas de acceso.
                      </div>
                    </li>
                    <li className="reforma-state-check-item">
                      <CheckCircle2 size={17} className="reforma-check-icon good" />
                      <div>
                        <strong>Registro inmutable con Hash SHA-256:</strong> Sellos de tiempo oficiales NTP con pleno valor pericial.
                      </div>
                    </li>
                    <li className="reforma-state-check-item">
                      <CheckCircle2 size={17} className="reforma-check-icon good" />
                      <div>
                        <strong>Auditoría automática de 40 Horas:</strong> Desglose contable de horas dobles y triples listo para nómina.
                      </div>
                    </li>
                    <li className="reforma-state-check-item">
                      <CheckCircle2 size={17} className="reforma-check-icon good" />
                      <div>
                        <strong>Plataforma Multi-Sede Centralizada:</strong> Monitoreo de todas sus sucursales desde una sola pantalla.
                      </div>
                    </li>
                  </>
                )}
              </ul>

              {/* Summary Callout Box */}
              <div className="reforma-state-summary-box">
                {heroMode === 'vulnerable' ? (
                  <>
                    <strong>⚠️ Contingencia Estimada: $380,000 – $1,200,000 MXN</strong>
                    <span>La transición a 40 horas sin reloj checador homologado genera un pasivo laboral inmediato en nómina y multas.</span>
                  </>
                ) : (
                  <>
                    <strong>🛡️ Dictamen de Cumplimiento: 100% Protegido</strong>
                    <span>Solución llave en mano de Sistemas Cuauhtli implementada en 48 a 72 horas con póliza de garantía y soporte local en CDMX.</span>
                  </>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="reforma-state-cta-btn"
                onClick={() => onOpenQuote(
                  heroMode === 'vulnerable' 
                    ? 'Blindaje Urgente contra Multas STPS (Reforma 40 Horas)' 
                    : 'Cotización de Solución Biométrica Homologada 40H STPS'
                )}
              >
                {heroMode === 'vulnerable' ? (
                  <>
                    <ShieldAlert size={16} />
                    <span>Blindar mi Empresa con Cuauhtli</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Solicitar Levantamiento Técnico</span>
                  </>
                )}
                <ArrowRight size={15} />
              </button>

            </div>

          </div>
        </div>

      </header>

      {/* 3. CRONOGRAMA & RUTA CRÍTICA DE LA REFORMA (4 FASES) */}
      <section className="reforma-section">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <Clock size={15} />
            <span>Cronograma de Implementación Obligatoria</span>
          </div>
          <h2 className="reforma-section-title">
            Ruta de Transición 48h a 40h: Fechas Clave y Exigencias STPS
          </h2>
          <p className="reforma-section-subtitle">
            La autoridad laboral no admitirá prórrogas. Adaptar la infraestructura de control de asistencia antes de la fecha límite es la única garantía para evitar contingencias legales y multas automáticas.
          </p>
        </div>

        <div className="reforma-timeline-track">
          
          <div className="reforma-timeline-step active">
            <div className="reforma-timeline-dot">01</div>
            <div className="reforma-step-date">Fase Actual • 2026</div>
            <h3 className="reforma-step-title">Auditoría Previa y Adecuación</h3>
            <p className="reforma-step-desc">
              Revisión técnica de puntos de acceso, contratos individuales y actualización del Reglamento Interior de Trabajo ante el CFCRL.
            </p>
            <span className="reforma-step-badge warning">En Proceso Urgente</span>
          </div>

          <div className="reforma-timeline-step mandatory">
            <div className="reforma-timeline-dot">02</div>
            <div className="reforma-step-date">1 de Enero de 2027</div>
            <h3 className="reforma-step-title">Obligatoriedad Registro Electrónico</h3>
            <p className="reforma-step-desc">
              Entrada en vigor del registro electrónico inalterable obligatorio. Prohibición total de listas de papel o registros editables.
            </p>
            <span className="reforma-step-badge danger">Fecha Límite Legal</span>
          </div>

          <div className="reforma-timeline-step">
            <div className="reforma-timeline-dot">03</div>
            <div className="reforma-step-date">Transición Escalonada</div>
            <h3 className="reforma-step-title">Reducción Progresiva 48h ➔ 40h</h3>
            <p className="reforma-step-desc">
              Ajuste operativo de turnos laborales. Monitoreo diario del nuevo límite de jornada y fiscalización estricta del tope de horas extra.
            </p>
            <span className="reforma-step-badge warning">Ajuste de Turnos</span>
          </div>

          <div className="reforma-timeline-step future">
            <div className="reforma-timeline-dot">04</div>
            <div className="reforma-step-date">Permanente</div>
            <h3 className="reforma-step-title">Inspecciones STPS & Juicios</h3>
            <p className="reforma-step-desc">
              Auditorías laborales aleatorias. La empresa debe presentar bitácoras digitales instantáneas o enfrentar multas de hasta 5,000 UMA.
            </p>
            <span className="reforma-step-badge success">Blindaje Total</span>
          </div>

        </div>
      </section>

      {/* 4. SIMULADOR INTERACTIVO DE RIESGO Y MULTAS STPS */}
      <section className="reforma-section" id="simulador-multas">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <Scale size={15} />
            <span>Herramienta de Diagnóstico Preliminar</span>
          </div>
          <h2 className="reforma-section-title">
            Simulador de Riesgo y Multas Laborales STPS
          </h2>
          <p className="reforma-section-subtitle">
            Calcule la exposición legal y financiera de su empresa según el tamaño de su plantilla y el método que utiliza actualmente para registrar la asistencia.
          </p>
        </div>

        <div className="reforma-calc-card">
          
          {/* Controls */}
          <div className="reforma-calc-controls">
            
            {/* Employees Slider */}
            <div className="reforma-calc-group">
              <div className="reforma-calc-label-row">
                <span>Número de Colaboradores:</span>
                <span className="reforma-calc-value-badge">{employees} trabajadores</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="1000" 
                step="5"
                value={employees} 
                onChange={(e) => setEmployees(parseInt(e.target.value))}
                className="reforma-slider"
              />
            </div>

            {/* Branches Slider */}
            <div className="reforma-calc-group">
              <div className="reforma-calc-label-row">
                <span>Número de Sedes / Sucursales:</span>
                <span className="reforma-calc-value-badge">{branches} {branches === 1 ? 'ubicación' : 'ubicaciones'}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="25" 
                value={branches} 
                onChange={(e) => setBranches(parseInt(e.target.value))}
                className="reforma-slider"
              />
            </div>

            {/* Attendance Method Toggle */}
            <div className="reforma-calc-group">
              <div className="reforma-calc-label-row">
                <span>¿Cómo registran la asistencia actualmente?</span>
              </div>
              <div className="reforma-method-options">
                <button 
                  className={`reforma-method-btn ${currentMethod === 'paper' ? 'selected' : ''}`}
                  onClick={() => setCurrentMethod('paper')}
                >
                  <XCircle size={16} color="#F87171" />
                  <span>Listas en Papel / Libreta</span>
                </button>

                <button 
                  className={`reforma-method-btn ${currentMethod === 'excel' ? 'selected' : ''}`}
                  onClick={() => setCurrentMethod('excel')}
                >
                  <FileText size={16} color="#FBBF24" />
                  <span>Excel / Archivo Digital Manual</span>
                </button>

                <button 
                  className={`reforma-method-btn ${currentMethod === 'rfid' ? 'selected' : ''}`}
                  onClick={() => setCurrentMethod('rfid')}
                >
                  <BadgeAlert size={16} color="#F59E0B" />
                  <span>Tarjetas RFID / PIN (Sin Biometría)</span>
                </button>

                <button 
                  className={`reforma-method-btn ${currentMethod === 'standalone' ? 'selected' : ''}`}
                  onClick={() => setCurrentMethod('standalone')}
                >
                  <Cpu size={16} color="#38BDF8" />
                  <span>Biométrico Aislado (Sin Nube)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Results Output Box */}
          <div className="reforma-calc-results">
            <div className="reforma-results-header">
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Diagnóstico de Cumplimiento
              </span>
              <div className={`reforma-risk-pill ${riskData.riskClass}`}>
                <AlertTriangle size={14} />
                <span>{riskData.riskLevel}</span>
              </div>
            </div>

            <div className="reforma-fine-box">
              <div className="reforma-fine-uma">
                Rango de Multa Potencial STPS ({riskData.baseUmaMin} a {riskData.baseUmaMax} UMA):
              </div>
              <div className="reforma-fine-amount">
                ${riskData.minFineMxn.toLocaleString('es-MX')} – ${riskData.maxFineMxn.toLocaleString('es-MX')} MXN
              </div>
              <div className="reforma-fine-note">
                Sanción legal fundamentada en los artículos 992 y 1002 de la Ley Federal del Trabajo por ausencia de registro electrónico fidedigno.
              </div>
            </div>

            <div className="reforma-results-breakdown">
              <div className="reforma-breakdown-row">
                <span>Riesgo en Demandas de Horas Extra:</span>
                <strong>Hasta ${riskData.overtimeExposure.toLocaleString('es-MX')} MXN anual</strong>
              </div>
              <div className="reforma-breakdown-row">
                <span>Terminales Biométricas Sugeridas:</span>
                <strong>{riskData.suggestedTerminals} equipos Hikvision MinMoe</strong>
              </div>
              <div className="reforma-breakdown-row">
                <span>Tiempo de Instalación Llave en Mano:</span>
                <strong>48 a 72 Horas Hábiles</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.45, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
              {riskData.legalDiagnosis}
            </p>

            <button 
              className="reforma-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onOpenQuote(`Diagnóstico STPS: ${employees} empleados, ${branches} sedes, método actual: ${currentMethod}`)}
            >
              <ShieldCheck size={18} />
              <span>Agendar Auditoría Técnica de Blindaje</span>
            </button>
          </div>

        </div>
      </section>

      {/* 5. LOS 4 PILARES EXIGIDOS POR LA AUTORIDAD LABORAL */}
      <section className="reforma-section">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <Lock size={15} />
            <span>Marco Legal y Operativo</span>
          </div>
          <h2 className="reforma-section-title">
            Los 4 Pilares de Cumplimiento Técnico y Jurídico
          </h2>
          <p className="reforma-section-subtitle">
            Al igual que en las salas de juicios orales o normativas de protección civil, la ley no deja espacio a la discrecionalidad: el sistema debe cumplir con los cuatro requerimientos estrictos fijados por la STPS.
          </p>
        </div>

        <div className="reforma-pillars-grid">
          
          {/* Pillar 1 */}
          <div className="reforma-pillar-card">
            <div className="reforma-pillar-top">
              <div className="reforma-pillar-icon">
                <Cpu size={24} />
              </div>
              <div>
                <span className="reforma-pillar-tag">Pilar 01 • Obligatoriedad 2027</span>
                <h3 className="reforma-pillar-title">Registro Electrónico Inalterable</h3>
              </div>
            </div>
            <p className="reforma-pillar-desc">
              A partir del 1 de enero de 2027, el control de asistencia debe ser obligatoriamente digital, trazable y sin posibilidad técnica de alteración o borrado manual.
            </p>
            <ul className="reforma-pillar-bullets">
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Logs criptográficos inmutables con sello de tiempo sincronizado NTP.</span>
              </li>
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Biometría facial con IA que anula el 100% de la suplantación de identidad.</span>
              </li>
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Almacenamiento redundante en servidor local y respaldo en nube segura.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="reforma-pillar-card">
            <div className="reforma-pillar-top">
              <div className="reforma-pillar-icon">
                <Clock size={24} />
              </div>
              <div>
                <span className="reforma-pillar-tag">Pilar 02 • Artículos 66, 67 y 68 LFT</span>
                <h3 className="reforma-pillar-title">Control Estricto de Horas Extraordinarias</h3>
              </div>
            </div>
            <p className="reforma-pillar-desc">
              Auditoría en tiempo real para respetar los topes legales de jornada (máximo 3 horas diarias y no más de 3 veces por semana), calculando con exactitud matemática su remuneración.
            </p>
            <ul className="reforma-pillar-bullets">
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Desglose contable transparente de horas dobles (primeras 9h) y horas triples.</span>
              </li>
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Alertas preventivas automáticas a supervisores cuando un operario rebasa topes.</span>
              </li>
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Exportación limpia y directa hacia CONTPAQi Nóminas, Aspel NOI y SAP.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="reforma-pillar-card">
            <div className="reforma-pillar-top">
              <div className="reforma-pillar-icon">
                <Scale size={24} />
              </div>
              <div>
                <span className="reforma-pillar-tag">Pilar 03 • Certidumbre Jurídica</span>
                <h3 className="reforma-pillar-title">Actualización Jurídica y Reglamento</h3>
              </div>
            </div>
            <p className="reforma-pillar-desc">
              Alineación de contratos individuales o colectivos y del Reglamento Interior de Trabajo depositado ante el Centro Federal de Conciliación y Registro Laboral (CFCRL).
            </p>
            <ul className="reforma-pillar-bullets">
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Evidencia pericial digital admitida con pleno valor probatorio en juicios.</span>
              </li>
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Cumplimiento estricto con la Ley de Protección de Datos Personales (LFPDPPP).</span>
              </li>
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Reducción de hasta un 92% en demandas laborales por reclamo de tiempo no laborado.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className="reforma-pillar-card">
            <div className="reforma-pillar-top">
              <div className="reforma-pillar-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="reforma-pillar-tag">Pilar 04 • Prevención Sancionatoria</span>
                <h3 className="reforma-pillar-title">Blindaje contra Multas STPS ($586k+)</h3>
              </div>
            </div>
            <p className="reforma-pillar-desc">
              Auditar a tiempo permite evitar sanciones de la autoridad laboral que pueden alcanzar de 250 a 5,000 UMA por infracción en inspecciones ordinarias o extraordinarias.
            </p>
            <ul className="reforma-pillar-bullets">
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Generación de reportes oficiales de auditoría STPS en 1 solo clic.</span>
              </li>
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Cero discrepancias entre horas laboradas en planta y recibos de nómina timbrados.</span>
              </li>
              <li className="reforma-pillar-bullet-item">
                <CheckCircle2 size={16} className="reforma-bullet-check" />
                <span>Paz laboral y respaldo institucional ante auditorías sindicales.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 6. COMPARATIVA: MÉTODO TRADICIONAL VS SOLUCIÓN CUAUTHLI */}
      <section className="reforma-section">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <Layers size={15} />
            <span>Matriz Comparativa de Cumplimiento</span>
          </div>
          <h2 className="reforma-section-title">
            ¿Por qué el Método Tradicional es un Riesgo para su Empresa?
          </h2>
          <p className="reforma-section-subtitle">
            Compare la vulnerabilidad de las libretas de firmas y hojas de cálculo frente a una solución biométrica homologada con valor probatorio legal.
          </p>
        </div>

        <div className="reforma-table-wrap">
          <table className="reforma-table">
            <thead>
              <tr>
                <th>Criterio de Evaluación</th>
                <th>Listas en Papel / Excel / Reloj Análogo</th>
                <th className="highlight-col">Solución Biométrica Cuauhtli (Hikvision)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Validez Legal ante STPS y Tribunal</strong></td>
                <td className="reforma-td-bad"><XCircle size={15} /> Nula. Se presumen ciertas las horas alegadas por el trabajador.</td>
                <td className="highlight-col reforma-td-good"><CheckCircle2 size={15} /> Total. Prueba pericial digital con fe probatoria fehaciente.</td>
              </tr>
              <tr>
                <td><strong>Trazabilidad e Inalterabilidad</strong></td>
                <td className="reforma-td-bad"><XCircle size={15} /> Fácilmente alterable o falsificable a posteriori.</td>
                <td className="highlight-col reforma-td-good"><CheckCircle2 size={15} /> 100% Inalterable. Registros sellados con Hash criptográfico.</td>
              </tr>
              <tr>
                <td><strong>Suplantación de Identidad ("Buddy Punching")</strong></td>
                <td className="reforma-td-bad"><XCircle size={15} /> Constante. Compañeros firman o checan por otros.</td>
                <td className="highlight-col reforma-td-good"><CheckCircle2 size={15} /> Cero Fraude. Biometría facial con detección de rostro vivo 3D.</td>
              </tr>
              <tr>
                <td><strong>Auditoría de Horas Extra 40 Horas</strong></td>
                <td className="reforma-td-bad"><XCircle size={15} /> Manual, lenta y con altísima tasa de errores contables.</td>
                <td className="highlight-col reforma-td-good"><CheckCircle2 size={15} /> Automática. Desglose inmediato de horas dobles y triples.</td>
              </tr>
              <tr>
                <td><strong>Control Multi-Sucursal Remoto</strong></td>
                <td className="reforma-td-bad"><XCircle size={15} /> Exige recolectar papeles o viajar periódicamente a cada sede.</td>
                <td className="highlight-col reforma-td-good"><CheckCircle2 size={15} /> Centralizado en nube o servidor local desde oficina central.</td>
              </tr>
              <tr>
                <td><strong>Riesgo de Multa STPS (250 a 5,000 UMA)</strong></td>
                <td className="reforma-td-bad"><XCircle size={15} /> Muy Alto (Hasta $586,000+ MXN por centro inspeccionado).</td>
                <td className="highlight-col reforma-td-good"><CheckCircle2 size={15} /> Eliminado. Cumplimiento íntegro de la reforma obligatoria 2027.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. HARDWARE Y ECOSISTEMA HIKVISION SHOWCASE */}
      <section className="reforma-section">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <Radio size={15} />
            <span>Equipamiento Certificado</span>
          </div>
          <h2 className="reforma-section-title">
            Tecnología Homologada para Cada Necesidad Operativa
          </h2>
          <p className="reforma-section-subtitle">
            Equipos líderes a nivel mundial con respaldo directo de fábrica, alta durabilidad y soporte técnico especializado de Sistemas Cuauhtli.
          </p>
        </div>

        {/* Tabs */}
        <div className="reforma-hardware-tabs">
          <button 
            className={`reforma-tab-btn ${activeHwTab === 'facial' ? 'active' : ''}`}
            onClick={() => setActiveHwTab('facial')}
          >
            <ScanFace size={16} />
            <span>Terminal Facial IA MinMoe</span>
          </button>

          <button 
            className={`reforma-tab-btn ${activeHwTab === 'hybrid' ? 'active' : ''}`}
            onClick={() => setActiveHwTab('hybrid')}
          >
            <Fingerprint size={16} />
            <span>Terminal Huella + RFID IP65</span>
          </button>

          <button 
            className={`reforma-tab-btn ${activeHwTab === 'software' ? 'active' : ''}`}
            onClick={() => setActiveHwTab('software')}
          >
            <Network size={16} />
            <span>Software Centralizado Multi-Sede</span>
          </button>

          <button 
            className={`reforma-tab-btn ${activeHwTab === 'turnstile' ? 'active' : ''}`}
            onClick={() => setActiveHwTab('turnstile')}
          >
            <Building2 size={16} />
            <span>Torniquetes de Flujo Masivo</span>
          </button>
        </div>

        {/* Display */}
        <div className="reforma-hardware-display">
          
          <div className="reforma-hw-preview-box">
            <CurrentHwIcon size={80} className="reforma-hw-icon-huge" />
            <div style={{ fontSize: '0.82rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              EQUIPAMIENTO DE GRADO INDUSTRIAL
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
              {currentHw.title}
            </div>
          </div>

          <div>
            <h3 className="reforma-hw-title">{currentHw.title}</h3>
            <div className="reforma-hw-tagline">{currentHw.tagline}</div>
            <p className="reforma-hw-desc">{currentHw.desc}</p>

            <div className="reforma-hw-specs-grid">
              {currentHw.specs.map((spec, i) => (
                <div key={i} className="reforma-hw-spec-item">
                  <CheckCircle2 size={16} className="reforma-spec-icon" />
                  <div className="reforma-spec-text">
                    <strong>{spec.label}</strong>
                    <span>{spec.val}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <button 
                className="reforma-btn-primary"
                onClick={() => onOpenQuote(`Cotización de ${currentHw.title} (Reforma STPS 40H)`)}
              >
                <span>Cotizar este Equipamiento</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SECTORES IDEALES & CASOS DE USO (FROM WORD DOC) */}
      <section className="reforma-section">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <Briefcase size={15} />
            <span>Sectores con Mayor Exposición a la Reforma</span>
          </div>
          <h2 className="reforma-section-title">
            Solución Diseñada para la Realidad Productiva de México
          </h2>
          <p className="reforma-section-subtitle">
            Desde plantas de manufactura 24/7 hasta corporativos con múltiples sedes y empresas con más de 10 colaboradores.
          </p>
        </div>

        <div className="reforma-sectors-grid">
          
          <div className="reforma-sector-card">
            <div className="reforma-sector-icon"><Warehouse size={20} /></div>
            <h4 className="reforma-sector-name">Plantas & Manufactura</h4>
            <p className="reforma-sector-desc">
              Control de cuadrillas masivas, cambios de turno en menos de 15 minutos y cálculo automático de jornadas nocturnas y mixtas.
            </p>
          </div>

          <div className="reforma-sector-card">
            <div className="reforma-sector-icon"><Building2 size={20} /></div>
            <h4 className="reforma-sector-name">Centros Logísticos & CEDIS</h4>
            <p className="reforma-sector-desc">
              Supervisión de personal de carga, montacargas y choferes con control perimetral integrado a torniquetes de acceso.
            </p>
          </div>

          <div className="reforma-sector-card">
            <div className="reforma-sector-icon"><Hammer size={20} /></div>
            <h4 className="reforma-sector-name">Constructoras & Obras</h4>
            <p className="reforma-sector-desc">
              Terminales biométricas con grado IP65 y batería de respaldo para frentes de obra civil con personal eventual.
            </p>
          </div>

          <div className="reforma-sector-card">
            <div className="reforma-sector-icon"><Briefcase size={20} /></div>
            <h4 className="reforma-sector-name">Corporativos & Oficinas</h4>
            <p className="reforma-sector-desc">
              Diseño de vanguardia, biometría facial veloz y administración de horarios flexibles y esquemas híbridos escalonados.
            </p>
          </div>

          <div className="reforma-sector-card">
            <div className="reforma-sector-icon"><HeartPulse size={20} /></div>
            <h4 className="reforma-sector-name">Hospitales & Clínicas</h4>
            <p className="reforma-sector-desc">
              Reconocimiento facial 100% sin contacto para higiene absoluta de personal médico, enfermería y guardias rotativas.
            </p>
          </div>

          <div className="reforma-sector-card">
            <div className="reforma-sector-icon"><GraduationCap size={20} /></div>
            <h4 className="reforma-sector-name">Escuelas & Universidades</h4>
            <p className="reforma-sector-desc">
              Control preciso de horas-clase de personal docente, administrativo y de mantenimiento en múltiples planteles.
            </p>
          </div>

          <div className="reforma-sector-card">
            <div className="reforma-sector-icon"><Network size={20} /></div>
            <h4 className="reforma-sector-name">Cadenas & Franquicias</h4>
            <p className="reforma-sector-desc">
              Centralización en la nube de decenas de sucursales en todo el país sin requerir personal de sistemas en cada punto.
            </p>
          </div>

          <div className="reforma-sector-card">
            <div className="reforma-sector-icon"><Users size={20} /></div>
            <h4 className="reforma-sector-name">Empresas +10 Empleados</h4>
            <p className="reforma-sector-desc">
              La reforma aplica a toda entidad mercantil con trabajadores contratados. Soluciones escalables y accesibles.
            </p>
          </div>

        </div>
      </section>

      {/* 9. PROCESO LLAVE EN MANO CUAUTHLI EN 7 PASOS (FROM WORD DOC) */}
      <section className="reforma-section">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <CheckCircle2 size={15} />
            <span>Metodología Certificada</span>
          </div>
          <h2 className="reforma-section-title">
            Implementación Llave en Mano en 7 Pasos
          </h2>
          <p className="reforma-section-subtitle">
            Nos encargamos del 100% del ciclo técnico y operativo para que Recursos Humanos y la Dirección General operen sin fricción.
          </p>
        </div>

        <div className="reforma-steps-grid">
          
          <div className="reforma-turnkey-step">
            <div className="reforma-turnkey-number">01</div>
            <div className="reforma-turnkey-content">
              <h4>Levantamiento de Requerimientos</h4>
              <p>Visita a sus instalaciones, análisis de flujos de acceso, conectividad de red y auditoría de esquemas de turnos.</p>
            </div>
          </div>

          <div className="reforma-turnkey-step">
            <div className="reforma-turnkey-number">02</div>
            <div className="reforma-turnkey-content">
              <h4>Suministro de Equipos Homologados</h4>
              <p>Terminales biométricas Hikvision originales con garantía de fábrica y certificados oficiales de conformidad.</p>
            </div>
          </div>

          <div className="reforma-turnkey-step">
            <div className="reforma-turnkey-number">03</div>
            <div className="reforma-turnkey-content">
              <h4>Instalación Profesional Grado Industrial</h4>
              <p>Montaje físico, canalización oculta, cableado de red Cat6 certificado y alimentación eléctrica respaldada con UPS.</p>
            </div>
          </div>

          <div className="reforma-turnkey-step">
            <div className="reforma-turnkey-number">04</div>
            <div className="reforma-turnkey-content">
              <h4>Configuración de Turnos y Políticas STPS</h4>
              <p>Carga de catálogo de personal, parametrización de jornada de 40 horas, tolerancias de retardo y reglas de horas extra.</p>
            </div>
          </div>

          <div className="reforma-turnkey-step">
            <div className="reforma-turnkey-number">05</div>
            <div className="reforma-turnkey-content">
              <h4>Capacitación Integral al Personal</h4>
              <p>Entrenamiento práctico al equipo de Recursos Humanos, nóminas y sistemas para emisión de reportes ejecutivos.</p>
            </div>
          </div>

          <div className="reforma-turnkey-step">
            <div className="reforma-turnkey-number">06</div>
            <div className="reforma-turnkey-content">
              <h4>Puesta en Marcha y Pruebas de Estrés</h4>
              <p>Verificación en tiempo real durante cambios de turno masivos, validando que el 100% de los registros se sincronicen.</p>
            </div>
          </div>

          <div className="reforma-turnkey-step">
            <div className="reforma-turnkey-number">07</div>
            <div className="reforma-turnkey-content">
              <h4>Soporte Técnico Continuo 24/7</h4>
              <p>Pólizas de mantenimiento preventivo, soporte remoto inmediato y reemplazo de hardware ante cualquier eventualidad.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 10. PREGUNTAS FRECUENTES (FAQ ACORDEÓN) */}
      <section className="reforma-section">
        <div className="reforma-section-header">
          <div className="reforma-section-tag">
            <FileText size={15} />
            <span>Resolución de Dudas Normativas</span>
          </div>
          <h2 className="reforma-section-title">
            Preguntas Frecuentes sobre la Reforma y el Registro STPS
          </h2>
          <p className="reforma-section-subtitle">
            Todo lo que los Directores Generales, Directores de RRHH y Abogados Laboristas necesitan saber antes de la entrada en vigor de la norma.
          </p>
        </div>

        <div className="reforma-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className={`reforma-faq-item ${isOpen ? 'open' : ''}`}>
                <button 
                  className="reforma-faq-btn"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                      color: isOpen ? '#38BDF8' : '#94A3B8'
                    }} 
                  />
                </button>
                {isOpen && (
                  <div className="reforma-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. FINAL CONVERSION BANNER & DIRECT FORM */}
      <section className="reforma-section">
        <div className="reforma-cta-banner">
          
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '5px 12px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 800, marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              <Sparkles size={14} />
              <span>ATENCIÓN PRIORITARIA EN CDMX & ÁREA METROPOLITANA</span>
            </div>
            <h2>Proteja su Empresa contra Sanciones STPS Hoy Mismo</h2>
            <p>
              No espere a que entre en vigor la obligatoriedad del 1 de enero de 2027 ni a recibir una notificación de inspección federal. 
              Nuestros ingenieros certificados realizan el levantamiento de sus instalaciones y entregan un dictamen técnico sin costo.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#34D399" />
                <span>Garantía de cumplimiento normativo ante la STPS y LFT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#34D399" />
                <span>Instalación llave en mano con equipamiento original Hikvision</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#34D399" />
                <span>Soporte telefónico y técnico local en Ciudad de México</span>
              </div>
            </div>

            <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a 
                href="https://wa.me/525585262115?text=Hola%20Sistemas%20Cuauhtli,%20solicito%20asesor%C3%ADa%20urgente%20para%20cumplir%20con%20la%20Reforma%20Laboral%2040%20Horas%20y%20Registro%20STPS."
                target="_blank"
                rel="noopener noreferrer"
                className="reforma-btn-secondary"
                style={{ background: '#FFFFFF', color: '#0B1120', borderColor: '#FFFFFF', fontWeight: 800 }}
              >
                <MessageSquare size={16} color="#10B981" />
                <span>WhatsApp Urgente: (55) 8526-2115</span>
              </a>

              <button 
                onClick={() => onNavigateHome?.()}
                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', textDecoration: 'underline', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} />
                <span>Volver al Sitio Principal</span>
              </button>
            </div>
          </div>

          {/* Quick Lead Form */}
          <div className="reforma-cta-inline-form">
            <h3 className="reforma-form-title">Solicitar Levantamiento Técnico</h3>
            <p className="reforma-form-sub">Diagnóstico presencial sin costo para empresas en CDMX y República Mexicana.</p>

            <form onSubmit={handleInlineFormSubmit}>
              <div className="reforma-input-group">
                <label>Nombre y Cargo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Lic. Carlos Valdés (Director RRHH)" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="reforma-input-group">
                <label>Nombre de la Empresa</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Grupo Industrial del Centro S.A." 
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                />
              </div>

              <div className="reforma-input-group">
                <label>Teléfono Directo o WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Ej. 55 1234 5678" 
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </div>

              <div className="reforma-input-group">
                <label>Rango de Colaboradores</label>
                <select 
                  value={formEmployees} 
                  onChange={(e) => setFormEmployees(e.target.value)}
                >
                  <option value="10-49">10 a 49 empleados</option>
                  <option value="50-150">50 a 150 empleados</option>
                  <option value="150-500">150 a 500 empleados</option>
                  <option value="500+">Más de 500 empleados</option>
                </select>
              </div>

              <button type="submit" className="reforma-form-submit">
                <ShieldCheck size={18} />
                <span>Solicitar Asesoría STPS Gratuita</span>
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
