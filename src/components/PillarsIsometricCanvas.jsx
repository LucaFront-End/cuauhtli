import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Low-poly 3D biometric head math from custom geometry
function makeFaceGeometryData() {
  const bands = [
    [-0.700, 0.120, 0.070, [0.120, 0.120, 0.116, 0.102, 0.078, 0.030, -0.020]],
    [-0.610, 0.235, 0.120, [0.230, 0.230, 0.221, 0.196, 0.147, 0.070, -0.020]],
    [-0.510, 0.320, 0.160, [0.290, 0.290, 0.275, 0.240, 0.170, 0.075, -0.025]],
    [-0.405, 0.365, 0.180, [0.300, 0.295, 0.270, 0.230, 0.165, 0.070, -0.035]],
    [-0.330, 0.385, 0.200, [0.240, 0.242, 0.249, 0.205, 0.165, 0.073, -0.040]],
    [-0.270, 0.400, 0.210, [0.300, 0.294, 0.270, 0.220, 0.180, 0.086, -0.032]],
    [-0.190, 0.416, 0.220, [0.225, 0.265, 0.250, 0.215, 0.210, 0.105, -0.026]],
    [-0.110, 0.435, 0.230, [0.390, 0.370, 0.320, 0.240, 0.250, 0.130, -0.023]],
    [-0.035, 0.454, 0.250, [0.455, 0.425, 0.300, 0.245, 0.285, 0.145, -0.018]],
    [ 0.065, 0.476, 0.270, [0.375, 0.340, 0.255, 0.190, 0.270, 0.120, -0.022]],
    [ 0.160, 0.480, 0.280, [0.285, 0.277, 0.215, 0.150, 0.186, 0.095, -0.015]],
    [ 0.255, 0.471, 0.280, [0.280, 0.278, 0.270, 0.277, 0.240, 0.120, -0.015]],
    [ 0.350, 0.460, 0.280, [0.240, 0.240, 0.235, 0.240, 0.230, 0.140, -0.015]],
    [ 0.470, 0.427, 0.255, [0.230, 0.230, 0.224, 0.210, 0.180, 0.103, -0.025]],
    [ 0.590, 0.360, 0.210, [0.180, 0.179, 0.169, 0.155, 0.129, 0.063, -0.040]],
    [ 0.690, 0.240, 0.140, [0.075, 0.075, 0.069, 0.055, 0.033,-0.005, -0.065]]
  ];
  const halfFrontX = [0, 0.12, 0.26, 0.45, 0.65, 0.86, 1];
  const positions = [];
  const indices = [];
  const ringSize = 18;
  const zScale = 0.65 / 0.75;
  const push = (x, y, z) => positions.push(x, (y - 0.005) * (1.45 / 1.52), z * zScale);

  for (const band of bands) {
    const [y, width, backDepth, profile] = band;
    for (let j = 6; j >= 0; --j) push(-halfFrontX[j] * width, y, profile[j]);
    for (let j = 1; j <= 6; ++j) push( halfFrontX[j] * width, y, profile[j]);
    for (let j = 1; j <= 5; ++j) {
      const angle = j * Math.PI / 6;
      push(width * Math.cos(angle), y, profile[6] - backDepth * Math.sin(angle));
    }
  }

  for (let row = 0; row < bands.length - 1; ++row) {
    for (let col = 0; col < ringSize; ++col) {
      const next = (col + 1) % ringSize;
      const a = row * ringSize + col;
      const b = row * ringSize + next;
      const c = (row + 1) * ringSize + col;
      const d = (row + 1) * ringSize + next;
      const sideCol = col < 12 ? Math.min(col, 11 - col) : col;
      if ((row + sideCol) % 2) indices.push(a, b, d, a, d, c);
      else indices.push(a, b, c, b, d, c);
    }
  }

  const bottom = positions.length / 3;
  push(0, -0.755, -0.005);
  const top = positions.length / 3;
  push(0, 0.765, -0.080);
  const topRing = (bands.length - 1) * ringSize;
  for (let col = 0; col < ringSize; ++col) {
    const next = (col + 1) % ringSize;
    indices.push(bottom, next, col);
    indices.push(top, topRing + col, topRing + next);
  }

  return { positions, indices };
}

