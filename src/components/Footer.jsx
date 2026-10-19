import React from 'react';
import { 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export default function Footer({ onOpenQuote, onNavigateHome, onNavigateService }) {
  const handleService = (e, slug) => {
    e.preventDefault();
    window.location.hash = `servicio-${slug}`;
    onNavigateService?.(slug);
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.hash = '';
    onNavigateHome?.();
  };

  return (
    <footer 
      id="contacto"
      style={{
        backgroundColor: '#141513',
        color: '#FFFFFF',
        borderTop: '1px solid #2A2C28',
        paddingTop: '80px',
        paddingBottom: '40px',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* TOP ROW: BRAND & COLUMNS */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '48px',
            marginBottom: '60px'
          }}
        >
          {/* BRAND COLUMN */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ marginBottom: '18px' }}>
              <a href="#" onClick={handleHome} style={{ display: 'inline-block' }}>
                <img 
                  src="/assets/cuauhtli_logo.jpg" 
                  alt="Sistemas Cuauhtli" 
                  style={{ height: '40px', width: 'auto', objectFit: 'contain', background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px' }}
                />
              </a>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
              Empresa mexicana especializada en asesoría, diseño, instalación y mantenimiento de 
              sistemas electrónicos de seguridad de alta tecnología para empresas y residencias en CDMX.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#10B981', fontFamily: 'var(--font-mono)' }}>
              <span className="pulse-beacon" />
              <span>SOPORTE TÉCNICO ACTIVO 24/7/365</span>
            </div>
          </div>

          {/* SOLUTIONS COLUMN */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
              SOLUCIONES TÉCNICAS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li>
                <a 
                  href="#servicio-cctv" 
                  onClick={(e) => handleService(e, 'cctv')}
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                >
                  Circuito Cerrado (CCTV) con IA
                </a>
              </li>
              <li>
                <a 
                  href="#servicio-control-acceso" 
                  onClick={(e) => handleService(e, 'control-acceso')}
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                >
                  Control de Acceso Biométrico
                </a>
              </li>
              <li>
                <a 
                  href="#servicio-alarmas" 
                  onClick={(e) => handleService(e, 'alarmas')}
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                >
                  Alarmas Inteligentes y Monitoreo C4
                </a>
              </li>
              <li>
                <a 
                  href="#servicio-cercas-electrificadas" 
                  onClick={(e) => handleService(e, 'cercas-electrificadas')}
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                >
                  Cercas Electrificadas Homologadas
                </a>
              </li>
              <li>
                <a 
                  href="#servicio-videoporteros" 
                  onClick={(e) => handleService(e, 'videoporteros')}
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                >
                  Videoporteros IP & Intercom
                </a>
              </li>
              <li>
                <a 
                  href="#trayectoria" 
                  onClick={handleHome}
                  style={{ color: '#C8DCE8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Trayectoria & Evolución</span>
                  <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>

          {/* COBERTURA & NAVEGACION COLUMN */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
              NAVEGACIÓN
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li><a href="#soluciones" style={{ color: 'inherit', textDecoration: 'none' }}>Sistemas & Soluciones</a></li>
              <li><a href="#testimonios" style={{ color: 'inherit', textDecoration: 'none' }}>Testimonios Verificados</a></li>
              <li><a href="#cobertura" style={{ color: 'inherit', textDecoration: 'none' }}>Presencia & Cobertura Nacional</a></li>
              <li><a href="#trayectoria" style={{ color: 'inherit', textDecoration: 'none' }}>Nuestra Trayectoria (2014-2025)</a></li>
              <li><a href="#nosotros" onClick={handleHome} style={{ color: 'inherit', textDecoration: 'none' }}>Sobre Nosotros & Garantías</a></li>
              <li><a href="#comunidad" onClick={handleHome} style={{ color: 'inherit', textDecoration: 'none' }}>Comunidad Cuauhtli</a></li>
              <li><a href="#contacto" style={{ color: 'inherit', textDecoration: 'none' }}>Contacto Directo</a></li>
            </ul>
          </div>

          {/* CONTACT INFO COLUMN */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
              CONTACTO DIRECTO CDMX
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#CBD5E1' }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Ciudad de México y Área Metropolitana, México</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#38BDF8" style={{ flexShrink: 0 }} />
                <a href="tel:5585262115" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
                  (55) 8526-2115
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#38BDF8" style={{ flexShrink: 0 }} />
                <a href="mailto:ventas@cuauhtli.mx" style={{ color: 'inherit', textDecoration: 'none' }}>
                  ventas@cuauhtli.mx
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Lun a Vie: 08:30 - 18:30 | Sáb: 09:00 - 14:00
                </span>
              </div>

              <div style={{ marginTop: '8px' }}>
                <button
                  onClick={onOpenQuote}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Solicitar Cotización Formal
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM ROW: COPYRIGHT & LEGAL */}
        <div 
          style={{
            paddingTop: '32px',
            borderTop: '1px solid #1E293B',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.78rem',
            color: '#64748B'
          }}
        >
          <div>
            © {new Date().getFullYear()} Sistemas Cuauhtli. Todos los derechos reservados. Ciudad de México.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://www.cuauhtli.mx/aviso-de-privacidad" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              Aviso de Privacidad
            </a>
            <a href="#nosotros" style={{ color: 'inherit', textDecoration: 'none' }}>
              Términos de Servicio
            </a>
            <a href="#contacto" style={{ color: 'inherit', textDecoration: 'none' }}>
              Garantías NOM
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
