import React, { useState } from 'react';
import { Star, ShieldCheck, ChevronRight } from 'lucide-react';
import HighlightTestimonialSection from './ui/highlight-testimonial-section';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    author: 'Lic. Gerardo Valdés',
    role: 'Dir. de Operaciones',
    company: 'Torre Santa Fe',
    place: 'CDMX',
    quote: 'Rediseñaron el CCTV con 80 cámaras con IA. Las falsas alarmas bajaron un 95% y el control de accesos agilizó el lobby.',
    highlight: 'Las falsas alarmas bajaron un 95%',
    tag: 'CCTV 4K IA',
    rating: 5,
  },
  {
    author: 'Ing. Mariana Castillo',
    role: 'Gerente de Planta',
    company: 'Parque Ind. Tlalnepantla',
    place: 'Edo. Méx.',
    quote: 'Cerca electrificada y cámaras térmicas perimetrales. Tienen un tiempo de respuesta técnica insuperable en CDMX.',
    highlight: 'un tiempo de respuesta técnica insuperable',
    tag: 'CCTV Térmico',
    rating: 5,
  },
  {
    author: 'Dr. Alejandro Rivas',
    role: 'Comité de Colonos',
    company: 'Bosques de las Lomas',
    place: 'CDMX',
    quote: 'Videoporteros IP y cámaras ColorVu para 35 residencias. El monitoreo nocturno nítido nos cambió por completo la seguridad.',
    highlight: 'nos cambió por completo la seguridad',
    tag: 'Videoporteros IP',
    rating: 5,
  },
  {
    author: 'Mtra. Sofía Altamirano',
    role: 'Seguridad Patrimonial',
    company: 'Centro Logístico Cuautitlán',
    place: 'Edo. Méx.',
    quote: 'La analítica de intrusión perimetral con IA evitó tres siniestros críticos este año. Detección y soporte 24/7 sin fallas.',
    highlight: 'evitó tres siniestros críticos este año',
    tag: 'Analítica IA',
    rating: 5,
  },
  {
    author: 'Arq. Roberto Morales',
    role: 'Director de Obra',
    company: 'Desarrollos Polanco',
    place: 'CDMX',
    quote: 'Instalación impecable en tiempo récord. Su ingeniería y acabados superaron las expectativas de nuestros inversionistas.',
    highlight: 'superaron las expectativas de nuestros inversionistas',
    tag: 'Control Biométrico',
    rating: 5,
  },
];

function CardTop(item) {
  return (
    <div className="tst-card-top">
      <div className="tst-stars" aria-label={`${item.rating} de 5 estrellas`}>
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" strokeWidth={1.5} />
        ))}
      </div>
      <span className="tst-tag">
        <ShieldCheck size={12} strokeWidth={2} />
        <span>{item.tag}</span>
      </span>
    </div>
  );
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  return (
    <section id="testimonios" className="tst" aria-labelledby="tst-heading">
      <div className="tst-container">
        <div className="tst-grid">
          
          {/* ================= COLUMNA IZQUIERDA: TEXTO E INTRODUCCIÓN ================= */}
          <div className="tst-intro">
            <div className="tst-eyebrow">
              <span className="tst-eyebrow-dot" />
              <span>Reseñas Verificadas · 5.0 ★</span>
            </div>

            <h2 id="tst-heading" className="tst-heading">
              Lo que dicen quienes
              <br />
              <em>ya están protegidos.</em>
            </h2>

            <p className="tst-sub">
              Casos de éxito comprobados en corporativos, plantas industriales y residenciales en el Valle de México.
            </p>

            {/* LISTA SINCRONIZADA DE CLIENTES */}
            <div className="tst-client-list" role="tablist" aria-label="Clientes destacados">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.company}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  className={`tst-client-item ${i === index ? 'is-active' : ''}`}
                  onClick={() => setIndex(i)}
                >
                  <span className="tst-client-rail" />
                  <span className="tst-client-num">0{i + 1}</span>
                  <div className="tst-client-info">
                    <span className="tst-client-name">{t.company}</span>
                    <span className="tst-client-tag">{t.tag}</span>
                  </div>
                  <ChevronRight size={13} className="tst-client-arrow" />
                </button>
              ))}
            </div>
          </div>

          {/* ================= COLUMNA DERECHA: RESEÑAS Y ANIMACIONES ================= */}
          <div className="tst-stage">
            <HighlightTestimonialSection
              testimonials={TESTIMONIALS}
              index={index}
              onIndexChange={setIndex}
              interval={5500}
              renderCardTop={CardTop}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