export default function PillarsIsometricCanvas({ activeStep = 0 }) {
  const mountRef = useRef(null);
  const activeStepRef = useRef(activeStep);

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 560;
    let height = container.clientHeight || 520;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    
    // 2. ORTHOGRAPHIC CAMERA (30° elevation isometric view)
    const aspect = width / height;
    const span = 5.2;
    const camera = new THREE.OrthographicCamera(
      (-span * aspect) / 2,
      (span * aspect) / 2,
      span / 2,
      -span / 2,
      0.1,
      60
    );
    const cameraTarget = new THREE.Vector3(0, 1.15, 0);
    camera.position.set(-8.0, 7.632, 8.0);
    camera.lookAt(cameraTarget);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. LIGHTING RIG
    scene.add(new THREE.AmbientLight(0xdde6f0, 0.5));
    scene.add(new THREE.HemisphereLight(0xecf4ff, 0x17212d, 0.9));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-4, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0002;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 2.2);
    rimLight.position.set(4, 5, -3);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0x38bdf8, 1.2, 5, 2);
    accentLight.position.set(0.8, 1.6, 0.6);
    scene.add(accentLight);

    // Common Materials
    const std = (color, rough = 0.4, metal = 0.35) =>
      new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, flatShading: true });
    
    const glowMat = (color, intensity = 2) =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: intensity,
        roughness: 0.3,
        metalness: 0.1
      });

    const baseGraphiteMat = std('#161e27', 0.5, 0.45);
    const carbonMat = std('#0b1017', 0.3, 0.3);
    const alloyMat = std('#3b4856', 0.28, 0.7);
    const cyanGlow = glowMat('#3ee2fc', 2.2);
    const greenGlow = glowMat('#10b981', 2.0);
    const amberGlow = glowMat('#f59e0b', 2.0);

    // Common Architectural Diorama Foundation
    const foundationGroup = new THREE.Group();
    scene.add(foundationGroup);

    const foundationMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.58, 0.22, 8),
      baseGraphiteMat
    );
    foundationMesh.position.set(0, 0.11, 0);
    foundationMesh.receiveShadow = true;
    foundationGroup.add(foundationMesh);

    const foundationTop = new THREE.Mesh(
      new THREE.CylinderGeometry(2.38, 2.38, 0.03, 8),
      std('#1a2430', 0.65, 0.25)
    );
    foundationTop.position.set(0, 0.23, 0);
    foundationGroup.add(foundationTop);

    // Geometric lines on floor
    const floorPoints = [
      new THREE.Vector3(-1.4, 0.25, 0.2),
      new THREE.Vector3(-0.6, 0.25, 1.1),
      new THREE.Vector3(0.5, 0.25, 1.1),
      new THREE.Vector3(1.3, 0.25, 0.2)
    ];
    const floorLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(floorPoints),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
    );
    foundationGroup.add(floorLine);

    // =========================================================================
    // SCENE 1: BIOMETRIC TERMINAL & POLYGONAL FACE (Pilar 01)
    // =========================================================================
    const scene1Group = new THREE.Group();
    scene.add(scene1Group);

    // Graphite Terminal
    const terminal1 = new THREE.Group();
    terminal1.position.set(-0.75, 1.6, -0.4);
    scene1Group.add(terminal1);

    const chassis1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.65, 0.24), alloyMat);
    chassis1.castShadow = true;
    terminal1.add(chassis1);

    const screen1 = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.95),
      new THREE.MeshBasicMaterial({ color: 0x071524 })
    );
    screen1.position.set(0, 0.05, 0.125);
    terminal1.add(screen1);

    const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16), carbonMat);
    lens1.rotation.x = Math.PI / 2;
    lens1.position.set(0, 0.62, 0.13);
    terminal1.add(lens1);

    const lensRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.006, 4, 20), cyanGlow);
    lensRing1.position.set(0, 0.62, 0.14);
    terminal1.add(lensRing1);

    // 3D Polygonal Face Head
    const faceData = makeFaceGeometryData();
    const faceGeo = new THREE.BufferGeometry();
    faceGeo.setAttribute('position', new THREE.Float32BufferAttribute(faceData.positions, 3));
    faceGeo.setIndex(faceData.indices);
    faceGeo.computeVertexNormals();

    const faceMesh1 = new THREE.Mesh(
      faceGeo,
      new THREE.MeshStandardMaterial({
        color: 0x0e3a4d,
        emissive: 0x052330,
        roughness: 0.25,
        metalness: 0.65,
        flatShading: true,
        transparent: true,
        opacity: 0.88
      })
    );
    const faceWire1 = new THREE.LineSegments(
      new THREE.WireframeGeometry(faceGeo),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
    );

    const faceHead1 = new THREE.Group();
    faceHead1.position.set(0.85, 1.78, 0.45);
    faceHead1.rotation.y = -0.38;
    faceHead1.add(faceMesh1);
    faceHead1.add(faceWire1);
    scene1Group.add(faceHead1);

    // Laser scanning sheet
    const laserSheet1 = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.1),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      })
    );
    laserSheet1.rotation.x = -Math.PI / 2;
    laserSheet1.position.set(0.85, 1.8, 0.45);
    scene1Group.add(laserSheet1);

    // =========================================================================
    // SCENE 2: 40-HOUR SHIFT CLOCK & OVERTIME BARRIER (Pilar 02)
    // =========================================================================
    const scene2Group = new THREE.Group();
    scene.add(scene2Group);

    // Isometric Hexagonal Time Prism
    const timePrism2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.95, 1.4, 6),
      alloyMat
    );
    timePrism2.position.set(0, 1.4, 0);
    timePrism2.castShadow = true;
    scene2Group.add(timePrism2);

    // Rotating orbital clock ring
    const clockRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.035, 6, 32),
      cyanGlow
    );
    clockRing2.rotation.x = -Math.PI / 2.8;
    clockRing2.position.set(0, 1.45, 0);
    scene2Group.add(clockRing2);

    // 12 Triangular Hour Markers on ring
    const hourMarkers2 = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const marker = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.05),
        i >= 8 ? amberGlow : cyanGlow
      );
      marker.position.set(Math.cos(angle) * 1.35, Math.sin(angle) * 0.4, Math.sin(angle) * 1.1);
      hourMarkers2.add(marker);
    }
    scene2Group.add(hourMarkers2);

    // Dual Overtime Capsules (Horas Dobles & Triples)
    const capsuleDoble = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.7, 12),
      glowMat('#0284c7', 1.8)
    );
    capsuleDoble.position.set(-1.05, 1.7, 0.5);
    scene2Group.add(capsuleDoble);

    const capsuleTriple = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.9, 12),
      amberGlow
    );
    capsuleTriple.position.set(1.05, 1.8, -0.4);
    scene2Group.add(capsuleTriple);

    // Horizontal limit laser bar (40-Hour Limit Threshold)
    const limitBar2 = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.02, 0.02),
      amberGlow
    );
    limitBar2.position.set(0, 1.95, 0.2);
    scene2Group.add(limitBar2);

    // =========================================================================
    // SCENE 3: CRYPTOGRAPHIC SHIELD & JURIDICAL VAULT (Pilar 03)
    // =========================================================================
    const scene3Group = new THREE.Group();
    scene.add(scene3Group);

    // Faceted 3D Polygonal Shield
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.3);
    shieldShape.lineTo(0.9, 0.9);
    shieldShape.lineTo(0.75, -0.4);
    shieldShape.lineTo(0, -1.2);
    shieldShape.lineTo(-0.75, -0.4);
    shieldShape.lineTo(-0.9, 0.9);
    shieldShape.closePath();

    const shieldGeo3 = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08
    });

    const shieldMesh3 = new THREE.Mesh(
      shieldGeo3,
      new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        roughness: 0.18,
        metalness: 0.85,
        flatShading: true
      })
    );
    shieldMesh3.position.set(0, 1.5, 0);
    shieldMesh3.rotation.y = -0.3;
    shieldMesh3.castShadow = true;
    scene3Group.add(shieldMesh3);

    // Cryptographic concentric key rings
    const keyRingInner = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.03, 6, 24),
      cyanGlow
    );
    keyRingInner.position.set(0, 1.5, 0.25);
    scene3Group.add(keyRingInner);

    const keyRingOuter = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.025, 6, 32),
      std('#f59e0b', 0.2, 0.8)
    );
    keyRingOuter.position.set(0, 1.5, 0.26);
    scene3Group.add(keyRingOuter);

    // Floating Hash nodes (orbiting tetrahedrons)
    const hashNodes = new THREE.Group();
    for (let k = 0; k < 6; k++) {
      const node = new THREE.Mesh(new THREE.TetrahedronGeometry(0.08), cyanGlow);
      const ang = (k * Math.PI * 2) / 6;
      node.position.set(Math.cos(ang) * 1.3, 1.5 + Math.sin(ang) * 0.4, Math.sin(ang) * 0.8);
      hashNodes.add(node);
    }
    scene3Group.add(hashNodes);

    // =========================================================================
    // SCENE 4: MULTI-SEDE NETWORK GRID & BLINDAJE STPS (Pilar 04)
    // =========================================================================
    const scene4Group = new THREE.Group();
    scene.add(scene4Group);

    // Headquarters Tower (Center)
    const hqTower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.65, 1.1, 6),
      alloyMat
    );
    hqTower.position.set(0, 0.8, 0);
    hqTower.castShadow = true;
    scene4Group.add(hqTower);

    // Branch 1 Tower (Left Satellite)
    const branch1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.42, 0.65, 6),
      std('#232f3e', 0.4, 0.6)
    );
    branch1.position.set(-1.25, 0.55, 0.5);
    branch1.castShadow = true;
    scene4Group.add(branch1);

    // Branch 2 Tower (Right Satellite)
    const branch2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.42, 0.55, 6),
      std('#232f3e', 0.4, 0.6)
    );
    branch2.position.set(1.2, 0.5, -0.4);
    branch2.castShadow = true;
    scene4Group.add(branch2);

    // Fiber optic data conduits (connecting branches to HQ)
    const dataConduit1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8),
      cyanGlow
    );
    dataConduit1.rotation.z = Math.PI / 3;
    dataConduit1.rotation.y = -Math.PI / 4;
    dataConduit1.position.set(-0.62, 0.68, 0.25);
    scene4Group.add(dataConduit1);

    const dataConduit2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.35, 8),
      cyanGlow
    );
    dataConduit2.rotation.z = -Math.PI / 3.4;
    dataConduit2.rotation.y = Math.PI / 3.8;
    dataConduit2.position.set(0.6, 0.65, -0.2);
    scene4Group.add(dataConduit2);

    // Floating STPS Emerald Certified Shield & Checkmark
    const stpsBadgeGroup = new THREE.Group();
    stpsBadgeGroup.position.set(0, 1.9, 0);
    scene4Group.add(stpsBadgeGroup);

    const certBadge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.1, 6),
      greenGlow
    );
    certBadge.rotation.x = Math.PI / 2;
    stpsBadgeGroup.add(certBadge);

    // Extruded 3D Checkmark on the badge
    const checkShape = new THREE.Shape();
    checkShape.moveTo(-0.2, 0.0);
    checkShape.lineTo(-0.06, -0.15);
    checkShape.lineTo(0.22, 0.18);
    checkShape.lineTo(0.16, 0.24);
    checkShape.lineTo(-0.06, -0.04);
    checkShape.lineTo(-0.14, 0.04);
    checkShape.closePath();

    const checkMesh4 = new THREE.Mesh(
      new THREE.ExtrudeGeometry(checkShape, { depth: 0.04, bevelEnabled: false }),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    checkMesh4.position.set(0, 0, 0.06);
    stpsBadgeGroup.add(checkMesh4);

    // Concentric pulse rings around badge
    const pulseRing1 = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.58, 24),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
    );
    stpsBadgeGroup.add(pulseRing1);

    // =========================================================================
    // SCENE INTERPOLATION STATE
    // =========================================================================
    const sceneGroups = [scene1Group, scene2Group, scene3Group, scene4Group];
    const opacities = [1, 0, 0, 0];

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      const asp = width / height;
      camera.left = (-span * asp) / 2;
      camera.right = (span * asp) / 2;
      camera.top = span / 2;
      camera.bottom = -span / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 5. ANIMATION LOOP (60fps natural movements)
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentTarget = activeStepRef.current;

      // Smoothly interpolate opacities & positions for transition
      for (let i = 0; i < 4; i++) {
        const target = i === currentTarget ? 1 : 0;
        opacities[i] += (target - opacities[i]) * 0.085;

        const group = sceneGroups[i];
        group.visible = opacities[i] > 0.005;
        group.position.y = (1 - opacities[i]) * -0.4;
        group.scale.setScalar(0.85 + opacities[i] * 0.15);

        // Adjust opacity on materials
        group.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = opacities[i];
          }
        });
      }

      // Natural 60fps micro-movements for each scene:
      // Scene 1: Floating polygonal head & laser sweep
      faceHead1.position.y = 1.78 + Math.sin(elapsedTime * 2.2) * 0.035;
      faceHead1.rotation.y = -0.38 + Math.sin(elapsedTime * 1.5) * 0.025;
      laserSheet1.position.y = 1.78 + Math.sin(elapsedTime * 2.0) * 0.45;

      // Scene 2: Orbital clock ring & capsules hovering
      clockRing2.rotation.z += 0.006;
      hourMarkers2.rotation.y = elapsedTime * 0.3;
      capsuleDoble.position.y = 1.7 + Math.sin(elapsedTime * 2.5) * 0.04;
      capsuleTriple.position.y = 1.8 + Math.sin(elapsedTime * 2.5 + 1.2) * 0.04;

      // Scene 3: Shield floating, concentric rings counter-rotating, hash nodes orbiting
      shieldMesh3.position.y = 1.5 + Math.sin(elapsedTime * 1.8) * 0.03;
      keyRingInner.rotation.z = elapsedTime * 0.8;
      keyRingOuter.rotation.z = -elapsedTime * 0.6;
      hashNodes.rotation.y = elapsedTime * 0.4;

      // Scene 4: Emerald badge breathing & data conduits pulsing
      stpsBadgeGroup.position.y = 1.9 + Math.sin(elapsedTime * 2.4) * 0.045;
      pulseRing1.scale.setScalar(1 + Math.sin(elapsedTime * 3) * 0.08);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'grab'
      }}
    />
  );
}
