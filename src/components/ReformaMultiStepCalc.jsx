import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Users,
  Building2,
  Scale,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  BadgeAlert,
  Cpu,
  User,
  Phone,
  Mail,
  Send,
  RotateCcw,
  Sparkles,
  Lock,
  MessageSquare
} from 'lucide-react';
import './ReformaMultiStepCalc.css';

const UMA_VALUE = 117.31; // Valor UMA diario estimado 2026/2027

const METHOD_OPTIONS = [
  {
    id: 'paper',
    title: 'Listas en Papel o Libreta',
    subtitle: 'Firma en bitácora física diaria',
    badge: 'Riesgo Crítico',
    badgeType: 'critico',
    icon: XCircle,
    umaMin: 500,
    umaMax: 5000,
    desc: 'Sin valor probatorio ante la STPS y Tribunales Laborales. Vulnerable a suplantación y extravío.'
  },
  {
    id: 'excel',
    title: 'Excel o Registro Manual',
    subtitle: 'Archivo digital editable',
    badge: 'Riesgo Alto',
    badgeType: 'alto',
    icon: FileText,
    umaMin: 350,
    umaMax: 4200,
    desc: 'Los archivos modificables no cuentan con sellos de tiempo inalterables ni bitácora de no repudio.'
  },
  {
    id: 'rfid',
    title: 'Tarjetas RFID o Clave PIN',
    subtitle: 'Credencial o código numérico',
    badge: 'Riesgo de Suplantación',
    badgeType: 'alto',
    icon: BadgeAlert,
    umaMin: 250,
    umaMax: 3000,
    desc: 'Permite la "checada por amigos" (buddy punching), inflando falsamente horas extraordinarias.'
  },
  {
    id: 'standalone',
    title: 'Biométrico Desactualizado',
    subtitle: 'Equipo aislado sin software de 40h',
    badge: 'Riesgo Moderado',
    badgeType: 'moderado',
    icon: Cpu,
    umaMin: 250,
    umaMax: 1800,
    desc: 'No desglosa turnos rotativos de 40 horas ni calcula horas extras dobles/triples según la LFT.'
  },
  {
    id: 'compliant',
    title: 'Terminal Facial Cuauhtli (100% STPS)',
    subtitle: 'Biometría Hikvision MinMoe con IA',
    badge: '100% Blindado LFT',
    badgeType: 'seguro',
    icon: ShieldCheck,
    umaMin: 0,
    umaMax: 0,
    desc: 'Sellos de tiempo NTP oficiales, hash SHA-256 criptográfico y reportes listos para inspección.'
  }
];

const BRANCH_PRESETS = [
  { value: 1, label: '1 Sede Única', detail: 'Oficina, planta o matriz' },
  { value: 3, label: '2 a 3 Sedes', detail: 'Operación en expansión' },
  { value: 6, label: '4 a 8 Sedes', detail: 'Cadena, retail o bodegas' },
  { value: 12, label: '+8 Sedes Corporativas', detail: 'Cobertura regional o nacional' }
];

