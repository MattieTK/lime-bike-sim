var gy = Object.defineProperty;
var Kl = (t) => {
  throw TypeError(t);
};
var yy = (t, n, i) => n in t ? gy(t, n, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[n] = i;
var m = (t, n, i) => yy(t, typeof n != "symbol" ? n + "" : n, i), Gl = (t, n, i) => n.has(t) || Kl("Cannot " + i);
var Jl = (t, n, i) => (Gl(t, n, "read from private field"), i ? i.call(t) : n.get(t)), Yl = (t, n, i) => n.has(t) ? Kl("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(t) : n.set(t, i), Xl = (t, n, i, s) => (Gl(t, n, "write to private field"), s ? s.call(t, i) : n.set(t, i), i);
import { jsxs as $, jsx as C, Fragment as ri } from "react/jsx-runtime";
import Oa, { useState as Gt, useCallback as Qn, useEffect as Jt, useRef as Pt, useMemo as ld, createContext as vy, useContext as by, forwardRef as ro, useImperativeHandle as so } from "react";
import { createPortal as wy } from "react-dom";
const Sy = "https://router.project-osrm.org/route/v1/bike";
async function Ty(t, n) {
  const i = `${Sy}/${t.lng},${t.lat};${n.lng},${n.lat}?overview=full&geometries=geojson&steps=true`, s = await fetch(i);
  if (!s.ok)
    throw new Error(`OSRM request failed: ${s.statusText}`);
  const a = await s.json();
  if (a.code !== "Ok" || !a.routes || a.routes.length === 0)
    throw new Error("No route found between the specified locations");
  return a.routes[0];
}
function sr(t, n, i, s) {
  const u = t * Math.PI / 180, h = i * Math.PI / 180, d = (i - t) * Math.PI / 180, _ = (s - n) * Math.PI / 180, g = Math.sin(d / 2) * Math.sin(d / 2) + Math.cos(u) * Math.cos(h) * Math.sin(_ / 2) * Math.sin(_ / 2);
  return 6371e3 * (2 * Math.atan2(Math.sqrt(g), Math.sqrt(1 - g)));
}
function xy(t) {
  const n = [0];
  for (let i = 1; i < t.length; i++) {
    const [s, a] = t[i - 1], [u, h] = t[i], d = sr(a, s, h, u);
    n.push(n[i - 1] + d);
  }
  return n;
}
function Py(t, n) {
  const [i, s] = Gt(null), [a, u] = Gt([]), [h, d] = Gt([]), [_, g] = Gt(!1), [S, b] = Gt(null), x = Qn(async () => {
    if (!t || !n) {
      s(null), u([]), d([]);
      return;
    }
    g(!0), b(null);
    try {
      const P = await Ty(t, n);
      s(P);
      const k = P.geometry.coordinates;
      u(k), d(xy(k));
    } catch (P) {
      b(P instanceof Error ? P.message : "Failed to fetch route"), s(null), u([]), d([]);
    } finally {
      g(!1);
    }
  }, [t, n]);
  return Jt(() => {
    x();
  }, [x]), {
    route: i,
    coordinates: a,
    cumulativeDistances: h,
    isLoading: _,
    error: S,
    refetch: x
  };
}
const Ey = (t) => typeof t == "function", y = function(t, n) {
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
}, gt = (t) => t, oo = (t) => () => t, Ql = /* @__PURE__ */ oo(!0), Ra = /* @__PURE__ */ oo(!1), hd = /* @__PURE__ */ oo(void 0), ky = hd;
function T(t, n, i, s, a, u, h, d, _) {
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
      return _(d(h(u(a(s(i(n(t))))))));
    default: {
      let g = arguments[0];
      for (let S = 1; S < arguments.length; S++)
        g = arguments[S](g);
      return g;
    }
  }
}
const Ec = (t) => (n, i) => n === i || t(n, i), My = /* @__PURE__ */ y(2, (t, n) => Ec((i, s) => t(n(i), n(s)))), Ly = (t) => Ec((n, i) => {
  if (n.length !== i.length)
    return !1;
  for (let s = 0; s < n.length; s++)
    if (!t(n[s], i[s]))
      return !1;
  return !0;
}), hs = "effect/GlobalValue";
let qi;
const ht = (t, n) => (qi || (globalThis[hs] ?? (globalThis[hs] = /* @__PURE__ */ new Map()), qi = globalThis[hs]), qi.has(t) || qi.set(t, n()), qi.get(t)), Iy = (t) => typeof t == "string", Aa = (t) => typeof t == "number", Cy = (t) => typeof t == "bigint", ao = Ey, Oy = (t) => typeof t == "object" && t !== null, co = (t) => Oy(t) || ao(t), J = /* @__PURE__ */ y(2, (t, n) => co(t) && n in t), fd = /* @__PURE__ */ y(2, (t, n) => J(t, "_tag") && t._tag === n), Gn = (t) => t == null, dd = (t) => typeof t == "string" || J(t, Symbol.iterator), Ry = (t) => J(t, "then") && ao(t.then), uo = (t) => `BUG: ${t} - please report an issue at https://github.com/Effect-TS/effect/issues`;
let _d = class md {
  constructor(n) {
    m(this, "self");
    m(this, "called", !1);
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
    return new md(this.self);
  }
};
const Ay = 335903614, Ny = 4150755663, Fy = 1481765933, By = 1284865837, zy = 9007199254740992, $y = 134217728;
class Dy {
  constructor(n, i, s, a) {
    m(this, "_state");
    return Gn(i) && Gn(n) ? (i = Math.random() * 4294967295 >>> 0, n = 0) : Gn(i) && (i = n, n = 0), Gn(a) && Gn(s) ? (a = this._state ? this._state[3] : Ny, s = this._state ? this._state[2] : Ay) : Gn(a) && (a = s, s = 0), this._state = new Int32Array([0, 0, s >>> 0, ((a || 0) | 1) >>> 0]), this._next(), th(this._state, this._state[0], this._state[1], n >>> 0, i >>> 0), this._next(), this;
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
    return (n * $y + i) / zy;
  }
  /** @internal */
  _next() {
    const n = this._state[0] >>> 0, i = this._state[1] >>> 0;
    Zy(this._state, n, i, Fy, By), th(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let s = n >>> 18, a = (i >>> 18 | n << 14) >>> 0;
    s = (s ^ n) >>> 0, a = (a ^ i) >>> 0;
    const u = (a >>> 27 | s << 5) >>> 0, h = n >>> 27, d = (-h >>> 0 & 31) >>> 0;
    return (u >>> h | u << d) >>> 0;
  }
}
function Zy(t, n, i, s, a) {
  let u = (i >>> 16) * (a & 65535) >>> 0, h = (i & 65535) * (a >>> 16) >>> 0, d = (i & 65535) * (a & 65535) >>> 0, _ = (i >>> 16) * (a >>> 16) + ((h >>> 16) + (u >>> 16)) >>> 0;
  h = h << 16 >>> 0, d = d + h >>> 0, d >>> 0 < h >>> 0 && (_ = _ + 1 >>> 0), u = u << 16 >>> 0, d = d + u >>> 0, d >>> 0 < u >>> 0 && (_ = _ + 1 >>> 0), _ = _ + Math.imul(i, s) >>> 0, _ = _ + Math.imul(n, a) >>> 0, t[0] = _, t[1] = d;
}
function th(t, n, i, s, a) {
  let u = n + s >>> 0;
  const h = i + a >>> 0;
  h >>> 0 < i >>> 0 && (u = u + 1 | 0), t[0] = u, t[1] = h;
}
const Na = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var Sr;
class Tr {
  constructor(n) {
    /**
     * @since 3.0.6
     */
    Yl(this, Sr);
    Xl(this, Sr, n);
  }
  /**
   * @since 3.0.6
   */
  [Na]() {
    return Jl(this, Sr);
  }
}
Sr = new WeakMap();
function jy(t) {
  if (typeof t == "object" && t !== null && Na in t)
    return t[Na]();
  throw new Error(uo("yieldWrapGet"));
}
const ge = /* @__PURE__ */ ht("effect/Utils/isStructuralRegion", () => ({
  enabled: !1,
  tester: void 0
})), pd = {
  effect_internal_function: (t) => t()
}, Wy = {
  effect_internal_function: (t) => {
    try {
      return t();
    } finally {
    }
  }
};
var mf;
const Hy = ((mf = pd.effect_internal_function(() => new Error().stack)) == null ? void 0 : /* @__PURE__ */ mf.includes("effect_internal_function")) === !0, Xt = Hy ? pd.effect_internal_function : Wy.effect_internal_function, pa = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap()), Q = /* @__PURE__ */ Symbol.for("effect/Hash"), z = (t) => {
  if (ge.enabled === !0)
    return 0;
  switch (typeof t) {
    case "number":
      return Mc(t);
    case "bigint":
      return Ct(t.toString(10));
    case "boolean":
      return Ct(String(t));
    case "symbol":
      return Ct(String(t));
    case "string":
      return Ct(t);
    case "undefined":
      return Ct("undefined");
    case "function":
    case "object":
      return t === null ? Ct("null") : t instanceof Date ? Number.isNaN(t.getTime()) ? Ct("Invalid Date") : z(t.toISOString()) : t instanceof URL ? z(t.href) : Uy(t) ? t[Q]() : kc(t);
    default:
      throw new Error(`BUG: unhandled typeof ${typeof t} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, kc = (t) => (pa.has(t) || pa.set(t, Mc(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))), pa.get(t)), at = (t) => (n) => n * 53 ^ t, lo = (t) => t & 3221225471 | t >>> 1 & 1073741824, Uy = (t) => J(t, Q), Mc = (t) => {
  if (t !== t || t === 1 / 0)
    return 0;
  let n = t | 0;
  for (n !== t && (n ^= t * 4294967295); t > 4294967295; )
    n ^= t /= 4294967295;
  return lo(n);
}, Ct = (t) => {
  let n = 5381, i = t.length;
  for (; i; )
    n = n * 33 ^ t.charCodeAt(--i);
  return lo(n);
}, Vy = (t, n) => {
  let i = 12289;
  for (let s = 0; s < n.length; s++)
    i ^= T(Ct(n[s]), at(z(t[n[s]])));
  return lo(i);
}, gd = (t) => Vy(t, Object.keys(t)), xr = (t) => {
  let n = 6151;
  for (let i = 0; i < t.length; i++)
    n = T(n, at(z(t[i])));
  return lo(n);
}, Et = function() {
  if (arguments.length === 1) {
    const i = arguments[0];
    return function(s) {
      return Object.defineProperty(i, Q, {
        value() {
          return s;
        },
        enumerable: !1
      }), s;
    };
  }
  const t = arguments[0], n = arguments[1];
  return Object.defineProperty(t, Q, {
    value() {
      return n;
    },
    enumerable: !1
  }), n;
}, K = /* @__PURE__ */ Symbol.for("effect/Equal");
function G() {
  return arguments.length === 1 ? (t) => Is(t, arguments[0]) : Is(arguments[0], arguments[1]);
}
function Is(t, n) {
  if (t === n)
    return !0;
  const i = typeof t;
  if (i !== typeof n)
    return !1;
  if (i === "object" || i === "function") {
    if (t !== null && n !== null) {
      if (Cs(t) && Cs(n))
        return z(t) === z(n) && t[K](n) ? !0 : ge.enabled && ge.tester ? ge.tester(t, n) : !1;
      if (t instanceof Date && n instanceof Date) {
        const s = t.getTime(), a = n.getTime();
        return s === a || Number.isNaN(s) && Number.isNaN(a);
      } else if (t instanceof URL && n instanceof URL)
        return t.href === n.href;
    }
    if (ge.enabled) {
      if (Array.isArray(t) && Array.isArray(n))
        return t.length === n.length && t.every((s, a) => Is(s, n[a]));
      if (Object.getPrototypeOf(t) === Object.prototype && Object.getPrototypeOf(t) === Object.prototype) {
        const s = Object.keys(t), a = Object.keys(n);
        if (s.length === a.length) {
          for (const u of s)
            if (!(u in n && Is(t[u], n[u])))
              return ge.tester ? ge.tester(t, n) : !1;
          return !0;
        }
      }
      return ge.tester ? ge.tester(t, n) : !1;
    }
  }
  return ge.enabled && ge.tester ? ge.tester(t, n) : !1;
}
const Cs = (t) => J(t, K), Lc = () => G, kt = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), jt = (t) => {
  try {
    if (J(t, "toJSON") && ao(t.toJSON) && t.toJSON.length === 0)
      return t.toJSON();
    if (Array.isArray(t))
      return t.map(jt);
  } catch {
    return {};
  }
  return Ky(t);
}, Vt = (t) => JSON.stringify(t, null, 2), si = (t, n = 2) => {
  if (typeof t == "string")
    return t;
  try {
    return typeof t == "object" ? yd(t, n) : String(t);
  } catch {
    return String(t);
  }
}, yd = (t, n) => {
  let i = [];
  const s = JSON.stringify(t, (a, u) => typeof u == "object" && u !== null ? i.includes(u) ? void 0 : i.push(u) && (wn.fiberRefs !== void 0 && vd(u) ? u[Ic](wn.fiberRefs) : u) : u, n);
  return i = void 0, s;
}, Ic = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable"), vd = (t) => typeof t == "object" && t !== null && Ic in t, wn = /* @__PURE__ */ ht("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
})), qy = (t, n) => {
  const i = wn.fiberRefs;
  wn.fiberRefs = t;
  try {
    return n();
  } finally {
    wn.fiberRefs = i;
  }
}, Ky = (t) => vd(t) && wn.fiberRefs !== void 0 ? t[Ic](wn.fiberRefs) : t, U = (t, n) => {
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
}, Qi = "Async", ho = "Commit", le = "Failure", bs = "OnFailure", Os = "OnSuccess", Rs = "OnSuccessAndFailure", he = "Success", bd = "Sync", Gy = "Tag", Pr = "UpdateRuntimeFlags", As = "While", tr = "Iterator", wd = "WithRuntime", ws = "Yield", Cc = "RevertFlags";
let Jy = "3.19.13";
const Oc = () => Jy, Yy = /* @__PURE__ */ Symbol.for("effect/Effect"), Xy = /* @__PURE__ */ Symbol.for("effect/Stream"), Qy = /* @__PURE__ */ Symbol.for("effect/Sink"), tv = /* @__PURE__ */ Symbol.for("effect/Channel"), oi = {
  /* c8 ignore next */
  _R: (t) => t,
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t,
  _V: /* @__PURE__ */ Oc()
}, ev = {
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
}, nv = {
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
}, Er = {
  [Yy]: oi,
  [Xy]: oi,
  [Qy]: ev,
  [tv]: nv,
  [K](t) {
    return this === t;
  },
  [Q]() {
    return Et(this, kc(this));
  },
  [Symbol.iterator]() {
    return new _d(new Tr(this));
  },
  pipe() {
    return U(this, arguments);
  }
}, Rc = {
  [Q]() {
    return Et(this, gd(this));
  },
  [K](t) {
    const n = Object.keys(this), i = Object.keys(t);
    if (n.length !== i.length)
      return !1;
    for (const s of n)
      if (!(s in t && G(this[s], t[s])))
        return !1;
    return !0;
  }
}, kr = {
  ...Er,
  _op: ho
}, iv = {
  ...kr,
  ...Rc
}, rv = /* @__PURE__ */ function() {
  function t() {
  }
  return t.prototype = kr, t;
}(), Sd = /* @__PURE__ */ Symbol.for("effect/Option"), Td = {
  ...Er,
  [Sd]: {
    _A: (t) => t
  },
  [kt]() {
    return this.toJSON();
  },
  toString() {
    return Vt(this.toJSON());
  }
}, sv = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Td), {
  _tag: "Some",
  _op: "Some",
  [K](t) {
    return xd(t) && Ed(t) && G(this.value, t.value);
  },
  [Q]() {
    return Et(this, at(z(this._tag))(z(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: jt(this.value)
    };
  }
}), ov = /* @__PURE__ */ z("None"), av = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Td), {
  _tag: "None",
  _op: "None",
  [K](t) {
    return xd(t) && Pd(t);
  },
  [Q]() {
    return ov;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
}), xd = (t) => J(t, Sd), Pd = (t) => t._tag === "None", Ed = (t) => t._tag === "Some", kd = /* @__PURE__ */ Object.create(av), Fa = (t) => {
  const n = Object.create(sv);
  return n.value = t, n;
}, Md = /* @__PURE__ */ Symbol.for("effect/Either"), Ld = {
  ...Er,
  [Md]: {
    _R: (t) => t
  },
  [kt]() {
    return this.toJSON();
  },
  toString() {
    return Vt(this.toJSON());
  }
}, cv = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ld), {
  _tag: "Right",
  _op: "Right",
  [K](t) {
    return Id(t) && Od(t) && G(this.right, t.right);
  },
  [Q]() {
    return at(z(this._tag))(z(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: jt(this.right)
    };
  }
}), uv = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ld), {
  _tag: "Left",
  _op: "Left",
  [K](t) {
    return Id(t) && Cd(t) && G(this.left, t.left);
  },
  [Q]() {
    return at(z(this._tag))(z(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: jt(this.left)
    };
  }
}), Id = (t) => J(t, Md), Cd = (t) => t._tag === "Left", Od = (t) => t._tag === "Right", lv = (t) => {
  const n = Object.create(uv);
  return n.left = t, n;
}, hv = (t) => {
  const n = Object.create(cv);
  return n.right = t, n;
}, qe = hv, ai = lv, Xi = Cd, fs = Od, fv = /* @__PURE__ */ y(2, (t, {
  onLeft: n,
  onRight: i
}) => Xi(t) ? n(t.left) : i(t.right)), dv = /* @__PURE__ */ fv({
  onLeft: gt,
  onRight: gt
}), Rd = (t) => t.length > 0, Ad = (t) => (n, i) => n === i ? 0 : t(n, i), _v = /* @__PURE__ */ Ad((t, n) => t < n ? -1 : 1), mv = /* @__PURE__ */ y(2, (t, n) => Ad((i, s) => t(n(i), n(s)))), pv = (t) => y(2, (n, i) => t(n, i) === 1), W = () => kd, nt = Fa, Qt = Pd, Be = Ed, un = /* @__PURE__ */ y(2, (t, {
  onNone: n,
  onSome: i
}) => Qt(t) ? n() : i(t.value)), Xe = /* @__PURE__ */ y(2, (t, n) => Qt(t) ? n() : t.value), gv = /* @__PURE__ */ y(2, (t, n) => Qt(t) ? nt(n()) : t), Ac = (t) => t == null ? W() : nt(t), gn = /* @__PURE__ */ Xe(hd), yv = /* @__PURE__ */ y(2, (t, n) => Qt(t) ? W() : nt(n(t.value))), vv = /* @__PURE__ */ y(2, (t, n) => Qt(t) ? W() : n(t.value)), bv = (t) => y(2, (n, i) => Qt(n) ? !1 : t(n.value, i)), wv = /* @__PURE__ */ Lc(), Sv = /* @__PURE__ */ bv(wv), Tv = (...t) => t, Nc = (t) => new Array(t), xv = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.max(1, Math.floor(t)), s = new Array(i);
  for (let a = 0; a < i; a++)
    s[a] = n(a);
  return s;
}), zt = (t) => Array.isArray(t) ? t : Array.from(t), Pv = (t) => Array.isArray(t) ? t : [t], Ns = /* @__PURE__ */ y(2, (t, n) => [n, ...t]), Ev = /* @__PURE__ */ y(2, (t, n) => [...t, n]), Nd = /* @__PURE__ */ y(2, (t, n) => zt(t).concat(zt(n))), kv = (t) => t.length === 0, Mv = kv, Lv = Rd, fe = Rd, Fd = (t, n) => t < 0 || t >= n.length, Iv = (t, n) => Math.floor(Math.min(Math.max(0, t), n.length)), Cv = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.floor(n);
  return Fd(i, t) ? W() : nt(t[i]);
}), Bd = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.floor(n);
  if (Fd(i, t))
    throw new Error(`Index ${i} out of bounds`);
  return t[i];
}), er = /* @__PURE__ */ Cv(0), ie = /* @__PURE__ */ Bd(0), Ov = (t) => fe(t) ? nt(zd(t)) : W(), zd = (t) => t[t.length - 1], ci = (t) => t.slice(1), Rv = (t, n) => {
  let i = 0;
  for (const s of t) {
    if (!n(s, i))
      break;
    i++;
  }
  return i;
}, Av = /* @__PURE__ */ y(2, (t, n) => zv(t, Rv(t, n))), Nv = /* @__PURE__ */ y(2, (t, n) => {
  const i = zt(t);
  return i.slice(Iv(n, i), i.length);
}), eh = (t) => Array.from(t).reverse(), Fs = /* @__PURE__ */ y(2, (t, n) => {
  const i = Array.from(t);
  return i.sort(n), i;
}), nh = /* @__PURE__ */ y(2, (t, n) => Fv(t, n, Tv)), Fv = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = zt(t), a = zt(n);
  if (fe(s) && fe(a)) {
    const u = [i(ie(s), ie(a))], h = Math.min(s.length, a.length);
    for (let d = 1; d < h; d++)
      u[d] = i(s[d], a[d]);
    return u;
  }
  return [];
}), Bv = /* @__PURE__ */ Lc(), zv = /* @__PURE__ */ y(2, (t, n) => {
  const i = Array.from(t), s = Math.floor(n);
  return fe(i) ? s >= 1 ? $v(i, s) : [[], i] : [i, []];
}), $v = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.max(1, Math.floor(n));
  return i >= t.length ? [Dv(t), []] : [Ns(t.slice(1, i), ie(t)), t.slice(i)];
}), Dv = (t) => t.slice(), Zv = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = zt(t), a = zt(n);
  return fe(s) ? fe(a) ? Dd(i)(Nd(s, a)) : s : a;
}), Ss = /* @__PURE__ */ y(2, (t, n) => Zv(t, n, Bv)), ui = () => [], Ee = (t) => [t], ei = /* @__PURE__ */ y(2, (t, n) => t.map(n)), jv = /* @__PURE__ */ y(2, (t, n) => {
  if (Mv(t))
    return [];
  const i = [];
  for (let s = 0; s < t.length; s++) {
    const a = n(t[s], s);
    for (let u = 0; u < a.length; u++)
      i.push(a[u]);
  }
  return i;
}), Wv = /* @__PURE__ */ jv(gt), $d = /* @__PURE__ */ y(3, (t, n, i) => zt(t).reduce((s, a, u) => i(s, a, u), n)), ih = (t, n) => {
  const i = [];
  let s = t, a;
  for (; Be(a = n(s)); ) {
    const [u, h] = a.value;
    i.push(u), s = h;
  }
  return i;
}, Fc = Ly, Dd = /* @__PURE__ */ y(2, (t, n) => {
  const i = zt(t);
  if (fe(i)) {
    const s = [ie(i)], a = ci(i);
    for (const u of a)
      s.every((h) => !n(u, h)) && s.push(u);
    return s;
  }
  return [];
}), Hv = (t) => Dd(t, Lc()), xi = /* @__PURE__ */ y(2, (t, n) => zt(t).join(n)), or = _v, Uv = (t) => t.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"), Vv = /* @__PURE__ */ Symbol.for("effect/Context/Tag"), Bs = /* @__PURE__ */ Symbol.for("effect/Context/Reference"), qv = "effect/STM", Kv = /* @__PURE__ */ Symbol.for(qv), Zd = {
  ...Er,
  _op: "Tag",
  [Kv]: oi,
  [Vv]: {
    _Service: (t) => t,
    _Identifier: (t) => t
  },
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [kt]() {
    return this.toJSON();
  },
  of(t) {
    return t;
  },
  context(t) {
    return Wd(this, t);
  }
}, Gv = {
  ...Zd,
  [Bs]: Bs
}, Jv = (t) => {
  const n = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const i = new Error();
  Error.stackTraceLimit = n;
  const s = Object.create(Zd);
  return Object.defineProperty(s, "stack", {
    get() {
      return i.stack;
    }
  }), s.key = t, s;
}, Yv = () => (t, n) => {
  const i = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const s = new Error();
  Error.stackTraceLimit = i;
  function a() {
  }
  return Object.setPrototypeOf(a, Gv), a.key = t, a.defaultValue = n.defaultValue, Object.defineProperty(a, "stack", {
    get() {
      return s.stack;
    }
  }), a;
}, jd = /* @__PURE__ */ Symbol.for("effect/Context"), Xv = {
  [jd]: {
    _Services: (t) => t
  },
  [K](t) {
    if (tb(t) && this.unsafeMap.size === t.unsafeMap.size) {
      for (const n of this.unsafeMap.keys())
        if (!t.unsafeMap.has(n) || !G(this.unsafeMap.get(n), t.unsafeMap.get(n)))
          return !1;
      return !0;
    }
    return !1;
  },
  [Q]() {
    return Et(this, Mc(this.unsafeMap.size));
  },
  pipe() {
    return U(this, arguments);
  },
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(jt)
    };
  },
  [kt]() {
    return this.toJSON();
  }
}, li = (t) => {
  const n = Object.create(Xv);
  return n.unsafeMap = t, n;
}, Qv = (t) => {
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
}, tb = (t) => J(t, jd), eb = (t) => J(t, Bs), nb = /* @__PURE__ */ li(/* @__PURE__ */ new Map()), ib = () => nb, Wd = (t, n) => li(/* @__PURE__ */ new Map([[t.key, n]])), rb = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = new Map(t.unsafeMap);
  return s.set(n.key, i), li(s);
}), ga = /* @__PURE__ */ ht("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map()), Bc = (t) => {
  if (ga.has(t.key))
    return ga.get(t.key);
  const n = t.defaultValue();
  return ga.set(t.key, n), n;
}, sb = (t, n) => t.unsafeMap.has(n.key) ? t.unsafeMap.get(n.key) : Bc(n), Hd = /* @__PURE__ */ y(2, (t, n) => {
  if (!t.unsafeMap.has(n.key)) {
    if (Bs in n) return Bc(n);
    throw Qv(n);
  }
  return t.unsafeMap.get(n.key);
}), ob = Hd, ab = /* @__PURE__ */ y(2, (t, n) => t.unsafeMap.has(n.key) ? Fa(t.unsafeMap.get(n.key)) : eb(n) ? Fa(Bc(n)) : kd), cb = /* @__PURE__ */ y(2, (t, n) => {
  const i = new Map(t.unsafeMap);
  for (const [s, a] of n.unsafeMap)
    i.set(s, a);
  return li(i);
}), Bn = Jv, zc = ib, ub = Wd, Xn = rb, Ud = ob, Vd = Hd, Mr = ab, qd = cb, $c = Yv, Kd = /* @__PURE__ */ Symbol.for("effect/Chunk");
function lb(t, n, i, s, a) {
  for (let u = n; u < Math.min(t.length, n + a); u++)
    i[s + u - n] = t[u];
  return i;
}
const Gd = [], hb = (t) => Ec((n, i) => n.length === i.length && Sn(n).every((s, a) => t(s, Tn(i, a)))), fb = /* @__PURE__ */ hb(G), db = {
  [Kd]: {
    _A: (t) => t
  },
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: Sn(this).map(jt)
    };
  },
  [kt]() {
    return this.toJSON();
  },
  [K](t) {
    return Jd(t) && fb(this, t);
  },
  [Q]() {
    return Et(this, xr(Sn(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray":
        return this.backing.array[Symbol.iterator]();
      case "IEmpty":
        return Gd[Symbol.iterator]();
      default:
        return Sn(this)[Symbol.iterator]();
    }
  },
  pipe() {
    return U(this, arguments);
  }
}, Dt = (t) => {
  const n = Object.create(db);
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
      n.length = t.array.length, n.depth = 0, n.left = Ne, n.right = Ne;
      break;
    }
    case "ISingleton": {
      n.length = 1, n.depth = 0, n.left = Ne, n.right = Ne;
      break;
    }
    case "ISlice": {
      n.length = t.length, n.depth = t.chunk.depth + 1, n.left = Ne, n.right = Ne;
      break;
    }
  }
  return n;
}, Jd = (t) => J(t, Kd), Ne = /* @__PURE__ */ Dt({
  _tag: "IEmpty"
}), ze = () => Ne, ya = (...t) => gb(t), re = (t) => Dt({
  _tag: "ISingleton",
  a: t
}), Yd = (t) => Jd(t) ? t : fo(zt(t)), Ba = (t, n, i) => {
  switch (t.backing._tag) {
    case "IArray": {
      lb(t.backing.array, 0, n, i, t.length);
      break;
    }
    case "IConcat": {
      Ba(t.left, n, i), Ba(t.right, n, i + t.left.length);
      break;
    }
    case "ISingleton": {
      n[i] = t.backing.a;
      break;
    }
    case "ISlice": {
      let s = 0, a = i;
      for (; s < t.length; )
        n[a] = Tn(t, s), s += 1, a += 1;
      break;
    }
  }
}, _b = (t) => {
  switch (t.backing._tag) {
    case "IEmpty":
      return Gd;
    case "IArray":
      return t.backing.array;
    default: {
      const n = new Array(t.length);
      return Ba(t, n, 0), t.backing = {
        _tag: "IArray",
        array: n
      }, t.left = Ne, t.right = Ne, t.depth = 0, n;
    }
  }
}, Sn = _b, mb = (t) => {
  switch (t.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return t;
    case "IArray":
      return Dt({
        _tag: "IArray",
        array: eh(t.backing.array)
      });
    case "IConcat":
      return Dt({
        _tag: "IConcat",
        left: En(t.backing.right),
        right: En(t.backing.left)
      });
    case "ISlice":
      return fo(eh(Sn(t)));
  }
}, En = mb, pb = /* @__PURE__ */ y(2, (t, n) => n < 0 || n >= t.length ? W() : nt(Tn(t, n))), fo = (t) => t.length === 0 ? ze() : t.length === 1 ? re(t[0]) : Dt({
  _tag: "IArray",
  array: t
}), gb = (t) => fo(t), Tn = /* @__PURE__ */ y(2, (t, n) => {
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
      return n < t.left.length ? Tn(t.left, n) : Tn(t.right, n - t.left.length);
    case "ISlice":
      return Tn(t.backing.chunk, n + t.backing.offset);
  }
}), yb = /* @__PURE__ */ y(2, (t, n) => ke(t, re(n))), we = /* @__PURE__ */ y(2, (t, n) => ke(re(n), t)), za = /* @__PURE__ */ y(2, (t, n) => {
  if (n <= 0)
    return t;
  if (n >= t.length)
    return Ne;
  switch (t.backing._tag) {
    case "ISlice":
      return Dt({
        _tag: "ISlice",
        chunk: t.backing.chunk,
        offset: t.backing.offset + n,
        length: t.backing.length - n
      });
    case "IConcat":
      return n > t.left.length ? za(t.right, n - t.left.length) : Dt({
        _tag: "IConcat",
        left: za(t.left, n),
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
}), ke = /* @__PURE__ */ y(2, (t, n) => {
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
}), vb = (t) => t.length === 0, Qe = (t) => t.length > 0, Xd = /* @__PURE__ */ pb(0), Qd = (t) => Tn(t, 0), Fe = Qd, Ke = (t) => za(t, 1), $a = /* @__PURE__ */ Symbol.for("effect/Duration"), t_ = /* @__PURE__ */ BigInt(0), rh = /* @__PURE__ */ BigInt(24), ds = /* @__PURE__ */ BigInt(60), Da = /* @__PURE__ */ BigInt(1e3), sh = /* @__PURE__ */ BigInt(1e6), oh = /* @__PURE__ */ BigInt(1e9), bb = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/, de = (t) => {
  if (e_(t))
    return t;
  if (Aa(t))
    return kn(t);
  if (Cy(t))
    return va(t);
  if (Array.isArray(t) && t.length === 2 && t.every(Aa))
    return t[0] === -1 / 0 || t[1] === -1 / 0 || Number.isNaN(t[0]) || Number.isNaN(t[1]) ? hi : t[0] === 1 / 0 || t[1] === 1 / 0 ? xb : va(BigInt(Math.round(t[0] * 1e9)) + BigInt(Math.round(t[1])));
  if (Iy(t)) {
    const n = bb.exec(t);
    if (n) {
      const [i, s, a] = n, u = Number(s);
      switch (a) {
        case "nano":
        case "nanos":
          return va(BigInt(s));
        case "micro":
        case "micros":
          return Pb(BigInt(s));
        case "milli":
        case "millis":
          return kn(u);
        case "second":
        case "seconds":
          return Eb(u);
        case "minute":
        case "minutes":
          return kb(u);
        case "hour":
        case "hours":
          return Mb(u);
        case "day":
        case "days":
          return Lb(u);
        case "week":
        case "weeks":
          return Ib(u);
      }
    }
  }
  throw new Error("Invalid DurationInput");
}, ah = {
  _tag: "Millis",
  millis: 0
}, wb = {
  _tag: "Infinity"
}, Sb = {
  [$a]: $a,
  [Q]() {
    return Et(this, gd(this.value));
  },
  [K](t) {
    return e_(t) && zb(this, t);
  },
  toString() {
    return `Duration(${Db(this)})`;
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
          hrtime: Ob(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [kt]() {
    return this.toJSON();
  },
  pipe() {
    return U(this, arguments);
  }
}, se = (t) => {
  const n = Object.create(Sb);
  return Aa(t) ? isNaN(t) || t <= 0 ? n.value = ah : Number.isFinite(t) ? Number.isInteger(t) ? n.value = {
    _tag: "Millis",
    millis: t
  } : n.value = {
    _tag: "Nanos",
    nanos: BigInt(Math.round(t * 1e6))
  } : n.value = wb : t <= t_ ? n.value = ah : n.value = {
    _tag: "Nanos",
    nanos: t
  }, n;
}, e_ = (t) => J(t, $a), Tb = (t) => {
  switch (t.value._tag) {
    case "Millis":
      return t.value.millis === 0;
    case "Nanos":
      return t.value.nanos === t_;
    case "Infinity":
      return !1;
  }
}, hi = /* @__PURE__ */ se(0), xb = /* @__PURE__ */ se(1 / 0), va = (t) => se(t), Pb = (t) => se(t * Da), kn = (t) => se(t), Eb = (t) => se(t * 1e3), kb = (t) => se(t * 6e4), Mb = (t) => se(t * 36e5), Lb = (t) => se(t * 864e5), Ib = (t) => se(t * 6048e5), zs = (t) => n_(t, {
  onMillis: (n) => n,
  onNanos: (n) => Number(n) / 1e6
}), Cb = (t) => {
  const n = de(t);
  switch (n.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return n.value.nanos;
    case "Millis":
      return BigInt(Math.round(n.value.millis * 1e6));
  }
}, Ob = (t) => {
  const n = de(t);
  switch (n.value._tag) {
    case "Infinity":
      return [1 / 0, 0];
    case "Nanos":
      return [Number(n.value.nanos / oh), Number(n.value.nanos % oh)];
    case "Millis":
      return [Math.floor(n.value.millis / 1e3), Math.round(n.value.millis % 1e3 * 1e6)];
  }
}, n_ = /* @__PURE__ */ y(2, (t, n) => {
  const i = de(t);
  switch (i.value._tag) {
    case "Nanos":
      return n.onNanos(i.value.nanos);
    case "Infinity":
      return n.onMillis(1 / 0);
    case "Millis":
      return n.onMillis(i.value.millis);
  }
}), _o = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = de(t), a = de(n);
  if (s.value._tag === "Infinity" || a.value._tag === "Infinity")
    return i.onMillis(zs(s), zs(a));
  if (s.value._tag === "Nanos" || a.value._tag === "Nanos") {
    const u = s.value._tag === "Nanos" ? s.value.nanos : BigInt(Math.round(s.value.millis * 1e6)), h = a.value._tag === "Nanos" ? a.value.nanos : BigInt(Math.round(a.value.millis * 1e6));
    return i.onNanos(u, h);
  }
  return i.onMillis(s.value.millis, a.value.millis);
}), Rb = (t, n) => _o(t, n, {
  onMillis: (i, s) => i === s,
  onNanos: (i, s) => i === s
}), Ab = /* @__PURE__ */ y(2, (t, n) => n_(t, {
  onMillis: (i) => se(i * n),
  onNanos: (i) => se(i * BigInt(n))
})), Nb = /* @__PURE__ */ y(2, (t, n) => _o(t, n, {
  onMillis: (i, s) => se(i + s),
  onNanos: (i, s) => se(i + s)
})), Fb = /* @__PURE__ */ y(2, (t, n) => _o(t, n, {
  onMillis: (i, s) => i <= s,
  onNanos: (i, s) => i <= s
})), Bb = /* @__PURE__ */ y(2, (t, n) => _o(t, n, {
  onMillis: (i, s) => i >= s,
  onNanos: (i, s) => i >= s
})), zb = /* @__PURE__ */ y(2, (t, n) => Rb(de(t), de(n))), $b = (t) => {
  const n = de(t);
  if (n.value._tag === "Infinity")
    return {
      days: 1 / 0,
      hours: 1 / 0,
      minutes: 1 / 0,
      seconds: 1 / 0,
      millis: 1 / 0,
      nanos: 1 / 0
    };
  const i = Cb(n), s = i / sh, a = s / Da, u = a / ds, h = u / ds, d = h / rh;
  return {
    days: Number(d),
    hours: Number(h % rh),
    minutes: Number(u % ds),
    seconds: Number(a % ds),
    millis: Number(s % Da),
    nanos: Number(i % sh)
  };
}, Db = (t) => {
  const n = de(t);
  if (n.value._tag === "Infinity")
    return "Infinity";
  if (Tb(n))
    return "0";
  const i = $b(n), s = [];
  return i.days !== 0 && s.push(`${i.days}d`), i.hours !== 0 && s.push(`${i.hours}h`), i.minutes !== 0 && s.push(`${i.minutes}m`), i.seconds !== 0 && s.push(`${i.seconds}s`), i.millis !== 0 && s.push(`${i.millis}ms`), i.nanos !== 0 && s.push(`${i.nanos}ns`), s.join(" ");
}, Mn = 5, Dc = /* @__PURE__ */ Math.pow(2, Mn), Zb = Dc - 1, jb = Dc / 2, Wb = Dc / 4;
function Hb(t) {
  return t -= t >> 1 & 1431655765, t = (t & 858993459) + (t >> 2 & 858993459), t = t + (t >> 4) & 252645135, t += t >> 8, t += t >> 16, t & 127;
}
function fi(t, n) {
  return n >>> t & Zb;
}
function ti(t) {
  return 1 << t;
}
function i_(t, n) {
  return Hb(t & n - 1);
}
const Ub = (t, n) => ({
  value: t,
  previous: n
});
function ni(t, n, i, s) {
  let a = s;
  if (!t) {
    const u = s.length;
    a = new Array(u);
    for (let h = 0; h < u; ++h) a[h] = s[h];
  }
  return a[n] = i, a;
}
function r_(t, n, i) {
  const s = i.length - 1;
  let a = 0, u = 0, h = i;
  if (t)
    a = u = n;
  else
    for (h = new Array(s); a < n; ) h[u++] = i[a++];
  for (++a; a <= s; ) h[u++] = i[a++];
  return t && (h.length = s), h;
}
function Vb(t, n, i, s) {
  const a = s.length;
  if (t) {
    let _ = a;
    for (; _ >= n; ) s[_--] = s[_];
    return s[n] = i, s;
  }
  let u = 0, h = 0;
  const d = new Array(a + 1);
  for (; u < n; ) d[h++] = s[u++];
  for (d[n] = i; u < a; ) d[++h] = s[u++];
  return d;
}
class an {
  constructor() {
    m(this, "_tag", "EmptyNode");
  }
  modify(n, i, s, a, u, h) {
    const d = s(W());
    return Qt(d) ? new an() : (++h.value, new xn(n, a, u, d));
  }
}
function Me(t) {
  return fd(t, "EmptyNode");
}
function qb(t) {
  return Me(t) || t._tag === "LeafNode" || t._tag === "CollisionNode";
}
function mo(t, n) {
  return Me(t) ? !1 : n === t.edit;
}
class xn {
  constructor(n, i, s, a) {
    m(this, "edit");
    m(this, "hash");
    m(this, "key");
    m(this, "value");
    m(this, "_tag", "LeafNode");
    this.edit = n, this.hash = i, this.key = s, this.value = a;
  }
  modify(n, i, s, a, u, h) {
    if (G(u, this.key)) {
      const _ = s(this.value);
      return _ === this.value ? this : Qt(_) ? (--h.value, new an()) : mo(this, n) ? (this.value = _, this) : new xn(n, a, u, _);
    }
    const d = s(W());
    return Qt(d) ? this : (++h.value, s_(n, i, this.hash, this, a, new xn(n, a, u, d)));
  }
}
class Zc {
  constructor(n, i, s) {
    m(this, "edit");
    m(this, "hash");
    m(this, "children");
    m(this, "_tag", "CollisionNode");
    this.edit = n, this.hash = i, this.children = s;
  }
  modify(n, i, s, a, u, h) {
    if (a === this.hash) {
      const _ = mo(this, n), g = this.updateCollisionList(_, n, this.hash, this.children, s, u, h);
      return g === this.children ? this : g.length > 1 ? new Zc(n, this.hash, g) : g[0];
    }
    const d = s(W());
    return Qt(d) ? this : (++h.value, s_(n, i, this.hash, this, a, new xn(n, a, u, d)));
  }
  updateCollisionList(n, i, s, a, u, h, d) {
    const _ = a.length;
    for (let S = 0; S < _; ++S) {
      const b = a[S];
      if ("key" in b && G(h, b.key)) {
        const x = b.value, P = u(x);
        return P === x ? a : Qt(P) ? (--d.value, r_(n, S, a)) : ni(n, S, new xn(i, s, h, P), a);
      }
    }
    const g = u(W());
    return Qt(g) ? a : (++d.value, ni(n, _, new xn(i, s, h, g), a));
  }
}
class di {
  constructor(n, i, s) {
    m(this, "edit");
    m(this, "mask");
    m(this, "children");
    m(this, "_tag", "IndexedNode");
    this.edit = n, this.mask = i, this.children = s;
  }
  modify(n, i, s, a, u, h) {
    const d = this.mask, _ = this.children, g = fi(i, a), S = ti(g), b = i_(d, S), x = d & S, P = mo(this, n);
    if (!x) {
      const it = new an().modify(n, i + Mn, s, a, u, h);
      return it ? _.length >= jb ? Gb(n, g, it, d, _) : new di(n, d | S, Vb(P, b, it, _)) : this;
    }
    const k = _[b], I = k.modify(n, i + Mn, s, a, u, h);
    if (k === I) return this;
    let D = d, st;
    if (Me(I)) {
      if (D &= ~S, !D) return new an();
      if (_.length <= 2 && qb(_[b ^ 1]))
        return _[b ^ 1];
      st = r_(P, b, _);
    } else
      st = ni(P, b, I, _);
    return P ? (this.mask = D, this.children = st, this) : new di(n, D, st);
  }
}
class jc {
  constructor(n, i, s) {
    m(this, "edit");
    m(this, "size");
    m(this, "children");
    m(this, "_tag", "ArrayNode");
    this.edit = n, this.size = i, this.children = s;
  }
  modify(n, i, s, a, u, h) {
    let d = this.size;
    const _ = this.children, g = fi(i, a), S = _[g], b = (S || new an()).modify(n, i + Mn, s, a, u, h);
    if (S === b) return this;
    const x = mo(this, n);
    let P;
    if (Me(S) && !Me(b))
      ++d, P = ni(x, g, b, _);
    else if (!Me(S) && Me(b)) {
      if (--d, d <= Wb)
        return Kb(n, d, g, _);
      P = ni(x, g, new an(), _);
    } else
      P = ni(x, g, b, _);
    return x ? (this.size = d, this.children = P, this) : new jc(n, d, P);
  }
}
function Kb(t, n, i, s) {
  const a = new Array(n - 1);
  let u = 0, h = 0;
  for (let d = 0, _ = s.length; d < _; ++d)
    if (d !== i) {
      const g = s[d];
      g && !Me(g) && (a[u++] = g, h |= 1 << d);
    }
  return new di(t, h, a);
}
function Gb(t, n, i, s, a) {
  const u = [];
  let h = s, d = 0;
  for (let _ = 0; h; ++_)
    h & 1 && (u[_] = a[d++]), h >>>= 1;
  return u[n] = i, new jc(t, d + 1, u);
}
function Jb(t, n, i, s, a, u) {
  if (i === a) return new Zc(t, i, [u, s]);
  const h = fi(n, i), d = fi(n, a);
  if (h === d)
    return (_) => new di(t, ti(h) | ti(d), [_]);
  {
    const _ = h < d ? [s, u] : [u, s];
    return new di(t, ti(h) | ti(d), _);
  }
}
function s_(t, n, i, s, a, u) {
  let h, d = n;
  for (; ; ) {
    const _ = Jb(t, d, i, s, a, u);
    if (typeof _ == "function")
      h = Ub(_, h), d = d + Mn;
    else {
      let g = _;
      for (; h != null; )
        g = h.value(g), h = h.previous;
      return g;
    }
  }
}
const o_ = "effect/HashMap", Za = /* @__PURE__ */ Symbol.for(o_), Yb = {
  [Za]: Za,
  [Symbol.iterator]() {
    return new po(this, (t, n) => [t, n]);
  },
  [Q]() {
    let t = z(o_);
    for (const n of this)
      t ^= T(z(n[0]), at(z(n[1])));
    return Et(this, t);
  },
  [K](t) {
    if (t0(t)) {
      if (t._size !== this._size)
        return !1;
      for (const n of this) {
        const i = T(t, Hc(n[0], z(n[0])));
        if (Qt(i))
          return !1;
        if (!G(n[1], i.value))
          return !1;
      }
      return !0;
    }
    return !1;
  },
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(jt)
    };
  },
  [kt]() {
    return this.toJSON();
  },
  pipe() {
    return U(this, arguments);
  }
}, Wc = (t, n, i, s) => {
  const a = Object.create(Yb);
  return a._editable = t, a._edit = n, a._root = i, a._size = s, a;
};
class po {
  constructor(n, i) {
    m(this, "map");
    m(this, "f");
    m(this, "v");
    this.map = n, this.f = i, this.v = a_(this.map._root, this.f, void 0);
  }
  next() {
    if (Qt(this.v))
      return {
        done: !0,
        value: void 0
      };
    const n = this.v.value;
    return this.v = $s(n.cont), {
      done: !1,
      value: n.value
    };
  }
  [Symbol.iterator]() {
    return new po(this.map, this.f);
  }
}
const $s = (t) => t ? c_(t[0], t[1], t[2], t[3], t[4]) : W(), a_ = (t, n, i = void 0) => {
  switch (t._tag) {
    case "LeafNode":
      return Be(t.value) ? nt({
        value: n(t.key, t.value.value),
        cont: i
      }) : $s(i);
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const s = t.children;
      return c_(s.length, s, 0, n, i);
    }
    default:
      return $s(i);
  }
}, c_ = (t, n, i, s, a) => {
  for (; i < t; ) {
    const u = n[i++];
    if (u && !Me(u))
      return a_(u, s, [t, n, i, s, a]);
  }
  return $s(a);
}, Xb = /* @__PURE__ */ Wc(!1, 0, /* @__PURE__ */ new an(), 0), go = () => Xb, Qb = (t) => {
  const n = l_(go());
  for (const i of t)
    ar(n, i[0], i[1]);
  return s0(n);
}, t0 = (t) => J(t, Za), e0 = (t) => t && Me(t._root), n0 = /* @__PURE__ */ y(2, (t, n) => Hc(t, n, z(n))), Hc = /* @__PURE__ */ y(3, (t, n, i) => {
  let s = t._root, a = 0;
  for (; ; )
    switch (s._tag) {
      case "LeafNode":
        return G(n, s.key) ? s.value : W();
      case "CollisionNode": {
        if (i === s.hash) {
          const u = s.children;
          for (let h = 0, d = u.length; h < d; ++h) {
            const _ = u[h];
            if ("key" in _ && G(n, _.key))
              return _.value;
          }
        }
        return W();
      }
      case "IndexedNode": {
        const u = fi(a, i), h = ti(u);
        if (s.mask & h) {
          s = s.children[i_(s.mask, h)], a += Mn;
          break;
        }
        return W();
      }
      case "ArrayNode": {
        if (s = s.children[fi(a, i)], s) {
          a += Mn;
          break;
        }
        return W();
      }
      default:
        return W();
    }
}), i0 = /* @__PURE__ */ y(2, (t, n) => Be(Hc(t, n, z(n)))), ar = /* @__PURE__ */ y(3, (t, n, i) => Uc(t, n, () => nt(i))), r0 = /* @__PURE__ */ y(3, (t, n, i) => t._editable ? (t._root = n, t._size = i, t) : n === t._root ? t : Wc(t._editable, t._edit, n, i)), u_ = (t) => new po(t, (n) => n), ja = (t) => t._size, l_ = (t) => Wc(!0, t._edit + 1, t._root, t._size), s0 = (t) => (t._editable = !1, t), Uc = /* @__PURE__ */ y(3, (t, n, i) => o0(t, n, z(n), i)), o0 = /* @__PURE__ */ y(4, (t, n, i, s) => {
  const a = {
    value: t._size
  }, u = t._root.modify(t._editable ? t._edit : NaN, 0, s, i, n, a);
  return T(t, r0(u, a.value));
}), ch = /* @__PURE__ */ y(2, (t, n) => Uc(t, n, W)), a0 = /* @__PURE__ */ y(2, (t, n) => yo(t, go(), (i, s, a) => ar(i, a, n(s, a)))), c0 = /* @__PURE__ */ y(2, (t, n) => yo(t, void 0, (i, s, a) => n(s, a))), yo = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = t._root;
  if (s._tag === "LeafNode")
    return Be(s.value) ? i(n, s.value.value, s.key) : n;
  if (s._tag === "EmptyNode")
    return n;
  const a = [s.children];
  let u;
  for (; u = a.pop(); )
    for (let h = 0, d = u.length; h < d; ) {
      const _ = u[h++];
      _ && !Me(_) && (_._tag === "LeafNode" ? Be(_.value) && (n = i(n, _.value.value, _.key)) : a.push(_.children));
    }
  return n;
}), h_ = "effect/HashSet", Wa = /* @__PURE__ */ Symbol.for(h_), u0 = {
  [Wa]: Wa,
  [Symbol.iterator]() {
    return u_(this._keyMap);
  },
  [Q]() {
    return Et(this, at(z(this._keyMap))(z(h_)));
  },
  [K](t) {
    return l0(t) ? ja(this._keyMap) === ja(t._keyMap) && G(this._keyMap, t._keyMap) : !1;
  },
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(jt)
    };
  },
  [kt]() {
    return this.toJSON();
  },
  pipe() {
    return U(this, arguments);
  }
}, vo = (t) => {
  const n = Object.create(u0);
  return n._keyMap = t, n;
}, l0 = (t) => J(t, Wa), h0 = /* @__PURE__ */ vo(/* @__PURE__ */ go()), bo = () => h0, f0 = (t) => {
  const n = Vc(bo());
  for (const i of t)
    cr(n, i);
  return qc(n);
}, d0 = (...t) => {
  const n = Vc(bo());
  for (const i of t)
    cr(n, i);
  return qc(n);
}, _0 = /* @__PURE__ */ y(2, (t, n) => i0(t._keyMap, n)), m0 = (t) => ja(t._keyMap), Vc = (t) => vo(l_(t._keyMap)), qc = (t) => (t._keyMap._editable = !1, t), f_ = /* @__PURE__ */ y(2, (t, n) => {
  const i = Vc(t);
  return n(i), qc(i);
}), cr = /* @__PURE__ */ y(2, (t, n) => t._keyMap._editable ? (ar(n, !0)(t._keyMap), t) : vo(ar(n, !0)(t._keyMap))), d_ = /* @__PURE__ */ y(2, (t, n) => t._keyMap._editable ? (ch(n)(t._keyMap), t) : vo(ch(n)(t._keyMap))), p0 = /* @__PURE__ */ y(2, (t, n) => f_(t, (i) => {
  for (const s of n)
    d_(i, s);
})), g0 = /* @__PURE__ */ y(2, (t, n) => f_(bo(), (i) => {
  y0(t, (s) => cr(i, s));
  for (const s of n)
    cr(i, s);
})), y0 = /* @__PURE__ */ y(2, (t, n) => c0(t._keyMap, (i, s) => n(s))), v0 = /* @__PURE__ */ y(3, (t, n, i) => yo(t._keyMap, n, (s, a, u) => i(s, u))), Ln = bo, b0 = f0, Kc = d0, w0 = _0, __ = m0, nr = cr, m_ = d_, uh = p0, ur = g0, Ds = v0, lh = /* @__PURE__ */ Symbol.for("effect/MutableRef"), S0 = {
  [lh]: lh,
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: jt(this.current)
    };
  },
  [kt]() {
    return this.toJSON();
  },
  pipe() {
    return U(this, arguments);
  }
}, Gc = (t) => {
  const n = Object.create(S0);
  return n.current = t, n;
}, _i = (t) => t.current, Jc = /* @__PURE__ */ y(2, (t, n) => (t.current = n, t)), Yc = "effect/FiberId", lr = /* @__PURE__ */ Symbol.for(Yc), Zs = "None", Ha = "Runtime", T0 = "Composite", x0 = /* @__PURE__ */ Ct(`${Yc}-${Zs}`);
var pf;
let P0 = class {
  constructor() {
    m(this, pf, lr);
    m(this, "_tag", Zs);
    m(this, "id", -1);
    m(this, "startTimeMillis", -1);
  }
  [(pf = lr, Q)]() {
    return x0;
  }
  [K](n) {
    return p_(n) && n._tag === Zs;
  }
  toString() {
    return Vt(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [kt]() {
    return this.toJSON();
  }
};
var gf;
class E0 {
  constructor(n, i) {
    m(this, "id");
    m(this, "startTimeMillis");
    m(this, gf, lr);
    m(this, "_tag", Ha);
    this.id = n, this.startTimeMillis = i;
  }
  [(gf = lr, Q)]() {
    return Et(this, Ct(`${Yc}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [K](n) {
    return p_(n) && n._tag === Ha && this.id === n.id && this.startTimeMillis === n.startTimeMillis;
  }
  toString() {
    return Vt(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [kt]() {
    return this.toJSON();
  }
}
const k0 = /* @__PURE__ */ new P0(), p_ = (t) => J(t, lr), Ua = (t) => {
  switch (t._tag) {
    case Zs:
      return Ln();
    case Ha:
      return Kc(t.id);
    case T0:
      return T(Ua(t.left), ur(Ua(t.right)));
  }
}, hh = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => Gc(0)), g_ = (t) => Array.from(Ua(t)).map((i) => `#${i}`).join(","), M0 = () => {
  const t = _i(hh);
  return T(hh, Jc(t + 1)), new E0(t, Date.now());
}, mi = k0, L0 = g_, y_ = M0, Xc = go, I0 = Qb, C0 = e0, v_ = n0, b_ = ar, w_ = u_, O0 = Uc, R0 = a0, S_ = yo, hr = /* @__PURE__ */ Symbol.for("effect/List"), Va = (t) => zt(t), A0 = (t) => My(Fc(t), Va), N0 = /* @__PURE__ */ A0(G), F0 = {
  [hr]: hr,
  _tag: "Cons",
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: Va(this).map(jt)
    };
  },
  [kt]() {
    return this.toJSON();
  },
  [K](t) {
    return x_(t) && this._tag === t._tag && N0(this, t);
  },
  [Q]() {
    return Et(this, xr(Va(this)));
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
    return U(this, arguments);
  }
}, js = (t, n) => {
  const i = Object.create(F0);
  return i.head = t, i.tail = n, i;
}, B0 = /* @__PURE__ */ Ct("Nil"), z0 = {
  [hr]: hr,
  _tag: "Nil",
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [kt]() {
    return this.toJSON();
  },
  [Q]() {
    return B0;
  },
  [K](t) {
    return x_(t) && this._tag === t._tag;
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
    return U(this, arguments);
  }
}, T_ = /* @__PURE__ */ Object.create(z0), x_ = (t) => J(t, hr), Je = (t) => t._tag === "Nil", $0 = (t) => t._tag === "Cons", D0 = () => T_, In = (t, n) => js(t, n), pi = D0, Qc = (t) => js(t, T_), Z0 = /* @__PURE__ */ y(2, (t, n) => W0(n, t)), j0 = /* @__PURE__ */ y(2, (t, n) => In(n, t)), W0 = /* @__PURE__ */ y(2, (t, n) => {
  if (Je(t))
    return n;
  if (Je(n))
    return t;
  {
    const i = js(n.head, t);
    let s = i, a = n.tail;
    for (; !Je(a); ) {
      const u = js(a.head, t);
      s.tail = u, s = u, a = a.tail;
    }
    return i;
  }
}), H0 = /* @__PURE__ */ y(3, (t, n, i) => {
  let s = n, a = t;
  for (; !Je(a); )
    s = i(s, a.head), a = a.tail;
  return s;
}), U0 = (t) => {
  let n = pi(), i = t;
  for (; !Je(i); )
    n = j0(n, i.head), i = i.tail;
  return n;
}, tu = /* @__PURE__ */ function() {
  function t(n) {
    n && Object.assign(this, n);
  }
  return t.prototype = Rc, t;
}(), V0 = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function fh(t) {
  return t;
}
const Lr = {
  ...tu.prototype,
  [V0]: {
    _Value: fh,
    _Patch: fh
  }
}, q0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Lr), {
  _tag: "Empty"
}), K0 = /* @__PURE__ */ Object.create(q0), P_ = () => K0, G0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Lr), {
  _tag: "AndThen"
}), J0 = (t, n) => {
  const i = Object.create(G0);
  return i.first = t, i.second = n, i;
}, Y0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Lr), {
  _tag: "AddService"
}), X0 = (t, n) => {
  const i = Object.create(Y0);
  return i.key = t, i.service = n, i;
}, Q0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Lr), {
  _tag: "RemoveService"
}), tw = (t) => {
  const n = Object.create(Q0);
  return n.key = t, n;
}, ew = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Lr), {
  _tag: "UpdateService"
}), nw = (t, n) => {
  const i = Object.create(ew);
  return i.key = t, i.update = n, i;
}, iw = (t, n) => {
  const i = new Map(t.unsafeMap);
  let s = P_();
  for (const [a, u] of n.unsafeMap.entries())
    if (i.has(a)) {
      const h = i.get(a);
      i.delete(a), G(h, u) || (s = Ts(nw(a, () => u))(s));
    } else
      i.delete(a), s = Ts(X0(a, u))(s);
  for (const [a] of i.entries())
    s = Ts(tw(a))(s);
  return s;
}, Ts = /* @__PURE__ */ y(2, (t, n) => J0(t, n)), rw = /* @__PURE__ */ y(2, (t, n) => {
  if (t._tag === "Empty")
    return n;
  let i = !1, s = re(t);
  const a = new Map(n.unsafeMap);
  for (; Qe(s); ) {
    const h = Fe(s), d = Ke(s);
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
        s = we(we(d, h.second), h.first);
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
    return li(a);
  const u = /* @__PURE__ */ new Map();
  for (const [h] of n.unsafeMap)
    a.has(h) && (u.set(h, a.get(h)), a.delete(h));
  for (const [h, d] of a)
    u.set(h, d);
  return li(u);
}), sw = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function ba(t) {
  return t;
}
const wo = {
  ...tu.prototype,
  [sw]: {
    _Value: ba,
    _Key: ba,
    _Patch: ba
  }
}, ow = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(wo), {
  _tag: "Empty"
}), aw = /* @__PURE__ */ Object.create(ow), E_ = () => aw, cw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(wo), {
  _tag: "AndThen"
}), uw = (t, n) => {
  const i = Object.create(cw);
  return i.first = t, i.second = n, i;
}, lw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(wo), {
  _tag: "Add"
}), hw = (t) => {
  const n = Object.create(lw);
  return n.value = t, n;
}, fw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(wo), {
  _tag: "Remove"
}), dw = (t) => {
  const n = Object.create(fw);
  return n.value = t, n;
}, _w = (t, n) => {
  const [i, s] = Ds([t, E_()], ([a, u], h) => w0(h)(a) ? [m_(h)(a), u] : [a, qa(hw(h))(u)])(n);
  return Ds(s, (a, u) => qa(dw(u))(a))(i);
}, qa = /* @__PURE__ */ y(2, (t, n) => uw(t, n)), mw = /* @__PURE__ */ y(2, (t, n) => {
  if (t._tag === "Empty")
    return n;
  let i = n, s = re(t);
  for (; Qe(s); ) {
    const a = Fe(s), u = Ke(s);
    switch (a._tag) {
      case "Empty": {
        s = u;
        break;
      }
      case "AndThen": {
        s = we(a.first)(we(a.second)(u));
        break;
      }
      case "Add": {
        i = nr(a.value)(i), s = u;
        break;
      }
      case "Remove":
        i = m_(a.value)(i), s = u;
    }
  }
  return i;
}), pw = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function dh(t) {
  return t;
}
const Ir = {
  ...tu.prototype,
  [pw]: {
    _Value: dh,
    _Patch: dh
  }
}, gw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ir), {
  _tag: "Empty"
}), yw = /* @__PURE__ */ Object.create(gw), k_ = () => yw, vw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ir), {
  _tag: "AndThen"
}), bw = (t, n) => {
  const i = Object.create(vw);
  return i.first = t, i.second = n, i;
}, ww = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ir), {
  _tag: "Append"
}), Sw = (t) => {
  const n = Object.create(ww);
  return n.values = t, n;
}, Tw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ir), {
  _tag: "Slice"
}), xw = (t, n) => {
  const i = Object.create(Tw);
  return i.from = t, i.until = n, i;
}, Pw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ir), {
  _tag: "Update"
}), Ew = (t, n) => {
  const i = Object.create(Pw);
  return i.index = t, i.patch = n, i;
}, kw = (t) => {
  let n = 0, i = k_();
  for (; n < t.oldValue.length && n < t.newValue.length; ) {
    const s = t.oldValue[n], a = t.newValue[n], u = t.differ.diff(s, a);
    G(u, t.differ.empty) || (i = xs(i, Ew(n, u))), n = n + 1;
  }
  return n < t.oldValue.length && (i = xs(i, xw(0, n))), n < t.newValue.length && (i = xs(i, Sw(Nv(n)(t.newValue)))), i;
}, xs = /* @__PURE__ */ y(2, (t, n) => bw(t, n)), Mw = /* @__PURE__ */ y(3, (t, n, i) => {
  if (t._tag === "Empty")
    return n;
  let s = n.slice(), a = Ee(t);
  for (; Lv(a); ) {
    const u = ie(a), h = ci(a);
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
}), Lw = /* @__PURE__ */ Symbol.for("effect/Differ"), Iw = {
  [Lw]: {
    _P: gt,
    _V: gt
  },
  pipe() {
    return U(this, arguments);
  }
}, Pi = (t) => {
  const n = Object.create(Iw);
  return n.empty = t.empty, n.diff = t.diff, n.combine = t.combine, n.patch = t.patch, n;
}, Cw = () => Pi({
  empty: P_(),
  combine: (t, n) => Ts(n)(t),
  diff: (t, n) => iw(t, n),
  patch: (t, n) => rw(n)(t)
}), Ow = () => Pi({
  empty: E_(),
  combine: (t, n) => qa(n)(t),
  diff: (t, n) => _w(t, n),
  patch: (t, n) => mw(n)(t)
}), Rw = (t) => Pi({
  empty: k_(),
  combine: (n, i) => xs(n, i),
  diff: (n, i) => kw({
    oldValue: n,
    newValue: i,
    differ: t
  }),
  patch: (n, i) => Mw(n, i, t)
}), M_ = () => Aw((t, n) => n), Aw = (t) => Pi({
  empty: gt,
  combine: (n, i) => n === gt ? i : i === gt ? n : (s) => i(n(s)),
  diff: (n, i) => G(n, i) ? gt : oo(i),
  patch: (n, i) => t(i, n(i))
}), fr = 255, L_ = 8, Ka = (t) => t & fr, Ga = (t) => t >> L_ & fr, Cr = (t, n) => (t & fr) + ((n & t & fr) << L_), Nw = /* @__PURE__ */ Cr(0, 0), Fw = (t) => Cr(t, t), Bw = (t) => Cr(t, 0), zw = /* @__PURE__ */ y(2, (t, n) => Cr(Ka(t) & ~n, Ga(t))), $w = /* @__PURE__ */ y(2, (t, n) => t | n), Dw = (t) => ~t >>> 0 & fr, Zw = 0, Ei = 1, jw = 2, I_ = 4, Ja = 16, C_ = 32, Ww = (t) => So(t, C_), Hw = /* @__PURE__ */ y(2, (t, n) => t | n), rn = (t) => O_(t) && !Vw(t), O_ = (t) => So(t, Ei), So = /* @__PURE__ */ y(2, (t, n) => (t & n) !== 0), R_ = (...t) => t.reduce((n, i) => n | i, 0), Uw = /* @__PURE__ */ R_(Zw), _h = (t) => So(t, I_), Vw = (t) => So(t, Ja), Ps = /* @__PURE__ */ y(2, (t, n) => Cr(t ^ n, n)), Es = /* @__PURE__ */ y(2, (t, n) => t & (Dw(Ka(n)) | Ga(n)) | Ka(n) & Ga(n)), mh = /* @__PURE__ */ Pi({
  empty: Nw,
  diff: (t, n) => Ps(t, n),
  combine: (t, n) => $w(n)(t),
  patch: (t, n) => Es(n, t)
}), qw = Fw, A_ = Bw, ph = zw, N_ = (t, n) => ({
  _tag: "Par",
  left: t,
  right: n
}), _s = (t, n) => ({
  _tag: "Seq",
  left: t,
  right: n
}), Kw = (t) => {
  let n = Qc(t), i = pi();
  for (; ; ) {
    const [s, a] = H0(n, [F_(), pi()], ([u, h], d) => {
      const [_, g] = Gw(d);
      return [tS(u, _), Z0(h, g)];
    });
    if (i = Jw(i, s), Je(a))
      return U0(i);
    n = a;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Gw = (t) => {
  let n = t, i = F_(), s = pi(), a = pi();
  for (; ; )
    switch (n._tag) {
      case "Empty": {
        if (Je(s))
          return [i, a];
        n = s.head, s = s.tail;
        break;
      }
      case "Par": {
        s = In(n.right, s), n = n.left;
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
            const d = u.left, _ = u.right;
            n = N_(_s(d, h), _s(_, h));
            break;
          }
          case "Seq": {
            const d = u.left, _ = u.right;
            n = _s(d, _s(_, h));
            break;
          }
          case "Single": {
            n = u, a = In(h, a);
            break;
          }
        }
        break;
      }
      case "Single": {
        if (i = Qw(i, n), Je(s))
          return [i, a];
        n = s.head, s = s.tail;
        break;
      }
    }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Jw = (t, n) => {
  if (Je(t))
    return Qc(wa(n));
  if (eS(n))
    return t;
  const i = aS(t.head), s = nS(n);
  return i.length === 1 && s.length === 1 && G(i[0], s[0]) ? In(oS(t.head, wa(n)), t.tail) : In(wa(n), t);
}, Yw = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel"), Xw = {
  /* c8 ignore next */
  _R: (t) => t
};
var yf;
yf = Yw;
class eu {
  constructor(n) {
    m(this, "map");
    m(this, yf, Xw);
    this.map = n;
  }
}
const F_ = () => new eu(Xc()), Qw = (t, n) => new eu(O0(t.map, n.dataSource, (i) => gv(yv(i, yb(n.blockedRequest)), () => re(n.blockedRequest)))), tS = (t, n) => new eu(S_(t.map, n.map, (i, s, a) => b_(i, a, un(v_(i, a), {
  onNone: () => s,
  onSome: (u) => ke(s, u)
})))), eS = (t) => C0(t.map), nS = (t) => Array.from(w_(t.map)), wa = (t) => sS(R0(t.map, (n) => re(n))), iS = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential"), rS = {
  /* c8 ignore next */
  _R: (t) => t
};
var vf;
vf = iS;
class B_ {
  constructor(n) {
    m(this, "map");
    m(this, vf, rS);
    this.map = n;
  }
}
const sS = (t) => new B_(t), oS = (t, n) => new B_(S_(n.map, t.map, (i, s, a) => b_(i, a, un(v_(i, a), {
  onNone: () => ze(),
  onSome: (u) => ke(u, s)
})))), aS = (t) => Array.from(w_(t.map)), cS = (t) => Array.from(t.map), ki = "Die", Cn = "Empty", Mi = "Fail", Li = "Interrupt", gi = "Parallel", yi = "Sequential", z_ = "effect/Cause", $_ = /* @__PURE__ */ Symbol.for(z_), uS = {
  /* c8 ignore next */
  _E: (t) => t
}, Ii = {
  [$_]: uS,
  [Q]() {
    return T(z(z_), at(z(wS(this))), Et(this));
  },
  [K](t) {
    return lS(t) && bS(this, t);
  },
  pipe() {
    return U(this, arguments);
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
          defect: jt(this.defect)
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
          failure: jt(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: jt(this.left),
          right: jt(this.right)
        };
    }
  },
  toString() {
    return Or(this);
  },
  [kt]() {
    return this.toJSON();
  }
}, vi = /* @__PURE__ */ (() => {
  const t = /* @__PURE__ */ Object.create(Ii);
  return t._tag = Cn, t;
})(), dr = (t) => {
  const n = Object.create(Ii);
  return n._tag = Mi, n.error = t, n;
}, Ye = (t) => {
  const n = Object.create(Ii);
  return n._tag = ki, n.defect = t, n;
}, sn = (t) => {
  const n = Object.create(Ii);
  return n._tag = Li, n.fiberId = t, n;
}, To = (t, n) => {
  const i = Object.create(Ii);
  return i._tag = gi, i.left = t, i.right = n, i;
}, be = (t, n) => {
  const i = Object.create(Ii);
  return i._tag = yi, i.left = t, i.right = n, i;
}, lS = (t) => J(t, $_), hS = (t) => t._tag === Cn, fS = (t) => t._tag === ki, dS = (t) => t._tag === Cn ? !0 : bi(t, !0, (n, i) => {
  switch (i._tag) {
    case Cn:
      return nt(n);
    case ki:
    case Mi:
    case Li:
      return nt(!1);
    default:
      return W();
  }
}), D_ = (t) => Be(yS(t)), nu = (t) => ru(void 0, TS)(t), _S = (t) => En(bi(t, ze(), (n, i) => i._tag === Mi ? nt(T(n, we(i.error))) : W())), mS = (t) => En(bi(t, ze(), (n, i) => i._tag === ki ? nt(T(n, we(i.defect))) : W())), pS = (t) => bi(t, Ln(), (n, i) => i._tag === Li ? nt(T(n, nr(i.fiberId))) : W()), gS = (t) => iu(t, (n) => n._tag === Mi ? nt(n.error) : W()), Z_ = (t) => {
  const n = gS(t);
  switch (n._tag) {
    case "None":
      return qe(t);
    case "Some":
      return ai(n.value);
  }
}, yS = (t) => iu(t, (n) => n._tag === Li ? nt(n.fiberId) : W()), gh = (t) => j_(t, {
  onEmpty: vi,
  onFail: () => vi,
  onDie: Ye,
  onInterrupt: sn,
  onSequential: be,
  onParallel: To
}), vS = (t) => j_(t, {
  onEmpty: vi,
  onFail: Ye,
  onDie: Ye,
  onInterrupt: sn,
  onSequential: be,
  onParallel: To
}), bS = (t, n) => {
  let i = re(t), s = re(n);
  for (; Qe(i) && Qe(s); ) {
    const [a, u] = T(Fe(i), bi([Ln(), ze()], ([_, g], S) => {
      const [b, x] = Ya(S);
      return nt([T(_, ur(b)), T(g, ke(x))]);
    })), [h, d] = T(Fe(s), bi([Ln(), ze()], ([_, g], S) => {
      const [b, x] = Ya(S);
      return nt([T(_, ur(b)), T(g, ke(x))]);
    }));
    if (!G(a, h))
      return !1;
    i = u, s = d;
  }
  return !0;
}, wS = (t) => SS(re(t), ze()), SS = (t, n) => {
  for (; ; ) {
    const [i, s] = T(t, $d([Ln(), ze()], ([u, h], d) => {
      const [_, g] = Ya(d);
      return [T(u, ur(_)), T(h, ke(g))];
    })), a = __(i) > 0 ? T(n, we(i)) : n;
    if (vb(s))
      return En(a);
    t = s, n = a;
  }
  throw new Error(uo("Cause.flattenCauseLoop"));
}, iu = /* @__PURE__ */ y(2, (t, n) => {
  const i = [t];
  for (; i.length > 0; ) {
    const s = i.pop(), a = n(s);
    switch (a._tag) {
      case "None": {
        switch (s._tag) {
          case yi:
          case gi: {
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
  return W();
}), Ya = (t) => {
  let n = t;
  const i = [];
  let s = Ln(), a = ze();
  for (; n !== void 0; )
    switch (n._tag) {
      case Cn: {
        if (i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case Mi: {
        if (s = nr(s, ya(n._tag, n.error)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case ki: {
        if (s = nr(s, ya(n._tag, n.defect)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case Li: {
        if (s = nr(s, ya(n._tag, n.fiberId)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case yi: {
        switch (n.left._tag) {
          case Cn: {
            n = n.right;
            break;
          }
          case yi: {
            n = be(n.left.left, be(n.left.right, n.right));
            break;
          }
          case gi: {
            n = To(be(n.left.left, n.right), be(n.left.right, n.right));
            break;
          }
          default: {
            a = we(a, n.right), n = n.left;
            break;
          }
        }
        break;
      }
      case gi: {
        i.push(n.right), n = n.left;
        break;
      }
    }
  throw new Error(uo("Cause.evaluateCauseLoop"));
}, TS = {
  emptyCase: Ql,
  failCase: Ra,
  dieCase: Ra,
  interruptCase: Ql,
  sequentialCase: (t, n, i) => n && i,
  parallelCase: (t, n, i) => n && i
}, yh = "SequentialCase", vh = "ParallelCase", j_ = /* @__PURE__ */ y(2, (t, {
  onDie: n,
  onEmpty: i,
  onFail: s,
  onInterrupt: a,
  onParallel: u,
  onSequential: h
}) => ru(t, void 0, {
  emptyCase: () => i,
  failCase: (d, _) => s(_),
  dieCase: (d, _) => n(_),
  interruptCase: (d, _) => a(_),
  sequentialCase: (d, _, g) => h(_, g),
  parallelCase: (d, _, g) => u(_, g)
})), bi = /* @__PURE__ */ y(3, (t, n, i) => {
  let s = n, a = t;
  const u = [];
  for (; a !== void 0; ) {
    const h = i(s, a);
    switch (s = Be(h) ? h.value : s, a._tag) {
      case yi: {
        u.push(a.right), a = a.left;
        break;
      }
      case gi: {
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
}), ru = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = [t], a = [];
  for (; s.length > 0; ) {
    const h = s.pop();
    switch (h._tag) {
      case Cn: {
        a.push(qe(i.emptyCase(n)));
        break;
      }
      case Mi: {
        a.push(qe(i.failCase(n, h.error)));
        break;
      }
      case ki: {
        a.push(qe(i.dieCase(n, h.defect)));
        break;
      }
      case Li: {
        a.push(qe(i.interruptCase(n, h.fiberId)));
        break;
      }
      case yi: {
        s.push(h.right), s.push(h.left), a.push(ai({
          _tag: yh
        }));
        break;
      }
      case gi: {
        s.push(h.right), s.push(h.left), a.push(ai({
          _tag: vh
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
          case yh: {
            const d = u.pop(), _ = u.pop(), g = i.sequentialCase(n, d, _);
            u.push(g);
            break;
          }
          case vh: {
            const d = u.pop(), _ = u.pop(), g = i.parallelCase(n, d, _);
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
}), Or = (t, n) => nu(t) ? "All fibers interrupted without errors." : H_(t).map(function(i) {
  return (n == null ? void 0 : n.renderErrorCause) !== !0 || i.cause === void 0 ? i.stack : `${i.stack} {
${W_(i.cause, "  ")}
}`;
}).join(`
`), W_ = (t, n) => {
  const i = t.stack.split(`
`);
  let s = `${n}[cause]: ${i[0]}`;
  for (let a = 1, u = i.length; a < u; a++)
    s += `
${n}${i[a]}`;
  return t.cause && (s += ` {
${W_(t.cause, `${n}  `)}
${n}}`), s;
};
class Ws extends globalThis.Error {
  constructor(i) {
    const s = typeof i == "object" && i !== null, a = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(xS(i), s && "cause" in i && typeof i.cause < "u" ? {
      cause: new Ws(i.cause)
    } : void 0);
    m(this, "span");
    this.message === "" && (this.message = "An error has occurred"), Error.stackTraceLimit = a, this.name = i instanceof Error ? i.name : "Error", s && (wi in i && (this.span = i[wi]), Object.keys(i).forEach((u) => {
      u in this || (this[u] = i[u]);
    })), this.stack = kS(`${this.name}: ${this.message}`, i instanceof Error && i.stack ? i.stack : "", this.span);
  }
}
const xS = (t) => {
  if (typeof t == "string")
    return t;
  if (typeof t == "object" && t !== null && t instanceof Error)
    return t.message;
  try {
    if (J(t, "toString") && ao(t.toString) && t.toString !== Object.prototype.toString && t.toString !== globalThis.Array.prototype.toString)
      return t.toString();
  } catch {
  }
  return yd(t);
}, PS = /\((.*)\)/g, ES = /* @__PURE__ */ ht("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap()), kS = (t, n, i) => {
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
      const d = ES.get(u);
      if (typeof d == "function") {
        const _ = d();
        if (typeof _ == "string") {
          const g = _.matchAll(PS);
          let S = !1;
          for (const [, b] of g)
            S = !0, s.push(`    at ${u.name} (${b})`);
          S || s.push(`    at ${u.name} (${_.replace(/^at /, "")})`);
        } else
          s.push(`    at ${u.name}`);
      } else
        s.push(`    at ${u.name}`);
      u = gn(u.parent), h++;
    }
  }
  return s.join(`
`);
}, wi = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation"), H_ = (t) => ru(t, void 0, {
  emptyCase: () => [],
  dieCase: (n, i) => [new Ws(i)],
  failCase: (n, i) => [new Ws(i)],
  interruptCase: () => [],
  parallelCase: (n, i, s) => [...i, ...s],
  sequentialCase: (n, i, s) => [...i, ...s]
}), xo = "Pending", U_ = "Done", MS = "effect/Deferred", LS = /* @__PURE__ */ Symbol.for(MS), IS = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, CS = (t) => ({
  _tag: xo,
  joiners: t
}), OS = (t) => ({
  _tag: U_,
  effect: t
});
class Rr {
  constructor(n) {
    m(this, "self");
    m(this, "called", !1);
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
    return new Rr(this.self);
  }
}
const V_ = (t, n) => {
  const i = new Wt("Blocked");
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}, RS = (t) => {
  const n = new Wt("RunBlocked");
  return n.effect_instruction_i0 = t, n;
}, Si = /* @__PURE__ */ Symbol.for("effect/Effect");
class AS {
  constructor(n, i) {
    m(this, "patch");
    m(this, "op");
    m(this, "_op", Cc);
    this.patch = n, this.op = i;
  }
}
var bf;
class Wt {
  constructor(n) {
    m(this, "_op");
    m(this, "effect_instruction_i0");
    m(this, "effect_instruction_i1");
    m(this, "effect_instruction_i2");
    m(this, "trace");
    m(this, bf, oi);
    this._op = n;
  }
  [(bf = Si, K)](n) {
    return this === n;
  }
  [Q]() {
    return Et(this, kc(this));
  }
  pipe() {
    return U(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: jt(this.effect_instruction_i0),
      effect_instruction_i1: jt(this.effect_instruction_i1),
      effect_instruction_i2: jt(this.effect_instruction_i2)
    };
  }
  toString() {
    return Vt(this.toJSON());
  }
  [kt]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Rr(new Tr(this));
  }
}
var wf;
class q_ {
  constructor(n) {
    m(this, "_op");
    m(this, "effect_instruction_i0");
    m(this, "effect_instruction_i1");
    m(this, "effect_instruction_i2");
    m(this, "trace");
    m(this, wf, oi);
    this._op = n, this._tag = n;
  }
  [(wf = Si, K)](n) {
    return Io(n) && n._op === "Failure" && // @ts-expect-error
    G(this.effect_instruction_i0, n.effect_instruction_i0);
  }
  [Q]() {
    return T(
      // @ts-expect-error
      Ct(this._tag),
      // @ts-expect-error
      at(z(this.effect_instruction_i0)),
      Et(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return U(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return Vt(this.toJSON());
  }
  [kt]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Rr(new Tr(this));
  }
}
var Sf;
class K_ {
  constructor(n) {
    m(this, "_op");
    m(this, "effect_instruction_i0");
    m(this, "effect_instruction_i1");
    m(this, "effect_instruction_i2");
    m(this, "trace");
    m(this, Sf, oi);
    this._op = n, this._tag = n;
  }
  [(Sf = Si, K)](n) {
    return Io(n) && n._op === "Success" && // @ts-expect-error
    G(this.effect_instruction_i0, n.effect_instruction_i0);
  }
  [Q]() {
    return T(
      // @ts-expect-error
      Ct(this._tag),
      // @ts-expect-error
      at(z(this.effect_instruction_i0)),
      Et(this)
    );
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return U(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: jt(this.value)
    };
  }
  toString() {
    return Vt(this.toJSON());
  }
  [kt]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Rr(new Tr(this));
  }
}
const su = (t) => J(t, Si), oe = (t) => {
  const n = new Wt(wd);
  return n.effect_instruction_i0 = t, n;
}, NS = /* @__PURE__ */ y(3, (t, n, i) => ko((s) => R(t, (a) => R(Y_(Nt(() => s(n(a)))), (u) => Nt(() => i(a, u)).pipe(An({
  onFailure: (h) => {
    switch (u._tag) {
      case le:
        return ae(be(u.effect_instruction_i0, h));
      case he:
        return ae(h);
    }
  },
  onSuccess: () => u
})))))), On = /* @__PURE__ */ y(2, (t, n) => R(t, () => X(n))), Ar = (t) => On(t, void 0), G_ = function() {
  const t = new Wt(ho);
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
      throw new Error(uo("you're not supposed to end up here"));
  }
  return t;
}, Hs = (t, n = mi) => {
  const i = new Wt(Qi);
  let s;
  return i.effect_instruction_i0 = (a) => {
    s = t(a);
  }, i.effect_instruction_i1 = n, nm(i, (a) => su(s) ? s : Le);
}, FS = (t, n = mi) => Nt(() => Hs(t, n)), Rn = (t, n = mi) => G_(t, function() {
  let i, s;
  function a(_) {
    i ? i(_) : s === void 0 && (s = _);
  }
  const u = new Wt(Qi);
  u.effect_instruction_i0 = (_) => {
    i = _, s && _(s);
  }, u.effect_instruction_i1 = n;
  let h, d;
  return this.effect_instruction_i0.length !== 1 ? (d = new AbortController(), h = Xt(() => this.effect_instruction_i0(a, d.signal))) : h = Xt(() => this.effect_instruction_i0(a)), h || d ? nm(u, (_) => (d && d.abort(), h ?? Le)) : u;
}), BS = /* @__PURE__ */ y(2, (t, n) => {
  const i = new Wt(bs);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}), _r = /* @__PURE__ */ y(2, (t, n) => Nr(t, {
  onFailure: n,
  onSuccess: X
})), bh = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation"), J_ = (t, n) => Be(n) ? new Proxy(t, {
  has(i, s) {
    return s === wi || s === bh || s in i;
  },
  get(i, s) {
    return s === wi ? n.value : s === bh ? t : i[s];
  }
}) : t, Us = (t) => co(t) && !(wi in t) ? oe((n) => ae(Ye(J_(t, vm(n))))) : ae(Ye(t)), zS = (t) => $S(() => Ye(new vT(t))), mr = (t) => Nr(t, {
  onFailure: (n) => X(ai(n)),
  onSuccess: (n) => X(qe(n))
}), Y_ = (t) => jS(t, {
  onFailure: bt,
  onSuccess: Bt
}), Ft = (t) => co(t) && !(wi in t) ? oe((n) => ae(dr(J_(t, vm(n))))) : ae(dr(t)), Po = (t) => R(Z(t), Ft), ae = (t) => {
  const n = new q_(le);
  return n.effect_instruction_i0 = t, n;
}, $S = (t) => R(Z(t), ae), DS = /* @__PURE__ */ oe((t) => X(t.id())), X_ = (t) => oe((n) => t(n.id())), R = /* @__PURE__ */ y(2, (t, n) => {
  const i = new Wt(Os);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}), ZS = (t) => {
  const n = new Wt("OnStep");
  return n.effect_instruction_i0 = t, n;
}, Q_ = (t) => R(t, gt), jS = /* @__PURE__ */ y(2, (t, n) => An(t, {
  onFailure: (i) => X(n.onFailure(i)),
  onSuccess: (i) => X(n.onSuccess(i))
})), An = /* @__PURE__ */ y(2, (t, n) => {
  const i = new Wt(Rs);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n.onFailure, i.effect_instruction_i2 = n.onSuccess, i;
}), Nr = /* @__PURE__ */ y(2, (t, n) => An(t, {
  onFailure: (i) => {
    if (mS(i).length > 0)
      return ae(vS(i));
    const a = _S(i);
    return a.length > 0 ? n.onFailure(Qd(a)) : ae(i);
  },
  onSuccess: n.onSuccess
})), on = /* @__PURE__ */ y(2, (t, n) => Nt(() => {
  const i = zt(t), s = Nc(i.length);
  let a = 0;
  return On(cu({
    while: () => a < i.length,
    body: () => n(i[a], a),
    step: (u) => {
      s[a++] = u;
    }
  }), s);
})), Eo = /* @__PURE__ */ y(2, (t, n) => Nt(() => {
  const i = zt(t);
  let s = 0;
  return cu({
    while: () => s < i.length,
    body: () => n(i[s], s),
    step: () => {
      s++;
    }
  });
})), tm = (t) => {
  const n = new Wt(Pr);
  return n.effect_instruction_i0 = qw(Ei), n.effect_instruction_i1 = () => t, n;
}, yt = /* @__PURE__ */ y(2, (t, n) => R(t, (i) => Z(() => n(i)))), em = /* @__PURE__ */ y(2, (t, n) => Nr(t, {
  onFailure: (i) => Po(() => n.onFailure(i)),
  onSuccess: (i) => Z(() => n.onSuccess(i))
})), ou = /* @__PURE__ */ y(2, (t, n) => An(t, {
  onFailure: (i) => {
    const s = Z_(i);
    switch (s._tag) {
      case "Left":
        return Po(() => n(s.left));
      case "Right":
        return ae(s.right);
    }
  },
  onSuccess: X
})), au = /* @__PURE__ */ y(2, (t, n) => ko((i) => An(i(t), {
  onFailure: (s) => {
    const a = bt(s);
    return An(n(a), {
      onFailure: (u) => bt(be(s, u)),
      onSuccess: () => a
    });
  },
  onSuccess: (s) => {
    const a = Bt(s);
    return Ge(n(a), a);
  }
}))), nm = /* @__PURE__ */ y(2, (t, n) => au(t, mm({
  onFailure: (i) => nu(i) ? Ar(n(pS(i))) : Le,
  onSuccess: () => Le
}))), WS = (t) => HS(t, gt), HS = /* @__PURE__ */ y(2, (t, n) => Nr(t, {
  onFailure: (i) => Us(n(i)),
  onSuccess: X
})), X = (t) => {
  const n = new K_(he);
  return n.effect_instruction_i0 = t, n;
}, Nt = (t) => {
  const n = new Wt(ho);
  return n.commit = t, n;
}, Z = (t) => {
  const n = new Wt(bd);
  return n.effect_instruction_i0 = t, n;
}, im = /* @__PURE__ */ y((t) => t.length === 3 || t.length === 2 && !(co(t[1]) && "onlyEffect" in t[1]), (t, n) => R(t, (i) => {
  const s = typeof n == "function" ? n(i) : n;
  return su(s) ? On(s, i) : Ry(s) ? Hs((a) => {
    s.then((u) => a(X(i)), (u) => a(Ft(new _m(u, "An unknown error occurred in Effect.tap"))));
  }) : X(i);
})), US = (t) => oe((n) => {
  const i = n.getFiberRef(Qa), s = T(i, Xe(() => n.scope()));
  return t(Mo(Qa, nt(s)));
}), rm = (t) => {
  const n = new Wt(Pr);
  return n.effect_instruction_i0 = A_(Ei), n.effect_instruction_i1 = () => t, n;
}, ko = (t) => G_(t, function() {
  const n = new Wt(Pr);
  return n.effect_instruction_i0 = A_(Ei), n.effect_instruction_i1 = (i) => O_(i) ? Xt(() => this.effect_instruction_i0(tm)) : Xt(() => this.effect_instruction_i0(rm)), n;
}), Le = /* @__PURE__ */ X(void 0), VS = (t) => {
  const n = new Wt(Pr);
  return n.effect_instruction_i0 = t, n.effect_instruction_i1 = void 0, n;
}, cu = (t) => {
  const n = new Wt(As);
  return n.effect_instruction_i0 = t.while, n.effect_instruction_i1 = t.body, n.effect_instruction_i2 = t.step, n;
}, qS = (t) => Nt(() => {
  const n = new Wt(tr);
  return n.effect_instruction_i0 = t(), n;
}), KS = function() {
  const t = arguments.length === 1 ? arguments[0] : arguments[1].bind(arguments[0]);
  return qS(() => t(T));
}, uu = (t) => {
  const n = new Wt(ws);
  return typeof (t == null ? void 0 : t.priority) < "u" ? fT(n, t.priority) : n;
}, sm = /* @__PURE__ */ y(2, (t, n) => R(t, (i) => yt(n, (s) => [i, s]))), lu = /* @__PURE__ */ y(2, (t, n) => R(t, (i) => On(n, i))), Ge = /* @__PURE__ */ y(2, (t, n) => R(t, () => n)), GS = /* @__PURE__ */ y(3, (t, n, i) => R(t, (s) => yt(n, (a) => i(s, a)))), om = (t) => R(DS, (n) => T(t, am(n))), am = /* @__PURE__ */ y(2, (t, n) => R(t.interruptAsFork(n), () => t.await)), JS = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return U(this, arguments);
  }
}, YS = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return U(this, arguments);
  }
}, XS = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return U(this, arguments);
  }
}, cm = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return U(this, arguments);
  }
}, um = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return U(this, arguments);
  }
}, lm = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return U(this, arguments);
  }
}, QS = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return U(this, arguments);
  }
}, tT = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return U(this, arguments);
  }
}, eT = "effect/FiberRef", nT = /* @__PURE__ */ Symbol.for(eT), iT = {
  /* c8 ignore next */
  _A: (t) => t
}, hu = (t) => oe((n) => Bt(n.getFiberRef(t))), fu = /* @__PURE__ */ y(2, (t, n) => R(hu(t), n)), wh = /* @__PURE__ */ y(2, (t, n) => rT(t, () => [void 0, n])), rT = /* @__PURE__ */ y(2, (t, n) => oe((i) => {
  const [s, a] = n(i.getFiberRef(t));
  return i.setFiberRef(t, a), X(s);
})), Mo = /* @__PURE__ */ y(3, (t, n, i) => NS(lu(hu(n), wh(n, i)), () => t, (s) => wh(n, s))), ce = (t, n) => Ci(t, {
  differ: M_(),
  fork: (n == null ? void 0 : n.fork) ?? gt,
  join: n == null ? void 0 : n.join
}), sT = (t) => {
  const n = Ow();
  return Ci(t, {
    differ: n,
    fork: n.empty
  });
}, oT = (t) => {
  const n = Rw(M_());
  return Ci(t, {
    differ: n,
    fork: n.empty
  });
}, hm = (t) => {
  const n = Cw();
  return Ci(t, {
    differ: n,
    fork: n.empty
  });
}, Ci = (t, n) => ({
  ...kr,
  [nT]: iT,
  initial: t,
  commit() {
    return hu(this);
  },
  diff: (s, a) => n.differ.diff(s, a),
  combine: (s, a) => n.differ.combine(s, a),
  patch: (s) => (a) => n.differ.patch(s, a),
  fork: n.fork,
  join: n.join ?? ((s, a) => a)
}), aT = (t) => Ci(t, {
  differ: mh,
  fork: mh.empty
}), Fr = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => hm(zc())), du = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => ce(0)), cT = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => ce(2048)), uT = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => ce(Xc())), lT = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => ce(um)), hT = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => ce(pi())), fT = /* @__PURE__ */ y(2, (t, n) => Mo(t, du, n)), dT = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => ce("unbounded")), _T = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => ce(!0)), mT = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => ce(nt(lm))), pT = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/versionMismatchErrorLogLevel"), () => ce(nt(cm))), Xa = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => oT(ui())), Qa = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => ce(W(), {
  fork: () => W(),
  join: (t, n) => t
})), ms = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => ce(vi, {
  fork: () => vi,
  join: (t, n) => t
})), gT = (t, n) => t.addFinalizer(() => Ar(n)), yT = (t, n) => t.close(n), Lo = (t, n) => t.fork(n), fm = /* @__PURE__ */ function() {
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
    [kt]() {
      return this.toString !== globalThis.Error.prototype.toString ? this.stack ? `${this.toString()}
${this.stack.split(`
`).slice(1).join(`
`)}` : this.toString() : "Bun" in globalThis ? Or(dr(this), {
        renderErrorCause: !0
      }) : this;
    }
  }
  return Object.assign(t.prototype, iv), t;
}(), dm = (t, n) => {
  class i extends fm {
    constructor() {
      super(...arguments);
      m(this, "_tag", n);
    }
  }
  return Object.assign(i.prototype, t), i.prototype.name = n, i;
}, Sh = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException"), vT = /* @__PURE__ */ dm({
  [Sh]: Sh
}, "RuntimeException"), bT = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException"), wT = (t) => J(t, bT), Th = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement"), _u = /* @__PURE__ */ dm({
  [Th]: Th
}, "NoSuchElementException"), xh = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException"), _m = /* @__PURE__ */ function() {
  class t extends fm {
    constructor(s, a) {
      super(a ?? "An unknown error occurred", {
        cause: s
      });
      m(this, "_tag", "UnknownException");
      m(this, "error");
      this.error = s;
    }
  }
  return Object.assign(t.prototype, {
    [xh]: xh,
    name: "UnknownException"
  }), t;
}(), Io = (t) => su(t) && "_tag" in t && (t._tag === "Success" || t._tag === "Failure"), ST = (t) => t._tag === "Success", TT = (t) => {
  switch (t._tag) {
    case le:
      return D_(t.effect_instruction_i0);
    case he:
      return !1;
  }
}, Ph = (t, n) => ET(t, n != null && n.parallel ? To : be), Eh = (t) => bt(dr(t)), bt = (t) => {
  const n = new q_(le);
  return n.effect_instruction_i0 = t, n;
}, xT = (t) => bt(sn(t)), Sa = /* @__PURE__ */ y(2, (t, n) => {
  switch (t._tag) {
    case le:
      return bt(t.effect_instruction_i0);
    case he:
      return Bt(n(t.effect_instruction_i0));
  }
}), mm = /* @__PURE__ */ y(2, (t, {
  onFailure: n,
  onSuccess: i
}) => {
  switch (t._tag) {
    case le:
      return n(t.effect_instruction_i0);
    case he:
      return i(t.effect_instruction_i0);
  }
}), Bt = (t) => {
  const n = new K_(he);
  return n.effect_instruction_i0 = t, n;
}, vn = /* @__PURE__ */ Bt(void 0), PT = /* @__PURE__ */ y(3, (t, n, {
  onFailure: i,
  onSuccess: s
}) => {
  switch (t._tag) {
    case le:
      switch (n._tag) {
        case he:
          return bt(t.effect_instruction_i0);
        case le:
          return bt(i(t.effect_instruction_i0, n.effect_instruction_i0));
      }
    case he:
      switch (n._tag) {
        case he:
          return Bt(s(t.effect_instruction_i0, n.effect_instruction_i0));
        case le:
          return bt(n.effect_instruction_i0);
      }
  }
}), ET = (t, n) => {
  const i = Yd(t);
  return Qe(i) ? T(Ke(i), $d(T(Fe(i), Sa(re)), (s, a) => T(s, PT(a, {
    onSuccess: (u, h) => T(u, we(h)),
    onFailure: n
  }))), Sa(En), Sa((s) => Sn(s)), nt) : W();
}, kT = (t) => ({
  ...kr,
  [LS]: IS,
  state: Gc(CS([])),
  commit() {
    return pm(this);
  },
  blockingOn: t
}), pm = (t) => FS((n) => {
  const i = _i(t.state);
  switch (i._tag) {
    case U_:
      return n(i.effect);
    case xo:
      return i.joiners.push(n), MT(t, n);
  }
}, t.blockingOn), gm = (t, n) => {
  const i = _i(t.state);
  if (i._tag === xo) {
    Jc(t.state, OS(n));
    for (let s = 0, a = i.joiners.length; s < a; s++)
      i.joiners[s](n);
  }
}, MT = (t, n) => Z(() => {
  const i = _i(t.state);
  if (i._tag === xo) {
    const s = i.joiners.indexOf(n);
    s >= 0 && i.joiners.splice(s, 1);
  }
}), LT = /* @__PURE__ */ oe((t) => Bt(t.currentContext)), IT = () => LT, Oi = (t) => R(IT(), t), ym = /* @__PURE__ */ y(2, (t, n) => Mo(Fr, n)(t)), CT = /* @__PURE__ */ y(2, (t, n) => Oi((i) => ym(t, n(i)))), vm = (t) => {
  const n = t.currentSpan;
  return n !== void 0 && n._tag === "Span" ? nt(n) : W();
}, OT = ST, RT = TT, kh = /* @__PURE__ */ Symbol.for("effect/MutableHashMap"), AT = {
  [kh]: kh,
  [Symbol.iterator]() {
    return new mu(this);
  },
  toString() {
    return Vt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(jt)
    };
  },
  [kt]() {
    return this.toJSON();
  },
  pipe() {
    return U(this, arguments);
  }
};
class mu {
  constructor(n) {
    m(this, "self");
    m(this, "referentialIterator");
    m(this, "bucketIterator");
    this.self = n, this.referentialIterator = n.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== void 0)
      return this.bucketIterator.next();
    const n = this.referentialIterator.next();
    return n.done ? (this.bucketIterator = new NT(this.self.buckets.values()), this.next()) : n;
  }
  [Symbol.iterator]() {
    return new mu(this.self);
  }
}
class NT {
  constructor(n) {
    m(this, "backing");
    m(this, "currentBucket");
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
const FT = () => {
  const t = Object.create(AT);
  return t.referential = /* @__PURE__ */ new Map(), t.buckets = /* @__PURE__ */ new Map(), t.bucketsSize = 0, t;
}, yn = /* @__PURE__ */ y(2, (t, n) => {
  if (Cs(n) === !1)
    return t.referential.has(n) ? nt(t.referential.get(n)) : W();
  const i = n[Q](), s = t.buckets.get(i);
  return s === void 0 ? W() : BT(t, s, n);
}), BT = (t, n, i, s = !1) => {
  for (let a = 0, u = n.length; a < u; a++)
    if (i[K](n[a][0])) {
      const h = n[a][1];
      return s && (n.splice(a, 1), t.bucketsSize--), nt(h);
    }
  return W();
}, Ki = /* @__PURE__ */ y(2, (t, n) => Be(yn(t, n))), Gi = /* @__PURE__ */ y(3, (t, n, i) => {
  if (Cs(n) === !1)
    return t.referential.set(n, i), t;
  const s = n[Q](), a = t.buckets.get(s);
  return a === void 0 ? (t.buckets.set(s, [[n, i]]), t.bucketsSize++, t) : (zT(t, a, n), a.push([n, i]), t.bucketsSize++, t);
}), zT = (t, n, i) => {
  for (let s = 0, a = n.length; s < a; s++)
    if (i[K](n[s][0])) {
      n.splice(s, 1), t.bucketsSize--;
      return;
    }
}, $T = "effect/Clock", Mh = /* @__PURE__ */ Symbol.for($T), Co = /* @__PURE__ */ Bn("effect/Clock"), DT = 2 ** 31 - 1, Lh = {
  unsafeSchedule(t, n) {
    const i = zs(n);
    if (i > DT)
      return Ra;
    let s = !1;
    const a = setTimeout(() => {
      s = !0, t();
    }, i);
    return () => (clearTimeout(a), !s);
  }
}, Ih = /* @__PURE__ */ function() {
  const t = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance > "u" || typeof performance.now != "function")
    return () => BigInt(Date.now()) * t;
  let n;
  return () => (n === void 0 && (n = BigInt(Date.now()) * t - BigInt(Math.round(performance.now() * 1e6))), n + BigInt(Math.round(performance.now() * 1e6)));
}(), ZT = /* @__PURE__ */ function() {
  const t = typeof process == "object" && "hrtime" in process && typeof process.hrtime.bigint == "function" ? process.hrtime : void 0;
  if (!t)
    return Ih;
  const n = /* @__PURE__ */ Ih() - /* @__PURE__ */ t.bigint();
  return () => n + t.bigint();
}();
var Tf;
Tf = Mh;
class jT {
  constructor() {
    m(this, Tf, Mh);
    m(this, "currentTimeMillis", /* @__PURE__ */ Z(() => this.unsafeCurrentTimeMillis()));
    m(this, "currentTimeNanos", /* @__PURE__ */ Z(() => this.unsafeCurrentTimeNanos()));
  }
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return ZT();
  }
  scheduler() {
    return X(Lh);
  }
  sleep(n) {
    return Rn((i) => {
      const s = Lh.unsafeSchedule(() => i(Le), n);
      return Ar(Z(s));
    });
  }
}
const WT = () => new jT(), bm = "And", wm = "Or", Sm = "InvalidData", Tm = "MissingData", xm = "SourceUnavailable", Pm = "Unsupported", HT = "effect/ConfigError", Ch = /* @__PURE__ */ Symbol.for(HT), Ri = {
  _tag: "ConfigError",
  [Ch]: Ch
}, Em = (t, n) => {
  const i = Object.create(Ri);
  return i._op = bm, i.left = t, i.right = n, Object.defineProperty(i, "toString", {
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
}, km = (t, n) => {
  const i = Object.create(Ri);
  return i._op = wm, i.left = t, i.right = n, Object.defineProperty(i, "toString", {
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
}, UT = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create(Ri);
  return s._op = Sm, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Invalid data at ${T(this.path, xi(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, Nn = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create(Ri);
  return s._op = Tm, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Missing data at ${T(this.path, xi(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, VT = (t, n, i, s = {
  pathDelim: "."
}) => {
  const a = Object.create(Ri);
  return a._op = xm, a.path = t, a.message = n, a.cause = i, Object.defineProperty(a, "toString", {
    enumerable: !1,
    value() {
      return `(Source unavailable at ${T(this.path, xi(s.pathDelim))}: "${this.message}")`;
    }
  }), a;
}, qT = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create(Ri);
  return s._op = Pm, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Unsupported operation at ${T(this.path, xi(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, bn = /* @__PURE__ */ y(2, (t, n) => {
  switch (t._op) {
    case bm:
      return Em(bn(t.left, n), bn(t.right, n));
    case wm:
      return km(bn(t.left, n), bn(t.right, n));
    case Sm:
      return UT([...n, ...t.path], t.message);
    case Tm:
      return Nn([...n, ...t.path], t.message);
    case xm:
      return VT([...n, ...t.path], t.message, t.cause);
    case Pm:
      return qT([...n, ...t.path], t.message);
  }
}), KT = {
  _tag: "Empty"
}, Ta = /* @__PURE__ */ y(2, (t, n) => {
  let i = Qc(n), s = t;
  for (; $0(i); ) {
    const a = i.head;
    switch (a._tag) {
      case "Empty": {
        i = i.tail;
        break;
      }
      case "AndThen": {
        i = In(a.first, In(a.second, i.tail));
        break;
      }
      case "MapName": {
        s = ei(s, a.f), i = i.tail;
        break;
      }
      case "Nested": {
        s = Ns(s, a.name), i = i.tail;
        break;
      }
      case "Unnested": {
        if (T(er(s), Sv(a.name)))
          s = ci(s), i = i.tail;
        else
          return ai(Nn(s, `Expected ${a.name} to be in path in ConfigProvider#unnested`));
        break;
      }
    }
  }
  return qe(s);
}), GT = "Constant", JT = "Fail", YT = "Fallback", XT = "Described", QT = "Lazy", tx = "MapOrFail", ex = "Nested", nx = "Primitive", ix = "Sequence", rx = "HashMap", sx = "ZipWith", Vs = (t, n) => [...t, ...n], ox = "effect/ConfigProvider", Oh = /* @__PURE__ */ Symbol.for(ox), ax = /* @__PURE__ */ Bn("effect/ConfigProvider"), cx = "effect/ConfigProviderFlat", Rh = /* @__PURE__ */ Symbol.for(cx), ux = (t) => ({
  [Oh]: Oh,
  pipe() {
    return U(this, arguments);
  },
  ...t
}), lx = (t) => ({
  [Rh]: Rh,
  patch: t.patch,
  load: (n, i, s = !0) => t.load(n, i, s),
  enumerateChildren: t.enumerateChildren
}), hx = (t) => ux({
  load: (n) => R(ye(t, ui(), n, !1), (i) => un(er(i), {
    onNone: () => Ft(Nn(ui(), `Expected a single value having structure: ${n}`)),
    onSome: X
  })),
  flattened: t
}), fx = (t) => {
  const {
    pathDelim: n,
    seqDelim: i
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, t), s = (_) => T(_, xi(n)), a = (_) => _.split(n), u = () => typeof process < "u" && "env" in process && typeof process.env == "object" ? process.env : {};
  return hx(lx({
    load: (_, g, S = !0) => {
      const b = s(_), x = u(), P = b in x ? nt(x[b]) : W();
      return T(P, ou(() => Nn(_, `Expected ${b} to exist in the process context`)), R((k) => gx(k, _, g, i, S)));
    },
    enumerateChildren: (_) => Z(() => {
      const g = u(), x = Object.keys(g).map((P) => a(P.toUpperCase())).filter((P) => {
        for (let k = 0; k < _.length; k++) {
          const I = T(_, Bd(k)), D = P[k];
          if (D === void 0 || I !== D)
            return !1;
        }
        return !0;
      }).flatMap((P) => P.slice(_.length, _.length + 1));
      return b0(x);
    }),
    patch: KT
  }));
}, dx = (t, n, i, s) => {
  const a = ih(i.length, (_) => _ >= s.length ? W() : nt([t(_), _ + 1])), u = ih(s.length, (_) => _ >= i.length ? W() : nt([n(_), _ + 1])), h = Vs(i, a), d = Vs(s, u);
  return [h, d];
}, _x = (t, n) => {
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
    case GT:
      return X(Ee(a.value));
    case XT:
      return Nt(() => ye(t, n, a.config, s));
    case JT:
      return Ft(Nn(n, a.message));
    case YT:
      return T(Nt(() => ye(t, n, a.first, s)), _r((u) => a.condition(u) ? T(ye(t, n, a.second, s), _r((h) => Ft(km(u, h)))) : Ft(u)));
    case QT:
      return Nt(() => ye(t, n, a.config(), s));
    case tx:
      return Nt(() => T(ye(t, n, a.original, s), R(on((u) => T(a.mapOrFail(u), ou(bn(_x(n, a.original))))))));
    case ex:
      return Nt(() => ye(t, Vs(n, Ee(a.name)), a.config, s));
    case nx:
      return T(Ta(n, t.patch), R((u) => T(t.load(u, a, s), R((h) => {
        if (h.length === 0) {
          const d = T(Ov(u), Xe(() => "<n/a>"));
          return Ft(Nn([], `Expected ${a.description} with name ${d}`));
        }
        return X(h);
      }))));
    case ix:
      return T(Ta(n, t.patch), R((u) => T(t.enumerateChildren(u), R(vx), R((h) => h.length === 0 ? Nt(() => yt(ye(t, n, a.config, !0), Ee)) : T(on(h, (d) => ye(t, Ev(n, `[${d}]`), a.config, !0)), yt((d) => {
        const _ = Wv(d);
        return _.length === 0 ? Ee(ui()) : Ee(_);
      }))))));
    case rx:
      return Nt(() => T(Ta(n, t.patch), R((u) => T(t.enumerateChildren(u), R((h) => T(h, on((d) => ye(t, Vs(u, Ee(d)), a.valueConfig, s)), yt((d) => d.length === 0 ? Ee(Xc()) : T(yx(d), ei((_) => I0(nh(zt(h), _)))))))))));
    case sx:
      return Nt(() => T(ye(t, n, a.left, s), mr, R((u) => T(ye(t, n, a.right, s), mr, R((h) => {
        if (Xi(u) && Xi(h))
          return Ft(Em(u.left, h.left));
        if (Xi(u) && fs(h))
          return Ft(u.left);
        if (fs(u) && Xi(h))
          return Ft(h.left);
        if (fs(u) && fs(h)) {
          const d = T(n, xi(".")), _ = mx(n, d), [g, S] = dx(_, _, T(u.right, ei(qe)), T(h.right, ei(qe)));
          return T(g, nh(S), on(([b, x]) => T(sm(b, x), yt(([P, k]) => a.zip(P, k)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
  }
}, mx = (t, n) => (i) => ai(Nn(t, `The element at index ${i} in a sequence at path "${n}" was missing`)), px = (t, n) => t.split(new RegExp(`\\s*${Uv(n)}\\s*`)), gx = (t, n, i, s, a) => a ? T(px(t, s), on((u) => i.parse(u.trim())), ou(bn(n))) : T(i.parse(t), em({
  onFailure: bn(n),
  onSuccess: Ee
})), yx = (t) => Object.keys(t[0]).map((n) => t.map((i) => i[n])), vx = (t) => T(on(t, wx), em({
  onFailure: () => ui(),
  onSuccess: Fs(or)
}), mr, yt(dv)), bx = /^(\[(\d+)\])$/, wx = (t) => {
  const n = t.match(bx);
  if (n !== null) {
    const i = n[2];
    return T(i !== void 0 && i.length > 0 ? nt(i) : W(), vv(Sx));
  }
  return W();
}, Sx = (t) => {
  const n = Number.parseInt(t);
  return Number.isNaN(n) ? W() : nt(n);
}, Ah = /* @__PURE__ */ Symbol.for("effect/Console"), Mm = /* @__PURE__ */ Bn("effect/Console"), Tx = {
  [Ah]: Ah,
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
}, xx = "effect/Random", Nh = /* @__PURE__ */ Symbol.for(xx), Px = /* @__PURE__ */ Bn("effect/Random");
var xf;
xf = Nh;
class Ex {
  constructor(n) {
    m(this, "seed");
    m(this, xf, Nh);
    m(this, "PRNG");
    this.seed = n, this.PRNG = new Dy(n);
  }
  get next() {
    return Z(() => this.PRNG.number());
  }
  get nextBoolean() {
    return yt(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return Z(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(n, i) {
    return yt(this.next, (s) => (i - n) * s + n);
  }
  nextIntBetween(n, i) {
    return Z(() => this.PRNG.integer(i - n) + n);
  }
  shuffle(n) {
    return kx(n, (i) => this.nextIntBetween(0, i));
  }
}
const kx = (t, n) => Nt(() => T(Z(() => Array.from(t)), R((i) => {
  const s = [];
  for (let a = i.length; a >= 2; a = a - 1)
    s.push(a);
  return T(s, Eo((a) => T(n(a), yt((u) => Mx(i, a - 1, u)))), On(Yd(i)));
}))), Mx = (t, n, i) => {
  const s = t[n];
  return t[n] = t[i], t[i] = s, t;
}, Lx = (t) => new Ex(z(t)), Fh = /* @__PURE__ */ Symbol.for("effect/Tracer"), Ix = (t) => ({
  [Fh]: Fh,
  ...t
}), Lm = /* @__PURE__ */ Bn("effect/Tracer"), Im = /* @__PURE__ */ Bn("effect/ParentSpan"), Bh = /* @__PURE__ */ function() {
  const t = "abcdef0123456789", n = t.length;
  return function(i) {
    let s = "";
    for (let a = 0; a < i; a++)
      s += t.charAt(Math.floor(Math.random() * n));
    return s;
  };
}();
class Cx {
  constructor(n, i, s, a, u, h) {
    m(this, "name");
    m(this, "parent");
    m(this, "context");
    m(this, "startTime");
    m(this, "kind");
    m(this, "_tag", "Span");
    m(this, "spanId");
    m(this, "traceId", "native");
    m(this, "sampled", !0);
    m(this, "status");
    m(this, "attributes");
    m(this, "events", []);
    m(this, "links");
    this.name = n, this.parent = i, this.context = s, this.startTime = u, this.kind = h, this.status = {
      _tag: "Started",
      startTime: u
    }, this.attributes = /* @__PURE__ */ new Map(), this.traceId = i._tag === "Some" ? i.value.traceId : Bh(32), this.spanId = Bh(16), this.links = Array.from(a);
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
const Ox = /* @__PURE__ */ Ix({
  span: (t, n, i, s, a, u) => new Cx(t, n, i, s, a, u),
  context: (t) => t()
}), Rx = /* @__PURE__ */ T(/* @__PURE__ */ zc(), /* @__PURE__ */ Xn(Co, /* @__PURE__ */ WT()), /* @__PURE__ */ Xn(Mm, Tx), /* @__PURE__ */ Xn(Px, /* @__PURE__ */ Lx(/* @__PURE__ */ Math.random())), /* @__PURE__ */ Xn(ax, /* @__PURE__ */ fx()), /* @__PURE__ */ Xn(Lm, Ox)), qs = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => hm(Rx)), Ax = (t) => {
  const n = de(t);
  return Cm((i) => i.sleep(n));
}, Nx = (t) => oe((n) => t(n.currentDefaultServices)), Cm = (t) => Nx((n) => t(n.unsafeMap.get(Co.key))), Fx = /* @__PURE__ */ Cm((t) => t.currentTimeMillis), Bx = Ax, zx = Fx;
function $x(t) {
  return new cn(t);
}
function Dx() {
  return $x(/* @__PURE__ */ new Map());
}
const zh = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var Pf;
Pf = zh;
class cn {
  constructor(n) {
    m(this, "locals");
    m(this, Pf, zh);
    this.locals = n;
  }
  pipe() {
    return U(this, arguments);
  }
}
const Zx = (t, n, i, s = !1) => {
  const a = t;
  let u = n, h = i, d = s, _;
  for (; _ === void 0; )
    if (fe(u) && fe(h)) {
      const g = ie(u)[0], S = ci(u), b = ie(h)[0], x = ie(h)[1], P = ci(h);
      g.startTimeMillis < b.startTimeMillis ? (h = P, d = !0) : g.startTimeMillis > b.startTimeMillis ? u = S : g.id < b.id ? (h = P, d = !0) : g.id > b.id ? u = S : _ = [x, d];
    } else
      _ = [a.initial, !0];
  return _;
}, jx = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = new Map(t.locals);
  return i.locals.forEach((a, u) => {
    const h = a[0][1];
    if (!a[0][0][K](n)) {
      if (!s.has(u)) {
        if (G(h, u.initial))
          return;
        s.set(u, [[n, u.join(u.initial, h)]]);
        return;
      }
      const d = s.get(u), [_, g] = Zx(u, d, a);
      if (g) {
        const S = u.diff(_, h), b = d[0][1], x = u.join(b, u.patch(S)(b));
        if (!G(b, x)) {
          let P;
          const k = d[0][0];
          k[K](n) ? P = [[k, x], ...d.slice(1)] : P = [[n, x], ...d], s.set(u, P);
        }
      }
    }
  }), new cn(s);
}), Wx = /* @__PURE__ */ y(2, (t, n) => {
  const i = /* @__PURE__ */ new Map();
  return Om(t, i, n), new cn(i);
}), Om = (t, n, i) => {
  t.locals.forEach((s, a) => {
    const u = s[0][1], h = a.patch(a.fork)(u);
    G(u, h) ? n.set(a, s) : n.set(a, [[i, h], ...s]);
  });
}, Rm = /* @__PURE__ */ y(2, (t, n) => {
  const i = new Map(t.locals);
  return i.delete(n), new cn(i);
}), Hx = /* @__PURE__ */ y(2, (t, n) => t.locals.has(n) ? nt(ie(t.locals.get(n))[1]) : W()), pr = /* @__PURE__ */ y(2, (t, n) => T(Hx(t, n), Xe(() => n.initial))), tc = /* @__PURE__ */ y(2, (t, {
  fiberId: n,
  fiberRef: i,
  value: s
}) => {
  if (t.locals.size === 0)
    return new cn(/* @__PURE__ */ new Map([[i, [[n, s]]]]));
  const a = new Map(t.locals);
  return ec(a, n, i, s), new cn(a);
}), ec = (t, n, i, s) => {
  const a = t.get(i) ?? [];
  let u;
  if (fe(a)) {
    const [h, d] = ie(a);
    if (h[K](n)) {
      if (G(d, s))
        return;
      u = [[n, s], ...a.slice(1)];
    } else
      u = [[n, s], ...a];
  } else
    u = [[n, s]];
  t.set(i, u);
}, Ux = /* @__PURE__ */ y(2, (t, {
  entries: n,
  forkAs: i
}) => {
  if (t.locals.size === 0)
    return new cn(new Map(n));
  const s = new Map(t.locals);
  return i !== void 0 && Om(t, s, i), n.forEach(([a, u]) => {
    u.length === 1 ? ec(s, u[0][0], a, u[0][1]) : u.forEach(([h, d]) => {
      ec(s, h, a, d);
    });
  }), new cn(s);
}), Vx = pr, qx = Ux, Kx = Dx, Gx = JS, Jx = YS, Yx = XS, Xx = cm, Qx = um, tP = lm, eP = QS, nP = tT, iP = /* @__PURE__ */ T(or, /* @__PURE__ */ mv((t) => t.ordinal)), rP = /* @__PURE__ */ pv(iP), sP = (t) => {
  switch (t) {
    case "All":
      return Gx;
    case "Debug":
      return tP;
    case "Error":
      return Yx;
    case "Fatal":
      return Jx;
    case "Info":
      return Qx;
    case "Trace":
      return eP;
    case "None":
      return nP;
    case "Warning":
      return Xx;
  }
}, Am = (t) => t.replace(/[\s="]/g, "_"), oP = (t) => (n) => `${Am(n.label)}=${t - n.startTime}ms`, aP = Er, cP = rv;
class Nm extends cP {
}
const $h = /* @__PURE__ */ Symbol.for("effect/Readable"), uP = /* @__PURE__ */ Symbol.for("effect/Ref"), lP = {
  /* c8 ignore next */
  _A: (t) => t
};
var Ef, kf, Mf;
class hP extends (Mf = Nm, kf = uP, Ef = $h, Mf) {
  constructor(i) {
    super();
    m(this, "ref");
    m(this, kf, lP);
    m(this, Ef, $h);
    m(this, "get");
    this.ref = i, this.get = Z(() => _i(this.ref));
  }
  commit() {
    return this.get;
  }
  modify(i) {
    return Z(() => {
      const s = _i(this.ref), [a, u] = i(s);
      return s !== u && Jc(u)(this.ref), a;
    });
  }
}
const Fm = (t) => new hP(Gc(t)), fP = (t) => Z(() => Fm(t)), ir = (t) => t.get, xa = /* @__PURE__ */ y(2, (t, n) => t.modify(() => [void 0, n])), dP = /* @__PURE__ */ y(2, (t, n) => t.modify((i) => [void 0, n(i)])), Bm = "Empty", zm = "Add", $m = "Remove", Dm = "Update", Zm = "AndThen", _P = {
  _tag: Bm
}, mP = (t, n) => {
  const i = new Map(t.locals);
  let s = _P;
  for (const [a, u] of n.locals.entries()) {
    const h = ie(u)[1], d = i.get(a);
    if (d !== void 0) {
      const _ = ie(d)[1];
      G(_, h) || (s = Pa({
        _tag: Dm,
        fiberRef: a,
        patch: a.diff(_, h)
      })(s));
    } else
      s = Pa({
        _tag: zm,
        fiberRef: a,
        value: h
      })(s);
    i.delete(a);
  }
  for (const [a] of i.entries())
    s = Pa({
      _tag: $m,
      fiberRef: a
    })(s);
  return s;
}, Pa = /* @__PURE__ */ y(2, (t, n) => ({
  _tag: Zm,
  first: t,
  second: n
})), pP = /* @__PURE__ */ y(3, (t, n, i) => {
  let s = i, a = Ee(t);
  for (; fe(a); ) {
    const u = ie(a), h = ci(a);
    switch (u._tag) {
      case Bm: {
        a = h;
        break;
      }
      case zm: {
        s = tc(s, {
          fiberId: n,
          fiberRef: u.fiberRef,
          value: u.value
        }), a = h;
        break;
      }
      case $m: {
        s = Rm(s, u.fiberRef), a = h;
        break;
      }
      case Dm: {
        const d = pr(s, u.fiberRef);
        s = tc(s, {
          fiberId: n,
          fiberRef: u.fiberRef,
          value: u.fiberRef.patch(u.patch)(d)
        }), a = h;
        break;
      }
      case Zm: {
        a = Ns(u.first)(Ns(u.second)(h));
        break;
      }
    }
  }
  return s;
}), jm = "effect/MetricLabel", nc = /* @__PURE__ */ Symbol.for(jm);
var Lf;
class gP {
  constructor(n, i) {
    m(this, "key");
    m(this, "value");
    m(this, Lf, nc);
    m(this, "_hash");
    this.key = n, this.value = i, this._hash = Ct(jm + this.key + this.value);
  }
  [(Lf = nc, Q)]() {
    return this._hash;
  }
  [K](n) {
    return vP(n) && this.key === n.key && this.value === n.value;
  }
  pipe() {
    return U(this, arguments);
  }
}
const yP = (t, n) => new gP(t, n), vP = (t) => J(t, nc), bP = (t) => yt(t, (n) => !n), Dh = /* @__PURE__ */ y(3, (t, n, i) => Oi((s) => R(i, (a) => ym(t, T(s, Xn(n, a)))))), wP = Bx, SP = /* @__PURE__ */ y(2, (t, n) => An(t, {
  onFailure: (i) => {
    const s = Z_(i);
    switch (s._tag) {
      case "Left":
        return Ge(n(s.left), ae(i));
      case "Right":
        return ae(i);
    }
  },
  onSuccess: X
})), TP = (t) => {
  let n, i;
  typeof t == "function" ? n = t : (n = t.try, i = t.catch);
  const s = (a) => i ? Po(() => i(a)) : Ft(new _m(a, "An unknown error occurred in Effect.tryPromise"));
  return n.length >= 1 ? Rn((a, u) => {
    try {
      n(u).then((h) => a(X(h)), (h) => a(s(h)));
    } catch (h) {
      a(s(h));
    }
  }) : Rn((a) => {
    try {
      n().then((u) => a(X(u)), (u) => a(s(u)));
    } catch (u) {
      a(s(u));
    }
  });
}, xP = "Sequential", PP = "Parallel", EP = "ParallelN", Wm = {
  _tag: xP
}, kP = {
  _tag: PP
}, MP = (t) => ({
  _tag: EP,
  parallelism: t
}), ic = Wm, rc = kP, sc = MP, LP = mP, IP = pP, Oo = "effect/FiberStatus", Fn = /* @__PURE__ */ Symbol.for(Oo), Ks = "Done", Zh = "Running", jh = "Suspended", CP = /* @__PURE__ */ Ct(`${Oo}-${Ks}`);
var If;
class OP {
  constructor() {
    m(this, If, Fn);
    m(this, "_tag", Ks);
  }
  [(If = Fn, Q)]() {
    return CP;
  }
  [K](n) {
    return pu(n) && n._tag === Ks;
  }
}
var Cf;
class RP {
  constructor(n) {
    m(this, "runtimeFlags");
    m(this, Cf, Fn);
    m(this, "_tag", Zh);
    this.runtimeFlags = n;
  }
  [(Cf = Fn, Q)]() {
    return T(z(Oo), at(z(this._tag)), at(z(this.runtimeFlags)), Et(this));
  }
  [K](n) {
    return pu(n) && n._tag === Zh && this.runtimeFlags === n.runtimeFlags;
  }
}
var Of;
class AP {
  constructor(n, i) {
    m(this, "runtimeFlags");
    m(this, "blockingOn");
    m(this, Of, Fn);
    m(this, "_tag", jh);
    this.runtimeFlags = n, this.blockingOn = i;
  }
  [(Of = Fn, Q)]() {
    return T(z(Oo), at(z(this._tag)), at(z(this.runtimeFlags)), at(z(this.blockingOn)), Et(this));
  }
  [K](n) {
    return pu(n) && n._tag === jh && this.runtimeFlags === n.runtimeFlags && G(this.blockingOn, n.blockingOn);
  }
}
const NP = /* @__PURE__ */ new OP(), FP = (t) => new RP(t), BP = (t, n) => new AP(t, n), pu = (t) => J(t, Fn), zP = (t) => t._tag === Ks, $P = NP, Hm = FP, DP = BP, ZP = zP, jP = /* @__PURE__ */ Symbol.for("effect/Micro"), Gs = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit"), Wh = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause"), WP = {
  _E: gt
};
var Rf;
class Um extends globalThis.Error {
  constructor(i, s, a) {
    const u = `MicroCause.${i}`;
    let h, d, _;
    if (s instanceof globalThis.Error) {
      h = `(${u}) ${s.name}`, d = s.message;
      const g = d.split(`
`).length;
      _ = s.stack ? `(${u}) ${s.stack.split(`
`).slice(0, g + 3).join(`
`)}` : `${h}: ${d}`;
    } else
      h = u, d = si(s, 0), _ = `${h}: ${d}`;
    a.length > 0 && (_ += `
    ${a.join(`
    `)}`);
    super(d);
    m(this, "_tag");
    m(this, "traces");
    m(this, Rf);
    this._tag = i, this.traces = a, this[Wh] = WP, this.name = h, this.stack = _;
  }
  pipe() {
    return U(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [(Rf = Wh, kt)]() {
    return this.stack;
  }
}
class HP extends Um {
  constructor(i, s = []) {
    super("Die", i, s);
    m(this, "defect");
    this.defect = i;
  }
}
const UP = (t, n = []) => new HP(t, n);
class VP extends Um {
  constructor(n = []) {
    super("Interrupt", "interrupted", n);
  }
}
const qP = (t = []) => new VP(t), KP = (t) => t._tag === "Interrupt", Hh = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber"), GP = {
  _A: gt,
  _E: gt
};
var Af;
Af = Hh;
class JP {
  constructor(n, i = !0) {
    m(this, "context");
    m(this, "interruptible");
    m(this, Af);
    m(this, "_stack", []);
    m(this, "_observers", []);
    m(this, "_exit");
    m(this, "_children");
    m(this, "currentOpCount", 0);
    m(this, "_interrupted", !1);
    // cancel the yielded operation, or for the yielded exit value
    m(this, "_yielded");
    this.context = n, this.interruptible = i, this[Hh] = GP;
  }
  getRef(n) {
    return sb(this.context, n);
  }
  addObserver(n) {
    return this._exit ? (n(this._exit), ky) : (this._observers.push(n), () => {
      const i = this._observers.indexOf(n);
      i >= 0 && this._observers.splice(i, 1);
    });
  }
  unsafeInterrupt() {
    this._exit || (this._interrupted = !0, this.interruptible && this.evaluate(wu));
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
    if (i === ps)
      return;
    const s = Uh.interruptChildren && Uh.interruptChildren(this);
    if (s !== void 0)
      return this.evaluate(Ys(s, () => i));
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
        if (this.currentOpCount++, !i && this.getRef(Su).shouldYield(this)) {
          i = !0;
          const a = s;
          s = Ys(eE, () => a);
        }
        if (s = s[oc](this), s === ps) {
          const a = this._yielded;
          return Gs in a ? (this._yielded = void 0, a) : ps;
        }
      }
    } catch (a) {
      return J(s, oc) ? ac(a) : ac(`MicroFiber.runLoop: Not a valid effect: ${String(s)}`);
    }
  }
  getCont(n) {
    for (; ; ) {
      const i = this._stack.pop();
      if (!i) return;
      const s = i[Js] && i[Js](this);
      if (s) return {
        [n]: s
      };
      if (i[n]) return i;
    }
  }
  yieldWith(n) {
    return this._yielded = n, ps;
  }
  children() {
    return this._children ?? (this._children = /* @__PURE__ */ new Set());
  }
}
const Uh = /* @__PURE__ */ ht("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
})), Vm = /* @__PURE__ */ Symbol.for("effect/Micro/identifier"), Zt = /* @__PURE__ */ Symbol.for("effect/Micro/args"), oc = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate"), Ti = /* @__PURE__ */ Symbol.for("effect/Micro/successCont"), ii = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont"), Js = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont"), ps = /* @__PURE__ */ Symbol.for("effect/Micro/Yield"), YP = {
  _A: gt,
  _E: gt,
  _R: gt
}, XP = {
  ...aP,
  _op: "Micro",
  [jP]: YP,
  pipe() {
    return U(this, arguments);
  },
  [Symbol.iterator]() {
    return new _d(new Tr(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[Vm],
      ...Zt in this ? {
        args: this[Zt]
      } : void 0
    };
  },
  toString() {
    return Vt(this);
  },
  [kt]() {
    return Vt(this);
  }
};
function QP(t) {
  return ac("Micro.evaluate: Not implemented");
}
const Ro = (t) => ({
  ...XP,
  [Vm]: t.op,
  [oc]: t.eval ?? QP,
  [Ti]: t.contA,
  [ii]: t.contE,
  [Js]: t.ensure
}), gu = (t) => {
  const n = Ro(t);
  return function() {
    const i = Object.create(n);
    return i[Zt] = t.single === !1 ? arguments : arguments[0], i;
  };
}, qm = (t) => {
  const n = {
    ...Ro(t),
    [Gs]: Gs,
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
    [K](i) {
      return rE(i) && i._tag === t.op && G(this[Zt], i[Zt]);
    },
    [Q]() {
      return Et(this, at(Ct(t.op))(z(this[Zt])));
    }
  };
  return function(i) {
    const s = Object.create(n);
    return s[Zt] = i, s[Ti] = void 0, s[ii] = void 0, s[Js] = void 0, s;
  };
}, yu = /* @__PURE__ */ qm({
  op: "Success",
  prop: "value",
  eval(t) {
    const n = t.getCont(Ti);
    return n ? n[Ti](this[Zt], t) : t.yieldWith(this);
  }
}), Km = /* @__PURE__ */ qm({
  op: "Failure",
  prop: "cause",
  eval(t) {
    let n = t.getCont(ii);
    for (; KP(this[Zt]) && n && t.interruptible; )
      n = t.getCont(ii);
    return n ? n[ii](this[Zt], t) : t.yieldWith(this);
  }
}), tE = /* @__PURE__ */ gu({
  op: "Yield",
  eval(t) {
    let n = !1;
    return t.getRef(Su).scheduleTask(() => {
      n || t.evaluate(sE);
    }, this[Zt] ?? 0), t.yieldWith(() => {
      n = !0;
    });
  }
}), eE = /* @__PURE__ */ tE(0), nE = /* @__PURE__ */ yu(void 0), vu = /* @__PURE__ */ gu({
  op: "WithMicroFiber",
  eval(t) {
    return this[Zt](t);
  }
}), Ys = /* @__PURE__ */ y(2, (t, n) => {
  const i = Object.create(iE);
  return i[Zt] = t, i[Ti] = n, i;
}), iE = /* @__PURE__ */ Ro({
  op: "OnSuccess",
  eval(t) {
    return t._stack.push(this), this[Zt];
  }
}), rE = (t) => J(t, Gs), Gm = yu, bu = Km, wu = /* @__PURE__ */ bu(/* @__PURE__ */ qP()), ac = (t) => bu(UP(t)), sE = /* @__PURE__ */ Gm(void 0), oE = "setImmediate" in globalThis ? globalThis.setImmediate : (t) => setTimeout(t, 0);
class Jm {
  constructor() {
    m(this, "tasks", []);
    m(this, "running", !1);
    /**
     * @since 3.5.9
     */
    m(this, "afterScheduled", () => {
      this.running = !1, this.runTasks();
    });
  }
  /**
   * @since 3.5.9
   */
  scheduleTask(n, i) {
    this.tasks.push(n), this.running || (this.running = !0, oE(this.afterScheduled));
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
    return n.currentOpCount >= n.getRef(uE);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    for (; this.tasks.length > 0; )
      this.runTasks();
  }
}
const aE = /* @__PURE__ */ y(2, (t, n) => vu((i) => {
  const s = i.context;
  return i.context = n(s), fE(t, () => (i.context = s, nE));
})), cE = /* @__PURE__ */ y(2, (t, n) => aE(t, qd(n)));
class uE extends (/* @__PURE__ */ $c()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: () => 2048
})) {
}
class Su extends (/* @__PURE__ */ $c()("effect/Micro/currentScheduler", {
  defaultValue: () => new Jm()
})) {
}
const lE = /* @__PURE__ */ y(2, (t, n) => {
  const i = Object.create(hE);
  return i[Zt] = t, i[Ti] = n.onSuccess, i[ii] = n.onFailure, i;
}), hE = /* @__PURE__ */ Ro({
  op: "OnSuccessAndFailure",
  eval(t) {
    return t._stack.push(this), this[Zt];
  }
}), fE = /* @__PURE__ */ y(2, (t, n) => _E((i) => lE(i(t), {
  onFailure: (s) => Ys(n(bu(s)), () => Km(s)),
  onSuccess: (s) => Ys(n(Gm(s)), () => yu(s))
}))), Ym = /* @__PURE__ */ gu({
  op: "SetInterruptible",
  ensure(t) {
    if (t.interruptible = this[Zt], t._interrupted && t.interruptible)
      return () => wu;
  }
}), dE = (t) => vu((n) => n.interruptible ? t : (n.interruptible = !0, n._stack.push(Ym(!1)), n._interrupted ? wu : t)), _E = (t) => vu((n) => n.interruptible ? (n.interruptible = !1, n._stack.push(Ym(!0)), t(dE)) : t(gt)), mE = (t, n) => {
  const i = new JP(Su.context(new Jm()));
  return i.evaluate(t), i;
};
class pE {
  constructor() {
    /**
     * @since 2.0.0
     */
    m(this, "buckets", []);
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
class gE {
  constructor(n) {
    m(this, "maxNextTickBeforeTimer");
    /**
     * @since 2.0.0
     */
    m(this, "running", !1);
    /**
     * @since 2.0.0
     */
    m(this, "tasks", /* @__PURE__ */ new pE());
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
    return n.currentOpCount > n.getFiberRef(cT) ? n.getFiberRef(du) : !1;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(n, i) {
    this.tasks.scheduleTask(n, i), this.running || (this.running = !0, this.starve());
  }
}
const yE = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new gE(2048)), Xm = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => ce(yE)), Qm = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => ce(/* @__PURE__ */ new Map())), Vh = (t, n, i, s) => {
  switch (t) {
    case void 0:
      return n();
    case "unbounded":
      return i();
    case "inherit":
      return fu(dT, (a) => a === "unbounded" ? i() : a > 1 ? s(a) : n());
    default:
      return t > 1 ? s(t) : n();
  }
}, Tu = "InterruptSignal", xu = "Stateful", Pu = "Resume", Eu = "YieldNow", Ea = (t) => ({
  _tag: Tu,
  cause: t
}), ks = (t) => ({
  _tag: xu,
  onFiber: t
}), Jn = (t) => ({
  _tag: Pu,
  effect: t
}), vE = () => ({
  _tag: Eu
}), bE = "effect/FiberScope", Xs = /* @__PURE__ */ Symbol.for(bE);
var Nf;
Nf = Xs;
class wE {
  constructor() {
    m(this, Nf, Xs);
    m(this, "fiberId", mi);
    m(this, "roots", /* @__PURE__ */ new Set());
  }
  add(n, i) {
    this.roots.add(i), i.addObserver(() => {
      this.roots.delete(i);
    });
  }
}
var Ff;
Ff = Xs;
class SE {
  constructor(n, i) {
    m(this, "fiberId");
    m(this, "parent");
    m(this, Ff, Xs);
    this.fiberId = n, this.parent = i;
  }
  add(n, i) {
    this.parent.tell(ks((s) => {
      s.addChild(i), i.addObserver(() => {
        s.removeChild(i);
      });
    }));
  }
}
const TE = (t) => new SE(t.id(), t), ku = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new wE()), xE = "effect/Fiber", PE = /* @__PURE__ */ Symbol.for(xE), EE = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, kE = "effect/Fiber", ME = /* @__PURE__ */ Symbol.for(kE), LE = (t) => t.await, tp = (t) => lu(Q_(t.await), t.inheritAll);
({
  ...kr
});
const pn = "effect/FiberCurrent", IE = "effect/Logger", CE = /* @__PURE__ */ Symbol.for(IE), OE = {
  /* c8 ignore next */
  _Message: (t) => t,
  /* c8 ignore next */
  _Output: (t) => t
}, Mu = (t) => ({
  [CE]: OE,
  log: t,
  pipe() {
    return U(this, arguments);
  }
}), RE = /^[^\s"=]*$/, AE = (t, n) => ({
  annotations: i,
  cause: s,
  date: a,
  fiberId: u,
  logLevel: h,
  message: d,
  spans: _
}) => {
  const g = (k) => k.match(RE) ? k : t(k), S = (k, I) => `${Am(k)}=${g(I)}`, b = (k, I) => " " + S(k, I);
  let x = S("timestamp", a.toISOString());
  x += b("level", h.label), x += b("fiber", g_(u));
  const P = Pv(d);
  for (let k = 0; k < P.length; k++)
    x += b("message", si(P[k], n));
  hS(s) || (x += b("cause", Or(s, {
    renderErrorCause: !0
  })));
  for (const k of _)
    x += " " + oP(a.getTime())(k);
  for (const [k, I] of i)
    x += b(k, si(I, n));
  return x;
}, NE = (t) => `"${t.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`, FE = /* @__PURE__ */ Mu(/* @__PURE__ */ AE(NE)), BE = typeof process == "object" && process !== null && typeof process.stdout == "object" && process.stdout !== null;
BE && process.stdout.isTTY;
const ep = "effect/MetricBoundaries", cc = /* @__PURE__ */ Symbol.for(ep);
var Bf;
class zE {
  constructor(n) {
    m(this, "values");
    m(this, Bf, cc);
    m(this, "_hash");
    this.values = n, this._hash = T(Ct(ep), at(xr(this.values)));
  }
  [(Bf = cc, Q)]() {
    return this._hash;
  }
  [K](n) {
    return $E(n) && G(this.values, n.values);
  }
  pipe() {
    return U(this, arguments);
  }
}
const $E = (t) => J(t, cc), DE = (t) => {
  const n = T(t, Nd(re(Number.POSITIVE_INFINITY)), Hv);
  return new zE(n);
}, ZE = (t) => T(xv(t.count - 1, (n) => t.start * Math.pow(t.factor, n)), fo, DE), jE = "effect/MetricKeyType", np = /* @__PURE__ */ Symbol.for(jE), ip = "effect/MetricKeyType/Counter", uc = /* @__PURE__ */ Symbol.for(ip), WE = "effect/MetricKeyType/Frequency", HE = /* @__PURE__ */ Symbol.for(WE), UE = "effect/MetricKeyType/Gauge", VE = /* @__PURE__ */ Symbol.for(UE), rp = "effect/MetricKeyType/Histogram", lc = /* @__PURE__ */ Symbol.for(rp), qE = "effect/MetricKeyType/Summary", KE = /* @__PURE__ */ Symbol.for(qE), sp = {
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
};
var zf, $f;
class GE {
  constructor(n, i) {
    m(this, "incremental");
    m(this, "bigint");
    m(this, $f, sp);
    m(this, zf, uc);
    m(this, "_hash");
    this.incremental = n, this.bigint = i, this._hash = Ct(ip);
  }
  [($f = np, zf = uc, Q)]() {
    return this._hash;
  }
  [K](n) {
    return op(n);
  }
  pipe() {
    return U(this, arguments);
  }
}
var Df, Zf;
class JE {
  constructor(n) {
    m(this, "boundaries");
    m(this, Zf, sp);
    m(this, Df, lc);
    m(this, "_hash");
    this.boundaries = n, this._hash = T(Ct(rp), at(z(this.boundaries)));
  }
  [(Zf = np, Df = lc, Q)]() {
    return this._hash;
  }
  [K](n) {
    return ap(n) && G(this.boundaries, n.boundaries);
  }
  pipe() {
    return U(this, arguments);
  }
}
const YE = (t) => new GE((t == null ? void 0 : t.incremental) ?? !1, (t == null ? void 0 : t.bigint) ?? !1), XE = (t) => new JE(t), op = (t) => J(t, uc), QE = (t) => J(t, HE), tk = (t) => J(t, VE), ap = (t) => J(t, lc), ek = (t) => J(t, KE), nk = "effect/MetricKey", cp = /* @__PURE__ */ Symbol.for(nk), ik = {
  /* c8 ignore next */
  _Type: (t) => t
}, rk = /* @__PURE__ */ Fc(G);
var jf;
class Lu {
  constructor(n, i, s, a = []) {
    m(this, "name");
    m(this, "keyType");
    m(this, "description");
    m(this, "tags");
    m(this, jf, ik);
    m(this, "_hash");
    this.name = n, this.keyType = i, this.description = s, this.tags = a, this._hash = T(Ct(this.name + this.description), at(z(this.keyType)), at(xr(this.tags)));
  }
  [(jf = cp, Q)]() {
    return this._hash;
  }
  [K](n) {
    return sk(n) && this.name === n.name && G(this.keyType, n.keyType) && G(this.description, n.description) && rk(this.tags, n.tags);
  }
  pipe() {
    return U(this, arguments);
  }
}
const sk = (t) => J(t, cp), ok = (t, n) => new Lu(t, YE(n), Ac(n == null ? void 0 : n.description)), ak = (t, n, i) => new Lu(t, XE(n), Ac(i)), ck = /* @__PURE__ */ y(2, (t, n) => n.length === 0 ? t : new Lu(t.name, t.keyType, t.description, Ss(t.tags, n))), uk = "effect/MetricState", Br = /* @__PURE__ */ Symbol.for(uk), up = "effect/MetricState/Counter", hc = /* @__PURE__ */ Symbol.for(up), lp = "effect/MetricState/Frequency", fc = /* @__PURE__ */ Symbol.for(lp), hp = "effect/MetricState/Gauge", dc = /* @__PURE__ */ Symbol.for(hp), fp = "effect/MetricState/Histogram", _c = /* @__PURE__ */ Symbol.for(fp), dp = "effect/MetricState/Summary", mc = /* @__PURE__ */ Symbol.for(dp), zr = {
  /* c8 ignore next */
  _A: (t) => t
};
var Wf, Hf;
class lk {
  constructor(n) {
    m(this, "count");
    m(this, Hf, zr);
    m(this, Wf, hc);
    this.count = n;
  }
  [(Hf = Br, Wf = hc, Q)]() {
    return T(z(up), at(z(this.count)), Et(this));
  }
  [K](n) {
    return wk(n) && this.count === n.count;
  }
  pipe() {
    return U(this, arguments);
  }
}
const hk = /* @__PURE__ */ Fc(G);
var Uf, Vf;
class fk {
  constructor(n) {
    m(this, "occurrences");
    m(this, Vf, zr);
    m(this, Uf, fc);
    m(this, "_hash");
    this.occurrences = n;
  }
  [(Vf = Br, Uf = fc, Q)]() {
    return T(Ct(lp), at(xr(zt(this.occurrences.entries()))), Et(this));
  }
  [K](n) {
    return Sk(n) && hk(zt(this.occurrences.entries()), zt(n.occurrences.entries()));
  }
  pipe() {
    return U(this, arguments);
  }
}
var qf, Kf;
class dk {
  constructor(n) {
    m(this, "value");
    m(this, Kf, zr);
    m(this, qf, dc);
    this.value = n;
  }
  [(Kf = Br, qf = dc, Q)]() {
    return T(z(hp), at(z(this.value)), Et(this));
  }
  [K](n) {
    return Tk(n) && this.value === n.value;
  }
  pipe() {
    return U(this, arguments);
  }
}
var Gf, Jf;
class _k {
  constructor(n, i, s, a, u) {
    m(this, "buckets");
    m(this, "count");
    m(this, "min");
    m(this, "max");
    m(this, "sum");
    m(this, Jf, zr);
    m(this, Gf, _c);
    this.buckets = n, this.count = i, this.min = s, this.max = a, this.sum = u;
  }
  [(Jf = Br, Gf = _c, Q)]() {
    return T(z(fp), at(z(this.buckets)), at(z(this.count)), at(z(this.min)), at(z(this.max)), at(z(this.sum)), Et(this));
  }
  [K](n) {
    return xk(n) && G(this.buckets, n.buckets) && this.count === n.count && this.min === n.min && this.max === n.max && this.sum === n.sum;
  }
  pipe() {
    return U(this, arguments);
  }
}
var Yf, Xf;
class mk {
  constructor(n, i, s, a, u, h) {
    m(this, "error");
    m(this, "quantiles");
    m(this, "count");
    m(this, "min");
    m(this, "max");
    m(this, "sum");
    m(this, Xf, zr);
    m(this, Yf, mc);
    this.error = n, this.quantiles = i, this.count = s, this.min = a, this.max = u, this.sum = h;
  }
  [(Xf = Br, Yf = mc, Q)]() {
    return T(z(dp), at(z(this.error)), at(z(this.quantiles)), at(z(this.count)), at(z(this.min)), at(z(this.max)), at(z(this.sum)), Et(this));
  }
  [K](n) {
    return Pk(n) && this.error === n.error && G(this.quantiles, n.quantiles) && this.count === n.count && this.min === n.min && this.max === n.max && this.sum === n.sum;
  }
  pipe() {
    return U(this, arguments);
  }
}
const pk = (t) => new lk(t), gk = (t) => new fk(t), yk = (t) => new dk(t), vk = (t) => new _k(t.buckets, t.count, t.min, t.max, t.sum), bk = (t) => new mk(t.error, t.quantiles, t.count, t.min, t.max, t.sum), wk = (t) => J(t, hc), Sk = (t) => J(t, fc), Tk = (t) => J(t, dc), xk = (t) => J(t, _c), Pk = (t) => J(t, mc), Ek = "effect/MetricHook", kk = /* @__PURE__ */ Symbol.for(Ek), Mk = {
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
}, $r = (t) => ({
  [kk]: Mk,
  pipe() {
    return U(this, arguments);
  },
  ...t
}), qh = /* @__PURE__ */ BigInt(0), Lk = (t) => {
  let n = t.keyType.bigint ? qh : 0;
  const i = t.keyType.incremental ? t.keyType.bigint ? (a) => a >= qh : (a) => a >= 0 : (a) => !0, s = (a) => {
    i(a) && (n = n + a);
  };
  return $r({
    get: () => pk(n),
    update: s,
    modify: s
  });
}, Ik = (t) => {
  const n = /* @__PURE__ */ new Map();
  for (const s of t.keyType.preregisteredWords)
    n.set(s, 0);
  const i = (s) => {
    const a = n.get(s) ?? 0;
    n.set(s, a + 1);
  };
  return $r({
    get: () => gk(n),
    update: i,
    modify: i
  });
}, Ck = (t, n) => {
  let i = n;
  return $r({
    get: () => yk(i),
    update: (s) => {
      i = s;
    },
    modify: (s) => {
      i = i + s;
    }
  });
}, Ok = (t) => {
  const n = t.keyType.boundaries.values, i = n.length, s = new Uint32Array(i + 1), a = new Float64Array(i);
  let u = 0, h = 0, d = Number.MAX_VALUE, _ = Number.MIN_VALUE;
  T(n, Fs(or), ei((b, x) => {
    a[x] = b;
  }));
  const g = (b) => {
    let x = 0, P = i;
    for (; x !== P; ) {
      const k = Math.floor(x + (P - x) / 2), I = a[k];
      b <= I ? P = k : x = k, P === x + 1 && (b <= a[x] ? P = x : x = P);
    }
    s[x] = s[x] + 1, u = u + 1, h = h + b, b < d && (d = b), b > _ && (_ = b);
  }, S = () => {
    const b = Nc(i);
    let x = 0;
    for (let P = 0; P < i; P++) {
      const k = a[P], I = s[P];
      x = x + I, b[P] = [k, x];
    }
    return b;
  };
  return $r({
    get: () => vk({
      buckets: S(),
      count: u,
      min: d,
      max: _,
      sum: h
    }),
    update: g,
    modify: g
  });
}, Rk = (t) => {
  const {
    error: n,
    maxAge: i,
    maxSize: s,
    quantiles: a
  } = t.keyType, u = T(a, Fs(or)), h = Nc(s);
  let d = 0, _ = 0, g = 0, S = 0, b = 0;
  const x = (k) => {
    const I = [];
    let D = 0;
    for (; D !== s - 1; ) {
      const st = h[D];
      if (st != null) {
        const [it, ft] = st, wt = kn(k - it);
        Bb(wt, hi) && Fb(wt, i) && I.push(ft);
      }
      D = D + 1;
    }
    return Ak(n, u, Fs(I, or));
  }, P = (k, I) => {
    if (s > 0) {
      d = d + 1;
      const D = d % s;
      h[D] = [I, k];
    }
    S = _ === 0 ? k : Math.min(S, k), b = _ === 0 ? k : Math.max(b, k), _ = _ + 1, g = g + k;
  };
  return $r({
    get: () => bk({
      error: n,
      quantiles: x(Date.now()),
      count: _,
      min: S,
      max: b,
      sum: g
    }),
    update: ([k, I]) => P(k, I),
    modify: ([k, I]) => P(k, I)
  });
}, Ak = (t, n, i) => {
  const s = i.length;
  if (!fe(n))
    return ui();
  const a = n[0], u = n.slice(1), h = Kh(t, s, W(), 0, a, i), d = Ee(h);
  return u.forEach((_) => {
    d.push(Kh(t, s, h.value, h.consumed, _, h.rest));
  }), ei(d, (_) => [_.quantile, _.value]);
}, Kh = (t, n, i, s, a, u) => {
  let h = t, d = n, _ = i, g = s, S = a, b = u, x = t, P = n, k = i, I = s, D = a, st = u;
  for (; ; ) {
    if (!fe(b))
      return {
        quantile: S,
        value: W(),
        consumed: g,
        rest: []
      };
    if (S === 1)
      return {
        quantile: S,
        value: nt(zd(b)),
        consumed: g + b.length,
        rest: []
      };
    const it = ie(b), ft = Av(b, (ct) => ct === it), wt = S * d, qt = h / 2 * wt, Mt = g + ft[0].length, Ht = Math.abs(Mt - wt);
    if (Mt < wt - qt) {
      x = h, P = d, k = er(b), I = Mt, D = S, st = ft[1], h = x, d = P, _ = k, g = I, S = D, b = st;
      continue;
    }
    if (Mt > wt + qt) {
      const ct = Qt(_) ? nt(it) : _;
      return {
        quantile: S,
        value: ct,
        consumed: g,
        rest: b
      };
    }
    switch (_._tag) {
      case "None": {
        x = h, P = d, k = er(b), I = Mt, D = S, st = ft[1], h = x, d = P, _ = k, g = I, S = D, b = st;
        continue;
      }
      case "Some": {
        const ct = Math.abs(wt - _.value);
        if (Ht < ct) {
          x = h, P = d, k = er(b), I = Mt, D = S, st = ft[1], h = x, d = P, _ = k, g = I, S = D, b = st;
          continue;
        }
        return {
          quantile: S,
          value: nt(_.value),
          consumed: g,
          rest: b
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Nk = "effect/MetricPair", Fk = /* @__PURE__ */ Symbol.for(Nk), Bk = {
  /* c8 ignore next */
  _Type: (t) => t
}, zk = (t, n) => ({
  [Fk]: Bk,
  metricKey: t,
  metricState: n,
  pipe() {
    return U(this, arguments);
  }
}), $k = "effect/MetricRegistry", Gh = /* @__PURE__ */ Symbol.for($k);
var Qf;
Qf = Gh;
class Dk {
  constructor() {
    m(this, Qf, Gh);
    m(this, "map", /* @__PURE__ */ FT());
  }
  snapshot() {
    const n = [];
    for (const [i, s] of this.map)
      n.push(zk(i, s.get()));
    return n;
  }
  get(n) {
    const i = T(this.map, yn(n), gn);
    if (i == null) {
      if (op(n.keyType))
        return this.getCounter(n);
      if (tk(n.keyType))
        return this.getGauge(n);
      if (QE(n.keyType))
        return this.getFrequency(n);
      if (ap(n.keyType))
        return this.getHistogram(n);
      if (ek(n.keyType))
        return this.getSummary(n);
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else
      return i;
  }
  getCounter(n) {
    let i = T(this.map, yn(n), gn);
    if (i == null) {
      const s = Lk(n);
      T(this.map, Ki(n)) || T(this.map, Gi(n, s)), i = s;
    }
    return i;
  }
  getFrequency(n) {
    let i = T(this.map, yn(n), gn);
    if (i == null) {
      const s = Ik(n);
      T(this.map, Ki(n)) || T(this.map, Gi(n, s)), i = s;
    }
    return i;
  }
  getGauge(n) {
    let i = T(this.map, yn(n), gn);
    if (i == null) {
      const s = Ck(n, n.keyType.bigint ? BigInt(0) : 0);
      T(this.map, Ki(n)) || T(this.map, Gi(n, s)), i = s;
    }
    return i;
  }
  getHistogram(n) {
    let i = T(this.map, yn(n), gn);
    if (i == null) {
      const s = Ok(n);
      T(this.map, Ki(n)) || T(this.map, Gi(n, s)), i = s;
    }
    return i;
  }
  getSummary(n) {
    let i = T(this.map, yn(n), gn);
    if (i == null) {
      const s = Rk(n);
      T(this.map, Ki(n)) || T(this.map, Gi(n, s)), i = s;
    }
    return i;
  }
}
const Zk = () => new Dk(), jk = "effect/Metric", Wk = /* @__PURE__ */ Symbol.for(jk), Hk = {
  /* c8 ignore next */
  _Type: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
}, Jh = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => Zk()), _p = function(t, n, i, s) {
  const a = Object.assign((u) => im(u, (h) => Kk(a, h)), {
    [Wk]: Hk,
    keyType: t,
    unsafeUpdate: n,
    unsafeValue: i,
    unsafeModify: s,
    register() {
      return this.unsafeValue([]), this;
    },
    pipe() {
      return U(this, arguments);
    }
  });
  return a;
}, Ao = (t, n) => mp(ok(t, n)), mp = (t) => {
  let n;
  const i = /* @__PURE__ */ new WeakMap(), s = (a) => {
    if (a.length === 0)
      return n !== void 0 || (n = Jh.get(t)), n;
    let u = i.get(a);
    return u !== void 0 || (u = Jh.get(ck(t, a)), i.set(a, u)), u;
  };
  return _p(t.keyType, (a, u) => s(u).update(a), (a) => s(a).get(), (a, u) => s(u).modify(a));
}, Uk = (t, n, i) => mp(ak(t, n, i)), Vk = /* @__PURE__ */ y(3, (t, n, i) => qk(t, [yP(n, i)])), qk = /* @__PURE__ */ y(2, (t, n) => _p(t.keyType, (i, s) => t.unsafeUpdate(i, Ss(n, s)), (i) => t.unsafeValue(Ss(n, i)), (i, s) => t.unsafeModify(i, Ss(n, s)))), Kk = /* @__PURE__ */ y(2, (t, n) => fu(Xa, (i) => Z(() => t.unsafeUpdate(n, i))));
({
  ...Rc
});
const Gk = /* @__PURE__ */ y(2, (t, n) => fu(Qm, (i) => Z(() => {
  if (i.has(t)) {
    const s = i.get(t);
    s.state.completed || (s.state.completed = !0, gm(s.result, n));
  }
}))), Jk = "effect/Supervisor", No = /* @__PURE__ */ Symbol.for(Jk), Iu = {
  /* c8 ignore next */
  _T: (t) => t
};
var td;
td = No;
const $u = class $u {
  constructor(n, i) {
    m(this, "underlying");
    m(this, "value0");
    m(this, td, Iu);
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
    return new $u(this, T(this.value, yt(n)));
  }
  zip(n) {
    return new to(this, n);
  }
};
let Qs = $u;
var ed;
ed = No;
const Du = class Du {
  constructor(n, i) {
    m(this, "left");
    m(this, "right");
    m(this, "_tag", "Zip");
    m(this, ed, Iu);
    this.left = n, this.right = i;
  }
  get value() {
    return sm(this.left.value, this.right.value);
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
    return new Qs(this, T(this.value, yt(n)));
  }
  zip(n) {
    return new Du(this, n);
  }
};
let to = Du;
const pp = (t) => J(t, No) && fd(t, "Zip");
var nd;
nd = No;
class Yk {
  constructor(n) {
    m(this, "effect");
    m(this, nd, Iu);
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
    return new Qs(this, T(this.value, yt(n)));
  }
  zip(n) {
    return new to(this, n);
  }
  onRun(n, i) {
    return n();
  }
}
const Xk = (t) => new Yk(t), Fo = /* @__PURE__ */ ht("effect/Supervisor/none", () => Xk(Le)), Qk = Pi, gp = "Empty", yp = "AddSupervisor", vp = "RemoveSupervisor", bp = "AndThen", rr = {
  _tag: gp
}, Ms = (t, n) => ({
  _tag: bp,
  first: t,
  second: n
}), tM = (t, n) => eM(n, re(t)), eM = (t, n) => {
  let i = t, s = n;
  for (; Qe(s); ) {
    const a = Fe(s);
    switch (a._tag) {
      case gp: {
        s = Ke(s);
        break;
      }
      case yp: {
        i = i.zip(a.supervisor), s = Ke(s);
        break;
      }
      case vp: {
        i = pc(i, a.supervisor), s = Ke(s);
        break;
      }
      case bp: {
        s = we(a.first)(we(a.second)(Ke(s)));
        break;
      }
    }
  }
  return i;
}, pc = (t, n) => G(t, n) ? Fo : pp(t) ? pc(t.left, n).zip(pc(t.right, n)) : t, eo = (t) => G(t, Fo) ? Ln() : pp(t) ? T(eo(t.left), ur(eo(t.right))) : Kc(t), nM = (t, n) => {
  if (G(t, n))
    return rr;
  const i = eo(t), s = eo(n), a = T(s, uh(i), Ds(rr, (h, d) => Ms(h, {
    _tag: yp,
    supervisor: d
  }))), u = T(i, uh(s), Ds(rr, (h, d) => Ms(h, {
    _tag: vp,
    supervisor: d
  })));
  return Ms(a, u);
}, iM = /* @__PURE__ */ Qk({
  empty: rr,
  patch: tM,
  combine: Ms,
  diff: nM
}), rM = /* @__PURE__ */ Ao("effect_fiber_started", {
  incremental: !0
}), Yh = /* @__PURE__ */ Ao("effect_fiber_active"), sM = /* @__PURE__ */ Ao("effect_fiber_successes", {
  incremental: !0
}), oM = /* @__PURE__ */ Ao("effect_fiber_failures", {
  incremental: !0
}), aM = /* @__PURE__ */ Vk(/* @__PURE__ */ Uk("effect_fiber_lifetimes", /* @__PURE__ */ ZE({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds"), Ji = "Continue", cM = "Done", Xh = "Yield", uM = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, gs = (t) => {
  throw new Error(`BUG: FiberRuntime - ${si(t)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
}, Ue = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp"), Ve = /* @__PURE__ */ ht("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
})), Yi = {
  [Os]: (t, n, i) => Xt(() => n.effect_instruction_i1(i)),
  OnStep: (t, n, i) => Bt(Bt(i)),
  [Rs]: (t, n, i) => Xt(() => n.effect_instruction_i2(i)),
  [Cc]: (t, n, i) => (t.patchRuntimeFlags(t.currentRuntimeFlags, n.patch), rn(t.currentRuntimeFlags) && t.isInterrupted() ? bt(t.getInterruptedCause()) : Bt(i)),
  [As]: (t, n, i) => (Xt(() => n.effect_instruction_i2(i)), Xt(() => n.effect_instruction_i0()) ? (t.pushStack(n), Xt(() => n.effect_instruction_i1())) : Le),
  [tr]: (t, n, i) => {
    for (; ; ) {
      const s = Xt(() => n.effect_instruction_i0.next(i));
      if (s.done)
        return Bt(s.value);
      const a = jy(s.value);
      if (Io(a)) {
        if (a._tag === "Failure")
          return a;
      } else return t.pushStack(n), a;
      i = a.value;
    }
  }
}, lM = {
  [Tu]: (t, n, i, s) => (t.processNewInterruptSignal(s.cause), rn(n) ? bt(s.cause) : i),
  [Pu]: (t, n, i, s) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [xu]: (t, n, i, s) => (s.onFiber(t, Hm(n)), i),
  [Eu]: (t, n, i, s) => R(uu(), () => i)
}, hM = (t) => Eo(Kw(t), (n) => Pn(cS(n), ([i, s]) => {
  const a = /* @__PURE__ */ new Map(), u = [];
  for (const d of s) {
    u.push(Sn(d));
    for (const _ of d)
      a.set(_.request, _);
  }
  const h = u.flat();
  return Mo(MM(i.runAll(u), h, () => h.forEach((d) => {
    d.listeners.interrupted = !0;
  })), Qm, a);
}, !1, !1)), fM = /* @__PURE__ */ Oc();
var id, rd;
class wp extends Nm {
  constructor(i, s, a) {
    super();
    m(this, rd, EE);
    m(this, id, uM);
    m(this, "_fiberRefs");
    m(this, "_fiberId");
    m(this, "_queue", /* @__PURE__ */ new Array());
    m(this, "_children", null);
    m(this, "_observers", /* @__PURE__ */ new Array());
    m(this, "_running", !1);
    m(this, "_stack", []);
    m(this, "_asyncInterruptor", null);
    m(this, "_asyncBlockingOn", null);
    m(this, "_exitValue", null);
    m(this, "_steps", []);
    m(this, "_isYielding", !1);
    m(this, "currentRuntimeFlags");
    m(this, "currentOpCount", 0);
    m(this, "currentSupervisor");
    m(this, "currentScheduler");
    m(this, "currentTracer");
    m(this, "currentSpan");
    m(this, "currentContext");
    m(this, "currentDefaultServices");
    m(this, "run", () => {
      this.drainQueueOnCurrentThread();
    });
    if (this.currentRuntimeFlags = a, this._fiberId = i, this._fiberRefs = s, _h(a)) {
      const u = this.getFiberRef(Xa);
      rM.unsafeUpdate(1, u), Yh.unsafeUpdate(1, u);
    }
    this.refreshRefCache();
  }
  commit() {
    return tp(this);
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
    this.tell(Jn(i));
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
    return this.ask((i, s) => ZP(s) ? i.currentRuntimeFlags : s.runtimeFlags);
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return TE(this);
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
    return this.getFiberRef(ms);
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
    return Nt(() => {
      const s = kT(this._fiberId);
      return this.tell(ks((a, u) => {
        gm(s, Z(() => i(a, u)));
      })), pm(s);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(i) {
    this._queue.push(i), this._running || (this._running = !0, this.drainQueueLaterOnExecutor());
  }
  get await() {
    return Rn((i) => {
      const s = (a) => i(X(a));
      return this.tell(ks((a, u) => {
        a._exitValue !== null ? s(this._exitValue) : a.addObserver(s);
      })), Z(() => this.tell(ks((a, u) => {
        a.removeObserver(s);
      })));
    }, this.id());
  }
  get inheritAll() {
    return oe((i, s) => {
      const a = i.id(), u = i.getFiberRefs(), h = s.runtimeFlags, d = this.getFiberRefs(), _ = jx(u, a, d);
      i.setFiberRefs(_);
      const g = i.getFiberRef(rf), S = T(
        Ps(h, g),
        // Do not inherit WindDown or Interruption!
        ph(Ei),
        ph(Ja)
      );
      return VS(S);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return Z(() => Ac(this._exitValue));
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
    return Z(() => this.tell(Ea(sn(i))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(i) {
    this.tell(Ea(sn(i)));
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
    return this.setFiberRef(rf, this.currentRuntimeFlags), this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(i) {
    this._fiberRefs = Rm(this._fiberRefs, i);
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
    this._fiberRefs = tc(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef: i,
      value: s
    }), this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(qs), this.currentTracer = this.currentDefaultServices.unsafeMap.get(Lm.key), this.currentSupervisor = this.getFiberRef(kM), this.currentScheduler = this.getFiberRef(Xm), this.currentContext = this.getFiberRef(Fr), this.currentSpan = this.currentContext.unsafeMap.get(Im.key);
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
      let s = Ji;
      const a = globalThis[pn];
      globalThis[pn] = this;
      try {
        for (; s === Ji; )
          s = this._queue.length === 0 ? cM : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
      } finally {
        this._running = !1, globalThis[pn] = a;
      }
      this._queue.length > 0 && !this._running ? (this._running = !0, s === Xh ? (this.drainQueueLaterOnExecutor(), i = !1) : i = !0) : i = !1;
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
    this.currentScheduler.scheduleTask(this.run, this.getFiberRef(du));
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
      a = lM[u._tag](this, i, a, u);
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
    return !dS(this.getFiberRef(ms));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(i) {
    const s = this.getFiberRef(ms);
    this.setFiberRef(ms, be(s, i));
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
      s.tell(Ea(sn(this.id()))), i = !0;
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
      return cu({
        while: () => !s,
        body: () => {
          const u = i.next();
          return u.done ? Z(() => {
            s = !0;
          }) : Ar(u.value.await);
        },
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(i) {
    if (_h(this.currentRuntimeFlags)) {
      const s = this.getFiberRef(Xa), a = this.id().startTimeMillis, u = Date.now();
      switch (aM.unsafeUpdate(u - a, s), Yh.unsafeUpdate(-1, s), i._tag) {
        case he: {
          sM.unsafeUpdate(1, s);
          break;
        }
        case le: {
          oM.unsafeUpdate(1, s);
          break;
        }
      }
    }
    if (i._tag === "Failure") {
      const s = this.getFiberRef(mT);
      !nu(i.cause) && s._tag === "Some" && this.log("Fiber terminated with an unhandled error", i.cause, s);
    }
  }
  setExitValue(i) {
    this._exitValue = i, this.reportExitValue(i);
    for (let s = this._observers.length - 1; s >= 0; s--)
      this._observers[s](i);
    this._observers = [];
  }
  getLoggers() {
    return this.getFiberRef(gM);
  }
  log(i, s, a) {
    const u = Be(a) ? a.value : this.getFiberRef(lT), h = this.getFiberRef(dM);
    if (rP(h, u))
      return;
    const d = this.getFiberRef(hT), _ = this.getFiberRef(uT), g = this.getLoggers(), S = this.getFiberRefs();
    if (__(g) > 0) {
      const b = Ud(this.getFiberRef(qs), Co), x = new Date(b.unsafeCurrentTimeMillis());
      qy(S, () => {
        for (const P of g)
          P.log({
            fiberId: this.id(),
            logLevel: u,
            message: i,
            cause: s,
            context: S,
            spans: d,
            annotations: _,
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
      case Eu:
        return Xh;
      case Tu:
        return this.processNewInterruptSignal(i.cause), this._asyncInterruptor !== null && (this._asyncInterruptor(bt(i.cause)), this._asyncInterruptor = null), Ji;
      case Pu:
        return this._asyncInterruptor = null, this._asyncBlockingOn = null, this.evaluateEffect(i.effect), Ji;
      case xu:
        return i.onFiber(this, this._exitValue !== null ? $P : DP(this.currentRuntimeFlags, this._asyncBlockingOn)), Ji;
      default:
        return gs(i);
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
      let s = rn(this.currentRuntimeFlags) && this.isInterrupted() ? bt(this.getInterruptedCause()) : i;
      for (; s !== null; ) {
        const a = s, u = this.runLoop(a);
        if (u === Ue) {
          const h = Ve.currentOp;
          Ve.currentOp = null, h._op === ws ? Ww(this.currentRuntimeFlags) ? (this.tell(vE()), this.tell(Jn(vn)), s = null) : s = vn : h._op === Qi && (s = null);
        } else {
          this.currentRuntimeFlags = T(this.currentRuntimeFlags, Hw(Ja));
          const h = this.interruptAllChildren();
          h !== null ? s = R(h, () => u) : (this._queue.length === 0 ? this.setExitValue(u) : this.tell(Jn(u)), s = null);
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
      this.tell(Jn(i));
    else {
      this._running = !0;
      const s = globalThis[pn];
      globalThis[pn] = this;
      try {
        this.evaluateEffect(i);
      } finally {
        this._running = !1, globalThis[pn] = s, this._queue.length > 0 && this.drainQueueLaterOnExecutor();
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
    this.tell(Jn(i));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(i, s) {
    const a = Es(i, s);
    return globalThis[pn] = this, this.currentRuntimeFlags = a, a;
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
      a || (a = !0, this.tell(Jn(h)));
    };
    rn(i) && (this._asyncInterruptor = u);
    try {
      s(u);
    } catch (h) {
      u(ae(Ye(h)));
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
      if (i._op !== bs)
        return i;
      i = this.popStack();
    }
  }
  getNextFailCont() {
    let i = this.popStack();
    for (; i; ) {
      if (i._op !== Os && i._op !== As && i._op !== tr)
        return i;
      i = this.popStack();
    }
  }
  [(rd = PE, id = ME, Gy)](i) {
    return Z(() => Vd(this.currentContext, i));
  }
  Left(i) {
    return Ft(i.left);
  }
  None(i) {
    return Ft(new _u());
  }
  Right(i) {
    return Bt(i.right);
  }
  Some(i) {
    return Bt(i.value);
  }
  Micro(i) {
    return Hs((s) => {
      let a = s;
      const u = mE(cE(i, this.currentContext));
      return u.addObserver((h) => {
        if (h._tag === "Success")
          return a(Bt(h.value));
        switch (h.cause._tag) {
          case "Interrupt":
            return a(bt(sn(mi)));
          case "Fail":
            return a(Ft(h.cause.error));
          case "Die":
            return a(Us(h.cause.defect));
        }
      }), Hs((h) => {
        a = (d) => {
          h(Le);
        }, u.unsafeInterrupt();
      });
    });
  }
  [bd](i) {
    const s = Xt(() => i.effect_instruction_i0()), a = this.getNextSuccessCont();
    return a !== void 0 ? (a._op in Yi || gs(a), Yi[a._op](this, a, s)) : (Ve.currentOp = Bt(s), Ue);
  }
  [he](i) {
    const s = i, a = this.getNextSuccessCont();
    return a !== void 0 ? (a._op in Yi || gs(a), Yi[a._op](this, a, s.effect_instruction_i0)) : (Ve.currentOp = s, Ue);
  }
  [le](i) {
    const s = i.effect_instruction_i0, a = this.getNextFailCont();
    if (a !== void 0)
      switch (a._op) {
        case bs:
        case Rs:
          return rn(this.currentRuntimeFlags) && this.isInterrupted() ? bt(gh(s)) : Xt(() => a.effect_instruction_i1(s));
        case "OnStep":
          return rn(this.currentRuntimeFlags) && this.isInterrupted() ? bt(gh(s)) : Bt(bt(s));
        case Cc:
          return this.patchRuntimeFlags(this.currentRuntimeFlags, a.patch), rn(this.currentRuntimeFlags) && this.isInterrupted() ? bt(be(s, this.getInterruptedCause())) : bt(s);
        default:
          gs(a);
      }
    else
      return Ve.currentOp = bt(s), Ue;
  }
  [wd](i) {
    return Xt(() => i.effect_instruction_i0(this, Hm(this.currentRuntimeFlags)));
  }
  Blocked(i) {
    const s = this.getFiberRefs(), a = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const u = [], h = this._steps[this._steps.length - 1];
      let d = this.popStack();
      for (; d && d._op !== "OnStep"; )
        u.push(d), d = this.popStack();
      this.setFiberRefs(h.refs), this.currentRuntimeFlags = h.flags;
      const _ = LP(h.refs, s), g = Ps(h.flags, a);
      return Bt(V_(i.effect_instruction_i0, oe((S) => {
        for (; u.length > 0; )
          S.pushStack(u.pop());
        return S.setFiberRefs(IP(S.id(), S.getFiberRefs())(_)), S.currentRuntimeFlags = Es(g)(S.currentRuntimeFlags), i.effect_instruction_i1;
      })));
    }
    return ko((u) => R(Sp(RS(i.effect_instruction_i0)), () => u(i.effect_instruction_i1)));
  }
  RunBlocked(i) {
    return hM(i.effect_instruction_i0);
  }
  [Pr](i) {
    const s = i.effect_instruction_i0, a = this.currentRuntimeFlags, u = Es(a, s);
    if (rn(u) && this.isInterrupted())
      return bt(this.getInterruptedCause());
    if (this.patchRuntimeFlags(this.currentRuntimeFlags, s), i.effect_instruction_i1) {
      const h = Ps(u, a);
      return this.pushStack(new AS(h, i)), Xt(() => i.effect_instruction_i1(a));
    } else
      return vn;
  }
  [Os](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  OnStep(i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [bs](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [Rs](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [Qi](i) {
    return this._asyncBlockingOn = i.effect_instruction_i1, this.initiateAsync(this.currentRuntimeFlags, i.effect_instruction_i0), Ve.currentOp = i, Ue;
  }
  [ws](i) {
    return this._isYielding = !1, Ve.currentOp = i, Ue;
  }
  [As](i) {
    const s = i.effect_instruction_i0, a = i.effect_instruction_i1;
    return s() ? (this.pushStack(i), a()) : vn;
  }
  [tr](i) {
    return Yi[tr](this, i, void 0);
  }
  [ho](i) {
    return Xt(() => i.commit());
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(i) {
    let s = i;
    for (this.currentOpCount = 0; ; ) {
      if (this.currentRuntimeFlags & jw && this.currentSupervisor.onEffect(this, s), this._queue.length > 0 && (s = this.drainQueueWhileRunning(this.currentRuntimeFlags, s)), !this._isYielding) {
        this.currentOpCount += 1;
        const a = this.currentScheduler.shouldYield(this);
        if (a !== !1) {
          this._isYielding = !0, this.currentOpCount = 0;
          const u = s;
          s = R(uu({
            priority: a
          }), () => u);
        }
      }
      try {
        if (s = this.currentTracer.context(() => {
          if (fM !== s[Si]._V) {
            const a = this.getFiberRef(pT);
            if (a._tag === "Some") {
              const u = s[Si]._V;
              this.log(`Executing an Effect versioned ${u} with a Runtime of version ${Oc()}, you may want to dedupe the effect dependencies, you can use the language service plugin to detect this at compile time: https://github.com/Effect-TS/language-service`, vi, a);
            }
          }
          return this[s._op](s);
        }, this), s === Ue) {
          const a = Ve.currentOp;
          return a._op === ws || a._op === Qi ? Ue : (Ve.currentOp = null, a._op === he || a._op === le ? a : bt(Ye(a)));
        }
      } catch (a) {
        s !== Ue && !J(s, "_op") || !(s._op in this) ? s = zS(`Not a valid effect: ${si(s)}`) : wT(a) ? s = bt(be(Ye(a), sn(mi))) : s = Us(a);
      }
    }
  }
}
const dM = /* @__PURE__ */ ht("effect/FiberRef/currentMinimumLogLevel", () => ce(sP("Info"))), _M = (t) => Mu((n) => {
  const i = Vx(n.context, qs);
  Ud(i, Mm).unsafe.log(t.log(n));
}), mM = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => _M(FE)), pM = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => Mu(({
  annotations: t,
  cause: n,
  context: i,
  fiberId: s,
  logLevel: a,
  message: u
}) => {
  const h = Mr(pr(i, Fr), Im);
  if (h._tag === "None" || h.value._tag === "ExternalSpan")
    return;
  const d = Vd(pr(i, qs), Co), _ = {};
  for (const [g, S] of t)
    _[g] = S;
  _["effect.fiberId"] = L0(s), _["effect.logLevel"] = a.label, n !== null && n._tag !== "Empty" && (_["effect.cause"] = Or(n, {
    renderErrorCause: !0
  })), h.value.event(si(Array.isArray(u) && u.length === 1 ? u[0] : u), d.unsafeCurrentTimeNanos(), _);
})), gM = /* @__PURE__ */ ht(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => sT(Kc(mM, pM))), yM = (t) => {
  if (Array.isArray(t) || dd(t))
    return [t, W()];
  const n = Object.keys(t), i = n.length;
  return [n.map((s) => t[s]), nt((s) => {
    const a = {};
    for (let u = 0; u < i; u++)
      a[n[u]] = s[u];
    return a;
  })];
}, vM = (t, n, i) => {
  const s = [];
  for (const a of t)
    s.push(mr(a));
  return R(gr(s, gt, {
    concurrency: i == null ? void 0 : i.concurrency,
    batching: i == null ? void 0 : i.batching,
    concurrentFinalizers: i == null ? void 0 : i.concurrentFinalizers
  }), (a) => {
    const u = W(), h = a.length, d = new Array(h), _ = new Array(h);
    let g = !1;
    for (let S = 0; S < h; S++) {
      const b = a[S];
      b._tag === "Left" ? (d[S] = nt(b.left), g = !0) : (_[S] = b.right, d[S] = u);
    }
    return g ? n._tag === "Some" ? Ft(n.value(d)) : Ft(d) : i != null && i.discard ? Le : n._tag === "Some" ? X(n.value(_)) : X(_);
  });
}, bM = (t, n, i) => {
  const s = [];
  for (const a of t)
    s.push(mr(a));
  return i != null && i.discard ? gr(s, gt, {
    concurrency: i == null ? void 0 : i.concurrency,
    batching: i == null ? void 0 : i.batching,
    discard: !0,
    concurrentFinalizers: i == null ? void 0 : i.concurrentFinalizers
  }) : yt(gr(s, gt, {
    concurrency: i == null ? void 0 : i.concurrency,
    batching: i == null ? void 0 : i.batching,
    concurrentFinalizers: i == null ? void 0 : i.concurrentFinalizers
  }), (a) => n._tag === "Some" ? n.value(a) : a);
}, wM = (t, n) => {
  const [i, s] = yM(t);
  return (n == null ? void 0 : n.mode) === "validate" ? vM(i, s, n) : (n == null ? void 0 : n.mode) === "either" ? bM(i, s, n) : (n == null ? void 0 : n.discard) !== !0 && s._tag === "Some" ? yt(gr(i, gt, n), s.value) : gr(i, gt, n);
}, gr = /* @__PURE__ */ y((t) => dd(t[0]), (t, n, i) => oe((s) => {
  const a = (i == null ? void 0 : i.batching) === !0 || (i == null ? void 0 : i.batching) === "inherit" && s.getFiberRef(_T);
  return i != null && i.discard ? Vh(i.concurrency, () => Yn(ic, i == null ? void 0 : i.concurrentFinalizers)((u) => a ? Pn(t, (h, d) => u(n(h, d)), !0, !1, 1) : Eo(t, (h, d) => u(n(h, d)))), () => Yn(rc, i == null ? void 0 : i.concurrentFinalizers)((u) => Pn(t, (h, d) => u(n(h, d)), a, !1)), (u) => Yn(sc(u), i == null ? void 0 : i.concurrentFinalizers)((h) => Pn(t, (d, _) => h(n(d, _)), a, !1, u))) : Vh(i == null ? void 0 : i.concurrency, () => Yn(ic, i == null ? void 0 : i.concurrentFinalizers)((u) => a ? Qh(t, 1, (h, d) => u(n(h, d)), !0) : on(t, (h, d) => u(n(h, d)))), () => Yn(rc, i == null ? void 0 : i.concurrentFinalizers)((u) => SM(t, (h, d) => u(n(h, d)), a)), (u) => Yn(sc(u), i == null ? void 0 : i.concurrentFinalizers)((h) => Qh(t, u, (d, _) => h(n(d, _)), a)));
})), SM = (t, n, i) => Nt(() => {
  const s = zt(t), a = new Array(s.length);
  return Ge(Pn(s, (h, d) => R(n(h, d), (_) => Z(() => a[d] = _)), i, !1), X(a));
}), Pn = (t, n, i, s, a) => ko((u) => US((h) => oe((d) => {
  let _ = Array.from(t).reverse(), g = _.length;
  if (g === 0)
    return Le;
  let S = 0, b = !1;
  const x = a ? Math.min(_.length, a) : _.length, P = /* @__PURE__ */ new Set(), k = new Array(), I = () => P.forEach((ct) => {
    ct.currentScheduler.scheduleTask(() => {
      ct.unsafeInterruptAsFork(d.id());
    }, 0);
  }), D = new Array(), st = new Array(), it = new Array(), ft = () => {
    const ct = k.filter(({
      exit: St
    }) => St._tag === "Failure").sort((St, $t) => St.index < $t.index ? -1 : St.index === $t.index ? 0 : 1).map(({
      exit: St
    }) => St);
    return ct.length === 0 && ct.push(vn), ct;
  }, wt = (ct, St = !1) => {
    const $t = rm(h(ct)), Y = xM($t, d, d.currentRuntimeFlags, ku);
    return d.currentScheduler.scheduleTask(() => {
      St && Y.unsafeInterruptAsFork(d.id()), Y.resume($t);
    }, 0), Y;
  }, qt = () => {
    s || (g -= _.length, _ = []), b = !0, I();
  }, Mt = i ? ZS : Y_, Ht = wt(Rn((ct) => {
    const St = (Y, dt) => {
      Y._op === "Blocked" ? it.push(Y) : (k.push({
        index: dt,
        exit: Y
      }), Y._op === "Failure" && !b && qt());
    }, $t = () => {
      if (_.length > 0) {
        const Y = _.pop();
        let dt = S++;
        const Ie = () => {
          const vt = _.pop();
          return dt = S++, R(uu(), () => R(Mt(u(n(vt, dt))), H));
        }, H = (vt) => _.length > 0 && (St(vt, dt), _.length > 0) ? Ie() : X(vt), Tt = R(Mt(u(n(Y, dt))), H), tt = wt(Tt);
        D.push(tt), P.add(tt), b && tt.currentScheduler.scheduleTask(() => {
          tt.unsafeInterruptAsFork(d.id());
        }, 0), tt.addObserver((vt) => {
          let B;
          if (vt._op === "Failure" ? B = vt : B = vt.effect_instruction_i0, st.push(tt), P.delete(tt), St(B, dt), k.length === g)
            ct(X(Xe(Ph(ft(), {
              parallel: !0
            }), () => vn)));
          else if (it.length + k.length === g) {
            const $e = ft(), A = it.map((F) => F.effect_instruction_i0).reduce(N_);
            ct(X(V_(A, Pn([Xe(Ph($e, {
              parallel: !0
            }), () => vn), ...it.map((F) => F.effect_instruction_i1)], (F) => F, i, !0, a))));
          } else
            $t();
        });
      }
    };
    for (let Y = 0; Y < x; Y++)
      $t();
  }));
  return Ar(au(Q_(u(tp(Ht))), mm({
    onFailure: (ct) => {
      qt();
      const St = it.length + 1, $t = Math.min(typeof a == "number" ? a : it.length, it.length), Y = Array.from(it);
      return Rn((dt) => {
        let Ie = 0, H = 0;
        const Tt = (vt, B) => ($e) => {
          Ie++, Ie === St && dt(Bt(bt(ct))), Y.length > 0 && B && tt();
        }, tt = () => {
          wt(Y.pop(), !0).addObserver(Tt(H, !0)), H++;
        };
        Ht.addObserver(Tt(H, !1)), H++;
        for (let vt = 0; vt < $t; vt++)
          tt();
      });
    },
    onSuccess: () => on(st, (ct) => ct.inheritAll)
  })));
}))), Qh = (t, n, i, s) => Nt(() => {
  const a = zt(t), u = new Array(a.length);
  return Ge(Pn(a, (d, _) => yt(i(d, _), (g) => u[_] = g), s, !1, n), X(u));
}), Sp = (t) => PM(t, ku), TM = (t, n, i, s = null) => {
  const a = Tp(t, n, i, s);
  return a.resume(t), a;
}, xM = (t, n, i, s = null) => Tp(t, n, i, s), Tp = (t, n, i, s = null) => {
  const a = y_(), u = n.getFiberRefs(), h = Wx(u, a), d = new wp(a, h, i), _ = pr(h, Fr), g = d.currentSupervisor;
  return g.onStart(_, t, nt(n), d), d.addObserver((b) => g.onEnd(b, d)), (s !== null ? s : T(n.getFiberRef(Qa), Xe(() => n.scope()))).add(i, d), d;
}, PM = (t, n) => oe((i, s) => X(TM(t, i, s.runtimeFlags, n))), tf = (t) => Oi((n) => un(Mr(n, Dr), {
  onNone: () => t,
  onSome: (i) => {
    switch (i.strategy._tag) {
      case "Parallel":
        return t;
      case "Sequential":
      case "ParallelN":
        return R(Lo(i, rc), (s) => Cu(t, s));
    }
  }
})), ef = (t) => (n) => Oi((i) => un(Mr(i, Dr), {
  onNone: () => n,
  onSome: (s) => s.strategy._tag === "ParallelN" && s.strategy.parallelism === t ? n : R(Lo(s, sc(t)), (a) => Cu(n, a))
})), Yn = (t, n) => (i) => Oi((s) => un(Mr(s, Dr), {
  onNone: () => i(gt),
  onSome: (a) => {
    if (n === !0) {
      const u = t._tag === "Parallel" ? tf : t._tag === "Sequential" ? nf : ef(t.parallelism);
      switch (a.strategy._tag) {
        case "Parallel":
          return u(i(tf));
        case "Sequential":
          return u(i(nf));
        case "ParallelN":
          return u(i(ef(a.strategy.parallelism)));
      }
    } else
      return i(gt);
  }
})), nf = (t) => Oi((n) => un(Mr(n, Dr), {
  onNone: () => t,
  onSome: (i) => {
    switch (i.strategy._tag) {
      case "Sequential":
        return t;
      case "Parallel":
      case "ParallelN":
        return R(Lo(i, ic), (s) => Cu(t, s));
    }
  }
})), Dr = /* @__PURE__ */ Bn("effect/Scope"), Cu = /* @__PURE__ */ y(2, (t, n) => CT(
  t,
  // @ts-expect-error
  qd(ub(Dr, n))
)), EM = (t) => Ci(t, {
  differ: iM,
  fork: rr
}), rf = /* @__PURE__ */ aT(Uw), kM = /* @__PURE__ */ EM(Fo), MM = (t, n, i) => X_((s) => R(R(Sp(tm(t)), (a) => Rn((u) => {
  const h = n.map((g) => g.listeners.count), d = () => {
    h.every((g) => g === 0) && n.every((g) => g.result.state.current._tag === "Pending" ? !0 : !!(g.result.state.current._tag === "Done" && Io(g.result.state.current.effect) && g.result.state.current.effect._tag === "Failure" && D_(g.result.state.current.effect.cause))) && (_.forEach((g) => g()), i == null || i(), u(om(a)));
  };
  a.addObserver((g) => {
    _.forEach((S) => S()), u(g);
  });
  const _ = n.map((g, S) => {
    const b = (x) => {
      h[S] = x, d();
    };
    return g.listeners.addObserver(b), () => g.listeners.removeObserver(b);
  });
  return d(), Z(() => {
    _.forEach((g) => g());
  });
})), () => Nt(() => {
  const a = n.flatMap((u) => u.state.completed ? [] : [u]);
  return Eo(a, (u) => Gk(u.request, xT(s)));
}))), LM = "effect/ScheduleInterval", no = /* @__PURE__ */ Symbol.for(LM), xp = {
  [no]: no,
  startMillis: 0,
  endMillis: 0
}, Ou = (t, n) => t > n ? xp : {
  [no]: no,
  startMillis: t,
  endMillis: n
}, IM = /* @__PURE__ */ y(2, (t, n) => CM(t, n) === t), CM = /* @__PURE__ */ y(2, (t, n) => t.endMillis <= n.startMillis ? t : n.endMillis <= t.startMillis ? n : t.startMillis < n.startMillis ? t : n.startMillis < t.startMillis ? n : t.endMillis <= n.endMillis ? t : n), OM = (t) => t.startMillis >= t.endMillis, RM = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.max(t.startMillis, n.startMillis), s = Math.min(t.endMillis, n.endMillis);
  return Ou(i, s);
}), AM = (t) => kn(t.endMillis - t.startMillis), NM = (t) => Ou(t, Number.POSITIVE_INFINITY), sf = Ou, Pp = xp, FM = IM, BM = OM, zM = RM, $M = AM, DM = NM, ZM = "effect/ScheduleIntervals", of = /* @__PURE__ */ Symbol.for(ZM), Ep = (t) => ({
  [of]: of,
  intervals: t
}), jM = /* @__PURE__ */ y(2, (t, n) => WM(t.intervals, n.intervals, ze())), WM = (t, n, i) => {
  let s = t, a = n, u = i;
  for (; Qe(s) && Qe(a); ) {
    const h = T(Fe(s), zM(Fe(a))), d = BM(h) ? u : T(u, we(h));
    T(Fe(s), FM(Fe(a))) ? s = Ke(s) : a = Ke(a), u = d;
  }
  return Ep(En(u));
}, gc = (t) => T(t.intervals, Xd, Xe(() => Pp)).startMillis, HM = (t) => T(t.intervals, Xd, Xe(() => Pp)).endMillis, UM = /* @__PURE__ */ y(2, (t, n) => gc(t) < gc(n)), VM = (t) => Qe(t.intervals), qM = Ep, KM = jM, yc = gc, vc = HM, GM = UM, JM = VM, Ru = "Continue", kp = "Done", YM = (t) => ({
  _tag: Ru,
  intervals: t
}), XM = (t) => ({
  _tag: Ru,
  intervals: qM(re(t))
}), QM = {
  _tag: kp
}, t1 = (t) => t._tag === Ru, e1 = (t) => t._tag === kp, n1 = YM, Mp = XM, yr = QM, af = t1, vr = e1, i1 = yT, r1 = Lo, s1 = LE, cf = om, Au = (t) => function() {
  if (arguments.length === 1) {
    const n = arguments[0];
    return (i, ...s) => t(n, i, ...s);
  }
  return t.apply(this, arguments);
}, Lp = /* @__PURE__ */ Au((t, n, i) => {
  const s = y_(), a = [[Fr, [[s, t.context]]]];
  i != null && i.scheduler && a.push([Xm, [[s, i.scheduler]]]);
  let u = qx(t.fiberRefs, {
    entries: a,
    forkAs: s
  });
  i != null && i.updateRefs && (u = i.updateRefs(u, s));
  const h = new wp(s, u, t.runtimeFlags);
  let d = n;
  i != null && i.scope && (d = R(r1(i.scope, Wm), (g) => Ge(gT(g, X_((S) => G(S, h.id()) ? Le : am(h, S))), au(n, (S) => i1(g, S)))));
  const _ = h.currentSupervisor;
  return _ !== Fo && (_.onStart(t.context, d, W(), h), h.addObserver((g) => _.onEnd(g, h))), ku.add(t.runtimeFlags, h), (i == null ? void 0 : i.immediate) === !1 ? h.resume(d) : h.start(d), h;
}), ka = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure"), ys = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var sd, od;
class o1 extends Error {
  constructor(i) {
    const s = H_(i)[0];
    super((s == null ? void 0 : s.message) || "An error has occurred");
    m(this, od);
    m(this, sd);
    this[ka] = ka, this[ys] = i, this.name = s ? `(FiberFailure) ${s.name}` : "FiberFailure", s != null && s.stack && (this.stack = s.stack);
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[ys].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + Or(this[ys], {
      renderErrorCause: !0
    });
  }
  [(od = ka, sd = ys, kt)]() {
    return this.toString();
  }
}
const a1 = (t) => {
  const n = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const i = new o1(t);
  return Error.stackTraceLimit = n, i;
}, c1 = (t) => {
  const n = t;
  switch (n._op) {
    case "Failure":
    case "Success":
      return n;
    case "Left":
      return Eh(n.left);
    case "Right":
      return Bt(n.right);
    case "Some":
      return Bt(n.value);
    case "None":
      return Eh(new _u());
  }
}, u1 = /* @__PURE__ */ Au((t, n, i) => l1(t, n, i).then((s) => {
  switch (s._tag) {
    case he:
      return s.effect_instruction_i0;
    case le:
      throw a1(s.effect_instruction_i0);
  }
})), l1 = /* @__PURE__ */ Au((t, n, i) => new Promise((s) => {
  const a = c1(n);
  a && s(a);
  const u = Lp(t)(n);
  u.addObserver((h) => {
    s(h);
  }), (i == null ? void 0 : i.signal) !== void 0 && (i.signal.aborted ? u.unsafeInterruptAsFork(u.id()) : i.signal.addEventListener("abort", () => {
    u.unsafeInterruptAsFork(u.id());
  }, {
    once: !0
  }));
}));
class h1 {
  constructor(n, i, s) {
    m(this, "context");
    m(this, "runtimeFlags");
    m(this, "fiberRefs");
    this.context = n, this.runtimeFlags = i, this.fiberRefs = s;
  }
  pipe() {
    return U(this, arguments);
  }
}
const f1 = (t) => new h1(t.context, t.runtimeFlags, t.fiberRefs), d1 = /* @__PURE__ */ R_(Ei, C_, I_), Ip = /* @__PURE__ */ f1({
  context: /* @__PURE__ */ zc(),
  runtimeFlags: d1,
  fiberRefs: /* @__PURE__ */ Kx()
}), _1 = /* @__PURE__ */ Lp(Ip), m1 = /* @__PURE__ */ u1(Ip), p1 = "effect/Schedule", Cp = /* @__PURE__ */ Symbol.for(p1), g1 = (t) => J(t, Cp), y1 = "effect/ScheduleDriver", v1 = /* @__PURE__ */ Symbol.for(y1), bc = {
  start: 0,
  now: 0,
  input: void 0,
  output: void 0,
  elapsed: hi,
  elapsedSincePrevious: hi,
  recurrence: 0
}, uf = /* @__PURE__ */ $c()("effect/Schedule/CurrentIterationMetadata", {
  defaultValue: () => bc
}), b1 = {
  /* c8 ignore next */
  _Out: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
}, w1 = {
  /* c8 ignore next */
  _Out: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
};
var ad;
ad = Cp;
class S1 {
  constructor(n, i) {
    m(this, "initial");
    m(this, "step");
    m(this, ad, b1);
    this.initial = n, this.step = i;
  }
  pipe() {
    return U(this, arguments);
  }
}
const lf = (t, n, i, s) => dP(t, (a) => a.recurrence === 0 ? {
  now: n,
  input: i,
  output: s,
  recurrence: a.recurrence + 1,
  elapsed: hi,
  elapsedSincePrevious: hi,
  start: n
} : {
  now: n,
  input: i,
  output: s,
  recurrence: a.recurrence + 1,
  elapsed: kn(n - a.start),
  elapsedSincePrevious: kn(n - a.now),
  start: a.start
});
var cd;
cd = v1;
class T1 {
  constructor(n, i) {
    m(this, "schedule");
    m(this, "ref");
    m(this, cd, w1);
    m(this, "iterationMeta", /* @__PURE__ */ Fm(bc));
    this.schedule = n, this.ref = i;
  }
  get state() {
    return yt(ir(this.ref), (n) => n[1]);
  }
  get last() {
    return R(ir(this.ref), ([n, i]) => {
      switch (n._tag) {
        case "None":
          return Po(() => new _u());
        case "Some":
          return X(n.value);
      }
    });
  }
  get reset() {
    return xa(this.ref, [W(), this.schedule.initial]).pipe(lu(xa(this.iterationMeta, bc)));
  }
  next(n) {
    return T(yt(ir(this.ref), (i) => i[1]), R((i) => T(zx, R((s) => T(Nt(() => this.schedule.step(s, n, i)), R(([a, u, h]) => {
      const d = xa(this.ref, [nt(u), a]);
      if (vr(h))
        return d.pipe(Ge(Ft(W())));
      const _ = yc(h.intervals) - s;
      if (_ <= 0)
        return d.pipe(Ge(lf(this.iterationMeta, s, n, u)), On(u));
      const g = kn(_);
      return T(d, Ge(lf(this.iterationMeta, s, n, u)), Ge(wP(g)), On(u));
    }))))));
  }
}
const Zr = (t, n) => new S1(t, n), x1 = /* @__PURE__ */ y(2, (t, n) => P1(t, (i) => Z(() => n(i)))), P1 = /* @__PURE__ */ y(2, (t, n) => R1(t, (i, s) => yt(n(i), (a) => Nb(s, de(a))))), E1 = /* @__PURE__ */ y(2, (t, n) => Nu(t, (i, s) => Z(() => n(i, s)))), Nu = /* @__PURE__ */ y(2, (t, n) => Zr(t.initial, (i, s, a) => R(t.step(i, s, a), ([u, h, d]) => vr(d) ? X([u, h, yr]) : yt(n(s, h), (_) => _ ? [u, h, d] : [u, h, yr])))), k1 = (t) => x1(t, (n) => n), M1 = (t) => T(fP([W(), t.initial]), yt((n) => new T1(t, n))), L1 = (t, n = 2) => {
  const i = de(t);
  return k1(C1(Fu, (s) => Ab(i, Math.pow(n, s))));
}, Op = /* @__PURE__ */ y(2, (t, n) => I1(t, n, KM)), I1 = /* @__PURE__ */ y(3, (t, n, i) => Zr([t.initial, n.initial], (s, a, u) => T(GS(t.step(s, a, u[0]), n.step(s, a, u[1]), (h, d) => [h, d]), R(([[h, d, _], [g, S, b]]) => af(_) && af(b) ? wc(t, n, a, h, d, _.intervals, g, S, b.intervals, i) : X([[h, g], [d, S], yr]))))), wc = (t, n, i, s, a, u, h, d, _, g) => {
  const S = g(u, _);
  return JM(S) ? X([[s, h], [a, d], n1(S)]) : T(u, GM(_)) ? R(t.step(vc(u), i, s), ([b, x, P]) => vr(P) ? X([[b, h], [x, d], yr]) : wc(t, n, i, b, x, P.intervals, h, d, _, g)) : R(n.step(vc(_), i, h), ([b, x, P]) => vr(P) ? X([[s, b], [a, x], yr]) : wc(t, n, i, s, a, u, b, x, P.intervals, g));
}, C1 = /* @__PURE__ */ y(2, (t, n) => O1(t, (i) => Z(() => n(i)))), O1 = /* @__PURE__ */ y(2, (t, n) => Zr(t.initial, (i, s, a) => R(t.step(i, s, a), ([u, h, d]) => yt(n(h), (_) => [u, _, d])))), R1 = /* @__PURE__ */ y(2, (t, n) => Zr(t.initial, (i, s, a) => R(t.step(i, s, a), ([u, h, d]) => {
  if (vr(d))
    return X([u, h, d]);
  const _ = d.intervals, g = $M(sf(i, yc(_)));
  return yt(n(h, g), (S) => {
    const b = de(S), x = yc(_), P = i + zs(b), k = P - x, I = Math.max(0, vc(_) + k), D = sf(P, I);
    return [u, h, Mp(D)];
  });
}))), Rp = (t) => B1(Fu, (n) => n < t), A1 = (t, n) => Zr(t, (i, s, a) => Z(() => [n(a), a, Mp(DM(i))])), N1 = /* @__PURE__ */ y(2, (t, n) => Nu(t, (i, s) => bP(n(i)))), F1 = /* @__PURE__ */ y(2, (t, n) => Nu(t, (i, s) => n(i))), B1 = /* @__PURE__ */ y(2, (t, n) => E1(t, (i, s) => n(s))), Ls = /* @__PURE__ */ Symbol.for("effect/Schedule/ScheduleDefect");
var ud;
ud = Ls;
class z1 {
  constructor(n) {
    m(this, "error");
    m(this, ud);
    this.error = n, this[Ls] = Ls;
  }
}
const $1 = (t) => J(t, Ls), hf = (t) => _r(t, (n) => Us(new z1(n))), D1 = (t) => un(iu(t, (n) => fS(n) && $1(n.defect) ? nt(n.defect) : W()), {
  onNone: () => t,
  onSome: (n) => dr(n.error)
}), Z1 = (t) => BS(t, (n) => ae(D1(n))), ff = /* @__PURE__ */ y(2, (t, n) => H1(t, n, (i, s) => Ft(i))), j1 = /* @__PURE__ */ y(2, (t, n) => g1(n) ? ff(t, n) : Z1(ff(t, W1(n)))), W1 = (t) => {
  const n = t.schedule ?? Fu, i = t.while ? F1(n, (a) => {
    const u = t.while(a);
    return typeof u == "boolean" ? X(u) : hf(u);
  }) : n, s = t.until ? N1(i, (a) => {
    const u = t.until(a);
    return typeof u == "boolean" ? X(u) : hf(u);
  }) : i;
  return t.times ? Op(s, Rp(t.times)) : s;
}, H1 = /* @__PURE__ */ y(3, (t, n, i) => R(M1(n), (s) => Ap(Dh(t, uf, ir(s.iterationMeta)), s, (a, u) => Dh(i(a, u), uf, ir(s.iterationMeta))))), Ap = (t, n, i) => _r(t, (s) => Nr(n.next(s), {
  onFailure: () => T(n.last, WS, R((a) => i(s, a))),
  onSuccess: () => Ap(t, n, i)
})), Fu = /* @__PURE__ */ A1(0, (t) => t + 1), U1 = wM, V1 = Ft, q1 = KS, Np = X, io = Z, Fp = _r, K1 = j1, G1 = TP, Sc = yt, Bp = im, zp = SP, Ma = _1, J1 = m1, Y1 = L1, X1 = Op, Q1 = Rp, tL = [
  "https://overpass-api.de/api/interpreter",
  // Main instance (Germany)
  "https://overpass.private.coffee/api/interpreter",
  // No rate limit (Global)
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  // VK Maps (Russia) - no rate limit
  "https://overpass.osm.jp/api/interpreter"
  // Japan instance (Global)
], tn = {
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
class Tc {
  constructor(n, i) {
    m(this, "_tag", "OverpassApiError");
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
class $p {
  constructor(n) {
    m(this, "_tag", "NetworkError");
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
function eL(t, n) {
  if (t.length <= 2) return t;
  const i = [t[0]];
  let s = 0;
  for (let a = 1; a < t.length; a++) {
    const [u, h] = t[a - 1], [d, _] = t[a];
    s += sr(h, u, _, d), s >= n && (i.push(t[a]), s = 0);
  }
  return i[i.length - 1] !== t[t.length - 1] && i.push(t[t.length - 1]), i;
}
function nL(t) {
  if (t.length <= 2) return [t];
  const n = [];
  let i = [t[0]], s = 0;
  for (let a = 1; a < t.length; a++) {
    const [u, h] = t[a - 1], [d, _] = t[a], g = sr(h, u, _, d);
    i.push(t[a]), s += g, s >= tn.CHUNK_DISTANCE_METERS && a < t.length - 1 && (n.push(i), i = [t[a]], s = 0);
  }
  return i.length > 0 && n.push(i), n;
}
function iL(t, n, i) {
  let s = 0, a = 1 / 0, u = 0, h = 0;
  for (let d = 0; d < i.length; d++) {
    const [_, g] = i[d], S = sr(t, n, g, _);
    if (S < a && (a = S, s = d, u = h), d > 0) {
      const [b, x] = i[d - 1];
      h += sr(x, b, g, _);
    }
  }
  return { closestIndex: s, distance: a, distanceFromStart: u };
}
function rL(t) {
  const n = [...t].sort((s, a) => s.distanceFromStart - a.distanceFromStart), i = [];
  for (const s of n) {
    const a = i[i.length - 1];
    (!a || s.distanceFromStart - a.distanceFromStart >= tn.MIN_DISTANCE_BETWEEN_LIGHTS) && i.push(s);
  }
  return i;
}
function sL(t) {
  const i = eL(t, tn.SAMPLE_INTERVAL_METERS).map(([s, a]) => `${a},${s}`).join(",");
  return `
    [out:json][timeout:30];
    (
      node["highway"="traffic_signals"](around:${tn.BUFFER_METERS},${i});
    );
    out body;
  `;
}
function oL(t, n) {
  return G1({
    try: async () => {
      const i = new AbortController(), s = setTimeout(() => i.abort(), tn.REQUEST_TIMEOUT_MS);
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
          throw new Tc(
            `${t}: ${a.statusText}`,
            a.status
          );
        return await a.json();
      } finally {
        clearTimeout(s);
      }
    },
    catch: (i) => i instanceof Tc ? i : new $p(i)
  });
}
const aL = T(
  Y1(tn.INITIAL_RETRY_DELAY_MS),
  X1(Q1(tn.MAX_RETRIES_PER_ENDPOINT))
);
function cL(t, n) {
  return T(
    oL(t, n),
    // Only retry if the error is retryable (5xx, network errors)
    // Immediately fail (and thus failover) on 429 and other 4xx
    K1({
      schedule: aL,
      while: (i) => i.isRetryable
    }),
    zp(
      (i) => io(() => {
        i.shouldFailover ? console.warn(
          `Endpoint ${t} returned ${i instanceof Tc ? i.statusCode : "error"}, immediately trying next...`
        ) : console.warn(`Endpoint ${t} failed after retries, trying next...`);
      })
    )
  );
}
function uL(t) {
  return tL.reduce(
    (i, s) => T(
      i,
      Fp(() => cL(s, t))
    ),
    // Start with a failing effect to kick off the chain
    V1(new $p("No endpoints configured"))
  );
}
function lL(t, n) {
  return t.elements.filter((i) => i.type === "node").map((i) => {
    const { closestIndex: s, distance: a, distanceFromStart: u } = iL(
      i.lat,
      i.lon,
      n
    );
    return a > tn.BUFFER_METERS ? null : {
      id: i.id,
      lat: i.lat,
      lng: i.lon,
      routeIndex: s,
      distanceFromStart: u
    };
  }).filter((i) => i !== null);
}
function hL(t, n) {
  const i = sL(t);
  return T(
    uL(i),
    Sc((s) => lL(s, n))
  );
}
function fL(t, n, i) {
  return T(
    hL(t, n),
    Bp(
      () => io(() => {
        console.log(`Chunk ${i} completed successfully`);
      })
    ),
    zp(
      (s) => io(() => {
        console.warn(`Chunk ${i} failed on all endpoints:`, s);
      })
    ),
    // If all endpoints fail, return empty array for this chunk
    Fp(() => Np([]))
  );
}
function dL(t) {
  if (t.length === 0)
    return Np([]);
  const n = nL(t), i = n.map(
    (s, a) => fL(s, t, a)
  );
  return T(
    // Run chunks with controlled concurrency
    U1(i, { concurrency: tn.MAX_CONCURRENT_REQUESTS }),
    // Flatten results from all chunks
    Sc((s) => s.flat()),
    // Deduplicate (chunks may have overlapping results)
    Sc(rL),
    Bp(
      (s) => io(() => {
        console.log(
          `Fetched ${s.length} traffic lights from ${n.length} chunks`
        );
      })
    )
  );
}
function _L(t) {
  const [n, i] = Gt([]), [s, a] = Gt(!1), [u, h] = Gt(null), d = Pt(""), _ = Pt([]), g = Pt(null), S = t.length > 0 ? `${t.length}-${t[0][0]},${t[0][1]}-${t[t.length - 1][0]},${t[t.length - 1][1]}` : "";
  return Jt(() => {
    if (t.length === 0) {
      i([]), d.current = "";
      return;
    }
    if (S === d.current)
      return;
    d.current = S, _.current = t, g.current && (Ma(cf(g.current)), g.current = null), a(!0), h(null);
    const b = q1(function* () {
      return yield* dL(_.current);
    }), x = Ma(b);
    return g.current = x, J1(s1(x)).then((P) => {
      g.current === x && (OT(P) ? i(P.value) : RT(P) ? console.log("Traffic light request was interrupted") : (console.warn("Traffic light fetch failed:", P.cause), i([])), a(!1));
    }), () => {
      g.current && (Ma(cf(g.current)), g.current = null);
    };
  }, [t, S]), {
    trafficLights: n,
    isLoading: s,
    error: u
  };
}
const ve = {
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
};
function La(t, n, i) {
  let s = 0;
  for (let D = 1; D < i.length; D++) {
    if (i[D] >= n) {
      s = D - 1;
      break;
    }
    s = D - 1;
  }
  if (s >= t.length - 1) {
    const [D, st] = t[t.length - 1], it = t[t.length - 2] || t[t.length - 1];
    return {
      lat: st,
      lng: D,
      bearing: df(it[1], it[0], st, D),
      segmentIndex: t.length - 1
    };
  }
  const a = i[s], h = i[s + 1] - a, d = n - a, _ = h > 0 ? Math.min(1, d / h) : 0, [g, S] = t[s], [b, x] = t[s + 1], P = S + _ * (x - S), k = g + _ * (b - g), I = df(S, g, x, b);
  return { lat: P, lng: k, bearing: I, segmentIndex: s };
}
function df(t, n, i, s) {
  const a = t * Math.PI / 180, u = i * Math.PI / 180, h = (s - n) * Math.PI / 180, d = Math.sin(h) * Math.cos(u), _ = Math.cos(a) * Math.sin(u) - Math.sin(a) * Math.cos(u) * Math.cos(h);
  return (Math.atan2(d, _) * 180 / Math.PI + 360) % 360;
}
function mL(t, n, i, s) {
  const { MAX_SPEED_MS: a, ACCELERATION_RATE: u, DECELERATION_RATE: h, ACCELERATION_TIME: d, BRAKING_TIME: _ } = ve, g = 0.5 * u * d * d, S = 0.5 * h * _ * _, b = n - t;
  return i && t < g ? Math.sqrt(2 * u * t) : s && b < S ? Math.sqrt(2 * h * b) : a;
}
function _f(t, n) {
  return t + Math.random() * (n - t);
}
function pL({
  coordinates: t,
  cumulativeDistances: n,
  trafficLights: i,
  totalDistance: s,
  simulationSpeed: a,
  minWaitTime: u,
  maxWaitTime: h
}) {
  const [d, _] = Gt({
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
  }), [g, S] = Gt(null), b = Pt(null), x = Pt(0), P = Pt(0), k = Pt(0), I = Pt(!1), D = Pt(!0), st = Pt([]), it = Pt(t), ft = Pt(n), wt = Pt(i), qt = Pt(s), Mt = Pt(a), Ht = Pt(u);
  Jt(() => {
    it.current = t, ft.current = n, wt.current = i, qt.current = s, Mt.current = a, Ht.current = u;
  }, [t, n, i, s, a, u]);
  const ct = t.length > 0 && n.length > 0, St = Pt("");
  Jt(() => {
    st.current = i.map(
      () => _f(u, h)
    );
  }, [i, u, h]);
  const $t = Qn(() => {
    b.current && (cancelAnimationFrame(b.current), b.current = null), st.current = wt.current.map(
      () => _f(Ht.current, h)
    );
    const H = it.current, Tt = H.length > 0 ? { lat: H[0][1], lng: H[0][0], bearing: 0, segmentIndex: 0 } : null;
    S(Tt), k.current = 0, I.current = !1, D.current = !0, x.current = 0, _({
      status: "ready",
      currentPosition: Tt ? [Tt.lat, Tt.lng] : [0, 0],
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
  }, [h]);
  Jt(() => {
    if (!ct) {
      _((tt) => ({ ...tt, status: "idle" }));
      return;
    }
    const H = t, Tt = H.length > 0 ? `${H[0][0]},${H[0][1]}-${H[H.length - 1][0]},${H[H.length - 1][1]}` : "";
    Tt !== St.current && (St.current = Tt, $t());
  }, [ct, t, $t]);
  const Y = Qn((H) => {
    x.current === 0 && (x.current = H);
    const tt = (H - x.current) / 1e3 * Mt.current;
    x.current = H;
    const vt = it.current, B = ft.current, $e = wt.current, A = qt.current;
    _((F) => {
      if (F.status !== "playing") return F;
      if (F.isWaitingAtLight) {
        const ue = F.currentWaitTime + tt;
        return ue >= P.current ? (k.current = F.distanceTraveled, I.current = !1, D.current = !0, {
          ...F,
          isWaitingAtLight: !1,
          currentWaitTime: 0,
          totalWaitTime: F.totalWaitTime + P.current,
          elapsedTime: F.elapsedTime + tt,
          currentSpeed: 0
        }) : {
          ...F,
          currentWaitTime: ue,
          elapsedTime: F.elapsedTime + tt,
          currentSpeed: 0
        };
      }
      const _t = $e[F.currentTrafficLightIndex], Lt = (_t == null ? void 0 : _t.distanceFromStart) ?? A, mt = Lt - F.distanceTraveled, ut = 0.5 * ve.DECELERATION_RATE * ve.BRAKING_TIME * ve.BRAKING_TIME;
      mt <= ut && _t && !I.current && (I.current = !0);
      const Ot = F.distanceTraveled - k.current, te = Lt - k.current, De = 0.5 * ve.ACCELERATION_RATE * ve.ACCELERATION_TIME * ve.ACCELERATION_TIME;
      D.current && Ot >= De && (D.current = !1);
      const Se = mL(
        Ot,
        te,
        D.current,
        I.current
      );
      let Te;
      if (D.current && Ot < De) {
        const $n = (Ot > 0 ? Math.sqrt(2 * Ot / ve.ACCELERATION_RATE) : 0) + tt, Hr = ve.ACCELERATION_TIME;
        $n <= Hr ? Te = 0.5 * ve.ACCELERATION_RATE * $n * $n - Ot : Te = Se * tt;
      } else
        Te = Se * tt;
      const ee = Math.min(F.distanceTraveled + Te, A);
      if (_t && ee >= _t.distanceFromStart) {
        P.current = st.current[F.currentTrafficLightIndex] || Ht.current;
        const ue = La(vt, _t.distanceFromStart, B);
        return S(ue), {
          ...F,
          distanceTraveled: _t.distanceFromStart,
          routeProgress: _t.distanceFromStart / A,
          elapsedTime: F.elapsedTime + tt,
          currentSpeed: 0,
          isWaitingAtLight: !0,
          currentWaitTime: 0,
          currentTrafficLightIndex: F.currentTrafficLightIndex + 1,
          lightsEncountered: F.lightsEncountered + 1,
          currentPosition: [ue.lat, ue.lng]
        };
      }
      if (ee >= A) {
        b.current && (cancelAnimationFrame(b.current), b.current = null);
        const ue = La(vt, A, B);
        return S(ue), {
          ...F,
          status: "finished",
          distanceTraveled: A,
          routeProgress: 1,
          elapsedTime: F.elapsedTime + tt,
          currentSpeed: 0,
          currentPosition: [ue.lat, ue.lng]
        };
      }
      const ln = La(vt, ee, B);
      return S(ln), {
        ...F,
        distanceTraveled: ee,
        routeProgress: ee / A,
        elapsedTime: F.elapsedTime + tt,
        currentSpeed: Se,
        currentPosition: [ln.lat, ln.lng]
      };
    }), b.current = requestAnimationFrame(Y);
  }, []), dt = Qn(() => {
    ct && (_((H) => H.status === "finished" ? H : { ...H, status: "playing" }), x.current = 0, b.current = requestAnimationFrame(Y));
  }, [ct, Y]), Ie = Qn(() => {
    b.current && (cancelAnimationFrame(b.current), b.current = null), _((H) => ({ ...H, status: "paused" }));
  }, []);
  return Jt(() => () => {
    b.current && cancelAnimationFrame(b.current);
  }, []), {
    state: d,
    position: g,
    play: dt,
    pause: Ie,
    reset: $t,
    isReady: ct
  };
}
function gL({
  state: t,
  totalDistance: n,
  unlockFee: i,
  perMinuteRate: s
}) {
  return ld(() => {
    const { elapsedTime: a, totalWaitTime: u, currentWaitTime: h, isWaitingAtLight: d } = t, _ = u + (d ? h : 0), g = a / 60, b = (a - _) / 60, x = _ / 60, P = b * s, k = x * s, I = i + g * s, st = yL(n) / 60, it = i + st * s, ft = Math.max(0, I - it);
    return {
      unlockFee: i,
      ridingCost: P,
      waitingCost: k,
      totalCost: I,
      idealCost: it,
      wastedMoney: ft
    };
  }, [t, n, i, s]);
}
function yL(t) {
  const { MAX_SPEED_MS: n, ACCELERATION_TIME: i, BRAKING_TIME: s, ACCELERATION_RATE: a, DECELERATION_RATE: u } = ve, h = 0.5 * a * i * i, d = 0.5 * u * s * s, _ = h + d;
  if (t <= _) {
    const b = (a + u) / 2;
    return 2 * Math.sqrt(t / b);
  }
  const S = (t - _) / n;
  return i + S + s;
}
function Dp(t, n) {
  const i = Pt(n);
  Jt(function() {
    n !== i.current && t.attributionControl != null && (i.current != null && t.attributionControl.removeAttribution(i.current), n != null && t.attributionControl.addAttribution(n)), i.current = n;
  }, [
    t,
    n
  ]);
}
function vL(t, n, i) {
  n.center !== i.center && t.setLatLng(n.center), n.radius != null && n.radius !== i.radius && t.setRadius(n.radius);
}
const bL = 1;
function wL(t) {
  return Object.freeze({
    __version: bL,
    map: t
  });
}
function Bu(t, n) {
  return Object.freeze({
    ...t,
    ...n
  });
}
const Zp = vy(null), jp = Zp.Provider;
function Bo() {
  const t = by(Zp);
  if (t == null)
    throw new Error("No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>");
  return t;
}
function Wp(t) {
  function n(i, s) {
    const { instance: a, context: u } = t(i).current;
    return so(s, () => a), i.children == null ? null : /* @__PURE__ */ Oa.createElement(jp, {
      value: u
    }, i.children);
  }
  return /* @__PURE__ */ ro(n);
}
function SL(t) {
  function n(i, s) {
    const [a, u] = Gt(!1), { instance: h } = t(i, u).current;
    so(s, () => h), Jt(function() {
      a && h.update();
    }, [
      h,
      a,
      i.children
    ]);
    const d = h._contentNode;
    return d ? /* @__PURE__ */ wy(i.children, d) : null;
  }
  return /* @__PURE__ */ ro(n);
}
function TL(t) {
  function n(i, s) {
    const { instance: a } = t(i).current;
    return so(s, () => a), null;
  }
  return /* @__PURE__ */ ro(n);
}
function zu(t, n) {
  const i = Pt();
  Jt(function() {
    return n != null && t.instance.on(n), i.current = n, function() {
      i.current != null && t.instance.off(i.current), i.current = null;
    };
  }, [
    t,
    n
  ]);
}
function zo(t, n) {
  const i = t.pane ?? n.pane;
  return i ? {
    ...t,
    pane: i
  } : t;
}
function xL(t, n) {
  return function(s, a) {
    const u = Bo(), h = t(zo(s, u), u);
    return Dp(u.map, s.attribution), zu(h.current, s.eventHandlers), n(h.current, u, s, a), h;
  };
}
var PL = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function EL(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var xc = { exports: {} };
/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
(function(t, n) {
  (function(i, s) {
    s(n);
  })(PL, function(i) {
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
    function _(e) {
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
    function S(e, r, o) {
      var c = r[1], l = r[0], f = c - l;
      return e === c && o ? e : ((e - l) % f + f) % f + l;
    }
    function b() {
      return !1;
    }
    function x(e, r) {
      if (r === !1)
        return e;
      var o = Math.pow(10, r === void 0 ? 6 : r);
      return Math.round(e * o) / o;
    }
    function P(e) {
      return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
    }
    function k(e) {
      return P(e).split(/\s+/);
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
    var st = /\{ *([\w_ -]+) *\}/g;
    function it(e, r) {
      return e.replace(st, function(o, c) {
        var l = r[c];
        if (l === void 0)
          throw new Error("No value provided for variable " + o);
        return typeof l == "function" && (l = l(r)), l;
      });
    }
    var ft = Array.isArray || function(e) {
      return Object.prototype.toString.call(e) === "[object Array]";
    };
    function wt(e, r) {
      for (var o = 0; o < e.length; o++)
        if (e[o] === r)
          return o;
      return -1;
    }
    var qt = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    function Mt(e) {
      return window["webkit" + e] || window["moz" + e] || window["ms" + e];
    }
    var Ht = 0;
    function ct(e) {
      var r = +/* @__PURE__ */ new Date(), o = Math.max(0, 16 - (r - Ht));
      return Ht = r + o, window.setTimeout(e, o);
    }
    var St = window.requestAnimationFrame || Mt("RequestAnimationFrame") || ct, $t = window.cancelAnimationFrame || Mt("CancelAnimationFrame") || Mt("CancelRequestAnimationFrame") || function(e) {
      window.clearTimeout(e);
    };
    function Y(e, r, o) {
      if (o && St === ct)
        e.call(r);
      else
        return St.call(window, h(e, r));
    }
    function dt(e) {
      e && $t.call(window, e);
    }
    var Ie = {
      __proto__: null,
      extend: a,
      create: u,
      bind: h,
      get lastId() {
        return d;
      },
      stamp: _,
      throttle: g,
      wrapNum: S,
      falseFn: b,
      formatNum: x,
      trim: P,
      splitWords: k,
      setOptions: I,
      getParamString: D,
      template: it,
      isArray: ft,
      indexOf: wt,
      emptyImageUrl: qt,
      requestFn: St,
      cancelFn: $t,
      requestAnimFrame: Y,
      cancelAnimFrame: dt
    };
    function H() {
    }
    H.extend = function(e) {
      var r = function() {
        I(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
      }, o = r.__super__ = this.prototype, c = u(o);
      c.constructor = r, r.prototype = c;
      for (var l in this)
        Object.prototype.hasOwnProperty.call(this, l) && l !== "prototype" && l !== "__super__" && (r[l] = this[l]);
      return e.statics && a(r, e.statics), e.includes && (Tt(e.includes), a.apply(null, [c].concat(e.includes))), a(c, e), delete c.statics, delete c.includes, c.options && (c.options = o.options ? u(o.options) : {}, a(c.options, e.options)), c._initHooks = [], c.callInitHooks = function() {
        if (!this._initHooksCalled) {
          o.callInitHooks && o.callInitHooks.call(this), this._initHooksCalled = !0;
          for (var f = 0, p = c._initHooks.length; f < p; f++)
            c._initHooks[f].call(this);
        }
      }, r;
    }, H.include = function(e) {
      var r = this.prototype.options;
      return a(this.prototype, e), e.options && (this.prototype.options = r, this.mergeOptions(e.options)), this;
    }, H.mergeOptions = function(e) {
      return a(this.prototype.options, e), this;
    }, H.addInitHook = function(e) {
      var r = Array.prototype.slice.call(arguments, 1), o = typeof e == "function" ? e : function() {
        this[e].apply(this, r);
      };
      return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(o), this;
    };
    function Tt(e) {
      if (!(typeof L > "u" || !L || !L.Mixin)) {
        e = ft(e) ? e : [e];
        for (var r = 0; r < e.length; r++)
          e[r] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
      }
    }
    var tt = {
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
          e = k(e);
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
          e = k(e);
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
                c[l].fn = b;
            delete this._events[e];
            return;
          }
          if (typeof r != "function") {
            console.warn("wrong listener type: " + typeof r);
            return;
          }
          var p = this._listens(e, r, o);
          if (p !== !1) {
            var v = c[p];
            this._firingCount && (v.fn = b, this._events[e] = c = c.slice()), c.splice(p, 1);
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
              var v = l[f], w = v.fn;
              v.once && this.off(e, w, v.ctx), w.call(v.ctx || this, c);
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
          e = k(e);
          for (var l = 0, f = e.length; l < f; l++)
            this._on(e[l], r, o, !0);
        }
        return this;
      },
      // @method addEventParent(obj: Evented): this
      // Adds an event parent - an `Evented` that will receive propagated events
      addEventParent: function(e) {
        return this._eventParents = this._eventParents || {}, this._eventParents[_(e)] = e, this;
      },
      // @method removeEventParent(obj: Evented): this
      // Removes an event parent, so it will stop receiving propagated events
      removeEventParent: function(e) {
        return this._eventParents && delete this._eventParents[_(e)], this;
      },
      _propagateEvent: function(e) {
        for (var r in this._eventParents)
          this._eventParents[r].fire(e.type, a({
            layer: e.target,
            propagatedFrom: e.target
          }, e), !0);
      }
    };
    tt.addEventListener = tt.on, tt.removeEventListener = tt.clearAllEventListeners = tt.off, tt.addOneTimeEventListener = tt.once, tt.fireEvent = tt.fire, tt.hasEventListeners = tt.listens;
    var vt = H.extend(tt);
    function B(e, r, o) {
      this.x = o ? Math.round(e) : e, this.y = o ? Math.round(r) : r;
    }
    var $e = Math.trunc || function(e) {
      return e > 0 ? Math.floor(e) : Math.ceil(e);
    };
    B.prototype = {
      // @method clone(): Point
      // Returns a copy of the current point.
      clone: function() {
        return new B(this.x, this.y);
      },
      // @method add(otherPoint: Point): Point
      // Returns the result of addition of the current and the given points.
      add: function(e) {
        return this.clone()._add(A(e));
      },
      _add: function(e) {
        return this.x += e.x, this.y += e.y, this;
      },
      // @method subtract(otherPoint: Point): Point
      // Returns the result of subtraction of the given point from the current.
      subtract: function(e) {
        return this.clone()._subtract(A(e));
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
        return new B(this.x * e.x, this.y * e.y);
      },
      // @method unscaleBy(scale: Point): Point
      // Inverse of `scaleBy`. Divide each coordinate of the current point by
      // each coordinate of `scale`.
      unscaleBy: function(e) {
        return new B(this.x / e.x, this.y / e.y);
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
        return this.x = $e(this.x), this.y = $e(this.y), this;
      },
      // @method distanceTo(otherPoint: Point): Number
      // Returns the cartesian distance between the current and the given points.
      distanceTo: function(e) {
        e = A(e);
        var r = e.x - this.x, o = e.y - this.y;
        return Math.sqrt(r * r + o * o);
      },
      // @method equals(otherPoint: Point): Boolean
      // Returns `true` if the given point has the same coordinates.
      equals: function(e) {
        return e = A(e), e.x === this.x && e.y === this.y;
      },
      // @method contains(otherPoint: Point): Boolean
      // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
      contains: function(e) {
        return e = A(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
      },
      // @method toString(): String
      // Returns a string representation of the point for debugging purposes.
      toString: function() {
        return "Point(" + x(this.x) + ", " + x(this.y) + ")";
      }
    };
    function A(e, r, o) {
      return e instanceof B ? e : ft(e) ? new B(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new B(e.x, e.y) : new B(e, r, o);
    }
    function F(e, r) {
      if (e)
        for (var o = r ? [e, r] : e, c = 0, l = o.length; c < l; c++)
          this.extend(o[c]);
    }
    F.prototype = {
      // @method extend(point: Point): this
      // Extends the bounds to contain the given point.
      // @alternative
      // @method extend(otherBounds: Bounds): this
      // Extend the bounds to contain the given bounds
      extend: function(e) {
        var r, o;
        if (!e)
          return this;
        if (e instanceof B || typeof e[0] == "number" || "x" in e)
          r = o = A(e);
        else if (e = _t(e), r = e.min, o = e.max, !r || !o)
          return this;
        return !this.min && !this.max ? (this.min = r.clone(), this.max = o.clone()) : (this.min.x = Math.min(r.x, this.min.x), this.max.x = Math.max(o.x, this.max.x), this.min.y = Math.min(r.y, this.min.y), this.max.y = Math.max(o.y, this.max.y)), this;
      },
      // @method getCenter(round?: Boolean): Point
      // Returns the center point of the bounds.
      getCenter: function(e) {
        return A(
          (this.min.x + this.max.x) / 2,
          (this.min.y + this.max.y) / 2,
          e
        );
      },
      // @method getBottomLeft(): Point
      // Returns the bottom-left point of the bounds.
      getBottomLeft: function() {
        return A(this.min.x, this.max.y);
      },
      // @method getTopRight(): Point
      // Returns the top-right point of the bounds.
      getTopRight: function() {
        return A(this.max.x, this.min.y);
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
        return typeof e[0] == "number" || e instanceof B ? e = A(e) : e = _t(e), e instanceof F ? (r = e.min, o = e.max) : r = o = e, r.x >= this.min.x && o.x <= this.max.x && r.y >= this.min.y && o.y <= this.max.y;
      },
      // @method intersects(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds
      // intersect if they have at least one point in common.
      intersects: function(e) {
        e = _t(e);
        var r = this.min, o = this.max, c = e.min, l = e.max, f = l.x >= r.x && c.x <= o.x, p = l.y >= r.y && c.y <= o.y;
        return f && p;
      },
      // @method overlaps(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds
      // overlap if their intersection is an area.
      overlaps: function(e) {
        e = _t(e);
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
        return _t(
          A(r.x - c, r.y - l),
          A(o.x + c, o.y + l)
        );
      },
      // @method equals(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle is equivalent to the given bounds.
      equals: function(e) {
        return e ? (e = _t(e), this.min.equals(e.getTopLeft()) && this.max.equals(e.getBottomRight())) : !1;
      }
    };
    function _t(e, r) {
      return !e || e instanceof F ? e : new F(e, r);
    }
    function Lt(e, r) {
      if (e)
        for (var o = r ? [e, r] : e, c = 0, l = o.length; c < l; c++)
          this.extend(o[c]);
    }
    Lt.prototype = {
      // @method extend(latlng: LatLng): this
      // Extend the bounds to contain the given point
      // @alternative
      // @method extend(otherBounds: LatLngBounds): this
      // Extend the bounds to contain the given bounds
      extend: function(e) {
        var r = this._southWest, o = this._northEast, c, l;
        if (e instanceof ut)
          c = e, l = e;
        else if (e instanceof Lt) {
          if (c = e._southWest, l = e._northEast, !c || !l)
            return this;
        } else
          return e ? this.extend(rt(e) || mt(e)) : this;
        return !r && !o ? (this._southWest = new ut(c.lat, c.lng), this._northEast = new ut(l.lat, l.lng)) : (r.lat = Math.min(c.lat, r.lat), r.lng = Math.min(c.lng, r.lng), o.lat = Math.max(l.lat, o.lat), o.lng = Math.max(l.lng, o.lng)), this;
      },
      // @method pad(bufferRatio: Number): LatLngBounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(e) {
        var r = this._southWest, o = this._northEast, c = Math.abs(r.lat - o.lat) * e, l = Math.abs(r.lng - o.lng) * e;
        return new Lt(
          new ut(r.lat - c, r.lng - l),
          new ut(o.lat + c, o.lng + l)
        );
      },
      // @method getCenter(): LatLng
      // Returns the center point of the bounds.
      getCenter: function() {
        return new ut(
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
        return new ut(this.getNorth(), this.getWest());
      },
      // @method getSouthEast(): LatLng
      // Returns the south-east point of the bounds.
      getSouthEast: function() {
        return new ut(this.getSouth(), this.getEast());
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
        typeof e[0] == "number" || e instanceof ut || "lat" in e ? e = rt(e) : e = mt(e);
        var r = this._southWest, o = this._northEast, c, l;
        return e instanceof Lt ? (c = e.getSouthWest(), l = e.getNorthEast()) : c = l = e, c.lat >= r.lat && l.lat <= o.lat && c.lng >= r.lng && l.lng <= o.lng;
      },
      // @method intersects(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
      intersects: function(e) {
        e = mt(e);
        var r = this._southWest, o = this._northEast, c = e.getSouthWest(), l = e.getNorthEast(), f = l.lat >= r.lat && c.lat <= o.lat, p = l.lng >= r.lng && c.lng <= o.lng;
        return f && p;
      },
      // @method overlaps(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
      overlaps: function(e) {
        e = mt(e);
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
        return e ? (e = mt(e), this._southWest.equals(e.getSouthWest(), r) && this._northEast.equals(e.getNorthEast(), r)) : !1;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this._southWest && this._northEast);
      }
    };
    function mt(e, r) {
      return e instanceof Lt ? e : new Lt(e, r);
    }
    function ut(e, r, o) {
      if (isNaN(e) || isNaN(r))
        throw new Error("Invalid LatLng object: (" + e + ", " + r + ")");
      this.lat = +e, this.lng = +r, o !== void 0 && (this.alt = +o);
    }
    ut.prototype = {
      // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
      // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(e, r) {
        if (!e)
          return !1;
        e = rt(e);
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
        return te.distance(this, rt(e));
      },
      // @method wrap(): LatLng
      // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
      wrap: function() {
        return te.wrapLatLng(this);
      },
      // @method toBounds(sizeInMeters: Number): LatLngBounds
      // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
      toBounds: function(e) {
        var r = 180 * e / 40075017, o = r / Math.cos(Math.PI / 180 * this.lat);
        return mt(
          [this.lat - r, this.lng - o],
          [this.lat + r, this.lng + o]
        );
      },
      clone: function() {
        return new ut(this.lat, this.lng, this.alt);
      }
    };
    function rt(e, r, o) {
      return e instanceof ut ? e : ft(e) && typeof e[0] != "object" ? e.length === 3 ? new ut(e[0], e[1], e[2]) : e.length === 2 ? new ut(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new ut(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : r === void 0 ? null : new ut(e, r, o);
    }
    var Ot = {
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
        return new F(c, l);
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
        var r = this.wrapLng ? S(e.lng, this.wrapLng, !0) : e.lng, o = this.wrapLat ? S(e.lat, this.wrapLat, !0) : e.lat, c = e.alt;
        return new ut(o, r, c);
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring
      // that its center is within the CRS's bounds.
      // Only accepts actual `L.LatLngBounds` instances, not arrays.
      wrapLatLngBounds: function(e) {
        var r = e.getCenter(), o = this.wrapLatLng(r), c = r.lat - o.lat, l = r.lng - o.lng;
        if (c === 0 && l === 0)
          return e;
        var f = e.getSouthWest(), p = e.getNorthEast(), v = new ut(f.lat - c, f.lng - l), w = new ut(p.lat - c, p.lng - l);
        return new Lt(v, w);
      }
    }, te = a({}, Ot, {
      wrapLng: [-180, 180],
      // Mean Earth Radius, as recommended for use by
      // the International Union of Geodesy and Geophysics,
      // see https://rosettacode.org/wiki/Haversine_formula
      R: 6371e3,
      // distance between two geographical points using spherical law of cosines approximation
      distance: function(e, r) {
        var o = Math.PI / 180, c = e.lat * o, l = r.lat * o, f = Math.sin((r.lat - e.lat) * o / 2), p = Math.sin((r.lng - e.lng) * o / 2), v = f * f + Math.cos(c) * Math.cos(l) * p * p, w = 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v));
        return this.R * w;
      }
    }), De = 6378137, Se = {
      R: De,
      MAX_LATITUDE: 85.0511287798,
      project: function(e) {
        var r = Math.PI / 180, o = this.MAX_LATITUDE, c = Math.max(Math.min(o, e.lat), -o), l = Math.sin(c * r);
        return new B(
          this.R * e.lng * r,
          this.R * Math.log((1 + l) / (1 - l)) / 2
        );
      },
      unproject: function(e) {
        var r = 180 / Math.PI;
        return new ut(
          (2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * r,
          e.x * r / this.R
        );
      },
      bounds: function() {
        var e = De * Math.PI;
        return new F([-e, -e], [e, e]);
      }()
    };
    function Te(e, r, o, c) {
      if (ft(e)) {
        this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3];
        return;
      }
      this._a = e, this._b = r, this._c = o, this._d = c;
    }
    Te.prototype = {
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
        return r = r || 1, new B(
          (e.x / r - this._b) / this._a,
          (e.y / r - this._d) / this._c
        );
      }
    };
    function ee(e, r, o, c) {
      return new Te(e, r, o, c);
    }
    var ln = a({}, te, {
      code: "EPSG:3857",
      projection: Se,
      transformation: function() {
        var e = 0.5 / (Math.PI * Se.R);
        return ee(e, 0.5, -e, 0.5);
      }()
    }), ue = a({}, ln, {
      code: "EPSG:900913"
    });
    function $n(e) {
      return document.createElementNS("http://www.w3.org/2000/svg", e);
    }
    function Hr(e, r) {
      var o = "", c, l, f, p, v, w;
      for (c = 0, f = e.length; c < f; c++) {
        for (v = e[c], l = 0, p = v.length; l < p; l++)
          w = v[l], o += (l ? "L" : "M") + w.x + " " + w.y;
        o += r ? N.svg ? "z" : "x" : "";
      }
      return o || "M0 0";
    }
    var Ur = document.documentElement.style, Vr = "ActiveXObject" in window, Kp = Vr && !document.addEventListener, Zu = "msLaunchUri" in navigator && !("documentMode" in document), Do = Ce("webkit"), ju = Ce("android"), Wu = Ce("android 2") || Ce("android 3"), Gp = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), Jp = ju && Ce("Google") && Gp < 537 && !("AudioNode" in window), Zo = !!window.opera, Hu = !Zu && Ce("chrome"), Uu = Ce("gecko") && !Do && !Zo && !Vr, Yp = !Hu && Ce("safari"), Vu = Ce("phantom"), qu = "OTransition" in Ur, Xp = navigator.platform.indexOf("Win") === 0, Ku = Vr && "transition" in Ur, jo = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Wu, Gu = "MozPerspective" in Ur, Qp = !window.L_DISABLE_3D && (Ku || jo || Gu) && !qu && !Vu, Ai = typeof orientation < "u" || Ce("mobile"), tg = Ai && Do, eg = Ai && jo, Ju = !window.PointerEvent && window.MSPointerEvent, Yu = !!(window.PointerEvent || Ju), Xu = "ontouchstart" in window || !!window.TouchEvent, ng = !window.L_NO_TOUCH && (Xu || Yu), ig = Ai && Zo, rg = Ai && Uu, sg = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, og = function() {
      var e = !1;
      try {
        var r = Object.defineProperty({}, "passive", {
          get: function() {
            e = !0;
          }
        });
        window.addEventListener("testPassiveEventSupport", b, r), window.removeEventListener("testPassiveEventSupport", b, r);
      } catch {
      }
      return e;
    }(), ag = function() {
      return !!document.createElement("canvas").getContext;
    }(), Wo = !!(document.createElementNS && $n("svg").createSVGRect), cg = !!Wo && function() {
      var e = document.createElement("div");
      return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
    }(), ug = !Wo && function() {
      try {
        var e = document.createElement("div");
        e.innerHTML = '<v:shape adj="1"/>';
        var r = e.firstChild;
        return r.style.behavior = "url(#default#VML)", r && typeof r.adj == "object";
      } catch {
        return !1;
      }
    }(), lg = navigator.platform.indexOf("Mac") === 0, hg = navigator.platform.indexOf("Linux") === 0;
    function Ce(e) {
      return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
    }
    var N = {
      ie: Vr,
      ielt9: Kp,
      edge: Zu,
      webkit: Do,
      android: ju,
      android23: Wu,
      androidStock: Jp,
      opera: Zo,
      chrome: Hu,
      gecko: Uu,
      safari: Yp,
      phantom: Vu,
      opera12: qu,
      win: Xp,
      ie3d: Ku,
      webkit3d: jo,
      gecko3d: Gu,
      any3d: Qp,
      mobile: Ai,
      mobileWebkit: tg,
      mobileWebkit3d: eg,
      msPointer: Ju,
      pointer: Yu,
      touch: ng,
      touchNative: Xu,
      mobileOpera: ig,
      mobileGecko: rg,
      retina: sg,
      passiveEvents: og,
      canvas: ag,
      svg: Wo,
      vml: ug,
      inlineSvg: cg,
      mac: lg,
      linux: hg
    }, Qu = N.msPointer ? "MSPointerDown" : "pointerdown", tl = N.msPointer ? "MSPointerMove" : "pointermove", el = N.msPointer ? "MSPointerUp" : "pointerup", nl = N.msPointer ? "MSPointerCancel" : "pointercancel", Ho = {
      touchstart: Qu,
      touchmove: tl,
      touchend: el,
      touchcancel: nl
    }, il = {
      touchstart: gg,
      touchmove: qr,
      touchend: qr,
      touchcancel: qr
    }, Dn = {}, rl = !1;
    function fg(e, r, o) {
      return r === "touchstart" && pg(), il[r] ? (o = il[r].bind(this, o), e.addEventListener(Ho[r], o, !1), o) : (console.warn("wrong event specified:", r), b);
    }
    function dg(e, r, o) {
      if (!Ho[r]) {
        console.warn("wrong event specified:", r);
        return;
      }
      e.removeEventListener(Ho[r], o, !1);
    }
    function _g(e) {
      Dn[e.pointerId] = e;
    }
    function mg(e) {
      Dn[e.pointerId] && (Dn[e.pointerId] = e);
    }
    function sl(e) {
      delete Dn[e.pointerId];
    }
    function pg() {
      rl || (document.addEventListener(Qu, _g, !0), document.addEventListener(tl, mg, !0), document.addEventListener(el, sl, !0), document.addEventListener(nl, sl, !0), rl = !0);
    }
    function qr(e, r) {
      if (r.pointerType !== (r.MSPOINTER_TYPE_MOUSE || "mouse")) {
        r.touches = [];
        for (var o in Dn)
          r.touches.push(Dn[o]);
        r.changedTouches = [r], e(r);
      }
    }
    function gg(e, r) {
      r.MSPOINTER_TYPE_TOUCH && r.pointerType === r.MSPOINTER_TYPE_TOUCH && Kt(r), qr(e, r);
    }
    function yg(e) {
      var r = {}, o, c;
      for (c in e)
        o = e[c], r[c] = o && o.bind ? o.bind(e) : o;
      return e = r, r.type = "dblclick", r.detail = 2, r.isTrusted = !1, r._simulated = !0, r;
    }
    var vg = 200;
    function bg(e, r) {
      e.addEventListener("dblclick", r);
      var o = 0, c;
      function l(f) {
        if (f.detail !== 1) {
          c = f.detail;
          return;
        }
        if (!(f.pointerType === "mouse" || f.sourceCapabilities && !f.sourceCapabilities.firesTouchEvents)) {
          var p = ll(f);
          if (!(p.some(function(w) {
            return w instanceof HTMLLabelElement && w.attributes.for;
          }) && !p.some(function(w) {
            return w instanceof HTMLInputElement || w instanceof HTMLSelectElement;
          }))) {
            var v = Date.now();
            v - o <= vg ? (c++, c === 2 && r(yg(f))) : c = 1, o = v;
          }
        }
      }
      return e.addEventListener("click", l), {
        dblclick: r,
        simDblclick: l
      };
    }
    function wg(e, r) {
      e.removeEventListener("dblclick", r.dblclick), e.removeEventListener("click", r.simDblclick);
    }
    var Uo = Jr(
      ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
    ), Ni = Jr(
      ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
    ), ol = Ni === "webkitTransition" || Ni === "OTransition" ? Ni + "End" : "transitionend";
    function al(e) {
      return typeof e == "string" ? document.getElementById(e) : e;
    }
    function Fi(e, r) {
      var o = e.style[r] || e.currentStyle && e.currentStyle[r];
      if ((!o || o === "auto") && document.defaultView) {
        var c = document.defaultView.getComputedStyle(e, null);
        o = c ? c[r] : null;
      }
      return o === "auto" ? null : o;
    }
    function lt(e, r, o) {
      var c = document.createElement(e);
      return c.className = r || "", o && o.appendChild(c), c;
    }
    function xt(e) {
      var r = e.parentNode;
      r && r.removeChild(e);
    }
    function Kr(e) {
      for (; e.firstChild; )
        e.removeChild(e.firstChild);
    }
    function Zn(e) {
      var r = e.parentNode;
      r && r.lastChild !== e && r.appendChild(e);
    }
    function jn(e) {
      var r = e.parentNode;
      r && r.firstChild !== e && r.insertBefore(e, r.firstChild);
    }
    function Vo(e, r) {
      if (e.classList !== void 0)
        return e.classList.contains(r);
      var o = Gr(e);
      return o.length > 0 && new RegExp("(^|\\s)" + r + "(\\s|$)").test(o);
    }
    function q(e, r) {
      if (e.classList !== void 0)
        for (var o = k(r), c = 0, l = o.length; c < l; c++)
          e.classList.add(o[c]);
      else if (!Vo(e, r)) {
        var f = Gr(e);
        qo(e, (f ? f + " " : "") + r);
      }
    }
    function It(e, r) {
      e.classList !== void 0 ? e.classList.remove(r) : qo(e, P((" " + Gr(e) + " ").replace(" " + r + " ", " ")));
    }
    function qo(e, r) {
      e.className.baseVal === void 0 ? e.className = r : e.className.baseVal = r;
    }
    function Gr(e) {
      return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
    }
    function _e(e, r) {
      "opacity" in e.style ? e.style.opacity = r : "filter" in e.style && Sg(e, r);
    }
    function Sg(e, r) {
      var o = !1, c = "DXImageTransform.Microsoft.Alpha";
      try {
        o = e.filters.item(c);
      } catch {
        if (r === 1)
          return;
      }
      r = Math.round(r * 100), o ? (o.Enabled = r !== 100, o.Opacity = r) : e.style.filter += " progid:" + c + "(opacity=" + r + ")";
    }
    function Jr(e) {
      for (var r = document.documentElement.style, o = 0; o < e.length; o++)
        if (e[o] in r)
          return e[o];
      return !1;
    }
    function hn(e, r, o) {
      var c = r || new B(0, 0);
      e.style[Uo] = (N.ie3d ? "translate(" + c.x + "px," + c.y + "px)" : "translate3d(" + c.x + "px," + c.y + "px,0)") + (o ? " scale(" + o + ")" : "");
    }
    function Rt(e, r) {
      e._leaflet_pos = r, N.any3d ? hn(e, r) : (e.style.left = r.x + "px", e.style.top = r.y + "px");
    }
    function fn(e) {
      return e._leaflet_pos || new B(0, 0);
    }
    var Bi, zi, Ko;
    if ("onselectstart" in document)
      Bi = function() {
        V(window, "selectstart", Kt);
      }, zi = function() {
        pt(window, "selectstart", Kt);
      };
    else {
      var $i = Jr(
        ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
      );
      Bi = function() {
        if ($i) {
          var e = document.documentElement.style;
          Ko = e[$i], e[$i] = "none";
        }
      }, zi = function() {
        $i && (document.documentElement.style[$i] = Ko, Ko = void 0);
      };
    }
    function Go() {
      V(window, "dragstart", Kt);
    }
    function Jo() {
      pt(window, "dragstart", Kt);
    }
    var Yr, Yo;
    function Xo(e) {
      for (; e.tabIndex === -1; )
        e = e.parentNode;
      e.style && (Xr(), Yr = e, Yo = e.style.outlineStyle, e.style.outlineStyle = "none", V(window, "keydown", Xr));
    }
    function Xr() {
      Yr && (Yr.style.outlineStyle = Yo, Yr = void 0, Yo = void 0, pt(window, "keydown", Xr));
    }
    function cl(e) {
      do
        e = e.parentNode;
      while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
      return e;
    }
    function Qo(e) {
      var r = e.getBoundingClientRect();
      return {
        x: r.width / e.offsetWidth || 1,
        y: r.height / e.offsetHeight || 1,
        boundingClientRect: r
      };
    }
    var Tg = {
      __proto__: null,
      TRANSFORM: Uo,
      TRANSITION: Ni,
      TRANSITION_END: ol,
      get: al,
      getStyle: Fi,
      create: lt,
      remove: xt,
      empty: Kr,
      toFront: Zn,
      toBack: jn,
      hasClass: Vo,
      addClass: q,
      removeClass: It,
      setClass: qo,
      getClass: Gr,
      setOpacity: _e,
      testProp: Jr,
      setTransform: hn,
      setPosition: Rt,
      getPosition: fn,
      get disableTextSelection() {
        return Bi;
      },
      get enableTextSelection() {
        return zi;
      },
      disableImageDrag: Go,
      enableImageDrag: Jo,
      preventOutline: Xo,
      restoreOutline: Xr,
      getSizedParentNode: cl,
      getScale: Qo
    };
    function V(e, r, o, c) {
      if (r && typeof r == "object")
        for (var l in r)
          ea(e, l, r[l], o);
      else {
        r = k(r);
        for (var f = 0, p = r.length; f < p; f++)
          ea(e, r[f], o, c);
      }
      return this;
    }
    var Oe = "_leaflet_events";
    function pt(e, r, o, c) {
      if (arguments.length === 1)
        ul(e), delete e[Oe];
      else if (r && typeof r == "object")
        for (var l in r)
          na(e, l, r[l], o);
      else if (r = k(r), arguments.length === 2)
        ul(e, function(v) {
          return wt(r, v) !== -1;
        });
      else
        for (var f = 0, p = r.length; f < p; f++)
          na(e, r[f], o, c);
      return this;
    }
    function ul(e, r) {
      for (var o in e[Oe]) {
        var c = o.split(/\d/)[0];
        (!r || r(c)) && na(e, c, null, null, o);
      }
    }
    var ta = {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      wheel: !("onwheel" in window) && "mousewheel"
    };
    function ea(e, r, o, c) {
      var l = r + _(o) + (c ? "_" + _(c) : "");
      if (e[Oe] && e[Oe][l])
        return this;
      var f = function(v) {
        return o.call(c || e, v || window.event);
      }, p = f;
      !N.touchNative && N.pointer && r.indexOf("touch") === 0 ? f = fg(e, r, f) : N.touch && r === "dblclick" ? f = bg(e, f) : "addEventListener" in e ? r === "touchstart" || r === "touchmove" || r === "wheel" || r === "mousewheel" ? e.addEventListener(ta[r] || r, f, N.passiveEvents ? { passive: !1 } : !1) : r === "mouseenter" || r === "mouseleave" ? (f = function(v) {
        v = v || window.event, ra(e, v) && p(v);
      }, e.addEventListener(ta[r], f, !1)) : e.addEventListener(r, p, !1) : e.attachEvent("on" + r, f), e[Oe] = e[Oe] || {}, e[Oe][l] = f;
    }
    function na(e, r, o, c, l) {
      l = l || r + _(o) + (c ? "_" + _(c) : "");
      var f = e[Oe] && e[Oe][l];
      if (!f)
        return this;
      !N.touchNative && N.pointer && r.indexOf("touch") === 0 ? dg(e, r, f) : N.touch && r === "dblclick" ? wg(e, f) : "removeEventListener" in e ? e.removeEventListener(ta[r] || r, f, !1) : e.detachEvent("on" + r, f), e[Oe][l] = null;
    }
    function dn(e) {
      return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
    }
    function ia(e) {
      return ea(e, "wheel", dn), this;
    }
    function Di(e) {
      return V(e, "mousedown touchstart dblclick contextmenu", dn), e._leaflet_disable_click = !0, this;
    }
    function Kt(e) {
      return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
    }
    function _n(e) {
      return Kt(e), dn(e), this;
    }
    function ll(e) {
      if (e.composedPath)
        return e.composedPath();
      for (var r = [], o = e.target; o; )
        r.push(o), o = o.parentNode;
      return r;
    }
    function hl(e, r) {
      if (!r)
        return new B(e.clientX, e.clientY);
      var o = Qo(r), c = o.boundingClientRect;
      return new B(
        // offset.left/top values are in page scale (like clientX/Y),
        // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
        (e.clientX - c.left) / o.x - r.clientLeft,
        (e.clientY - c.top) / o.y - r.clientTop
      );
    }
    var xg = N.linux && N.chrome ? window.devicePixelRatio : N.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
    function fl(e) {
      return N.edge ? e.wheelDeltaY / 2 : (
        // Don't trust window-geometry-based delta
        e.deltaY && e.deltaMode === 0 ? -e.deltaY / xg : (
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
    function ra(e, r) {
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
    var Pg = {
      __proto__: null,
      on: V,
      off: pt,
      stopPropagation: dn,
      disableScrollPropagation: ia,
      disableClickPropagation: Di,
      preventDefault: Kt,
      stop: _n,
      getPropagationPath: ll,
      getMousePosition: hl,
      getWheelDelta: fl,
      isExternalTarget: ra,
      addListener: V,
      removeListener: pt
    }, dl = vt.extend({
      // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
      // Run an animation of a given element to a new position, optionally setting
      // duration in seconds (`0.25` by default) and easing linearity factor (3rd
      // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
      // `0.5` by default).
      run: function(e, r, o, c) {
        this.stop(), this._el = e, this._inProgress = !0, this._duration = o || 0.25, this._easeOutPower = 1 / Math.max(c || 0.5, 0.2), this._startPos = fn(e), this._offset = r.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
      },
      // @method stop()
      // Stops the animation (if currently running).
      stop: function() {
        this._inProgress && (this._step(!0), this._complete());
      },
      _animate: function() {
        this._animId = Y(this._animate, this), this._step();
      },
      _step: function(e) {
        var r = +/* @__PURE__ */ new Date() - this._startTime, o = this._duration * 1e3;
        r < o ? this._runFrame(this._easeOut(r / o), e) : (this._runFrame(1), this._complete());
      },
      _runFrame: function(e, r) {
        var o = this._startPos.add(this._offset.multiplyBy(e));
        r && o._round(), Rt(this._el, o), this.fire("step");
      },
      _complete: function() {
        dt(this._animId), this._inProgress = !1, this.fire("end");
      },
      _easeOut: function(e) {
        return 1 - Math.pow(1 - e, this._easeOutPower);
      }
    }), ot = vt.extend({
      options: {
        // @section Map State Options
        // @option crs: CRS = L.CRS.EPSG3857
        // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
        // sure what it means.
        crs: ln,
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
        r = I(this, r), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = h(this._onResize, this), this._initEvents(), r.maxBounds && this.setMaxBounds(r.maxBounds), r.zoom !== void 0 && (this._zoom = this._limitZoom(r.zoom)), r.center && r.zoom !== void 0 && this.setView(rt(r.center), r.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = Ni && N.any3d && !N.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), V(this._proxy, ol, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
      },
      // @section Methods for modifying map state
      // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) with the given
      // animation options.
      setView: function(e, r, o) {
        if (r = r === void 0 ? this._zoom : this._limitZoom(r), e = this._limitCenter(rt(e), r, this.options.maxBounds), o = o || {}, this._stop(), this._loaded && !o.reset && o !== !0) {
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
        return e = e || (N.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + e, r);
      },
      // @method zoomOut(delta?: Number, options?: Zoom options): this
      // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomOut: function(e, r) {
        return e = e || (N.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - e, r);
      },
      // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified geographical point on the map
      // stationary (e.g. used internally for scroll zoom and double-click zoom).
      // @alternative
      // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
      setZoomAround: function(e, r, o) {
        var c = this.getZoomScale(r), l = this.getSize().divideBy(2), f = e instanceof B ? e : this.latLngToContainerPoint(e), p = f.subtract(l).multiplyBy(1 - 1 / c), v = this.containerPointToLatLng(l.add(p));
        return this.setView(v, r, { zoom: o });
      },
      _getBoundsCenterZoom: function(e, r) {
        r = r || {}, e = e.getBounds ? e.getBounds() : mt(e);
        var o = A(r.paddingTopLeft || r.padding || [0, 0]), c = A(r.paddingBottomRight || r.padding || [0, 0]), l = this.getBoundsZoom(e, !1, o.add(c));
        if (l = typeof r.maxZoom == "number" ? Math.min(r.maxZoom, l) : l, l === 1 / 0)
          return {
            center: e.getCenter(),
            zoom: l
          };
        var f = c.subtract(o).divideBy(2), p = this.project(e.getSouthWest(), l), v = this.project(e.getNorthEast(), l), w = this.unproject(p.add(v).divideBy(2).add(f), l);
        return {
          center: w,
          zoom: l
        };
      },
      // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets a map view that contains the given geographical bounds with the
      // maximum zoom level possible.
      fitBounds: function(e, r) {
        if (e = mt(e), !e.isValid())
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
        if (e = A(e).round(), r = r || {}, !e.x && !e.y)
          return this.fire("moveend");
        if (r.animate !== !0 && !this.getSize().contains(e))
          return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
        if (this._panAnim || (this._panAnim = new dl(), this._panAnim.on({
          step: this._onPanTransitionStep,
          end: this._onPanTransitionEnd
        }, this)), r.noMoveStart || this.fire("movestart"), r.animate !== !1) {
          q(this._mapPane, "leaflet-pan-anim");
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
        if (o = o || {}, o.animate === !1 || !N.any3d)
          return this.setView(e, r, o);
        this._stop();
        var c = this.project(this.getCenter()), l = this.project(e), f = this.getSize(), p = this._zoom;
        e = rt(e), r = r === void 0 ? p : r;
        var v = Math.max(f.x, f.y), w = v * this.getZoomScale(p, r), E = l.distanceTo(c) || 1, O = 1.42, j = O * O;
        function et(At) {
          var ls = At ? -1 : 1, dy = At ? w : v, _y = w * w - v * v + ls * j * j * E * E, my = 2 * dy * j * E, ma = _y / my, ql = Math.sqrt(ma * ma + 1) - ma, py = ql < 1e-9 ? -18 : Math.log(ql);
          return py;
        }
        function Yt(At) {
          return (Math.exp(At) - Math.exp(-At)) / 2;
        }
        function Ut(At) {
          return (Math.exp(At) + Math.exp(-At)) / 2;
        }
        function pe(At) {
          return Yt(At) / Ut(At);
        }
        var ne = et(0);
        function Kn(At) {
          return v * (Ut(ne) / Ut(ne + O * At));
        }
        function uy(At) {
          return v * (Ut(ne) * pe(ne + O * At) - Yt(ne)) / j;
        }
        function ly(At) {
          return 1 - Math.pow(1 - At, 1.5);
        }
        var hy = Date.now(), Ul = (et(1) - ne) / O, fy = o.duration ? 1e3 * o.duration : 1e3 * Ul * 0.8;
        function Vl() {
          var At = (Date.now() - hy) / fy, ls = ly(At) * Ul;
          At <= 1 ? (this._flyToFrame = Y(Vl, this), this._move(
            this.unproject(c.add(l.subtract(c).multiplyBy(uy(ls) / E)), p),
            this.getScaleZoom(v / Kn(ls), p),
            { flyTo: !0 }
          )) : this._move(e, r)._moveEnd(!0);
        }
        return this._moveStart(!0, o.noMoveStart), Vl.call(this), this;
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
        return e = mt(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
        var o = this.getCenter(), c = this._limitCenter(o, this._zoom, mt(e));
        return o.equals(c) || this.panTo(c, r), this._enforcingBounds = !1, this;
      },
      // @method panInside(latlng: LatLng, options?: padding options): this
      // Pans the map the minimum amount to make the `latlng` visible. Use
      // padding options to fit the display to more restricted bounds.
      // If `latlng` is already within the (optionally padded) display bounds,
      // the map will not be panned.
      panInside: function(e, r) {
        r = r || {};
        var o = A(r.paddingTopLeft || r.padding || [0, 0]), c = A(r.paddingBottomRight || r.padding || [0, 0]), l = this.project(this.getCenter()), f = this.project(e), p = this.getPixelBounds(), v = _t([p.min.add(o), p.max.subtract(c)]), w = v.getSize();
        if (!v.contains(f)) {
          this._enforcingBounds = !0;
          var E = f.subtract(v.getCenter()), O = v.extend(f).getSize().subtract(w);
          l.x += E.x < 0 ? -O.x : O.x, l.y += E.y < 0 ? -O.y : O.y, this.panTo(this.unproject(l), r), this._enforcingBounds = !1;
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
          var r = e.coords.latitude, o = e.coords.longitude, c = new ut(r, o), l = c.toBounds(e.coords.accuracy * 2), f = this._locateOptions;
          if (f.setView) {
            var p = this.getBoundsZoom(l);
            this.setView(c, f.maxZoom ? Math.min(p, f.maxZoom) : p);
          }
          var v = {
            latlng: c,
            bounds: l,
            timestamp: e.timestamp
          };
          for (var w in e.coords)
            typeof e.coords[w] == "number" && (v[w] = e.coords[w]);
          this.fire("locationfound", v);
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
        this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), xt(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (dt(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
        var e;
        for (e in this._layers)
          this._layers[e].remove();
        for (e in this._panes)
          xt(this._panes[e]);
        return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
      },
      // @section Other Methods
      // @method createPane(name: String, container?: HTMLElement): HTMLElement
      // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
      // then returns it. The pane is created as a child of `container`, or
      // as a child of the main map pane if not set.
      createPane: function(e, r) {
        var o = "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), c = lt("div", o, r || this._mapPane);
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
        return new Lt(r, o);
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
        e = mt(e), o = A(o || [0, 0]);
        var c = this.getZoom() || 0, l = this.getMinZoom(), f = this.getMaxZoom(), p = e.getNorthWest(), v = e.getSouthEast(), w = this.getSize().subtract(o), E = _t(this.project(v, c), this.project(p, c)).getSize(), O = N.any3d ? this.options.zoomSnap : 1, j = w.x / E.x, et = w.y / E.y, Yt = r ? Math.max(j, et) : Math.min(j, et);
        return c = this.getScaleZoom(Yt, c), O && (c = Math.round(c / (O / 100)) * (O / 100), c = r ? Math.ceil(c / O) * O : Math.floor(c / O) * O), Math.max(l, Math.min(f, c));
      },
      // @method getSize(): Point
      // Returns the current size of the map container (in pixels).
      getSize: function() {
        return (!this._size || this._sizeChanged) && (this._size = new B(
          this._container.clientWidth || 0,
          this._container.clientHeight || 0
        ), this._sizeChanged = !1), this._size.clone();
      },
      // @method getPixelBounds(): Bounds
      // Returns the bounds of the current map view in projected pixel
      // coordinates (sometimes useful in layer and overlay implementations).
      getPixelBounds: function(e, r) {
        var o = this._getTopLeftPoint(e, r);
        return new F(o, o.add(this.getSize()));
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
        return r = r === void 0 ? this._zoom : r, this.options.crs.latLngToPoint(rt(e), r);
      },
      // @method unproject(point: Point, zoom: Number): LatLng
      // Inverse of [`project`](#map-project).
      unproject: function(e, r) {
        return r = r === void 0 ? this._zoom : r, this.options.crs.pointToLatLng(A(e), r);
      },
      // @method layerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding geographical coordinate (for the current zoom level).
      layerPointToLatLng: function(e) {
        var r = A(e).add(this.getPixelOrigin());
        return this.unproject(r);
      },
      // @method latLngToLayerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the [origin pixel](#map-getpixelorigin).
      latLngToLayerPoint: function(e) {
        var r = this.project(rt(e))._round();
        return r._subtract(this.getPixelOrigin());
      },
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
      // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
      // CRS's bounds.
      // By default this means longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees.
      wrapLatLng: function(e) {
        return this.options.crs.wrapLatLng(rt(e));
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring that
      // its center is within the CRS's bounds.
      // By default this means the center longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees, and the majority of the bounds
      // overlaps the CRS's bounds.
      wrapLatLngBounds: function(e) {
        return this.options.crs.wrapLatLngBounds(mt(e));
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates according to
      // the map's CRS. By default this measures distance in meters.
      distance: function(e, r) {
        return this.options.crs.distance(rt(e), rt(r));
      },
      // @method containerPointToLayerPoint(point: Point): Point
      // Given a pixel coordinate relative to the map container, returns the corresponding
      // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
      containerPointToLayerPoint: function(e) {
        return A(e).subtract(this._getMapPanePos());
      },
      // @method layerPointToContainerPoint(point: Point): Point
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding pixel coordinate relative to the map container.
      layerPointToContainerPoint: function(e) {
        return A(e).add(this._getMapPanePos());
      },
      // @method containerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the map container, returns
      // the corresponding geographical coordinate (for the current zoom level).
      containerPointToLatLng: function(e) {
        var r = this.containerPointToLayerPoint(A(e));
        return this.layerPointToLatLng(r);
      },
      // @method latLngToContainerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the map container.
      latLngToContainerPoint: function(e) {
        return this.layerPointToContainerPoint(this.latLngToLayerPoint(rt(e)));
      },
      // @method mouseEventToContainerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to the
      // map container where the event took place.
      mouseEventToContainerPoint: function(e) {
        return hl(e, this._container);
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
        var r = this._container = al(e);
        if (r) {
          if (r._leaflet_id)
            throw new Error("Map container is already initialized.");
        } else throw new Error("Map container not found.");
        V(r, "scroll", this._onScroll, this), this._containerId = _(r);
      },
      _initLayout: function() {
        var e = this._container;
        this._fadeAnimated = this.options.fadeAnimation && N.any3d, q(e, "leaflet-container" + (N.touch ? " leaflet-touch" : "") + (N.retina ? " leaflet-retina" : "") + (N.ielt9 ? " leaflet-oldie" : "") + (N.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
        var r = Fi(e, "position");
        r !== "absolute" && r !== "relative" && r !== "fixed" && r !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
      },
      _initPanes: function() {
        var e = this._panes = {};
        this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Rt(this._mapPane, new B(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (q(e.markerPane, "leaflet-zoom-hide"), q(e.shadowPane, "leaflet-zoom-hide"));
      },
      // private methods that modify map state
      // @section Map state change events
      _resetView: function(e, r, o) {
        Rt(this._mapPane, new B(0, 0));
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
        return dt(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
      },
      _rawPanBy: function(e) {
        Rt(this._mapPane, this._getMapPanePos().subtract(e));
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
        this._targets = {}, this._targets[_(this._container)] = this;
        var r = e ? pt : V;
        r(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && r(window, "resize", this._onResize, this), N.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
      },
      _onResize: function() {
        dt(this._resizeRequest), this._resizeRequest = Y(
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
          if (c = this._targets[_(f)], c && (r === "click" || r === "preclick") && this._draggableMoved(c)) {
            p = !0;
            break;
          }
          if (c && c.listens(r, !0) && (l && !ra(f, e) || (o.push(c), l)) || f === this._container)
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
          o === "mousedown" && Xo(r), this._fireDOMEvent(e, o);
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
          r === "contextmenu" && Kt(e);
          var v = l[0], w = {
            originalEvent: e
          };
          if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
            var E = v.getLatLng && (!v._radius || v._radius <= 10);
            w.containerPoint = E ? this.latLngToContainerPoint(v.getLatLng()) : this.mouseEventToContainerPoint(e), w.layerPoint = this.containerPointToLayerPoint(w.containerPoint), w.latlng = E ? v.getLatLng() : this.layerPointToLatLng(w.layerPoint);
          }
          for (p = 0; p < l.length; p++)
            if (l[p].fire(r, w, !0), w.originalEvent._stopped || l[p].options.bubblingMouseEvents === !1 && wt(this._mouseEvents, r) !== -1)
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
        return fn(this._mapPane) || new B(0, 0);
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
        return _t([
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
        var c = this.project(e, r), l = this.getSize().divideBy(2), f = new F(c.subtract(l), c.add(l)), p = this._getBoundsOffset(f, o, r);
        return Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 ? e : this.unproject(c.add(p), r);
      },
      // adjust offset for view to get inside bounds
      _limitOffset: function(e, r) {
        if (!r)
          return e;
        var o = this.getPixelBounds(), c = new F(o.min.add(e), o.max.add(e));
        return e.add(this._getBoundsOffset(c, r));
      },
      // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
      _getBoundsOffset: function(e, r, o) {
        var c = _t(
          this.project(r.getNorthEast(), o),
          this.project(r.getSouthWest(), o)
        ), l = c.min.subtract(e.min), f = c.max.subtract(e.max), p = this._rebound(l.x, -f.x), v = this._rebound(l.y, -f.y);
        return new B(p, v);
      },
      _rebound: function(e, r) {
        return e + r > 0 ? Math.round(e - r) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(r));
      },
      _limitZoom: function(e) {
        var r = this.getMinZoom(), o = this.getMaxZoom(), c = N.any3d ? this.options.zoomSnap : 1;
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
        var e = this._proxy = lt("div", "leaflet-proxy leaflet-zoom-animated");
        this._panes.mapPane.appendChild(e), this.on("zoomanim", function(r) {
          var o = Uo, c = this._proxy.style[o];
          hn(this._proxy, this.project(r.center, r.zoom), this.getZoomScale(r.zoom, 1)), c === this._proxy.style[o] && this._animatingZoom && this._onZoomTransitionEnd();
        }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
      },
      _destroyAnimProxy: function() {
        xt(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
      },
      _animMoveEnd: function() {
        var e = this.getCenter(), r = this.getZoom();
        hn(this._proxy, this.project(e, r), this.getZoomScale(r, 1));
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
        return o.animate !== !0 && !this.getSize().contains(l) ? !1 : (Y(function() {
          this._moveStart(!0, o.noMoveStart || !1)._animateZoom(e, r, !0);
        }, this), !0);
      },
      _animateZoom: function(e, r, o, c) {
        this._mapPane && (o && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = r, q(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
          center: e,
          zoom: r,
          noUpdate: c
        }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(h(this._onZoomTransitionEnd, this), 250));
      },
      _onZoomTransitionEnd: function() {
        this._animatingZoom && (this._mapPane && It(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
      }
    });
    function Eg(e, r) {
      return new ot(e, r);
    }
    var xe = H.extend({
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
        return q(r, "leaflet-control"), o.indexOf("bottom") !== -1 ? c.insertBefore(r, c.firstChild) : c.appendChild(r), this._map.on("unload", this.remove, this), this;
      },
      // @method remove: this
      // Removes the control from the map it is currently active on.
      remove: function() {
        return this._map ? (xt(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
      },
      _refocusOnMap: function(e) {
        this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus();
      }
    }), Zi = function(e) {
      return new xe(e);
    };
    ot.include({
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
        var e = this._controlCorners = {}, r = "leaflet-", o = this._controlContainer = lt("div", r + "control-container", this._container);
        function c(l, f) {
          var p = r + l + " " + r + f;
          e[l + f] = lt("div", p, o);
        }
        c("top", "left"), c("top", "right"), c("bottom", "left"), c("bottom", "right");
      },
      _clearControlPos: function() {
        for (var e in this._controlCorners)
          xt(this._controlCorners[e]);
        xt(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
      }
    });
    var _l = xe.extend({
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
        var r = this._getLayer(_(e));
        return r && this._layers.splice(this._layers.indexOf(r), 1), this._map ? this._update() : this;
      },
      // @method expand(): this
      // Expand the control container if collapsed.
      expand: function() {
        q(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
        var e = this._map.getSize().y - (this._container.offsetTop + 50);
        return e < this._section.clientHeight ? (q(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : It(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
      },
      // @method collapse(): this
      // Collapse the control container if expanded.
      collapse: function() {
        return It(this._container, "leaflet-control-layers-expanded"), this;
      },
      _initLayout: function() {
        var e = "leaflet-control-layers", r = this._container = lt("div", e), o = this.options.collapsed;
        r.setAttribute("aria-haspopup", !0), Di(r), ia(r);
        var c = this._section = lt("section", e + "-list");
        o && (this._map.on("click", this.collapse, this), V(r, {
          mouseenter: this._expandSafely,
          mouseleave: this.collapse
        }, this));
        var l = this._layersLink = lt("a", e + "-toggle", r);
        l.href = "#", l.title = "Layers", l.setAttribute("role", "button"), V(l, {
          keydown: function(f) {
            f.keyCode === 13 && this._expandSafely();
          },
          // Certain screen readers intercept the key event and instead send a click event
          click: function(f) {
            Kt(f), this._expandSafely();
          }
        }, this), o || this.expand(), this._baseLayersList = lt("div", e + "-base", c), this._separator = lt("div", e + "-separator", c), this._overlaysList = lt("div", e + "-overlays", c), r.appendChild(c);
      },
      _getLayer: function(e) {
        for (var r = 0; r < this._layers.length; r++)
          if (this._layers[r] && _(this._layers[r].layer) === e)
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
        Kr(this._baseLayersList), Kr(this._overlaysList), this._layerControlInputs = [];
        var e, r, o, c, l = 0;
        for (o = 0; o < this._layers.length; o++)
          c = this._layers[o], this._addItem(c), r = r || c.overlay, e = e || !c.overlay, l += c.overlay ? 0 : 1;
        return this.options.hideSingleBase && (e = e && l > 1, this._baseLayersList.style.display = e ? "" : "none"), this._separator.style.display = r && e ? "" : "none", this;
      },
      _onLayerChange: function(e) {
        this._handlingClick || this._update();
        var r = this._getLayer(_(e.target)), o = r.overlay ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
        o && this._map.fire(o, r);
      },
      // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
      _createRadioElement: function(e, r) {
        var o = '<input type="radio" class="leaflet-control-layers-selector" name="' + e + '"' + (r ? ' checked="checked"' : "") + "/>", c = document.createElement("div");
        return c.innerHTML = o, c.firstChild;
      },
      _addItem: function(e) {
        var r = document.createElement("label"), o = this._map.hasLayer(e.layer), c;
        e.overlay ? (c = document.createElement("input"), c.type = "checkbox", c.className = "leaflet-control-layers-selector", c.defaultChecked = o) : c = this._createRadioElement("leaflet-base-layers_" + _(this), o), this._layerControlInputs.push(c), c.layerId = _(e.layer), V(c, "click", this._onInputClick, this);
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
        this._preventClick = !0, V(e, "click", Kt), this.expand();
        var r = this;
        setTimeout(function() {
          pt(e, "click", Kt), r._preventClick = !1;
        });
      }
    }), kg = function(e, r, o) {
      return new _l(e, r, o);
    }, sa = xe.extend({
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
        var r = "leaflet-control-zoom", o = lt("div", r + " leaflet-bar"), c = this.options;
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
        var f = lt("a", o, c);
        return f.innerHTML = e, f.href = "#", f.title = r, f.setAttribute("role", "button"), f.setAttribute("aria-label", r), Di(f), V(f, "click", _n), V(f, "click", l, this), V(f, "click", this._refocusOnMap, this), f;
      },
      _updateDisabled: function() {
        var e = this._map, r = "leaflet-disabled";
        It(this._zoomInButton, r), It(this._zoomOutButton, r), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (q(this._zoomOutButton, r), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (q(this._zoomInButton, r), this._zoomInButton.setAttribute("aria-disabled", "true"));
      }
    });
    ot.mergeOptions({
      zoomControl: !0
    }), ot.addInitHook(function() {
      this.options.zoomControl && (this.zoomControl = new sa(), this.addControl(this.zoomControl));
    });
    var Mg = function(e) {
      return new sa(e);
    }, ml = xe.extend({
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
        var r = "leaflet-control-scale", o = lt("div", r), c = this.options;
        return this._addScales(c, r + "-line", o), e.on(c.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), o;
      },
      onRemove: function(e) {
        e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
      },
      _addScales: function(e, r, o) {
        e.metric && (this._mScale = lt("div", r, o)), e.imperial && (this._iScale = lt("div", r, o));
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
    }), Lg = function(e) {
      return new ml(e);
    }, Ig = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', oa = xe.extend({
      // @section
      // @aka Control.Attribution options
      options: {
        position: "bottomright",
        // @option prefix: String|false = 'Leaflet'
        // The HTML text shown before the attributions. Pass `false` to disable.
        prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (N.inlineSvg ? Ig + " " : "") + "Leaflet</a>"
      },
      initialize: function(e) {
        I(this, e), this._attributions = {};
      },
      onAdd: function(e) {
        e.attributionControl = this, this._container = lt("div", "leaflet-control-attribution"), Di(this._container);
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
    ot.mergeOptions({
      attributionControl: !0
    }), ot.addInitHook(function() {
      this.options.attributionControl && new oa().addTo(this);
    });
    var Cg = function(e) {
      return new oa(e);
    };
    xe.Layers = _l, xe.Zoom = sa, xe.Scale = ml, xe.Attribution = oa, Zi.layers = kg, Zi.zoom = Mg, Zi.scale = Lg, Zi.attribution = Cg;
    var Re = H.extend({
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
    Re.addTo = function(e, r) {
      return e.addHandler(r, this), this;
    };
    var Og = { Events: tt }, pl = N.touch ? "touchstart mousedown" : "mousedown", en = vt.extend({
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
        this._enabled || (V(this._dragStartTarget, pl, this._onDown, this), this._enabled = !0);
      },
      // @method disable()
      // Disables the dragging ability
      disable: function() {
        this._enabled && (en._dragging === this && this.finishDrag(!0), pt(this._dragStartTarget, pl, this._onDown, this), this._enabled = !1, this._moved = !1);
      },
      _onDown: function(e) {
        if (this._enabled && (this._moved = !1, !Vo(this._element, "leaflet-zoom-anim"))) {
          if (e.touches && e.touches.length !== 1) {
            en._dragging === this && this.finishDrag();
            return;
          }
          if (!(en._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (en._dragging = this, this._preventOutline && Xo(this._element), Go(), Bi(), !this._moving)) {
            this.fire("down");
            var r = e.touches ? e.touches[0] : e, o = cl(this._element);
            this._startPoint = new B(r.clientX, r.clientY), this._startPos = fn(this._element), this._parentScale = Qo(o);
            var c = e.type === "mousedown";
            V(document, c ? "mousemove" : "touchmove", this._onMove, this), V(document, c ? "mouseup" : "touchend touchcancel", this._onUp, this);
          }
        }
      },
      _onMove: function(e) {
        if (this._enabled) {
          if (e.touches && e.touches.length > 1) {
            this._moved = !0;
            return;
          }
          var r = e.touches && e.touches.length === 1 ? e.touches[0] : e, o = new B(r.clientX, r.clientY)._subtract(this._startPoint);
          !o.x && !o.y || Math.abs(o.x) + Math.abs(o.y) < this.options.clickTolerance || (o.x /= this._parentScale.x, o.y /= this._parentScale.y, Kt(e), this._moved || (this.fire("dragstart"), this._moved = !0, q(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), q(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(o), this._moving = !0, this._lastEvent = e, this._updatePosition());
        }
      },
      _updatePosition: function() {
        var e = { originalEvent: this._lastEvent };
        this.fire("predrag", e), Rt(this._element, this._newPos), this.fire("drag", e);
      },
      _onUp: function() {
        this._enabled && this.finishDrag();
      },
      finishDrag: function(e) {
        It(document.body, "leaflet-dragging"), this._lastTarget && (It(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), pt(document, "mousemove touchmove", this._onMove, this), pt(document, "mouseup touchend touchcancel", this._onUp, this), Jo(), zi();
        var r = this._moved && this._moving;
        this._moving = !1, en._dragging = !1, r && this.fire("dragend", {
          noInertia: e,
          distance: this._newPos.distanceTo(this._startPos)
        });
      }
    });
    function gl(e, r, o) {
      var c, l = [1, 4, 2, 8], f, p, v, w, E, O, j, et;
      for (f = 0, O = e.length; f < O; f++)
        e[f]._code = mn(e[f], r);
      for (v = 0; v < 4; v++) {
        for (j = l[v], c = [], f = 0, O = e.length, p = O - 1; f < O; p = f++)
          w = e[f], E = e[p], w._code & j ? E._code & j || (et = Qr(E, w, j, r, o), et._code = mn(et, r), c.push(et)) : (E._code & j && (et = Qr(E, w, j, r, o), et._code = mn(et, r), c.push(et)), c.push(w));
        e = c;
      }
      return e;
    }
    function yl(e, r) {
      var o, c, l, f, p, v, w, E, O;
      if (!e || e.length === 0)
        throw new Error("latlngs not passed");
      me(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
      var j = rt([0, 0]), et = mt(e), Yt = et.getNorthWest().distanceTo(et.getSouthWest()) * et.getNorthEast().distanceTo(et.getNorthWest());
      Yt < 1700 && (j = aa(e));
      var Ut = e.length, pe = [];
      for (o = 0; o < Ut; o++) {
        var ne = rt(e[o]);
        pe.push(r.project(rt([ne.lat - j.lat, ne.lng - j.lng])));
      }
      for (v = w = E = 0, o = 0, c = Ut - 1; o < Ut; c = o++)
        l = pe[o], f = pe[c], p = l.y * f.x - f.y * l.x, w += (l.x + f.x) * p, E += (l.y + f.y) * p, v += p * 3;
      v === 0 ? O = pe[0] : O = [w / v, E / v];
      var Kn = r.unproject(A(O));
      return rt([Kn.lat + j.lat, Kn.lng + j.lng]);
    }
    function aa(e) {
      for (var r = 0, o = 0, c = 0, l = 0; l < e.length; l++) {
        var f = rt(e[l]);
        r += f.lat, o += f.lng, c++;
      }
      return rt([r / c, o / c]);
    }
    var Rg = {
      __proto__: null,
      clipPolygon: gl,
      polygonCenter: yl,
      centroid: aa
    };
    function vl(e, r) {
      if (!r || !e.length)
        return e.slice();
      var o = r * r;
      return e = Fg(e, o), e = Ng(e, o), e;
    }
    function bl(e, r, o) {
      return Math.sqrt(ji(e, r, o, !0));
    }
    function Ag(e, r, o) {
      return ji(e, r, o);
    }
    function Ng(e, r) {
      var o = e.length, c = typeof Uint8Array < "u" ? Uint8Array : Array, l = new c(o);
      l[0] = l[o - 1] = 1, ca(e, l, r, 0, o - 1);
      var f, p = [];
      for (f = 0; f < o; f++)
        l[f] && p.push(e[f]);
      return p;
    }
    function ca(e, r, o, c, l) {
      var f = 0, p, v, w;
      for (v = c + 1; v <= l - 1; v++)
        w = ji(e[v], e[c], e[l], !0), w > f && (p = v, f = w);
      f > o && (r[p] = 1, ca(e, r, o, c, p), ca(e, r, o, p, l));
    }
    function Fg(e, r) {
      for (var o = [e[0]], c = 1, l = 0, f = e.length; c < f; c++)
        Bg(e[c], e[l]) > r && (o.push(e[c]), l = c);
      return l < f - 1 && o.push(e[f - 1]), o;
    }
    var wl;
    function Sl(e, r, o, c, l) {
      var f = c ? wl : mn(e, o), p = mn(r, o), v, w, E;
      for (wl = p; ; ) {
        if (!(f | p))
          return [e, r];
        if (f & p)
          return !1;
        v = f || p, w = Qr(e, r, v, o, l), E = mn(w, o), v === f ? (e = w, f = E) : (r = w, p = E);
      }
    }
    function Qr(e, r, o, c, l) {
      var f = r.x - e.x, p = r.y - e.y, v = c.min, w = c.max, E, O;
      return o & 8 ? (E = e.x + f * (w.y - e.y) / p, O = w.y) : o & 4 ? (E = e.x + f * (v.y - e.y) / p, O = v.y) : o & 2 ? (E = w.x, O = e.y + p * (w.x - e.x) / f) : o & 1 && (E = v.x, O = e.y + p * (v.x - e.x) / f), new B(E, O, l);
    }
    function mn(e, r) {
      var o = 0;
      return e.x < r.min.x ? o |= 1 : e.x > r.max.x && (o |= 2), e.y < r.min.y ? o |= 4 : e.y > r.max.y && (o |= 8), o;
    }
    function Bg(e, r) {
      var o = r.x - e.x, c = r.y - e.y;
      return o * o + c * c;
    }
    function ji(e, r, o, c) {
      var l = r.x, f = r.y, p = o.x - l, v = o.y - f, w = p * p + v * v, E;
      return w > 0 && (E = ((e.x - l) * p + (e.y - f) * v) / w, E > 1 ? (l = o.x, f = o.y) : E > 0 && (l += p * E, f += v * E)), p = e.x - l, v = e.y - f, c ? p * p + v * v : new B(l, f);
    }
    function me(e) {
      return !ft(e[0]) || typeof e[0][0] != "object" && typeof e[0][0] < "u";
    }
    function Tl(e) {
      return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), me(e);
    }
    function xl(e, r) {
      var o, c, l, f, p, v, w, E;
      if (!e || e.length === 0)
        throw new Error("latlngs not passed");
      me(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
      var O = rt([0, 0]), j = mt(e), et = j.getNorthWest().distanceTo(j.getSouthWest()) * j.getNorthEast().distanceTo(j.getNorthWest());
      et < 1700 && (O = aa(e));
      var Yt = e.length, Ut = [];
      for (o = 0; o < Yt; o++) {
        var pe = rt(e[o]);
        Ut.push(r.project(rt([pe.lat - O.lat, pe.lng - O.lng])));
      }
      for (o = 0, c = 0; o < Yt - 1; o++)
        c += Ut[o].distanceTo(Ut[o + 1]) / 2;
      if (c === 0)
        E = Ut[0];
      else
        for (o = 0, f = 0; o < Yt - 1; o++)
          if (p = Ut[o], v = Ut[o + 1], l = p.distanceTo(v), f += l, f > c) {
            w = (f - c) / l, E = [
              v.x - w * (v.x - p.x),
              v.y - w * (v.y - p.y)
            ];
            break;
          }
      var ne = r.unproject(A(E));
      return rt([ne.lat + O.lat, ne.lng + O.lng]);
    }
    var zg = {
      __proto__: null,
      simplify: vl,
      pointToSegmentDistance: bl,
      closestPointOnSegment: Ag,
      clipSegment: Sl,
      _getEdgeIntersection: Qr,
      _getBitCode: mn,
      _sqClosestPointOnSegment: ji,
      isFlat: me,
      _flat: Tl,
      polylineCenter: xl
    }, ua = {
      project: function(e) {
        return new B(e.lng, e.lat);
      },
      unproject: function(e) {
        return new ut(e.y, e.x);
      },
      bounds: new F([-180, -90], [180, 90])
    }, la = {
      R: 6378137,
      R_MINOR: 6356752314245179e-9,
      bounds: new F([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
      project: function(e) {
        var r = Math.PI / 180, o = this.R, c = e.lat * r, l = this.R_MINOR / o, f = Math.sqrt(1 - l * l), p = f * Math.sin(c), v = Math.tan(Math.PI / 4 - c / 2) / Math.pow((1 - p) / (1 + p), f / 2);
        return c = -o * Math.log(Math.max(v, 1e-10)), new B(e.lng * r * o, c);
      },
      unproject: function(e) {
        for (var r = 180 / Math.PI, o = this.R, c = this.R_MINOR / o, l = Math.sqrt(1 - c * c), f = Math.exp(-e.y / o), p = Math.PI / 2 - 2 * Math.atan(f), v = 0, w = 0.1, E; v < 15 && Math.abs(w) > 1e-7; v++)
          E = l * Math.sin(p), E = Math.pow((1 - E) / (1 + E), l / 2), w = Math.PI / 2 - 2 * Math.atan(f * E) - p, p += w;
        return new ut(p * r, e.x * r / o);
      }
    }, $g = {
      __proto__: null,
      LonLat: ua,
      Mercator: la,
      SphericalMercator: Se
    }, Dg = a({}, te, {
      code: "EPSG:3395",
      projection: la,
      transformation: function() {
        var e = 0.5 / (Math.PI * la.R);
        return ee(e, 0.5, -e, 0.5);
      }()
    }), Pl = a({}, te, {
      code: "EPSG:4326",
      projection: ua,
      transformation: ee(1 / 180, 1, -1 / 180, 0.5)
    }), Zg = a({}, Ot, {
      projection: ua,
      transformation: ee(1, 0, -1, 0),
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
    Ot.Earth = te, Ot.EPSG3395 = Dg, Ot.EPSG3857 = ln, Ot.EPSG900913 = ue, Ot.EPSG4326 = Pl, Ot.Simple = Zg;
    var Pe = vt.extend({
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
        return this._map._targets[_(e)] = this, this;
      },
      removeInteractiveTarget: function(e) {
        return delete this._map._targets[_(e)], this;
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
    ot.include({
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the map
      addLayer: function(e) {
        if (!e._layerAdd)
          throw new Error("The provided object is not a Layer.");
        var r = _(e);
        return this._layers[r] ? this : (this._layers[r] = e, e._mapToAdd = this, e.beforeAdd && e.beforeAdd(this), this.whenReady(e._layerAdd, e), this);
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the map.
      removeLayer: function(e) {
        var r = _(e);
        return this._layers[r] ? (this._loaded && e.onRemove(this), delete this._layers[r], this._loaded && (this.fire("layerremove", { layer: e }), e.fire("remove")), e._map = e._mapToAdd = null, this) : this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the map
      hasLayer: function(e) {
        return _(e) in this._layers;
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
        e = e ? ft(e) ? e : [e] : [];
        for (var r = 0, o = e.length; r < o; r++)
          this.addLayer(e[r]);
      },
      _addZoomLimit: function(e) {
        (!isNaN(e.options.maxZoom) || !isNaN(e.options.minZoom)) && (this._zoomBoundLayers[_(e)] = e, this._updateZoomLevels());
      },
      _removeZoomLimit: function(e) {
        var r = _(e);
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
    var Wn = Pe.extend({
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
        return _(e);
      }
    }), jg = function(e, r) {
      return new Wn(e, r);
    }, Ze = Wn.extend({
      addLayer: function(e) {
        return this.hasLayer(e) ? this : (e.addEventParent(this), Wn.prototype.addLayer.call(this, e), this.fire("layeradd", { layer: e }));
      },
      removeLayer: function(e) {
        return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.removeEventParent(this), Wn.prototype.removeLayer.call(this, e), this.fire("layerremove", { layer: e })) : this;
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
        var e = new Lt();
        for (var r in this._layers) {
          var o = this._layers[r];
          e.extend(o.getBounds ? o.getBounds() : o.getLatLng());
        }
        return e;
      }
    }), Wg = function(e, r) {
      return new Ze(e, r);
    }, Hn = H.extend({
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
        var l = A(c), f = A(r === "shadow" && o.shadowAnchor || o.iconAnchor || l && l.divideBy(2, !0));
        e.className = "leaflet-marker-" + r + " " + (o.className || ""), f && (e.style.marginLeft = -f.x + "px", e.style.marginTop = -f.y + "px"), l && (e.style.width = l.x + "px", e.style.height = l.y + "px");
      },
      _createImg: function(e, r) {
        return r = r || document.createElement("img"), r.src = e, r;
      },
      _getIconUrl: function(e) {
        return N.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
      }
    });
    function Hg(e) {
      return new Hn(e);
    }
    var Wi = Hn.extend({
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
        return typeof Wi.imagePath != "string" && (Wi.imagePath = this._detectIconPath()), (this.options.imagePath || Wi.imagePath) + Hn.prototype._getIconUrl.call(this, e);
      },
      _stripUrl: function(e) {
        var r = function(o, c, l) {
          var f = c.exec(o);
          return f && f[l];
        };
        return e = r(e, /^url\((['"])?(.+)\1\)$/, 2), e && r(e, /^(.*)marker-icon\.png$/, 1);
      },
      _detectIconPath: function() {
        var e = lt("div", "leaflet-default-icon-path", document.body), r = Fi(e, "background-image") || Fi(e, "backgroundImage");
        if (document.body.removeChild(e), r = this._stripUrl(r), r)
          return r;
        var o = document.querySelector('link[href$="leaflet.css"]');
        return o ? o.href.substring(0, o.href.length - 11 - 1) : "";
      }
    }), El = Re.extend({
      initialize: function(e) {
        this._marker = e;
      },
      addHooks: function() {
        var e = this._marker._icon;
        this._draggable || (this._draggable = new en(e, e, !0)), this._draggable.on({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).enable(), q(e, "leaflet-marker-draggable");
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
        var r = this._marker, o = r._map, c = this._marker.options.autoPanSpeed, l = this._marker.options.autoPanPadding, f = fn(r._icon), p = o.getPixelBounds(), v = o.getPixelOrigin(), w = _t(
          p.min._subtract(v).add(l),
          p.max._subtract(v).subtract(l)
        );
        if (!w.contains(f)) {
          var E = A(
            (Math.max(w.max.x, f.x) - w.max.x) / (p.max.x - w.max.x) - (Math.min(w.min.x, f.x) - w.min.x) / (p.min.x - w.min.x),
            (Math.max(w.max.y, f.y) - w.max.y) / (p.max.y - w.max.y) - (Math.min(w.min.y, f.y) - w.min.y) / (p.min.y - w.min.y)
          ).multiplyBy(c);
          o.panBy(E, { animate: !1 }), this._draggable._newPos._add(E), this._draggable._startPos._add(E), Rt(r._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = Y(this._adjustPan.bind(this, e));
        }
      },
      _onDragStart: function() {
        this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
      },
      _onPreDrag: function(e) {
        this._marker.options.autoPan && (dt(this._panRequest), this._panRequest = Y(this._adjustPan.bind(this, e)));
      },
      _onDrag: function(e) {
        var r = this._marker, o = r._shadow, c = fn(r._icon), l = r._map.layerPointToLatLng(c);
        o && Rt(o, c), r._latlng = l, e.latlng = l, e.oldLatLng = this._oldLatLng, r.fire("move", e).fire("drag", e);
      },
      _onDragEnd: function(e) {
        dt(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", e);
      }
    }), ts = Pe.extend({
      // @section
      // @aka Marker options
      options: {
        // @option icon: Icon = *
        // Icon instance to use for rendering the marker.
        // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
        // If not specified, a common instance of `L.Icon.Default` is used.
        icon: new Wi(),
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
        I(this, r), this._latlng = rt(e);
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
        return this._latlng = rt(e), this.update(), this.fire("move", { oldLatLng: r, latlng: this._latlng });
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
        o !== this._icon && (this._icon && this._removeIcon(), c = !0, e.title && (o.title = e.title), o.tagName === "IMG" && (o.alt = e.alt || "")), q(o, r), e.keyboard && (o.tabIndex = "0", o.setAttribute("role", "button")), this._icon = o, e.riseOnHover && this.on({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && V(o, "focus", this._panOnFocus, this);
        var l = e.icon.createShadow(this._shadow), f = !1;
        l !== this._shadow && (this._removeShadow(), f = !0), l && (q(l, r), l.alt = ""), this._shadow = l, e.opacity < 1 && this._updateOpacity(), c && this.getPane().appendChild(this._icon), this._initInteraction(), l && f && this.getPane(e.shadowPane).appendChild(this._shadow);
      },
      _removeIcon: function() {
        this.options.riseOnHover && this.off({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && pt(this._icon, "focus", this._panOnFocus, this), xt(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
      },
      _removeShadow: function() {
        this._shadow && xt(this._shadow), this._shadow = null;
      },
      _setPos: function(e) {
        this._icon && Rt(this._icon, e), this._shadow && Rt(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
      },
      _updateZIndex: function(e) {
        this._icon && (this._icon.style.zIndex = this._zIndex + e);
      },
      _animateZoom: function(e) {
        var r = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
        this._setPos(r);
      },
      _initInteraction: function() {
        if (this.options.interactive && (q(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), El)) {
          var e = this.options.draggable;
          this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new El(this), e && this.dragging.enable();
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
          var r = this.options.icon.options, o = r.iconSize ? A(r.iconSize) : A(0, 0), c = r.iconAnchor ? A(r.iconAnchor) : A(0, 0);
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
    function Ug(e, r) {
      return new ts(e, r);
    }
    var nn = Pe.extend({
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
    }), es = nn.extend({
      // @section
      // @aka CircleMarker options
      options: {
        fill: !0,
        // @option radius: Number = 10
        // Radius of the circle marker, in pixels
        radius: 10
      },
      initialize: function(e, r) {
        I(this, r), this._latlng = rt(e), this._radius = this.options.radius;
      },
      // @method setLatLng(latLng: LatLng): this
      // Sets the position of a circle marker to a new location.
      setLatLng: function(e) {
        var r = this._latlng;
        return this._latlng = rt(e), this.redraw(), this.fire("move", { oldLatLng: r, latlng: this._latlng });
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
        return nn.prototype.setStyle.call(this, e), this.setRadius(r), this;
      },
      _project: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
      },
      _updateBounds: function() {
        var e = this._radius, r = this._radiusY || e, o = this._clickTolerance(), c = [e + o, r + o];
        this._pxBounds = new F(this._point.subtract(c), this._point.add(c));
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
    function Vg(e, r) {
      return new es(e, r);
    }
    var ha = es.extend({
      initialize: function(e, r, o) {
        if (typeof r == "number" && (r = a({}, o, { radius: r })), I(this, r), this._latlng = rt(e), isNaN(this.options.radius))
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
        return new Lt(
          this._map.layerPointToLatLng(this._point.subtract(e)),
          this._map.layerPointToLatLng(this._point.add(e))
        );
      },
      setStyle: nn.prototype.setStyle,
      _project: function() {
        var e = this._latlng.lng, r = this._latlng.lat, o = this._map, c = o.options.crs;
        if (c.distance === te.distance) {
          var l = Math.PI / 180, f = this._mRadius / te.R / l, p = o.project([r + f, e]), v = o.project([r - f, e]), w = p.add(v).divideBy(2), E = o.unproject(w).lat, O = Math.acos((Math.cos(f * l) - Math.sin(r * l) * Math.sin(E * l)) / (Math.cos(r * l) * Math.cos(E * l))) / l;
          (isNaN(O) || O === 0) && (O = f / Math.cos(Math.PI / 180 * r)), this._point = w.subtract(o.getPixelOrigin()), this._radius = isNaN(O) ? 0 : w.x - o.project([E, e - O]).x, this._radiusY = w.y - p.y;
        } else {
          var j = c.unproject(c.project(this._latlng).subtract([this._mRadius, 0]));
          this._point = o.latLngToLayerPoint(this._latlng), this._radius = this._point.x - o.latLngToLayerPoint(j).x;
        }
        this._updateBounds();
      }
    });
    function qg(e, r, o) {
      return new ha(e, r, o);
    }
    var je = nn.extend({
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
        for (var r = 1 / 0, o = null, c = ji, l, f, p = 0, v = this._parts.length; p < v; p++)
          for (var w = this._parts[p], E = 1, O = w.length; E < O; E++) {
            l = w[E - 1], f = w[E];
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
        return xl(this._defaultShape(), this._map.options.crs);
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
        return r = r || this._defaultShape(), e = rt(e), r.push(e), this._bounds.extend(e), this.redraw();
      },
      _setLatLngs: function(e) {
        this._bounds = new Lt(), this._latlngs = this._convertLatLngs(e);
      },
      _defaultShape: function() {
        return me(this._latlngs) ? this._latlngs : this._latlngs[0];
      },
      // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
      _convertLatLngs: function(e) {
        for (var r = [], o = me(e), c = 0, l = e.length; c < l; c++)
          o ? (r[c] = rt(e[c]), this._bounds.extend(r[c])) : r[c] = this._convertLatLngs(e[c]);
        return r;
      },
      _project: function() {
        var e = new F();
        this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
      },
      _updateBounds: function() {
        var e = this._clickTolerance(), r = new B(e, e);
        this._rawPxBounds && (this._pxBounds = new F([
          this._rawPxBounds.min.subtract(r),
          this._rawPxBounds.max.add(r)
        ]));
      },
      // recursively turns latlngs into a set of rings with projected coordinates
      _projectLatlngs: function(e, r, o) {
        var c = e[0] instanceof ut, l = e.length, f, p;
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
          var r = this._parts, o, c, l, f, p, v, w;
          for (o = 0, l = 0, f = this._rings.length; o < f; o++)
            for (w = this._rings[o], c = 0, p = w.length; c < p - 1; c++)
              v = Sl(w[c], w[c + 1], e, c, !0), v && (r[l] = r[l] || [], r[l].push(v[0]), (v[1] !== w[c + 1] || c === p - 2) && (r[l].push(v[1]), l++));
        }
      },
      // simplify each clipped part of the polyline for performance
      _simplifyPoints: function() {
        for (var e = this._parts, r = this.options.smoothFactor, o = 0, c = e.length; o < c; o++)
          e[o] = vl(e[o], r);
      },
      _update: function() {
        this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
      },
      _updatePath: function() {
        this._renderer._updatePoly(this);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(e, r) {
        var o, c, l, f, p, v, w = this._clickTolerance();
        if (!this._pxBounds || !this._pxBounds.contains(e))
          return !1;
        for (o = 0, f = this._parts.length; o < f; o++)
          for (v = this._parts[o], c = 0, p = v.length, l = p - 1; c < p; l = c++)
            if (!(!r && c === 0) && bl(e, v[l], v[c]) <= w)
              return !0;
        return !1;
      }
    });
    function Kg(e, r) {
      return new je(e, r);
    }
    je._flat = Tl;
    var Un = je.extend({
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
        return yl(this._defaultShape(), this._map.options.crs);
      },
      _convertLatLngs: function(e) {
        var r = je.prototype._convertLatLngs.call(this, e), o = r.length;
        return o >= 2 && r[0] instanceof ut && r[0].equals(r[o - 1]) && r.pop(), r;
      },
      _setLatLngs: function(e) {
        je.prototype._setLatLngs.call(this, e), me(this._latlngs) && (this._latlngs = [this._latlngs]);
      },
      _defaultShape: function() {
        return me(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
      },
      _clipPoints: function() {
        var e = this._renderer._bounds, r = this.options.weight, o = new B(r, r);
        if (e = new F(e.min.subtract(o), e.max.add(o)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          for (var c = 0, l = this._rings.length, f; c < l; c++)
            f = gl(this._rings[c], e, !0), f.length && this._parts.push(f);
        }
      },
      _updatePath: function() {
        this._renderer._updatePoly(this, !0);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(e) {
        var r = !1, o, c, l, f, p, v, w, E;
        if (!this._pxBounds || !this._pxBounds.contains(e))
          return !1;
        for (f = 0, w = this._parts.length; f < w; f++)
          for (o = this._parts[f], p = 0, E = o.length, v = E - 1; p < E; v = p++)
            c = o[p], l = o[v], c.y > e.y != l.y > e.y && e.x < (l.x - c.x) * (e.y - c.y) / (l.y - c.y) + c.x && (r = !r);
        return r || je.prototype._containsPoint.call(this, e, !0);
      }
    });
    function Gg(e, r) {
      return new Un(e, r);
    }
    var We = Ze.extend({
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
        var r = ft(e) ? e : e.features, o, c, l;
        if (r) {
          for (o = 0, c = r.length; o < c; o++)
            l = r[o], (l.geometries || l.geometry || l.features || l.coordinates) && this.addData(l);
          return this;
        }
        var f = this.options;
        if (f.filter && !f.filter(e))
          return this;
        var p = ns(e, f);
        return p ? (p.feature = ss(e), p.defaultOptions = p.options, this.resetStyle(p), f.onEachFeature && f.onEachFeature(e, p), this.addLayer(p)) : this;
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
    function ns(e, r) {
      var o = e.type === "Feature" ? e.geometry : e, c = o ? o.coordinates : null, l = [], f = r && r.pointToLayer, p = r && r.coordsToLatLng || fa, v, w, E, O;
      if (!c && !o)
        return null;
      switch (o.type) {
        case "Point":
          return v = p(c), kl(f, e, v, r);
        case "MultiPoint":
          for (E = 0, O = c.length; E < O; E++)
            v = p(c[E]), l.push(kl(f, e, v, r));
          return new Ze(l);
        case "LineString":
        case "MultiLineString":
          return w = is(c, o.type === "LineString" ? 0 : 1, p), new je(w, r);
        case "Polygon":
        case "MultiPolygon":
          return w = is(c, o.type === "Polygon" ? 1 : 2, p), new Un(w, r);
        case "GeometryCollection":
          for (E = 0, O = o.geometries.length; E < O; E++) {
            var j = ns({
              geometry: o.geometries[E],
              type: "Feature",
              properties: e.properties
            }, r);
            j && l.push(j);
          }
          return new Ze(l);
        case "FeatureCollection":
          for (E = 0, O = o.features.length; E < O; E++) {
            var et = ns(o.features[E], r);
            et && l.push(et);
          }
          return new Ze(l);
        default:
          throw new Error("Invalid GeoJSON object.");
      }
    }
    function kl(e, r, o, c) {
      return e ? e(r, o) : new ts(o, c && c.markersInheritOptions && c);
    }
    function fa(e) {
      return new ut(e[1], e[0], e[2]);
    }
    function is(e, r, o) {
      for (var c = [], l = 0, f = e.length, p; l < f; l++)
        p = r ? is(e[l], r - 1, o) : (o || fa)(e[l]), c.push(p);
      return c;
    }
    function da(e, r) {
      return e = rt(e), e.alt !== void 0 ? [x(e.lng, r), x(e.lat, r), x(e.alt, r)] : [x(e.lng, r), x(e.lat, r)];
    }
    function rs(e, r, o, c) {
      for (var l = [], f = 0, p = e.length; f < p; f++)
        l.push(r ? rs(e[f], me(e[f]) ? 0 : r - 1, o, c) : da(e[f], c));
      return !r && o && l.length > 0 && l.push(l[0].slice()), l;
    }
    function Vn(e, r) {
      return e.feature ? a({}, e.feature, { geometry: r }) : ss(r);
    }
    function ss(e) {
      return e.type === "Feature" || e.type === "FeatureCollection" ? e : {
        type: "Feature",
        properties: {},
        geometry: e
      };
    }
    var _a = {
      toGeoJSON: function(e) {
        return Vn(this, {
          type: "Point",
          coordinates: da(this.getLatLng(), e)
        });
      }
    };
    ts.include(_a), ha.include(_a), es.include(_a), je.include({
      toGeoJSON: function(e) {
        var r = !me(this._latlngs), o = rs(this._latlngs, r ? 1 : 0, !1, e);
        return Vn(this, {
          type: (r ? "Multi" : "") + "LineString",
          coordinates: o
        });
      }
    }), Un.include({
      toGeoJSON: function(e) {
        var r = !me(this._latlngs), o = r && !me(this._latlngs[0]), c = rs(this._latlngs, o ? 2 : r ? 1 : 0, !0, e);
        return r || (c = [c]), Vn(this, {
          type: (o ? "Multi" : "") + "Polygon",
          coordinates: c
        });
      }
    }), Wn.include({
      toMultiPoint: function(e) {
        var r = [];
        return this.eachLayer(function(o) {
          r.push(o.toGeoJSON(e).geometry.coordinates);
        }), Vn(this, {
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
              var p = ss(f);
              p.type === "FeatureCollection" ? c.push.apply(c, p.features) : c.push(p);
            }
          }
        }), o ? Vn(this, {
          geometries: c,
          type: "GeometryCollection"
        }) : {
          type: "FeatureCollection",
          features: c
        };
      }
    });
    function Ml(e, r) {
      return new We(e, r);
    }
    var Jg = Ml, os = Pe.extend({
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
        this._url = e, this._bounds = mt(r), I(this, o);
      },
      onAdd: function() {
        this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (q(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
      },
      onRemove: function() {
        xt(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
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
        return this._map && Zn(this._image), this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all overlays.
      bringToBack: function() {
        return this._map && jn(this._image), this;
      },
      // @method setUrl(url: String): this
      // Changes the URL of the image.
      setUrl: function(e) {
        return this._url = e, this._image && (this._image.src = e), this;
      },
      // @method setBounds(bounds: LatLngBounds): this
      // Update the bounds that this ImageOverlay covers
      setBounds: function(e) {
        return this._bounds = mt(e), this._map && this._reset(), this;
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
        var e = this._url.tagName === "IMG", r = this._image = e ? this._url : lt("img");
        if (q(r, "leaflet-image-layer"), this._zoomAnimated && q(r, "leaflet-zoom-animated"), this.options.className && q(r, this.options.className), r.onselectstart = b, r.onmousemove = b, r.onload = h(this.fire, this, "load"), r.onerror = h(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (r.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e) {
          this._url = r.src;
          return;
        }
        r.src = this._url, r.alt = this.options.alt;
      },
      _animateZoom: function(e) {
        var r = this._map.getZoomScale(e.zoom), o = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
        hn(this._image, o, r);
      },
      _reset: function() {
        var e = this._image, r = new F(
          this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
          this._map.latLngToLayerPoint(this._bounds.getSouthEast())
        ), o = r.getSize();
        Rt(e, r.min), e.style.width = o.x + "px", e.style.height = o.y + "px";
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
    }), Yg = function(e, r, o) {
      return new os(e, r, o);
    }, Ll = os.extend({
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
        var e = this._url.tagName === "VIDEO", r = this._image = e ? this._url : lt("video");
        if (q(r, "leaflet-image-layer"), this._zoomAnimated && q(r, "leaflet-zoom-animated"), this.options.className && q(r, this.options.className), r.onselectstart = b, r.onmousemove = b, r.onloadeddata = h(this.fire, this, "load"), e) {
          for (var o = r.getElementsByTagName("source"), c = [], l = 0; l < o.length; l++)
            c.push(o[l].src);
          this._url = o.length > 0 ? c : [r.src];
          return;
        }
        ft(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(r.style, "objectFit") && (r.style.objectFit = "fill"), r.autoplay = !!this.options.autoplay, r.loop = !!this.options.loop, r.muted = !!this.options.muted, r.playsInline = !!this.options.playsInline;
        for (var f = 0; f < this._url.length; f++) {
          var p = lt("source");
          p.src = this._url[f], r.appendChild(p);
        }
      }
      // @method getElement(): HTMLVideoElement
      // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
      // used by this overlay.
    });
    function Xg(e, r, o) {
      return new Ll(e, r, o);
    }
    var Il = os.extend({
      _initImage: function() {
        var e = this._image = this._url;
        q(e, "leaflet-image-layer"), this._zoomAnimated && q(e, "leaflet-zoom-animated"), this.options.className && q(e, this.options.className), e.onselectstart = b, e.onmousemove = b;
      }
      // @method getElement(): SVGElement
      // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
      // used by this overlay.
    });
    function Qg(e, r, o) {
      return new Il(e, r, o);
    }
    var Ae = Pe.extend({
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
        e && (e instanceof ut || ft(e)) ? (this._latlng = rt(e), I(this, r)) : (I(this, e), this._source = r), this.options.content && (this._content = this.options.content);
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
        this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && _e(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && _e(this._container, 1), this.bringToFront(), this.options.interactive && (q(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
      },
      onRemove: function(e) {
        e._fadeAnimated ? (_e(this._container, 0), this._removeTimeout = setTimeout(h(xt, void 0, this._container), 200)) : xt(this._container), this.options.interactive && (It(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
        return this._latlng = rt(e), this._map && (this._updatePosition(), this._adjustPan()), this;
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
        return this._map && Zn(this._container), this;
      },
      // @method bringToBack: this
      // Brings this overlay to the back of other overlays (in the same map pane).
      bringToBack: function() {
        return this._map && jn(this._container), this;
      },
      // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
      _prepareOpen: function(e) {
        var r = this._source;
        if (!r._map)
          return !1;
        if (r instanceof Ze) {
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
          var e = this._map.latLngToLayerPoint(this._latlng), r = A(this.options.offset), o = this._getAnchor();
          this._zoomAnimated ? Rt(this._container, e.add(o)) : r = r.add(e).add(o);
          var c = this._containerBottom = -r.y, l = this._containerLeft = -Math.round(this._containerWidth / 2) + r.x;
          this._container.style.bottom = c + "px", this._container.style.left = l + "px";
        }
      },
      _getAnchor: function() {
        return [0, 0];
      }
    });
    ot.include({
      _initOverlay: function(e, r, o, c) {
        var l = r;
        return l instanceof e || (l = new e(c).setContent(r)), o && l.setLatLng(o), l;
      }
    }), Pe.include({
      _initOverlay: function(e, r, o, c) {
        var l = o;
        return l instanceof e ? (I(l, c), l._source = this) : (l = r && !c ? r : new e(c, this), l.setContent(o)), l;
      }
    });
    var as = Ae.extend({
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
        return e = arguments.length ? e : this._source._map, !e.hasLayer(this) && e._popup && e._popup.options.autoClose && e.removeLayer(e._popup), e._popup = this, Ae.prototype.openOn.call(this, e);
      },
      onAdd: function(e) {
        Ae.prototype.onAdd.call(this, e), e.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof nn || this._source.on("preclick", dn));
      },
      onRemove: function(e) {
        Ae.prototype.onRemove.call(this, e), e.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof nn || this._source.off("preclick", dn));
      },
      getEvents: function() {
        var e = Ae.prototype.getEvents.call(this);
        return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (e.preclick = this.close), this.options.keepInView && (e.moveend = this._adjustPan), e;
      },
      _initLayout: function() {
        var e = "leaflet-popup", r = this._container = lt(
          "div",
          e + " " + (this.options.className || "") + " leaflet-zoom-animated"
        ), o = this._wrapper = lt("div", e + "-content-wrapper", r);
        if (this._contentNode = lt("div", e + "-content", o), Di(r), ia(this._contentNode), V(r, "contextmenu", dn), this._tipContainer = lt("div", e + "-tip-container", r), this._tip = lt("div", e + "-tip", this._tipContainer), this.options.closeButton) {
          var c = this._closeButton = lt("a", e + "-close-button", r);
          c.setAttribute("role", "button"), c.setAttribute("aria-label", "Close popup"), c.href = "#close", c.innerHTML = '<span aria-hidden="true">&#215;</span>', V(c, "click", function(l) {
            Kt(l), this.close();
          }, this);
        }
      },
      _updateLayout: function() {
        var e = this._contentNode, r = e.style;
        r.width = "", r.whiteSpace = "nowrap";
        var o = e.offsetWidth;
        o = Math.min(o, this.options.maxWidth), o = Math.max(o, this.options.minWidth), r.width = o + 1 + "px", r.whiteSpace = "", r.height = "";
        var c = e.offsetHeight, l = this.options.maxHeight, f = "leaflet-popup-scrolled";
        l && c > l ? (r.height = l + "px", q(e, f)) : It(e, f), this._containerWidth = this._container.offsetWidth;
      },
      _animateZoom: function(e) {
        var r = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), o = this._getAnchor();
        Rt(this._container, r.add(o));
      },
      _adjustPan: function() {
        if (this.options.autoPan) {
          if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
            this._autopanning = !1;
            return;
          }
          var e = this._map, r = parseInt(Fi(this._container, "marginBottom"), 10) || 0, o = this._container.offsetHeight + r, c = this._containerWidth, l = new B(this._containerLeft, -o - this._containerBottom);
          l._add(fn(this._container));
          var f = e.layerPointToContainerPoint(l), p = A(this.options.autoPanPadding), v = A(this.options.autoPanPaddingTopLeft || p), w = A(this.options.autoPanPaddingBottomRight || p), E = e.getSize(), O = 0, j = 0;
          f.x + c + w.x > E.x && (O = f.x + c - E.x + w.x), f.x - O - v.x < 0 && (O = f.x - v.x), f.y + o + w.y > E.y && (j = f.y + o - E.y + w.y), f.y - j - v.y < 0 && (j = f.y - v.y), (O || j) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([O, j]));
        }
      },
      _getAnchor: function() {
        return A(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
      }
    }), ty = function(e, r) {
      return new as(e, r);
    };
    ot.mergeOptions({
      closePopupOnClick: !0
    }), ot.include({
      // @method openPopup(popup: Popup): this
      // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
      // @alternative
      // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
      // Creates a popup with the specified content and options and opens it in the given point on a map.
      openPopup: function(e, r, o) {
        return this._initOverlay(as, e, r, o).openOn(this), this;
      },
      // @method closePopup(popup?: Popup): this
      // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
      closePopup: function(e) {
        return e = arguments.length ? e : this._popup, e && e.close(), this;
      }
    }), Pe.include({
      // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
      // Binds a popup to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindPopup: function(e, r) {
        return this._popup = this._initOverlay(as, this._popup, e, r), this._popupHandlersAdded || (this.on({
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
        return this._popup && (this instanceof Ze || (this._popup._source = this), this._popup._prepareOpen(e || this._latlng) && this._popup.openOn(this._map)), this;
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
          _n(e);
          var r = e.layer || e.target;
          if (this._popup._source === r && !(r instanceof nn)) {
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
    var cs = Ae.extend({
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
        Ae.prototype.onAdd.call(this, e), this.setOpacity(this.options.opacity), e.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
      },
      onRemove: function(e) {
        Ae.prototype.onRemove.call(this, e), e.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
      },
      getEvents: function() {
        var e = Ae.prototype.getEvents.call(this);
        return this.options.permanent || (e.preclick = this.close), e;
      },
      _initLayout: function() {
        var e = "leaflet-tooltip", r = e + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
        this._contentNode = this._container = lt("div", r), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + _(this));
      },
      _updateLayout: function() {
      },
      _adjustPan: function() {
      },
      _setPosition: function(e) {
        var r, o, c = this._map, l = this._container, f = c.latLngToContainerPoint(c.getCenter()), p = c.layerPointToContainerPoint(e), v = this.options.direction, w = l.offsetWidth, E = l.offsetHeight, O = A(this.options.offset), j = this._getAnchor();
        v === "top" ? (r = w / 2, o = E) : v === "bottom" ? (r = w / 2, o = 0) : v === "center" ? (r = w / 2, o = E / 2) : v === "right" ? (r = 0, o = E / 2) : v === "left" ? (r = w, o = E / 2) : p.x < f.x ? (v = "right", r = 0, o = E / 2) : (v = "left", r = w + (O.x + j.x) * 2, o = E / 2), e = e.subtract(A(r, o, !0)).add(O).add(j), It(l, "leaflet-tooltip-right"), It(l, "leaflet-tooltip-left"), It(l, "leaflet-tooltip-top"), It(l, "leaflet-tooltip-bottom"), q(l, "leaflet-tooltip-" + v), Rt(l, e);
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
        return A(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
      }
    }), ey = function(e, r) {
      return new cs(e, r);
    };
    ot.include({
      // @method openTooltip(tooltip: Tooltip): this
      // Opens the specified tooltip.
      // @alternative
      // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
      // Creates a tooltip with the specified content and options and open it.
      openTooltip: function(e, r, o) {
        return this._initOverlay(cs, e, r, o).openOn(this), this;
      },
      // @method closeTooltip(tooltip: Tooltip): this
      // Closes the tooltip given as parameter.
      closeTooltip: function(e) {
        return e.close(), this;
      }
    }), Pe.include({
      // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
      // Binds a tooltip to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindTooltip: function(e, r) {
        return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(cs, this._tooltip, e, r), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
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
        return this._tooltip && (this instanceof Ze || (this._tooltip._source = this), this._tooltip._prepareOpen(e) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
        r && (V(r, "focus", function() {
          this._tooltip._source = e, this.openTooltip();
        }, this), V(r, "blur", this.closeTooltip, this));
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
    var Cl = Hn.extend({
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
        if (o.html instanceof Element ? (Kr(r), r.appendChild(o.html)) : r.innerHTML = o.html !== !1 ? o.html : "", o.bgPos) {
          var c = A(o.bgPos);
          r.style.backgroundPosition = -c.x + "px " + -c.y + "px";
        }
        return this._setIconStyles(r, "icon"), r;
      },
      createShadow: function() {
        return null;
      }
    });
    function ny(e) {
      return new Cl(e);
    }
    Hn.Default = Wi;
    var Hi = Pe.extend({
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
        updateWhenIdle: N.mobile,
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
        this._removeAllTiles(), xt(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
      },
      // @method bringToFront: this
      // Brings the tile layer to the top of all tile layers.
      bringToFront: function() {
        return this._map && (Zn(this._container), this._setAutoZIndex(Math.max)), this;
      },
      // @method bringToBack: this
      // Brings the tile layer to the bottom of all tile layers.
      bringToBack: function() {
        return this._map && (jn(this._container), this._setAutoZIndex(Math.min)), this;
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
        return e instanceof B ? e : new B(e, e);
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
        if (this._map && !N.ielt9) {
          _e(this._container, this.options.opacity);
          var e = +/* @__PURE__ */ new Date(), r = !1, o = !1;
          for (var c in this._tiles) {
            var l = this._tiles[c];
            if (!(!l.current || !l.loaded)) {
              var f = Math.min(1, (e - l.loaded) / 200);
              _e(l.el, f), f < 1 ? r = !0 : (l.active ? o = !0 : this._onOpaqueTile(l), l.active = !0);
            }
          }
          o && !this._noPrune && this._pruneTiles(), r && (dt(this._fadeFrame), this._fadeFrame = Y(this._updateOpacity, this));
        }
      },
      _onOpaqueTile: b,
      _initContainer: function() {
        this._container || (this._container = lt("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
      },
      _updateLevels: function() {
        var e = this._tileZoom, r = this.options.maxZoom;
        if (e !== void 0) {
          for (var o in this._levels)
            o = Number(o), this._levels[o].el.children.length || o === e ? (this._levels[o].el.style.zIndex = r - Math.abs(e - o), this._onUpdateLevel(o)) : (xt(this._levels[o].el), this._removeTilesAtZoom(o), this._onRemoveLevel(o), delete this._levels[o]);
          var c = this._levels[e], l = this._map;
          return c || (c = this._levels[e] = {}, c.el = lt("div", "leaflet-tile-container leaflet-zoom-animated", this._container), c.el.style.zIndex = r, c.origin = l.project(l.unproject(l.getPixelOrigin()), e).round(), c.zoom = e, this._setZoomTransform(c, l.getCenter(), l.getZoom()), b(c.el.offsetWidth), this._onCreateLevel(c)), this._level = c, c;
        }
      },
      _onUpdateLevel: b,
      _onRemoveLevel: b,
      _onCreateLevel: b,
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
          xt(this._levels[e].el), this._onRemoveLevel(Number(e)), delete this._levels[e];
        this._removeAllTiles(), this._tileZoom = void 0;
      },
      _retainParent: function(e, r, o, c) {
        var l = Math.floor(e / 2), f = Math.floor(r / 2), p = o - 1, v = new B(+l, +f);
        v.z = +p;
        var w = this._tileCoordsToKey(v), E = this._tiles[w];
        return E && E.active ? (E.retain = !0, !0) : (E && E.loaded && (E.retain = !0), p > c ? this._retainParent(l, f, p, c) : !1);
      },
      _retainChildren: function(e, r, o, c) {
        for (var l = 2 * e; l < 2 * e + 2; l++)
          for (var f = 2 * r; f < 2 * r + 2; f++) {
            var p = new B(l, f);
            p.z = o + 1;
            var v = this._tileCoordsToKey(p), w = this._tiles[v];
            if (w && w.active) {
              w.retain = !0;
              continue;
            } else w && w.loaded && (w.retain = !0);
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
        N.any3d ? hn(e.el, l, c) : Rt(e.el, l);
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
        return new F(l.subtract(f), l.add(f));
      },
      // Private method to load tiles in the grid's active zoom level according to map bounds
      _update: function(e) {
        var r = this._map;
        if (r) {
          var o = this._clampZoom(r.getZoom());
          if (e === void 0 && (e = r.getCenter()), this._tileZoom !== void 0) {
            var c = this._getTiledPixelBounds(e), l = this._pxBoundsToTileRange(c), f = l.getCenter(), p = [], v = this.options.keepBuffer, w = new F(
              l.getBottomLeft().subtract([v, -v]),
              l.getTopRight().add([v, -v])
            );
            if (!(isFinite(l.min.x) && isFinite(l.min.y) && isFinite(l.max.x) && isFinite(l.max.y)))
              throw new Error("Attempted to load an infinite number of tiles");
            for (var E in this._tiles) {
              var O = this._tiles[E].coords;
              (O.z !== this._tileZoom || !w.contains(new B(O.x, O.y))) && (this._tiles[E].current = !1);
            }
            if (Math.abs(o - this._tileZoom) > 1) {
              this._setView(e, o);
              return;
            }
            for (var j = l.min.y; j <= l.max.y; j++)
              for (var et = l.min.x; et <= l.max.x; et++) {
                var Yt = new B(et, j);
                if (Yt.z = this._tileZoom, !!this._isValidTile(Yt)) {
                  var Ut = this._tiles[this._tileCoordsToKey(Yt)];
                  Ut ? Ut.current = !0 : p.push(Yt);
                }
              }
            if (p.sort(function(ne, Kn) {
              return ne.distanceTo(f) - Kn.distanceTo(f);
            }), p.length !== 0) {
              this._loading || (this._loading = !0, this.fire("loading"));
              var pe = document.createDocumentFragment();
              for (et = 0; et < p.length; et++)
                this._addTile(p[et], pe);
              this._level.el.appendChild(pe);
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
        return mt(this.options.bounds).overlaps(c);
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
        var r = this._tileCoordsToNwSe(e), o = new Lt(r[0], r[1]);
        return this.options.noWrap || (o = this._map.wrapLatLngBounds(o)), o;
      },
      // converts tile coordinates to key for the tile cache
      _tileCoordsToKey: function(e) {
        return e.x + ":" + e.y + ":" + e.z;
      },
      // converts tile cache key to coordinates
      _keyToTileCoords: function(e) {
        var r = e.split(":"), o = new B(+r[0], +r[1]);
        return o.z = +r[2], o;
      },
      _removeTile: function(e) {
        var r = this._tiles[e];
        r && (xt(r.el), delete this._tiles[e], this.fire("tileunload", {
          tile: r.el,
          coords: this._keyToTileCoords(e)
        }));
      },
      _initTile: function(e) {
        q(e, "leaflet-tile");
        var r = this.getTileSize();
        e.style.width = r.x + "px", e.style.height = r.y + "px", e.onselectstart = b, e.onmousemove = b, N.ielt9 && this.options.opacity < 1 && _e(e, this.options.opacity);
      },
      _addTile: function(e, r) {
        var o = this._getTilePos(e), c = this._tileCoordsToKey(e), l = this.createTile(this._wrapCoords(e), h(this._tileReady, this, e));
        this._initTile(l), this.createTile.length < 2 && Y(h(this._tileReady, this, e, null, l)), Rt(l, o), this._tiles[c] = {
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
        o = this._tiles[c], o && (o.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (_e(o.el, 0), dt(this._fadeFrame), this._fadeFrame = Y(this._updateOpacity, this)) : (o.active = !0, this._pruneTiles()), r || (q(o.el, "leaflet-tile-loaded"), this.fire("tileload", {
          tile: o.el,
          coords: e
        })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), N.ielt9 || !this._map._fadeAnimated ? Y(this._pruneTiles, this) : setTimeout(h(this._pruneTiles, this), 250)));
      },
      _getTilePos: function(e) {
        return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
      },
      _wrapCoords: function(e) {
        var r = new B(
          this._wrapX ? S(e.x, this._wrapX) : e.x,
          this._wrapY ? S(e.y, this._wrapY) : e.y
        );
        return r.z = e.z, r;
      },
      _pxBoundsToTileRange: function(e) {
        var r = this.getTileSize();
        return new F(
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
    function iy(e) {
      return new Hi(e);
    }
    var qn = Hi.extend({
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
        this._url = e, r = I(this, r), r.detectRetina && N.retina && r.maxZoom > 0 ? (r.tileSize = Math.floor(r.tileSize / 2), r.zoomReverse ? (r.zoomOffset--, r.minZoom = Math.min(r.maxZoom, r.minZoom + 1)) : (r.zoomOffset++, r.maxZoom = Math.max(r.minZoom, r.maxZoom - 1)), r.minZoom = Math.max(0, r.minZoom)) : r.zoomReverse ? r.minZoom = Math.min(r.maxZoom, r.minZoom) : r.maxZoom = Math.max(r.minZoom, r.maxZoom), typeof r.subdomains == "string" && (r.subdomains = r.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
        return V(o, "load", h(this._tileOnLoad, this, r, o)), V(o, "error", h(this._tileOnError, this, r, o)), (this.options.crossOrigin || this.options.crossOrigin === "") && (o.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (o.referrerPolicy = this.options.referrerPolicy), o.alt = "", o.src = this.getTileUrl(e), o;
      },
      // @section Extension methods
      // @uninheritable
      // Layers extending `TileLayer` might reimplement the following method.
      // @method getTileUrl(coords: Object): String
      // Called only internally, returns the URL for a tile given its coordinates.
      // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
      getTileUrl: function(e) {
        var r = {
          r: N.retina ? "@2x" : "",
          s: this._getSubdomain(e),
          x: e.x,
          y: e.y,
          z: this._getZoomForUrl()
        };
        if (this._map && !this._map.options.crs.infinite) {
          var o = this._globalTileRange.max.y - e.y;
          this.options.tms && (r.y = o), r["-y"] = o;
        }
        return it(this._url, a(r, this.options));
      },
      _tileOnLoad: function(e, r) {
        N.ielt9 ? setTimeout(h(e, this, null, r), 0) : e(null, r);
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
          if (this._tiles[e].coords.z !== this._tileZoom && (r = this._tiles[e].el, r.onload = b, r.onerror = b, !r.complete)) {
            r.src = qt;
            var o = this._tiles[e].coords;
            xt(r), delete this._tiles[e], this.fire("tileabort", {
              tile: r,
              coords: o
            });
          }
      },
      _removeTile: function(e) {
        var r = this._tiles[e];
        if (r)
          return r.el.setAttribute("src", qt), Hi.prototype._removeTile.call(this, e);
      },
      _tileReady: function(e, r, o) {
        if (!(!this._map || o && o.getAttribute("src") === qt))
          return Hi.prototype._tileReady.call(this, e, r, o);
      }
    });
    function Ol(e, r) {
      return new qn(e, r);
    }
    var Rl = qn.extend({
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
        var l = r.detectRetina && N.retina ? 2 : 1, f = this.getTileSize();
        o.width = f.x * l, o.height = f.y * l, this.wmsParams = o;
      },
      onAdd: function(e) {
        this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
        var r = this._wmsVersion >= 1.3 ? "crs" : "srs";
        this.wmsParams[r] = this._crs.code, qn.prototype.onAdd.call(this, e);
      },
      getTileUrl: function(e) {
        var r = this._tileCoordsToNwSe(e), o = this._crs, c = _t(o.project(r[0]), o.project(r[1])), l = c.min, f = c.max, p = (this._wmsVersion >= 1.3 && this._crs === Pl ? [l.y, l.x, f.y, f.x] : [l.x, l.y, f.x, f.y]).join(","), v = qn.prototype.getTileUrl.call(this, e);
        return v + D(this.wmsParams, v, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + p;
      },
      // @method setParams(params: Object, noRedraw?: Boolean): this
      // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
      setParams: function(e, r) {
        return a(this.wmsParams, e), r || this.redraw(), this;
      }
    });
    function ry(e, r) {
      return new Rl(e, r);
    }
    qn.WMS = Rl, Ol.wms = ry;
    var He = Pe.extend({
      // @section
      // @aka Renderer options
      options: {
        // @option padding: Number = 0.1
        // How much to extend the clip area around the map view (relative to its size)
        // e.g. 0.1 would be 10% of map view in each direction
        padding: 0.1
      },
      initialize: function(e) {
        I(this, e), _(this), this._layers = this._layers || {};
      },
      onAdd: function() {
        this._container || (this._initContainer(), q(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
        N.any3d ? hn(this._container, f, o) : Rt(this._container, f);
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
        this._bounds = new F(o, o.add(r.multiplyBy(1 + e * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
      }
    }), Al = He.extend({
      // @section
      // @aka Canvas options
      options: {
        // @option tolerance: Number = 0
        // How much to extend the click tolerance around a path/object on the map.
        tolerance: 0
      },
      getEvents: function() {
        var e = He.prototype.getEvents.call(this);
        return e.viewprereset = this._onViewPreReset, e;
      },
      _onViewPreReset: function() {
        this._postponeUpdatePaths = !0;
      },
      onAdd: function() {
        He.prototype.onAdd.call(this), this._draw();
      },
      _initContainer: function() {
        var e = this._container = document.createElement("canvas");
        V(e, "mousemove", this._onMouseMove, this), V(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), V(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
      },
      _destroyContainer: function() {
        dt(this._redrawRequest), delete this._ctx, xt(this._container), pt(this._container), delete this._container;
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
          He.prototype._update.call(this);
          var e = this._bounds, r = this._container, o = e.getSize(), c = N.retina ? 2 : 1;
          Rt(r, e.min), r.width = c * o.x, r.height = c * o.y, r.style.width = o.x + "px", r.style.height = o.y + "px", N.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
        }
      },
      _reset: function() {
        He.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
      },
      _initPath: function(e) {
        this._updateDashArray(e), this._layers[_(e)] = e;
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
        o ? o.prev = c : this._drawLast = c, c ? c.next = o : this._drawFirst = o, delete e._order, delete this._layers[_(e)], this._requestRedraw(e);
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
        this._map && (this._extendRedrawBounds(e), this._redrawRequest = this._redrawRequest || Y(this._redraw, this));
      },
      _extendRedrawBounds: function(e) {
        if (e._pxBounds) {
          var r = (e.options.weight || 0) + 1;
          this._redrawBounds = this._redrawBounds || new F(), this._redrawBounds.extend(e._pxBounds.min.subtract([r, r])), this._redrawBounds.extend(e._pxBounds.max.add([r, r]));
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
          var o, c, l, f, p = e._parts, v = p.length, w = this._ctx;
          if (v) {
            for (w.beginPath(), o = 0; o < v; o++) {
              for (c = 0, l = p[o].length; c < l; c++)
                f = p[o][c], w[c ? "lineTo" : "moveTo"](f.x, f.y);
              r && w.closePath();
            }
            this._fillStroke(w, e);
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
          c !== this._hoveredLayer && (this._handleMouseOut(e), c && (q(this._container, "leaflet-interactive"), this._fireEvent([c], e, "mouseover"), this._hoveredLayer = c)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(h(function() {
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
    function Nl(e) {
      return N.canvas ? new Al(e) : null;
    }
    var Ui = function() {
      try {
        return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(e) {
          return document.createElement("<lvml:" + e + ' class="lvml">');
        };
      } catch {
      }
      return function(e) {
        return document.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }(), sy = {
      _initContainer: function() {
        this._container = lt("div", "leaflet-vml-container");
      },
      _update: function() {
        this._map._animatingZoom || (He.prototype._update.call(this), this.fire("update"));
      },
      _initPath: function(e) {
        var r = e._container = Ui("shape");
        q(r, "leaflet-vml-shape " + (this.options.className || "")), r.coordsize = "1 1", e._path = Ui("path"), r.appendChild(e._path), this._updateStyle(e), this._layers[_(e)] = e;
      },
      _addPath: function(e) {
        var r = e._container;
        this._container.appendChild(r), e.options.interactive && e.addInteractiveTarget(r);
      },
      _removePath: function(e) {
        var r = e._container;
        xt(r), e.removeInteractiveTarget(r), delete this._layers[_(e)];
      },
      _updateStyle: function(e) {
        var r = e._stroke, o = e._fill, c = e.options, l = e._container;
        l.stroked = !!c.stroke, l.filled = !!c.fill, c.stroke ? (r || (r = e._stroke = Ui("stroke")), l.appendChild(r), r.weight = c.weight + "px", r.color = c.color, r.opacity = c.opacity, c.dashArray ? r.dashStyle = ft(c.dashArray) ? c.dashArray.join(" ") : c.dashArray.replace(/( *, *)/g, " ") : r.dashStyle = "", r.endcap = c.lineCap.replace("butt", "flat"), r.joinstyle = c.lineJoin) : r && (l.removeChild(r), e._stroke = null), c.fill ? (o || (o = e._fill = Ui("fill")), l.appendChild(o), o.color = c.fillColor || c.color, o.opacity = c.fillOpacity) : o && (l.removeChild(o), e._fill = null);
      },
      _updateCircle: function(e) {
        var r = e._point.round(), o = Math.round(e._radius), c = Math.round(e._radiusY || o);
        this._setPath(e, e._empty() ? "M0 0" : "AL " + r.x + "," + r.y + " " + o + "," + c + " 0," + 65535 * 360);
      },
      _setPath: function(e, r) {
        e._path.v = r;
      },
      _bringToFront: function(e) {
        Zn(e._container);
      },
      _bringToBack: function(e) {
        jn(e._container);
      }
    }, us = N.vml ? Ui : $n, Vi = He.extend({
      _initContainer: function() {
        this._container = us("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = us("g"), this._container.appendChild(this._rootGroup);
      },
      _destroyContainer: function() {
        xt(this._container), pt(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
      },
      _update: function() {
        if (!(this._map._animatingZoom && this._bounds)) {
          He.prototype._update.call(this);
          var e = this._bounds, r = e.getSize(), o = this._container;
          (!this._svgSize || !this._svgSize.equals(r)) && (this._svgSize = r, o.setAttribute("width", r.x), o.setAttribute("height", r.y)), Rt(o, e.min), o.setAttribute("viewBox", [e.min.x, e.min.y, r.x, r.y].join(" ")), this.fire("update");
        }
      },
      // methods below are called by vector layers implementations
      _initPath: function(e) {
        var r = e._path = us("path");
        e.options.className && q(r, e.options.className), e.options.interactive && q(r, "leaflet-interactive"), this._updateStyle(e), this._layers[_(e)] = e;
      },
      _addPath: function(e) {
        this._rootGroup || this._initContainer(), this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path);
      },
      _removePath: function(e) {
        xt(e._path), e.removeInteractiveTarget(e._path), delete this._layers[_(e)];
      },
      _updatePath: function(e) {
        e._project(), e._update();
      },
      _updateStyle: function(e) {
        var r = e._path, o = e.options;
        r && (o.stroke ? (r.setAttribute("stroke", o.color), r.setAttribute("stroke-opacity", o.opacity), r.setAttribute("stroke-width", o.weight), r.setAttribute("stroke-linecap", o.lineCap), r.setAttribute("stroke-linejoin", o.lineJoin), o.dashArray ? r.setAttribute("stroke-dasharray", o.dashArray) : r.removeAttribute("stroke-dasharray"), o.dashOffset ? r.setAttribute("stroke-dashoffset", o.dashOffset) : r.removeAttribute("stroke-dashoffset")) : r.setAttribute("stroke", "none"), o.fill ? (r.setAttribute("fill", o.fillColor || o.color), r.setAttribute("fill-opacity", o.fillOpacity), r.setAttribute("fill-rule", o.fillRule || "evenodd")) : r.setAttribute("fill", "none"));
      },
      _updatePoly: function(e, r) {
        this._setPath(e, Hr(e._parts, r));
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
        Zn(e._path);
      },
      _bringToBack: function(e) {
        jn(e._path);
      }
    });
    N.vml && Vi.include(sy);
    function Fl(e) {
      return N.svg || N.vml ? new Vi(e) : null;
    }
    ot.include({
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
        return this.options.preferCanvas && Nl(e) || Fl(e);
      }
    });
    var Bl = Un.extend({
      initialize: function(e, r) {
        Un.prototype.initialize.call(this, this._boundsToLatLngs(e), r);
      },
      // @method setBounds(latLngBounds: LatLngBounds): this
      // Redraws the rectangle with the passed bounds.
      setBounds: function(e) {
        return this.setLatLngs(this._boundsToLatLngs(e));
      },
      _boundsToLatLngs: function(e) {
        return e = mt(e), [
          e.getSouthWest(),
          e.getNorthWest(),
          e.getNorthEast(),
          e.getSouthEast()
        ];
      }
    });
    function oy(e, r) {
      return new Bl(e, r);
    }
    Vi.create = us, Vi.pointsToPath = Hr, We.geometryToLayer = ns, We.coordsToLatLng = fa, We.coordsToLatLngs = is, We.latLngToCoords = da, We.latLngsToCoords = rs, We.getFeature = Vn, We.asFeature = ss, ot.mergeOptions({
      // @option boxZoom: Boolean = true
      // Whether the map can be zoomed to a rectangular area specified by
      // dragging the mouse while pressing the shift key.
      boxZoom: !0
    });
    var zl = Re.extend({
      initialize: function(e) {
        this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
      },
      addHooks: function() {
        V(this._container, "mousedown", this._onMouseDown, this);
      },
      removeHooks: function() {
        pt(this._container, "mousedown", this._onMouseDown, this);
      },
      moved: function() {
        return this._moved;
      },
      _destroy: function() {
        xt(this._pane), delete this._pane;
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
        this._clearDeferredResetState(), this._resetState(), Bi(), Go(), this._startPoint = this._map.mouseEventToContainerPoint(e), V(document, {
          contextmenu: _n,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseMove: function(e) {
        this._moved || (this._moved = !0, this._box = lt("div", "leaflet-zoom-box", this._container), q(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
        var r = new F(this._point, this._startPoint), o = r.getSize();
        Rt(this._box, r.min), this._box.style.width = o.x + "px", this._box.style.height = o.y + "px";
      },
      _finish: function() {
        this._moved && (xt(this._box), It(this._container, "leaflet-crosshair")), zi(), Jo(), pt(document, {
          contextmenu: _n,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseUp: function(e) {
        if (!(e.which !== 1 && e.button !== 1) && (this._finish(), !!this._moved)) {
          this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(h(this._resetState, this), 0);
          var r = new Lt(
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
    ot.addInitHook("addHandler", "boxZoom", zl), ot.mergeOptions({
      // @option doubleClickZoom: Boolean|String = true
      // Whether the map can be zoomed in by double clicking on it and
      // zoomed out by double clicking while holding shift. If passed
      // `'center'`, double-click zoom will zoom to the center of the
      //  view regardless of where the mouse was.
      doubleClickZoom: !0
    });
    var $l = Re.extend({
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
    ot.addInitHook("addHandler", "doubleClickZoom", $l), ot.mergeOptions({
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
    var Dl = Re.extend({
      addHooks: function() {
        if (!this._draggable) {
          var e = this._map;
          this._draggable = new en(e._mapPane, e._container), this._draggable.on({
            dragstart: this._onDragStart,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this), this._draggable.on("predrag", this._onPreDragLimit, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), e.on("zoomend", this._onZoomEnd, this), e.whenReady(this._onZoomEnd, this));
        }
        q(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
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
          var r = mt(this._map.options.maxBounds);
          this._offsetLimit = _t(
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
          var l = this._lastPos.subtract(this._positions[0]), f = (this._lastTime - this._times[0]) / 1e3, p = o.easeLinearity, v = l.multiplyBy(p / f), w = v.distanceTo([0, 0]), E = Math.min(o.inertiaMaxSpeed, w), O = v.multiplyBy(E / w), j = E / (o.inertiaDeceleration * p), et = O.multiplyBy(-j / 2).round();
          !et.x && !et.y ? r.fire("moveend") : (et = r._limitOffset(et, r.options.maxBounds), Y(function() {
            r.panBy(et, {
              duration: j,
              easeLinearity: p,
              noMoveStart: !0,
              animate: !0
            });
          }));
        }
      }
    });
    ot.addInitHook("addHandler", "dragging", Dl), ot.mergeOptions({
      // @option keyboard: Boolean = true
      // Makes the map focusable and allows users to navigate the map with keyboard
      // arrows and `+`/`-` keys.
      keyboard: !0,
      // @option keyboardPanDelta: Number = 80
      // Amount of pixels to pan when pressing an arrow key.
      keyboardPanDelta: 80
    });
    var Zl = Re.extend({
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
        e.tabIndex <= 0 && (e.tabIndex = "0"), V(e, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this), this._map.on({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      removeHooks: function() {
        this._removeHooks(), pt(this._map._container, {
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
        V(document, "keydown", this._onKeyDown, this);
      },
      _removeHooks: function() {
        pt(document, "keydown", this._onKeyDown, this);
      },
      _onKeyDown: function(e) {
        if (!(e.altKey || e.ctrlKey || e.metaKey)) {
          var r = e.keyCode, o = this._map, c;
          if (r in this._panKeys) {
            if (!o._panAnim || !o._panAnim._inProgress)
              if (c = this._panKeys[r], e.shiftKey && (c = A(c).multiplyBy(3)), o.options.maxBounds && (c = o._limitOffset(A(c), o.options.maxBounds)), o.options.worldCopyJump) {
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
          _n(e);
        }
      }
    });
    ot.addInitHook("addHandler", "keyboard", Zl), ot.mergeOptions({
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
    var jl = Re.extend({
      addHooks: function() {
        V(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
      },
      removeHooks: function() {
        pt(this._map._container, "wheel", this._onWheelScroll, this);
      },
      _onWheelScroll: function(e) {
        var r = fl(e), o = this._map.options.wheelDebounceTime;
        this._delta += r, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
        var c = Math.max(o - (+/* @__PURE__ */ new Date() - this._startTime), 0);
        clearTimeout(this._timer), this._timer = setTimeout(h(this._performZoom, this), c), _n(e);
      },
      _performZoom: function() {
        var e = this._map, r = e.getZoom(), o = this._map.options.zoomSnap || 0;
        e._stop();
        var c = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), l = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(c)))) / Math.LN2, f = o ? Math.ceil(l / o) * o : l, p = e._limitZoom(r + (this._delta > 0 ? f : -f)) - r;
        this._delta = 0, this._startTime = null, p && (e.options.scrollWheelZoom === "center" ? e.setZoom(r + p) : e.setZoomAround(this._lastMousePos, r + p));
      }
    });
    ot.addInitHook("addHandler", "scrollWheelZoom", jl);
    var ay = 600;
    ot.mergeOptions({
      // @section Touch interaction options
      // @option tapHold: Boolean
      // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
      tapHold: N.touchNative && N.safari && N.mobile,
      // @option tapTolerance: Number = 15
      // The max number of pixels a user can shift his finger during touch
      // for it to be considered a valid tap.
      tapTolerance: 15
    });
    var Wl = Re.extend({
      addHooks: function() {
        V(this._map._container, "touchstart", this._onDown, this);
      },
      removeHooks: function() {
        pt(this._map._container, "touchstart", this._onDown, this);
      },
      _onDown: function(e) {
        if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
          var r = e.touches[0];
          this._startPos = this._newPos = new B(r.clientX, r.clientY), this._holdTimeout = setTimeout(h(function() {
            this._cancel(), this._isTapValid() && (V(document, "touchend", Kt), V(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", r));
          }, this), ay), V(document, "touchend touchcancel contextmenu", this._cancel, this), V(document, "touchmove", this._onMove, this);
        }
      },
      _cancelClickPrevent: function e() {
        pt(document, "touchend", Kt), pt(document, "touchend touchcancel", e);
      },
      _cancel: function() {
        clearTimeout(this._holdTimeout), pt(document, "touchend touchcancel contextmenu", this._cancel, this), pt(document, "touchmove", this._onMove, this);
      },
      _onMove: function(e) {
        var r = e.touches[0];
        this._newPos = new B(r.clientX, r.clientY);
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
    ot.addInitHook("addHandler", "tapHold", Wl), ot.mergeOptions({
      // @section Touch interaction options
      // @option touchZoom: Boolean|String = *
      // Whether the map can be zoomed by touch-dragging with two fingers. If
      // passed `'center'`, it will zoom to the center of the view regardless of
      // where the touch events (fingers) were. Enabled for touch-capable web
      // browsers.
      touchZoom: N.touch,
      // @option bounceAtZoomLimits: Boolean = true
      // Set it to false if you don't want the map to zoom beyond min/max zoom
      // and then bounce back when pinch-zooming.
      bounceAtZoomLimits: !0
    });
    var Hl = Re.extend({
      addHooks: function() {
        q(this._map._container, "leaflet-touch-zoom"), V(this._map._container, "touchstart", this._onTouchStart, this);
      },
      removeHooks: function() {
        It(this._map._container, "leaflet-touch-zoom"), pt(this._map._container, "touchstart", this._onTouchStart, this);
      },
      _onTouchStart: function(e) {
        var r = this._map;
        if (!(!e.touches || e.touches.length !== 2 || r._animatingZoom || this._zooming)) {
          var o = r.mouseEventToContainerPoint(e.touches[0]), c = r.mouseEventToContainerPoint(e.touches[1]);
          this._centerPoint = r.getSize()._divideBy(2), this._startLatLng = r.containerPointToLatLng(this._centerPoint), r.options.touchZoom !== "center" && (this._pinchStartLatLng = r.containerPointToLatLng(o.add(c)._divideBy(2))), this._startDist = o.distanceTo(c), this._startZoom = r.getZoom(), this._moved = !1, this._zooming = !0, r._stop(), V(document, "touchmove", this._onTouchMove, this), V(document, "touchend touchcancel", this._onTouchEnd, this), Kt(e);
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
          this._moved || (r._moveStart(!0, !1), this._moved = !0), dt(this._animRequest);
          var p = h(r._move, r, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
          this._animRequest = Y(p, this, !0), Kt(e);
        }
      },
      _onTouchEnd: function() {
        if (!this._moved || !this._zooming) {
          this._zooming = !1;
          return;
        }
        this._zooming = !1, dt(this._animRequest), pt(document, "touchmove", this._onTouchMove, this), pt(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
      }
    });
    ot.addInitHook("addHandler", "touchZoom", Hl), ot.BoxZoom = zl, ot.DoubleClickZoom = $l, ot.Drag = Dl, ot.Keyboard = Zl, ot.ScrollWheelZoom = jl, ot.TapHold = Wl, ot.TouchZoom = Hl, i.Bounds = F, i.Browser = N, i.CRS = Ot, i.Canvas = Al, i.Circle = ha, i.CircleMarker = es, i.Class = H, i.Control = xe, i.DivIcon = Cl, i.DivOverlay = Ae, i.DomEvent = Pg, i.DomUtil = Tg, i.Draggable = en, i.Evented = vt, i.FeatureGroup = Ze, i.GeoJSON = We, i.GridLayer = Hi, i.Handler = Re, i.Icon = Hn, i.ImageOverlay = os, i.LatLng = ut, i.LatLngBounds = Lt, i.Layer = Pe, i.LayerGroup = Wn, i.LineUtil = zg, i.Map = ot, i.Marker = ts, i.Mixin = Og, i.Path = nn, i.Point = B, i.PolyUtil = Rg, i.Polygon = Un, i.Polyline = je, i.Popup = as, i.PosAnimation = dl, i.Projection = $g, i.Rectangle = Bl, i.Renderer = He, i.SVG = Vi, i.SVGOverlay = Il, i.TileLayer = qn, i.Tooltip = cs, i.Transformation = Te, i.Util = Ie, i.VideoOverlay = Ll, i.bind = h, i.bounds = _t, i.canvas = Nl, i.circle = qg, i.circleMarker = Vg, i.control = Zi, i.divIcon = ny, i.extend = a, i.featureGroup = Wg, i.geoJSON = Ml, i.geoJson = Jg, i.gridLayer = iy, i.icon = Hg, i.imageOverlay = Yg, i.latLng = rt, i.latLngBounds = mt, i.layerGroup = jg, i.map = Eg, i.marker = Ug, i.point = A, i.polygon = Gg, i.polyline = Kg, i.popup = ty, i.rectangle = oy, i.setOptions = I, i.stamp = _, i.svg = Fl, i.svgOverlay = Qg, i.tileLayer = Ol, i.tooltip = ey, i.transformation = ee, i.version = s, i.videoOverlay = Xg;
    var cy = window.L;
    i.noConflict = function() {
      return window.L = cy, this;
    }, window.L = i;
  });
})(xc, xc.exports);
var zn = xc.exports;
const jr = /* @__PURE__ */ EL(zn);
function Wr(t, n, i) {
  return Object.freeze({
    instance: t,
    context: n,
    container: i
  });
}
function $o(t, n) {
  return n == null ? function(s, a) {
    const u = Pt();
    return u.current || (u.current = t(s, a)), u;
  } : function(s, a) {
    const u = Pt();
    u.current || (u.current = t(s, a));
    const h = Pt(s), { instance: d } = u.current;
    return Jt(function() {
      h.current !== s && (n(d, s, h.current), h.current = s);
    }, [
      d,
      s,
      a
    ]), u;
  };
}
function Hp(t, n) {
  Jt(function() {
    return (n.layerContainer ?? n.map).addLayer(t.instance), function() {
      var u;
      (u = n.layerContainer) == null || u.removeLayer(t.instance), n.map.removeLayer(t.instance);
    };
  }, [
    n,
    t
  ]);
}
function Up(t) {
  return function(i) {
    const s = Bo(), a = t(zo(i, s), s);
    return Dp(s.map, i.attribution), zu(a.current, i.eventHandlers), Hp(a.current, s), a;
  };
}
function kL(t, n) {
  const i = Pt();
  Jt(function() {
    if (n.pathOptions !== i.current) {
      const a = n.pathOptions ?? {};
      t.instance.setStyle(a), i.current = a;
    }
  }, [
    t,
    n
  ]);
}
function ML(t) {
  return function(i) {
    const s = Bo(), a = t(zo(i, s), s);
    return zu(a.current, i.eventHandlers), Hp(a.current, s), kL(a.current, i), a;
  };
}
function LL(t, n) {
  const i = $o(t, n), s = Up(i);
  return Wp(s);
}
function IL(t, n) {
  const i = $o(t), s = xL(i, n);
  return SL(s);
}
function Vp(t, n) {
  const i = $o(t, n), s = ML(i);
  return Wp(s);
}
function CL(t, n) {
  const i = $o(t, n), s = Up(i);
  return TL(s);
}
function OL(t, n, i) {
  const { opacity: s, zIndex: a } = n;
  s != null && s !== i.opacity && t.setOpacity(s), a != null && a !== i.zIndex && t.setZIndex(a);
}
function qp() {
  return Bo().map;
}
function RL(t) {
  const n = qp();
  return Jt(function() {
    return n.on(t), function() {
      n.off(t);
    };
  }, [
    n,
    t
  ]), n;
}
const AL = Vp(function({ center: n, children: i, ...s }, a) {
  const u = new zn.CircleMarker(n, s);
  return Wr(u, Bu(a, {
    overlayContainer: u
  }));
}, vL);
function Pc() {
  return Pc = Object.assign || function(t) {
    for (var n = 1; n < arguments.length; n++) {
      var i = arguments[n];
      for (var s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s]);
    }
    return t;
  }, Pc.apply(this, arguments);
}
function NL({ bounds: t, boundsOptions: n, center: i, children: s, className: a, id: u, placeholder: h, style: d, whenReady: _, zoom: g, ...S }, b) {
  const [x] = Gt({
    className: a,
    id: u,
    style: d
  }), [P, k] = Gt(null);
  so(b, () => (P == null ? void 0 : P.map) ?? null, [
    P
  ]);
  const I = Qn((st) => {
    if (st !== null && P === null) {
      const it = new zn.Map(st, S);
      i != null && g != null ? it.setView(i, g) : t != null && it.fitBounds(t, n), _ != null && it.whenReady(_), k(wL(it));
    }
  }, []);
  Jt(() => () => {
    P == null || P.map.remove();
  }, [
    P
  ]);
  const D = P ? /* @__PURE__ */ Oa.createElement(jp, {
    value: P
  }, s) : h ?? null;
  return /* @__PURE__ */ Oa.createElement("div", Pc({}, x, {
    ref: I
  }), D);
}
const FL = /* @__PURE__ */ ro(NL), br = LL(function({ position: n, ...i }, s) {
  const a = new zn.Marker(n, i);
  return Wr(a, Bu(s, {
    overlayContainer: a
  }));
}, function(n, i, s) {
  i.position !== s.position && n.setLatLng(i.position), i.icon != null && i.icon !== s.icon && n.setIcon(i.icon), i.zIndexOffset != null && i.zIndexOffset !== s.zIndexOffset && n.setZIndexOffset(i.zIndexOffset), i.opacity != null && i.opacity !== s.opacity && n.setOpacity(i.opacity), n.dragging != null && i.draggable !== s.draggable && (i.draggable === !0 ? n.dragging.enable() : n.dragging.disable());
}), BL = Vp(function({ positions: n, ...i }, s) {
  const a = new zn.Polyline(n, i);
  return Wr(a, Bu(s, {
    overlayContainer: a
  }));
}, function(n, i, s) {
  i.positions !== s.positions && n.setLatLngs(i.positions);
}), wr = IL(function(n, i) {
  const s = new zn.Popup(n, i.overlayContainer);
  return Wr(s, i);
}, function(n, i, { position: s }, a) {
  Jt(function() {
    const { instance: h } = n;
    function d(g) {
      g.popup === h && (h.update(), a(!0));
    }
    function _(g) {
      g.popup === h && a(!1);
    }
    return i.map.on({
      popupopen: d,
      popupclose: _
    }), i.overlayContainer == null ? (s != null && h.setLatLng(s), h.openOn(i.map)) : i.overlayContainer.bindPopup(h), function() {
      var S;
      i.map.off({
        popupopen: d,
        popupclose: _
      }), (S = i.overlayContainer) == null || S.unbindPopup(), i.map.removeLayer(h);
    };
  }, [
    n,
    i,
    a,
    s
  ]);
}), zL = CL(function({ url: n, ...i }, s) {
  const a = new zn.TileLayer(n, zo(i, s));
  return Wr(a, s);
}, function(n, i, s) {
  OL(n, i, s);
  const { url: a } = i;
  a != null && a !== s.url && n.setUrl(a);
});
function $L({ bounds: t }) {
  const n = qp();
  return Jt(() => {
    t && n.fitBounds(t, { padding: [50, 50] });
  }, [n, t]), null;
}
const DL = [51.5074, -0.1278], ZL = 13;
function jL({ bounds: t, center: n, zoom: i, children: s }) {
  return /* @__PURE__ */ $(
    FL,
    {
      center: n || DL,
      zoom: i || ZL,
      style: { width: "100%", height: "100%" },
      scrollWheelZoom: !0,
      children: [
        /* @__PURE__ */ C(
          zL,
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        ),
        /* @__PURE__ */ C($L, { bounds: t }),
        s
      ]
    }
  );
}
function WL(t) {
  return t.map(([n, i]) => [i, n]);
}
const HL = jr.divIcon({
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
}), UL = jr.divIcon({
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
function VL({ coordinates: t, startLocation: n, endLocation: i }) {
  if (t.length === 0) return null;
  const s = WL(t);
  return /* @__PURE__ */ $(ri, { children: [
    /* @__PURE__ */ C(
      BL,
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
    n && /* @__PURE__ */ C(br, { position: [n.lat, n.lng], icon: HL, children: /* @__PURE__ */ $(wr, { children: [
      /* @__PURE__ */ C("strong", { children: "Start:" }),
      " ",
      n.label || "Starting point"
    ] }) }),
    i && /* @__PURE__ */ C(br, { position: [i.lat, i.lng], icon: UL, children: /* @__PURE__ */ $(wr, { children: [
      /* @__PURE__ */ C("strong", { children: "End:" }),
      " ",
      i.label || "Destination"
    ] }) })
  ] });
}
const qL = (t) => {
  const n = t ? "#ef4444" : "#32de84", i = t ? "rgba(239, 68, 68, 0.6)" : "rgba(50, 222, 132, 0.6)", s = t ? "animation: bike-pulse 1s ease-in-out infinite;" : "";
  return jr.divIcon({
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
function KL({ position: t, isWaiting: n = !1 }) {
  if (!t) return null;
  const i = qL(n);
  return /* @__PURE__ */ C(
    br,
    {
      position: [t.lat, t.lng],
      icon: i,
      zIndexOffset: 1e3
    }
  );
}
function GL({
  trafficLights: t,
  currentIndex: n,
  isWaitingAtLight: i
}) {
  return /* @__PURE__ */ C(ri, { children: t.map((s, a) => {
    const u = a < n - (i ? 0 : 1), h = i && a === n - 1, d = a >= n;
    let _ = "#6b7280";
    return h ? _ = "#ef4444" : d && (_ = "#f59e0b"), /* @__PURE__ */ C(
      AL,
      {
        center: [s.lat, s.lng],
        radius: 6,
        pathOptions: {
          color: _,
          fillColor: _,
          fillOpacity: u ? 0.4 : 0.8,
          weight: 2
        },
        children: /* @__PURE__ */ C(wr, { children: /* @__PURE__ */ $("div", { children: [
          /* @__PURE__ */ $("strong", { children: [
            "Traffic Light #",
            a + 1
          ] }),
          /* @__PURE__ */ C("br", {}),
          u && /* @__PURE__ */ C("span", { style: { color: "#6b7280" }, children: "Passed" }),
          h && /* @__PURE__ */ C("span", { style: { color: "#ef4444" }, children: "Waiting..." }),
          d && !h && /* @__PURE__ */ C("span", { style: { color: "#f59e0b" }, children: "Ahead" }),
          /* @__PURE__ */ C("br", {}),
          /* @__PURE__ */ $("small", { children: [
            Math.round(s.distanceFromStart),
            "m from start"
          ] })
        ] }) })
      },
      s.id
    );
  }) });
}
const JL = "_container_1gu14_2", YL = "_mapSection_1gu14_12", XL = "_mapOverlay_1gu14_18", QL = "_infoPanel_1gu14_26", tI = "_costDisplay_1gu14_38", eI = "_costMain_1gu14_46", nI = "_costLabel_1gu14_53", iI = "_costValue_1gu14_60", rI = "_costComparison_1gu14_66", sI = "_costRow_1gu14_71", oI = "_costRowLabel_1gu14_79", aI = "_costRowValue_1gu14_83", cI = "_costWasted_1gu14_88", uI = "_timeStats_1gu14_93", lI = "_statItem_1gu14_101", hI = "_statLabel_1gu14_106", fI = "_statValue_1gu14_114", dI = "_statWaiting_1gu14_119", _I = "_waitingIndicator_1gu14_124", mI = "_waitingDot_1gu14_136", pI = "_pulse_1gu14_1", gI = "_finishedSummary_1gu14_150", yI = "_summaryTitle_1gu14_158", vI = "_summaryText_1gu14_164", bI = "_routeStats_1gu14_170", wI = "_progressContainer_1gu14_178", SI = "_progressBar_1gu14_184", TI = "_progressFill_1gu14_192", xI = "_progressText_1gu14_199", PI = "_statsGrid_1gu14_207", EI = "_statBox_1gu14_214", kI = "_statBoxLabel_1gu14_219", MI = "_statBoxValue_1gu14_227", LI = "_statBoxSub_1gu14_234", II = "_controls_1gu14_241", CI = "_controlButtons_1gu14_252", OI = "_controlButton_1gu14_252", RI = "_primaryButton_1gu14_275", AI = "_secondaryButton_1gu14_285", NI = "_speedControl_1gu14_297", FI = "_speedLabel_1gu14_304", BI = "_speedSlider_1gu14_309", zI = "_statusIndicator_1gu14_330", $I = "_statusDot_1gu14_338", DI = "_statusIdle_1gu14_345", ZI = "_statusLoading_1gu14_346", jI = "_statusReady_1gu14_347", WI = "_statusPlaying_1gu14_348", HI = "_statusPaused_1gu14_349", UI = "_statusFinished_1gu14_350", VI = "_locationPicker_1gu14_353", qI = "_pickerTitle_1gu14_362", KI = "_pickerButtons_1gu14_369", GI = "_pickerButton_1gu14_369", JI = "_pickerActive_1gu14_394", YI = "_pickerSet_1gu14_399", XI = "_pickerDot_1gu14_403", QI = "_pickerHint_1gu14_409", tC = "_clearButton_1gu14_419", eC = "_loading_1gu14_438", nC = "_loadingSpinner_1gu14_452", iC = "_spin_1gu14_1", rC = "_error_1gu14_467", sC = "_errorTitle_1gu14_478", oC = "_errorMessage_1gu14_483", M = {
  container: JL,
  mapSection: YL,
  mapOverlay: XL,
  infoPanel: QL,
  costDisplay: tI,
  costMain: eI,
  costLabel: nI,
  costValue: iI,
  costComparison: rI,
  costRow: sI,
  costRowLabel: oI,
  costRowValue: aI,
  costWasted: cI,
  timeStats: uI,
  statItem: lI,
  statLabel: hI,
  statValue: fI,
  statWaiting: dI,
  waitingIndicator: _I,
  waitingDot: mI,
  pulse: pI,
  finishedSummary: gI,
  summaryTitle: yI,
  summaryText: vI,
  routeStats: bI,
  progressContainer: wI,
  progressBar: SI,
  progressFill: TI,
  progressText: xI,
  statsGrid: PI,
  statBox: EI,
  statBoxLabel: kI,
  statBoxValue: MI,
  statBoxSub: LI,
  controls: II,
  controlButtons: CI,
  controlButton: OI,
  primaryButton: RI,
  secondaryButton: AI,
  speedControl: NI,
  speedLabel: FI,
  speedSlider: BI,
  statusIndicator: zI,
  statusDot: $I,
  statusIdle: DI,
  statusLoading: ZI,
  statusReady: jI,
  statusPlaying: WI,
  statusPaused: HI,
  statusFinished: UI,
  locationPicker: VI,
  pickerTitle: qI,
  pickerButtons: KI,
  pickerButton: GI,
  pickerActive: JI,
  pickerSet: YI,
  pickerDot: XI,
  pickerHint: QI,
  clearButton: tC,
  loading: eC,
  loadingSpinner: nC,
  spin: iC,
  error: rC,
  errorTitle: sC,
  errorMessage: oC
};
function vs(t) {
  return `£${t.toFixed(2)}`;
}
function Ia(t) {
  const n = Math.floor(t / 60), i = Math.floor(t % 60);
  return `${n}:${i.toString().padStart(2, "0")}`;
}
function aC({ costs: t, state: n }) {
  const { status: i, elapsedTime: s, totalWaitTime: a, currentWaitTime: u, isWaitingAtLight: h, lightsEncountered: d } = n, _ = a + (h ? u : 0), g = i === "finished";
  return /* @__PURE__ */ $("div", { className: M.costDisplay, children: [
    /* @__PURE__ */ $("div", { className: M.costMain, children: [
      /* @__PURE__ */ C("div", { className: M.costLabel, children: "Current Cost" }),
      /* @__PURE__ */ C("div", { className: M.costValue, children: vs(t.totalCost) })
    ] }),
    /* @__PURE__ */ $("div", { className: M.costComparison, children: [
      /* @__PURE__ */ $("div", { className: M.costRow, children: [
        /* @__PURE__ */ C("span", { className: M.costRowLabel, children: "Ideal ride (no stops):" }),
        /* @__PURE__ */ C("span", { className: M.costRowValue, children: vs(t.idealCost) })
      ] }),
      /* @__PURE__ */ $("div", { className: `${M.costRow} ${M.costWasted}`, children: [
        /* @__PURE__ */ C("span", { className: M.costRowLabel, children: "Money wasted waiting:" }),
        /* @__PURE__ */ C("span", { className: M.costRowValue, children: vs(t.wastedMoney) })
      ] })
    ] }),
    /* @__PURE__ */ $("div", { className: M.timeStats, children: [
      /* @__PURE__ */ $("div", { className: M.statItem, children: [
        /* @__PURE__ */ C("span", { className: M.statLabel, children: "Ride time" }),
        /* @__PURE__ */ C("span", { className: M.statValue, children: Ia(s) })
      ] }),
      /* @__PURE__ */ $("div", { className: M.statItem, children: [
        /* @__PURE__ */ C("span", { className: M.statLabel, children: "Time waiting" }),
        /* @__PURE__ */ C("span", { className: `${M.statValue} ${M.statWaiting}`, children: Ia(_) })
      ] }),
      /* @__PURE__ */ $("div", { className: M.statItem, children: [
        /* @__PURE__ */ C("span", { className: M.statLabel, children: "Traffic lights" }),
        /* @__PURE__ */ C("span", { className: M.statValue, children: d })
      ] })
    ] }),
    h && /* @__PURE__ */ $("div", { className: M.waitingIndicator, children: [
      /* @__PURE__ */ C("div", { className: M.waitingDot }),
      /* @__PURE__ */ $("span", { children: [
        "Waiting at traffic light... (",
        Math.floor(u),
        "s)"
      ] })
    ] }),
    g && /* @__PURE__ */ $("div", { className: M.finishedSummary, children: [
      /* @__PURE__ */ C("div", { className: M.summaryTitle, children: "Ride Complete!" }),
      /* @__PURE__ */ $("div", { className: M.summaryText, children: [
        "You spent ",
        /* @__PURE__ */ C("strong", { children: Ia(_) }),
        " waiting at ",
        d,
        " traffic light",
        d !== 1 ? "s" : "",
        ", costing you an extra ",
        /* @__PURE__ */ C("strong", { children: vs(t.wastedMoney) }),
        "."
      ] })
    ] })
  ] });
}
function Ca(t) {
  return t >= 1e3 ? `${(t / 1e3).toFixed(2)} km` : `${Math.round(t)} m`;
}
function cC(t) {
  return `${(t * 2.237).toFixed(1)} mph`;
}
function uC({ state: t, totalDistance: n, totalTrafficLights: i }) {
  const { distanceTraveled: s, currentSpeed: a, routeProgress: u, currentTrafficLightIndex: h } = t, d = n - s, _ = i - h, g = Math.round(u * 100);
  return /* @__PURE__ */ $("div", { className: M.routeStats, children: [
    /* @__PURE__ */ $("div", { className: M.progressContainer, children: [
      /* @__PURE__ */ C("div", { className: M.progressBar, children: /* @__PURE__ */ C(
        "div",
        {
          className: M.progressFill,
          style: { width: `${g}%` }
        }
      ) }),
      /* @__PURE__ */ $("span", { className: M.progressText, children: [
        g,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ $("div", { className: M.statsGrid, children: [
      /* @__PURE__ */ $("div", { className: M.statBox, children: [
        /* @__PURE__ */ C("span", { className: M.statBoxLabel, children: "Distance" }),
        /* @__PURE__ */ C("span", { className: M.statBoxValue, children: Ca(s) }),
        /* @__PURE__ */ $("span", { className: M.statBoxSub, children: [
          "of ",
          Ca(n)
        ] })
      ] }),
      /* @__PURE__ */ $("div", { className: M.statBox, children: [
        /* @__PURE__ */ C("span", { className: M.statBoxLabel, children: "Speed" }),
        /* @__PURE__ */ C("span", { className: M.statBoxValue, children: cC(a) }),
        /* @__PURE__ */ $("span", { className: M.statBoxSub, children: [
          "max ",
          ve.MAX_SPEED_MPH,
          " mph"
        ] })
      ] }),
      /* @__PURE__ */ $("div", { className: M.statBox, children: [
        /* @__PURE__ */ C("span", { className: M.statBoxLabel, children: "Remaining" }),
        /* @__PURE__ */ C("span", { className: M.statBoxValue, children: Ca(d) }),
        /* @__PURE__ */ $("span", { className: M.statBoxSub, children: [
          _,
          " lights ahead"
        ] })
      ] })
    ] })
  ] });
}
function lC({
  status: t,
  onPlay: n,
  onPause: i,
  onReset: s,
  isReady: a,
  simulationSpeed: u,
  onSpeedChange: h
}) {
  const d = t === "playing", _ = t === "finished", g = t === "paused";
  return /* @__PURE__ */ $("div", { className: M.controls, children: [
    /* @__PURE__ */ $("div", { className: M.controlButtons, children: [
      !_ && /* @__PURE__ */ C(
        "button",
        {
          className: `${M.controlButton} ${M.primaryButton}`,
          onClick: d ? i : n,
          disabled: !a,
          children: d ? /* @__PURE__ */ $(ri, { children: [
            /* @__PURE__ */ C(fC, {}),
            " Pause"
          ] }) : /* @__PURE__ */ $(ri, { children: [
            /* @__PURE__ */ C(hC, {}),
            " ",
            g ? "Resume" : "Start Ride"
          ] })
        }
      ),
      (g || _) && /* @__PURE__ */ $(
        "button",
        {
          className: `${M.controlButton} ${M.secondaryButton}`,
          onClick: s,
          children: [
            /* @__PURE__ */ C(dC, {}),
            " Reset"
          ]
        }
      )
    ] }),
    h && /* @__PURE__ */ $("div", { className: M.speedControl, children: [
      /* @__PURE__ */ $("label", { className: M.speedLabel, children: [
        "Speed: ",
        u,
        "x"
      ] }),
      /* @__PURE__ */ C(
        "input",
        {
          type: "range",
          min: "1",
          max: "50",
          value: u,
          onChange: (S) => h(Number(S.target.value)),
          className: M.speedSlider
        }
      )
    ] }),
    /* @__PURE__ */ $("div", { className: M.statusIndicator, children: [
      /* @__PURE__ */ C("span", { className: `${M.statusDot} ${M[`status${t.charAt(0).toUpperCase() + t.slice(1)}`]}` }),
      /* @__PURE__ */ $("span", { className: M.statusText, children: [
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
function hC() {
  return /* @__PURE__ */ C("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ C("path", { d: "M8 5v14l11-7z" }) });
}
function fC() {
  return /* @__PURE__ */ C("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ C("path", { d: "M6 4h4v16H6V4zm8 0h4v16h-4V4z" }) });
}
function dC() {
  return /* @__PURE__ */ C("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ C("path", { d: "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" }) });
}
function _C({ mode: t, onStartChange: n, onEndChange: i }) {
  return RL({
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
const mC = jr.divIcon({
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
}), pC = jr.divIcon({
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
function gC({
  startLocation: t,
  endLocation: n,
  onStartChange: i,
  onEndChange: s,
  isEnabled: a,
  pickerMode: u,
  onModeChange: h
}) {
  return a ? /* @__PURE__ */ $(ri, { children: [
    /* @__PURE__ */ C(
      _C,
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
    t && /* @__PURE__ */ C(br, { position: [t.lat, t.lng], icon: mC, children: /* @__PURE__ */ C(wr, { children: "Start location" }) }),
    n && /* @__PURE__ */ C(br, { position: [n.lat, n.lng], icon: pC, children: /* @__PURE__ */ C(wr, { children: "End location" }) })
  ] }) : null;
}
function yC({
  startLocation: t,
  endLocation: n,
  pickerMode: i,
  onModeChange: s,
  onClear: a
}) {
  const u = t || n, h = t && n;
  return /* @__PURE__ */ $("div", { className: M.locationPicker, children: [
    /* @__PURE__ */ C("div", { className: M.pickerTitle, children: "Set Route" }),
    /* @__PURE__ */ $("div", { className: M.pickerButtons, children: [
      /* @__PURE__ */ $(
        "button",
        {
          className: `${M.pickerButton} ${i === "start" ? M.pickerActive : ""} ${t ? M.pickerSet : ""}`,
          onClick: () => s(i === "start" ? null : "start"),
          children: [
            /* @__PURE__ */ C("span", { className: M.pickerDot, style: { background: "#22c55e" } }),
            t ? "Start set" : "Set start"
          ]
        }
      ),
      /* @__PURE__ */ $(
        "button",
        {
          className: `${M.pickerButton} ${i === "end" ? M.pickerActive : ""} ${n ? M.pickerSet : ""}`,
          onClick: () => s(i === "end" ? null : "end"),
          children: [
            /* @__PURE__ */ C("span", { className: M.pickerDot, style: { background: "#ef4444" } }),
            n ? "End set" : "Set end"
          ]
        }
      )
    ] }),
    i && /* @__PURE__ */ $("div", { className: M.pickerHint, children: [
      "Click on the map to set ",
      i,
      " location"
    ] }),
    u && !h && /* @__PURE__ */ $("div", { className: M.pickerHint, children: [
      !t && "Click to set start location",
      !n && t && "Now click to set end location"
    ] }),
    u && /* @__PURE__ */ C("button", { className: M.clearButton, onClick: a, children: "Clear locations" })
  ] });
}
const vC = 1, bC = 0.2, wC = 10, SC = 15, TC = 90;
function LC({
  startLocation: t,
  endLocation: n,
  unlockFee: i = vC,
  perMinuteRate: s = bC,
  simulationSpeed: a = wC,
  minWaitTime: u = SC,
  maxWaitTime: h = TC,
  width: d = "100%",
  height: _ = 600,
  showControls: g = !0,
  allowLocationPicker: S = !0
}) {
  const [b, x] = Gt(null), [P, k] = Gt(null), [I, D] = Gt(
    t ? n ? null : "end" : "start"
  ), [st, it] = Gt(a), ft = t || b || void 0, wt = n || P || void 0, qt = S && (!t || !n), {
    route: Mt,
    coordinates: Ht,
    cumulativeDistances: ct,
    isLoading: St,
    error: $t
  } = Py(ft, wt), {
    trafficLights: Y,
    isLoading: dt,
    error: Ie
  } = _L(Ht), H = (Mt == null ? void 0 : Mt.distance) || 0, {
    state: Tt,
    position: tt,
    play: vt,
    pause: B,
    reset: $e,
    isReady: A
  } = pL({
    coordinates: Ht,
    cumulativeDistances: ct,
    trafficLights: Y,
    totalDistance: H,
    simulationSpeed: st,
    minWaitTime: u,
    maxWaitTime: h
  }), F = gL({
    state: Tt,
    totalDistance: H,
    unlockFee: i,
    perMinuteRate: s
  }), _t = ld(() => {
    if (Ht.length < 2) return;
    let Ot = 1 / 0, te = -1 / 0, De = 1 / 0, Se = -1 / 0;
    for (const [Te, ee] of Ht)
      Ot = Math.min(Ot, ee), te = Math.max(te, ee), De = Math.min(De, Te), Se = Math.max(Se, Te);
    return [
      [Ot, De],
      [te, Se]
    ];
  }, [Ht]), Lt = St || dt, mt = $t || Ie, ut = {
    width: typeof d == "number" ? `${d}px` : d,
    height: typeof _ == "number" ? `${_}px` : _
  }, rt = () => {
    x(null), k(null), D("start");
  };
  return /* @__PURE__ */ C("div", { className: M.container, style: ut, children: /* @__PURE__ */ $("div", { className: M.mapSection, children: [
    /* @__PURE__ */ $(jL, { bounds: _t, children: [
      qt && /* @__PURE__ */ C(
        gC,
        {
          startLocation: b,
          endLocation: P,
          onStartChange: x,
          onEndChange: k,
          isEnabled: qt,
          pickerMode: I,
          onModeChange: D
        }
      ),
      /* @__PURE__ */ C(
        VL,
        {
          coordinates: Ht,
          startLocation: ft,
          endLocation: wt
        }
      ),
      /* @__PURE__ */ C(
        GL,
        {
          trafficLights: Y,
          currentIndex: Tt.currentTrafficLightIndex,
          isWaitingAtLight: Tt.isWaitingAtLight
        }
      ),
      /* @__PURE__ */ C(
        KL,
        {
          position: tt,
          isWaiting: Tt.isWaitingAtLight
        }
      )
    ] }),
    qt && /* @__PURE__ */ C("div", { className: M.mapOverlay, children: /* @__PURE__ */ C(
      yC,
      {
        startLocation: b,
        endLocation: P,
        pickerMode: I,
        onModeChange: D,
        onClear: rt
      }
    ) }),
    /* @__PURE__ */ $("div", { className: M.infoPanel, children: [
      Lt && /* @__PURE__ */ $("div", { className: M.loading, children: [
        /* @__PURE__ */ C("div", { className: M.loadingSpinner }),
        /* @__PURE__ */ C("span", { children: St ? "Finding route..." : "Detecting traffic lights..." })
      ] }),
      mt && !Lt && /* @__PURE__ */ $("div", { className: M.error, children: [
        /* @__PURE__ */ C("div", { className: M.errorTitle, children: "Error" }),
        /* @__PURE__ */ C("div", { className: M.errorMessage, children: mt })
      ] }),
      !Lt && !mt && Mt && /* @__PURE__ */ $(ri, { children: [
        g && /* @__PURE__ */ C(
          lC,
          {
            status: Tt.status,
            onPlay: vt,
            onPause: B,
            onReset: $e,
            isReady: A,
            simulationSpeed: st,
            onSpeedChange: it
          }
        ),
        /* @__PURE__ */ C(aC, { costs: F, state: Tt }),
        /* @__PURE__ */ C(
          uC,
          {
            state: Tt,
            totalDistance: H,
            totalTrafficLights: Y.length
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  ve as BIKE_PHYSICS,
  LC as LimeBikeSimulator
};
