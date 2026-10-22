import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AlliesMarquee from './components/AlliesMarquee';
import FeaturesWithPanel from './components/ui/features-with-panel';
import CoverageGrid from './components/CoverageGrid';
import Testimonials from './components/Testimonials';
import CoverageMapSection from './components/CoverageMapSection';
import TimelineSection from './components/TimelineSection';
import MultiStepQuoteForm from './components/MultiStepQuoteForm';
import Footer from './components/Footer';
import FloatingWhatsapp from './components/FloatingWhatsapp';
import QuickQuoteModal from './components/QuickQuoteModal';
import ServicePage from './components/services/ServicePage';
import NosotrosPage from './components/pages/NosotrosPage';
import ComunidadPage from './components/pages/ComunidadPage';
import ReformaLaboralPage from './components/pages/ReformaLaboralPage';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [preSelectedSolution, setPreSelectedSolution] = useState('');
  const [currentRoute, setCurrentRoute] = useState('home'); // 'home' | 'cctv' | 'control-acceso' | 'alarmas' | 'cercas-electrificadas' | 'videoporteros'

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash || '';
      // Normalizar hash: remover '#' inicial y barras '/' iniciales/finales, case-insensitive
      const clean = rawHash.replace(/^#\/?/, '').replace(/\/+$/, '').toLowerCase();

      if (clean.startsWith('servicio-')) {
        const slug = clean.replace('servicio-', '');
        setCurrentRoute(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (clean === 'nosotros') {
        setCurrentRoute('nosotros');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (clean === 'comunidad') {
        setCurrentRoute('comunidad');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        clean === 'reforma-laboral-40-horas' ||
        clean === 'reforma-40-horas' ||
        clean === 'control-asistencia-reforma' ||
        clean === 'reloj-checador-stps' ||
        clean === 'cumplimiento-stps' ||
        clean === 'reforma' ||
        clean === 'reforma-laboral' ||
        clean === '40-horas'
      ) {
        setCurrentRoute('reforma-laboral-40-horas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (clean === '' || clean === '#') {
        setCurrentRoute('home');
      } else {
        // Section anchors on home like #cobertura, #trayectoria, #testimonios
        setCurrentRoute('home');
        setTimeout(() => {
          const el = document.getElementById(clean) || document.querySelector(rawHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenQuote = (solutionName) => {
    if (typeof solutionName === 'string') {
      setPreSelectedSolution(solutionName);
    } else {
      setPreSelectedSolution('');
    }
    setQuoteModalOpen(true);
  };

  const handleNavigateHome = () => {
    window.location.hash = '';
    setCurrentRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateService = (slug) => {
    window.location.hash = `servicio-${slug}`;
    setCurrentRoute(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* STICKY HEADER */}
      <Navbar 
        onOpenQuote={() => handleOpenQuote()} 
        onNavigateHome={handleNavigateHome}
        onNavigateService={handleNavigateService}
      />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1 }}>
        {currentRoute === 'nosotros' ? (
          <NosotrosPage 
            onOpenQuote={handleOpenQuote}
            onNavigateHome={handleNavigateHome}
            onNavigateService={handleNavigateService}
          />
        ) : currentRoute === 'comunidad' ? (
          <ComunidadPage 
            onOpenQuote={handleOpenQuote}
            onNavigateHome={handleNavigateHome}
            onNavigateService={handleNavigateService}
          />
        ) : currentRoute === 'reforma-laboral-40-horas' ? (
          <ReformaLaboralPage 
            onOpenQuote={handleOpenQuote}
            onNavigateHome={handleNavigateHome}
            onNavigateService={handleNavigateService}
          />
        ) : currentRoute !== 'home' ? (
          <ServicePage 
            serviceId={currentRoute}
            onOpenQuote={handleOpenQuote}
            onNavigateHome={handleNavigateHome}
            onSelectService={handleNavigateService}
          />
        ) : (
          <>
            {/* HERO SECTION WITH 3D INTERACTIVE SENSOR & METRICS */}
            <Hero onOpenQuote={() => handleOpenQuote()} />

            {/* TECHNOLOGY ALLIES INFINITE MARQUEE */}
            <AlliesMarquee />

            {/* 21ST.DEV SCROLL-BASED STICKY FEATURES WITH INTERACTIVE CUAUTHLI ANIMATIONS */}
            <FeaturesWithPanel onOpenQuote={handleOpenQuote} />

            {/* LIVE COVERAGE — 3x3 DYNAMIC VIDEO FRAMES (replaces SolutionsBento) */}
            <CoverageGrid
              onSelectSolutionForQuote={handleOpenQuote}
              onOpenQuote={() => handleOpenQuote()}
            />

            {/* VERIFIED CLIENT TESTIMONIALS (HIGHLIGHT TESTIMONIAL SECTION) */}
            <Testimonials />

            {/* INTERACTIVE MEXICO COVERAGE & PRESENCE MAP */}
            <CoverageMapSection onOpenQuote={handleOpenQuote} />

            {/* TRAYECTORIA & TIMELINE DE EVOLUCIÓN TECNOLÓGICA */}
            <TimelineSection onOpenQuote={handleOpenQuote} />

            {/* DIAGNÓSTICO & COTIZADOR MULTIPASOS DE 3 PASOS CON LOTTIES */}
            <MultiStepQuoteForm />
          </>
        )}
      </main>

      {/* FOOTER */}
      <Footer 
        onOpenQuote={() => handleOpenQuote()} 
        onNavigateHome={handleNavigateHome}
        onNavigateService={handleNavigateService}
      />

      {/* FLOATING ACTION BUTTON */}
      <FloatingWhatsapp />

      {/* POPUP MODAL */}
      <QuickQuoteModal 
        isOpen={quoteModalOpen} 
        onClose={() => setQuoteModalOpen(false)} 
        defaultSolution={preSelectedSolution}
      />

    </div>
  );
}
