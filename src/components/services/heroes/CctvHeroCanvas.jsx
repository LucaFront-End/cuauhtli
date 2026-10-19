import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, Eye, Moon, Zap, Shield, Crosshair } from 'lucide-react';

export default function CctvHeroCanvas() {
  const mountRef = useRef(null);
  const [nightMode, setNightMode] = useState(false);
  const [thermalMode, setThermalMode] = useState(false);
  const [activePreset, setActivePreset] = useState('ptz');
  const [detectionConfidence, setDetectionConfidence] = useState(99.4);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 420;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(-0.2, 0.2, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(-4, 6, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa6192e, 2.2); // Cuauhtli Crimson Rim
    rimLight.position.set(5, 5, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x2b5672, 1.4); // Cuauhtli Steel Petrol Fill
    fillLight.position.set(0, -4, 3);
    scene.add(fillLight);

    // MATERIALS
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf4f5f7, roughness: 0.25, metalness: 0.1 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1d1e1b, roughness: 0.35, metalness: 0.7 });
    const crimsonMat = new THREE.MeshStandardMaterial({ color: 0xa6192e, roughness: 0.3, metalness: 0.4 });
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x051020,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.6,
      thickness: 0.8,
      reflectivity: 0.95
    });

    const irLedMat = new THREE.MeshBasicMaterial({ color: nightMode ? 0xff2222 : 0x331111 });

    // CAMERA ASSEMBLY
    const cameraRig = new THREE.Group();
    scene.add(cameraRig);

    // 1. Heavy Wall Mounting Base Plate
    const basePlateGeo = new THREE.CylinderGeometry(0.9, 0.95, 0.22, 32);
    const basePlate = new THREE.Mesh(basePlateGeo, whiteMat);
    basePlate.rotation.x = Math.PI / 2;
    basePlate.position.set(-1.6, 0.8, -1.8);
    cameraRig.add(basePlate);

    // 2. Articulated Swivel Arm
    const armGroup = new THREE.Group();
    armGroup.position.copy(basePlate.position);
    cameraRig.add(armGroup);

    const armGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.6, 20);
    const armMesh = new THREE.Mesh(armGeo, whiteMat);
    armMesh.rotation.z = -Math.PI / 4;
    armMesh.position.set(0.6, -0.4, 0.8);
    armGroup.add(armMesh);

    // 3. Pan-Tilt Gimbal Head
    const gimbalHead = new THREE.Group();
    gimbalHead.position.set(1.2, -0.9, 1.6);
    armGroup.add(gimbalHead);

    // Gimbal sphere knuckle
    const knuckleGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const knuckleMesh = new THREE.Mesh(knuckleGeo, darkMat);
    gimbalHead.add(knuckleMesh);

    // 4. Main Bullet Camera Body (White housing + Crimson Cuauhtli accent ring)
    const bodyGroup = new THREE.Group();
    gimbalHead.add(bodyGroup);

    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.62, 1.9, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, whiteMat);
    bodyMesh.rotation.x = Math.PI / 2;
    bodyMesh.position.set(0, 0, 0.95);
    bodyGroup.add(bodyMesh);

    // Sun shield / Visor on top
    const visorGeo = new THREE.CylinderGeometry(0.66, 0.72, 1.6, 32, 1, true, 0, Math.PI);
    const visorMesh = new THREE.Mesh(visorGeo, whiteMat);
    visorMesh.rotation.x = Math.PI / 2;
    visorMesh.rotation.z = Math.PI;
    visorMesh.position.set(0, 0.12, 1.1);
    bodyGroup.add(visorMesh);

    // Cuauhtli Brand Ring (Crimson)
    const ringGeo = new THREE.TorusGeometry(0.56, 0.04, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, crimsonMat);
    ringMesh.position.set(0, 0, 1.85);
    bodyGroup.add(ringMesh);

    // Front Face Plate (Dark Graphite)
    const frontFaceGeo = new THREE.CylinderGeometry(0.53, 0.53, 0.1, 32);
    const frontFace = new THREE.Mesh(frontFaceGeo, darkMat);
    frontFace.rotation.x = Math.PI / 2;
    frontFace.position.set(0, 0, 1.92);
    bodyGroup.add(frontFace);

    // Central 4K Optical Lens
    const lensGeo = new THREE.SphereGeometry(0.24, 32, 16);
    const lensMesh = new THREE.Mesh(lensGeo, lensGlassMat);
    lensMesh.position.set(0, 0, 1.95);
    bodyGroup.add(lensMesh);

    // Infrared LED Ring (6 circular micro-emitters)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const ledGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12);
      const ledMesh = new THREE.Mesh(ledGeo, irLedMat);
      ledMesh.rotation.x = Math.PI / 2;
      ledMesh.position.set(Math.cos(angle) * 0.38, Math.sin(angle) * 0.38, 1.94);
      bodyGroup.add(ledMesh);
    }

    // Laser Rangefinder Aperture (Red glowing beacon)
    const laserApertureGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const laserAperture = new THREE.Mesh(laserApertureGeo, laserMat);
    laserAperture.rotation.x = Math.PI / 2;
    laserAperture.position.set(0, 0.38, 1.95);
    bodyGroup.add(laserAperture);

    // MOUSE INTERACTION & SCANNING SWEEP
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // RESIZE
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle mechanical breathing scan + interactive mouse tracking
      const sweep = Math.sin(elapsedTime * 0.8) * 0.25;
      targetRotY = mouseX * 0.45 + sweep;
      targetRotX = -mouseY * 0.35 + 0.05;

      gimbalHead.rotation.y += (targetRotY - gimbalHead.rotation.y) * 0.06;
      gimbalHead.rotation.x += (targetRotX - gimbalHead.rotation.x) * 0.06;

      // Laser beacon pulse
      laserMat.color.setHex(Math.sin(elapsedTime * 4) > 0 ? 0xff2222 : 0xaa0000);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [nightMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '440px' }}>
      {/* THREE.JS MOUNT */}
      <div 
        ref={mountRef} 
        style={{ width: '100%', height: '100%', cursor: 'grab' }}
      />

      {/* FLOATING CYBER HUD TELEMETRY */}
      <div 
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(29, 30, 27, 0.82)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '10px',
          padding: '10px 14px',
          color: '#FFFFFF',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.74rem',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
          <strong style={{ color: '#F1F5F9' }}>ENLACE C4 ACTIVO</strong>
          <span style={{ color: '#94A3B8' }}>· 4K @ 30FPS</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', color: '#CBD5E1', fontSize: '0.7rem' }}>
          <span>IA: HUMANO ({detectionConfidence}%)</span>
          <span>LATENCIA: 6ms</span>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS BAR */}
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
          onClick={() => setNightMode(!nightMode)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: nightMode ? '#A6192E' : '#F1F5F9',
            color: nightMode ? '#FFFFFF' : '#1D1E1B',
            transition: 'all 0.18s ease'
          }}
        >
          <Moon size={13} />
          <span>{nightMode ? 'Infrarrojo ON' : 'Visión Nocturna'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setThermalMode(!thermalMode);
            setDetectionConfidence(prev => prev === 99.4 ? 99.9 : 99.4);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: thermalMode ? '#2B5672' : '#F1F5F9',
            color: thermalMode ? '#FFFFFF' : '#1D1E1B',
            transition: 'all 0.18s ease'
          }}
        >
          <Crosshair size={13} />
          <span>{thermalMode ? 'Analítica IA ON' : 'Auto-Tracking'}</span>
        </button>
      </div>
    </div>
  );
}
