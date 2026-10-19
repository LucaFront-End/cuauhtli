import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import HeroCamera3D from './HeroCamera3D';

export default function Hero({ onOpenQuote }) {
  // Real Typewriter Effect typing and deleting the dynamic word
  const words = [
    'inteligente',
    'autónoma',
    'predictiva',
    'preventiva',
    'certificada',
    'avanzada'
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timer;

    if (!isDeleting) {
      // Typing forward letter by letter
      if (currentText.length < currentWord.length) {
        timer = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, 80);
      } else {
        // Pause at full word before backspacing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      // Backspacing
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length - 1));
        }, 40);
      } else {
        // Move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  return (
    <section 
      style={{
        position: 'relative',
        paddingTop: '96px',
        paddingBottom: '32px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
      }}
    >
      {/* SUBTLE MINIMAL BACKGROUND GRID */}
      <div 
        className="tech-grid-subtle" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.18,
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* TWO-COLUMN LAYOUT: MINIMAL LEFT & 3D CAMERA RIGHT */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '28px',
            minHeight: '495px'
          }}
          className="hero-grid"
        >
          {/* LEFT: STRICTLY MINIMAL (TITULO CON TYPEWRITER, EXCERPT, BOTON) */}
          <div style={{ maxWidth: '640px', zIndex: 5 }}>
            
            {/* TITLE WITH UNBREAKABLE TYPEWRITER EFFECT */}
            <h1 
              style={{
                fontSize: 'clamp(1.95rem, 3.2vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
                marginBottom: '20px'
              }}
            >
              {/* LINE 1: GUARANTEED SINGLE UNBREAKABLE LINE WITH CURSOR */}
              <span 
                className="hero-title-line1"
                style={{ 
                  display: 'block', 
                  whiteSpace: 'nowrap',
                  overflow: 'visible'
                }}
              >
                Seguridad{' '}
                <span 
                  style={{
                    background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline'
                  }}
                >
                  {currentText}
                </span>
                <span className="typewriter-cursor">|</span>
              </span>

              {/* LINE 2: SECOND FIXED LINE */}
              <span style={{ display: 'block' }}>
                para empresas que protegen su futuro.
              </span>
            </h1>

            {/* EXCERPT */}
            <p 
              style={{
                fontSize: '1.12rem',
                lineHeight: 1.6,
                color: 'var(--text-muted)',
                marginBottom: '32px',
                maxWidth: '540px'
              }}
            >
              Diseñamos e implementamos sistemas de seguridad electrónica de alta gama: 
              <strong> CCTV 4K con IA</strong>, control de acceso biométrico y cercas perimetrales certificadas.
            </p>

            {/* SINGLE CLEAN CTA BUTTON */}
            <div>
              <button 
                onClick={onOpenQuote}
                className="btn btn-primary"
                style={{ padding: '15px 34px', fontSize: '1.05rem' }}
              >
                <span>Cotizar Proyecto a Medida</span>
                <ArrowUpRight size={20} />
              </button>
            </div>

          </div>

          {/* RIGHT: PROPORTIONED 3D CAMERA MODEL */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <HeroCamera3D />
          </div>

        </div>

      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.15fr 0.95fr !important;
          }
        }
        @media (max-width: 640px) {
          .hero-title-line1 {
            font-size: clamp(1.45rem, 5.2vw, 2.1rem) !important;
          }
        }
      `}</style>
    </section>
  );
}
