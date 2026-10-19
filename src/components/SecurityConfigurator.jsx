import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  Factory, 
  Home, 
  Store, 
  Camera, 
  Fingerprint, 
  Zap, 
  BellRing, 
  Smartphone, 
  Check, 
  Send, 
  FileText, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function SecurityConfigurator({ preSelectedSolution }) {
  const [propertyType, setPropertyType] = useState('corporativo');
  const [selectedServices, setSelectedServices] = useState(
    preSelectedSolution ? [preSelectedSolution] : ['Circuito Cerrado (CCTV) con IA', 'Control de Acceso Biométrico']
  );
  const [scale, setScale] = useState('8-16');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const propertyOptions = [
    { id: 'corporativo', label: 'Corporativo / Oficinas', icon: Building2, desc: 'Control de accesos y vigilancia perimetral' },
    { id: 'industrial', label: 'Nave / Parque Industrial', icon: Factory, desc: 'Seguridad perimetral y bodegas' },
    { id: 'residencial', label: 'Residencial de Lujo / Privada', icon: Home, desc: 'Videoporteros y cercas disuasivas' },
    { id: 'comercio', label: 'Comercio / Retail', icon: Store, desc: 'Prevención de pérdidas y monitoreo 24/7' },
  ];

  const serviceOptions = [
    { id: 'Circuito Cerrado (CCTV) con IA', label: 'CCTV 4K con IA', icon: Camera },
    { id: 'Control de Acceso Biométrico', label: 'Acceso Biométrico', icon: Fingerprint },
    { id: 'Cercas Electrificadas Homologadas', label: 'Cerca Electrificada 10kV', icon: Zap },
    { id: 'Alarmas Inteligentes & Monitoreo 24/7', label: 'Alarma Inteligente 24/7', icon: BellRing },
    { id: 'Videoporteros IP & Intercom', label: 'Videoportero IP Remoto', icon: Smartphone },
  ];

  const scaleOptions = [
    { id: '1-4', label: '1 a 4 Puntos', desc: 'Pequeñas áreas o accesos críticos' },
    { id: '5-8', label: '5 a 8 Puntos', desc: 'Oficinas o residencias completas' },
    { id: '8-16', label: '8 a 16 Puntos', desc: 'Edificios y comercios medianos' },
    { id: '16-32', label: '16 a 32 Puntos', desc: 'Plantas industriales y corporativos' },
    { id: '32+', label: '32+ Puntos', desc: 'Proyectos a gran escala y campus' },
  ];

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== serviceId));
      }
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleSendQuote = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Format WhatsApp message
    const propName = propertyOptions.find(p => p.id === propertyType)?.label;
    const servs = selectedServices.join(', ');
    const msg = encodeURIComponent(
      `Hola Sistemas Cuauhtli! 👋 Me gustaría cotizar un sistema de seguridad para:\n` +
      `🏢 Tipo de Inmueble: ${propName}\n` +
      `🛡️ Soluciones: ${servs}\n` +
      `📍 Cobertura estimada: ${scale} puntos/cámaras\n` +
      `👤 Nombre: ${contactName || 'Cliente Web'}\n` +
      `📞 Teléfono: ${contactPhone || 'No especificado'}\n` +
      `Solicito asesoría y cotización en CDMX.`
    );

    // Open WhatsApp
    setTimeout(() => {
      window.open(`https://wa.me/525585262115?text=${msg}`, '_blank');
    }, 1200);
  };

  return (
    <section 
      id="cotizador"
      style={{
        padding: '100px 0',
        backgroundColor: 'var(--bg-main)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="badge-tag" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} />
            <span>ESTIMADOR INTELIGENTE DE PROYECTO</span>
          </div>
          <h2 className="section-title">
            Configura tu Sistema a la Medida en 3 Pasos
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Selecciona los parámetros de tu proyecto. Te entregamos una recomendación de arquitectura 
            de seguridad y una cotización técnica sin compromiso.
          </p>
        </div>

        {/* 2 COLUMNS: CONFIGURATOR FORM + LIVE SUMMARY CARD */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}
          className="config-grid"
        >
          {/* STEPPER OPTIONS */}
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {/* STEP 1: PROPERTY TYPE */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  1
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ¿Qué tipo de inmueble deseas proteger?
                </h3>
              </div>

              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px'
                }}
              >
                {propertyOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = propertyType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPropertyType(item.id)}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--primary-subtle)' : 'var(--bg-main)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 14px var(--primary-glow)' : 'none'
                      }}
                    >
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-secondary)',
                          color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '10px'
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: SERVICES */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  2
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Selecciona los sistemas requeridos (puedes elegir varios)
                </h3>
              </div>

              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '10px'
                }}
              >
                {serviceOptions.map((s) => {
                  const Icon = s.icon;
                  const isChecked = selectedServices.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleService(s.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: isChecked ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: isChecked ? 'var(--primary-subtle)' : 'var(--bg-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                    >
                      <div 
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          backgroundColor: isChecked ? 'var(--primary)' : 'var(--bg-tertiary)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {isChecked ? <Check size={14} strokeWidth={3} /> : <Icon size={12} color="var(--text-muted)" />}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: isChecked ? 700 : 600, color: isChecked ? 'var(--primary-hover)' : 'var(--text-main)' }}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: SCALE / COVERAGE */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  3
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Magnitud estimada (Cámaras / Puntos de Acceso / Metros)
                </h3>
              </div>

              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                {scaleOptions.map((sc) => {
                  const isSelected = scale === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setScale(sc.id)}
                      style={{
                        flex: '1 1 120px',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 14px var(--primary-glow)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        {sc.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.7, marginTop: '2px' }}>
                        {sc.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: LIVE ESTIMATE CARD & DIRECT FORM */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              boxShadow: 'var(--shadow-card)',
              position: 'sticky',
              top: '100px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div 
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-subtle)',
                  padding: '4px 10px',
                  borderRadius: '9999px'
                }}
              >
                PROPUESTA TÉCNICA ESTIMADA
              </div>

              <span className="pulse-beacon" />
            </div>

            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Arquitectura de Seguridad Recomendada
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Para <strong>{propertyOptions.find(p => p.id === propertyType)?.label}</strong> con escala de <strong>{scale} puntos</strong>.
            </p>

            {/* BREAKDOWN LIST */}
            <div 
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Sistemas integrados:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedServices.length} soluciones</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tecnología óptica/biométrica:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Grado Empresarial 4K</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Instalación & Certificación:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Ingenieros Certificados</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Garantía técnica y soporte:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>Póliza Anual Incluida</span>
              </div>
            </div>

            {/* QUICK CONTACT INPUTS */}
            <form onSubmit={handleSendQuote}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Tu Nombre o Empresa:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Carlos Mendoza / Grupo Alfa"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Teléfono / WhatsApp para enviar cotización:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 55 1234 5678"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Solicitar Cotización por WhatsApp</span>
                <Send size={18} />
              </button>
            </form>

            {submitted && (
              <div 
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#065F46',
                  fontSize: '0.82rem',
                  textAlign: 'center',
                  fontWeight: 600
                }}
              >
                ✓ Generando propuesta... Abriendo WhatsApp oficial de Sistemas Cuauhtli.
              </div>
            )}

            <div 
              style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={14} color="#10B981" />
              <span>Visita técnica de levantamiento sin costo en CDMX y Área Metropolitana.</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (min-width: 960px) {
          .config-grid {
            grid-template-columns: 1.4fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
