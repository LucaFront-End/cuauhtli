import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function FenceHeroCanvas() {
  const mountRef = useRef(null);
  const [sparkActive, setSparkActive] = useState(false);
  const [wireCut, setWireCut] = useState(false);
  const [voltage, setVoltage] = useState(13800);

  const sparkMeshRef = useRef(null);
  const sparkLightRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 420;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 7.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-3, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const sparkLight = new THREE.PointLight(0x60a5fa, 0, 8);
    sparkLight.position.set(0.6, 0.8, 0);
    scene.add(sparkLight);
    sparkLightRef.current = sparkLight;

    // MATERIALS
    const steelPostMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.3,
    });

    const insulatorMat = new THREE.MeshStandardMaterial({
      color: 0x1d1e1b, // Black UV-resistant polymer
      metalness: 0.1,
      roughness: 0.2,
    });

    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });

    const cutWireMat = new THREE.MeshStandardMaterial({
      color: 0xa6192e,
      metalness: 0.95,
      roughness: 0.2,
    });

    const warningSignMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Yellow warning
      roughness: 0.4,
    });

    // FENCE POST RIG
    const fenceRig = new THREE.Group();
    scene.add(fenceRig);
    fenceRig.position.set(0, -0.6, 0);

    // 1. Galvanized Main Mast Post
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.4, 20);
    const post = new THREE.Mesh(postGeo, steelPostMat);
    post.position.set(0, 1.2, 0);
    fenceRig.add(post);

    // Base mounting flange
    const flangeGeo = new THREE.CylinderGeometry(0.3, 0.32, 0.1, 24);
    const flange = new THREE.Mesh(flangeGeo, steelPostMat);
    flange.position.set(0, -0.5, 0);
    fenceRig.add(flange);

    // 2. 6 Horizontal Lines with Ribbed Insulators
    const wireYPositions = [-0.1, 0.4, 0.9, 1.4, 1.9, 2.4];
    const wireMeshes = [];

    wireYPositions.forEach((y, idx) => {
      // Insulator body
      const insGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.22, 16);
      const ins = new THREE.Mesh(insGeo, insulatorMat);
      ins.rotation.z = Math.PI / 2;
      ins.position.set(0.12, y, 0);
      fenceRig.add(ins);

      // Ribbed dielectric rings
      for (let r = -1; r <= 1; r++) {
        const ringGeo = new THREE.TorusGeometry(0.085, 0.015, 8, 20);
        const ring = new THREE.Mesh(ringGeo, insulatorMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(0.12 + r * 0.06, y, 0);
        fenceRig.add(ring);
      }

      // Aluminum high-tension wire span
      const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 4.4, 8);
      const wire = new THREE.Mesh(wireGeo, idx === 3 && wireCut ? cutWireMat : wireMat);
      wire.rotation.z = Math.PI / 2;
      wire.position.set(0, y, 0);
      fenceRig.add(wire);
      wireMeshes.push(wire);
    });

    // 3. Danger High Voltage Warning Sign
    const signGeo = new THREE.BoxGeometry(0.7, 0.45, 0.02);
    const sign = new THREE.Mesh(signGeo, warningSignMat);
    sign.position.set(0, 1.15, 0.12);
    fenceRig.add(sign);

    // 4. Spark Arc Mesh (Segmented electric lightning bolt)
    const sparkPoints = [
      new THREE.Vector3(0.6, 0.9, 0),
      new THREE.Vector3(0.65, 0.85, 0.05),
      new THREE.Vector3(0.58, 0.78, -0.05),
      new THREE.Vector3(0.62, 0.72, 0.04),
      new THREE.Vector3(0.6, 0.65, 0),
    ];
    const sparkCurve = new THREE.CatmullRomCurve3(sparkPoints);
    const sparkGeo = new THREE.TubeGeometry(sparkCurve, 16, 0.025, 8, false);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0 });
    const sparkMesh = new THREE.Mesh(sparkGeo, sparkMat);
    fenceRig.add(sparkMesh);
    sparkMeshRef.current = sparkMesh;

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

      fenceRig.rotation.y += (mouseX * 0.4 - fenceRig.rotation.y) * 0.05;
      fenceRig.rotation.x += (-mouseY * 0.15 - fenceRig.rotation.x) * 0.05;

      // Pulse spark arc
      if (sparkActive && sparkMeshRef.current && sparkLightRef.current) {
        const flicker = Math.random() > 0.35 ? 1.0 : 0.0;
        sparkMeshRef.current.material.opacity = flicker;
        sparkMeshRef.current.scale.set(1 + Math.random() * 0.2, 1 + Math.random() * 0.2, 1);
        sparkLightRef.current.intensity = flicker * 6.0;
      } else if (sparkMeshRef.current && sparkLightRef.current) {
        sparkMeshRef.current.material.opacity = 0;
        sparkLightRef.current.intensity = 0;
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
  }, [sparkActive, wireCut]);

  const triggerSpark = () => {
    setSparkActive(true);
    setTimeout(() => setSparkActive(false), 2400);
  };

  const toggleCut = () => {
    if (!wireCut) {
      setWireCut(true);
      setVoltage(0);
    } else {
      setWireCut(false);
      setVoltage(13800);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '440px' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* VOLTAGE HUD TELEMETRY */}
      <div 
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(29, 30, 27, 0.88)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${wireCut ? '#A6192E' : 'rgba(255, 255, 255, 0.12)'}`,
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
              background: wireCut ? '#A6192E' : '#10B981',
              display: 'inline-block',
              boxShadow: `0 0 8px ${wireCut ? '#A6192E' : '#10B981'}`
            }} 
          />
          <strong style={{ color: '#F1F5F9' }}>
            {wireCut ? 'CORTE DE LÍNEA DETECTADO' : 'CIRCUITO ELECTRIFICADO ENERGIZADO'}
          </strong>
        </div>
        <div style={{ display: 'flex', gap: '14px', color: wireCut ? '#FCA5A5' : '#CBD5E1', fontSize: '0.7rem' }}>
          <span>TENSIÓN: {voltage} V</span>
          <span>IMPULSO: 1.0 HZ</span>
          <span>LAZO: {wireCut ? 'ABIERTO (SABOTAJE)' : 'CERRADO (ÍNDICE OK)'}</span>
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
          onClick={triggerSpark}
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
            background: sparkActive ? '#2B5672' : '#F1F5F9',
            color: sparkActive ? '#FFFFFF' : '#1D1E1B',
            transition: 'all 0.18s ease'
          }}
        >
          <Zap size={13} />
          <span>Probar Descarga (13.8 kV)</span>
        </button>

        <button
          type="button"
          onClick={toggleCut}
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
            background: wireCut ? '#A6192E' : '#FFF1F2',
            color: wireCut ? '#FFFFFF' : '#A6192E',
            transition: 'all 0.18s ease'
          }}
        >
          <AlertTriangle size={13} />
          <span>{wireCut ? 'Restablecer Alambre' : 'Simular Corte de Cable'}</span>
        </button>
      </div>
    </div>
  );
}
