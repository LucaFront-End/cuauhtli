import React from 'react';
import { motion } from 'motion/react';
import { Navigation, Clock, ShieldCheck, MapPin, Zap } from 'lucide-react';
import MexicoPresencePicker from './ui/mexico-presence-picker';
import './CoverageMapSection.css';

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: EASE },
  }),
};

export default function CoverageMapSection({ onOpenQuote }) {
  const handleSelectZone = (zoneData) => {
    // Optional callback if needed
  };

  return (
    <section id="cobertura" className="cov" aria-labelledby="cov-heading">
      <div className="cov-container">
        
        {/* SECTION HEADER */}
        <div className="cov-header">
          <motion.div
            className="cov-eyebrow"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Navigation size={12} className="cov-eyebrow-icon" />
            <span>Presencia Nacional · Cuadrillas Técnicas Activas</span>
          </motion.div>

          <motion.h2
            id="cov-heading"
            className="cov-heading"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            Dónde estamos y qué tan{' '}
            <em>rápido llegamos a tu instalación.</em>
          </motion.h2>

          <motion.p
            className="cov-sub"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            Matriz central y cuadrillas 24/7 en el Valle de México, junto con centros de ingeniería en los principales corredores industriales del país.
          </motion.p>

          {/* MINIMALIST METRICS BADGES */}
          <motion.div
            className="cov-metrics"
            variants={fadeUp}
            custom={3}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="cov-metric-item">
              <span className="cov-metric-val">&lt; 1 hr</span>
              <span className="cov-metric-label">Arribo en Valle de México</span>
            </div>
            <div className="cov-metric-divider" />
            <div className="cov-metric-item">
              <span className="cov-metric-val">7 Hubs</span>
              <span className="cov-metric-label">Corredores industriales activos</span>
            </div>
            <div className="cov-metric-divider" />
            <div className="cov-metric-item">
              <span className="cov-metric-val">24/7/365</span>
              <span className="cov-metric-label">Cuadrillas y soporte en sitio</span>
            </div>
          </motion.div>
        </div>

        {/* INTERACTIVE MEXICO PRESENCE PICKER MAP */}
        <motion.div
          className="cov-picker-wrap"
          variants={fadeUp}
          custom={4}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <MexicoPresencePicker
            defaultRegionId={null}
            onSelectZone={handleSelectZone}
            onOpenQuote={onOpenQuote}
          />
        </motion.div>

      </div>
    </section>
  );
}
