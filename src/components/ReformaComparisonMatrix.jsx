import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  FileCheck2,
  Check,
  X
} from 'lucide-react';
import './ReformaComparisonMatrix.css';

const COMPARISON_CRITERIA = [
  {
    id: 'validez',
    title: 'Validez Legal ante STPS y Tribunal',
    legalRef: 'Art. 784 LFT',
    bad: {
      headline: 'Nula e indefensa',
      desc: 'La ley revierte la carga probatoria al patrón. Sin registro electrónico inalterable, el juez presume ciertas las horas demandadas.',
      badge: 'Indefensión Total'
    },
    good: {
      headline: 'Plena eficacia probatoria',
      desc: 'Dictamen pericial digital con fe probatoria fehaciente en juicios orales y actas de inspección federal STPS.',
      badge: 'Prueba Plena'
    }
  },
  {
    id: 'trazabilidad',
    title: 'Inalterabilidad & Trazabilidad',
    legalRef: 'Hash SHA-256 + NTP',
    bad: {
      headline: 'Fácilmente manipulable',
      desc: 'Las libretas de papel y archivos de Excel son editables a posteriori y carecen de bitácora criptográfica de no-repudio.',
      badge: 'Vulnerable'
    },
    good: {
      headline: '100% Inalterable y auditado',
      desc: 'Cada marcaje queda sellado con hash matemático SHA-256 y sello horario oficial sincronizado por protocolo NTP.',
      badge: 'Criptografía SHA-256'
    }
  },
  {
    id: 'suplantacion',
    title: 'Suplantación de Identidad ("Buddy Punching")',
    legalRef: 'Biometría Facial IA',
    bad: {
      headline: 'Fraude recurrente',
      desc: 'Compañeros checan o firman por otros, inflando falsamente el cómputo de horas extraordinarias sin presencia física real.',
      badge: 'Fraude Habitual'
    },
    good: {
      headline: 'Cero posibilidad de fraude',
      desc: 'Algoritmo biométrico MinMoe con detección de rostro vivo en <0.2 s. Imposible de vulnerar con fotos o videos.',
      badge: 'Anti-Spoofing'
    }
  },
  {
    id: 'horas-extra',
    title: 'Cálculo de Jornada & Horas Extra 40h',
    legalRef: 'Art. 66, 67 y 68 LFT',
    bad: {
      headline: 'Manual y sujeto a error',
      desc: 'Cálculo tardío y engorroso de turnos escalonados, generando discrepancias graves en el timbrado de nómina CFDI.',
      badge: 'Errores de Nómina'
    },
    good: {
      headline: 'Auditoría automática en tiempo real',
      desc: 'Desglose inmediato de horas dobles y triples según la LFT, con alertas preventivas y conexión directa a CONTPAQi, NOI y SAP.',
      badge: 'Cómputo Exacto'
    }
  },
  {
    id: 'multisede',
    title: 'Control Centralizado Multi-Sucursal',
    legalRef: 'HikCentral / Cloud',
    bad: {
      headline: 'Disperso y desarticulado',
      desc: 'Exige recopilar papeles físicos o viajar periódicamente a cada planta o sucursal para cuadrar asistencias.',
      badge: 'Sin Visibilidad'
    },
    good: {
      headline: 'Gestión unificada en tiempo real',
      desc: 'Concentración inmediata de todas las sedes de la República en un solo servidor corporativo o nube segura.',
      badge: 'Multi-Sede Instantáneo'
    }
  },
  {
    id: 'multas',
    title: 'Exposición a Multas STPS',
    legalRef: '250 a 5,000 UMA por trabajador',
    bad: {
      headline: 'Riesgo crítico de sanción',
      desc: 'Sanciones económicas que van de $29,327 a más de $586,550 MXN por centro inspeccionado o colaborador auditado.',
      badge: 'Hasta $586k+ MXN'
    },
    good: {
      headline: 'Blindaje total garantizado',
      desc: 'Cumplimiento cabal del criterio obligatorio vinculante a partir del 1 de enero de 2027 sin contingencias.',
      badge: 'Cero Sanciones'
    }
  }
];

