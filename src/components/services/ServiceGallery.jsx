import React, { useState } from 'react';
import { Camera, ZoomIn, X, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import './ServiceGallery.css';

const GALLERY_DATA = {
  'cctv': {
    title: 'Evidencia en Sitio: Videovigilancia & Térmicas',
    subtitle: 'Fotografías de cuadrillas e ingeniería de circuito cerrado en naves industriales, centros logísticos y corporativos.',
    images: [
      {
        src: '/assets/images/cctv_ptz.jpg',
        title: 'Domo PTZ 4K con Seguimiento Autónomo',
        category: 'PARQUE INDUSTRIAL',
        location: 'Tlalnepantla, Edo. Méx.',
        specs: 'Zoom óptico 32x · Cobertura 360° · Detección térmica'
      },
      {
        src: '/assets/images/camera_hero_isolated.jpg',
        title: 'Cámara Bullet ColorVu con Disuasión Activa',
        category: 'CENTRO LOGÍSTICO & CEDIS',
        location: 'Cuautitlán Izcalli, Edo. Méx.',
        specs: 'Color 24/7 · Luz estroboscópica · Audio bidireccional 110dB'
      },
      {
        src: '/assets/features/parking.jpg',
        title: 'Analítica LPR en Accesos de Estacionamiento',
        category: 'COMPLEJO CORPORATIVO',
        location: 'Santa Fe, Ciudad de México',
        specs: 'Lectura de placas 99.8% · Cruce virtual · Sensor Sony Starvis'
      },
      {
        src: '/assets/features/warehouse.jpg',
        title: 'Monitoreo de Andenes y Racks de 12 Metros',
        category: 'NAVE DE ALMACENAMIENTO',
        location: 'Toluca, Edo. Méx.',
        specs: 'Lente panorámico 180° · Cero puntos ciegos · IP67 / IK10'
      }
    ]
  },
  'control-acceso': {
    title: 'Evidencia en Sitio: Control Biométrico & Torniquetes',
    subtitle: 'Instalaciones de biometría facial MinMoe, torniquetes flap barrier y barreras vehiculares de alto tráfico.',
    images: [
      {
        src: '/assets/images/access_control.jpg',
        title: 'Terminal Facial MinMoe con Inteligencia Artificial',
        category: 'TORRE CORPORATIVA',
        location: 'Polanco, Ciudad de México',
        specs: 'Verificación <0.2s · Anti-spoofing · Lente dual infrarrojo'
      },
      {
        src: '/assets/features/lobby.jpg',
        title: 'Torniquetes Flap Barrier de Alta Velocidad',
        category: 'LOBBY EMPRESARIAL',
        location: 'Paseo de la Reforma, CDMX',
        specs: 'Paso de 45 personas/min · Acero inoxidable AISI 304'
      },
      {
        src: '/assets/features/entrance.jpg',
        title: 'Barreras Vehiculares Automáticas con Tag UHF',
        category: 'FRACCIONAMIENTO RESIDENCIAL',
        location: 'Bosques de las Lomas, CDMX',
        specs: 'Apertura en 1.5s · Antena largo alcance · Loop magnético'
      },
      {
        src: '/assets/features/face.jpg',
        title: 'Validación Biométrica Zero-Touch sin Fricción',
        category: 'PLANTA INDUSTRIAL',
        location: 'Naucalpan, Edo. Méx.',
        specs: 'Cero contacto físico · Lectura con cubrebocas · Hash SHA-256'
      }
    ]
  },
  'alarmas': {
    title: 'Evidencia en Sitio: Alarmas & Central C4',
    subtitle: 'Paneles de grado industrial, sensores infrarrojos de doble haz y enlace en tiempo real con monitoreo 24/7.',
    images: [
      {
        src: '/assets/images/alarm_center.jpg',
        title: 'Consola de Monitoreo C4 con Telemetría en Vivo',
        category: 'CENTRO DE OPERACIONES CUAUTHLI',
        location: 'Ciudad de México',
        specs: 'Monitoreo 24/7/365 · SLA de respuesta inmediata · Enlace IP + Celular'
      },
      {
        src: '/assets/images/cctv_ptz.jpg',
        title: 'Sensores Fotoeléctricos de Haz Infrarrojo',
        category: 'PERÍMETRO INDUSTRIAL',
        location: 'Tepotzotlán, Edo. Méx.',
        specs: 'Rango de 150m · Doble haz anti-niebla · Discriminación de fauna'
      },
      {
        src: '/assets/features/warehouse.jpg',
        title: 'Fotodetectores Inalámbricos con Verificación Gráfica',
        category: 'ALMACÉN FARMACÉUTICO',
        location: 'Azcapotzalco, CDMX',
        specs: 'Envío de foto en 3s · Protocolo cifrado Jeweller · Batería 5 años'
      },
      {
        src: '/assets/images/camera_hero_isolated.jpg',
        title: 'Sirenas Industriales y Estrobos de Alerta C4',
        category: 'PLANTA DE MANUFACTURA',
        location: 'San Martín Obispo, Edo. Méx.',
        specs: 'Potencia 118dB · Luz estroboscópica xenon · Batería de respaldo'
      }
    ]
  },
  'cercas-electrificadas': {
    title: 'Evidencia en Sitio: Cercas Eléctricas de Alto Voltaje',
    subtitle: 'Postes galvanizados reforzados, energizadores inteligentes y sensores de flexión de cable con cero falsas alarmas.',
    images: [
      {
        src: '/assets/images/perimeter_fence.jpg',
        title: 'Cerca Electrificada de 6 Líneas con Postes Tubulares',
        category: 'NAVE INDUSTRIAL',
        location: 'Parque Industrial Cuautitlán, Edo. Méx.',
        specs: 'Voltaje disuasivo 14,000V · Aisladores de alta resistencia UV · Tierra física calibrada'
      },
      {
        src: '/assets/features/parking.jpg',
        title: 'Sectorización Perimetral Inteligente',
        category: 'CONDOMINIO PRIVADO',
        location: 'Interlomas, Huixquilucan',
        specs: 'Monitoreo por zonas independientes · Alerta por corte o puenteo de línea'
      },
      {
        src: '/assets/images/camera_hero_isolated.jpg',
        title: 'Integración de Cerca con Cámaras PTZ Disuasivas',
        category: 'COMPLEJO LOGÍSTICO',
        location: 'Tlalnepantla, Edo. Méx.',
        specs: 'Giro automático de cámara hacia la zona de alarma · Luz disuasiva inmediata'
      },
      {
        src: '/assets/features/warehouse.jpg',
        title: 'Aisladores y Alambre de Aluminio Triple Torsión',
        category: 'PLANTA QUÍMICA',
        location: 'Tultitlán, Edo. Méx.',
        specs: 'Resistencia a corrosión severa · Respaldo por batería UPS 48 horas'
      }
    ]
  },
  'videoporteros': {
    title: 'Evidencia en Sitio: Videoporteros IP Multi-Apartamento',
    subtitle: 'Frentes de calle de acero antivandálico, monitores touch para conserjería y apertura móvil remota.',
    images: [
      {
        src: '/assets/images/videodoorbell.jpg',
        title: 'Frente de Calle Multi-Apartamento IP Antivandálico',
        category: 'TORRE RESIDENCIAL',
        location: 'Colonia Roma Norte, CDMX',
        specs: 'Cámara 2MP WDR · Pantalla LCD · Teclado retroiluminado · Lector RFID'
      },
      {
        src: '/assets/features/lobby.jpg',
        title: 'Estación Maestra Touchscreen para Conserjería',
        category: 'RECEPCIÓN & VIGILANCIA',
        location: 'San Jerónimo Lídice, CDMX',
        specs: 'Pantalla IPS 10" · Intercomunicación entre departamentos · Desbloqueo directo'
      },
      {
        src: '/assets/features/entrance.jpg',
        title: 'Acceso Vehicular y Peatonal Sincronizado',
        category: 'CONJUNTO HABITACIONAL',
        location: 'Coyoacán, Ciudad de México',
        specs: 'Llamada simultánea al monitor y app móvil · Registro fotográfico de visitas'
      },
      {
        src: '/assets/images/access_control.jpg',
        title: 'Lector de Código QR Temporal para Visitas',
        category: 'EDIFICIO CORPORATIVO',
        location: 'Insurgentes Sur, CDMX',
        specs: 'Generación de QR desde WhatsApp · Validación de tiempo de validez programable'
      }
    ]
  }
};

export default function ServiceGallery({ serviceId = 'cctv' }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const data = GALLERY_DATA[serviceId] || GALLERY_DATA['cctv'];

  return (
    <section className="svc-gallery-section" aria-label="Galería de proyectos en sitio">
      <div className="container">
        
        {/* Section Header */}
        <div className="svc-sec-head">
          <div className="svc-gallery-badge">
            <Camera size={14} />
            <span>Evidencia de Instalación en Sitio</span>
          </div>
          <h2 className="section-title">
            Ingeniería aplicada en <span className="svc-cursive-accent">proyectos reales</span>
          </h2>
          <p className="section-desc">
            {data.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="svc-gallery-grid">
          {data.images.map((item, idx) => (
            <div 
              key={idx} 
              className="svc-gallery-card"
              onClick={() => setSelectedImage(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(item)}
            >
              <div className="svc-gallery-img-wrap">
                <img 
                  src={item.src} 
                  alt={item.title} 
                  loading="lazy" 
                  className="svc-gallery-img"
                />
                <div className="svc-gallery-overlay">
                  <span className="svc-gallery-zoom-btn">
                    <ZoomIn size={16} />
                    <span>Ver Detalles</span>
                  </span>
                </div>
                <span className="svc-gallery-tag">{item.category}</span>
              </div>

              <div className="svc-gallery-meta">
                <h4 className="svc-gallery-card-title">{item.title}</h4>
                <div className="svc-gallery-location">
                  <MapPin size={13} color="var(--primary)" />
                  <span>{item.location}</span>
                </div>
                <div className="svc-gallery-specs">
                  <CheckCircle2 size={13} color="#10B981" />
                  <span>{item.specs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="svc-lightbox-backdrop" 
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="svc-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="svc-lightbox-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            <div className="svc-lightbox-img-box">
              <img src={selectedImage.src} alt={selectedImage.title} />
            </div>

            <div className="svc-lightbox-info">
              <span className="svc-lightbox-cat">{selectedImage.category}</span>
              <h3 className="svc-lightbox-title">{selectedImage.title}</h3>
              <p className="svc-lightbox-loc">
                <MapPin size={14} color="var(--primary)" />
                <span>{selectedImage.location}</span>
              </p>
              <p className="svc-lightbox-specs">
                <CheckCircle2 size={14} color="#10B981" />
                <span>{selectedImage.specs}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
