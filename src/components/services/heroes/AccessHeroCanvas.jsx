import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { UserCheck, ShieldCheck, CreditCard, AlertTriangle } from 'lucide-react';

export default function AccessHeroCanvas() {
  const mountRef = useRef(null);
  const [accessState, setAccessState] = useState('idle'); // 'idle' | 'granted' | 'denied'
  const [userName, setUserName] = useState('ESCANEO LISTO');

  const gateAngleRef = useRef(0);
  const targetGateAngleRef = useRef(0);
  const ledColorRef = useRef(new THREE.Color(0x2b5672)); // Default Cuauhtli Steel Blue

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 420;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-3, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa6192e, 2.0);
    rimLight.position.set(4, 4, -3);
    scene.add(rimLight);

    // MATERIALS
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xdde2e8,
      metalness: 0.85,
      roughness: 0.22,
    });

    const blackPanelMat = new THREE.MeshStandardMaterial({
      color: 0x141513,
      metalness: 0.9,
      roughness: 0.15,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0.75,
      thickness: 0.5,
    });

    const ledMat = new THREE.MeshBasicMaterial({ color: ledColorRef.current });

    // SPEED GATE & TOTEM ASSEMBLY
    const assembly = new THREE.Group();
    scene.add(assembly);
    assembly.position.set(0, -0.6, 0);

    // 1. Pedestal Base (Stainless Steel Chassis)
    const baseGeo = new THREE.BoxGeometry(1.0, 1.8, 2.4);
    const baseMesh = new THREE.Mesh(baseGeo, steelMat);
    baseMesh.position.set(-0.9, 0.9, 0);
    assembly.add(baseMesh);

    // Smooth rounded top cap
    const topCapGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.4, 24, 1, false, 0, Math.PI);
    const topCap = new THREE.Mesh(topCapGeo, steelMat);
    topCap.rotation.z = Math.PI / 2;
    topCap.rotation.y = Math.PI / 2;
    topCap.position.set(-0.9, 1.8, 0);
    assembly.add(topCap);

    // Top Black Inlay Panel (NFC Reader Area)
    const inlayGeo = new THREE.BoxGeometry(0.7, 0.02, 1.8);
    const inlay = new THREE.Mesh(inlayGeo, blackPanelMat);
    inlay.position.set(-0.9, 1.82, 0);
    assembly.add(inlay);

    // Glowing LED Indicator Strip
    const stripGeo = new THREE.BoxGeometry(0.04, 0.02, 1.7);
    const strip = new THREE.Mesh(stripGeo, ledMat);
    strip.position.set(-0.54, 1.83, 0);
    assembly.add(strip);

    // 2. Optical Glass Swing Wing (Hinged arm)
    const wingHinge = new THREE.Group();
    wingHinge.position.set(-0.4, 1.0, 0);
    assembly.add(wingHinge);

    const wingGeo = new THREE.BoxGeometry(0.06, 0.95, 1.3);
    const wingMesh = new THREE.Mesh(wingGeo, glassMat);
    wingMesh.position.set(0.68, 0, 0);
    wingHinge.add(wingMesh);

    // 3. Biometric Facial Recognition Column (Sleek upright terminal)
    const totemPillar = new THREE.Group();
    totemPillar.position.set(-0.9, 1.85, 0.7);
    assembly.add(totemPillar);

    const pillarGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16);
    const pillarMesh = new THREE.Mesh(pillarGeo, steelMat);
    pillarMesh.position.set(0, 0.35, 0);
    totemPillar.add(pillarMesh);

    // Facial Scanner Head Unit
    const screenHeadGeo = new THREE.BoxGeometry(0.32, 0.55, 0.1);
    const screenHead = new THREE.Mesh(screenHeadGeo, blackPanelMat);
    screenHead.position.set(0, 0.75, 0);
    screenHead.rotation.x = -0.15;
    totemPillar.add(screenHead);

    // Glowing Camera / Screen Surface
    const screenFaceGeo = new THREE.PlaneGeometry(0.28, 0.48);
    const screenFaceMat = new THREE.MeshBasicMaterial({ color: 0x223344 });
    const screenFace = new THREE.Mesh(screenFaceGeo, screenFaceMat);
    screenFace.position.set(0, 0.75, 0.055);
    screenFace.rotation.x = -0.15;
    totemPillar.add(screenFace);

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

      // Mouse perspective sway
      assembly.rotation.y += (mouseX * 0.35 - assembly.rotation.y) * 0.05;
      assembly.rotation.x += (-mouseY * 0.15 - assembly.rotation.x) * 0.05;

      // Gate animation
      gateAngleRef.current += (targetGateAngleRef.current - gateAngleRef.current) * 0.08;
      wingHinge.rotation.y = gateAngleRef.current;

      // LED color interpolation
      ledMat.color.lerp(ledColorRef.current, 0.1);

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
  }, []);

  const triggerAccess = (type) => {
    if (type === 'face') {
      setAccessState('granted');
      setUserName('ING. CARLOS MENA · ACCESO AUTORIZADO');
      targetGateAngleRef.current = Math.PI / 2.2; // Swing open
      ledColorRef.current.setHex(0x10b981); // Emerald
      setTimeout(() => {
        targetGateAngleRef.current = 0; // Close
        setAccessState('idle');
        setUserName('ESCANEO LISTO');
        ledColorRef.current.setHex(0x2b5672);
      }, 3500);
    } else if (type === 'rfid') {
      setAccessState('granted');
      setUserName('TAG VEHICULAR #4092 · AUTORIZADO');
      targetGateAngleRef.current = Math.PI / 2.2;
      ledColorRef.current.setHex(0x10b981);
      setTimeout(() => {
        targetGateAngleRef.current = 0;
        setAccessState('idle');
        setUserName('ESCANEO LISTO');
        ledColorRef.current.setHex(0x2b5672);
      }, 3000);
    } else {
      setAccessState('denied');
      setUserName('ACCESO DENEGADO · SUPLANTACIÓN DETECTADA');
      targetGateAngleRef.current = 0;
      ledColorRef.current.setHex(0xa6192e); // Cuauhtli Red Alert
      setTimeout(() => {
        setAccessState('idle');
        setUserName('ESCANEO LISTO');
        ledColorRef.current.setHex(0x2b5672);
      }, 3000);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '440px' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* BIOMETRIC HUD OVERLAY */}
      <div 
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(29, 30, 27, 0.85)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${accessState === 'granted' ? '#10B981' : accessState === 'denied' ? '#A6192E' : 'rgba(255, 255, 255, 0.12)'}`,
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
          transition: 'border-color 0.25s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              background: accessState === 'granted' ? '#10B981' : accessState === 'denied' ? '#A6192E' : '#2B5672',
              display: 'inline-block',
              boxShadow: `0 0 8px ${accessState === 'granted' ? '#10B981' : accessState === 'denied' ? '#A6192E' : '#2B5672'}`
            }} 
          />
          <strong style={{ color: '#F1F5F9' }}>
            {accessState === 'granted' ? 'PASO PERMITIDO' : accessState === 'denied' ? 'ALERTA DE SEGURIDAD' : 'TORNIQUETE ACTIVO'}
          </strong>
        </div>
        <div style={{ color: '#CBD5E1', fontSize: '0.7rem' }}>
          {userName}
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
          onClick={() => triggerAccess('face')}
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
            background: accessState === 'granted' ? '#10B981' : '#F1F5F9',
            color: accessState === 'granted' ? '#FFFFFF' : '#1D1E1B',
            transition: 'all 0.18s ease'
          }}
        >
          <UserCheck size={13} />
          <span>Escanear Rostro</span>
        </button>

        <button
          type="button"
          onClick={() => triggerAccess('rfid')}
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
            background: '#F1F5F9',
            color: '#1D1E1B',
            transition: 'all 0.18s ease'
          }}
        >
          <CreditCard size={13} />
          <span>Tap Tarjeta RFID</span>
        </button>

        <button
          type="button"
          onClick={() => triggerAccess('denied')}
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
            background: accessState === 'denied' ? '#A6192E' : '#FFF1F2',
            color: accessState === 'denied' ? '#FFFFFF' : '#A6192E',
            transition: 'all 0.18s ease'
          }}
        >
          <AlertTriangle size={13} />
          <span>Simular Rechazo</span>
        </button>
      </div>
    </div>
  );
}