export default function ReformaMultiStepCalc({ onOpenQuote }) {
  const [step, setStep] = useState(1); // 1, 2, 3, 4
  const [employees, setEmployees] = useState(65);
  const [branches, setBranches] = useState(2);
  const [currentMethod, setCurrentMethod] = useState('paper');

  // Lead form state (Step 4)
  const [leadData, setLeadData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Calculation Logic
  const selectedMethodObj = METHOD_OPTIONS.find((m) => m.id === currentMethod) || METHOD_OPTIONS[0];
  const isCompliant = currentMethod === 'compliant';

  const minFine = isCompliant ? 0 : Math.round(selectedMethodObj.umaMin * UMA_VALUE);
  const maxFine = isCompliant ? 0 : Math.round(selectedMethodObj.umaMax * UMA_VALUE);
  const overtimeExposure = isCompliant ? 0 : Math.round(employees * 1250 * (currentMethod === 'paper' ? 2.5 : 1.2));
  const suggestedTerminals = Math.max(branches, Math.ceil(employees / 60));

  // Step navigation handlers
  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Form submit handler
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!leadData.name.trim()) errors.name = 'Ingrese su nombre completo';
    if (!leadData.company.trim()) errors.company = 'Ingrese el nombre de su empresa';
    if (!leadData.phone.trim()) errors.phone = 'Ingrese un teléfono o WhatsApp';
    if (!leadData.email.trim() || !leadData.email.includes('@')) errors.email = 'Ingrese un correo válido';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  const handleReset = () => {
    setStep(1);
    setIsSubmitted(false);
    setLeadData({ name: '', company: '', phone: '', email: '', notes: '' });
  };

  // WhatsApp click generator
  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hola Sistemas Cuauhtli, solicito el Dictamen Legal STPS para mi empresa ${leadData.company || 'mi empresa'}.\n\n` +
      `• Plantilla: ${employees} colaboradores\n` +
      `• Sedes: ${branches} ubicaciones\n` +
      `• Método actual: ${selectedMethodObj.title}\n` +
      `• Contacto: ${leadData.name} (${leadData.phone})`
    );
    return `https://wa.me/525585262115?text=${text}`;
  };

  return (
    <div className="rmsc-container">
      {/* CARD WRAPPER */}
      <div className="rmsc-card">
        
        {/* STEPPER HEADER */}
        <div className="rmsc-stepper-header">
          <div className="rmsc-steps-nav">
            {[
              { num: 1, label: 'Plantilla' },
              { num: 2, label: 'Sedes' },
              { num: 3, label: 'Método' },
              { num: 4, label: 'Diagnóstico & Datos' }
            ].map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <div
                  key={s.num}
                  className={`rmsc-step-badge-btn ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                  onClick={() => !isSubmitted && isPast && setStep(s.num)}
                >
                  <span className="rmsc-step-num-pill">
                    {isPast ? <CheckCircle2 size={13} /> : `0${s.num}`}
                  </span>
                  <span className="rmsc-step-title">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Progress bar line */}
          <div className="rmsc-progress-bar-bg">
            <div
              className="rmsc-progress-bar-fill"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP BODY WITH ANIMATIONS */}
        <div className="rmsc-body">
          <AnimatePresence mode="wait">
            
            {/* ---------------- STEP 1: PLANTILLA ---------------- */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="rmsc-step-pane"
              >
                <div className="rmsc-step-intro">
                  <span className="rmsc-eyebrow">
                    <Users size={13} />
                    Paso 01 / 04 · Plantilla de Personal
                  </span>
                  <h3 className="rmsc-heading">
                    ¿Cuántos colaboradores integran su empresa?
                  </h3>
                  <p className="rmsc-desc">
                    Las inspecciones de la STPS calculan las sanciones de 250 a 5,000 UMA por cada trabajador que carezca de biometría inalterable.
                  </p>
                </div>

                <div className="rmsc-counter-display">
                  <div className="rmsc-big-number">{employees}</div>
                  <div className="rmsc-big-label">colaboradores activos</div>
                </div>

                <div className="rmsc-slider-wrap">
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="5"
                    value={employees}
                    onChange={(e) => setEmployees(parseInt(e.target.value))}
                    className="rmsc-range-slider"
                  />
                  <div className="rmsc-slider-scale">
                    <span>10</span>
                    <span>250</span>
                    <span>500</span>
                    <span>750</span>
                    <span>1,000+</span>
                  </div>
                </div>

                <div className="rmsc-presets-wrap">
                  <span className="rmsc-presets-label">Selección rápida:</span>
                  <div className="rmsc-presets-row">
                    {[25, 60, 150, 300, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`rmsc-preset-pill ${employees === preset ? 'active' : ''}`}
                        onClick={() => setEmployees(preset)}
                      >
                        {preset} {preset === 1000 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rmsc-actions-bar single-right">
                  <button
                    type="button"
                    className="rmsc-btn-primary"
                    onClick={nextStep}
                  >
                    <span>Continuar a Sedes y Puntos de Acceso</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------------- STEP 2: SEDES ---------------- */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="rmsc-step-pane"
              >
                <div className="rmsc-step-intro">
                  <span className="rmsc-eyebrow">
                    <Building2 size={13} />
                    Paso 02 / 04 · Cobertura de Instalaciones
                  </span>
                  <h3 className="rmsc-heading">
                    ¿En cuántas sedes o accesos registran entrada y salida?
                  </h3>
                  <p className="rmsc-desc">
                    Permite calcular la arquitectura de sincronización centralizada en tiempo real y el número de terminales necesarias.
                  </p>
                </div>

                <div className="rmsc-cards-grid-2">
                  {BRANCH_PRESETS.map((bp) => {
                    const isSelected = branches === bp.value;
                    return (
                      <div
                        key={bp.value}
                        className={`rmsc-option-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setBranches(bp.value)}
                      >
                        <div className="rmsc-opt-header">
                          <span className="rmsc-opt-title">{bp.label}</span>
                          <span className="rmsc-radio-dot" />
                        </div>
                        <span className="rmsc-opt-detail">{bp.detail}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Fine tune slider */}
                <div className="rmsc-fine-tune-box">
                  <div className="rmsc-fine-tune-header">
                    <span>O ajuste el número exacto:</span>
                    <strong>{branches} {branches === 1 ? 'ubicación' : 'ubicaciones'}</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={branches}
                    onChange={(e) => setBranches(parseInt(e.target.value))}
                    className="rmsc-range-slider"
                  />
                </div>

                <div className="rmsc-actions-bar">
                  <button
                    type="button"
                    className="rmsc-btn-ghost"
                    onClick={prevStep}
                  >
                    <ArrowLeft size={16} />
                    <span>Anterior</span>
                  </button>
                  <button
                    type="button"
                    className="rmsc-btn-primary"
                    onClick={nextStep}
                  >
                    <span>Continuar a Método Actual</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------------- STEP 3: MÉTODO ACTUAL ---------------- */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="rmsc-step-pane"
              >
                <div className="rmsc-step-intro">
                  <span className="rmsc-eyebrow">
                    <Scale size={13} />
                    Paso 03 / 04 · Esquema de Registro Actual
                  </span>
                  <h3 className="rmsc-heading">
                    ¿Cómo llevan el control de asistencia el día de hoy?
                  </h3>
                  <p className="rmsc-desc">
                    Seleccione su esquema actual para calcular la brecha legal ante los inspectores de la Secretaría del Trabajo (STPS).
                  </p>
                </div>

                <div className="rmsc-methods-list">
                  {METHOD_OPTIONS.map((m) => {
                    const isSelected = currentMethod === m.id;
                    const IconComp = m.icon;
                    return (
                      <div
                        key={m.id}
                        className={`rmsc-method-row ${isSelected ? 'selected' : ''} ${m.id === 'compliant' ? 'compliant-highlight' : ''}`}
                        onClick={() => setCurrentMethod(m.id)}
                      >
                        <div className="rmsc-method-icon-wrap">
                          <IconComp size={18} />
                        </div>
                        <div className="rmsc-method-info">
                          <div className="rmsc-method-head-line">
                            <span className="rmsc-method-title">{m.title}</span>
                            <span className={`rmsc-badge-tag ${m.badgeType}`}>
                              {m.badge}
                            </span>
                          </div>
                          <p className="rmsc-method-desc">{m.desc}</p>
                        </div>
                        <div className="rmsc-method-check">
                          <span className="rmsc-radio-dot" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rmsc-actions-bar">
                  <button
                    type="button"
                    className="rmsc-btn-ghost"
                    onClick={prevStep}
                  >
                    <ArrowLeft size={16} />
                    <span>Anterior</span>
                  </button>
                  <button
                    type="button"
                    className="rmsc-btn-primary"
                    onClick={nextStep}
                  >
                    <span>Calcular Diagnóstico y Multas</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------------- STEP 4: DIAGNÓSTICO & DATOS DE CONTACTO ---------------- */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="rmsc-step-pane"
              >
                {!isSubmitted ? (
                  <>
                    {/* Upper Diagnosis Summary Banner */}
                    <div className={`rmsc-diag-banner ${selectedMethodObj.badgeType}`}>
                      <div className="rmsc-diag-top">
                        <div className="rmsc-diag-status-pill">
                          {isCompliant ? (
                            <>
                              <ShieldCheck size={14} />
                              <span>BLINDAJE TOTAL (100% CUMPLIMIENTO STPS)</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={14} />
                              <span>CONTINGENCIA DETECTADA · {selectedMethodObj.badge.toUpperCase()}</span>
                            </>
                          )}
                        </div>
                        <button
                          type="button"
                          className="rmsc-diag-edit-btn"
                          onClick={() => setStep(1)}
                        >
                          Modificar Parámetros
                        </button>
                      </div>

                      <div className="rmsc-diag-fine-row">
                        <div className="rmsc-diag-fine-box">
                          <span className="rmsc-fine-caption">
                            {isCompliant
                              ? 'Exposición a Multas STPS:'
                              : `Multa Potencial STPS (${selectedMethodObj.umaMin} a ${selectedMethodObj.umaMax} UMA):`}
                          </span>
                          <div className={`rmsc-fine-amount ${isCompliant ? 'safe-zero' : ''}`}>
                            {isCompliant ? (
                              '$0 MXN'
                            ) : (
                              <span>
                                ${minFine.toLocaleString('es-MX')} – ${maxFine.toLocaleString('es-MX')}{' '}
                                <small>MXN</small>
                              </span>
                            )}
                          </div>
                          <span className="rmsc-fine-legal">
                            {isCompliant
                              ? 'Cumplimiento pleno de los arts. 992 y 1002 de la Ley Federal del Trabajo.'
                              : 'Sanción legal por ausencia de registro fidedigno inalterable (Arts. 992 y 1002 LFT).'}
                          </span>
                        </div>

                        {/* Mini metrics columns */}
                        <div className="rmsc-diag-metrics-grid">
                          <div className="rmsc-diag-metric-card">
                            <span className="rmsc-m-title">Riesgo en Horas Extra:</span>
                            <strong className="rmsc-m-val">
                              {isCompliant ? '$0 MXN' : `$${overtimeExposure.toLocaleString('es-MX')} MXN/año`}
                            </strong>
                          </div>
                          <div className="rmsc-diag-metric-card">
                            <span className="rmsc-m-title">Terminales Sugeridas:</span>
                            <strong className="rmsc-m-val">{suggestedTerminals} equipos MinMoe IA</strong>
                          </div>
                          <div className="rmsc-diag-metric-card">
                            <span className="rmsc-m-title">Plantilla Analizada:</span>
                            <strong className="rmsc-m-val">{employees} personas · {branches} sedes</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lower Lead Capture Form */}
                    <div className="rmsc-lead-section">
                      <div className="rmsc-lead-header">
                        <span className="rmsc-lead-eyebrow">
                          <Sparkles size={13} />
                          Dictamen Legal & Cotización Oficial Sin Costo
                        </span>
                        <h4 className="rmsc-lead-title">
                          Deje sus datos corporativos para recibir el informe completo
                        </h4>
                        <p className="rmsc-lead-desc">
                          Un consultor laboral certificado de Sistemas Cuauhtli le enviará el dictamen técnico preliminar en PDF y la propuesta formal a la medida de su empresa.
                        </p>
                      </div>

                      <form onSubmit={handleLeadSubmit} className="rmsc-lead-form">
                        <div className="rmsc-form-grid-2">
                          
                          {/* Nombre */}
                          <div className="rmsc-input-group">
                            <label className="rmsc-input-label">Nombre y Apellido *</label>
                            <div className="rmsc-input-field">
                              <User size={16} className="rmsc-input-icon" />
                              <input
                                type="text"
                                placeholder="Ej. Lic. Carlos Mendoza"
                                value={leadData.name}
                                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                                className={formErrors.name ? 'error' : ''}
                              />
                            </div>
                            {formErrors.name && <span className="rmsc-err-msg">{formErrors.name}</span>}
                          </div>

                          {/* Empresa */}
                          <div className="rmsc-input-group">
                            <label className="rmsc-input-label">Empresa / Razón Social *</label>
                            <div className="rmsc-input-field">
                              <Building2 size={16} className="rmsc-input-icon" />
                              <input
                                type="text"
                                placeholder="Ej. Grupo Industrial del Bajío"
                                value={leadData.company}
                                onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                                className={formErrors.company ? 'error' : ''}
                              />
                            </div>
                            {formErrors.company && <span className="rmsc-err-msg">{formErrors.company}</span>}
                          </div>

                          {/* WhatsApp / Teléfono */}
                          <div className="rmsc-input-group">
                            <label className="rmsc-input-label">WhatsApp / Teléfono Móvil *</label>
                            <div className="rmsc-input-field">
                              <Phone size={16} className="rmsc-input-icon" />
                              <input
                                type="tel"
                                placeholder="Ej. 442 123 4567"
                                value={leadData.phone}
                                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                                className={formErrors.phone ? 'error' : ''}
                              />
                            </div>
                            {formErrors.phone && <span className="rmsc-err-msg">{formErrors.phone}</span>}
                          </div>

                          {/* Correo */}
                          <div className="rmsc-input-group">
                            <label className="rmsc-input-label">Correo Corporativo *</label>
                            <div className="rmsc-input-field">
                              <Mail size={16} className="rmsc-input-icon" />
                              <input
                                type="email"
                                placeholder="carlos@suempresa.com"
                                value={leadData.email}
                                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                                className={formErrors.email ? 'error' : ''}
                              />
                            </div>
                            {formErrors.email && <span className="rmsc-err-msg">{formErrors.email}</span>}
                          </div>

                        </div>

                        {/* Submit CTA */}
                        <div className="rmsc-form-footer">
                          <button
                            type="submit"
                            className="rmsc-submit-cta-btn"
                            disabled={isSubmitting}
                          >
                            <Send size={16} />
                            <span>
                              {isSubmitting
                                ? 'Generando Dictamen Oficial...'
                                : 'Solicitar Dictamen Preliminar & Cotización Oficial'}
                            </span>
                          </button>

                          <div className="rmsc-privacy-row">
                            <Lock size={12} />
                            <span>Tratamiento confidencial bajo acuerdo de privacidad. Sin spam ni compromiso comercial.</span>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="rmsc-actions-bar">
                      <button
                        type="button"
                        className="rmsc-btn-ghost"
                        onClick={prevStep}
                      >
                        <ArrowLeft size={16} />
                        <span>Volver a Métodos</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Success Confirmation Screen */
                  <div className="rmsc-success-card">
                    <div className="rmsc-success-icon-ring">
                      <ShieldCheck size={42} />
                    </div>
                    <span className="rmsc-success-badge">Solicitud Registrada con Éxito</span>
                    <h3 className="rmsc-success-title">
                      ¡Dictamen Preliminar en Proceso para {leadData.company || 'su empresa'}!
                    </h3>
                    <p className="rmsc-success-desc">
                      Hemos recibido la información de su plantilla ({employees} colaboradores en {branches} sedes). Un especialista laboral de Sistemas Cuauhtli le enviará el informe formal en PDF y la propuesta técnica a <strong>{leadData.email}</strong> y por WhatsApp al <strong>{leadData.phone}</strong>.
                    </p>

                    <div className="rmsc-success-actions">
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rmsc-wa-direct-btn"
                      >
                        <MessageSquare size={18} />
                        <span>Chatear Ahora por WhatsApp con un Especialista</span>
                      </a>

                      <button
                        type="button"
                        className="rmsc-reset-btn"
                        onClick={handleReset}
                      >
                        <RotateCcw size={15} />
                        <span>Realizar otra simulación</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
