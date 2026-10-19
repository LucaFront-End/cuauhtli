import React from 'react';
import { 
  Users, 
  Radio, 
  GraduationCap, 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import './ComunidadSection.css';

export default function ComunidadSection({ onOpenQuote }) {
  const cards = [
    {
      id: 'alerta',
      tag: 'Inteligencia Compartida',
      title: 'Red de Alerta Temprana & Corredores',
      desc: 'Monitoreo preventivo y reporte de incidencias en tiempo real entre parques industriales del Valle de México, Bajío, Monterrey y Guadalajara para anticipar modus operandi.',
      icon: Radio,
      items: [
        'Avisos preventivos en corredores logísticos e industriales',
        'Coordinación directa con cámaras de seguridad y C4',
        'Protocolos de reacción rápida ante alertas de intrusión'
      ]
    },
    {
      id: 'capacitacion',
      tag: 'Formación Continua',
      title: 'Mesas Técnicas & Capacitación C4',
      desc: 'Masterclasses mensuales, actualización en normativas STPS / NOM y entrenamiento técnico para que el personal de monitoreo de nuestros clientes opere con el máximo estándar.',
      icon: GraduationCap,
      items: [
        'Talleres sobre analítica de video perimetral con IA',
        'Auditorías de ciberseguridad en redes CCTV IP',
        'Certificación de operadores en plataformas VMS'
      ]
    },
    {
      id: 'benchmarking',
      tag: 'Círculo de Seguridad',
      title: 'Casos de Éxito & Benchmarking Industrial',
      desc: 'Espacio de intercambio de mejores prácticas entre más de 1,200 directores de seguridad patrimonial, administradores de CEDIS y corporativos de todo México.',
      icon: Users,
      items: [
        'Métricas reales de retorno de inversión (ROI en seguridad)',
        'Reportes trimestrales de tendencias y riesgos de zona',
        'Acceso preferente a pruebas beta con marcas líderes'
      ]
    }
  ];

  return (
    <section id="comunidad" className="comunidad-section" aria-labelledby="comunidad-heading">
      <div className="container">
        
        {/* HEADER */}
        <div className="comunidad-header">
          <div className="comunidad-badge">
            <span className="comunidad-badge-dot" />
            <span>Red Nacional de Seguridad y Prevención</span>
          </div>

          <h2 id="comunidad-heading" className="comunidad-title">
            Comunidad Cuauhtli: Más de <span className="comunidad-title-accent">1,200 empresas</span> blindando el país juntas.
          </h2>

          <p className="comunidad-desc">
            No solo instalamos tecnología; creamos un ecosistema colaborativo que conecta a directores 
            de seguridad patrimonial, gerentes de operaciones y administradores industriales en una 
            sólida red de prevención, capacitación técnica y alertas tempranas.
          </p>
        </div>

        {/* 3 COMMUNITY CARDS */}
        <div className="comunidad-grid">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.id} className="comunidad-card">
                <div>
                  <div className="comunidad-card-icon">
                    <Icon size={26} />
                  </div>
                  <div className="comunidad-card-tag">{c.tag}</div>
                  <h3 className="comunidad-card-title">{c.title}</h3>
                  <p className="comunidad-card-desc">{c.desc}</p>
                </div>

                <ul className="comunidad-card-list">
                  {c.items.map((item, i) => (
                    <li key={i}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ACTION / JOIN CARD */}
        <div className="comunidad-action-box">
          <div className="comunidad-action-left">
            <span className="comunidad-action-eyebrow">
              <Sparkles size={13} />
              <span>Acceso Exclusivo Sin Costo para Clientes Cuauhtli</span>
            </span>
            <h3 className="comunidad-action-title">
              ¿Gestionas la seguridad o infraestructura de una empresa?
            </h3>
            <p className="comunidad-action-desc">
              Súmate a la Comunidad Cuauhtli y accede a alertas de zona, mesas de análisis técnico 
              y al canal prioritario de enlace con ingenieros especialistas.
            </p>
          </div>

          <div className="comunidad-action-buttons">
            <button
              type="button"
              onClick={() => onOpenQuote?.('Comunidad Cuauhtli')}
              className="comunidad-btn-primary"
            >
              <span>Unirse a la Red</span>
              <ArrowRight size={16} />
            </button>
            <a
              href="https://wa.link/bzxy8p"
              target="_blank"
              rel="noopener noreferrer"
              className="comunidad-btn-wa"
            >
              <MessageSquare size={16} color="#15803D" />
              <span>WhatsApp Comunidad</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
