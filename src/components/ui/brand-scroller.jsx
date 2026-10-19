import React from 'react';

// ROW 1: Real Homologated Global Brands
const brandsRow1 = [
  {
    name: 'Hikvision',
    logo: '/assets/logos/hikvision.svg',
    tag: 'Platinum Certified'
  },
  {
    name: 'Dahua Technology',
    logo: '/assets/logos/dahua.svg',
    tag: 'Tier-1 Integrator'
  },
  {
    name: 'Honeywell',
    logo: '/assets/logos/honeywell.svg',
    tag: 'Industrial Panels'
  },
  {
    name: 'Ajax Systems',
    logo: '/assets/logos/ajax.svg',
    tag: 'Smart Jeweller'
  },
  {
    name: 'ZKTeco',
    logo: '/assets/logos/zkteco.svg',
    tag: 'Biometric Access'
  },
  {
    name: 'Bosch Security',
    logo: '/assets/logos/bosch.svg',
    tag: 'Critical Mission'
  },
  {
    name: 'Cisco Meraki',
    logo: '/assets/logos/cisco.svg',
    tag: 'Enterprise Cloud'
  },
  {
    name: 'DSC Security',
    logo: '/assets/logos/dsc.svg',
    tag: 'Certified Intrusión'
  },
  {
    name: 'Axis Communications',
    logo: '/assets/logos/axis.svg',
    tag: 'Network Video'
  }
];

// ROW 2: Additional Enterprise Infrastructure & Smart Access Brands
const brandsRow2 = [
  {
    name: 'HID Global',
    logo: '/assets/logos/hid.svg',
    tag: 'RFID & Smart Pass'
  },
  {
    name: 'Hanwha Vision',
    logo: '/assets/logos/hanwha.svg',
    tag: 'AI Optics'
  },
  {
    name: 'UniFi Protect',
    logo: '/assets/logos/unifi.svg',
    tag: 'IP Security Core'
  },
  {
    name: 'Pelco',
    logo: '/assets/logos/pelco.svg',
    tag: 'Motorola Solutions'
  },
  {
    name: 'Avigilon',
    logo: '/assets/logos/avigilon.svg',
    tag: 'Enterprise AI CCTV'
  },
  {
    name: 'FLIR Systems',
    logo: '/assets/logos/flir.svg',
    tag: 'Thermal Perimeter'
  },
  {
    name: 'IDEMIA',
    logo: '/assets/logos/idemia.svg',
    tag: 'Biometric Pass'
  },
  {
    name: 'Johnson Controls',
    logo: '/assets/logos/johnsoncontrols.svg',
    tag: 'Building Automation'
  }
];

export const BrandScroller = ({ duration = '36s' }) => {
  return (
    <div 
      className="brand-scroller-container group flex overflow-hidden"
      style={{
        width: '100%',
        maxWidth: '100%',
        paddingTop: '8px',
        paddingBottom: '8px',
        maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 12%, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0))',
        WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 12%, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0))',
        '--gap': '1.5rem',
        '--duration': duration
      }}
    >
      <div 
        className="brand-scroller-track flex flex-row"
        style={{
          display: 'flex',
          width: 'max-content',
          gap: 'var(--gap, 1.5rem)',
          paddingTop: '4px',
          paddingBottom: '4px'
        }}
      >
        {/* Repeating 3 sets for continuous infinite flow */}
        {[0, 1, 2].map((repeatIndex) => (
          <div
            key={repeatIndex}
            className="flex shrink-0 items-center animate-marquee flex-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--gap, 1.5rem)'
            }}
          >
            {brandsRow1.map((b, idx) => (
              <div 
                key={`${repeatIndex}-${idx}`}
                className="brand-card-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9999px',
                  boxShadow: '0 3px 12px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(15, 23, 42, 0.05)';
                }}
              >
                <img 
                  src={b.logo} 
                  alt={b.name}
                  style={{
                    height: '28px',
                    width: 'auto',
                    maxWidth: '120px',
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
                <span 
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#64748B',
                    letterSpacing: '0.04em',
                    borderLeft: '1px solid #E2E8F0',
                    paddingLeft: '10px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {b.tag}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const BrandScrollerReverse = ({ duration = '36s' }) => {
  return (
    <div 
      className="brand-scroller-container group flex overflow-hidden"
      style={{
        width: '100%',
        maxWidth: '100%',
        paddingTop: '8px',
        paddingBottom: '8px',
        maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 12%, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0))',
        WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 12%, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0))',
        '--gap': '1.5rem',
        '--duration': duration
      }}
    >
      <div 
        className="brand-scroller-track flex flex-row"
        style={{
          display: 'flex',
          width: 'max-content',
          gap: 'var(--gap, 1.5rem)',
          paddingTop: '4px',
          paddingBottom: '4px'
        }}
      >
        {[0, 1, 2].map((repeatIndex) => (
          <div
            key={repeatIndex}
            className="flex shrink-0 items-center animate-marquee-reverse flex-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--gap, 1.5rem)'
            }}
          >
            {brandsRow2.map((b, idx) => (
              <div 
                key={`${repeatIndex}-${idx}`}
                className="brand-card-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9999px',
                  boxShadow: '0 3px 12px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(15, 23, 42, 0.05)';
                }}
              >
                <img 
                  src={b.logo} 
                  alt={b.name}
                  style={{
                    height: '28px',
                    width: 'auto',
                    maxWidth: '120px',
                    objectFit: 'contain',
                    display: 'block'
                  }} 
                />
                <span 
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#64748B',
                    letterSpacing: '0.04em',
                    borderLeft: '1px solid #E2E8F0',
                    paddingLeft: '10px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {b.tag}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default { BrandScroller, BrandScrollerReverse };
