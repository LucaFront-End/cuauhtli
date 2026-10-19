import React, { useState } from 'react';
import { MessageSquare, X, Shield, ArrowUpRight } from 'lucide-react';

export default function FloatingWhatsapp() {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px'
      }}
    >
      {/* TOOLTIP POPUP */}
      {tooltipOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 18px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
            border: '1px solid var(--border-light)',
            width: '280px',
            animation: 'fadeIn 0.2s ease-out',
            position: 'relative'
          }}
        >
          <button
            onClick={() => setTooltipOpen(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--text-light)'
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="pulse-beacon" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              ASESORÍA EN LÍNEA CDMX
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '12px' }}>
            ¿Necesitas cotizar CCTV, Control de Acceso o Cercas hoy mismo? Escríbenos por WhatsApp.
          </p>

          <a
            href="https://wa.link/bzxy8p"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center', backgroundColor: '#25D366', borderColor: '#25D366', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)' }}
          >
            <span>Iniciar Chat Directo</span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setTooltipOpen(!tooltipOpen)}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Contactar por WhatsApp"
      >
        <MessageSquare size={28} fill="#FFFFFF" />
        
        {/* PING BADGE */}
        <span 
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: '2px solid #FFFFFF'
          }}
        />
      </button>
    </div>
  );
}
