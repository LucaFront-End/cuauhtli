import React from 'react';
import Timeline from './ui/timeline';
import { 
  ShieldCheck, 
  Cpu, 
  Building2, 
  Award, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import './TimelineSection.css';

export default function TimelineSection({ onOpenQuote }) {
  // Chronological order: 2014 forward to 2025 as requested
  const timelineData = [
    {
      title: "2014",
      content: (
        <div className="tls-content">
          <div className="tls-meta-badge">
            <Award size={12} className="tls-meta-icon" />
            <span>Fundación en CDMX · Orígenes</span>
          </div>

          <h4 className="tls-title">
            Nacimiento de Sistemas Cuauhtli: Ingeniería con Rigor y Calidad
          </h4>

          <p className="tls-desc">
            Fundada en la Ciudad de México con la convicción de profesionalizar la seguridad electrónica: eliminar cableados desordenados, cámaras ciegas y equipos sin soporte. Establecimos desde el primer día el estándar de garantía vitalicia en mano de obra e instalación certificada.
          </p>

          <div className="tls-tags-strip">
            <span className="tls-tag-item">Primeros 50 corporativos en CDMX</span>
            <span className="tls-tag-item">Alianzas de distribución de fábrica</span>
            <span className="tls-tag-item">Garantía vitalicia en mano de obra</span>
          </div>

          {/* MINIMALIST 2-IMAGE SHOWCASE */}
          <div className="tls-photo-grid">
            <div className="tls-photo-frame">
              <img 
                src="/assets/features/face.jpg" 
                alt="Primeros sistemas biométricos en CDMX" 
                className="tls-photo"
                loading="lazy"
              />
              <span className="tls-photo-label">Primeros controles de acceso</span>
            </div>

            <div className="tls-photo-frame">
              <img 
                src="/assets/images/access_control.jpg" 
                alt="Instalación de cerraduras magnéticas industriales" 
                className="tls-photo"
                loading="lazy"
              />
              <span className="tls-photo-label">Cerraduras electromagnéticas</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2018",
      content: (
        <div className="tls-content">
          <div className="tls-meta-badge">
            <ShieldCheck size={12} className="tls-meta-icon" />
            <span>Pólizas Corporativas & Mantenimiento</span>
          </div>

          <h4 className="tls-title">
            Servicio Llave en Mano y Automatización en Alta Gama
          </h4>

          <p className="tls-desc">
            Implementamos nuestro modelo integral de pólizas 24/7: diseño de planos, canalización norma industrial y mesa de ayuda directa sin intermediarios para corporativos y privadas residenciales en Santa Fe, Polanco e Insurgentes.
          </p>

          <div className="tls-tags-strip">
            <span className="tls-tag-item">Videoporteros IP multi-pantalla</span>
            <span className="tls-tag-item">Cercas electrificadas inteligentes</span>
            <span className="tls-tag-item">Mantenimiento preventivo programado</span>
          </div>

          <div className="tls-photo-grid">
            <div className="tls-photo-frame">
              <img 
                src="/assets/features/lobby.jpg" 
                alt="Lobby corporativo con torniquetes de acceso" 
                className="tls-photo"
                loading="lazy"
              />
              <span className="tls-photo-label">Torniquetes en corporativos AAA</span>
            </div>

            <div className="tls-photo-frame">
              <img 
                src="/assets/images/perimeter_fence.jpg" 
                alt="Cerca electrificada perimetral" 
                className="tls-photo"
                loading="lazy"
              />
              <span className="tls-photo-label">Protección perimetral activa</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2021",
      content: (
        <div className="tls-content">
          <div className="tls-meta-badge">
            <Building2 size={12} className="tls-meta-icon" />
            <span>Expansión a Parques Industriales</span>
          </div>

          <h4 className="tls-title">
            Red de Hubs en Bajío, Occidente y Corredores Logísticos
          </h4>

          <p className="tls-desc">
            Ampliamos nuestra presencia física con cuadrillas e inventario local en Querétaro (El Marqués), Guadalajara y Monterrey, protegiendo armadoras automotrices, plantas farmacéuticas y naves de almacenamiento a gran escala.
          </p>

          <div className="tls-tags-strip">
            <span className="tls-tag-item">Troncales de fibra óptica monomodo</span>
            <span className="tls-tag-item">Stock de refacciones con cambio &lt; 24h</span>
            <span className="tls-tag-item">Torniquetes de cuerpo completo</span>
          </div>

          <div className="tls-photo-grid">
            <div className="tls-photo-frame">
              <img 
                src="/assets/features/warehouse.jpg" 
                alt="Seguridad en naves industriales y CEDIS" 
                className="tls-photo"
                loading="lazy"
              />
              <span className="tls-photo-label">Parques logísticos & CEDIS</span>
            </div>

            <div className="tls-photo-frame">
              <img 
                src="/assets/images/cctv_ptz.jpg" 
                alt="Domo PTZ Óptico 360 grados" 
                className="tls-photo"
                loading="lazy"
              />
              <span className="tls-photo-label">Domo PTZ óptico de largo alcance</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2024 – 2025",
      content: (
        <div className="tls-content">
          <div className="tls-meta-badge is-highlight">
            <Sparkles size={12} className="tls-meta-icon" />
            <span>Era de Inteligencia Artificial & Nube C4</span>
          </div>

          <h4 className="tls-title">
            Inteligencia Artificial en Borde, Radares y Central C4
          </h4>

          <p className="tls-desc">
            Consolidamos nuestra plataforma integral con analítica de visión computacional: clasificación de objetivos (humano/vehículo) para cero falsas alarmas, control facial masivo sin contacto y lectura LPR en tiempo real con SLA menor a 1 hora.
          </p>

          <div className="tls-tags-strip">
            <span className="tls-tag-item is-accent">+180 proyectos activos</span>
            <span className="tls-tag-item is-accent">Cámaras térmicas con IA</span>
            <span className="tls-tag-item is-accent">Lectura de matrículas (LPR)</span>
            <span className="tls-tag-item is-accent">SLA &lt; 1 hr en Valle de México</span>
          </div>

          <div className="tls-photo-grid">
            <div className="tls-photo-frame">
              <img 
                src="/assets/images/alarm_center.jpg" 
                alt="Central de Monitoreo C4 Cuauhtli" 
                className="tls-photo"
                loading="lazy"
              />
              <span className="tls-photo-label">Central de Monitoreo C4 (24/7/365)</span>
            </div>

            <div className="tls-photo-frame">
              <img 
                src="/assets/features/entrance.jpg" 
                alt="Acceso vehicular automatizado con IA" 
                className="tls-photo"
                loading="lazy"
              />
              <span className="tls-photo-label">Acceso LPR con barreras rápidas</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const customHeader = (
    <div className="tls-header-box">
      <div className="tls-eyebrow">
        <Sparkles size={12} className="tls-eyebrow-icon" />
        <span>Trayectoria & Evolución · 2014 – 2025</span>
      </div>

      <h2 className="tls-heading">
        Más de una década elevando el estándar de la{' '}
        <em>seguridad electrónica en México.</em>
      </h2>

      <p className="tls-sub">
        De nuestros primeros proyectos en CDMX a proteger armadoras automotrices, parques industriales y corporativos con analítica de visión artificial en todo el país.
      </p>
    </div>
  );

  return (
    <section id="trayectoria" className="tls-section" aria-label="Trayectoria de Sistemas Cuauhtli">
      <Timeline
        data={timelineData}
        header={customHeader}
      />

      {/* MINIMALIST BOTTOM CTA */}
      <div className="tls-cta-wrap">
        <div className="tls-cta-card">
          <div className="tls-cta-copy">
            <h4>¿Quieres implementar ingeniería de este nivel en tu empresa?</h4>
            <p>Agenda un levantamiento técnico sin costo y recibe una propuesta con planos y memoria técnica.</p>
          </div>
          <button 
            type="button" 
            className="tls-cta-btn"
            onClick={() => onOpenQuote?.('Proyecto Integral Cuauhtli')}
          >
            <span>Solicitar Diagnóstico en Sitio</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
