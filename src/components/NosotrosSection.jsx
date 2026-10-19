import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Check,
  Building2,
  Sparkles
} from 'lucide-react';
import './NosotrosSection.css';

export default function NosotrosSection({ onOpenQuote, compact = false }) {
  const stats = [
    { num: '+10', lbl: 'Años de Trayectoria (2014 – 2025)', icon: Award },
    { num: '+1,200', lbl: 'Proyectos y Naves Blindadas', icon: Building2 },
    { num: '99.8%', lbl: 'Efectividad en Alertas con IA', icon: Cpu },
    { num: '< 1 hr', lbl: 'SLA de Respuesta en Sitio (CDMX)', icon: Clock },
  ];

  const pillars = [
    {
      id: 'ingenieria',
      tag: 'Certificación Tier-1',
      title: 'Ingeniería Propia & Cuadrillas Certificadas',
      desc: 'No subcontratamos instaladores improvisados. Nuestro equipo está conformado por ingenieros y técnicos de planta avalados directamente por Hikvision Platinum, Dahua Tier-1, Honeywell, Ajax y ZKTeco.',
      badge: 'Personal con control de confianza',
      icon: Award,
    },
    {
      id: 'garantia',
      tag: 'Póliza Exclusiva',
      title: 'Póliza Vitalicia de Mano de Obra',
      desc: 'Sellamos cada obra con nuestra garantía única: si alguna canalización, peinado de rack o conector sufre falla por vicio de origen, lo corregimos sin costo durante toda la vida útil de tu instalación.',
      badge: 'Cero costos ocultos o sorpresas',
      icon: ShieldCheck,
    },
    {
      id: 'sla',
      tag: 'Cobertura Operativa',
      title: 'Central C4 & Respuesta Inmediata',
      desc: 'SLA garantizado por contrato con arribo en menos de 1 hora en CDMX/EdoMex y menos de 2 horas en corredores del Bajío, Monterrey y Guadalajara. Monitoreo redundante y enlace de zona 24/7/365.',
      badge: 'Cuadrillas móviles en campo',
      icon: Clock,
    },
    {
      id: 'abierto',
      tag: 'Soberanía Tecnológica',
      title: 'Protocolos Abiertos Sin Dependencias',
      desc: 'Instalamos tecnología con arquitectura estándar (ONVIF, Wiegand, OSDP). Nunca te atamos a licencias propietarias abusivas: mantienes el control total e interoperabilidad de tus sistemas.',
      badge: '100% interoperable con VMS globales',
      icon: Wrench,
    },
  ];

  return (
    <section 
      id="nosotros" 
      className={`nosotros-section ${compact ? 'is-compact' : ''}`}
      aria-labelledby="nosotros-heading"
    >
      <div className="container">
        
        {/* HEADER */}
        <div className="nosotros-header">
          <div className="nosotros-badge">
            <span className="nosotros-badge-dot" />
            <span>Sobre Sistemas Cuauhtli</span>
          </div>

          <h2 id="nosotros-heading" className="nosotros-title">
            Ingeniería mexicana de élite que <span className="nosotros-title-accent">protege lo que más importa</span>.
          </h2>

          <p className="nosotros-desc">
            Fundada en la Ciudad de México, Sistemas Cuauhtli nació para erradicar las fallas, la improvisación 
            y los falsos disparos en la seguridad electrónica. Hoy blindamos la continuidad operativa 
            de más de 1,200 industrias, centros logísticos CEDIS y corporativos en todo el país.
          </p>
        </div>

        {/* METRICS STRIP */}
        <div className="nosotros-stats-strip">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="nosotros-stat-card">
                <div className="nosotros-stat-icon-wrap">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="nosotros-stat-num">{s.num}</div>
                  <div className="nosotros-stat-lbl">{s.lbl}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 PILLARS GRID */}
        <div className="nosotros-pillars-grid">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="nosotros-pillar-card">
                <div>
                  <div className="nosotros-pillar-top">
                    <div className="nosotros-pillar-icon">
                      <Icon size={24} />
                    </div>
                    <div>
                      <div className="nosotros-pillar-tag">{item.tag}</div>
                      <h3 className="nosotros-pillar-title">{item.title}</h3>
                    </div>
                  </div>
                  <p className="nosotros-pillar-desc">{item.desc}</p>
                </div>

                <div className="nosotros-pillar-footer">
                  <span className="nosotros-pillar-badge">
                    <CheckCircle2 size={15} color="var(--primary, #A6192E)" />
                    <span>{item.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM MANIFESTO & CTA */}
        <div className="nosotros-banner">
          <div className="nosotros-banner-glow" />
          <div className="nosotros-banner-content">
            <span className="nosotros-banner-badge">
              <Sparkles size={13} />
              <span>Estudio de Viabilidad en Sitio Sin Costo</span>
            </span>
            <h3 className="nosotros-banner-title">
              ¿Listo para elevar el estándar de seguridad en tus instalaciones?
            </h3>
            <p className="nosotros-banner-desc">
              Un ingeniero especialista de nuestro equipo visitará tu inmueble, 
              evaluará vulnerabilidades y te entregará una propuesta ejecutiva formal 
              con planos y especificaciones sin compromiso.
            </p>
          </div>

          <div className="nosotros-banner-actions">
            <button
              type="button"
              onClick={() => onOpenQuote?.('Solución Integral Completa')}
              className="nosotros-banner-btn"
            >
              <span>Agendar Visita Técnica</span>
              <ArrowRight size={16} />
            </button>
            <a href="tel:5585262115" className="nosotros-banner-tel">
              <Phone size={13} />
              <span>Atención Directa: (55) 8526-2115</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
