// Ball physics for the 3D court (court3d.html): a parabolic launch solver, a floor / wall / backboard / rim collider, and make detection.
// Pure functions on plain {x, y, z} objects, so it also runs under Node for testing. Units are roughly metres, y is up.
export const RIM = { x: 0, y: 3.5, z: -6.0 };
export const RIM_R = 0.46;       // inside radius of the hoop
export const BALL_R = 0.22;
export const GRAV = -18;         // a bit stronger than real gravity so shots feel snappy
export const BOARD = { z: -6.7, hw: 1.6, y0: 2.95, y1: 4.95, t: 0.06 };
export const BOUNDS = { x: 13.2, zBack: -8.2, zFront: 11 };

const TUBE = 0.035, RIM_PTS = 20;
const rimPts = Array.from({ length: RIM_PTS }, (_, i) => { const a = (i / RIM_PTS) * Math.PI * 2; return { x: RIM.x + Math.cos(a) * (RIM_R + TUBE), y: RIM.y, z: RIM.z + Math.sin(a) * (RIM_R + TUBE) }; });

// velocity that carries a ball from p0 to target along a parabola whose top is `apexAbove` above the higher of the two
export function solveLaunch(p0, target, apexAbove) {
  const g = -GRAV, top = Math.max(p0.y, target.y) + apexAbove;
  const vy = Math.sqrt(2 * g * (top - p0.y)), t1 = vy / g, t2 = Math.sqrt(2 * (top - target.y) / g), T = t1 + t2;
  return { vx: (target.x - p0.x) / T, vy, vz: (target.z - p0.z) / T, T };
}

export function newBall(x = 0, y = BALL_R, z = 0) {
  return { x, y, z, vx: 0, vy: 0, vz: 0, scored: false, netT: 0, floorHits: 0, rimHits: 0, boardHits: 0, airT: 0, sinceRelease: 0 };
}

// advance a ball by dt seconds; ev = { floor(speed), rim(speed), board(speed), wall(speed), score() } are optional callbacks
export function stepBall(b, dt, ev = {}) {
  const n = Math.max(1, Math.ceil(dt / 0.004)), h = dt / n;
  for (let i = 0; i < n; i++) {
    const py = b.y;
    b.vy += GRAV * h; b.x += b.vx * h; b.y += b.vy * h; b.z += b.vz * h; b.sinceRelease += h;
    // backboard (a thin rectangle facing +z)
    if (b.vz < 0 && Math.abs(b.x) < BOARD.hw + BALL_R * 0.5 && b.y > BOARD.y0 - BALL_R * 0.5 && b.y < BOARD.y1 + BALL_R * 0.5 &&
        b.z - BALL_R < BOARD.z + BOARD.t && b.z > BOARD.z - BOARD.t - 0.1) {
      const sp = Math.hypot(b.vx, b.vy, b.vz);
      b.z = BOARD.z + BOARD.t + BALL_R; b.vz = -b.vz * 0.6; b.vx *= 0.88; b.vy *= 0.88; b.boardHits++; ev.board && ev.board(sp);
    }
    // rim
    for (const p of rimPts) {
      const dx = b.x - p.x, dy = b.y - p.y, dz = b.z - p.z, d = Math.hypot(dx, dy, dz), min = BALL_R + TUBE;
      if (d < min && d > 1e-6) {
        const nx = dx / d, ny = dy / d, nz = dz / d, vn = b.vx * nx + b.vy * ny + b.vz * nz;
        b.x = p.x + nx * min; b.y = p.y + ny * min; b.z = p.z + nz * min;
        if (vn < 0) { const e = 0.58; b.vx -= (1 + e) * vn * nx; b.vy -= (1 + e) * vn * ny; b.vz -= (1 + e) * vn * nz; b.rimHits++; ev.rim && ev.rim(Math.abs(vn)); }
      }
    }
    // through the hoop, from above
    if (!b.scored && py > RIM.y && b.y <= RIM.y && b.vy < 0 && Math.hypot(b.x - RIM.x, b.z - RIM.z) < RIM_R - 0.06) {
      b.scored = true; b.netT = 0.5; b.vx *= 0.35; b.vz *= 0.35; b.vy *= 0.72; ev.score && ev.score();
    }
    if (b.netT > 0) { b.netT -= h; b.vx *= 0.995; b.vz *= 0.995; }
    // floor
    if (b.y < BALL_R && b.vy < 0) {
      const sp = -b.vy; b.y = BALL_R; b.vy = -b.vy * 0.72; b.vx *= 0.93; b.vz *= 0.93; b.floorHits++;
      if (b.vy < 1.2) b.vy = 0;
      ev.floor && ev.floor(sp);
    }
    if (b.y <= BALL_R + 0.001 && b.vy === 0) { const f = Math.pow(0.55, h); b.vx *= f; b.vz *= f; }   // rolling friction
    // walls
    if (Math.abs(b.x) > BOUNDS.x) { b.x = Math.sign(b.x) * BOUNDS.x; b.vx = -b.vx * 0.55; ev.wall && ev.wall(Math.abs(b.vx)); }
    if (b.z < BOUNDS.zBack) { b.z = BOUNDS.zBack; b.vz = -b.vz * 0.55; }
    if (b.z > BOUNDS.zFront) { b.z = BOUNDS.zFront; b.vz = -b.vz * 0.55; }
  }
}

// aim for a shot: `miss` (0 = dead centre) is how far off the rim centre to aim, in metres, in the direction `ang`
export function aimShot(p0, miss = 0, ang = 0) {
  const dist = Math.hypot(p0.x - RIM.x, p0.z - RIM.z);
  const target = { x: RIM.x + Math.cos(ang) * miss, y: RIM.y, z: RIM.z + Math.sin(ang) * miss };
  return solveLaunch(p0, target, 1.15 + 0.1 * dist);
}
