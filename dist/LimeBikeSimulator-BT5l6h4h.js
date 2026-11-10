import { jsx as w, jsxs as T, Fragment as se } from "react/jsx-runtime";
import { useMemo as Jt, useState as ft, useEffect as Mt, useRef as bt, useCallback as Qt, forwardRef as ir, useImperativeHandle as nr, useId as or } from "react";
import P from "./LimeBikeSimulator.module-CqlyXLKh.js";
const So = "autumn 2026", Wt = {
  unlock: 1,
  perMinute: 0.33,
  /** LimePass: 400 minutes for £36.99, valid 30 days, no unlock fee. */
  pass: { minutes: 400, price: 36.99, perMinute: 36.99 / 400 },
  /** LimePrime: £6.99 a month, then flat fares with unlocks included. */
  prime: { monthly: 6.99, shortMinutes: 5, shortFare: 1, capMinutes: 20, fare: 1.7 }
};
function Ci(a) {
  return Math.max(1, Math.ceil(a / 60 - 1e-6));
}
function ae(a, h, r) {
  const c = Ci(h);
  switch (a) {
    case "payg":
      return r.unlockFee + c * r.perMinuteRate;
    case "pass":
      return c * Wt.pass.perMinute;
    case "prime": {
      if (c <= Wt.prime.shortMinutes) return Wt.prime.shortFare;
      const u = Math.max(0, c - Wt.prime.capMinutes);
      return Wt.prime.fare + u * r.perMinuteRate;
    }
  }
}
const Je = {
  payg: { name: "Pay as you go", detail: "Unlock fee, then every started minute" },
  pass: { name: "LimePass", detail: "400 prepaid minutes for £36.99" },
  prime: { name: "LimePrime", detail: "£6.99 a month, £1.70 a ride up to 20 min" }
};
function sr(a) {
  return [
    {
      id: "lime-pass",
      name: "Lime with LimePass",
      basis: "9p a minute, prepaid",
      model: "time",
      fare: (h) => ae("pass", h, a)
    },
    {
      id: "lime-prime",
      name: "Lime with LimePrime",
      basis: "Flat £1.70 up to 20 min",
      model: "flat",
      fare: (h) => ae("prime", h, a)
    },
    {
      id: "voi",
      name: "Voi e-bike",
      basis: "27p a minute, no unlock fee",
      model: "time",
      fare: (h) => Ci(h) * 0.27
    },
    {
      id: "bolt-mile",
      name: "Bolt e-bike, by distance",
      basis: "£1 + 43p a mile",
      model: "distance",
      fare: (h, r) => 1 + r / 1609.344 * 0.43
    },
    {
      id: "santander",
      name: "Santander Cycles e-bike",
      basis: "£3 per 30 minutes",
      model: "flat",
      fare: (h) => 3 * Math.max(1, Math.ceil(h / 1800 - 1e-6))
    }
  ];
}
function Nt(a) {
  return `£${a.toFixed(2)}`;
}
function me(a) {
  const h = Math.round(a * 100);
  return Math.abs(h) < 100 ? `${h}p` : Nt(a);
}
function Co(a) {
  let h = a >>> 0;
  return () => {
    h = h + 1831565813 >>> 0;
    let r = h;
    return r = Math.imul(r ^ r >>> 15, r | 1), r ^= r + Math.imul(r ^ r >>> 7, r | 61), ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}
function Ei(...a) {
  let h = 2166136261;
  for (const r of a)
    h ^= r | 0, h = Math.imul(h, 16777619), h ^= h >>> 13, h = Math.imul(h, 1540483477), h ^= h >>> 15;
  return h >>> 0;
}
function mo() {
  return Math.random() * 4294967295 >>> 0;
}
const re = {
  // cruise in m/s; accel and brake in m/s²; reaction = seconds to move off on green
  relaxed: { label: "Relaxed", cruise: 17 / 3.6, accel: 0.8, brake: 1.3, reaction: 1.6 },
  typical: { label: "Typical", cruise: 21 / 3.6, accel: 1, brake: 1.5, reaction: 1.2 },
  fast: { label: "Flat out", cruise: 25 / 3.6, accel: 1.3, brake: 1.8, reaction: 0.9 }
}, pa = {
  MAX_SPEED_MPH: 15.5,
  MAX_SPEED_KMH: 25,
  MAX_SPEED_MS: 25 / 3.6,
  CRUISE_SPEED_MS: re.typical.cruise,
  ACCELERATION_RATE: re.typical.accel,
  DECELERATION_RATE: re.typical.brake
}, rr = 6371e3, Ht = (a) => a * Math.PI / 180;
function ar(a, h, r, c) {
  const u = Ht(r - a), f = Ht(c - h), m = Math.sin(u / 2) ** 2 + Math.cos(Ht(a)) * Math.cos(Ht(r)) * Math.sin(f / 2) ** 2;
  return 2 * rr * Math.atan2(Math.sqrt(m), Math.sqrt(1 - m));
}
function zi(a, h, r, c) {
  const u = Math.sin(Ht(c - h)) * Math.cos(Ht(r)), f = Math.cos(Ht(a)) * Math.sin(Ht(r)) - Math.sin(Ht(a)) * Math.cos(Ht(r)) * Math.cos(Ht(c - h));
  return (Math.atan2(u, f) * 180 / Math.PI + 360) % 360;
}
function Eo(a, h) {
  const r = Math.abs(a - h) % 360;
  return r > 180 ? 360 - r : r;
}
function zo(a) {
  const h = new Float64Array(a.length);
  for (let r = 1; r < a.length; r++)
    h[r] = h[r - 1] + ar(a[r - 1][1], a[r - 1][0], a[r][1], a[r][0]);
  return h;
}
function Oo(a, h) {
  let r = 0, c = a.length - 1;
  for (; c - r > 1; ) {
    const u = r + c >> 1;
    a[u] <= h ? r = u : c = u;
  }
  return r;
}
function Qe(a, h, r) {
  if (a.length === 0) return { lat: 0, lng: 0, bearing: 0 };
  if (a.length === 1) return { lat: a[0][1], lng: a[0][0], bearing: 0 };
  const c = Math.max(0, Math.min(r, h[h.length - 1])), u = Oo(h, c), f = h[u + 1] - h[u], m = f > 0 ? (c - h[u]) / f : 0, [v, p] = a[u], [g, y] = a[u + 1];
  return {
    lat: p + (y - p) * m,
    lng: v + (g - v) * m,
    bearing: zi(p, v, y, g)
  };
}
function hr(a, h, r, c, u, f = 0, m = r.length - 1) {
  const v = Math.cos(Ht(a)) * 111320, p = 110540, g = [];
  let y = null;
  for (let x = f; x < m; x++) {
    const S = (r[x][0] - h) * v, q = (r[x][1] - a) * p, O = (r[x + 1][0] - h) * v, M = (r[x + 1][1] - a) * p, A = O - S, B = M - q, X = A * A + B * B, U = X > 0 ? Math.max(0, Math.min(1, -(S * A + q * B) / X)) : 0, C = Math.hypot(S + A * U, q + B * U);
    if (C <= u) {
      const H = c[x] + (c[x + 1] - c[x]) * U, st = {
        offset: C,
        along: H,
        bearing: zi(r[x][1], r[x][0], r[x + 1][1], r[x + 1][0])
      };
      y && H - y.along < 60 ? C < y.offset && (y = st) : (y && g.push(y), y = st);
    }
  }
  return y && g.push(y), g;
}
function lr(a, h, r) {
  let c = !1;
  for (let u = 0, f = r.length - 1; u < r.length; f = u++) {
    const [m, v] = r[u], [p, g] = r[f];
    v > h != g > h && a < (p - m) * (h - v) / (g - v) + m && (c = !c);
  }
  return c;
}
function _o(a) {
  if (a.length === 0) return null;
  let h = 1 / 0, r = -1 / 0, c = 1 / 0, u = -1 / 0;
  for (const [f, m] of a)
    m < h && (h = m), m > r && (r = m), f < c && (c = f), f > u && (u = f);
  return [
    [h, c],
    [r, u]
  ];
}
const po = 3, go = 2, ur = {
  quiet: [56, 64, 72, 80],
  typical: [64, 72, 80, 88, 96],
  rush: [80, 88, 96, 104, 112, 120]
}, vo = 0.3, cr = 0.55, dr = {
  quiet: [150, 240],
  typical: [70, 110],
  rush: [45, 75]
}, ln = [16, 24], fr = { quiet: 0, typical: 1, rush: 2 };
function mr(a, h) {
  const r = Co(Ei(a.id, fr[h]));
  if (a.kind === "junction") {
    const v = ur[h], p = v[Math.floor(r() * v.length)], g = vo + (cr - vo) * r();
    return { cycle: p, green: Math.round(p * g), amber: po, redAmber: go };
  }
  const [c, u] = dr[h], f = Math.round(c + (u - c) * r()), m = ln[0] + (ln[1] - ln[0]) * r();
  return { cycle: f, green: Math.round(f - m), amber: po, redAmber: go };
}
function mn(a, h, r) {
  const c = ((h + r) % a.cycle + a.cycle) % a.cycle;
  return c < a.green ? "green" : c < a.green + a.amber ? "amber" : c < a.cycle - a.redAmber ? "red" : "redAmber";
}
const Ze = 2, Le = 0.2, _r = 1.4, pr = 2.2, Ti = 3, gr = 1, yo = 0.4;
function vr(a) {
  return a <= 15 ? 1 : a <= 45 ? 1 - (a - 15) / 30 * 0.28 : a <= 90 ? 0.72 - (a - 45) / 45 * 0.27 : Math.max(0.3, 0.45 - (a - 90) / 60 * 0.15);
}
function yr(a, h) {
  const r = re[h], c = Math.max(2, Math.ceil(a.distance / Ze) + 1), u = new Float32Array(c).fill(r.cruise), f = new Array(c);
  for (let g = 0; g < c; g++)
    f[g] = Qe(a.coordinates, a.cum, Math.min(g * Ze, a.distance));
  for (let g = Ti; g < c - Ti; g++) {
    const y = f[g - Ti], x = f[g], S = f[g + Ti], q = Eo(zi(y.lat, y.lng, x.lat, x.lng), zi(x.lat, x.lng, S.lat, S.lng)), O = Math.max(pr, r.cruise * vr(q));
    O < u[g] && (u[g] = O);
  }
  for (const g of a.steps) {
    if (!g.walk) continue;
    const y = Math.max(0, Math.floor(g.from / Ze)), x = Math.min(c - 1, Math.ceil(g.to / Ze));
    for (let S = y; S <= x; S++) u[S] = Math.min(u[S], _r);
  }
  u[c - 1] = 0;
  for (let g = c - 2; g >= 0; g--) {
    const y = Math.sqrt(u[g + 1] ** 2 + 2 * r.brake * Ze);
    y < u[g] && (u[g] = y);
  }
  const m = a.signals.map((g, y) => {
    const x = a.signals[y + 1];
    return x ? (g.distance + x.distance) / 2 : a.distance;
  }), v = {
    plan: a,
    pace: h,
    limit: u,
    checkpoints: m,
    freeFlow: { duration: 0, checkpointTimes: [] }
  }, p = Ao(v, null, null, !0);
  return v.freeFlow = {
    duration: p.duration,
    checkpointTimes: p.checkpointTimes,
    samples: p.samples
  }, v;
}
function Ao(a, h, r, c) {
  const { plan: u, limit: f, checkpoints: m } = a, v = re[a.pace], p = u.distance, g = h ? u.signals : [], y = v.brake * 1.6, x = [], S = [], q = [], O = [], M = [];
  let A = 0, B = 0, X = 0, U = 0, C = 0, H = !1, st = !1, lt = -1, E = -1;
  const W = 6 * 3600;
  for (; B < p - 0.05 && A < W; ) {
    c && (x.push(A), S.push(B), q.push(X));
    const D = Math.min(f.length - 2, Math.floor(B / Ze));
    let K = Math.min(f[D], f[D + 1], X + v.accel * Le);
    K < yo && (K = yo);
    let rt = !1;
    if (U < g.length) {
      const dt = g[U].distance - gr - B, I = mn(h[U], A, r[U]);
      if (I === "green") {
        if (st = !1, H = !1, lt >= 0) {
          E < 0 && (E = A);
          const Tt = E - lt < 1.5;
          Tt || A - E >= v.reaction ? (Tt || O.push({ signal: U, at: lt, wait: A - lt }), lt = -1, E = -1) : rt = !0;
        }
      } else
        E = -1, I === "amber" && !st && (st = !0, H = dt < X * X / (2 * y) + X * 0.5), (!H || I !== "amber") && (lt >= 0 || dt <= 0.05 || X < 0.3 && dt < 0.6 ? (lt < 0 && (lt = A), rt = !0) : K = Math.min(K, Math.max(0.3, Math.sqrt(2 * v.brake * dt))));
    }
    const ut = rt ? 0 : K, te = (X + ut) / 2 * Le, mt = B;
    for (B = Math.min(p, B + te), X = ut, A += Le; C < m.length && B >= m[C] - 1e-6; ) {
      const dt = B - mt, I = dt > 0 ? (m[C] - mt) / dt : 1;
      M[C++] = A - Le + Le * Math.min(1, Math.max(0, I));
    }
    U < g.length && B >= g[U].distance && (U++, H = !1, st = !1);
  }
  for (; C < m.length; ) M[C++] = A;
  const tt = { duration: A, stops: O, checkpointTimes: M };
  return c && (x.push(A), S.push(p), q.push(0), tt.samples = {
    t: Float32Array.from(x),
    s: Float32Array.from(S),
    v: Float32Array.from(q)
  }), tt;
}
function Io(a, h, r, c = !0) {
  const u = No(a, h), f = Co(r), m = u.map((y) => f() * y.cycle), v = Ao(a, u, m, c), p = [];
  let g = 0;
  for (let y = 0; y < u.length; y++) {
    const x = v.checkpointTimes[y] - a.freeFlow.checkpointTimes[y];
    p.push(x - g), g = x;
  }
  return {
    seed: r,
    duration: v.duration,
    delay: Math.max(0, v.duration - a.freeFlow.duration),
    waiting: v.stops.reduce((y, x) => y + x.wait, 0),
    stops: v.stops,
    signalDelay: p,
    offsets: m,
    samples: v.samples
  };
}
const wo = /* @__PURE__ */ new WeakMap();
function No(a, h) {
  let r = wo.get(a);
  return r || wo.set(a, r = {}), r[h] ??= a.plan.signals.map((c) => mr(c, h));
}
function Mi(a, h) {
  const r = a.samples;
  if (!r || r.t.length === 0) return { distance: 0, speed: 0 };
  const c = r.t.length - 1;
  if (h <= 0) return { distance: r.s[0], speed: r.v[0] };
  if (h >= r.t[c]) return { distance: r.s[c], speed: 0 };
  const u = Math.min(c - 1, Math.floor(h / Le)), f = (h - r.t[u]) / (r.t[u + 1] - r.t[u] || Le);
  return {
    distance: r.s[u] + (r.s[u + 1] - r.s[u]) * f,
    speed: r.v[u] + (r.v[u + 1] - r.v[u]) * f
  };
}
function xo(a, h) {
  const r = a.samples;
  if (!r) return 0;
  let c = 0, u = r.s.length - 1;
  for (; u - c > 1; ) {
    const m = c + u >> 1;
    r.s[m] < h ? c = m : u = m;
  }
  const f = r.s[u] - r.s[c];
  return r.t[c] + (f > 0 ? (h - r.s[c]) / f * (r.t[u] - r.t[c]) : 0);
}
const wr = 400;
function xr(a, h, r, c, u = wr) {
  const f = ae(r, a.freeFlow.duration, c), m = Ei(Math.round(a.plan.distance), a.plan.signals.length, 7919), v = [];
  let p = 0, g = 0, y = 0, x = 0;
  for (let O = 0; O < u; O++) {
    const M = Io(a, h, Ei(m, O), !1), A = ae(r, M.duration, c);
    v.push(M.delay), p += M.stops.length, g += M.duration, y += A, A > f + 1e-9 && x++;
  }
  v.sort((O, M) => O - M);
  const S = (O) => v[Math.min(u - 1, Math.floor(O * u))], q = y / u;
  return {
    rides: u,
    freeFlow: a.freeFlow.duration,
    delays: v,
    meanDelay: v.reduce((O, M) => O + M, 0) / u,
    medianDelay: S(0.5),
    lowDelay: S(0.1),
    highDelay: S(0.9),
    meanStops: p / u,
    meanDuration: g / u,
    meanFare: q,
    freeFlowFare: f,
    meanExtra: q - f,
    chanceOfExtra: x / u
  };
}
function br(a, h) {
  let r = 0, c = a.delays.length;
  for (; r < c; ) {
    const u = r + c >> 1;
    a.delays[u] < h ? r = u + 1 : c = u;
  }
  return r / a.delays.length;
}
function Pr(a, h = 16) {
  const r = Math.max(30, a.delays[a.delays.length - 1] ?? 0), c = Math.max(5, Math.ceil(r / h / 5) * 5), u = new Array(Math.ceil(r / c) || 1).fill(0);
  for (const f of a.delays) u[Math.min(u.length - 1, Math.floor(f / c))]++;
  return { binSeconds: c, counts: u };
}
const Lr = "https://routing.openstreetmap.de/routed-bike/route/v1/bike", Tr = "https://router.project-osrm.org/route/v1/driving";
class ti extends Error {
}
async function bo(a, h, r, c) {
  const u = `${a}/${h.lng},${h.lat};${r.lng},${r.lat}?overview=full&geometries=geojson&steps=true`, f = AbortSignal.timeout(12e3), m = await fetch(u, { signal: c ? AbortSignal.any([c, f]) : f });
  if (!m.ok) throw new Error(`Router answered ${m.status}`);
  const v = await m.json();
  if (v.code !== "Ok" || !v.routes?.length)
    throw new ti("No cycling route found between those two places.");
  return v.routes[0];
}
async function Mr(a, h, r) {
  let c, u = !1;
  try {
    c = await bo(Lr, a, h, r);
  } catch (p) {
    if (p instanceof ti || r?.aborted) throw p;
    try {
      c = await bo(Tr, a, h, r), u = !0;
    } catch (g) {
      throw g instanceof ti || r?.aborted ? g : new ti("The routing service is not responding. Try again in a moment.");
    }
  }
  const f = c.geometry.coordinates;
  if (f.length < 2) throw new ti("Those two places are too close together.");
  const m = zo(f), v = m[m.length - 1];
  return {
    coordinates: f,
    cum: m,
    distance: v,
    steps: kr(c.legs.flatMap((p) => p.steps), v, c.distance),
    drivingFallback: u
  };
}
function kr(a, h, r) {
  const c = r > 0 ? h / r : 1, u = [];
  let f = 0;
  for (const m of a) {
    const v = m.distance * c;
    if (v <= 0) continue;
    const p = m.name || m.ref || "", g = m.mode === "pushing bike" || m.mode === "walking", y = u[u.length - 1];
    y && y.name === p && y.walk === g ? y.to = f + v : u.push({ from: f, to: f + v, name: p, walk: g }), f += v;
  }
  return u.length && (u[u.length - 1].to = h), u;
}
function Zo(a, h) {
  const r = a.findIndex((c) => h >= c.from && h < c.to);
  if (r < 0) return a[a.length - 1]?.name ?? "";
  if (a[r].name) return a[r].name;
  for (let c = 1; c < a.length; c++) {
    const u = a[r - c], f = a[r + c];
    if (f?.name && f.from - h < 80) return f.name;
    if (u?.name && h - u.to < 80) return u.name;
    if (!u && !f) break;
  }
  return "";
}
const Bo = 18, Ro = 8, Sr = 40, Cr = 80;
function Po(a, h, r, c) {
  const u = r[r.length - 1], f = [];
  for (const g of a) {
    const y = g.kind === "junction" ? Bo : Ro;
    for (const x of hr(g.lat, g.lng, h, r, y))
      g.bearing >= 0 && x.offset <= 6 && Eo(x.bearing, g.bearing) > 110 || x.along < 8 || x.along > u - 8 || f.push({ along: x.along, node: g });
  }
  f.sort((g, y) => g.along - y.along);
  const m = [];
  let v = [];
  const p = () => {
    if (!v.length) return;
    const g = v[0], y = v.some((x) => x.node.kind === "junction") ? "junction" : "crossing";
    m.push({
      id: Ei(Math.round(g.node.lat * 1e5), Math.round(g.node.lng * 1e5)),
      lat: g.node.lat,
      lng: g.node.lng,
      distance: g.along,
      kind: y,
      name: Zo(c, g.along)
    }), v = [];
  };
  for (const g of f) {
    const y = v[v.length - 1];
    y && (g.along - y.along > Sr || g.along - v[0].along > Cr) && p(), v.push(g);
  }
  return p(), m;
}
const dn = 2e-3, fn = 3e-3, Do = (a, h) => Math.floor(a / dn) * 1e5 + Math.floor((h + 180) / fn);
let Lo = null;
function Er() {
  return Lo ??= import("./london-signals-CRnibfKv.js").then((a) => {
    const h = a.default ?? a, r = [], c = /* @__PURE__ */ new Map();
    let u = h.origin[1];
    for (let f = 0; f < h.signals.length; f += 4) {
      u += h.signals[f];
      const m = {
        lat: u / 1e5,
        lng: (h.origin[0] + h.signals[f + 1]) / 1e5,
        kind: h.signals[f + 2] === 0 ? "junction" : "crossing",
        bearing: h.signals[f + 3] < 0 ? -1 : h.signals[f + 3] * 2
      }, v = Do(m.lat, m.lng), p = c.get(v);
      p ? p.push(r.length) : c.set(v, [r.length]), r.push(m);
    }
    return { generated: h.generated, polygon: h.polygon, nodes: r, grid: c };
  }), Lo;
}
function zr(a, h) {
  const r = /* @__PURE__ */ new Set(), c = (u, f) => {
    for (let m = -1; m <= 1; m++)
      for (let v = -1; v <= 1; v++) {
        const p = a.grid.get(Do(u + m * dn, f + v * fn));
        if (p) for (const g of p) r.add(g);
      }
  };
  for (let u = 0; u < h.length; u++) {
    const [f, m] = h[u];
    if (c(m, f), u > 0) {
      const [v, p] = h[u - 1], g = Math.ceil(Math.max(Math.abs(m - p) / dn, Math.abs(f - v) / fn));
      for (let y = 1; y < g; y++)
        c(p + (m - p) * y / g, v + (f - v) * y / g);
    }
  }
  return [...r].map((u) => a.nodes[u]);
}
const Or = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
];
async function Ar(a, h) {
  const r = Math.max(1, Math.ceil(a.length / 400)), c = a.filter((m, v) => v % r === 0 || v === a.length - 1).map(([m, v]) => `${v.toFixed(5)},${m.toFixed(5)}`).join(","), u = `[out:json][timeout:15];(node(around:${Bo},${c})[highway=traffic_signals];node(around:${Ro},${c})[highway=crossing][crossing=traffic_signals];);out body;`;
  let f;
  for (const m of Or)
    try {
      const v = AbortSignal.timeout(15e3), p = await fetch(m, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(u)}`,
        signal: h ? AbortSignal.any([h, v]) : v
      });
      if (!p.ok) throw new Error(`Overpass answered ${p.status}`);
      return (await p.json()).elements.map((y) => ({
        lat: y.lat,
        lng: y.lon,
        kind: y.tags?.highway === "crossing" ? "crossing" : "junction",
        bearing: -1
      }));
    } catch (v) {
      if (h?.aborted) throw v;
      f = v;
    }
  throw f ?? new Error("Overpass unavailable");
}
async function Ir(a, h, r, c) {
  const u = await Er(), f = Math.max(1, Math.floor(a.length / 40));
  if (a.every(
    ([v, p], g) => g % f !== 0 && g !== a.length - 1 || lr(v, p, u.polygon)
  ))
    return {
      signals: Po(zr(u, a), a, h, r),
      source: "bundled"
    };
  try {
    const v = await Ar(a, c);
    return { signals: Po(v, a, h, r), source: "overpass" };
  } catch (v) {
    if (c?.aborted) throw v;
    return { signals: [], source: "unavailable" };
  }
}
async function Nr(a, h, r) {
  const c = await Mr(a, h, r), u = await Ir(c.coordinates, c.cum, c.steps, r);
  return {
    coordinates: c.coordinates,
    cum: c.cum,
    distance: c.distance,
    steps: c.steps,
    signals: u.signals,
    signalSource: u.source,
    drivingFallback: c.drivingFallback
  };
}
function Zr(a) {
  const h = a.coordinates, r = zo(h), c = r[r.length - 1] ?? 0, u = a.distance > 0 ? c / a.distance : 1, f = a.trafficLights.map((m) => ({
    id: m.id,
    lat: m.lat,
    lng: m.lng,
    distance: m.distanceFromStart * u,
    kind: m.kind ?? "junction",
    name: m.name ?? ""
  })).filter((m) => m.distance > 8 && m.distance < c - 8).sort((m, v) => m.distance - v.distance);
  return {
    coordinates: h,
    cum: r,
    distance: c,
    steps: a.steps ?? [{ from: 0, to: c, name: "", walk: !1 }],
    signals: f,
    signalSource: "precomputed",
    drivingFallback: !1
  };
}
function ga(a) {
  const h = (r) => Math.round(r * 10) / 10;
  return {
    coordinates: a.coordinates,
    distance: h(a.distance),
    trafficLights: a.signals.map((r) => ({
      id: r.id,
      lat: r.lat,
      lng: r.lng,
      distanceFromStart: h(r.distance),
      kind: r.kind,
      name: r.name
    })),
    steps: a.steps.map((r) => ({ ...r, from: h(r.from), to: h(r.to) }))
  };
}
function Br(a, h, r) {
  const c = Jt(
    () => r ? Zr(r) : null,
    [r]
  ), [u, f] = ft({ plan: null, loading: !1, error: null }), m = a?.lat, v = a?.lng, p = h?.lat, g = h?.lng;
  return Mt(() => {
    if (c) return;
    if (m == null || v == null || p == null || g == null) {
      f({ plan: null, loading: !1, error: null });
      return;
    }
    const y = new AbortController();
    return f((x) => ({ plan: x.plan, loading: !0, error: null })), Nr(
      { lat: m, lng: v },
      { lat: p, lng: g },
      y.signal
    ).then(
      (x) => {
        y.signal.aborted || f({ plan: x, loading: !1, error: null });
      },
      (x) => {
        y.signal.aborted || f({
          plan: null,
          loading: !1,
          error: x instanceof Error ? x.message : "Could not load that route."
        });
      }
    ), () => y.abort();
  }, [c, m, v, p, g]), c ? { plan: c, loading: !1, error: null } : u;
}
const Rr = 80;
function Dr({ duration: a, speed: h, rideKey: r, onFrame: c }) {
  const [u, f] = ft("ready"), [m, v] = ft(0), p = bt(0), g = bt(null), y = bt(0), x = bt(0), S = bt({ duration: a, speed: h, onFrame: c });
  S.current = { duration: a, speed: h, onFrame: c };
  const q = Qt(() => {
    g.current != null && cancelAnimationFrame(g.current), g.current = null;
  }, []), O = Qt((C) => {
    p.current = C, S.current.onFrame(C), v(C);
  }, []), M = Qt(
    (C) => {
      const { duration: H, speed: st, onFrame: lt } = S.current, E = Math.min(0.1, (C - y.current) / 1e3);
      y.current = C;
      const W = Math.min(H, p.current + E * st);
      if (p.current = W, lt(W), W >= H) {
        g.current = null, v(W), f("finished");
        return;
      }
      C - x.current >= Rr && (x.current = C, v(W)), g.current = requestAnimationFrame(M);
    },
    []
  ), A = Qt(() => {
    S.current.duration <= 0 || (p.current >= S.current.duration && O(0), q(), y.current = performance.now(), f("playing"), g.current = requestAnimationFrame(M));
  }, [O, q, M]), B = Qt(() => {
    q(), v(p.current), f((C) => C === "playing" ? "paused" : C);
  }, [q]), X = Qt(
    (C) => {
      const H = S.current.duration, st = Math.max(0, Math.min(H, C));
      O(st), st >= H ? (q(), f("finished")) : f((lt) => lt === "playing" ? lt : st > 0 ? "paused" : "ready");
    },
    [O, q]
  ), U = Qt(() => X(S.current.duration), [X]);
  return Mt(() => {
    q(), f("ready"), O(0);
  }, [r, O, q]), Mt(() => q, [q]), { status: u, time: m, play: A, pause: B, seek: X, finish: U };
}
const Fo = "https://photon.komoot.io", To = { lat: 51.5074, lng: -0.1278 };
function Fr(a) {
  const h = a.properties, r = [h.housenumber, h.street].filter(Boolean).join(" "), c = h.name || r;
  if (!c) return null;
  const u = [h.name && r ? r : "", h.district || h.locality || h.city, h.postcode].filter(Boolean).join(", ");
  return { label: c, context: u, lat: a.geometry.coordinates[1], lng: a.geometry.coordinates[0] };
}
async function Hr(a, h) {
  const r = `${Fo}/api/?q=${encodeURIComponent(a)}&limit=6&lang=en&lat=${To.lat}&lon=${To.lng}`, c = await fetch(r, { signal: h });
  if (!c.ok) throw new Error(`Place search answered ${c.status}`);
  const u = await c.json(), f = /* @__PURE__ */ new Set(), m = [];
  for (const v of u.features) {
    const p = Fr(v);
    if (!p) continue;
    const g = `${p.label}|${p.context}`;
    f.has(g) || (f.add(g), m.push(p));
  }
  return m;
}
async function Wr(a, h, r) {
  try {
    const c = await fetch(`${Fo}/reverse?lat=${a}&lon=${h}&limit=1&lang=en`, { signal: r });
    if (!c.ok) return null;
    const f = (await c.json()).features[0]?.properties;
    return f && (f.name || [f.housenumber, f.street].filter(Boolean).join(" ") || f.district) || null;
  } catch {
    return null;
  }
}
const Ur = [
  {
    name: "Big Ben → Oxford Circus",
    start: { lat: 51.5007, lng: -0.1246, label: "Big Ben" },
    end: { lat: 51.5155, lng: -0.1419, label: "Oxford Circus" }
  },
  {
    name: "King's Cross → Bank",
    start: { lat: 51.5308, lng: -0.1238, label: "King's Cross" },
    end: { lat: 51.5134, lng: -0.089, label: "Bank" }
  },
  {
    name: "Brixton → Waterloo",
    start: { lat: 51.4627, lng: -0.1145, label: "Brixton" },
    end: { lat: 51.5033, lng: -0.1145, label: "Waterloo" }
  },
  {
    name: "Hackney → Shoreditch",
    start: { lat: 51.547, lng: -0.056, label: "Hackney Central" },
    end: { lat: 51.5246, lng: -0.078, label: "Shoreditch" }
  }
];
function jr(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var ei = { exports: {} };
var qr = ei.exports, Mo;
function Gr() {
  return Mo || (Mo = 1, (function(a, h) {
    (function(r, c) {
      c(h);
    })(qr, (function(r) {
      var c = "1.9.4";
      function u(t) {
        var e, i, n, o;
        for (i = 1, n = arguments.length; i < n; i++) {
          o = arguments[i];
          for (e in o)
            t[e] = o[e];
        }
        return t;
      }
      var f = Object.create || /* @__PURE__ */ (function() {
        function t() {
        }
        return function(e) {
          return t.prototype = e, new t();
        };
      })();
      function m(t, e) {
        var i = Array.prototype.slice;
        if (t.bind)
          return t.bind.apply(t, i.call(arguments, 1));
        var n = i.call(arguments, 2);
        return function() {
          return t.apply(e, n.length ? n.concat(i.call(arguments)) : arguments);
        };
      }
      var v = 0;
      function p(t) {
        return "_leaflet_id" in t || (t._leaflet_id = ++v), t._leaflet_id;
      }
      function g(t, e, i) {
        var n, o, s, l;
        return l = function() {
          n = !1, o && (s.apply(i, o), o = !1);
        }, s = function() {
          n ? o = arguments : (t.apply(i, arguments), setTimeout(l, e), n = !0);
        }, s;
      }
      function y(t, e, i) {
        var n = e[1], o = e[0], s = n - o;
        return t === n && i ? t : ((t - o) % s + s) % s + o;
      }
      function x() {
        return !1;
      }
      function S(t, e) {
        if (e === !1)
          return t;
        var i = Math.pow(10, e === void 0 ? 6 : e);
        return Math.round(t * i) / i;
      }
      function q(t) {
        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
      }
      function O(t) {
        return q(t).split(/\s+/);
      }
      function M(t, e) {
        Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? f(t.options) : {});
        for (var i in e)
          t.options[i] = e[i];
        return t.options;
      }
      function A(t, e, i) {
        var n = [];
        for (var o in t)
          n.push(encodeURIComponent(i ? o.toUpperCase() : o) + "=" + encodeURIComponent(t[o]));
        return (!e || e.indexOf("?") === -1 ? "?" : "&") + n.join("&");
      }
      var B = /\{ *([\w_ -]+) *\}/g;
      function X(t, e) {
        return t.replace(B, function(i, n) {
          var o = e[n];
          if (o === void 0)
            throw new Error("No value provided for variable " + i);
          return typeof o == "function" && (o = o(e)), o;
        });
      }
      var U = Array.isArray || function(t) {
        return Object.prototype.toString.call(t) === "[object Array]";
      };
      function C(t, e) {
        for (var i = 0; i < t.length; i++)
          if (t[i] === e)
            return i;
        return -1;
      }
      var H = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function st(t) {
        return window["webkit" + t] || window["moz" + t] || window["ms" + t];
      }
      var lt = 0;
      function E(t) {
        var e = +/* @__PURE__ */ new Date(), i = Math.max(0, 16 - (e - lt));
        return lt = e + i, window.setTimeout(t, i);
      }
      var W = window.requestAnimationFrame || st("RequestAnimationFrame") || E, tt = window.cancelAnimationFrame || st("CancelAnimationFrame") || st("CancelRequestAnimationFrame") || function(t) {
        window.clearTimeout(t);
      };
      function D(t, e, i) {
        if (i && W === E)
          t.call(e);
        else
          return W.call(window, m(t, e));
      }
      function K(t) {
        t && tt.call(window, t);
      }
      var rt = {
        __proto__: null,
        extend: u,
        create: f,
        bind: m,
        get lastId() {
          return v;
        },
        stamp: p,
        throttle: g,
        wrapNum: y,
        falseFn: x,
        formatNum: S,
        trim: q,
        splitWords: O,
        setOptions: M,
        getParamString: A,
        template: X,
        isArray: U,
        indexOf: C,
        emptyImageUrl: H,
        requestFn: W,
        cancelFn: tt,
        requestAnimFrame: D,
        cancelAnimFrame: K
      };
      function ut() {
      }
      ut.extend = function(t) {
        var e = function() {
          M(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, i = e.__super__ = this.prototype, n = f(i);
        n.constructor = e, e.prototype = n;
        for (var o in this)
          Object.prototype.hasOwnProperty.call(this, o) && o !== "prototype" && o !== "__super__" && (e[o] = this[o]);
        return t.statics && u(e, t.statics), t.includes && (te(t.includes), u.apply(null, [n].concat(t.includes))), u(n, t), delete n.statics, delete n.includes, n.options && (n.options = i.options ? f(i.options) : {}, u(n.options, t.options)), n._initHooks = [], n.callInitHooks = function() {
          if (!this._initHooksCalled) {
            i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var s = 0, l = n._initHooks.length; s < l; s++)
              n._initHooks[s].call(this);
          }
        }, e;
      }, ut.include = function(t) {
        var e = this.prototype.options;
        return u(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this;
      }, ut.mergeOptions = function(t) {
        return u(this.prototype.options, t), this;
      }, ut.addInitHook = function(t) {
        var e = Array.prototype.slice.call(arguments, 1), i = typeof t == "function" ? t : function() {
          this[t].apply(this, e);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this;
      };
      function te(t) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          t = U(t) ? t : [t];
          for (var e = 0; e < t.length; e++)
            t[e] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var mt = {
        /* @method on(type: String, fn: Function, context?: Object): this
         * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
         *
         * @alternative
         * @method on(eventMap: Object): this
         * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
         */
        on: function(t, e, i) {
          if (typeof t == "object")
            for (var n in t)
              this._on(n, t[n], e);
          else {
            t = O(t);
            for (var o = 0, s = t.length; o < s; o++)
              this._on(t[o], e, i);
          }
          return this;
        },
        /* @method off(type: String, fn?: Function, context?: Object): this
         * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
         *
         * @alternative
         * @method off(eventMap: Object): this
         * Removes a set of type/listener pairs.
         *
         * @alternative
         * @method off: this
         * Removes all listeners to all events on the object. This includes implicitly attached events.
         */
        off: function(t, e, i) {
          if (!arguments.length)
            delete this._events;
          else if (typeof t == "object")
            for (var n in t)
              this._off(n, t[n], e);
          else {
            t = O(t);
            for (var o = arguments.length === 1, s = 0, l = t.length; s < l; s++)
              o ? this._off(t[s]) : this._off(t[s], e, i);
          }
          return this;
        },
        // attach listener (without syntactic sugar now)
        _on: function(t, e, i, n) {
          if (typeof e != "function") {
            console.warn("wrong listener type: " + typeof e);
            return;
          }
          if (this._listens(t, e, i) === !1) {
            i === this && (i = void 0);
            var o = { fn: e, ctx: i };
            n && (o.once = !0), this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(o);
          }
        },
        _off: function(t, e, i) {
          var n, o, s;
          if (this._events && (n = this._events[t], !!n)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (o = 0, s = n.length; o < s; o++)
                  n[o].fn = x;
              delete this._events[t];
              return;
            }
            if (typeof e != "function") {
              console.warn("wrong listener type: " + typeof e);
              return;
            }
            var l = this._listens(t, e, i);
            if (l !== !1) {
              var d = n[l];
              this._firingCount && (d.fn = x, this._events[t] = n = n.slice()), n.splice(l, 1);
            }
          }
        },
        // @method fire(type: String, data?: Object, propagate?: Boolean): this
        // Fires an event of the specified type. You can optionally provide a data
        // object — the first argument of the listener function will contain its
        // properties. The event can optionally be propagated to event parents.
        fire: function(t, e, i) {
          if (!this.listens(t, i))
            return this;
          var n = u({}, e, {
            type: t,
            target: this,
            sourceTarget: e && e.sourceTarget || this
          });
          if (this._events) {
            var o = this._events[t];
            if (o) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var s = 0, l = o.length; s < l; s++) {
                var d = o[s], _ = d.fn;
                d.once && this.off(t, _, d.ctx), _.call(d.ctx || this, n);
              }
              this._firingCount--;
            }
          }
          return i && this._propagateEvent(n), this;
        },
        // @method listens(type: String, propagate?: Boolean): Boolean
        // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
        // Returns `true` if a particular event type has any listeners attached to it.
        // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
        listens: function(t, e, i, n) {
          typeof t != "string" && console.warn('"string" type argument expected');
          var o = e;
          typeof e != "function" && (n = !!e, o = void 0, i = void 0);
          var s = this._events && this._events[t];
          if (s && s.length && this._listens(t, o, i) !== !1)
            return !0;
          if (n) {
            for (var l in this._eventParents)
              if (this._eventParents[l].listens(t, e, i, n))
                return !0;
          }
          return !1;
        },
        // returns the index (number) or false
        _listens: function(t, e, i) {
          if (!this._events)
            return !1;
          var n = this._events[t] || [];
          if (!e)
            return !!n.length;
          i === this && (i = void 0);
          for (var o = 0, s = n.length; o < s; o++)
            if (n[o].fn === e && n[o].ctx === i)
              return o;
          return !1;
        },
        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: function(t, e, i) {
          if (typeof t == "object")
            for (var n in t)
              this._on(n, t[n], e, !0);
          else {
            t = O(t);
            for (var o = 0, s = t.length; o < s; o++)
              this._on(t[o], e, i, !0);
          }
          return this;
        },
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function(t) {
          return this._eventParents = this._eventParents || {}, this._eventParents[p(t)] = t, this;
        },
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function(t) {
          return this._eventParents && delete this._eventParents[p(t)], this;
        },
        _propagateEvent: function(t) {
          for (var e in this._eventParents)
            this._eventParents[e].fire(t.type, u({
              layer: t.target,
              propagatedFrom: t.target
            }, t), !0);
        }
      };
      mt.addEventListener = mt.on, mt.removeEventListener = mt.clearAllEventListeners = mt.off, mt.addOneTimeEventListener = mt.once, mt.fireEvent = mt.fire, mt.hasEventListeners = mt.listens;
      var dt = ut.extend(mt);
      function I(t, e, i) {
        this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e;
      }
      var Tt = Math.trunc || function(t) {
        return t > 0 ? Math.floor(t) : Math.ceil(t);
      };
      I.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new I(this.x, this.y);
        },
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function(t) {
          return this.clone()._add(N(t));
        },
        _add: function(t) {
          return this.x += t.x, this.y += t.y, this;
        },
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function(t) {
          return this.clone()._subtract(N(t));
        },
        _subtract: function(t) {
          return this.x -= t.x, this.y -= t.y, this;
        },
        // @method divideBy(num: Number): Point
        // Returns the result of division of the current point by the given number.
        divideBy: function(t) {
          return this.clone()._divideBy(t);
        },
        _divideBy: function(t) {
          return this.x /= t, this.y /= t, this;
        },
        // @method multiplyBy(num: Number): Point
        // Returns the result of multiplication of the current point by the given number.
        multiplyBy: function(t) {
          return this.clone()._multiplyBy(t);
        },
        _multiplyBy: function(t) {
          return this.x *= t, this.y *= t, this;
        },
        // @method scaleBy(scale: Point): Point
        // Multiply each coordinate of the current point by each coordinate of
        // `scale`. In linear algebra terms, multiply the point by the
        // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
        // defined by `scale`.
        scaleBy: function(t) {
          return new I(this.x * t.x, this.y * t.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(t) {
          return new I(this.x / t.x, this.y / t.y);
        },
        // @method round(): Point
        // Returns a copy of the current point with rounded coordinates.
        round: function() {
          return this.clone()._round();
        },
        _round: function() {
          return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
        },
        // @method floor(): Point
        // Returns a copy of the current point with floored coordinates (rounded down).
        floor: function() {
          return this.clone()._floor();
        },
        _floor: function() {
          return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
        },
        // @method ceil(): Point
        // Returns a copy of the current point with ceiled coordinates (rounded up).
        ceil: function() {
          return this.clone()._ceil();
        },
        _ceil: function() {
          return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
        },
        // @method trunc(): Point
        // Returns a copy of the current point with truncated coordinates (rounded towards zero).
        trunc: function() {
          return this.clone()._trunc();
        },
        _trunc: function() {
          return this.x = Tt(this.x), this.y = Tt(this.y), this;
        },
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function(t) {
          t = N(t);
          var e = t.x - this.x, i = t.y - this.y;
          return Math.sqrt(e * e + i * i);
        },
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function(t) {
          return t = N(t), t.x === this.x && t.y === this.y;
        },
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function(t) {
          return t = N(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
        },
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function() {
          return "Point(" + S(this.x) + ", " + S(this.y) + ")";
        }
      };
      function N(t, e, i) {
        return t instanceof I ? t : U(t) ? new I(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new I(t.x, t.y) : new I(t, e, i);
      }
      function F(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++)
            this.extend(i[n]);
      }
      F.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e, i;
          if (!t)
            return this;
          if (t instanceof I || typeof t[0] == "number" || "x" in t)
            e = i = N(t);
          else if (t = et(t), e = t.min, i = t.max, !e || !i)
            return this;
          return !this.min && !this.max ? (this.min = e.clone(), this.max = i.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(i.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(i.y, this.max.y)), this;
        },
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function(t) {
          return N(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            t
          );
        },
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function() {
          return N(this.min.x, this.max.y);
        },
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function() {
          return N(this.max.x, this.min.y);
        },
        // @method getTopLeft(): Point
        // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
        getTopLeft: function() {
          return this.min;
        },
        // @method getBottomRight(): Point
        // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
        getBottomRight: function() {
          return this.max;
        },
        // @method getSize(): Point
        // Returns the size of the given bounds
        getSize: function() {
          return this.max.subtract(this.min);
        },
        // @method contains(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle contains the given one.
        // @alternative
        // @method contains(point: Point): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: function(t) {
          var e, i;
          return typeof t[0] == "number" || t instanceof I ? t = N(t) : t = et(t), t instanceof F ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(t) {
          t = et(t);
          var e = this.min, i = this.max, n = t.min, o = t.max, s = o.x >= e.x && n.x <= i.x, l = o.y >= e.y && n.y <= i.y;
          return s && l;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(t) {
          t = et(t);
          var e = this.min, i = this.max, n = t.min, o = t.max, s = o.x > e.x && n.x < i.x, l = o.y > e.y && n.y < i.y;
          return s && l;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this.min && this.max);
        },
        // @method pad(bufferRatio: Number): Bounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(t) {
          var e = this.min, i = this.max, n = Math.abs(e.x - i.x) * t, o = Math.abs(e.y - i.y) * t;
          return et(
            N(e.x - n, e.y - o),
            N(i.x + n, i.y + o)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(t) {
          return t ? (t = et(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
        }
      };
      function et(t, e) {
        return !t || t instanceof F ? t : new F(t, e);
      }
      function it(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++)
            this.extend(i[n]);
      }
      it.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e = this._southWest, i = this._northEast, n, o;
          if (t instanceof J)
            n = t, o = t;
          else if (t instanceof it) {
            if (n = t._southWest, o = t._northEast, !n || !o)
              return this;
          } else
            return t ? this.extend($(t) || nt(t)) : this;
          return !e && !i ? (this._southWest = new J(n.lat, n.lng), this._northEast = new J(o.lat, o.lng)) : (e.lat = Math.min(n.lat, e.lat), e.lng = Math.min(n.lng, e.lng), i.lat = Math.max(o.lat, i.lat), i.lng = Math.max(o.lng, i.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(t) {
          var e = this._southWest, i = this._northEast, n = Math.abs(e.lat - i.lat) * t, o = Math.abs(e.lng - i.lng) * t;
          return new it(
            new J(e.lat - n, e.lng - o),
            new J(i.lat + n, i.lng + o)
          );
        },
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function() {
          return new J(
            (this._southWest.lat + this._northEast.lat) / 2,
            (this._southWest.lng + this._northEast.lng) / 2
          );
        },
        // @method getSouthWest(): LatLng
        // Returns the south-west point of the bounds.
        getSouthWest: function() {
          return this._southWest;
        },
        // @method getNorthEast(): LatLng
        // Returns the north-east point of the bounds.
        getNorthEast: function() {
          return this._northEast;
        },
        // @method getNorthWest(): LatLng
        // Returns the north-west point of the bounds.
        getNorthWest: function() {
          return new J(this.getNorth(), this.getWest());
        },
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function() {
          return new J(this.getSouth(), this.getEast());
        },
        // @method getWest(): Number
        // Returns the west longitude of the bounds
        getWest: function() {
          return this._southWest.lng;
        },
        // @method getSouth(): Number
        // Returns the south latitude of the bounds
        getSouth: function() {
          return this._southWest.lat;
        },
        // @method getEast(): Number
        // Returns the east longitude of the bounds
        getEast: function() {
          return this._northEast.lng;
        },
        // @method getNorth(): Number
        // Returns the north latitude of the bounds
        getNorth: function() {
          return this._northEast.lat;
        },
        // @method contains(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle contains the given one.
        // @alternative
        // @method contains (latlng: LatLng): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: function(t) {
          typeof t[0] == "number" || t instanceof J || "lat" in t ? t = $(t) : t = nt(t);
          var e = this._southWest, i = this._northEast, n, o;
          return t instanceof it ? (n = t.getSouthWest(), o = t.getNorthEast()) : n = o = t, n.lat >= e.lat && o.lat <= i.lat && n.lng >= e.lng && o.lng <= i.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(t) {
          t = nt(t);
          var e = this._southWest, i = this._northEast, n = t.getSouthWest(), o = t.getNorthEast(), s = o.lat >= e.lat && n.lat <= i.lat, l = o.lng >= e.lng && n.lng <= i.lng;
          return s && l;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(t) {
          t = nt(t);
          var e = this._southWest, i = this._northEast, n = t.getSouthWest(), o = t.getNorthEast(), s = o.lat > e.lat && n.lat < i.lat, l = o.lng > e.lng && n.lng < i.lng;
          return s && l;
        },
        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
        },
        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, e) {
          return t ? (t = nt(t), this._southWest.equals(t.getSouthWest(), e) && this._northEast.equals(t.getNorthEast(), e)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function nt(t, e) {
        return t instanceof it ? t : new it(t, e);
      }
      function J(t, e, i) {
        if (isNaN(t) || isNaN(e))
          throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
        this.lat = +t, this.lng = +e, i !== void 0 && (this.alt = +i);
      }
      J.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, e) {
          if (!t)
            return !1;
          t = $(t);
          var i = Math.max(
            Math.abs(this.lat - t.lat),
            Math.abs(this.lng - t.lng)
          );
          return i <= (e === void 0 ? 1e-9 : e);
        },
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function(t) {
          return "LatLng(" + S(this.lat, t) + ", " + S(this.lng, t) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(t) {
          return At.distance(this, $(t));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return At.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(t) {
          var e = 180 * t / 40075017, i = e / Math.cos(Math.PI / 180 * this.lat);
          return nt(
            [this.lat - e, this.lng - i],
            [this.lat + e, this.lng + i]
          );
        },
        clone: function() {
          return new J(this.lat, this.lng, this.alt);
        }
      };
      function $(t, e, i) {
        return t instanceof J ? t : U(t) && typeof t[0] != "object" ? t.length === 3 ? new J(t[0], t[1], t[2]) : t.length === 2 ? new J(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new J(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : e === void 0 ? null : new J(t, e, i);
      }
      var Ct = {
        // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
        // Projects geographical coordinates into pixel coordinates for a given zoom.
        latLngToPoint: function(t, e) {
          var i = this.projection.project(t), n = this.scale(e);
          return this.transformation._transform(i, n);
        },
        // @method pointToLatLng(point: Point, zoom: Number): LatLng
        // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
        // zoom into geographical coordinates.
        pointToLatLng: function(t, e) {
          var i = this.scale(e), n = this.transformation.untransform(t, i);
          return this.projection.unproject(n);
        },
        // @method project(latlng: LatLng): Point
        // Projects geographical coordinates into coordinates in units accepted for
        // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
        project: function(t) {
          return this.projection.project(t);
        },
        // @method unproject(point: Point): LatLng
        // Given a projected coordinate returns the corresponding LatLng.
        // The inverse of `project`.
        unproject: function(t) {
          return this.projection.unproject(t);
        },
        // @method scale(zoom: Number): Number
        // Returns the scale used when transforming projected coordinates into
        // pixel coordinates for a particular zoom. For example, it returns
        // `256 * 2^zoom` for Mercator-based CRS.
        scale: function(t) {
          return 256 * Math.pow(2, t);
        },
        // @method zoom(scale: Number): Number
        // Inverse of `scale()`, returns the zoom level corresponding to a scale
        // factor of `scale`.
        zoom: function(t) {
          return Math.log(t / 256) / Math.LN2;
        },
        // @method getProjectedBounds(zoom: Number): Bounds
        // Returns the projection's bounds scaled and transformed for the provided `zoom`.
        getProjectedBounds: function(t) {
          if (this.infinite)
            return null;
          var e = this.projection.bounds, i = this.scale(t), n = this.transformation.transform(e.min, i), o = this.transformation.transform(e.max, i);
          return new F(n, o);
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates.
        // @property code: String
        // Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
        //
        // @property wrapLng: Number[]
        // An array of two numbers defining whether the longitude (horizontal) coordinate
        // axis wraps around a given range and how. Defaults to `[-180, 180]` in most
        // geographical CRSs. If `undefined`, the longitude axis does not wrap around.
        //
        // @property wrapLat: Number[]
        // Like `wrapLng`, but for the latitude (vertical) axis.
        // wrapLng: [min, max],
        // wrapLat: [min, max],
        // @property infinite: Boolean
        // If true, the coordinate space will be unbounded (infinite in both axes)
        infinite: !1,
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where lat and lng has been wrapped according to the
        // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
        wrapLatLng: function(t) {
          var e = this.wrapLng ? y(t.lng, this.wrapLng, !0) : t.lng, i = this.wrapLat ? y(t.lat, this.wrapLat, !0) : t.lat, n = t.alt;
          return new J(i, e, n);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(t) {
          var e = t.getCenter(), i = this.wrapLatLng(e), n = e.lat - i.lat, o = e.lng - i.lng;
          if (n === 0 && o === 0)
            return t;
          var s = t.getSouthWest(), l = t.getNorthEast(), d = new J(s.lat - n, s.lng - o), _ = new J(l.lat - n, l.lng - o);
          return new it(d, _);
        }
      }, At = u({}, Ct, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(t, e) {
          var i = Math.PI / 180, n = t.lat * i, o = e.lat * i, s = Math.sin((e.lat - t.lat) * i / 2), l = Math.sin((e.lng - t.lng) * i / 2), d = s * s + Math.cos(n) * Math.cos(o) * l * l, _ = 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d));
          return this.R * _;
        }
      }), Zt = 6378137, ot = {
        R: Zt,
        MAX_LATITUDE: 85.0511287798,
        project: function(t) {
          var e = Math.PI / 180, i = this.MAX_LATITUDE, n = Math.max(Math.min(i, t.lat), -i), o = Math.sin(n * e);
          return new I(
            this.R * t.lng * e,
            this.R * Math.log((1 + o) / (1 - o)) / 2
          );
        },
        unproject: function(t) {
          var e = 180 / Math.PI;
          return new J(
            (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
            t.x * e / this.R
          );
        },
        bounds: (function() {
          var t = Zt * Math.PI;
          return new F([-t, -t], [t, t]);
        })()
      };
      function _e(t, e, i, n) {
        if (U(t)) {
          this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
          return;
        }
        this._a = t, this._b = e, this._c = i, this._d = n;
      }
      _e.prototype = {
        // @method transform(point: Point, scale?: Number): Point
        // Returns a transformed point, optionally multiplied by the given scale.
        // Only accepts actual `L.Point` instances, not arrays.
        transform: function(t, e) {
          return this._transform(t.clone(), e);
        },
        // destructive transform (faster)
        _transform: function(t, e) {
          return e = e || 1, t.x = e * (this._a * t.x + this._b), t.y = e * (this._c * t.y + this._d), t;
        },
        // @method untransform(point: Point, scale?: Number): Point
        // Returns the reverse transformation of the given point, optionally divided
        // by the given scale. Only accepts actual `L.Point` instances, not arrays.
        untransform: function(t, e) {
          return e = e || 1, new I(
            (t.x / e - this._b) / this._a,
            (t.y / e - this._d) / this._c
          );
        }
      };
      function he(t, e, i, n) {
        return new _e(t, e, i, n);
      }
      var gt = u({}, At, {
        code: "EPSG:3857",
        projection: ot,
        transformation: (function() {
          var t = 0.5 / (Math.PI * ot.R);
          return he(t, 0.5, -t, 0.5);
        })()
      }), ii = u({}, gt, {
        code: "EPSG:900913"
      });
      function at(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t);
      }
      function pe(t, e) {
        var i = "", n, o, s, l, d, _;
        for (n = 0, s = t.length; n < s; n++) {
          for (d = t[n], o = 0, l = d.length; o < l; o++)
            _ = d[o], i += (o ? "L" : "M") + _.x + " " + _.y;
          i += e ? z.svg ? "z" : "x" : "";
        }
        return i || "M0 0";
      }
      var Be = document.documentElement.style, Bt = "ActiveXObject" in window, _t = Bt && !document.addEventListener, kt = "msLaunchUri" in navigator && !("documentMode" in document), le = $t("webkit"), ni = $t("android"), vt = $t("android 2") || $t("android 3"), Oi = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), oi = ni && $t("Google") && Oi < 537 && !("AudioNode" in window), Te = !!window.opera, Re = !kt && $t("chrome"), Gt = $t("gecko") && !le && !Te && !Bt, si = !Re && $t("safari"), De = $t("phantom"), ri = "OTransition" in Be, Ai = navigator.platform.indexOf("Win") === 0, R = Bt && "transition" in Be, Pt = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !vt, Vt = "MozPerspective" in Be, Me = !window.L_DISABLE_3D && (R || Pt || Vt) && !ri && !De, It = typeof orientation < "u" || $t("mobile"), Ii = It && le, Ut = It && Pt, _n = !window.PointerEvent && window.MSPointerEvent, pn = !!(window.PointerEvent || _n), gn = "ontouchstart" in window || !!window.TouchEvent, Ho = !window.L_NO_TOUCH && (gn || pn), Wo = It && Te, Uo = It && Gt, jo = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, qo = (function() {
        var t = !1;
        try {
          var e = Object.defineProperty({}, "passive", {
            get: function() {
              t = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", x, e), window.removeEventListener("testPassiveEventSupport", x, e);
        } catch {
        }
        return t;
      })(), Go = (function() {
        return !!document.createElement("canvas").getContext;
      })(), Ni = !!(document.createElementNS && at("svg").createSVGRect), Vo = !!Ni && (function() {
        var t = document.createElement("div");
        return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), $o = !Ni && (function() {
        try {
          var t = document.createElement("div");
          t.innerHTML = '<v:shape adj="1"/>';
          var e = t.firstChild;
          return e.style.behavior = "url(#default#VML)", e && typeof e.adj == "object";
        } catch {
          return !1;
        }
      })(), Ko = navigator.platform.indexOf("Mac") === 0, Yo = navigator.platform.indexOf("Linux") === 0;
      function $t(t) {
        return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
      }
      var z = {
        ie: Bt,
        ielt9: _t,
        edge: kt,
        webkit: le,
        android: ni,
        android23: vt,
        androidStock: oi,
        opera: Te,
        chrome: Re,
        gecko: Gt,
        safari: si,
        phantom: De,
        opera12: ri,
        win: Ai,
        ie3d: R,
        webkit3d: Pt,
        gecko3d: Vt,
        any3d: Me,
        mobile: It,
        mobileWebkit: Ii,
        mobileWebkit3d: Ut,
        msPointer: _n,
        pointer: pn,
        touch: Ho,
        touchNative: gn,
        mobileOpera: Wo,
        mobileGecko: Uo,
        retina: jo,
        passiveEvents: qo,
        canvas: Go,
        svg: Ni,
        vml: $o,
        inlineSvg: Vo,
        mac: Ko,
        linux: Yo
      }, vn = z.msPointer ? "MSPointerDown" : "pointerdown", yn = z.msPointer ? "MSPointerMove" : "pointermove", wn = z.msPointer ? "MSPointerUp" : "pointerup", xn = z.msPointer ? "MSPointerCancel" : "pointercancel", Zi = {
        touchstart: vn,
        touchmove: yn,
        touchend: wn,
        touchcancel: xn
      }, bn = {
        touchstart: is,
        touchmove: ai,
        touchend: ai,
        touchcancel: ai
      }, ke = {}, Pn = !1;
      function Xo(t, e, i) {
        return e === "touchstart" && es(), bn[e] ? (i = bn[e].bind(this, i), t.addEventListener(Zi[e], i, !1), i) : (console.warn("wrong event specified:", e), x);
      }
      function Jo(t, e, i) {
        if (!Zi[e]) {
          console.warn("wrong event specified:", e);
          return;
        }
        t.removeEventListener(Zi[e], i, !1);
      }
      function Qo(t) {
        ke[t.pointerId] = t;
      }
      function ts(t) {
        ke[t.pointerId] && (ke[t.pointerId] = t);
      }
      function Ln(t) {
        delete ke[t.pointerId];
      }
      function es() {
        Pn || (document.addEventListener(vn, Qo, !0), document.addEventListener(yn, ts, !0), document.addEventListener(wn, Ln, !0), document.addEventListener(xn, Ln, !0), Pn = !0);
      }
      function ai(t, e) {
        if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
          e.touches = [];
          for (var i in ke)
            e.touches.push(ke[i]);
          e.changedTouches = [e], t(e);
        }
      }
      function is(t, e) {
        e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && Lt(e), ai(t, e);
      }
      function ns(t) {
        var e = {}, i, n;
        for (n in t)
          i = t[n], e[n] = i && i.bind ? i.bind(t) : i;
        return t = e, e.type = "dblclick", e.detail = 2, e.isTrusted = !1, e._simulated = !0, e;
      }
      var os = 200;
      function ss(t, e) {
        t.addEventListener("dblclick", e);
        var i = 0, n;
        function o(s) {
          if (s.detail !== 1) {
            n = s.detail;
            return;
          }
          if (!(s.pointerType === "mouse" || s.sourceCapabilities && !s.sourceCapabilities.firesTouchEvents)) {
            var l = Cn(s);
            if (!(l.some(function(_) {
              return _ instanceof HTMLLabelElement && _.attributes.for;
            }) && !l.some(function(_) {
              return _ instanceof HTMLInputElement || _ instanceof HTMLSelectElement;
            }))) {
              var d = Date.now();
              d - i <= os ? (n++, n === 2 && e(ns(s))) : n = 1, i = d;
            }
          }
        }
        return t.addEventListener("click", o), {
          dblclick: e,
          simDblclick: o
        };
      }
      function rs(t, e) {
        t.removeEventListener("dblclick", e.dblclick), t.removeEventListener("click", e.simDblclick);
      }
      var Bi = ui(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), Fe = ui(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), Tn = Fe === "webkitTransition" || Fe === "OTransition" ? Fe + "End" : "transitionend";
      function Mn(t) {
        return typeof t == "string" ? document.getElementById(t) : t;
      }
      function He(t, e) {
        var i = t.style[e] || t.currentStyle && t.currentStyle[e];
        if ((!i || i === "auto") && document.defaultView) {
          var n = document.defaultView.getComputedStyle(t, null);
          i = n ? n[e] : null;
        }
        return i === "auto" ? null : i;
      }
      function Q(t, e, i) {
        var n = document.createElement(t);
        return n.className = e || "", i && i.appendChild(n), n;
      }
      function ct(t) {
        var e = t.parentNode;
        e && e.removeChild(t);
      }
      function hi(t) {
        for (; t.firstChild; )
          t.removeChild(t.firstChild);
      }
      function Se(t) {
        var e = t.parentNode;
        e && e.lastChild !== t && e.appendChild(t);
      }
      function Ce(t) {
        var e = t.parentNode;
        e && e.firstChild !== t && e.insertBefore(t, e.firstChild);
      }
      function Ri(t, e) {
        if (t.classList !== void 0)
          return t.classList.contains(e);
        var i = li(t);
        return i.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(i);
      }
      function G(t, e) {
        if (t.classList !== void 0)
          for (var i = O(e), n = 0, o = i.length; n < o; n++)
            t.classList.add(i[n]);
        else if (!Ri(t, e)) {
          var s = li(t);
          Di(t, (s ? s + " " : "") + e);
        }
      }
      function pt(t, e) {
        t.classList !== void 0 ? t.classList.remove(e) : Di(t, q((" " + li(t) + " ").replace(" " + e + " ", " ")));
      }
      function Di(t, e) {
        t.className.baseVal === void 0 ? t.className = e : t.className.baseVal = e;
      }
      function li(t) {
        return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
      }
      function Rt(t, e) {
        "opacity" in t.style ? t.style.opacity = e : "filter" in t.style && as(t, e);
      }
      function as(t, e) {
        var i = !1, n = "DXImageTransform.Microsoft.Alpha";
        try {
          i = t.filters.item(n);
        } catch {
          if (e === 1)
            return;
        }
        e = Math.round(e * 100), i ? (i.Enabled = e !== 100, i.Opacity = e) : t.style.filter += " progid:" + n + "(opacity=" + e + ")";
      }
      function ui(t) {
        for (var e = document.documentElement.style, i = 0; i < t.length; i++)
          if (t[i] in e)
            return t[i];
        return !1;
      }
      function ge(t, e, i) {
        var n = e || new I(0, 0);
        t.style[Bi] = (z.ie3d ? "translate(" + n.x + "px," + n.y + "px)" : "translate3d(" + n.x + "px," + n.y + "px,0)") + (i ? " scale(" + i + ")" : "");
      }
      function yt(t, e) {
        t._leaflet_pos = e, z.any3d ? ge(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px");
      }
      function ve(t) {
        return t._leaflet_pos || new I(0, 0);
      }
      var We, Ue, Fi;
      if ("onselectstart" in document)
        We = function() {
          j(window, "selectstart", Lt);
        }, Ue = function() {
          ht(window, "selectstart", Lt);
        };
      else {
        var je = ui(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        We = function() {
          if (je) {
            var t = document.documentElement.style;
            Fi = t[je], t[je] = "none";
          }
        }, Ue = function() {
          je && (document.documentElement.style[je] = Fi, Fi = void 0);
        };
      }
      function Hi() {
        j(window, "dragstart", Lt);
      }
      function Wi() {
        ht(window, "dragstart", Lt);
      }
      var ci, Ui;
      function ji(t) {
        for (; t.tabIndex === -1; )
          t = t.parentNode;
        t.style && (di(), ci = t, Ui = t.style.outlineStyle, t.style.outlineStyle = "none", j(window, "keydown", di));
      }
      function di() {
        ci && (ci.style.outlineStyle = Ui, ci = void 0, Ui = void 0, ht(window, "keydown", di));
      }
      function kn(t) {
        do
          t = t.parentNode;
        while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
        return t;
      }
      function qi(t) {
        var e = t.getBoundingClientRect();
        return {
          x: e.width / t.offsetWidth || 1,
          y: e.height / t.offsetHeight || 1,
          boundingClientRect: e
        };
      }
      var hs = {
        __proto__: null,
        TRANSFORM: Bi,
        TRANSITION: Fe,
        TRANSITION_END: Tn,
        get: Mn,
        getStyle: He,
        create: Q,
        remove: ct,
        empty: hi,
        toFront: Se,
        toBack: Ce,
        hasClass: Ri,
        addClass: G,
        removeClass: pt,
        setClass: Di,
        getClass: li,
        setOpacity: Rt,
        testProp: ui,
        setTransform: ge,
        setPosition: yt,
        getPosition: ve,
        get disableTextSelection() {
          return We;
        },
        get enableTextSelection() {
          return Ue;
        },
        disableImageDrag: Hi,
        enableImageDrag: Wi,
        preventOutline: ji,
        restoreOutline: di,
        getSizedParentNode: kn,
        getScale: qi
      };
      function j(t, e, i, n) {
        if (e && typeof e == "object")
          for (var o in e)
            Vi(t, o, e[o], i);
        else {
          e = O(e);
          for (var s = 0, l = e.length; s < l; s++)
            Vi(t, e[s], i, n);
        }
        return this;
      }
      var Kt = "_leaflet_events";
      function ht(t, e, i, n) {
        if (arguments.length === 1)
          Sn(t), delete t[Kt];
        else if (e && typeof e == "object")
          for (var o in e)
            $i(t, o, e[o], i);
        else if (e = O(e), arguments.length === 2)
          Sn(t, function(d) {
            return C(e, d) !== -1;
          });
        else
          for (var s = 0, l = e.length; s < l; s++)
            $i(t, e[s], i, n);
        return this;
      }
      function Sn(t, e) {
        for (var i in t[Kt]) {
          var n = i.split(/\d/)[0];
          (!e || e(n)) && $i(t, n, null, null, i);
        }
      }
      var Gi = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function Vi(t, e, i, n) {
        var o = e + p(i) + (n ? "_" + p(n) : "");
        if (t[Kt] && t[Kt][o])
          return this;
        var s = function(d) {
          return i.call(n || t, d || window.event);
        }, l = s;
        !z.touchNative && z.pointer && e.indexOf("touch") === 0 ? s = Xo(t, e, s) : z.touch && e === "dblclick" ? s = ss(t, s) : "addEventListener" in t ? e === "touchstart" || e === "touchmove" || e === "wheel" || e === "mousewheel" ? t.addEventListener(Gi[e] || e, s, z.passiveEvents ? { passive: !1 } : !1) : e === "mouseenter" || e === "mouseleave" ? (s = function(d) {
          d = d || window.event, Yi(t, d) && l(d);
        }, t.addEventListener(Gi[e], s, !1)) : t.addEventListener(e, l, !1) : t.attachEvent("on" + e, s), t[Kt] = t[Kt] || {}, t[Kt][o] = s;
      }
      function $i(t, e, i, n, o) {
        o = o || e + p(i) + (n ? "_" + p(n) : "");
        var s = t[Kt] && t[Kt][o];
        if (!s)
          return this;
        !z.touchNative && z.pointer && e.indexOf("touch") === 0 ? Jo(t, e, s) : z.touch && e === "dblclick" ? rs(t, s) : "removeEventListener" in t ? t.removeEventListener(Gi[e] || e, s, !1) : t.detachEvent("on" + e, s), t[Kt][o] = null;
      }
      function ye(t) {
        return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
      }
      function Ki(t) {
        return Vi(t, "wheel", ye), this;
      }
      function qe(t) {
        return j(t, "mousedown touchstart dblclick contextmenu", ye), t._leaflet_disable_click = !0, this;
      }
      function Lt(t) {
        return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
      }
      function we(t) {
        return Lt(t), ye(t), this;
      }
      function Cn(t) {
        if (t.composedPath)
          return t.composedPath();
        for (var e = [], i = t.target; i; )
          e.push(i), i = i.parentNode;
        return e;
      }
      function En(t, e) {
        if (!e)
          return new I(t.clientX, t.clientY);
        var i = qi(e), n = i.boundingClientRect;
        return new I(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (t.clientX - n.left) / i.x - e.clientLeft,
          (t.clientY - n.top) / i.y - e.clientTop
        );
      }
      var ls = z.linux && z.chrome ? window.devicePixelRatio : z.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function zn(t) {
        return z.edge ? t.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          t.deltaY && t.deltaMode === 0 ? -t.deltaY / ls : (
            // Pixels
            t.deltaY && t.deltaMode === 1 ? -t.deltaY * 20 : (
              // Lines
              t.deltaY && t.deltaMode === 2 ? -t.deltaY * 60 : (
                // Pages
                t.deltaX || t.deltaZ ? 0 : (
                  // Skip horizontal/depth wheel events
                  t.wheelDelta ? (t.wheelDeltaY || t.wheelDelta) / 2 : (
                    // Legacy IE pixels
                    t.detail && Math.abs(t.detail) < 32765 ? -t.detail * 20 : (
                      // Legacy Moz lines
                      t.detail ? t.detail / -32765 * 60 : (
                        // Legacy Moz pages
                        0
                      )
                    )
                  )
                )
              )
            )
          )
        );
      }
      function Yi(t, e) {
        var i = e.relatedTarget;
        if (!i)
          return !0;
        try {
          for (; i && i !== t; )
            i = i.parentNode;
        } catch {
          return !1;
        }
        return i !== t;
      }
      var us = {
        __proto__: null,
        on: j,
        off: ht,
        stopPropagation: ye,
        disableScrollPropagation: Ki,
        disableClickPropagation: qe,
        preventDefault: Lt,
        stop: we,
        getPropagationPath: Cn,
        getMousePosition: En,
        getWheelDelta: zn,
        isExternalTarget: Yi,
        addListener: j,
        removeListener: ht
      }, On = dt.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(t, e, i, n) {
          this.stop(), this._el = t, this._inProgress = !0, this._duration = i || 0.25, this._easeOutPower = 1 / Math.max(n || 0.5, 0.2), this._startPos = ve(t), this._offset = e.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
        },
        // @method stop()
        // Stops the animation (if currently running).
        stop: function() {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function() {
          this._animId = D(this._animate, this), this._step();
        },
        _step: function(t) {
          var e = +/* @__PURE__ */ new Date() - this._startTime, i = this._duration * 1e3;
          e < i ? this._runFrame(this._easeOut(e / i), t) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(t, e) {
          var i = this._startPos.add(this._offset.multiplyBy(t));
          e && i._round(), yt(this._el, i), this.fire("step");
        },
        _complete: function() {
          K(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(t) {
          return 1 - Math.pow(1 - t, this._easeOutPower);
        }
      }), Y = dt.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: gt,
          // @option center: LatLng = undefined
          // Initial geographic center of the map
          center: void 0,
          // @option zoom: Number = undefined
          // Initial map zoom level
          zoom: void 0,
          // @option minZoom: Number = *
          // Minimum zoom level of the map.
          // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
          // the lowest of their `minZoom` options will be used instead.
          minZoom: void 0,
          // @option maxZoom: Number = *
          // Maximum zoom level of the map.
          // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
          // the highest of their `maxZoom` options will be used instead.
          maxZoom: void 0,
          // @option layers: Layer[] = []
          // Array of layers that will be added to the map initially
          layers: [],
          // @option maxBounds: LatLngBounds = null
          // When this option is set, the map restricts the view to the given
          // geographical bounds, bouncing the user back if the user tries to pan
          // outside the view. To set the restriction dynamically, use
          // [`setMaxBounds`](#map-setmaxbounds) method.
          maxBounds: void 0,
          // @option renderer: Renderer = *
          // The default method for drawing vector layers on the map. `L.SVG`
          // or `L.Canvas` by default depending on browser support.
          renderer: void 0,
          // @section Animation Options
          // @option zoomAnimation: Boolean = true
          // Whether the map zoom animation is enabled. By default it's enabled
          // in all browsers that support CSS3 Transitions except Android.
          zoomAnimation: !0,
          // @option zoomAnimationThreshold: Number = 4
          // Won't animate zoom if the zoom difference exceeds this value.
          zoomAnimationThreshold: 4,
          // @option fadeAnimation: Boolean = true
          // Whether the tile fade animation is enabled. By default it's enabled
          // in all browsers that support CSS3 Transitions except Android.
          fadeAnimation: !0,
          // @option markerZoomAnimation: Boolean = true
          // Whether markers animate their zoom with the zoom animation, if disabled
          // they will disappear for the length of the animation. By default it's
          // enabled in all browsers that support CSS3 Transitions except Android.
          markerZoomAnimation: !0,
          // @option transform3DLimit: Number = 2^23
          // Defines the maximum size of a CSS translation transform. The default
          // value should not be changed unless a web browser positions layers in
          // the wrong place after doing a large `panBy`.
          transform3DLimit: 8388608,
          // Precision limit of a 32-bit float
          // @section Interaction Options
          // @option zoomSnap: Number = 1
          // Forces the map's zoom level to always be a multiple of this, particularly
          // right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
          // By default, the zoom level snaps to the nearest integer; lower values
          // (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
          // means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
          zoomSnap: 1,
          // @option zoomDelta: Number = 1
          // Controls how much the map's zoom level will change after a
          // [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
          // or `-` on the keyboard, or using the [zoom controls](#control-zoom).
          // Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
          zoomDelta: 1,
          // @option trackResize: Boolean = true
          // Whether the map automatically handles browser window resize to update itself.
          trackResize: !0
        },
        initialize: function(t, e) {
          e = M(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = m(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.zoom !== void 0 && (this._zoom = this._limitZoom(e.zoom)), e.center && e.zoom !== void 0 && this.setView($(e.center), e.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = Fe && z.any3d && !z.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), j(this._proxy, Tn, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(t, e, i) {
          if (e = e === void 0 ? this._zoom : this._limitZoom(e), t = this._limitCenter($(t), e, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && i !== !0) {
            i.animate !== void 0 && (i.zoom = u({ animate: i.animate }, i.zoom), i.pan = u({ animate: i.animate, duration: i.duration }, i.pan));
            var n = this._zoom !== e ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, e, i.zoom) : this._tryAnimatedPan(t, i.pan);
            if (n)
              return clearTimeout(this._sizeTimer), this;
          }
          return this._resetView(t, e, i.pan && i.pan.noMoveStart), this;
        },
        // @method setZoom(zoom: Number, options?: Zoom/pan options): this
        // Sets the zoom of the map.
        setZoom: function(t, e) {
          return this._loaded ? this.setView(this.getCenter(), t, { zoom: e }) : (this._zoom = t, this);
        },
        // @method zoomIn(delta?: Number, options?: Zoom options): this
        // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomIn: function(t, e) {
          return t = t || (z.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(t, e) {
          return t = t || (z.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(t, e, i) {
          var n = this.getZoomScale(e), o = this.getSize().divideBy(2), s = t instanceof I ? t : this.latLngToContainerPoint(t), l = s.subtract(o).multiplyBy(1 - 1 / n), d = this.containerPointToLatLng(o.add(l));
          return this.setView(d, e, { zoom: i });
        },
        _getBoundsCenterZoom: function(t, e) {
          e = e || {}, t = t.getBounds ? t.getBounds() : nt(t);
          var i = N(e.paddingTopLeft || e.padding || [0, 0]), n = N(e.paddingBottomRight || e.padding || [0, 0]), o = this.getBoundsZoom(t, !1, i.add(n));
          if (o = typeof e.maxZoom == "number" ? Math.min(e.maxZoom, o) : o, o === 1 / 0)
            return {
              center: t.getCenter(),
              zoom: o
            };
          var s = n.subtract(i).divideBy(2), l = this.project(t.getSouthWest(), o), d = this.project(t.getNorthEast(), o), _ = this.unproject(l.add(d).divideBy(2).add(s), o);
          return {
            center: _,
            zoom: o
          };
        },
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: function(t, e) {
          if (t = nt(t), !t.isValid())
            throw new Error("Bounds are not valid.");
          var i = this._getBoundsCenterZoom(t, e);
          return this.setView(i.center, i.zoom, e);
        },
        // @method fitWorld(options?: fitBounds options): this
        // Sets a map view that mostly contains the whole world with the maximum
        // zoom level possible.
        fitWorld: function(t) {
          return this.fitBounds([[-90, -180], [90, 180]], t);
        },
        // @method panTo(latlng: LatLng, options?: Pan options): this
        // Pans the map to a given center.
        panTo: function(t, e) {
          return this.setView(t, this._zoom, { pan: e });
        },
        // @method panBy(offset: Point, options?: Pan options): this
        // Pans the map by a given number of pixels (animated).
        panBy: function(t, e) {
          if (t = N(t).round(), e = e || {}, !t.x && !t.y)
            return this.fire("moveend");
          if (e.animate !== !0 && !this.getSize().contains(t))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new On(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) {
            G(this._mapPane, "leaflet-pan-anim");
            var i = this._getMapPanePos().subtract(t).round();
            this._panAnim.run(this._mapPane, i, e.duration || 0.25, e.easeLinearity);
          } else
            this._rawPanBy(t), this.fire("move").fire("moveend");
          return this;
        },
        // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) performing a smooth
        // pan-zoom animation.
        flyTo: function(t, e, i) {
          if (i = i || {}, i.animate === !1 || !z.any3d)
            return this.setView(t, e, i);
          this._stop();
          var n = this.project(this.getCenter()), o = this.project(t), s = this.getSize(), l = this._zoom;
          t = $(t), e = e === void 0 ? l : e;
          var d = Math.max(s.x, s.y), _ = d * this.getZoomScale(l, e), b = o.distanceTo(n) || 1, k = 1.42, Z = k * k;
          function V(wt) {
            var Li = wt ? -1 : 1, Js = wt ? _ : d, Qs = _ * _ - d * d + Li * Z * Z * b * b, tr = 2 * Js * Z * b, hn = Qs / tr, fo = Math.sqrt(hn * hn + 1) - hn, er = fo < 1e-9 ? -18 : Math.log(fo);
            return er;
          }
          function St(wt) {
            return (Math.exp(wt) - Math.exp(-wt)) / 2;
          }
          function xt(wt) {
            return (Math.exp(wt) + Math.exp(-wt)) / 2;
          }
          function Ft(wt) {
            return St(wt) / xt(wt);
          }
          var Et = V(0);
          function Ne(wt) {
            return d * (xt(Et) / xt(Et + k * wt));
          }
          function $s(wt) {
            return d * (xt(Et) * Ft(Et + k * wt) - St(Et)) / Z;
          }
          function Ks(wt) {
            return 1 - Math.pow(1 - wt, 1.5);
          }
          var Ys = Date.now(), uo = (V(1) - Et) / k, Xs = i.duration ? 1e3 * i.duration : 1e3 * uo * 0.8;
          function co() {
            var wt = (Date.now() - Ys) / Xs, Li = Ks(wt) * uo;
            wt <= 1 ? (this._flyToFrame = D(co, this), this._move(
              this.unproject(n.add(o.subtract(n).multiplyBy($s(Li) / b)), l),
              this.getScaleZoom(d / Ne(Li), l),
              { flyTo: !0 }
            )) : this._move(t, e)._moveEnd(!0);
          }
          return this._moveStart(!0, i.noMoveStart), co.call(this), this;
        },
        // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
        // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
        flyToBounds: function(t, e) {
          var i = this._getBoundsCenterZoom(t, e);
          return this.flyTo(i.center, i.zoom, e);
        },
        // @method setMaxBounds(bounds: LatLngBounds): this
        // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
        setMaxBounds: function(t) {
          return t = nt(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
        },
        // @method setMinZoom(zoom: Number): this
        // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
        setMinZoom: function(t) {
          var e = this.options.minZoom;
          return this.options.minZoom = t, this._loaded && e !== t && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(t) : this;
        },
        // @method setMaxZoom(zoom: Number): this
        // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
        setMaxZoom: function(t) {
          var e = this.options.maxZoom;
          return this.options.maxZoom = t, this._loaded && e !== t && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(t) : this;
        },
        // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
        // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
        panInsideBounds: function(t, e) {
          this._enforcingBounds = !0;
          var i = this.getCenter(), n = this._limitCenter(i, this._zoom, nt(t));
          return i.equals(n) || this.panTo(n, e), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(t, e) {
          e = e || {};
          var i = N(e.paddingTopLeft || e.padding || [0, 0]), n = N(e.paddingBottomRight || e.padding || [0, 0]), o = this.project(this.getCenter()), s = this.project(t), l = this.getPixelBounds(), d = et([l.min.add(i), l.max.subtract(n)]), _ = d.getSize();
          if (!d.contains(s)) {
            this._enforcingBounds = !0;
            var b = s.subtract(d.getCenter()), k = d.extend(s).getSize().subtract(_);
            o.x += b.x < 0 ? -k.x : k.x, o.y += b.y < 0 ? -k.y : k.y, this.panTo(this.unproject(o), e), this._enforcingBounds = !1;
          }
          return this;
        },
        // @method invalidateSize(options: Zoom/pan options): this
        // Checks if the map container size changed and updates the map if so —
        // call it after you've changed the map size dynamically, also animating
        // pan by default. If `options.pan` is `false`, panning will not occur.
        // If `options.debounceMoveend` is `true`, it will delay `moveend` event so
        // that it doesn't happen often even if the method is called many
        // times in a row.
        // @alternative
        // @method invalidateSize(animate: Boolean): this
        // Checks if the map container size changed and updates the map if so —
        // call it after you've changed the map size dynamically, also animating
        // pan by default.
        invalidateSize: function(t) {
          if (!this._loaded)
            return this;
          t = u({
            animate: !1,
            pan: !0
          }, t === !0 ? { animate: !0 } : t);
          var e = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var i = this.getSize(), n = e.divideBy(2).round(), o = i.divideBy(2).round(), s = n.subtract(o);
          return !s.x && !s.y ? this : (t.animate && t.pan ? this.panBy(s) : (t.pan && this._rawPanBy(s), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(m(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
            oldSize: e,
            newSize: i
          }));
        },
        // @section Methods for modifying map state
        // @method stop(): this
        // Stops the currently running `panTo` or `flyTo` animation, if any.
        stop: function() {
          return this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire("viewreset"), this._stop();
        },
        // @section Geolocation methods
        // @method locate(options?: Locate options): this
        // Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
        // event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
        // and optionally sets the map view to the user's location with respect to
        // detection accuracy (or to the world view if geolocation failed).
        // Note that, if your page doesn't use HTTPS, this method will fail in
        // modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
        // See `Locate options` for more details.
        locate: function(t) {
          if (t = this._locateOptions = u({
            timeout: 1e4,
            watch: !1
            // setView: false
            // maxZoom: <Number>
            // maximumAge: 0
            // enableHighAccuracy: false
          }, t), !("geolocation" in navigator))
            return this._handleGeolocationError({
              code: 0,
              message: "Geolocation not supported."
            }), this;
          var e = m(this._handleGeolocationResponse, this), i = m(this._handleGeolocationError, this);
          return t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(e, i, t) : navigator.geolocation.getCurrentPosition(e, i, t), this;
        },
        // @method stopLocate(): this
        // Stops watching location previously initiated by `map.locate({watch: true})`
        // and aborts resetting the map view if map.locate was called with
        // `{setView: true}`.
        stopLocate: function() {
          return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
        },
        _handleGeolocationError: function(t) {
          if (this._container._leaflet_id) {
            var e = t.code, i = t.message || (e === 1 ? "permission denied" : e === 2 ? "position unavailable" : "timeout");
            this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
              code: e,
              message: "Geolocation error: " + i + "."
            });
          }
        },
        _handleGeolocationResponse: function(t) {
          if (this._container._leaflet_id) {
            var e = t.coords.latitude, i = t.coords.longitude, n = new J(e, i), o = n.toBounds(t.coords.accuracy * 2), s = this._locateOptions;
            if (s.setView) {
              var l = this.getBoundsZoom(o);
              this.setView(n, s.maxZoom ? Math.min(l, s.maxZoom) : l);
            }
            var d = {
              latlng: n,
              bounds: o,
              timestamp: t.timestamp
            };
            for (var _ in t.coords)
              typeof t.coords[_] == "number" && (d[_] = t.coords[_]);
            this.fire("locationfound", d);
          }
        },
        // TODO Appropriate docs section?
        // @section Other Methods
        // @method addHandler(name: String, HandlerClass: Function): this
        // Adds a new `Handler` to the map, given its name and constructor function.
        addHandler: function(t, e) {
          if (!e)
            return this;
          var i = this[t] = new e(this);
          return this._handlers.push(i), this.options[t] && i.enable(), this;
        },
        // @method remove(): this
        // Destroys the map and clears all related event listeners.
        remove: function() {
          if (this._initEvents(!0), this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this._containerId !== this._container._leaflet_id)
            throw new Error("Map container is being reused by another instance");
          try {
            delete this._container._leaflet_id, delete this._containerId;
          } catch {
            this._container._leaflet_id = void 0, this._containerId = void 0;
          }
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), ct(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (K(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var t;
          for (t in this._layers)
            this._layers[t].remove();
          for (t in this._panes)
            ct(this._panes[t]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(t, e) {
          var i = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), n = Q("div", i, e || this._mapPane);
          return t && (this._panes[t] = n), n;
        },
        // @section Methods for Getting Map State
        // @method getCenter(): LatLng
        // Returns the geographical center of the map view
        getCenter: function() {
          return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter.clone() : this.layerPointToLatLng(this._getCenterLayerPoint());
        },
        // @method getZoom(): Number
        // Returns the current zoom level of the map view
        getZoom: function() {
          return this._zoom;
        },
        // @method getBounds(): LatLngBounds
        // Returns the geographical bounds visible in the current map view
        getBounds: function() {
          var t = this.getPixelBounds(), e = this.unproject(t.getBottomLeft()), i = this.unproject(t.getTopRight());
          return new it(e, i);
        },
        // @method getMinZoom(): Number
        // Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
        getMinZoom: function() {
          return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
        },
        // @method getMaxZoom(): Number
        // Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
        getMaxZoom: function() {
          return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom;
        },
        // @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
        // Returns the maximum zoom level on which the given bounds fit to the map
        // view in its entirety. If `inside` (optional) is set to `true`, the method
        // instead returns the minimum zoom level on which the map view fits into
        // the given bounds in its entirety.
        getBoundsZoom: function(t, e, i) {
          t = nt(t), i = N(i || [0, 0]);
          var n = this.getZoom() || 0, o = this.getMinZoom(), s = this.getMaxZoom(), l = t.getNorthWest(), d = t.getSouthEast(), _ = this.getSize().subtract(i), b = et(this.project(d, n), this.project(l, n)).getSize(), k = z.any3d ? this.options.zoomSnap : 1, Z = _.x / b.x, V = _.y / b.y, St = e ? Math.max(Z, V) : Math.min(Z, V);
          return n = this.getScaleZoom(St, n), k && (n = Math.round(n / (k / 100)) * (k / 100), n = e ? Math.ceil(n / k) * k : Math.floor(n / k) * k), Math.max(o, Math.min(s, n));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new I(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(t, e) {
          var i = this._getTopLeftPoint(t, e);
          return new F(i, i.add(this.getSize()));
        },
        // TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
        // the map pane? "left point of the map layer" can be confusing, specially
        // since there can be negative offsets.
        // @method getPixelOrigin(): Point
        // Returns the projected pixel coordinates of the top left point of
        // the map layer (useful in custom layer and overlay implementations).
        getPixelOrigin: function() {
          return this._checkIfLoaded(), this._pixelOrigin;
        },
        // @method getPixelWorldBounds(zoom?: Number): Bounds
        // Returns the world's bounds in pixel coordinates for zoom level `zoom`.
        // If `zoom` is omitted, the map's current zoom level is used.
        getPixelWorldBounds: function(t) {
          return this.options.crs.getProjectedBounds(t === void 0 ? this.getZoom() : t);
        },
        // @section Other Methods
        // @method getPane(pane: String|HTMLElement): HTMLElement
        // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
        getPane: function(t) {
          return typeof t == "string" ? this._panes[t] : t;
        },
        // @method getPanes(): Object
        // Returns a plain object containing the names of all [panes](#map-pane) as keys and
        // the panes as values.
        getPanes: function() {
          return this._panes;
        },
        // @method getContainer: HTMLElement
        // Returns the HTML element that contains the map.
        getContainer: function() {
          return this._container;
        },
        // @section Conversion Methods
        // @method getZoomScale(toZoom: Number, fromZoom: Number): Number
        // Returns the scale factor to be applied to a map transition from zoom level
        // `fromZoom` to `toZoom`. Used internally to help with zoom animations.
        getZoomScale: function(t, e) {
          var i = this.options.crs;
          return e = e === void 0 ? this._zoom : e, i.scale(t) / i.scale(e);
        },
        // @method getScaleZoom(scale: Number, fromZoom: Number): Number
        // Returns the zoom level that the map would end up at, if it is at `fromZoom`
        // level and everything is scaled by a factor of `scale`. Inverse of
        // [`getZoomScale`](#map-getZoomScale).
        getScaleZoom: function(t, e) {
          var i = this.options.crs;
          e = e === void 0 ? this._zoom : e;
          var n = i.zoom(t * i.scale(e));
          return isNaN(n) ? 1 / 0 : n;
        },
        // @method project(latlng: LatLng, zoom: Number): Point
        // Projects a geographical coordinate `LatLng` according to the projection
        // of the map's CRS, then scales it according to `zoom` and the CRS's
        // `Transformation`. The result is pixel coordinate relative to
        // the CRS origin.
        project: function(t, e) {
          return e = e === void 0 ? this._zoom : e, this.options.crs.latLngToPoint($(t), e);
        },
        // @method unproject(point: Point, zoom: Number): LatLng
        // Inverse of [`project`](#map-project).
        unproject: function(t, e) {
          return e = e === void 0 ? this._zoom : e, this.options.crs.pointToLatLng(N(t), e);
        },
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: function(t) {
          var e = N(t).add(this.getPixelOrigin());
          return this.unproject(e);
        },
        // @method latLngToLayerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the [origin pixel](#map-getpixelorigin).
        latLngToLayerPoint: function(t) {
          var e = this.project($(t))._round();
          return e._subtract(this.getPixelOrigin());
        },
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: function(t) {
          return this.options.crs.wrapLatLng($(t));
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring that
        // its center is within the CRS's bounds.
        // By default this means the center longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees, and the majority of the bounds
        // overlaps the CRS's bounds.
        wrapLatLngBounds: function(t) {
          return this.options.crs.wrapLatLngBounds(nt(t));
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates according to
        // the map's CRS. By default this measures distance in meters.
        distance: function(t, e) {
          return this.options.crs.distance($(t), $(e));
        },
        // @method containerPointToLayerPoint(point: Point): Point
        // Given a pixel coordinate relative to the map container, returns the corresponding
        // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
        containerPointToLayerPoint: function(t) {
          return N(t).subtract(this._getMapPanePos());
        },
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: function(t) {
          return N(t).add(this._getMapPanePos());
        },
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: function(t) {
          var e = this.containerPointToLayerPoint(N(t));
          return this.layerPointToLatLng(e);
        },
        // @method latLngToContainerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the map container.
        latLngToContainerPoint: function(t) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint($(t)));
        },
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: function(t) {
          return En(t, this._container);
        },
        // @method mouseEventToLayerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to
        // the [origin pixel](#map-getpixelorigin) where the event took place.
        mouseEventToLayerPoint: function(t) {
          return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t));
        },
        // @method mouseEventToLatLng(ev: MouseEvent): LatLng
        // Given a MouseEvent object, returns geographical coordinate where the
        // event took place.
        mouseEventToLatLng: function(t) {
          return this.layerPointToLatLng(this.mouseEventToLayerPoint(t));
        },
        // map initialization methods
        _initContainer: function(t) {
          var e = this._container = Mn(t);
          if (e) {
            if (e._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          j(e, "scroll", this._onScroll, this), this._containerId = p(e);
        },
        _initLayout: function() {
          var t = this._container;
          this._fadeAnimated = this.options.fadeAnimation && z.any3d, G(t, "leaflet-container" + (z.touch ? " leaflet-touch" : "") + (z.retina ? " leaflet-retina" : "") + (z.ielt9 ? " leaflet-oldie" : "") + (z.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var e = He(t, "position");
          e !== "absolute" && e !== "relative" && e !== "fixed" && e !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var t = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), yt(this._mapPane, new I(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (G(t.markerPane, "leaflet-zoom-hide"), G(t.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(t, e, i) {
          yt(this._mapPane, new I(0, 0));
          var n = !this._loaded;
          this._loaded = !0, e = this._limitZoom(e), this.fire("viewprereset");
          var o = this._zoom !== e;
          this._moveStart(o, i)._move(t, e)._moveEnd(o), this.fire("viewreset"), n && this.fire("load");
        },
        _moveStart: function(t, e) {
          return t && this.fire("zoomstart"), e || this.fire("movestart"), this;
        },
        _move: function(t, e, i, n) {
          e === void 0 && (e = this._zoom);
          var o = this._zoom !== e;
          return this._zoom = e, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), n ? i && i.pinch && this.fire("zoom", i) : ((o || i && i.pinch) && this.fire("zoom", i), this.fire("move", i)), this;
        },
        _moveEnd: function(t) {
          return t && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function() {
          return K(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(t) {
          yt(this._mapPane, this._getMapPanePos().subtract(t));
        },
        _getZoomSpan: function() {
          return this.getMaxZoom() - this.getMinZoom();
        },
        _panInsideMaxBounds: function() {
          this._enforcingBounds || this.panInsideBounds(this.options.maxBounds);
        },
        _checkIfLoaded: function() {
          if (!this._loaded)
            throw new Error("Set map center and zoom first.");
        },
        // DOM event handling
        // @section Interaction events
        _initEvents: function(t) {
          this._targets = {}, this._targets[p(this._container)] = this;
          var e = t ? ht : j;
          e(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), z.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          K(this._resizeRequest), this._resizeRequest = D(
            function() {
              this.invalidateSize({ debounceMoveend: !0 });
            },
            this
          );
        },
        _onScroll: function() {
          this._container.scrollTop = 0, this._container.scrollLeft = 0;
        },
        _onMoveEnd: function() {
          var t = this._getMapPanePos();
          Math.max(Math.abs(t.x), Math.abs(t.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
        },
        _findEventTargets: function(t, e) {
          for (var i = [], n, o = e === "mouseout" || e === "mouseover", s = t.target || t.srcElement, l = !1; s; ) {
            if (n = this._targets[p(s)], n && (e === "click" || e === "preclick") && this._draggableMoved(n)) {
              l = !0;
              break;
            }
            if (n && n.listens(e, !0) && (o && !Yi(s, t) || (i.push(n), o)) || s === this._container)
              break;
            s = s.parentNode;
          }
          return !i.length && !l && !o && this.listens(e, !0) && (i = [this]), i;
        },
        _isClickDisabled: function(t) {
          for (; t && t !== this._container; ) {
            if (t._leaflet_disable_click)
              return !0;
            t = t.parentNode;
          }
        },
        _handleDOMEvent: function(t) {
          var e = t.target || t.srcElement;
          if (!(!this._loaded || e._leaflet_disable_events || t.type === "click" && this._isClickDisabled(e))) {
            var i = t.type;
            i === "mousedown" && ji(e), this._fireDOMEvent(t, i);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(t, e, i) {
          if (t.type === "click") {
            var n = u({}, t);
            n.type = "preclick", this._fireDOMEvent(n, n.type, i);
          }
          var o = this._findEventTargets(t, e);
          if (i) {
            for (var s = [], l = 0; l < i.length; l++)
              i[l].listens(e, !0) && s.push(i[l]);
            o = s.concat(o);
          }
          if (o.length) {
            e === "contextmenu" && Lt(t);
            var d = o[0], _ = {
              originalEvent: t
            };
            if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
              var b = d.getLatLng && (!d._radius || d._radius <= 10);
              _.containerPoint = b ? this.latLngToContainerPoint(d.getLatLng()) : this.mouseEventToContainerPoint(t), _.layerPoint = this.containerPointToLayerPoint(_.containerPoint), _.latlng = b ? d.getLatLng() : this.layerPointToLatLng(_.layerPoint);
            }
            for (l = 0; l < o.length; l++)
              if (o[l].fire(e, _, !0), _.originalEvent._stopped || o[l].options.bubblingMouseEvents === !1 && C(this._mouseEvents, e) !== -1)
                return;
          }
        },
        _draggableMoved: function(t) {
          return t = t.dragging && t.dragging.enabled() ? t : this, t.dragging && t.dragging.moved() || this.boxZoom && this.boxZoom.moved();
        },
        _clearHandlers: function() {
          for (var t = 0, e = this._handlers.length; t < e; t++)
            this._handlers[t].disable();
        },
        // @section Other Methods
        // @method whenReady(fn: Function, context?: Object): this
        // Runs the given function `fn` when the map gets initialized with
        // a view (center and zoom) and at least one layer, or immediately
        // if it's already initialized, optionally passing a function context.
        whenReady: function(t, e) {
          return this._loaded ? t.call(e || this, { target: this }) : this.on("load", t, e), this;
        },
        // private methods for getting map state
        _getMapPanePos: function() {
          return ve(this._mapPane) || new I(0, 0);
        },
        _moved: function() {
          var t = this._getMapPanePos();
          return t && !t.equals([0, 0]);
        },
        _getTopLeftPoint: function(t, e) {
          var i = t && e !== void 0 ? this._getNewPixelOrigin(t, e) : this.getPixelOrigin();
          return i.subtract(this._getMapPanePos());
        },
        _getNewPixelOrigin: function(t, e) {
          var i = this.getSize()._divideBy(2);
          return this.project(t, e)._subtract(i)._add(this._getMapPanePos())._round();
        },
        _latLngToNewLayerPoint: function(t, e, i) {
          var n = this._getNewPixelOrigin(i, e);
          return this.project(t, e)._subtract(n);
        },
        _latLngBoundsToNewLayerBounds: function(t, e, i) {
          var n = this._getNewPixelOrigin(i, e);
          return et([
            this.project(t.getSouthWest(), e)._subtract(n),
            this.project(t.getNorthWest(), e)._subtract(n),
            this.project(t.getSouthEast(), e)._subtract(n),
            this.project(t.getNorthEast(), e)._subtract(n)
          ]);
        },
        // layer point of the current center
        _getCenterLayerPoint: function() {
          return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
        },
        // offset of the specified place to the current center in pixels
        _getCenterOffset: function(t) {
          return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint());
        },
        // adjust center for view to get inside bounds
        _limitCenter: function(t, e, i) {
          if (!i)
            return t;
          var n = this.project(t, e), o = this.getSize().divideBy(2), s = new F(n.subtract(o), n.add(o)), l = this._getBoundsOffset(s, i, e);
          return Math.abs(l.x) <= 1 && Math.abs(l.y) <= 1 ? t : this.unproject(n.add(l), e);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(t, e) {
          if (!e)
            return t;
          var i = this.getPixelBounds(), n = new F(i.min.add(t), i.max.add(t));
          return t.add(this._getBoundsOffset(n, e));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(t, e, i) {
          var n = et(
            this.project(e.getNorthEast(), i),
            this.project(e.getSouthWest(), i)
          ), o = n.min.subtract(t.min), s = n.max.subtract(t.max), l = this._rebound(o.x, -s.x), d = this._rebound(o.y, -s.y);
          return new I(l, d);
        },
        _rebound: function(t, e) {
          return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e));
        },
        _limitZoom: function(t) {
          var e = this.getMinZoom(), i = this.getMaxZoom(), n = z.any3d ? this.options.zoomSnap : 1;
          return n && (t = Math.round(t / n) * n), Math.max(e, Math.min(i, t));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          pt(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(t, e) {
          var i = this._getCenterOffset(t)._trunc();
          return (e && e.animate) !== !0 && !this.getSize().contains(i) ? !1 : (this.panBy(i, e), !0);
        },
        _createAnimProxy: function() {
          var t = this._proxy = Q("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(t), this.on("zoomanim", function(e) {
            var i = Bi, n = this._proxy.style[i];
            ge(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), n === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          ct(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var t = this.getCenter(), e = this.getZoom();
          ge(this._proxy, this.project(t, e), this.getZoomScale(e, 1));
        },
        _catchTransitionEnd: function(t) {
          this._animatingZoom && t.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
        },
        _nothingToAnimate: function() {
          return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
        },
        _tryAnimatedZoom: function(t, e, i) {
          if (this._animatingZoom)
            return !0;
          if (i = i || {}, !this._zoomAnimated || i.animate === !1 || this._nothingToAnimate() || Math.abs(e - this._zoom) > this.options.zoomAnimationThreshold)
            return !1;
          var n = this.getZoomScale(e), o = this._getCenterOffset(t)._divideBy(1 - 1 / n);
          return i.animate !== !0 && !this.getSize().contains(o) ? !1 : (D(function() {
            this._moveStart(!0, i.noMoveStart || !1)._animateZoom(t, e, !0);
          }, this), !0);
        },
        _animateZoom: function(t, e, i, n) {
          this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, G(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: t,
            zoom: e,
            noUpdate: n
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(m(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && pt(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function cs(t, e) {
        return new Y(t, e);
      }
      var jt = ut.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(t) {
          M(this, t);
        },
        /* @section
         * Classes extending L.Control will inherit the following methods:
         *
         * @method getPosition: string
         * Returns the position of the control.
         */
        getPosition: function() {
          return this.options.position;
        },
        // @method setPosition(position: string): this
        // Sets the position of the control.
        setPosition: function(t) {
          var e = this._map;
          return e && e.removeControl(this), this.options.position = t, e && e.addControl(this), this;
        },
        // @method getContainer: HTMLElement
        // Returns the HTMLElement that contains the control.
        getContainer: function() {
          return this._container;
        },
        // @method addTo(map: Map): this
        // Adds the control to the given map.
        addTo: function(t) {
          this.remove(), this._map = t;
          var e = this._container = this.onAdd(t), i = this.getPosition(), n = t._controlCorners[i];
          return G(e, "leaflet-control"), i.indexOf("bottom") !== -1 ? n.insertBefore(e, n.firstChild) : n.appendChild(e), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (ct(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(t) {
          this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
        }
      }), Ge = function(t) {
        return new jt(t);
      };
      Y.include({
        // @method addControl(control: Control): this
        // Adds the given control to the map
        addControl: function(t) {
          return t.addTo(this), this;
        },
        // @method removeControl(control: Control): this
        // Removes the given control from the map
        removeControl: function(t) {
          return t.remove(), this;
        },
        _initControlPos: function() {
          var t = this._controlCorners = {}, e = "leaflet-", i = this._controlContainer = Q("div", e + "control-container", this._container);
          function n(o, s) {
            var l = e + o + " " + e + s;
            t[o + s] = Q("div", l, i);
          }
          n("top", "left"), n("top", "right"), n("bottom", "left"), n("bottom", "right");
        },
        _clearControlPos: function() {
          for (var t in this._controlCorners)
            ct(this._controlCorners[t]);
          ct(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var An = jt.extend({
        // @section
        // @aka Control.Layers options
        options: {
          // @option collapsed: Boolean = true
          // If `true`, the control will be collapsed into an icon and expanded on mouse hover, touch, or keyboard activation.
          collapsed: !0,
          position: "topright",
          // @option autoZIndex: Boolean = true
          // If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
          autoZIndex: !0,
          // @option hideSingleBase: Boolean = false
          // If `true`, the base layers in the control will be hidden when there is only one.
          hideSingleBase: !1,
          // @option sortLayers: Boolean = false
          // Whether to sort the layers. When `false`, layers will keep the order
          // in which they were added to the control.
          sortLayers: !1,
          // @option sortFunction: Function = *
          // A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
          // that will be used for sorting the layers, when `sortLayers` is `true`.
          // The function receives both the `L.Layer` instances and their names, as in
          // `sortFunction(layerA, layerB, nameA, nameB)`.
          // By default, it sorts layers alphabetically by their name.
          sortFunction: function(t, e, i, n) {
            return i < n ? -1 : n < i ? 1 : 0;
          }
        },
        initialize: function(t, e, i) {
          M(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
          for (var n in t)
            this._addLayer(t[n], n);
          for (n in e)
            this._addLayer(e[n], n, !0);
        },
        onAdd: function(t) {
          this._initLayout(), this._update(), this._map = t, t.on("zoomend", this._checkDisabledLayers, this);
          for (var e = 0; e < this._layers.length; e++)
            this._layers[e].layer.on("add remove", this._onLayerChange, this);
          return this._container;
        },
        addTo: function(t) {
          return jt.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
        },
        onRemove: function() {
          this._map.off("zoomend", this._checkDisabledLayers, this);
          for (var t = 0; t < this._layers.length; t++)
            this._layers[t].layer.off("add remove", this._onLayerChange, this);
        },
        // @method addBaseLayer(layer: Layer, name: String): this
        // Adds a base layer (radio button entry) with the given name to the control.
        addBaseLayer: function(t, e) {
          return this._addLayer(t, e), this._map ? this._update() : this;
        },
        // @method addOverlay(layer: Layer, name: String): this
        // Adds an overlay (checkbox entry) with the given name to the control.
        addOverlay: function(t, e) {
          return this._addLayer(t, e, !0), this._map ? this._update() : this;
        },
        // @method removeLayer(layer: Layer): this
        // Remove the given layer from the control.
        removeLayer: function(t) {
          t.off("add remove", this._onLayerChange, this);
          var e = this._getLayer(p(t));
          return e && this._layers.splice(this._layers.indexOf(e), 1), this._map ? this._update() : this;
        },
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: function() {
          G(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var t = this._map.getSize().y - (this._container.offsetTop + 50);
          return t < this._section.clientHeight ? (G(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : pt(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return pt(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var t = "leaflet-control-layers", e = this._container = Q("div", t), i = this.options.collapsed;
          e.setAttribute("aria-haspopup", !0), qe(e), Ki(e);
          var n = this._section = Q("section", t + "-list");
          i && (this._map.on("click", this.collapse, this), j(e, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var o = this._layersLink = Q("a", t + "-toggle", e);
          o.href = "#", o.title = "Layers", o.setAttribute("role", "button"), j(o, {
            keydown: function(s) {
              s.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(s) {
              Lt(s), this._expandSafely();
            }
          }, this), i || this.expand(), this._baseLayersList = Q("div", t + "-base", n), this._separator = Q("div", t + "-separator", n), this._overlaysList = Q("div", t + "-overlays", n), e.appendChild(n);
        },
        _getLayer: function(t) {
          for (var e = 0; e < this._layers.length; e++)
            if (this._layers[e] && p(this._layers[e].layer) === t)
              return this._layers[e];
        },
        _addLayer: function(t, e, i) {
          this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: t,
            name: e,
            overlay: i
          }), this.options.sortLayers && this._layers.sort(m(function(n, o) {
            return this.options.sortFunction(n.layer, o.layer, n.name, o.name);
          }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          hi(this._baseLayersList), hi(this._overlaysList), this._layerControlInputs = [];
          var t, e, i, n, o = 0;
          for (i = 0; i < this._layers.length; i++)
            n = this._layers[i], this._addItem(n), e = e || n.overlay, t = t || !n.overlay, o += n.overlay ? 0 : 1;
          return this.options.hideSingleBase && (t = t && o > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = e && t ? "" : "none", this;
        },
        _onLayerChange: function(t) {
          this._handlingClick || this._update();
          var e = this._getLayer(p(t.target)), i = e.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
          i && this._map.fire(i, e);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(t, e) {
          var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", n = document.createElement("div");
          return n.innerHTML = i, n.firstChild;
        },
        _addItem: function(t) {
          var e = document.createElement("label"), i = this._map.hasLayer(t.layer), n;
          t.overlay ? (n = document.createElement("input"), n.type = "checkbox", n.className = "leaflet-control-layers-selector", n.defaultChecked = i) : n = this._createRadioElement("leaflet-base-layers_" + p(this), i), this._layerControlInputs.push(n), n.layerId = p(t.layer), j(n, "click", this._onInputClick, this);
          var o = document.createElement("span");
          o.innerHTML = " " + t.name;
          var s = document.createElement("span");
          e.appendChild(s), s.appendChild(n), s.appendChild(o);
          var l = t.overlay ? this._overlaysList : this._baseLayersList;
          return l.appendChild(e), this._checkDisabledLayers(), e;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var t = this._layerControlInputs, e, i, n = [], o = [];
            this._handlingClick = !0;
            for (var s = t.length - 1; s >= 0; s--)
              e = t[s], i = this._getLayer(e.layerId).layer, e.checked ? n.push(i) : e.checked || o.push(i);
            for (s = 0; s < o.length; s++)
              this._map.hasLayer(o[s]) && this._map.removeLayer(o[s]);
            for (s = 0; s < n.length; s++)
              this._map.hasLayer(n[s]) || this._map.addLayer(n[s]);
            this._handlingClick = !1, this._refocusOnMap();
          }
        },
        _checkDisabledLayers: function() {
          for (var t = this._layerControlInputs, e, i, n = this._map.getZoom(), o = t.length - 1; o >= 0; o--)
            e = t[o], i = this._getLayer(e.layerId).layer, e.disabled = i.options.minZoom !== void 0 && n < i.options.minZoom || i.options.maxZoom !== void 0 && n > i.options.maxZoom;
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
        _expandSafely: function() {
          var t = this._section;
          this._preventClick = !0, j(t, "click", Lt), this.expand();
          var e = this;
          setTimeout(function() {
            ht(t, "click", Lt), e._preventClick = !1;
          });
        }
      }), ds = function(t, e, i) {
        return new An(t, e, i);
      }, Xi = jt.extend({
        // @section
        // @aka Control.Zoom options
        options: {
          position: "topleft",
          // @option zoomInText: String = '<span aria-hidden="true">+</span>'
          // The text set on the 'zoom in' button.
          zoomInText: '<span aria-hidden="true">+</span>',
          // @option zoomInTitle: String = 'Zoom in'
          // The title set on the 'zoom in' button.
          zoomInTitle: "Zoom in",
          // @option zoomOutText: String = '<span aria-hidden="true">&#x2212;</span>'
          // The text set on the 'zoom out' button.
          zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
          // @option zoomOutTitle: String = 'Zoom out'
          // The title set on the 'zoom out' button.
          zoomOutTitle: "Zoom out"
        },
        onAdd: function(t) {
          var e = "leaflet-control-zoom", i = Q("div", e + " leaflet-bar"), n = this.options;
          return this._zoomInButton = this._createButton(
            n.zoomInText,
            n.zoomInTitle,
            e + "-in",
            i,
            this._zoomIn
          ), this._zoomOutButton = this._createButton(
            n.zoomOutText,
            n.zoomOutTitle,
            e + "-out",
            i,
            this._zoomOut
          ), this._updateDisabled(), t.on("zoomend zoomlevelschange", this._updateDisabled, this), i;
        },
        onRemove: function(t) {
          t.off("zoomend zoomlevelschange", this._updateDisabled, this);
        },
        disable: function() {
          return this._disabled = !0, this._updateDisabled(), this;
        },
        enable: function() {
          return this._disabled = !1, this._updateDisabled(), this;
        },
        _zoomIn: function(t) {
          !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
        },
        _zoomOut: function(t) {
          !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
        },
        _createButton: function(t, e, i, n, o) {
          var s = Q("a", i, n);
          return s.innerHTML = t, s.href = "#", s.title = e, s.setAttribute("role", "button"), s.setAttribute("aria-label", e), qe(s), j(s, "click", we), j(s, "click", o, this), j(s, "click", this._refocusOnMap, this), s;
        },
        _updateDisabled: function() {
          var t = this._map, e = "leaflet-disabled";
          pt(this._zoomInButton, e), pt(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (G(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (G(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      Y.mergeOptions({
        zoomControl: !0
      }), Y.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new Xi(), this.addControl(this.zoomControl));
      });
      var fs = function(t) {
        return new Xi(t);
      }, In = jt.extend({
        // @section
        // @aka Control.Scale options
        options: {
          position: "bottomleft",
          // @option maxWidth: Number = 100
          // Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
          maxWidth: 100,
          // @option metric: Boolean = True
          // Whether to show the metric scale line (m/km).
          metric: !0,
          // @option imperial: Boolean = True
          // Whether to show the imperial scale line (mi/ft).
          imperial: !0
          // @option updateWhenIdle: Boolean = false
          // If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
        },
        onAdd: function(t) {
          var e = "leaflet-control-scale", i = Q("div", e), n = this.options;
          return this._addScales(n, e + "-line", i), t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i;
        },
        onRemove: function(t) {
          t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(t, e, i) {
          t.metric && (this._mScale = Q("div", e, i)), t.imperial && (this._iScale = Q("div", e, i));
        },
        _update: function() {
          var t = this._map, e = t.getSize().y / 2, i = t.distance(
            t.containerPointToLatLng([0, e]),
            t.containerPointToLatLng([this.options.maxWidth, e])
          );
          this._updateScales(i);
        },
        _updateScales: function(t) {
          this.options.metric && t && this._updateMetric(t), this.options.imperial && t && this._updateImperial(t);
        },
        _updateMetric: function(t) {
          var e = this._getRoundNum(t), i = e < 1e3 ? e + " m" : e / 1e3 + " km";
          this._updateScale(this._mScale, i, e / t);
        },
        _updateImperial: function(t) {
          var e = t * 3.2808399, i, n, o;
          e > 5280 ? (i = e / 5280, n = this._getRoundNum(i), this._updateScale(this._iScale, n + " mi", n / i)) : (o = this._getRoundNum(e), this._updateScale(this._iScale, o + " ft", o / e));
        },
        _updateScale: function(t, e, i) {
          t.style.width = Math.round(this.options.maxWidth * i) + "px", t.innerHTML = e;
        },
        _getRoundNum: function(t) {
          var e = Math.pow(10, (Math.floor(t) + "").length - 1), i = t / e;
          return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, e * i;
        }
      }), ms = function(t) {
        return new In(t);
      }, _s = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', Ji = jt.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (z.inlineSvg ? _s + " " : "") + "Leaflet</a>"
        },
        initialize: function(t) {
          M(this, t), this._attributions = {};
        },
        onAdd: function(t) {
          t.attributionControl = this, this._container = Q("div", "leaflet-control-attribution"), qe(this._container);
          for (var e in t._layers)
            t._layers[e].getAttribution && this.addAttribution(t._layers[e].getAttribution());
          return this._update(), t.on("layeradd", this._addAttribution, this), this._container;
        },
        onRemove: function(t) {
          t.off("layeradd", this._addAttribution, this);
        },
        _addAttribution: function(t) {
          t.layer.getAttribution && (this.addAttribution(t.layer.getAttribution()), t.layer.once("remove", function() {
            this.removeAttribution(t.layer.getAttribution());
          }, this));
        },
        // @method setPrefix(prefix: String|false): this
        // The HTML text shown before the attributions. Pass `false` to disable.
        setPrefix: function(t) {
          return this.options.prefix = t, this._update(), this;
        },
        // @method addAttribution(text: String): this
        // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
        addAttribution: function(t) {
          return t ? (this._attributions[t] || (this._attributions[t] = 0), this._attributions[t]++, this._update(), this) : this;
        },
        // @method removeAttribution(text: String): this
        // Removes an attribution text.
        removeAttribution: function(t) {
          return t ? (this._attributions[t] && (this._attributions[t]--, this._update()), this) : this;
        },
        _update: function() {
          if (this._map) {
            var t = [];
            for (var e in this._attributions)
              this._attributions[e] && t.push(e);
            var i = [];
            this.options.prefix && i.push(this.options.prefix), t.length && i.push(t.join(", ")), this._container.innerHTML = i.join(' <span aria-hidden="true">|</span> ');
          }
        }
      });
      Y.mergeOptions({
        attributionControl: !0
      }), Y.addInitHook(function() {
        this.options.attributionControl && new Ji().addTo(this);
      });
      var ps = function(t) {
        return new Ji(t);
      };
      jt.Layers = An, jt.Zoom = Xi, jt.Scale = In, jt.Attribution = Ji, Ge.layers = ds, Ge.zoom = fs, Ge.scale = ms, Ge.attribution = ps;
      var Yt = ut.extend({
        initialize: function(t) {
          this._map = t;
        },
        // @method enable(): this
        // Enables the handler
        enable: function() {
          return this._enabled ? this : (this._enabled = !0, this.addHooks(), this);
        },
        // @method disable(): this
        // Disables the handler
        disable: function() {
          return this._enabled ? (this._enabled = !1, this.removeHooks(), this) : this;
        },
        // @method enabled(): Boolean
        // Returns `true` if the handler is enabled
        enabled: function() {
          return !!this._enabled;
        }
        // @section Extension methods
        // Classes inheriting from `Handler` must implement the two following methods:
        // @method addHooks()
        // Called when the handler is enabled, should add event hooks.
        // @method removeHooks()
        // Called when the handler is disabled, should remove the event hooks added previously.
      });
      Yt.addTo = function(t, e) {
        return t.addHandler(e, this), this;
      };
      var gs = { Events: mt }, Nn = z.touch ? "touchstart mousedown" : "mousedown", ue = dt.extend({
        options: {
          // @section
          // @aka Draggable options
          // @option clickTolerance: Number = 3
          // The max number of pixels a user can shift the mouse pointer during a click
          // for it to be considered a valid click (as opposed to a mouse drag).
          clickTolerance: 3
        },
        // @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
        // Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
        initialize: function(t, e, i, n) {
          M(this, n), this._element = t, this._dragStartTarget = e || t, this._preventOutline = i;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (j(this._dragStartTarget, Nn, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (ue._dragging === this && this.finishDrag(!0), ht(this._dragStartTarget, Nn, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(t) {
          if (this._enabled && (this._moved = !1, !Ri(this._element, "leaflet-zoom-anim"))) {
            if (t.touches && t.touches.length !== 1) {
              ue._dragging === this && this.finishDrag();
              return;
            }
            if (!(ue._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (ue._dragging = this, this._preventOutline && ji(this._element), Hi(), We(), !this._moving)) {
              this.fire("down");
              var e = t.touches ? t.touches[0] : t, i = kn(this._element);
              this._startPoint = new I(e.clientX, e.clientY), this._startPos = ve(this._element), this._parentScale = qi(i);
              var n = t.type === "mousedown";
              j(document, n ? "mousemove" : "touchmove", this._onMove, this), j(document, n ? "mouseup" : "touchend touchcancel", this._onUp, this);
            }
          }
        },
        _onMove: function(t) {
          if (this._enabled) {
            if (t.touches && t.touches.length > 1) {
              this._moved = !0;
              return;
            }
            var e = t.touches && t.touches.length === 1 ? t.touches[0] : t, i = new I(e.clientX, e.clientY)._subtract(this._startPoint);
            !i.x && !i.y || Math.abs(i.x) + Math.abs(i.y) < this.options.clickTolerance || (i.x /= this._parentScale.x, i.y /= this._parentScale.y, Lt(t), this._moved || (this.fire("dragstart"), this._moved = !0, G(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), G(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(i), this._moving = !0, this._lastEvent = t, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var t = { originalEvent: this._lastEvent };
          this.fire("predrag", t), yt(this._element, this._newPos), this.fire("drag", t);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(t) {
          pt(document.body, "leaflet-dragging"), this._lastTarget && (pt(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), ht(document, "mousemove touchmove", this._onMove, this), ht(document, "mouseup touchend touchcancel", this._onUp, this), Wi(), Ue();
          var e = this._moved && this._moving;
          this._moving = !1, ue._dragging = !1, e && this.fire("dragend", {
            noInertia: t,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function Zn(t, e, i) {
        var n, o = [1, 4, 2, 8], s, l, d, _, b, k, Z, V;
        for (s = 0, k = t.length; s < k; s++)
          t[s]._code = xe(t[s], e);
        for (d = 0; d < 4; d++) {
          for (Z = o[d], n = [], s = 0, k = t.length, l = k - 1; s < k; l = s++)
            _ = t[s], b = t[l], _._code & Z ? b._code & Z || (V = fi(b, _, Z, e, i), V._code = xe(V, e), n.push(V)) : (b._code & Z && (V = fi(b, _, Z, e, i), V._code = xe(V, e), n.push(V)), n.push(_));
          t = n;
        }
        return t;
      }
      function Bn(t, e) {
        var i, n, o, s, l, d, _, b, k;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Dt(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var Z = $([0, 0]), V = nt(t), St = V.getNorthWest().distanceTo(V.getSouthWest()) * V.getNorthEast().distanceTo(V.getNorthWest());
        St < 1700 && (Z = Qi(t));
        var xt = t.length, Ft = [];
        for (i = 0; i < xt; i++) {
          var Et = $(t[i]);
          Ft.push(e.project($([Et.lat - Z.lat, Et.lng - Z.lng])));
        }
        for (d = _ = b = 0, i = 0, n = xt - 1; i < xt; n = i++)
          o = Ft[i], s = Ft[n], l = o.y * s.x - s.y * o.x, _ += (o.x + s.x) * l, b += (o.y + s.y) * l, d += l * 3;
        d === 0 ? k = Ft[0] : k = [_ / d, b / d];
        var Ne = e.unproject(N(k));
        return $([Ne.lat + Z.lat, Ne.lng + Z.lng]);
      }
      function Qi(t) {
        for (var e = 0, i = 0, n = 0, o = 0; o < t.length; o++) {
          var s = $(t[o]);
          e += s.lat, i += s.lng, n++;
        }
        return $([e / n, i / n]);
      }
      var vs = {
        __proto__: null,
        clipPolygon: Zn,
        polygonCenter: Bn,
        centroid: Qi
      };
      function Rn(t, e) {
        if (!e || !t.length)
          return t.slice();
        var i = e * e;
        return t = xs(t, i), t = ws(t, i), t;
      }
      function Dn(t, e, i) {
        return Math.sqrt(Ve(t, e, i, !0));
      }
      function ys(t, e, i) {
        return Ve(t, e, i);
      }
      function ws(t, e) {
        var i = t.length, n = typeof Uint8Array < "u" ? Uint8Array : Array, o = new n(i);
        o[0] = o[i - 1] = 1, tn(t, o, e, 0, i - 1);
        var s, l = [];
        for (s = 0; s < i; s++)
          o[s] && l.push(t[s]);
        return l;
      }
      function tn(t, e, i, n, o) {
        var s = 0, l, d, _;
        for (d = n + 1; d <= o - 1; d++)
          _ = Ve(t[d], t[n], t[o], !0), _ > s && (l = d, s = _);
        s > i && (e[l] = 1, tn(t, e, i, n, l), tn(t, e, i, l, o));
      }
      function xs(t, e) {
        for (var i = [t[0]], n = 1, o = 0, s = t.length; n < s; n++)
          bs(t[n], t[o]) > e && (i.push(t[n]), o = n);
        return o < s - 1 && i.push(t[s - 1]), i;
      }
      var Fn;
      function Hn(t, e, i, n, o) {
        var s = n ? Fn : xe(t, i), l = xe(e, i), d, _, b;
        for (Fn = l; ; ) {
          if (!(s | l))
            return [t, e];
          if (s & l)
            return !1;
          d = s || l, _ = fi(t, e, d, i, o), b = xe(_, i), d === s ? (t = _, s = b) : (e = _, l = b);
        }
      }
      function fi(t, e, i, n, o) {
        var s = e.x - t.x, l = e.y - t.y, d = n.min, _ = n.max, b, k;
        return i & 8 ? (b = t.x + s * (_.y - t.y) / l, k = _.y) : i & 4 ? (b = t.x + s * (d.y - t.y) / l, k = d.y) : i & 2 ? (b = _.x, k = t.y + l * (_.x - t.x) / s) : i & 1 && (b = d.x, k = t.y + l * (d.x - t.x) / s), new I(b, k, o);
      }
      function xe(t, e) {
        var i = 0;
        return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i;
      }
      function bs(t, e) {
        var i = e.x - t.x, n = e.y - t.y;
        return i * i + n * n;
      }
      function Ve(t, e, i, n) {
        var o = e.x, s = e.y, l = i.x - o, d = i.y - s, _ = l * l + d * d, b;
        return _ > 0 && (b = ((t.x - o) * l + (t.y - s) * d) / _, b > 1 ? (o = i.x, s = i.y) : b > 0 && (o += l * b, s += d * b)), l = t.x - o, d = t.y - s, n ? l * l + d * d : new I(o, s);
      }
      function Dt(t) {
        return !U(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
      }
      function Wn(t) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Dt(t);
      }
      function Un(t, e) {
        var i, n, o, s, l, d, _, b;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Dt(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var k = $([0, 0]), Z = nt(t), V = Z.getNorthWest().distanceTo(Z.getSouthWest()) * Z.getNorthEast().distanceTo(Z.getNorthWest());
        V < 1700 && (k = Qi(t));
        var St = t.length, xt = [];
        for (i = 0; i < St; i++) {
          var Ft = $(t[i]);
          xt.push(e.project($([Ft.lat - k.lat, Ft.lng - k.lng])));
        }
        for (i = 0, n = 0; i < St - 1; i++)
          n += xt[i].distanceTo(xt[i + 1]) / 2;
        if (n === 0)
          b = xt[0];
        else
          for (i = 0, s = 0; i < St - 1; i++)
            if (l = xt[i], d = xt[i + 1], o = l.distanceTo(d), s += o, s > n) {
              _ = (s - n) / o, b = [
                d.x - _ * (d.x - l.x),
                d.y - _ * (d.y - l.y)
              ];
              break;
            }
        var Et = e.unproject(N(b));
        return $([Et.lat + k.lat, Et.lng + k.lng]);
      }
      var Ps = {
        __proto__: null,
        simplify: Rn,
        pointToSegmentDistance: Dn,
        closestPointOnSegment: ys,
        clipSegment: Hn,
        _getEdgeIntersection: fi,
        _getBitCode: xe,
        _sqClosestPointOnSegment: Ve,
        isFlat: Dt,
        _flat: Wn,
        polylineCenter: Un
      }, en = {
        project: function(t) {
          return new I(t.lng, t.lat);
        },
        unproject: function(t) {
          return new J(t.y, t.x);
        },
        bounds: new F([-180, -90], [180, 90])
      }, nn = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new F([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(t) {
          var e = Math.PI / 180, i = this.R, n = t.lat * e, o = this.R_MINOR / i, s = Math.sqrt(1 - o * o), l = s * Math.sin(n), d = Math.tan(Math.PI / 4 - n / 2) / Math.pow((1 - l) / (1 + l), s / 2);
          return n = -i * Math.log(Math.max(d, 1e-10)), new I(t.lng * e * i, n);
        },
        unproject: function(t) {
          for (var e = 180 / Math.PI, i = this.R, n = this.R_MINOR / i, o = Math.sqrt(1 - n * n), s = Math.exp(-t.y / i), l = Math.PI / 2 - 2 * Math.atan(s), d = 0, _ = 0.1, b; d < 15 && Math.abs(_) > 1e-7; d++)
            b = o * Math.sin(l), b = Math.pow((1 - b) / (1 + b), o / 2), _ = Math.PI / 2 - 2 * Math.atan(s * b) - l, l += _;
          return new J(l * e, t.x * e / i);
        }
      }, Ls = {
        __proto__: null,
        LonLat: en,
        Mercator: nn,
        SphericalMercator: ot
      }, Ts = u({}, At, {
        code: "EPSG:3395",
        projection: nn,
        transformation: (function() {
          var t = 0.5 / (Math.PI * nn.R);
          return he(t, 0.5, -t, 0.5);
        })()
      }), jn = u({}, At, {
        code: "EPSG:4326",
        projection: en,
        transformation: he(1 / 180, 1, -1 / 180, 0.5)
      }), Ms = u({}, Ct, {
        projection: en,
        transformation: he(1, 0, -1, 0),
        scale: function(t) {
          return Math.pow(2, t);
        },
        zoom: function(t) {
          return Math.log(t) / Math.LN2;
        },
        distance: function(t, e) {
          var i = e.lng - t.lng, n = e.lat - t.lat;
          return Math.sqrt(i * i + n * n);
        },
        infinite: !0
      });
      Ct.Earth = At, Ct.EPSG3395 = Ts, Ct.EPSG3857 = gt, Ct.EPSG900913 = ii, Ct.EPSG4326 = jn, Ct.Simple = Ms;
      var qt = dt.extend({
        // Classes extending `L.Layer` will inherit the following options:
        options: {
          // @option pane: String = 'overlayPane'
          // By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
          pane: "overlayPane",
          // @option attribution: String = null
          // String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
          attribution: null,
          bubblingMouseEvents: !0
        },
        /* @section
         * Classes extending `L.Layer` will inherit the following methods:
         *
         * @method addTo(map: Map|LayerGroup): this
         * Adds the layer to the given map or layer group.
         */
        addTo: function(t) {
          return t.addLayer(this), this;
        },
        // @method remove: this
        // Removes the layer from the map it is currently active on.
        remove: function() {
          return this.removeFrom(this._map || this._mapToAdd);
        },
        // @method removeFrom(map: Map): this
        // Removes the layer from the given map
        //
        // @alternative
        // @method removeFrom(group: LayerGroup): this
        // Removes the layer from the given `LayerGroup`
        removeFrom: function(t) {
          return t && t.removeLayer(this), this;
        },
        // @method getPane(name? : String): HTMLElement
        // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
        getPane: function(t) {
          return this._map.getPane(t ? this.options[t] || t : this.options.pane);
        },
        addInteractiveTarget: function(t) {
          return this._map._targets[p(t)] = this, this;
        },
        removeInteractiveTarget: function(t) {
          return delete this._map._targets[p(t)], this;
        },
        // @method getAttribution: String
        // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
        getAttribution: function() {
          return this.options.attribution;
        },
        _layerAdd: function(t) {
          var e = t.target;
          if (e.hasLayer(this)) {
            if (this._map = e, this._zoomAnimated = e._zoomAnimated, this.getEvents) {
              var i = this.getEvents();
              e.on(i, this), this.once("remove", function() {
                e.off(i, this);
              }, this);
            }
            this.onAdd(e), this.fire("add"), e.fire("layeradd", { layer: this });
          }
        }
      });
      Y.include({
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the map
        addLayer: function(t) {
          if (!t._layerAdd)
            throw new Error("The provided object is not a Layer.");
          var e = p(t);
          return this._layers[e] ? this : (this._layers[e] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: function(t) {
          var e = p(t);
          return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: function(t) {
          return p(t) in this._layers;
        },
        /* @method eachLayer(fn: Function, context?: Object): this
         * Iterates over the layers of the map, optionally specifying context of the iterator function.
         * ```
         * map.eachLayer(function(layer){
         *     layer.bindPopup('Hello');
         * });
         * ```
         */
        eachLayer: function(t, e) {
          for (var i in this._layers)
            t.call(e, this._layers[i]);
          return this;
        },
        _addLayers: function(t) {
          t = t ? U(t) ? t : [t] : [];
          for (var e = 0, i = t.length; e < i; e++)
            this.addLayer(t[e]);
        },
        _addZoomLimit: function(t) {
          (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[p(t)] = t, this._updateZoomLevels());
        },
        _removeZoomLimit: function(t) {
          var e = p(t);
          this._zoomBoundLayers[e] && (delete this._zoomBoundLayers[e], this._updateZoomLevels());
        },
        _updateZoomLevels: function() {
          var t = 1 / 0, e = -1 / 0, i = this._getZoomSpan();
          for (var n in this._zoomBoundLayers) {
            var o = this._zoomBoundLayers[n].options;
            t = o.minZoom === void 0 ? t : Math.min(t, o.minZoom), e = o.maxZoom === void 0 ? e : Math.max(e, o.maxZoom);
          }
          this._layersMaxZoom = e === -1 / 0 ? void 0 : e, this._layersMinZoom = t === 1 / 0 ? void 0 : t, i !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
        }
      });
      var Ee = qt.extend({
        initialize: function(t, e) {
          M(this, e), this._layers = {};
          var i, n;
          if (t)
            for (i = 0, n = t.length; i < n; i++)
              this.addLayer(t[i]);
        },
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the group.
        addLayer: function(t) {
          var e = this.getLayerId(t);
          return this._layers[e] = t, this._map && this._map.addLayer(t), this;
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the group.
        // @alternative
        // @method removeLayer(id: Number): this
        // Removes the layer with the given internal ID from the group.
        removeLayer: function(t) {
          var e = t in this._layers ? t : this.getLayerId(t);
          return this._map && this._layers[e] && this._map.removeLayer(this._layers[e]), delete this._layers[e], this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the group.
        // @alternative
        // @method hasLayer(id: Number): Boolean
        // Returns `true` if the given internal ID is currently added to the group.
        hasLayer: function(t) {
          var e = typeof t == "number" ? t : this.getLayerId(t);
          return e in this._layers;
        },
        // @method clearLayers(): this
        // Removes all the layers from the group.
        clearLayers: function() {
          return this.eachLayer(this.removeLayer, this);
        },
        // @method invoke(methodName: String, …): this
        // Calls `methodName` on every layer contained in this group, passing any
        // additional parameters. Has no effect if the layers contained do not
        // implement `methodName`.
        invoke: function(t) {
          var e = Array.prototype.slice.call(arguments, 1), i, n;
          for (i in this._layers)
            n = this._layers[i], n[t] && n[t].apply(n, e);
          return this;
        },
        onAdd: function(t) {
          this.eachLayer(t.addLayer, t);
        },
        onRemove: function(t) {
          this.eachLayer(t.removeLayer, t);
        },
        // @method eachLayer(fn: Function, context?: Object): this
        // Iterates over the layers of the group, optionally specifying context of the iterator function.
        // ```js
        // group.eachLayer(function (layer) {
        // 	layer.bindPopup('Hello');
        // });
        // ```
        eachLayer: function(t, e) {
          for (var i in this._layers)
            t.call(e, this._layers[i]);
          return this;
        },
        // @method getLayer(id: Number): Layer
        // Returns the layer with the given internal ID.
        getLayer: function(t) {
          return this._layers[t];
        },
        // @method getLayers(): Layer[]
        // Returns an array of all the layers added to the group.
        getLayers: function() {
          var t = [];
          return this.eachLayer(t.push, t), t;
        },
        // @method setZIndex(zIndex: Number): this
        // Calls `setZIndex` on every layer contained in this group, passing the z-index.
        setZIndex: function(t) {
          return this.invoke("setZIndex", t);
        },
        // @method getLayerId(layer: Layer): Number
        // Returns the internal ID for a layer
        getLayerId: function(t) {
          return p(t);
        }
      }), ks = function(t, e) {
        return new Ee(t, e);
      }, ee = Ee.extend({
        addLayer: function(t) {
          return this.hasLayer(t) ? this : (t.addEventParent(this), Ee.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
        },
        removeLayer: function(t) {
          return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), Ee.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
        },
        // @method setStyle(style: Path options): this
        // Sets the given path options to each layer of the group that has a `setStyle` method.
        setStyle: function(t) {
          return this.invoke("setStyle", t);
        },
        // @method bringToFront(): this
        // Brings the layer group to the top of all other layers
        bringToFront: function() {
          return this.invoke("bringToFront");
        },
        // @method bringToBack(): this
        // Brings the layer group to the back of all other layers
        bringToBack: function() {
          return this.invoke("bringToBack");
        },
        // @method getBounds(): LatLngBounds
        // Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
        getBounds: function() {
          var t = new it();
          for (var e in this._layers) {
            var i = this._layers[e];
            t.extend(i.getBounds ? i.getBounds() : i.getLatLng());
          }
          return t;
        }
      }), Ss = function(t, e) {
        return new ee(t, e);
      }, ze = ut.extend({
        /* @section
         * @aka Icon options
         *
         * @option iconUrl: String = null
         * **(required)** The URL to the icon image (absolute or relative to your script path).
         *
         * @option iconRetinaUrl: String = null
         * The URL to a retina sized version of the icon image (absolute or relative to your
         * script path). Used for Retina screen devices.
         *
         * @option iconSize: Point = null
         * Size of the icon image in pixels.
         *
         * @option iconAnchor: Point = null
         * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
         * will be aligned so that this point is at the marker's geographical location. Centered
         * by default if size is specified, also can be set in CSS with negative margins.
         *
         * @option popupAnchor: Point = [0, 0]
         * The coordinates of the point from which popups will "open", relative to the icon anchor.
         *
         * @option tooltipAnchor: Point = [0, 0]
         * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
         *
         * @option shadowUrl: String = null
         * The URL to the icon shadow image. If not specified, no shadow image will be created.
         *
         * @option shadowRetinaUrl: String = null
         *
         * @option shadowSize: Point = null
         * Size of the shadow image in pixels.
         *
         * @option shadowAnchor: Point = null
         * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
         * as iconAnchor if not specified).
         *
         * @option className: String = ''
         * A custom class name to assign to both icon and shadow images. Empty by default.
         */
        options: {
          popupAnchor: [0, 0],
          tooltipAnchor: [0, 0],
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the tiles.
          // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: !1
        },
        initialize: function(t) {
          M(this, t);
        },
        // @method createIcon(oldIcon?: HTMLElement): HTMLElement
        // Called internally when the icon has to be shown, returns a `<img>` HTML element
        // styled according to the options.
        createIcon: function(t) {
          return this._createIcon("icon", t);
        },
        // @method createShadow(oldIcon?: HTMLElement): HTMLElement
        // As `createIcon`, but for the shadow beneath it.
        createShadow: function(t) {
          return this._createIcon("shadow", t);
        },
        _createIcon: function(t, e) {
          var i = this._getIconUrl(t);
          if (!i) {
            if (t === "icon")
              throw new Error("iconUrl not set in Icon options (see the docs).");
            return null;
          }
          var n = this._createImg(i, e && e.tagName === "IMG" ? e : null);
          return this._setIconStyles(n, t), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), n;
        },
        _setIconStyles: function(t, e) {
          var i = this.options, n = i[e + "Size"];
          typeof n == "number" && (n = [n, n]);
          var o = N(n), s = N(e === "shadow" && i.shadowAnchor || i.iconAnchor || o && o.divideBy(2, !0));
          t.className = "leaflet-marker-" + e + " " + (i.className || ""), s && (t.style.marginLeft = -s.x + "px", t.style.marginTop = -s.y + "px"), o && (t.style.width = o.x + "px", t.style.height = o.y + "px");
        },
        _createImg: function(t, e) {
          return e = e || document.createElement("img"), e.src = t, e;
        },
        _getIconUrl: function(t) {
          return z.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
        }
      });
      function Cs(t) {
        return new ze(t);
      }
      var $e = ze.extend({
        options: {
          iconUrl: "marker-icon.png",
          iconRetinaUrl: "marker-icon-2x.png",
          shadowUrl: "marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41]
        },
        _getIconUrl: function(t) {
          return typeof $e.imagePath != "string" && ($e.imagePath = this._detectIconPath()), (this.options.imagePath || $e.imagePath) + ze.prototype._getIconUrl.call(this, t);
        },
        _stripUrl: function(t) {
          var e = function(i, n, o) {
            var s = n.exec(i);
            return s && s[o];
          };
          return t = e(t, /^url\((['"])?(.+)\1\)$/, 2), t && e(t, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var t = Q("div", "leaflet-default-icon-path", document.body), e = He(t, "background-image") || He(t, "backgroundImage");
          if (document.body.removeChild(t), e = this._stripUrl(e), e)
            return e;
          var i = document.querySelector('link[href$="leaflet.css"]');
          return i ? i.href.substring(0, i.href.length - 11 - 1) : "";
        }
      }), qn = Yt.extend({
        initialize: function(t) {
          this._marker = t;
        },
        addHooks: function() {
          var t = this._marker._icon;
          this._draggable || (this._draggable = new ue(t, t, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), G(t, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && pt(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(t) {
          var e = this._marker, i = e._map, n = this._marker.options.autoPanSpeed, o = this._marker.options.autoPanPadding, s = ve(e._icon), l = i.getPixelBounds(), d = i.getPixelOrigin(), _ = et(
            l.min._subtract(d).add(o),
            l.max._subtract(d).subtract(o)
          );
          if (!_.contains(s)) {
            var b = N(
              (Math.max(_.max.x, s.x) - _.max.x) / (l.max.x - _.max.x) - (Math.min(_.min.x, s.x) - _.min.x) / (l.min.x - _.min.x),
              (Math.max(_.max.y, s.y) - _.max.y) / (l.max.y - _.max.y) - (Math.min(_.min.y, s.y) - _.min.y) / (l.min.y - _.min.y)
            ).multiplyBy(n);
            i.panBy(b, { animate: !1 }), this._draggable._newPos._add(b), this._draggable._startPos._add(b), yt(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = D(this._adjustPan.bind(this, t));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(t) {
          this._marker.options.autoPan && (K(this._panRequest), this._panRequest = D(this._adjustPan.bind(this, t)));
        },
        _onDrag: function(t) {
          var e = this._marker, i = e._shadow, n = ve(e._icon), o = e._map.layerPointToLatLng(n);
          i && yt(i, n), e._latlng = o, t.latlng = o, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t);
        },
        _onDragEnd: function(t) {
          K(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
        }
      }), mi = qt.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new $e(),
          // Option inherited from "Interactive layer" abstract class
          interactive: !0,
          // @option keyboard: Boolean = true
          // Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
          keyboard: !0,
          // @option title: String = ''
          // Text for the browser tooltip that appear on marker hover (no tooltip by default).
          // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
          title: "",
          // @option alt: String = 'Marker'
          // Text for the `alt` attribute of the icon image.
          // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
          alt: "Marker",
          // @option zIndexOffset: Number = 0
          // By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
          zIndexOffset: 0,
          // @option opacity: Number = 1.0
          // The opacity of the marker.
          opacity: 1,
          // @option riseOnHover: Boolean = false
          // If `true`, the marker will get on top of others when you hover the mouse over it.
          riseOnHover: !1,
          // @option riseOffset: Number = 250
          // The z-index offset used for the `riseOnHover` feature.
          riseOffset: 250,
          // @option pane: String = 'markerPane'
          // `Map pane` where the markers icon will be added.
          pane: "markerPane",
          // @option shadowPane: String = 'shadowPane'
          // `Map pane` where the markers shadow will be added.
          shadowPane: "shadowPane",
          // @option bubblingMouseEvents: Boolean = false
          // When `true`, a mouse event on this marker will trigger the same event on the map
          // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
          bubblingMouseEvents: !1,
          // @option autoPanOnFocus: Boolean = true
          // When `true`, the map will pan whenever the marker is focused (via
          // e.g. pressing `tab` on the keyboard) to ensure the marker is
          // visible within the map's bounds
          autoPanOnFocus: !0,
          // @section Draggable marker options
          // @option draggable: Boolean = false
          // Whether the marker is draggable with mouse/touch or not.
          draggable: !1,
          // @option autoPan: Boolean = false
          // Whether to pan the map when dragging this marker near its edge or not.
          autoPan: !1,
          // @option autoPanPadding: Point = Point(50, 50)
          // Distance (in pixels to the left/right and to the top/bottom) of the
          // map edge to start panning the map.
          autoPanPadding: [50, 50],
          // @option autoPanSpeed: Number = 10
          // Number of pixels the map should pan by.
          autoPanSpeed: 10
        },
        /* @section
         *
         * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
         */
        initialize: function(t, e) {
          M(this, e), this._latlng = $(t);
        },
        onAdd: function(t) {
          this._zoomAnimated = this._zoomAnimated && t.options.markerZoomAnimation, this._zoomAnimated && t.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
        },
        onRemove: function(t) {
          this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && t.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
        },
        getEvents: function() {
          return {
            zoom: this.update,
            viewreset: this.update
          };
        },
        // @method getLatLng: LatLng
        // Returns the current geographical position of the marker.
        getLatLng: function() {
          return this._latlng;
        },
        // @method setLatLng(latlng: LatLng): this
        // Changes the marker position to the given point.
        setLatLng: function(t) {
          var e = this._latlng;
          return this._latlng = $(t), this.update(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
        },
        // @method setZIndexOffset(offset: Number): this
        // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
        setZIndexOffset: function(t) {
          return this.options.zIndexOffset = t, this.update();
        },
        // @method getIcon: Icon
        // Returns the current icon used by the marker
        getIcon: function() {
          return this.options.icon;
        },
        // @method setIcon(icon: Icon): this
        // Changes the marker icon.
        setIcon: function(t) {
          return this.options.icon = t, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
        },
        getElement: function() {
          return this._icon;
        },
        update: function() {
          if (this._icon && this._map) {
            var t = this._map.latLngToLayerPoint(this._latlng).round();
            this._setPos(t);
          }
          return this;
        },
        _initIcon: function() {
          var t = this.options, e = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), i = t.icon.createIcon(this._icon), n = !1;
          i !== this._icon && (this._icon && this._removeIcon(), n = !0, t.title && (i.title = t.title), i.tagName === "IMG" && (i.alt = t.alt || "")), G(i, e), t.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, t.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && j(i, "focus", this._panOnFocus, this);
          var o = t.icon.createShadow(this._shadow), s = !1;
          o !== this._shadow && (this._removeShadow(), s = !0), o && (G(o, e), o.alt = ""), this._shadow = o, t.opacity < 1 && this._updateOpacity(), n && this.getPane().appendChild(this._icon), this._initInteraction(), o && s && this.getPane(t.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && ht(this._icon, "focus", this._panOnFocus, this), ct(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && ct(this._shadow), this._shadow = null;
        },
        _setPos: function(t) {
          this._icon && yt(this._icon, t), this._shadow && yt(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(t) {
          this._icon && (this._icon.style.zIndex = this._zIndex + t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
          this._setPos(e);
        },
        _initInteraction: function() {
          if (this.options.interactive && (G(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), qn)) {
            var t = this.options.draggable;
            this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new qn(this), t && this.dragging.enable();
          }
        },
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function(t) {
          return this.options.opacity = t, this._map && this._updateOpacity(), this;
        },
        _updateOpacity: function() {
          var t = this.options.opacity;
          this._icon && Rt(this._icon, t), this._shadow && Rt(this._shadow, t);
        },
        _bringToFront: function() {
          this._updateZIndex(this.options.riseOffset);
        },
        _resetZIndex: function() {
          this._updateZIndex(0);
        },
        _panOnFocus: function() {
          var t = this._map;
          if (t) {
            var e = this.options.icon.options, i = e.iconSize ? N(e.iconSize) : N(0, 0), n = e.iconAnchor ? N(e.iconAnchor) : N(0, 0);
            t.panInside(this._latlng, {
              paddingTopLeft: n,
              paddingBottomRight: i.subtract(n)
            });
          }
        },
        _getPopupAnchor: function() {
          return this.options.icon.options.popupAnchor;
        },
        _getTooltipAnchor: function() {
          return this.options.icon.options.tooltipAnchor;
        }
      });
      function Es(t, e) {
        return new mi(t, e);
      }
      var ce = qt.extend({
        // @section
        // @aka Path options
        options: {
          // @option stroke: Boolean = true
          // Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
          stroke: !0,
          // @option color: String = '#3388ff'
          // Stroke color
          color: "#3388ff",
          // @option weight: Number = 3
          // Stroke width in pixels
          weight: 3,
          // @option opacity: Number = 1.0
          // Stroke opacity
          opacity: 1,
          // @option lineCap: String= 'round'
          // A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
          lineCap: "round",
          // @option lineJoin: String = 'round'
          // A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
          lineJoin: "round",
          // @option dashArray: String = null
          // A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
          dashArray: null,
          // @option dashOffset: String = null
          // A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
          dashOffset: null,
          // @option fill: Boolean = depends
          // Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
          fill: !1,
          // @option fillColor: String = *
          // Fill color. Defaults to the value of the [`color`](#path-color) option
          fillColor: null,
          // @option fillOpacity: Number = 0.2
          // Fill opacity.
          fillOpacity: 0.2,
          // @option fillRule: String = 'evenodd'
          // A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
          fillRule: "evenodd",
          // className: '',
          // Option inherited from "Interactive layer" abstract class
          interactive: !0,
          // @option bubblingMouseEvents: Boolean = true
          // When `true`, a mouse event on this path will trigger the same event on the map
          // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
          bubblingMouseEvents: !0
        },
        beforeAdd: function(t) {
          this._renderer = t.getRenderer(this);
        },
        onAdd: function() {
          this._renderer._initPath(this), this._reset(), this._renderer._addPath(this);
        },
        onRemove: function() {
          this._renderer._removePath(this);
        },
        // @method redraw(): this
        // Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
        redraw: function() {
          return this._map && this._renderer._updatePath(this), this;
        },
        // @method setStyle(style: Path options): this
        // Changes the appearance of a Path based on the options in the `Path options` object.
        setStyle: function(t) {
          return M(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
        },
        // @method bringToFront(): this
        // Brings the layer to the top of all path layers.
        bringToFront: function() {
          return this._renderer && this._renderer._bringToFront(this), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all path layers.
        bringToBack: function() {
          return this._renderer && this._renderer._bringToBack(this), this;
        },
        getElement: function() {
          return this._path;
        },
        _reset: function() {
          this._project(), this._update();
        },
        _clickTolerance: function() {
          return (this.options.stroke ? this.options.weight / 2 : 0) + (this._renderer.options.tolerance || 0);
        }
      }), _i = ce.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(t, e) {
          M(this, e), this._latlng = $(t), this._radius = this.options.radius;
        },
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function(t) {
          var e = this._latlng;
          return this._latlng = $(t), this.redraw(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
        },
        // @method getLatLng(): LatLng
        // Returns the current geographical position of the circle marker
        getLatLng: function() {
          return this._latlng;
        },
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle marker. Units are in pixels.
        setRadius: function(t) {
          return this.options.radius = this._radius = t, this.redraw();
        },
        // @method getRadius(): Number
        // Returns the current radius of the circle
        getRadius: function() {
          return this._radius;
        },
        setStyle: function(t) {
          var e = t && t.radius || this._radius;
          return ce.prototype.setStyle.call(this, t), this.setRadius(e), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var t = this._radius, e = this._radiusY || t, i = this._clickTolerance(), n = [t + i, e + i];
          this._pxBounds = new F(this._point.subtract(n), this._point.add(n));
        },
        _update: function() {
          this._map && this._updatePath();
        },
        _updatePath: function() {
          this._renderer._updateCircle(this);
        },
        _empty: function() {
          return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t) {
          return t.distanceTo(this._point) <= this._radius + this._clickTolerance();
        }
      });
      function zs(t, e) {
        return new _i(t, e);
      }
      var on = _i.extend({
        initialize: function(t, e, i) {
          if (typeof e == "number" && (e = u({}, i, { radius: e })), M(this, e), this._latlng = $(t), isNaN(this.options.radius))
            throw new Error("Circle radius cannot be NaN");
          this._mRadius = this.options.radius;
        },
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle. Units are in meters.
        setRadius: function(t) {
          return this._mRadius = t, this.redraw();
        },
        // @method getRadius(): Number
        // Returns the current radius of a circle. Units are in meters.
        getRadius: function() {
          return this._mRadius;
        },
        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: function() {
          var t = [this._radius, this._radiusY || this._radius];
          return new it(
            this._map.layerPointToLatLng(this._point.subtract(t)),
            this._map.layerPointToLatLng(this._point.add(t))
          );
        },
        setStyle: ce.prototype.setStyle,
        _project: function() {
          var t = this._latlng.lng, e = this._latlng.lat, i = this._map, n = i.options.crs;
          if (n.distance === At.distance) {
            var o = Math.PI / 180, s = this._mRadius / At.R / o, l = i.project([e + s, t]), d = i.project([e - s, t]), _ = l.add(d).divideBy(2), b = i.unproject(_).lat, k = Math.acos((Math.cos(s * o) - Math.sin(e * o) * Math.sin(b * o)) / (Math.cos(e * o) * Math.cos(b * o))) / o;
            (isNaN(k) || k === 0) && (k = s / Math.cos(Math.PI / 180 * e)), this._point = _.subtract(i.getPixelOrigin()), this._radius = isNaN(k) ? 0 : _.x - i.project([b, t - k]).x, this._radiusY = _.y - l.y;
          } else {
            var Z = n.unproject(n.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = i.latLngToLayerPoint(this._latlng), this._radius = this._point.x - i.latLngToLayerPoint(Z).x;
          }
          this._updateBounds();
        }
      });
      function Os(t, e, i) {
        return new on(t, e, i);
      }
      var ie = ce.extend({
        // @section
        // @aka Polyline options
        options: {
          // @option smoothFactor: Number = 1.0
          // How much to simplify the polyline on each zoom level. More means
          // better performance and smoother look, and less means more accurate representation.
          smoothFactor: 1,
          // @option noClip: Boolean = false
          // Disable polyline clipping.
          noClip: !1
        },
        initialize: function(t, e) {
          M(this, e), this._setLatLngs(t);
        },
        // @method getLatLngs(): LatLng[]
        // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
        getLatLngs: function() {
          return this._latlngs;
        },
        // @method setLatLngs(latlngs: LatLng[]): this
        // Replaces all the points in the polyline with the given array of geographical points.
        setLatLngs: function(t) {
          return this._setLatLngs(t), this.redraw();
        },
        // @method isEmpty(): Boolean
        // Returns `true` if the Polyline has no LatLngs.
        isEmpty: function() {
          return !this._latlngs.length;
        },
        // @method closestLayerPoint(p: Point): Point
        // Returns the point closest to `p` on the Polyline.
        closestLayerPoint: function(t) {
          for (var e = 1 / 0, i = null, n = Ve, o, s, l = 0, d = this._parts.length; l < d; l++)
            for (var _ = this._parts[l], b = 1, k = _.length; b < k; b++) {
              o = _[b - 1], s = _[b];
              var Z = n(t, o, s, !0);
              Z < e && (e = Z, i = n(t, o, s));
            }
          return i && (i.distance = Math.sqrt(e)), i;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return Un(this._defaultShape(), this._map.options.crs);
        },
        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: function() {
          return this._bounds;
        },
        // @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
        // Adds a given point to the polyline. By default, adds to the first ring of
        // the polyline in case of a multi-polyline, but can be overridden by passing
        // a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
        addLatLng: function(t, e) {
          return e = e || this._defaultShape(), t = $(t), e.push(t), this._bounds.extend(t), this.redraw();
        },
        _setLatLngs: function(t) {
          this._bounds = new it(), this._latlngs = this._convertLatLngs(t);
        },
        _defaultShape: function() {
          return Dt(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(t) {
          for (var e = [], i = Dt(t), n = 0, o = t.length; n < o; n++)
            i ? (e[n] = $(t[n]), this._bounds.extend(e[n])) : e[n] = this._convertLatLngs(t[n]);
          return e;
        },
        _project: function() {
          var t = new F();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
        },
        _updateBounds: function() {
          var t = this._clickTolerance(), e = new I(t, t);
          this._rawPxBounds && (this._pxBounds = new F([
            this._rawPxBounds.min.subtract(e),
            this._rawPxBounds.max.add(e)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(t, e, i) {
          var n = t[0] instanceof J, o = t.length, s, l;
          if (n) {
            for (l = [], s = 0; s < o; s++)
              l[s] = this._map.latLngToLayerPoint(t[s]), i.extend(l[s]);
            e.push(l);
          } else
            for (s = 0; s < o; s++)
              this._projectLatlngs(t[s], e, i);
        },
        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: function() {
          var t = this._renderer._bounds;
          if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var e = this._parts, i, n, o, s, l, d, _;
            for (i = 0, o = 0, s = this._rings.length; i < s; i++)
              for (_ = this._rings[i], n = 0, l = _.length; n < l - 1; n++)
                d = Hn(_[n], _[n + 1], t, n, !0), d && (e[o] = e[o] || [], e[o].push(d[0]), (d[1] !== _[n + 1] || n === l - 2) && (e[o].push(d[1]), o++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var t = this._parts, e = this.options.smoothFactor, i = 0, n = t.length; i < n; i++)
            t[i] = Rn(t[i], e);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t, e) {
          var i, n, o, s, l, d, _ = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (i = 0, s = this._parts.length; i < s; i++)
            for (d = this._parts[i], n = 0, l = d.length, o = l - 1; n < l; o = n++)
              if (!(!e && n === 0) && Dn(t, d[o], d[n]) <= _)
                return !0;
          return !1;
        }
      });
      function As(t, e) {
        return new ie(t, e);
      }
      ie._flat = Wn;
      var Oe = ie.extend({
        options: {
          fill: !0
        },
        isEmpty: function() {
          return !this._latlngs.length || !this._latlngs[0].length;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the Polygon.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return Bn(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(t) {
          var e = ie.prototype._convertLatLngs.call(this, t), i = e.length;
          return i >= 2 && e[0] instanceof J && e[0].equals(e[i - 1]) && e.pop(), e;
        },
        _setLatLngs: function(t) {
          ie.prototype._setLatLngs.call(this, t), Dt(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return Dt(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var t = this._renderer._bounds, e = this.options.weight, i = new I(e, e);
          if (t = new F(t.min.subtract(i), t.max.add(i)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var n = 0, o = this._rings.length, s; n < o; n++)
              s = Zn(this._rings[n], t, !0), s.length && this._parts.push(s);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t) {
          var e = !1, i, n, o, s, l, d, _, b;
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (s = 0, _ = this._parts.length; s < _; s++)
            for (i = this._parts[s], l = 0, b = i.length, d = b - 1; l < b; d = l++)
              n = i[l], o = i[d], n.y > t.y != o.y > t.y && t.x < (o.x - n.x) * (t.y - n.y) / (o.y - n.y) + n.x && (e = !e);
          return e || ie.prototype._containsPoint.call(this, t, !0);
        }
      });
      function Is(t, e) {
        return new Oe(t, e);
      }
      var ne = ee.extend({
        /* @section
         * @aka GeoJSON options
         *
         * @option pointToLayer: Function = *
         * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
         * called when data is added, passing the GeoJSON point feature and its `LatLng`.
         * The default is to spawn a default `Marker`:
         * ```js
         * function(geoJsonPoint, latlng) {
         * 	return L.marker(latlng);
         * }
         * ```
         *
         * @option style: Function = *
         * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
         * called internally when data is added.
         * The default value is to not override any defaults:
         * ```js
         * function (geoJsonFeature) {
         * 	return {}
         * }
         * ```
         *
         * @option onEachFeature: Function = *
         * A `Function` that will be called once for each created `Feature`, after it has
         * been created and styled. Useful for attaching events and popups to features.
         * The default is to do nothing with the newly created layers:
         * ```js
         * function (feature, layer) {}
         * ```
         *
         * @option filter: Function = *
         * A `Function` that will be used to decide whether to include a feature or not.
         * The default is to include all features:
         * ```js
         * function (geoJsonFeature) {
         * 	return true;
         * }
         * ```
         * Note: dynamically changing the `filter` option will have effect only on newly
         * added data. It will _not_ re-evaluate already included features.
         *
         * @option coordsToLatLng: Function = *
         * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
         * The default is the `coordsToLatLng` static method.
         *
         * @option markersInheritOptions: Boolean = false
         * Whether default Markers for "Point" type Features inherit from group options.
         */
        initialize: function(t, e) {
          M(this, e), this._layers = {}, t && this.addData(t);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(t) {
          var e = U(t) ? t : t.features, i, n, o;
          if (e) {
            for (i = 0, n = e.length; i < n; i++)
              o = e[i], (o.geometries || o.geometry || o.features || o.coordinates) && this.addData(o);
            return this;
          }
          var s = this.options;
          if (s.filter && !s.filter(t))
            return this;
          var l = pi(t, s);
          return l ? (l.feature = yi(t), l.defaultOptions = l.options, this.resetStyle(l), s.onEachFeature && s.onEachFeature(t, l), this.addLayer(l)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(t) {
          return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = u({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
        },
        // @method setStyle( <Function> style ): this
        // Changes styles of GeoJSON vector layers with the given style function.
        setStyle: function(t) {
          return this.eachLayer(function(e) {
            this._setLayerStyle(e, t);
          }, this);
        },
        _setLayerStyle: function(t, e) {
          t.setStyle && (typeof e == "function" && (e = e(t.feature)), t.setStyle(e));
        }
      });
      function pi(t, e) {
        var i = t.type === "Feature" ? t.geometry : t, n = i ? i.coordinates : null, o = [], s = e && e.pointToLayer, l = e && e.coordsToLatLng || sn, d, _, b, k;
        if (!n && !i)
          return null;
        switch (i.type) {
          case "Point":
            return d = l(n), Gn(s, t, d, e);
          case "MultiPoint":
            for (b = 0, k = n.length; b < k; b++)
              d = l(n[b]), o.push(Gn(s, t, d, e));
            return new ee(o);
          case "LineString":
          case "MultiLineString":
            return _ = gi(n, i.type === "LineString" ? 0 : 1, l), new ie(_, e);
          case "Polygon":
          case "MultiPolygon":
            return _ = gi(n, i.type === "Polygon" ? 1 : 2, l), new Oe(_, e);
          case "GeometryCollection":
            for (b = 0, k = i.geometries.length; b < k; b++) {
              var Z = pi({
                geometry: i.geometries[b],
                type: "Feature",
                properties: t.properties
              }, e);
              Z && o.push(Z);
            }
            return new ee(o);
          case "FeatureCollection":
            for (b = 0, k = i.features.length; b < k; b++) {
              var V = pi(i.features[b], e);
              V && o.push(V);
            }
            return new ee(o);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function Gn(t, e, i, n) {
        return t ? t(e, i) : new mi(i, n && n.markersInheritOptions && n);
      }
      function sn(t) {
        return new J(t[1], t[0], t[2]);
      }
      function gi(t, e, i) {
        for (var n = [], o = 0, s = t.length, l; o < s; o++)
          l = e ? gi(t[o], e - 1, i) : (i || sn)(t[o]), n.push(l);
        return n;
      }
      function rn(t, e) {
        return t = $(t), t.alt !== void 0 ? [S(t.lng, e), S(t.lat, e), S(t.alt, e)] : [S(t.lng, e), S(t.lat, e)];
      }
      function vi(t, e, i, n) {
        for (var o = [], s = 0, l = t.length; s < l; s++)
          o.push(e ? vi(t[s], Dt(t[s]) ? 0 : e - 1, i, n) : rn(t[s], n));
        return !e && i && o.length > 0 && o.push(o[0].slice()), o;
      }
      function Ae(t, e) {
        return t.feature ? u({}, t.feature, { geometry: e }) : yi(e);
      }
      function yi(t) {
        return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
          type: "Feature",
          properties: {},
          geometry: t
        };
      }
      var an = {
        toGeoJSON: function(t) {
          return Ae(this, {
            type: "Point",
            coordinates: rn(this.getLatLng(), t)
          });
        }
      };
      mi.include(an), on.include(an), _i.include(an), ie.include({
        toGeoJSON: function(t) {
          var e = !Dt(this._latlngs), i = vi(this._latlngs, e ? 1 : 0, !1, t);
          return Ae(this, {
            type: (e ? "Multi" : "") + "LineString",
            coordinates: i
          });
        }
      }), Oe.include({
        toGeoJSON: function(t) {
          var e = !Dt(this._latlngs), i = e && !Dt(this._latlngs[0]), n = vi(this._latlngs, i ? 2 : e ? 1 : 0, !0, t);
          return e || (n = [n]), Ae(this, {
            type: (i ? "Multi" : "") + "Polygon",
            coordinates: n
          });
        }
      }), Ee.include({
        toMultiPoint: function(t) {
          var e = [];
          return this.eachLayer(function(i) {
            e.push(i.toGeoJSON(t).geometry.coordinates);
          }), Ae(this, {
            type: "MultiPoint",
            coordinates: e
          });
        },
        // @method toGeoJSON(precision?: Number|false): Object
        // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
        // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
        toGeoJSON: function(t) {
          var e = this.feature && this.feature.geometry && this.feature.geometry.type;
          if (e === "MultiPoint")
            return this.toMultiPoint(t);
          var i = e === "GeometryCollection", n = [];
          return this.eachLayer(function(o) {
            if (o.toGeoJSON) {
              var s = o.toGeoJSON(t);
              if (i)
                n.push(s.geometry);
              else {
                var l = yi(s);
                l.type === "FeatureCollection" ? n.push.apply(n, l.features) : n.push(l);
              }
            }
          }), i ? Ae(this, {
            geometries: n,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: n
          };
        }
      });
      function Vn(t, e) {
        return new ne(t, e);
      }
      var Ns = Vn, wi = qt.extend({
        // @section
        // @aka ImageOverlay options
        options: {
          // @option opacity: Number = 1.0
          // The opacity of the image overlay.
          opacity: 1,
          // @option alt: String = ''
          // Text for the `alt` attribute of the image (useful for accessibility).
          alt: "",
          // @option interactive: Boolean = false
          // If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
          interactive: !1,
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the image.
          // If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: !1,
          // @option errorOverlayUrl: String = ''
          // URL to the overlay image to show in place of the overlay that failed to load.
          errorOverlayUrl: "",
          // @option zIndex: Number = 1
          // The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
          zIndex: 1,
          // @option className: String = ''
          // A custom class name to assign to the image. Empty by default.
          className: ""
        },
        initialize: function(t, e, i) {
          this._url = t, this._bounds = nt(e), M(this, i);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (G(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          ct(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
        },
        // @method setOpacity(opacity: Number): this
        // Sets the opacity of the overlay.
        setOpacity: function(t) {
          return this.options.opacity = t, this._image && this._updateOpacity(), this;
        },
        setStyle: function(t) {
          return t.opacity && this.setOpacity(t.opacity), this;
        },
        // @method bringToFront(): this
        // Brings the layer to the top of all overlays.
        bringToFront: function() {
          return this._map && Se(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && Ce(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(t) {
          return this._url = t, this._image && (this._image.src = t), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(t) {
          return this._bounds = nt(t), this._map && this._reset(), this;
        },
        getEvents: function() {
          var t = {
            zoom: this._reset,
            viewreset: this._reset
          };
          return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
        },
        // @method setZIndex(value: Number): this
        // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
        setZIndex: function(t) {
          return this.options.zIndex = t, this._updateZIndex(), this;
        },
        // @method getBounds(): LatLngBounds
        // Get the bounds that this ImageOverlay covers
        getBounds: function() {
          return this._bounds;
        },
        // @method getElement(): HTMLElement
        // Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
        // used by this overlay.
        getElement: function() {
          return this._image;
        },
        _initImage: function() {
          var t = this._url.tagName === "IMG", e = this._image = t ? this._url : Q("img");
          if (G(e, "leaflet-image-layer"), this._zoomAnimated && G(e, "leaflet-zoom-animated"), this.options.className && G(e, this.options.className), e.onselectstart = x, e.onmousemove = x, e.onload = m(this.fire, this, "load"), e.onerror = m(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (e.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
            this._url = e.src;
            return;
          }
          e.src = this._url, e.alt = this.options.alt;
        },
        _animateZoom: function(t) {
          var e = this._map.getZoomScale(t.zoom), i = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
          ge(this._image, i, e);
        },
        _reset: function() {
          var t = this._image, e = new F(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), i = e.getSize();
          yt(t, e.min), t.style.width = i.x + "px", t.style.height = i.y + "px";
        },
        _updateOpacity: function() {
          Rt(this._image, this.options.opacity);
        },
        _updateZIndex: function() {
          this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._image.style.zIndex = this.options.zIndex);
        },
        _overlayOnError: function() {
          this.fire("error");
          var t = this.options.errorOverlayUrl;
          t && this._url !== t && (this._url = t, this._image.src = t);
        },
        // @method getCenter(): LatLng
        // Returns the center of the ImageOverlay.
        getCenter: function() {
          return this._bounds.getCenter();
        }
      }), Zs = function(t, e, i) {
        return new wi(t, e, i);
      }, $n = wi.extend({
        // @section
        // @aka VideoOverlay options
        options: {
          // @option autoplay: Boolean = true
          // Whether the video starts playing automatically when loaded.
          // On some browsers autoplay will only work with `muted: true`
          autoplay: !0,
          // @option loop: Boolean = true
          // Whether the video will loop back to the beginning when played.
          loop: !0,
          // @option keepAspectRatio: Boolean = true
          // Whether the video will save aspect ratio after the projection.
          // Relevant for supported browsers. See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
          keepAspectRatio: !0,
          // @option muted: Boolean = false
          // Whether the video starts on mute when loaded.
          muted: !1,
          // @option playsInline: Boolean = true
          // Mobile browsers will play the video right where it is instead of open it up in fullscreen mode.
          playsInline: !0
        },
        _initImage: function() {
          var t = this._url.tagName === "VIDEO", e = this._image = t ? this._url : Q("video");
          if (G(e, "leaflet-image-layer"), this._zoomAnimated && G(e, "leaflet-zoom-animated"), this.options.className && G(e, this.options.className), e.onselectstart = x, e.onmousemove = x, e.onloadeddata = m(this.fire, this, "load"), t) {
            for (var i = e.getElementsByTagName("source"), n = [], o = 0; o < i.length; o++)
              n.push(i[o].src);
            this._url = i.length > 0 ? n : [e.src];
            return;
          }
          U(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
          for (var s = 0; s < this._url.length; s++) {
            var l = Q("source");
            l.src = this._url[s], e.appendChild(l);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function Bs(t, e, i) {
        return new $n(t, e, i);
      }
      var Kn = wi.extend({
        _initImage: function() {
          var t = this._image = this._url;
          G(t, "leaflet-image-layer"), this._zoomAnimated && G(t, "leaflet-zoom-animated"), this.options.className && G(t, this.options.className), t.onselectstart = x, t.onmousemove = x;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function Rs(t, e, i) {
        return new Kn(t, e, i);
      }
      var Xt = qt.extend({
        // @section
        // @aka DivOverlay options
        options: {
          // @option interactive: Boolean = false
          // If true, the popup/tooltip will listen to the mouse events.
          interactive: !1,
          // @option offset: Point = Point(0, 0)
          // The offset of the overlay position.
          offset: [0, 0],
          // @option className: String = ''
          // A custom CSS class name to assign to the overlay.
          className: "",
          // @option pane: String = undefined
          // `Map pane` where the overlay will be added.
          pane: void 0,
          // @option content: String|HTMLElement|Function = ''
          // Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
          // passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
          content: ""
        },
        initialize: function(t, e) {
          t && (t instanceof J || U(t)) ? (this._latlng = $(t), M(this, e)) : (M(this, t), this._source = e), this.options.content && (this._content = this.options.content);
        },
        // @method openOn(map: Map): this
        // Adds the overlay to the map.
        // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
        openOn: function(t) {
          return t = arguments.length ? t : this._source._map, t.hasLayer(this) || t.addLayer(this), this;
        },
        // @method close(): this
        // Closes the overlay.
        // Alternative to `map.closePopup(popup)`/`.closeTooltip(tooltip)`
        // and `layer.closePopup()`/`.closeTooltip()`.
        close: function() {
          return this._map && this._map.removeLayer(this), this;
        },
        // @method toggle(layer?: Layer): this
        // Opens or closes the overlay bound to layer depending on its current state.
        // Argument may be omitted only for overlay bound to layer.
        // Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
        toggle: function(t) {
          return this._map ? this.close() : (arguments.length ? this._source = t : t = this._source, this._prepareOpen(), this.openOn(t._map)), this;
        },
        onAdd: function(t) {
          this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && Rt(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && Rt(this._container, 1), this.bringToFront(), this.options.interactive && (G(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(t) {
          t._fadeAnimated ? (Rt(this._container, 0), this._removeTimeout = setTimeout(m(ct, void 0, this._container), 200)) : ct(this._container), this.options.interactive && (pt(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
        },
        // @namespace DivOverlay
        // @method getLatLng: LatLng
        // Returns the geographical point of the overlay.
        getLatLng: function() {
          return this._latlng;
        },
        // @method setLatLng(latlng: LatLng): this
        // Sets the geographical point where the overlay will open.
        setLatLng: function(t) {
          return this._latlng = $(t), this._map && (this._updatePosition(), this._adjustPan()), this;
        },
        // @method getContent: String|HTMLElement
        // Returns the content of the overlay.
        getContent: function() {
          return this._content;
        },
        // @method setContent(htmlContent: String|HTMLElement|Function): this
        // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
        // The function should return a `String` or `HTMLElement` to be used in the overlay.
        setContent: function(t) {
          return this._content = t, this.update(), this;
        },
        // @method getElement: String|HTMLElement
        // Returns the HTML container of the overlay.
        getElement: function() {
          return this._container;
        },
        // @method update: null
        // Updates the overlay content, layout and position. Useful for updating the overlay after something inside changed, e.g. image loaded.
        update: function() {
          this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan());
        },
        getEvents: function() {
          var t = {
            zoom: this._updatePosition,
            viewreset: this._updatePosition
          };
          return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
        },
        // @method isOpen: Boolean
        // Returns `true` when the overlay is visible on the map.
        isOpen: function() {
          return !!this._map && this._map.hasLayer(this);
        },
        // @method bringToFront: this
        // Brings this overlay in front of other overlays (in the same map pane).
        bringToFront: function() {
          return this._map && Se(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && Ce(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(t) {
          var e = this._source;
          if (!e._map)
            return !1;
          if (e instanceof ee) {
            e = null;
            var i = this._source._layers;
            for (var n in i)
              if (i[n]._map) {
                e = i[n];
                break;
              }
            if (!e)
              return !1;
            this._source = e;
          }
          if (!t)
            if (e.getCenter)
              t = e.getCenter();
            else if (e.getLatLng)
              t = e.getLatLng();
            else if (e.getBounds)
              t = e.getBounds().getCenter();
            else
              throw new Error("Unable to get source layer LatLng.");
          return this.setLatLng(t), this._map && this.update(), !0;
        },
        _updateContent: function() {
          if (this._content) {
            var t = this._contentNode, e = typeof this._content == "function" ? this._content(this._source || this) : this._content;
            if (typeof e == "string")
              t.innerHTML = e;
            else {
              for (; t.hasChildNodes(); )
                t.removeChild(t.firstChild);
              t.appendChild(e);
            }
            this.fire("contentupdate");
          }
        },
        _updatePosition: function() {
          if (this._map) {
            var t = this._map.latLngToLayerPoint(this._latlng), e = N(this.options.offset), i = this._getAnchor();
            this._zoomAnimated ? yt(this._container, t.add(i)) : e = e.add(t).add(i);
            var n = this._containerBottom = -e.y, o = this._containerLeft = -Math.round(this._containerWidth / 2) + e.x;
            this._container.style.bottom = n + "px", this._container.style.left = o + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      Y.include({
        _initOverlay: function(t, e, i, n) {
          var o = e;
          return o instanceof t || (o = new t(n).setContent(e)), i && o.setLatLng(i), o;
        }
      }), qt.include({
        _initOverlay: function(t, e, i, n) {
          var o = i;
          return o instanceof t ? (M(o, n), o._source = this) : (o = e && !n ? e : new t(n, this), o.setContent(i)), o;
        }
      });
      var xi = Xt.extend({
        // @section
        // @aka Popup options
        options: {
          // @option pane: String = 'popupPane'
          // `Map pane` where the popup will be added.
          pane: "popupPane",
          // @option offset: Point = Point(0, 7)
          // The offset of the popup position.
          offset: [0, 7],
          // @option maxWidth: Number = 300
          // Max width of the popup, in pixels.
          maxWidth: 300,
          // @option minWidth: Number = 50
          // Min width of the popup, in pixels.
          minWidth: 50,
          // @option maxHeight: Number = null
          // If set, creates a scrollable container of the given height
          // inside a popup if its content exceeds it.
          // The scrollable container can be styled using the
          // `leaflet-popup-scrolled` CSS class selector.
          maxHeight: null,
          // @option autoPan: Boolean = true
          // Set it to `false` if you don't want the map to do panning animation
          // to fit the opened popup.
          autoPan: !0,
          // @option autoPanPaddingTopLeft: Point = null
          // The margin between the popup and the top left corner of the map
          // view after autopanning was performed.
          autoPanPaddingTopLeft: null,
          // @option autoPanPaddingBottomRight: Point = null
          // The margin between the popup and the bottom right corner of the map
          // view after autopanning was performed.
          autoPanPaddingBottomRight: null,
          // @option autoPanPadding: Point = Point(5, 5)
          // Equivalent of setting both top left and bottom right autopan padding to the same value.
          autoPanPadding: [5, 5],
          // @option keepInView: Boolean = false
          // Set it to `true` if you want to prevent users from panning the popup
          // off of the screen while it is open.
          keepInView: !1,
          // @option closeButton: Boolean = true
          // Controls the presence of a close button in the popup.
          closeButton: !0,
          // @option autoClose: Boolean = true
          // Set it to `false` if you want to override the default behavior of
          // the popup closing when another popup is opened.
          autoClose: !0,
          // @option closeOnEscapeKey: Boolean = true
          // Set it to `false` if you want to override the default behavior of
          // the ESC key for closing of the popup.
          closeOnEscapeKey: !0,
          // @option closeOnClick: Boolean = *
          // Set it if you want to override the default behavior of the popup closing when user clicks
          // on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.
          // @option className: String = ''
          // A custom CSS class name to assign to the popup.
          className: ""
        },
        // @namespace Popup
        // @method openOn(map: Map): this
        // Alternative to `map.openPopup(popup)`.
        // Adds the popup to the map and closes the previous one.
        openOn: function(t) {
          return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, Xt.prototype.openOn.call(this, t);
        },
        onAdd: function(t) {
          Xt.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof ce || this._source.on("preclick", ye));
        },
        onRemove: function(t) {
          Xt.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof ce || this._source.off("preclick", ye));
        },
        getEvents: function() {
          var t = Xt.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
        },
        _initLayout: function() {
          var t = "leaflet-popup", e = this._container = Q(
            "div",
            t + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), i = this._wrapper = Q("div", t + "-content-wrapper", e);
          if (this._contentNode = Q("div", t + "-content", i), qe(e), Ki(this._contentNode), j(e, "contextmenu", ye), this._tipContainer = Q("div", t + "-tip-container", e), this._tip = Q("div", t + "-tip", this._tipContainer), this.options.closeButton) {
            var n = this._closeButton = Q("a", t + "-close-button", e);
            n.setAttribute("role", "button"), n.setAttribute("aria-label", "Close popup"), n.href = "#close", n.innerHTML = '<span aria-hidden="true">&#215;</span>', j(n, "click", function(o) {
              Lt(o), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var t = this._contentNode, e = t.style;
          e.width = "", e.whiteSpace = "nowrap";
          var i = t.offsetWidth;
          i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = "";
          var n = t.offsetHeight, o = this.options.maxHeight, s = "leaflet-popup-scrolled";
          o && n > o ? (e.height = o + "px", G(t, s)) : pt(t, s), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), i = this._getAnchor();
          yt(this._container, e.add(i));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var t = this._map, e = parseInt(He(this._container, "marginBottom"), 10) || 0, i = this._container.offsetHeight + e, n = this._containerWidth, o = new I(this._containerLeft, -i - this._containerBottom);
            o._add(ve(this._container));
            var s = t.layerPointToContainerPoint(o), l = N(this.options.autoPanPadding), d = N(this.options.autoPanPaddingTopLeft || l), _ = N(this.options.autoPanPaddingBottomRight || l), b = t.getSize(), k = 0, Z = 0;
            s.x + n + _.x > b.x && (k = s.x + n - b.x + _.x), s.x - k - d.x < 0 && (k = s.x - d.x), s.y + i + _.y > b.y && (Z = s.y + i - b.y + _.y), s.y - Z - d.y < 0 && (Z = s.y - d.y), (k || Z) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([k, Z]));
          }
        },
        _getAnchor: function() {
          return N(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), Ds = function(t, e) {
        return new xi(t, e);
      };
      Y.mergeOptions({
        closePopupOnClick: !0
      }), Y.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: function(t, e, i) {
          return this._initOverlay(xi, t, e, i).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(t) {
          return t = arguments.length ? t : this._popup, t && t.close(), this;
        }
      }), qt.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(t, e) {
          return this._popup = this._initOverlay(xi, this._popup, t, e), this._popupHandlersAdded || (this.on({
            click: this._openPopup,
            keypress: this._onKeyPress,
            remove: this.closePopup,
            move: this._movePopup
          }), this._popupHandlersAdded = !0), this;
        },
        // @method unbindPopup(): this
        // Removes the popup previously bound with `bindPopup`.
        unbindPopup: function() {
          return this._popup && (this.off({
            click: this._openPopup,
            keypress: this._onKeyPress,
            remove: this.closePopup,
            move: this._movePopup
          }), this._popupHandlersAdded = !1, this._popup = null), this;
        },
        // @method openPopup(latlng?: LatLng): this
        // Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
        openPopup: function(t) {
          return this._popup && (this instanceof ee || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng) && this._popup.openOn(this._map)), this;
        },
        // @method closePopup(): this
        // Closes the popup bound to this layer if it is open.
        closePopup: function() {
          return this._popup && this._popup.close(), this;
        },
        // @method togglePopup(): this
        // Opens or closes the popup bound to this layer depending on its current state.
        togglePopup: function() {
          return this._popup && this._popup.toggle(this), this;
        },
        // @method isPopupOpen(): boolean
        // Returns `true` if the popup bound to this layer is currently open.
        isPopupOpen: function() {
          return this._popup ? this._popup.isOpen() : !1;
        },
        // @method setPopupContent(content: String|HTMLElement|Popup): this
        // Sets the content of the popup bound to this layer.
        setPopupContent: function(t) {
          return this._popup && this._popup.setContent(t), this;
        },
        // @method getPopup(): Popup
        // Returns the popup bound to this layer.
        getPopup: function() {
          return this._popup;
        },
        _openPopup: function(t) {
          if (!(!this._popup || !this._map)) {
            we(t);
            var e = t.layer || t.target;
            if (this._popup._source === e && !(e instanceof ce)) {
              this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(t.latlng);
              return;
            }
            this._popup._source = e, this.openPopup(t.latlng);
          }
        },
        _movePopup: function(t) {
          this._popup.setLatLng(t.latlng);
        },
        _onKeyPress: function(t) {
          t.originalEvent.keyCode === 13 && this._openPopup(t);
        }
      });
      var bi = Xt.extend({
        // @section
        // @aka Tooltip options
        options: {
          // @option pane: String = 'tooltipPane'
          // `Map pane` where the tooltip will be added.
          pane: "tooltipPane",
          // @option offset: Point = Point(0, 0)
          // Optional offset of the tooltip position.
          offset: [0, 0],
          // @option direction: String = 'auto'
          // Direction where to open the tooltip. Possible values are: `right`, `left`,
          // `top`, `bottom`, `center`, `auto`.
          // `auto` will dynamically switch between `right` and `left` according to the tooltip
          // position on the map.
          direction: "auto",
          // @option permanent: Boolean = false
          // Whether to open the tooltip permanently or only on mouseover.
          permanent: !1,
          // @option sticky: Boolean = false
          // If true, the tooltip will follow the mouse instead of being fixed at the feature center.
          sticky: !1,
          // @option opacity: Number = 0.9
          // Tooltip container opacity.
          opacity: 0.9
        },
        onAdd: function(t) {
          Xt.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(t) {
          Xt.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var t = Xt.prototype.getEvents.call(this);
          return this.options.permanent || (t.preclick = this.close), t;
        },
        _initLayout: function() {
          var t = "leaflet-tooltip", e = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = Q("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + p(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(t) {
          var e, i, n = this._map, o = this._container, s = n.latLngToContainerPoint(n.getCenter()), l = n.layerPointToContainerPoint(t), d = this.options.direction, _ = o.offsetWidth, b = o.offsetHeight, k = N(this.options.offset), Z = this._getAnchor();
          d === "top" ? (e = _ / 2, i = b) : d === "bottom" ? (e = _ / 2, i = 0) : d === "center" ? (e = _ / 2, i = b / 2) : d === "right" ? (e = 0, i = b / 2) : d === "left" ? (e = _, i = b / 2) : l.x < s.x ? (d = "right", e = 0, i = b / 2) : (d = "left", e = _ + (k.x + Z.x) * 2, i = b / 2), t = t.subtract(N(e, i, !0)).add(k).add(Z), pt(o, "leaflet-tooltip-right"), pt(o, "leaflet-tooltip-left"), pt(o, "leaflet-tooltip-top"), pt(o, "leaflet-tooltip-bottom"), G(o, "leaflet-tooltip-" + d), yt(o, t);
        },
        _updatePosition: function() {
          var t = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(t);
        },
        setOpacity: function(t) {
          this.options.opacity = t, this._container && Rt(this._container, t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
          this._setPosition(e);
        },
        _getAnchor: function() {
          return N(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), Fs = function(t, e) {
        return new bi(t, e);
      };
      Y.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(t, e, i) {
          return this._initOverlay(bi, t, e, i).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(t) {
          return t.close(), this;
        }
      }), qt.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(t, e) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(bi, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
        },
        // @method unbindTooltip(): this
        // Removes the tooltip previously bound with `bindTooltip`.
        unbindTooltip: function() {
          return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
        },
        _initTooltipInteractions: function(t) {
          if (!(!t && this._tooltipHandlersAdded)) {
            var e = t ? "off" : "on", i = {
              remove: this.closeTooltip,
              move: this._moveTooltip
            };
            this._tooltip.options.permanent ? i.add = this._openTooltip : (i.mouseover = this._openTooltip, i.mouseout = this.closeTooltip, i.click = this._openTooltip, this._map ? this._addFocusListeners() : i.add = this._addFocusListeners), this._tooltip.options.sticky && (i.mousemove = this._moveTooltip), this[e](i), this._tooltipHandlersAdded = !t;
          }
        },
        // @method openTooltip(latlng?: LatLng): this
        // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
        openTooltip: function(t) {
          return this._tooltip && (this instanceof ee || (this._tooltip._source = this), this._tooltip._prepareOpen(t) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
        },
        // @method closeTooltip(): this
        // Closes the tooltip bound to this layer if it is open.
        closeTooltip: function() {
          if (this._tooltip)
            return this._tooltip.close();
        },
        // @method toggleTooltip(): this
        // Opens or closes the tooltip bound to this layer depending on its current state.
        toggleTooltip: function() {
          return this._tooltip && this._tooltip.toggle(this), this;
        },
        // @method isTooltipOpen(): boolean
        // Returns `true` if the tooltip bound to this layer is currently open.
        isTooltipOpen: function() {
          return this._tooltip.isOpen();
        },
        // @method setTooltipContent(content: String|HTMLElement|Tooltip): this
        // Sets the content of the tooltip bound to this layer.
        setTooltipContent: function(t) {
          return this._tooltip && this._tooltip.setContent(t), this;
        },
        // @method getTooltip(): Tooltip
        // Returns the tooltip bound to this layer.
        getTooltip: function() {
          return this._tooltip;
        },
        _addFocusListeners: function() {
          this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this);
        },
        _addFocusListenersOnLayer: function(t) {
          var e = typeof t.getElement == "function" && t.getElement();
          e && (j(e, "focus", function() {
            this._tooltip._source = t, this.openTooltip();
          }, this), j(e, "blur", this.closeTooltip, this));
        },
        _setAriaDescribedByOnLayer: function(t) {
          var e = typeof t.getElement == "function" && t.getElement();
          e && e.setAttribute("aria-describedby", this._tooltip._container.id);
        },
        _openTooltip: function(t) {
          if (!(!this._tooltip || !this._map)) {
            if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
              this._openOnceFlag = !0;
              var e = this;
              this._map.once("moveend", function() {
                e._openOnceFlag = !1, e._openTooltip(t);
              });
              return;
            }
            this._tooltip._source = t.layer || t.target, this.openTooltip(this._tooltip.options.sticky ? t.latlng : void 0);
          }
        },
        _moveTooltip: function(t) {
          var e = t.latlng, i, n;
          this._tooltip.options.sticky && t.originalEvent && (i = this._map.mouseEventToContainerPoint(t.originalEvent), n = this._map.containerPointToLayerPoint(i), e = this._map.layerPointToLatLng(n)), this._tooltip.setLatLng(e);
        }
      });
      var Yn = ze.extend({
        options: {
          // @section
          // @aka DivIcon options
          iconSize: [12, 12],
          // also can be set through CSS
          // iconAnchor: (Point),
          // popupAnchor: (Point),
          // @option html: String|HTMLElement = ''
          // Custom HTML code to put inside the div element, empty by default. Alternatively,
          // an instance of `HTMLElement`.
          html: !1,
          // @option bgPos: Point = [0, 0]
          // Optional relative position of the background, in pixels
          bgPos: null,
          className: "leaflet-div-icon"
        },
        createIcon: function(t) {
          var e = t && t.tagName === "DIV" ? t : document.createElement("div"), i = this.options;
          if (i.html instanceof Element ? (hi(e), e.appendChild(i.html)) : e.innerHTML = i.html !== !1 ? i.html : "", i.bgPos) {
            var n = N(i.bgPos);
            e.style.backgroundPosition = -n.x + "px " + -n.y + "px";
          }
          return this._setIconStyles(e, "icon"), e;
        },
        createShadow: function() {
          return null;
        }
      });
      function Hs(t) {
        return new Yn(t);
      }
      ze.Default = $e;
      var Ke = qt.extend({
        // @section
        // @aka GridLayer options
        options: {
          // @option tileSize: Number|Point = 256
          // Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
          tileSize: 256,
          // @option opacity: Number = 1.0
          // Opacity of the tiles. Can be used in the `createTile()` function.
          opacity: 1,
          // @option updateWhenIdle: Boolean = (depends)
          // Load new tiles only when panning ends.
          // `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
          // `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
          // [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
          updateWhenIdle: z.mobile,
          // @option updateWhenZooming: Boolean = true
          // By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
          updateWhenZooming: !0,
          // @option updateInterval: Number = 200
          // Tiles will not update more than once every `updateInterval` milliseconds when panning.
          updateInterval: 200,
          // @option zIndex: Number = 1
          // The explicit zIndex of the tile layer.
          zIndex: 1,
          // @option bounds: LatLngBounds = undefined
          // If set, tiles will only be loaded inside the set `LatLngBounds`.
          bounds: null,
          // @option minZoom: Number = 0
          // The minimum zoom level down to which this layer will be displayed (inclusive).
          minZoom: 0,
          // @option maxZoom: Number = undefined
          // The maximum zoom level up to which this layer will be displayed (inclusive).
          maxZoom: void 0,
          // @option maxNativeZoom: Number = undefined
          // Maximum zoom number the tile source has available. If it is specified,
          // the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
          // from `maxNativeZoom` level and auto-scaled.
          maxNativeZoom: void 0,
          // @option minNativeZoom: Number = undefined
          // Minimum zoom number the tile source has available. If it is specified,
          // the tiles on all zoom levels lower than `minNativeZoom` will be loaded
          // from `minNativeZoom` level and auto-scaled.
          minNativeZoom: void 0,
          // @option noWrap: Boolean = false
          // Whether the layer is wrapped around the antimeridian. If `true`, the
          // GridLayer will only be displayed once at low zoom levels. Has no
          // effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
          // in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
          // tiles outside the CRS limits.
          noWrap: !1,
          // @option pane: String = 'tilePane'
          // `Map pane` where the grid layer will be added.
          pane: "tilePane",
          // @option className: String = ''
          // A custom class name to assign to the tile layer. Empty by default.
          className: "",
          // @option keepBuffer: Number = 2
          // When panning the map, keep this many rows and columns of tiles before unloading them.
          keepBuffer: 2
        },
        initialize: function(t) {
          M(this, t);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(t) {
          t._addZoomLimit(this);
        },
        onRemove: function(t) {
          this._removeAllTiles(), ct(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (Se(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (Ce(this._container), this._setAutoZIndex(Math.min)), this;
        },
        // @method getContainer: HTMLElement
        // Returns the HTML element that contains the tiles for this layer.
        getContainer: function() {
          return this._container;
        },
        // @method setOpacity(opacity: Number): this
        // Changes the [opacity](#gridlayer-opacity) of the grid layer.
        setOpacity: function(t) {
          return this.options.opacity = t, this._updateOpacity(), this;
        },
        // @method setZIndex(zIndex: Number): this
        // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
        setZIndex: function(t) {
          return this.options.zIndex = t, this._updateZIndex(), this;
        },
        // @method isLoading: Boolean
        // Returns `true` if any tile in the grid layer has not finished loading.
        isLoading: function() {
          return this._loading;
        },
        // @method redraw: this
        // Causes the layer to clear all the tiles and request them again.
        redraw: function() {
          if (this._map) {
            this._removeAllTiles();
            var t = this._clampZoom(this._map.getZoom());
            t !== this._tileZoom && (this._tileZoom = t, this._updateLevels()), this._update();
          }
          return this;
        },
        getEvents: function() {
          var t = {
            viewprereset: this._invalidateAll,
            viewreset: this._resetView,
            zoom: this._resetView,
            moveend: this._onMoveEnd
          };
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = g(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
        },
        // @section Extension methods
        // Layers extending `GridLayer` shall reimplement the following method.
        // @method createTile(coords: Object, done?: Function): HTMLElement
        // Called only internally, must be overridden by classes extending `GridLayer`.
        // Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
        // is specified, it must be called when the tile has finished loading and drawing.
        createTile: function() {
          return document.createElement("div");
        },
        // @section
        // @method getTileSize: Point
        // Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
        getTileSize: function() {
          var t = this.options.tileSize;
          return t instanceof I ? t : new I(t, t);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(t) {
          for (var e = this.getPane().children, i = -t(-1 / 0, 1 / 0), n = 0, o = e.length, s; n < o; n++)
            s = e[n].style.zIndex, e[n] !== this._container && s && (i = t(i, +s));
          isFinite(i) && (this.options.zIndex = i + t(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !z.ielt9) {
            Rt(this._container, this.options.opacity);
            var t = +/* @__PURE__ */ new Date(), e = !1, i = !1;
            for (var n in this._tiles) {
              var o = this._tiles[n];
              if (!(!o.current || !o.loaded)) {
                var s = Math.min(1, (t - o.loaded) / 200);
                Rt(o.el, s), s < 1 ? e = !0 : (o.active ? i = !0 : this._onOpaqueTile(o), o.active = !0);
              }
            }
            i && !this._noPrune && this._pruneTiles(), e && (K(this._fadeFrame), this._fadeFrame = D(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: x,
        _initContainer: function() {
          this._container || (this._container = Q("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var t = this._tileZoom, e = this.options.maxZoom;
          if (t !== void 0) {
            for (var i in this._levels)
              i = Number(i), this._levels[i].el.children.length || i === t ? (this._levels[i].el.style.zIndex = e - Math.abs(t - i), this._onUpdateLevel(i)) : (ct(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
            var n = this._levels[t], o = this._map;
            return n || (n = this._levels[t] = {}, n.el = Q("div", "leaflet-tile-container leaflet-zoom-animated", this._container), n.el.style.zIndex = e, n.origin = o.project(o.unproject(o.getPixelOrigin()), t).round(), n.zoom = t, this._setZoomTransform(n, o.getCenter(), o.getZoom()), x(n.el.offsetWidth), this._onCreateLevel(n)), this._level = n, n;
          }
        },
        _onUpdateLevel: x,
        _onRemoveLevel: x,
        _onCreateLevel: x,
        _pruneTiles: function() {
          if (this._map) {
            var t, e, i = this._map.getZoom();
            if (i > this.options.maxZoom || i < this.options.minZoom) {
              this._removeAllTiles();
              return;
            }
            for (t in this._tiles)
              e = this._tiles[t], e.retain = e.current;
            for (t in this._tiles)
              if (e = this._tiles[t], e.current && !e.active) {
                var n = e.coords;
                this._retainParent(n.x, n.y, n.z, n.z - 5) || this._retainChildren(n.x, n.y, n.z, n.z + 2);
              }
            for (t in this._tiles)
              this._tiles[t].retain || this._removeTile(t);
          }
        },
        _removeTilesAtZoom: function(t) {
          for (var e in this._tiles)
            this._tiles[e].coords.z === t && this._removeTile(e);
        },
        _removeAllTiles: function() {
          for (var t in this._tiles)
            this._removeTile(t);
        },
        _invalidateAll: function() {
          for (var t in this._levels)
            ct(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(t, e, i, n) {
          var o = Math.floor(t / 2), s = Math.floor(e / 2), l = i - 1, d = new I(+o, +s);
          d.z = +l;
          var _ = this._tileCoordsToKey(d), b = this._tiles[_];
          return b && b.active ? (b.retain = !0, !0) : (b && b.loaded && (b.retain = !0), l > n ? this._retainParent(o, s, l, n) : !1);
        },
        _retainChildren: function(t, e, i, n) {
          for (var o = 2 * t; o < 2 * t + 2; o++)
            for (var s = 2 * e; s < 2 * e + 2; s++) {
              var l = new I(o, s);
              l.z = i + 1;
              var d = this._tileCoordsToKey(l), _ = this._tiles[d];
              if (_ && _.active) {
                _.retain = !0;
                continue;
              } else _ && _.loaded && (_.retain = !0);
              i + 1 < n && this._retainChildren(o, s, i + 1, n);
            }
        },
        _resetView: function(t) {
          var e = t && (t.pinch || t.flyTo);
          this._setView(this._map.getCenter(), this._map.getZoom(), e, e);
        },
        _animateZoom: function(t) {
          this._setView(t.center, t.zoom, !0, t.noUpdate);
        },
        _clampZoom: function(t) {
          var e = this.options;
          return e.minNativeZoom !== void 0 && t < e.minNativeZoom ? e.minNativeZoom : e.maxNativeZoom !== void 0 && e.maxNativeZoom < t ? e.maxNativeZoom : t;
        },
        _setView: function(t, e, i, n) {
          var o = Math.round(e);
          this.options.maxZoom !== void 0 && o > this.options.maxZoom || this.options.minZoom !== void 0 && o < this.options.minZoom ? o = void 0 : o = this._clampZoom(o);
          var s = this.options.updateWhenZooming && o !== this._tileZoom;
          (!n || s) && (this._tileZoom = o, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), o !== void 0 && this._update(t), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(t, e);
        },
        _setZoomTransforms: function(t, e) {
          for (var i in this._levels)
            this._setZoomTransform(this._levels[i], t, e);
        },
        _setZoomTransform: function(t, e, i) {
          var n = this._map.getZoomScale(i, t.zoom), o = t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e, i)).round();
          z.any3d ? ge(t.el, o, n) : yt(t.el, o);
        },
        _resetGrid: function() {
          var t = this._map, e = t.options.crs, i = this._tileSize = this.getTileSize(), n = this._tileZoom, o = this._map.getPixelWorldBounds(this._tileZoom);
          o && (this._globalTileRange = this._pxBoundsToTileRange(o)), this._wrapX = e.wrapLng && !this.options.noWrap && [
            Math.floor(t.project([0, e.wrapLng[0]], n).x / i.x),
            Math.ceil(t.project([0, e.wrapLng[1]], n).x / i.y)
          ], this._wrapY = e.wrapLat && !this.options.noWrap && [
            Math.floor(t.project([e.wrapLat[0], 0], n).y / i.x),
            Math.ceil(t.project([e.wrapLat[1], 0], n).y / i.y)
          ];
        },
        _onMoveEnd: function() {
          !this._map || this._map._animatingZoom || this._update();
        },
        _getTiledPixelBounds: function(t) {
          var e = this._map, i = e._animatingZoom ? Math.max(e._animateToZoom, e.getZoom()) : e.getZoom(), n = e.getZoomScale(i, this._tileZoom), o = e.project(t, this._tileZoom).floor(), s = e.getSize().divideBy(n * 2);
          return new F(o.subtract(s), o.add(s));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(t) {
          var e = this._map;
          if (e) {
            var i = this._clampZoom(e.getZoom());
            if (t === void 0 && (t = e.getCenter()), this._tileZoom !== void 0) {
              var n = this._getTiledPixelBounds(t), o = this._pxBoundsToTileRange(n), s = o.getCenter(), l = [], d = this.options.keepBuffer, _ = new F(
                o.getBottomLeft().subtract([d, -d]),
                o.getTopRight().add([d, -d])
              );
              if (!(isFinite(o.min.x) && isFinite(o.min.y) && isFinite(o.max.x) && isFinite(o.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var b in this._tiles) {
                var k = this._tiles[b].coords;
                (k.z !== this._tileZoom || !_.contains(new I(k.x, k.y))) && (this._tiles[b].current = !1);
              }
              if (Math.abs(i - this._tileZoom) > 1) {
                this._setView(t, i);
                return;
              }
              for (var Z = o.min.y; Z <= o.max.y; Z++)
                for (var V = o.min.x; V <= o.max.x; V++) {
                  var St = new I(V, Z);
                  if (St.z = this._tileZoom, !!this._isValidTile(St)) {
                    var xt = this._tiles[this._tileCoordsToKey(St)];
                    xt ? xt.current = !0 : l.push(St);
                  }
                }
              if (l.sort(function(Et, Ne) {
                return Et.distanceTo(s) - Ne.distanceTo(s);
              }), l.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var Ft = document.createDocumentFragment();
                for (V = 0; V < l.length; V++)
                  this._addTile(l[V], Ft);
                this._level.el.appendChild(Ft);
              }
            }
          }
        },
        _isValidTile: function(t) {
          var e = this._map.options.crs;
          if (!e.infinite) {
            var i = this._globalTileRange;
            if (!e.wrapLng && (t.x < i.min.x || t.x > i.max.x) || !e.wrapLat && (t.y < i.min.y || t.y > i.max.y))
              return !1;
          }
          if (!this.options.bounds)
            return !0;
          var n = this._tileCoordsToBounds(t);
          return nt(this.options.bounds).overlaps(n);
        },
        _keyToBounds: function(t) {
          return this._tileCoordsToBounds(this._keyToTileCoords(t));
        },
        _tileCoordsToNwSe: function(t) {
          var e = this._map, i = this.getTileSize(), n = t.scaleBy(i), o = n.add(i), s = e.unproject(n, t.z), l = e.unproject(o, t.z);
          return [s, l];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(t) {
          var e = this._tileCoordsToNwSe(t), i = new it(e[0], e[1]);
          return this.options.noWrap || (i = this._map.wrapLatLngBounds(i)), i;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(t) {
          return t.x + ":" + t.y + ":" + t.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(t) {
          var e = t.split(":"), i = new I(+e[0], +e[1]);
          return i.z = +e[2], i;
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          e && (ct(e.el), delete this._tiles[t], this.fire("tileunload", {
            tile: e.el,
            coords: this._keyToTileCoords(t)
          }));
        },
        _initTile: function(t) {
          G(t, "leaflet-tile");
          var e = this.getTileSize();
          t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = x, t.onmousemove = x, z.ielt9 && this.options.opacity < 1 && Rt(t, this.options.opacity);
        },
        _addTile: function(t, e) {
          var i = this._getTilePos(t), n = this._tileCoordsToKey(t), o = this.createTile(this._wrapCoords(t), m(this._tileReady, this, t));
          this._initTile(o), this.createTile.length < 2 && D(m(this._tileReady, this, t, null, o)), yt(o, i), this._tiles[n] = {
            el: o,
            coords: t,
            current: !0
          }, e.appendChild(o), this.fire("tileloadstart", {
            tile: o,
            coords: t
          });
        },
        _tileReady: function(t, e, i) {
          e && this.fire("tileerror", {
            error: e,
            tile: i,
            coords: t
          });
          var n = this._tileCoordsToKey(t);
          i = this._tiles[n], i && (i.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (Rt(i.el, 0), K(this._fadeFrame), this._fadeFrame = D(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), e || (G(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: i.el,
            coords: t
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), z.ielt9 || !this._map._fadeAnimated ? D(this._pruneTiles, this) : setTimeout(m(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(t) {
          return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(t) {
          var e = new I(
            this._wrapX ? y(t.x, this._wrapX) : t.x,
            this._wrapY ? y(t.y, this._wrapY) : t.y
          );
          return e.z = t.z, e;
        },
        _pxBoundsToTileRange: function(t) {
          var e = this.getTileSize();
          return new F(
            t.min.unscaleBy(e).floor(),
            t.max.unscaleBy(e).ceil().subtract([1, 1])
          );
        },
        _noTilesToLoad: function() {
          for (var t in this._tiles)
            if (!this._tiles[t].loaded)
              return !1;
          return !0;
        }
      });
      function Ws(t) {
        return new Ke(t);
      }
      var Ie = Ke.extend({
        // @section
        // @aka TileLayer options
        options: {
          // @option minZoom: Number = 0
          // The minimum zoom level down to which this layer will be displayed (inclusive).
          minZoom: 0,
          // @option maxZoom: Number = 18
          // The maximum zoom level up to which this layer will be displayed (inclusive).
          maxZoom: 18,
          // @option subdomains: String|String[] = 'abc'
          // Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
          subdomains: "abc",
          // @option errorTileUrl: String = ''
          // URL to the tile image to show in place of the tile that failed to load.
          errorTileUrl: "",
          // @option zoomOffset: Number = 0
          // The zoom number used in tile URLs will be offset with this value.
          zoomOffset: 0,
          // @option tms: Boolean = false
          // If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
          tms: !1,
          // @option zoomReverse: Boolean = false
          // If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
          zoomReverse: !1,
          // @option detectRetina: Boolean = false
          // If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
          detectRetina: !1,
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the tiles.
          // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: !1,
          // @option referrerPolicy: Boolean|String = false
          // Whether the referrerPolicy attribute will be added to the tiles.
          // If a String is provided, all tiles will have their referrerPolicy attribute set to the String provided.
          // This may be needed if your map's rendering context has a strict default but your tile provider expects a valid referrer
          // (e.g. to validate an API token).
          // Refer to [HTMLImageElement.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy) for valid String values.
          referrerPolicy: !1
        },
        initialize: function(t, e) {
          this._url = t, e = M(this, e), e.detectRetina && z.retina && e.maxZoom > 0 ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), typeof e.subdomains == "string" && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove);
        },
        // @method setUrl(url: String, noRedraw?: Boolean): this
        // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
        // If the URL does not change, the layer will not be redrawn unless
        // the noRedraw parameter is set to false.
        setUrl: function(t, e) {
          return this._url === t && e === void 0 && (e = !0), this._url = t, e || this.redraw(), this;
        },
        // @method createTile(coords: Object, done?: Function): HTMLElement
        // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
        // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
        // callback is called when the tile has been loaded.
        createTile: function(t, e) {
          var i = document.createElement("img");
          return j(i, "load", m(this._tileOnLoad, this, e, i)), j(i, "error", m(this._tileOnError, this, e, i)), (this.options.crossOrigin || this.options.crossOrigin === "") && (i.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(t), i;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(t) {
          var e = {
            r: z.retina ? "@2x" : "",
            s: this._getSubdomain(t),
            x: t.x,
            y: t.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var i = this._globalTileRange.max.y - t.y;
            this.options.tms && (e.y = i), e["-y"] = i;
          }
          return X(this._url, u(e, this.options));
        },
        _tileOnLoad: function(t, e) {
          z.ielt9 ? setTimeout(m(t, this, null, e), 0) : t(null, e);
        },
        _tileOnError: function(t, e, i) {
          var n = this.options.errorTileUrl;
          n && e.getAttribute("src") !== n && (e.src = n), t(i, e);
        },
        _onTileRemove: function(t) {
          t.tile.onload = null;
        },
        _getZoomForUrl: function() {
          var t = this._tileZoom, e = this.options.maxZoom, i = this.options.zoomReverse, n = this.options.zoomOffset;
          return i && (t = e - t), t + n;
        },
        _getSubdomain: function(t) {
          var e = Math.abs(t.x + t.y) % this.options.subdomains.length;
          return this.options.subdomains[e];
        },
        // stops loading all tiles in the background layer
        _abortLoading: function() {
          var t, e;
          for (t in this._tiles)
            if (this._tiles[t].coords.z !== this._tileZoom && (e = this._tiles[t].el, e.onload = x, e.onerror = x, !e.complete)) {
              e.src = H;
              var i = this._tiles[t].coords;
              ct(e), delete this._tiles[t], this.fire("tileabort", {
                tile: e,
                coords: i
              });
            }
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          if (e)
            return e.el.setAttribute("src", H), Ke.prototype._removeTile.call(this, t);
        },
        _tileReady: function(t, e, i) {
          if (!(!this._map || i && i.getAttribute("src") === H))
            return Ke.prototype._tileReady.call(this, t, e, i);
        }
      });
      function Xn(t, e) {
        return new Ie(t, e);
      }
      var Jn = Ie.extend({
        // @section
        // @aka TileLayer.WMS options
        // If any custom options not documented here are used, they will be sent to the
        // WMS server as extra parameters in each request URL. This can be useful for
        // [non-standard vendor WMS parameters](https://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
        defaultWmsParams: {
          service: "WMS",
          request: "GetMap",
          // @option layers: String = ''
          // **(required)** Comma-separated list of WMS layers to show.
          layers: "",
          // @option styles: String = ''
          // Comma-separated list of WMS styles.
          styles: "",
          // @option format: String = 'image/jpeg'
          // WMS image format (use `'image/png'` for layers with transparency).
          format: "image/jpeg",
          // @option transparent: Boolean = false
          // If `true`, the WMS service will return images with transparency.
          transparent: !1,
          // @option version: String = '1.1.1'
          // Version of the WMS service to use
          version: "1.1.1"
        },
        options: {
          // @option crs: CRS = null
          // Coordinate Reference System to use for the WMS requests, defaults to
          // map CRS. Don't change this if you're not sure what it means.
          crs: null,
          // @option uppercase: Boolean = false
          // If `true`, WMS request parameter keys will be uppercase.
          uppercase: !1
        },
        initialize: function(t, e) {
          this._url = t;
          var i = u({}, this.defaultWmsParams);
          for (var n in e)
            n in this.options || (i[n] = e[n]);
          e = M(this, e);
          var o = e.detectRetina && z.retina ? 2 : 1, s = this.getTileSize();
          i.width = s.x * o, i.height = s.y * o, this.wmsParams = i;
        },
        onAdd: function(t) {
          this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var e = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[e] = this._crs.code, Ie.prototype.onAdd.call(this, t);
        },
        getTileUrl: function(t) {
          var e = this._tileCoordsToNwSe(t), i = this._crs, n = et(i.project(e[0]), i.project(e[1])), o = n.min, s = n.max, l = (this._wmsVersion >= 1.3 && this._crs === jn ? [o.y, o.x, s.y, s.x] : [o.x, o.y, s.x, s.y]).join(","), d = Ie.prototype.getTileUrl.call(this, t);
          return d + A(this.wmsParams, d, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + l;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(t, e) {
          return u(this.wmsParams, t), e || this.redraw(), this;
        }
      });
      function Us(t, e) {
        return new Jn(t, e);
      }
      Ie.WMS = Jn, Xn.wms = Us;
      var oe = qt.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(t) {
          M(this, t), p(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), G(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
        },
        onRemove: function() {
          this.off("update", this._updatePaths, this), this._destroyContainer();
        },
        getEvents: function() {
          var t = {
            viewreset: this._reset,
            zoom: this._onZoom,
            moveend: this._update,
            zoomend: this._onZoomEnd
          };
          return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
        },
        _onAnimZoom: function(t) {
          this._updateTransform(t.center, t.zoom);
        },
        _onZoom: function() {
          this._updateTransform(this._map.getCenter(), this._map.getZoom());
        },
        _updateTransform: function(t, e) {
          var i = this._map.getZoomScale(e, this._zoom), n = this._map.getSize().multiplyBy(0.5 + this.options.padding), o = this._map.project(this._center, e), s = n.multiplyBy(-i).add(o).subtract(this._map._getNewPixelOrigin(t, e));
          z.any3d ? ge(this._container, s, i) : yt(this._container, s);
        },
        _reset: function() {
          this._update(), this._updateTransform(this._center, this._zoom);
          for (var t in this._layers)
            this._layers[t]._reset();
        },
        _onZoomEnd: function() {
          for (var t in this._layers)
            this._layers[t]._project();
        },
        _updatePaths: function() {
          for (var t in this._layers)
            this._layers[t]._update();
        },
        _update: function() {
          var t = this.options.padding, e = this._map.getSize(), i = this._map.containerPointToLayerPoint(e.multiplyBy(-t)).round();
          this._bounds = new F(i, i.add(e.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), Qn = oe.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var t = oe.prototype.getEvents.call(this);
          return t.viewprereset = this._onViewPreReset, t;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          oe.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var t = this._container = document.createElement("canvas");
          j(t, "mousemove", this._onMouseMove, this), j(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), j(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
        },
        _destroyContainer: function() {
          K(this._redrawRequest), delete this._ctx, ct(this._container), ht(this._container), delete this._container;
        },
        _updatePaths: function() {
          if (!this._postponeUpdatePaths) {
            var t;
            this._redrawBounds = null;
            for (var e in this._layers)
              t = this._layers[e], t._update();
            this._redraw();
          }
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            oe.prototype._update.call(this);
            var t = this._bounds, e = this._container, i = t.getSize(), n = z.retina ? 2 : 1;
            yt(e, t.min), e.width = n * i.x, e.height = n * i.y, e.style.width = i.x + "px", e.style.height = i.y + "px", z.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
          }
        },
        _reset: function() {
          oe.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
        },
        _initPath: function(t) {
          this._updateDashArray(t), this._layers[p(t)] = t;
          var e = t._order = {
            layer: t,
            prev: this._drawLast,
            next: null
          };
          this._drawLast && (this._drawLast.next = e), this._drawLast = e, this._drawFirst = this._drawFirst || this._drawLast;
        },
        _addPath: function(t) {
          this._requestRedraw(t);
        },
        _removePath: function(t) {
          var e = t._order, i = e.next, n = e.prev;
          i ? i.prev = n : this._drawLast = n, n ? n.next = i : this._drawFirst = i, delete t._order, delete this._layers[p(t)], this._requestRedraw(t);
        },
        _updatePath: function(t) {
          this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
        },
        _updateStyle: function(t) {
          this._updateDashArray(t), this._requestRedraw(t);
        },
        _updateDashArray: function(t) {
          if (typeof t.options.dashArray == "string") {
            var e = t.options.dashArray.split(/[, ]+/), i = [], n, o;
            for (o = 0; o < e.length; o++) {
              if (n = Number(e[o]), isNaN(n))
                return;
              i.push(n);
            }
            t.options._dashArray = i;
          } else
            t.options._dashArray = t.options.dashArray;
        },
        _requestRedraw: function(t) {
          this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || D(this._redraw, this));
        },
        _extendRedrawBounds: function(t) {
          if (t._pxBounds) {
            var e = (t.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new F(), this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e]));
          }
        },
        _redraw: function() {
          this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
        },
        _clear: function() {
          var t = this._redrawBounds;
          if (t) {
            var e = t.getSize();
            this._ctx.clearRect(t.min.x, t.min.y, e.x, e.y);
          } else
            this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore();
        },
        _draw: function() {
          var t, e = this._redrawBounds;
          if (this._ctx.save(), e) {
            var i = e.getSize();
            this._ctx.beginPath(), this._ctx.rect(e.min.x, e.min.y, i.x, i.y), this._ctx.clip();
          }
          this._drawing = !0;
          for (var n = this._drawFirst; n; n = n.next)
            t = n.layer, (!e || t._pxBounds && t._pxBounds.intersects(e)) && t._updatePath();
          this._drawing = !1, this._ctx.restore();
        },
        _updatePoly: function(t, e) {
          if (this._drawing) {
            var i, n, o, s, l = t._parts, d = l.length, _ = this._ctx;
            if (d) {
              for (_.beginPath(), i = 0; i < d; i++) {
                for (n = 0, o = l[i].length; n < o; n++)
                  s = l[i][n], _[n ? "lineTo" : "moveTo"](s.x, s.y);
                e && _.closePath();
              }
              this._fillStroke(_, t);
            }
          }
        },
        _updateCircle: function(t) {
          if (!(!this._drawing || t._empty())) {
            var e = t._point, i = this._ctx, n = Math.max(Math.round(t._radius), 1), o = (Math.max(Math.round(t._radiusY), 1) || n) / n;
            o !== 1 && (i.save(), i.scale(1, o)), i.beginPath(), i.arc(e.x, e.y / o, n, 0, Math.PI * 2, !1), o !== 1 && i.restore(), this._fillStroke(i, t);
          }
        },
        _fillStroke: function(t, e) {
          var i = e.options;
          i.fill && (t.globalAlpha = i.fillOpacity, t.fillStyle = i.fillColor || i.color, t.fill(i.fillRule || "evenodd")), i.stroke && i.weight !== 0 && (t.setLineDash && t.setLineDash(e.options && e.options._dashArray || []), t.globalAlpha = i.opacity, t.lineWidth = i.weight, t.strokeStyle = i.color, t.lineCap = i.lineCap, t.lineJoin = i.lineJoin, t.stroke());
        },
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: function(t) {
          for (var e = this._map.mouseEventToLayerPoint(t), i, n, o = this._drawFirst; o; o = o.next)
            i = o.layer, i.options.interactive && i._containsPoint(e) && (!(t.type === "click" || t.type === "preclick") || !this._map._draggableMoved(i)) && (n = i);
          this._fireEvent(n ? [n] : !1, t);
        },
        _onMouseMove: function(t) {
          if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
            var e = this._map.mouseEventToLayerPoint(t);
            this._handleMouseHover(t, e);
          }
        },
        _handleMouseOut: function(t) {
          var e = this._hoveredLayer;
          e && (pt(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(t, e) {
          if (!this._mouseHoverThrottled) {
            for (var i, n, o = this._drawFirst; o; o = o.next)
              i = o.layer, i.options.interactive && i._containsPoint(e) && (n = i);
            n !== this._hoveredLayer && (this._handleMouseOut(t), n && (G(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseover"), this._hoveredLayer = n)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout(m(function() {
              this._mouseHoverThrottled = !1;
            }, this), 32);
          }
        },
        _fireEvent: function(t, e, i) {
          this._map._fireDOMEvent(e, i || e.type, t);
        },
        _bringToFront: function(t) {
          var e = t._order;
          if (e) {
            var i = e.next, n = e.prev;
            if (i)
              i.prev = n;
            else
              return;
            n ? n.next = i : i && (this._drawFirst = i), e.prev = this._drawLast, this._drawLast.next = e, e.next = null, this._drawLast = e, this._requestRedraw(t);
          }
        },
        _bringToBack: function(t) {
          var e = t._order;
          if (e) {
            var i = e.next, n = e.prev;
            if (n)
              n.next = i;
            else
              return;
            i ? i.prev = n : n && (this._drawLast = n), e.prev = null, e.next = this._drawFirst, this._drawFirst.prev = e, this._drawFirst = e, this._requestRedraw(t);
          }
        }
      });
      function to(t) {
        return z.canvas ? new Qn(t) : null;
      }
      var Ye = (function() {
        try {
          return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(t) {
            return document.createElement("<lvml:" + t + ' class="lvml">');
          };
        } catch {
        }
        return function(t) {
          return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })(), js = {
        _initContainer: function() {
          this._container = Q("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (oe.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(t) {
          var e = t._container = Ye("shape");
          G(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = Ye("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[p(t)] = t;
        },
        _addPath: function(t) {
          var e = t._container;
          this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e);
        },
        _removePath: function(t) {
          var e = t._container;
          ct(e), t.removeInteractiveTarget(e), delete this._layers[p(t)];
        },
        _updateStyle: function(t) {
          var e = t._stroke, i = t._fill, n = t.options, o = t._container;
          o.stroked = !!n.stroke, o.filled = !!n.fill, n.stroke ? (e || (e = t._stroke = Ye("stroke")), o.appendChild(e), e.weight = n.weight + "px", e.color = n.color, e.opacity = n.opacity, n.dashArray ? e.dashStyle = U(n.dashArray) ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = n.lineCap.replace("butt", "flat"), e.joinstyle = n.lineJoin) : e && (o.removeChild(e), t._stroke = null), n.fill ? (i || (i = t._fill = Ye("fill")), o.appendChild(i), i.color = n.fillColor || n.color, i.opacity = n.fillOpacity) : i && (o.removeChild(i), t._fill = null);
        },
        _updateCircle: function(t) {
          var e = t._point.round(), i = Math.round(t._radius), n = Math.round(t._radiusY || i);
          this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + i + "," + n + " 0," + 65535 * 360);
        },
        _setPath: function(t, e) {
          t._path.v = e;
        },
        _bringToFront: function(t) {
          Se(t._container);
        },
        _bringToBack: function(t) {
          Ce(t._container);
        }
      }, Pi = z.vml ? Ye : at, Xe = oe.extend({
        _initContainer: function() {
          this._container = Pi("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Pi("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          ct(this._container), ht(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            oe.prototype._update.call(this);
            var t = this._bounds, e = t.getSize(), i = this._container;
            (!this._svgSize || !this._svgSize.equals(e)) && (this._svgSize = e, i.setAttribute("width", e.x), i.setAttribute("height", e.y)), yt(i, t.min), i.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(t) {
          var e = t._path = Pi("path");
          t.options.className && G(e, t.options.className), t.options.interactive && G(e, "leaflet-interactive"), this._updateStyle(t), this._layers[p(t)] = t;
        },
        _addPath: function(t) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
        },
        _removePath: function(t) {
          ct(t._path), t.removeInteractiveTarget(t._path), delete this._layers[p(t)];
        },
        _updatePath: function(t) {
          t._project(), t._update();
        },
        _updateStyle: function(t) {
          var e = t._path, i = t.options;
          e && (i.stroke ? (e.setAttribute("stroke", i.color), e.setAttribute("stroke-opacity", i.opacity), e.setAttribute("stroke-width", i.weight), e.setAttribute("stroke-linecap", i.lineCap), e.setAttribute("stroke-linejoin", i.lineJoin), i.dashArray ? e.setAttribute("stroke-dasharray", i.dashArray) : e.removeAttribute("stroke-dasharray"), i.dashOffset ? e.setAttribute("stroke-dashoffset", i.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), i.fill ? (e.setAttribute("fill", i.fillColor || i.color), e.setAttribute("fill-opacity", i.fillOpacity), e.setAttribute("fill-rule", i.fillRule || "evenodd")) : e.setAttribute("fill", "none"));
        },
        _updatePoly: function(t, e) {
          this._setPath(t, pe(t._parts, e));
        },
        _updateCircle: function(t) {
          var e = t._point, i = Math.max(Math.round(t._radius), 1), n = Math.max(Math.round(t._radiusY), 1) || i, o = "a" + i + "," + n + " 0 1,0 ", s = t._empty() ? "M0 0" : "M" + (e.x - i) + "," + e.y + o + i * 2 + ",0 " + o + -i * 2 + ",0 ";
          this._setPath(t, s);
        },
        _setPath: function(t, e) {
          t._path.setAttribute("d", e);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(t) {
          Se(t._path);
        },
        _bringToBack: function(t) {
          Ce(t._path);
        }
      });
      z.vml && Xe.include(js);
      function eo(t) {
        return z.svg || z.vml ? new Xe(t) : null;
      }
      Y.include({
        // @namespace Map; @method getRenderer(layer: Path): Renderer
        // Returns the instance of `Renderer` that should be used to render the given
        // `Path`. It will ensure that the `renderer` options of the map and paths
        // are respected, and that the renderers do exist on the map.
        getRenderer: function(t) {
          var e = t.options.renderer || this._getPaneRenderer(t.options.pane) || this.options.renderer || this._renderer;
          return e || (e = this._renderer = this._createRenderer()), this.hasLayer(e) || this.addLayer(e), e;
        },
        _getPaneRenderer: function(t) {
          if (t === "overlayPane" || t === void 0)
            return !1;
          var e = this._paneRenderers[t];
          return e === void 0 && (e = this._createRenderer({ pane: t }), this._paneRenderers[t] = e), e;
        },
        _createRenderer: function(t) {
          return this.options.preferCanvas && to(t) || eo(t);
        }
      });
      var io = Oe.extend({
        initialize: function(t, e) {
          Oe.prototype.initialize.call(this, this._boundsToLatLngs(t), e);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(t) {
          return this.setLatLngs(this._boundsToLatLngs(t));
        },
        _boundsToLatLngs: function(t) {
          return t = nt(t), [
            t.getSouthWest(),
            t.getNorthWest(),
            t.getNorthEast(),
            t.getSouthEast()
          ];
        }
      });
      function qs(t, e) {
        return new io(t, e);
      }
      Xe.create = Pi, Xe.pointsToPath = pe, ne.geometryToLayer = pi, ne.coordsToLatLng = sn, ne.coordsToLatLngs = gi, ne.latLngToCoords = rn, ne.latLngsToCoords = vi, ne.getFeature = Ae, ne.asFeature = yi, Y.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var no = Yt.extend({
        initialize: function(t) {
          this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
        },
        addHooks: function() {
          j(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          ht(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          ct(this._pane), delete this._pane;
        },
        _resetState: function() {
          this._resetStateTimeout = 0, this._moved = !1;
        },
        _clearDeferredResetState: function() {
          this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
        },
        _onMouseDown: function(t) {
          if (!t.shiftKey || t.which !== 1 && t.button !== 1)
            return !1;
          this._clearDeferredResetState(), this._resetState(), We(), Hi(), this._startPoint = this._map.mouseEventToContainerPoint(t), j(document, {
            contextmenu: we,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(t) {
          this._moved || (this._moved = !0, this._box = Q("div", "leaflet-zoom-box", this._container), G(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
          var e = new F(this._point, this._startPoint), i = e.getSize();
          yt(this._box, e.min), this._box.style.width = i.x + "px", this._box.style.height = i.y + "px";
        },
        _finish: function() {
          this._moved && (ct(this._box), pt(this._container, "leaflet-crosshair")), Ue(), Wi(), ht(document, {
            contextmenu: we,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(t) {
          if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(m(this._resetState, this), 0);
            var e = new it(
              this._map.containerPointToLatLng(this._startPoint),
              this._map.containerPointToLatLng(this._point)
            );
            this._map.fitBounds(e).fire("boxzoomend", { boxZoomBounds: e });
          }
        },
        _onKeyDown: function(t) {
          t.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
        }
      });
      Y.addInitHook("addHandler", "boxZoom", no), Y.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var oo = Yt.extend({
        addHooks: function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function(t) {
          var e = this._map, i = e.getZoom(), n = e.options.zoomDelta, o = t.originalEvent.shiftKey ? i - n : i + n;
          e.options.doubleClickZoom === "center" ? e.setZoom(o) : e.setZoomAround(t.containerPoint, o);
        }
      });
      Y.addInitHook("addHandler", "doubleClickZoom", oo), Y.mergeOptions({
        // @option dragging: Boolean = true
        // Whether the map is draggable with mouse/touch or not.
        dragging: !0,
        // @section Panning Inertia Options
        // @option inertia: Boolean = *
        // If enabled, panning of the map will have an inertia effect where
        // the map builds momentum while dragging and continues moving in
        // the same direction for some time. Feels especially nice on touch
        // devices. Enabled by default.
        inertia: !0,
        // @option inertiaDeceleration: Number = 3000
        // The rate with which the inertial movement slows down, in pixels/second².
        inertiaDeceleration: 3400,
        // px/s^2
        // @option inertiaMaxSpeed: Number = Infinity
        // Max speed of the inertial movement, in pixels/second.
        inertiaMaxSpeed: 1 / 0,
        // px/s
        // @option easeLinearity: Number = 0.2
        easeLinearity: 0.2,
        // TODO refactor, move to CRS
        // @option worldCopyJump: Boolean = false
        // With this option enabled, the map tracks when you pan to another "copy"
        // of the world and seamlessly jumps to the original one so that all overlays
        // like markers and vector layers are still visible.
        worldCopyJump: !1,
        // @option maxBoundsViscosity: Number = 0.0
        // If `maxBounds` is set, this option will control how solid the bounds
        // are when dragging the map around. The default value of `0.0` allows the
        // user to drag outside the bounds at normal speed, higher values will
        // slow down map dragging outside bounds, and `1.0` makes the bounds fully
        // solid, preventing the user from dragging outside the bounds.
        maxBoundsViscosity: 0
      });
      var so = Yt.extend({
        addHooks: function() {
          if (!this._draggable) {
            var t = this._map;
            this._draggable = new ue(t._mapPane, t._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
          }
          G(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          pt(this._map._container, "leaflet-grab"), pt(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        moving: function() {
          return this._draggable && this._draggable._moving;
        },
        _onDragStart: function() {
          var t = this._map;
          if (t._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
            var e = nt(this._map.options.maxBounds);
            this._offsetLimit = et(
              this._map.latLngToContainerPoint(e.getNorthWest()).multiplyBy(-1),
              this._map.latLngToContainerPoint(e.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
            ), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
          } else
            this._offsetLimit = null;
          t.fire("movestart").fire("dragstart"), t.options.inertia && (this._positions = [], this._times = []);
        },
        _onDrag: function(t) {
          if (this._map.options.inertia) {
            var e = this._lastTime = +/* @__PURE__ */ new Date(), i = this._lastPos = this._draggable._absPos || this._draggable._newPos;
            this._positions.push(i), this._times.push(e), this._prunePositions(e);
          }
          this._map.fire("move", t).fire("drag", t);
        },
        _prunePositions: function(t) {
          for (; this._positions.length > 1 && t - this._times[0] > 50; )
            this._positions.shift(), this._times.shift();
        },
        _onZoomEnd: function() {
          var t = this._map.getSize().divideBy(2), e = this._map.latLngToLayerPoint([0, 0]);
          this._initialWorldOffset = e.subtract(t).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
        },
        _viscousLimit: function(t, e) {
          return t - (t - e) * this._viscosity;
        },
        _onPreDragLimit: function() {
          if (!(!this._viscosity || !this._offsetLimit)) {
            var t = this._draggable._newPos.subtract(this._draggable._startPos), e = this._offsetLimit;
            t.x < e.min.x && (t.x = this._viscousLimit(t.x, e.min.x)), t.y < e.min.y && (t.y = this._viscousLimit(t.y, e.min.y)), t.x > e.max.x && (t.x = this._viscousLimit(t.x, e.max.x)), t.y > e.max.y && (t.y = this._viscousLimit(t.y, e.max.y)), this._draggable._newPos = this._draggable._startPos.add(t);
          }
        },
        _onPreDragWrap: function() {
          var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset, n = this._draggable._newPos.x, o = (n - e + i) % t + e - i, s = (n + e + i) % t - e - i, l = Math.abs(o + i) < Math.abs(s + i) ? o : s;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = l;
        },
        _onDragEnd: function(t) {
          var e = this._map, i = e.options, n = !i.inertia || t.noInertia || this._times.length < 2;
          if (e.fire("dragend", t), n)
            e.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var o = this._lastPos.subtract(this._positions[0]), s = (this._lastTime - this._times[0]) / 1e3, l = i.easeLinearity, d = o.multiplyBy(l / s), _ = d.distanceTo([0, 0]), b = Math.min(i.inertiaMaxSpeed, _), k = d.multiplyBy(b / _), Z = b / (i.inertiaDeceleration * l), V = k.multiplyBy(-Z / 2).round();
            !V.x && !V.y ? e.fire("moveend") : (V = e._limitOffset(V, e.options.maxBounds), D(function() {
              e.panBy(V, {
                duration: Z,
                easeLinearity: l,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      Y.addInitHook("addHandler", "dragging", so), Y.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var ro = Yt.extend({
        keyCodes: {
          left: [37],
          right: [39],
          down: [40],
          up: [38],
          zoomIn: [187, 107, 61, 171],
          zoomOut: [189, 109, 54, 173]
        },
        initialize: function(t) {
          this._map = t, this._setPanDelta(t.options.keyboardPanDelta), this._setZoomDelta(t.options.zoomDelta);
        },
        addHooks: function() {
          var t = this._map._container;
          t.tabIndex <= 0 && (t.tabIndex = "0"), j(t, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this), this._map.on({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        },
        removeHooks: function() {
          this._removeHooks(), ht(this._map._container, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this), this._map.off({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        },
        _onMouseDown: function() {
          if (!this._focused) {
            var t = document.body, e = document.documentElement, i = t.scrollTop || e.scrollTop, n = t.scrollLeft || e.scrollLeft;
            this._map._container.focus(), window.scrollTo(n, i);
          }
        },
        _onFocus: function() {
          this._focused = !0, this._map.fire("focus");
        },
        _onBlur: function() {
          this._focused = !1, this._map.fire("blur");
        },
        _setPanDelta: function(t) {
          var e = this._panKeys = {}, i = this.keyCodes, n, o;
          for (n = 0, o = i.left.length; n < o; n++)
            e[i.left[n]] = [-1 * t, 0];
          for (n = 0, o = i.right.length; n < o; n++)
            e[i.right[n]] = [t, 0];
          for (n = 0, o = i.down.length; n < o; n++)
            e[i.down[n]] = [0, t];
          for (n = 0, o = i.up.length; n < o; n++)
            e[i.up[n]] = [0, -1 * t];
        },
        _setZoomDelta: function(t) {
          var e = this._zoomKeys = {}, i = this.keyCodes, n, o;
          for (n = 0, o = i.zoomIn.length; n < o; n++)
            e[i.zoomIn[n]] = t;
          for (n = 0, o = i.zoomOut.length; n < o; n++)
            e[i.zoomOut[n]] = -t;
        },
        _addHooks: function() {
          j(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          ht(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(t) {
          if (!(t.altKey || t.ctrlKey || t.metaKey)) {
            var e = t.keyCode, i = this._map, n;
            if (e in this._panKeys) {
              if (!i._panAnim || !i._panAnim._inProgress)
                if (n = this._panKeys[e], t.shiftKey && (n = N(n).multiplyBy(3)), i.options.maxBounds && (n = i._limitOffset(N(n), i.options.maxBounds)), i.options.worldCopyJump) {
                  var o = i.wrapLatLng(i.unproject(i.project(i.getCenter()).add(n)));
                  i.panTo(o);
                } else
                  i.panBy(n);
            } else if (e in this._zoomKeys)
              i.setZoom(i.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);
            else if (e === 27 && i._popup && i._popup.options.closeOnEscapeKey)
              i.closePopup();
            else
              return;
            we(t);
          }
        }
      });
      Y.addInitHook("addHandler", "keyboard", ro), Y.mergeOptions({
        // @section Mouse wheel options
        // @option scrollWheelZoom: Boolean|String = true
        // Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
        // it will zoom to the center of the view regardless of where the mouse was.
        scrollWheelZoom: !0,
        // @option wheelDebounceTime: Number = 40
        // Limits the rate at which a wheel can fire (in milliseconds). By default
        // user can't zoom via wheel more often than once per 40 ms.
        wheelDebounceTime: 40,
        // @option wheelPxPerZoomLevel: Number = 60
        // How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
        // mean a change of one full zoom level. Smaller values will make wheel-zooming
        // faster (and vice versa).
        wheelPxPerZoomLevel: 60
      });
      var ao = Yt.extend({
        addHooks: function() {
          j(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          ht(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(t) {
          var e = zn(t), i = this._map.options.wheelDebounceTime;
          this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var n = Math.max(i - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(m(this._performZoom, this), n), we(t);
        },
        _performZoom: function() {
          var t = this._map, e = t.getZoom(), i = this._map.options.zoomSnap || 0;
          t._stop();
          var n = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), o = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(n)))) / Math.LN2, s = i ? Math.ceil(o / i) * i : o, l = t._limitZoom(e + (this._delta > 0 ? s : -s)) - e;
          this._delta = 0, this._startTime = null, l && (t.options.scrollWheelZoom === "center" ? t.setZoom(e + l) : t.setZoomAround(this._lastMousePos, e + l));
        }
      });
      Y.addInitHook("addHandler", "scrollWheelZoom", ao);
      var Gs = 600;
      Y.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: z.touchNative && z.safari && z.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var ho = Yt.extend({
        addHooks: function() {
          j(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          ht(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(t) {
          if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
            var e = t.touches[0];
            this._startPos = this._newPos = new I(e.clientX, e.clientY), this._holdTimeout = setTimeout(m(function() {
              this._cancel(), this._isTapValid() && (j(document, "touchend", Lt), j(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e));
            }, this), Gs), j(document, "touchend touchcancel contextmenu", this._cancel, this), j(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function t() {
          ht(document, "touchend", Lt), ht(document, "touchend touchcancel", t);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), ht(document, "touchend touchcancel contextmenu", this._cancel, this), ht(document, "touchmove", this._onMove, this);
        },
        _onMove: function(t) {
          var e = t.touches[0];
          this._newPos = new I(e.clientX, e.clientY);
        },
        _isTapValid: function() {
          return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
        },
        _simulateEvent: function(t, e) {
          var i = new MouseEvent(t, {
            bubbles: !0,
            cancelable: !0,
            view: window,
            // detail: 1,
            screenX: e.screenX,
            screenY: e.screenY,
            clientX: e.clientX,
            clientY: e.clientY
            // button: 2,
            // buttons: 2
          });
          i._simulated = !0, e.target.dispatchEvent(i);
        }
      });
      Y.addInitHook("addHandler", "tapHold", ho), Y.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: z.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var lo = Yt.extend({
        addHooks: function() {
          G(this._map._container, "leaflet-touch-zoom"), j(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          pt(this._map._container, "leaflet-touch-zoom"), ht(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(t) {
          var e = this._map;
          if (!(!t.touches || t.touches.length !== 2 || e._animatingZoom || this._zooming)) {
            var i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]);
            this._centerPoint = e.getSize()._divideBy(2), this._startLatLng = e.containerPointToLatLng(this._centerPoint), e.options.touchZoom !== "center" && (this._pinchStartLatLng = e.containerPointToLatLng(i.add(n)._divideBy(2))), this._startDist = i.distanceTo(n), this._startZoom = e.getZoom(), this._moved = !1, this._zooming = !0, e._stop(), j(document, "touchmove", this._onTouchMove, this), j(document, "touchend touchcancel", this._onTouchEnd, this), Lt(t);
          }
        },
        _onTouchMove: function(t) {
          if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
            var e = this._map, i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]), o = i.distanceTo(n) / this._startDist;
            if (this._zoom = e.getScaleZoom(o, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && o < 1 || this._zoom > e.getMaxZoom() && o > 1) && (this._zoom = e._limitZoom(this._zoom)), e.options.touchZoom === "center") {
              if (this._center = this._startLatLng, o === 1)
                return;
            } else {
              var s = i._add(n)._divideBy(2)._subtract(this._centerPoint);
              if (o === 1 && s.x === 0 && s.y === 0)
                return;
              this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(s), this._zoom);
            }
            this._moved || (e._moveStart(!0, !1), this._moved = !0), K(this._animRequest);
            var l = m(e._move, e, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = D(l, this, !0), Lt(t);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, K(this._animRequest), ht(document, "touchmove", this._onTouchMove, this), ht(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      Y.addInitHook("addHandler", "touchZoom", lo), Y.BoxZoom = no, Y.DoubleClickZoom = oo, Y.Drag = so, Y.Keyboard = ro, Y.ScrollWheelZoom = ao, Y.TapHold = ho, Y.TouchZoom = lo, r.Bounds = F, r.Browser = z, r.CRS = Ct, r.Canvas = Qn, r.Circle = on, r.CircleMarker = _i, r.Class = ut, r.Control = jt, r.DivIcon = Yn, r.DivOverlay = Xt, r.DomEvent = us, r.DomUtil = hs, r.Draggable = ue, r.Evented = dt, r.FeatureGroup = ee, r.GeoJSON = ne, r.GridLayer = Ke, r.Handler = Yt, r.Icon = ze, r.ImageOverlay = wi, r.LatLng = J, r.LatLngBounds = it, r.Layer = qt, r.LayerGroup = Ee, r.LineUtil = Ps, r.Map = Y, r.Marker = mi, r.Mixin = gs, r.Path = ce, r.Point = I, r.PolyUtil = vs, r.Polygon = Oe, r.Polyline = ie, r.Popup = xi, r.PosAnimation = On, r.Projection = Ls, r.Rectangle = io, r.Renderer = oe, r.SVG = Xe, r.SVGOverlay = Kn, r.TileLayer = Ie, r.Tooltip = bi, r.Transformation = _e, r.Util = rt, r.VideoOverlay = $n, r.bind = m, r.bounds = et, r.canvas = to, r.circle = Os, r.circleMarker = zs, r.control = Ge, r.divIcon = Hs, r.extend = u, r.featureGroup = Ss, r.geoJSON = Vn, r.geoJson = Ns, r.gridLayer = Ws, r.icon = Cs, r.imageOverlay = Zs, r.latLng = $, r.latLngBounds = nt, r.layerGroup = ks, r.map = cs, r.marker = Es, r.point = N, r.polygon = Is, r.polyline = As, r.popup = Ds, r.rectangle = qs, r.setOptions = M, r.stamp = p, r.svg = eo, r.svgOverlay = Rs, r.tileLayer = Xn, r.tooltip = Fs, r.transformation = he, r.version = c, r.videoOverlay = Bs;
      var Vs = window.L;
      r.noConflict = function() {
        return window.L = Vs, this;
      }, window.L = r;
    }));
  })(ei, ei.exports)), ei.exports;
}
var Vr = Gr();
const zt = /* @__PURE__ */ jr(Vr), $r = [51.5074, -0.1278], Kr = "https://tile.openstreetmap.org/{z}/{x}/{y}.png", Yr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', Xr = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5 9 8h6l3.5 8.5M9 8l3.5 8.5h6M14 5h2.5"/></svg>';
function Jr(a, h) {
  return zt.divIcon({
    className: "",
    html: `<div class="${P.endPin}" data-kind="${h}">${a}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
}
const Qr = ir(function({
  plan: h,
  ride: r,
  signalPlans: c,
  start: u,
  end: f,
  playing: m,
  picking: v,
  canMoveEnds: p,
  onPick: g,
  onFollowChange: y,
  tileUrl: x,
  tileAttribution: S
}, q) {
  const O = bt(null), M = bt(null), A = bt({ lights: [] }), B = bt({ plan: h, ride: r, signalPlans: c, picking: v, onPick: g, onFollowChange: y, playing: m });
  B.current = { plan: h, ride: r, signalPlans: c, picking: v, onPick: g, onFollowChange: y, playing: m };
  const X = bt(!0), U = bt(0), C = bt(0), H = (E) => {
    X.current !== E && (X.current = E, B.current.onFollowChange?.(E));
  }, st = () => {
    const E = M.current, W = B.current.plan && _o(B.current.plan.coordinates);
    E && W && E.fitBounds(W, { padding: [36, 36], animate: !0 });
  }, lt = (E) => {
    U.current = E;
    const W = M.current, { plan: tt, ride: D, signalPlans: K, playing: rt } = B.current, { rider: ut, done: te, lights: mt } = A.current;
    if (!W || !tt || !D || !ut) return;
    const { distance: dt, speed: I } = Mi(D, E), Tt = Qe(tt.coordinates, tt.cum, dt);
    ut.setLatLng([Tt.lat, Tt.lng]);
    const N = ut.getElement()?.firstElementChild;
    if (N) {
      const F = I < 0.05 && E > 0 && E < D.duration;
      N.dataset.waiting !== String(F) && (N.dataset.waiting = String(F));
    }
    if (te) {
      const F = Oo(tt.cum, dt), et = [];
      for (let it = 0; it <= F; it++) et.push([tt.coordinates[it][1], tt.coordinates[it][0]]);
      et.push([Tt.lat, Tt.lng]), te.setLatLngs(et);
    }
    for (let F = 0; F < mt.length; F++) {
      const et = mt[F];
      if (!et.el) continue;
      const it = dt > tt.signals[F].distance + 2 ? "passed" : mn(K[F], E, D.offsets[F]);
      it !== et.phase && (et.phase = it, et.el.dataset.phase = it);
    }
    if (rt && X.current && performance.now() > C.current) {
      const F = W.getSize(), et = W.latLngToContainerPoint([Tt.lat, Tt.lng]), it = F.x * 0.28, nt = F.y * 0.28;
      (et.x < it || et.x > F.x - it || et.y < nt || et.y > F.y - nt) && W.panTo([Tt.lat, Tt.lng], { animate: !0, duration: 0.5 });
    }
  };
  return nr(q, () => ({
    showTime: lt,
    fit: st,
    follow: () => {
      H(!0);
      const { plan: E, ride: W } = B.current;
      if (M.current && E && W) {
        const tt = Qe(E.coordinates, E.cum, Mi(W, U.current).distance);
        M.current.setView([tt.lat, tt.lng], Math.max(M.current.getZoom(), 16), { animate: !0 });
      }
    }
  })), Mt(() => {
    if (!O.current) return;
    const E = zt.map(O.current, {
      center: $r,
      zoom: 13,
      zoomControl: !1,
      scrollWheelZoom: !0
    });
    zt.control.zoom({ position: "topleft" }).addTo(E), E.attributionControl.setPrefix(!1), M.current = E, E.on("click", (tt) => {
      const D = B.current.picking;
      D && B.current.onPick?.(D, tt.latlng.lat, tt.latlng.lng);
    }), E.on("dragstart", () => H(!1));
    const W = new ResizeObserver(() => E.invalidateSize());
    return W.observe(O.current), () => {
      W.disconnect(), E.remove(), M.current = null;
    };
  }, []), Mt(() => {
    const E = M.current;
    E && (A.current.tiles?.remove(), A.current.tiles = zt.tileLayer(x ?? Kr, {
      attribution: S ?? Yr,
      maxZoom: 19,
      className: x ? void 0 : P.tiles
    }).addTo(E));
  }, [x, S]), Mt(() => {
    const E = M.current;
    if (!E) return;
    A.current.ends?.remove();
    const W = zt.layerGroup().addTo(E);
    A.current.ends = W;
    const tt = (D, K) => {
      if (!D) return;
      const rt = zt.marker([D.lat, D.lng], {
        icon: Jr(K === "start" ? "A" : "B", K),
        draggable: p,
        keyboard: !1,
        zIndexOffset: 500
      }).addTo(W);
      D.label && rt.bindTooltip(D.label, { direction: "top", offset: [0, -12] }), rt.on("dragend", () => {
        const ut = rt.getLatLng();
        B.current.onPick?.(K, ut.lat, ut.lng);
      });
    };
    tt(u, "start"), tt(f, "end"), !B.current.plan && u && !f && E.panTo([u.lat, u.lng]);
  }, [u, f, p]), Mt(() => {
    const E = M.current;
    if (!E || (A.current.route?.remove(), A.current.lights = [], A.current.rider = void 0, A.current.done = void 0, !h)) return;
    const W = zt.layerGroup().addTo(E);
    A.current.route = W;
    const tt = h.coordinates.map(([K, rt]) => [rt, K]);
    zt.polyline(tt, { className: P.routeCasing, weight: 9, interactive: !1 }).addTo(W), zt.polyline(tt, { className: P.routeLine, weight: 5, interactive: !1 }).addTo(W), A.current.done = zt.polyline([], {
      className: P.routeDone,
      weight: 5,
      interactive: !1
    }).addTo(W), A.current.lights = h.signals.map((K) => {
      const rt = Qe(h.coordinates, h.cum, K.distance), ut = zt.marker([rt.lat, rt.lng], {
        icon: zt.divIcon({
          className: "",
          html: `<div class="${P.light}" data-kind="${K.kind}" data-phase="red"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        }),
        keyboard: !1,
        zIndexOffset: 200
      }).addTo(W);
      return ut.bindTooltip(
        `${K.kind === "junction" ? "Traffic lights" : "Signalled crossing"}${K.name ? ` · ${K.name}` : ""}`,
        { direction: "top", offset: [0, -8] }
      ), { el: ut.getElement()?.firstElementChild, phase: null };
    }), A.current.rider = zt.marker(tt[0], {
      icon: zt.divIcon({
        className: "",
        html: `<div class="${P.rider}" data-waiting="false">${Xr}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      }),
      interactive: !1,
      zIndexOffset: 1e3
    }).addTo(W), H(!0);
    const D = _o(h.coordinates);
    D && E.fitBounds(D, { padding: [36, 36] }), lt(0);
  }, [h]), Mt(() => {
    for (const E of A.current.lights) E.phase = null;
    lt(U.current);
  }, [r, c]), Mt(() => {
    const E = M.current, { plan: W, ride: tt } = B.current;
    if (!m || !E || !W || !tt || !X.current) return;
    const D = Qe(W.coordinates, W.cum, Mi(tt, U.current).distance);
    C.current = performance.now() + 900, E.flyTo([D.lat, D.lng], Math.max(E.getZoom(), 16), { duration: 0.8 });
  }, [m]), /* @__PURE__ */ w(
    "div",
    {
      ref: O,
      className: P.map,
      "data-picking": v ? "true" : "false",
      role: "application",
      "aria-label": "Map of the route"
    }
  );
});
function ko({ letter: a, kind: h, placeholder: r, value: c, active: u, onFocus: f, onChoose: m }) {
  const [v, p] = ft(c?.label ?? ""), [g, y] = ft([]), [x, S] = ft(!1), [q, O] = ft(0), [M, A] = ft(!1), B = or(), X = bt(!1);
  Mt(() => {
    X.current = !1, p(c ? c.label ?? "Dropped pin" : ""), S(!1);
  }, [c]), Mt(() => {
    const C = v.trim();
    if (!X.current || C.length < 3) {
      y([]), A(!1);
      return;
    }
    const H = new AbortController();
    A(!0);
    const st = setTimeout(() => {
      Hr(C, H.signal).then(
        (lt) => {
          y(lt), O(0), S(!0), A(!1);
        },
        () => {
          H.signal.aborted || A(!1);
        }
      );
    }, 250);
    return () => {
      clearTimeout(st), H.abort();
    };
  }, [v]);
  const U = (C) => {
    S(!1), m({ lat: C.lat, lng: C.lng, label: C.label });
  };
  return /* @__PURE__ */ T("div", { className: P.field, "data-active": u, children: [
    /* @__PURE__ */ w("span", { className: P.fieldPin, "data-kind": h, "aria-hidden": "true", children: a }),
    /* @__PURE__ */ w(
      "input",
      {
        className: P.fieldInput,
        value: v,
        placeholder: r,
        "aria-label": h === "start" ? "Start" : "Destination",
        role: "combobox",
        "aria-expanded": x && g.length > 0,
        "aria-controls": B,
        "aria-autocomplete": "list",
        autoComplete: "off",
        spellCheck: !1,
        onFocus: (C) => {
          f(), C.currentTarget.select(), g.length && S(!0);
        },
        onBlur: () => setTimeout(() => S(!1), 150),
        onChange: (C) => {
          X.current = !0, p(C.target.value), C.target.value === "" && c && m(null);
        },
        onKeyDown: (C) => {
          !x || !g.length || (C.key === "ArrowDown" ? (C.preventDefault(), O((H) => (H + 1) % g.length)) : C.key === "ArrowUp" ? (C.preventDefault(), O((H) => (H - 1 + g.length) % g.length)) : C.key === "Enter" ? (C.preventDefault(), U(g[q])) : C.key === "Escape" && S(!1));
        }
      }
    ),
    M && /* @__PURE__ */ w("span", { className: P.fieldSpinner, "aria-hidden": "true" }),
    x && g.length > 0 && /* @__PURE__ */ w("ul", { className: P.suggestions, id: B, role: "listbox", children: g.map((C, H) => /* @__PURE__ */ T(
      "li",
      {
        role: "option",
        "aria-selected": H === q,
        className: P.suggestion,
        "data-current": H === q,
        onMouseDown: (st) => {
          st.preventDefault(), U(C);
        },
        onMouseEnter: () => O(H),
        children: [
          /* @__PURE__ */ w("span", { children: C.label }),
          C.context && /* @__PURE__ */ w("small", { children: C.context })
        ]
      },
      `${C.lat},${C.lng}`
    )) })
  ] });
}
function ta({ start: a, end: h, picking: r, onPicking: c, onStart: u, onEnd: f, onRoute: m }) {
  return /* @__PURE__ */ T("div", { className: P.picker, "data-component": "place-picker", children: [
    /* @__PURE__ */ T("div", { className: P.fields, children: [
      /* @__PURE__ */ w(
        ko,
        {
          letter: "A",
          kind: "start",
          placeholder: "Where from?",
          value: a,
          active: r === "start",
          onFocus: () => c("start"),
          onChoose: u
        }
      ),
      /* @__PURE__ */ w(
        ko,
        {
          letter: "B",
          kind: "end",
          placeholder: "Where to?",
          value: h,
          active: r === "end",
          onFocus: () => c("end"),
          onChoose: f
        }
      ),
      /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: P.swap,
          title: "Swap start and destination",
          "aria-label": "Swap start and destination",
          disabled: !a && !h,
          onClick: () => {
            a && h ? m(h, a) : (u(h), f(a));
          },
          children: /* @__PURE__ */ w("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ w("path", { d: "M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" }) })
        }
      )
    ] }),
    !(a && h) && /* @__PURE__ */ T(se, { children: [
      /* @__PURE__ */ T("p", { className: P.hint, children: [
        "Search for a place, or click the map to drop pin ",
        r === "end" ? "B" : "A",
        "."
      ] }),
      /* @__PURE__ */ T("div", { className: P.examples, children: [
        /* @__PURE__ */ w("span", { className: P.examplesLabel, children: "Or try" }),
        Ur.map((v) => /* @__PURE__ */ w(
          "button",
          {
            type: "button",
            className: P.chip,
            "data-action": "example-route",
            onClick: () => m(v.start, v.end),
            children: v.name
          },
          v.name
        ))
      ] })
    ] })
  ] });
}
function Ot(a) {
  const h = Math.max(0, Math.floor(a));
  return `${Math.floor(h / 60)}:${String(h % 60).padStart(2, "0")}`;
}
function fe(a) {
  const h = Math.max(0, Math.round(a)), r = Math.floor(h / 60), c = h % 60;
  return r === 0 ? `${c} s` : c === 0 ? `${r} min` : `${r} min ${c} s`;
}
function ki(a) {
  return a >= 1e3 ? `${(a / 1e3).toFixed(1)} km` : `${Math.round(a / 10) * 10} m`;
}
function Si(a, h, r = `${h}s`) {
  return `${a} ${a === 1 ? h : r}`;
}
function ea({ plan: a, ride: h, signalPlans: r, time: c, distance: u, onSeek: f }) {
  const m = bt(null), v = bt(!1), p = (y) => `${y / a.distance * 100}%`, g = (y) => {
    const x = m.current?.getBoundingClientRect();
    !x || x.width === 0 || f(Math.max(0, Math.min(1, (y - x.left) / x.width)) * a.distance);
  };
  return /* @__PURE__ */ w("div", { className: P.strip, "data-component": "route-strip", children: /* @__PURE__ */ T(
    "div",
    {
      ref: m,
      className: P.stripTrack,
      role: "slider",
      tabIndex: 0,
      "aria-label": "Position along the route",
      "aria-valuemin": 0,
      "aria-valuemax": Math.round(a.distance),
      "aria-valuenow": Math.round(u),
      "aria-valuetext": `${Math.round(u / a.distance * 100)}% of the way`,
      onPointerDown: (y) => {
        v.current = !0, y.currentTarget.setPointerCapture(y.pointerId), g(y.clientX);
      },
      onPointerMove: (y) => v.current && g(y.clientX),
      onPointerUp: () => v.current = !1,
      onPointerCancel: () => v.current = !1,
      onKeyDown: (y) => {
        const x = a.distance / 40;
        if (y.key === "ArrowRight") f(Math.min(a.distance, u + x));
        else if (y.key === "ArrowLeft") f(Math.max(0, u - x));
        else return;
        y.preventDefault();
      },
      children: [
        /* @__PURE__ */ w("div", { className: P.stripLine }),
        a.steps.filter((y) => y.walk && y.to - y.from > 15).map((y) => /* @__PURE__ */ w(
          "div",
          {
            className: P.stripWalk,
            style: { left: p(y.from), width: p(y.to - y.from) },
            title: "Dismount and push"
          },
          y.from
        )),
        /* @__PURE__ */ w("div", { className: P.stripDone, style: { width: p(u) } }),
        a.signals.map((y, x) => {
          const S = u > y.distance + 2, q = h.stops.find((O) => O.signal === x && O.at <= c);
          return /* @__PURE__ */ w(
            "div",
            {
              className: P.stripLight,
              "data-kind": y.kind,
              "data-phase": S ? "passed" : mn(r[x], c, h.offsets[x]),
              "data-stopped": q ? "true" : "false",
              style: { left: p(y.distance) },
              title: q ? `Stopped ${Ot(q.wait)}${y.name ? ` on ${y.name}` : ""}` : y.name || void 0
            },
            y.id + ":" + x
          );
        }),
        /* @__PURE__ */ w("div", { className: P.stripRider, style: { left: p(u) } })
      ]
    }
  ) });
}
const be = 320, de = 96, ia = 18;
function na({ forecast: a, yourDelay: h, signalCount: r }) {
  const { binSeconds: c, counts: u } = Jt(() => Pr(a), [a]), [f, m] = ft(null);
  if (r === 0)
    return /* @__PURE__ */ T("section", { className: P.card, "data-component": "forecast", children: [
      /* @__PURE__ */ w("h3", { className: P.cardTitle, children: "No traffic lights on this route" }),
      /* @__PURE__ */ T("p", { className: P.cardText, children: [
        "Nothing here will stop the meter running, so you pay for riding time only:",
        " ",
        /* @__PURE__ */ w("strong", { children: me(a.freeFlowFare) }),
        " for ",
        fe(a.freeFlow),
        "."
      ] })
    ] });
  const v = u.length * c, p = Math.max(...u), g = be / u.length, y = (M) => Math.min(M, v) / v * be, x = a.meanDelay / a.meanDuration, S = h == null ? null : br(a, h), q = [30, 60, 120, 180, 300, 600].find((M) => v / M <= 5) ?? 600, O = [];
  for (let M = 0; M <= v; M += q) O.push(M);
  return /* @__PURE__ */ T("section", { className: P.card, "data-component": "forecast", children: [
    /* @__PURE__ */ w("h3", { className: P.cardTitle, children: "What red lights cost on this route" }),
    /* @__PURE__ */ T("div", { className: P.heroRow, children: [
      /* @__PURE__ */ T("div", { children: [
        /* @__PURE__ */ w("div", { className: P.hero, children: me(a.meanExtra) }),
        /* @__PURE__ */ w("div", { className: P.heroLabel, children: "added to an average ride" })
      ] }),
      /* @__PURE__ */ T("div", { children: [
        /* @__PURE__ */ w("div", { className: P.hero, children: fe(a.meanDelay) }),
        /* @__PURE__ */ T("div", { className: P.heroLabel, children: [
          "lost to lights, ",
          Math.round(x * 100),
          "% of the ride"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ T("figure", { className: P.chart, children: [
      /* @__PURE__ */ T(
        "svg",
        {
          viewBox: `0 0 ${be} ${de + ia}`,
          role: "img",
          "aria-label": `Time lost to red lights across ${a.rides} simulated rides. Typical: ${fe(a.medianDelay)}. Nine in ten rides fall between ${fe(a.lowDelay)} and ${fe(a.highDelay)}.`,
          onMouseLeave: () => m(null),
          children: [
            u.map((M, A) => {
              const B = p ? M / p * (de - 14) : 0;
              return /* @__PURE__ */ T("g", { onMouseEnter: () => m(A), children: [
                /* @__PURE__ */ w("rect", { x: A * g, y: 0, width: g, height: de, fill: "transparent" }),
                M > 0 && /* @__PURE__ */ w(
                  "path",
                  {
                    className: P.bar,
                    "data-hover": f === A,
                    d: oa(A * g + 1, de - B, g - 2, B, 3)
                  }
                )
              ] }, A);
            }),
            /* @__PURE__ */ w("line", { className: P.axis, x1: 0, x2: be, y1: de, y2: de }),
            O.map((M) => /* @__PURE__ */ w(
              "text",
              {
                className: P.tick,
                x: y(M),
                y: de + 13,
                textAnchor: M === 0 ? "start" : y(M) > be - 12 ? "end" : "middle",
                children: M === 0 ? "0" : Ot(M)
              },
              M
            )),
            h != null && /* @__PURE__ */ T("g", { className: P.you, children: [
              /* @__PURE__ */ w("line", { x1: y(h), x2: y(h), y1: 10, y2: de }),
              /* @__PURE__ */ w("circle", { cx: y(h), cy: 10, r: 4 }),
              /* @__PURE__ */ w(
                "text",
                {
                  x: y(h),
                  y: 7,
                  dx: y(h) > be / 2 ? -8 : 8,
                  dy: 6,
                  textAnchor: y(h) > be / 2 ? "end" : "start",
                  children: "Your ride"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ w("figcaption", { className: P.chartCaption, children: f != null ? /* @__PURE__ */ T(se, { children: [
        /* @__PURE__ */ w("strong", { children: u[f] }),
        " of ",
        a.rides,
        " rides lost ",
        Ot(f * c),
        "–",
        Ot((f + 1) * c)
      ] }) : /* @__PURE__ */ T(se, { children: [
        "Minutes lost to lights across ",
        a.rides,
        " simulated departures. Nine in ten fall between ",
        Ot(a.lowDelay),
        " and ",
        Ot(a.highDelay),
        "."
      ] }) })
    ] }),
    S != null && /* @__PURE__ */ w("p", { className: P.cardText, children: S >= 0.5 ? /* @__PURE__ */ T(se, { children: [
      "The lights were against you: this ride lost more time than",
      " ",
      /* @__PURE__ */ T("strong", { children: [
        Math.round(S * 100),
        "%"
      ] }),
      " of rides on this route."
    ] }) : /* @__PURE__ */ T(se, { children: [
      "You got lucky: ",
      /* @__PURE__ */ T("strong", { children: [
        Math.round((1 - S) * 100),
        "%"
      ] }),
      " of rides on this route lose more time to lights than this one did."
    ] }) })
  ] });
}
function oa(a, h, r, c, u) {
  const f = Math.min(u, r / 2, c);
  return `M${a},${h + c}V${h + f}Q${a},${h} ${a + f},${h}H${a + r - f}Q${a + r},${h} ${a + r},${h + f}V${h + c}Z`;
}
function sa({ plan: a, ctx: h, ride: r, forecast: c, pricePlan: u, rates: f }) {
  const m = Ci(r.duration), v = Ci(h.freeFlow.duration), p = ae(u, r.duration, f), g = ae(u, h.freeFlow.duration, f), y = p - g;
  return /* @__PURE__ */ T("section", { className: P.receipt, "data-component": "receipt", children: [
    /* @__PURE__ */ w("h3", { className: P.receiptTitle, children: "Ride receipt" }),
    /* @__PURE__ */ T("dl", { className: P.lines, children: [
      u === "payg" && /* @__PURE__ */ T(se, { children: [
        /* @__PURE__ */ w(Pe, { label: "Unlock", value: Nt(f.unlockFee) }),
        /* @__PURE__ */ w(
          Pe,
          {
            label: `${m} min × ${me(f.perMinuteRate)}`,
            value: Nt(m * f.perMinuteRate)
          }
        )
      ] }),
      u === "pass" && /* @__PURE__ */ w(
        Pe,
        {
          label: `${m} min from your LimePass`,
          value: Nt(p),
          note: `${(Wt.pass.perMinute * 100).toFixed(1)}p a minute, no unlock fee`
        }
      ),
      u === "prime" && /* @__PURE__ */ w(
        Pe,
        {
          label: m <= Wt.prime.shortMinutes ? "LimePrime short ride" : "LimePrime ride",
          value: Nt(p),
          note: m > Wt.prime.capMinutes ? `${m - Wt.prime.capMinutes} min over the 20-minute cap, charged here at the standard rate` : "Flat fare, unlock included"
        }
      ),
      /* @__PURE__ */ w(Pe, { label: "Total", value: Nt(p), strong: !0 })
    ] }),
    /* @__PURE__ */ T("dl", { className: P.lines, children: [
      /* @__PURE__ */ w(
        Pe,
        {
          label: `Ride time ${Ot(r.duration)}`,
          value: `billed as ${m} min`,
          note: "Lime rounds up to the next full minute"
        }
      ),
      /* @__PURE__ */ w(
        Pe,
        {
          label: "With every light green",
          value: `${Ot(h.freeFlow.duration)} · ${Nt(g)}`
        }
      )
    ] }),
    /* @__PURE__ */ w("div", { className: P.verdict, "data-zero": y < 5e-3, children: y >= 5e-3 ? /* @__PURE__ */ T(se, { children: [
      /* @__PURE__ */ T("span", { children: [
        "Red lights added ",
        /* @__PURE__ */ w("strong", { children: fe(r.delay) }),
        " and cost you"
      ] }),
      /* @__PURE__ */ w("strong", { className: P.verdictAmount, children: me(y) }),
      /* @__PURE__ */ T("span", { children: [
        Math.round(y / p * 100),
        "% of the fare"
      ] })
    ] }) : r.delay >= 1 ? /* @__PURE__ */ T("span", { children: [
      "Red lights added ",
      /* @__PURE__ */ w("strong", { children: fe(r.delay) }),
      u === "prime" ? ", but a flat fare means they cost you nothing." : `, but not enough to tip you into another billed minute (${v} min either way).`
    ] }) : /* @__PURE__ */ w("span", { children: "Green all the way. The lights cost you nothing this time." }) }),
    r.stops.length > 0 && /* @__PURE__ */ T(se, { children: [
      /* @__PURE__ */ T("h4", { className: P.subTitle, children: [
        "Where you stopped · ",
        Si(r.stops.length, "red light"),
        ", ",
        Ot(r.waiting),
        " standing still"
      ] }),
      /* @__PURE__ */ w("ol", { className: P.stops, children: r.stops.map((x) => {
        const S = a.signals[x.signal];
        return /* @__PURE__ */ T("li", { children: [
          /* @__PURE__ */ w("span", { className: P.stopDot, "data-kind": S.kind, "aria-hidden": "true" }),
          /* @__PURE__ */ T("span", { className: P.stopName, children: [
            S.name || (S.kind === "junction" ? "Junction" : "Crossing"),
            /* @__PURE__ */ T("small", { children: [
              S.kind === "junction" ? "traffic lights" : "signalled crossing",
              " at",
              " ",
              ki(S.distance)
            ] })
          ] }),
          /* @__PURE__ */ w("span", { className: P.stopWait, children: Ot(x.wait) })
        ] }, x.signal);
      }) })
    ] }),
    /* @__PURE__ */ w(ra, { forecast: c }),
    /* @__PURE__ */ w(aa, { plan: a, ctx: h, ride: r, rates: f, total: p, extra: y, pricePlan: u })
  ] });
}
function Pe({
  label: a,
  value: h,
  note: r,
  strong: c
}) {
  return /* @__PURE__ */ T("div", { className: P.line, "data-strong": c ? "true" : "false", children: [
    /* @__PURE__ */ T("dt", { children: [
      a,
      r && /* @__PURE__ */ w("small", { children: r })
    ] }),
    /* @__PURE__ */ w("dd", { children: h })
  ] });
}
function ra({ forecast: a }) {
  const [h, r] = ft(10);
  if (a.meanExtra < 5e-3) return null;
  const c = a.meanExtra * h * 52, u = a.meanDelay * h * 52 / 3600;
  return /* @__PURE__ */ T("div", { className: P.yearly, "data-component": "yearly", children: [
    /* @__PURE__ */ T("div", { className: P.stepper, children: [
      /* @__PURE__ */ w("span", { children: "Ride this route" }),
      /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          "aria-label": "Fewer rides a week",
          onClick: () => r((f) => Math.max(1, f - 1)),
          disabled: h <= 1,
          children: "−"
        }
      ),
      /* @__PURE__ */ w("output", { "aria-label": "Rides a week", children: h }),
      /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          "aria-label": "More rides a week",
          onClick: () => r((f) => Math.min(40, f + 1)),
          disabled: h >= 40,
          children: "+"
        }
      ),
      /* @__PURE__ */ T("span", { children: [
        h === 1 ? "time" : "times",
        " a week"
      ] })
    ] }),
    /* @__PURE__ */ T("p", { children: [
      "and over a year red lights cost you about ",
      /* @__PURE__ */ w("strong", { children: Nt(c).replace(/\.\d+$/, "") }),
      " ",
      "and ",
      /* @__PURE__ */ T("strong", { children: [
        u < 10 ? u.toFixed(1) : Math.round(u),
        " hours"
      ] }),
      " of waiting."
    ] })
  ] });
}
function aa({
  plan: a,
  ctx: h,
  ride: r,
  rates: c,
  total: u,
  extra: f,
  pricePlan: m
}) {
  const v = sr(c).filter((p) => !(m === "pass" && p.id === "lime-pass") && !(m === "prime" && p.id === "lime-prime")).map((p) => {
    const g = p.fare(r.duration, a.distance);
    return { ...p, fare: g, lights: g - p.fare(h.freeFlow.duration, a.distance) };
  });
  return /* @__PURE__ */ T("div", { "data-component": "alternatives", children: [
    /* @__PURE__ */ w("h4", { className: P.subTitle, children: "The same trip, priced differently" }),
    /* @__PURE__ */ T("table", { className: P.alts, children: [
      /* @__PURE__ */ w("thead", { children: /* @__PURE__ */ T("tr", { children: [
        /* @__PURE__ */ w("th", { scope: "col", children: "Hire bike" }),
        /* @__PURE__ */ w("th", { scope: "col", children: "Fare" }),
        /* @__PURE__ */ w("th", { scope: "col", children: "Of which red lights" })
      ] }) }),
      /* @__PURE__ */ T("tbody", { children: [
        /* @__PURE__ */ T("tr", { "data-current": "true", children: [
          /* @__PURE__ */ T("th", { scope: "row", children: [
            "This ride",
            /* @__PURE__ */ w("small", { children: "What you just paid" })
          ] }),
          /* @__PURE__ */ w("td", { children: Nt(u) }),
          /* @__PURE__ */ w("td", { children: f >= 5e-3 ? me(f) : "nothing" })
        ] }),
        v.map((p) => /* @__PURE__ */ T("tr", { children: [
          /* @__PURE__ */ T("th", { scope: "row", children: [
            p.name,
            /* @__PURE__ */ w("small", { children: p.basis })
          ] }),
          /* @__PURE__ */ w("td", { children: Nt(p.fare) }),
          /* @__PURE__ */ w("td", { children: p.lights >= 5e-3 ? me(p.lights) : "nothing" })
        ] }, p.id))
      ] })
    ] }),
    /* @__PURE__ */ T("p", { className: P.footnote, children: [
      "Prices checked ",
      So,
      "; they change often, so check the app. Passes and subscriptions have upfront costs that are not shown. Fares priced by distance or as a flat fee do not rise when a light turns red."
    ] })
  ] });
}
function un({ label: a, value: h, options: r, onChange: c }) {
  return /* @__PURE__ */ T("div", { className: P.setting, children: [
    /* @__PURE__ */ w("span", { className: P.settingLabel, children: a }),
    /* @__PURE__ */ w("div", { className: P.segmented, role: "radiogroup", "aria-label": a, children: r.map((u) => /* @__PURE__ */ w(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": u.value === h,
        title: u.hint,
        onClick: () => c(u.value),
        children: u.label
      },
      u.value
    )) })
  ] });
}
function ha({ pace: a, traffic: h, pricePlan: r, rates: c, plan: u, onPace: f, onTraffic: m, onPricePlan: v }) {
  const p = re[a];
  return /* @__PURE__ */ T("details", { className: P.assumptions, "data-component": "assumptions", children: [
    /* @__PURE__ */ T("summary", { children: [
      /* @__PURE__ */ w("span", { children: "Assumptions" }),
      /* @__PURE__ */ T("small", { children: [
        p.label,
        " rider · ",
        h === "rush" ? "rush hour" : `${h} traffic`,
        " ·",
        " ",
        Je[r].name
      ] })
    ] }),
    /* @__PURE__ */ w(
      un,
      {
        label: "Rider",
        value: a,
        onChange: f,
        options: Object.keys(re).map((g) => ({
          value: g,
          label: re[g].label,
          hint: `Cruises at ${Math.round(re[g].cruise * 3.6)} km/h`
        }))
      }
    ),
    /* @__PURE__ */ w(
      un,
      {
        label: "Streets",
        value: h,
        onChange: m,
        options: [
          { value: "quiet", label: "Quiet", hint: "Short signal cycles, few people crossing" },
          { value: "typical", label: "Typical" },
          { value: "rush", label: "Rush hour", hint: "Long signal cycles, busy crossings" }
        ]
      }
    ),
    /* @__PURE__ */ w(
      un,
      {
        label: "Paying with",
        value: r,
        onChange: v,
        options: Object.keys(Je).map((g) => ({
          value: g,
          label: g === "payg" ? "Pay as you go" : Je[g].name,
          hint: Je[g].detail
        }))
      }
    ),
    /* @__PURE__ */ T("div", { className: P.method, children: [
      /* @__PURE__ */ T("p", { children: [
        /* @__PURE__ */ w("strong", { children: "Fare." }),
        " ",
        r === "payg" ? `${Nt(c.unlockFee)} to unlock, then ${me(c.perMinuteRate)} for every started minute.` : `${Je[r].detail}.`,
        " ",
        "Lime rounds ride time up to the next full minute. Prices checked ",
        So,
        "."
      ] }),
      /* @__PURE__ */ T("p", { children: [
        /* @__PURE__ */ w("strong", { children: "Rider." }),
        " Cruises at ",
        Math.round(p.cruise * 3.6),
        " km/h (the motor stops helping at 25 km/h), slows for corners, pushes the bike where the route says to dismount, and stops for every red light."
      ] }),
      /* @__PURE__ */ T("p", { children: [
        /* @__PURE__ */ w("strong", { children: "Lights." }),
        " ",
        u.signalSource === "precomputed" ? "Positions were supplied with this route." : "Positions come from OpenStreetMap.",
        " ",
        "London does not publish signal timings, so each light gets a realistic fixed cycle: junctions run ",
        h === "quiet" ? "56–80" : h === "rush" ? "80–120" : "64–96",
        " ",
        "seconds with 30–55% green for your approach; signalled crossings stay green until someone presses the button. The time lost is measured against the same ride with every light green, so it includes braking and pulling away, not just standing still."
      ] }),
      /* @__PURE__ */ T("p", { children: [
        /* @__PURE__ */ w("strong", { children: "Not modelled." }),
        " Queues of traffic, hills, zebra crossings, give-way junctions, linked signals that give a run of greens, and riders who jump reds."
      ] })
    ] })
  ] });
}
function la({ text: a }) {
  const [h, r] = ft(!1), c = typeof window < "u" ? window.location.href : "", u = async () => {
    try {
      await navigator.clipboard.writeText(`${a}
${c}`), r(!0), setTimeout(() => r(!1), 2e3);
    } catch {
    }
  }, f = (m) => window.open(m, "_blank", "noopener,width=600,height=480");
  return /* @__PURE__ */ T("div", { className: P.share, "data-component": "share-buttons", children: [
    /* @__PURE__ */ w("button", { type: "button", className: P.ghostButton, onClick: u, "data-action": "share", "data-platform": "copy", children: h ? "Copied" : "Copy result" }),
    /* @__PURE__ */ w(
      "button",
      {
        type: "button",
        className: P.ghostButton,
        "data-action": "share",
        "data-platform": "twitter",
        onClick: () => f(`https://twitter.com/intent/tweet?text=${encodeURIComponent(a)}&url=${encodeURIComponent(c)}`),
        children: "Post on X"
      }
    ),
    /* @__PURE__ */ w(
      "button",
      {
        type: "button",
        className: P.ghostButton,
        "data-action": "share",
        "data-platform": "linkedin",
        onClick: () => f(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(c)}`),
        children: "LinkedIn"
      }
    )
  ] });
}
const cn = [1, 10, 30, 100];
function ua() {
  if (typeof window > "u") return null;
  const a = /ride=([-\d.]+),([-\d.]+);([-\d.]+),([-\d.]+)(?:;(\d+))?/.exec(window.location.hash);
  if (!a) return null;
  const [h, r, c, u] = a.slice(1, 5).map(Number);
  return [h, r, c, u].every(Number.isFinite) ? {
    start: { lat: h, lng: r },
    end: { lat: c, lng: u },
    seed: a[5] ? Number(a[5]) : void 0
  } : null;
}
function ca(a) {
  const [h, r] = ft(
    () => typeof window < "u" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  return Mt(() => {
    const c = window.matchMedia("(prefers-color-scheme: dark)"), u = () => r(c.matches);
    return c.addEventListener("change", u), () => c.removeEventListener("change", u);
  }, []), a === "auto" ? h : a === "dark";
}
function da({
  startLocation: a,
  endLocation: h,
  precomputedRoute: r,
  unlockFee: c = Wt.unlock,
  perMinuteRate: u = Wt.perMinute,
  simulationSpeed: f = 30,
  width: m = "100%",
  height: v = 600,
  showControls: p = !0,
  allowLocationPicker: g = !0,
  theme: y = "auto",
  pace: x = "typical",
  traffic: S = "typical",
  seed: q,
  syncUrl: O = !0,
  tileUrl: M,
  tileAttribution: A
}) {
  const B = g && !r && !(a && h), X = Jt(() => B && O ? ua() : null, [B, O]), [U, C] = ft(X?.start ?? null), [H, st] = ft(X?.end ?? null), [lt, E] = ft(
    X ? null : a ? "end" : "start"
  ), [W, tt] = ft(x), [D, K] = ft(S), [rt, ut] = ft("payg"), [te, mt] = ft(f), [dt, I] = ft(() => q ?? X?.seed ?? mo()), [Tt, N] = ft(!0), [F, et] = ft(!1), it = bt(null), nt = bt(null), J = bt(!1), $ = ca(y), Ct = a ?? U ?? void 0, At = h ?? H ?? void 0, Zt = Jt(() => ({ unlockFee: c, perMinuteRate: u }), [c, u]), { plan: ot, loading: _e, error: he } = Br(Ct, At, r), gt = Jt(() => ot ? yr(ot, W) : null, [ot, W]), ii = Jt(() => gt ? No(gt, D) : [], [gt, D]), at = Jt(() => gt ? Io(gt, D, dt) : null, [gt, D, dt]), pe = Jt(
    () => gt ? xr(gt, D, rt, Zt) : null,
    [gt, D, rt, Zt]
  ), Be = Qt((R) => nt.current?.showTime(R), []), Bt = Dr({ duration: at?.duration ?? 0, speed: te, rideKey: at, onFrame: Be }), { status: _t, time: kt } = Bt;
  Mt(() => {
    J.current && at && (J.current = !1, Bt.play());
  }, [at]), Mt(() => {
    _t === "finished" && nt.current?.fit();
  }, [_t]), Mt(() => {
    if (!B || !O || !U || !H) return;
    const R = (Vt) => Vt.toFixed(5), Pt = `#ride=${R(U.lat)},${R(U.lng)};${R(H.lat)},${R(H.lng)};${dt}`;
    window.history.replaceState(null, "", Pt);
  }, [B, O, U, H, dt]), Mt(() => {
    const R = () => et(document.fullscreenElement === it.current);
    return document.addEventListener("fullscreenchange", R), () => document.removeEventListener("fullscreenchange", R);
  }, []);
  const le = Qt((R, Pt) => {
    (R === "start" ? C : st)(Pt);
  }, []), ni = Qt(
    (R, Pt, Vt) => {
      le(R, { lat: Pt, lng: Vt }), E(R === "start" && !H ? "end" : null), Wr(Pt, Vt).then((Me) => {
        Me && (R === "start" ? C : st)(
          (It) => It && It.lat === Pt && It.lng === Vt ? { ...It, label: Me } : It
        );
      });
    },
    [H, le]
  ), vt = Jt(() => {
    if (!ot || !gt || !at) return null;
    const { distance: R, speed: Pt } = Mi(at, kt), Vt = kt >= at.duration, Me = at.stops.find((Ut) => kt >= Ut.at && kt < Ut.at + Ut.wait), It = Vt ? at.delay : Math.max(0, kt - xo(gt.freeFlow, R)), Ii = ot.steps.some((Ut) => Ut.walk && R >= Ut.from && R < Ut.to);
    return {
      distance: R,
      speed: Pt,
      stop: Me,
      lost: It,
      walking: Ii,
      stopsSoFar: at.stops.filter((Ut) => Ut.at <= kt).length,
      street: Zo(ot.steps, R),
      fare: kt > 0 ? ae(rt, kt, Zt) : rt === "payg" ? Zt.unlockFee : rt === "prime" ? Wt.prime.shortFare : 0
    };
  }, [ot, gt, at, kt, rt, Zt]), Oi = Jt(
    () => cn.includes(f) ? cn : [...cn, f].sort((R, Pt) => R - Pt),
    [f]
  ), oi = ot?.signals.filter((R) => R.kind === "junction").length ?? 0, Te = (ot?.signals.length ?? 0) - oi, Re = Ct?.label && At?.label ? `${Ct.label} → ${At.label}` : ot ? "Your route" : "";
  let Gt = "";
  vt && at && (_t === "ready" ? Gt = "Ready to unlock" : _t === "finished" ? Gt = `Arrived in ${Ot(at.duration)}` : vt.stop ? Gt = `Red light${vt.street ? ` on ${vt.street}` : ""} · waiting ${Ot(kt - vt.stop.at)}` : _t === "paused" ? Gt = "Paused" : vt.walking ? Gt = "Pushing the bike" : Gt = `${Math.round(vt.speed * 3.6)} km/h${vt.street ? ` on ${vt.street}` : ""}`);
  const si = at ? ae(rt, at.duration, Zt) : 0, De = at && gt ? si - ae(rt, gt.freeFlow.duration, Zt) : 0, ri = ot && at ? `My ${ki(ot.distance)} Lime ride cost ${Nt(si)}. Red lights added ${fe(at.delay)}${De >= 5e-3 ? ` and ${me(De)} to the bill` : ""}. Lime charges by the minute, so the meter keeps running at every red.` : "", Ai = () => {
    document.fullscreenElement ? document.exitFullscreen() : it.current?.requestFullscreen?.();
  };
  return /* @__PURE__ */ w(
    "div",
    {
      ref: it,
      className: P.root,
      "data-component": "lime-simulator",
      "data-theme": $ ? "dark" : "light",
      "data-status": ot ? _t : _e ? "loading" : "idle",
      "data-fullscreen": F,
      style: {
        width: typeof m == "number" ? `${m}px` : m,
        "--lbs-height": typeof v == "number" ? `${v}px` : v
      },
      children: /* @__PURE__ */ T("div", { className: P.layout, children: [
        /* @__PURE__ */ T("div", { className: P.mapWrap, children: [
          /* @__PURE__ */ w(
            Qr,
            {
              ref: nt,
              plan: ot,
              ride: at,
              signalPlans: ii,
              start: Ct,
              end: At,
              playing: _t === "playing",
              picking: B ? lt : null,
              canMoveEnds: B,
              onPick: ni,
              onFollowChange: N,
              tileUrl: M,
              tileAttribution: A
            }
          ),
          /* @__PURE__ */ T("div", { className: P.mapButtons, children: [
            _t === "playing" && !Tt && /* @__PURE__ */ w(
              "button",
              {
                type: "button",
                className: P.mapButton,
                onClick: () => nt.current?.follow(),
                "data-action": "follow",
                children: "Follow rider"
              }
            ),
            /* @__PURE__ */ w(
              "button",
              {
                type: "button",
                className: P.mapButton,
                onClick: Ai,
                "aria-label": F ? "Exit full screen" : "Full screen",
                title: F ? "Exit full screen" : "Full screen",
                "data-action": "toggle-fullscreen",
                children: /* @__PURE__ */ w("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: F ? /* @__PURE__ */ w("path", { d: "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" }) : /* @__PURE__ */ w("path", { d: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" }) })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ T("div", { className: P.panel, children: [
          !ot && /* @__PURE__ */ T("header", { className: P.intro, children: [
            /* @__PURE__ */ w("h2", { children: "What do red lights cost you?" }),
            /* @__PURE__ */ w("p", { children: "Lime charges by the minute, so the meter keeps running while you wait at a red. Pick a ride across London and see how much of the fare goes on standing still." })
          ] }),
          B && /* @__PURE__ */ w(
            ta,
            {
              start: U,
              end: H,
              picking: lt,
              onPicking: E,
              onStart: (R) => {
                le("start", R), R && !H && E("end");
              },
              onEnd: (R) => {
                le("end", R), R && E(U ? null : "start");
              },
              onRoute: (R, Pt) => {
                C(R), st(Pt), E(null);
              }
            }
          ),
          _e && /* @__PURE__ */ T("div", { className: P.notice, role: "status", children: [
            /* @__PURE__ */ w("span", { className: P.spinner, "aria-hidden": "true" }),
            "Finding a cycling route and its traffic lights…"
          ] }),
          he && !_e && /* @__PURE__ */ w("div", { className: P.notice, "data-tone": "error", role: "alert", children: he }),
          ot && at && gt && vt && pe && /* @__PURE__ */ T(se, { children: [
            /* @__PURE__ */ T("header", { className: P.routeHead, children: [
              !B && Re && /* @__PURE__ */ w("h2", { children: Re }),
              /* @__PURE__ */ T("p", { children: [
                ki(ot.distance),
                " ·",
                " ",
                ot.signals.length === 0 ? "no traffic lights" : `${Si(oi, "signalled junction")}${Te ? `, ${Si(Te, "crossing")}` : ""}`,
                " ",
                "· about ",
                Math.round(pe.meanDuration / 60),
                " min"
              ] })
            ] }),
            ot.drivingFallback && /* @__PURE__ */ w("div", { className: P.notice, "data-tone": "warning", children: "The cycling router is not answering, so this is a driving route. It may use roads a bike would avoid." }),
            ot.signalSource === "unavailable" && /* @__PURE__ */ w("div", { className: P.notice, "data-tone": "warning", children: "Traffic lights could not be loaded for this area, so none are shown. Routes inside Greater London always work." }),
            /* @__PURE__ */ T("section", { className: P.meter, "data-waiting": vt.stop ? "true" : "false", "data-component": "meter", children: [
              /* @__PURE__ */ T("div", { className: P.meterTop, children: [
                /* @__PURE__ */ T("div", { children: [
                  /* @__PURE__ */ w("div", { className: P.meterLabel, children: _t === "finished" ? "Final fare" : "Fare so far" }),
                  /* @__PURE__ */ w("div", { className: P.meterFare, "data-testid": "fare", children: Nt(vt.fare) })
                ] }),
                /* @__PURE__ */ T("div", { className: P.meterLost, children: [
                  /* @__PURE__ */ w("div", { className: P.meterLabel, children: "Lost to red lights" }),
                  /* @__PURE__ */ w("div", { className: P.meterLostValue, "data-testid": "lost", children: Ot(vt.lost) }),
                  /* @__PURE__ */ w("div", { className: P.meterSub, children: Si(vt.stopsSoFar, "stop") })
                ] })
              ] }),
              /* @__PURE__ */ T("div", { className: P.meterStatus, role: "status", children: [
                /* @__PURE__ */ w("span", { className: P.statusDot, "data-state": vt.stop ? "red" : _t }),
                /* @__PURE__ */ w("span", { children: Gt }),
                /* @__PURE__ */ T("span", { className: P.meterClock, children: [
                  Ot(kt),
                  " · ",
                  ki(vt.distance)
                ] })
              ] }),
              /* @__PURE__ */ w(
                ea,
                {
                  plan: ot,
                  ride: at,
                  signalPlans: ii,
                  time: kt,
                  distance: vt.distance,
                  onSeek: (R) => Bt.seek(xo(at, R))
                }
              ),
              p && /* @__PURE__ */ T("div", { className: P.controls, "data-component": "simulation-controls", children: [
                _t === "finished" ? /* @__PURE__ */ w(
                  "button",
                  {
                    type: "button",
                    className: P.primaryButton,
                    "data-action": "ride-again",
                    onClick: () => {
                      J.current = !0, I(mo());
                    },
                    children: "Ride again"
                  }
                ) : /* @__PURE__ */ w(
                  "button",
                  {
                    type: "button",
                    className: P.primaryButton,
                    "data-action": _t === "playing" ? "pause" : "play",
                    onClick: _t === "playing" ? Bt.pause : Bt.play,
                    children: _t === "playing" ? "Pause" : _t === "paused" ? "Resume" : "Start ride"
                  }
                ),
                _t === "finished" ? /* @__PURE__ */ w(
                  "button",
                  {
                    type: "button",
                    className: P.ghostButton,
                    "data-action": "replay",
                    onClick: Bt.play,
                    children: "Watch replay"
                  }
                ) : /* @__PURE__ */ w(
                  "button",
                  {
                    type: "button",
                    className: P.ghostButton,
                    "data-action": "skip",
                    onClick: Bt.finish,
                    children: "Skip to end"
                  }
                ),
                /* @__PURE__ */ w("div", { className: P.speeds, role: "radiogroup", "aria-label": "Playback speed", children: Oi.map((R) => /* @__PURE__ */ T(
                  "button",
                  {
                    type: "button",
                    role: "radio",
                    "aria-checked": R === te,
                    title: R === 1 ? "Real time" : `${R} times faster than real time`,
                    "data-action": "speed-change",
                    "data-speed": R,
                    onClick: () => mt(R),
                    children: [
                      R,
                      "×"
                    ]
                  },
                  R
                )) })
              ] })
            ] }),
            _t === "finished" && /* @__PURE__ */ w(
              sa,
              {
                plan: ot,
                ctx: gt,
                ride: at,
                forecast: pe,
                pricePlan: rt,
                rates: Zt
              }
            ),
            /* @__PURE__ */ w(
              na,
              {
                forecast: pe,
                yourDelay: _t === "finished" ? at.delay : null,
                signalCount: ot.signals.length
              }
            ),
            _t === "finished" && !r && /* @__PURE__ */ w(la, { text: ri }),
            /* @__PURE__ */ w(
              ha,
              {
                pace: W,
                traffic: D,
                pricePlan: rt,
                rates: Zt,
                plan: ot,
                onPace: tt,
                onTraffic: K,
                onPricePlan: ut
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
const va = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LimeBikeSimulator: da
}, Symbol.toStringTag, { value: "Module" }));
export {
  pa as B,
  da as L,
  re as P,
  Ci as a,
  Nr as b,
  yr as c,
  Wt as d,
  va as e,
  ae as l,
  Zr as p,
  xr as r,
  Io as s,
  ga as t
};
