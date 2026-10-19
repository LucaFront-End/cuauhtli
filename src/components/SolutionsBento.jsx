import React, { useState } from 'react';
import { 
  Camera, 
  Fingerprint, 
  BellRing, 
  Zap, 
  Smartphone, 
  ArrowUpRight, 
  CheckCircle2, 
  Eye, 
  ShieldAlert, 
  Sliders,
  ChevronDown,
  Info
} from 'lucide-react';

export default function SolutionsBento({ onSelectSolutionForQuote }) {
  const [selectedSolution, setSelectedSolution] = useState(null);

  const solutions = [
    {
      id: 'cctv',
      title: 'Circuito Cerrado (CCTV) con IA',
      category: 'VIDEOVIGILANCIA INTELIGENTE',
      headline: 'Visión óptica 4K sin puntos ciegos y analítica en tiempo real.',
      description: 'Sistemas de videovigilancia con algoritmos de Inteligencia Artificial DeepinView que diferencian personas y vehículos de animales o lluvia. Detección perimetral instantánea y reconocimiento de placas (LPR).',
      image: '/assets/images/cctv_ptz.jpg',
      icon: Camera,
      tagColor: '#2563EB',
      specs: [
        'Resolución 4K Ultra HD (3840 x 2160) @ 60 FPS',
        'Tecnología ColorVu: visión a todo color 24/7 sin luz visible',
        'Analítica AcuSense: 99.8% reducción de falsas alarmas',
        'Compresión inteligente H.265+ para 70% ahorro de disco',
        'Grabación local NVR redundante y respaldo en la nube'
      ],
      idealFor: 'Corporativos, naves industriales, almacenes y residencias'
    },
    {
      id: 'acceso',
      title: 'Control de Acceso Biométrico',
      category: 'CONTROL PEATONAL & VEHICULAR',
      headline: 'Acceso seguro, ágil y sin fricciones mediante biometría facial.',
      description: 'Gestiona quién entra y sale de tus instalaciones en milisegundos. Terminales con reconocimiento facial 3D anti-fotografía, lectores de huella dactilar, torniquetes de alta velocidad y credenciales digitales móviles.',
      image: '/assets/images/access_control.jpg',
      icon: Fingerprint,
      tagColor: '#10B981',
      specs: [
        'Reconocimiento facial biométrico en menos de 0.2 segundos',
        'Cámara de doble lente con algoritmo anti-suplantación (liveness)',
        'Integración a torniquetes, esclusas y puertas automáticas',
        'Gestión de visitas con códigos QR dinámicos y temporales',
        'Reportes de asistencia en tiempo real compatibles con ERP/RH'
      ],
      idealFor: 'Edificios corporativos, plantas industriales y áreas restringidas'
    },
    {
      id: 'cercas',
      title: 'Cercas Electrificadas Homologadas',
      category: 'PROTECCIÓN PERIMETRAL DE ALTA DISUASIÓN',
      headline: 'La primera línea de defensa física perimetral contra intrusos.',
      description: 'Barrera electrificada de pulsos de alto voltaje (10,000V) disuasivos y no letales, totalmente homologada bajo normas oficiales mexicanas (NOM). Detecta cortes de alambre, flexiones o intentos de escalamiento.',
      image: '/assets/images/perimeter_fence.jpg',
      icon: Zap,
      tagColor: '#FF6B00',
      specs: [
        'Pulsos de 10,000V a 12,000V regulados conforme a NOM-001-SEDE',
        'Sensores de tensión que detectan cortes o flexión de líneas',
        'Sirena disuasiva exterior de 120 dB con flash estroboscópico',
        'Batería de respaldo con autonomía de 48 horas ante cortes eléctricos',
        'Monitoreo y armado/desarmado desde la app en el smartphone'
      ],
      idealFor: 'Parques industriales, bodegas, condominios y residencias'
    },
    {
      id: 'alarmas',
      title: 'Alarmas Inteligentes & Monitoreo 24/7',
      category: 'DETECCIÓN TEMPRANA DE INTRUSIÓN',
      headline: 'Detección acústica, sísmica y de apertura con respuesta inmediata.',
      description: 'Paneles de alarma híbridos e inalámbricos con tecnología de encriptación de grado bancario. Sensores de rotura de cristal, fotomovimiento con verificación visual y enlace a nuestra Central de Monitoreo 24/7 en CDMX.',
      image: '/assets/images/alarm_center.jpg',
      icon: BellRing,
      tagColor: '#8B5CF6',
      specs: [
        'Doble vía de comunicación: Red celular 4G/LTE + Fibra Óptica IP',
        'Sensores PIR MotionCam con envío de fotos en 5 segundos',
        'Detectores de inundación, humo e incremento térmico',
        'Botones de pánico fijos e inalámbricos con aviso silencioso',
        'Póliza de monitoreo 24/7/365 con despacho de patrulla y autoridades'
      ],
      idealFor: 'Comercios, sucursales bancarias, oficinas y hogares'
    },
    {
      id: 'videoporteros',
      title: 'Videoporteros IP & Intercom',
      category: 'COMUNICACIÓN & APERTURA REMOTA',
      headline: 'Mira quién llama a tu puerta y autoriza el acceso desde tu celular.',
      description: 'Sistemas de intercomunicación IP con pantallas táctiles capacitivas para interiores y frentes de calle antivandálicos en aluminio anodizado. Videollamadas en alta definición y apertura remota de chapas y portones.',
      image: '/assets/images/videodoorbell.jpg',
      icon: Smartphone,
      tagColor: '#0EA5E9',
      specs: [
        'Cámara HD gran angular de 180° con audio bidireccional cancelador de eco',
        'Pantallas interiores táctiles de 7" y 10" con visualización de cámaras CCTV',
        'Apertura remota de portón vehicular y puerta peatonal',
        'Registro fotográfico automático con fecha y hora de cada timbreo',
        'Integración a conmutadores IP y redes corporativas SIP'
      ],
      idealFor: 'Privadas residenciales, despachos ejecutivos y casetas de vigilancia'
    }
  ];

  return (
    <section 
      id="soluciones"
      style={{
        padding: '100px 0',
        backgroundColor: 'var(--bg-main)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge-tag" style={{ marginBottom: '14px' }}>
            <span>PORTAFOLIO INTEGRAL CUAUTHLI</span>
          </div>
          <h2 className="section-title">
            Soluciones para maximizar la seguridad
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Cada empresa e inmueble tiene requerimientos únicos. Nuestras soluciones modulares 
            se integran perfectamente entre sí para crear un escudo tecnológico impenetrable.
          </p>
        </div>

        {/* BENTO GRID OF 5 CORE SOLUTIONS */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px'
          }}
          className="bento-container"
        >
          {solutions.map((item, index) => {
            const Icon = item.icon;
            
            // Grid spanning logic:
            // Item 0 (CCTV): 7 cols
            // Item 1 (Acceso): 5 cols
            // Item 2 (Cercas): 4 cols
            // Item 3 (Alarmas): 4 cols
            // Item 4 (Videoporteros): 4 cols
            const colSpan = index === 0 ? 'span 7' : index === 1 ? 'span 5' : 'span 4';

            return (
              <div
                key={item.id}
                className="card-modern"
                style={{
                  gridColumn: colSpan,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedSolution(item)}
              >
                <div>
                  {/* TOP IMAGE WITH HOVER ZOOM */}
                  <div 
                    style={{
                      width: '100%',
                      height: index < 2 ? '240px' : '200px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      position: 'relative',
                      marginBottom: '20px',
                      backgroundColor: 'var(--bg-tertiary)'
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="bento-img"
                    />

                    {/* OVERLAY BADGE */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.94)',
                        backdropFilter: 'blur(8px)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-main)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <Icon size={14} color={item.tagColor} />
                      <span>{item.category}</span>
                    </div>

                    <div 
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(8px)',
                        transition: 'transform 0.2s'
                      }}
                      className="bento-arrow-icon"
                    >
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <h3 
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{item.title}</span>
                  </h3>

                  <p 
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      marginBottom: '18px'
                    }}
                  >
                    {item.headline}
                  </p>

                  {/* QUICK BULLETS (2 KEY SPECS) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {item.specs.slice(0, 2).map((sp, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM ACTION BAR */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-light)'
                  }}
                >
                  <span 
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Ver Ficha Técnica</span>
                    <ArrowUpRight size={15} />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSolutionForQuote(item.title);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                  >
                    Cotizar Ésta
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FULL SOLUTION DETAIL MODAL */}
      {selectedSolution && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setSelectedSolution(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-light)',
              padding: '32px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedSolution(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: 'var(--text-main)',
                fontWeight: 700
              }}
            >
              ×
            </button>

            {/* MODAL HEADER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div 
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}
              >
                {React.createElement(selectedSolution.icon, { size: 24 })}
              </div>
              <div>
                <span 
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    backgroundColor: 'var(--primary-subtle)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {selectedSolution.category}
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {selectedSolution.title}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {selectedSolution.description}
            </p>

            {/* IMAGE BANNER IN MODAL */}
            <div 
              style={{
                width: '100%',
                height: '240px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '24px'
              }}
            >
              <img 
                src={selectedSolution.image} 
                alt={selectedSolution.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* FULL SPECS LIST */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-main)' }}>
                Especificaciones & Capacidades Técnicas:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedSolution.specs.map((sp, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-secondary)',
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{sp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div 
              style={{
                padding: '14px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-subtle)',
                border: '1px solid var(--primary-border)',
                marginBottom: '28px',
                fontSize: '0.86rem',
                color: 'var(--primary-hover)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Info size={18} />
              <span><strong>Recomendado para:</strong> {selectedSolution.idealFor}.</span>
            </div>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedSolution(null)}
                className="btn btn-secondary"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const title = selectedSolution.title;
                  setSelectedSolution(null);
                  onSelectSolutionForQuote(title);
                }}
                className="btn btn-primary"
              >
                <span>Incluir en mi Cotización</span>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA STYLES */}
      <style>{`
        .bento-img:hover {
          transform: scale(1.04);
        }
        @media (max-width: 960px) {
          .bento-container > div {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