export default function ReformaComparisonMatrix({ onOpenQuote }) {
  const [mobileTab, setMobileTab] = useState('all'); // 'all' | 'bad' | 'good'
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <section className="reforma-section rcm-section" id="comparativa-cumplimiento">
      
      {/* SECTION HEADER ALIGNED WITH HOME */}
      <div className="reforma-section-header rcm-header">
        <div className="reforma-section-tag rcm-eyebrow">
          <span className="rcm-eyebrow-dot" />
          <span>Matriz Comparativa de Cumplimiento</span>
        </div>
        <h2 className="reforma-section-title rcm-title">
          ¿Por qué el método tradicional es un <em>riesgo para su empresa?</em>
        </h2>
        <p className="reforma-section-subtitle rcm-subtitle">
          Contraste técnico y legal entre bitácoras manuales y una infraestructura biométrica homologada con valor probatorio pleno.
        </p>
      </div>

      {/* MOBILE FILTER PILL (ONLY ON SCREENS < 768px) */}
      <div className="rcm-mobile-filter">
        <button
          type="button"
          className={`rcm-filter-btn ${mobileTab === 'all' ? 'active' : ''}`}
          onClick={() => setMobileTab('all')}
        >
          Vista Comparativa
        </button>
        <button
          type="button"
          className={`rcm-filter-btn ${mobileTab === 'bad' ? 'active' : ''}`}
          onClick={() => setMobileTab('bad')}
        >
          Método Tradicional
        </button>
        <button
          type="button"
          className={`rcm-filter-btn ${mobileTab === 'good' ? 'active' : ''}`}
          onClick={() => setMobileTab('good')}
        >
          Solución Cuauhtli
        </button>
      </div>

      {/* COMPARISON MATRIX CARD */}
      <div className="rcm-matrix-shell">
        
        {/* MATRIX HEADER ROW */}
        <div className="rcm-matrix-header">
          <div className="rcm-header-col rcm-col-metric">
            <span className="rcm-header-label">Criterio Legal & Operativo</span>
          </div>

          <div className={`rcm-header-col rcm-col-bad ${mobileTab === 'good' ? 'rcm-hide-mobile' : ''}`}>
            <div className="rcm-col-status rcm-status-bad">
              <X size={12} />
              <span>Vulnerable · No Conforme</span>
            </div>
            <h3 className="rcm-col-title">Método Tradicional</h3>
            <span className="rcm-col-desc">Papel / Excel / Reloj Análogo</span>
          </div>

          <div className={`rcm-header-col rcm-col-good ${mobileTab === 'bad' ? 'rcm-hide-mobile' : ''}`}>
            <div className="rcm-col-status rcm-status-good">
              <ShieldCheck size={13} />
              <span>Criterio STPS 2027</span>
            </div>
            <h3 className="rcm-col-title">
              Solución Cuauhtli <em>Biométrica</em>
            </h3>
            <span className="rcm-col-desc">MinMoe AI + Cloud SHA-256</span>
          </div>
        </div>

        {/* MATRIX ROWS */}
        <div className="rcm-matrix-body">
          {COMPARISON_CRITERIA.map((row, idx) => (
            <div
              key={row.id}
              className={`rcm-matrix-row ${hoveredRow === idx ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              
              {/* CRITERION COLUMN */}
              <div className="rcm-cell rcm-cell-metric">
                <div className="rcm-metric-index">0{idx + 1}</div>
                <div className="rcm-metric-info">
                  <h4 className="rcm-metric-title">{row.title}</h4>
                  <span className="rcm-metric-ref">{row.legalRef}</span>
                </div>
              </div>

              {/* TRADITIONAL METHOD COLUMN */}
              <div className={`rcm-cell rcm-cell-bad ${mobileTab === 'good' ? 'rcm-hide-mobile' : ''}`}>
                <div className="rcm-cell-content">
                  <div className="rcm-row-status-pill rcm-pill-bad">
                    <XCircle size={14} className="rcm-icon-bad" />
                    <span>{row.bad.badge}</span>
                  </div>
                  <strong className="rcm-cell-headline rcm-bad-headline">{row.bad.headline}</strong>
                  <p className="rcm-cell-desc">{row.bad.desc}</p>
                </div>
              </div>

              {/* CUAUTHLI BIOMETRIC SOLUTION COLUMN */}
              <div className={`rcm-cell rcm-cell-good ${mobileTab === 'bad' ? 'rcm-hide-mobile' : ''}`}>
                <div className="rcm-cell-content">
                  <div className="rcm-row-status-pill rcm-pill-good">
                    <CheckCircle2 size={14} className="rcm-icon-good" />
                    <span>{row.good.badge}</span>
                  </div>
                  <strong className="rcm-cell-headline rcm-good-headline">{row.good.headline}</strong>
                  <p className="rcm-cell-desc">{row.good.desc}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* MATRIX BOTTOM VERDICT & ACTION BAR */}
        <div className="rcm-matrix-footer">
          <div className="rcm-footer-insight">
            <div className="rcm-insight-icon">
              <Sparkles size={16} />
            </div>
            <div className="rcm-insight-text">
              <strong>Dictamen Técnico Cuauhtli:</strong> Migrar hacia terminales biométricas con sello NTP erradica el 100% de las contingencias por horas extras no comprobables y blinda a su empresa ante inspecciones STPS.
            </div>
          </div>

          <button
            type="button"
            className="rcm-footer-cta"
            onClick={() => onOpenQuote?.('Auditoría y Levantamiento Técnico: Matriz Comparativa STPS')}
          >
            <span>Solicitar Levantamiento Técnico</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>

    </section>
  );
}
