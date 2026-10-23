/*
 * Original low-poly biometric head. No dependencies.
 * Local axes: Y up, face points toward +Z.
 * 290 shared vertices / 576 outward-facing triangles.
 */
function makeFaceGeometryData() {
  // Each band is [height, half-width, back-depth, front-profile].
  // Profiles run from the facial midline to the temple. Their deliberate
  // changes describe the chin, lips, nose, sockets, brows and forehead.
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
    // Front: left temple through the nose to the right temple (13 points).
    for (let j = 6; j >= 0; --j) push(-halfFrontX[j] * width, y, profile[j]);
    for (let j = 1; j <= 6; ++j) push( halfFrontX[j] * width, y, profile[j]);
    // Back: five segments complete a closed, approximately oval cranium.
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
      // Mirror the diagonal across the midline, then alternate by row.
      // This gives clean, balanced triangular facets without a visual spiral.
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
