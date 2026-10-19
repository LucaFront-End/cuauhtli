import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PhoneCall, Key, Unlock, Mic, Smartphone } from 'lucide-react';

export default function IntercomHeroCanvas() {
  const mountRef = useRef(null);
  const [callActive, setCallActive] = useState(false);
  const [doorUnlocked, setDoorUnlocked] = useState(false);
  const [screenText, setScreenText] = useState('SISTEMAS CUAUTHLI · TOQUE PARA LLAMAR');

  const lensGlowRef = useRef(null);
  const doorLightRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 420;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2b5672, 2.0); // Cuauhtli Steel Blue Rim
    rimLight.position.set(4, 4, -2);
    scene.add(rimLight);

    // MATERIALS
    const aluminumMat = new THREE.MeshStandardMaterial({
      color: 0x2d3238, // Dark brushed aluminum
      metalness: 0.85,
      roughness: 0.25,
    });

    const glassLensMat = new THREE.MeshPhysicalMaterial({
      color: 0x051b33,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.7,
      transparent: true,
      opacity: 0.9,
    });

    const keypadMat = new THREE.MeshStandardMaterial({
      color: 0x141517,
      metalness: 0.3,
      roughness: 0.4,
    });

    const lensGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    lensGlowRef.current = lensGlowMat;

    // INTERCOM STATION ASSEMBLY
    const stationRig = new THREE.Group();
    scene.add(stationRig);
    stationRig.position.set(0, -0.2, 0);

    // 1. Back Wall Mounting Plate (Dark Steel)
    const backPlateGeo = new THREE.BoxGeometry(1.6, 2.8, 0.2);
    const backPlate = new THREE.Mesh(backPlateGeo, aluminumMat);
    stationRig.add(backPlate);

    // 2. Weather Rain Visor Hood
    const hoodGeo = new THREE.BoxGeometry(1.7, 0.15, 0.5);
    const hood = new THREE.Mesh(hoodGeo, aluminumMat);
    hood.position.set(0, 1.45, 0.15);
    stationRig.add(hood);

    // 3. Fisheye 2K Optical Camera Eye (Top Section)
    const cameraHousingGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.08, 32);
    const cameraHousing = new THREE.Mesh(cameraHousingGeo, aluminumMat);
    cameraHousing.rotation.x = Math.PI / 2;
    cameraHousing.position.set(0, 0.85, 0.12);
    stationRig.add(cameraHousing);

    const lensGlassGeo = new THREE.SphereGeometry(0.24, 32, 16);
    const lensGlass = new THREE.Mesh(lensGlassGeo, glassLensMat);
    lensGlass.position.set(0, 0.85, 0.15);
    stationRig.add(lensGlass);

    // Glowing Aperture Ring
    const apertureRingGeo = new THREE.TorusGeometry(0.28, 0.02, 12, 32);
    const apertureRing = new THREE.Mesh(apertureRingGeo, lensGlowMat);
    apertureRing.position.set(0, 0.85, 0.16);
    stationRig.add(apertureRing);

    // 4. OLED Status Screen
    const screenGeo = new THREE.BoxGeometry(1.2, 0.32, 0.02);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.28, 0.12);
    stationRig.add(screen);

    // 5. Backlit Touch Keypad Matrix (12 keys)
    const keysGroup = new THREE.Group();
    keysGroup.position.set(0, -0.4, 0.12);
    stationRig.add(keysGroup);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const keyGeo = new THREE.BoxGeometry(0.25, 0.18, 0.03);
        const keyMesh = new THREE.Mesh(keyGeo, keypadMat);
        keyMesh.position.set(-0.35 + c * 0.35, 0.3 - r * 0.24, 0);
        keysGroup.add(keyMesh);
      }
    }

    // 6. Microphone and Speaker Grille Slots
    for (let i = -3; i <= 3; i++) {
      const slotGeo = new THREE.BoxGeometry(0.08, 0.015, 0.02);
      const slot = new THREE.Mesh(slotGeo, keypadMat);
      slot.position.set(i * 0.12, -1.15, 0.11);
      stationRig.add(slot);
    }

    // MOUSE ROTATION
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ANIMATION LOOP
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      stationRig.rotation.y += (mouseX * 0.4 - stationRig.rotation.y) * 0.05;
      stationRig.rotation.x += (-mouseY * 0.15 - stationRig.rotation.x) * 0.05;

      // Pulse ring when calling
      if (lensGlowRef.current) {
        if (callActive) {
          const pulse = (Math.sin(elapsed * 8) + 1) * 0.5;
          lensGlowRef.current.color.setHex(pulse > 0.5 ? 0x10b981 : 0x059669);
        } else if (doorUnlocked) {
          lensGlowRef.current.color.setHex(0x10b981);
        } else {
          lensGlowRef.current.color.setHex(0x38bdf8);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [callActive, doorUnlocked]);

  const triggerCall = () => {
    setCallActive(true);
    setScreenText('LLAMANDO A SMARTPHONE DE RESIDENTE...');
    setTimeout(() => {
      setScreenText('CONEXIÓN SIP ACTIVA · AUDIO 2 VÍAS 2K HD');
      setTimeout(() => {
        setCallActive(false);
        setScreenText('SISTEMAS CUAUTHLI · TOQUE PARA LLAMAR');
      }, 3500);
    }, 2000);
  };

  const triggerUnlock = () => {
    setDoorUnlocked(true);
    setScreenText('ELECTROIMÁN LIBERADO · PUERTA ABIERTA');
    setTimeout(() => {
      setDoorUnlocked(false);
      setScreenText('SISTEMAS CUAUTHLI · TOQUE PARA LLAMAR');
    }, 3000);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '440px' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* OLED HUD TELEMETRY */}
      <div 
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(29, 30, 27, 0.88)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${doorUnlocked ? '#10B981' : callActive ? '#2B5672' : 'rgba(255, 255, 255, 0.12)'}`,
          borderRadius: '10px',
          padding: '10px 14px',
          color: '#FFFFFF',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.74rem',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 10,
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              background: doorUnlocked ? '#10B981' : callActive ? '#38BDF8' : '#10B981',
              display: 'inline-block',
              boxShadow: `0 0 8px ${doorUnlocked ? '#10B981' : callActive ? '#38BDF8' : '#10B981'}`
            }} 
          />
          <strong style={{ color: '#F1F5F9' }}>
            {doorUnlocked ? 'ACCESO PEATONAL DESBLOQUEADO' : callActive ? 'ENLACE SIP 2.0 EN CURSO' : 'FRENTE DE CALLE EN LÍNEA'}
          </strong>
        </div>
        <div style={{ color: doorUnlocked ? '#A7F3D0' : callActive ? '#BAE6FD' : '#CBD5E1', fontSize: '0.7rem' }}>
          {screenText}
        </div>
      </div>

      {/* INTERACTIVE ACTIONS */}
      <div 
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '6px 10px',
          borderRadius: '9999px',
          border: '1px solid #E8E6E6',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
          zIndex: 10
        }}
      >
        <button
          type="button"
          onClick={triggerCall}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: callActive ? '#2B5672' : '#F1F5F9',
            color: callActive ? '#FFFFFF' : '#1D1E1B',
            transition: 'all 0.18s ease'
          }}
        >
          <PhoneCall size={13} />
          <span>Timbrar (Llamar)</span>
        </button>

        <button
          type="button"
          onClick={triggerUnlock}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: doorUnlocked ? '#10B981' : '#F1F5F9',
            color: doorUnlocked ? '#FFFFFF' : '#1D1E1B',
            transition: 'all 0.18s ease'
          }}
        >
          <Unlock size={13} />
          <span>Apertura Remota</span>
        </button>
      </div>
    </div>
  );
}
