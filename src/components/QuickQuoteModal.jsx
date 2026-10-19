import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Shield, Send, CheckCircle2, Phone, Mail, Building, MapPin } from 'lucide-react';

export default function QuickQuoteModal({ isOpen, onClose, defaultSolution }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(defaultSolution || 'CCTV con Inteligencia Artificial');
  const [location, setLocation] = useState('CDMX');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });

    const msg = encodeURIComponent(
      `Hola Sistemas Cuauhtli! 👋 Solicito cotización urgente:\n` +
      `🛡️ Solución: ${service}\n` +
      `👤 Nombre: ${name}\n` +
      `📞 Teléfono: ${phone}\n` +
      `📧 Correo: ${email || 'No proporcionado'}\n` +
      `📍 Ubicación: ${location}\n` +
      `📝 Comentarios: ${comments || 'Sin comentarios adicionales'}`
    );

    setTimeout(() => {
      window.open(`https://wa.me/525585262115?text=${msg}`, '_blank');
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '540px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-light)',
          padding: '36px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
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

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Cotización Rápida
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Recibe propuesta técnica y costos en menos de 2 horas.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Sistema de Interés Principal:
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-secondary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: 'var(--text-main)'
                }}
              >
                <option value="CCTV con Inteligencia Artificial">CCTV 4K con Inteligencia Artificial</option>
                <option value="Control de Acceso Biométrico">Control de Acceso Biométrico & Torniquetes</option>
                <option value="Cercas Electrificadas Homologadas">Cercas Electrificadas de Alto Voltaje</option>
                <option value="Alarmas Inteligentes y Monitoreo">Alarmas Inteligentes con Monitoreo 24/7</option>
                <option value="Videoporteros IP & Intercom">Videoporteros IP & Control Remoto</option>
                <option value="Solución Integral Completa">Solución Integral Llave en Mano</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Nombre completo o Razón Social:
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Ing. Laura Gómez / Corporativo Reforma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-secondary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Teléfono / WhatsApp:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="55 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-secondary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Ubicación del inmueble:
                </label>
                <input
                  type="text"
                  placeholder="Ej. CDMX / Polanco"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-secondary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Detalles del requerimiento (opcional):
              </label>
              <textarea
                rows={3}
                placeholder="Ej. Requerimos 16 cámaras para bodega y 2 torniquetes con biometría facial."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-secondary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            >
              <span>Generar y Enviar Solicitud</span>
              <Send size={18} />
            </button>

            {submitted && (
              <div 
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  fontSize: '0.82rem',
                  textAlign: 'center',
                  fontWeight: 600
                }}
              >
                ✓ Redirigiendo a WhatsApp oficial para asignarte un ingeniero especialista...
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={14} color="#10B981" />
              <span>Visita de levantamiento técnico sin costo en CDMX y EdoMex.</span>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
