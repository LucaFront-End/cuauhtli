import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCamera3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. SCENE & CAMERA SETUP
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(-0.25, 0.05, 7.8);

    // 2. RENDERER (Clean transparent alpha background)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // 3. STUDIO LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.7);
    scene.add(ambientLight);

    // Key Light from front-top-left
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-4, 7, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Rim Light from back-top-right to define crisp metallic edges
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 2.6);
    rimLight.position.set(6, 6, -3);
    scene.add(rimLight);

    // Soft Fill Light from bottom
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
    fillLight.position.set(0, -5, 4);
    scene.add(fillLight);

    // 4. HIGH-GRADE PHYSICAL MATERIALS
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf5f6f8,
      roughness: 0.28,
      metalness: 0.12
    });

    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x1a2027,
      roughness: 0.25,
      metalness: 0.88
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8dde4,
      roughness: 0.18,
      metalness: 0.95
    });

    const faceplateMat = new THREE.MeshStandardMaterial({
      color: 0x0f1318,
      roughness: 0.55,
      metalness: 0.25
    });

    const jetBlackLensMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      roughness: 0.02,
      metalness: 0.05,
      transmission: 0.05,
      reflectivity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02
    });

    const pitchBlackMat = new THREE.MeshBasicMaterial({
      color: 0x000000
    });

    const recLedMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 2.8,
      roughness: 0.15
    });

    const irLedMat = new THREE.MeshStandardMaterial({
      color: 0x161b22,
      roughness: 0.35,
      metalness: 0.5
    });

    // 5. MECHANICAL CAMERA RIG
    const rigRoot = new THREE.Group();
    scene.add(rigRoot);

    // --- A. LONGER DIAGONAL WALL MOUNT BRACKET ---
    const wallAnchorPos = new THREE.Vector3(4.2, 3.6, -1.0);
    const jointAnchorPos = new THREE.Vector3(0.4, 0.2, 0.15);

    const baseMountGroup = new THREE.Group();
    rigRoot.add(baseMountGroup);

    // Corner/Wall Mounting Base Flange
    const basePlateGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.3, 48);
    const basePlate = new THREE.Mesh(basePlateGeo, whiteMat);
    basePlate.rotation.z = Math.PI / 3.2;
    basePlate.rotation.x = -Math.PI / 5;
    basePlate.position.copy(wallAnchorPos);
    basePlate.castShadow = true;
    baseMountGroup.add(basePlate);

    // Base Metallic Sealing Ring
    const baseRingGeo = new THREE.TorusGeometry(0.88, 0.04, 16, 48);
    const baseRing = new THREE.Mesh(baseRingGeo, gunmetalMat);
    baseRing.rotation.z = Math.PI / 3.2;
    baseRing.rotation.x = -Math.PI / 5;
    baseRing.position.copy(wallAnchorPos);
    baseMountGroup.add(baseRing);

    // Long Curved Tubular Bracket Arm
    const armCurve = new THREE.CatmullRomCurve3([
      wallAnchorPos,
      new THREE.Vector3(3.0, 2.5, -0.6),
      new THREE.Vector3(1.8, 1.4, -0.2),
      new THREE.Vector3(1.0, 0.7, 0.02),
      jointAnchorPos
    ]);
    const armGeo = new THREE.TubeGeometry(armCurve, 40, 0.22, 24, false);
    const armMesh = new THREE.Mesh(armGeo, whiteMat);
    armMesh.castShadow = true;
    baseMountGroup.add(armMesh);

    // Arm Clamping Collar right behind knuckle
    const armCollarGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.3, 32);
    const armCollar = new THREE.Mesh(armCollarGeo, gunmetalMat);
    armCollar.position.set(0.65, 0.38, 0.08);
    armCollar.rotation.z = -Math.PI / 3.5;
    baseMountGroup.add(armCollar);

    // --- B. ARTICULATING SWIVEL KNUCKLE (MOVES WITH CAMERA!) ---
    const knuckleBase = new THREE.Group();
    knuckleBase.position.copy(jointAnchorPos);
    rigRoot.add(knuckleBase);

    // Fixed Outer Ball Socket
    const socketGeo = new THREE.SphereGeometry(0.34, 32, 32);
    const socket = new THREE.Mesh(socketGeo, gunmetalMat);
    knuckleBase.add(socket);

    // PAN SWIVEL ASSEMBLY
    const panAssembly = new THREE.Group();
    knuckleBase.add(panAssembly);

    // TILT ASSEMBLY
    const tiltAssembly = new THREE.Group();
    panAssembly.add(tiltAssembly);

    // Base resting 3/4 camera orientation
    const basePanY = -0.56;
    const baseTiltX = 0.18;
    const baseRollZ = -0.04;

    panAssembly.rotation.y = basePanY;
    tiltAssembly.rotation.x = baseTiltX;
    tiltAssembly.rotation.z = baseRollZ;

    // --- C. SOLID INTEGRATED CAMERA BODY ---
    // Rear Connection Stem
    const stemGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.5, 32);
    const stem = new THREE.Mesh(stemGeo, gunmetalMat);
    stem.rotation.x = Math.PI / 2;
    stem.position.set(0, 0, -0.32);
    tiltAssembly.add(stem);

    // Tight Joint Chrome Ring
    const jointRingGeo = new THREE.TorusGeometry(0.27, 0.03, 16, 32);
    const jointRing = new THREE.Mesh(jointRingGeo, chromeMat);
    jointRing.position.set(0, 0, -0.15);
    tiltAssembly.add(jointRing);

    // Camera Main Solid Housing
    const bodyGeo = new THREE.CylinderGeometry(0.85, 0.75, 1.75, 64);
    const bodyMesh = new THREE.Mesh(bodyGeo, whiteMat);
    bodyMesh.rotation.x = Math.PI / 2;
    bodyMesh.position.set(0, 0, 0.65);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    tiltAssembly.add(bodyMesh);

    // Rounded Rear End Dome
    const rearDomeGeo = new THREE.SphereGeometry(0.75, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const rearDome = new THREE.Mesh(rearDomeGeo, whiteMat);
    rearDome.rotation.x = -Math.PI / 2;
    rearDome.position.set(0, 0, -0.22);
    tiltAssembly.add(rearDome);

    // Rear Chrome Accent Seam Ring
    const rearSeamGeo = new THREE.TorusGeometry(0.75, 0.02, 16, 48);
    const rearSeam = new THREE.Mesh(rearSeamGeo, chromeMat);
    rearSeam.position.set(0, 0, -0.22);
    tiltAssembly.add(rearSeam);

    // --- D. 100% UNRESTRICTED, CIRCULAR FRONT BEZEL & LENS ASSEMBLY ---
    // Front Outer Metal Bezel Ring
    const bezelRingGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.16, 64);
    const bezelRing = new THREE.Mesh(bezelRingGeo, gunmetalMat);
    bezelRing.rotation.x = Math.PI / 2;
    bezelRing.position.set(0, 0, 1.52);
    tiltAssembly.add(bezelRing);

    // Chrome Inner Step Ring
    const chromeStepGeo = new THREE.TorusGeometry(0.85, 0.025, 16, 64);
    const chromeStep = new THREE.Mesh(chromeStepGeo, chromeMat);
    chromeStep.position.set(0, 0, 1.59);
    tiltAssembly.add(chromeStep);

    // Recessed Dark Charcoal Faceplate (Solid complete 360° disc)
    const faceplateGeo = new THREE.CylinderGeometry(0.84, 0.84, 0.04, 64);
    const faceplate = new THREE.Mesh(faceplateGeo, faceplateMat);
    faceplate.rotation.x = Math.PI / 2;
    faceplate.position.set(0, 0, 1.58);
    tiltAssembly.add(faceplate);

    // Outer Lens Retaining Ring
    const lensRetainerGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.04, 48);
    const lensRetainer = new THREE.Mesh(lensRetainerGeo, gunmetalMat);
    lensRetainer.rotation.x = Math.PI / 2;
    lensRetainer.position.set(0, 0, 1.6);
    tiltAssembly.add(lensRetainer);

    // Chrome Lens Trim Ring
    const lensTrimGeo = new THREE.TorusGeometry(0.46, 0.02, 16, 48);
    const lensTrim = new THREE.Mesh(lensTrimGeo, chromeMat);
    lensTrim.position.set(0, 0, 1.62);
    tiltAssembly.add(lensTrim);

    // JET-BLACK OPTICAL LENS
    const lensGlassGeo = new THREE.SphereGeometry(0.44, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const lensGlass = new THREE.Mesh(lensGlassGeo, jetBlackLensMat);
    lensGlass.rotation.x = -Math.PI / 2;
    lensGlass.position.set(0, 0, 1.61);
    tiltAssembly.add(lensGlass);

    // Absolute Pitch-Black Center Pupil Core
    const pupilGeo = new THREE.CircleGeometry(0.22, 32);
    const pupil = new THREE.Mesh(pupilGeo, pitchBlackMat);
    pupil.position.set(0, 0, 1.625);
    tiltAssembly.add(pupil);

    // --- E. RED RECORDING LED (PUNTO ROJO GRABANDO) ---
    // LED Socket
    const ledSocketGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.04, 24);
    const ledSocket = new THREE.Mesh(ledSocketGeo, gunmetalMat);
    ledSocket.rotation.x = Math.PI / 2;
    ledSocket.position.set(0.52, 0.42, 1.6);
    tiltAssembly.add(ledSocket);

    // Glowing Red LED Dome
    const recLedGeo = new THREE.SphereGeometry(0.048, 16, 16);
    const recLed = new THREE.Mesh(recLedGeo, recLedMat);
    recLed.position.set(0.52, 0.42, 1.625);
    tiltAssembly.add(recLed);

    // Soft Red Glow Point Light
    const recLight = new THREE.PointLight(0xef4444, 1.5, 2.0);
    recLight.position.set(0.52, 0.42, 1.7);
    tiltAssembly.add(recLight);

    // --- F. INFRARED LED ARRAY ---
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const irX = Math.cos(angle) * 0.65;
      const irY = Math.sin(angle) * 0.65;

      if (Math.hypot(irX - 0.52, irY - 0.42) < 0.22) continue;

      const irGeo = new THREE.CircleGeometry(0.045, 16);
      const irMesh = new THREE.Mesh(irGeo, irLedMat);
      irMesh.position.set(irX, irY, 1.605);
      tiltAssembly.add(irMesh);
    }

    // 6. RESPONSIVE MOUSE TRACKING
    let targetPan = basePanY;
    let targetTilt = baseTiltX;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetPan = basePanY + nx * 0.32;
      targetTilt = baseTiltX - ny * 0.22;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 7. ANIMATION LOOP
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      panAssembly.rotation.y += (targetPan - panAssembly.rotation.y) * 0.06;
      tiltAssembly.rotation.x += (targetTilt - tiltAssembly.rotation.x) * 0.06;

      const breath = Math.sin(time * 1.5) * 0.006;
      panAssembly.rotation.y += breath;
      tiltAssembly.rotation.x += Math.cos(time * 1.8) * 0.004;

      const pulseWave = Math.sin(time * 3.6);
      const isLit = pulseWave > -0.2;
      recLedMat.emissiveIntensity = isLit ? (2.0 + Math.max(0, pulseWave) * 1.8) : 0.08;
      recLight.intensity = isLit ? (1.0 + Math.max(0, pulseWave) * 1.0) : 0.0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '495px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        overflow: 'visible'
      }}
    >
      {/* SEAMLESS DEEP FADE AT TOP-RIGHT ORIGIN */}
      <div 
        ref={mountRef} 
        style={{
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          maskImage: 'linear-gradient(225deg, transparent 0%, transparent 12%, rgba(0, 0, 0, 0.4) 28%, black 48%)',
          WebkitMaskImage: 'linear-gradient(225deg, transparent 0%, transparent 12%, rgba(0, 0, 0, 0.4) 28%, black 48%)'
        }}
      />
    </div>
  );
}
