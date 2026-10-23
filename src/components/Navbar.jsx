import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Phone, 
  MessageSquare, 
  Menu, 
  X, 
  ChevronRight, 
  Camera, 
  KeyRound, 
  ShieldAlert, 
  Radio, 
  Network, 
  Building2, 
  MapPin, 
  Clock, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Landmark,
  GraduationCap,
  Warehouse,
  Stethoscope,
  Home,
  HardHat,
  ShoppingBag
} from 'lucide-react';
import {
  MotionNavigationMenu,
  MotionNavigationMenuList,
  MotionNavigationMenuItem,
  MotionNavigationMenuTrigger,
  MotionNavigationMenuContent,
  MotionNavigationMenuLink,
} from './ui/motion-navigation-menu';
import './Navbar.css';

export default function Navbar({ onOpenQuote, onNavigateHome, onNavigateService, onNavigateIndustry }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleServiceClick = (e, slug) => {
    e.preventDefault();
    window.location.hash = `servicio-${slug}`;
    onNavigateService?.(slug);
  };

  const handleIndustryClick = (e, slug) => {
    e.preventDefault();
    window.location.hash = `industria-${slug}`;
    onNavigateIndustry?.(slug);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.hash = '';
    onNavigateHome?.();
  };

  const handleSectionNavigate = (e, targetHash) => {
    if (e) e.preventDefault();
    window.location.hash = targetHash;
    if (targetHash === '#nosotros' || targetHash === '#comunidad') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const el = document.querySelector(targetHash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <header className={`cuauhtli-navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container cuauhtli-nav-inner">
        
        {/* OFFICIAL LOGO */}
        <a href="#" onClick={handleHomeClick} className="cuauhtli-brand" title="Sistemas Cuauhtli - Inicio">
          <img 
            src="/assets/cuauhtli_logo.jpg" 
            alt="Sistemas Cuauhtli" 
            className="cuauhtli-brand-logo-img"
          />
        </a>

        {/* DESKTOP MOTION NAVIGATION MENU (21ST.DEV STYLE) */}
        <div className="cuauhtli-desktop-menu">
          <MotionNavigationMenu
            viewport={true}
            viewportClassName="cuauhtli-menu-viewport"
            springBounce={0}
            springStiffness={380}
            springDamping={32}
          >
            <MotionNavigationMenuList>
              
              {/* ITEM 1: SOLUCIONES (MEGA-MENU) */}
              <MotionNavigationMenuItem value="soluciones">
                <MotionNavigationMenuTrigger className="cuauhtli-nav-trigger">
                  Soluciones
                </MotionNavigationMenuTrigger>
                <MotionNavigationMenuContent>
                  <div className="mega-solutions-grid">
                    
                    {/* Left Featured Card */}
                    <a
                      href="#servicio-cctv"
                      onClick={(e) => handleServiceClick(e, 'cctv')}
                      className="mega-featured-card"
                    >
                      <div>
                        <span className="mega-featured-badge">
                          <Sparkles size={11} />
                          <span>Garantía Vitalicia</span>
                        </span>
                        <h4 className="mega-featured-title">
                          Páginas de Servicio
                        </h4>
                        <p className="mega-featured-desc">
                          Ingeniería certificada, hardware de misión crítica y póliza C4 24/7 sin puntos ciegos.
                        </p>
                      </div>
                      <div className="mega-featured-cta">
                        <span>Ver soluciones 3D</span>
                        <ArrowRight size={13} />
                      </div>
                    </a>

                    {/* Right Grid of Systems */}
                    <div className="mega-solutions-list">
                      <a 
                        href="#servicio-cctv" 
                        onClick={(e) => handleServiceClick(e, 'cctv')}
                        className="mega-solution-item"
                      >
                        <div className="mega-sol-icon">
                          <Camera size={15} />
                        </div>
                        <div className="mega-sol-text">
                          <strong className="mega-sol-title">CCTV con IA & Térmicas</strong>
                          <span className="mega-sol-desc">Detección perimetral 4K humano/vehículo</span>
                        </div>
                      </a>

                      <a 
                        href="#servicio-control-acceso" 
                        onClick={(e) => handleServiceClick(e, 'control-acceso')}
                        className="mega-solution-item"
                      >
                        <div className="mega-sol-icon">
                          <KeyRound size={15} />
                        </div>
                        <div className="mega-sol-text">
                          <strong className="mega-sol-title">Control de Acceso Facial</strong>
                          <span className="mega-sol-desc">Torniquetes, esclusas y lectura biométrica</span>
                        </div>
                      </a>

                      <a 
                        href="#servicio-alarmas" 
                        onClick={(e) => handleServiceClick(e, 'alarmas')}
                        className="mega-solution-item"
                      >
                        <div className="mega-sol-icon">
                          <Radio size={15} />
                        </div>
                        <div className="mega-sol-text">
                          <strong className="mega-sol-title">Central C4 & Alarmas 24/7</strong>
                          <span className="mega-sol-desc">Despacho de patrulla y enlace de zona</span>
                        </div>
                      </a>

                      <a 
                        href="#servicio-cercas-electrificadas" 
                        onClick={(e) => handleServiceClick(e, 'cercas-electrificadas')}
                        className="mega-solution-item"
                      >
                        <div className="mega-sol-icon">
                          <ShieldAlert size={15} />
                        </div>
                        <div className="mega-sol-text">
                          <strong className="mega-sol-title">Cercas de Alto Voltaje</strong>
                          <span className="mega-sol-desc">14,000V pulsados con sensor de corte</span>
                        </div>
                      </a>

                      <a 
                        href="#servicio-videoporteros" 
                        onClick={(e) => handleServiceClick(e, 'videoporteros')}
                        className="mega-solution-item"
                      >
                        <div className="mega-sol-icon">
                          <Building2 size={15} />
                        </div>
                        <div className="mega-sol-text">
                          <strong className="mega-sol-title">Videoporteros IP & Apps</strong>
                          <span className="mega-sol-desc">Intercomunicación 2K y apertura remota</span>
                        </div>
                      </a>
                    </div>

                  </div>
                </MotionNavigationMenuContent>
              </MotionNavigationMenuItem>

              {/* ITEM 2: COBERTURA NACIONAL (MEGA-MENU) */}
              <MotionNavigationMenuItem value="cobertura">
                <MotionNavigationMenuTrigger className="cuauhtli-nav-trigger">
                  Cobertura
                </MotionNavigationMenuTrigger>
                <MotionNavigationMenuContent>
                  <div className="mega-coverage-box">
                    <div className="mega-box-header">
                      <strong>7 Hubs Estratégicos con Cuadrilla Activa</strong>
                      <span>Tiempos de arribo garantizados por contrato SLA</span>
                    </div>

                    <div className="mega-hubs-grid">
                      <a href="#cobertura" className="mega-hub-item">
                        <div className="mega-hub-top">
                          <span className="mega-hub-name">Valle de México</span>
                          <span className="mega-hub-time">&lt; 1 hr</span>
                        </div>
                        <span className="mega-hub-corridor">CDMX · Toluca · Cuautitlán · Naucalpan</span>
                      </a>

                      <a href="#cobertura" className="mega-hub-item">
                        <div className="mega-hub-top">
                          <span className="mega-hub-name">Querétaro & Bajío</span>
                          <span className="mega-hub-time">&lt; 2 hrs</span>
                        </div>
                        <span className="mega-hub-corridor">Parques automotrices y aeronáuticos</span>
                      </a>

                      <a href="#cobertura" className="mega-hub-item">
                        <div className="mega-hub-top">
                          <span className="mega-hub-name">Monterrey & Norte</span>
                          <span className="mega-hub-time">&lt; 2 hrs</span>
                        </div>
                        <span className="mega-hub-corridor">Apodaca · Ciénaga · Santa Catarina</span>
                      </a>

                      <a href="#cobertura" className="mega-hub-item">
                        <div className="mega-hub-top">
                          <span className="mega-hub-name">Guadalajara</span>
                          <span className="mega-hub-time">&lt; 2 hrs</span>
                        </div>
                        <span className="mega-hub-corridor">El Salto · Zapopan · CEDIS Occidente</span>
                      </a>
                    </div>

                    <a href="#cobertura" className="mega-dropdown-footer">
                      <span>Explorar mapa interactivo de presencia nacional</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </MotionNavigationMenuContent>
              </MotionNavigationMenuItem>

              {/* ITEM 3: INDUSTRIAS (MEGA-MENU) */}
              <MotionNavigationMenuItem value="industrias">
                <MotionNavigationMenuTrigger className="cuauhtli-nav-trigger">
                  Industrias
                </MotionNavigationMenuTrigger>
                <MotionNavigationMenuContent>
                  <div className="mega-industries-box">
                    <div className="mega-box-header">
                      <strong>Tenemos la solución perfecta para tu giro</strong>
                      <span>Arquitecturas especializadas por sector y cumplimiento normativo</span>
                    </div>

                    <div className="mega-industries-grid">
                      <a href="#industria-bancos" onClick={(e) => handleIndustryClick(e, 'bancos')} className="mega-ind-item">
                        <Landmark size={15} className="mega-ind-icon" />
                        <div className="mega-ind-text">
                          <strong>Bancos & Finanzas</strong>
                          <span>Normativa CNBV, bóvedas y ATMs</span>
                        </div>
                      </a>

                      <a href="#industria-escuelas" onClick={(e) => handleIndustryClick(e, 'escuelas')} className="mega-ind-item">
                        <GraduationCap size={15} className="mega-ind-icon" />
                        <div className="mega-ind-text">
                          <strong>Escuelas & Universidades</strong>
                          <span>Entrega segura y alerta sísmica</span>
                        </div>
                      </a>

                      <a href="#industria-almacenes" onClick={(e) => handleIndustryClick(e, 'almacenes')} className="mega-ind-item">
                        <Warehouse size={15} className="mega-ind-icon" />
                        <div className="mega-ind-text">
                          <strong>Almacenes & Logística</strong>
                          <span>CTPAT, LPR vehicular y cercas</span>
                        </div>
                      </a>

                      <a href="#industria-oficinas" onClick={(e) => handleIndustryClick(e, 'oficinas')} className="mega-ind-item">
                        <Building2 size={15} className="mega-ind-icon" />
                        <div className="mega-ind-text">
                          <strong>Oficinas & Corporativos</strong>
                          <span>Torniquetes faciales y STPS</span>
                        </div>
                      </a>

                      <a href="#industria-hospitales" onClick={(e) => handleIndustryClick(e, 'hospitales')} className="mega-ind-item">
                        <Stethoscope size={15} className="mega-ind-icon" />
                        <div className="mega-ind-text">
                          <strong>Hospitales & Clínicas</strong>
                          <span>COFEPRIS, bioseguridad y voceo</span>
                        </div>
                      </a>

                      <a href="#industria-residencias" onClick={(e) => handleIndustryClick(e, 'residencias')} className="mega-ind-item">
                        <Home size={15} className="mega-ind-icon" />
                        <div className="mega-ind-text">
                          <strong>Residencias & Privadas</strong>
                          <span>Videoportero app y Tag RFID</span>
                        </div>
                      </a>

                      <a href="#industria-constructoras" onClick={(e) => handleIndustryClick(e, 'constructoras')} className="mega-ind-item">
                        <HardHat size={15} className="mega-ind-icon" />
                        <div className="mega-ind-text">
                          <strong>Constructoras & Obras</strong>
                          <span>Torres solares 4G y STPS</span>
                        </div>
                      </a>

                      <a href="#industria-plazas-comerciales" onClick={(e) => handleIndustryClick(e, 'plazas-comerciales')} className="mega-ind-item">
                        <ShoppingBag size={15} className="mega-ind-icon" />
                        <div className="mega-ind-text">
                          <strong>Plazas Comerciales & Retail</strong>
                          <span>Aforo, cobro parking y LED</span>
                        </div>
                      </a>
                    </div>

                    <a href="#industrias" onClick={(e) => handleSectionNavigate(e, '#industrias')} className="mega-dropdown-footer">
                      <span>Comparar todos los giros en el configurador interactivo</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </MotionNavigationMenuContent>
              </MotionNavigationMenuItem>

              {/* ITEM 4: DIRECT LINK NOSOTROS */}
              <MotionNavigationMenuItem>
                <MotionNavigationMenuLink 
                  href="#nosotros" 
                  className="cuauhtli-direct-link"
                  onClick={(e) => handleSectionNavigate(e, '#nosotros')}
                >
                  Nosotros
                </MotionNavigationMenuLink>
              </MotionNavigationMenuItem>

            </MotionNavigationMenuList>
          </MotionNavigationMenu>
        </div>

        {/* RIGHT SIDE: QUICK PHONE & PRIMARY CTA */}
        <div className="cuauhtli-nav-right">
          
          {/* QUICK PHONE */}
          <a href="tel:5585262115" className="cuauhtli-phone-btn">
            <Phone size={13} color="var(--primary, #2563EB)" strokeWidth={2.2} />
            <span>(55) 8526-2115</span>
          </a>

          {/* MAIN CTA BUTTON */}
          <button 
            type="button"
            onClick={onOpenQuote}
            className="cuauhtli-quote-btn"
          >
            <span>Cotizar Proyecto</span>
            <ChevronRight size={14} />
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cuauhtli-mobile-btn"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="cuauhtli-mobile-drawer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Servicios Especializados
            </span>
            <a
              href="#servicio-cctv"
              onClick={(e) => { setMobileMenuOpen(false); handleServiceClick(e, 'cctv'); }}
              className="cuauhtli-mob-link"
            >
              <span>CCTV con IA & Térmicas</span>
              <ChevronRight size={15} />
            </a>
            <a
              href="#servicio-control-acceso"
              onClick={(e) => { setMobileMenuOpen(false); handleServiceClick(e, 'control-acceso'); }}
              className="cuauhtli-mob-link"
            >
              <span>Control de Acceso Facial</span>
              <ChevronRight size={15} />
            </a>
            <a
              href="#servicio-alarmas"
              onClick={(e) => { setMobileMenuOpen(false); handleServiceClick(e, 'alarmas'); }}
              className="cuauhtli-mob-link"
            >
              <span>Central C4 & Alarmas 24/7</span>
              <ChevronRight size={15} />
            </a>
            <a
              href="#servicio-cercas-electrificadas"
              onClick={(e) => { setMobileMenuOpen(false); handleServiceClick(e, 'cercas-electrificadas'); }}
              className="cuauhtli-mob-link"
            >
              <span>Cercas de Alto Voltaje</span>
              <ChevronRight size={15} />
            </a>
            <a
              href="#servicio-videoporteros"
              onClick={(e) => { setMobileMenuOpen(false); handleServiceClick(e, 'videoporteros'); }}
              className="cuauhtli-mob-link"
            >
              <span>Videoporteros IP & Apps</span>
              <ChevronRight size={15} />
            </a>
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <a
              href="#cobertura"
              onClick={(e) => { setMobileMenuOpen(false); handleSectionNavigate(e, '#cobertura'); }}
              className="cuauhtli-mob-link"
            >
              <span>Cobertura Nacional (7 Hubs)</span>
              <ChevronRight size={15} />
            </a>
            <a
              href="#industrias"
              onClick={(e) => { setMobileMenuOpen(false); handleSectionNavigate(e, '#industrias'); }}
              className="cuauhtli-mob-link"
            >
              <span>Sectores & Industrias (8 Giros)</span>
              <ChevronRight size={15} />
            </a>
            <a
              href="#nosotros"
              onClick={(e) => { setMobileMenuOpen(false); handleSectionNavigate(e, '#nosotros'); }}
              className="cuauhtli-mob-link"
            >
              <span>Sobre Nosotros & Garantías</span>
              <ChevronRight size={15} />
            </a>
          </div>

          <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href="https://wa.link/bzxy8p"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ justifyContent: 'center' }}
            >
              <MessageSquare size={17} color="#25D366" />
              <span>WhatsApp Directo</span>
            </a>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenQuote(); }}
              className="cuauhtli-quote-btn"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Cotizar Ahora</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
