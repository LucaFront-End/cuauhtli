import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shield, Bell, AlertOctagon, CheckCircle2, Radio } from 'lucide-react';

export default function AlarmHeroCanvas() {
  const mountRef = useRef(null);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [isArmed, setIsArmed] = useState(true);
  const [activeZone, setActiveZone] = useState('ZONA 01: PERÍMETRO NORTE');

  const strobeMatRef = useRef(null);
  const strobeLightRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 420;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(-3, 5, 4);
    scene.add(keyLight);

    // Strobe Point Light (Red flasher)
    const strobeLight = new THREE.PointLight(0xa6192e, 0, 12);
    strobeLight.position.set(0, 1.6, 0.5);
    scene.add(strobeLight);
    strobeLightRef.current = strobeLight;

    // MATERIALS
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: 0x222426,
      metalness: 0.85,
      roughness: 0.35,
    });

    const crimsonTrimMat = new THREE.MeshStandardMaterial({
      color: 0xa6192e,
      metalness: 0.5,
      roughness: 0.25,
    });

    const strobeLensMat = new THREE.MeshPhysicalMaterial({
      color: 0xff1122,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    strobeMatRef.current = strobeLensMat;

    const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ledBlueMat = new THREE.MeshBasicMaterial({ color: 0x2b5672 });

    // ALARM HUB RIG
    const alarmRig = new THREE.Group();
    scene.add(alarmRig);

    // 1. Metal Cabinet Enclosure
    const cabinetGeo = new THREE.BoxGeometry(2.2, 2.6, 0.6);
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    alarmRig.add(cabinet);

    // Front Door Inset Panel
    const doorGeo = new THREE.BoxGeometry(2.0, 2.4, 0.08);
    const door = new THREE.Mesh(doorGeo, cabinetMat);
    door.position.set(0, 0, 0.32);
    alarmRig.add(door);

    // Cuauhtli Red Badge Line
    const stripeGeo = new THREE.BoxGeometry(2.0, 0.08, 0.02);
    const stripe = new THREE.Mesh(stripeGeo, crimsonTrimMat);
    stripe.position.set(0, 0.9, 0.38);
    alarmRig.add(stripe);

    // Metallic Lock Cylinder
    const lockGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
    const lockMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const lock = new THREE.Mesh(lockGeo, lockMat);
    lock.rotation.x = Math.PI / 2;
    lock.position.set(0.85, 0, 0.38);
    alarmRig.add(lock);

    // 2. High-Intensity Optical Strobe Beacon on top
    const strobeBaseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.15, 24);
    const strobeBase = new THREE.Mesh(strobeBaseGeo, cabinetMat);
    strobeBase.position.set(0, 1.38, 0);
    alarmRig.add(strobeBase);

    const strobeFresnelGeo = new THREE.CylinderGeometry(0.3, 0.32, 0.45, 24);
    const strobeFresnel = new THREE.Mesh(strobeFresnelGeo, strobeLensMat);
    strobeFresnel.position.set(0, 1.65, 0);
    alarmRig.add(strobeFresnel);

    // 3. Status Diagnostic LEDs
    for (let i = 0; i < 4; i++) {
      const ledGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12);
      const led = new THREE.Mesh(ledGeo, i === 0 ? ledGreenMat : ledBlueMat);
      led.rotation.x = Math.PI / 2;
      led.position.set(-0.7 + i * 0.18, 0.9, 0.38);
      alarmRig.add(led);
    }

    // 4. Dual Antenna Stubs (Cellular 4G + RF Mesh)
    const ant1Geo = new THREE.CylinderGeometry(0.025, 0.025, 0.9, 12);
    const ant1 = new THREE.Mesh(ant1Geo, cabinetMat);
    ant1.position.set(-0.9, 1.7, 0);
    alarmRig.add(ant1);

    const ant2Geo = new THREE.CylinderGeometry(0.025, 0.025, 0.9, 12);
    const ant2 = new THREE.Mesh(ant2Geo, cabinetMat);
    ant2.position.set(0.9, 1.7, 0);
    alarmRig.add(ant2);

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

      alarmRig.rotation.y += (mouseX * 0.4 - alarmRig.rotation.y) * 0.05;
      alarmRig.rotation.x += (-mouseY * 0.2 - alarmRig.rotation.x) * 0.05;

      // Strobe flashing if triggered
      if (strobeLightRef.current && strobeMatRef.current) {
        if (alarmTriggered) {
          const flash = Math.sin(elapsed * 18) > 0 ? 5.0 : 0.0;
          strobeLightRef.current.intensity = flash;
          strobeMatRef.current.emissive = new THREE.Color(flash > 0 ? 0xff0000 : 0x000000);
        } else {
          strobeLightRef.current.intensity = 0;
          strobeMatRef.current.emissive = new THREE.Color(0x000000);
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
  }, [alarmTriggered]);

  const toggleIntrusion = () => {
    if (!alarmTriggered) {
      setAlarmTriggered(true);
      setActiveZone('¡INTRUSIÓN! ZONA 03: ANDÉN SUR #4');
    } else {
      setAlarmTriggered(false);
      setActiveZone('ZONA 01: PERÍMETRO NORTE');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '440px' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* C4 RADAR HUD TELEMETRY */}
      <div 
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(29, 30, 27, 0.88)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${alarmTriggered ? '#A6192E' : 'rgba(255, 255, 255, 0.12)'}`,
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
              background: alarmTriggered ? '#A6192E' : isArmed ? '#10B981' : '#EAB308',
              display: 'inline-block',
              boxShadow: `0 0 8px ${alarmTriggered ? '#A6192E' : isArmed ? '#10B981' : '#EAB308'}`
            }} 
          />
          <strong style={{ color: '#F1F5F9' }}>
            {alarmTriggered ? 'DESPACHO C4 ACTIVADO' : isArmed ? 'CENTRAL C4: ARMADO TOTAL' : 'SISTEMA DESARMADO'}
          </strong>
        </div>
        <div style={{ color: alarmTriggered ? '#FCA5A5' : '#CBD5E1', fontSize: '0.7rem' }}>
          {activeZone}
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
          onClick={toggleIntrusion}
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
            background: alarmTriggered ? '#A6192E' : '#FFF1F2',
            color: alarmTriggered ? '#FFFFFF' : '#A6192E',
            transition: 'all 0.18s ease'
          }}
        >
          <AlertOctagon size={13} />
          <span>{alarmTriggered ? 'Silenciar Alarma' : 'Simular Intrusión'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsArmed(!isArmed)}
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
            background: isArmed ? '#F1F5F9' : '#FEF3C7',
            color: isArmed ? '#1D1E1B' : '#92400E',
            transition: 'all 0.18s ease'
          }}
        >
          <Shield size={13} />
          <span>{isArmed ? 'Desarmar' : 'Armar Sistema'}</span>
        </button>
      </div>
    </div>
  );
}
