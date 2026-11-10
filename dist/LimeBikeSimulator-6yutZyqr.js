var Sv = Object.defineProperty;
var rh = (t) => {
  throw TypeError(t);
};
var Tv = (t, n, i) => n in t ? Sv(t, n, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[n] = i;
var _ = (t, n, i) => Tv(t, typeof n != "symbol" ? n + "" : n, i), sh = (t, n, i) => n.has(t) || rh("Cannot " + i);
var oh = (t, n, i) => (sh(t, n, "read from private field"), i ? i.call(t) : n.get(t)), ah = (t, n, i) => n.has(t) ? rh("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(t) : n.set(t, i), ch = (t, n, i, s) => (sh(t, n, "write to private field"), s ? s.call(t, i) : n.set(t, i), i);
import { jsxs as O, jsx as M, Fragment as In } from "react/jsx-runtime";
import Wa, { useState as kt, useCallback as si, useEffect as $t, useRef as vt, useMemo as Os, createContext as Pv, useContext as xv, forwardRef as vo, useImperativeHandle as yo } from "react";
import { createPortal as Ev } from "react-dom";
import P from "./LimeBikeSimulator.module-C8DGL4Vo.js";
const be = {
  MAX_SPEED_MPH: 15,
  MAX_SPEED_KMH: 24.14,
  // 15 mph in km/h
  MAX_SPEED_MS: 6.7056,
  // 15 mph in m/s
  ACCELERATION_TIME: 5,
  // seconds to reach max speed
  BRAKING_TIME: 3,
  // seconds to come to a stop
  ACCELERATION_RATE: 1.341,
  // m/s² (6.7056 / 5)
  DECELERATION_RATE: 2.235
  // m/s² (6.7056 / 3)
}, Mv = {
  MIN_CYCLE_TIME: 60,
  // seconds
  MAX_CYCLE_TIME: 120,
  RED_RATIO: 0.45,
  // 45% of cycle is red
  GREEN_RATIO: 0.5,
  // 50% of cycle is green
  YELLOW_DURATION: 4
  // 4 seconds yellow (remaining 5%)
};
function yd(t, n) {
  const { cycleTime: i, redDuration: s, greenDuration: a, yellowDuration: u, phaseOffset: h } = t, d = (n + h) % i;
  if (d < a)
    return {
      phase: "green",
      timeInPhase: d,
      timeUntilGreen: 0
    };
  if (d < a + u) {
    const m = d - a;
    return {
      phase: "yellow",
      timeInPhase: m,
      timeUntilGreen: u - m + s
    };
  } else {
    const m = d - a - u;
    return {
      phase: "red",
      timeInPhase: m,
      timeUntilGreen: s - m
    };
  }
}
function bd() {
  const { MIN_CYCLE_TIME: t, MAX_CYCLE_TIME: n, RED_RATIO: i, GREEN_RATIO: s, YELLOW_DURATION: a } = Mv, u = t + Math.random() * (n - t), h = u * i, d = u * s, m = a, g = Math.random() * u;
  return {
    cycleTime: u,
    redDuration: h,
    greenDuration: d,
    yellowDuration: m,
    phaseOffset: g
  };
}
const Va = {
  // Current Lime rate (£/min)
  PER_KM: 0.3,
  // 30p per km
  UNLOCK_FEE: 1
  // Standard unlock
}, kv = "https://router.project-osrm.org/route/v1/bike";
async function Lv(t, n) {
  const i = `${kv}/${t.lng},${t.lat};${n.lng},${n.lat}?overview=full&geometries=geojson&steps=true`, s = await fetch(i);
  if (!s.ok)
    throw new Error(`OSRM request failed: ${s.statusText}`);
  const a = await s.json();
  if (a.code !== "Ok" || !a.routes || a.routes.length === 0)
    throw new Error("No route found between the specified locations");
  return a.routes[0];
}
function gr(t, n, i, s) {
  const u = t * Math.PI / 180, h = i * Math.PI / 180, d = (i - t) * Math.PI / 180, m = (s - n) * Math.PI / 180, g = Math.sin(d / 2) * Math.sin(d / 2) + Math.cos(u) * Math.cos(h) * Math.sin(m / 2) * Math.sin(m / 2);
  return 6371e3 * (2 * Math.atan2(Math.sqrt(g), Math.sqrt(1 - g)));
}
function Cv(t) {
  const n = [0];
  for (let i = 1; i < t.length; i++) {
    const [s, a] = t[i - 1], [u, h] = t[i], d = gr(a, s, h, u);
    n.push(n[i - 1] + d);
  }
  return n;
}
function Iv(t, n) {
  const [i, s] = kt(null), [a, u] = kt([]), [h, d] = kt([]), [m, g] = kt(!1), [w, y] = kt(null), x = si(async () => {
    if (!t || !n) {
      s(null), u([]), d([]);
      return;
    }
    g(!0), y(null);
    try {
      const E = await Lv(t, n);
      s(E);
      const C = E.geometry.coordinates;
      u(C), d(Cv(C));
    } catch (E) {
      y(E instanceof Error ? E.message : "Failed to fetch route"), s(null), u([]), d([]);
    } finally {
      g(!1);
    }
  }, [t, n]);
  return $t(() => {
    x();
  }, [x]), {
    route: i,
    coordinates: a,
    cumulativeDistances: h,
    isLoading: m,
    error: w,
    refetch: x
  };
}
const Ov = (t) => typeof t == "function", v = function(t, n) {
  if (typeof t == "function")
    return function() {
      return t(arguments) ? n.apply(this, arguments) : (i) => n(i, ...arguments);
    };
  switch (t) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${t}`);
    case 2:
      return function(i, s) {
        return arguments.length >= 2 ? n(i, s) : function(a) {
          return n(a, i);
        };
      };
    case 3:
      return function(i, s, a) {
        return arguments.length >= 3 ? n(i, s, a) : function(u) {
          return n(u, i, s);
        };
      };
    case 4:
      return function(i, s, a, u) {
        return arguments.length >= 4 ? n(i, s, a, u) : function(h) {
          return n(h, i, s, a);
        };
      };
    case 5:
      return function(i, s, a, u, h) {
        return arguments.length >= 5 ? n(i, s, a, u, h) : function(d) {
          return n(d, i, s, a, u);
        };
      };
    default:
      return function() {
        if (arguments.length >= t)
          return n.apply(this, arguments);
        const i = arguments;
        return function(s) {
          return n(s, ...i);
        };
      };
  }
}, yt = (t) => t, bo = (t) => () => t, uh = /* @__PURE__ */ bo(!0), qa = /* @__PURE__ */ bo(!1), wd = /* @__PURE__ */ bo(void 0), Nv = wd;
function T(t, n, i, s, a, u, h, d, m) {
  switch (arguments.length) {
    case 1:
      return t;
    case 2:
      return n(t);
    case 3:
      return i(n(t));
    case 4:
      return s(i(n(t)));
    case 5:
      return a(s(i(n(t))));
    case 6:
      return u(a(s(i(n(t)))));
    case 7:
      return h(u(a(s(i(n(t))))));
    case 8:
      return d(h(u(a(s(i(n(t)))))));
    case 9:
      return m(d(h(u(a(s(i(n(t))))))));
    default: {
      let g = arguments[0];
      for (let w = 1; w < arguments.length; w++)
        g = arguments[w](g);
      return g;
    }
  }
}
const Dc = (t) => (n, i) => n === i || t(n, i), Rv = /* @__PURE__ */ v(2, (t, n) => Dc((i, s) => t(n(i), n(s)))), Av = (t) => Dc((n, i) => {
  if (n.length !== i.length)
    return !1;
  for (let s = 0; s < n.length; s++)
    if (!t(n[s], i[s]))
      return !1;
  return !0;
}), Ts = "effect/GlobalValue";
let nr;
const dt = (t, n) => (nr || (globalThis[Ts] ?? (globalThis[Ts] = /* @__PURE__ */ new Map()), nr = globalThis[Ts]), nr.has(t) || nr.set(t, n()), nr.get(t)), Fv = (t) => typeof t == "string", Ka = (t) => typeof t == "number", zv = (t) => typeof t == "bigint", wo = Ov, $v = (t) => typeof t == "object" && t !== null, So = (t) => $v(t) || wo(t), Q = /* @__PURE__ */ v(2, (t, n) => So(t) && n in t), Sd = /* @__PURE__ */ v(2, (t, n) => Q(t, "_tag") && t._tag === n), ei = (t) => t == null, Td = (t) => typeof t == "string" || Q(t, Symbol.iterator), Bv = (t) => Q(t, "then") && wo(t.then), To = (t) => `BUG: ${t} - please report an issue at https://github.com/Effect-TS/effect/issues`;
let Pd = class xd {
  constructor(n) {
    _(this, "self");
    _(this, "called", !1);
    this.self = n;
  }
  /**
   * @since 2.0.0
   */
  next(n) {
    return this.called ? {
      value: n,
      done: !0
    } : (this.called = !0, {
      value: this.self,
      done: !1
    });
  }
  /**
   * @since 2.0.0
   */
  return(n) {
    return {
      value: n,
      done: !0
    };
  }
  /**
   * @since 2.0.0
   */
  throw(n) {
    throw n;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new xd(this.self);
  }
};
const Dv = 335903614, Zv = 4150755663, Hv = 1481765933, jv = 1284865837, Uv = 9007199254740992, Wv = 134217728;
class Vv {
  constructor(n, i, s, a) {
    _(this, "_state");
    return ei(i) && ei(n) ? (i = Math.random() * 4294967295 >>> 0, n = 0) : ei(i) && (i = n, n = 0), ei(a) && ei(s) ? (a = this._state ? this._state[3] : Zv, s = this._state ? this._state[2] : Dv) : ei(a) && (a = s, s = 0), this._state = new Int32Array([0, 0, s >>> 0, ((a || 0) | 1) >>> 0]), this._next(), lh(this._state, this._state[0], this._state[1], n >>> 0, i >>> 0), this._next(), this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(n) {
    this._state[0] = n[0], this._state[1] = n[1], this._state[2] = n[2], this._state[3] = n[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(n) {
    return Math.round(this.number() * Number.MAX_SAFE_INTEGER) % n;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const n = (this._next() & 67108863) * 1, i = (this._next() & 134217727) * 1;
    return (n * Wv + i) / Uv;
  }
  /** @internal */
  _next() {
    const n = this._state[0] >>> 0, i = this._state[1] >>> 0;
    qv(this._state, n, i, Hv, jv), lh(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let s = n >>> 18, a = (i >>> 18 | n << 14) >>> 0;
    s = (s ^ n) >>> 0, a = (a ^ i) >>> 0;
    const u = (a >>> 27 | s << 5) >>> 0, h = n >>> 27, d = (-h >>> 0 & 31) >>> 0;
    return (u >>> h | u << d) >>> 0;
  }
}
function qv(t, n, i, s, a) {
  let u = (i >>> 16) * (a & 65535) >>> 0, h = (i & 65535) * (a >>> 16) >>> 0, d = (i & 65535) * (a & 65535) >>> 0, m = (i >>> 16) * (a >>> 16) + ((h >>> 16) + (u >>> 16)) >>> 0;
  h = h << 16 >>> 0, d = d + h >>> 0, d >>> 0 < h >>> 0 && (m = m + 1 >>> 0), u = u << 16 >>> 0, d = d + u >>> 0, d >>> 0 < u >>> 0 && (m = m + 1 >>> 0), m = m + Math.imul(i, s) >>> 0, m = m + Math.imul(n, a) >>> 0, t[0] = m, t[1] = d;
}
function lh(t, n, i, s, a) {
  let u = n + s >>> 0;
  const h = i + a >>> 0;
  h >>> 0 < i >>> 0 && (u = u + 1 | 0), t[0] = u, t[1] = h;
}
const Ga = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var Rr;
class Ar {
  constructor(n) {
    /**
     * @since 3.0.6
     */
    ah(this, Rr);
    ch(this, Rr, n);
  }
  /**
   * @since 3.0.6
   */
  [Ga]() {
    return oh(this, Rr);
  }
}
Rr = new WeakMap();
function Kv(t) {
  if (typeof t == "object" && t !== null && Ga in t)
    return t[Ga]();
  throw new Error(To("yieldWrapGet"));
}
const ve = /* @__PURE__ */ dt("effect/Utils/isStructuralRegion", () => ({
  enabled: !1,
  tester: void 0
})), Ed = {
  effect_internal_function: (t) => t()
}, Gv = {
  effect_internal_function: (t) => {
    try {
      return t();
    } finally {
    }
  }
};
var Pf;
const Jv = ((Pf = Ed.effect_internal_function(() => new Error().stack)) == null ? void 0 : /* @__PURE__ */ Pf.includes("effect_internal_function")) === !0, ee = Jv ? Ed.effect_internal_function : Gv.effect_internal_function, La = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap()), et = /* @__PURE__ */ Symbol.for("effect/Hash"), B = (t) => {
  if (ve.enabled === !0)
    return 0;
  switch (typeof t) {
    case "number":
      return Hc(t);
    case "bigint":
      return Ot(t.toString(10));
    case "boolean":
      return Ot(String(t));
    case "symbol":
      return Ot(String(t));
    case "string":
      return Ot(t);
    case "undefined":
      return Ot("undefined");
    case "function":
    case "object":
      return t === null ? Ot("null") : t instanceof Date ? Number.isNaN(t.getTime()) ? Ot("Invalid Date") : B(t.toISOString()) : t instanceof URL ? B(t.href) : Yv(t) ? t[et]() : Zc(t);
    default:
      throw new Error(`BUG: unhandled typeof ${typeof t} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, Zc = (t) => (La.has(t) || La.set(t, Hc(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))), La.get(t)), ut = (t) => (n) => n * 53 ^ t, Po = (t) => t & 3221225471 | t >>> 1 & 1073741824, Yv = (t) => Q(t, et), Hc = (t) => {
  if (t !== t || t === 1 / 0)
    return 0;
  let n = t | 0;
  for (n !== t && (n ^= t * 4294967295); t > 4294967295; )
    n ^= t /= 4294967295;
  return Po(n);
}, Ot = (t) => {
  let n = 5381, i = t.length;
  for (; i; )
    n = n * 33 ^ t.charCodeAt(--i);
  return Po(n);
}, Xv = (t, n) => {
  let i = 12289;
  for (let s = 0; s < n.length; s++)
    i ^= T(Ot(n[s]), ut(B(t[n[s]])));
  return Po(i);
}, Md = (t) => Xv(t, Object.keys(t)), Fr = (t) => {
  let n = 6151;
  for (let i = 0; i < t.length; i++)
    n = T(n, ut(B(t[i])));
  return Po(n);
}, Lt = function() {
  if (arguments.length === 1) {
    const i = arguments[0];
    return function(s) {
      return Object.defineProperty(i, et, {
        value() {
          return s;
        },
        enumerable: !1
      }), s;
    };
  }
  const t = arguments[0], n = arguments[1];
  return Object.defineProperty(t, et, {
    value() {
      return n;
    },
    enumerable: !1
  }), n;
}, Y = /* @__PURE__ */ Symbol.for("effect/Equal");
function X() {
  return arguments.length === 1 ? (t) => js(t, arguments[0]) : js(arguments[0], arguments[1]);
}
function js(t, n) {
  if (t === n)
    return !0;
  const i = typeof t;
  if (i !== typeof n)
    return !1;
  if (i === "object" || i === "function") {
    if (t !== null && n !== null) {
      if (Us(t) && Us(n))
        return B(t) === B(n) && t[Y](n) ? !0 : ve.enabled && ve.tester ? ve.tester(t, n) : !1;
      if (t instanceof Date && n instanceof Date) {
        const s = t.getTime(), a = n.getTime();
        return s === a || Number.isNaN(s) && Number.isNaN(a);
      } else if (t instanceof URL && n instanceof URL)
        return t.href === n.href;
    }
    if (ve.enabled) {
      if (Array.isArray(t) && Array.isArray(n))
        return t.length === n.length && t.every((s, a) => js(s, n[a]));
      if (Object.getPrototypeOf(t) === Object.prototype && Object.getPrototypeOf(t) === Object.prototype) {
        const s = Object.keys(t), a = Object.keys(n);
        if (s.length === a.length) {
          for (const u of s)
            if (!(u in n && js(t[u], n[u])))
              return ve.tester ? ve.tester(t, n) : !1;
          return !0;
        }
      }
      return ve.tester ? ve.tester(t, n) : !1;
    }
  }
  return ve.enabled && ve.tester ? ve.tester(t, n) : !1;
}
const Us = (t) => Q(t, Y), jc = () => X, Ct = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), Ht = (t) => {
  try {
    if (Q(t, "toJSON") && wo(t.toJSON) && t.toJSON.length === 0)
      return t.toJSON();
    if (Array.isArray(t))
      return t.map(Ht);
  } catch {
    return {};
  }
  return ty(t);
}, qt = (t) => JSON.stringify(t, null, 2), li = (t, n = 2) => {
  if (typeof t == "string")
    return t;
  try {
    return typeof t == "object" ? kd(t, n) : String(t);
  } catch {
    return String(t);
  }
}, kd = (t, n) => {
  let i = [];
  const s = JSON.stringify(t, (a, u) => typeof u == "object" && u !== null ? i.includes(u) ? void 0 : i.push(u) && (En.fiberRefs !== void 0 && Ld(u) ? u[Uc](En.fiberRefs) : u) : u, n);
  return i = void 0, s;
}, Uc = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable"), Ld = (t) => typeof t == "object" && t !== null && Uc in t, En = /* @__PURE__ */ dt("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
})), Qv = (t, n) => {
  const i = En.fiberRefs;
  En.fiberRefs = t;
  try {
    return n();
  } finally {
    En.fiberRefs = i;
  }
}, ty = (t) => Ld(t) && En.fiberRefs !== void 0 ? t[Uc](En.fiberRefs) : t, V = (t, n) => {
  switch (n.length) {
    case 0:
      return t;
    case 1:
      return n[0](t);
    case 2:
      return n[1](n[0](t));
    case 3:
      return n[2](n[1](n[0](t)));
    case 4:
      return n[3](n[2](n[1](n[0](t))));
    case 5:
      return n[4](n[3](n[2](n[1](n[0](t)))));
    case 6:
      return n[5](n[4](n[3](n[2](n[1](n[0](t))))));
    case 7:
      return n[6](n[5](n[4](n[3](n[2](n[1](n[0](t)))))));
    case 8:
      return n[7](n[6](n[5](n[4](n[3](n[2](n[1](n[0](t))))))));
    case 9:
      return n[8](n[7](n[6](n[5](n[4](n[3](n[2](n[1](n[0](t)))))))));
    default: {
      let i = t;
      for (let s = 0, a = n.length; s < a; s++)
        i = n[s](i);
      return i;
    }
  }
}, hr = "Async", xo = "Commit", he = "Failure", Ns = "OnFailure", Ws = "OnSuccess", Vs = "OnSuccessAndFailure", fe = "Success", Cd = "Sync", ey = "Tag", zr = "UpdateRuntimeFlags", qs = "While", fr = "Iterator", Id = "WithRuntime", Rs = "Yield", Wc = "RevertFlags";
let ny = "3.19.13";
const Vc = () => ny, iy = /* @__PURE__ */ Symbol.for("effect/Effect"), ry = /* @__PURE__ */ Symbol.for("effect/Stream"), sy = /* @__PURE__ */ Symbol.for("effect/Sink"), oy = /* @__PURE__ */ Symbol.for("effect/Channel"), hi = {
  /* c8 ignore next */
  _R: (t) => t,
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t,
  _V: /* @__PURE__ */ Vc()
}, ay = {
  /* c8 ignore next */
  _A: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _L: (t) => t,
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
}, cy = {
  /* c8 ignore next */
  _Env: (t) => t,
  /* c8 ignore next */
  _InErr: (t) => t,
  /* c8 ignore next */
  _InElem: (t) => t,
  /* c8 ignore next */
  _InDone: (t) => t,
  /* c8 ignore next */
  _OutErr: (t) => t,
  /* c8 ignore next */
  _OutElem: (t) => t,
  /* c8 ignore next */
  _OutDone: (t) => t
}, $r = {
  [iy]: hi,
  [ry]: hi,
  [sy]: ay,
  [oy]: cy,
  [Y](t) {
    return this === t;
  },
  [et]() {
    return Lt(this, Zc(this));
  },
  [Symbol.iterator]() {
    return new Pd(new Ar(this));
  },
  pipe() {
    return V(this, arguments);
  }
}, qc = {
  [et]() {
    return Lt(this, Md(this));
  },
  [Y](t) {
    const n = Object.keys(this), i = Object.keys(t);
    if (n.length !== i.length)
      return !1;
    for (const s of n)
      if (!(s in t && X(this[s], t[s])))
        return !1;
    return !0;
  }
}, Br = {
  ...$r,
  _op: xo
}, uy = {
  ...Br,
  ...qc
}, ly = /* @__PURE__ */ function() {
  function t() {
  }
  return t.prototype = Br, t;
}(), Od = /* @__PURE__ */ Symbol.for("effect/Option"), Nd = {
  ...$r,
  [Od]: {
    _A: (t) => t
  },
  [Ct]() {
    return this.toJSON();
  },
  toString() {
    return qt(this.toJSON());
  }
}, hy = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Nd), {
  _tag: "Some",
  _op: "Some",
  [Y](t) {
    return Rd(t) && Fd(t) && X(this.value, t.value);
  },
  [et]() {
    return Lt(this, ut(B(this._tag))(B(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: Ht(this.value)
    };
  }
}), fy = /* @__PURE__ */ B("None"), dy = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Nd), {
  _tag: "None",
  _op: "None",
  [Y](t) {
    return Rd(t) && Ad(t);
  },
  [et]() {
    return fy;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
}), Rd = (t) => Q(t, Od), Ad = (t) => t._tag === "None", Fd = (t) => t._tag === "Some", zd = /* @__PURE__ */ Object.create(dy), Ja = (t) => {
  const n = Object.create(hy);
  return n.value = t, n;
}, $d = /* @__PURE__ */ Symbol.for("effect/Either"), Bd = {
  ...$r,
  [$d]: {
    _R: (t) => t
  },
  [Ct]() {
    return this.toJSON();
  },
  toString() {
    return qt(this.toJSON());
  }
}, my = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Bd), {
  _tag: "Right",
  _op: "Right",
  [Y](t) {
    return Dd(t) && Hd(t) && X(this.right, t.right);
  },
  [et]() {
    return ut(B(this._tag))(B(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: Ht(this.right)
    };
  }
}), _y = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Bd), {
  _tag: "Left",
  _op: "Left",
  [Y](t) {
    return Dd(t) && Zd(t) && X(this.left, t.left);
  },
  [et]() {
    return ut(B(this._tag))(B(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: Ht(this.left)
    };
  }
}), Dd = (t) => Q(t, $d), Zd = (t) => t._tag === "Left", Hd = (t) => t._tag === "Right", py = (t) => {
  const n = Object.create(_y);
  return n.left = t, n;
}, gy = (t) => {
  const n = Object.create(my);
  return n.right = t, n;
}, Je = gy, fi = py, lr = Zd, Ps = Hd, vy = /* @__PURE__ */ v(2, (t, {
  onLeft: n,
  onRight: i
}) => lr(t) ? n(t.left) : i(t.right)), yy = /* @__PURE__ */ vy({
  onLeft: yt,
  onRight: yt
}), jd = (t) => t.length > 0, Ud = (t) => (n, i) => n === i ? 0 : t(n, i), by = /* @__PURE__ */ Ud((t, n) => t < n ? -1 : 1), wy = /* @__PURE__ */ v(2, (t, n) => Ud((i, s) => t(n(i), n(s)))), Sy = (t) => v(2, (n, i) => t(n, i) === 1), U = () => zd, st = Ja, ne = Ad, Be = Fd, mn = /* @__PURE__ */ v(2, (t, {
  onNone: n,
  onSome: i
}) => ne(t) ? n() : i(t.value)), en = /* @__PURE__ */ v(2, (t, n) => ne(t) ? n() : t.value), Ty = /* @__PURE__ */ v(2, (t, n) => ne(t) ? st(n()) : t), Kc = (t) => t == null ? U() : st(t), Sn = /* @__PURE__ */ en(wd), Py = /* @__PURE__ */ v(2, (t, n) => ne(t) ? U() : st(n(t.value))), xy = /* @__PURE__ */ v(2, (t, n) => ne(t) ? U() : n(t.value)), Ey = (t) => v(2, (n, i) => ne(n) ? !1 : t(n.value, i)), My = /* @__PURE__ */ jc(), ky = /* @__PURE__ */ Ey(My), Ly = (...t) => t, Gc = (t) => new Array(t), Cy = /* @__PURE__ */ v(2, (t, n) => {
  const i = Math.max(1, Math.floor(t)), s = new Array(i);
  for (let a = 0; a < i; a++)
    s[a] = n(a);
  return s;
}), Bt = (t) => Array.isArray(t) ? t : Array.from(t), Iy = (t) => Array.isArray(t) ? t : [t], Ks = /* @__PURE__ */ v(2, (t, n) => [n, ...t]), Oy = /* @__PURE__ */ v(2, (t, n) => [...t, n]), Wd = /* @__PURE__ */ v(2, (t, n) => Bt(t).concat(Bt(n))), Ny = (t) => t.length === 0, Ry = Ny, Ay = jd, de = jd, Vd = (t, n) => t < 0 || t >= n.length, Fy = (t, n) => Math.floor(Math.min(Math.max(0, t), n.length)), zy = /* @__PURE__ */ v(2, (t, n) => {
  const i = Math.floor(n);
  return Vd(i, t) ? U() : st(t[i]);
}), qd = /* @__PURE__ */ v(2, (t, n) => {
  const i = Math.floor(n);
  if (Vd(i, t))
    throw new Error(`Index ${i} out of bounds`);
  return t[i];
}), dr = /* @__PURE__ */ zy(0), re = /* @__PURE__ */ qd(0), $y = (t) => de(t) ? st(Kd(t)) : U(), Kd = (t) => t[t.length - 1], di = (t) => t.slice(1), By = (t, n) => {
  let i = 0;
  for (const s of t) {
    if (!n(s, i))
      break;
    i++;
  }
  return i;
}, Dy = /* @__PURE__ */ v(2, (t, n) => Uy(t, By(t, n))), Zy = /* @__PURE__ */ v(2, (t, n) => {
  const i = Bt(t);
  return i.slice(Fy(n, i), i.length);
}), hh = (t) => Array.from(t).reverse(), Gs = /* @__PURE__ */ v(2, (t, n) => {
  const i = Array.from(t);
  return i.sort(n), i;
}), fh = /* @__PURE__ */ v(2, (t, n) => Hy(t, n, Ly)), Hy = /* @__PURE__ */ v(3, (t, n, i) => {
  const s = Bt(t), a = Bt(n);
  if (de(s) && de(a)) {
    const u = [i(re(s), re(a))], h = Math.min(s.length, a.length);
    for (let d = 1; d < h; d++)
      u[d] = i(s[d], a[d]);
    return u;
  }
  return [];
}), jy = /* @__PURE__ */ jc(), Uy = /* @__PURE__ */ v(2, (t, n) => {
  const i = Array.from(t), s = Math.floor(n);
  return de(i) ? s >= 1 ? Wy(i, s) : [[], i] : [i, []];
}), Wy = /* @__PURE__ */ v(2, (t, n) => {
  const i = Math.max(1, Math.floor(n));
  return i >= t.length ? [Vy(t), []] : [Ks(t.slice(1, i), re(t)), t.slice(i)];
}), Vy = (t) => t.slice(), qy = /* @__PURE__ */ v(3, (t, n, i) => {
  const s = Bt(t), a = Bt(n);
  return de(s) ? de(a) ? Jd(i)(Wd(s, a)) : s : a;
}), As = /* @__PURE__ */ v(2, (t, n) => qy(t, n, jy)), mi = () => [], Me = (t) => [t], ai = /* @__PURE__ */ v(2, (t, n) => t.map(n)), Ky = /* @__PURE__ */ v(2, (t, n) => {
  if (Ry(t))
    return [];
  const i = [];
  for (let s = 0; s < t.length; s++) {
    const a = n(t[s], s);
    for (let u = 0; u < a.length; u++)
      i.push(a[u]);
  }
  return i;
}), Gy = /* @__PURE__ */ Ky(yt), Gd = /* @__PURE__ */ v(3, (t, n, i) => Bt(t).reduce((s, a, u) => i(s, a, u), n)), dh = (t, n) => {
  const i = [];
  let s = t, a;
  for (; Be(a = n(s)); ) {
    const [u, h] = a.value;
    i.push(u), s = h;
  }
  return i;
}, Jc = Av, Jd = /* @__PURE__ */ v(2, (t, n) => {
  const i = Bt(t);
  if (de(i)) {
    const s = [re(i)], a = di(i);
    for (const u of a)
      s.every((h) => !n(u, h)) && s.push(u);
    return s;
  }
  return [];
}), Jy = (t) => Jd(t, jc()), Li = /* @__PURE__ */ v(2, (t, n) => Bt(t).join(n)), vr = by, Yy = (t) => t.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"), Xy = /* @__PURE__ */ Symbol.for("effect/Context/Tag"), Js = /* @__PURE__ */ Symbol.for("effect/Context/Reference"), Qy = "effect/STM", tb = /* @__PURE__ */ Symbol.for(Qy), Yd = {
  ...$r,
  _op: "Tag",
  [tb]: hi,
  [Xy]: {
    _Service: (t) => t,
    _Identifier: (t) => t
  },
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [Ct]() {
    return this.toJSON();
  },
  of(t) {
    return t;
  },
  context(t) {
    return Qd(this, t);
  }
}, eb = {
  ...Yd,
  [Js]: Js
}, nb = (t) => {
  const n = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const i = new Error();
  Error.stackTraceLimit = n;
  const s = Object.create(Yd);
  return Object.defineProperty(s, "stack", {
    get() {
      return i.stack;
    }
  }), s.key = t, s;
}, ib = () => (t, n) => {
  const i = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const s = new Error();
  Error.stackTraceLimit = i;
  function a() {
  }
  return Object.setPrototypeOf(a, eb), a.key = t, a.defaultValue = n.defaultValue, Object.defineProperty(a, "stack", {
    get() {
      return s.stack;
    }
  }), a;
}, Xd = /* @__PURE__ */ Symbol.for("effect/Context"), rb = {
  [Xd]: {
    _Services: (t) => t
  },
  [Y](t) {
    if (ob(t) && this.unsafeMap.size === t.unsafeMap.size) {
      for (const n of this.unsafeMap.keys())
        if (!t.unsafeMap.has(n) || !X(this.unsafeMap.get(n), t.unsafeMap.get(n)))
          return !1;
      return !0;
    }
    return !1;
  },
  [et]() {
    return Lt(this, Hc(this.unsafeMap.size));
  },
  pipe() {
    return V(this, arguments);
  },
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(Ht)
    };
  },
  [Ct]() {
    return this.toJSON();
  }
}, _i = (t) => {
  const n = Object.create(rb);
  return n.unsafeMap = t, n;
}, sb = (t) => {
  const n = new Error(`Service not found${t.key ? `: ${String(t.key)}` : ""}`);
  if (t.stack) {
    const i = t.stack.split(`
`);
    if (i.length > 2) {
      const s = i[2].match(/at (.*)/);
      s && (n.message = n.message + ` (defined at ${s[1]})`);
    }
  }
  if (n.stack) {
    const i = n.stack.split(`
`);
    i.splice(1, 3), n.stack = i.join(`
`);
  }
  return n;
}, ob = (t) => Q(t, Xd), ab = (t) => Q(t, Js), cb = /* @__PURE__ */ _i(/* @__PURE__ */ new Map()), ub = () => cb, Qd = (t, n) => _i(/* @__PURE__ */ new Map([[t.key, n]])), lb = /* @__PURE__ */ v(3, (t, n, i) => {
  const s = new Map(t.unsafeMap);
  return s.set(n.key, i), _i(s);
}), Ca = /* @__PURE__ */ dt("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map()), Yc = (t) => {
  if (Ca.has(t.key))
    return Ca.get(t.key);
  const n = t.defaultValue();
  return Ca.set(t.key, n), n;
}, hb = (t, n) => t.unsafeMap.has(n.key) ? t.unsafeMap.get(n.key) : Yc(n), tm = /* @__PURE__ */ v(2, (t, n) => {
  if (!t.unsafeMap.has(n.key)) {
    if (Js in n) return Yc(n);
    throw sb(n);
  }
  return t.unsafeMap.get(n.key);
}), fb = tm, db = /* @__PURE__ */ v(2, (t, n) => t.unsafeMap.has(n.key) ? Ja(t.unsafeMap.get(n.key)) : ab(n) ? Ja(Yc(n)) : zd), mb = /* @__PURE__ */ v(2, (t, n) => {
  const i = new Map(t.unsafeMap);
  for (const [s, a] of n.unsafeMap)
    i.set(s, a);
  return _i(i);
}), jn = nb, Xc = ub, _b = Qd, ri = lb, em = fb, nm = tm, Dr = db, im = mb, Qc = ib, rm = /* @__PURE__ */ Symbol.for("effect/Chunk");
function pb(t, n, i, s, a) {
  for (let u = n; u < Math.min(t.length, n + a); u++)
    i[s + u - n] = t[u];
  return i;
}
const sm = [], gb = (t) => Dc((n, i) => n.length === i.length && Mn(n).every((s, a) => t(s, kn(i, a)))), vb = /* @__PURE__ */ gb(X), yb = {
  [rm]: {
    _A: (t) => t
  },
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: Mn(this).map(Ht)
    };
  },
  [Ct]() {
    return this.toJSON();
  },
  [Y](t) {
    return om(t) && vb(this, t);
  },
  [et]() {
    return Lt(this, Fr(Mn(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray":
        return this.backing.array[Symbol.iterator]();
      case "IEmpty":
        return sm[Symbol.iterator]();
      default:
        return Mn(this)[Symbol.iterator]();
    }
  },
  pipe() {
    return V(this, arguments);
  }
}, Dt = (t) => {
  const n = Object.create(yb);
  switch (n.backing = t, t._tag) {
    case "IEmpty": {
      n.length = 0, n.depth = 0, n.left = n, n.right = n;
      break;
    }
    case "IConcat": {
      n.length = t.left.length + t.right.length, n.depth = 1 + Math.max(t.left.depth, t.right.depth), n.left = t.left, n.right = t.right;
      break;
    }
    case "IArray": {
      n.length = t.array.length, n.depth = 0, n.left = ze, n.right = ze;
      break;
    }
    case "ISingleton": {
      n.length = 1, n.depth = 0, n.left = ze, n.right = ze;
      break;
    }
    case "ISlice": {
      n.length = t.length, n.depth = t.chunk.depth + 1, n.left = ze, n.right = ze;
      break;
    }
  }
  return n;
}, om = (t) => Q(t, rm), ze = /* @__PURE__ */ Dt({
  _tag: "IEmpty"
}), De = () => ze, Ia = (...t) => Tb(t), se = (t) => Dt({
  _tag: "ISingleton",
  a: t
}), am = (t) => om(t) ? t : Eo(Bt(t)), Ya = (t, n, i) => {
  switch (t.backing._tag) {
    case "IArray": {
      pb(t.backing.array, 0, n, i, t.length);
      break;
    }
    case "IConcat": {
      Ya(t.left, n, i), Ya(t.right, n, i + t.left.length);
      break;
    }
    case "ISingleton": {
      n[i] = t.backing.a;
      break;
    }
    case "ISlice": {
      let s = 0, a = i;
      for (; s < t.length; )
        n[a] = kn(t, s), s += 1, a += 1;
      break;
    }
  }
}, bb = (t) => {
  switch (t.backing._tag) {
    case "IEmpty":
      return sm;
    case "IArray":
      return t.backing.array;
    default: {
      const n = new Array(t.length);
      return Ya(t, n, 0), t.backing = {
        _tag: "IArray",
        array: n
      }, t.left = ze, t.right = ze, t.depth = 0, n;
    }
  }
}, Mn = bb, wb = (t) => {
  switch (t.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return t;
    case "IArray":
      return Dt({
        _tag: "IArray",
        array: hh(t.backing.array)
      });
    case "IConcat":
      return Dt({
        _tag: "IConcat",
        left: On(t.backing.right),
        right: On(t.backing.left)
      });
    case "ISlice":
      return Eo(hh(Mn(t)));
  }
}, On = wb, Sb = /* @__PURE__ */ v(2, (t, n) => n < 0 || n >= t.length ? U() : st(kn(t, n))), Eo = (t) => t.length === 0 ? De() : t.length === 1 ? se(t[0]) : Dt({
  _tag: "IArray",
  array: t
}), Tb = (t) => Eo(t), kn = /* @__PURE__ */ v(2, (t, n) => {
  switch (t.backing._tag) {
    case "IEmpty":
      throw new Error("Index out of bounds");
    case "ISingleton": {
      if (n !== 0)
        throw new Error("Index out of bounds");
      return t.backing.a;
    }
    case "IArray": {
      if (n >= t.length || n < 0)
        throw new Error("Index out of bounds");
      return t.backing.array[n];
    }
    case "IConcat":
      return n < t.left.length ? kn(t.left, n) : kn(t.right, n - t.left.length);
    case "ISlice":
      return kn(t.backing.chunk, n + t.backing.offset);
  }
}), Pb = /* @__PURE__ */ v(2, (t, n) => ke(t, se(n))), Se = /* @__PURE__ */ v(2, (t, n) => ke(se(n), t)), Xa = /* @__PURE__ */ v(2, (t, n) => {
  if (n <= 0)
    return t;
  if (n >= t.length)
    return ze;
  switch (t.backing._tag) {
    case "ISlice":
      return Dt({
        _tag: "ISlice",
        chunk: t.backing.chunk,
        offset: t.backing.offset + n,
        length: t.backing.length - n
      });
    case "IConcat":
      return n > t.left.length ? Xa(t.right, n - t.left.length) : Dt({
        _tag: "IConcat",
        left: Xa(t.left, n),
        right: t.right
      });
    default:
      return Dt({
        _tag: "ISlice",
        chunk: t,
        offset: n,
        length: t.length - n
      });
  }
}), ke = /* @__PURE__ */ v(2, (t, n) => {
  if (t.backing._tag === "IEmpty")
    return n;
  if (n.backing._tag === "IEmpty")
    return t;
  const i = n.depth - t.depth;
  if (Math.abs(i) <= 1)
    return Dt({
      _tag: "IConcat",
      left: t,
      right: n
    });
  if (i < -1)
    if (t.left.depth >= t.right.depth) {
      const s = ke(t.right, n);
      return Dt({
        _tag: "IConcat",
        left: t.left,
        right: s
      });
    } else {
      const s = ke(t.right.right, n);
      if (s.depth === t.depth - 3) {
        const a = Dt({
          _tag: "IConcat",
          left: t.right.left,
          right: s
        });
        return Dt({
          _tag: "IConcat",
          left: t.left,
          right: a
        });
      } else {
        const a = Dt({
          _tag: "IConcat",
          left: t.left,
          right: t.right.left
        });
        return Dt({
          _tag: "IConcat",
          left: a,
          right: s
        });
      }
    }
  else if (n.right.depth >= n.left.depth) {
    const s = ke(t, n.left);
    return Dt({
      _tag: "IConcat",
      left: s,
      right: n.right
    });
  } else {
    const s = ke(t, n.left.left);
    if (s.depth === n.depth - 3) {
      const a = Dt({
        _tag: "IConcat",
        left: s,
        right: n.left.right
      });
      return Dt({
        _tag: "IConcat",
        left: a,
        right: n.right
      });
    } else {
      const a = Dt({
        _tag: "IConcat",
        left: n.left.right,
        right: n.right
      });
      return Dt({
        _tag: "IConcat",
        left: s,
        right: a
      });
    }
  }
}), xb = (t) => t.length === 0, nn = (t) => t.length > 0, cm = /* @__PURE__ */ Sb(0), um = (t) => kn(t, 0), $e = um, Ye = (t) => Xa(t, 1), Qa = /* @__PURE__ */ Symbol.for("effect/Duration"), lm = /* @__PURE__ */ BigInt(0), mh = /* @__PURE__ */ BigInt(24), xs = /* @__PURE__ */ BigInt(60), tc = /* @__PURE__ */ BigInt(1e3), _h = /* @__PURE__ */ BigInt(1e6), ph = /* @__PURE__ */ BigInt(1e9), Eb = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/, me = (t) => {
  if (hm(t))
    return t;
  if (Ka(t))
    return Nn(t);
  if (zv(t))
    return Oa(t);
  if (Array.isArray(t) && t.length === 2 && t.every(Ka))
    return t[0] === -1 / 0 || t[1] === -1 / 0 || Number.isNaN(t[0]) || Number.isNaN(t[1]) ? pi : t[0] === 1 / 0 || t[1] === 1 / 0 ? Cb : Oa(BigInt(Math.round(t[0] * 1e9)) + BigInt(Math.round(t[1])));
  if (Fv(t)) {
    const n = Eb.exec(t);
    if (n) {
      const [i, s, a] = n, u = Number(s);
      switch (a) {
        case "nano":
        case "nanos":
          return Oa(BigInt(s));
        case "micro":
        case "micros":
          return Ib(BigInt(s));
        case "milli":
        case "millis":
          return Nn(u);
        case "second":
        case "seconds":
          return Ob(u);
        case "minute":
        case "minutes":
          return Nb(u);
        case "hour":
        case "hours":
          return Rb(u);
        case "day":
        case "days":
          return Ab(u);
        case "week":
        case "weeks":
          return Fb(u);
      }
    }
  }
  throw new Error("Invalid DurationInput");
}, gh = {
  _tag: "Millis",
  millis: 0
}, Mb = {
  _tag: "Infinity"
}, kb = {
  [Qa]: Qa,
  [et]() {
    return Lt(this, Md(this.value));
  },
  [Y](t) {
    return hm(t) && Ub(this, t);
  },
  toString() {
    return `Duration(${Vb(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: $b(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [Ct]() {
    return this.toJSON();
  },
  pipe() {
    return V(this, arguments);
  }
}, oe = (t) => {
  const n = Object.create(kb);
  return Ka(t) ? isNaN(t) || t <= 0 ? n.value = gh : Number.isFinite(t) ? Number.isInteger(t) ? n.value = {
    _tag: "Millis",
    millis: t
  } : n.value = {
    _tag: "Nanos",
    nanos: BigInt(Math.round(t * 1e6))
  } : n.value = Mb : t <= lm ? n.value = gh : n.value = {
    _tag: "Nanos",
    nanos: t
  }, n;
}, hm = (t) => Q(t, Qa), Lb = (t) => {
  switch (t.value._tag) {
    case "Millis":
      return t.value.millis === 0;
    case "Nanos":
      return t.value.nanos === lm;
    case "Infinity":
      return !1;
  }
}, pi = /* @__PURE__ */ oe(0), Cb = /* @__PURE__ */ oe(1 / 0), Oa = (t) => oe(t), Ib = (t) => oe(t * tc), Nn = (t) => oe(t), Ob = (t) => oe(t * 1e3), Nb = (t) => oe(t * 6e4), Rb = (t) => oe(t * 36e5), Ab = (t) => oe(t * 864e5), Fb = (t) => oe(t * 6048e5), Ys = (t) => fm(t, {
  onMillis: (n) => n,
  onNanos: (n) => Number(n) / 1e6
}), zb = (t) => {
  const n = me(t);
  switch (n.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return n.value.nanos;
    case "Millis":
      return BigInt(Math.round(n.value.millis * 1e6));
  }
}, $b = (t) => {
  const n = me(t);
  switch (n.value._tag) {
    case "Infinity":
      return [1 / 0, 0];
    case "Nanos":
      return [Number(n.value.nanos / ph), Number(n.value.nanos % ph)];
    case "Millis":
      return [Math.floor(n.value.millis / 1e3), Math.round(n.value.millis % 1e3 * 1e6)];
  }
}, fm = /* @__PURE__ */ v(2, (t, n) => {
  const i = me(t);
  switch (i.value._tag) {
    case "Nanos":
      return n.onNanos(i.value.nanos);
    case "Infinity":
      return n.onMillis(1 / 0);
    case "Millis":
      return n.onMillis(i.value.millis);
  }
}), Mo = /* @__PURE__ */ v(3, (t, n, i) => {
  const s = me(t), a = me(n);
  if (s.value._tag === "Infinity" || a.value._tag === "Infinity")
    return i.onMillis(Ys(s), Ys(a));
  if (s.value._tag === "Nanos" || a.value._tag === "Nanos") {
    const u = s.value._tag === "Nanos" ? s.value.nanos : BigInt(Math.round(s.value.millis * 1e6)), h = a.value._tag === "Nanos" ? a.value.nanos : BigInt(Math.round(a.value.millis * 1e6));
    return i.onNanos(u, h);
  }
  return i.onMillis(s.value.millis, a.value.millis);
}), Bb = (t, n) => Mo(t, n, {
  onMillis: (i, s) => i === s,
  onNanos: (i, s) => i === s
}), Db = /* @__PURE__ */ v(2, (t, n) => fm(t, {
  onMillis: (i) => oe(i * n),
  onNanos: (i) => oe(i * BigInt(n))
})), Zb = /* @__PURE__ */ v(2, (t, n) => Mo(t, n, {
  onMillis: (i, s) => oe(i + s),
  onNanos: (i, s) => oe(i + s)
})), Hb = /* @__PURE__ */ v(2, (t, n) => Mo(t, n, {
  onMillis: (i, s) => i <= s,
  onNanos: (i, s) => i <= s
})), jb = /* @__PURE__ */ v(2, (t, n) => Mo(t, n, {
  onMillis: (i, s) => i >= s,
  onNanos: (i, s) => i >= s
})), Ub = /* @__PURE__ */ v(2, (t, n) => Bb(me(t), me(n))), Wb = (t) => {
  const n = me(t);
  if (n.value._tag === "Infinity")
    return {
      days: 1 / 0,
      hours: 1 / 0,
      minutes: 1 / 0,
      seconds: 1 / 0,
      millis: 1 / 0,
      nanos: 1 / 0
    };
  const i = zb(n), s = i / _h, a = s / tc, u = a / xs, h = u / xs, d = h / mh;
  return {
    days: Number(d),
    hours: Number(h % mh),
    minutes: Number(u % xs),
    seconds: Number(a % xs),
    millis: Number(s % tc),
    nanos: Number(i % _h)
  };
}, Vb = (t) => {
  const n = me(t);
  if (n.value._tag === "Infinity")
    return "Infinity";
  if (Lb(n))
    return "0";
  const i = Wb(n), s = [];
  return i.days !== 0 && s.push(`${i.days}d`), i.hours !== 0 && s.push(`${i.hours}h`), i.minutes !== 0 && s.push(`${i.minutes}m`), i.seconds !== 0 && s.push(`${i.seconds}s`), i.millis !== 0 && s.push(`${i.millis}ms`), i.nanos !== 0 && s.push(`${i.nanos}ns`), s.join(" ");
}, Rn = 5, tu = /* @__PURE__ */ Math.pow(2, Rn), qb = tu - 1, Kb = tu / 2, Gb = tu / 4;
function Jb(t) {
  return t -= t >> 1 & 1431655765, t = (t & 858993459) + (t >> 2 & 858993459), t = t + (t >> 4) & 252645135, t += t >> 8, t += t >> 16, t & 127;
}
function gi(t, n) {
  return n >>> t & qb;
}
function oi(t) {
  return 1 << t;
}
function dm(t, n) {
  return Jb(t & n - 1);
}
const Yb = (t, n) => ({
  value: t,
  previous: n
});
function ci(t, n, i, s) {
  let a = s;
  if (!t) {
    const u = s.length;
    a = new Array(u);
    for (let h = 0; h < u; ++h) a[h] = s[h];
  }
  return a[n] = i, a;
}
function mm(t, n, i) {
  const s = i.length - 1;
  let a = 0, u = 0, h = i;
  if (t)
    a = u = n;
  else
    for (h = new Array(s); a < n; ) h[u++] = i[a++];
  for (++a; a <= s; ) h[u++] = i[a++];
  return t && (h.length = s), h;
}
function Xb(t, n, i, s) {
  const a = s.length;
  if (t) {
    let m = a;
    for (; m >= n; ) s[m--] = s[m];
    return s[n] = i, s;
  }
  let u = 0, h = 0;
  const d = new Array(a + 1);
  for (; u < n; ) d[h++] = s[u++];
  for (d[n] = i; u < a; ) d[++h] = s[u++];
  return d;
}
class fn {
  constructor() {
    _(this, "_tag", "EmptyNode");
  }
  modify(n, i, s, a, u, h) {
    const d = s(U());
    return ne(d) ? new fn() : (++h.value, new Ln(n, a, u, d));
  }
}
function Le(t) {
  return Sd(t, "EmptyNode");
}
function Qb(t) {
  return Le(t) || t._tag === "LeafNode" || t._tag === "CollisionNode";
}
function ko(t, n) {
  return Le(t) ? !1 : n === t.edit;
}
class Ln {
  constructor(n, i, s, a) {
    _(this, "edit");
    _(this, "hash");
    _(this, "key");
    _(this, "value");
    _(this, "_tag", "LeafNode");
    this.edit = n, this.hash = i, this.key = s, this.value = a;
  }
  modify(n, i, s, a, u, h) {
    if (X(u, this.key)) {
      const m = s(this.value);
      return m === this.value ? this : ne(m) ? (--h.value, new fn()) : ko(this, n) ? (this.value = m, this) : new Ln(n, a, u, m);
    }
    const d = s(U());
    return ne(d) ? this : (++h.value, _m(n, i, this.hash, this, a, new Ln(n, a, u, d)));
  }
}
class eu {
  constructor(n, i, s) {
    _(this, "edit");
    _(this, "hash");
    _(this, "children");
    _(this, "_tag", "CollisionNode");
    this.edit = n, this.hash = i, this.children = s;
  }
  modify(n, i, s, a, u, h) {
    if (a === this.hash) {
      const m = ko(this, n), g = this.updateCollisionList(m, n, this.hash, this.children, s, u, h);
      return g === this.children ? this : g.length > 1 ? new eu(n, this.hash, g) : g[0];
    }
    const d = s(U());
    return ne(d) ? this : (++h.value, _m(n, i, this.hash, this, a, new Ln(n, a, u, d)));
  }
  updateCollisionList(n, i, s, a, u, h, d) {
    const m = a.length;
    for (let w = 0; w < m; ++w) {
      const y = a[w];
      if ("key" in y && X(h, y.key)) {
        const x = y.value, E = u(x);
        return E === x ? a : ne(E) ? (--d.value, mm(n, w, a)) : ci(n, w, new Ln(i, s, h, E), a);
      }
    }
    const g = u(U());
    return ne(g) ? a : (++d.value, ci(n, m, new Ln(i, s, h, g), a));
  }
}
class vi {
  constructor(n, i, s) {
    _(this, "edit");
    _(this, "mask");
    _(this, "children");
    _(this, "_tag", "IndexedNode");
    this.edit = n, this.mask = i, this.children = s;
  }
  modify(n, i, s, a, u, h) {
    const d = this.mask, m = this.children, g = gi(i, a), w = oi(g), y = dm(d, w), x = d & w, E = ko(this, n);
    if (!x) {
      const nt = new fn().modify(n, i + Rn, s, a, u, h);
      return nt ? m.length >= Kb ? e0(n, g, nt, d, m) : new vi(n, d | w, Xb(E, y, nt, m)) : this;
    }
    const C = m[y], I = C.modify(n, i + Rn, s, a, u, h);
    if (C === I) return this;
    let D = d, lt;
    if (Le(I)) {
      if (D &= ~w, !D) return new fn();
      if (m.length <= 2 && Qb(m[y ^ 1]))
        return m[y ^ 1];
      lt = mm(E, y, m);
    } else
      lt = ci(E, y, I, m);
    return E ? (this.mask = D, this.children = lt, this) : new vi(n, D, lt);
  }
}
class nu {
  constructor(n, i, s) {
    _(this, "edit");
    _(this, "size");
    _(this, "children");
    _(this, "_tag", "ArrayNode");
    this.edit = n, this.size = i, this.children = s;
  }
  modify(n, i, s, a, u, h) {
    let d = this.size;
    const m = this.children, g = gi(i, a), w = m[g], y = (w || new fn()).modify(n, i + Rn, s, a, u, h);
    if (w === y) return this;
    const x = ko(this, n);
    let E;
    if (Le(w) && !Le(y))
      ++d, E = ci(x, g, y, m);
    else if (!Le(w) && Le(y)) {
      if (--d, d <= Gb)
        return t0(n, d, g, m);
      E = ci(x, g, new fn(), m);
    } else
      E = ci(x, g, y, m);
    return x ? (this.size = d, this.children = E, this) : new nu(n, d, E);
  }
}
function t0(t, n, i, s) {
  const a = new Array(n - 1);
  let u = 0, h = 0;
  for (let d = 0, m = s.length; d < m; ++d)
    if (d !== i) {
      const g = s[d];
      g && !Le(g) && (a[u++] = g, h |= 1 << d);
    }
  return new vi(t, h, a);
}
function e0(t, n, i, s, a) {
  const u = [];
  let h = s, d = 0;
  for (let m = 0; h; ++m)
    h & 1 && (u[m] = a[d++]), h >>>= 1;
  return u[n] = i, new nu(t, d + 1, u);
}
function n0(t, n, i, s, a, u) {
  if (i === a) return new eu(t, i, [u, s]);
  const h = gi(n, i), d = gi(n, a);
  if (h === d)
    return (m) => new vi(t, oi(h) | oi(d), [m]);
  {
    const m = h < d ? [s, u] : [u, s];
    return new vi(t, oi(h) | oi(d), m);
  }
}
function _m(t, n, i, s, a, u) {
  let h, d = n;
  for (; ; ) {
    const m = n0(t, d, i, s, a, u);
    if (typeof m == "function")
      h = Yb(m, h), d = d + Rn;
    else {
      let g = m;
      for (; h != null; )
        g = h.value(g), h = h.previous;
      return g;
    }
  }
}
const pm = "effect/HashMap", ec = /* @__PURE__ */ Symbol.for(pm), i0 = {
  [ec]: ec,
  [Symbol.iterator]() {
    return new Lo(this, (t, n) => [t, n]);
  },
  [et]() {
    let t = B(pm);
    for (const n of this)
      t ^= T(B(n[0]), ut(B(n[1])));
    return Lt(this, t);
  },
  [Y](t) {
    if (o0(t)) {
      if (t._size !== this._size)
        return !1;
      for (const n of this) {
        const i = T(t, ru(n[0], B(n[0])));
        if (ne(i))
          return !1;
        if (!X(n[1], i.value))
          return !1;
      }
      return !0;
    }
    return !1;
  },
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(Ht)
    };
  },
  [Ct]() {
    return this.toJSON();
  },
  pipe() {
    return V(this, arguments);
  }
}, iu = (t, n, i, s) => {
  const a = Object.create(i0);
  return a._editable = t, a._edit = n, a._root = i, a._size = s, a;
};
class Lo {
  constructor(n, i) {
    _(this, "map");
    _(this, "f");
    _(this, "v");
    this.map = n, this.f = i, this.v = gm(this.map._root, this.f, void 0);
  }
  next() {
    if (ne(this.v))
      return {
        done: !0,
        value: void 0
      };
    const n = this.v.value;
    return this.v = Xs(n.cont), {
      done: !1,
      value: n.value
    };
  }
  [Symbol.iterator]() {
    return new Lo(this.map, this.f);
  }
}
const Xs = (t) => t ? vm(t[0], t[1], t[2], t[3], t[4]) : U(), gm = (t, n, i = void 0) => {
  switch (t._tag) {
    case "LeafNode":
      return Be(t.value) ? st({
        value: n(t.key, t.value.value),
        cont: i
      }) : Xs(i);
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const s = t.children;
      return vm(s.length, s, 0, n, i);
    }
    default:
      return Xs(i);
  }
}, vm = (t, n, i, s, a) => {
  for (; i < t; ) {
    const u = n[i++];
    if (u && !Le(u))
      return gm(u, s, [t, n, i, s, a]);
  }
  return Xs(a);
}, r0 = /* @__PURE__ */ iu(!1, 0, /* @__PURE__ */ new fn(), 0), Co = () => r0, s0 = (t) => {
  const n = bm(Co());
  for (const i of t)
    yr(n, i[0], i[1]);
  return h0(n);
}, o0 = (t) => Q(t, ec), a0 = (t) => t && Le(t._root), c0 = /* @__PURE__ */ v(2, (t, n) => ru(t, n, B(n))), ru = /* @__PURE__ */ v(3, (t, n, i) => {
  let s = t._root, a = 0;
  for (; ; )
    switch (s._tag) {
      case "LeafNode":
        return X(n, s.key) ? s.value : U();
      case "CollisionNode": {
        if (i === s.hash) {
          const u = s.children;
          for (let h = 0, d = u.length; h < d; ++h) {
            const m = u[h];
            if ("key" in m && X(n, m.key))
              return m.value;
          }
        }
        return U();
      }
      case "IndexedNode": {
        const u = gi(a, i), h = oi(u);
        if (s.mask & h) {
          s = s.children[dm(s.mask, h)], a += Rn;
          break;
        }
        return U();
      }
      case "ArrayNode": {
        if (s = s.children[gi(a, i)], s) {
          a += Rn;
          break;
        }
        return U();
      }
      default:
        return U();
    }
}), u0 = /* @__PURE__ */ v(2, (t, n) => Be(ru(t, n, B(n)))), yr = /* @__PURE__ */ v(3, (t, n, i) => su(t, n, () => st(i))), l0 = /* @__PURE__ */ v(3, (t, n, i) => t._editable ? (t._root = n, t._size = i, t) : n === t._root ? t : iu(t._editable, t._edit, n, i)), ym = (t) => new Lo(t, (n) => n), nc = (t) => t._size, bm = (t) => iu(!0, t._edit + 1, t._root, t._size), h0 = (t) => (t._editable = !1, t), su = /* @__PURE__ */ v(3, (t, n, i) => f0(t, n, B(n), i)), f0 = /* @__PURE__ */ v(4, (t, n, i, s) => {
  const a = {
    value: t._size
  }, u = t._root.modify(t._editable ? t._edit : NaN, 0, s, i, n, a);
  return T(t, l0(u, a.value));
}), vh = /* @__PURE__ */ v(2, (t, n) => su(t, n, U)), d0 = /* @__PURE__ */ v(2, (t, n) => Io(t, Co(), (i, s, a) => yr(i, a, n(s, a)))), m0 = /* @__PURE__ */ v(2, (t, n) => Io(t, void 0, (i, s, a) => n(s, a))), Io = /* @__PURE__ */ v(3, (t, n, i) => {
  const s = t._root;
  if (s._tag === "LeafNode")
    return Be(s.value) ? i(n, s.value.value, s.key) : n;
  if (s._tag === "EmptyNode")
    return n;
  const a = [s.children];
  let u;
  for (; u = a.pop(); )
    for (let h = 0, d = u.length; h < d; ) {
      const m = u[h++];
      m && !Le(m) && (m._tag === "LeafNode" ? Be(m.value) && (n = i(n, m.value.value, m.key)) : a.push(m.children));
    }
  return n;
}), wm = "effect/HashSet", ic = /* @__PURE__ */ Symbol.for(wm), _0 = {
  [ic]: ic,
  [Symbol.iterator]() {
    return ym(this._keyMap);
  },
  [et]() {
    return Lt(this, ut(B(this._keyMap))(B(wm)));
  },
  [Y](t) {
    return p0(t) ? nc(this._keyMap) === nc(t._keyMap) && X(this._keyMap, t._keyMap) : !1;
  },
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(Ht)
    };
  },
  [Ct]() {
    return this.toJSON();
  },
  pipe() {
    return V(this, arguments);
  }
}, Oo = (t) => {
  const n = Object.create(_0);
  return n._keyMap = t, n;
}, p0 = (t) => Q(t, ic), g0 = /* @__PURE__ */ Oo(/* @__PURE__ */ Co()), No = () => g0, v0 = (t) => {
  const n = ou(No());
  for (const i of t)
    br(n, i);
  return au(n);
}, y0 = (...t) => {
  const n = ou(No());
  for (const i of t)
    br(n, i);
  return au(n);
}, b0 = /* @__PURE__ */ v(2, (t, n) => u0(t._keyMap, n)), w0 = (t) => nc(t._keyMap), ou = (t) => Oo(bm(t._keyMap)), au = (t) => (t._keyMap._editable = !1, t), Sm = /* @__PURE__ */ v(2, (t, n) => {
  const i = ou(t);
  return n(i), au(i);
}), br = /* @__PURE__ */ v(2, (t, n) => t._keyMap._editable ? (yr(n, !0)(t._keyMap), t) : Oo(yr(n, !0)(t._keyMap))), Tm = /* @__PURE__ */ v(2, (t, n) => t._keyMap._editable ? (vh(n)(t._keyMap), t) : Oo(vh(n)(t._keyMap))), S0 = /* @__PURE__ */ v(2, (t, n) => Sm(t, (i) => {
  for (const s of n)
    Tm(i, s);
})), T0 = /* @__PURE__ */ v(2, (t, n) => Sm(No(), (i) => {
  P0(t, (s) => br(i, s));
  for (const s of n)
    br(i, s);
})), P0 = /* @__PURE__ */ v(2, (t, n) => m0(t._keyMap, (i, s) => n(s))), x0 = /* @__PURE__ */ v(3, (t, n, i) => Io(t._keyMap, n, (s, a, u) => i(s, u))), An = No, E0 = v0, cu = y0, M0 = b0, Pm = w0, mr = br, xm = Tm, yh = S0, wr = T0, Qs = x0, bh = /* @__PURE__ */ Symbol.for("effect/MutableRef"), k0 = {
  [bh]: bh,
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: Ht(this.current)
    };
  },
  [Ct]() {
    return this.toJSON();
  },
  pipe() {
    return V(this, arguments);
  }
}, uu = (t) => {
  const n = Object.create(k0);
  return n.current = t, n;
}, yi = (t) => t.current, lu = /* @__PURE__ */ v(2, (t, n) => (t.current = n, t)), hu = "effect/FiberId", Sr = /* @__PURE__ */ Symbol.for(hu), to = "None", rc = "Runtime", L0 = "Composite", C0 = /* @__PURE__ */ Ot(`${hu}-${to}`);
var xf;
let I0 = class {
  constructor() {
    _(this, xf, Sr);
    _(this, "_tag", to);
    _(this, "id", -1);
    _(this, "startTimeMillis", -1);
  }
  [(xf = Sr, et)]() {
    return C0;
  }
  [Y](n) {
    return Em(n) && n._tag === to;
  }
  toString() {
    return qt(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [Ct]() {
    return this.toJSON();
  }
};
var Ef;
class O0 {
  constructor(n, i) {
    _(this, "id");
    _(this, "startTimeMillis");
    _(this, Ef, Sr);
    _(this, "_tag", rc);
    this.id = n, this.startTimeMillis = i;
  }
  [(Ef = Sr, et)]() {
    return Lt(this, Ot(`${hu}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [Y](n) {
    return Em(n) && n._tag === rc && this.id === n.id && this.startTimeMillis === n.startTimeMillis;
  }
  toString() {
    return qt(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [Ct]() {
    return this.toJSON();
  }
}
const N0 = /* @__PURE__ */ new I0(), Em = (t) => Q(t, Sr), sc = (t) => {
  switch (t._tag) {
    case to:
      return An();
    case rc:
      return cu(t.id);
    case L0:
      return T(sc(t.left), wr(sc(t.right)));
  }
}, wh = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => uu(0)), Mm = (t) => Array.from(sc(t)).map((i) => `#${i}`).join(","), R0 = () => {
  const t = yi(wh);
  return T(wh, lu(t + 1)), new O0(t, Date.now());
}, bi = N0, A0 = Mm, km = R0, fu = Co, F0 = s0, z0 = a0, Lm = c0, Cm = yr, Im = ym, $0 = su, B0 = d0, Om = Io, Tr = /* @__PURE__ */ Symbol.for("effect/List"), oc = (t) => Bt(t), D0 = (t) => Rv(Jc(t), oc), Z0 = /* @__PURE__ */ D0(X), H0 = {
  [Tr]: Tr,
  _tag: "Cons",
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: oc(this).map(Ht)
    };
  },
  [Ct]() {
    return this.toJSON();
  },
  [Y](t) {
    return Rm(t) && this._tag === t._tag && Z0(this, t);
  },
  [et]() {
    return Lt(this, Fr(oc(this)));
  },
  [Symbol.iterator]() {
    let t = !1, n = this;
    return {
      next() {
        if (t)
          return this.return();
        if (n._tag === "Nil")
          return t = !0, this.return();
        const i = n.head;
        return n = n.tail, {
          done: t,
          value: i
        };
      },
      return(i) {
        return t || (t = !0), {
          done: !0,
          value: i
        };
      }
    };
  },
  pipe() {
    return V(this, arguments);
  }
}, eo = (t, n) => {
  const i = Object.create(H0);
  return i.head = t, i.tail = n, i;
}, j0 = /* @__PURE__ */ Ot("Nil"), U0 = {
  [Tr]: Tr,
  _tag: "Nil",
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [Ct]() {
    return this.toJSON();
  },
  [et]() {
    return j0;
  },
  [Y](t) {
    return Rm(t) && this._tag === t._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: !0,
          value: void 0
        };
      }
    };
  },
  pipe() {
    return V(this, arguments);
  }
}, Nm = /* @__PURE__ */ Object.create(U0), Rm = (t) => Q(t, Tr), Qe = (t) => t._tag === "Nil", W0 = (t) => t._tag === "Cons", V0 = () => Nm, Fn = (t, n) => eo(t, n), wi = V0, du = (t) => eo(t, Nm), q0 = /* @__PURE__ */ v(2, (t, n) => G0(n, t)), K0 = /* @__PURE__ */ v(2, (t, n) => Fn(n, t)), G0 = /* @__PURE__ */ v(2, (t, n) => {
  if (Qe(t))
    return n;
  if (Qe(n))
    return t;
  {
    const i = eo(n.head, t);
    let s = i, a = n.tail;
    for (; !Qe(a); ) {
      const u = eo(a.head, t);
      s.tail = u, s = u, a = a.tail;
    }
    return i;
  }
}), J0 = /* @__PURE__ */ v(3, (t, n, i) => {
  let s = n, a = t;
  for (; !Qe(a); )
    s = i(s, a.head), a = a.tail;
  return s;
}), Y0 = (t) => {
  let n = wi(), i = t;
  for (; !Qe(i); )
    n = K0(n, i.head), i = i.tail;
  return n;
}, mu = /* @__PURE__ */ function() {
  function t(n) {
    n && Object.assign(this, n);
  }
  return t.prototype = qc, t;
}(), X0 = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function Sh(t) {
  return t;
}
const Zr = {
  ...mu.prototype,
  [X0]: {
    _Value: Sh,
    _Patch: Sh
  }
}, Q0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Zr), {
  _tag: "Empty"
}), tw = /* @__PURE__ */ Object.create(Q0), Am = () => tw, ew = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Zr), {
  _tag: "AndThen"
}), nw = (t, n) => {
  const i = Object.create(ew);
  return i.first = t, i.second = n, i;
}, iw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Zr), {
  _tag: "AddService"
}), rw = (t, n) => {
  const i = Object.create(iw);
  return i.key = t, i.service = n, i;
}, sw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Zr), {
  _tag: "RemoveService"
}), ow = (t) => {
  const n = Object.create(sw);
  return n.key = t, n;
}, aw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Zr), {
  _tag: "UpdateService"
}), cw = (t, n) => {
  const i = Object.create(aw);
  return i.key = t, i.update = n, i;
}, uw = (t, n) => {
  const i = new Map(t.unsafeMap);
  let s = Am();
  for (const [a, u] of n.unsafeMap.entries())
    if (i.has(a)) {
      const h = i.get(a);
      i.delete(a), X(h, u) || (s = Fs(cw(a, () => u))(s));
    } else
      i.delete(a), s = Fs(rw(a, u))(s);
  for (const [a] of i.entries())
    s = Fs(ow(a))(s);
  return s;
}, Fs = /* @__PURE__ */ v(2, (t, n) => nw(t, n)), lw = /* @__PURE__ */ v(2, (t, n) => {
  if (t._tag === "Empty")
    return n;
  let i = !1, s = se(t);
  const a = new Map(n.unsafeMap);
  for (; nn(s); ) {
    const h = $e(s), d = Ye(s);
    switch (h._tag) {
      case "Empty": {
        s = d;
        break;
      }
      case "AddService": {
        a.set(h.key, h.service), s = d;
        break;
      }
      case "AndThen": {
        s = Se(Se(d, h.second), h.first);
        break;
      }
      case "RemoveService": {
        a.delete(h.key), s = d;
        break;
      }
      case "UpdateService": {
        a.set(h.key, h.update(a.get(h.key))), i = !0, s = d;
        break;
      }
    }
  }
  if (!i)
    return _i(a);
  const u = /* @__PURE__ */ new Map();
  for (const [h] of n.unsafeMap)
    a.has(h) && (u.set(h, a.get(h)), a.delete(h));
  for (const [h, d] of a)
    u.set(h, d);
  return _i(u);
}), hw = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function Na(t) {
  return t;
}
const Ro = {
  ...mu.prototype,
  [hw]: {
    _Value: Na,
    _Key: Na,
    _Patch: Na
  }
}, fw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ro), {
  _tag: "Empty"
}), dw = /* @__PURE__ */ Object.create(fw), Fm = () => dw, mw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ro), {
  _tag: "AndThen"
}), _w = (t, n) => {
  const i = Object.create(mw);
  return i.first = t, i.second = n, i;
}, pw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ro), {
  _tag: "Add"
}), gw = (t) => {
  const n = Object.create(pw);
  return n.value = t, n;
}, vw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ro), {
  _tag: "Remove"
}), yw = (t) => {
  const n = Object.create(vw);
  return n.value = t, n;
}, bw = (t, n) => {
  const [i, s] = Qs([t, Fm()], ([a, u], h) => M0(h)(a) ? [xm(h)(a), u] : [a, ac(gw(h))(u)])(n);
  return Qs(s, (a, u) => ac(yw(u))(a))(i);
}, ac = /* @__PURE__ */ v(2, (t, n) => _w(t, n)), ww = /* @__PURE__ */ v(2, (t, n) => {
  if (t._tag === "Empty")
    return n;
  let i = n, s = se(t);
  for (; nn(s); ) {
    const a = $e(s), u = Ye(s);
    switch (a._tag) {
      case "Empty": {
        s = u;
        break;
      }
      case "AndThen": {
        s = Se(a.first)(Se(a.second)(u));
        break;
      }
      case "Add": {
        i = mr(a.value)(i), s = u;
        break;
      }
      case "Remove":
        i = xm(a.value)(i), s = u;
    }
  }
  return i;
}), Sw = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function Th(t) {
  return t;
}
const Hr = {
  ...mu.prototype,
  [Sw]: {
    _Value: Th,
    _Patch: Th
  }
}, Tw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Hr), {
  _tag: "Empty"
}), Pw = /* @__PURE__ */ Object.create(Tw), zm = () => Pw, xw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Hr), {
  _tag: "AndThen"
}), Ew = (t, n) => {
  const i = Object.create(xw);
  return i.first = t, i.second = n, i;
}, Mw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Hr), {
  _tag: "Append"
}), kw = (t) => {
  const n = Object.create(Mw);
  return n.values = t, n;
}, Lw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Hr), {
  _tag: "Slice"
}), Cw = (t, n) => {
  const i = Object.create(Lw);
  return i.from = t, i.until = n, i;
}, Iw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Hr), {
  _tag: "Update"
}), Ow = (t, n) => {
  const i = Object.create(Iw);
  return i.index = t, i.patch = n, i;
}, Nw = (t) => {
  let n = 0, i = zm();
  for (; n < t.oldValue.length && n < t.newValue.length; ) {
    const s = t.oldValue[n], a = t.newValue[n], u = t.differ.diff(s, a);
    X(u, t.differ.empty) || (i = zs(i, Ow(n, u))), n = n + 1;
  }
  return n < t.oldValue.length && (i = zs(i, Cw(0, n))), n < t.newValue.length && (i = zs(i, kw(Zy(n)(t.newValue)))), i;
}, zs = /* @__PURE__ */ v(2, (t, n) => Ew(t, n)), Rw = /* @__PURE__ */ v(3, (t, n, i) => {
  if (t._tag === "Empty")
    return n;
  let s = n.slice(), a = Me(t);
  for (; Ay(a); ) {
    const u = re(a), h = di(a);
    switch (u._tag) {
      case "Empty": {
        a = h;
        break;
      }
      case "AndThen": {
        h.unshift(u.first, u.second), a = h;
        break;
      }
      case "Append": {
        for (const d of u.values)
          s.push(d);
        a = h;
        break;
      }
      case "Slice": {
        s = s.slice(u.from, u.until), a = h;
        break;
      }
      case "Update": {
        s[u.index] = i.patch(u.patch, s[u.index]), a = h;
        break;
      }
    }
  }
  return s;
}), Aw = /* @__PURE__ */ Symbol.for("effect/Differ"), Fw = {
  [Aw]: {
    _P: yt,
    _V: yt
  },
  pipe() {
    return V(this, arguments);
  }
}, Ci = (t) => {
  const n = Object.create(Fw);
  return n.empty = t.empty, n.diff = t.diff, n.combine = t.combine, n.patch = t.patch, n;
}, zw = () => Ci({
  empty: Am(),
  combine: (t, n) => Fs(n)(t),
  diff: (t, n) => uw(t, n),
  patch: (t, n) => lw(n)(t)
}), $w = () => Ci({
  empty: Fm(),
  combine: (t, n) => ac(n)(t),
  diff: (t, n) => bw(t, n),
  patch: (t, n) => ww(n)(t)
}), Bw = (t) => Ci({
  empty: zm(),
  combine: (n, i) => zs(n, i),
  diff: (n, i) => Nw({
    oldValue: n,
    newValue: i,
    differ: t
  }),
  patch: (n, i) => Rw(n, i, t)
}), $m = () => Dw((t, n) => n), Dw = (t) => Ci({
  empty: yt,
  combine: (n, i) => n === yt ? i : i === yt ? n : (s) => i(n(s)),
  diff: (n, i) => X(n, i) ? yt : bo(i),
  patch: (n, i) => t(i, n(i))
}), Pr = 255, Bm = 8, cc = (t) => t & Pr, uc = (t) => t >> Bm & Pr, jr = (t, n) => (t & Pr) + ((n & t & Pr) << Bm), Zw = /* @__PURE__ */ jr(0, 0), Hw = (t) => jr(t, t), jw = (t) => jr(t, 0), Uw = /* @__PURE__ */ v(2, (t, n) => jr(cc(t) & ~n, uc(t))), Ww = /* @__PURE__ */ v(2, (t, n) => t | n), Vw = (t) => ~t >>> 0 & Pr, qw = 0, Ii = 1, Kw = 2, Dm = 4, lc = 16, Zm = 32, Gw = (t) => Ao(t, Zm), Jw = /* @__PURE__ */ v(2, (t, n) => t | n), un = (t) => Hm(t) && !Xw(t), Hm = (t) => Ao(t, Ii), Ao = /* @__PURE__ */ v(2, (t, n) => (t & n) !== 0), jm = (...t) => t.reduce((n, i) => n | i, 0), Yw = /* @__PURE__ */ jm(qw), Ph = (t) => Ao(t, Dm), Xw = (t) => Ao(t, lc), $s = /* @__PURE__ */ v(2, (t, n) => jr(t ^ n, n)), Bs = /* @__PURE__ */ v(2, (t, n) => t & (Vw(cc(n)) | uc(n)) | cc(n) & uc(n)), xh = /* @__PURE__ */ Ci({
  empty: Zw,
  diff: (t, n) => $s(t, n),
  combine: (t, n) => Ww(n)(t),
  patch: (t, n) => Bs(n, t)
}), Qw = Hw, Um = jw, Eh = Uw, Wm = (t, n) => ({
  _tag: "Par",
  left: t,
  right: n
}), Es = (t, n) => ({
  _tag: "Seq",
  left: t,
  right: n
}), tS = (t) => {
  let n = du(t), i = wi();
  for (; ; ) {
    const [s, a] = J0(n, [Vm(), wi()], ([u, h], d) => {
      const [m, g] = eS(d);
      return [oS(u, m), q0(h, g)];
    });
    if (i = nS(i, s), Qe(a))
      return Y0(i);
    n = a;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
}, eS = (t) => {
  let n = t, i = Vm(), s = wi(), a = wi();
  for (; ; )
    switch (n._tag) {
      case "Empty": {
        if (Qe(s))
          return [i, a];
        n = s.head, s = s.tail;
        break;
      }
      case "Par": {
        s = Fn(n.right, s), n = n.left;
        break;
      }
      case "Seq": {
        const u = n.left, h = n.right;
        switch (u._tag) {
          case "Empty": {
            n = h;
            break;
          }
          case "Par": {
            const d = u.left, m = u.right;
            n = Wm(Es(d, h), Es(m, h));
            break;
          }
          case "Seq": {
            const d = u.left, m = u.right;
            n = Es(d, Es(m, h));
            break;
          }
          case "Single": {
            n = u, a = Fn(h, a);
            break;
          }
        }
        break;
      }
      case "Single": {
        if (i = sS(i, n), Qe(s))
          return [i, a];
        n = s.head, s = s.tail;
        break;
      }
    }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
}, nS = (t, n) => {
  if (Qe(t))
    return du(Ra(n));
  if (aS(n))
    return t;
  const i = dS(t.head), s = cS(n);
  return i.length === 1 && s.length === 1 && X(i[0], s[0]) ? Fn(fS(t.head, Ra(n)), t.tail) : Fn(Ra(n), t);
}, iS = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel"), rS = {
  /* c8 ignore next */
  _R: (t) => t
};
var Mf;
Mf = iS;
class _u {
  constructor(n) {
    _(this, "map");
    _(this, Mf, rS);
    this.map = n;
  }
}
const Vm = () => new _u(fu()), sS = (t, n) => new _u($0(t.map, n.dataSource, (i) => Ty(Py(i, Pb(n.blockedRequest)), () => se(n.blockedRequest)))), oS = (t, n) => new _u(Om(t.map, n.map, (i, s, a) => Cm(i, a, mn(Lm(i, a), {
  onNone: () => s,
  onSome: (u) => ke(s, u)
})))), aS = (t) => z0(t.map), cS = (t) => Array.from(Im(t.map)), Ra = (t) => hS(B0(t.map, (n) => se(n))), uS = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential"), lS = {
  /* c8 ignore next */
  _R: (t) => t
};
var kf;
kf = uS;
class qm {
  constructor(n) {
    _(this, "map");
    _(this, kf, lS);
    this.map = n;
  }
}
const hS = (t) => new qm(t), fS = (t, n) => new qm(Om(n.map, t.map, (i, s, a) => Cm(i, a, mn(Lm(i, a), {
  onNone: () => De(),
  onSome: (u) => ke(u, s)
})))), dS = (t) => Array.from(Im(t.map)), mS = (t) => Array.from(t.map), Oi = "Die", zn = "Empty", Ni = "Fail", Ri = "Interrupt", Si = "Parallel", Ti = "Sequential", Km = "effect/Cause", Gm = /* @__PURE__ */ Symbol.for(Km), _S = {
  /* c8 ignore next */
  _E: (t) => t
}, Ai = {
  [Gm]: _S,
  [et]() {
    return T(B(Km), ut(B(MS(this))), Lt(this));
  },
  [Y](t) {
    return pS(t) && ES(this, t);
  },
  pipe() {
    return V(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: Ht(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: Ht(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: Ht(this.left),
          right: Ht(this.right)
        };
    }
  },
  toString() {
    return Ur(this);
  },
  [Ct]() {
    return this.toJSON();
  }
}, Pi = /* @__PURE__ */ (() => {
  const t = /* @__PURE__ */ Object.create(Ai);
  return t._tag = zn, t;
})(), xr = (t) => {
  const n = Object.create(Ai);
  return n._tag = Ni, n.error = t, n;
}, tn = (t) => {
  const n = Object.create(Ai);
  return n._tag = Oi, n.defect = t, n;
}, ln = (t) => {
  const n = Object.create(Ai);
  return n._tag = Ri, n.fiberId = t, n;
}, Fo = (t, n) => {
  const i = Object.create(Ai);
  return i._tag = Si, i.left = t, i.right = n, i;
}, we = (t, n) => {
  const i = Object.create(Ai);
  return i._tag = Ti, i.left = t, i.right = n, i;
}, pS = (t) => Q(t, Gm), gS = (t) => t._tag === zn, vS = (t) => t._tag === Oi, yS = (t) => t._tag === zn ? !0 : xi(t, !0, (n, i) => {
  switch (i._tag) {
    case zn:
      return st(n);
    case Oi:
    case Ni:
    case Ri:
      return st(!1);
    default:
      return U();
  }
}), Jm = (t) => Be(PS(t)), pu = (t) => vu(void 0, LS)(t), bS = (t) => On(xi(t, De(), (n, i) => i._tag === Ni ? st(T(n, Se(i.error))) : U())), wS = (t) => On(xi(t, De(), (n, i) => i._tag === Oi ? st(T(n, Se(i.defect))) : U())), SS = (t) => xi(t, An(), (n, i) => i._tag === Ri ? st(T(n, mr(i.fiberId))) : U()), TS = (t) => gu(t, (n) => n._tag === Ni ? st(n.error) : U()), Ym = (t) => {
  const n = TS(t);
  switch (n._tag) {
    case "None":
      return Je(t);
    case "Some":
      return fi(n.value);
  }
}, PS = (t) => gu(t, (n) => n._tag === Ri ? st(n.fiberId) : U()), Mh = (t) => Xm(t, {
  onEmpty: Pi,
  onFail: () => Pi,
  onDie: tn,
  onInterrupt: ln,
  onSequential: we,
  onParallel: Fo
}), xS = (t) => Xm(t, {
  onEmpty: Pi,
  onFail: tn,
  onDie: tn,
  onInterrupt: ln,
  onSequential: we,
  onParallel: Fo
}), ES = (t, n) => {
  let i = se(t), s = se(n);
  for (; nn(i) && nn(s); ) {
    const [a, u] = T($e(i), xi([An(), De()], ([m, g], w) => {
      const [y, x] = hc(w);
      return st([T(m, wr(y)), T(g, ke(x))]);
    })), [h, d] = T($e(s), xi([An(), De()], ([m, g], w) => {
      const [y, x] = hc(w);
      return st([T(m, wr(y)), T(g, ke(x))]);
    }));
    if (!X(a, h))
      return !1;
    i = u, s = d;
  }
  return !0;
}, MS = (t) => kS(se(t), De()), kS = (t, n) => {
  for (; ; ) {
    const [i, s] = T(t, Gd([An(), De()], ([u, h], d) => {
      const [m, g] = hc(d);
      return [T(u, wr(m)), T(h, ke(g))];
    })), a = Pm(i) > 0 ? T(n, Se(i)) : n;
    if (xb(s))
      return On(a);
    t = s, n = a;
  }
  throw new Error(To("Cause.flattenCauseLoop"));
}, gu = /* @__PURE__ */ v(2, (t, n) => {
  const i = [t];
  for (; i.length > 0; ) {
    const s = i.pop(), a = n(s);
    switch (a._tag) {
      case "None": {
        switch (s._tag) {
          case Ti:
          case Si: {
            i.push(s.right), i.push(s.left);
            break;
          }
        }
        break;
      }
      case "Some":
        return a;
    }
  }
  return U();
}), hc = (t) => {
  let n = t;
  const i = [];
  let s = An(), a = De();
  for (; n !== void 0; )
    switch (n._tag) {
      case zn: {
        if (i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case Ni: {
        if (s = mr(s, Ia(n._tag, n.error)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case Oi: {
        if (s = mr(s, Ia(n._tag, n.defect)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case Ri: {
        if (s = mr(s, Ia(n._tag, n.fiberId)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case Ti: {
        switch (n.left._tag) {
          case zn: {
            n = n.right;
            break;
          }
          case Ti: {
            n = we(n.left.left, we(n.left.right, n.right));
            break;
          }
          case Si: {
            n = Fo(we(n.left.left, n.right), we(n.left.right, n.right));
            break;
          }
          default: {
            a = Se(a, n.right), n = n.left;
            break;
          }
        }
        break;
      }
      case Si: {
        i.push(n.right), n = n.left;
        break;
      }
    }
  throw new Error(To("Cause.evaluateCauseLoop"));
}, LS = {
  emptyCase: uh,
  failCase: qa,
  dieCase: qa,
  interruptCase: uh,
  sequentialCase: (t, n, i) => n && i,
  parallelCase: (t, n, i) => n && i
}, kh = "SequentialCase", Lh = "ParallelCase", Xm = /* @__PURE__ */ v(2, (t, {
  onDie: n,
  onEmpty: i,
  onFail: s,
  onInterrupt: a,
  onParallel: u,
  onSequential: h
}) => vu(t, void 0, {
  emptyCase: () => i,
  failCase: (d, m) => s(m),
  dieCase: (d, m) => n(m),
  interruptCase: (d, m) => a(m),
  sequentialCase: (d, m, g) => h(m, g),
  parallelCase: (d, m, g) => u(m, g)
})), xi = /* @__PURE__ */ v(3, (t, n, i) => {
  let s = n, a = t;
  const u = [];
  for (; a !== void 0; ) {
    const h = i(s, a);
    switch (s = Be(h) ? h.value : s, a._tag) {
      case Ti: {
        u.push(a.right), a = a.left;
        break;
      }
      case Si: {
        u.push(a.right), a = a.left;
        break;
      }
      default: {
        a = void 0;
        break;
      }
    }
    a === void 0 && u.length > 0 && (a = u.pop());
  }
  return s;
}), vu = /* @__PURE__ */ v(3, (t, n, i) => {
  const s = [t], a = [];
  for (; s.length > 0; ) {
    const h = s.pop();
    switch (h._tag) {
      case zn: {
        a.push(Je(i.emptyCase(n)));
        break;
      }
      case Ni: {
        a.push(Je(i.failCase(n, h.error)));
        break;
      }
      case Oi: {
        a.push(Je(i.dieCase(n, h.defect)));
        break;
      }
      case Ri: {
        a.push(Je(i.interruptCase(n, h.fiberId)));
        break;
      }
      case Ti: {
        s.push(h.right), s.push(h.left), a.push(fi({
          _tag: kh
        }));
        break;
      }
      case Si: {
        s.push(h.right), s.push(h.left), a.push(fi({
          _tag: Lh
        }));
        break;
      }
    }
  }
  const u = [];
  for (; a.length > 0; ) {
    const h = a.pop();
    switch (h._tag) {
      case "Left": {
        switch (h.left._tag) {
          case kh: {
            const d = u.pop(), m = u.pop(), g = i.sequentialCase(n, d, m);
            u.push(g);
            break;
          }
          case Lh: {
            const d = u.pop(), m = u.pop(), g = i.parallelCase(n, d, m);
            u.push(g);
            break;
          }
        }
        break;
      }
      case "Right": {
        u.push(h.right);
        break;
      }
    }
  }
  if (u.length === 0)
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  return u.pop();
}), Ur = (t, n) => pu(t) ? "All fibers interrupted without errors." : t_(t).map(function(i) {
  return (n == null ? void 0 : n.renderErrorCause) !== !0 || i.cause === void 0 ? i.stack : `${i.stack} {
${Qm(i.cause, "  ")}
}`;
}).join(`
`), Qm = (t, n) => {
  const i = t.stack.split(`
`);
  let s = `${n}[cause]: ${i[0]}`;
  for (let a = 1, u = i.length; a < u; a++)
    s += `
${n}${i[a]}`;
  return t.cause && (s += ` {
${Qm(t.cause, `${n}  `)}
${n}}`), s;
};
class no extends globalThis.Error {
  constructor(i) {
    const s = typeof i == "object" && i !== null, a = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(CS(i), s && "cause" in i && typeof i.cause < "u" ? {
      cause: new no(i.cause)
    } : void 0);
    _(this, "span");
    this.message === "" && (this.message = "An error has occurred"), Error.stackTraceLimit = a, this.name = i instanceof Error ? i.name : "Error", s && (Ei in i && (this.span = i[Ei]), Object.keys(i).forEach((u) => {
      u in this || (this[u] = i[u]);
    })), this.stack = NS(`${this.name}: ${this.message}`, i instanceof Error && i.stack ? i.stack : "", this.span);
  }
}
const CS = (t) => {
  if (typeof t == "string")
    return t;
  if (typeof t == "object" && t !== null && t instanceof Error)
    return t.message;
  try {
    if (Q(t, "toString") && wo(t.toString) && t.toString !== Object.prototype.toString && t.toString !== globalThis.Array.prototype.toString)
      return t.toString();
  } catch {
  }
  return kd(t);
}, IS = /\((.*)\)/g, OS = /* @__PURE__ */ dt("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap()), NS = (t, n, i) => {
  const s = [t], a = n.startsWith(t) ? n.slice(t.length).split(`
`) : n.split(`
`);
  for (let u = 1; u < a.length; u++) {
    if (a[u].includes(" at new BaseEffectError") || a[u].includes(" at new YieldableError")) {
      u++;
      continue;
    }
    if (a[u].includes("Generator.next") || a[u].includes("effect_internal_function"))
      break;
    s.push(a[u].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
  }
  if (i) {
    let u = i, h = 0;
    for (; u && u._tag === "Span" && h < 10; ) {
      const d = OS.get(u);
      if (typeof d == "function") {
        const m = d();
        if (typeof m == "string") {
          const g = m.matchAll(IS);
          let w = !1;
          for (const [, y] of g)
            w = !0, s.push(`    at ${u.name} (${y})`);
          w || s.push(`    at ${u.name} (${m.replace(/^at /, "")})`);
        } else
          s.push(`    at ${u.name}`);
      } else
        s.push(`    at ${u.name}`);
      u = Sn(u.parent), h++;
    }
  }
  return s.join(`
`);
}, Ei = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation"), t_ = (t) => vu(t, void 0, {
  emptyCase: () => [],
  dieCase: (n, i) => [new no(i)],
  failCase: (n, i) => [new no(i)],
  interruptCase: () => [],
  parallelCase: (n, i, s) => [...i, ...s],
  sequentialCase: (n, i, s) => [...i, ...s]
}), zo = "Pending", e_ = "Done", RS = "effect/Deferred", AS = /* @__PURE__ */ Symbol.for(RS), FS = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, zS = (t) => ({
  _tag: zo,
  joiners: t
}), $S = (t) => ({
  _tag: e_,
  effect: t
});
class Wr {
  constructor(n) {
    _(this, "self");
    _(this, "called", !1);
    this.self = n;
  }
  next(n) {
    return this.called ? {
      value: n,
      done: !0
    } : (this.called = !0, {
      value: this.self,
      done: !1
    });
  }
  return(n) {
    return {
      value: n,
      done: !0
    };
  }
  throw(n) {
    throw n;
  }
  [Symbol.iterator]() {
    return new Wr(this.self);
  }
}
const n_ = (t, n) => {
  const i = new jt("Blocked");
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}, BS = (t) => {
  const n = new jt("RunBlocked");
  return n.effect_instruction_i0 = t, n;
}, Mi = /* @__PURE__ */ Symbol.for("effect/Effect");
class DS {
  constructor(n, i) {
    _(this, "patch");
    _(this, "op");
    _(this, "_op", Wc);
    this.patch = n, this.op = i;
  }
}
var Lf;
class jt {
  constructor(n) {
    _(this, "_op");
    _(this, "effect_instruction_i0");
    _(this, "effect_instruction_i1");
    _(this, "effect_instruction_i2");
    _(this, "trace");
    _(this, Lf, hi);
    this._op = n;
  }
  [(Lf = Mi, Y)](n) {
    return this === n;
  }
  [et]() {
    return Lt(this, Zc(this));
  }
  pipe() {
    return V(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: Ht(this.effect_instruction_i0),
      effect_instruction_i1: Ht(this.effect_instruction_i1),
      effect_instruction_i2: Ht(this.effect_instruction_i2)
    };
  }
  toString() {
    return qt(this.toJSON());
  }
  [Ct]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Wr(new Ar(this));
  }
}
var Cf;
class i_ {
  constructor(n) {
    _(this, "_op");
    _(this, "effect_instruction_i0");
    _(this, "effect_instruction_i1");
    _(this, "effect_instruction_i2");
    _(this, "trace");
    _(this, Cf, hi);
    this._op = n, this._tag = n;
  }
  [(Cf = Mi, Y)](n) {
    return jo(n) && n._op === "Failure" && // @ts-expect-error
    X(this.effect_instruction_i0, n.effect_instruction_i0);
  }
  [et]() {
    return T(
      // @ts-expect-error
      Ot(this._tag),
      // @ts-expect-error
      ut(B(this.effect_instruction_i0)),
      Lt(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return V(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return qt(this.toJSON());
  }
  [Ct]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Wr(new Ar(this));
  }
}
var If;
class r_ {
  constructor(n) {
    _(this, "_op");
    _(this, "effect_instruction_i0");
    _(this, "effect_instruction_i1");
    _(this, "effect_instruction_i2");
    _(this, "trace");
    _(this, If, hi);
    this._op = n, this._tag = n;
  }
  [(If = Mi, Y)](n) {
    return jo(n) && n._op === "Success" && // @ts-expect-error
    X(this.effect_instruction_i0, n.effect_instruction_i0);
  }
  [et]() {
    return T(
      // @ts-expect-error
      Ot(this._tag),
      // @ts-expect-error
      ut(B(this.effect_instruction_i0)),
      Lt(this)
    );
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return V(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: Ht(this.value)
    };
  }
  toString() {
    return qt(this.toJSON());
  }
  [Ct]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Wr(new Ar(this));
  }
}
const yu = (t) => Q(t, Mi), ae = (t) => {
  const n = new jt(Id);
  return n.effect_instruction_i0 = t, n;
}, ZS = /* @__PURE__ */ v(3, (t, n, i) => Do((s) => F(t, (a) => F(a_(At(() => s(n(a)))), (u) => At(() => i(a, u)).pipe(Dn({
  onFailure: (h) => {
    switch (u._tag) {
      case he:
        return ce(we(u.effect_instruction_i0, h));
      case fe:
        return ce(h);
    }
  },
  onSuccess: () => u
})))))), $n = /* @__PURE__ */ v(2, (t, n) => F(t, () => tt(n))), Vr = (t) => $n(t, void 0), s_ = function() {
  const t = new jt(xo);
  switch (arguments.length) {
    case 2: {
      t.effect_instruction_i0 = arguments[0], t.commit = arguments[1];
      break;
    }
    case 3: {
      t.effect_instruction_i0 = arguments[0], t.effect_instruction_i1 = arguments[1], t.commit = arguments[2];
      break;
    }
    case 4: {
      t.effect_instruction_i0 = arguments[0], t.effect_instruction_i1 = arguments[1], t.effect_instruction_i2 = arguments[2], t.commit = arguments[3];
      break;
    }
    default:
      throw new Error(To("you're not supposed to end up here"));
  }
  return t;
}, io = (t, n = bi) => {
  const i = new jt(hr);
  let s;
  return i.effect_instruction_i0 = (a) => {
    s = t(a);
  }, i.effect_instruction_i1 = n, f_(i, (a) => yu(s) ? s : Ce);
}, HS = (t, n = bi) => At(() => io(t, n)), Bn = (t, n = bi) => s_(t, function() {
  let i, s;
  function a(m) {
    i ? i(m) : s === void 0 && (s = m);
  }
  const u = new jt(hr);
  u.effect_instruction_i0 = (m) => {
    i = m, s && m(s);
  }, u.effect_instruction_i1 = n;
  let h, d;
  return this.effect_instruction_i0.length !== 1 ? (d = new AbortController(), h = ee(() => this.effect_instruction_i0(a, d.signal))) : h = ee(() => this.effect_instruction_i0(a)), h || d ? f_(u, (m) => (d && d.abort(), h ?? Ce)) : u;
}), jS = /* @__PURE__ */ v(2, (t, n) => {
  const i = new jt(Ns);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}), Er = /* @__PURE__ */ v(2, (t, n) => qr(t, {
  onFailure: n,
  onSuccess: tt
})), Ch = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation"), o_ = (t, n) => Be(n) ? new Proxy(t, {
  has(i, s) {
    return s === Ei || s === Ch || s in i;
  },
  get(i, s) {
    return s === Ei ? n.value : s === Ch ? t : i[s];
  }
}) : t, ro = (t) => So(t) && !(Ei in t) ? ae((n) => ce(tn(o_(t, L_(n))))) : ce(tn(t)), US = (t) => WS(() => tn(new xT(t))), Mr = (t) => qr(t, {
  onFailure: (n) => tt(fi(n)),
  onSuccess: (n) => tt(Je(n))
}), a_ = (t) => KS(t, {
  onFailure: Tt,
  onSuccess: zt
}), Ft = (t) => So(t) && !(Ei in t) ? ae((n) => ce(xr(o_(t, L_(n))))) : ce(xr(t)), $o = (t) => F(Z(t), Ft), ce = (t) => {
  const n = new i_(he);
  return n.effect_instruction_i0 = t, n;
}, WS = (t) => F(Z(t), ce), VS = /* @__PURE__ */ ae((t) => tt(t.id())), c_ = (t) => ae((n) => t(n.id())), F = /* @__PURE__ */ v(2, (t, n) => {
  const i = new jt(Ws);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}), qS = (t) => {
  const n = new jt("OnStep");
  return n.effect_instruction_i0 = t, n;
}, u_ = (t) => F(t, yt), KS = /* @__PURE__ */ v(2, (t, n) => Dn(t, {
  onFailure: (i) => tt(n.onFailure(i)),
  onSuccess: (i) => tt(n.onSuccess(i))
})), Dn = /* @__PURE__ */ v(2, (t, n) => {
  const i = new jt(Vs);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n.onFailure, i.effect_instruction_i2 = n.onSuccess, i;
}), qr = /* @__PURE__ */ v(2, (t, n) => Dn(t, {
  onFailure: (i) => {
    if (wS(i).length > 0)
      return ce(xS(i));
    const a = bS(i);
    return a.length > 0 ? n.onFailure(um(a)) : ce(i);
  },
  onSuccess: n.onSuccess
})), hn = /* @__PURE__ */ v(2, (t, n) => At(() => {
  const i = Bt(t), s = Gc(i.length);
  let a = 0;
  return $n(Su({
    while: () => a < i.length,
    body: () => n(i[a], a),
    step: (u) => {
      s[a++] = u;
    }
  }), s);
})), Bo = /* @__PURE__ */ v(2, (t, n) => At(() => {
  const i = Bt(t);
  let s = 0;
  return Su({
    while: () => s < i.length,
    body: () => n(i[s], s),
    step: () => {
      s++;
    }
  });
})), l_ = (t) => {
  const n = new jt(zr);
  return n.effect_instruction_i0 = Qw(Ii), n.effect_instruction_i1 = () => t, n;
}, wt = /* @__PURE__ */ v(2, (t, n) => F(t, (i) => Z(() => n(i)))), h_ = /* @__PURE__ */ v(2, (t, n) => qr(t, {
  onFailure: (i) => $o(() => n.onFailure(i)),
  onSuccess: (i) => Z(() => n.onSuccess(i))
})), bu = /* @__PURE__ */ v(2, (t, n) => Dn(t, {
  onFailure: (i) => {
    const s = Ym(i);
    switch (s._tag) {
      case "Left":
        return $o(() => n(s.left));
      case "Right":
        return ce(s.right);
    }
  },
  onSuccess: tt
})), wu = /* @__PURE__ */ v(2, (t, n) => Do((i) => Dn(i(t), {
  onFailure: (s) => {
    const a = Tt(s);
    return Dn(n(a), {
      onFailure: (u) => Tt(we(s, u)),
      onSuccess: () => a
    });
  },
  onSuccess: (s) => {
    const a = zt(s);
    return Xe(n(a), a);
  }
}))), f_ = /* @__PURE__ */ v(2, (t, n) => wu(t, x_({
  onFailure: (i) => pu(i) ? Vr(n(SS(i))) : Ce,
  onSuccess: () => Ce
}))), GS = (t) => JS(t, yt), JS = /* @__PURE__ */ v(2, (t, n) => qr(t, {
  onFailure: (i) => ro(n(i)),
  onSuccess: tt
})), tt = (t) => {
  const n = new r_(fe);
  return n.effect_instruction_i0 = t, n;
}, At = (t) => {
  const n = new jt(xo);
  return n.commit = t, n;
}, Z = (t) => {
  const n = new jt(Cd);
  return n.effect_instruction_i0 = t, n;
}, d_ = /* @__PURE__ */ v((t) => t.length === 3 || t.length === 2 && !(So(t[1]) && "onlyEffect" in t[1]), (t, n) => F(t, (i) => {
  const s = typeof n == "function" ? n(i) : n;
  return yu(s) ? $n(s, i) : Bv(s) ? io((a) => {
    s.then((u) => a(tt(i)), (u) => a(Ft(new P_(u, "An unknown error occurred in Effect.tap"))));
  }) : tt(i);
})), YS = (t) => ae((n) => {
  const i = n.getFiberRef(dc), s = T(i, en(() => n.scope()));
  return t(Zo(dc, st(s)));
}), m_ = (t) => {
  const n = new jt(zr);
  return n.effect_instruction_i0 = Um(Ii), n.effect_instruction_i1 = () => t, n;
}, Do = (t) => s_(t, function() {
  const n = new jt(zr);
  return n.effect_instruction_i0 = Um(Ii), n.effect_instruction_i1 = (i) => Hm(i) ? ee(() => this.effect_instruction_i0(l_)) : ee(() => this.effect_instruction_i0(m_)), n;
}), Ce = /* @__PURE__ */ tt(void 0), XS = (t) => {
  const n = new jt(zr);
  return n.effect_instruction_i0 = t, n.effect_instruction_i1 = void 0, n;
}, Su = (t) => {
  const n = new jt(qs);
  return n.effect_instruction_i0 = t.while, n.effect_instruction_i1 = t.body, n.effect_instruction_i2 = t.step, n;
}, QS = (t) => At(() => {
  const n = new jt(fr);
  return n.effect_instruction_i0 = t(), n;
}), tT = function() {
  const t = arguments.length === 1 ? arguments[0] : arguments[1].bind(arguments[0]);
  return QS(() => t(T));
}, Tu = (t) => {
  const n = new jt(Rs);
  return typeof (t == null ? void 0 : t.priority) < "u" ? vT(n, t.priority) : n;
}, __ = /* @__PURE__ */ v(2, (t, n) => F(t, (i) => wt(n, (s) => [i, s]))), Pu = /* @__PURE__ */ v(2, (t, n) => F(t, (i) => $n(n, i))), Xe = /* @__PURE__ */ v(2, (t, n) => F(t, () => n)), eT = /* @__PURE__ */ v(3, (t, n, i) => F(t, (s) => wt(n, (a) => i(s, a)))), p_ = (t) => F(VS, (n) => T(t, g_(n))), g_ = /* @__PURE__ */ v(2, (t, n) => F(t.interruptAsFork(n), () => t.await)), nT = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return V(this, arguments);
  }
}, iT = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return V(this, arguments);
  }
}, rT = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return V(this, arguments);
  }
}, v_ = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return V(this, arguments);
  }
}, y_ = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return V(this, arguments);
  }
}, b_ = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return V(this, arguments);
  }
}, sT = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return V(this, arguments);
  }
}, oT = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return V(this, arguments);
  }
}, aT = "effect/FiberRef", cT = /* @__PURE__ */ Symbol.for(aT), uT = {
  /* c8 ignore next */
  _A: (t) => t
}, xu = (t) => ae((n) => zt(n.getFiberRef(t))), Eu = /* @__PURE__ */ v(2, (t, n) => F(xu(t), n)), Ih = /* @__PURE__ */ v(2, (t, n) => lT(t, () => [void 0, n])), lT = /* @__PURE__ */ v(2, (t, n) => ae((i) => {
  const [s, a] = n(i.getFiberRef(t));
  return i.setFiberRef(t, a), tt(s);
})), Zo = /* @__PURE__ */ v(3, (t, n, i) => ZS(Pu(xu(n), Ih(n, i)), () => t, (s) => Ih(n, s))), ue = (t, n) => Fi(t, {
  differ: $m(),
  fork: (n == null ? void 0 : n.fork) ?? yt,
  join: n == null ? void 0 : n.join
}), hT = (t) => {
  const n = $w();
  return Fi(t, {
    differ: n,
    fork: n.empty
  });
}, fT = (t) => {
  const n = Bw($m());
  return Fi(t, {
    differ: n,
    fork: n.empty
  });
}, w_ = (t) => {
  const n = zw();
  return Fi(t, {
    differ: n,
    fork: n.empty
  });
}, Fi = (t, n) => ({
  ...Br,
  [cT]: uT,
  initial: t,
  commit() {
    return xu(this);
  },
  diff: (s, a) => n.differ.diff(s, a),
  combine: (s, a) => n.differ.combine(s, a),
  patch: (s) => (a) => n.differ.patch(s, a),
  fork: n.fork,
  join: n.join ?? ((s, a) => a)
}), dT = (t) => Fi(t, {
  differ: xh,
  fork: xh.empty
}), Kr = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => w_(Xc())), Mu = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => ue(0)), mT = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => ue(2048)), _T = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => ue(fu())), pT = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => ue(y_)), gT = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => ue(wi())), vT = /* @__PURE__ */ v(2, (t, n) => Zo(t, Mu, n)), yT = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => ue("unbounded")), bT = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => ue(!0)), wT = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => ue(st(b_))), ST = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/versionMismatchErrorLogLevel"), () => ue(st(v_))), fc = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => fT(mi())), dc = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => ue(U(), {
  fork: () => U(),
  join: (t, n) => t
})), Ms = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => ue(Pi, {
  fork: () => Pi,
  join: (t, n) => t
})), TT = (t, n) => t.addFinalizer(() => Vr(n)), PT = (t, n) => t.close(n), Ho = (t, n) => t.fork(n), S_ = /* @__PURE__ */ function() {
  class t extends globalThis.Error {
    commit() {
      return Ft(this);
    }
    toJSON() {
      const i = {
        ...this
      };
      return this.message && (i.message = this.message), this.cause && (i.cause = this.cause), i;
    }
    [Ct]() {
      return this.toString !== globalThis.Error.prototype.toString ? this.stack ? `${this.toString()}
${this.stack.split(`
`).slice(1).join(`
`)}` : this.toString() : "Bun" in globalThis ? Ur(xr(this), {
        renderErrorCause: !0
      }) : this;
    }
  }
  return Object.assign(t.prototype, uy), t;
}(), T_ = (t, n) => {
  class i extends S_ {
    constructor() {
      super(...arguments);
      _(this, "_tag", n);
    }
  }
  return Object.assign(i.prototype, t), i.prototype.name = n, i;
}, Oh = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException"), xT = /* @__PURE__ */ T_({
  [Oh]: Oh
}, "RuntimeException"), ET = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException"), MT = (t) => Q(t, ET), Nh = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement"), ku = /* @__PURE__ */ T_({
  [Nh]: Nh
}, "NoSuchElementException"), Rh = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException"), P_ = /* @__PURE__ */ function() {
  class t extends S_ {
    constructor(s, a) {
      super(a ?? "An unknown error occurred", {
        cause: s
      });
      _(this, "_tag", "UnknownException");
      _(this, "error");
      this.error = s;
    }
  }
  return Object.assign(t.prototype, {
    [Rh]: Rh,
    name: "UnknownException"
  }), t;
}(), jo = (t) => yu(t) && "_tag" in t && (t._tag === "Success" || t._tag === "Failure"), kT = (t) => t._tag === "Success", LT = (t) => {
  switch (t._tag) {
    case he:
      return Jm(t.effect_instruction_i0);
    case fe:
      return !1;
  }
}, Ah = (t, n) => OT(t, n != null && n.parallel ? Fo : we), Fh = (t) => Tt(xr(t)), Tt = (t) => {
  const n = new i_(he);
  return n.effect_instruction_i0 = t, n;
}, CT = (t) => Tt(ln(t)), Aa = /* @__PURE__ */ v(2, (t, n) => {
  switch (t._tag) {
    case he:
      return Tt(t.effect_instruction_i0);
    case fe:
      return zt(n(t.effect_instruction_i0));
  }
}), x_ = /* @__PURE__ */ v(2, (t, {
  onFailure: n,
  onSuccess: i
}) => {
  switch (t._tag) {
    case he:
      return n(t.effect_instruction_i0);
    case fe:
      return i(t.effect_instruction_i0);
  }
}), zt = (t) => {
  const n = new r_(fe);
  return n.effect_instruction_i0 = t, n;
}, Pn = /* @__PURE__ */ zt(void 0), IT = /* @__PURE__ */ v(3, (t, n, {
  onFailure: i,
  onSuccess: s
}) => {
  switch (t._tag) {
    case he:
      switch (n._tag) {
        case fe:
          return Tt(t.effect_instruction_i0);
        case he:
          return Tt(i(t.effect_instruction_i0, n.effect_instruction_i0));
      }
    case fe:
      switch (n._tag) {
        case fe:
          return zt(s(t.effect_instruction_i0, n.effect_instruction_i0));
        case he:
          return Tt(n.effect_instruction_i0);
      }
  }
}), OT = (t, n) => {
  const i = am(t);
  return nn(i) ? T(Ye(i), Gd(T($e(i), Aa(se)), (s, a) => T(s, IT(a, {
    onSuccess: (u, h) => T(u, Se(h)),
    onFailure: n
  }))), Aa(On), Aa((s) => Mn(s)), st) : U();
}, NT = (t) => ({
  ...Br,
  [AS]: FS,
  state: uu(zS([])),
  commit() {
    return E_(this);
  },
  blockingOn: t
}), E_ = (t) => HS((n) => {
  const i = yi(t.state);
  switch (i._tag) {
    case e_:
      return n(i.effect);
    case zo:
      return i.joiners.push(n), RT(t, n);
  }
}, t.blockingOn), M_ = (t, n) => {
  const i = yi(t.state);
  if (i._tag === zo) {
    lu(t.state, $S(n));
    for (let s = 0, a = i.joiners.length; s < a; s++)
      i.joiners[s](n);
  }
}, RT = (t, n) => Z(() => {
  const i = yi(t.state);
  if (i._tag === zo) {
    const s = i.joiners.indexOf(n);
    s >= 0 && i.joiners.splice(s, 1);
  }
}), AT = /* @__PURE__ */ ae((t) => zt(t.currentContext)), FT = () => AT, zi = (t) => F(FT(), t), k_ = /* @__PURE__ */ v(2, (t, n) => Zo(Kr, n)(t)), zT = /* @__PURE__ */ v(2, (t, n) => zi((i) => k_(t, n(i)))), L_ = (t) => {
  const n = t.currentSpan;
  return n !== void 0 && n._tag === "Span" ? st(n) : U();
}, $T = kT, BT = LT, zh = /* @__PURE__ */ Symbol.for("effect/MutableHashMap"), DT = {
  [zh]: zh,
  [Symbol.iterator]() {
    return new Lu(this);
  },
  toString() {
    return qt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(Ht)
    };
  },
  [Ct]() {
    return this.toJSON();
  },
  pipe() {
    return V(this, arguments);
  }
};
class Lu {
  constructor(n) {
    _(this, "self");
    _(this, "referentialIterator");
    _(this, "bucketIterator");
    this.self = n, this.referentialIterator = n.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== void 0)
      return this.bucketIterator.next();
    const n = this.referentialIterator.next();
    return n.done ? (this.bucketIterator = new ZT(this.self.buckets.values()), this.next()) : n;
  }
  [Symbol.iterator]() {
    return new Lu(this.self);
  }
}
class ZT {
  constructor(n) {
    _(this, "backing");
    _(this, "currentBucket");
    this.backing = n;
  }
  next() {
    if (this.currentBucket === void 0) {
      const i = this.backing.next();
      if (i.done)
        return i;
      this.currentBucket = i.value[Symbol.iterator]();
    }
    const n = this.currentBucket.next();
    return n.done ? (this.currentBucket = void 0, this.next()) : n;
  }
}
const HT = () => {
  const t = Object.create(DT);
  return t.referential = /* @__PURE__ */ new Map(), t.buckets = /* @__PURE__ */ new Map(), t.bucketsSize = 0, t;
}, Tn = /* @__PURE__ */ v(2, (t, n) => {
  if (Us(n) === !1)
    return t.referential.has(n) ? st(t.referential.get(n)) : U();
  const i = n[et](), s = t.buckets.get(i);
  return s === void 0 ? U() : jT(t, s, n);
}), jT = (t, n, i, s = !1) => {
  for (let a = 0, u = n.length; a < u; a++)
    if (i[Y](n[a][0])) {
      const h = n[a][1];
      return s && (n.splice(a, 1), t.bucketsSize--), st(h);
    }
  return U();
}, ir = /* @__PURE__ */ v(2, (t, n) => Be(Tn(t, n))), rr = /* @__PURE__ */ v(3, (t, n, i) => {
  if (Us(n) === !1)
    return t.referential.set(n, i), t;
  const s = n[et](), a = t.buckets.get(s);
  return a === void 0 ? (t.buckets.set(s, [[n, i]]), t.bucketsSize++, t) : (UT(t, a, n), a.push([n, i]), t.bucketsSize++, t);
}), UT = (t, n, i) => {
  for (let s = 0, a = n.length; s < a; s++)
    if (i[Y](n[s][0])) {
      n.splice(s, 1), t.bucketsSize--;
      return;
    }
}, WT = "effect/Clock", $h = /* @__PURE__ */ Symbol.for(WT), Uo = /* @__PURE__ */ jn("effect/Clock"), VT = 2 ** 31 - 1, Bh = {
  unsafeSchedule(t, n) {
    const i = Ys(n);
    if (i > VT)
      return qa;
    let s = !1;
    const a = setTimeout(() => {
      s = !0, t();
    }, i);
    return () => (clearTimeout(a), !s);
  }
}, Dh = /* @__PURE__ */ function() {
  const t = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance > "u" || typeof performance.now != "function")
    return () => BigInt(Date.now()) * t;
  let n;
  return () => (n === void 0 && (n = BigInt(Date.now()) * t - BigInt(Math.round(performance.now() * 1e6))), n + BigInt(Math.round(performance.now() * 1e6)));
}(), qT = /* @__PURE__ */ function() {
  const t = typeof process == "object" && "hrtime" in process && typeof process.hrtime.bigint == "function" ? process.hrtime : void 0;
  if (!t)
    return Dh;
  const n = /* @__PURE__ */ Dh() - /* @__PURE__ */ t.bigint();
  return () => n + t.bigint();
}();
var Of;
Of = $h;
class KT {
  constructor() {
    _(this, Of, $h);
    _(this, "currentTimeMillis", /* @__PURE__ */ Z(() => this.unsafeCurrentTimeMillis()));
    _(this, "currentTimeNanos", /* @__PURE__ */ Z(() => this.unsafeCurrentTimeNanos()));
  }
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return qT();
  }
  scheduler() {
    return tt(Bh);
  }
  sleep(n) {
    return Bn((i) => {
      const s = Bh.unsafeSchedule(() => i(Ce), n);
      return Vr(Z(s));
    });
  }
}
const GT = () => new KT(), C_ = "And", I_ = "Or", O_ = "InvalidData", N_ = "MissingData", R_ = "SourceUnavailable", A_ = "Unsupported", JT = "effect/ConfigError", Zh = /* @__PURE__ */ Symbol.for(JT), $i = {
  _tag: "ConfigError",
  [Zh]: Zh
}, F_ = (t, n) => {
  const i = Object.create($i);
  return i._op = C_, i.left = t, i.right = n, Object.defineProperty(i, "toString", {
    enumerable: !1,
    value() {
      return `${this.left} and ${this.right}`;
    }
  }), Object.defineProperty(i, "message", {
    enumerable: !1,
    get() {
      return this.toString();
    }
  }), i;
}, z_ = (t, n) => {
  const i = Object.create($i);
  return i._op = I_, i.left = t, i.right = n, Object.defineProperty(i, "toString", {
    enumerable: !1,
    value() {
      return `${this.left} or ${this.right}`;
    }
  }), Object.defineProperty(i, "message", {
    enumerable: !1,
    get() {
      return this.toString();
    }
  }), i;
}, YT = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create($i);
  return s._op = O_, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Invalid data at ${T(this.path, Li(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, Zn = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create($i);
  return s._op = N_, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Missing data at ${T(this.path, Li(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, XT = (t, n, i, s = {
  pathDelim: "."
}) => {
  const a = Object.create($i);
  return a._op = R_, a.path = t, a.message = n, a.cause = i, Object.defineProperty(a, "toString", {
    enumerable: !1,
    value() {
      return `(Source unavailable at ${T(this.path, Li(s.pathDelim))}: "${this.message}")`;
    }
  }), a;
}, QT = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create($i);
  return s._op = A_, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Unsupported operation at ${T(this.path, Li(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, xn = /* @__PURE__ */ v(2, (t, n) => {
  switch (t._op) {
    case C_:
      return F_(xn(t.left, n), xn(t.right, n));
    case I_:
      return z_(xn(t.left, n), xn(t.right, n));
    case O_:
      return YT([...n, ...t.path], t.message);
    case N_:
      return Zn([...n, ...t.path], t.message);
    case R_:
      return XT([...n, ...t.path], t.message, t.cause);
    case A_:
      return QT([...n, ...t.path], t.message);
  }
}), tP = {
  _tag: "Empty"
}, Fa = /* @__PURE__ */ v(2, (t, n) => {
  let i = du(n), s = t;
  for (; W0(i); ) {
    const a = i.head;
    switch (a._tag) {
      case "Empty": {
        i = i.tail;
        break;
      }
      case "AndThen": {
        i = Fn(a.first, Fn(a.second, i.tail));
        break;
      }
      case "MapName": {
        s = ai(s, a.f), i = i.tail;
        break;
      }
      case "Nested": {
        s = Ks(s, a.name), i = i.tail;
        break;
      }
      case "Unnested": {
        if (T(dr(s), ky(a.name)))
          s = di(s), i = i.tail;
        else
          return fi(Zn(s, `Expected ${a.name} to be in path in ConfigProvider#unnested`));
        break;
      }
    }
  }
  return Je(s);
}), eP = "Constant", nP = "Fail", iP = "Fallback", rP = "Described", sP = "Lazy", oP = "MapOrFail", aP = "Nested", cP = "Primitive", uP = "Sequence", lP = "HashMap", hP = "ZipWith", so = (t, n) => [...t, ...n], fP = "effect/ConfigProvider", Hh = /* @__PURE__ */ Symbol.for(fP), dP = /* @__PURE__ */ jn("effect/ConfigProvider"), mP = "effect/ConfigProviderFlat", jh = /* @__PURE__ */ Symbol.for(mP), _P = (t) => ({
  [Hh]: Hh,
  pipe() {
    return V(this, arguments);
  },
  ...t
}), pP = (t) => ({
  [jh]: jh,
  patch: t.patch,
  load: (n, i, s = !0) => t.load(n, i, s),
  enumerateChildren: t.enumerateChildren
}), gP = (t) => _P({
  load: (n) => F(ye(t, mi(), n, !1), (i) => mn(dr(i), {
    onNone: () => Ft(Zn(mi(), `Expected a single value having structure: ${n}`)),
    onSome: tt
  })),
  flattened: t
}), vP = (t) => {
  const {
    pathDelim: n,
    seqDelim: i
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, t), s = (m) => T(m, Li(n)), a = (m) => m.split(n), u = () => typeof process < "u" && "env" in process && typeof process.env == "object" ? process.env : {};
  return gP(pP({
    load: (m, g, w = !0) => {
      const y = s(m), x = u(), E = y in x ? st(x[y]) : U();
      return T(E, bu(() => Zn(m, `Expected ${y} to exist in the process context`)), F((C) => TP(C, m, g, i, w)));
    },
    enumerateChildren: (m) => Z(() => {
      const g = u(), x = Object.keys(g).map((E) => a(E.toUpperCase())).filter((E) => {
        for (let C = 0; C < m.length; C++) {
          const I = T(m, qd(C)), D = E[C];
          if (D === void 0 || I !== D)
            return !1;
        }
        return !0;
      }).flatMap((E) => E.slice(m.length, m.length + 1));
      return E0(x);
    }),
    patch: tP
  }));
}, yP = (t, n, i, s) => {
  const a = dh(i.length, (m) => m >= s.length ? U() : st([t(m), m + 1])), u = dh(s.length, (m) => m >= i.length ? U() : st([n(m), m + 1])), h = so(i, a), d = so(s, u);
  return [h, d];
}, bP = (t, n) => {
  let i = n;
  if (i._tag === "Nested") {
    const s = t.slice();
    for (; i._tag === "Nested"; )
      s.push(i.name), i = i.config;
    return s;
  }
  return t;
}, ye = (t, n, i, s) => {
  const a = i;
  switch (a._tag) {
    case eP:
      return tt(Me(a.value));
    case rP:
      return At(() => ye(t, n, a.config, s));
    case nP:
      return Ft(Zn(n, a.message));
    case iP:
      return T(At(() => ye(t, n, a.first, s)), Er((u) => a.condition(u) ? T(ye(t, n, a.second, s), Er((h) => Ft(z_(u, h)))) : Ft(u)));
    case sP:
      return At(() => ye(t, n, a.config(), s));
    case oP:
      return At(() => T(ye(t, n, a.original, s), F(hn((u) => T(a.mapOrFail(u), bu(xn(bP(n, a.original))))))));
    case aP:
      return At(() => ye(t, so(n, Me(a.name)), a.config, s));
    case cP:
      return T(Fa(n, t.patch), F((u) => T(t.load(u, a, s), F((h) => {
        if (h.length === 0) {
          const d = T($y(u), en(() => "<n/a>"));
          return Ft(Zn([], `Expected ${a.description} with name ${d}`));
        }
        return tt(h);
      }))));
    case uP:
      return T(Fa(n, t.patch), F((u) => T(t.enumerateChildren(u), F(xP), F((h) => h.length === 0 ? At(() => wt(ye(t, n, a.config, !0), Me)) : T(hn(h, (d) => ye(t, Oy(n, `[${d}]`), a.config, !0)), wt((d) => {
        const m = Gy(d);
        return m.length === 0 ? Me(mi()) : Me(m);
      }))))));
    case lP:
      return At(() => T(Fa(n, t.patch), F((u) => T(t.enumerateChildren(u), F((h) => T(h, hn((d) => ye(t, so(u, Me(d)), a.valueConfig, s)), wt((d) => d.length === 0 ? Me(fu()) : T(PP(d), ai((m) => F0(fh(Bt(h), m)))))))))));
    case hP:
      return At(() => T(ye(t, n, a.left, s), Mr, F((u) => T(ye(t, n, a.right, s), Mr, F((h) => {
        if (lr(u) && lr(h))
          return Ft(F_(u.left, h.left));
        if (lr(u) && Ps(h))
          return Ft(u.left);
        if (Ps(u) && lr(h))
          return Ft(h.left);
        if (Ps(u) && Ps(h)) {
          const d = T(n, Li(".")), m = wP(n, d), [g, w] = yP(m, m, T(u.right, ai(Je)), T(h.right, ai(Je)));
          return T(g, fh(w), hn(([y, x]) => T(__(y, x), wt(([E, C]) => a.zip(E, C)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
  }
}, wP = (t, n) => (i) => fi(Zn(t, `The element at index ${i} in a sequence at path "${n}" was missing`)), SP = (t, n) => t.split(new RegExp(`\\s*${Yy(n)}\\s*`)), TP = (t, n, i, s, a) => a ? T(SP(t, s), hn((u) => i.parse(u.trim())), bu(xn(n))) : T(i.parse(t), h_({
  onFailure: xn(n),
  onSuccess: Me
})), PP = (t) => Object.keys(t[0]).map((n) => t.map((i) => i[n])), xP = (t) => T(hn(t, MP), h_({
  onFailure: () => mi(),
  onSuccess: Gs(vr)
}), Mr, wt(yy)), EP = /^(\[(\d+)\])$/, MP = (t) => {
  const n = t.match(EP);
  if (n !== null) {
    const i = n[2];
    return T(i !== void 0 && i.length > 0 ? st(i) : U(), xy(kP));
  }
  return U();
}, kP = (t) => {
  const n = Number.parseInt(t);
  return Number.isNaN(n) ? U() : st(n);
}, Uh = /* @__PURE__ */ Symbol.for("effect/Console"), $_ = /* @__PURE__ */ jn("effect/Console"), LP = {
  [Uh]: Uh,
  assert(t, ...n) {
    return Z(() => {
      console.assert(t, ...n);
    });
  },
  clear: /* @__PURE__ */ Z(() => {
    console.clear();
  }),
  count(t) {
    return Z(() => {
      console.count(t);
    });
  },
  countReset(t) {
    return Z(() => {
      console.countReset(t);
    });
  },
  debug(...t) {
    return Z(() => {
      console.debug(...t);
    });
  },
  dir(t, n) {
    return Z(() => {
      console.dir(t, n);
    });
  },
  dirxml(...t) {
    return Z(() => {
      console.dirxml(...t);
    });
  },
  error(...t) {
    return Z(() => {
      console.error(...t);
    });
  },
  group(t) {
    return t != null && t.collapsed ? Z(() => console.groupCollapsed(t == null ? void 0 : t.label)) : Z(() => console.group(t == null ? void 0 : t.label));
  },
  groupEnd: /* @__PURE__ */ Z(() => {
    console.groupEnd();
  }),
  info(...t) {
    return Z(() => {
      console.info(...t);
    });
  },
  log(...t) {
    return Z(() => {
      console.log(...t);
    });
  },
  table(t, n) {
    return Z(() => {
      console.table(t, n);
    });
  },
  time(t) {
    return Z(() => console.time(t));
  },
  timeEnd(t) {
    return Z(() => console.timeEnd(t));
  },
  timeLog(t, ...n) {
    return Z(() => {
      console.timeLog(t, ...n);
    });
  },
  trace(...t) {
    return Z(() => {
      console.trace(...t);
    });
  },
  warn(...t) {
    return Z(() => {
      console.warn(...t);
    });
  },
  unsafe: console
}, CP = "effect/Random", Wh = /* @__PURE__ */ Symbol.for(CP), IP = /* @__PURE__ */ jn("effect/Random");
var Nf;
Nf = Wh;
class OP {
  constructor(n) {
    _(this, "seed");
    _(this, Nf, Wh);
    _(this, "PRNG");
    this.seed = n, this.PRNG = new Vv(n);
  }
  get next() {
    return Z(() => this.PRNG.number());
  }
  get nextBoolean() {
    return wt(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return Z(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(n, i) {
    return wt(this.next, (s) => (i - n) * s + n);
  }
  nextIntBetween(n, i) {
    return Z(() => this.PRNG.integer(i - n) + n);
  }
  shuffle(n) {
    return NP(n, (i) => this.nextIntBetween(0, i));
  }
}
const NP = (t, n) => At(() => T(Z(() => Array.from(t)), F((i) => {
  const s = [];
  for (let a = i.length; a >= 2; a = a - 1)
    s.push(a);
  return T(s, Bo((a) => T(n(a), wt((u) => RP(i, a - 1, u)))), $n(am(i)));
}))), RP = (t, n, i) => {
  const s = t[n];
  return t[n] = t[i], t[i] = s, t;
}, AP = (t) => new OP(B(t)), Vh = /* @__PURE__ */ Symbol.for("effect/Tracer"), FP = (t) => ({
  [Vh]: Vh,
  ...t
}), B_ = /* @__PURE__ */ jn("effect/Tracer"), D_ = /* @__PURE__ */ jn("effect/ParentSpan"), qh = /* @__PURE__ */ function() {
  const t = "abcdef0123456789", n = t.length;
  return function(i) {
    let s = "";
    for (let a = 0; a < i; a++)
      s += t.charAt(Math.floor(Math.random() * n));
    return s;
  };
}();
class zP {
  constructor(n, i, s, a, u, h) {
    _(this, "name");
    _(this, "parent");
    _(this, "context");
    _(this, "startTime");
    _(this, "kind");
    _(this, "_tag", "Span");
    _(this, "spanId");
    _(this, "traceId", "native");
    _(this, "sampled", !0);
    _(this, "status");
    _(this, "attributes");
    _(this, "events", []);
    _(this, "links");
    this.name = n, this.parent = i, this.context = s, this.startTime = u, this.kind = h, this.status = {
      _tag: "Started",
      startTime: u
    }, this.attributes = /* @__PURE__ */ new Map(), this.traceId = i._tag === "Some" ? i.value.traceId : qh(32), this.spanId = qh(16), this.links = Array.from(a);
  }
  end(n, i) {
    this.status = {
      _tag: "Ended",
      endTime: n,
      exit: i,
      startTime: this.status.startTime
    };
  }
  attribute(n, i) {
    this.attributes.set(n, i);
  }
  event(n, i, s) {
    this.events.push([n, i, s ?? {}]);
  }
  addLinks(n) {
    this.links.push(...n);
  }
}
const $P = /* @__PURE__ */ FP({
  span: (t, n, i, s, a, u) => new zP(t, n, i, s, a, u),
  context: (t) => t()
}), BP = /* @__PURE__ */ T(/* @__PURE__ */ Xc(), /* @__PURE__ */ ri(Uo, /* @__PURE__ */ GT()), /* @__PURE__ */ ri($_, LP), /* @__PURE__ */ ri(IP, /* @__PURE__ */ AP(/* @__PURE__ */ Math.random())), /* @__PURE__ */ ri(dP, /* @__PURE__ */ vP()), /* @__PURE__ */ ri(B_, $P)), oo = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => w_(BP)), DP = (t) => {
  const n = me(t);
  return Z_((i) => i.sleep(n));
}, ZP = (t) => ae((n) => t(n.currentDefaultServices)), Z_ = (t) => ZP((n) => t(n.unsafeMap.get(Uo.key))), HP = /* @__PURE__ */ Z_((t) => t.currentTimeMillis), jP = DP, UP = HP;
function WP(t) {
  return new dn(t);
}
function VP() {
  return WP(/* @__PURE__ */ new Map());
}
const Kh = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var Rf;
Rf = Kh;
class dn {
  constructor(n) {
    _(this, "locals");
    _(this, Rf, Kh);
    this.locals = n;
  }
  pipe() {
    return V(this, arguments);
  }
}
const qP = (t, n, i, s = !1) => {
  const a = t;
  let u = n, h = i, d = s, m;
  for (; m === void 0; )
    if (de(u) && de(h)) {
      const g = re(u)[0], w = di(u), y = re(h)[0], x = re(h)[1], E = di(h);
      g.startTimeMillis < y.startTimeMillis ? (h = E, d = !0) : g.startTimeMillis > y.startTimeMillis ? u = w : g.id < y.id ? (h = E, d = !0) : g.id > y.id ? u = w : m = [x, d];
    } else
      m = [a.initial, !0];
  return m;
}, KP = /* @__PURE__ */ v(3, (t, n, i) => {
  const s = new Map(t.locals);
  return i.locals.forEach((a, u) => {
    const h = a[0][1];
    if (!a[0][0][Y](n)) {
      if (!s.has(u)) {
        if (X(h, u.initial))
          return;
        s.set(u, [[n, u.join(u.initial, h)]]);
        return;
      }
      const d = s.get(u), [m, g] = qP(u, d, a);
      if (g) {
        const w = u.diff(m, h), y = d[0][1], x = u.join(y, u.patch(w)(y));
        if (!X(y, x)) {
          let E;
          const C = d[0][0];
          C[Y](n) ? E = [[C, x], ...d.slice(1)] : E = [[n, x], ...d], s.set(u, E);
        }
      }
    }
  }), new dn(s);
}), GP = /* @__PURE__ */ v(2, (t, n) => {
  const i = /* @__PURE__ */ new Map();
  return H_(t, i, n), new dn(i);
}), H_ = (t, n, i) => {
  t.locals.forEach((s, a) => {
    const u = s[0][1], h = a.patch(a.fork)(u);
    X(u, h) ? n.set(a, s) : n.set(a, [[i, h], ...s]);
  });
}, j_ = /* @__PURE__ */ v(2, (t, n) => {
  const i = new Map(t.locals);
  return i.delete(n), new dn(i);
}), JP = /* @__PURE__ */ v(2, (t, n) => t.locals.has(n) ? st(re(t.locals.get(n))[1]) : U()), kr = /* @__PURE__ */ v(2, (t, n) => T(JP(t, n), en(() => n.initial))), mc = /* @__PURE__ */ v(2, (t, {
  fiberId: n,
  fiberRef: i,
  value: s
}) => {
  if (t.locals.size === 0)
    return new dn(/* @__PURE__ */ new Map([[i, [[n, s]]]]));
  const a = new Map(t.locals);
  return _c(a, n, i, s), new dn(a);
}), _c = (t, n, i, s) => {
  const a = t.get(i) ?? [];
  let u;
  if (de(a)) {
    const [h, d] = re(a);
    if (h[Y](n)) {
      if (X(d, s))
        return;
      u = [[n, s], ...a.slice(1)];
    } else
      u = [[n, s], ...a];
  } else
    u = [[n, s]];
  t.set(i, u);
}, YP = /* @__PURE__ */ v(2, (t, {
  entries: n,
  forkAs: i
}) => {
  if (t.locals.size === 0)
    return new dn(new Map(n));
  const s = new Map(t.locals);
  return i !== void 0 && H_(t, s, i), n.forEach(([a, u]) => {
    u.length === 1 ? _c(s, u[0][0], a, u[0][1]) : u.forEach(([h, d]) => {
      _c(s, h, a, d);
    });
  }), new dn(s);
}), XP = kr, QP = YP, tx = VP, ex = nT, nx = iT, ix = rT, rx = v_, sx = y_, ox = b_, ax = sT, cx = oT, ux = /* @__PURE__ */ T(vr, /* @__PURE__ */ wy((t) => t.ordinal)), lx = /* @__PURE__ */ Sy(ux), hx = (t) => {
  switch (t) {
    case "All":
      return ex;
    case "Debug":
      return ox;
    case "Error":
      return ix;
    case "Fatal":
      return nx;
    case "Info":
      return sx;
    case "Trace":
      return ax;
    case "None":
      return cx;
    case "Warning":
      return rx;
  }
}, U_ = (t) => t.replace(/[\s="]/g, "_"), fx = (t) => (n) => `${U_(n.label)}=${t - n.startTime}ms`, dx = $r, mx = ly;
class W_ extends mx {
}
const Gh = /* @__PURE__ */ Symbol.for("effect/Readable"), _x = /* @__PURE__ */ Symbol.for("effect/Ref"), px = {
  /* c8 ignore next */
  _A: (t) => t
};
var Af, Ff, zf;
class gx extends (zf = W_, Ff = _x, Af = Gh, zf) {
  constructor(i) {
    super();
    _(this, "ref");
    _(this, Ff, px);
    _(this, Af, Gh);
    _(this, "get");
    this.ref = i, this.get = Z(() => yi(this.ref));
  }
  commit() {
    return this.get;
  }
  modify(i) {
    return Z(() => {
      const s = yi(this.ref), [a, u] = i(s);
      return s !== u && lu(u)(this.ref), a;
    });
  }
}
const V_ = (t) => new gx(uu(t)), vx = (t) => Z(() => V_(t)), _r = (t) => t.get, za = /* @__PURE__ */ v(2, (t, n) => t.modify(() => [void 0, n])), yx = /* @__PURE__ */ v(2, (t, n) => t.modify((i) => [void 0, n(i)])), q_ = "Empty", K_ = "Add", G_ = "Remove", J_ = "Update", Y_ = "AndThen", bx = {
  _tag: q_
}, wx = (t, n) => {
  const i = new Map(t.locals);
  let s = bx;
  for (const [a, u] of n.locals.entries()) {
    const h = re(u)[1], d = i.get(a);
    if (d !== void 0) {
      const m = re(d)[1];
      X(m, h) || (s = $a({
        _tag: J_,
        fiberRef: a,
        patch: a.diff(m, h)
      })(s));
    } else
      s = $a({
        _tag: K_,
        fiberRef: a,
        value: h
      })(s);
    i.delete(a);
  }
  for (const [a] of i.entries())
    s = $a({
      _tag: G_,
      fiberRef: a
    })(s);
  return s;
}, $a = /* @__PURE__ */ v(2, (t, n) => ({
  _tag: Y_,
  first: t,
  second: n
})), Sx = /* @__PURE__ */ v(3, (t, n, i) => {
  let s = i, a = Me(t);
  for (; de(a); ) {
    const u = re(a), h = di(a);
    switch (u._tag) {
      case q_: {
        a = h;
        break;
      }
      case K_: {
        s = mc(s, {
          fiberId: n,
          fiberRef: u.fiberRef,
          value: u.value
        }), a = h;
        break;
      }
      case G_: {
        s = j_(s, u.fiberRef), a = h;
        break;
      }
      case J_: {
        const d = kr(s, u.fiberRef);
        s = mc(s, {
          fiberId: n,
          fiberRef: u.fiberRef,
          value: u.fiberRef.patch(u.patch)(d)
        }), a = h;
        break;
      }
      case Y_: {
        a = Ks(u.first)(Ks(u.second)(h));
        break;
      }
    }
  }
  return s;
}), X_ = "effect/MetricLabel", pc = /* @__PURE__ */ Symbol.for(X_);
var $f;
class Tx {
  constructor(n, i) {
    _(this, "key");
    _(this, "value");
    _(this, $f, pc);
    _(this, "_hash");
    this.key = n, this.value = i, this._hash = Ot(X_ + this.key + this.value);
  }
  [($f = pc, et)]() {
    return this._hash;
  }
  [Y](n) {
    return xx(n) && this.key === n.key && this.value === n.value;
  }
  pipe() {
    return V(this, arguments);
  }
}
const Px = (t, n) => new Tx(t, n), xx = (t) => Q(t, pc), Ex = (t) => wt(t, (n) => !n), Jh = /* @__PURE__ */ v(3, (t, n, i) => zi((s) => F(i, (a) => k_(t, T(s, ri(n, a)))))), Mx = jP, kx = /* @__PURE__ */ v(2, (t, n) => Dn(t, {
  onFailure: (i) => {
    const s = Ym(i);
    switch (s._tag) {
      case "Left":
        return Xe(n(s.left), ce(i));
      case "Right":
        return ce(i);
    }
  },
  onSuccess: tt
})), Lx = (t) => {
  let n, i;
  typeof t == "function" ? n = t : (n = t.try, i = t.catch);
  const s = (a) => i ? $o(() => i(a)) : Ft(new P_(a, "An unknown error occurred in Effect.tryPromise"));
  return n.length >= 1 ? Bn((a, u) => {
    try {
      n(u).then((h) => a(tt(h)), (h) => a(s(h)));
    } catch (h) {
      a(s(h));
    }
  }) : Bn((a) => {
    try {
      n().then((u) => a(tt(u)), (u) => a(s(u)));
    } catch (u) {
      a(s(u));
    }
  });
}, Cx = "Sequential", Ix = "Parallel", Ox = "ParallelN", Q_ = {
  _tag: Cx
}, Nx = {
  _tag: Ix
}, Rx = (t) => ({
  _tag: Ox,
  parallelism: t
}), gc = Q_, vc = Nx, yc = Rx, Ax = wx, Fx = Sx, Wo = "effect/FiberStatus", Hn = /* @__PURE__ */ Symbol.for(Wo), ao = "Done", Yh = "Running", Xh = "Suspended", zx = /* @__PURE__ */ Ot(`${Wo}-${ao}`);
var Bf;
class $x {
  constructor() {
    _(this, Bf, Hn);
    _(this, "_tag", ao);
  }
  [(Bf = Hn, et)]() {
    return zx;
  }
  [Y](n) {
    return Cu(n) && n._tag === ao;
  }
}
var Df;
class Bx {
  constructor(n) {
    _(this, "runtimeFlags");
    _(this, Df, Hn);
    _(this, "_tag", Yh);
    this.runtimeFlags = n;
  }
  [(Df = Hn, et)]() {
    return T(B(Wo), ut(B(this._tag)), ut(B(this.runtimeFlags)), Lt(this));
  }
  [Y](n) {
    return Cu(n) && n._tag === Yh && this.runtimeFlags === n.runtimeFlags;
  }
}
var Zf;
class Dx {
  constructor(n, i) {
    _(this, "runtimeFlags");
    _(this, "blockingOn");
    _(this, Zf, Hn);
    _(this, "_tag", Xh);
    this.runtimeFlags = n, this.blockingOn = i;
  }
  [(Zf = Hn, et)]() {
    return T(B(Wo), ut(B(this._tag)), ut(B(this.runtimeFlags)), ut(B(this.blockingOn)), Lt(this));
  }
  [Y](n) {
    return Cu(n) && n._tag === Xh && this.runtimeFlags === n.runtimeFlags && X(this.blockingOn, n.blockingOn);
  }
}
const Zx = /* @__PURE__ */ new $x(), Hx = (t) => new Bx(t), jx = (t, n) => new Dx(t, n), Cu = (t) => Q(t, Hn), Ux = (t) => t._tag === ao, Wx = Zx, tp = Hx, Vx = jx, qx = Ux, Kx = /* @__PURE__ */ Symbol.for("effect/Micro"), co = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit"), Qh = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause"), Gx = {
  _E: yt
};
var Hf;
class ep extends globalThis.Error {
  constructor(i, s, a) {
    const u = `MicroCause.${i}`;
    let h, d, m;
    if (s instanceof globalThis.Error) {
      h = `(${u}) ${s.name}`, d = s.message;
      const g = d.split(`
`).length;
      m = s.stack ? `(${u}) ${s.stack.split(`
`).slice(0, g + 3).join(`
`)}` : `${h}: ${d}`;
    } else
      h = u, d = li(s, 0), m = `${h}: ${d}`;
    a.length > 0 && (m += `
    ${a.join(`
    `)}`);
    super(d);
    _(this, "_tag");
    _(this, "traces");
    _(this, Hf);
    this._tag = i, this.traces = a, this[Qh] = Gx, this.name = h, this.stack = m;
  }
  pipe() {
    return V(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [(Hf = Qh, Ct)]() {
    return this.stack;
  }
}
class Jx extends ep {
  constructor(i, s = []) {
    super("Die", i, s);
    _(this, "defect");
    this.defect = i;
  }
}
const Yx = (t, n = []) => new Jx(t, n);
class Xx extends ep {
  constructor(n = []) {
    super("Interrupt", "interrupted", n);
  }
}
const Qx = (t = []) => new Xx(t), tE = (t) => t._tag === "Interrupt", tf = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber"), eE = {
  _A: yt,
  _E: yt
};
var jf;
jf = tf;
class nE {
  constructor(n, i = !0) {
    _(this, "context");
    _(this, "interruptible");
    _(this, jf);
    _(this, "_stack", []);
    _(this, "_observers", []);
    _(this, "_exit");
    _(this, "_children");
    _(this, "currentOpCount", 0);
    _(this, "_interrupted", !1);
    // cancel the yielded operation, or for the yielded exit value
    _(this, "_yielded");
    this.context = n, this.interruptible = i, this[tf] = eE;
  }
  getRef(n) {
    return hb(this.context, n);
  }
  addObserver(n) {
    return this._exit ? (n(this._exit), Nv) : (this._observers.push(n), () => {
      const i = this._observers.indexOf(n);
      i >= 0 && this._observers.splice(i, 1);
    });
  }
  unsafeInterrupt() {
    this._exit || (this._interrupted = !0, this.interruptible && this.evaluate(Au));
  }
  unsafePoll() {
    return this._exit;
  }
  evaluate(n) {
    if (this._exit)
      return;
    if (this._yielded !== void 0) {
      const a = this._yielded;
      this._yielded = void 0, a();
    }
    const i = this.runLoop(n);
    if (i === ks)
      return;
    const s = ef.interruptChildren && ef.interruptChildren(this);
    if (s !== void 0)
      return this.evaluate(lo(s, () => i));
    this._exit = i;
    for (let a = 0; a < this._observers.length; a++)
      this._observers[a](i);
    this._observers.length = 0;
  }
  runLoop(n) {
    let i = !1, s = n;
    this.currentOpCount = 0;
    try {
      for (; ; ) {
        if (this.currentOpCount++, !i && this.getRef(Fu).shouldYield(this)) {
          i = !0;
          const a = s;
          s = lo(aE, () => a);
        }
        if (s = s[bc](this), s === ks) {
          const a = this._yielded;
          return co in a ? (this._yielded = void 0, a) : ks;
        }
      }
    } catch (a) {
      return Q(s, bc) ? wc(a) : wc(`MicroFiber.runLoop: Not a valid effect: ${String(s)}`);
    }
  }
  getCont(n) {
    for (; ; ) {
      const i = this._stack.pop();
      if (!i) return;
      const s = i[uo] && i[uo](this);
      if (s) return {
        [n]: s
      };
      if (i[n]) return i;
    }
  }
  yieldWith(n) {
    return this._yielded = n, ks;
  }
  children() {
    return this._children ?? (this._children = /* @__PURE__ */ new Set());
  }
}
const ef = /* @__PURE__ */ dt("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
})), np = /* @__PURE__ */ Symbol.for("effect/Micro/identifier"), Zt = /* @__PURE__ */ Symbol.for("effect/Micro/args"), bc = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate"), ki = /* @__PURE__ */ Symbol.for("effect/Micro/successCont"), ui = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont"), uo = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont"), ks = /* @__PURE__ */ Symbol.for("effect/Micro/Yield"), iE = {
  _A: yt,
  _E: yt,
  _R: yt
}, rE = {
  ...dx,
  _op: "Micro",
  [Kx]: iE,
  pipe() {
    return V(this, arguments);
  },
  [Symbol.iterator]() {
    return new Pd(new Ar(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[np],
      ...Zt in this ? {
        args: this[Zt]
      } : void 0
    };
  },
  toString() {
    return qt(this);
  },
  [Ct]() {
    return qt(this);
  }
};
function sE(t) {
  return wc("Micro.evaluate: Not implemented");
}
const Vo = (t) => ({
  ...rE,
  [np]: t.op,
  [bc]: t.eval ?? sE,
  [ki]: t.contA,
  [ui]: t.contE,
  [uo]: t.ensure
}), Iu = (t) => {
  const n = Vo(t);
  return function() {
    const i = Object.create(n);
    return i[Zt] = t.single === !1 ? arguments : arguments[0], i;
  };
}, ip = (t) => {
  const n = {
    ...Vo(t),
    [co]: co,
    _tag: t.op,
    get [t.prop]() {
      return this[Zt];
    },
    toJSON() {
      return {
        _id: "MicroExit",
        _tag: t.op,
        [t.prop]: this[Zt]
      };
    },
    [Y](i) {
      return lE(i) && i._tag === t.op && X(this[Zt], i[Zt]);
    },
    [et]() {
      return Lt(this, ut(Ot(t.op))(B(this[Zt])));
    }
  };
  return function(i) {
    const s = Object.create(n);
    return s[Zt] = i, s[ki] = void 0, s[ui] = void 0, s[uo] = void 0, s;
  };
}, Ou = /* @__PURE__ */ ip({
  op: "Success",
  prop: "value",
  eval(t) {
    const n = t.getCont(ki);
    return n ? n[ki](this[Zt], t) : t.yieldWith(this);
  }
}), rp = /* @__PURE__ */ ip({
  op: "Failure",
  prop: "cause",
  eval(t) {
    let n = t.getCont(ui);
    for (; tE(this[Zt]) && n && t.interruptible; )
      n = t.getCont(ui);
    return n ? n[ui](this[Zt], t) : t.yieldWith(this);
  }
}), oE = /* @__PURE__ */ Iu({
  op: "Yield",
  eval(t) {
    let n = !1;
    return t.getRef(Fu).scheduleTask(() => {
      n || t.evaluate(hE);
    }, this[Zt] ?? 0), t.yieldWith(() => {
      n = !0;
    });
  }
}), aE = /* @__PURE__ */ oE(0), cE = /* @__PURE__ */ Ou(void 0), Nu = /* @__PURE__ */ Iu({
  op: "WithMicroFiber",
  eval(t) {
    return this[Zt](t);
  }
}), lo = /* @__PURE__ */ v(2, (t, n) => {
  const i = Object.create(uE);
  return i[Zt] = t, i[ki] = n, i;
}), uE = /* @__PURE__ */ Vo({
  op: "OnSuccess",
  eval(t) {
    return t._stack.push(this), this[Zt];
  }
}), lE = (t) => Q(t, co), sp = Ou, Ru = rp, Au = /* @__PURE__ */ Ru(/* @__PURE__ */ Qx()), wc = (t) => Ru(Yx(t)), hE = /* @__PURE__ */ sp(void 0), fE = "setImmediate" in globalThis ? globalThis.setImmediate : (t) => setTimeout(t, 0);
class op {
  constructor() {
    _(this, "tasks", []);
    _(this, "running", !1);
    /**
     * @since 3.5.9
     */
    _(this, "afterScheduled", () => {
      this.running = !1, this.runTasks();
    });
  }
  /**
   * @since 3.5.9
   */
  scheduleTask(n, i) {
    this.tasks.push(n), this.running || (this.running = !0, fE(this.afterScheduled));
  }
  /**
   * @since 3.5.9
   */
  runTasks() {
    const n = this.tasks;
    this.tasks = [];
    for (let i = 0, s = n.length; i < s; i++)
      n[i]();
  }
  /**
   * @since 3.5.9
   */
  shouldYield(n) {
    return n.currentOpCount >= n.getRef(_E);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    for (; this.tasks.length > 0; )
      this.runTasks();
  }
}
const dE = /* @__PURE__ */ v(2, (t, n) => Nu((i) => {
  const s = i.context;
  return i.context = n(s), vE(t, () => (i.context = s, cE));
})), mE = /* @__PURE__ */ v(2, (t, n) => dE(t, im(n)));
class _E extends (/* @__PURE__ */ Qc()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: () => 2048
})) {
}
class Fu extends (/* @__PURE__ */ Qc()("effect/Micro/currentScheduler", {
  defaultValue: () => new op()
})) {
}
const pE = /* @__PURE__ */ v(2, (t, n) => {
  const i = Object.create(gE);
  return i[Zt] = t, i[ki] = n.onSuccess, i[ui] = n.onFailure, i;
}), gE = /* @__PURE__ */ Vo({
  op: "OnSuccessAndFailure",
  eval(t) {
    return t._stack.push(this), this[Zt];
  }
}), vE = /* @__PURE__ */ v(2, (t, n) => bE((i) => pE(i(t), {
  onFailure: (s) => lo(n(Ru(s)), () => rp(s)),
  onSuccess: (s) => lo(n(sp(s)), () => Ou(s))
}))), ap = /* @__PURE__ */ Iu({
  op: "SetInterruptible",
  ensure(t) {
    if (t.interruptible = this[Zt], t._interrupted && t.interruptible)
      return () => Au;
  }
}), yE = (t) => Nu((n) => n.interruptible ? t : (n.interruptible = !0, n._stack.push(ap(!1)), n._interrupted ? Au : t)), bE = (t) => Nu((n) => n.interruptible ? (n.interruptible = !1, n._stack.push(ap(!0)), t(yE)) : t(yt)), wE = (t, n) => {
  const i = new nE(Fu.context(new op()));
  return i.evaluate(t), i;
};
class SE {
  constructor() {
    /**
     * @since 2.0.0
     */
    _(this, "buckets", []);
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(n, i) {
    const s = this.buckets.length;
    let a, u = 0;
    for (; u < s && this.buckets[u][0] <= i; u++)
      a = this.buckets[u];
    a && a[0] === i ? a[1].push(n) : u === s ? this.buckets.push([i, [n]]) : this.buckets.splice(u, 0, [i, [n]]);
  }
}
class TE {
  constructor(n) {
    _(this, "maxNextTickBeforeTimer");
    /**
     * @since 2.0.0
     */
    _(this, "running", !1);
    /**
     * @since 2.0.0
     */
    _(this, "tasks", /* @__PURE__ */ new SE());
    this.maxNextTickBeforeTimer = n;
  }
  /**
   * @since 2.0.0
   */
  starveInternal(n) {
    const i = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [s, a] of i)
      for (let u = 0; u < a.length; u++)
        a[u]();
    this.tasks.buckets.length === 0 ? this.running = !1 : this.starve(n);
  }
  /**
   * @since 2.0.0
   */
  starve(n = 0) {
    n >= this.maxNextTickBeforeTimer ? setTimeout(() => this.starveInternal(0), 0) : Promise.resolve(void 0).then(() => this.starveInternal(n + 1));
  }
  /**
   * @since 2.0.0
   */
  shouldYield(n) {
    return n.currentOpCount > n.getFiberRef(mT) ? n.getFiberRef(Mu) : !1;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(n, i) {
    this.tasks.scheduleTask(n, i), this.running || (this.running = !0, this.starve());
  }
}
const PE = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new TE(2048)), cp = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => ue(PE)), up = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => ue(/* @__PURE__ */ new Map())), nf = (t, n, i, s) => {
  switch (t) {
    case void 0:
      return n();
    case "unbounded":
      return i();
    case "inherit":
      return Eu(yT, (a) => a === "unbounded" ? i() : a > 1 ? s(a) : n());
    default:
      return t > 1 ? s(t) : n();
  }
}, zu = "InterruptSignal", $u = "Stateful", Bu = "Resume", Du = "YieldNow", Ba = (t) => ({
  _tag: zu,
  cause: t
}), Ds = (t) => ({
  _tag: $u,
  onFiber: t
}), ni = (t) => ({
  _tag: Bu,
  effect: t
}), xE = () => ({
  _tag: Du
}), EE = "effect/FiberScope", ho = /* @__PURE__ */ Symbol.for(EE);
var Uf;
Uf = ho;
class ME {
  constructor() {
    _(this, Uf, ho);
    _(this, "fiberId", bi);
    _(this, "roots", /* @__PURE__ */ new Set());
  }
  add(n, i) {
    this.roots.add(i), i.addObserver(() => {
      this.roots.delete(i);
    });
  }
}
var Wf;
Wf = ho;
class kE {
  constructor(n, i) {
    _(this, "fiberId");
    _(this, "parent");
    _(this, Wf, ho);
    this.fiberId = n, this.parent = i;
  }
  add(n, i) {
    this.parent.tell(Ds((s) => {
      s.addChild(i), i.addObserver(() => {
        s.removeChild(i);
      });
    }));
  }
}
const LE = (t) => new kE(t.id(), t), Zu = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new ME()), CE = "effect/Fiber", IE = /* @__PURE__ */ Symbol.for(CE), OE = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, NE = "effect/Fiber", RE = /* @__PURE__ */ Symbol.for(NE), AE = (t) => t.await, lp = (t) => Pu(u_(t.await), t.inheritAll);
({
  ...Br
});
const wn = "effect/FiberCurrent", FE = "effect/Logger", zE = /* @__PURE__ */ Symbol.for(FE), $E = {
  /* c8 ignore next */
  _Message: (t) => t,
  /* c8 ignore next */
  _Output: (t) => t
}, Hu = (t) => ({
  [zE]: $E,
  log: t,
  pipe() {
    return V(this, arguments);
  }
}), BE = /^[^\s"=]*$/, DE = (t, n) => ({
  annotations: i,
  cause: s,
  date: a,
  fiberId: u,
  logLevel: h,
  message: d,
  spans: m
}) => {
  const g = (C) => C.match(BE) ? C : t(C), w = (C, I) => `${U_(C)}=${g(I)}`, y = (C, I) => " " + w(C, I);
  let x = w("timestamp", a.toISOString());
  x += y("level", h.label), x += y("fiber", Mm(u));
  const E = Iy(d);
  for (let C = 0; C < E.length; C++)
    x += y("message", li(E[C], n));
  gS(s) || (x += y("cause", Ur(s, {
    renderErrorCause: !0
  })));
  for (const C of m)
    x += " " + fx(a.getTime())(C);
  for (const [C, I] of i)
    x += y(C, li(I, n));
  return x;
}, ZE = (t) => `"${t.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`, HE = /* @__PURE__ */ Hu(/* @__PURE__ */ DE(ZE)), jE = typeof process == "object" && process !== null && typeof process.stdout == "object" && process.stdout !== null;
jE && process.stdout.isTTY;
const hp = "effect/MetricBoundaries", Sc = /* @__PURE__ */ Symbol.for(hp);
var Vf;
class UE {
  constructor(n) {
    _(this, "values");
    _(this, Vf, Sc);
    _(this, "_hash");
    this.values = n, this._hash = T(Ot(hp), ut(Fr(this.values)));
  }
  [(Vf = Sc, et)]() {
    return this._hash;
  }
  [Y](n) {
    return WE(n) && X(this.values, n.values);
  }
  pipe() {
    return V(this, arguments);
  }
}
const WE = (t) => Q(t, Sc), VE = (t) => {
  const n = T(t, Wd(se(Number.POSITIVE_INFINITY)), Jy);
  return new UE(n);
}, qE = (t) => T(Cy(t.count - 1, (n) => t.start * Math.pow(t.factor, n)), Eo, VE), KE = "effect/MetricKeyType", fp = /* @__PURE__ */ Symbol.for(KE), dp = "effect/MetricKeyType/Counter", Tc = /* @__PURE__ */ Symbol.for(dp), GE = "effect/MetricKeyType/Frequency", JE = /* @__PURE__ */ Symbol.for(GE), YE = "effect/MetricKeyType/Gauge", XE = /* @__PURE__ */ Symbol.for(YE), mp = "effect/MetricKeyType/Histogram", Pc = /* @__PURE__ */ Symbol.for(mp), QE = "effect/MetricKeyType/Summary", tM = /* @__PURE__ */ Symbol.for(QE), _p = {
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
};
var qf, Kf;
class eM {
  constructor(n, i) {
    _(this, "incremental");
    _(this, "bigint");
    _(this, Kf, _p);
    _(this, qf, Tc);
    _(this, "_hash");
    this.incremental = n, this.bigint = i, this._hash = Ot(dp);
  }
  [(Kf = fp, qf = Tc, et)]() {
    return this._hash;
  }
  [Y](n) {
    return pp(n);
  }
  pipe() {
    return V(this, arguments);
  }
}
var Gf, Jf;
class nM {
  constructor(n) {
    _(this, "boundaries");
    _(this, Jf, _p);
    _(this, Gf, Pc);
    _(this, "_hash");
    this.boundaries = n, this._hash = T(Ot(mp), ut(B(this.boundaries)));
  }
  [(Jf = fp, Gf = Pc, et)]() {
    return this._hash;
  }
  [Y](n) {
    return gp(n) && X(this.boundaries, n.boundaries);
  }
  pipe() {
    return V(this, arguments);
  }
}
const iM = (t) => new eM((t == null ? void 0 : t.incremental) ?? !1, (t == null ? void 0 : t.bigint) ?? !1), rM = (t) => new nM(t), pp = (t) => Q(t, Tc), sM = (t) => Q(t, JE), oM = (t) => Q(t, XE), gp = (t) => Q(t, Pc), aM = (t) => Q(t, tM), cM = "effect/MetricKey", vp = /* @__PURE__ */ Symbol.for(cM), uM = {
  /* c8 ignore next */
  _Type: (t) => t
}, lM = /* @__PURE__ */ Jc(X);
var Yf;
class ju {
  constructor(n, i, s, a = []) {
    _(this, "name");
    _(this, "keyType");
    _(this, "description");
    _(this, "tags");
    _(this, Yf, uM);
    _(this, "_hash");
    this.name = n, this.keyType = i, this.description = s, this.tags = a, this._hash = T(Ot(this.name + this.description), ut(B(this.keyType)), ut(Fr(this.tags)));
  }
  [(Yf = vp, et)]() {
    return this._hash;
  }
  [Y](n) {
    return hM(n) && this.name === n.name && X(this.keyType, n.keyType) && X(this.description, n.description) && lM(this.tags, n.tags);
  }
  pipe() {
    return V(this, arguments);
  }
}
const hM = (t) => Q(t, vp), fM = (t, n) => new ju(t, iM(n), Kc(n == null ? void 0 : n.description)), dM = (t, n, i) => new ju(t, rM(n), Kc(i)), mM = /* @__PURE__ */ v(2, (t, n) => n.length === 0 ? t : new ju(t.name, t.keyType, t.description, As(t.tags, n))), _M = "effect/MetricState", Gr = /* @__PURE__ */ Symbol.for(_M), yp = "effect/MetricState/Counter", xc = /* @__PURE__ */ Symbol.for(yp), bp = "effect/MetricState/Frequency", Ec = /* @__PURE__ */ Symbol.for(bp), wp = "effect/MetricState/Gauge", Mc = /* @__PURE__ */ Symbol.for(wp), Sp = "effect/MetricState/Histogram", kc = /* @__PURE__ */ Symbol.for(Sp), Tp = "effect/MetricState/Summary", Lc = /* @__PURE__ */ Symbol.for(Tp), Jr = {
  /* c8 ignore next */
  _A: (t) => t
};
var Xf, Qf;
class pM {
  constructor(n) {
    _(this, "count");
    _(this, Qf, Jr);
    _(this, Xf, xc);
    this.count = n;
  }
  [(Qf = Gr, Xf = xc, et)]() {
    return T(B(yp), ut(B(this.count)), Lt(this));
  }
  [Y](n) {
    return MM(n) && this.count === n.count;
  }
  pipe() {
    return V(this, arguments);
  }
}
const gM = /* @__PURE__ */ Jc(X);
var td, ed;
class vM {
  constructor(n) {
    _(this, "occurrences");
    _(this, ed, Jr);
    _(this, td, Ec);
    _(this, "_hash");
    this.occurrences = n;
  }
  [(ed = Gr, td = Ec, et)]() {
    return T(Ot(bp), ut(Fr(Bt(this.occurrences.entries()))), Lt(this));
  }
  [Y](n) {
    return kM(n) && gM(Bt(this.occurrences.entries()), Bt(n.occurrences.entries()));
  }
  pipe() {
    return V(this, arguments);
  }
}
var nd, id;
class yM {
  constructor(n) {
    _(this, "value");
    _(this, id, Jr);
    _(this, nd, Mc);
    this.value = n;
  }
  [(id = Gr, nd = Mc, et)]() {
    return T(B(wp), ut(B(this.value)), Lt(this));
  }
  [Y](n) {
    return LM(n) && this.value === n.value;
  }
  pipe() {
    return V(this, arguments);
  }
}
var rd, sd;
class bM {
  constructor(n, i, s, a, u) {
    _(this, "buckets");
    _(this, "count");
    _(this, "min");
    _(this, "max");
    _(this, "sum");
    _(this, sd, Jr);
    _(this, rd, kc);
    this.buckets = n, this.count = i, this.min = s, this.max = a, this.sum = u;
  }
  [(sd = Gr, rd = kc, et)]() {
    return T(B(Sp), ut(B(this.buckets)), ut(B(this.count)), ut(B(this.min)), ut(B(this.max)), ut(B(this.sum)), Lt(this));
  }
  [Y](n) {
    return CM(n) && X(this.buckets, n.buckets) && this.count === n.count && this.min === n.min && this.max === n.max && this.sum === n.sum;
  }
  pipe() {
    return V(this, arguments);
  }
}
var od, ad;
class wM {
  constructor(n, i, s, a, u, h) {
    _(this, "error");
    _(this, "quantiles");
    _(this, "count");
    _(this, "min");
    _(this, "max");
    _(this, "sum");
    _(this, ad, Jr);
    _(this, od, Lc);
    this.error = n, this.quantiles = i, this.count = s, this.min = a, this.max = u, this.sum = h;
  }
  [(ad = Gr, od = Lc, et)]() {
    return T(B(Tp), ut(B(this.error)), ut(B(this.quantiles)), ut(B(this.count)), ut(B(this.min)), ut(B(this.max)), ut(B(this.sum)), Lt(this));
  }
  [Y](n) {
    return IM(n) && this.error === n.error && X(this.quantiles, n.quantiles) && this.count === n.count && this.min === n.min && this.max === n.max && this.sum === n.sum;
  }
  pipe() {
    return V(this, arguments);
  }
}
const SM = (t) => new pM(t), TM = (t) => new vM(t), PM = (t) => new yM(t), xM = (t) => new bM(t.buckets, t.count, t.min, t.max, t.sum), EM = (t) => new wM(t.error, t.quantiles, t.count, t.min, t.max, t.sum), MM = (t) => Q(t, xc), kM = (t) => Q(t, Ec), LM = (t) => Q(t, Mc), CM = (t) => Q(t, kc), IM = (t) => Q(t, Lc), OM = "effect/MetricHook", NM = /* @__PURE__ */ Symbol.for(OM), RM = {
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
}, Yr = (t) => ({
  [NM]: RM,
  pipe() {
    return V(this, arguments);
  },
  ...t
}), rf = /* @__PURE__ */ BigInt(0), AM = (t) => {
  let n = t.keyType.bigint ? rf : 0;
  const i = t.keyType.incremental ? t.keyType.bigint ? (a) => a >= rf : (a) => a >= 0 : (a) => !0, s = (a) => {
    i(a) && (n = n + a);
  };
  return Yr({
    get: () => SM(n),
    update: s,
    modify: s
  });
}, FM = (t) => {
  const n = /* @__PURE__ */ new Map();
  for (const s of t.keyType.preregisteredWords)
    n.set(s, 0);
  const i = (s) => {
    const a = n.get(s) ?? 0;
    n.set(s, a + 1);
  };
  return Yr({
    get: () => TM(n),
    update: i,
    modify: i
  });
}, zM = (t, n) => {
  let i = n;
  return Yr({
    get: () => PM(i),
    update: (s) => {
      i = s;
    },
    modify: (s) => {
      i = i + s;
    }
  });
}, $M = (t) => {
  const n = t.keyType.boundaries.values, i = n.length, s = new Uint32Array(i + 1), a = new Float64Array(i);
  let u = 0, h = 0, d = Number.MAX_VALUE, m = Number.MIN_VALUE;
  T(n, Gs(vr), ai((y, x) => {
    a[x] = y;
  }));
  const g = (y) => {
    let x = 0, E = i;
    for (; x !== E; ) {
      const C = Math.floor(x + (E - x) / 2), I = a[C];
      y <= I ? E = C : x = C, E === x + 1 && (y <= a[x] ? E = x : x = E);
    }
    s[x] = s[x] + 1, u = u + 1, h = h + y, y < d && (d = y), y > m && (m = y);
  }, w = () => {
    const y = Gc(i);
    let x = 0;
    for (let E = 0; E < i; E++) {
      const C = a[E], I = s[E];
      x = x + I, y[E] = [C, x];
    }
    return y;
  };
  return Yr({
    get: () => xM({
      buckets: w(),
      count: u,
      min: d,
      max: m,
      sum: h
    }),
    update: g,
    modify: g
  });
}, BM = (t) => {
  const {
    error: n,
    maxAge: i,
    maxSize: s,
    quantiles: a
  } = t.keyType, u = T(a, Gs(vr)), h = Gc(s);
  let d = 0, m = 0, g = 0, w = 0, y = 0;
  const x = (C) => {
    const I = [];
    let D = 0;
    for (; D !== s - 1; ) {
      const lt = h[D];
      if (lt != null) {
        const [nt, ht] = lt, mt = Nn(C - nt);
        jb(mt, pi) && Hb(mt, i) && I.push(ht);
      }
      D = D + 1;
    }
    return DM(n, u, Gs(I, vr));
  }, E = (C, I) => {
    if (s > 0) {
      d = d + 1;
      const D = d % s;
      h[D] = [I, C];
    }
    w = m === 0 ? C : Math.min(w, C), y = m === 0 ? C : Math.max(y, C), m = m + 1, g = g + C;
  };
  return Yr({
    get: () => EM({
      error: n,
      quantiles: x(Date.now()),
      count: m,
      min: w,
      max: y,
      sum: g
    }),
    update: ([C, I]) => E(C, I),
    modify: ([C, I]) => E(C, I)
  });
}, DM = (t, n, i) => {
  const s = i.length;
  if (!de(n))
    return mi();
  const a = n[0], u = n.slice(1), h = sf(t, s, U(), 0, a, i), d = Me(h);
  return u.forEach((m) => {
    d.push(sf(t, s, h.value, h.consumed, m, h.rest));
  }), ai(d, (m) => [m.quantile, m.value]);
}, sf = (t, n, i, s, a, u) => {
  let h = t, d = n, m = i, g = s, w = a, y = u, x = t, E = n, C = i, I = s, D = a, lt = u;
  for (; ; ) {
    if (!de(y))
      return {
        quantile: w,
        value: U(),
        consumed: g,
        rest: []
      };
    if (w === 1)
      return {
        quantile: w,
        value: st(Kd(y)),
        consumed: g + y.length,
        rest: []
      };
    const nt = re(y), ht = Dy(y, (_t) => _t === nt), mt = w * d, Kt = h / 2 * mt, xt = g + ht[0].length, Qt = Math.abs(xt - mt);
    if (xt < mt - Kt) {
      x = h, E = d, C = dr(y), I = xt, D = w, lt = ht[1], h = x, d = E, m = C, g = I, w = D, y = lt;
      continue;
    }
    if (xt > mt + Kt) {
      const _t = ne(m) ? st(nt) : m;
      return {
        quantile: w,
        value: _t,
        consumed: g,
        rest: y
      };
    }
    switch (m._tag) {
      case "None": {
        x = h, E = d, C = dr(y), I = xt, D = w, lt = ht[1], h = x, d = E, m = C, g = I, w = D, y = lt;
        continue;
      }
      case "Some": {
        const _t = Math.abs(mt - m.value);
        if (Qt < _t) {
          x = h, E = d, C = dr(y), I = xt, D = w, lt = ht[1], h = x, d = E, m = C, g = I, w = D, y = lt;
          continue;
        }
        return {
          quantile: w,
          value: st(m.value),
          consumed: g,
          rest: y
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
}, ZM = "effect/MetricPair", HM = /* @__PURE__ */ Symbol.for(ZM), jM = {
  /* c8 ignore next */
  _Type: (t) => t
}, UM = (t, n) => ({
  [HM]: jM,
  metricKey: t,
  metricState: n,
  pipe() {
    return V(this, arguments);
  }
}), WM = "effect/MetricRegistry", of = /* @__PURE__ */ Symbol.for(WM);
var cd;
cd = of;
class VM {
  constructor() {
    _(this, cd, of);
    _(this, "map", /* @__PURE__ */ HT());
  }
  snapshot() {
    const n = [];
    for (const [i, s] of this.map)
      n.push(UM(i, s.get()));
    return n;
  }
  get(n) {
    const i = T(this.map, Tn(n), Sn);
    if (i == null) {
      if (pp(n.keyType))
        return this.getCounter(n);
      if (oM(n.keyType))
        return this.getGauge(n);
      if (sM(n.keyType))
        return this.getFrequency(n);
      if (gp(n.keyType))
        return this.getHistogram(n);
      if (aM(n.keyType))
        return this.getSummary(n);
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else
      return i;
  }
  getCounter(n) {
    let i = T(this.map, Tn(n), Sn);
    if (i == null) {
      const s = AM(n);
      T(this.map, ir(n)) || T(this.map, rr(n, s)), i = s;
    }
    return i;
  }
  getFrequency(n) {
    let i = T(this.map, Tn(n), Sn);
    if (i == null) {
      const s = FM(n);
      T(this.map, ir(n)) || T(this.map, rr(n, s)), i = s;
    }
    return i;
  }
  getGauge(n) {
    let i = T(this.map, Tn(n), Sn);
    if (i == null) {
      const s = zM(n, n.keyType.bigint ? BigInt(0) : 0);
      T(this.map, ir(n)) || T(this.map, rr(n, s)), i = s;
    }
    return i;
  }
  getHistogram(n) {
    let i = T(this.map, Tn(n), Sn);
    if (i == null) {
      const s = $M(n);
      T(this.map, ir(n)) || T(this.map, rr(n, s)), i = s;
    }
    return i;
  }
  getSummary(n) {
    let i = T(this.map, Tn(n), Sn);
    if (i == null) {
      const s = BM(n);
      T(this.map, ir(n)) || T(this.map, rr(n, s)), i = s;
    }
    return i;
  }
}
const qM = () => new VM(), KM = "effect/Metric", GM = /* @__PURE__ */ Symbol.for(KM), JM = {
  /* c8 ignore next */
  _Type: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
}, af = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => qM()), Pp = function(t, n, i, s) {
  const a = Object.assign((u) => d_(u, (h) => tk(a, h)), {
    [GM]: JM,
    keyType: t,
    unsafeUpdate: n,
    unsafeValue: i,
    unsafeModify: s,
    register() {
      return this.unsafeValue([]), this;
    },
    pipe() {
      return V(this, arguments);
    }
  });
  return a;
}, qo = (t, n) => xp(fM(t, n)), xp = (t) => {
  let n;
  const i = /* @__PURE__ */ new WeakMap(), s = (a) => {
    if (a.length === 0)
      return n !== void 0 || (n = af.get(t)), n;
    let u = i.get(a);
    return u !== void 0 || (u = af.get(mM(t, a)), i.set(a, u)), u;
  };
  return Pp(t.keyType, (a, u) => s(u).update(a), (a) => s(a).get(), (a, u) => s(u).modify(a));
}, YM = (t, n, i) => xp(dM(t, n, i)), XM = /* @__PURE__ */ v(3, (t, n, i) => QM(t, [Px(n, i)])), QM = /* @__PURE__ */ v(2, (t, n) => Pp(t.keyType, (i, s) => t.unsafeUpdate(i, As(n, s)), (i) => t.unsafeValue(As(n, i)), (i, s) => t.unsafeModify(i, As(n, s)))), tk = /* @__PURE__ */ v(2, (t, n) => Eu(fc, (i) => Z(() => t.unsafeUpdate(n, i))));
({
  ...qc
});
const ek = /* @__PURE__ */ v(2, (t, n) => Eu(up, (i) => Z(() => {
  if (i.has(t)) {
    const s = i.get(t);
    s.state.completed || (s.state.completed = !0, M_(s.result, n));
  }
}))), nk = "effect/Supervisor", Ko = /* @__PURE__ */ Symbol.for(nk), Uu = {
  /* c8 ignore next */
  _T: (t) => t
};
var ud;
ud = Ko;
const tl = class tl {
  constructor(n, i) {
    _(this, "underlying");
    _(this, "value0");
    _(this, ud, Uu);
    this.underlying = n, this.value0 = i;
  }
  get value() {
    return this.value0;
  }
  onStart(n, i, s, a) {
    this.underlying.onStart(n, i, s, a);
  }
  onEnd(n, i) {
    this.underlying.onEnd(n, i);
  }
  onEffect(n, i) {
    this.underlying.onEffect(n, i);
  }
  onSuspend(n) {
    this.underlying.onSuspend(n);
  }
  onResume(n) {
    this.underlying.onResume(n);
  }
  map(n) {
    return new tl(this, T(this.value, wt(n)));
  }
  zip(n) {
    return new mo(this, n);
  }
};
let fo = tl;
var ld;
ld = Ko;
const el = class el {
  constructor(n, i) {
    _(this, "left");
    _(this, "right");
    _(this, "_tag", "Zip");
    _(this, ld, Uu);
    this.left = n, this.right = i;
  }
  get value() {
    return __(this.left.value, this.right.value);
  }
  onStart(n, i, s, a) {
    this.left.onStart(n, i, s, a), this.right.onStart(n, i, s, a);
  }
  onEnd(n, i) {
    this.left.onEnd(n, i), this.right.onEnd(n, i);
  }
  onEffect(n, i) {
    this.left.onEffect(n, i), this.right.onEffect(n, i);
  }
  onSuspend(n) {
    this.left.onSuspend(n), this.right.onSuspend(n);
  }
  onResume(n) {
    this.left.onResume(n), this.right.onResume(n);
  }
  map(n) {
    return new fo(this, T(this.value, wt(n)));
  }
  zip(n) {
    return new el(this, n);
  }
};
let mo = el;
const Ep = (t) => Q(t, Ko) && Sd(t, "Zip");
var hd;
hd = Ko;
class ik {
  constructor(n) {
    _(this, "effect");
    _(this, hd, Uu);
    this.effect = n;
  }
  get value() {
    return this.effect;
  }
  onStart(n, i, s, a) {
  }
  onEnd(n, i) {
  }
  onEffect(n, i) {
  }
  onSuspend(n) {
  }
  onResume(n) {
  }
  map(n) {
    return new fo(this, T(this.value, wt(n)));
  }
  zip(n) {
    return new mo(this, n);
  }
  onRun(n, i) {
    return n();
  }
}
const rk = (t) => new ik(t), Go = /* @__PURE__ */ dt("effect/Supervisor/none", () => rk(Ce)), sk = Ci, Mp = "Empty", kp = "AddSupervisor", Lp = "RemoveSupervisor", Cp = "AndThen", pr = {
  _tag: Mp
}, Zs = (t, n) => ({
  _tag: Cp,
  first: t,
  second: n
}), ok = (t, n) => ak(n, se(t)), ak = (t, n) => {
  let i = t, s = n;
  for (; nn(s); ) {
    const a = $e(s);
    switch (a._tag) {
      case Mp: {
        s = Ye(s);
        break;
      }
      case kp: {
        i = i.zip(a.supervisor), s = Ye(s);
        break;
      }
      case Lp: {
        i = Cc(i, a.supervisor), s = Ye(s);
        break;
      }
      case Cp: {
        s = Se(a.first)(Se(a.second)(Ye(s)));
        break;
      }
    }
  }
  return i;
}, Cc = (t, n) => X(t, n) ? Go : Ep(t) ? Cc(t.left, n).zip(Cc(t.right, n)) : t, _o = (t) => X(t, Go) ? An() : Ep(t) ? T(_o(t.left), wr(_o(t.right))) : cu(t), ck = (t, n) => {
  if (X(t, n))
    return pr;
  const i = _o(t), s = _o(n), a = T(s, yh(i), Qs(pr, (h, d) => Zs(h, {
    _tag: kp,
    supervisor: d
  }))), u = T(i, yh(s), Qs(pr, (h, d) => Zs(h, {
    _tag: Lp,
    supervisor: d
  })));
  return Zs(a, u);
}, uk = /* @__PURE__ */ sk({
  empty: pr,
  patch: ok,
  combine: Zs,
  diff: ck
}), lk = /* @__PURE__ */ qo("effect_fiber_started", {
  incremental: !0
}), cf = /* @__PURE__ */ qo("effect_fiber_active"), hk = /* @__PURE__ */ qo("effect_fiber_successes", {
  incremental: !0
}), fk = /* @__PURE__ */ qo("effect_fiber_failures", {
  incremental: !0
}), dk = /* @__PURE__ */ XM(/* @__PURE__ */ YM("effect_fiber_lifetimes", /* @__PURE__ */ qE({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds"), sr = "Continue", mk = "Done", uf = "Yield", _k = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, Ls = (t) => {
  throw new Error(`BUG: FiberRuntime - ${li(t)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
}, Ke = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp"), Ge = /* @__PURE__ */ dt("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
})), or = {
  [Ws]: (t, n, i) => ee(() => n.effect_instruction_i1(i)),
  OnStep: (t, n, i) => zt(zt(i)),
  [Vs]: (t, n, i) => ee(() => n.effect_instruction_i2(i)),
  [Wc]: (t, n, i) => (t.patchRuntimeFlags(t.currentRuntimeFlags, n.patch), un(t.currentRuntimeFlags) && t.isInterrupted() ? Tt(t.getInterruptedCause()) : zt(i)),
  [qs]: (t, n, i) => (ee(() => n.effect_instruction_i2(i)), ee(() => n.effect_instruction_i0()) ? (t.pushStack(n), ee(() => n.effect_instruction_i1())) : Ce),
  [fr]: (t, n, i) => {
    for (; ; ) {
      const s = ee(() => n.effect_instruction_i0.next(i));
      if (s.done)
        return zt(s.value);
      const a = Kv(s.value);
      if (jo(a)) {
        if (a._tag === "Failure")
          return a;
      } else return t.pushStack(n), a;
      i = a.value;
    }
  }
}, pk = {
  [zu]: (t, n, i, s) => (t.processNewInterruptSignal(s.cause), un(n) ? Tt(s.cause) : i),
  [Bu]: (t, n, i, s) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [$u]: (t, n, i, s) => (s.onFiber(t, tp(n)), i),
  [Du]: (t, n, i, s) => F(Tu(), () => i)
}, gk = (t) => Bo(tS(t), (n) => Cn(mS(n), ([i, s]) => {
  const a = /* @__PURE__ */ new Map(), u = [];
  for (const d of s) {
    u.push(Mn(d));
    for (const m of d)
      a.set(m.request, m);
  }
  const h = u.flat();
  return Zo(Rk(i.runAll(u), h, () => h.forEach((d) => {
    d.listeners.interrupted = !0;
  })), up, a);
}, !1, !1)), vk = /* @__PURE__ */ Vc();
var fd, dd;
class Ip extends W_ {
  constructor(i, s, a) {
    super();
    _(this, dd, OE);
    _(this, fd, _k);
    _(this, "_fiberRefs");
    _(this, "_fiberId");
    _(this, "_queue", /* @__PURE__ */ new Array());
    _(this, "_children", null);
    _(this, "_observers", /* @__PURE__ */ new Array());
    _(this, "_running", !1);
    _(this, "_stack", []);
    _(this, "_asyncInterruptor", null);
    _(this, "_asyncBlockingOn", null);
    _(this, "_exitValue", null);
    _(this, "_steps", []);
    _(this, "_isYielding", !1);
    _(this, "currentRuntimeFlags");
    _(this, "currentOpCount", 0);
    _(this, "currentSupervisor");
    _(this, "currentScheduler");
    _(this, "currentTracer");
    _(this, "currentSpan");
    _(this, "currentContext");
    _(this, "currentDefaultServices");
    _(this, "run", () => {
      this.drainQueueOnCurrentThread();
    });
    if (this.currentRuntimeFlags = a, this._fiberId = i, this._fiberRefs = s, Ph(a)) {
      const u = this.getFiberRef(fc);
      lk.unsafeUpdate(1, u), cf.unsafeUpdate(1, u);
    }
    this.refreshRefCache();
  }
  commit() {
    return lp(this);
  }
  /**
   * The identity of the fiber.
   */
  id() {
    return this._fiberId;
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background. This can be called to "kick off" execution of a fiber after
   * it has been created.
   */
  resume(i) {
    this.tell(ni(i));
  }
  /**
   * The status of the fiber.
   */
  get status() {
    return this.ask((i, s) => s);
  }
  /**
   * Gets the fiber runtime flags.
   */
  get runtimeFlags() {
    return this.ask((i, s) => qx(s) ? i.currentRuntimeFlags : s.runtimeFlags);
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return LE(this);
  }
  /**
   * Retrieves the immediate children of the fiber.
   */
  get children() {
    return this.ask((i) => Array.from(i.getChildren()));
  }
  /**
   * Gets the fiber's set of children.
   */
  getChildren() {
    return this._children === null && (this._children = /* @__PURE__ */ new Set()), this._children;
  }
  /**
   * Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
   * if the fiber has not been interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getInterruptedCause() {
    return this.getFiberRef(Ms);
  }
  /**
   * Retrieves the whole set of fiber refs.
   */
  fiberRefs() {
    return this.ask((i) => i.getFiberRefs());
  }
  /**
   * Returns an effect that will contain information computed from the fiber
   * state and status while running on the fiber.
   *
   * This allows the outside world to interact safely with mutable fiber state
   * without locks or immutable data.
   */
  ask(i) {
    return At(() => {
      const s = NT(this._fiberId);
      return this.tell(Ds((a, u) => {
        M_(s, Z(() => i(a, u)));
      })), E_(s);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(i) {
    this._queue.push(i), this._running || (this._running = !0, this.drainQueueLaterOnExecutor());
  }
  get await() {
    return Bn((i) => {
      const s = (a) => i(tt(a));
      return this.tell(Ds((a, u) => {
        a._exitValue !== null ? s(this._exitValue) : a.addObserver(s);
      })), Z(() => this.tell(Ds((a, u) => {
        a.removeObserver(s);
      })));
    }, this.id());
  }
  get inheritAll() {
    return ae((i, s) => {
      const a = i.id(), u = i.getFiberRefs(), h = s.runtimeFlags, d = this.getFiberRefs(), m = KP(u, a, d);
      i.setFiberRefs(m);
      const g = i.getFiberRef(mf), w = T(
        $s(h, g),
        // Do not inherit WindDown or Interruption!
        Eh(Ii),
        Eh(lc)
      );
      return XS(w);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return Z(() => Kc(this._exitValue));
  }
  /**
   * Unsafely observes the fiber, but returns immediately if it is not
   * already done.
   */
  unsafePoll() {
    return this._exitValue;
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  interruptAsFork(i) {
    return Z(() => this.tell(Ba(ln(i))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(i) {
    this.tell(Ba(ln(i)));
  }
  /**
   * Adds an observer to the list of observers.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addObserver(i) {
    this._exitValue !== null ? i(this._exitValue) : this._observers.push(i);
  }
  /**
   * Removes the specified observer from the list of observers that will be
   * notified when the fiber exits.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeObserver(i) {
    this._observers = this._observers.filter((s) => s !== i);
  }
  /**
   * Retrieves all fiber refs of the fiber.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRefs() {
    return this.setFiberRef(mf, this.currentRuntimeFlags), this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(i) {
    this._fiberRefs = j_(this._fiberRefs, i);
  }
  /**
   * Retrieves the state of the fiber ref, or else its initial value.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRef(i) {
    return this._fiberRefs.locals.has(i) ? this._fiberRefs.locals.get(i)[0][1] : i.initial;
  }
  /**
   * Sets the fiber ref to the specified value.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRef(i, s) {
    this._fiberRefs = mc(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef: i,
      value: s
    }), this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(oo), this.currentTracer = this.currentDefaultServices.unsafeMap.get(B_.key), this.currentSupervisor = this.getFiberRef(Nk), this.currentScheduler = this.getFiberRef(cp), this.currentContext = this.getFiberRef(Kr), this.currentSpan = this.currentContext.unsafeMap.get(D_.key);
  }
  /**
   * Wholesale replaces all fiber refs of this fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRefs(i) {
    this._fiberRefs = i, this.refreshRefCache();
  }
  /**
   * Adds a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addChild(i) {
    this.getChildren().add(i);
  }
  /**
   * Removes a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeChild(i) {
    this.getChildren().delete(i);
  }
  /**
   * Transfers all children of this fiber that are currently running to the
   * specified fiber scope.
   *
   * **NOTE**: This method must be invoked by the fiber itself after it has
   * evaluated the effects but prior to exiting.
   */
  transferChildren(i) {
    const s = this._children;
    if (this._children = null, s !== null && s.size > 0)
      for (const a of s)
        a._exitValue === null && i.add(this.currentRuntimeFlags, a);
  }
  /**
   * On the current thread, executes all messages in the fiber's inbox. This
   * method may return before all work is done, in the event the fiber executes
   * an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueOnCurrentThread() {
    let i = !0;
    for (; i; ) {
      let s = sr;
      const a = globalThis[wn];
      globalThis[wn] = this;
      try {
        for (; s === sr; )
          s = this._queue.length === 0 ? mk : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
      } finally {
        this._running = !1, globalThis[wn] = a;
      }
      this._queue.length > 0 && !this._running ? (this._running = !0, s === uf ? (this.drainQueueLaterOnExecutor(), i = !1) : i = !0) : i = !1;
    }
  }
  /**
   * Schedules the execution of all messages in the fiber's inbox.
   *
   * This method will return immediately after the scheduling
   * operation is completed, but potentially before such messages have been
   * executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueLaterOnExecutor() {
    this.currentScheduler.scheduleTask(this.run, this.getFiberRef(Mu));
  }
  /**
   * Drains the fiber's message queue while the fiber is actively running,
   * returning the next effect to execute, which may be the input effect if no
   * additional effect needs to be executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueWhileRunning(i, s) {
    let a = s;
    for (; this._queue.length > 0; ) {
      const u = this._queue.splice(0, 1)[0];
      a = pk[u._tag](this, i, a, u);
    }
    return a;
  }
  /**
   * Determines if the fiber is interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  isInterrupted() {
    return !yS(this.getFiberRef(Ms));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(i) {
    const s = this.getFiberRef(Ms);
    this.setFiberRef(Ms, we(s, i));
  }
  /**
   * Processes a new incoming interrupt signal.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  processNewInterruptSignal(i) {
    this.addInterruptedCause(i), this.sendInterruptSignalToAllChildren();
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0)
      return !1;
    let i = !1;
    for (const s of this._children)
      s.tell(Ba(ln(this.id()))), i = !0;
    return i;
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const i = this._children.values();
      this._children = null;
      let s = !1;
      return Su({
        while: () => !s,
        body: () => {
          const u = i.next();
          return u.done ? Z(() => {
            s = !0;
          }) : Vr(u.value.await);
        },
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(i) {
    if (Ph(this.currentRuntimeFlags)) {
      const s = this.getFiberRef(fc), a = this.id().startTimeMillis, u = Date.now();
      switch (dk.unsafeUpdate(u - a, s), cf.unsafeUpdate(-1, s), i._tag) {
        case fe: {
          hk.unsafeUpdate(1, s);
          break;
        }
        case he: {
          fk.unsafeUpdate(1, s);
          break;
        }
      }
    }
    if (i._tag === "Failure") {
      const s = this.getFiberRef(wT);
      !pu(i.cause) && s._tag === "Some" && this.log("Fiber terminated with an unhandled error", i.cause, s);
    }
  }
  setExitValue(i) {
    this._exitValue = i, this.reportExitValue(i);
    for (let s = this._observers.length - 1; s >= 0; s--)
      this._observers[s](i);
    this._observers = [];
  }
  getLoggers() {
    return this.getFiberRef(Tk);
  }
  log(i, s, a) {
    const u = Be(a) ? a.value : this.getFiberRef(pT), h = this.getFiberRef(yk);
    if (lx(h, u))
      return;
    const d = this.getFiberRef(gT), m = this.getFiberRef(_T), g = this.getLoggers(), w = this.getFiberRefs();
    if (Pm(g) > 0) {
      const y = em(this.getFiberRef(oo), Uo), x = new Date(y.unsafeCurrentTimeMillis());
      Qv(w, () => {
        for (const E of g)
          E.log({
            fiberId: this.id(),
            logLevel: u,
            message: i,
            cause: s,
            context: w,
            spans: d,
            annotations: m,
            date: x
          });
      });
    }
  }
  /**
   * Evaluates a single message on the current thread, while the fiber is
   * suspended. This method should only be called while evaluation of the
   * fiber's effect is suspended due to an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateMessageWhileSuspended(i) {
    switch (i._tag) {
      case Du:
        return uf;
      case zu:
        return this.processNewInterruptSignal(i.cause), this._asyncInterruptor !== null && (this._asyncInterruptor(Tt(i.cause)), this._asyncInterruptor = null), sr;
      case Bu:
        return this._asyncInterruptor = null, this._asyncBlockingOn = null, this.evaluateEffect(i.effect), sr;
      case $u:
        return i.onFiber(this, this._exitValue !== null ? Wx : Vx(this.currentRuntimeFlags, this._asyncBlockingOn)), sr;
      default:
        return Ls(i);
    }
  }
  /**
   * Evaluates an effect until completion, potentially asynchronously.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateEffect(i) {
    this.currentSupervisor.onResume(this);
    try {
      let s = un(this.currentRuntimeFlags) && this.isInterrupted() ? Tt(this.getInterruptedCause()) : i;
      for (; s !== null; ) {
        const a = s, u = this.runLoop(a);
        if (u === Ke) {
          const h = Ge.currentOp;
          Ge.currentOp = null, h._op === Rs ? Gw(this.currentRuntimeFlags) ? (this.tell(xE()), this.tell(ni(Pn)), s = null) : s = Pn : h._op === hr && (s = null);
        } else {
          this.currentRuntimeFlags = T(this.currentRuntimeFlags, Jw(lc));
          const h = this.interruptAllChildren();
          h !== null ? s = F(h, () => u) : (this._queue.length === 0 ? this.setExitValue(u) : this.tell(ni(u)), s = null);
        }
      }
    } finally {
      this.currentSupervisor.onSuspend(this);
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on the current
   * thread. This can be called to "kick off" execution of a fiber after it has
   * been created, in hopes that the effect can be executed synchronously.
   *
   * This is not the normal way of starting a fiber, but it is useful when the
   * express goal of executing the fiber is to synchronously produce its exit.
   */
  start(i) {
    if (this._running)
      this.tell(ni(i));
    else {
      this._running = !0;
      const s = globalThis[wn];
      globalThis[wn] = this;
      try {
        this.evaluateEffect(i);
      } finally {
        this._running = !1, globalThis[wn] = s, this._queue.length > 0 && this.drainQueueLaterOnExecutor();
      }
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background, and on the correct thread pool. This can be called to "kick
   * off" execution of a fiber after it has been created, in hopes that the
   * effect can be executed synchronously.
   */
  startFork(i) {
    this.tell(ni(i));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(i, s) {
    const a = Bs(i, s);
    return globalThis[wn] = this, this.currentRuntimeFlags = a, a;
  }
  /**
   * Initiates an asynchronous operation, by building a callback that will
   * resume execution, and then feeding that callback to the registration
   * function, handling error cases and repeated resumptions appropriately.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  initiateAsync(i, s) {
    let a = !1;
    const u = (h) => {
      a || (a = !0, this.tell(ni(h)));
    };
    un(i) && (this._asyncInterruptor = u);
    try {
      s(u);
    } catch (h) {
      u(ce(tn(h)));
    }
  }
  pushStack(i) {
    this._stack.push(i), i._op === "OnStep" && this._steps.push({
      refs: this.getFiberRefs(),
      flags: this.currentRuntimeFlags
    });
  }
  popStack() {
    const i = this._stack.pop();
    if (i)
      return i._op === "OnStep" && this._steps.pop(), i;
  }
  getNextSuccessCont() {
    let i = this.popStack();
    for (; i; ) {
      if (i._op !== Ns)
        return i;
      i = this.popStack();
    }
  }
  getNextFailCont() {
    let i = this.popStack();
    for (; i; ) {
      if (i._op !== Ws && i._op !== qs && i._op !== fr)
        return i;
      i = this.popStack();
    }
  }
  [(dd = IE, fd = RE, ey)](i) {
    return Z(() => nm(this.currentContext, i));
  }
  Left(i) {
    return Ft(i.left);
  }
  None(i) {
    return Ft(new ku());
  }
  Right(i) {
    return zt(i.right);
  }
  Some(i) {
    return zt(i.value);
  }
  Micro(i) {
    return io((s) => {
      let a = s;
      const u = wE(mE(i, this.currentContext));
      return u.addObserver((h) => {
        if (h._tag === "Success")
          return a(zt(h.value));
        switch (h.cause._tag) {
          case "Interrupt":
            return a(Tt(ln(bi)));
          case "Fail":
            return a(Ft(h.cause.error));
          case "Die":
            return a(ro(h.cause.defect));
        }
      }), io((h) => {
        a = (d) => {
          h(Ce);
        }, u.unsafeInterrupt();
      });
    });
  }
  [Cd](i) {
    const s = ee(() => i.effect_instruction_i0()), a = this.getNextSuccessCont();
    return a !== void 0 ? (a._op in or || Ls(a), or[a._op](this, a, s)) : (Ge.currentOp = zt(s), Ke);
  }
  [fe](i) {
    const s = i, a = this.getNextSuccessCont();
    return a !== void 0 ? (a._op in or || Ls(a), or[a._op](this, a, s.effect_instruction_i0)) : (Ge.currentOp = s, Ke);
  }
  [he](i) {
    const s = i.effect_instruction_i0, a = this.getNextFailCont();
    if (a !== void 0)
      switch (a._op) {
        case Ns:
        case Vs:
          return un(this.currentRuntimeFlags) && this.isInterrupted() ? Tt(Mh(s)) : ee(() => a.effect_instruction_i1(s));
        case "OnStep":
          return un(this.currentRuntimeFlags) && this.isInterrupted() ? Tt(Mh(s)) : zt(Tt(s));
        case Wc:
          return this.patchRuntimeFlags(this.currentRuntimeFlags, a.patch), un(this.currentRuntimeFlags) && this.isInterrupted() ? Tt(we(s, this.getInterruptedCause())) : Tt(s);
        default:
          Ls(a);
      }
    else
      return Ge.currentOp = Tt(s), Ke;
  }
  [Id](i) {
    return ee(() => i.effect_instruction_i0(this, tp(this.currentRuntimeFlags)));
  }
  Blocked(i) {
    const s = this.getFiberRefs(), a = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const u = [], h = this._steps[this._steps.length - 1];
      let d = this.popStack();
      for (; d && d._op !== "OnStep"; )
        u.push(d), d = this.popStack();
      this.setFiberRefs(h.refs), this.currentRuntimeFlags = h.flags;
      const m = Ax(h.refs, s), g = $s(h.flags, a);
      return zt(n_(i.effect_instruction_i0, ae((w) => {
        for (; u.length > 0; )
          w.pushStack(u.pop());
        return w.setFiberRefs(Fx(w.id(), w.getFiberRefs())(m)), w.currentRuntimeFlags = Bs(g)(w.currentRuntimeFlags), i.effect_instruction_i1;
      })));
    }
    return Do((u) => F(Op(BS(i.effect_instruction_i0)), () => u(i.effect_instruction_i1)));
  }
  RunBlocked(i) {
    return gk(i.effect_instruction_i0);
  }
  [zr](i) {
    const s = i.effect_instruction_i0, a = this.currentRuntimeFlags, u = Bs(a, s);
    if (un(u) && this.isInterrupted())
      return Tt(this.getInterruptedCause());
    if (this.patchRuntimeFlags(this.currentRuntimeFlags, s), i.effect_instruction_i1) {
      const h = $s(u, a);
      return this.pushStack(new DS(h, i)), ee(() => i.effect_instruction_i1(a));
    } else
      return Pn;
  }
  [Ws](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  OnStep(i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [Ns](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [Vs](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [hr](i) {
    return this._asyncBlockingOn = i.effect_instruction_i1, this.initiateAsync(this.currentRuntimeFlags, i.effect_instruction_i0), Ge.currentOp = i, Ke;
  }
  [Rs](i) {
    return this._isYielding = !1, Ge.currentOp = i, Ke;
  }
  [qs](i) {
    const s = i.effect_instruction_i0, a = i.effect_instruction_i1;
    return s() ? (this.pushStack(i), a()) : Pn;
  }
  [fr](i) {
    return or[fr](this, i, void 0);
  }
  [xo](i) {
    return ee(() => i.commit());
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(i) {
    let s = i;
    for (this.currentOpCount = 0; ; ) {
      if (this.currentRuntimeFlags & Kw && this.currentSupervisor.onEffect(this, s), this._queue.length > 0 && (s = this.drainQueueWhileRunning(this.currentRuntimeFlags, s)), !this._isYielding) {
        this.currentOpCount += 1;
        const a = this.currentScheduler.shouldYield(this);
        if (a !== !1) {
          this._isYielding = !0, this.currentOpCount = 0;
          const u = s;
          s = F(Tu({
            priority: a
          }), () => u);
        }
      }
      try {
        if (s = this.currentTracer.context(() => {
          if (vk !== s[Mi]._V) {
            const a = this.getFiberRef(ST);
            if (a._tag === "Some") {
              const u = s[Mi]._V;
              this.log(`Executing an Effect versioned ${u} with a Runtime of version ${Vc()}, you may want to dedupe the effect dependencies, you can use the language service plugin to detect this at compile time: https://github.com/Effect-TS/language-service`, Pi, a);
            }
          }
          return this[s._op](s);
        }, this), s === Ke) {
          const a = Ge.currentOp;
          return a._op === Rs || a._op === hr ? Ke : (Ge.currentOp = null, a._op === fe || a._op === he ? a : Tt(tn(a)));
        }
      } catch (a) {
        s !== Ke && !Q(s, "_op") || !(s._op in this) ? s = US(`Not a valid effect: ${li(s)}`) : MT(a) ? s = Tt(we(tn(a), ln(bi))) : s = ro(a);
      }
    }
  }
}
const yk = /* @__PURE__ */ dt("effect/FiberRef/currentMinimumLogLevel", () => ue(hx("Info"))), bk = (t) => Hu((n) => {
  const i = XP(n.context, oo);
  em(i, $_).unsafe.log(t.log(n));
}), wk = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => bk(HE)), Sk = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => Hu(({
  annotations: t,
  cause: n,
  context: i,
  fiberId: s,
  logLevel: a,
  message: u
}) => {
  const h = Dr(kr(i, Kr), D_);
  if (h._tag === "None" || h.value._tag === "ExternalSpan")
    return;
  const d = nm(kr(i, oo), Uo), m = {};
  for (const [g, w] of t)
    m[g] = w;
  m["effect.fiberId"] = A0(s), m["effect.logLevel"] = a.label, n !== null && n._tag !== "Empty" && (m["effect.cause"] = Ur(n, {
    renderErrorCause: !0
  })), h.value.event(li(Array.isArray(u) && u.length === 1 ? u[0] : u), d.unsafeCurrentTimeNanos(), m);
})), Tk = /* @__PURE__ */ dt(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => hT(cu(wk, Sk))), Pk = (t) => {
  if (Array.isArray(t) || Td(t))
    return [t, U()];
  const n = Object.keys(t), i = n.length;
  return [n.map((s) => t[s]), st((s) => {
    const a = {};
    for (let u = 0; u < i; u++)
      a[n[u]] = s[u];
    return a;
  })];
}, xk = (t, n, i) => {
  const s = [];
  for (const a of t)
    s.push(Mr(a));
  return F(Lr(s, yt, {
    concurrency: i == null ? void 0 : i.concurrency,
    batching: i == null ? void 0 : i.batching,
    concurrentFinalizers: i == null ? void 0 : i.concurrentFinalizers
  }), (a) => {
    const u = U(), h = a.length, d = new Array(h), m = new Array(h);
    let g = !1;
    for (let w = 0; w < h; w++) {
      const y = a[w];
      y._tag === "Left" ? (d[w] = st(y.left), g = !0) : (m[w] = y.right, d[w] = u);
    }
    return g ? n._tag === "Some" ? Ft(n.value(d)) : Ft(d) : i != null && i.discard ? Ce : n._tag === "Some" ? tt(n.value(m)) : tt(m);
  });
}, Ek = (t, n, i) => {
  const s = [];
  for (const a of t)
    s.push(Mr(a));
  return i != null && i.discard ? Lr(s, yt, {
    concurrency: i == null ? void 0 : i.concurrency,
    batching: i == null ? void 0 : i.batching,
    discard: !0,
    concurrentFinalizers: i == null ? void 0 : i.concurrentFinalizers
  }) : wt(Lr(s, yt, {
    concurrency: i == null ? void 0 : i.concurrency,
    batching: i == null ? void 0 : i.batching,
    concurrentFinalizers: i == null ? void 0 : i.concurrentFinalizers
  }), (a) => n._tag === "Some" ? n.value(a) : a);
}, Mk = (t, n) => {
  const [i, s] = Pk(t);
  return (n == null ? void 0 : n.mode) === "validate" ? xk(i, s, n) : (n == null ? void 0 : n.mode) === "either" ? Ek(i, s, n) : (n == null ? void 0 : n.discard) !== !0 && s._tag === "Some" ? wt(Lr(i, yt, n), s.value) : Lr(i, yt, n);
}, Lr = /* @__PURE__ */ v((t) => Td(t[0]), (t, n, i) => ae((s) => {
  const a = (i == null ? void 0 : i.batching) === !0 || (i == null ? void 0 : i.batching) === "inherit" && s.getFiberRef(bT);
  return i != null && i.discard ? nf(i.concurrency, () => ii(gc, i == null ? void 0 : i.concurrentFinalizers)((u) => a ? Cn(t, (h, d) => u(n(h, d)), !0, !1, 1) : Bo(t, (h, d) => u(n(h, d)))), () => ii(vc, i == null ? void 0 : i.concurrentFinalizers)((u) => Cn(t, (h, d) => u(n(h, d)), a, !1)), (u) => ii(yc(u), i == null ? void 0 : i.concurrentFinalizers)((h) => Cn(t, (d, m) => h(n(d, m)), a, !1, u))) : nf(i == null ? void 0 : i.concurrency, () => ii(gc, i == null ? void 0 : i.concurrentFinalizers)((u) => a ? lf(t, 1, (h, d) => u(n(h, d)), !0) : hn(t, (h, d) => u(n(h, d)))), () => ii(vc, i == null ? void 0 : i.concurrentFinalizers)((u) => kk(t, (h, d) => u(n(h, d)), a)), (u) => ii(yc(u), i == null ? void 0 : i.concurrentFinalizers)((h) => lf(t, u, (d, m) => h(n(d, m)), a)));
})), kk = (t, n, i) => At(() => {
  const s = Bt(t), a = new Array(s.length);
  return Xe(Cn(s, (h, d) => F(n(h, d), (m) => Z(() => a[d] = m)), i, !1), tt(a));
}), Cn = (t, n, i, s, a) => Do((u) => YS((h) => ae((d) => {
  let m = Array.from(t).reverse(), g = m.length;
  if (g === 0)
    return Ce;
  let w = 0, y = !1;
  const x = a ? Math.min(m.length, a) : m.length, E = /* @__PURE__ */ new Set(), C = new Array(), I = () => E.forEach((_t) => {
    _t.currentScheduler.scheduleTask(() => {
      _t.unsafeInterruptAsFork(d.id());
    }, 0);
  }), D = new Array(), lt = new Array(), nt = new Array(), ht = () => {
    const _t = C.filter(({
      exit: Et
    }) => Et._tag === "Failure").sort((Et, it) => Et.index < it.index ? -1 : Et.index === it.index ? 0 : 1).map(({
      exit: Et
    }) => Et);
    return _t.length === 0 && _t.push(Pn), _t;
  }, mt = (_t, Et = !1) => {
    const it = m_(h(_t)), W = Ck(it, d, d.currentRuntimeFlags, Zu);
    return d.currentScheduler.scheduleTask(() => {
      Et && W.unsafeInterruptAsFork(d.id()), W.resume(it);
    }, 0), W;
  }, Kt = () => {
    s || (g -= m.length, m = []), y = !0, I();
  }, xt = i ? qS : a_, Qt = mt(Bn((_t) => {
    const Et = (W, G) => {
      W._op === "Blocked" ? nt.push(W) : (C.push({
        index: G,
        exit: W
      }), W._op === "Failure" && !y && Kt());
    }, it = () => {
      if (m.length > 0) {
        const W = m.pop();
        let G = w++;
        const le = () => {
          const H = m.pop();
          return G = w++, F(Tu(), () => F(xt(u(n(H, G))), St));
        }, St = (H) => m.length > 0 && (Et(H, G), m.length > 0) ? le() : tt(H), Te = F(xt(u(n(W, G))), St), at = mt(Te);
        D.push(at), E.add(at), y && at.currentScheduler.scheduleTask(() => {
          at.unsafeInterruptAsFork(d.id());
        }, 0), at.addObserver((H) => {
          let R;
          if (H._op === "Failure" ? R = H : R = H.effect_instruction_i0, lt.push(at), E.delete(at), Et(R, G), C.length === g)
            _t(tt(en(Ah(ht(), {
              parallel: !0
            }), () => Pn)));
          else if (nt.length + C.length === g) {
            const Ie = ht(), $ = nt.map((ot) => ot.effect_instruction_i0).reduce(Wm);
            _t(tt(n_($, Cn([en(Ah(Ie, {
              parallel: !0
            }), () => Pn), ...nt.map((ot) => ot.effect_instruction_i1)], (ot) => ot, i, !0, a))));
          } else
            it();
        });
      }
    };
    for (let W = 0; W < x; W++)
      it();
  }));
  return Vr(wu(u_(u(lp(Qt))), x_({
    onFailure: (_t) => {
      Kt();
      const Et = nt.length + 1, it = Math.min(typeof a == "number" ? a : nt.length, nt.length), W = Array.from(nt);
      return Bn((G) => {
        let le = 0, St = 0;
        const Te = (H, R) => (Ie) => {
          le++, le === Et && G(zt(Tt(_t))), W.length > 0 && R && at();
        }, at = () => {
          mt(W.pop(), !0).addObserver(Te(St, !0)), St++;
        };
        Qt.addObserver(Te(St, !1)), St++;
        for (let H = 0; H < it; H++)
          at();
      });
    },
    onSuccess: () => hn(lt, (_t) => _t.inheritAll)
  })));
}))), lf = (t, n, i, s) => At(() => {
  const a = Bt(t), u = new Array(a.length);
  return Xe(Cn(a, (d, m) => wt(i(d, m), (g) => u[m] = g), s, !1, n), tt(u));
}), Op = (t) => Ik(t, Zu), Lk = (t, n, i, s = null) => {
  const a = Np(t, n, i, s);
  return a.resume(t), a;
}, Ck = (t, n, i, s = null) => Np(t, n, i, s), Np = (t, n, i, s = null) => {
  const a = km(), u = n.getFiberRefs(), h = GP(u, a), d = new Ip(a, h, i), m = kr(h, Kr), g = d.currentSupervisor;
  return g.onStart(m, t, st(n), d), d.addObserver((y) => g.onEnd(y, d)), (s !== null ? s : T(n.getFiberRef(dc), en(() => n.scope()))).add(i, d), d;
}, Ik = (t, n) => ae((i, s) => tt(Lk(t, i, s.runtimeFlags, n))), hf = (t) => zi((n) => mn(Dr(n, Xr), {
  onNone: () => t,
  onSome: (i) => {
    switch (i.strategy._tag) {
      case "Parallel":
        return t;
      case "Sequential":
      case "ParallelN":
        return F(Ho(i, vc), (s) => Wu(t, s));
    }
  }
})), ff = (t) => (n) => zi((i) => mn(Dr(i, Xr), {
  onNone: () => n,
  onSome: (s) => s.strategy._tag === "ParallelN" && s.strategy.parallelism === t ? n : F(Ho(s, yc(t)), (a) => Wu(n, a))
})), ii = (t, n) => (i) => zi((s) => mn(Dr(s, Xr), {
  onNone: () => i(yt),
  onSome: (a) => {
    if (n === !0) {
      const u = t._tag === "Parallel" ? hf : t._tag === "Sequential" ? df : ff(t.parallelism);
      switch (a.strategy._tag) {
        case "Parallel":
          return u(i(hf));
        case "Sequential":
          return u(i(df));
        case "ParallelN":
          return u(i(ff(a.strategy.parallelism)));
      }
    } else
      return i(yt);
  }
})), df = (t) => zi((n) => mn(Dr(n, Xr), {
  onNone: () => t,
  onSome: (i) => {
    switch (i.strategy._tag) {
      case "Sequential":
        return t;
      case "Parallel":
      case "ParallelN":
        return F(Ho(i, gc), (s) => Wu(t, s));
    }
  }
})), Xr = /* @__PURE__ */ jn("effect/Scope"), Wu = /* @__PURE__ */ v(2, (t, n) => zT(
  t,
  // @ts-expect-error
  im(_b(Xr, n))
)), Ok = (t) => Fi(t, {
  differ: uk,
  fork: pr
}), mf = /* @__PURE__ */ dT(Yw), Nk = /* @__PURE__ */ Ok(Go), Rk = (t, n, i) => c_((s) => F(F(Op(l_(t)), (a) => Bn((u) => {
  const h = n.map((g) => g.listeners.count), d = () => {
    h.every((g) => g === 0) && n.every((g) => g.result.state.current._tag === "Pending" ? !0 : !!(g.result.state.current._tag === "Done" && jo(g.result.state.current.effect) && g.result.state.current.effect._tag === "Failure" && Jm(g.result.state.current.effect.cause))) && (m.forEach((g) => g()), i == null || i(), u(p_(a)));
  };
  a.addObserver((g) => {
    m.forEach((w) => w()), u(g);
  });
  const m = n.map((g, w) => {
    const y = (x) => {
      h[w] = x, d();
    };
    return g.listeners.addObserver(y), () => g.listeners.removeObserver(y);
  });
  return d(), Z(() => {
    m.forEach((g) => g());
  });
})), () => At(() => {
  const a = n.flatMap((u) => u.state.completed ? [] : [u]);
  return Bo(a, (u) => ek(u.request, CT(s)));
}))), Ak = "effect/ScheduleInterval", po = /* @__PURE__ */ Symbol.for(Ak), Rp = {
  [po]: po,
  startMillis: 0,
  endMillis: 0
}, Vu = (t, n) => t > n ? Rp : {
  [po]: po,
  startMillis: t,
  endMillis: n
}, Fk = /* @__PURE__ */ v(2, (t, n) => zk(t, n) === t), zk = /* @__PURE__ */ v(2, (t, n) => t.endMillis <= n.startMillis ? t : n.endMillis <= t.startMillis ? n : t.startMillis < n.startMillis ? t : n.startMillis < t.startMillis ? n : t.endMillis <= n.endMillis ? t : n), $k = (t) => t.startMillis >= t.endMillis, Bk = /* @__PURE__ */ v(2, (t, n) => {
  const i = Math.max(t.startMillis, n.startMillis), s = Math.min(t.endMillis, n.endMillis);
  return Vu(i, s);
}), Dk = (t) => Nn(t.endMillis - t.startMillis), Zk = (t) => Vu(t, Number.POSITIVE_INFINITY), _f = Vu, Ap = Rp, Hk = Fk, jk = $k, Uk = Bk, Wk = Dk, Vk = Zk, qk = "effect/ScheduleIntervals", pf = /* @__PURE__ */ Symbol.for(qk), Fp = (t) => ({
  [pf]: pf,
  intervals: t
}), Kk = /* @__PURE__ */ v(2, (t, n) => Gk(t.intervals, n.intervals, De())), Gk = (t, n, i) => {
  let s = t, a = n, u = i;
  for (; nn(s) && nn(a); ) {
    const h = T($e(s), Uk($e(a))), d = jk(h) ? u : T(u, Se(h));
    T($e(s), Hk($e(a))) ? s = Ye(s) : a = Ye(a), u = d;
  }
  return Fp(On(u));
}, Ic = (t) => T(t.intervals, cm, en(() => Ap)).startMillis, Jk = (t) => T(t.intervals, cm, en(() => Ap)).endMillis, Yk = /* @__PURE__ */ v(2, (t, n) => Ic(t) < Ic(n)), Xk = (t) => nn(t.intervals), Qk = Fp, tL = Kk, Oc = Ic, Nc = Jk, eL = Yk, nL = Xk, qu = "Continue", zp = "Done", iL = (t) => ({
  _tag: qu,
  intervals: t
}), rL = (t) => ({
  _tag: qu,
  intervals: Qk(se(t))
}), sL = {
  _tag: zp
}, oL = (t) => t._tag === qu, aL = (t) => t._tag === zp, cL = iL, $p = rL, Cr = sL, gf = oL, Ir = aL, uL = PT, lL = Ho, hL = AE, vf = p_, Ku = (t) => function() {
  if (arguments.length === 1) {
    const n = arguments[0];
    return (i, ...s) => t(n, i, ...s);
  }
  return t.apply(this, arguments);
}, Bp = /* @__PURE__ */ Ku((t, n, i) => {
  const s = km(), a = [[Kr, [[s, t.context]]]];
  i != null && i.scheduler && a.push([cp, [[s, i.scheduler]]]);
  let u = QP(t.fiberRefs, {
    entries: a,
    forkAs: s
  });
  i != null && i.updateRefs && (u = i.updateRefs(u, s));
  const h = new Ip(s, u, t.runtimeFlags);
  let d = n;
  i != null && i.scope && (d = F(lL(i.scope, Q_), (g) => Xe(TT(g, c_((w) => X(w, h.id()) ? Ce : g_(h, w))), wu(n, (w) => uL(g, w)))));
  const m = h.currentSupervisor;
  return m !== Go && (m.onStart(t.context, d, U(), h), h.addObserver((g) => m.onEnd(g, h))), Zu.add(t.runtimeFlags, h), (i == null ? void 0 : i.immediate) === !1 ? h.resume(d) : h.start(d), h;
}), Da = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure"), Cs = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var md, _d;
class fL extends Error {
  constructor(i) {
    const s = t_(i)[0];
    super((s == null ? void 0 : s.message) || "An error has occurred");
    _(this, _d);
    _(this, md);
    this[Da] = Da, this[Cs] = i, this.name = s ? `(FiberFailure) ${s.name}` : "FiberFailure", s != null && s.stack && (this.stack = s.stack);
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[Cs].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + Ur(this[Cs], {
      renderErrorCause: !0
    });
  }
  [(_d = Da, md = Cs, Ct)]() {
    return this.toString();
  }
}
const dL = (t) => {
  const n = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const i = new fL(t);
  return Error.stackTraceLimit = n, i;
}, mL = (t) => {
  const n = t;
  switch (n._op) {
    case "Failure":
    case "Success":
      return n;
    case "Left":
      return Fh(n.left);
    case "Right":
      return zt(n.right);
    case "Some":
      return zt(n.value);
    case "None":
      return Fh(new ku());
  }
}, _L = /* @__PURE__ */ Ku((t, n, i) => pL(t, n, i).then((s) => {
  switch (s._tag) {
    case fe:
      return s.effect_instruction_i0;
    case he:
      throw dL(s.effect_instruction_i0);
  }
})), pL = /* @__PURE__ */ Ku((t, n, i) => new Promise((s) => {
  const a = mL(n);
  a && s(a);
  const u = Bp(t)(n);
  u.addObserver((h) => {
    s(h);
  }), (i == null ? void 0 : i.signal) !== void 0 && (i.signal.aborted ? u.unsafeInterruptAsFork(u.id()) : i.signal.addEventListener("abort", () => {
    u.unsafeInterruptAsFork(u.id());
  }, {
    once: !0
  }));
}));
class gL {
  constructor(n, i, s) {
    _(this, "context");
    _(this, "runtimeFlags");
    _(this, "fiberRefs");
    this.context = n, this.runtimeFlags = i, this.fiberRefs = s;
  }
  pipe() {
    return V(this, arguments);
  }
}
const vL = (t) => new gL(t.context, t.runtimeFlags, t.fiberRefs), yL = /* @__PURE__ */ jm(Ii, Zm, Dm), Dp = /* @__PURE__ */ vL({
  context: /* @__PURE__ */ Xc(),
  runtimeFlags: yL,
  fiberRefs: /* @__PURE__ */ tx()
}), bL = /* @__PURE__ */ Bp(Dp), wL = /* @__PURE__ */ _L(Dp), SL = "effect/Schedule", Zp = /* @__PURE__ */ Symbol.for(SL), TL = (t) => Q(t, Zp), PL = "effect/ScheduleDriver", xL = /* @__PURE__ */ Symbol.for(PL), Rc = {
  start: 0,
  now: 0,
  input: void 0,
  output: void 0,
  elapsed: pi,
  elapsedSincePrevious: pi,
  recurrence: 0
}, yf = /* @__PURE__ */ Qc()("effect/Schedule/CurrentIterationMetadata", {
  defaultValue: () => Rc
}), EL = {
  /* c8 ignore next */
  _Out: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
}, ML = {
  /* c8 ignore next */
  _Out: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
};
var pd;
pd = Zp;
class kL {
  constructor(n, i) {
    _(this, "initial");
    _(this, "step");
    _(this, pd, EL);
    this.initial = n, this.step = i;
  }
  pipe() {
    return V(this, arguments);
  }
}
const bf = (t, n, i, s) => yx(t, (a) => a.recurrence === 0 ? {
  now: n,
  input: i,
  output: s,
  recurrence: a.recurrence + 1,
  elapsed: pi,
  elapsedSincePrevious: pi,
  start: n
} : {
  now: n,
  input: i,
  output: s,
  recurrence: a.recurrence + 1,
  elapsed: Nn(n - a.start),
  elapsedSincePrevious: Nn(n - a.now),
  start: a.start
});
var gd;
gd = xL;
class LL {
  constructor(n, i) {
    _(this, "schedule");
    _(this, "ref");
    _(this, gd, ML);
    _(this, "iterationMeta", /* @__PURE__ */ V_(Rc));
    this.schedule = n, this.ref = i;
  }
  get state() {
    return wt(_r(this.ref), (n) => n[1]);
  }
  get last() {
    return F(_r(this.ref), ([n, i]) => {
      switch (n._tag) {
        case "None":
          return $o(() => new ku());
        case "Some":
          return tt(n.value);
      }
    });
  }
  get reset() {
    return za(this.ref, [U(), this.schedule.initial]).pipe(Pu(za(this.iterationMeta, Rc)));
  }
  next(n) {
    return T(wt(_r(this.ref), (i) => i[1]), F((i) => T(UP, F((s) => T(At(() => this.schedule.step(s, n, i)), F(([a, u, h]) => {
      const d = za(this.ref, [st(u), a]);
      if (Ir(h))
        return d.pipe(Xe(Ft(U())));
      const m = Oc(h.intervals) - s;
      if (m <= 0)
        return d.pipe(Xe(bf(this.iterationMeta, s, n, u)), $n(u));
      const g = Nn(m);
      return T(d, Xe(bf(this.iterationMeta, s, n, u)), Xe(Mx(g)), $n(u));
    }))))));
  }
}
const Qr = (t, n) => new kL(t, n), CL = /* @__PURE__ */ v(2, (t, n) => IL(t, (i) => Z(() => n(i)))), IL = /* @__PURE__ */ v(2, (t, n) => BL(t, (i, s) => wt(n(i), (a) => Zb(s, me(a))))), OL = /* @__PURE__ */ v(2, (t, n) => Gu(t, (i, s) => Z(() => n(i, s)))), Gu = /* @__PURE__ */ v(2, (t, n) => Qr(t.initial, (i, s, a) => F(t.step(i, s, a), ([u, h, d]) => Ir(d) ? tt([u, h, Cr]) : wt(n(s, h), (m) => m ? [u, h, d] : [u, h, Cr])))), NL = (t) => CL(t, (n) => n), RL = (t) => T(vx([U(), t.initial]), wt((n) => new LL(t, n))), AL = (t, n = 2) => {
  const i = me(t);
  return NL(zL(Ju, (s) => Db(i, Math.pow(n, s))));
}, Hp = /* @__PURE__ */ v(2, (t, n) => FL(t, n, tL)), FL = /* @__PURE__ */ v(3, (t, n, i) => Qr([t.initial, n.initial], (s, a, u) => T(eT(t.step(s, a, u[0]), n.step(s, a, u[1]), (h, d) => [h, d]), F(([[h, d, m], [g, w, y]]) => gf(m) && gf(y) ? Ac(t, n, a, h, d, m.intervals, g, w, y.intervals, i) : tt([[h, g], [d, w], Cr]))))), Ac = (t, n, i, s, a, u, h, d, m, g) => {
  const w = g(u, m);
  return nL(w) ? tt([[s, h], [a, d], cL(w)]) : T(u, eL(m)) ? F(t.step(Nc(u), i, s), ([y, x, E]) => Ir(E) ? tt([[y, h], [x, d], Cr]) : Ac(t, n, i, y, x, E.intervals, h, d, m, g)) : F(n.step(Nc(m), i, h), ([y, x, E]) => Ir(E) ? tt([[s, y], [a, x], Cr]) : Ac(t, n, i, s, a, u, y, x, E.intervals, g));
}, zL = /* @__PURE__ */ v(2, (t, n) => $L(t, (i) => Z(() => n(i)))), $L = /* @__PURE__ */ v(2, (t, n) => Qr(t.initial, (i, s, a) => F(t.step(i, s, a), ([u, h, d]) => wt(n(h), (m) => [u, m, d])))), BL = /* @__PURE__ */ v(2, (t, n) => Qr(t.initial, (i, s, a) => F(t.step(i, s, a), ([u, h, d]) => {
  if (Ir(d))
    return tt([u, h, d]);
  const m = d.intervals, g = Wk(_f(i, Oc(m)));
  return wt(n(h, g), (w) => {
    const y = me(w), x = Oc(m), E = i + Ys(y), C = E - x, I = Math.max(0, Nc(m) + C), D = _f(E, I);
    return [u, h, $p(D)];
  });
}))), jp = (t) => jL(Ju, (n) => n < t), DL = (t, n) => Qr(t, (i, s, a) => Z(() => [n(a), a, $p(Vk(i))])), ZL = /* @__PURE__ */ v(2, (t, n) => Gu(t, (i, s) => Ex(n(i)))), HL = /* @__PURE__ */ v(2, (t, n) => Gu(t, (i, s) => n(i))), jL = /* @__PURE__ */ v(2, (t, n) => OL(t, (i, s) => n(s))), Hs = /* @__PURE__ */ Symbol.for("effect/Schedule/ScheduleDefect");
var vd;
vd = Hs;
class UL {
  constructor(n) {
    _(this, "error");
    _(this, vd);
    this.error = n, this[Hs] = Hs;
  }
}
const WL = (t) => Q(t, Hs), wf = (t) => Er(t, (n) => ro(new UL(n))), VL = (t) => mn(gu(t, (n) => vS(n) && WL(n.defect) ? st(n.defect) : U()), {
  onNone: () => t,
  onSome: (n) => xr(n.error)
}), qL = (t) => jS(t, (n) => ce(VL(n))), Sf = /* @__PURE__ */ v(2, (t, n) => JL(t, n, (i, s) => Ft(i))), KL = /* @__PURE__ */ v(2, (t, n) => TL(n) ? Sf(t, n) : qL(Sf(t, GL(n)))), GL = (t) => {
  const n = t.schedule ?? Ju, i = t.while ? HL(n, (a) => {
    const u = t.while(a);
    return typeof u == "boolean" ? tt(u) : wf(u);
  }) : n, s = t.until ? ZL(i, (a) => {
    const u = t.until(a);
    return typeof u == "boolean" ? tt(u) : wf(u);
  }) : i;
  return t.times ? Hp(s, jp(t.times)) : s;
}, JL = /* @__PURE__ */ v(3, (t, n, i) => F(RL(n), (s) => Up(Jh(t, yf, _r(s.iterationMeta)), s, (a, u) => Jh(i(a, u), yf, _r(s.iterationMeta))))), Up = (t, n, i) => Er(t, (s) => qr(n.next(s), {
  onFailure: () => T(n.last, GS, F((a) => i(s, a))),
  onSuccess: () => Up(t, n, i)
})), Ju = /* @__PURE__ */ DL(0, (t) => t + 1), YL = Mk, XL = Ft, QL = tT, Wp = tt, go = Z, Vp = Er, tC = KL, eC = Lx, Fc = wt, qp = d_, Kp = kx, Za = bL, nC = wL, iC = AL, rC = Hp, sC = jp, oC = [
  "https://overpass-api.de/api/interpreter",
  // Main instance (Germany)
  "https://overpass.private.coffee/api/interpreter",
  // No rate limit (Global)
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  // VK Maps (Russia) - no rate limit
  "https://overpass.osm.jp/api/interpreter"
  // Japan instance (Global)
], rn = {
  CHUNK_DISTANCE_METERS: 500,
  // Split route every 500m for separate queries
  BUFFER_METERS: 30,
  // Search radius around route
  SAMPLE_INTERVAL_METERS: 100,
  // Sample coordinates every 100m within chunk
  MIN_DISTANCE_BETWEEN_LIGHTS: 50,
  // Dedupe lights closer than this
  MAX_RETRIES_PER_ENDPOINT: 2,
  // Retries per endpoint before trying next
  INITIAL_RETRY_DELAY_MS: 500,
  // Start with 500ms delay
  MAX_CONCURRENT_REQUESTS: 3,
  // Limit concurrent requests to avoid rate limiting
  REQUEST_TIMEOUT_MS: 15e3
  // 15 second timeout per request
};
class zc {
  constructor(n, i) {
    _(this, "_tag", "OverpassApiError");
    this.message = n, this.statusCode = i;
  }
  // 429 = rate limited, should immediately try next endpoint
  // 4xx = client errors, unlikely to succeed on retry
  get shouldFailover() {
    return this.statusCode !== void 0 && this.statusCode >= 400 && this.statusCode < 500;
  }
  // 5xx = server errors, might succeed on retry
  get isRetryable() {
    return this.statusCode === void 0 || this.statusCode >= 500;
  }
}
class Gp {
  constructor(n) {
    _(this, "_tag", "NetworkError");
    this.cause = n;
  }
  // Network errors are retryable (might be transient)
  get shouldFailover() {
    return !1;
  }
  get isRetryable() {
    return !0;
  }
}
function aC(t, n) {
  if (t.length <= 2) return t;
  const i = [t[0]];
  let s = 0;
  for (let a = 1; a < t.length; a++) {
    const [u, h] = t[a - 1], [d, m] = t[a];
    s += gr(h, u, m, d), s >= n && (i.push(t[a]), s = 0);
  }
  return i[i.length - 1] !== t[t.length - 1] && i.push(t[t.length - 1]), i;
}
function cC(t) {
  if (t.length <= 2) return [t];
  const n = [];
  let i = [t[0]], s = 0;
  for (let a = 1; a < t.length; a++) {
    const [u, h] = t[a - 1], [d, m] = t[a], g = gr(h, u, m, d);
    i.push(t[a]), s += g, s >= rn.CHUNK_DISTANCE_METERS && a < t.length - 1 && (n.push(i), i = [t[a]], s = 0);
  }
  return i.length > 0 && n.push(i), n;
}
function uC(t, n, i) {
  let s = 0, a = 1 / 0, u = 0, h = 0;
  for (let d = 0; d < i.length; d++) {
    const [m, g] = i[d], w = gr(t, n, g, m);
    if (w < a && (a = w, s = d, u = h), d > 0) {
      const [y, x] = i[d - 1];
      h += gr(x, y, g, m);
    }
  }
  return { closestIndex: s, distance: a, distanceFromStart: u };
}
function lC(t) {
  const n = [...t].sort((s, a) => s.distanceFromStart - a.distanceFromStart), i = [];
  for (const s of n) {
    const a = i[i.length - 1];
    (!a || s.distanceFromStart - a.distanceFromStart >= rn.MIN_DISTANCE_BETWEEN_LIGHTS) && i.push(s);
  }
  return i;
}
function hC(t) {
  const i = aC(t, rn.SAMPLE_INTERVAL_METERS).map(([s, a]) => `${a},${s}`).join(",");
  return `
    [out:json][timeout:30];
    (
      node["highway"="traffic_signals"](around:${rn.BUFFER_METERS},${i});
    );
    out body;
  `;
}
function fC(t, n) {
  return eC({
    try: async () => {
      const i = new AbortController(), s = setTimeout(() => i.abort(), rn.REQUEST_TIMEOUT_MS);
      try {
        const a = await fetch(t, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `data=${encodeURIComponent(n)}`,
          signal: i.signal
        });
        if (!a.ok)
          throw new zc(
            `${t}: ${a.statusText}`,
            a.status
          );
        return await a.json();
      } finally {
        clearTimeout(s);
      }
    },
    catch: (i) => i instanceof zc ? i : new Gp(i)
  });
}
const dC = T(
  iC(rn.INITIAL_RETRY_DELAY_MS),
  rC(sC(rn.MAX_RETRIES_PER_ENDPOINT))
);
function mC(t, n) {
  return T(
    fC(t, n),
    // Only retry if the error is retryable (5xx, network errors)
    // Immediately fail (and thus failover) on 429 and other 4xx
    tC({
      schedule: dC,
      while: (i) => i.isRetryable
    }),
    Kp(
      (i) => go(() => {
        i.shouldFailover ? console.warn(
          `Endpoint ${t} returned ${i instanceof zc ? i.statusCode : "error"}, immediately trying next...`
        ) : console.warn(`Endpoint ${t} failed after retries, trying next...`);
      })
    )
  );
}
function _C(t) {
  return oC.reduce(
    (i, s) => T(
      i,
      Vp(() => mC(s, t))
    ),
    // Start with a failing effect to kick off the chain
    XL(new Gp("No endpoints configured"))
  );
}
function pC(t, n) {
  return t.elements.filter((i) => i.type === "node").map((i) => {
    const { closestIndex: s, distance: a, distanceFromStart: u } = uC(
      i.lat,
      i.lon,
      n
    );
    return a > rn.BUFFER_METERS ? null : {
      id: i.id,
      lat: i.lat,
      lng: i.lon,
      routeIndex: s,
      distanceFromStart: u,
      timing: bd()
    };
  }).filter((i) => i !== null);
}
function gC(t, n) {
  const i = hC(t);
  return T(
    _C(i),
    Fc((s) => pC(s, n))
  );
}
function vC(t, n, i) {
  return T(
    gC(t, n),
    qp(
      () => go(() => {
        console.log(`Chunk ${i} completed successfully`);
      })
    ),
    Kp(
      (s) => go(() => {
        console.warn(`Chunk ${i} failed on all endpoints:`, s);
      })
    ),
    // If all endpoints fail, return empty array for this chunk
    Vp(() => Wp([]))
  );
}
function yC(t) {
  if (t.length === 0)
    return Wp([]);
  const n = cC(t), i = n.map(
    (s, a) => vC(s, t, a)
  );
  return T(
    // Run chunks with controlled concurrency
    YL(i, { concurrency: rn.MAX_CONCURRENT_REQUESTS }),
    // Flatten results from all chunks
    Fc((s) => s.flat()),
    // Deduplicate (chunks may have overlapping results)
    Fc(lC),
    qp(
      (s) => go(() => {
        console.log(
          `Fetched ${s.length} traffic lights from ${n.length} chunks`
        );
      })
    )
  );
}
function bC(t) {
  const [n, i] = kt([]), [s, a] = kt(!1), [u, h] = kt(null), d = vt(""), m = vt([]), g = vt(null), w = t.length > 0 ? `${t.length}-${t[0][0]},${t[0][1]}-${t[t.length - 1][0]},${t[t.length - 1][1]}` : "";
  return $t(() => {
    if (t.length === 0) {
      i([]), d.current = "";
      return;
    }
    if (w === d.current)
      return;
    d.current = w, m.current = t, g.current && (Za(vf(g.current)), g.current = null), a(!0), h(null);
    const y = QL(function* () {
      return yield* yC(m.current);
    }), x = Za(y);
    return g.current = x, nC(hL(x)).then((E) => {
      g.current === x && ($T(E) ? i(E.value) : BT(E) ? console.log("Traffic light request was interrupted") : (console.warn("Traffic light fetch failed:", E.cause), i([])), a(!1));
    }), () => {
      g.current && (Za(vf(g.current)), g.current = null);
    };
  }, [t, w]), {
    trafficLights: n,
    isLoading: s,
    error: u
  };
}
function Ha(t, n, i) {
  let s = 0;
  for (let D = 1; D < i.length; D++) {
    if (i[D] >= n) {
      s = D - 1;
      break;
    }
    s = D - 1;
  }
  if (s >= t.length - 1) {
    const [D, lt] = t[t.length - 1], nt = t[t.length - 2] || t[t.length - 1];
    return {
      lat: lt,
      lng: D,
      bearing: Tf(nt[1], nt[0], lt, D),
      segmentIndex: t.length - 1
    };
  }
  const a = i[s], h = i[s + 1] - a, d = n - a, m = h > 0 ? Math.min(1, d / h) : 0, [g, w] = t[s], [y, x] = t[s + 1], E = w + m * (x - w), C = g + m * (y - g), I = Tf(w, g, x, y);
  return { lat: E, lng: C, bearing: I, segmentIndex: s };
}
function Tf(t, n, i, s) {
  const a = t * Math.PI / 180, u = i * Math.PI / 180, h = (s - n) * Math.PI / 180, d = Math.sin(h) * Math.cos(u), m = Math.cos(a) * Math.sin(u) - Math.sin(a) * Math.cos(u) * Math.cos(h);
  return (Math.atan2(d, m) * 180 / Math.PI + 360) % 360;
}
function wC(t, n, i, s) {
  const { MAX_SPEED_MS: a, ACCELERATION_RATE: u, DECELERATION_RATE: h, ACCELERATION_TIME: d, BRAKING_TIME: m } = be, g = 0.5 * u * d * d, w = 0.5 * h * m * m, y = n - t;
  return i && t < g ? Math.sqrt(2 * u * t) : s && y < w ? Math.sqrt(2 * h * y) : a;
}
function SC({
  coordinates: t,
  cumulativeDistances: n,
  trafficLights: i,
  totalDistance: s,
  simulationSpeed: a
}) {
  const [u, h] = kt({
    status: "idle",
    currentPosition: [0, 0],
    currentSpeed: 0,
    elapsedTime: 0,
    distanceTraveled: 0,
    routeProgress: 0,
    currentTrafficLightIndex: 0,
    isWaitingAtLight: !1,
    currentWaitTime: 0,
    totalWaitTime: 0,
    lightsEncountered: 0
  }), [d, m] = kt(null), g = vt(null), w = vt(0), y = vt(0), x = vt(0), E = vt(!1), C = vt(!0), I = vt(t), D = vt(n), lt = vt(i), nt = vt(s), ht = vt(a);
  $t(() => {
    I.current = t, D.current = n, lt.current = i, nt.current = s, ht.current = a;
  }, [t, n, i, s, a]);
  const mt = t.length > 0 && n.length > 0, Kt = vt(""), xt = si(() => {
    g.current && (cancelAnimationFrame(g.current), g.current = null);
    const it = I.current, W = it.length > 0 ? { lat: it[0][1], lng: it[0][0], bearing: 0, segmentIndex: 0 } : null;
    m(W), x.current = 0, E.current = !1, C.current = !0, w.current = 0, h({
      status: "ready",
      currentPosition: W ? [W.lat, W.lng] : [0, 0],
      currentSpeed: 0,
      elapsedTime: 0,
      distanceTraveled: 0,
      routeProgress: 0,
      currentTrafficLightIndex: 0,
      isWaitingAtLight: !1,
      currentWaitTime: 0,
      totalWaitTime: 0,
      lightsEncountered: 0
    });
  }, []);
  $t(() => {
    if (!mt) {
      h((G) => ({ ...G, status: "idle" }));
      return;
    }
    const it = t, W = it.length > 0 ? `${it[0][0]},${it[0][1]}-${it[it.length - 1][0]},${it[it.length - 1][1]}` : "";
    W !== Kt.current && (Kt.current = W, xt());
  }, [mt, t, xt]);
  const Qt = si((it) => {
    w.current === 0 && (w.current = it);
    const G = (it - w.current) / 1e3 * ht.current;
    w.current = it;
    const le = I.current, St = D.current, Te = lt.current, at = nt.current;
    h((H) => {
      if (H.status !== "playing") return H;
      if (H.isWaitingAtLight) {
        const Ut = H.currentWaitTime + G;
        return Ut >= y.current ? (x.current = H.distanceTraveled, E.current = !1, C.current = !0, {
          ...H,
          isWaitingAtLight: !1,
          currentWaitTime: 0,
          totalWaitTime: H.totalWaitTime + y.current,
          elapsedTime: H.elapsedTime + G,
          currentSpeed: 0
        }) : {
          ...H,
          currentWaitTime: Ut,
          elapsedTime: H.elapsedTime + G,
          currentSpeed: 0
        };
      }
      const R = Te[H.currentTrafficLightIndex], Ie = (R == null ? void 0 : R.distanceFromStart) ?? at, $ = Ie - H.distanceTraveled, ot = 0.5 * be.DECELERATION_RATE * be.BRAKING_TIME * be.BRAKING_TIME;
      $ <= ot && R && !E.current && (E.current = !0);
      const bt = H.distanceTraveled - x.current, pt = Ie - x.current, A = 0.5 * be.ACCELERATION_RATE * be.ACCELERATION_TIME * be.ACCELERATION_TIME;
      C.current && bt >= A && (C.current = !1);
      const K = wC(
        bt,
        pt,
        C.current,
        E.current
      );
      let Yt;
      if (C.current && bt < A) {
        const Wt = (bt > 0 ? Math.sqrt(2 * bt / be.ACCELERATION_RATE) : 0) + G, He = be.ACCELERATION_TIME;
        Wt <= He ? Yt = 0.5 * be.ACCELERATION_RATE * Wt * Wt - bt : Yt = K * G;
      } else
        Yt = K * G;
      const Xt = Math.min(H.distanceTraveled + Yt, at);
      if (R && Xt >= R.distanceFromStart) {
        const Ut = yd(R.timing, H.elapsedTime), Wt = Ha(le, R.distanceFromStart, St);
        return m(Wt), Ut.phase === "green" || Ut.phase === "yellow" && Ut.timeInPhase < 2 ? (x.current = R.distanceFromStart, E.current = !1, {
          ...H,
          distanceTraveled: R.distanceFromStart,
          routeProgress: R.distanceFromStart / at,
          elapsedTime: H.elapsedTime + G,
          currentSpeed: H.currentSpeed,
          // Maintain speed
          isWaitingAtLight: !1,
          currentWaitTime: 0,
          currentTrafficLightIndex: H.currentTrafficLightIndex + 1,
          // Don't increment lightsEncountered - only count red lights
          currentPosition: [Wt.lat, Wt.lng]
        }) : (y.current = Ut.timeUntilGreen, {
          ...H,
          distanceTraveled: R.distanceFromStart,
          routeProgress: R.distanceFromStart / at,
          elapsedTime: H.elapsedTime + G,
          currentSpeed: 0,
          isWaitingAtLight: !0,
          currentWaitTime: 0,
          currentTrafficLightIndex: H.currentTrafficLightIndex + 1,
          lightsEncountered: H.lightsEncountered + 1,
          currentPosition: [Wt.lat, Wt.lng]
        });
      }
      if (Xt >= at) {
        g.current && (cancelAnimationFrame(g.current), g.current = null);
        const Ut = Ha(le, at, St);
        return m(Ut), {
          ...H,
          status: "finished",
          distanceTraveled: at,
          routeProgress: 1,
          elapsedTime: H.elapsedTime + G,
          currentSpeed: 0,
          currentPosition: [Ut.lat, Ut.lng]
        };
      }
      const Ze = Ha(le, Xt, St);
      return m(Ze), {
        ...H,
        distanceTraveled: Xt,
        routeProgress: Xt / at,
        elapsedTime: H.elapsedTime + G,
        currentSpeed: K,
        currentPosition: [Ze.lat, Ze.lng]
      };
    }), g.current = requestAnimationFrame(Qt);
  }, []), _t = si(() => {
    mt && (h((it) => it.status === "finished" ? it : { ...it, status: "playing" }), w.current = 0, g.current = requestAnimationFrame(Qt));
  }, [mt, Qt]), Et = si(() => {
    g.current && (cancelAnimationFrame(g.current), g.current = null), h((it) => ({ ...it, status: "paused" }));
  }, []);
  return $t(() => () => {
    g.current && cancelAnimationFrame(g.current);
  }, []), {
    state: u,
    position: d,
    play: _t,
    pause: Et,
    reset: xt,
    isReady: mt
  };
}
function TC({
  state: t,
  totalDistance: n,
  unlockFee: i,
  perMinuteRate: s
}) {
  return Os(() => {
    const { elapsedTime: a, totalWaitTime: u, currentWaitTime: h, isWaitingAtLight: d } = t, m = u + (d ? h : 0), g = a / 60, y = (a - m) / 60, x = m / 60, E = y * s, C = x * s, I = i + g * s, lt = PC(n) / 60, nt = i + lt * s, ht = x * s, mt = n / 1e3, Kt = Va.UNLOCK_FEE + mt * Va.PER_KM, xt = i + y * s;
    return {
      unlockFee: i,
      ridingCost: E,
      waitingCost: C,
      totalCost: I,
      idealCost: nt,
      stopRevenue: ht,
      distanceBasedCost: Kt,
      motionOnlyCost: xt
    };
  }, [t, n, i, s]);
}
function PC(t) {
  const { MAX_SPEED_MS: n, ACCELERATION_TIME: i, BRAKING_TIME: s, ACCELERATION_RATE: a, DECELERATION_RATE: u } = be, h = 0.5 * a * i * i, d = 0.5 * u * s * s, m = h + d;
  if (t <= m) {
    const y = (a + u) / 2;
    return 2 * Math.sqrt(t / y);
  }
  const w = (t - m) / n;
  return i + w + s;
}
function Jp(t, n) {
  const i = vt(n);
  $t(function() {
    n !== i.current && t.attributionControl != null && (i.current != null && t.attributionControl.removeAttribution(i.current), n != null && t.attributionControl.addAttribution(n)), i.current = n;
  }, [
    t,
    n
  ]);
}
function xC(t, n, i) {
  n.center !== i.center && t.setLatLng(n.center), n.radius != null && n.radius !== i.radius && t.setRadius(n.radius);
}
const EC = 1;
function MC(t) {
  return Object.freeze({
    __version: EC,
    map: t
  });
}
function Yu(t, n) {
  return Object.freeze({
    ...t,
    ...n
  });
}
const Yp = Pv(null), Xp = Yp.Provider;
function Jo() {
  const t = xv(Yp);
  if (t == null)
    throw new Error("No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>");
  return t;
}
function Qp(t) {
  function n(i, s) {
    const { instance: a, context: u } = t(i).current;
    return yo(s, () => a), i.children == null ? null : /* @__PURE__ */ Wa.createElement(Xp, {
      value: u
    }, i.children);
  }
  return /* @__PURE__ */ vo(n);
}
function kC(t) {
  function n(i, s) {
    const [a, u] = kt(!1), { instance: h } = t(i, u).current;
    yo(s, () => h), $t(function() {
      a && h.update();
    }, [
      h,
      a,
      i.children
    ]);
    const d = h._contentNode;
    return d ? /* @__PURE__ */ Ev(i.children, d) : null;
  }
  return /* @__PURE__ */ vo(n);
}
function LC(t) {
  function n(i, s) {
    const { instance: a } = t(i).current;
    return yo(s, () => a), null;
  }
  return /* @__PURE__ */ vo(n);
}
function Xu(t, n) {
  const i = vt();
  $t(function() {
    return n != null && t.instance.on(n), i.current = n, function() {
      i.current != null && t.instance.off(i.current), i.current = null;
    };
  }, [
    t,
    n
  ]);
}
function Yo(t, n) {
  const i = t.pane ?? n.pane;
  return i ? {
    ...t,
    pane: i
  } : t;
}
function CC(t, n) {
  return function(s, a) {
    const u = Jo(), h = t(Yo(s, u), u);
    return Jp(u.map, s.attribution), Xu(h.current, s.eventHandlers), n(h.current, u, s, a), h;
  };
}
var IC = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function OC(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var $c = { exports: {} };
/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
(function(t, n) {
  (function(i, s) {
    s(n);
  })(IC, function(i) {
    var s = "1.9.4";
    function a(e) {
      var r, o, c, l;
      for (o = 1, c = arguments.length; o < c; o++) {
        l = arguments[o];
        for (r in l)
          e[r] = l[r];
      }
      return e;
    }
    var u = Object.create || /* @__PURE__ */ function() {
      function e() {
      }
      return function(r) {
        return e.prototype = r, new e();
      };
    }();
    function h(e, r) {
      var o = Array.prototype.slice;
      if (e.bind)
        return e.bind.apply(e, o.call(arguments, 1));
      var c = o.call(arguments, 2);
      return function() {
        return e.apply(r, c.length ? c.concat(o.call(arguments)) : arguments);
      };
    }
    var d = 0;
    function m(e) {
      return "_leaflet_id" in e || (e._leaflet_id = ++d), e._leaflet_id;
    }
    function g(e, r, o) {
      var c, l, f, p;
      return p = function() {
        c = !1, l && (f.apply(o, l), l = !1);
      }, f = function() {
        c ? l = arguments : (e.apply(o, arguments), setTimeout(p, r), c = !0);
      }, f;
    }
    function w(e, r, o) {
      var c = r[1], l = r[0], f = c - l;
      return e === c && o ? e : ((e - l) % f + f) % f + l;
    }
    function y() {
      return !1;
    }
    function x(e, r) {
      if (r === !1)
        return e;
      var o = Math.pow(10, r === void 0 ? 6 : r);
      return Math.round(e * o) / o;
    }
    function E(e) {
      return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
    }
    function C(e) {
      return E(e).split(/\s+/);
    }
    function I(e, r) {
      Object.prototype.hasOwnProperty.call(e, "options") || (e.options = e.options ? u(e.options) : {});
      for (var o in r)
        e.options[o] = r[o];
      return e.options;
    }
    function D(e, r, o) {
      var c = [];
      for (var l in e)
        c.push(encodeURIComponent(o ? l.toUpperCase() : l) + "=" + encodeURIComponent(e[l]));
      return (!r || r.indexOf("?") === -1 ? "?" : "&") + c.join("&");
    }
    var lt = /\{ *([\w_ -]+) *\}/g;
    function nt(e, r) {
      return e.replace(lt, function(o, c) {
        var l = r[c];
        if (l === void 0)
          throw new Error("No value provided for variable " + o);
        return typeof l == "function" && (l = l(r)), l;
      });
    }
    var ht = Array.isArray || function(e) {
      return Object.prototype.toString.call(e) === "[object Array]";
    };
    function mt(e, r) {
      for (var o = 0; o < e.length; o++)
        if (e[o] === r)
          return o;
      return -1;
    }
    var Kt = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    function xt(e) {
      return window["webkit" + e] || window["moz" + e] || window["ms" + e];
    }
    var Qt = 0;
    function _t(e) {
      var r = +/* @__PURE__ */ new Date(), o = Math.max(0, 16 - (r - Qt));
      return Qt = r + o, window.setTimeout(e, o);
    }
    var Et = window.requestAnimationFrame || xt("RequestAnimationFrame") || _t, it = window.cancelAnimationFrame || xt("CancelAnimationFrame") || xt("CancelRequestAnimationFrame") || function(e) {
      window.clearTimeout(e);
    };
    function W(e, r, o) {
      if (o && Et === _t)
        e.call(r);
      else
        return Et.call(window, h(e, r));
    }
    function G(e) {
      e && it.call(window, e);
    }
    var le = {
      __proto__: null,
      extend: a,
      create: u,
      bind: h,
      get lastId() {
        return d;
      },
      stamp: m,
      throttle: g,
      wrapNum: w,
      falseFn: y,
      formatNum: x,
      trim: E,
      splitWords: C,
      setOptions: I,
      getParamString: D,
      template: nt,
      isArray: ht,
      indexOf: mt,
      emptyImageUrl: Kt,
      requestFn: Et,
      cancelFn: it,
      requestAnimFrame: W,
      cancelAnimFrame: G
    };
    function St() {
    }
    St.extend = function(e) {
      var r = function() {
        I(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
      }, o = r.__super__ = this.prototype, c = u(o);
      c.constructor = r, r.prototype = c;
      for (var l in this)
        Object.prototype.hasOwnProperty.call(this, l) && l !== "prototype" && l !== "__super__" && (r[l] = this[l]);
      return e.statics && a(r, e.statics), e.includes && (Te(e.includes), a.apply(null, [c].concat(e.includes))), a(c, e), delete c.statics, delete c.includes, c.options && (c.options = o.options ? u(o.options) : {}, a(c.options, e.options)), c._initHooks = [], c.callInitHooks = function() {
        if (!this._initHooksCalled) {
          o.callInitHooks && o.callInitHooks.call(this), this._initHooksCalled = !0;
          for (var f = 0, p = c._initHooks.length; f < p; f++)
            c._initHooks[f].call(this);
        }
      }, r;
    }, St.include = function(e) {
      var r = this.prototype.options;
      return a(this.prototype, e), e.options && (this.prototype.options = r, this.mergeOptions(e.options)), this;
    }, St.mergeOptions = function(e) {
      return a(this.prototype.options, e), this;
    }, St.addInitHook = function(e) {
      var r = Array.prototype.slice.call(arguments, 1), o = typeof e == "function" ? e : function() {
        this[e].apply(this, r);
      };
      return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(o), this;
    };
    function Te(e) {
      if (!(typeof L > "u" || !L || !L.Mixin)) {
        e = ht(e) ? e : [e];
        for (var r = 0; r < e.length; r++)
          e[r] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
      }
    }
    var at = {
      /* @method on(type: String, fn: Function, context?: Object): this
       * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
       *
       * @alternative
       * @method on(eventMap: Object): this
       * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
       */
      on: function(e, r, o) {
        if (typeof e == "object")
          for (var c in e)
            this._on(c, e[c], r);
        else {
          e = C(e);
          for (var l = 0, f = e.length; l < f; l++)
            this._on(e[l], r, o);
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
      off: function(e, r, o) {
        if (!arguments.length)
          delete this._events;
        else if (typeof e == "object")
          for (var c in e)
            this._off(c, e[c], r);
        else {
          e = C(e);
          for (var l = arguments.length === 1, f = 0, p = e.length; f < p; f++)
            l ? this._off(e[f]) : this._off(e[f], r, o);
        }
        return this;
      },
      // attach listener (without syntactic sugar now)
      _on: function(e, r, o, c) {
        if (typeof r != "function") {
          console.warn("wrong listener type: " + typeof r);
          return;
        }
        if (this._listens(e, r, o) === !1) {
          o === this && (o = void 0);
          var l = { fn: r, ctx: o };
          c && (l.once = !0), this._events = this._events || {}, this._events[e] = this._events[e] || [], this._events[e].push(l);
        }
      },
      _off: function(e, r, o) {
        var c, l, f;
        if (this._events && (c = this._events[e], !!c)) {
          if (arguments.length === 1) {
            if (this._firingCount)
              for (l = 0, f = c.length; l < f; l++)
                c[l].fn = y;
            delete this._events[e];
            return;
          }
          if (typeof r != "function") {
            console.warn("wrong listener type: " + typeof r);
            return;
          }
          var p = this._listens(e, r, o);
          if (p !== !1) {
            var b = c[p];
            this._firingCount && (b.fn = y, this._events[e] = c = c.slice()), c.splice(p, 1);
          }
        }
      },
      // @method fire(type: String, data?: Object, propagate?: Boolean): this
      // Fires an event of the specified type. You can optionally provide a data
      // object — the first argument of the listener function will contain its
      // properties. The event can optionally be propagated to event parents.
      fire: function(e, r, o) {
        if (!this.listens(e, o))
          return this;
        var c = a({}, r, {
          type: e,
          target: this,
          sourceTarget: r && r.sourceTarget || this
        });
        if (this._events) {
          var l = this._events[e];
          if (l) {
            this._firingCount = this._firingCount + 1 || 1;
            for (var f = 0, p = l.length; f < p; f++) {
              var b = l[f], S = b.fn;
              b.once && this.off(e, S, b.ctx), S.call(b.ctx || this, c);
            }
            this._firingCount--;
          }
        }
        return o && this._propagateEvent(c), this;
      },
      // @method listens(type: String, propagate?: Boolean): Boolean
      // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
      // Returns `true` if a particular event type has any listeners attached to it.
      // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
      listens: function(e, r, o, c) {
        typeof e != "string" && console.warn('"string" type argument expected');
        var l = r;
        typeof r != "function" && (c = !!r, l = void 0, o = void 0);
        var f = this._events && this._events[e];
        if (f && f.length && this._listens(e, l, o) !== !1)
          return !0;
        if (c) {
          for (var p in this._eventParents)
            if (this._eventParents[p].listens(e, r, o, c))
              return !0;
        }
        return !1;
      },
      // returns the index (number) or false
      _listens: function(e, r, o) {
        if (!this._events)
          return !1;
        var c = this._events[e] || [];
        if (!r)
          return !!c.length;
        o === this && (o = void 0);
        for (var l = 0, f = c.length; l < f; l++)
          if (c[l].fn === r && c[l].ctx === o)
            return l;
        return !1;
      },
      // @method once(…): this
      // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
      once: function(e, r, o) {
        if (typeof e == "object")
          for (var c in e)
            this._on(c, e[c], r, !0);
        else {
          e = C(e);
          for (var l = 0, f = e.length; l < f; l++)
            this._on(e[l], r, o, !0);
        }
        return this;
      },
      // @method addEventParent(obj: Evented): this
      // Adds an event parent - an `Evented` that will receive propagated events
      addEventParent: function(e) {
        return this._eventParents = this._eventParents || {}, this._eventParents[m(e)] = e, this;
      },
      // @method removeEventParent(obj: Evented): this
      // Removes an event parent, so it will stop receiving propagated events
      removeEventParent: function(e) {
        return this._eventParents && delete this._eventParents[m(e)], this;
      },
      _propagateEvent: function(e) {
        for (var r in this._eventParents)
          this._eventParents[r].fire(e.type, a({
            layer: e.target,
            propagatedFrom: e.target
          }, e), !0);
      }
    };
    at.addEventListener = at.on, at.removeEventListener = at.clearAllEventListeners = at.off, at.addOneTimeEventListener = at.once, at.fireEvent = at.fire, at.hasEventListeners = at.listens;
    var H = St.extend(at);
    function R(e, r, o) {
      this.x = o ? Math.round(e) : e, this.y = o ? Math.round(r) : r;
    }
    var Ie = Math.trunc || function(e) {
      return e > 0 ? Math.floor(e) : Math.ceil(e);
    };
    R.prototype = {
      // @method clone(): Point
      // Returns a copy of the current point.
      clone: function() {
        return new R(this.x, this.y);
      },
      // @method add(otherPoint: Point): Point
      // Returns the result of addition of the current and the given points.
      add: function(e) {
        return this.clone()._add($(e));
      },
      _add: function(e) {
        return this.x += e.x, this.y += e.y, this;
      },
      // @method subtract(otherPoint: Point): Point
      // Returns the result of subtraction of the given point from the current.
      subtract: function(e) {
        return this.clone()._subtract($(e));
      },
      _subtract: function(e) {
        return this.x -= e.x, this.y -= e.y, this;
      },
      // @method divideBy(num: Number): Point
      // Returns the result of division of the current point by the given number.
      divideBy: function(e) {
        return this.clone()._divideBy(e);
      },
      _divideBy: function(e) {
        return this.x /= e, this.y /= e, this;
      },
      // @method multiplyBy(num: Number): Point
      // Returns the result of multiplication of the current point by the given number.
      multiplyBy: function(e) {
        return this.clone()._multiplyBy(e);
      },
      _multiplyBy: function(e) {
        return this.x *= e, this.y *= e, this;
      },
      // @method scaleBy(scale: Point): Point
      // Multiply each coordinate of the current point by each coordinate of
      // `scale`. In linear algebra terms, multiply the point by the
      // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
      // defined by `scale`.
      scaleBy: function(e) {
        return new R(this.x * e.x, this.y * e.y);
      },
      // @method unscaleBy(scale: Point): Point
      // Inverse of `scaleBy`. Divide each coordinate of the current point by
      // each coordinate of `scale`.
      unscaleBy: function(e) {
        return new R(this.x / e.x, this.y / e.y);
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
        return this.x = Ie(this.x), this.y = Ie(this.y), this;
      },
      // @method distanceTo(otherPoint: Point): Number
      // Returns the cartesian distance between the current and the given points.
      distanceTo: function(e) {
        e = $(e);
        var r = e.x - this.x, o = e.y - this.y;
        return Math.sqrt(r * r + o * o);
      },
      // @method equals(otherPoint: Point): Boolean
      // Returns `true` if the given point has the same coordinates.
      equals: function(e) {
        return e = $(e), e.x === this.x && e.y === this.y;
      },
      // @method contains(otherPoint: Point): Boolean
      // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
      contains: function(e) {
        return e = $(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
      },
      // @method toString(): String
      // Returns a string representation of the point for debugging purposes.
      toString: function() {
        return "Point(" + x(this.x) + ", " + x(this.y) + ")";
      }
    };
    function $(e, r, o) {
      return e instanceof R ? e : ht(e) ? new R(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new R(e.x, e.y) : new R(e, r, o);
    }
    function ot(e, r) {
      if (e)
        for (var o = r ? [e, r] : e, c = 0, l = o.length; c < l; c++)
          this.extend(o[c]);
    }
    ot.prototype = {
      // @method extend(point: Point): this
      // Extends the bounds to contain the given point.
      // @alternative
      // @method extend(otherBounds: Bounds): this
      // Extend the bounds to contain the given bounds
      extend: function(e) {
        var r, o;
        if (!e)
          return this;
        if (e instanceof R || typeof e[0] == "number" || "x" in e)
          r = o = $(e);
        else if (e = Gt(e), r = e.min, o = e.max, !r || !o)
          return this;
        return !this.min && !this.max ? (this.min = r.clone(), this.max = o.clone()) : (this.min.x = Math.min(r.x, this.min.x), this.max.x = Math.max(o.x, this.max.x), this.min.y = Math.min(r.y, this.min.y), this.max.y = Math.max(o.y, this.max.y)), this;
      },
      // @method getCenter(round?: Boolean): Point
      // Returns the center point of the bounds.
      getCenter: function(e) {
        return $(
          (this.min.x + this.max.x) / 2,
          (this.min.y + this.max.y) / 2,
          e
        );
      },
      // @method getBottomLeft(): Point
      // Returns the bottom-left point of the bounds.
      getBottomLeft: function() {
        return $(this.min.x, this.max.y);
      },
      // @method getTopRight(): Point
      // Returns the top-right point of the bounds.
      getTopRight: function() {
        return $(this.max.x, this.min.y);
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
      contains: function(e) {
        var r, o;
        return typeof e[0] == "number" || e instanceof R ? e = $(e) : e = Gt(e), e instanceof ot ? (r = e.min, o = e.max) : r = o = e, r.x >= this.min.x && o.x <= this.max.x && r.y >= this.min.y && o.y <= this.max.y;
      },
      // @method intersects(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds
      // intersect if they have at least one point in common.
      intersects: function(e) {
        e = Gt(e);
        var r = this.min, o = this.max, c = e.min, l = e.max, f = l.x >= r.x && c.x <= o.x, p = l.y >= r.y && c.y <= o.y;
        return f && p;
      },
      // @method overlaps(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds
      // overlap if their intersection is an area.
      overlaps: function(e) {
        e = Gt(e);
        var r = this.min, o = this.max, c = e.min, l = e.max, f = l.x > r.x && c.x < o.x, p = l.y > r.y && c.y < o.y;
        return f && p;
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
      pad: function(e) {
        var r = this.min, o = this.max, c = Math.abs(r.x - o.x) * e, l = Math.abs(r.y - o.y) * e;
        return Gt(
          $(r.x - c, r.y - l),
          $(o.x + c, o.y + l)
        );
      },
      // @method equals(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle is equivalent to the given bounds.
      equals: function(e) {
        return e ? (e = Gt(e), this.min.equals(e.getTopLeft()) && this.max.equals(e.getBottomRight())) : !1;
      }
    };
    function Gt(e, r) {
      return !e || e instanceof ot ? e : new ot(e, r);
    }
    function bt(e, r) {
      if (e)
        for (var o = r ? [e, r] : e, c = 0, l = o.length; c < l; c++)
          this.extend(o[c]);
    }
    bt.prototype = {
      // @method extend(latlng: LatLng): this
      // Extend the bounds to contain the given point
      // @alternative
      // @method extend(otherBounds: LatLngBounds): this
      // Extend the bounds to contain the given bounds
      extend: function(e) {
        var r = this._southWest, o = this._northEast, c, l;
        if (e instanceof A)
          c = e, l = e;
        else if (e instanceof bt) {
          if (c = e._southWest, l = e._northEast, !c || !l)
            return this;
        } else
          return e ? this.extend(K(e) || pt(e)) : this;
        return !r && !o ? (this._southWest = new A(c.lat, c.lng), this._northEast = new A(l.lat, l.lng)) : (r.lat = Math.min(c.lat, r.lat), r.lng = Math.min(c.lng, r.lng), o.lat = Math.max(l.lat, o.lat), o.lng = Math.max(l.lng, o.lng)), this;
      },
      // @method pad(bufferRatio: Number): LatLngBounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(e) {
        var r = this._southWest, o = this._northEast, c = Math.abs(r.lat - o.lat) * e, l = Math.abs(r.lng - o.lng) * e;
        return new bt(
          new A(r.lat - c, r.lng - l),
          new A(o.lat + c, o.lng + l)
        );
      },
      // @method getCenter(): LatLng
      // Returns the center point of the bounds.
      getCenter: function() {
        return new A(
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
        return new A(this.getNorth(), this.getWest());
      },
      // @method getSouthEast(): LatLng
      // Returns the south-east point of the bounds.
      getSouthEast: function() {
        return new A(this.getSouth(), this.getEast());
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
      contains: function(e) {
        typeof e[0] == "number" || e instanceof A || "lat" in e ? e = K(e) : e = pt(e);
        var r = this._southWest, o = this._northEast, c, l;
        return e instanceof bt ? (c = e.getSouthWest(), l = e.getNorthEast()) : c = l = e, c.lat >= r.lat && l.lat <= o.lat && c.lng >= r.lng && l.lng <= o.lng;
      },
      // @method intersects(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
      intersects: function(e) {
        e = pt(e);
        var r = this._southWest, o = this._northEast, c = e.getSouthWest(), l = e.getNorthEast(), f = l.lat >= r.lat && c.lat <= o.lat, p = l.lng >= r.lng && c.lng <= o.lng;
        return f && p;
      },
      // @method overlaps(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
      overlaps: function(e) {
        e = pt(e);
        var r = this._southWest, o = this._northEast, c = e.getSouthWest(), l = e.getNorthEast(), f = l.lat > r.lat && c.lat < o.lat, p = l.lng > r.lng && c.lng < o.lng;
        return f && p;
      },
      // @method toBBoxString(): String
      // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
      toBBoxString: function() {
        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
      },
      // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
      // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(e, r) {
        return e ? (e = pt(e), this._southWest.equals(e.getSouthWest(), r) && this._northEast.equals(e.getNorthEast(), r)) : !1;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this._southWest && this._northEast);
      }
    };
    function pt(e, r) {
      return e instanceof bt ? e : new bt(e, r);
    }
    function A(e, r, o) {
      if (isNaN(e) || isNaN(r))
        throw new Error("Invalid LatLng object: (" + e + ", " + r + ")");
      this.lat = +e, this.lng = +r, o !== void 0 && (this.alt = +o);
    }
    A.prototype = {
      // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
      // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(e, r) {
        if (!e)
          return !1;
        e = K(e);
        var o = Math.max(
          Math.abs(this.lat - e.lat),
          Math.abs(this.lng - e.lng)
        );
        return o <= (r === void 0 ? 1e-9 : r);
      },
      // @method toString(): String
      // Returns a string representation of the point (for debugging purposes).
      toString: function(e) {
        return "LatLng(" + x(this.lat, e) + ", " + x(this.lng, e) + ")";
      },
      // @method distanceTo(otherLatLng: LatLng): Number
      // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
      distanceTo: function(e) {
        return Xt.distance(this, K(e));
      },
      // @method wrap(): LatLng
      // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
      wrap: function() {
        return Xt.wrapLatLng(this);
      },
      // @method toBounds(sizeInMeters: Number): LatLngBounds
      // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
      toBounds: function(e) {
        var r = 180 * e / 40075017, o = r / Math.cos(Math.PI / 180 * this.lat);
        return pt(
          [this.lat - r, this.lng - o],
          [this.lat + r, this.lng + o]
        );
      },
      clone: function() {
        return new A(this.lat, this.lng, this.alt);
      }
    };
    function K(e, r, o) {
      return e instanceof A ? e : ht(e) && typeof e[0] != "object" ? e.length === 3 ? new A(e[0], e[1], e[2]) : e.length === 2 ? new A(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new A(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : r === void 0 ? null : new A(e, r, o);
    }
    var Yt = {
      // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
      // Projects geographical coordinates into pixel coordinates for a given zoom.
      latLngToPoint: function(e, r) {
        var o = this.projection.project(e), c = this.scale(r);
        return this.transformation._transform(o, c);
      },
      // @method pointToLatLng(point: Point, zoom: Number): LatLng
      // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
      // zoom into geographical coordinates.
      pointToLatLng: function(e, r) {
        var o = this.scale(r), c = this.transformation.untransform(e, o);
        return this.projection.unproject(c);
      },
      // @method project(latlng: LatLng): Point
      // Projects geographical coordinates into coordinates in units accepted for
      // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
      project: function(e) {
        return this.projection.project(e);
      },
      // @method unproject(point: Point): LatLng
      // Given a projected coordinate returns the corresponding LatLng.
      // The inverse of `project`.
      unproject: function(e) {
        return this.projection.unproject(e);
      },
      // @method scale(zoom: Number): Number
      // Returns the scale used when transforming projected coordinates into
      // pixel coordinates for a particular zoom. For example, it returns
      // `256 * 2^zoom` for Mercator-based CRS.
      scale: function(e) {
        return 256 * Math.pow(2, e);
      },
      // @method zoom(scale: Number): Number
      // Inverse of `scale()`, returns the zoom level corresponding to a scale
      // factor of `scale`.
      zoom: function(e) {
        return Math.log(e / 256) / Math.LN2;
      },
      // @method getProjectedBounds(zoom: Number): Bounds
      // Returns the projection's bounds scaled and transformed for the provided `zoom`.
      getProjectedBounds: function(e) {
        if (this.infinite)
          return null;
        var r = this.projection.bounds, o = this.scale(e), c = this.transformation.transform(r.min, o), l = this.transformation.transform(r.max, o);
        return new ot(c, l);
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
      wrapLatLng: function(e) {
        var r = this.wrapLng ? w(e.lng, this.wrapLng, !0) : e.lng, o = this.wrapLat ? w(e.lat, this.wrapLat, !0) : e.lat, c = e.alt;
        return new A(o, r, c);
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring
      // that its center is within the CRS's bounds.
      // Only accepts actual `L.LatLngBounds` instances, not arrays.
      wrapLatLngBounds: function(e) {
        var r = e.getCenter(), o = this.wrapLatLng(r), c = r.lat - o.lat, l = r.lng - o.lng;
        if (c === 0 && l === 0)
          return e;
        var f = e.getSouthWest(), p = e.getNorthEast(), b = new A(f.lat - c, f.lng - l), S = new A(p.lat - c, p.lng - l);
        return new bt(b, S);
      }
    }, Xt = a({}, Yt, {
      wrapLng: [-180, 180],
      // Mean Earth Radius, as recommended for use by
      // the International Union of Geodesy and Geophysics,
      // see https://rosettacode.org/wiki/Haversine_formula
      R: 6371e3,
      // distance between two geographical points using spherical law of cosines approximation
      distance: function(e, r) {
        var o = Math.PI / 180, c = e.lat * o, l = r.lat * o, f = Math.sin((r.lat - e.lat) * o / 2), p = Math.sin((r.lng - e.lng) * o / 2), b = f * f + Math.cos(c) * Math.cos(l) * p * p, S = 2 * Math.atan2(Math.sqrt(b), Math.sqrt(1 - b));
        return this.R * S;
      }
    }), Ze = 6378137, Ut = {
      R: Ze,
      MAX_LATITUDE: 85.0511287798,
      project: function(e) {
        var r = Math.PI / 180, o = this.MAX_LATITUDE, c = Math.max(Math.min(o, e.lat), -o), l = Math.sin(c * r);
        return new R(
          this.R * e.lng * r,
          this.R * Math.log((1 + l) / (1 - l)) / 2
        );
      },
      unproject: function(e) {
        var r = 180 / Math.PI;
        return new A(
          (2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * r,
          e.x * r / this.R
        );
      },
      bounds: function() {
        var e = Ze * Math.PI;
        return new ot([-e, -e], [e, e]);
      }()
    };
    function Wt(e, r, o, c) {
      if (ht(e)) {
        this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3];
        return;
      }
      this._a = e, this._b = r, this._c = o, this._d = c;
    }
    Wt.prototype = {
      // @method transform(point: Point, scale?: Number): Point
      // Returns a transformed point, optionally multiplied by the given scale.
      // Only accepts actual `L.Point` instances, not arrays.
      transform: function(e, r) {
        return this._transform(e.clone(), r);
      },
      // destructive transform (faster)
      _transform: function(e, r) {
        return r = r || 1, e.x = r * (this._a * e.x + this._b), e.y = r * (this._c * e.y + this._d), e;
      },
      // @method untransform(point: Point, scale?: Number): Point
      // Returns the reverse transformation of the given point, optionally divided
      // by the given scale. Only accepts actual `L.Point` instances, not arrays.
      untransform: function(e, r) {
        return r = r || 1, new R(
          (e.x / r - this._b) / this._a,
          (e.y / r - this._d) / this._c
        );
      }
    };
    function He(e, r, o, c) {
      return new Wt(e, r, o, c);
    }
    var sn = a({}, Xt, {
      code: "EPSG:3857",
      projection: Ut,
      transformation: function() {
        var e = 0.5 / (Math.PI * Ut.R);
        return He(e, 0.5, -e, 0.5);
      }()
    }), Bi = a({}, sn, {
      code: "EPSG:900913"
    });
    function ns(e) {
      return document.createElementNS("http://www.w3.org/2000/svg", e);
    }
    function is(e, r) {
      var o = "", c, l, f, p, b, S;
      for (c = 0, f = e.length; c < f; c++) {
        for (b = e[c], l = 0, p = b.length; l < p; l++)
          S = b[l], o += (l ? "L" : "M") + S.x + " " + S.y;
        o += r ? z.svg ? "z" : "x" : "";
      }
      return o || "M0 0";
    }
    var Di = document.documentElement.style, Mt = "ActiveXObject" in window, Oe = Mt && !document.addEventListener, Pe = "msLaunchUri" in navigator && !("documentMode" in document), je = Ne("webkit"), on = Ne("android"), _n = Ne("android 2") || Ne("android 3"), rs = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), Qo = on && Ne("Google") && rs < 537 && !("AudioNode" in window), Wn = !!window.opera, Zi = !Pe && Ne("chrome"), Hi = Ne("gecko") && !je && !Wn && !Mt, ta = !Zi && Ne("safari"), nl = Ne("phantom"), il = "OTransition" in Di, ig = navigator.platform.indexOf("Win") === 0, rl = Mt && "transition" in Di, ea = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !_n, sl = "MozPerspective" in Di, rg = !window.L_DISABLE_3D && (rl || ea || sl) && !il && !nl, ji = typeof orientation < "u" || Ne("mobile"), sg = ji && je, og = ji && ea, ol = !window.PointerEvent && window.MSPointerEvent, al = !!(window.PointerEvent || ol), cl = "ontouchstart" in window || !!window.TouchEvent, ag = !window.L_NO_TOUCH && (cl || al), cg = ji && Wn, ug = ji && Hi, lg = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, hg = function() {
      var e = !1;
      try {
        var r = Object.defineProperty({}, "passive", {
          get: function() {
            e = !0;
          }
        });
        window.addEventListener("testPassiveEventSupport", y, r), window.removeEventListener("testPassiveEventSupport", y, r);
      } catch {
      }
      return e;
    }(), fg = function() {
      return !!document.createElement("canvas").getContext;
    }(), na = !!(document.createElementNS && ns("svg").createSVGRect), dg = !!na && function() {
      var e = document.createElement("div");
      return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
    }(), mg = !na && function() {
      try {
        var e = document.createElement("div");
        e.innerHTML = '<v:shape adj="1"/>';
        var r = e.firstChild;
        return r.style.behavior = "url(#default#VML)", r && typeof r.adj == "object";
      } catch {
        return !1;
      }
    }(), _g = navigator.platform.indexOf("Mac") === 0, pg = navigator.platform.indexOf("Linux") === 0;
    function Ne(e) {
      return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
    }
    var z = {
      ie: Mt,
      ielt9: Oe,
      edge: Pe,
      webkit: je,
      android: on,
      android23: _n,
      androidStock: Qo,
      opera: Wn,
      chrome: Zi,
      gecko: Hi,
      safari: ta,
      phantom: nl,
      opera12: il,
      win: ig,
      ie3d: rl,
      webkit3d: ea,
      gecko3d: sl,
      any3d: rg,
      mobile: ji,
      mobileWebkit: sg,
      mobileWebkit3d: og,
      msPointer: ol,
      pointer: al,
      touch: ag,
      touchNative: cl,
      mobileOpera: cg,
      mobileGecko: ug,
      retina: lg,
      passiveEvents: hg,
      canvas: fg,
      svg: na,
      vml: mg,
      inlineSvg: dg,
      mac: _g,
      linux: pg
    }, ul = z.msPointer ? "MSPointerDown" : "pointerdown", ll = z.msPointer ? "MSPointerMove" : "pointermove", hl = z.msPointer ? "MSPointerUp" : "pointerup", fl = z.msPointer ? "MSPointerCancel" : "pointercancel", ia = {
      touchstart: ul,
      touchmove: ll,
      touchend: hl,
      touchcancel: fl
    }, dl = {
      touchstart: Sg,
      touchmove: ss,
      touchend: ss,
      touchcancel: ss
    }, Vn = {}, ml = !1;
    function gg(e, r, o) {
      return r === "touchstart" && wg(), dl[r] ? (o = dl[r].bind(this, o), e.addEventListener(ia[r], o, !1), o) : (console.warn("wrong event specified:", r), y);
    }
    function vg(e, r, o) {
      if (!ia[r]) {
        console.warn("wrong event specified:", r);
        return;
      }
      e.removeEventListener(ia[r], o, !1);
    }
    function yg(e) {
      Vn[e.pointerId] = e;
    }
    function bg(e) {
      Vn[e.pointerId] && (Vn[e.pointerId] = e);
    }
    function _l(e) {
      delete Vn[e.pointerId];
    }
    function wg() {
      ml || (document.addEventListener(ul, yg, !0), document.addEventListener(ll, bg, !0), document.addEventListener(hl, _l, !0), document.addEventListener(fl, _l, !0), ml = !0);
    }
    function ss(e, r) {
      if (r.pointerType !== (r.MSPOINTER_TYPE_MOUSE || "mouse")) {
        r.touches = [];
        for (var o in Vn)
          r.touches.push(Vn[o]);
        r.changedTouches = [r], e(r);
      }
    }
    function Sg(e, r) {
      r.MSPOINTER_TYPE_TOUCH && r.pointerType === r.MSPOINTER_TYPE_TOUCH && Jt(r), ss(e, r);
    }
    function Tg(e) {
      var r = {}, o, c;
      for (c in e)
        o = e[c], r[c] = o && o.bind ? o.bind(e) : o;
      return e = r, r.type = "dblclick", r.detail = 2, r.isTrusted = !1, r._simulated = !0, r;
    }
    var Pg = 200;
    function xg(e, r) {
      e.addEventListener("dblclick", r);
      var o = 0, c;
      function l(f) {
        if (f.detail !== 1) {
          c = f.detail;
          return;
        }
        if (!(f.pointerType === "mouse" || f.sourceCapabilities && !f.sourceCapabilities.firesTouchEvents)) {
          var p = bl(f);
          if (!(p.some(function(S) {
            return S instanceof HTMLLabelElement && S.attributes.for;
          }) && !p.some(function(S) {
            return S instanceof HTMLInputElement || S instanceof HTMLSelectElement;
          }))) {
            var b = Date.now();
            b - o <= Pg ? (c++, c === 2 && r(Tg(f))) : c = 1, o = b;
          }
        }
      }
      return e.addEventListener("click", l), {
        dblclick: r,
        simDblclick: l
      };
    }
    function Eg(e, r) {
      e.removeEventListener("dblclick", r.dblclick), e.removeEventListener("click", r.simDblclick);
    }
    var ra = cs(
      ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
    ), Ui = cs(
      ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
    ), pl = Ui === "webkitTransition" || Ui === "OTransition" ? Ui + "End" : "transitionend";
    function gl(e) {
      return typeof e == "string" ? document.getElementById(e) : e;
    }
    function Wi(e, r) {
      var o = e.style[r] || e.currentStyle && e.currentStyle[r];
      if ((!o || o === "auto") && document.defaultView) {
        var c = document.defaultView.getComputedStyle(e, null);
        o = c ? c[r] : null;
      }
      return o === "auto" ? null : o;
    }
    function ft(e, r, o) {
      var c = document.createElement(e);
      return c.className = r || "", o && o.appendChild(c), c;
    }
    function Pt(e) {
      var r = e.parentNode;
      r && r.removeChild(e);
    }
    function os(e) {
      for (; e.firstChild; )
        e.removeChild(e.firstChild);
    }
    function qn(e) {
      var r = e.parentNode;
      r && r.lastChild !== e && r.appendChild(e);
    }
    function Kn(e) {
      var r = e.parentNode;
      r && r.firstChild !== e && r.insertBefore(e, r.firstChild);
    }
    function sa(e, r) {
      if (e.classList !== void 0)
        return e.classList.contains(r);
      var o = as(e);
      return o.length > 0 && new RegExp("(^|\\s)" + r + "(\\s|$)").test(o);
    }
    function J(e, r) {
      if (e.classList !== void 0)
        for (var o = C(r), c = 0, l = o.length; c < l; c++)
          e.classList.add(o[c]);
      else if (!sa(e, r)) {
        var f = as(e);
        oa(e, (f ? f + " " : "") + r);
      }
    }
    function It(e, r) {
      e.classList !== void 0 ? e.classList.remove(r) : oa(e, E((" " + as(e) + " ").replace(" " + r + " ", " ")));
    }
    function oa(e, r) {
      e.className.baseVal === void 0 ? e.className = r : e.className.baseVal = r;
    }
    function as(e) {
      return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
    }
    function _e(e, r) {
      "opacity" in e.style ? e.style.opacity = r : "filter" in e.style && Mg(e, r);
    }
    function Mg(e, r) {
      var o = !1, c = "DXImageTransform.Microsoft.Alpha";
      try {
        o = e.filters.item(c);
      } catch {
        if (r === 1)
          return;
      }
      r = Math.round(r * 100), o ? (o.Enabled = r !== 100, o.Opacity = r) : e.style.filter += " progid:" + c + "(opacity=" + r + ")";
    }
    function cs(e) {
      for (var r = document.documentElement.style, o = 0; o < e.length; o++)
        if (e[o] in r)
          return e[o];
      return !1;
    }
    function pn(e, r, o) {
      var c = r || new R(0, 0);
      e.style[ra] = (z.ie3d ? "translate(" + c.x + "px," + c.y + "px)" : "translate3d(" + c.x + "px," + c.y + "px,0)") + (o ? " scale(" + o + ")" : "");
    }
    function Nt(e, r) {
      e._leaflet_pos = r, z.any3d ? pn(e, r) : (e.style.left = r.x + "px", e.style.top = r.y + "px");
    }
    function gn(e) {
      return e._leaflet_pos || new R(0, 0);
    }
    var Vi, qi, aa;
    if ("onselectstart" in document)
      Vi = function() {
        q(window, "selectstart", Jt);
      }, qi = function() {
        gt(window, "selectstart", Jt);
      };
    else {
      var Ki = cs(
        ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
      );
      Vi = function() {
        if (Ki) {
          var e = document.documentElement.style;
          aa = e[Ki], e[Ki] = "none";
        }
      }, qi = function() {
        Ki && (document.documentElement.style[Ki] = aa, aa = void 0);
      };
    }
    function ca() {
      q(window, "dragstart", Jt);
    }
    function ua() {
      gt(window, "dragstart", Jt);
    }
    var us, la;
    function ha(e) {
      for (; e.tabIndex === -1; )
        e = e.parentNode;
      e.style && (ls(), us = e, la = e.style.outlineStyle, e.style.outlineStyle = "none", q(window, "keydown", ls));
    }
    function ls() {
      us && (us.style.outlineStyle = la, us = void 0, la = void 0, gt(window, "keydown", ls));
    }
    function vl(e) {
      do
        e = e.parentNode;
      while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
      return e;
    }
    function fa(e) {
      var r = e.getBoundingClientRect();
      return {
        x: r.width / e.offsetWidth || 1,
        y: r.height / e.offsetHeight || 1,
        boundingClientRect: r
      };
    }
    var kg = {
      __proto__: null,
      TRANSFORM: ra,
      TRANSITION: Ui,
      TRANSITION_END: pl,
      get: gl,
      getStyle: Wi,
      create: ft,
      remove: Pt,
      empty: os,
      toFront: qn,
      toBack: Kn,
      hasClass: sa,
      addClass: J,
      removeClass: It,
      setClass: oa,
      getClass: as,
      setOpacity: _e,
      testProp: cs,
      setTransform: pn,
      setPosition: Nt,
      getPosition: gn,
      get disableTextSelection() {
        return Vi;
      },
      get enableTextSelection() {
        return qi;
      },
      disableImageDrag: ca,
      enableImageDrag: ua,
      preventOutline: ha,
      restoreOutline: ls,
      getSizedParentNode: vl,
      getScale: fa
    };
    function q(e, r, o, c) {
      if (r && typeof r == "object")
        for (var l in r)
          ma(e, l, r[l], o);
      else {
        r = C(r);
        for (var f = 0, p = r.length; f < p; f++)
          ma(e, r[f], o, c);
      }
      return this;
    }
    var Re = "_leaflet_events";
    function gt(e, r, o, c) {
      if (arguments.length === 1)
        yl(e), delete e[Re];
      else if (r && typeof r == "object")
        for (var l in r)
          _a(e, l, r[l], o);
      else if (r = C(r), arguments.length === 2)
        yl(e, function(b) {
          return mt(r, b) !== -1;
        });
      else
        for (var f = 0, p = r.length; f < p; f++)
          _a(e, r[f], o, c);
      return this;
    }
    function yl(e, r) {
      for (var o in e[Re]) {
        var c = o.split(/\d/)[0];
        (!r || r(c)) && _a(e, c, null, null, o);
      }
    }
    var da = {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      wheel: !("onwheel" in window) && "mousewheel"
    };
    function ma(e, r, o, c) {
      var l = r + m(o) + (c ? "_" + m(c) : "");
      if (e[Re] && e[Re][l])
        return this;
      var f = function(b) {
        return o.call(c || e, b || window.event);
      }, p = f;
      !z.touchNative && z.pointer && r.indexOf("touch") === 0 ? f = gg(e, r, f) : z.touch && r === "dblclick" ? f = xg(e, f) : "addEventListener" in e ? r === "touchstart" || r === "touchmove" || r === "wheel" || r === "mousewheel" ? e.addEventListener(da[r] || r, f, z.passiveEvents ? { passive: !1 } : !1) : r === "mouseenter" || r === "mouseleave" ? (f = function(b) {
        b = b || window.event, ga(e, b) && p(b);
      }, e.addEventListener(da[r], f, !1)) : e.addEventListener(r, p, !1) : e.attachEvent("on" + r, f), e[Re] = e[Re] || {}, e[Re][l] = f;
    }
    function _a(e, r, o, c, l) {
      l = l || r + m(o) + (c ? "_" + m(c) : "");
      var f = e[Re] && e[Re][l];
      if (!f)
        return this;
      !z.touchNative && z.pointer && r.indexOf("touch") === 0 ? vg(e, r, f) : z.touch && r === "dblclick" ? Eg(e, f) : "removeEventListener" in e ? e.removeEventListener(da[r] || r, f, !1) : e.detachEvent("on" + r, f), e[Re][l] = null;
    }
    function vn(e) {
      return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
    }
    function pa(e) {
      return ma(e, "wheel", vn), this;
    }
    function Gi(e) {
      return q(e, "mousedown touchstart dblclick contextmenu", vn), e._leaflet_disable_click = !0, this;
    }
    function Jt(e) {
      return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
    }
    function yn(e) {
      return Jt(e), vn(e), this;
    }
    function bl(e) {
      if (e.composedPath)
        return e.composedPath();
      for (var r = [], o = e.target; o; )
        r.push(o), o = o.parentNode;
      return r;
    }
    function wl(e, r) {
      if (!r)
        return new R(e.clientX, e.clientY);
      var o = fa(r), c = o.boundingClientRect;
      return new R(
        // offset.left/top values are in page scale (like clientX/Y),
        // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
        (e.clientX - c.left) / o.x - r.clientLeft,
        (e.clientY - c.top) / o.y - r.clientTop
      );
    }
    var Lg = z.linux && z.chrome ? window.devicePixelRatio : z.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
    function Sl(e) {
      return z.edge ? e.wheelDeltaY / 2 : (
        // Don't trust window-geometry-based delta
        e.deltaY && e.deltaMode === 0 ? -e.deltaY / Lg : (
          // Pixels
          e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : (
            // Lines
            e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : (
              // Pages
              e.deltaX || e.deltaZ ? 0 : (
                // Skip horizontal/depth wheel events
                e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : (
                  // Legacy IE pixels
                  e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : (
                    // Legacy Moz lines
                    e.detail ? e.detail / -32765 * 60 : (
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
    function ga(e, r) {
      var o = r.relatedTarget;
      if (!o)
        return !0;
      try {
        for (; o && o !== e; )
          o = o.parentNode;
      } catch {
        return !1;
      }
      return o !== e;
    }
    var Cg = {
      __proto__: null,
      on: q,
      off: gt,
      stopPropagation: vn,
      disableScrollPropagation: pa,
      disableClickPropagation: Gi,
      preventDefault: Jt,
      stop: yn,
      getPropagationPath: bl,
      getMousePosition: wl,
      getWheelDelta: Sl,
      isExternalTarget: ga,
      addListener: q,
      removeListener: gt
    }, Tl = H.extend({
      // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
      // Run an animation of a given element to a new position, optionally setting
      // duration in seconds (`0.25` by default) and easing linearity factor (3rd
      // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
      // `0.5` by default).
      run: function(e, r, o, c) {
        this.stop(), this._el = e, this._inProgress = !0, this._duration = o || 0.25, this._easeOutPower = 1 / Math.max(c || 0.5, 0.2), this._startPos = gn(e), this._offset = r.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
      },
      // @method stop()
      // Stops the animation (if currently running).
      stop: function() {
        this._inProgress && (this._step(!0), this._complete());
      },
      _animate: function() {
        this._animId = W(this._animate, this), this._step();
      },
      _step: function(e) {
        var r = +/* @__PURE__ */ new Date() - this._startTime, o = this._duration * 1e3;
        r < o ? this._runFrame(this._easeOut(r / o), e) : (this._runFrame(1), this._complete());
      },
      _runFrame: function(e, r) {
        var o = this._startPos.add(this._offset.multiplyBy(e));
        r && o._round(), Nt(this._el, o), this.fire("step");
      },
      _complete: function() {
        G(this._animId), this._inProgress = !1, this.fire("end");
      },
      _easeOut: function(e) {
        return 1 - Math.pow(1 - e, this._easeOutPower);
      }
    }), ct = H.extend({
      options: {
        // @section Map State Options
        // @option crs: CRS = L.CRS.EPSG3857
        // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
        // sure what it means.
        crs: sn,
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
      initialize: function(e, r) {
        r = I(this, r), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = h(this._onResize, this), this._initEvents(), r.maxBounds && this.setMaxBounds(r.maxBounds), r.zoom !== void 0 && (this._zoom = this._limitZoom(r.zoom)), r.center && r.zoom !== void 0 && this.setView(K(r.center), r.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = Ui && z.any3d && !z.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), q(this._proxy, pl, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
      },
      // @section Methods for modifying map state
      // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) with the given
      // animation options.
      setView: function(e, r, o) {
        if (r = r === void 0 ? this._zoom : this._limitZoom(r), e = this._limitCenter(K(e), r, this.options.maxBounds), o = o || {}, this._stop(), this._loaded && !o.reset && o !== !0) {
          o.animate !== void 0 && (o.zoom = a({ animate: o.animate }, o.zoom), o.pan = a({ animate: o.animate, duration: o.duration }, o.pan));
          var c = this._zoom !== r ? this._tryAnimatedZoom && this._tryAnimatedZoom(e, r, o.zoom) : this._tryAnimatedPan(e, o.pan);
          if (c)
            return clearTimeout(this._sizeTimer), this;
        }
        return this._resetView(e, r, o.pan && o.pan.noMoveStart), this;
      },
      // @method setZoom(zoom: Number, options?: Zoom/pan options): this
      // Sets the zoom of the map.
      setZoom: function(e, r) {
        return this._loaded ? this.setView(this.getCenter(), e, { zoom: r }) : (this._zoom = e, this);
      },
      // @method zoomIn(delta?: Number, options?: Zoom options): this
      // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomIn: function(e, r) {
        return e = e || (z.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + e, r);
      },
      // @method zoomOut(delta?: Number, options?: Zoom options): this
      // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomOut: function(e, r) {
        return e = e || (z.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - e, r);
      },
      // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified geographical point on the map
      // stationary (e.g. used internally for scroll zoom and double-click zoom).
      // @alternative
      // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
      setZoomAround: function(e, r, o) {
        var c = this.getZoomScale(r), l = this.getSize().divideBy(2), f = e instanceof R ? e : this.latLngToContainerPoint(e), p = f.subtract(l).multiplyBy(1 - 1 / c), b = this.containerPointToLatLng(l.add(p));
        return this.setView(b, r, { zoom: o });
      },
      _getBoundsCenterZoom: function(e, r) {
        r = r || {}, e = e.getBounds ? e.getBounds() : pt(e);
        var o = $(r.paddingTopLeft || r.padding || [0, 0]), c = $(r.paddingBottomRight || r.padding || [0, 0]), l = this.getBoundsZoom(e, !1, o.add(c));
        if (l = typeof r.maxZoom == "number" ? Math.min(r.maxZoom, l) : l, l === 1 / 0)
          return {
            center: e.getCenter(),
            zoom: l
          };
        var f = c.subtract(o).divideBy(2), p = this.project(e.getSouthWest(), l), b = this.project(e.getNorthEast(), l), S = this.unproject(p.add(b).divideBy(2).add(f), l);
        return {
          center: S,
          zoom: l
        };
      },
      // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets a map view that contains the given geographical bounds with the
      // maximum zoom level possible.
      fitBounds: function(e, r) {
        if (e = pt(e), !e.isValid())
          throw new Error("Bounds are not valid.");
        var o = this._getBoundsCenterZoom(e, r);
        return this.setView(o.center, o.zoom, r);
      },
      // @method fitWorld(options?: fitBounds options): this
      // Sets a map view that mostly contains the whole world with the maximum
      // zoom level possible.
      fitWorld: function(e) {
        return this.fitBounds([[-90, -180], [90, 180]], e);
      },
      // @method panTo(latlng: LatLng, options?: Pan options): this
      // Pans the map to a given center.
      panTo: function(e, r) {
        return this.setView(e, this._zoom, { pan: r });
      },
      // @method panBy(offset: Point, options?: Pan options): this
      // Pans the map by a given number of pixels (animated).
      panBy: function(e, r) {
        if (e = $(e).round(), r = r || {}, !e.x && !e.y)
          return this.fire("moveend");
        if (r.animate !== !0 && !this.getSize().contains(e))
          return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
        if (this._panAnim || (this._panAnim = new Tl(), this._panAnim.on({
          step: this._onPanTransitionStep,
          end: this._onPanTransitionEnd
        }, this)), r.noMoveStart || this.fire("movestart"), r.animate !== !1) {
          J(this._mapPane, "leaflet-pan-anim");
          var o = this._getMapPanePos().subtract(e).round();
          this._panAnim.run(this._mapPane, o, r.duration || 0.25, r.easeLinearity);
        } else
          this._rawPanBy(e), this.fire("move").fire("moveend");
        return this;
      },
      // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) performing a smooth
      // pan-zoom animation.
      flyTo: function(e, r, o) {
        if (o = o || {}, o.animate === !1 || !z.any3d)
          return this.setView(e, r, o);
        this._stop();
        var c = this.project(this.getCenter()), l = this.project(e), f = this.getSize(), p = this._zoom;
        e = K(e), r = r === void 0 ? p : r;
        var b = Math.max(f.x, f.y), S = b * this.getZoomScale(p, r), k = l.distanceTo(c) || 1, N = 1.42, j = N * N;
        function rt(Rt) {
          var Ss = Rt ? -1 : 1, vv = Rt ? S : b, yv = S * S - b * b + Ss * j * j * k * k, bv = 2 * vv * j * k, ka = yv / bv, ih = Math.sqrt(ka * ka + 1) - ka, wv = ih < 1e-9 ? -18 : Math.log(ih);
          return wv;
        }
        function te(Rt) {
          return (Math.exp(Rt) - Math.exp(-Rt)) / 2;
        }
        function Vt(Rt) {
          return (Math.exp(Rt) + Math.exp(-Rt)) / 2;
        }
        function ge(Rt) {
          return te(Rt) / Vt(Rt);
        }
        var ie = rt(0);
        function ti(Rt) {
          return b * (Vt(ie) / Vt(ie + N * Rt));
        }
        function mv(Rt) {
          return b * (Vt(ie) * ge(ie + N * Rt) - te(ie)) / j;
        }
        function _v(Rt) {
          return 1 - Math.pow(1 - Rt, 1.5);
        }
        var pv = Date.now(), eh = (rt(1) - ie) / N, gv = o.duration ? 1e3 * o.duration : 1e3 * eh * 0.8;
        function nh() {
          var Rt = (Date.now() - pv) / gv, Ss = _v(Rt) * eh;
          Rt <= 1 ? (this._flyToFrame = W(nh, this), this._move(
            this.unproject(c.add(l.subtract(c).multiplyBy(mv(Ss) / k)), p),
            this.getScaleZoom(b / ti(Ss), p),
            { flyTo: !0 }
          )) : this._move(e, r)._moveEnd(!0);
        }
        return this._moveStart(!0, o.noMoveStart), nh.call(this), this;
      },
      // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
      // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
      flyToBounds: function(e, r) {
        var o = this._getBoundsCenterZoom(e, r);
        return this.flyTo(o.center, o.zoom, r);
      },
      // @method setMaxBounds(bounds: LatLngBounds): this
      // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
      setMaxBounds: function(e) {
        return e = pt(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
      },
      // @method setMinZoom(zoom: Number): this
      // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
      setMinZoom: function(e) {
        var r = this.options.minZoom;
        return this.options.minZoom = e, this._loaded && r !== e && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(e) : this;
      },
      // @method setMaxZoom(zoom: Number): this
      // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
      setMaxZoom: function(e) {
        var r = this.options.maxZoom;
        return this.options.maxZoom = e, this._loaded && r !== e && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(e) : this;
      },
      // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
      // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
      panInsideBounds: function(e, r) {
        this._enforcingBounds = !0;
        var o = this.getCenter(), c = this._limitCenter(o, this._zoom, pt(e));
        return o.equals(c) || this.panTo(c, r), this._enforcingBounds = !1, this;
      },
      // @method panInside(latlng: LatLng, options?: padding options): this
      // Pans the map the minimum amount to make the `latlng` visible. Use
      // padding options to fit the display to more restricted bounds.
      // If `latlng` is already within the (optionally padded) display bounds,
      // the map will not be panned.
      panInside: function(e, r) {
        r = r || {};
        var o = $(r.paddingTopLeft || r.padding || [0, 0]), c = $(r.paddingBottomRight || r.padding || [0, 0]), l = this.project(this.getCenter()), f = this.project(e), p = this.getPixelBounds(), b = Gt([p.min.add(o), p.max.subtract(c)]), S = b.getSize();
        if (!b.contains(f)) {
          this._enforcingBounds = !0;
          var k = f.subtract(b.getCenter()), N = b.extend(f).getSize().subtract(S);
          l.x += k.x < 0 ? -N.x : N.x, l.y += k.y < 0 ? -N.y : N.y, this.panTo(this.unproject(l), r), this._enforcingBounds = !1;
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
      invalidateSize: function(e) {
        if (!this._loaded)
          return this;
        e = a({
          animate: !1,
          pan: !0
        }, e === !0 ? { animate: !0 } : e);
        var r = this.getSize();
        this._sizeChanged = !0, this._lastCenter = null;
        var o = this.getSize(), c = r.divideBy(2).round(), l = o.divideBy(2).round(), f = c.subtract(l);
        return !f.x && !f.y ? this : (e.animate && e.pan ? this.panBy(f) : (e.pan && this._rawPanBy(f), this.fire("move"), e.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(h(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
          oldSize: r,
          newSize: o
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
      locate: function(e) {
        if (e = this._locateOptions = a({
          timeout: 1e4,
          watch: !1
          // setView: false
          // maxZoom: <Number>
          // maximumAge: 0
          // enableHighAccuracy: false
        }, e), !("geolocation" in navigator))
          return this._handleGeolocationError({
            code: 0,
            message: "Geolocation not supported."
          }), this;
        var r = h(this._handleGeolocationResponse, this), o = h(this._handleGeolocationError, this);
        return e.watch ? this._locationWatchId = navigator.geolocation.watchPosition(r, o, e) : navigator.geolocation.getCurrentPosition(r, o, e), this;
      },
      // @method stopLocate(): this
      // Stops watching location previously initiated by `map.locate({watch: true})`
      // and aborts resetting the map view if map.locate was called with
      // `{setView: true}`.
      stopLocate: function() {
        return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
      },
      _handleGeolocationError: function(e) {
        if (this._container._leaflet_id) {
          var r = e.code, o = e.message || (r === 1 ? "permission denied" : r === 2 ? "position unavailable" : "timeout");
          this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
            code: r,
            message: "Geolocation error: " + o + "."
          });
        }
      },
      _handleGeolocationResponse: function(e) {
        if (this._container._leaflet_id) {
          var r = e.coords.latitude, o = e.coords.longitude, c = new A(r, o), l = c.toBounds(e.coords.accuracy * 2), f = this._locateOptions;
          if (f.setView) {
            var p = this.getBoundsZoom(l);
            this.setView(c, f.maxZoom ? Math.min(p, f.maxZoom) : p);
          }
          var b = {
            latlng: c,
            bounds: l,
            timestamp: e.timestamp
          };
          for (var S in e.coords)
            typeof e.coords[S] == "number" && (b[S] = e.coords[S]);
          this.fire("locationfound", b);
        }
      },
      // TODO Appropriate docs section?
      // @section Other Methods
      // @method addHandler(name: String, HandlerClass: Function): this
      // Adds a new `Handler` to the map, given its name and constructor function.
      addHandler: function(e, r) {
        if (!r)
          return this;
        var o = this[e] = new r(this);
        return this._handlers.push(o), this.options[e] && o.enable(), this;
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
        this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), Pt(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (G(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
        var e;
        for (e in this._layers)
          this._layers[e].remove();
        for (e in this._panes)
          Pt(this._panes[e]);
        return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
      },
      // @section Other Methods
      // @method createPane(name: String, container?: HTMLElement): HTMLElement
      // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
      // then returns it. The pane is created as a child of `container`, or
      // as a child of the main map pane if not set.
      createPane: function(e, r) {
        var o = "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), c = ft("div", o, r || this._mapPane);
        return e && (this._panes[e] = c), c;
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
        var e = this.getPixelBounds(), r = this.unproject(e.getBottomLeft()), o = this.unproject(e.getTopRight());
        return new bt(r, o);
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
      getBoundsZoom: function(e, r, o) {
        e = pt(e), o = $(o || [0, 0]);
        var c = this.getZoom() || 0, l = this.getMinZoom(), f = this.getMaxZoom(), p = e.getNorthWest(), b = e.getSouthEast(), S = this.getSize().subtract(o), k = Gt(this.project(b, c), this.project(p, c)).getSize(), N = z.any3d ? this.options.zoomSnap : 1, j = S.x / k.x, rt = S.y / k.y, te = r ? Math.max(j, rt) : Math.min(j, rt);
        return c = this.getScaleZoom(te, c), N && (c = Math.round(c / (N / 100)) * (N / 100), c = r ? Math.ceil(c / N) * N : Math.floor(c / N) * N), Math.max(l, Math.min(f, c));
      },
      // @method getSize(): Point
      // Returns the current size of the map container (in pixels).
      getSize: function() {
        return (!this._size || this._sizeChanged) && (this._size = new R(
          this._container.clientWidth || 0,
          this._container.clientHeight || 0
        ), this._sizeChanged = !1), this._size.clone();
      },
      // @method getPixelBounds(): Bounds
      // Returns the bounds of the current map view in projected pixel
      // coordinates (sometimes useful in layer and overlay implementations).
      getPixelBounds: function(e, r) {
        var o = this._getTopLeftPoint(e, r);
        return new ot(o, o.add(this.getSize()));
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
      getPixelWorldBounds: function(e) {
        return this.options.crs.getProjectedBounds(e === void 0 ? this.getZoom() : e);
      },
      // @section Other Methods
      // @method getPane(pane: String|HTMLElement): HTMLElement
      // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
      getPane: function(e) {
        return typeof e == "string" ? this._panes[e] : e;
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
      getZoomScale: function(e, r) {
        var o = this.options.crs;
        return r = r === void 0 ? this._zoom : r, o.scale(e) / o.scale(r);
      },
      // @method getScaleZoom(scale: Number, fromZoom: Number): Number
      // Returns the zoom level that the map would end up at, if it is at `fromZoom`
      // level and everything is scaled by a factor of `scale`. Inverse of
      // [`getZoomScale`](#map-getZoomScale).
      getScaleZoom: function(e, r) {
        var o = this.options.crs;
        r = r === void 0 ? this._zoom : r;
        var c = o.zoom(e * o.scale(r));
        return isNaN(c) ? 1 / 0 : c;
      },
      // @method project(latlng: LatLng, zoom: Number): Point
      // Projects a geographical coordinate `LatLng` according to the projection
      // of the map's CRS, then scales it according to `zoom` and the CRS's
      // `Transformation`. The result is pixel coordinate relative to
      // the CRS origin.
      project: function(e, r) {
        return r = r === void 0 ? this._zoom : r, this.options.crs.latLngToPoint(K(e), r);
      },
      // @method unproject(point: Point, zoom: Number): LatLng
      // Inverse of [`project`](#map-project).
      unproject: function(e, r) {
        return r = r === void 0 ? this._zoom : r, this.options.crs.pointToLatLng($(e), r);
      },
      // @method layerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding geographical coordinate (for the current zoom level).
      layerPointToLatLng: function(e) {
        var r = $(e).add(this.getPixelOrigin());
        return this.unproject(r);
      },
      // @method latLngToLayerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the [origin pixel](#map-getpixelorigin).
      latLngToLayerPoint: function(e) {
        var r = this.project(K(e))._round();
        return r._subtract(this.getPixelOrigin());
      },
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
      // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
      // CRS's bounds.
      // By default this means longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees.
      wrapLatLng: function(e) {
        return this.options.crs.wrapLatLng(K(e));
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring that
      // its center is within the CRS's bounds.
      // By default this means the center longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees, and the majority of the bounds
      // overlaps the CRS's bounds.
      wrapLatLngBounds: function(e) {
        return this.options.crs.wrapLatLngBounds(pt(e));
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates according to
      // the map's CRS. By default this measures distance in meters.
      distance: function(e, r) {
        return this.options.crs.distance(K(e), K(r));
      },
      // @method containerPointToLayerPoint(point: Point): Point
      // Given a pixel coordinate relative to the map container, returns the corresponding
      // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
      containerPointToLayerPoint: function(e) {
        return $(e).subtract(this._getMapPanePos());
      },
      // @method layerPointToContainerPoint(point: Point): Point
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding pixel coordinate relative to the map container.
      layerPointToContainerPoint: function(e) {
        return $(e).add(this._getMapPanePos());
      },
      // @method containerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the map container, returns
      // the corresponding geographical coordinate (for the current zoom level).
      containerPointToLatLng: function(e) {
        var r = this.containerPointToLayerPoint($(e));
        return this.layerPointToLatLng(r);
      },
      // @method latLngToContainerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the map container.
      latLngToContainerPoint: function(e) {
        return this.layerPointToContainerPoint(this.latLngToLayerPoint(K(e)));
      },
      // @method mouseEventToContainerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to the
      // map container where the event took place.
      mouseEventToContainerPoint: function(e) {
        return wl(e, this._container);
      },
      // @method mouseEventToLayerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to
      // the [origin pixel](#map-getpixelorigin) where the event took place.
      mouseEventToLayerPoint: function(e) {
        return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
      },
      // @method mouseEventToLatLng(ev: MouseEvent): LatLng
      // Given a MouseEvent object, returns geographical coordinate where the
      // event took place.
      mouseEventToLatLng: function(e) {
        return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
      },
      // map initialization methods
      _initContainer: function(e) {
        var r = this._container = gl(e);
        if (r) {
          if (r._leaflet_id)
            throw new Error("Map container is already initialized.");
        } else throw new Error("Map container not found.");
        q(r, "scroll", this._onScroll, this), this._containerId = m(r);
      },
      _initLayout: function() {
        var e = this._container;
        this._fadeAnimated = this.options.fadeAnimation && z.any3d, J(e, "leaflet-container" + (z.touch ? " leaflet-touch" : "") + (z.retina ? " leaflet-retina" : "") + (z.ielt9 ? " leaflet-oldie" : "") + (z.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
        var r = Wi(e, "position");
        r !== "absolute" && r !== "relative" && r !== "fixed" && r !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
      },
      _initPanes: function() {
        var e = this._panes = {};
        this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Nt(this._mapPane, new R(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (J(e.markerPane, "leaflet-zoom-hide"), J(e.shadowPane, "leaflet-zoom-hide"));
      },
      // private methods that modify map state
      // @section Map state change events
      _resetView: function(e, r, o) {
        Nt(this._mapPane, new R(0, 0));
        var c = !this._loaded;
        this._loaded = !0, r = this._limitZoom(r), this.fire("viewprereset");
        var l = this._zoom !== r;
        this._moveStart(l, o)._move(e, r)._moveEnd(l), this.fire("viewreset"), c && this.fire("load");
      },
      _moveStart: function(e, r) {
        return e && this.fire("zoomstart"), r || this.fire("movestart"), this;
      },
      _move: function(e, r, o, c) {
        r === void 0 && (r = this._zoom);
        var l = this._zoom !== r;
        return this._zoom = r, this._lastCenter = e, this._pixelOrigin = this._getNewPixelOrigin(e), c ? o && o.pinch && this.fire("zoom", o) : ((l || o && o.pinch) && this.fire("zoom", o), this.fire("move", o)), this;
      },
      _moveEnd: function(e) {
        return e && this.fire("zoomend"), this.fire("moveend");
      },
      _stop: function() {
        return G(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
      },
      _rawPanBy: function(e) {
        Nt(this._mapPane, this._getMapPanePos().subtract(e));
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
      _initEvents: function(e) {
        this._targets = {}, this._targets[m(this._container)] = this;
        var r = e ? gt : q;
        r(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && r(window, "resize", this._onResize, this), z.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
      },
      _onResize: function() {
        G(this._resizeRequest), this._resizeRequest = W(
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
        var e = this._getMapPanePos();
        Math.max(Math.abs(e.x), Math.abs(e.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
      },
      _findEventTargets: function(e, r) {
        for (var o = [], c, l = r === "mouseout" || r === "mouseover", f = e.target || e.srcElement, p = !1; f; ) {
          if (c = this._targets[m(f)], c && (r === "click" || r === "preclick") && this._draggableMoved(c)) {
            p = !0;
            break;
          }
          if (c && c.listens(r, !0) && (l && !ga(f, e) || (o.push(c), l)) || f === this._container)
            break;
          f = f.parentNode;
        }
        return !o.length && !p && !l && this.listens(r, !0) && (o = [this]), o;
      },
      _isClickDisabled: function(e) {
        for (; e && e !== this._container; ) {
          if (e._leaflet_disable_click)
            return !0;
          e = e.parentNode;
        }
      },
      _handleDOMEvent: function(e) {
        var r = e.target || e.srcElement;
        if (!(!this._loaded || r._leaflet_disable_events || e.type === "click" && this._isClickDisabled(r))) {
          var o = e.type;
          o === "mousedown" && ha(r), this._fireDOMEvent(e, o);
        }
      },
      _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
      _fireDOMEvent: function(e, r, o) {
        if (e.type === "click") {
          var c = a({}, e);
          c.type = "preclick", this._fireDOMEvent(c, c.type, o);
        }
        var l = this._findEventTargets(e, r);
        if (o) {
          for (var f = [], p = 0; p < o.length; p++)
            o[p].listens(r, !0) && f.push(o[p]);
          l = f.concat(l);
        }
        if (l.length) {
          r === "contextmenu" && Jt(e);
          var b = l[0], S = {
            originalEvent: e
          };
          if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
            var k = b.getLatLng && (!b._radius || b._radius <= 10);
            S.containerPoint = k ? this.latLngToContainerPoint(b.getLatLng()) : this.mouseEventToContainerPoint(e), S.layerPoint = this.containerPointToLayerPoint(S.containerPoint), S.latlng = k ? b.getLatLng() : this.layerPointToLatLng(S.layerPoint);
          }
          for (p = 0; p < l.length; p++)
            if (l[p].fire(r, S, !0), S.originalEvent._stopped || l[p].options.bubblingMouseEvents === !1 && mt(this._mouseEvents, r) !== -1)
              return;
        }
      },
      _draggableMoved: function(e) {
        return e = e.dragging && e.dragging.enabled() ? e : this, e.dragging && e.dragging.moved() || this.boxZoom && this.boxZoom.moved();
      },
      _clearHandlers: function() {
        for (var e = 0, r = this._handlers.length; e < r; e++)
          this._handlers[e].disable();
      },
      // @section Other Methods
      // @method whenReady(fn: Function, context?: Object): this
      // Runs the given function `fn` when the map gets initialized with
      // a view (center and zoom) and at least one layer, or immediately
      // if it's already initialized, optionally passing a function context.
      whenReady: function(e, r) {
        return this._loaded ? e.call(r || this, { target: this }) : this.on("load", e, r), this;
      },
      // private methods for getting map state
      _getMapPanePos: function() {
        return gn(this._mapPane) || new R(0, 0);
      },
      _moved: function() {
        var e = this._getMapPanePos();
        return e && !e.equals([0, 0]);
      },
      _getTopLeftPoint: function(e, r) {
        var o = e && r !== void 0 ? this._getNewPixelOrigin(e, r) : this.getPixelOrigin();
        return o.subtract(this._getMapPanePos());
      },
      _getNewPixelOrigin: function(e, r) {
        var o = this.getSize()._divideBy(2);
        return this.project(e, r)._subtract(o)._add(this._getMapPanePos())._round();
      },
      _latLngToNewLayerPoint: function(e, r, o) {
        var c = this._getNewPixelOrigin(o, r);
        return this.project(e, r)._subtract(c);
      },
      _latLngBoundsToNewLayerBounds: function(e, r, o) {
        var c = this._getNewPixelOrigin(o, r);
        return Gt([
          this.project(e.getSouthWest(), r)._subtract(c),
          this.project(e.getNorthWest(), r)._subtract(c),
          this.project(e.getSouthEast(), r)._subtract(c),
          this.project(e.getNorthEast(), r)._subtract(c)
        ]);
      },
      // layer point of the current center
      _getCenterLayerPoint: function() {
        return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
      },
      // offset of the specified place to the current center in pixels
      _getCenterOffset: function(e) {
        return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint());
      },
      // adjust center for view to get inside bounds
      _limitCenter: function(e, r, o) {
        if (!o)
          return e;
        var c = this.project(e, r), l = this.getSize().divideBy(2), f = new ot(c.subtract(l), c.add(l)), p = this._getBoundsOffset(f, o, r);
        return Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 ? e : this.unproject(c.add(p), r);
      },
      // adjust offset for view to get inside bounds
      _limitOffset: function(e, r) {
        if (!r)
          return e;
        var o = this.getPixelBounds(), c = new ot(o.min.add(e), o.max.add(e));
        return e.add(this._getBoundsOffset(c, r));
      },
      // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
      _getBoundsOffset: function(e, r, o) {
        var c = Gt(
          this.project(r.getNorthEast(), o),
          this.project(r.getSouthWest(), o)
        ), l = c.min.subtract(e.min), f = c.max.subtract(e.max), p = this._rebound(l.x, -f.x), b = this._rebound(l.y, -f.y);
        return new R(p, b);
      },
      _rebound: function(e, r) {
        return e + r > 0 ? Math.round(e - r) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(r));
      },
      _limitZoom: function(e) {
        var r = this.getMinZoom(), o = this.getMaxZoom(), c = z.any3d ? this.options.zoomSnap : 1;
        return c && (e = Math.round(e / c) * c), Math.max(r, Math.min(o, e));
      },
      _onPanTransitionStep: function() {
        this.fire("move");
      },
      _onPanTransitionEnd: function() {
        It(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
      },
      _tryAnimatedPan: function(e, r) {
        var o = this._getCenterOffset(e)._trunc();
        return (r && r.animate) !== !0 && !this.getSize().contains(o) ? !1 : (this.panBy(o, r), !0);
      },
      _createAnimProxy: function() {
        var e = this._proxy = ft("div", "leaflet-proxy leaflet-zoom-animated");
        this._panes.mapPane.appendChild(e), this.on("zoomanim", function(r) {
          var o = ra, c = this._proxy.style[o];
          pn(this._proxy, this.project(r.center, r.zoom), this.getZoomScale(r.zoom, 1)), c === this._proxy.style[o] && this._animatingZoom && this._onZoomTransitionEnd();
        }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
      },
      _destroyAnimProxy: function() {
        Pt(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
      },
      _animMoveEnd: function() {
        var e = this.getCenter(), r = this.getZoom();
        pn(this._proxy, this.project(e, r), this.getZoomScale(r, 1));
      },
      _catchTransitionEnd: function(e) {
        this._animatingZoom && e.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
      },
      _nothingToAnimate: function() {
        return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
      },
      _tryAnimatedZoom: function(e, r, o) {
        if (this._animatingZoom)
          return !0;
        if (o = o || {}, !this._zoomAnimated || o.animate === !1 || this._nothingToAnimate() || Math.abs(r - this._zoom) > this.options.zoomAnimationThreshold)
          return !1;
        var c = this.getZoomScale(r), l = this._getCenterOffset(e)._divideBy(1 - 1 / c);
        return o.animate !== !0 && !this.getSize().contains(l) ? !1 : (W(function() {
          this._moveStart(!0, o.noMoveStart || !1)._animateZoom(e, r, !0);
        }, this), !0);
      },
      _animateZoom: function(e, r, o, c) {
        this._mapPane && (o && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = r, J(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
          center: e,
          zoom: r,
          noUpdate: c
        }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(h(this._onZoomTransitionEnd, this), 250));
      },
      _onZoomTransitionEnd: function() {
        this._animatingZoom && (this._mapPane && It(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
      }
    });
    function Ig(e, r) {
      return new ct(e, r);
    }
    var xe = St.extend({
      // @section
      // @aka Control Options
      options: {
        // @option position: String = 'topright'
        // The position of the control (one of the map corners). Possible values are `'topleft'`,
        // `'topright'`, `'bottomleft'` or `'bottomright'`
        position: "topright"
      },
      initialize: function(e) {
        I(this, e);
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
      setPosition: function(e) {
        var r = this._map;
        return r && r.removeControl(this), this.options.position = e, r && r.addControl(this), this;
      },
      // @method getContainer: HTMLElement
      // Returns the HTMLElement that contains the control.
      getContainer: function() {
        return this._container;
      },
      // @method addTo(map: Map): this
      // Adds the control to the given map.
      addTo: function(e) {
        this.remove(), this._map = e;
        var r = this._container = this.onAdd(e), o = this.getPosition(), c = e._controlCorners[o];
        return J(r, "leaflet-control"), o.indexOf("bottom") !== -1 ? c.insertBefore(r, c.firstChild) : c.appendChild(r), this._map.on("unload", this.remove, this), this;
      },
      // @method remove: this
      // Removes the control from the map it is currently active on.
      remove: function() {
        return this._map ? (Pt(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
      },
      _refocusOnMap: function(e) {
        this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus();
      }
    }), Ji = function(e) {
      return new xe(e);
    };
    ct.include({
      // @method addControl(control: Control): this
      // Adds the given control to the map
      addControl: function(e) {
        return e.addTo(this), this;
      },
      // @method removeControl(control: Control): this
      // Removes the given control from the map
      removeControl: function(e) {
        return e.remove(), this;
      },
      _initControlPos: function() {
        var e = this._controlCorners = {}, r = "leaflet-", o = this._controlContainer = ft("div", r + "control-container", this._container);
        function c(l, f) {
          var p = r + l + " " + r + f;
          e[l + f] = ft("div", p, o);
        }
        c("top", "left"), c("top", "right"), c("bottom", "left"), c("bottom", "right");
      },
      _clearControlPos: function() {
        for (var e in this._controlCorners)
          Pt(this._controlCorners[e]);
        Pt(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
      }
    });
    var Pl = xe.extend({
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
        sortFunction: function(e, r, o, c) {
          return o < c ? -1 : c < o ? 1 : 0;
        }
      },
      initialize: function(e, r, o) {
        I(this, o), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
        for (var c in e)
          this._addLayer(e[c], c);
        for (c in r)
          this._addLayer(r[c], c, !0);
      },
      onAdd: function(e) {
        this._initLayout(), this._update(), this._map = e, e.on("zoomend", this._checkDisabledLayers, this);
        for (var r = 0; r < this._layers.length; r++)
          this._layers[r].layer.on("add remove", this._onLayerChange, this);
        return this._container;
      },
      addTo: function(e) {
        return xe.prototype.addTo.call(this, e), this._expandIfNotCollapsed();
      },
      onRemove: function() {
        this._map.off("zoomend", this._checkDisabledLayers, this);
        for (var e = 0; e < this._layers.length; e++)
          this._layers[e].layer.off("add remove", this._onLayerChange, this);
      },
      // @method addBaseLayer(layer: Layer, name: String): this
      // Adds a base layer (radio button entry) with the given name to the control.
      addBaseLayer: function(e, r) {
        return this._addLayer(e, r), this._map ? this._update() : this;
      },
      // @method addOverlay(layer: Layer, name: String): this
      // Adds an overlay (checkbox entry) with the given name to the control.
      addOverlay: function(e, r) {
        return this._addLayer(e, r, !0), this._map ? this._update() : this;
      },
      // @method removeLayer(layer: Layer): this
      // Remove the given layer from the control.
      removeLayer: function(e) {
        e.off("add remove", this._onLayerChange, this);
        var r = this._getLayer(m(e));
        return r && this._layers.splice(this._layers.indexOf(r), 1), this._map ? this._update() : this;
      },
      // @method expand(): this
      // Expand the control container if collapsed.
      expand: function() {
        J(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
        var e = this._map.getSize().y - (this._container.offsetTop + 50);
        return e < this._section.clientHeight ? (J(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : It(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
      },
      // @method collapse(): this
      // Collapse the control container if expanded.
      collapse: function() {
        return It(this._container, "leaflet-control-layers-expanded"), this;
      },
      _initLayout: function() {
        var e = "leaflet-control-layers", r = this._container = ft("div", e), o = this.options.collapsed;
        r.setAttribute("aria-haspopup", !0), Gi(r), pa(r);
        var c = this._section = ft("section", e + "-list");
        o && (this._map.on("click", this.collapse, this), q(r, {
          mouseenter: this._expandSafely,
          mouseleave: this.collapse
        }, this));
        var l = this._layersLink = ft("a", e + "-toggle", r);
        l.href = "#", l.title = "Layers", l.setAttribute("role", "button"), q(l, {
          keydown: function(f) {
            f.keyCode === 13 && this._expandSafely();
          },
          // Certain screen readers intercept the key event and instead send a click event
          click: function(f) {
            Jt(f), this._expandSafely();
          }
        }, this), o || this.expand(), this._baseLayersList = ft("div", e + "-base", c), this._separator = ft("div", e + "-separator", c), this._overlaysList = ft("div", e + "-overlays", c), r.appendChild(c);
      },
      _getLayer: function(e) {
        for (var r = 0; r < this._layers.length; r++)
          if (this._layers[r] && m(this._layers[r].layer) === e)
            return this._layers[r];
      },
      _addLayer: function(e, r, o) {
        this._map && e.on("add remove", this._onLayerChange, this), this._layers.push({
          layer: e,
          name: r,
          overlay: o
        }), this.options.sortLayers && this._layers.sort(h(function(c, l) {
          return this.options.sortFunction(c.layer, l.layer, c.name, l.name);
        }, this)), this.options.autoZIndex && e.setZIndex && (this._lastZIndex++, e.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
      },
      _update: function() {
        if (!this._container)
          return this;
        os(this._baseLayersList), os(this._overlaysList), this._layerControlInputs = [];
        var e, r, o, c, l = 0;
        for (o = 0; o < this._layers.length; o++)
          c = this._layers[o], this._addItem(c), r = r || c.overlay, e = e || !c.overlay, l += c.overlay ? 0 : 1;
        return this.options.hideSingleBase && (e = e && l > 1, this._baseLayersList.style.display = e ? "" : "none"), this._separator.style.display = r && e ? "" : "none", this;
      },
      _onLayerChange: function(e) {
        this._handlingClick || this._update();
        var r = this._getLayer(m(e.target)), o = r.overlay ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
        o && this._map.fire(o, r);
      },
      // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
      _createRadioElement: function(e, r) {
        var o = '<input type="radio" class="leaflet-control-layers-selector" name="' + e + '"' + (r ? ' checked="checked"' : "") + "/>", c = document.createElement("div");
        return c.innerHTML = o, c.firstChild;
      },
      _addItem: function(e) {
        var r = document.createElement("label"), o = this._map.hasLayer(e.layer), c;
        e.overlay ? (c = document.createElement("input"), c.type = "checkbox", c.className = "leaflet-control-layers-selector", c.defaultChecked = o) : c = this._createRadioElement("leaflet-base-layers_" + m(this), o), this._layerControlInputs.push(c), c.layerId = m(e.layer), q(c, "click", this._onInputClick, this);
        var l = document.createElement("span");
        l.innerHTML = " " + e.name;
        var f = document.createElement("span");
        r.appendChild(f), f.appendChild(c), f.appendChild(l);
        var p = e.overlay ? this._overlaysList : this._baseLayersList;
        return p.appendChild(r), this._checkDisabledLayers(), r;
      },
      _onInputClick: function() {
        if (!this._preventClick) {
          var e = this._layerControlInputs, r, o, c = [], l = [];
          this._handlingClick = !0;
          for (var f = e.length - 1; f >= 0; f--)
            r = e[f], o = this._getLayer(r.layerId).layer, r.checked ? c.push(o) : r.checked || l.push(o);
          for (f = 0; f < l.length; f++)
            this._map.hasLayer(l[f]) && this._map.removeLayer(l[f]);
          for (f = 0; f < c.length; f++)
            this._map.hasLayer(c[f]) || this._map.addLayer(c[f]);
          this._handlingClick = !1, this._refocusOnMap();
        }
      },
      _checkDisabledLayers: function() {
        for (var e = this._layerControlInputs, r, o, c = this._map.getZoom(), l = e.length - 1; l >= 0; l--)
          r = e[l], o = this._getLayer(r.layerId).layer, r.disabled = o.options.minZoom !== void 0 && c < o.options.minZoom || o.options.maxZoom !== void 0 && c > o.options.maxZoom;
      },
      _expandIfNotCollapsed: function() {
        return this._map && !this.options.collapsed && this.expand(), this;
      },
      _expandSafely: function() {
        var e = this._section;
        this._preventClick = !0, q(e, "click", Jt), this.expand();
        var r = this;
        setTimeout(function() {
          gt(e, "click", Jt), r._preventClick = !1;
        });
      }
    }), Og = function(e, r, o) {
      return new Pl(e, r, o);
    }, va = xe.extend({
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
      onAdd: function(e) {
        var r = "leaflet-control-zoom", o = ft("div", r + " leaflet-bar"), c = this.options;
        return this._zoomInButton = this._createButton(
          c.zoomInText,
          c.zoomInTitle,
          r + "-in",
          o,
          this._zoomIn
        ), this._zoomOutButton = this._createButton(
          c.zoomOutText,
          c.zoomOutTitle,
          r + "-out",
          o,
          this._zoomOut
        ), this._updateDisabled(), e.on("zoomend zoomlevelschange", this._updateDisabled, this), o;
      },
      onRemove: function(e) {
        e.off("zoomend zoomlevelschange", this._updateDisabled, this);
      },
      disable: function() {
        return this._disabled = !0, this._updateDisabled(), this;
      },
      enable: function() {
        return this._disabled = !1, this._updateDisabled(), this;
      },
      _zoomIn: function(e) {
        !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
      },
      _zoomOut: function(e) {
        !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
      },
      _createButton: function(e, r, o, c, l) {
        var f = ft("a", o, c);
        return f.innerHTML = e, f.href = "#", f.title = r, f.setAttribute("role", "button"), f.setAttribute("aria-label", r), Gi(f), q(f, "click", yn), q(f, "click", l, this), q(f, "click", this._refocusOnMap, this), f;
      },
      _updateDisabled: function() {
        var e = this._map, r = "leaflet-disabled";
        It(this._zoomInButton, r), It(this._zoomOutButton, r), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (J(this._zoomOutButton, r), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (J(this._zoomInButton, r), this._zoomInButton.setAttribute("aria-disabled", "true"));
      }
    });
    ct.mergeOptions({
      zoomControl: !0
    }), ct.addInitHook(function() {
      this.options.zoomControl && (this.zoomControl = new va(), this.addControl(this.zoomControl));
    });
    var Ng = function(e) {
      return new va(e);
    }, xl = xe.extend({
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
      onAdd: function(e) {
        var r = "leaflet-control-scale", o = ft("div", r), c = this.options;
        return this._addScales(c, r + "-line", o), e.on(c.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), o;
      },
      onRemove: function(e) {
        e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
      },
      _addScales: function(e, r, o) {
        e.metric && (this._mScale = ft("div", r, o)), e.imperial && (this._iScale = ft("div", r, o));
      },
      _update: function() {
        var e = this._map, r = e.getSize().y / 2, o = e.distance(
          e.containerPointToLatLng([0, r]),
          e.containerPointToLatLng([this.options.maxWidth, r])
        );
        this._updateScales(o);
      },
      _updateScales: function(e) {
        this.options.metric && e && this._updateMetric(e), this.options.imperial && e && this._updateImperial(e);
      },
      _updateMetric: function(e) {
        var r = this._getRoundNum(e), o = r < 1e3 ? r + " m" : r / 1e3 + " km";
        this._updateScale(this._mScale, o, r / e);
      },
      _updateImperial: function(e) {
        var r = e * 3.2808399, o, c, l;
        r > 5280 ? (o = r / 5280, c = this._getRoundNum(o), this._updateScale(this._iScale, c + " mi", c / o)) : (l = this._getRoundNum(r), this._updateScale(this._iScale, l + " ft", l / r));
      },
      _updateScale: function(e, r, o) {
        e.style.width = Math.round(this.options.maxWidth * o) + "px", e.innerHTML = r;
      },
      _getRoundNum: function(e) {
        var r = Math.pow(10, (Math.floor(e) + "").length - 1), o = e / r;
        return o = o >= 10 ? 10 : o >= 5 ? 5 : o >= 3 ? 3 : o >= 2 ? 2 : 1, r * o;
      }
    }), Rg = function(e) {
      return new xl(e);
    }, Ag = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', ya = xe.extend({
      // @section
      // @aka Control.Attribution options
      options: {
        position: "bottomright",
        // @option prefix: String|false = 'Leaflet'
        // The HTML text shown before the attributions. Pass `false` to disable.
        prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (z.inlineSvg ? Ag + " " : "") + "Leaflet</a>"
      },
      initialize: function(e) {
        I(this, e), this._attributions = {};
      },
      onAdd: function(e) {
        e.attributionControl = this, this._container = ft("div", "leaflet-control-attribution"), Gi(this._container);
        for (var r in e._layers)
          e._layers[r].getAttribution && this.addAttribution(e._layers[r].getAttribution());
        return this._update(), e.on("layeradd", this._addAttribution, this), this._container;
      },
      onRemove: function(e) {
        e.off("layeradd", this._addAttribution, this);
      },
      _addAttribution: function(e) {
        e.layer.getAttribution && (this.addAttribution(e.layer.getAttribution()), e.layer.once("remove", function() {
          this.removeAttribution(e.layer.getAttribution());
        }, this));
      },
      // @method setPrefix(prefix: String|false): this
      // The HTML text shown before the attributions. Pass `false` to disable.
      setPrefix: function(e) {
        return this.options.prefix = e, this._update(), this;
      },
      // @method addAttribution(text: String): this
      // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
      addAttribution: function(e) {
        return e ? (this._attributions[e] || (this._attributions[e] = 0), this._attributions[e]++, this._update(), this) : this;
      },
      // @method removeAttribution(text: String): this
      // Removes an attribution text.
      removeAttribution: function(e) {
        return e ? (this._attributions[e] && (this._attributions[e]--, this._update()), this) : this;
      },
      _update: function() {
        if (this._map) {
          var e = [];
          for (var r in this._attributions)
            this._attributions[r] && e.push(r);
          var o = [];
          this.options.prefix && o.push(this.options.prefix), e.length && o.push(e.join(", ")), this._container.innerHTML = o.join(' <span aria-hidden="true">|</span> ');
        }
      }
    });
    ct.mergeOptions({
      attributionControl: !0
    }), ct.addInitHook(function() {
      this.options.attributionControl && new ya().addTo(this);
    });
    var Fg = function(e) {
      return new ya(e);
    };
    xe.Layers = Pl, xe.Zoom = va, xe.Scale = xl, xe.Attribution = ya, Ji.layers = Og, Ji.zoom = Ng, Ji.scale = Rg, Ji.attribution = Fg;
    var Ae = St.extend({
      initialize: function(e) {
        this._map = e;
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
    Ae.addTo = function(e, r) {
      return e.addHandler(r, this), this;
    };
    var zg = { Events: at }, El = z.touch ? "touchstart mousedown" : "mousedown", an = H.extend({
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
      initialize: function(e, r, o, c) {
        I(this, c), this._element = e, this._dragStartTarget = r || e, this._preventOutline = o;
      },
      // @method enable()
      // Enables the dragging ability
      enable: function() {
        this._enabled || (q(this._dragStartTarget, El, this._onDown, this), this._enabled = !0);
      },
      // @method disable()
      // Disables the dragging ability
      disable: function() {
        this._enabled && (an._dragging === this && this.finishDrag(!0), gt(this._dragStartTarget, El, this._onDown, this), this._enabled = !1, this._moved = !1);
      },
      _onDown: function(e) {
        if (this._enabled && (this._moved = !1, !sa(this._element, "leaflet-zoom-anim"))) {
          if (e.touches && e.touches.length !== 1) {
            an._dragging === this && this.finishDrag();
            return;
          }
          if (!(an._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (an._dragging = this, this._preventOutline && ha(this._element), ca(), Vi(), !this._moving)) {
            this.fire("down");
            var r = e.touches ? e.touches[0] : e, o = vl(this._element);
            this._startPoint = new R(r.clientX, r.clientY), this._startPos = gn(this._element), this._parentScale = fa(o);
            var c = e.type === "mousedown";
            q(document, c ? "mousemove" : "touchmove", this._onMove, this), q(document, c ? "mouseup" : "touchend touchcancel", this._onUp, this);
          }
        }
      },
      _onMove: function(e) {
        if (this._enabled) {
          if (e.touches && e.touches.length > 1) {
            this._moved = !0;
            return;
          }
          var r = e.touches && e.touches.length === 1 ? e.touches[0] : e, o = new R(r.clientX, r.clientY)._subtract(this._startPoint);
          !o.x && !o.y || Math.abs(o.x) + Math.abs(o.y) < this.options.clickTolerance || (o.x /= this._parentScale.x, o.y /= this._parentScale.y, Jt(e), this._moved || (this.fire("dragstart"), this._moved = !0, J(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), J(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(o), this._moving = !0, this._lastEvent = e, this._updatePosition());
        }
      },
      _updatePosition: function() {
        var e = { originalEvent: this._lastEvent };
        this.fire("predrag", e), Nt(this._element, this._newPos), this.fire("drag", e);
      },
      _onUp: function() {
        this._enabled && this.finishDrag();
      },
      finishDrag: function(e) {
        It(document.body, "leaflet-dragging"), this._lastTarget && (It(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), gt(document, "mousemove touchmove", this._onMove, this), gt(document, "mouseup touchend touchcancel", this._onUp, this), ua(), qi();
        var r = this._moved && this._moving;
        this._moving = !1, an._dragging = !1, r && this.fire("dragend", {
          noInertia: e,
          distance: this._newPos.distanceTo(this._startPos)
        });
      }
    });
    function Ml(e, r, o) {
      var c, l = [1, 4, 2, 8], f, p, b, S, k, N, j, rt;
      for (f = 0, N = e.length; f < N; f++)
        e[f]._code = bn(e[f], r);
      for (b = 0; b < 4; b++) {
        for (j = l[b], c = [], f = 0, N = e.length, p = N - 1; f < N; p = f++)
          S = e[f], k = e[p], S._code & j ? k._code & j || (rt = hs(k, S, j, r, o), rt._code = bn(rt, r), c.push(rt)) : (k._code & j && (rt = hs(k, S, j, r, o), rt._code = bn(rt, r), c.push(rt)), c.push(S));
        e = c;
      }
      return e;
    }
    function kl(e, r) {
      var o, c, l, f, p, b, S, k, N;
      if (!e || e.length === 0)
        throw new Error("latlngs not passed");
      pe(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
      var j = K([0, 0]), rt = pt(e), te = rt.getNorthWest().distanceTo(rt.getSouthWest()) * rt.getNorthEast().distanceTo(rt.getNorthWest());
      te < 1700 && (j = ba(e));
      var Vt = e.length, ge = [];
      for (o = 0; o < Vt; o++) {
        var ie = K(e[o]);
        ge.push(r.project(K([ie.lat - j.lat, ie.lng - j.lng])));
      }
      for (b = S = k = 0, o = 0, c = Vt - 1; o < Vt; c = o++)
        l = ge[o], f = ge[c], p = l.y * f.x - f.y * l.x, S += (l.x + f.x) * p, k += (l.y + f.y) * p, b += p * 3;
      b === 0 ? N = ge[0] : N = [S / b, k / b];
      var ti = r.unproject($(N));
      return K([ti.lat + j.lat, ti.lng + j.lng]);
    }
    function ba(e) {
      for (var r = 0, o = 0, c = 0, l = 0; l < e.length; l++) {
        var f = K(e[l]);
        r += f.lat, o += f.lng, c++;
      }
      return K([r / c, o / c]);
    }
    var $g = {
      __proto__: null,
      clipPolygon: Ml,
      polygonCenter: kl,
      centroid: ba
    };
    function Ll(e, r) {
      if (!r || !e.length)
        return e.slice();
      var o = r * r;
      return e = Zg(e, o), e = Dg(e, o), e;
    }
    function Cl(e, r, o) {
      return Math.sqrt(Yi(e, r, o, !0));
    }
    function Bg(e, r, o) {
      return Yi(e, r, o);
    }
    function Dg(e, r) {
      var o = e.length, c = typeof Uint8Array < "u" ? Uint8Array : Array, l = new c(o);
      l[0] = l[o - 1] = 1, wa(e, l, r, 0, o - 1);
      var f, p = [];
      for (f = 0; f < o; f++)
        l[f] && p.push(e[f]);
      return p;
    }
    function wa(e, r, o, c, l) {
      var f = 0, p, b, S;
      for (b = c + 1; b <= l - 1; b++)
        S = Yi(e[b], e[c], e[l], !0), S > f && (p = b, f = S);
      f > o && (r[p] = 1, wa(e, r, o, c, p), wa(e, r, o, p, l));
    }
    function Zg(e, r) {
      for (var o = [e[0]], c = 1, l = 0, f = e.length; c < f; c++)
        Hg(e[c], e[l]) > r && (o.push(e[c]), l = c);
      return l < f - 1 && o.push(e[f - 1]), o;
    }
    var Il;
    function Ol(e, r, o, c, l) {
      var f = c ? Il : bn(e, o), p = bn(r, o), b, S, k;
      for (Il = p; ; ) {
        if (!(f | p))
          return [e, r];
        if (f & p)
          return !1;
        b = f || p, S = hs(e, r, b, o, l), k = bn(S, o), b === f ? (e = S, f = k) : (r = S, p = k);
      }
    }
    function hs(e, r, o, c, l) {
      var f = r.x - e.x, p = r.y - e.y, b = c.min, S = c.max, k, N;
      return o & 8 ? (k = e.x + f * (S.y - e.y) / p, N = S.y) : o & 4 ? (k = e.x + f * (b.y - e.y) / p, N = b.y) : o & 2 ? (k = S.x, N = e.y + p * (S.x - e.x) / f) : o & 1 && (k = b.x, N = e.y + p * (b.x - e.x) / f), new R(k, N, l);
    }
    function bn(e, r) {
      var o = 0;
      return e.x < r.min.x ? o |= 1 : e.x > r.max.x && (o |= 2), e.y < r.min.y ? o |= 4 : e.y > r.max.y && (o |= 8), o;
    }
    function Hg(e, r) {
      var o = r.x - e.x, c = r.y - e.y;
      return o * o + c * c;
    }
    function Yi(e, r, o, c) {
      var l = r.x, f = r.y, p = o.x - l, b = o.y - f, S = p * p + b * b, k;
      return S > 0 && (k = ((e.x - l) * p + (e.y - f) * b) / S, k > 1 ? (l = o.x, f = o.y) : k > 0 && (l += p * k, f += b * k)), p = e.x - l, b = e.y - f, c ? p * p + b * b : new R(l, f);
    }
    function pe(e) {
      return !ht(e[0]) || typeof e[0][0] != "object" && typeof e[0][0] < "u";
    }
    function Nl(e) {
      return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), pe(e);
    }
    function Rl(e, r) {
      var o, c, l, f, p, b, S, k;
      if (!e || e.length === 0)
        throw new Error("latlngs not passed");
      pe(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
      var N = K([0, 0]), j = pt(e), rt = j.getNorthWest().distanceTo(j.getSouthWest()) * j.getNorthEast().distanceTo(j.getNorthWest());
      rt < 1700 && (N = ba(e));
      var te = e.length, Vt = [];
      for (o = 0; o < te; o++) {
        var ge = K(e[o]);
        Vt.push(r.project(K([ge.lat - N.lat, ge.lng - N.lng])));
      }
      for (o = 0, c = 0; o < te - 1; o++)
        c += Vt[o].distanceTo(Vt[o + 1]) / 2;
      if (c === 0)
        k = Vt[0];
      else
        for (o = 0, f = 0; o < te - 1; o++)
          if (p = Vt[o], b = Vt[o + 1], l = p.distanceTo(b), f += l, f > c) {
            S = (f - c) / l, k = [
              b.x - S * (b.x - p.x),
              b.y - S * (b.y - p.y)
            ];
            break;
          }
      var ie = r.unproject($(k));
      return K([ie.lat + N.lat, ie.lng + N.lng]);
    }
    var jg = {
      __proto__: null,
      simplify: Ll,
      pointToSegmentDistance: Cl,
      closestPointOnSegment: Bg,
      clipSegment: Ol,
      _getEdgeIntersection: hs,
      _getBitCode: bn,
      _sqClosestPointOnSegment: Yi,
      isFlat: pe,
      _flat: Nl,
      polylineCenter: Rl
    }, Sa = {
      project: function(e) {
        return new R(e.lng, e.lat);
      },
      unproject: function(e) {
        return new A(e.y, e.x);
      },
      bounds: new ot([-180, -90], [180, 90])
    }, Ta = {
      R: 6378137,
      R_MINOR: 6356752314245179e-9,
      bounds: new ot([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
      project: function(e) {
        var r = Math.PI / 180, o = this.R, c = e.lat * r, l = this.R_MINOR / o, f = Math.sqrt(1 - l * l), p = f * Math.sin(c), b = Math.tan(Math.PI / 4 - c / 2) / Math.pow((1 - p) / (1 + p), f / 2);
        return c = -o * Math.log(Math.max(b, 1e-10)), new R(e.lng * r * o, c);
      },
      unproject: function(e) {
        for (var r = 180 / Math.PI, o = this.R, c = this.R_MINOR / o, l = Math.sqrt(1 - c * c), f = Math.exp(-e.y / o), p = Math.PI / 2 - 2 * Math.atan(f), b = 0, S = 0.1, k; b < 15 && Math.abs(S) > 1e-7; b++)
          k = l * Math.sin(p), k = Math.pow((1 - k) / (1 + k), l / 2), S = Math.PI / 2 - 2 * Math.atan(f * k) - p, p += S;
        return new A(p * r, e.x * r / o);
      }
    }, Ug = {
      __proto__: null,
      LonLat: Sa,
      Mercator: Ta,
      SphericalMercator: Ut
    }, Wg = a({}, Xt, {
      code: "EPSG:3395",
      projection: Ta,
      transformation: function() {
        var e = 0.5 / (Math.PI * Ta.R);
        return He(e, 0.5, -e, 0.5);
      }()
    }), Al = a({}, Xt, {
      code: "EPSG:4326",
      projection: Sa,
      transformation: He(1 / 180, 1, -1 / 180, 0.5)
    }), Vg = a({}, Yt, {
      projection: Sa,
      transformation: He(1, 0, -1, 0),
      scale: function(e) {
        return Math.pow(2, e);
      },
      zoom: function(e) {
        return Math.log(e) / Math.LN2;
      },
      distance: function(e, r) {
        var o = r.lng - e.lng, c = r.lat - e.lat;
        return Math.sqrt(o * o + c * c);
      },
      infinite: !0
    });
    Yt.Earth = Xt, Yt.EPSG3395 = Wg, Yt.EPSG3857 = sn, Yt.EPSG900913 = Bi, Yt.EPSG4326 = Al, Yt.Simple = Vg;
    var Ee = H.extend({
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
      addTo: function(e) {
        return e.addLayer(this), this;
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
      removeFrom: function(e) {
        return e && e.removeLayer(this), this;
      },
      // @method getPane(name? : String): HTMLElement
      // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
      getPane: function(e) {
        return this._map.getPane(e ? this.options[e] || e : this.options.pane);
      },
      addInteractiveTarget: function(e) {
        return this._map._targets[m(e)] = this, this;
      },
      removeInteractiveTarget: function(e) {
        return delete this._map._targets[m(e)], this;
      },
      // @method getAttribution: String
      // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
      getAttribution: function() {
        return this.options.attribution;
      },
      _layerAdd: function(e) {
        var r = e.target;
        if (r.hasLayer(this)) {
          if (this._map = r, this._zoomAnimated = r._zoomAnimated, this.getEvents) {
            var o = this.getEvents();
            r.on(o, this), this.once("remove", function() {
              r.off(o, this);
            }, this);
          }
          this.onAdd(r), this.fire("add"), r.fire("layeradd", { layer: this });
        }
      }
    });
    ct.include({
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the map
      addLayer: function(e) {
        if (!e._layerAdd)
          throw new Error("The provided object is not a Layer.");
        var r = m(e);
        return this._layers[r] ? this : (this._layers[r] = e, e._mapToAdd = this, e.beforeAdd && e.beforeAdd(this), this.whenReady(e._layerAdd, e), this);
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the map.
      removeLayer: function(e) {
        var r = m(e);
        return this._layers[r] ? (this._loaded && e.onRemove(this), delete this._layers[r], this._loaded && (this.fire("layerremove", { layer: e }), e.fire("remove")), e._map = e._mapToAdd = null, this) : this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the map
      hasLayer: function(e) {
        return m(e) in this._layers;
      },
      /* @method eachLayer(fn: Function, context?: Object): this
       * Iterates over the layers of the map, optionally specifying context of the iterator function.
       * ```
       * map.eachLayer(function(layer){
       *     layer.bindPopup('Hello');
       * });
       * ```
       */
      eachLayer: function(e, r) {
        for (var o in this._layers)
          e.call(r, this._layers[o]);
        return this;
      },
      _addLayers: function(e) {
        e = e ? ht(e) ? e : [e] : [];
        for (var r = 0, o = e.length; r < o; r++)
          this.addLayer(e[r]);
      },
      _addZoomLimit: function(e) {
        (!isNaN(e.options.maxZoom) || !isNaN(e.options.minZoom)) && (this._zoomBoundLayers[m(e)] = e, this._updateZoomLevels());
      },
      _removeZoomLimit: function(e) {
        var r = m(e);
        this._zoomBoundLayers[r] && (delete this._zoomBoundLayers[r], this._updateZoomLevels());
      },
      _updateZoomLevels: function() {
        var e = 1 / 0, r = -1 / 0, o = this._getZoomSpan();
        for (var c in this._zoomBoundLayers) {
          var l = this._zoomBoundLayers[c].options;
          e = l.minZoom === void 0 ? e : Math.min(e, l.minZoom), r = l.maxZoom === void 0 ? r : Math.max(r, l.maxZoom);
        }
        this._layersMaxZoom = r === -1 / 0 ? void 0 : r, this._layersMinZoom = e === 1 / 0 ? void 0 : e, o !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
      }
    });
    var Gn = Ee.extend({
      initialize: function(e, r) {
        I(this, r), this._layers = {};
        var o, c;
        if (e)
          for (o = 0, c = e.length; o < c; o++)
            this.addLayer(e[o]);
      },
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the group.
      addLayer: function(e) {
        var r = this.getLayerId(e);
        return this._layers[r] = e, this._map && this._map.addLayer(e), this;
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the group.
      // @alternative
      // @method removeLayer(id: Number): this
      // Removes the layer with the given internal ID from the group.
      removeLayer: function(e) {
        var r = e in this._layers ? e : this.getLayerId(e);
        return this._map && this._layers[r] && this._map.removeLayer(this._layers[r]), delete this._layers[r], this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the group.
      // @alternative
      // @method hasLayer(id: Number): Boolean
      // Returns `true` if the given internal ID is currently added to the group.
      hasLayer: function(e) {
        var r = typeof e == "number" ? e : this.getLayerId(e);
        return r in this._layers;
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
      invoke: function(e) {
        var r = Array.prototype.slice.call(arguments, 1), o, c;
        for (o in this._layers)
          c = this._layers[o], c[e] && c[e].apply(c, r);
        return this;
      },
      onAdd: function(e) {
        this.eachLayer(e.addLayer, e);
      },
      onRemove: function(e) {
        this.eachLayer(e.removeLayer, e);
      },
      // @method eachLayer(fn: Function, context?: Object): this
      // Iterates over the layers of the group, optionally specifying context of the iterator function.
      // ```js
      // group.eachLayer(function (layer) {
      // 	layer.bindPopup('Hello');
      // });
      // ```
      eachLayer: function(e, r) {
        for (var o in this._layers)
          e.call(r, this._layers[o]);
        return this;
      },
      // @method getLayer(id: Number): Layer
      // Returns the layer with the given internal ID.
      getLayer: function(e) {
        return this._layers[e];
      },
      // @method getLayers(): Layer[]
      // Returns an array of all the layers added to the group.
      getLayers: function() {
        var e = [];
        return this.eachLayer(e.push, e), e;
      },
      // @method setZIndex(zIndex: Number): this
      // Calls `setZIndex` on every layer contained in this group, passing the z-index.
      setZIndex: function(e) {
        return this.invoke("setZIndex", e);
      },
      // @method getLayerId(layer: Layer): Number
      // Returns the internal ID for a layer
      getLayerId: function(e) {
        return m(e);
      }
    }), qg = function(e, r) {
      return new Gn(e, r);
    }, Ue = Gn.extend({
      addLayer: function(e) {
        return this.hasLayer(e) ? this : (e.addEventParent(this), Gn.prototype.addLayer.call(this, e), this.fire("layeradd", { layer: e }));
      },
      removeLayer: function(e) {
        return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.removeEventParent(this), Gn.prototype.removeLayer.call(this, e), this.fire("layerremove", { layer: e })) : this;
      },
      // @method setStyle(style: Path options): this
      // Sets the given path options to each layer of the group that has a `setStyle` method.
      setStyle: function(e) {
        return this.invoke("setStyle", e);
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
        var e = new bt();
        for (var r in this._layers) {
          var o = this._layers[r];
          e.extend(o.getBounds ? o.getBounds() : o.getLatLng());
        }
        return e;
      }
    }), Kg = function(e, r) {
      return new Ue(e, r);
    }, Jn = St.extend({
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
      initialize: function(e) {
        I(this, e);
      },
      // @method createIcon(oldIcon?: HTMLElement): HTMLElement
      // Called internally when the icon has to be shown, returns a `<img>` HTML element
      // styled according to the options.
      createIcon: function(e) {
        return this._createIcon("icon", e);
      },
      // @method createShadow(oldIcon?: HTMLElement): HTMLElement
      // As `createIcon`, but for the shadow beneath it.
      createShadow: function(e) {
        return this._createIcon("shadow", e);
      },
      _createIcon: function(e, r) {
        var o = this._getIconUrl(e);
        if (!o) {
          if (e === "icon")
            throw new Error("iconUrl not set in Icon options (see the docs).");
          return null;
        }
        var c = this._createImg(o, r && r.tagName === "IMG" ? r : null);
        return this._setIconStyles(c, e), (this.options.crossOrigin || this.options.crossOrigin === "") && (c.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), c;
      },
      _setIconStyles: function(e, r) {
        var o = this.options, c = o[r + "Size"];
        typeof c == "number" && (c = [c, c]);
        var l = $(c), f = $(r === "shadow" && o.shadowAnchor || o.iconAnchor || l && l.divideBy(2, !0));
        e.className = "leaflet-marker-" + r + " " + (o.className || ""), f && (e.style.marginLeft = -f.x + "px", e.style.marginTop = -f.y + "px"), l && (e.style.width = l.x + "px", e.style.height = l.y + "px");
      },
      _createImg: function(e, r) {
        return r = r || document.createElement("img"), r.src = e, r;
      },
      _getIconUrl: function(e) {
        return z.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
      }
    });
    function Gg(e) {
      return new Jn(e);
    }
    var Xi = Jn.extend({
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
      _getIconUrl: function(e) {
        return typeof Xi.imagePath != "string" && (Xi.imagePath = this._detectIconPath()), (this.options.imagePath || Xi.imagePath) + Jn.prototype._getIconUrl.call(this, e);
      },
      _stripUrl: function(e) {
        var r = function(o, c, l) {
          var f = c.exec(o);
          return f && f[l];
        };
        return e = r(e, /^url\((['"])?(.+)\1\)$/, 2), e && r(e, /^(.*)marker-icon\.png$/, 1);
      },
      _detectIconPath: function() {
        var e = ft("div", "leaflet-default-icon-path", document.body), r = Wi(e, "background-image") || Wi(e, "backgroundImage");
        if (document.body.removeChild(e), r = this._stripUrl(r), r)
          return r;
        var o = document.querySelector('link[href$="leaflet.css"]');
        return o ? o.href.substring(0, o.href.length - 11 - 1) : "";
      }
    }), Fl = Ae.extend({
      initialize: function(e) {
        this._marker = e;
      },
      addHooks: function() {
        var e = this._marker._icon;
        this._draggable || (this._draggable = new an(e, e, !0)), this._draggable.on({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).enable(), J(e, "leaflet-marker-draggable");
      },
      removeHooks: function() {
        this._draggable.off({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).disable(), this._marker._icon && It(this._marker._icon, "leaflet-marker-draggable");
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      _adjustPan: function(e) {
        var r = this._marker, o = r._map, c = this._marker.options.autoPanSpeed, l = this._marker.options.autoPanPadding, f = gn(r._icon), p = o.getPixelBounds(), b = o.getPixelOrigin(), S = Gt(
          p.min._subtract(b).add(l),
          p.max._subtract(b).subtract(l)
        );
        if (!S.contains(f)) {
          var k = $(
            (Math.max(S.max.x, f.x) - S.max.x) / (p.max.x - S.max.x) - (Math.min(S.min.x, f.x) - S.min.x) / (p.min.x - S.min.x),
            (Math.max(S.max.y, f.y) - S.max.y) / (p.max.y - S.max.y) - (Math.min(S.min.y, f.y) - S.min.y) / (p.min.y - S.min.y)
          ).multiplyBy(c);
          o.panBy(k, { animate: !1 }), this._draggable._newPos._add(k), this._draggable._startPos._add(k), Nt(r._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = W(this._adjustPan.bind(this, e));
        }
      },
      _onDragStart: function() {
        this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
      },
      _onPreDrag: function(e) {
        this._marker.options.autoPan && (G(this._panRequest), this._panRequest = W(this._adjustPan.bind(this, e)));
      },
      _onDrag: function(e) {
        var r = this._marker, o = r._shadow, c = gn(r._icon), l = r._map.layerPointToLatLng(c);
        o && Nt(o, c), r._latlng = l, e.latlng = l, e.oldLatLng = this._oldLatLng, r.fire("move", e).fire("drag", e);
      },
      _onDragEnd: function(e) {
        G(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", e);
      }
    }), fs = Ee.extend({
      // @section
      // @aka Marker options
      options: {
        // @option icon: Icon = *
        // Icon instance to use for rendering the marker.
        // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
        // If not specified, a common instance of `L.Icon.Default` is used.
        icon: new Xi(),
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
      initialize: function(e, r) {
        I(this, r), this._latlng = K(e);
      },
      onAdd: function(e) {
        this._zoomAnimated = this._zoomAnimated && e.options.markerZoomAnimation, this._zoomAnimated && e.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
      },
      onRemove: function(e) {
        this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && e.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
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
      setLatLng: function(e) {
        var r = this._latlng;
        return this._latlng = K(e), this.update(), this.fire("move", { oldLatLng: r, latlng: this._latlng });
      },
      // @method setZIndexOffset(offset: Number): this
      // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
      setZIndexOffset: function(e) {
        return this.options.zIndexOffset = e, this.update();
      },
      // @method getIcon: Icon
      // Returns the current icon used by the marker
      getIcon: function() {
        return this.options.icon;
      },
      // @method setIcon(icon: Icon): this
      // Changes the marker icon.
      setIcon: function(e) {
        return this.options.icon = e, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
      },
      getElement: function() {
        return this._icon;
      },
      update: function() {
        if (this._icon && this._map) {
          var e = this._map.latLngToLayerPoint(this._latlng).round();
          this._setPos(e);
        }
        return this;
      },
      _initIcon: function() {
        var e = this.options, r = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), o = e.icon.createIcon(this._icon), c = !1;
        o !== this._icon && (this._icon && this._removeIcon(), c = !0, e.title && (o.title = e.title), o.tagName === "IMG" && (o.alt = e.alt || "")), J(o, r), e.keyboard && (o.tabIndex = "0", o.setAttribute("role", "button")), this._icon = o, e.riseOnHover && this.on({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && q(o, "focus", this._panOnFocus, this);
        var l = e.icon.createShadow(this._shadow), f = !1;
        l !== this._shadow && (this._removeShadow(), f = !0), l && (J(l, r), l.alt = ""), this._shadow = l, e.opacity < 1 && this._updateOpacity(), c && this.getPane().appendChild(this._icon), this._initInteraction(), l && f && this.getPane(e.shadowPane).appendChild(this._shadow);
      },
      _removeIcon: function() {
        this.options.riseOnHover && this.off({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && gt(this._icon, "focus", this._panOnFocus, this), Pt(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
      },
      _removeShadow: function() {
        this._shadow && Pt(this._shadow), this._shadow = null;
      },
      _setPos: function(e) {
        this._icon && Nt(this._icon, e), this._shadow && Nt(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
      },
      _updateZIndex: function(e) {
        this._icon && (this._icon.style.zIndex = this._zIndex + e);
      },
      _animateZoom: function(e) {
        var r = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
        this._setPos(r);
      },
      _initInteraction: function() {
        if (this.options.interactive && (J(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Fl)) {
          var e = this.options.draggable;
          this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new Fl(this), e && this.dragging.enable();
        }
      },
      // @method setOpacity(opacity: Number): this
      // Changes the opacity of the marker.
      setOpacity: function(e) {
        return this.options.opacity = e, this._map && this._updateOpacity(), this;
      },
      _updateOpacity: function() {
        var e = this.options.opacity;
        this._icon && _e(this._icon, e), this._shadow && _e(this._shadow, e);
      },
      _bringToFront: function() {
        this._updateZIndex(this.options.riseOffset);
      },
      _resetZIndex: function() {
        this._updateZIndex(0);
      },
      _panOnFocus: function() {
        var e = this._map;
        if (e) {
          var r = this.options.icon.options, o = r.iconSize ? $(r.iconSize) : $(0, 0), c = r.iconAnchor ? $(r.iconAnchor) : $(0, 0);
          e.panInside(this._latlng, {
            paddingTopLeft: c,
            paddingBottomRight: o.subtract(c)
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
    function Jg(e, r) {
      return new fs(e, r);
    }
    var cn = Ee.extend({
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
      beforeAdd: function(e) {
        this._renderer = e.getRenderer(this);
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
      setStyle: function(e) {
        return I(this, e), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && e && Object.prototype.hasOwnProperty.call(e, "weight") && this._updateBounds()), this;
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
    }), ds = cn.extend({
      // @section
      // @aka CircleMarker options
      options: {
        fill: !0,
        // @option radius: Number = 10
        // Radius of the circle marker, in pixels
        radius: 10
      },
      initialize: function(e, r) {
        I(this, r), this._latlng = K(e), this._radius = this.options.radius;
      },
      // @method setLatLng(latLng: LatLng): this
      // Sets the position of a circle marker to a new location.
      setLatLng: function(e) {
        var r = this._latlng;
        return this._latlng = K(e), this.redraw(), this.fire("move", { oldLatLng: r, latlng: this._latlng });
      },
      // @method getLatLng(): LatLng
      // Returns the current geographical position of the circle marker
      getLatLng: function() {
        return this._latlng;
      },
      // @method setRadius(radius: Number): this
      // Sets the radius of a circle marker. Units are in pixels.
      setRadius: function(e) {
        return this.options.radius = this._radius = e, this.redraw();
      },
      // @method getRadius(): Number
      // Returns the current radius of the circle
      getRadius: function() {
        return this._radius;
      },
      setStyle: function(e) {
        var r = e && e.radius || this._radius;
        return cn.prototype.setStyle.call(this, e), this.setRadius(r), this;
      },
      _project: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
      },
      _updateBounds: function() {
        var e = this._radius, r = this._radiusY || e, o = this._clickTolerance(), c = [e + o, r + o];
        this._pxBounds = new ot(this._point.subtract(c), this._point.add(c));
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
      _containsPoint: function(e) {
        return e.distanceTo(this._point) <= this._radius + this._clickTolerance();
      }
    });
    function Yg(e, r) {
      return new ds(e, r);
    }
    var Pa = ds.extend({
      initialize: function(e, r, o) {
        if (typeof r == "number" && (r = a({}, o, { radius: r })), I(this, r), this._latlng = K(e), isNaN(this.options.radius))
          throw new Error("Circle radius cannot be NaN");
        this._mRadius = this.options.radius;
      },
      // @method setRadius(radius: Number): this
      // Sets the radius of a circle. Units are in meters.
      setRadius: function(e) {
        return this._mRadius = e, this.redraw();
      },
      // @method getRadius(): Number
      // Returns the current radius of a circle. Units are in meters.
      getRadius: function() {
        return this._mRadius;
      },
      // @method getBounds(): LatLngBounds
      // Returns the `LatLngBounds` of the path.
      getBounds: function() {
        var e = [this._radius, this._radiusY || this._radius];
        return new bt(
          this._map.layerPointToLatLng(this._point.subtract(e)),
          this._map.layerPointToLatLng(this._point.add(e))
        );
      },
      setStyle: cn.prototype.setStyle,
      _project: function() {
        var e = this._latlng.lng, r = this._latlng.lat, o = this._map, c = o.options.crs;
        if (c.distance === Xt.distance) {
          var l = Math.PI / 180, f = this._mRadius / Xt.R / l, p = o.project([r + f, e]), b = o.project([r - f, e]), S = p.add(b).divideBy(2), k = o.unproject(S).lat, N = Math.acos((Math.cos(f * l) - Math.sin(r * l) * Math.sin(k * l)) / (Math.cos(r * l) * Math.cos(k * l))) / l;
          (isNaN(N) || N === 0) && (N = f / Math.cos(Math.PI / 180 * r)), this._point = S.subtract(o.getPixelOrigin()), this._radius = isNaN(N) ? 0 : S.x - o.project([k, e - N]).x, this._radiusY = S.y - p.y;
        } else {
          var j = c.unproject(c.project(this._latlng).subtract([this._mRadius, 0]));
          this._point = o.latLngToLayerPoint(this._latlng), this._radius = this._point.x - o.latLngToLayerPoint(j).x;
        }
        this._updateBounds();
      }
    });
    function Xg(e, r, o) {
      return new Pa(e, r, o);
    }
    var We = cn.extend({
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
      initialize: function(e, r) {
        I(this, r), this._setLatLngs(e);
      },
      // @method getLatLngs(): LatLng[]
      // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
      getLatLngs: function() {
        return this._latlngs;
      },
      // @method setLatLngs(latlngs: LatLng[]): this
      // Replaces all the points in the polyline with the given array of geographical points.
      setLatLngs: function(e) {
        return this._setLatLngs(e), this.redraw();
      },
      // @method isEmpty(): Boolean
      // Returns `true` if the Polyline has no LatLngs.
      isEmpty: function() {
        return !this._latlngs.length;
      },
      // @method closestLayerPoint(p: Point): Point
      // Returns the point closest to `p` on the Polyline.
      closestLayerPoint: function(e) {
        for (var r = 1 / 0, o = null, c = Yi, l, f, p = 0, b = this._parts.length; p < b; p++)
          for (var S = this._parts[p], k = 1, N = S.length; k < N; k++) {
            l = S[k - 1], f = S[k];
            var j = c(e, l, f, !0);
            j < r && (r = j, o = c(e, l, f));
          }
        return o && (o.distance = Math.sqrt(r)), o;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
      getCenter: function() {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        return Rl(this._defaultShape(), this._map.options.crs);
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
      addLatLng: function(e, r) {
        return r = r || this._defaultShape(), e = K(e), r.push(e), this._bounds.extend(e), this.redraw();
      },
      _setLatLngs: function(e) {
        this._bounds = new bt(), this._latlngs = this._convertLatLngs(e);
      },
      _defaultShape: function() {
        return pe(this._latlngs) ? this._latlngs : this._latlngs[0];
      },
      // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
      _convertLatLngs: function(e) {
        for (var r = [], o = pe(e), c = 0, l = e.length; c < l; c++)
          o ? (r[c] = K(e[c]), this._bounds.extend(r[c])) : r[c] = this._convertLatLngs(e[c]);
        return r;
      },
      _project: function() {
        var e = new ot();
        this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
      },
      _updateBounds: function() {
        var e = this._clickTolerance(), r = new R(e, e);
        this._rawPxBounds && (this._pxBounds = new ot([
          this._rawPxBounds.min.subtract(r),
          this._rawPxBounds.max.add(r)
        ]));
      },
      // recursively turns latlngs into a set of rings with projected coordinates
      _projectLatlngs: function(e, r, o) {
        var c = e[0] instanceof A, l = e.length, f, p;
        if (c) {
          for (p = [], f = 0; f < l; f++)
            p[f] = this._map.latLngToLayerPoint(e[f]), o.extend(p[f]);
          r.push(p);
        } else
          for (f = 0; f < l; f++)
            this._projectLatlngs(e[f], r, o);
      },
      // clip polyline by renderer bounds so that we have less to render for performance
      _clipPoints: function() {
        var e = this._renderer._bounds;
        if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          var r = this._parts, o, c, l, f, p, b, S;
          for (o = 0, l = 0, f = this._rings.length; o < f; o++)
            for (S = this._rings[o], c = 0, p = S.length; c < p - 1; c++)
              b = Ol(S[c], S[c + 1], e, c, !0), b && (r[l] = r[l] || [], r[l].push(b[0]), (b[1] !== S[c + 1] || c === p - 2) && (r[l].push(b[1]), l++));
        }
      },
      // simplify each clipped part of the polyline for performance
      _simplifyPoints: function() {
        for (var e = this._parts, r = this.options.smoothFactor, o = 0, c = e.length; o < c; o++)
          e[o] = Ll(e[o], r);
      },
      _update: function() {
        this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
      },
      _updatePath: function() {
        this._renderer._updatePoly(this);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(e, r) {
        var o, c, l, f, p, b, S = this._clickTolerance();
        if (!this._pxBounds || !this._pxBounds.contains(e))
          return !1;
        for (o = 0, f = this._parts.length; o < f; o++)
          for (b = this._parts[o], c = 0, p = b.length, l = p - 1; c < p; l = c++)
            if (!(!r && c === 0) && Cl(e, b[l], b[c]) <= S)
              return !0;
        return !1;
      }
    });
    function Qg(e, r) {
      return new We(e, r);
    }
    We._flat = Nl;
    var Yn = We.extend({
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
        return kl(this._defaultShape(), this._map.options.crs);
      },
      _convertLatLngs: function(e) {
        var r = We.prototype._convertLatLngs.call(this, e), o = r.length;
        return o >= 2 && r[0] instanceof A && r[0].equals(r[o - 1]) && r.pop(), r;
      },
      _setLatLngs: function(e) {
        We.prototype._setLatLngs.call(this, e), pe(this._latlngs) && (this._latlngs = [this._latlngs]);
      },
      _defaultShape: function() {
        return pe(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
      },
      _clipPoints: function() {
        var e = this._renderer._bounds, r = this.options.weight, o = new R(r, r);
        if (e = new ot(e.min.subtract(o), e.max.add(o)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          for (var c = 0, l = this._rings.length, f; c < l; c++)
            f = Ml(this._rings[c], e, !0), f.length && this._parts.push(f);
        }
      },
      _updatePath: function() {
        this._renderer._updatePoly(this, !0);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(e) {
        var r = !1, o, c, l, f, p, b, S, k;
        if (!this._pxBounds || !this._pxBounds.contains(e))
          return !1;
        for (f = 0, S = this._parts.length; f < S; f++)
          for (o = this._parts[f], p = 0, k = o.length, b = k - 1; p < k; b = p++)
            c = o[p], l = o[b], c.y > e.y != l.y > e.y && e.x < (l.x - c.x) * (e.y - c.y) / (l.y - c.y) + c.x && (r = !r);
        return r || We.prototype._containsPoint.call(this, e, !0);
      }
    });
    function tv(e, r) {
      return new Yn(e, r);
    }
    var Ve = Ue.extend({
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
      initialize: function(e, r) {
        I(this, r), this._layers = {}, e && this.addData(e);
      },
      // @method addData( <GeoJSON> data ): this
      // Adds a GeoJSON object to the layer.
      addData: function(e) {
        var r = ht(e) ? e : e.features, o, c, l;
        if (r) {
          for (o = 0, c = r.length; o < c; o++)
            l = r[o], (l.geometries || l.geometry || l.features || l.coordinates) && this.addData(l);
          return this;
        }
        var f = this.options;
        if (f.filter && !f.filter(e))
          return this;
        var p = ms(e, f);
        return p ? (p.feature = gs(e), p.defaultOptions = p.options, this.resetStyle(p), f.onEachFeature && f.onEachFeature(e, p), this.addLayer(p)) : this;
      },
      // @method resetStyle( <Path> layer? ): this
      // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
      // If `layer` is omitted, the style of all features in the current layer is reset.
      resetStyle: function(e) {
        return e === void 0 ? this.eachLayer(this.resetStyle, this) : (e.options = a({}, e.defaultOptions), this._setLayerStyle(e, this.options.style), this);
      },
      // @method setStyle( <Function> style ): this
      // Changes styles of GeoJSON vector layers with the given style function.
      setStyle: function(e) {
        return this.eachLayer(function(r) {
          this._setLayerStyle(r, e);
        }, this);
      },
      _setLayerStyle: function(e, r) {
        e.setStyle && (typeof r == "function" && (r = r(e.feature)), e.setStyle(r));
      }
    });
    function ms(e, r) {
      var o = e.type === "Feature" ? e.geometry : e, c = o ? o.coordinates : null, l = [], f = r && r.pointToLayer, p = r && r.coordsToLatLng || xa, b, S, k, N;
      if (!c && !o)
        return null;
      switch (o.type) {
        case "Point":
          return b = p(c), zl(f, e, b, r);
        case "MultiPoint":
          for (k = 0, N = c.length; k < N; k++)
            b = p(c[k]), l.push(zl(f, e, b, r));
          return new Ue(l);
        case "LineString":
        case "MultiLineString":
          return S = _s(c, o.type === "LineString" ? 0 : 1, p), new We(S, r);
        case "Polygon":
        case "MultiPolygon":
          return S = _s(c, o.type === "Polygon" ? 1 : 2, p), new Yn(S, r);
        case "GeometryCollection":
          for (k = 0, N = o.geometries.length; k < N; k++) {
            var j = ms({
              geometry: o.geometries[k],
              type: "Feature",
              properties: e.properties
            }, r);
            j && l.push(j);
          }
          return new Ue(l);
        case "FeatureCollection":
          for (k = 0, N = o.features.length; k < N; k++) {
            var rt = ms(o.features[k], r);
            rt && l.push(rt);
          }
          return new Ue(l);
        default:
          throw new Error("Invalid GeoJSON object.");
      }
    }
    function zl(e, r, o, c) {
      return e ? e(r, o) : new fs(o, c && c.markersInheritOptions && c);
    }
    function xa(e) {
      return new A(e[1], e[0], e[2]);
    }
    function _s(e, r, o) {
      for (var c = [], l = 0, f = e.length, p; l < f; l++)
        p = r ? _s(e[l], r - 1, o) : (o || xa)(e[l]), c.push(p);
      return c;
    }
    function Ea(e, r) {
      return e = K(e), e.alt !== void 0 ? [x(e.lng, r), x(e.lat, r), x(e.alt, r)] : [x(e.lng, r), x(e.lat, r)];
    }
    function ps(e, r, o, c) {
      for (var l = [], f = 0, p = e.length; f < p; f++)
        l.push(r ? ps(e[f], pe(e[f]) ? 0 : r - 1, o, c) : Ea(e[f], c));
      return !r && o && l.length > 0 && l.push(l[0].slice()), l;
    }
    function Xn(e, r) {
      return e.feature ? a({}, e.feature, { geometry: r }) : gs(r);
    }
    function gs(e) {
      return e.type === "Feature" || e.type === "FeatureCollection" ? e : {
        type: "Feature",
        properties: {},
        geometry: e
      };
    }
    var Ma = {
      toGeoJSON: function(e) {
        return Xn(this, {
          type: "Point",
          coordinates: Ea(this.getLatLng(), e)
        });
      }
    };
    fs.include(Ma), Pa.include(Ma), ds.include(Ma), We.include({
      toGeoJSON: function(e) {
        var r = !pe(this._latlngs), o = ps(this._latlngs, r ? 1 : 0, !1, e);
        return Xn(this, {
          type: (r ? "Multi" : "") + "LineString",
          coordinates: o
        });
      }
    }), Yn.include({
      toGeoJSON: function(e) {
        var r = !pe(this._latlngs), o = r && !pe(this._latlngs[0]), c = ps(this._latlngs, o ? 2 : r ? 1 : 0, !0, e);
        return r || (c = [c]), Xn(this, {
          type: (o ? "Multi" : "") + "Polygon",
          coordinates: c
        });
      }
    }), Gn.include({
      toMultiPoint: function(e) {
        var r = [];
        return this.eachLayer(function(o) {
          r.push(o.toGeoJSON(e).geometry.coordinates);
        }), Xn(this, {
          type: "MultiPoint",
          coordinates: r
        });
      },
      // @method toGeoJSON(precision?: Number|false): Object
      // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
      // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
      toGeoJSON: function(e) {
        var r = this.feature && this.feature.geometry && this.feature.geometry.type;
        if (r === "MultiPoint")
          return this.toMultiPoint(e);
        var o = r === "GeometryCollection", c = [];
        return this.eachLayer(function(l) {
          if (l.toGeoJSON) {
            var f = l.toGeoJSON(e);
            if (o)
              c.push(f.geometry);
            else {
              var p = gs(f);
              p.type === "FeatureCollection" ? c.push.apply(c, p.features) : c.push(p);
            }
          }
        }), o ? Xn(this, {
          geometries: c,
          type: "GeometryCollection"
        }) : {
          type: "FeatureCollection",
          features: c
        };
      }
    });
    function $l(e, r) {
      return new Ve(e, r);
    }
    var ev = $l, vs = Ee.extend({
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
      initialize: function(e, r, o) {
        this._url = e, this._bounds = pt(r), I(this, o);
      },
      onAdd: function() {
        this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (J(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
      },
      onRemove: function() {
        Pt(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
      },
      // @method setOpacity(opacity: Number): this
      // Sets the opacity of the overlay.
      setOpacity: function(e) {
        return this.options.opacity = e, this._image && this._updateOpacity(), this;
      },
      setStyle: function(e) {
        return e.opacity && this.setOpacity(e.opacity), this;
      },
      // @method bringToFront(): this
      // Brings the layer to the top of all overlays.
      bringToFront: function() {
        return this._map && qn(this._image), this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all overlays.
      bringToBack: function() {
        return this._map && Kn(this._image), this;
      },
      // @method setUrl(url: String): this
      // Changes the URL of the image.
      setUrl: function(e) {
        return this._url = e, this._image && (this._image.src = e), this;
      },
      // @method setBounds(bounds: LatLngBounds): this
      // Update the bounds that this ImageOverlay covers
      setBounds: function(e) {
        return this._bounds = pt(e), this._map && this._reset(), this;
      },
      getEvents: function() {
        var e = {
          zoom: this._reset,
          viewreset: this._reset
        };
        return this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
      },
      // @method setZIndex(value: Number): this
      // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
      setZIndex: function(e) {
        return this.options.zIndex = e, this._updateZIndex(), this;
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
        var e = this._url.tagName === "IMG", r = this._image = e ? this._url : ft("img");
        if (J(r, "leaflet-image-layer"), this._zoomAnimated && J(r, "leaflet-zoom-animated"), this.options.className && J(r, this.options.className), r.onselectstart = y, r.onmousemove = y, r.onload = h(this.fire, this, "load"), r.onerror = h(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (r.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e) {
          this._url = r.src;
          return;
        }
        r.src = this._url, r.alt = this.options.alt;
      },
      _animateZoom: function(e) {
        var r = this._map.getZoomScale(e.zoom), o = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
        pn(this._image, o, r);
      },
      _reset: function() {
        var e = this._image, r = new ot(
          this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
          this._map.latLngToLayerPoint(this._bounds.getSouthEast())
        ), o = r.getSize();
        Nt(e, r.min), e.style.width = o.x + "px", e.style.height = o.y + "px";
      },
      _updateOpacity: function() {
        _e(this._image, this.options.opacity);
      },
      _updateZIndex: function() {
        this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._image.style.zIndex = this.options.zIndex);
      },
      _overlayOnError: function() {
        this.fire("error");
        var e = this.options.errorOverlayUrl;
        e && this._url !== e && (this._url = e, this._image.src = e);
      },
      // @method getCenter(): LatLng
      // Returns the center of the ImageOverlay.
      getCenter: function() {
        return this._bounds.getCenter();
      }
    }), nv = function(e, r, o) {
      return new vs(e, r, o);
    }, Bl = vs.extend({
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
        var e = this._url.tagName === "VIDEO", r = this._image = e ? this._url : ft("video");
        if (J(r, "leaflet-image-layer"), this._zoomAnimated && J(r, "leaflet-zoom-animated"), this.options.className && J(r, this.options.className), r.onselectstart = y, r.onmousemove = y, r.onloadeddata = h(this.fire, this, "load"), e) {
          for (var o = r.getElementsByTagName("source"), c = [], l = 0; l < o.length; l++)
            c.push(o[l].src);
          this._url = o.length > 0 ? c : [r.src];
          return;
        }
        ht(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(r.style, "objectFit") && (r.style.objectFit = "fill"), r.autoplay = !!this.options.autoplay, r.loop = !!this.options.loop, r.muted = !!this.options.muted, r.playsInline = !!this.options.playsInline;
        for (var f = 0; f < this._url.length; f++) {
          var p = ft("source");
          p.src = this._url[f], r.appendChild(p);
        }
      }
      // @method getElement(): HTMLVideoElement
      // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
      // used by this overlay.
    });
    function iv(e, r, o) {
      return new Bl(e, r, o);
    }
    var Dl = vs.extend({
      _initImage: function() {
        var e = this._image = this._url;
        J(e, "leaflet-image-layer"), this._zoomAnimated && J(e, "leaflet-zoom-animated"), this.options.className && J(e, this.options.className), e.onselectstart = y, e.onmousemove = y;
      }
      // @method getElement(): SVGElement
      // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
      // used by this overlay.
    });
    function rv(e, r, o) {
      return new Dl(e, r, o);
    }
    var Fe = Ee.extend({
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
      initialize: function(e, r) {
        e && (e instanceof A || ht(e)) ? (this._latlng = K(e), I(this, r)) : (I(this, e), this._source = r), this.options.content && (this._content = this.options.content);
      },
      // @method openOn(map: Map): this
      // Adds the overlay to the map.
      // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
      openOn: function(e) {
        return e = arguments.length ? e : this._source._map, e.hasLayer(this) || e.addLayer(this), this;
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
      toggle: function(e) {
        return this._map ? this.close() : (arguments.length ? this._source = e : e = this._source, this._prepareOpen(), this.openOn(e._map)), this;
      },
      onAdd: function(e) {
        this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && _e(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && _e(this._container, 1), this.bringToFront(), this.options.interactive && (J(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
      },
      onRemove: function(e) {
        e._fadeAnimated ? (_e(this._container, 0), this._removeTimeout = setTimeout(h(Pt, void 0, this._container), 200)) : Pt(this._container), this.options.interactive && (It(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
      },
      // @namespace DivOverlay
      // @method getLatLng: LatLng
      // Returns the geographical point of the overlay.
      getLatLng: function() {
        return this._latlng;
      },
      // @method setLatLng(latlng: LatLng): this
      // Sets the geographical point where the overlay will open.
      setLatLng: function(e) {
        return this._latlng = K(e), this._map && (this._updatePosition(), this._adjustPan()), this;
      },
      // @method getContent: String|HTMLElement
      // Returns the content of the overlay.
      getContent: function() {
        return this._content;
      },
      // @method setContent(htmlContent: String|HTMLElement|Function): this
      // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
      // The function should return a `String` or `HTMLElement` to be used in the overlay.
      setContent: function(e) {
        return this._content = e, this.update(), this;
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
        var e = {
          zoom: this._updatePosition,
          viewreset: this._updatePosition
        };
        return this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
      },
      // @method isOpen: Boolean
      // Returns `true` when the overlay is visible on the map.
      isOpen: function() {
        return !!this._map && this._map.hasLayer(this);
      },
      // @method bringToFront: this
      // Brings this overlay in front of other overlays (in the same map pane).
      bringToFront: function() {
        return this._map && qn(this._container), this;
      },
      // @method bringToBack: this
      // Brings this overlay to the back of other overlays (in the same map pane).
      bringToBack: function() {
        return this._map && Kn(this._container), this;
      },
      // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
      _prepareOpen: function(e) {
        var r = this._source;
        if (!r._map)
          return !1;
        if (r instanceof Ue) {
          r = null;
          var o = this._source._layers;
          for (var c in o)
            if (o[c]._map) {
              r = o[c];
              break;
            }
          if (!r)
            return !1;
          this._source = r;
        }
        if (!e)
          if (r.getCenter)
            e = r.getCenter();
          else if (r.getLatLng)
            e = r.getLatLng();
          else if (r.getBounds)
            e = r.getBounds().getCenter();
          else
            throw new Error("Unable to get source layer LatLng.");
        return this.setLatLng(e), this._map && this.update(), !0;
      },
      _updateContent: function() {
        if (this._content) {
          var e = this._contentNode, r = typeof this._content == "function" ? this._content(this._source || this) : this._content;
          if (typeof r == "string")
            e.innerHTML = r;
          else {
            for (; e.hasChildNodes(); )
              e.removeChild(e.firstChild);
            e.appendChild(r);
          }
          this.fire("contentupdate");
        }
      },
      _updatePosition: function() {
        if (this._map) {
          var e = this._map.latLngToLayerPoint(this._latlng), r = $(this.options.offset), o = this._getAnchor();
          this._zoomAnimated ? Nt(this._container, e.add(o)) : r = r.add(e).add(o);
          var c = this._containerBottom = -r.y, l = this._containerLeft = -Math.round(this._containerWidth / 2) + r.x;
          this._container.style.bottom = c + "px", this._container.style.left = l + "px";
        }
      },
      _getAnchor: function() {
        return [0, 0];
      }
    });
    ct.include({
      _initOverlay: function(e, r, o, c) {
        var l = r;
        return l instanceof e || (l = new e(c).setContent(r)), o && l.setLatLng(o), l;
      }
    }), Ee.include({
      _initOverlay: function(e, r, o, c) {
        var l = o;
        return l instanceof e ? (I(l, c), l._source = this) : (l = r && !c ? r : new e(c, this), l.setContent(o)), l;
      }
    });
    var ys = Fe.extend({
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
      openOn: function(e) {
        return e = arguments.length ? e : this._source._map, !e.hasLayer(this) && e._popup && e._popup.options.autoClose && e.removeLayer(e._popup), e._popup = this, Fe.prototype.openOn.call(this, e);
      },
      onAdd: function(e) {
        Fe.prototype.onAdd.call(this, e), e.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof cn || this._source.on("preclick", vn));
      },
      onRemove: function(e) {
        Fe.prototype.onRemove.call(this, e), e.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof cn || this._source.off("preclick", vn));
      },
      getEvents: function() {
        var e = Fe.prototype.getEvents.call(this);
        return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (e.preclick = this.close), this.options.keepInView && (e.moveend = this._adjustPan), e;
      },
      _initLayout: function() {
        var e = "leaflet-popup", r = this._container = ft(
          "div",
          e + " " + (this.options.className || "") + " leaflet-zoom-animated"
        ), o = this._wrapper = ft("div", e + "-content-wrapper", r);
        if (this._contentNode = ft("div", e + "-content", o), Gi(r), pa(this._contentNode), q(r, "contextmenu", vn), this._tipContainer = ft("div", e + "-tip-container", r), this._tip = ft("div", e + "-tip", this._tipContainer), this.options.closeButton) {
          var c = this._closeButton = ft("a", e + "-close-button", r);
          c.setAttribute("role", "button"), c.setAttribute("aria-label", "Close popup"), c.href = "#close", c.innerHTML = '<span aria-hidden="true">&#215;</span>', q(c, "click", function(l) {
            Jt(l), this.close();
          }, this);
        }
      },
      _updateLayout: function() {
        var e = this._contentNode, r = e.style;
        r.width = "", r.whiteSpace = "nowrap";
        var o = e.offsetWidth;
        o = Math.min(o, this.options.maxWidth), o = Math.max(o, this.options.minWidth), r.width = o + 1 + "px", r.whiteSpace = "", r.height = "";
        var c = e.offsetHeight, l = this.options.maxHeight, f = "leaflet-popup-scrolled";
        l && c > l ? (r.height = l + "px", J(e, f)) : It(e, f), this._containerWidth = this._container.offsetWidth;
      },
      _animateZoom: function(e) {
        var r = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), o = this._getAnchor();
        Nt(this._container, r.add(o));
      },
      _adjustPan: function() {
        if (this.options.autoPan) {
          if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
            this._autopanning = !1;
            return;
          }
          var e = this._map, r = parseInt(Wi(this._container, "marginBottom"), 10) || 0, o = this._container.offsetHeight + r, c = this._containerWidth, l = new R(this._containerLeft, -o - this._containerBottom);
          l._add(gn(this._container));
          var f = e.layerPointToContainerPoint(l), p = $(this.options.autoPanPadding), b = $(this.options.autoPanPaddingTopLeft || p), S = $(this.options.autoPanPaddingBottomRight || p), k = e.getSize(), N = 0, j = 0;
          f.x + c + S.x > k.x && (N = f.x + c - k.x + S.x), f.x - N - b.x < 0 && (N = f.x - b.x), f.y + o + S.y > k.y && (j = f.y + o - k.y + S.y), f.y - j - b.y < 0 && (j = f.y - b.y), (N || j) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([N, j]));
        }
      },
      _getAnchor: function() {
        return $(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
      }
    }), sv = function(e, r) {
      return new ys(e, r);
    };
    ct.mergeOptions({
      closePopupOnClick: !0
    }), ct.include({
      // @method openPopup(popup: Popup): this
      // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
      // @alternative
      // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
      // Creates a popup with the specified content and options and opens it in the given point on a map.
      openPopup: function(e, r, o) {
        return this._initOverlay(ys, e, r, o).openOn(this), this;
      },
      // @method closePopup(popup?: Popup): this
      // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
      closePopup: function(e) {
        return e = arguments.length ? e : this._popup, e && e.close(), this;
      }
    }), Ee.include({
      // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
      // Binds a popup to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindPopup: function(e, r) {
        return this._popup = this._initOverlay(ys, this._popup, e, r), this._popupHandlersAdded || (this.on({
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
      openPopup: function(e) {
        return this._popup && (this instanceof Ue || (this._popup._source = this), this._popup._prepareOpen(e || this._latlng) && this._popup.openOn(this._map)), this;
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
      setPopupContent: function(e) {
        return this._popup && this._popup.setContent(e), this;
      },
      // @method getPopup(): Popup
      // Returns the popup bound to this layer.
      getPopup: function() {
        return this._popup;
      },
      _openPopup: function(e) {
        if (!(!this._popup || !this._map)) {
          yn(e);
          var r = e.layer || e.target;
          if (this._popup._source === r && !(r instanceof cn)) {
            this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(e.latlng);
            return;
          }
          this._popup._source = r, this.openPopup(e.latlng);
        }
      },
      _movePopup: function(e) {
        this._popup.setLatLng(e.latlng);
      },
      _onKeyPress: function(e) {
        e.originalEvent.keyCode === 13 && this._openPopup(e);
      }
    });
    var bs = Fe.extend({
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
      onAdd: function(e) {
        Fe.prototype.onAdd.call(this, e), this.setOpacity(this.options.opacity), e.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
      },
      onRemove: function(e) {
        Fe.prototype.onRemove.call(this, e), e.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
      },
      getEvents: function() {
        var e = Fe.prototype.getEvents.call(this);
        return this.options.permanent || (e.preclick = this.close), e;
      },
      _initLayout: function() {
        var e = "leaflet-tooltip", r = e + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
        this._contentNode = this._container = ft("div", r), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + m(this));
      },
      _updateLayout: function() {
      },
      _adjustPan: function() {
      },
      _setPosition: function(e) {
        var r, o, c = this._map, l = this._container, f = c.latLngToContainerPoint(c.getCenter()), p = c.layerPointToContainerPoint(e), b = this.options.direction, S = l.offsetWidth, k = l.offsetHeight, N = $(this.options.offset), j = this._getAnchor();
        b === "top" ? (r = S / 2, o = k) : b === "bottom" ? (r = S / 2, o = 0) : b === "center" ? (r = S / 2, o = k / 2) : b === "right" ? (r = 0, o = k / 2) : b === "left" ? (r = S, o = k / 2) : p.x < f.x ? (b = "right", r = 0, o = k / 2) : (b = "left", r = S + (N.x + j.x) * 2, o = k / 2), e = e.subtract($(r, o, !0)).add(N).add(j), It(l, "leaflet-tooltip-right"), It(l, "leaflet-tooltip-left"), It(l, "leaflet-tooltip-top"), It(l, "leaflet-tooltip-bottom"), J(l, "leaflet-tooltip-" + b), Nt(l, e);
      },
      _updatePosition: function() {
        var e = this._map.latLngToLayerPoint(this._latlng);
        this._setPosition(e);
      },
      setOpacity: function(e) {
        this.options.opacity = e, this._container && _e(this._container, e);
      },
      _animateZoom: function(e) {
        var r = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
        this._setPosition(r);
      },
      _getAnchor: function() {
        return $(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
      }
    }), ov = function(e, r) {
      return new bs(e, r);
    };
    ct.include({
      // @method openTooltip(tooltip: Tooltip): this
      // Opens the specified tooltip.
      // @alternative
      // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
      // Creates a tooltip with the specified content and options and open it.
      openTooltip: function(e, r, o) {
        return this._initOverlay(bs, e, r, o).openOn(this), this;
      },
      // @method closeTooltip(tooltip: Tooltip): this
      // Closes the tooltip given as parameter.
      closeTooltip: function(e) {
        return e.close(), this;
      }
    }), Ee.include({
      // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
      // Binds a tooltip to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindTooltip: function(e, r) {
        return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(bs, this._tooltip, e, r), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
      },
      // @method unbindTooltip(): this
      // Removes the tooltip previously bound with `bindTooltip`.
      unbindTooltip: function() {
        return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
      },
      _initTooltipInteractions: function(e) {
        if (!(!e && this._tooltipHandlersAdded)) {
          var r = e ? "off" : "on", o = {
            remove: this.closeTooltip,
            move: this._moveTooltip
          };
          this._tooltip.options.permanent ? o.add = this._openTooltip : (o.mouseover = this._openTooltip, o.mouseout = this.closeTooltip, o.click = this._openTooltip, this._map ? this._addFocusListeners() : o.add = this._addFocusListeners), this._tooltip.options.sticky && (o.mousemove = this._moveTooltip), this[r](o), this._tooltipHandlersAdded = !e;
        }
      },
      // @method openTooltip(latlng?: LatLng): this
      // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
      openTooltip: function(e) {
        return this._tooltip && (this instanceof Ue || (this._tooltip._source = this), this._tooltip._prepareOpen(e) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
      setTooltipContent: function(e) {
        return this._tooltip && this._tooltip.setContent(e), this;
      },
      // @method getTooltip(): Tooltip
      // Returns the tooltip bound to this layer.
      getTooltip: function() {
        return this._tooltip;
      },
      _addFocusListeners: function() {
        this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this);
      },
      _addFocusListenersOnLayer: function(e) {
        var r = typeof e.getElement == "function" && e.getElement();
        r && (q(r, "focus", function() {
          this._tooltip._source = e, this.openTooltip();
        }, this), q(r, "blur", this.closeTooltip, this));
      },
      _setAriaDescribedByOnLayer: function(e) {
        var r = typeof e.getElement == "function" && e.getElement();
        r && r.setAttribute("aria-describedby", this._tooltip._container.id);
      },
      _openTooltip: function(e) {
        if (!(!this._tooltip || !this._map)) {
          if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
            this._openOnceFlag = !0;
            var r = this;
            this._map.once("moveend", function() {
              r._openOnceFlag = !1, r._openTooltip(e);
            });
            return;
          }
          this._tooltip._source = e.layer || e.target, this.openTooltip(this._tooltip.options.sticky ? e.latlng : void 0);
        }
      },
      _moveTooltip: function(e) {
        var r = e.latlng, o, c;
        this._tooltip.options.sticky && e.originalEvent && (o = this._map.mouseEventToContainerPoint(e.originalEvent), c = this._map.containerPointToLayerPoint(o), r = this._map.layerPointToLatLng(c)), this._tooltip.setLatLng(r);
      }
    });
    var Zl = Jn.extend({
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
      createIcon: function(e) {
        var r = e && e.tagName === "DIV" ? e : document.createElement("div"), o = this.options;
        if (o.html instanceof Element ? (os(r), r.appendChild(o.html)) : r.innerHTML = o.html !== !1 ? o.html : "", o.bgPos) {
          var c = $(o.bgPos);
          r.style.backgroundPosition = -c.x + "px " + -c.y + "px";
        }
        return this._setIconStyles(r, "icon"), r;
      },
      createShadow: function() {
        return null;
      }
    });
    function av(e) {
      return new Zl(e);
    }
    Jn.Default = Xi;
    var Qi = Ee.extend({
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
      initialize: function(e) {
        I(this, e);
      },
      onAdd: function() {
        this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
      },
      beforeAdd: function(e) {
        e._addZoomLimit(this);
      },
      onRemove: function(e) {
        this._removeAllTiles(), Pt(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
      },
      // @method bringToFront: this
      // Brings the tile layer to the top of all tile layers.
      bringToFront: function() {
        return this._map && (qn(this._container), this._setAutoZIndex(Math.max)), this;
      },
      // @method bringToBack: this
      // Brings the tile layer to the bottom of all tile layers.
      bringToBack: function() {
        return this._map && (Kn(this._container), this._setAutoZIndex(Math.min)), this;
      },
      // @method getContainer: HTMLElement
      // Returns the HTML element that contains the tiles for this layer.
      getContainer: function() {
        return this._container;
      },
      // @method setOpacity(opacity: Number): this
      // Changes the [opacity](#gridlayer-opacity) of the grid layer.
      setOpacity: function(e) {
        return this.options.opacity = e, this._updateOpacity(), this;
      },
      // @method setZIndex(zIndex: Number): this
      // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
      setZIndex: function(e) {
        return this.options.zIndex = e, this._updateZIndex(), this;
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
          var e = this._clampZoom(this._map.getZoom());
          e !== this._tileZoom && (this._tileZoom = e, this._updateLevels()), this._update();
        }
        return this;
      },
      getEvents: function() {
        var e = {
          viewprereset: this._invalidateAll,
          viewreset: this._resetView,
          zoom: this._resetView,
          moveend: this._onMoveEnd
        };
        return this.options.updateWhenIdle || (this._onMove || (this._onMove = g(this._onMoveEnd, this.options.updateInterval, this)), e.move = this._onMove), this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
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
        var e = this.options.tileSize;
        return e instanceof R ? e : new R(e, e);
      },
      _updateZIndex: function() {
        this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
      },
      _setAutoZIndex: function(e) {
        for (var r = this.getPane().children, o = -e(-1 / 0, 1 / 0), c = 0, l = r.length, f; c < l; c++)
          f = r[c].style.zIndex, r[c] !== this._container && f && (o = e(o, +f));
        isFinite(o) && (this.options.zIndex = o + e(-1, 1), this._updateZIndex());
      },
      _updateOpacity: function() {
        if (this._map && !z.ielt9) {
          _e(this._container, this.options.opacity);
          var e = +/* @__PURE__ */ new Date(), r = !1, o = !1;
          for (var c in this._tiles) {
            var l = this._tiles[c];
            if (!(!l.current || !l.loaded)) {
              var f = Math.min(1, (e - l.loaded) / 200);
              _e(l.el, f), f < 1 ? r = !0 : (l.active ? o = !0 : this._onOpaqueTile(l), l.active = !0);
            }
          }
          o && !this._noPrune && this._pruneTiles(), r && (G(this._fadeFrame), this._fadeFrame = W(this._updateOpacity, this));
        }
      },
      _onOpaqueTile: y,
      _initContainer: function() {
        this._container || (this._container = ft("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
      },
      _updateLevels: function() {
        var e = this._tileZoom, r = this.options.maxZoom;
        if (e !== void 0) {
          for (var o in this._levels)
            o = Number(o), this._levels[o].el.children.length || o === e ? (this._levels[o].el.style.zIndex = r - Math.abs(e - o), this._onUpdateLevel(o)) : (Pt(this._levels[o].el), this._removeTilesAtZoom(o), this._onRemoveLevel(o), delete this._levels[o]);
          var c = this._levels[e], l = this._map;
          return c || (c = this._levels[e] = {}, c.el = ft("div", "leaflet-tile-container leaflet-zoom-animated", this._container), c.el.style.zIndex = r, c.origin = l.project(l.unproject(l.getPixelOrigin()), e).round(), c.zoom = e, this._setZoomTransform(c, l.getCenter(), l.getZoom()), y(c.el.offsetWidth), this._onCreateLevel(c)), this._level = c, c;
        }
      },
      _onUpdateLevel: y,
      _onRemoveLevel: y,
      _onCreateLevel: y,
      _pruneTiles: function() {
        if (this._map) {
          var e, r, o = this._map.getZoom();
          if (o > this.options.maxZoom || o < this.options.minZoom) {
            this._removeAllTiles();
            return;
          }
          for (e in this._tiles)
            r = this._tiles[e], r.retain = r.current;
          for (e in this._tiles)
            if (r = this._tiles[e], r.current && !r.active) {
              var c = r.coords;
              this._retainParent(c.x, c.y, c.z, c.z - 5) || this._retainChildren(c.x, c.y, c.z, c.z + 2);
            }
          for (e in this._tiles)
            this._tiles[e].retain || this._removeTile(e);
        }
      },
      _removeTilesAtZoom: function(e) {
        for (var r in this._tiles)
          this._tiles[r].coords.z === e && this._removeTile(r);
      },
      _removeAllTiles: function() {
        for (var e in this._tiles)
          this._removeTile(e);
      },
      _invalidateAll: function() {
        for (var e in this._levels)
          Pt(this._levels[e].el), this._onRemoveLevel(Number(e)), delete this._levels[e];
        this._removeAllTiles(), this._tileZoom = void 0;
      },
      _retainParent: function(e, r, o, c) {
        var l = Math.floor(e / 2), f = Math.floor(r / 2), p = o - 1, b = new R(+l, +f);
        b.z = +p;
        var S = this._tileCoordsToKey(b), k = this._tiles[S];
        return k && k.active ? (k.retain = !0, !0) : (k && k.loaded && (k.retain = !0), p > c ? this._retainParent(l, f, p, c) : !1);
      },
      _retainChildren: function(e, r, o, c) {
        for (var l = 2 * e; l < 2 * e + 2; l++)
          for (var f = 2 * r; f < 2 * r + 2; f++) {
            var p = new R(l, f);
            p.z = o + 1;
            var b = this._tileCoordsToKey(p), S = this._tiles[b];
            if (S && S.active) {
              S.retain = !0;
              continue;
            } else S && S.loaded && (S.retain = !0);
            o + 1 < c && this._retainChildren(l, f, o + 1, c);
          }
      },
      _resetView: function(e) {
        var r = e && (e.pinch || e.flyTo);
        this._setView(this._map.getCenter(), this._map.getZoom(), r, r);
      },
      _animateZoom: function(e) {
        this._setView(e.center, e.zoom, !0, e.noUpdate);
      },
      _clampZoom: function(e) {
        var r = this.options;
        return r.minNativeZoom !== void 0 && e < r.minNativeZoom ? r.minNativeZoom : r.maxNativeZoom !== void 0 && r.maxNativeZoom < e ? r.maxNativeZoom : e;
      },
      _setView: function(e, r, o, c) {
        var l = Math.round(r);
        this.options.maxZoom !== void 0 && l > this.options.maxZoom || this.options.minZoom !== void 0 && l < this.options.minZoom ? l = void 0 : l = this._clampZoom(l);
        var f = this.options.updateWhenZooming && l !== this._tileZoom;
        (!c || f) && (this._tileZoom = l, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), l !== void 0 && this._update(e), o || this._pruneTiles(), this._noPrune = !!o), this._setZoomTransforms(e, r);
      },
      _setZoomTransforms: function(e, r) {
        for (var o in this._levels)
          this._setZoomTransform(this._levels[o], e, r);
      },
      _setZoomTransform: function(e, r, o) {
        var c = this._map.getZoomScale(o, e.zoom), l = e.origin.multiplyBy(c).subtract(this._map._getNewPixelOrigin(r, o)).round();
        z.any3d ? pn(e.el, l, c) : Nt(e.el, l);
      },
      _resetGrid: function() {
        var e = this._map, r = e.options.crs, o = this._tileSize = this.getTileSize(), c = this._tileZoom, l = this._map.getPixelWorldBounds(this._tileZoom);
        l && (this._globalTileRange = this._pxBoundsToTileRange(l)), this._wrapX = r.wrapLng && !this.options.noWrap && [
          Math.floor(e.project([0, r.wrapLng[0]], c).x / o.x),
          Math.ceil(e.project([0, r.wrapLng[1]], c).x / o.y)
        ], this._wrapY = r.wrapLat && !this.options.noWrap && [
          Math.floor(e.project([r.wrapLat[0], 0], c).y / o.x),
          Math.ceil(e.project([r.wrapLat[1], 0], c).y / o.y)
        ];
      },
      _onMoveEnd: function() {
        !this._map || this._map._animatingZoom || this._update();
      },
      _getTiledPixelBounds: function(e) {
        var r = this._map, o = r._animatingZoom ? Math.max(r._animateToZoom, r.getZoom()) : r.getZoom(), c = r.getZoomScale(o, this._tileZoom), l = r.project(e, this._tileZoom).floor(), f = r.getSize().divideBy(c * 2);
        return new ot(l.subtract(f), l.add(f));
      },
      // Private method to load tiles in the grid's active zoom level according to map bounds
      _update: function(e) {
        var r = this._map;
        if (r) {
          var o = this._clampZoom(r.getZoom());
          if (e === void 0 && (e = r.getCenter()), this._tileZoom !== void 0) {
            var c = this._getTiledPixelBounds(e), l = this._pxBoundsToTileRange(c), f = l.getCenter(), p = [], b = this.options.keepBuffer, S = new ot(
              l.getBottomLeft().subtract([b, -b]),
              l.getTopRight().add([b, -b])
            );
            if (!(isFinite(l.min.x) && isFinite(l.min.y) && isFinite(l.max.x) && isFinite(l.max.y)))
              throw new Error("Attempted to load an infinite number of tiles");
            for (var k in this._tiles) {
              var N = this._tiles[k].coords;
              (N.z !== this._tileZoom || !S.contains(new R(N.x, N.y))) && (this._tiles[k].current = !1);
            }
            if (Math.abs(o - this._tileZoom) > 1) {
              this._setView(e, o);
              return;
            }
            for (var j = l.min.y; j <= l.max.y; j++)
              for (var rt = l.min.x; rt <= l.max.x; rt++) {
                var te = new R(rt, j);
                if (te.z = this._tileZoom, !!this._isValidTile(te)) {
                  var Vt = this._tiles[this._tileCoordsToKey(te)];
                  Vt ? Vt.current = !0 : p.push(te);
                }
              }
            if (p.sort(function(ie, ti) {
              return ie.distanceTo(f) - ti.distanceTo(f);
            }), p.length !== 0) {
              this._loading || (this._loading = !0, this.fire("loading"));
              var ge = document.createDocumentFragment();
              for (rt = 0; rt < p.length; rt++)
                this._addTile(p[rt], ge);
              this._level.el.appendChild(ge);
            }
          }
        }
      },
      _isValidTile: function(e) {
        var r = this._map.options.crs;
        if (!r.infinite) {
          var o = this._globalTileRange;
          if (!r.wrapLng && (e.x < o.min.x || e.x > o.max.x) || !r.wrapLat && (e.y < o.min.y || e.y > o.max.y))
            return !1;
        }
        if (!this.options.bounds)
          return !0;
        var c = this._tileCoordsToBounds(e);
        return pt(this.options.bounds).overlaps(c);
      },
      _keyToBounds: function(e) {
        return this._tileCoordsToBounds(this._keyToTileCoords(e));
      },
      _tileCoordsToNwSe: function(e) {
        var r = this._map, o = this.getTileSize(), c = e.scaleBy(o), l = c.add(o), f = r.unproject(c, e.z), p = r.unproject(l, e.z);
        return [f, p];
      },
      // converts tile coordinates to its geographical bounds
      _tileCoordsToBounds: function(e) {
        var r = this._tileCoordsToNwSe(e), o = new bt(r[0], r[1]);
        return this.options.noWrap || (o = this._map.wrapLatLngBounds(o)), o;
      },
      // converts tile coordinates to key for the tile cache
      _tileCoordsToKey: function(e) {
        return e.x + ":" + e.y + ":" + e.z;
      },
      // converts tile cache key to coordinates
      _keyToTileCoords: function(e) {
        var r = e.split(":"), o = new R(+r[0], +r[1]);
        return o.z = +r[2], o;
      },
      _removeTile: function(e) {
        var r = this._tiles[e];
        r && (Pt(r.el), delete this._tiles[e], this.fire("tileunload", {
          tile: r.el,
          coords: this._keyToTileCoords(e)
        }));
      },
      _initTile: function(e) {
        J(e, "leaflet-tile");
        var r = this.getTileSize();
        e.style.width = r.x + "px", e.style.height = r.y + "px", e.onselectstart = y, e.onmousemove = y, z.ielt9 && this.options.opacity < 1 && _e(e, this.options.opacity);
      },
      _addTile: function(e, r) {
        var o = this._getTilePos(e), c = this._tileCoordsToKey(e), l = this.createTile(this._wrapCoords(e), h(this._tileReady, this, e));
        this._initTile(l), this.createTile.length < 2 && W(h(this._tileReady, this, e, null, l)), Nt(l, o), this._tiles[c] = {
          el: l,
          coords: e,
          current: !0
        }, r.appendChild(l), this.fire("tileloadstart", {
          tile: l,
          coords: e
        });
      },
      _tileReady: function(e, r, o) {
        r && this.fire("tileerror", {
          error: r,
          tile: o,
          coords: e
        });
        var c = this._tileCoordsToKey(e);
        o = this._tiles[c], o && (o.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (_e(o.el, 0), G(this._fadeFrame), this._fadeFrame = W(this._updateOpacity, this)) : (o.active = !0, this._pruneTiles()), r || (J(o.el, "leaflet-tile-loaded"), this.fire("tileload", {
          tile: o.el,
          coords: e
        })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), z.ielt9 || !this._map._fadeAnimated ? W(this._pruneTiles, this) : setTimeout(h(this._pruneTiles, this), 250)));
      },
      _getTilePos: function(e) {
        return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
      },
      _wrapCoords: function(e) {
        var r = new R(
          this._wrapX ? w(e.x, this._wrapX) : e.x,
          this._wrapY ? w(e.y, this._wrapY) : e.y
        );
        return r.z = e.z, r;
      },
      _pxBoundsToTileRange: function(e) {
        var r = this.getTileSize();
        return new ot(
          e.min.unscaleBy(r).floor(),
          e.max.unscaleBy(r).ceil().subtract([1, 1])
        );
      },
      _noTilesToLoad: function() {
        for (var e in this._tiles)
          if (!this._tiles[e].loaded)
            return !1;
        return !0;
      }
    });
    function cv(e) {
      return new Qi(e);
    }
    var Qn = Qi.extend({
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
      initialize: function(e, r) {
        this._url = e, r = I(this, r), r.detectRetina && z.retina && r.maxZoom > 0 ? (r.tileSize = Math.floor(r.tileSize / 2), r.zoomReverse ? (r.zoomOffset--, r.minZoom = Math.min(r.maxZoom, r.minZoom + 1)) : (r.zoomOffset++, r.maxZoom = Math.max(r.minZoom, r.maxZoom - 1)), r.minZoom = Math.max(0, r.minZoom)) : r.zoomReverse ? r.minZoom = Math.min(r.maxZoom, r.minZoom) : r.maxZoom = Math.max(r.minZoom, r.maxZoom), typeof r.subdomains == "string" && (r.subdomains = r.subdomains.split("")), this.on("tileunload", this._onTileRemove);
      },
      // @method setUrl(url: String, noRedraw?: Boolean): this
      // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
      // If the URL does not change, the layer will not be redrawn unless
      // the noRedraw parameter is set to false.
      setUrl: function(e, r) {
        return this._url === e && r === void 0 && (r = !0), this._url = e, r || this.redraw(), this;
      },
      // @method createTile(coords: Object, done?: Function): HTMLElement
      // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
      // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
      // callback is called when the tile has been loaded.
      createTile: function(e, r) {
        var o = document.createElement("img");
        return q(o, "load", h(this._tileOnLoad, this, r, o)), q(o, "error", h(this._tileOnError, this, r, o)), (this.options.crossOrigin || this.options.crossOrigin === "") && (o.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (o.referrerPolicy = this.options.referrerPolicy), o.alt = "", o.src = this.getTileUrl(e), o;
      },
      // @section Extension methods
      // @uninheritable
      // Layers extending `TileLayer` might reimplement the following method.
      // @method getTileUrl(coords: Object): String
      // Called only internally, returns the URL for a tile given its coordinates.
      // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
      getTileUrl: function(e) {
        var r = {
          r: z.retina ? "@2x" : "",
          s: this._getSubdomain(e),
          x: e.x,
          y: e.y,
          z: this._getZoomForUrl()
        };
        if (this._map && !this._map.options.crs.infinite) {
          var o = this._globalTileRange.max.y - e.y;
          this.options.tms && (r.y = o), r["-y"] = o;
        }
        return nt(this._url, a(r, this.options));
      },
      _tileOnLoad: function(e, r) {
        z.ielt9 ? setTimeout(h(e, this, null, r), 0) : e(null, r);
      },
      _tileOnError: function(e, r, o) {
        var c = this.options.errorTileUrl;
        c && r.getAttribute("src") !== c && (r.src = c), e(o, r);
      },
      _onTileRemove: function(e) {
        e.tile.onload = null;
      },
      _getZoomForUrl: function() {
        var e = this._tileZoom, r = this.options.maxZoom, o = this.options.zoomReverse, c = this.options.zoomOffset;
        return o && (e = r - e), e + c;
      },
      _getSubdomain: function(e) {
        var r = Math.abs(e.x + e.y) % this.options.subdomains.length;
        return this.options.subdomains[r];
      },
      // stops loading all tiles in the background layer
      _abortLoading: function() {
        var e, r;
        for (e in this._tiles)
          if (this._tiles[e].coords.z !== this._tileZoom && (r = this._tiles[e].el, r.onload = y, r.onerror = y, !r.complete)) {
            r.src = Kt;
            var o = this._tiles[e].coords;
            Pt(r), delete this._tiles[e], this.fire("tileabort", {
              tile: r,
              coords: o
            });
          }
      },
      _removeTile: function(e) {
        var r = this._tiles[e];
        if (r)
          return r.el.setAttribute("src", Kt), Qi.prototype._removeTile.call(this, e);
      },
      _tileReady: function(e, r, o) {
        if (!(!this._map || o && o.getAttribute("src") === Kt))
          return Qi.prototype._tileReady.call(this, e, r, o);
      }
    });
    function Hl(e, r) {
      return new Qn(e, r);
    }
    var jl = Qn.extend({
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
      initialize: function(e, r) {
        this._url = e;
        var o = a({}, this.defaultWmsParams);
        for (var c in r)
          c in this.options || (o[c] = r[c]);
        r = I(this, r);
        var l = r.detectRetina && z.retina ? 2 : 1, f = this.getTileSize();
        o.width = f.x * l, o.height = f.y * l, this.wmsParams = o;
      },
      onAdd: function(e) {
        this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
        var r = this._wmsVersion >= 1.3 ? "crs" : "srs";
        this.wmsParams[r] = this._crs.code, Qn.prototype.onAdd.call(this, e);
      },
      getTileUrl: function(e) {
        var r = this._tileCoordsToNwSe(e), o = this._crs, c = Gt(o.project(r[0]), o.project(r[1])), l = c.min, f = c.max, p = (this._wmsVersion >= 1.3 && this._crs === Al ? [l.y, l.x, f.y, f.x] : [l.x, l.y, f.x, f.y]).join(","), b = Qn.prototype.getTileUrl.call(this, e);
        return b + D(this.wmsParams, b, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + p;
      },
      // @method setParams(params: Object, noRedraw?: Boolean): this
      // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
      setParams: function(e, r) {
        return a(this.wmsParams, e), r || this.redraw(), this;
      }
    });
    function uv(e, r) {
      return new jl(e, r);
    }
    Qn.WMS = jl, Hl.wms = uv;
    var qe = Ee.extend({
      // @section
      // @aka Renderer options
      options: {
        // @option padding: Number = 0.1
        // How much to extend the clip area around the map view (relative to its size)
        // e.g. 0.1 would be 10% of map view in each direction
        padding: 0.1
      },
      initialize: function(e) {
        I(this, e), m(this), this._layers = this._layers || {};
      },
      onAdd: function() {
        this._container || (this._initContainer(), J(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
      },
      onRemove: function() {
        this.off("update", this._updatePaths, this), this._destroyContainer();
      },
      getEvents: function() {
        var e = {
          viewreset: this._reset,
          zoom: this._onZoom,
          moveend: this._update,
          zoomend: this._onZoomEnd
        };
        return this._zoomAnimated && (e.zoomanim = this._onAnimZoom), e;
      },
      _onAnimZoom: function(e) {
        this._updateTransform(e.center, e.zoom);
      },
      _onZoom: function() {
        this._updateTransform(this._map.getCenter(), this._map.getZoom());
      },
      _updateTransform: function(e, r) {
        var o = this._map.getZoomScale(r, this._zoom), c = this._map.getSize().multiplyBy(0.5 + this.options.padding), l = this._map.project(this._center, r), f = c.multiplyBy(-o).add(l).subtract(this._map._getNewPixelOrigin(e, r));
        z.any3d ? pn(this._container, f, o) : Nt(this._container, f);
      },
      _reset: function() {
        this._update(), this._updateTransform(this._center, this._zoom);
        for (var e in this._layers)
          this._layers[e]._reset();
      },
      _onZoomEnd: function() {
        for (var e in this._layers)
          this._layers[e]._project();
      },
      _updatePaths: function() {
        for (var e in this._layers)
          this._layers[e]._update();
      },
      _update: function() {
        var e = this.options.padding, r = this._map.getSize(), o = this._map.containerPointToLayerPoint(r.multiplyBy(-e)).round();
        this._bounds = new ot(o, o.add(r.multiplyBy(1 + e * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
      }
    }), Ul = qe.extend({
      // @section
      // @aka Canvas options
      options: {
        // @option tolerance: Number = 0
        // How much to extend the click tolerance around a path/object on the map.
        tolerance: 0
      },
      getEvents: function() {
        var e = qe.prototype.getEvents.call(this);
        return e.viewprereset = this._onViewPreReset, e;
      },
      _onViewPreReset: function() {
        this._postponeUpdatePaths = !0;
      },
      onAdd: function() {
        qe.prototype.onAdd.call(this), this._draw();
      },
      _initContainer: function() {
        var e = this._container = document.createElement("canvas");
        q(e, "mousemove", this._onMouseMove, this), q(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), q(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
      },
      _destroyContainer: function() {
        G(this._redrawRequest), delete this._ctx, Pt(this._container), gt(this._container), delete this._container;
      },
      _updatePaths: function() {
        if (!this._postponeUpdatePaths) {
          var e;
          this._redrawBounds = null;
          for (var r in this._layers)
            e = this._layers[r], e._update();
          this._redraw();
        }
      },
      _update: function() {
        if (!(this._map._animatingZoom && this._bounds)) {
          qe.prototype._update.call(this);
          var e = this._bounds, r = this._container, o = e.getSize(), c = z.retina ? 2 : 1;
          Nt(r, e.min), r.width = c * o.x, r.height = c * o.y, r.style.width = o.x + "px", r.style.height = o.y + "px", z.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
        }
      },
      _reset: function() {
        qe.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
      },
      _initPath: function(e) {
        this._updateDashArray(e), this._layers[m(e)] = e;
        var r = e._order = {
          layer: e,
          prev: this._drawLast,
          next: null
        };
        this._drawLast && (this._drawLast.next = r), this._drawLast = r, this._drawFirst = this._drawFirst || this._drawLast;
      },
      _addPath: function(e) {
        this._requestRedraw(e);
      },
      _removePath: function(e) {
        var r = e._order, o = r.next, c = r.prev;
        o ? o.prev = c : this._drawLast = c, c ? c.next = o : this._drawFirst = o, delete e._order, delete this._layers[m(e)], this._requestRedraw(e);
      },
      _updatePath: function(e) {
        this._extendRedrawBounds(e), e._project(), e._update(), this._requestRedraw(e);
      },
      _updateStyle: function(e) {
        this._updateDashArray(e), this._requestRedraw(e);
      },
      _updateDashArray: function(e) {
        if (typeof e.options.dashArray == "string") {
          var r = e.options.dashArray.split(/[, ]+/), o = [], c, l;
          for (l = 0; l < r.length; l++) {
            if (c = Number(r[l]), isNaN(c))
              return;
            o.push(c);
          }
          e.options._dashArray = o;
        } else
          e.options._dashArray = e.options.dashArray;
      },
      _requestRedraw: function(e) {
        this._map && (this._extendRedrawBounds(e), this._redrawRequest = this._redrawRequest || W(this._redraw, this));
      },
      _extendRedrawBounds: function(e) {
        if (e._pxBounds) {
          var r = (e.options.weight || 0) + 1;
          this._redrawBounds = this._redrawBounds || new ot(), this._redrawBounds.extend(e._pxBounds.min.subtract([r, r])), this._redrawBounds.extend(e._pxBounds.max.add([r, r]));
        }
      },
      _redraw: function() {
        this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
      },
      _clear: function() {
        var e = this._redrawBounds;
        if (e) {
          var r = e.getSize();
          this._ctx.clearRect(e.min.x, e.min.y, r.x, r.y);
        } else
          this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore();
      },
      _draw: function() {
        var e, r = this._redrawBounds;
        if (this._ctx.save(), r) {
          var o = r.getSize();
          this._ctx.beginPath(), this._ctx.rect(r.min.x, r.min.y, o.x, o.y), this._ctx.clip();
        }
        this._drawing = !0;
        for (var c = this._drawFirst; c; c = c.next)
          e = c.layer, (!r || e._pxBounds && e._pxBounds.intersects(r)) && e._updatePath();
        this._drawing = !1, this._ctx.restore();
      },
      _updatePoly: function(e, r) {
        if (this._drawing) {
          var o, c, l, f, p = e._parts, b = p.length, S = this._ctx;
          if (b) {
            for (S.beginPath(), o = 0; o < b; o++) {
              for (c = 0, l = p[o].length; c < l; c++)
                f = p[o][c], S[c ? "lineTo" : "moveTo"](f.x, f.y);
              r && S.closePath();
            }
            this._fillStroke(S, e);
          }
        }
      },
      _updateCircle: function(e) {
        if (!(!this._drawing || e._empty())) {
          var r = e._point, o = this._ctx, c = Math.max(Math.round(e._radius), 1), l = (Math.max(Math.round(e._radiusY), 1) || c) / c;
          l !== 1 && (o.save(), o.scale(1, l)), o.beginPath(), o.arc(r.x, r.y / l, c, 0, Math.PI * 2, !1), l !== 1 && o.restore(), this._fillStroke(o, e);
        }
      },
      _fillStroke: function(e, r) {
        var o = r.options;
        o.fill && (e.globalAlpha = o.fillOpacity, e.fillStyle = o.fillColor || o.color, e.fill(o.fillRule || "evenodd")), o.stroke && o.weight !== 0 && (e.setLineDash && e.setLineDash(r.options && r.options._dashArray || []), e.globalAlpha = o.opacity, e.lineWidth = o.weight, e.strokeStyle = o.color, e.lineCap = o.lineCap, e.lineJoin = o.lineJoin, e.stroke());
      },
      // Canvas obviously doesn't have mouse events for individual drawn objects,
      // so we emulate that by calculating what's under the mouse on mousemove/click manually
      _onClick: function(e) {
        for (var r = this._map.mouseEventToLayerPoint(e), o, c, l = this._drawFirst; l; l = l.next)
          o = l.layer, o.options.interactive && o._containsPoint(r) && (!(e.type === "click" || e.type === "preclick") || !this._map._draggableMoved(o)) && (c = o);
        this._fireEvent(c ? [c] : !1, e);
      },
      _onMouseMove: function(e) {
        if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
          var r = this._map.mouseEventToLayerPoint(e);
          this._handleMouseHover(e, r);
        }
      },
      _handleMouseOut: function(e) {
        var r = this._hoveredLayer;
        r && (It(this._container, "leaflet-interactive"), this._fireEvent([r], e, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
      },
      _handleMouseHover: function(e, r) {
        if (!this._mouseHoverThrottled) {
          for (var o, c, l = this._drawFirst; l; l = l.next)
            o = l.layer, o.options.interactive && o._containsPoint(r) && (c = o);
          c !== this._hoveredLayer && (this._handleMouseOut(e), c && (J(this._container, "leaflet-interactive"), this._fireEvent([c], e, "mouseover"), this._hoveredLayer = c)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(h(function() {
            this._mouseHoverThrottled = !1;
          }, this), 32);
        }
      },
      _fireEvent: function(e, r, o) {
        this._map._fireDOMEvent(r, o || r.type, e);
      },
      _bringToFront: function(e) {
        var r = e._order;
        if (r) {
          var o = r.next, c = r.prev;
          if (o)
            o.prev = c;
          else
            return;
          c ? c.next = o : o && (this._drawFirst = o), r.prev = this._drawLast, this._drawLast.next = r, r.next = null, this._drawLast = r, this._requestRedraw(e);
        }
      },
      _bringToBack: function(e) {
        var r = e._order;
        if (r) {
          var o = r.next, c = r.prev;
          if (c)
            c.next = o;
          else
            return;
          o ? o.prev = c : c && (this._drawLast = c), r.prev = null, r.next = this._drawFirst, this._drawFirst.prev = r, this._drawFirst = r, this._requestRedraw(e);
        }
      }
    });
    function Wl(e) {
      return z.canvas ? new Ul(e) : null;
    }
    var tr = function() {
      try {
        return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(e) {
          return document.createElement("<lvml:" + e + ' class="lvml">');
        };
      } catch {
      }
      return function(e) {
        return document.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }(), lv = {
      _initContainer: function() {
        this._container = ft("div", "leaflet-vml-container");
      },
      _update: function() {
        this._map._animatingZoom || (qe.prototype._update.call(this), this.fire("update"));
      },
      _initPath: function(e) {
        var r = e._container = tr("shape");
        J(r, "leaflet-vml-shape " + (this.options.className || "")), r.coordsize = "1 1", e._path = tr("path"), r.appendChild(e._path), this._updateStyle(e), this._layers[m(e)] = e;
      },
      _addPath: function(e) {
        var r = e._container;
        this._container.appendChild(r), e.options.interactive && e.addInteractiveTarget(r);
      },
      _removePath: function(e) {
        var r = e._container;
        Pt(r), e.removeInteractiveTarget(r), delete this._layers[m(e)];
      },
      _updateStyle: function(e) {
        var r = e._stroke, o = e._fill, c = e.options, l = e._container;
        l.stroked = !!c.stroke, l.filled = !!c.fill, c.stroke ? (r || (r = e._stroke = tr("stroke")), l.appendChild(r), r.weight = c.weight + "px", r.color = c.color, r.opacity = c.opacity, c.dashArray ? r.dashStyle = ht(c.dashArray) ? c.dashArray.join(" ") : c.dashArray.replace(/( *, *)/g, " ") : r.dashStyle = "", r.endcap = c.lineCap.replace("butt", "flat"), r.joinstyle = c.lineJoin) : r && (l.removeChild(r), e._stroke = null), c.fill ? (o || (o = e._fill = tr("fill")), l.appendChild(o), o.color = c.fillColor || c.color, o.opacity = c.fillOpacity) : o && (l.removeChild(o), e._fill = null);
      },
      _updateCircle: function(e) {
        var r = e._point.round(), o = Math.round(e._radius), c = Math.round(e._radiusY || o);
        this._setPath(e, e._empty() ? "M0 0" : "AL " + r.x + "," + r.y + " " + o + "," + c + " 0," + 65535 * 360);
      },
      _setPath: function(e, r) {
        e._path.v = r;
      },
      _bringToFront: function(e) {
        qn(e._container);
      },
      _bringToBack: function(e) {
        Kn(e._container);
      }
    }, ws = z.vml ? tr : ns, er = qe.extend({
      _initContainer: function() {
        this._container = ws("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = ws("g"), this._container.appendChild(this._rootGroup);
      },
      _destroyContainer: function() {
        Pt(this._container), gt(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
      },
      _update: function() {
        if (!(this._map._animatingZoom && this._bounds)) {
          qe.prototype._update.call(this);
          var e = this._bounds, r = e.getSize(), o = this._container;
          (!this._svgSize || !this._svgSize.equals(r)) && (this._svgSize = r, o.setAttribute("width", r.x), o.setAttribute("height", r.y)), Nt(o, e.min), o.setAttribute("viewBox", [e.min.x, e.min.y, r.x, r.y].join(" ")), this.fire("update");
        }
      },
      // methods below are called by vector layers implementations
      _initPath: function(e) {
        var r = e._path = ws("path");
        e.options.className && J(r, e.options.className), e.options.interactive && J(r, "leaflet-interactive"), this._updateStyle(e), this._layers[m(e)] = e;
      },
      _addPath: function(e) {
        this._rootGroup || this._initContainer(), this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path);
      },
      _removePath: function(e) {
        Pt(e._path), e.removeInteractiveTarget(e._path), delete this._layers[m(e)];
      },
      _updatePath: function(e) {
        e._project(), e._update();
      },
      _updateStyle: function(e) {
        var r = e._path, o = e.options;
        r && (o.stroke ? (r.setAttribute("stroke", o.color), r.setAttribute("stroke-opacity", o.opacity), r.setAttribute("stroke-width", o.weight), r.setAttribute("stroke-linecap", o.lineCap), r.setAttribute("stroke-linejoin", o.lineJoin), o.dashArray ? r.setAttribute("stroke-dasharray", o.dashArray) : r.removeAttribute("stroke-dasharray"), o.dashOffset ? r.setAttribute("stroke-dashoffset", o.dashOffset) : r.removeAttribute("stroke-dashoffset")) : r.setAttribute("stroke", "none"), o.fill ? (r.setAttribute("fill", o.fillColor || o.color), r.setAttribute("fill-opacity", o.fillOpacity), r.setAttribute("fill-rule", o.fillRule || "evenodd")) : r.setAttribute("fill", "none"));
      },
      _updatePoly: function(e, r) {
        this._setPath(e, is(e._parts, r));
      },
      _updateCircle: function(e) {
        var r = e._point, o = Math.max(Math.round(e._radius), 1), c = Math.max(Math.round(e._radiusY), 1) || o, l = "a" + o + "," + c + " 0 1,0 ", f = e._empty() ? "M0 0" : "M" + (r.x - o) + "," + r.y + l + o * 2 + ",0 " + l + -o * 2 + ",0 ";
        this._setPath(e, f);
      },
      _setPath: function(e, r) {
        e._path.setAttribute("d", r);
      },
      // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
      _bringToFront: function(e) {
        qn(e._path);
      },
      _bringToBack: function(e) {
        Kn(e._path);
      }
    });
    z.vml && er.include(lv);
    function Vl(e) {
      return z.svg || z.vml ? new er(e) : null;
    }
    ct.include({
      // @namespace Map; @method getRenderer(layer: Path): Renderer
      // Returns the instance of `Renderer` that should be used to render the given
      // `Path`. It will ensure that the `renderer` options of the map and paths
      // are respected, and that the renderers do exist on the map.
      getRenderer: function(e) {
        var r = e.options.renderer || this._getPaneRenderer(e.options.pane) || this.options.renderer || this._renderer;
        return r || (r = this._renderer = this._createRenderer()), this.hasLayer(r) || this.addLayer(r), r;
      },
      _getPaneRenderer: function(e) {
        if (e === "overlayPane" || e === void 0)
          return !1;
        var r = this._paneRenderers[e];
        return r === void 0 && (r = this._createRenderer({ pane: e }), this._paneRenderers[e] = r), r;
      },
      _createRenderer: function(e) {
        return this.options.preferCanvas && Wl(e) || Vl(e);
      }
    });
    var ql = Yn.extend({
      initialize: function(e, r) {
        Yn.prototype.initialize.call(this, this._boundsToLatLngs(e), r);
      },
      // @method setBounds(latLngBounds: LatLngBounds): this
      // Redraws the rectangle with the passed bounds.
      setBounds: function(e) {
        return this.setLatLngs(this._boundsToLatLngs(e));
      },
      _boundsToLatLngs: function(e) {
        return e = pt(e), [
          e.getSouthWest(),
          e.getNorthWest(),
          e.getNorthEast(),
          e.getSouthEast()
        ];
      }
    });
    function hv(e, r) {
      return new ql(e, r);
    }
    er.create = ws, er.pointsToPath = is, Ve.geometryToLayer = ms, Ve.coordsToLatLng = xa, Ve.coordsToLatLngs = _s, Ve.latLngToCoords = Ea, Ve.latLngsToCoords = ps, Ve.getFeature = Xn, Ve.asFeature = gs, ct.mergeOptions({
      // @option boxZoom: Boolean = true
      // Whether the map can be zoomed to a rectangular area specified by
      // dragging the mouse while pressing the shift key.
      boxZoom: !0
    });
    var Kl = Ae.extend({
      initialize: function(e) {
        this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
      },
      addHooks: function() {
        q(this._container, "mousedown", this._onMouseDown, this);
      },
      removeHooks: function() {
        gt(this._container, "mousedown", this._onMouseDown, this);
      },
      moved: function() {
        return this._moved;
      },
      _destroy: function() {
        Pt(this._pane), delete this._pane;
      },
      _resetState: function() {
        this._resetStateTimeout = 0, this._moved = !1;
      },
      _clearDeferredResetState: function() {
        this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
      },
      _onMouseDown: function(e) {
        if (!e.shiftKey || e.which !== 1 && e.button !== 1)
          return !1;
        this._clearDeferredResetState(), this._resetState(), Vi(), ca(), this._startPoint = this._map.mouseEventToContainerPoint(e), q(document, {
          contextmenu: yn,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseMove: function(e) {
        this._moved || (this._moved = !0, this._box = ft("div", "leaflet-zoom-box", this._container), J(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
        var r = new ot(this._point, this._startPoint), o = r.getSize();
        Nt(this._box, r.min), this._box.style.width = o.x + "px", this._box.style.height = o.y + "px";
      },
      _finish: function() {
        this._moved && (Pt(this._box), It(this._container, "leaflet-crosshair")), qi(), ua(), gt(document, {
          contextmenu: yn,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseUp: function(e) {
        if (!(e.which !== 1 && e.button !== 1) && (this._finish(), !!this._moved)) {
          this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(h(this._resetState, this), 0);
          var r = new bt(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point)
          );
          this._map.fitBounds(r).fire("boxzoomend", { boxZoomBounds: r });
        }
      },
      _onKeyDown: function(e) {
        e.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
      }
    });
    ct.addInitHook("addHandler", "boxZoom", Kl), ct.mergeOptions({
      // @option doubleClickZoom: Boolean|String = true
      // Whether the map can be zoomed in by double clicking on it and
      // zoomed out by double clicking while holding shift. If passed
      // `'center'`, double-click zoom will zoom to the center of the
      //  view regardless of where the mouse was.
      doubleClickZoom: !0
    });
    var Gl = Ae.extend({
      addHooks: function() {
        this._map.on("dblclick", this._onDoubleClick, this);
      },
      removeHooks: function() {
        this._map.off("dblclick", this._onDoubleClick, this);
      },
      _onDoubleClick: function(e) {
        var r = this._map, o = r.getZoom(), c = r.options.zoomDelta, l = e.originalEvent.shiftKey ? o - c : o + c;
        r.options.doubleClickZoom === "center" ? r.setZoom(l) : r.setZoomAround(e.containerPoint, l);
      }
    });
    ct.addInitHook("addHandler", "doubleClickZoom", Gl), ct.mergeOptions({
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
    var Jl = Ae.extend({
      addHooks: function() {
        if (!this._draggable) {
          var e = this._map;
          this._draggable = new an(e._mapPane, e._container), this._draggable.on({
            dragstart: this._onDragStart,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this), this._draggable.on("predrag", this._onPreDragLimit, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), e.on("zoomend", this._onZoomEnd, this), e.whenReady(this._onZoomEnd, this));
        }
        J(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
      },
      removeHooks: function() {
        It(this._map._container, "leaflet-grab"), It(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      moving: function() {
        return this._draggable && this._draggable._moving;
      },
      _onDragStart: function() {
        var e = this._map;
        if (e._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
          var r = pt(this._map.options.maxBounds);
          this._offsetLimit = Gt(
            this._map.latLngToContainerPoint(r.getNorthWest()).multiplyBy(-1),
            this._map.latLngToContainerPoint(r.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
          ), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
        } else
          this._offsetLimit = null;
        e.fire("movestart").fire("dragstart"), e.options.inertia && (this._positions = [], this._times = []);
      },
      _onDrag: function(e) {
        if (this._map.options.inertia) {
          var r = this._lastTime = +/* @__PURE__ */ new Date(), o = this._lastPos = this._draggable._absPos || this._draggable._newPos;
          this._positions.push(o), this._times.push(r), this._prunePositions(r);
        }
        this._map.fire("move", e).fire("drag", e);
      },
      _prunePositions: function(e) {
        for (; this._positions.length > 1 && e - this._times[0] > 50; )
          this._positions.shift(), this._times.shift();
      },
      _onZoomEnd: function() {
        var e = this._map.getSize().divideBy(2), r = this._map.latLngToLayerPoint([0, 0]);
        this._initialWorldOffset = r.subtract(e).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
      },
      _viscousLimit: function(e, r) {
        return e - (e - r) * this._viscosity;
      },
      _onPreDragLimit: function() {
        if (!(!this._viscosity || !this._offsetLimit)) {
          var e = this._draggable._newPos.subtract(this._draggable._startPos), r = this._offsetLimit;
          e.x < r.min.x && (e.x = this._viscousLimit(e.x, r.min.x)), e.y < r.min.y && (e.y = this._viscousLimit(e.y, r.min.y)), e.x > r.max.x && (e.x = this._viscousLimit(e.x, r.max.x)), e.y > r.max.y && (e.y = this._viscousLimit(e.y, r.max.y)), this._draggable._newPos = this._draggable._startPos.add(e);
        }
      },
      _onPreDragWrap: function() {
        var e = this._worldWidth, r = Math.round(e / 2), o = this._initialWorldOffset, c = this._draggable._newPos.x, l = (c - r + o) % e + r - o, f = (c + r + o) % e - r - o, p = Math.abs(l + o) < Math.abs(f + o) ? l : f;
        this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = p;
      },
      _onDragEnd: function(e) {
        var r = this._map, o = r.options, c = !o.inertia || e.noInertia || this._times.length < 2;
        if (r.fire("dragend", e), c)
          r.fire("moveend");
        else {
          this._prunePositions(+/* @__PURE__ */ new Date());
          var l = this._lastPos.subtract(this._positions[0]), f = (this._lastTime - this._times[0]) / 1e3, p = o.easeLinearity, b = l.multiplyBy(p / f), S = b.distanceTo([0, 0]), k = Math.min(o.inertiaMaxSpeed, S), N = b.multiplyBy(k / S), j = k / (o.inertiaDeceleration * p), rt = N.multiplyBy(-j / 2).round();
          !rt.x && !rt.y ? r.fire("moveend") : (rt = r._limitOffset(rt, r.options.maxBounds), W(function() {
            r.panBy(rt, {
              duration: j,
              easeLinearity: p,
              noMoveStart: !0,
              animate: !0
            });
          }));
        }
      }
    });
    ct.addInitHook("addHandler", "dragging", Jl), ct.mergeOptions({
      // @option keyboard: Boolean = true
      // Makes the map focusable and allows users to navigate the map with keyboard
      // arrows and `+`/`-` keys.
      keyboard: !0,
      // @option keyboardPanDelta: Number = 80
      // Amount of pixels to pan when pressing an arrow key.
      keyboardPanDelta: 80
    });
    var Yl = Ae.extend({
      keyCodes: {
        left: [37],
        right: [39],
        down: [40],
        up: [38],
        zoomIn: [187, 107, 61, 171],
        zoomOut: [189, 109, 54, 173]
      },
      initialize: function(e) {
        this._map = e, this._setPanDelta(e.options.keyboardPanDelta), this._setZoomDelta(e.options.zoomDelta);
      },
      addHooks: function() {
        var e = this._map._container;
        e.tabIndex <= 0 && (e.tabIndex = "0"), q(e, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this), this._map.on({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      removeHooks: function() {
        this._removeHooks(), gt(this._map._container, {
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
          var e = document.body, r = document.documentElement, o = e.scrollTop || r.scrollTop, c = e.scrollLeft || r.scrollLeft;
          this._map._container.focus(), window.scrollTo(c, o);
        }
      },
      _onFocus: function() {
        this._focused = !0, this._map.fire("focus");
      },
      _onBlur: function() {
        this._focused = !1, this._map.fire("blur");
      },
      _setPanDelta: function(e) {
        var r = this._panKeys = {}, o = this.keyCodes, c, l;
        for (c = 0, l = o.left.length; c < l; c++)
          r[o.left[c]] = [-1 * e, 0];
        for (c = 0, l = o.right.length; c < l; c++)
          r[o.right[c]] = [e, 0];
        for (c = 0, l = o.down.length; c < l; c++)
          r[o.down[c]] = [0, e];
        for (c = 0, l = o.up.length; c < l; c++)
          r[o.up[c]] = [0, -1 * e];
      },
      _setZoomDelta: function(e) {
        var r = this._zoomKeys = {}, o = this.keyCodes, c, l;
        for (c = 0, l = o.zoomIn.length; c < l; c++)
          r[o.zoomIn[c]] = e;
        for (c = 0, l = o.zoomOut.length; c < l; c++)
          r[o.zoomOut[c]] = -e;
      },
      _addHooks: function() {
        q(document, "keydown", this._onKeyDown, this);
      },
      _removeHooks: function() {
        gt(document, "keydown", this._onKeyDown, this);
      },
      _onKeyDown: function(e) {
        if (!(e.altKey || e.ctrlKey || e.metaKey)) {
          var r = e.keyCode, o = this._map, c;
          if (r in this._panKeys) {
            if (!o._panAnim || !o._panAnim._inProgress)
              if (c = this._panKeys[r], e.shiftKey && (c = $(c).multiplyBy(3)), o.options.maxBounds && (c = o._limitOffset($(c), o.options.maxBounds)), o.options.worldCopyJump) {
                var l = o.wrapLatLng(o.unproject(o.project(o.getCenter()).add(c)));
                o.panTo(l);
              } else
                o.panBy(c);
          } else if (r in this._zoomKeys)
            o.setZoom(o.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[r]);
          else if (r === 27 && o._popup && o._popup.options.closeOnEscapeKey)
            o.closePopup();
          else
            return;
          yn(e);
        }
      }
    });
    ct.addInitHook("addHandler", "keyboard", Yl), ct.mergeOptions({
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
    var Xl = Ae.extend({
      addHooks: function() {
        q(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
      },
      removeHooks: function() {
        gt(this._map._container, "wheel", this._onWheelScroll, this);
      },
      _onWheelScroll: function(e) {
        var r = Sl(e), o = this._map.options.wheelDebounceTime;
        this._delta += r, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
        var c = Math.max(o - (+/* @__PURE__ */ new Date() - this._startTime), 0);
        clearTimeout(this._timer), this._timer = setTimeout(h(this._performZoom, this), c), yn(e);
      },
      _performZoom: function() {
        var e = this._map, r = e.getZoom(), o = this._map.options.zoomSnap || 0;
        e._stop();
        var c = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), l = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(c)))) / Math.LN2, f = o ? Math.ceil(l / o) * o : l, p = e._limitZoom(r + (this._delta > 0 ? f : -f)) - r;
        this._delta = 0, this._startTime = null, p && (e.options.scrollWheelZoom === "center" ? e.setZoom(r + p) : e.setZoomAround(this._lastMousePos, r + p));
      }
    });
    ct.addInitHook("addHandler", "scrollWheelZoom", Xl);
    var fv = 600;
    ct.mergeOptions({
      // @section Touch interaction options
      // @option tapHold: Boolean
      // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
      tapHold: z.touchNative && z.safari && z.mobile,
      // @option tapTolerance: Number = 15
      // The max number of pixels a user can shift his finger during touch
      // for it to be considered a valid tap.
      tapTolerance: 15
    });
    var Ql = Ae.extend({
      addHooks: function() {
        q(this._map._container, "touchstart", this._onDown, this);
      },
      removeHooks: function() {
        gt(this._map._container, "touchstart", this._onDown, this);
      },
      _onDown: function(e) {
        if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
          var r = e.touches[0];
          this._startPos = this._newPos = new R(r.clientX, r.clientY), this._holdTimeout = setTimeout(h(function() {
            this._cancel(), this._isTapValid() && (q(document, "touchend", Jt), q(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", r));
          }, this), fv), q(document, "touchend touchcancel contextmenu", this._cancel, this), q(document, "touchmove", this._onMove, this);
        }
      },
      _cancelClickPrevent: function e() {
        gt(document, "touchend", Jt), gt(document, "touchend touchcancel", e);
      },
      _cancel: function() {
        clearTimeout(this._holdTimeout), gt(document, "touchend touchcancel contextmenu", this._cancel, this), gt(document, "touchmove", this._onMove, this);
      },
      _onMove: function(e) {
        var r = e.touches[0];
        this._newPos = new R(r.clientX, r.clientY);
      },
      _isTapValid: function() {
        return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
      },
      _simulateEvent: function(e, r) {
        var o = new MouseEvent(e, {
          bubbles: !0,
          cancelable: !0,
          view: window,
          // detail: 1,
          screenX: r.screenX,
          screenY: r.screenY,
          clientX: r.clientX,
          clientY: r.clientY
          // button: 2,
          // buttons: 2
        });
        o._simulated = !0, r.target.dispatchEvent(o);
      }
    });
    ct.addInitHook("addHandler", "tapHold", Ql), ct.mergeOptions({
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
    var th = Ae.extend({
      addHooks: function() {
        J(this._map._container, "leaflet-touch-zoom"), q(this._map._container, "touchstart", this._onTouchStart, this);
      },
      removeHooks: function() {
        It(this._map._container, "leaflet-touch-zoom"), gt(this._map._container, "touchstart", this._onTouchStart, this);
      },
      _onTouchStart: function(e) {
        var r = this._map;
        if (!(!e.touches || e.touches.length !== 2 || r._animatingZoom || this._zooming)) {
          var o = r.mouseEventToContainerPoint(e.touches[0]), c = r.mouseEventToContainerPoint(e.touches[1]);
          this._centerPoint = r.getSize()._divideBy(2), this._startLatLng = r.containerPointToLatLng(this._centerPoint), r.options.touchZoom !== "center" && (this._pinchStartLatLng = r.containerPointToLatLng(o.add(c)._divideBy(2))), this._startDist = o.distanceTo(c), this._startZoom = r.getZoom(), this._moved = !1, this._zooming = !0, r._stop(), q(document, "touchmove", this._onTouchMove, this), q(document, "touchend touchcancel", this._onTouchEnd, this), Jt(e);
        }
      },
      _onTouchMove: function(e) {
        if (!(!e.touches || e.touches.length !== 2 || !this._zooming)) {
          var r = this._map, o = r.mouseEventToContainerPoint(e.touches[0]), c = r.mouseEventToContainerPoint(e.touches[1]), l = o.distanceTo(c) / this._startDist;
          if (this._zoom = r.getScaleZoom(l, this._startZoom), !r.options.bounceAtZoomLimits && (this._zoom < r.getMinZoom() && l < 1 || this._zoom > r.getMaxZoom() && l > 1) && (this._zoom = r._limitZoom(this._zoom)), r.options.touchZoom === "center") {
            if (this._center = this._startLatLng, l === 1)
              return;
          } else {
            var f = o._add(c)._divideBy(2)._subtract(this._centerPoint);
            if (l === 1 && f.x === 0 && f.y === 0)
              return;
            this._center = r.unproject(r.project(this._pinchStartLatLng, this._zoom).subtract(f), this._zoom);
          }
          this._moved || (r._moveStart(!0, !1), this._moved = !0), G(this._animRequest);
          var p = h(r._move, r, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
          this._animRequest = W(p, this, !0), Jt(e);
        }
      },
      _onTouchEnd: function() {
        if (!this._moved || !this._zooming) {
          this._zooming = !1;
          return;
        }
        this._zooming = !1, G(this._animRequest), gt(document, "touchmove", this._onTouchMove, this), gt(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
      }
    });
    ct.addInitHook("addHandler", "touchZoom", th), ct.BoxZoom = Kl, ct.DoubleClickZoom = Gl, ct.Drag = Jl, ct.Keyboard = Yl, ct.ScrollWheelZoom = Xl, ct.TapHold = Ql, ct.TouchZoom = th, i.Bounds = ot, i.Browser = z, i.CRS = Yt, i.Canvas = Ul, i.Circle = Pa, i.CircleMarker = ds, i.Class = St, i.Control = xe, i.DivIcon = Zl, i.DivOverlay = Fe, i.DomEvent = Cg, i.DomUtil = kg, i.Draggable = an, i.Evented = H, i.FeatureGroup = Ue, i.GeoJSON = Ve, i.GridLayer = Qi, i.Handler = Ae, i.Icon = Jn, i.ImageOverlay = vs, i.LatLng = A, i.LatLngBounds = bt, i.Layer = Ee, i.LayerGroup = Gn, i.LineUtil = jg, i.Map = ct, i.Marker = fs, i.Mixin = zg, i.Path = cn, i.Point = R, i.PolyUtil = $g, i.Polygon = Yn, i.Polyline = We, i.Popup = ys, i.PosAnimation = Tl, i.Projection = Ug, i.Rectangle = ql, i.Renderer = qe, i.SVG = er, i.SVGOverlay = Dl, i.TileLayer = Qn, i.Tooltip = bs, i.Transformation = Wt, i.Util = le, i.VideoOverlay = Bl, i.bind = h, i.bounds = Gt, i.canvas = Wl, i.circle = Xg, i.circleMarker = Yg, i.control = Ji, i.divIcon = av, i.extend = a, i.featureGroup = Kg, i.geoJSON = $l, i.geoJson = ev, i.gridLayer = cv, i.icon = Gg, i.imageOverlay = nv, i.latLng = K, i.latLngBounds = pt, i.layerGroup = qg, i.map = Ig, i.marker = Jg, i.point = $, i.polygon = tv, i.polyline = Qg, i.popup = sv, i.rectangle = hv, i.setOptions = I, i.stamp = m, i.svg = Vl, i.svgOverlay = rv, i.tileLayer = Hl, i.tooltip = ov, i.transformation = He, i.version = s, i.videoOverlay = iv;
    var dv = window.L;
    i.noConflict = function() {
      return window.L = dv, this;
    }, window.L = i;
  });
})($c, $c.exports);
var Un = $c.exports;
const ts = /* @__PURE__ */ OC(Un);
function es(t, n, i) {
  return Object.freeze({
    instance: t,
    context: n,
    container: i
  });
}
function Xo(t, n) {
  return n == null ? function(s, a) {
    const u = vt();
    return u.current || (u.current = t(s, a)), u;
  } : function(s, a) {
    const u = vt();
    u.current || (u.current = t(s, a));
    const h = vt(s), { instance: d } = u.current;
    return $t(function() {
      h.current !== s && (n(d, s, h.current), h.current = s);
    }, [
      d,
      s,
      a
    ]), u;
  };
}
function tg(t, n) {
  $t(function() {
    return (n.layerContainer ?? n.map).addLayer(t.instance), function() {
      var u;
      (u = n.layerContainer) == null || u.removeLayer(t.instance), n.map.removeLayer(t.instance);
    };
  }, [
    n,
    t
  ]);
}
function eg(t) {
  return function(i) {
    const s = Jo(), a = t(Yo(i, s), s);
    return Jp(s.map, i.attribution), Xu(a.current, i.eventHandlers), tg(a.current, s), a;
  };
}
function NC(t, n) {
  const i = vt();
  $t(function() {
    if (n.pathOptions !== i.current) {
      const a = n.pathOptions ?? {};
      t.instance.setStyle(a), i.current = a;
    }
  }, [
    t,
    n
  ]);
}
function RC(t) {
  return function(i) {
    const s = Jo(), a = t(Yo(i, s), s);
    return Xu(a.current, i.eventHandlers), tg(a.current, s), NC(a.current, i), a;
  };
}
function AC(t, n) {
  const i = Xo(t, n), s = eg(i);
  return Qp(s);
}
function FC(t, n) {
  const i = Xo(t), s = CC(i, n);
  return kC(s);
}
function ng(t, n) {
  const i = Xo(t, n), s = RC(i);
  return Qp(s);
}
function zC(t, n) {
  const i = Xo(t, n), s = eg(i);
  return LC(s);
}
function $C(t, n, i) {
  const { opacity: s, zIndex: a } = n;
  s != null && s !== i.opacity && t.setOpacity(s), a != null && a !== i.zIndex && t.setZIndex(a);
}
function Qu() {
  return Jo().map;
}
function BC(t) {
  const n = Qu();
  return $t(function() {
    return n.on(t), function() {
      n.off(t);
    };
  }, [
    n,
    t
  ]), n;
}
const DC = ng(function({ center: n, children: i, ...s }, a) {
  const u = new Un.CircleMarker(n, s);
  return es(u, Yu(a, {
    overlayContainer: u
  }));
}, xC);
function Bc() {
  return Bc = Object.assign || function(t) {
    for (var n = 1; n < arguments.length; n++) {
      var i = arguments[n];
      for (var s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s]);
    }
    return t;
  }, Bc.apply(this, arguments);
}
function ZC({ bounds: t, boundsOptions: n, center: i, children: s, className: a, id: u, placeholder: h, style: d, whenReady: m, zoom: g, ...w }, y) {
  const [x] = kt({
    className: a,
    id: u,
    style: d
  }), [E, C] = kt(null);
  yo(y, () => (E == null ? void 0 : E.map) ?? null, [
    E
  ]);
  const I = si((lt) => {
    if (lt !== null && E === null) {
      const nt = new Un.Map(lt, w);
      i != null && g != null ? nt.setView(i, g) : t != null && nt.fitBounds(t, n), m != null && nt.whenReady(m), C(MC(nt));
    }
  }, []);
  $t(() => () => {
    E == null || E.map.remove();
  }, [
    E
  ]);
  const D = E ? /* @__PURE__ */ Wa.createElement(Xp, {
    value: E
  }, s) : h ?? null;
  return /* @__PURE__ */ Wa.createElement("div", Bc({}, x, {
    ref: I
  }), D);
}
const HC = /* @__PURE__ */ vo(ZC), Or = AC(function({ position: n, ...i }, s) {
  const a = new Un.Marker(n, i);
  return es(a, Yu(s, {
    overlayContainer: a
  }));
}, function(n, i, s) {
  i.position !== s.position && n.setLatLng(i.position), i.icon != null && i.icon !== s.icon && n.setIcon(i.icon), i.zIndexOffset != null && i.zIndexOffset !== s.zIndexOffset && n.setZIndexOffset(i.zIndexOffset), i.opacity != null && i.opacity !== s.opacity && n.setOpacity(i.opacity), n.dragging != null && i.draggable !== s.draggable && (i.draggable === !0 ? n.dragging.enable() : n.dragging.disable());
}), jC = ng(function({ positions: n, ...i }, s) {
  const a = new Un.Polyline(n, i);
  return es(a, Yu(s, {
    overlayContainer: a
  }));
}, function(n, i, s) {
  i.positions !== s.positions && n.setLatLngs(i.positions);
}), Nr = FC(function(n, i) {
  const s = new Un.Popup(n, i.overlayContainer);
  return es(s, i);
}, function(n, i, { position: s }, a) {
  $t(function() {
    const { instance: h } = n;
    function d(g) {
      g.popup === h && (h.update(), a(!0));
    }
    function m(g) {
      g.popup === h && a(!1);
    }
    return i.map.on({
      popupopen: d,
      popupclose: m
    }), i.overlayContainer == null ? (s != null && h.setLatLng(s), h.openOn(i.map)) : i.overlayContainer.bindPopup(h), function() {
      var w;
      i.map.off({
        popupopen: d,
        popupclose: m
      }), (w = i.overlayContainer) == null || w.unbindPopup(), i.map.removeLayer(h);
    };
  }, [
    n,
    i,
    a,
    s
  ]);
}), UC = zC(function({ url: n, ...i }, s) {
  const a = new Un.TileLayer(n, Yo(i, s));
  return es(a, s);
}, function(n, i, s) {
  $C(n, i, s);
  const { url: a } = i;
  a != null && a !== s.url && n.setUrl(a);
});
function WC({ bounds: t }) {
  const n = Qu(), i = vt(!1);
  return $t(() => {
    t && !i.current && (n.fitBounds(t, { padding: [50, 50] }), i.current = !0);
  }, [n, t]), null;
}
function VC({
  position: t,
  isFollowing: n
}) {
  const i = Qu(), s = vt(!1);
  return $t(() => {
    if (!n || !t) {
      s.current = !1;
      return;
    }
    s.current ? i.panTo([t.lat, t.lng], { animate: !0, duration: 0.1 }) : (i.setView([t.lat, t.lng], 16, { animate: !0, duration: 0.5 }), s.current = !0);
  }, [i, t, n]), null;
}
const qC = [51.5074, -0.1278], KC = 13;
function GC({
  bounds: t,
  center: n,
  zoom: i,
  followPosition: s,
  isFollowing: a,
  children: u
}) {
  return /* @__PURE__ */ O(
    HC,
    {
      center: n || qC,
      zoom: i || KC,
      style: { width: "100%", height: "100%" },
      scrollWheelZoom: !0,
      children: [
        /* @__PURE__ */ M(
          UC,
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        ),
        /* @__PURE__ */ M(WC, { bounds: t }),
        /* @__PURE__ */ M(VC, { position: s, isFollowing: a }),
        u
      ]
    }
  );
}
function JC(t) {
  return t.map(([n, i]) => [i, n]);
}
const YC = ts.divIcon({
  className: "custom-marker",
  html: `<div style="
    background: #22c55e;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
  ">A</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
}), XC = ts.divIcon({
  className: "custom-marker",
  html: `<div style="
    background: #ef4444;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
  ">B</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});
function QC({ coordinates: t, startLocation: n, endLocation: i }) {
  if (t.length === 0) return null;
  const s = JC(t);
  return /* @__PURE__ */ O(In, { children: [
    /* @__PURE__ */ M(
      jC,
      {
        positions: s,
        pathOptions: {
          color: "#32de84",
          // Lime green
          weight: 5,
          opacity: 0.8
        }
      }
    ),
    n && /* @__PURE__ */ M(Or, { position: [n.lat, n.lng], icon: YC, children: /* @__PURE__ */ O(Nr, { children: [
      /* @__PURE__ */ M("strong", { children: "Start:" }),
      " ",
      n.label || "Starting point"
    ] }) }),
    i && /* @__PURE__ */ M(Or, { position: [i.lat, i.lng], icon: XC, children: /* @__PURE__ */ O(Nr, { children: [
      /* @__PURE__ */ M("strong", { children: "End:" }),
      " ",
      i.label || "Destination"
    ] }) })
  ] });
}
const tI = (t) => {
  const n = t ? "#ef4444" : "#32de84", i = t ? "rgba(239, 68, 68, 0.6)" : "rgba(50, 222, 132, 0.6)", s = t ? "animation: bike-pulse 1s ease-in-out infinite;" : "";
  return ts.divIcon({
    className: "",
    html: `
      <style>
        @keyframes bike-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 12px ${i}; }
          50% { transform: scale(1.1); box-shadow: 0 2px 12px rgba(0,0,0,0.4), 0 0 20px ${i}; }
        }
      </style>
      <div style="
        width: 36px;
        height: 36px;
        background: white;
        border-radius: 50%;
        border: 3px solid ${n};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 12px ${i};
        ${s}
      ">🚴</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};
function eI({ position: t, isWaiting: n = !1 }) {
  if (!t) return null;
  const i = tI(n);
  return /* @__PURE__ */ M(
    Or,
    {
      position: [t.lat, t.lng],
      icon: i,
      zIndexOffset: 1e3
    }
  );
}
const ar = {
  red: "#ef4444",
  yellow: "#f59e0b",
  green: "#22c55e",
  passed: "#6b7280"
};
function nI({
  trafficLights: t,
  currentIndex: n,
  isWaitingAtLight: i,
  elapsedTime: s
}) {
  return /* @__PURE__ */ M(In, { children: t.map((a, u) => {
    const h = u < n - (i ? 0 : 1), d = i && u === n - 1, m = u >= n;
    let g, w;
    if (h)
      g = ar.passed, w = "Passed";
    else if (d)
      g = ar.red, w = "Waiting...";
    else if (m) {
      const y = yd(a.timing, s);
      g = ar[y.phase], w = `${y.phase.charAt(0).toUpperCase() + y.phase.slice(1)}`;
    } else
      g = ar.passed, w = "Passed";
    return /* @__PURE__ */ M(
      DC,
      {
        center: [a.lat, a.lng],
        radius: 7,
        pathOptions: {
          color: h ? ar.passed : "#1f2937",
          fillColor: g,
          fillOpacity: h ? 0.4 : 0.9,
          weight: 2
        },
        children: /* @__PURE__ */ M(Nr, { children: /* @__PURE__ */ O("div", { children: [
          /* @__PURE__ */ O("strong", { children: [
            "Traffic Light #",
            u + 1
          ] }),
          /* @__PURE__ */ M("br", {}),
          /* @__PURE__ */ M("span", { style: { color: g }, children: w }),
          /* @__PURE__ */ M("br", {}),
          /* @__PURE__ */ O("small", { children: [
            Math.round(a.distanceFromStart),
            "m from start"
          ] })
        ] }) })
      },
      a.id
    );
  }) });
}
function cr(t) {
  return `£${t.toFixed(2)}`;
}
function ja(t) {
  const n = Math.floor(t / 60), i = Math.floor(t % 60);
  return `${n}:${i.toString().padStart(2, "0")}`;
}
function iI({ costs: t, state: n, perMinuteRate: i }) {
  const { status: s, elapsedTime: a, totalWaitTime: u, currentWaitTime: h, isWaitingAtLight: d, lightsEncountered: m } = n, g = u + (d ? h : 0), w = s === "finished", y = h / 60 * i;
  return /* @__PURE__ */ O("div", { className: P.costDisplay, children: [
    /* @__PURE__ */ O("div", { className: P.costMain, children: [
      /* @__PURE__ */ M("div", { className: P.costLabel, children: "Current Cost" }),
      /* @__PURE__ */ M("div", { className: P.costValue, children: cr(t.totalCost) })
    ] }),
    /* @__PURE__ */ O("div", { className: P.costComparison, children: [
      /* @__PURE__ */ O("div", { className: P.costRow, children: [
        /* @__PURE__ */ M("span", { className: P.costRowLabel, children: "Uninterrupted ride:" }),
        /* @__PURE__ */ M("span", { className: P.costRowValue, children: cr(t.idealCost) })
      ] }),
      /* @__PURE__ */ O("div", { className: `${P.costRow} ${P.stopRevenue}`, children: [
        /* @__PURE__ */ M("span", { className: P.costRowLabel, children: "Stop-time revenue:" }),
        /* @__PURE__ */ O("span", { className: P.costRowValue, children: [
          cr(t.stopRevenue),
          t.totalCost > 0 && /* @__PURE__ */ O("span", { className: P.costPercentage, children: [
            " ",
            "(",
            Math.round(t.stopRevenue / t.totalCost * 100),
            "%)"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ O("div", { className: P.timeStats, children: [
      /* @__PURE__ */ O("div", { className: P.statItem, children: [
        /* @__PURE__ */ M("span", { className: P.statLabel, children: "Ride time" }),
        /* @__PURE__ */ M("span", { className: P.statValue, children: ja(a) })
      ] }),
      /* @__PURE__ */ O("div", { className: P.statItem, children: [
        /* @__PURE__ */ M("span", { className: P.statLabel, children: "Time stopped" }),
        /* @__PURE__ */ M("span", { className: `${P.statValue} ${P.statWaiting}`, children: ja(g) })
      ] }),
      /* @__PURE__ */ O("div", { className: P.statItem, children: [
        /* @__PURE__ */ M("span", { className: P.statLabel, children: "Traffic lights" }),
        /* @__PURE__ */ M("span", { className: P.statValue, children: m })
      ] })
    ] }),
    d && /* @__PURE__ */ O("div", { className: P.waitingIndicator, children: [
      /* @__PURE__ */ M("div", { className: P.waitingDot }),
      /* @__PURE__ */ M("span", { children: "Stopped at light" }),
      /* @__PURE__ */ O("span", { className: P.liveRevenue, children: [
        "+",
        cr(y)
      ] })
    ] }),
    w && /* @__PURE__ */ O("div", { className: P.finishedSummary, children: [
      /* @__PURE__ */ M("div", { className: P.summaryTitle, children: "Ride Complete" }),
      /* @__PURE__ */ O("div", { className: P.summaryText, children: [
        "Stopped at ",
        /* @__PURE__ */ M("strong", { children: m }),
        " traffic light",
        m !== 1 ? "s" : "",
        " for ",
        /* @__PURE__ */ M("strong", { children: ja(g) }),
        ". Stop-time revenue: ",
        /* @__PURE__ */ M("strong", { children: cr(t.stopRevenue) }),
        "."
      ] })
    ] })
  ] });
}
function Ua(t) {
  return t >= 1e3 ? `${(t / 1e3).toFixed(2)} km` : `${Math.round(t)} m`;
}
function rI(t) {
  return `${(t * 2.237).toFixed(1)} mph`;
}
function sI({ state: t, totalDistance: n, totalTrafficLights: i }) {
  const { distanceTraveled: s, currentSpeed: a, routeProgress: u, currentTrafficLightIndex: h } = t, d = n - s, m = i - h, g = Math.round(u * 100);
  return /* @__PURE__ */ O("div", { className: P.routeStats, children: [
    /* @__PURE__ */ O("div", { className: P.progressContainer, children: [
      /* @__PURE__ */ M("div", { className: P.progressBar, children: /* @__PURE__ */ M(
        "div",
        {
          className: P.progressFill,
          style: { width: `${g}%` }
        }
      ) }),
      /* @__PURE__ */ O("span", { className: P.progressText, children: [
        g,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ O("div", { className: P.statsGrid, children: [
      /* @__PURE__ */ O("div", { className: P.statBox, children: [
        /* @__PURE__ */ M("span", { className: P.statBoxLabel, children: "Distance" }),
        /* @__PURE__ */ M("span", { className: P.statBoxValue, children: Ua(s) }),
        /* @__PURE__ */ O("span", { className: P.statBoxSub, children: [
          "of ",
          Ua(n)
        ] })
      ] }),
      /* @__PURE__ */ O("div", { className: P.statBox, children: [
        /* @__PURE__ */ M("span", { className: P.statBoxLabel, children: "Speed" }),
        /* @__PURE__ */ M("span", { className: P.statBoxValue, children: rI(a) }),
        /* @__PURE__ */ O("span", { className: P.statBoxSub, children: [
          "max ",
          be.MAX_SPEED_MPH,
          " mph"
        ] })
      ] }),
      /* @__PURE__ */ O("div", { className: P.statBox, children: [
        /* @__PURE__ */ M("span", { className: P.statBoxLabel, children: "Remaining" }),
        /* @__PURE__ */ M("span", { className: P.statBoxValue, children: Ua(d) }),
        /* @__PURE__ */ O("span", { className: P.statBoxSub, children: [
          m,
          " lights ahead"
        ] })
      ] })
    ] })
  ] });
}
function ur(t) {
  return `£${t.toFixed(2)}`;
}
function oI({ costs: t, totalDistance: n }) {
  const i = n / 1e3;
  return /* @__PURE__ */ O("div", { className: P.alternativePricing, children: [
    /* @__PURE__ */ M("div", { className: P.altPricingTitle, children: "Pricing Model Comparison" }),
    /* @__PURE__ */ O("div", { className: P.altPricingTable, children: [
      /* @__PURE__ */ O("div", { className: P.altPricingRow, children: [
        /* @__PURE__ */ M("span", { className: P.altPricingLabel, children: "Per-minute (current)" }),
        /* @__PURE__ */ M("span", { className: P.altPricingValue, children: ur(t.totalCost) })
      ] }),
      /* @__PURE__ */ O("div", { className: P.altPricingRow, children: [
        /* @__PURE__ */ O("span", { className: P.altPricingLabel, children: [
          "Per-distance (",
          ur(Va.PER_KM),
          "/km)"
        ] }),
        /* @__PURE__ */ M("span", { className: P.altPricingValue, children: ur(t.distanceBasedCost) })
      ] }),
      /* @__PURE__ */ O("div", { className: P.altPricingRow, children: [
        /* @__PURE__ */ M("span", { className: P.altPricingLabel, children: "Motion-only" }),
        /* @__PURE__ */ M("span", { className: P.altPricingValue, children: ur(t.motionOnlyCost) })
      ] })
    ] }),
    /* @__PURE__ */ M("div", { className: P.altPricingDivider }),
    /* @__PURE__ */ O("div", { className: `${P.altPricingRow} ${P.altPricingHighlight}`, children: [
      /* @__PURE__ */ M("span", { className: P.altPricingLabel, children: "Stop-time revenue" }),
      /* @__PURE__ */ M("span", { className: P.altPricingValue, children: ur(t.stopRevenue) })
    ] }),
    /* @__PURE__ */ O("div", { className: P.altPricingNote, children: [
      "Distance: ",
      i.toFixed(2),
      " km"
    ] })
  ] });
}
function aI(t) {
  return `£${t.toFixed(2)}`;
}
function cI(t) {
  const n = Math.floor(t / 60), i = Math.floor(t % 60);
  return n === 0 ? `${i}s` : `${n}m ${i}s`;
}
function uI(t) {
  return `${(t / 1e3).toFixed(1)}km`;
}
function lI({ totalDistance: t, stopCount: n, stopTime: i, stopRevenue: s }) {
  const [a, u] = kt(!1), h = `My ${uI(t)} Lime ride:
Stopped at ${n} traffic light${n !== 1 ? "s" : ""} for ${cI(i)}.
Stop-time revenue: ${aI(s)}.

Lime charges by the minute. See your own ride costs:`, d = typeof window < "u" ? window.location.href : "", m = () => {
    const y = `https://twitter.com/intent/tweet?text=${encodeURIComponent(h)}&url=${encodeURIComponent(d)}`;
    window.open(y, "_blank", "width=550,height=420");
  }, g = () => {
    const y = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(d)}`;
    window.open(y, "_blank", "width=550,height=420");
  }, w = async () => {
    const y = `${h}
${d}`;
    try {
      await navigator.clipboard.writeText(y), u(!0), setTimeout(() => u(!1), 2e3);
    } catch {
      const x = document.createElement("textarea");
      x.value = y, document.body.appendChild(x), x.select(), document.execCommand("copy"), document.body.removeChild(x), u(!0), setTimeout(() => u(!1), 2e3);
    }
  };
  return /* @__PURE__ */ O("div", { className: P.shareButtons, "data-component": "share-buttons", children: [
    /* @__PURE__ */ M("div", { className: P.shareTitle, children: "Share your ride" }),
    /* @__PURE__ */ O("div", { className: P.shareButtonGroup, children: [
      /* @__PURE__ */ O(
        "button",
        {
          className: `${P.shareButton} ${P.shareTwitter}`,
          onClick: m,
          title: "Share on X (Twitter)",
          "data-action": "share",
          "data-platform": "twitter",
          children: [
            /* @__PURE__ */ M("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) }),
            /* @__PURE__ */ M("span", { children: "Tweet" })
          ]
        }
      ),
      /* @__PURE__ */ O(
        "button",
        {
          className: `${P.shareButton} ${P.shareLinkedIn}`,
          onClick: g,
          title: "Share on LinkedIn",
          "data-action": "share",
          "data-platform": "linkedin",
          children: [
            /* @__PURE__ */ M("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }) }),
            /* @__PURE__ */ M("span", { children: "LinkedIn" })
          ]
        }
      ),
      /* @__PURE__ */ O(
        "button",
        {
          className: `${P.shareButton} ${P.shareCopy}`,
          onClick: w,
          title: "Copy to clipboard",
          "data-action": "share",
          "data-platform": "copy",
          children: [
            /* @__PURE__ */ O("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
              /* @__PURE__ */ M("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
              /* @__PURE__ */ M("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
            ] }),
            /* @__PURE__ */ M("span", { children: a ? "Copied!" : "Copy" })
          ]
        }
      )
    ] })
  ] });
}
function Is({
  title: t,
  children: n,
  defaultCollapsed: i = !1,
  mobileOnly: s = !0,
  highlight: a,
  sectionId: u,
  openSectionId: h,
  onOpen: d
}) {
  const [m, g] = kt(i), [w, y] = kt(!1);
  $t(() => {
    const D = () => {
      y(window.innerWidth <= 480);
    };
    return D(), window.addEventListener("resize", D), () => window.removeEventListener("resize", D);
  }, []), $t(() => {
    s && g(w && i);
  }, [w, s, i]);
  const x = w && u && h !== void 0, E = x ? h !== u : m, C = () => {
    x && d ? d(E ? u : "") : g(!m);
  };
  return (s ? w : !0) ? /* @__PURE__ */ O(
    "div",
    {
      className: `${P.collapsibleSection} ${E ? P.collapsed : ""}`,
      "data-component": "collapsible-section",
      "data-section": t.toLowerCase().replace(/\s+/g, "-"),
      children: [
        /* @__PURE__ */ O(
          "button",
          {
            className: P.collapsibleHeader,
            onClick: C,
            "aria-expanded": !E,
            "data-action": "toggle-section",
            "data-section": t.toLowerCase().replace(/\s+/g, "-"),
            "data-collapsed": E,
            children: [
              /* @__PURE__ */ M("span", { className: P.collapsibleTitle, children: t }),
              E && a && /* @__PURE__ */ M("span", { className: P.collapsibleHighlight, children: a }),
              /* @__PURE__ */ M(
                "svg",
                {
                  className: P.collapsibleChevron,
                  width: "12",
                  height: "12",
                  viewBox: "0 0 12 12",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ M(
                    "path",
                    {
                      d: "M3 4.5L6 7.5L9 4.5",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ M("div", { className: P.collapsibleContent, children: n })
      ]
    }
  ) : /* @__PURE__ */ M(In, { children: n });
}
function hI({
  status: t,
  onPlay: n,
  onPause: i,
  onReset: s,
  isReady: a,
  simulationSpeed: u,
  onSpeedChange: h,
  hideProgress: d = !1
}) {
  const m = t === "playing", g = t === "finished", w = t === "paused";
  return /* @__PURE__ */ O("div", { className: P.controls, "data-component": "simulation-controls", children: [
    /* @__PURE__ */ O("div", { className: P.controlButtons, children: [
      !g && /* @__PURE__ */ M(
        "button",
        {
          className: `${P.controlButton} ${P.primaryButton}`,
          onClick: m ? i : n,
          disabled: !a,
          "data-action": m ? "pause" : "play",
          "data-status": t,
          children: m ? /* @__PURE__ */ O(In, { children: [
            /* @__PURE__ */ M(dI, {}),
            " Pause"
          ] }) : /* @__PURE__ */ O(In, { children: [
            /* @__PURE__ */ M(fI, {}),
            " ",
            w ? "Resume" : "Start Ride"
          ] })
        }
      ),
      (w || g) && /* @__PURE__ */ O(
        "button",
        {
          className: `${P.controlButton} ${P.secondaryButton}`,
          onClick: s,
          "data-action": "reset",
          children: [
            /* @__PURE__ */ M(mI, {}),
            " Reset"
          ]
        }
      )
    ] }),
    h && /* @__PURE__ */ O("div", { className: P.speedControl, "data-component": "speed-control", children: [
      /* @__PURE__ */ O("label", { className: P.speedLabel, children: [
        "Speed: ",
        u,
        "x"
      ] }),
      /* @__PURE__ */ M(
        "input",
        {
          type: "range",
          min: "1",
          max: "50",
          value: u,
          onChange: (y) => h(Number(y.target.value)),
          className: P.speedSlider,
          "data-action": "speed-change",
          "data-speed": u
        }
      )
    ] }),
    !d && /* @__PURE__ */ O("div", { className: P.statusIndicator, children: [
      /* @__PURE__ */ M("span", { className: `${P.statusDot} ${P[`status${t.charAt(0).toUpperCase() + t.slice(1)}`]}` }),
      /* @__PURE__ */ O("span", { className: P.statusText, children: [
        t === "idle" && "Ready to start",
        t === "loading" && "Loading...",
        t === "ready" && "Ready",
        t === "playing" && "Riding...",
        t === "paused" && "Paused",
        t === "finished" && "Ride complete"
      ] })
    ] })
  ] });
}
function fI() {
  return /* @__PURE__ */ M("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M8 5v14l11-7z" }) });
}
function dI() {
  return /* @__PURE__ */ M("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M6 4h4v16H6V4zm8 0h4v16h-4V4z" }) });
}
function mI() {
  return /* @__PURE__ */ M("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" }) });
}
function _I({ mode: t, onStartChange: n, onEndChange: i }) {
  return BC({
    click: (s) => {
      if (!t) return;
      const a = {
        lat: s.latlng.lat,
        lng: s.latlng.lng
      };
      t === "start" ? n(a) : i(a);
    }
  }), null;
}
const pI = ts.divIcon({
  className: "picker-marker",
  html: `<div style="
    background: #22c55e;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    opacity: 0.8;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
}), gI = ts.divIcon({
  className: "picker-marker",
  html: `<div style="
    background: #ef4444;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    opacity: 0.8;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});
function vI({
  startLocation: t,
  endLocation: n,
  onStartChange: i,
  onEndChange: s,
  isEnabled: a,
  pickerMode: u,
  onModeChange: h
}) {
  return a ? /* @__PURE__ */ O(In, { children: [
    /* @__PURE__ */ M(
      _I,
      {
        mode: u,
        onStartChange: (d) => {
          i(d), h(n ? null : "end");
        },
        onEndChange: (d) => {
          s(d), h(null);
        }
      }
    ),
    t && /* @__PURE__ */ M(Or, { position: [t.lat, t.lng], icon: pI, children: /* @__PURE__ */ M(Nr, { children: "Start location" }) }),
    n && /* @__PURE__ */ M(Or, { position: [n.lat, n.lng], icon: gI, children: /* @__PURE__ */ M(Nr, { children: "End location" }) })
  ] }) : null;
}
function yI({
  startLocation: t,
  endLocation: n,
  pickerMode: i,
  onModeChange: s,
  onClear: a
}) {
  const u = t || n, h = t && n;
  return /* @__PURE__ */ O("div", { className: P.locationPicker, "data-component": "location-picker", children: [
    /* @__PURE__ */ M("div", { className: P.pickerTitle, children: "Set Route" }),
    /* @__PURE__ */ O("div", { className: P.pickerButtons, children: [
      /* @__PURE__ */ O(
        "button",
        {
          className: `${P.pickerButton} ${i === "start" ? P.pickerActive : ""} ${t ? P.pickerSet : ""}`,
          onClick: () => s(i === "start" ? null : "start"),
          "data-action": "set-location",
          "data-location": "start",
          "data-active": i === "start",
          "data-set": !!t,
          children: [
            /* @__PURE__ */ M("span", { className: P.pickerDot, style: { background: "#22c55e" } }),
            t ? "Start set" : "Set start"
          ]
        }
      ),
      /* @__PURE__ */ O(
        "button",
        {
          className: `${P.pickerButton} ${i === "end" ? P.pickerActive : ""} ${n ? P.pickerSet : ""}`,
          onClick: () => s(i === "end" ? null : "end"),
          "data-action": "set-location",
          "data-location": "end",
          "data-active": i === "end",
          "data-set": !!n,
          children: [
            /* @__PURE__ */ M("span", { className: P.pickerDot, style: { background: "#ef4444" } }),
            n ? "End set" : "Set end"
          ]
        }
      )
    ] }),
    i && /* @__PURE__ */ O("div", { className: P.pickerHint, children: [
      "Click on the map to set ",
      i,
      " location"
    ] }),
    u && !h && /* @__PURE__ */ O("div", { className: P.pickerHint, children: [
      !t && "Click to set start location",
      !n && t && "Now click to set end location"
    ] }),
    u && /* @__PURE__ */ M(
      "button",
      {
        className: P.clearButton,
        onClick: a,
        "data-action": "clear-locations",
        children: "Clear locations"
      }
    )
  ] });
}
const bI = 1, wI = 0.2, SI = 10;
function TI({
  startLocation: t,
  endLocation: n,
  precomputedRoute: i,
  unlockFee: s = bI,
  perMinuteRate: a = wI,
  simulationSpeed: u = SI,
  width: h = "100%",
  height: d = 600,
  showControls: m = !0,
  allowLocationPicker: g = !0
}) {
  const [w, y] = kt(null), [x, E] = kt(null), [C, I] = kt(
    t ? n ? null : "end" : "start"
  ), [D, lt] = kt(u), [nt, ht] = kt(null), [mt, Kt] = kt(!1), xt = vt(null), Qt = vt(null), _t = () => {
    var Mt;
    mt ? document.exitFullscreen && document.exitFullscreen() : (Mt = Qt.current) != null && Mt.requestFullscreen && Qt.current.requestFullscreen();
  };
  $t(() => {
    const Mt = () => {
      Kt(!!document.fullscreenElement);
    };
    return document.addEventListener("fullscreenchange", Mt), () => document.removeEventListener("fullscreenchange", Mt);
  }, []);
  const Et = t || w || void 0, it = n || x || void 0, W = g && (!t || !n) && !i, {
    route: G,
    coordinates: le,
    cumulativeDistances: St,
    isLoading: Te,
    error: at
  } = Iv(
    i ? void 0 : Et,
    i ? void 0 : it
  ), {
    trafficLights: H,
    isLoading: R,
    error: Ie
  } = bC(i ? [] : le), $ = (i == null ? void 0 : i.coordinates) ?? le, ot = (i == null ? void 0 : i.distance) ?? (G == null ? void 0 : G.distance) ?? 0, Gt = Os(() => {
    if (i) {
      const Mt = [0];
      let Oe = 0;
      for (let Pe = 1; Pe < i.coordinates.length; Pe++) {
        const [je, on] = i.coordinates[Pe - 1], [_n, rs] = i.coordinates[Pe], Qo = 6371e3, Wn = (rs - on) * Math.PI / 180, Zi = (_n - je) * Math.PI / 180, Hi = Math.sin(Wn / 2) * Math.sin(Wn / 2) + Math.cos(on * Math.PI / 180) * Math.cos(rs * Math.PI / 180) * Math.sin(Zi / 2) * Math.sin(Zi / 2), ta = 2 * Math.atan2(Math.sqrt(Hi), Math.sqrt(1 - Hi));
        Oe += Qo * ta, Mt.push(Oe);
      }
      return Mt;
    }
    return St;
  }, [i, St]), bt = vt(/* @__PURE__ */ new Map()), pt = Os(() => i ? i.trafficLights.map((Mt, Oe) => (bt.current.has(Mt.id) || bt.current.set(Mt.id, bd()), {
    ...Mt,
    routeIndex: Oe,
    timing: bt.current.get(Mt.id)
  })) : H, [i, H]), {
    state: A,
    position: K,
    play: Yt,
    pause: Xt,
    reset: Ze,
    isReady: Ut
  } = SC({
    coordinates: $,
    cumulativeDistances: Gt,
    trafficLights: pt,
    totalDistance: ot,
    simulationSpeed: D
  });
  $t(() => {
    A.status === "finished" && xt.current !== "finished" && ht("cost"), xt.current = A.status;
  }, [A.status]);
  const Wt = TC({
    state: A,
    totalDistance: ot,
    unlockFee: s,
    perMinuteRate: a
  }), He = Os(() => {
    if ($.length < 2) return;
    let Mt = 1 / 0, Oe = -1 / 0, Pe = 1 / 0, je = -1 / 0;
    for (const [on, _n] of $)
      Mt = Math.min(Mt, _n), Oe = Math.max(Oe, _n), Pe = Math.min(Pe, on), je = Math.max(je, on);
    return [
      [Mt, Pe],
      [Oe, je]
    ];
  }, [$]), sn = i ? !1 : Te || R, Bi = i ? null : at || Ie, ns = i ? !0 : !!G, is = {
    width: typeof h == "number" ? `${h}px` : h,
    height: typeof d == "number" ? `${d}px` : d
  }, Di = () => {
    y(null), E(null), I("start");
  };
  return /* @__PURE__ */ M(
    "div",
    {
      ref: Qt,
      className: `${P.container} ${mt ? P.fullscreen : ""}`,
      style: is,
      "data-component": "lime-simulator",
      children: /* @__PURE__ */ O("div", { className: P.mapSection, children: [
        /* @__PURE__ */ O(
          GC,
          {
            bounds: He,
            followPosition: K,
            isFollowing: A.status === "playing" || A.status === "paused",
            children: [
              W && /* @__PURE__ */ M(
                vI,
                {
                  startLocation: w,
                  endLocation: x,
                  onStartChange: y,
                  onEndChange: E,
                  isEnabled: W,
                  pickerMode: C,
                  onModeChange: I
                }
              ),
              /* @__PURE__ */ M(
                QC,
                {
                  coordinates: $,
                  startLocation: Et,
                  endLocation: it
                }
              ),
              /* @__PURE__ */ M(
                nI,
                {
                  trafficLights: pt,
                  currentIndex: A.currentTrafficLightIndex,
                  isWaitingAtLight: A.isWaitingAtLight,
                  elapsedTime: A.elapsedTime
                }
              ),
              /* @__PURE__ */ M(
                eI,
                {
                  position: K,
                  isWaiting: A.isWaitingAtLight
                }
              )
            ]
          }
        ),
        W && /* @__PURE__ */ M("div", { className: P.mapOverlay, children: /* @__PURE__ */ M(
          yI,
          {
            startLocation: w,
            endLocation: x,
            pickerMode: C,
            onModeChange: I,
            onClear: Di
          }
        ) }),
        /* @__PURE__ */ O("div", { className: P.mapOverlayBottomLeft, children: [
          (A.status === "playing" || A.status === "paused" || A.status === "finished") && /* @__PURE__ */ M(
            "button",
            {
              className: P.resetButtonFloat,
              onClick: Ze,
              title: "Reset ride",
              "aria-label": "Reset ride",
              "data-action": "reset",
              "data-location": "map-overlay",
              children: /* @__PURE__ */ M("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" }) })
            }
          ),
          /* @__PURE__ */ M(
            "button",
            {
              className: P.fullscreenButtonFloat,
              onClick: _t,
              title: mt ? "Exit fullscreen" : "Enter fullscreen",
              "aria-label": mt ? "Exit fullscreen" : "Enter fullscreen",
              "data-action": "toggle-fullscreen",
              "data-fullscreen": mt,
              children: mt ? /* @__PURE__ */ M("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" }) }) : /* @__PURE__ */ M("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" }) })
            }
          )
        ] }),
        /* @__PURE__ */ O("div", { className: P.infoPanel, "data-status": A.status, children: [
          sn && /* @__PURE__ */ O("div", { className: P.loading, children: [
            /* @__PURE__ */ M("div", { className: P.loadingSpinner }),
            /* @__PURE__ */ M("span", { children: Te ? "Finding route..." : "Detecting traffic lights..." })
          ] }),
          Bi && !sn && /* @__PURE__ */ O("div", { className: P.error, children: [
            /* @__PURE__ */ M("div", { className: P.errorTitle, children: "Error" }),
            /* @__PURE__ */ M("div", { className: P.errorMessage, children: Bi })
          ] }),
          !sn && !Bi && ns && /* @__PURE__ */ O(In, { children: [
            m && /* @__PURE__ */ M(
              hI,
              {
                status: A.status,
                onPlay: Yt,
                onPause: Xt,
                onReset: Ze,
                isReady: Ut,
                simulationSpeed: D,
                onSpeedChange: A.status !== "finished" ? lt : void 0,
                hideProgress: A.status === "finished"
              }
            ),
            /* @__PURE__ */ M(
              Is,
              {
                title: "Cost",
                defaultCollapsed: !0,
                highlight: `£${Wt.totalCost.toFixed(2)}`,
                sectionId: "cost",
                openSectionId: nt,
                onOpen: ht,
                children: /* @__PURE__ */ M(iI, { costs: Wt, state: A, perMinuteRate: a })
              }
            ),
            A.status !== "finished" && /* @__PURE__ */ M(
              Is,
              {
                title: "Progress",
                defaultCollapsed: !0,
                highlight: `${Math.round(A.routeProgress * 100)}%`,
                sectionId: "progress",
                openSectionId: nt,
                onOpen: ht,
                children: /* @__PURE__ */ M(
                  sI,
                  {
                    state: A,
                    totalDistance: ot,
                    totalTrafficLights: pt.length
                  }
                )
              }
            ),
            A.status === "finished" && /* @__PURE__ */ M(
              Is,
              {
                title: "Pricing Comparison",
                defaultCollapsed: !1,
                sectionId: "pricing",
                openSectionId: nt,
                onOpen: ht,
                children: /* @__PURE__ */ M(oI, { costs: Wt, totalDistance: ot })
              }
            ),
            A.status === "finished" && !i && /* @__PURE__ */ M(
              Is,
              {
                title: "Share",
                defaultCollapsed: !1,
                sectionId: "share",
                openSectionId: nt,
                onOpen: ht,
                children: /* @__PURE__ */ M(
                  lI,
                  {
                    totalDistance: ot,
                    stopCount: A.lightsEncountered,
                    stopTime: A.totalWaitTime,
                    stopRevenue: Wt.stopRevenue
                  }
                )
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
const CI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LimeBikeSimulator: TI
}, Symbol.toStringTag, { value: "Module" }));
export {
  be as B,
  TI as L,
  CI as a
};
