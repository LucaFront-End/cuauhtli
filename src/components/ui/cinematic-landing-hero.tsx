// src/components/ui/cinematic-landing-hero.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Scale, ArrowUpRight, ScanFace, FileCheck2, CheckCircle2, Lock, Cpu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Root Container */
  .cinematic-hero-root {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #FFFFFF;
      color: #0F172A;
      font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      -webkit-font-smoothing: antialiased;
  }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.03; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
  }

  /* -------------------------------------------------------------------
     TYPOGRAPHY (Minimalist, Apple / Linear aesthetic - Zero Clipping)
  ---------------------------------------------------------------------- */
  .text-3d-matte {
      color: #0F172A;
      text-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      display: inline-block;
      overflow: visible;
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #A6192E 0%, #1D1E1B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
      padding-top: 0.05em;
      padding-bottom: 0.25em;
      margin-bottom: -0.2em;
      padding-left: 0.04em;
      padding-right: 0.04em;
      line-height: 1.25;
      overflow: visible;
      transform: translateZ(0);
  }

  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
      padding-top: 0.05em;
      padding-bottom: 0.22em;
      margin-bottom: -0.18em;
      line-height: 1.15;
      overflow: visible;
      transform: translateZ(0);
  }

  /* Deep Physical Card with Dynamic Mouse Lighting */
  .premium-depth-card {
      background: linear-gradient(150deg, #0A1128 0%, #060913 60%, #110B17 100%);
      box-shadow: 
          0 40px 100px -20px rgba(10, 17, 40, 0.85),
          0 20px 40px -15px rgba(0, 0, 0, 0.7),
          inset 0 1px 2px rgba(255, 255, 255, 0.16),
          inset 0 -2px 4px rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(750px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.07) 0%, transparent 45%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* -------------------------------------------------------------------
     HIKVISION MINMOE INDUSTRIAL BIOMETRIC TERMINAL (WALL MOUNTED)
     Realistic 3:4 proportions, brushed metal chamfer, dual IR cameras
  ---------------------------------------------------------------------- */
  .terminal-bezel {
      background: linear-gradient(165deg, #1E293B 0%, #0F172A 45%, #070B14 100%);
      box-shadow: 
          0 35px 80px -15px rgba(0, 0, 0, 0.95),
          0 15px 30px -8px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 255, 255, 0.22),
          inset 0 -2px 6px rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      transform-style: preserve-3d;
      position: relative;
  }

  /* Wall Mount Shadow Accent */
  .terminal-wall-shadow {
      position: absolute;
      inset: -12px -16px;
      border-radius: 28px;
      background: radial-gradient(ellipse at center, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
      z-index: -1;
      pointer-events: none;
      filter: blur(14px);
  }

  /* Terminal Top Sensor & Dual Optical Camera Bar */
  .terminal-sensor-bar {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: #090E1A;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      position: relative;
  }

  .terminal-led-strip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
  }

  .terminal-led-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981, 0 0 14px rgba(16, 185, 129, 0.8);
      animation: ledPulse 2s infinite ease-in-out;
  }

  @keyframes ledPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
  }

  .terminal-screen {
      position: relative;
      background: #030610;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .screen-glare {
      background: linear-gradient(115deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 45%);
  }

  /* Facial Scanning Box & Moving Laser Line */
  .face-scanner-frame {
      position: relative;
      width: 130px;
      height: 130px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .scan-corner {
      position: absolute;
      width: 14px;
      height: 14px;
      border-color: #38BDF8;
      border-style: solid;
  }
  .scan-corner.tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
  .scan-corner.tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
  .scan-corner.bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
  .scan-corner.br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

  .scan-laser-line {
      position: absolute;
      left: 6px;
      right: 6px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #38BDF8 50%, transparent);
      box-shadow: 0 0 10px #38BDF8;
      animation: scanLaser 2.2s infinite ease-in-out;
  }

  @keyframes scanLaser {
      0% { top: 12%; opacity: 0; }
      15% { opacity: 1; }
      85% { opacity: 1; }
      100% { top: 88%; opacity: 0; }
  }

  /* Biometric Mesh Landmark Dots */
  .biometric-point {
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #38BDF8;
      box-shadow: 0 0 4px #38BDF8;
      opacity: 0.7;
  }

  /* Floating UI Glass Badge */
  .floating-ui-badge {
      background: rgba(10, 17, 40, 0.85);
      backdrop-filter: blur(20px); 
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 
          0 0 0 1px rgba(255, 255, 255, 0.14),
          0 20px 40px -10px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2);
      border: 1px solid rgba(255, 255, 255, 0.08);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      user-select: none;
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
      color: #0F172A;
      box-shadow: 
          0 0 0 1px rgba(15,23,42,0.08), 
          0 2px 4px rgba(0,0,0,0.04), 
          0 12px 24px -4px rgba(15,23,42,0.12), 
          inset 0 1px 1px rgba(255,255,255,1);
  }
  .btn-modern-light:hover {
      transform: translateY(-2px);
      box-shadow: 
          0 0 0 1px rgba(15,23,42,0.1), 
          0 6px 16px -2px rgba(15,23,42,0.15), 
          inset 0 1px 1px rgba(255,255,255,1);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: #F1F5F9;
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #A6192E 0%, #8C1527 100%);
      color: #FFFFFF;
      box-shadow: 
          0 0 0 1px rgba(255,255,255,0.15), 
          0 2px 4px rgba(0,0,0,0.2), 
          0 12px 24px -4px rgba(166,25,46,0.4), 
          inset 0 1px 1px rgba(255,255,255,0.25);
  }
  .btn-modern-dark:hover {
      transform: translateY(-2px);
      background: linear-gradient(180deg, #BA1C34 0%, #A6192E 100%);
      box-shadow: 
          0 0 0 1px rgba(255,255,255,0.2), 
          0 6px 16px -2px rgba(166,25,46,0.45);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #8C1527;
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  onOpenQuote?: () => void;
  onSimulate?: () => void;
}

export function CinematicHero({ 
  brandName = "CUAUTHLI",
  tagline1 = "De 48 a 40 Horas,",
  tagline2 = "Cero Multas con Cuauhtli.",
  cardHeading = "Control Biométrico Inalterable.",
  cardDescription = (
    <>
      <strong style={{ color: "#FFFFFF" }}>Sistemas Cuauhtli</strong> implementa terminales faciales Hikvision MinMoe AI con hash SHA-256 y sellos NTP oficiales. Validez probatoria total ante inspecciones federales de la STPS.
    </>
  ),
  metricValue = 40,
  metricLabel = "Horas / Semana",
  ctaHeading = "Blinda tu empresa ante la STPS.",
  ctaDescription = "A partir del 1 de enero de 2027 el registro electrónico inalterable es obligatorio. Evita sanciones de 250 a 5,000 UMA por trabajador.",
  onOpenQuote,
  onSimulate,
  className, 
  ...props 
}: CinematicHeroProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // 1. Subtle, Smooth 3D Mouse Tilt Logic on Terminal
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2.2) return;

      cancelAnimationFrame(requestRef.current);
      
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 8,
            rotationX: -yVal * 8,
            ease: "power2.out",
            duration: 0.8,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Refined, Minimalist Cinematic Scroll Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 40, filter: "blur(12px)" });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(-20% 100% -40% 0%)" });
      gsap.set(".main-card", { y: window.innerHeight + 150, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.9, filter: "blur(16px)" });

      // Intro animation on page entrance
      const introTl = gsap.timeline({ delay: 0.15 });
      introTl
        .to(".text-track", { duration: 1.2, autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "expo.out" })
        .to(".text-days", { duration: 1.1, clipPath: "inset(-20% 0% -40% 0%)", ease: "power4.inOut" }, "-=0.7")
        .set(".text-days", { clearProps: "clipPath" });

      // ScrollTrigger pinned timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4800",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        // 1. Hero text dissolves into background as 3D Card rises
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.08, filter: "blur(14px)", opacity: 0.1, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        // 2. Card expands smoothly to immersive view
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.3 })
        // 3. 3D Isometric Biometric Diorama enters with depth
        .fromTo(".mockup-scroll-wrapper",
          { y: 160, z: -250, rotationX: 20, autoAlpha: 0, scale: 0.82 },
          { y: 0, z: 0, rotationX: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.0 }, "-=0.7"
        )
        // 4. Floating certification pill badge pops in
        .fromTo(".floating-badge", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "expo.out", duration: 1.0 }, "-=0.8")
        // 5. Left & Right clean specs fade in
        .fromTo(".card-left-text", { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power3.out", duration: 1.2 }, "-=1.2")
        .fromTo(".card-right-text", { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power3.out", duration: 1.2 }, "<")
        // Pinned pause for exploration
        .to({}, { duration: 1.8 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 }) 
        .to({}, { duration: 1.0 })
        // 7. Card content fades cleanly
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.95, y: -25, autoAlpha: 0, ease: "power3.in", duration: 0.9, stagger: 0.03,
        })
        // 8. Card pulls back gracefully, framing the CTA buttons
        .to(".main-card", { 
          width: isMobile ? "92vw" : "84vw", 
          height: isMobile ? "90vh" : "84vh", 
          borderRadius: isMobile ? "24px" : "32px", 
          ease: "expo.inOut", 
          duration: 1.5 
        }, "pullback") 
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.5 }, "pullback")
        // 9. Card exits upward into next section
        .to(".main-card", { y: -window.innerHeight - 200, ease: "power3.in", duration: 1.3 });

    }, containerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [metricValue]); 

  return (
    <div
      ref={containerRef}
      className={cn("cinematic-hero-root", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} aria-hidden="true" />

      {/* ===================================================================
          BACKGROUND LAYER 1: Minimalist High-Impact Headings (Pre-Scroll)
      =================================================================== */}
      <div 
        className="hero-text-wrapper will-change-transform transform-style-3d"
        style={{
          position: "absolute",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          padding: "0 24px"
        }}
      >
        <div 
          className="text-track gsap-reveal"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "9999px",
            background: "#FFF1F2",
            border: "1px solid #FECDD3",
            color: "#A6192E",
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "18px"
          }}
        >
          <ShieldCheck size={14} />
          <span>Normativa Laboral STPS · 40 Horas</span>
        </div>

        <h1 
          className="text-track gsap-reveal text-3d-matte"
          style={{
            fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.24,
            letterSpacing: "-0.03em",
            marginBottom: "4px",
            paddingBottom: "6px",
            overflow: "visible"
          }}
        >
          {tagline1}
        </h1>
        <h1 
          className="text-days gsap-reveal text-silver-matte"
          style={{
            fontSize: "clamp(2.4rem, 5.4vw, 4.9rem)",
            fontWeight: 900,
            lineHeight: 1.25,
            letterSpacing: "-0.035em",
            paddingBottom: "10px",
            overflow: "visible"
          }}
        >
          {tagline2}
        </h1>
        <p 
          className="text-track gsap-reveal"
          style={{
            fontSize: "1.08rem",
            color: "#64748B",
            maxWidth: "560px",
            marginTop: "16px",
            lineHeight: 1.6
          }}
        >
          A partir del 1 de enero de 2027, el registro de asistencia electrónico e inalterable es obligatorio. Sanciones de 250 a 5,000 UMA por incumplimiento.
        </p>

        {/* Minimal Scroll Indicator */}
        <div 
          className="text-track gsap-reveal"
          style={{
            marginTop: "28px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#94A3B8",
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase"
          }}
        >
          <span style={{ width: "24px", height: "1px", background: "#CBD5E1" }} />
          <span>Desliza para ver la tecnología</span>
          <span style={{ width: "24px", height: "1px", background: "#CBD5E1" }} />
        </div>
      </div>

      {/* ===================================================================
          BACKGROUND LAYER 2: Tactile CTA Buttons (Revealed on Scroll Pullback)
      =================================================================== */}
      <div 
        className="cta-wrapper gsap-reveal pointer-events-auto will-change-transform"
        style={{
          position: "absolute",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          padding: "0 24px"
        }}
      >
        <h2 
          className="text-silver-matte"
          style={{
            fontSize: "clamp(2.2rem, 4.4vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
            paddingBottom: "10px",
            overflow: "visible"
          }}
        >
          {ctaHeading}
        </h2>
        <p 
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.6,
            color: "#475569",
            maxWidth: "600px",
            margin: "0 auto 32px auto"
          }}
        >
          {ctaDescription}
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => onOpenQuote?.()}
            className="btn-modern-dark"
            style={{
              padding: "15px 32px",
              borderRadius: "1rem",
              gap: "10px",
              fontSize: "1rem",
              fontWeight: 700
            }}
          >
            <FileCheck2 size={20} />
            <span>Solicitar Levantamiento Técnico</span>
            <ArrowUpRight size={17} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSimulate) {
                onSimulate();
              } else {
                const el = document.getElementById("simulador-multas");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="btn-modern-light"
            style={{
              padding: "15px 28px",
              borderRadius: "1rem",
              gap: "10px",
              fontSize: "0.98rem",
              fontWeight: 700
            }}
          >
            <Scale size={18} color="#A6192E" />
            <span>Simulador de Multas STPS</span>
          </button>
        </div>
      </div>

      {/* ===================================================================
          FOREGROUND LAYER: The Physical Obsidian / Navy 3D Card
      =================================================================== */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          perspective: "1500px"
        }}
      >
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal pointer-events-auto"
          style={{
            width: "84vw",
            height: "84vh",
            borderRadius: "32px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* DYNAMIC RESPONSIVE CONTENT GRID (3 Balanced Columns) */}
          <div 
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "24px 36px",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr 0.9fr",
              alignItems: "center",
              gap: "40px",
              zIndex: 10
            }}
            className="cinematic-card-grid"
          >
            
            {/* -------------------------------------------------------------
                1. LEFT: MINIMALIST VALUE PROPOSITION
            ------------------------------------------------------------- */}
            <div 
              className="card-left-text gsap-reveal"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                zIndex: 20,
                color: "#FFFFFF"
              }}
            >
              <div 
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-mono, monospace)",
                  fontWeight: 800,
                  color: "#38BDF8",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  width: "fit-content",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em"
                }}
              >
                <Cpu size={13} />
                <span>Hardware Certificado · MinMoe Series</span>
              </div>

              <h3 
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  letterSpacing: "-0.03em",
                  marginBottom: "14px",
                  paddingBottom: "4px",
                  overflow: "visible"
                }}
              >
                {cardHeading}
              </h3>
              
              <p 
                style={{
                  color: "rgba(226, 232, 240, 0.82)",
                  fontSize: "0.98rem",
                  lineHeight: 1.65,
                  maxWidth: "410px",
                  margin: 0
                }}
              >
                {cardDescription}
              </p>

              {/* Minimalist Micro Tags */}
              <div style={{ display: "flex", gap: "10px", marginTop: "22px", flexWrap: "wrap" }}>
                <span style={{ 
                  fontSize: "0.78rem", 
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.06)", 
                  border: "1px solid rgba(255,255,255,0.12)", 
                  padding: "5px 12px", 
                  borderRadius: "8px", 
                  color: "#E2E8F0" 
                }}>
                  ✓ Reconocimiento en 0.2 seg
                </span>
                <span style={{ 
                  fontSize: "0.78rem", 
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.06)", 
                  border: "1px solid rgba(255,255,255,0.12)", 
                  padding: "5px 12px", 
                  borderRadius: "8px", 
                  color: "#E2E8F0" 
                }}>
                  ✓ Cero Suplantación (Anti-Spoofing)
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------------
                2. CENTER: AUTHENTIC 3D ISOMETRIC BIOMETRIC ANIMATION
            ------------------------------------------------------------- */}
            <div 
              className="mockup-scroll-wrapper"
              style={{
                position: "relative",
                width: "100%",
                height: "520px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                perspective: "1200px"
              }}
            >
              
              {/* Isometric 3D Container with Mouse Tilt */}
              <div
                ref={mockupRef}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "460px",
                  aspectRatio: "1 / 1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  willChange: "transform",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Subtle Ambient Radial Glow behind the Isometric Device */}
                <div 
                  style={{
                    position: "absolute",
                    inset: "10%",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(78, 230, 255, 0.16) 0%, rgba(100, 245, 171, 0.08) 45%, transparent 70%)",
                    filter: "blur(30px)",
                    pointerEvents: "none",
                    zIndex: 0
                  }}
                  aria-hidden="true"
                />

                {/* Seamless 3D Isometric Animation Video Loop */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster="/assets/biometrico/biometrico-transparente.png"
                  aria-label="Animación isométrica 3D de terminal biométrico facial"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    zIndex: 10,
                    filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.75))"
                  }}
                >
                  <source src="/assets/biometrico/biometrico-transparente.webm" type="video/webm" />
                  <source src="/assets/biometrico/biometrico-loop.mp4" type="video/mp4" />
                  <img src="/assets/biometrico/biometrico-transparente.png" alt="Terminal biométrico isométrico" />
                </video>

                {/* Floating Minimalist Certification Pill */}
                <div 
                  className="floating-badge floating-ui-badge"
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    borderRadius: "9999px",
                    padding: "7px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    zIndex: 30
                  }}
                >
                  <Lock size={12} color="#34D399" />
                  <span style={{ color: "#F1F5F9", fontSize: "11px", fontWeight: 700, letterSpacing: "0.02em" }}>
                    Registro Inalterable STPS 2027
                  </span>
                </div>
              </div>

            </div>

            {/* -------------------------------------------------------------
                3. RIGHT: BRAND MONUMENT & MICRO STATS (Minimalist)
            ------------------------------------------------------------- */}
            <div 
              className="card-right-text gsap-reveal"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                zIndex: 20
              }}
            >
              <h2 
                className="text-card-silver-matte"
                style={{
                  fontSize: "clamp(2.8rem, 4.8vw, 5.5rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.15,
                  paddingBottom: "8px",
                  textAlign: "right",
                  margin: 0,
                  overflow: "visible"
                }}
              >
                {brandName}
              </h2>
              <span 
                style={{
                  color: "rgba(148, 163, 184, 0.6)",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.76rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginTop: "8px"
                }}
              >
                Ingeniería · CDMX
              </span>

              {/* Minimal Clean Metric Cards */}
              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                <div 
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    textAlign: "right",
                    minWidth: "140px"
                  }}
                >
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#FFFFFF", fontFamily: "var(--font-mono)" }}>
                    40 Horas
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    Semana Legal Auditada
                  </div>
                </div>

                <div 
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    textAlign: "right",
                    minWidth: "140px"
                  }}
                >
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#34D399", fontFamily: "var(--font-mono)" }}>
                    0.18 seg
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    Verificación Facial AI
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .cinematic-card-grid {
            grid-template-columns: 1fr !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-around !important;
            padding: 18px !important;
          }
          .card-right-text {
            align-items: center !important;
            order: 1 !important;
          }
          .card-right-text h2 {
            font-size: 2.6rem !important;
          }
          .card-right-text div {
            display: none !important;
          }
          .mockup-scroll-wrapper {
            order: 2 !important;
            height: 350px !important;
            transform: scale(0.8) !important;
          }
          .card-left-text {
            order: 3 !important;
            text-align: center !important;
            align-items: center !important;
          }
          .card-left-text p {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CinematicHero;
