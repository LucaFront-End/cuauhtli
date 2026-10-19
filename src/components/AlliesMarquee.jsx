import React from 'react';
import { Award } from 'lucide-react';
import { BrandScroller, BrandScrollerReverse } from './ui/brand-scroller';

export default function AlliesMarquee() {
  return (
    <section 
      style={{
        padding: '24px 0 44px 0',
        backgroundColor: '#FFFFFF',
        borderTop: 'none',
        borderBottom: '1px solid var(--border-light)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div className="container" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.86rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)'
          }}
        >
          <Award size={16} color="var(--primary)" />
          <span>Equipamiento Homologado con Marcas Líderes a Nivel Global</span>
        </div>
      </div>

      {/* DUAL OPPOSING 21ST.DEV BRAND SCROLLERS */}
      <div 
        style={{ 
          width: '100%', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {/* ROW 1: SCROLLS LEFT */}
        <BrandScroller duration="42s" />

        {/* ROW 2: SCROLLS RIGHT */}
        <BrandScrollerReverse duration="42s" />
      </div>
    </section>
  );
}
