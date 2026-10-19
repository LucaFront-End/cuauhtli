import React from 'react';
import { Building2, Factory, Home, Store, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function SectorsSection({ onOpenQuote }) {
  const sectors = [
    {
      id: 'corporativos',
      title: 'Corporativos & Edificios',
      desc: 'Control de accesos para cientos de colaboradores, torniquetes de alta velocidad, CCTV en áreas comunes y elevadores con gestión de visitas mediante códigos QR temporales.',
      icon: Building2,
      tag: 'CONTROL PEATONAL & CCTV',
      features: ['Torniquetes bidireccionales', 'Reconocimiento facial sin contacto', 'Monitoreo de estacionamientos']
    },
    {
      id: 'industria',
      title: 'Naves & Parques Industriales',
      desc: 'Seguridad perimetral para grandes extensiones de terreno, cercas electrificadas de alta disuasión, cámaras térmicas y lectura automática de placas de tractocamiones.',
      icon: Factory,
      tag: 'SEGURIDAD PERIMETRAL ROBUSTA',
      features: ['Cercas de 10,000V certificadas', 'CCTV con reconocimiento LPR de placas', 'Sensores de barrera infrarroja']
    },
    {
      id: 'residencial',
      title: 'Residencial de Alta Gama',
      desc: 'Tranquilidad total para tu familia. Videoporteros con apertura remota desde celular, circuitos cerrados de alta resolución y alarmas perimetrales silenciosas.',
      icon: Home,
      tag: 'PROTECCIÓN INTEGRAL DEL HOGAR',
      features: ['Apertura remota de portones', 'Cámaras ColorVu visión nocturna', 'Botón de pánico y sirenas discretas']
    },
    {
      id: 'retail',
      title: 'Comercios & Franquicias',
      desc: 'Prevención de pérdidas en puntos de venta, supervisión remota multidispositivo para dueños de negocio y sensores de intrusión nocturna con enlace 24/7.',
      icon: Store,
      tag: 'PREVENCIÓN DE PÉRDIDAS',
      features: ['CCTV en cajas y anaqueles', 'Monitoreo desde app móvil multi-sucursal', 'Alarma contra robo con verificación']
    }
  ];

  return (
    <section 
      id="sectores"
      style={{
        padding: '100px 0',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge-tag" style={{ marginBottom: '14px' }}>
            <span>APLICACIONES POR SECTOR</span>
          </div>
          <h2 className="section-title">
            Una Plataforma. Soluciones para Cada Industria.
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Adaptamos la ingeniería y equipamiento a los retos específicos de tu operación, 
            garantizando el máximo retorno de inversión y cumplimiento normativo.
          </p>
        </div>

        {/* 4 CARDS GRID */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {sectors.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                className="card-modern"
                style={{
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <div>
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <span 
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      display: 'block',
                      marginBottom: '6px'
                    }}
                  >
                    {sec.tag}
                  </span>

                  <h3 style={{ fontSize: '1.28rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
                    {sec.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '22px' }}>
                    {sec.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                    {sec.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <ShieldCheck size={16} color="var(--primary)" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenQuote}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>Solicitar Asesoría</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
