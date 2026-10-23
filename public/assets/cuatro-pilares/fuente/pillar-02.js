/* Pillar 02 — configurable weekly threshold and illustrative overtime. */
function buildPillar(ctx) {
  const T = ctx.T || ctx.THREE;
  const { root, mat, glow, mesh, box, bevel, line, tube, ring, disc, label,
    makeBase, contactShadow, clamp, smooth, pal } = ctx;

  const metal = mat(pal.graphite, 0.34, 0.68);
  const deepMetal = mat('#0b1119', 0.47, 0.52);
  const brushed = mat('#34434f', 0.31, 0.72);
  const edgeMetal = mat(pal.alloy, 0.28, 0.74);
  const darkGlass = mat('#07131b', 0.21, 0.30);
  const tickMaterial = mat('#72808c', 0.42, 0.40);
  const minorTickMaterial = mat('#3b4d5a', 0.44, 0.42);
  const cyanGlow = glow(pal.cyan, 1.25);
  const greenGlow = glow(pal.green, 1.10);
  const amberGlow = glow(pal.amber, 1.0);

  makeBase(4.25, 3.2, 0.28);
  contactShadow(-0.78, -0.36, 1.25, 0.82, 0.62);
  contactShadow(0.62, 0.72, 0.86, 0.86, 0.55);
  contactShadow(1.48, 0.20, 0.90, 0.90, 0.55);

  // A precise extruded gear silhouette, with an actual central opening.
  function gear(radius, teeth, thickness, material, parent) {
    const shape = new T.Shape();
    for (let i = 0; i < teeth * 4; i++) {
      const a = i * Math.PI * 2 / (teeth * 4);
      const r = radius * ((i % 4 === 1 || i % 4 === 2) ? 1 : 0.91);
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    shape.closePath();
    const hole = new T.Path();
    hole.absarc(0, 0, radius * 0.26, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = new T.ExtrudeGeometry(shape, {
      depth: thickness, bevelEnabled: true,
      bevelSegments: 1, steps: 1, bevelSize: 0.006, bevelThickness: 0.006,
      curveSegments: 32
    });
    g.translate(0, 0, -thickness / 2);
    return mesh(g, material, parent);
  }

  function faceDisc(radius, thickness, material, parent, z) {
    const d = disc(radius, thickness, material, parent, 64);
    d.rotation.x = Math.PI / 2;
    d.position.z = z;
    return d;
  }

  // Low mechanical pedestal leaves the large dial visually suspended.
  const foot = disc(0.47, 0.11, metal, root, 12);
  foot.position.set(-0.78, 0.33, -0.36);
  const footInset = disc(0.38, 0.032, brushed, root, 12);
  footInset.position.set(-0.78, 0.398, -0.36);
  const stem = bevel(0.30, 0.53, 0.25, 0.045, 0.016, metal);
  stem.position.set(-0.78, 0.64, -0.40);
  const stemStrip = box(0.035, 0.31, 0.012, cyanGlow);
  stemStrip.position.set(-0.78, 0.62, -0.265);

  const dial = new T.Group();
  dial.position.set(-0.78, 1.84, -0.36);
  dial.rotation.y = -0.25;
  root.add(dial);

  const mainGear = gear(1.115, 24, 0.10, brushed, dial);
  mainGear.position.z = -0.14;
  faceDisc(1.047, 0.22, metal, dial, -0.02);
  faceDisc(0.989, 0.025, edgeMetal, dial, 0.102);
  faceDisc(0.965, 0.025, darkGlass, dial, 0.119);
  const rim = ring(1.005, 0.019, brushed, dial);
  rim.position.z = 0.139;
  const innerRim = ring(0.655, 0.008, brushed, dial);
  innerRim.position.z = 0.139;

  // The dial starts at 225° and sweeps clockwise through 270°.
  const START = Math.PI * 1.25, SWEEP = Math.PI * 1.5;
  const angleAt = p => START - SWEEP * p;
  const steps = 180;
  function arcRibbon(r0, r1, material, z) {
    const p = [], indices = [];
    for (let i = 0; i <= steps; i++) {
      const a = angleAt(i / steps);
      p.push(Math.cos(a) * r0, Math.sin(a) * r0, 0);
      p.push(Math.cos(a) * r1, Math.sin(a) * r1, 0);
      if (i < steps) {
        const k = i * 2;
        indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
      }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.setIndex(indices); g.computeVertexNormals();
    const m = mesh(g, material, dial); m.position.z = z;
    m.castShadow = false;
    return m;
  }
  arcRibbon(0.828, 0.870, mat('#1c3745', 0.45, 0.30), 0.146);
  const activeArc = arcRibbon(0.831, 0.867, cyanGlow, 0.149);

  for (let i = 0; i <= 40; i++) {
    const a = angleAt(i / 40), major = i % 5 === 0;
    const tick = box(major ? 0.014 : 0.008, major ? 0.075 : 0.034, 0.006,
      i === 40 ? amberGlow : major ? tickMaterial : minorTickMaterial, dial);
    tick.position.set(Math.cos(a) * 0.924, Math.sin(a) * 0.924, 0.141);
    tick.rotation.z = a - Math.PI / 2;
    if (i === 0 || i === 40) {
      const number = label(String(i), 0.24, 0.13, {
        color: i === 40 ? pal.amber : '#92a8b8', fontSize: 400, weight: 600
      }, dial);
      number.position.set(Math.cos(a) * 0.730, Math.sin(a) * 0.730, 0.153);
    }
  }

  const pointer = new T.Group(); dial.add(pointer);
  const arrowShape = new T.Shape();
  arrowShape.moveTo(0.790, 0);
  arrowShape.lineTo(0.744, 0.025);
  arrowShape.lineTo(0.744, -0.025);
  arrowShape.closePath();
  const arrow = mesh(new T.ShapeGeometry(arrowShape), cyanGlow, pointer);
  arrow.position.z = 0.154; arrow.castShadow = false;
  const marker = mesh(new T.SphereGeometry(0.030, 12, 8), cyanGlow, pointer);
  marker.position.set(0.849, 0, 0.162); marker.castShadow = false;

  const header = label('JORNADA', 0.90, 0.13, {
    color: '#7e9aab', fontSize: 110, weight: 500
  }, dial);
  header.position.set(0, 0.36, 0.16);
  const hoursLabel = label('0 h', 1.20, 0.48, {
    color: '#e8f6fb', fontSize: 300, weight: 600
  }, dial);
  hoursLabel.position.set(0, 0.045, 0.16);
  const limitLabel = label('LÍMITE CONFIGURADO', 1.30, 0.105, {
    color: '#8fa4b3', fontSize: 54, weight: 500
  }, dial);
  limitLabel.position.set(0, -0.285, 0.16);
  const limitBar = box(0.28, 0.012, 0.008, amberGlow, dial);
  limitBar.position.set(0, -0.427, 0.154);

  // A pair of small floor gears reinforce the mechanical character.
  const gearA = gear(0.26, 12, 0.065, brushed, root);
  gearA.rotation.x = -Math.PI / 2;
  gearA.position.set(-1.37, 0.305, 0.77);
  const gearB = gear(0.18, 10, 0.052, edgeMetal, root);
  gearB.rotation.x = -Math.PI / 2;
  gearB.position.set(-1.03, 0.308, 1.02);
  const gearHub = disc(0.058, 0.07, cyanGlow, root, 12);
  gearHub.position.set(-1.37, 0.343, 0.77);

  function overtimeColumn(x, z, height, color, text) {
    const group = new T.Group(); group.position.set(x, 0, z); root.add(group);
    const foot = disc(0.367, 0.10, metal, group, 12);
    foot.position.y = 0.32;
    const collar = disc(0.315, 0.085, brushed, group, 24);
    collar.position.y = 0.406;
    const luminousRing = ring(0.282, 0.013, glow(color, 1.1), group);
    luminousRing.rotation.x = -Math.PI / 2;
    luminousRing.position.y = 0.454;
    const bottom = 0.474, radius = 0.267;
    const glassMaterial = mat('#173240', 0.18, 0.18);
    glassMaterial.transparent = true;
    glassMaterial.opacity = 0.19;
    glassMaterial.depthWrite = false;
    glassMaterial.side = T.DoubleSide;
    const glass = mesh(new T.CylinderGeometry(radius, radius, height, 48, 1, true), glassMaterial, group);
    glass.position.y = bottom + height / 2;
    glass.castShadow = false;
    glass.renderOrder = 3;

    // Narrow metal ribs behind the glass give the canisters genuine depth.
    for (const a of [Math.PI / 6, Math.PI * 5 / 6, Math.PI * 3 / 2]) {
      const rib = box(0.018, height + 0.025, 0.018, brushed, group);
      rib.position.set(Math.cos(a) * 0.277, bottom + height / 2, Math.sin(a) * 0.277);
    }
    for (let i = 1; i <= 4; i++) {
      const band = ring(radius + 0.003, 0.0045, mat('#435b69', 0.42, 0.45), group);
      band.rotation.x = -Math.PI / 2;
      band.position.y = bottom + height * i / 4;
    }
    const topRim = ring(0.282, 0.021, edgeMetal, group);
    topRim.rotation.x = -Math.PI / 2;
    topRim.position.y = bottom + height;
    const lip = ring(0.254, 0.006, glow(color, 0.8), group);
    lip.rotation.x = -Math.PI / 2;
    lip.position.y = bottom + height + 0.004;

    const liquidMaterial = mat(color, 0.24, 0.26);
    liquidMaterial.transparent = true;
    liquidMaterial.opacity = 0.76;
    liquidMaterial.emissive = new T.Color(color);
    liquidMaterial.emissiveIntensity = 0.24;
    const liquid = mesh(new T.CylinderGeometry(0.239, 0.239, 1, 48), liquidMaterial, group);
    liquid.castShadow = false;
    liquid.renderOrder = 1;
    const surface = disc(0.239, 0.013, glow(color, 0.65), group, 48);
    surface.castShadow = false;
    surface.renderOrder = 2;

    // Front-facing nameplate, in front of the glass rather than on its rim.
    const nameplate = new T.Group(); group.add(nameplate);
    nameplate.position.set(-0.28, bottom + height * 0.55, 0.35);
    nameplate.lookAt(new T.Vector3(-8, 7.73, 8));
    const plaque = bevel(0.83, 0.255, 0.040, 0.035, 0.008, metal, nameplate);
    plaque.castShadow = false;
    const title = label(text, 0.755, 0.19, {
      color: '#dfedf3', fontSize: 180, weight: 600, background: pal.graphite
    }, nameplate);
    title.position.z = 0.032;
    const titleAccent = box(0.34, 0.009, 0.006, glow(color, 0.85), nameplate);
    titleAccent.position.set(0, -0.107, 0.033);

    // A tiny front scale remains quiet while the liquid does the explaining.
    for (let i = 1; i <= 5; i++) {
      const tick = box(i % 2 ? 0.042 : 0.067, 0.008, 0.008, tickMaterial, group);
      tick.position.set(-0.07, bottom + height * i / 6, 0.271);
    }
    return { group, liquid, surface, bottom, height, maxFill: 0.80,
      setLevel(level) {
        const h = Math.max(0.004, height * this.maxFill * level);
        liquid.scale.y = h;
        liquid.position.y = bottom + h / 2;
        surface.position.y = bottom + h + 0.002;
        liquid.visible = surface.visible = level > 0.002;
      }
    };
  }

  const doubleColumn = overtimeColumn(0.62, 0.72, 1.17, pal.cyan, 'EXTRA 2×');
  const tripleColumn = overtimeColumn(1.48, 0.20, 1.63, pal.green, 'EXTRA 3×');
  tripleColumn.maxFill = 0.70;

  const routeA = [[-0.78, 0.267, 0.08], [-0.78, 0.267, 0.43], [-0.23, 0.267, 0.72], [0.62, 0.267, 0.72]];
  const routeB = [[-0.42, 0.268, -0.36], [0.38, 0.268, -0.36], [1.48, 0.268, -0.12], [1.48, 0.268, 0.20]];
  line(routeA, pal.cyan, 0.25);
  line(routeB, pal.green, 0.21);

  function traveler(route, color) {
    const dot = mesh(new T.SphereGeometry(0.030, 10, 6), glow(color, 1.1));
    dot.castShadow = false;
    const lengths = [], total = route.slice(1).reduce((sum, b, i) => {
      const a = route[i], length = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      lengths.push(length); return sum + length;
    }, 0);
    return { dot, set(p, visible) {
      dot.visible = visible;
      let d = clamp(p) * total;
      for (let i = 0; i < lengths.length; i++) {
        if (d <= lengths[i] || i === lengths.length - 1) {
          const a = route[i], b = route[i + 1], f = clamp(d / lengths[i]);
          dot.position.set(a[0] + (b[0] - a[0]) * f, a[1] + 0.027, a[2] + (b[2] - a[2]) * f);
          break;
        }
        d -= lengths[i];
      }
    } };
  }
  const pulseA = traveler(routeA, pal.cyan);
  const pulseB = traveler(routeB, pal.green);
  let lastHours = -1;

  function update(time) {
    const t = ((time % 8) + 8) % 8;
    const phase = t * Math.PI / 4;
    const reset = 1 - smooth(6.55, 7.88, t);
    const hoursProgress = smooth(0.30, 3.65, t) * reset;
    const doubleProgress = smooth(3.65, 5.15, t) * reset;
    const tripleProgress = smooth(4.25, 5.75, t) * reset;
    activeArc.geometry.setDrawRange(0, Math.round(hoursProgress * steps) * 6);
    pointer.rotation.z = angleAt(hoursProgress);
    marker.scale.setScalar(1 + 0.08 * Math.sin(phase));
    const hours = Math.round(40 * hoursProgress);
    if (hours !== lastHours) {
      hoursLabel.userData.setText(hours + ' h');
      lastHours = hours;
    }
    mainGear.rotation.z = 0.024 * Math.sin(phase);
    gearA.rotation.z = 0.10 * Math.sin(phase);
    gearB.rotation.z = -0.14 * Math.sin(phase);
    doubleColumn.setLevel(doubleProgress);
    tripleColumn.setLevel(tripleProgress);
    pulseA.set(smooth(3.20, 3.90, t), t > 3.20 && t < 3.90);
    pulseB.set(smooth(3.80, 4.50, t), t > 3.80 && t < 4.50);
  }

  update(0);
  return { update, span: 6.2, targetY: 1.2, posterTime: 5.1, title: 'Jornada y horas extra' };
}
