var by = Object.defineProperty;
var Jl = (t) => {
  throw TypeError(t);
};
var wy = (t, n, i) => n in t ? by(t, n, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[n] = i;
var m = (t, n, i) => wy(t, typeof n != "symbol" ? n + "" : n, i), Yl = (t, n, i) => n.has(t) || Jl("Cannot " + i);
var Xl = (t, n, i) => (Yl(t, n, "read from private field"), i ? i.call(t) : n.get(t)), Ql = (t, n, i) => n.has(t) ? Jl("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(t) : n.set(t, i), th = (t, n, i, s) => (Yl(t, n, "write to private field"), s ? s.call(t, i) : n.set(t, i), i);
import { jsxs as R, jsx as M, Fragment as ei } from "react/jsx-runtime";
import Ia, { useState as Gt, useCallback as Jn, useEffect as Qt, useRef as It, useMemo as hd, createContext as Sy, useContext as Ty, forwardRef as no, useImperativeHandle as io } from "react";
import { createPortal as Py } from "react-dom";
const xy = "https://router.project-osrm.org/route/v1/bike";
async function Ey(t, n) {
  const i = `${xy}/${t.lng},${t.lat};${n.lng},${n.lat}?overview=full&geometries=geojson&steps=true`, s = await fetch(i);
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
function ky(t) {
  const n = [0];
  for (let i = 1; i < t.length; i++) {
    const [s, a] = t[i - 1], [u, h] = t[i], d = sr(a, s, h, u);
    n.push(n[i - 1] + d);
  }
  return n;
}
function Ly(t, n) {
  const [i, s] = Gt(null), [a, u] = Gt([]), [h, d] = Gt([]), [_, g] = Gt(!1), [w, v] = Gt(null), P = Jn(async () => {
    if (!t || !n) {
      s(null), u([]), d([]);
      return;
    }
    g(!0), v(null);
    try {
      const x = await Ey(t, n);
      s(x);
      const C = x.geometry.coordinates;
      u(C), d(ky(C));
    } catch (x) {
      v(x instanceof Error ? x.message : "Failed to fetch route"), s(null), u([]), d([]);
    } finally {
      g(!1);
    }
  }, [t, n]);
  return Qt(() => {
    P();
  }, [P]), {
    route: i,
    coordinates: a,
    cumulativeDistances: h,
    isLoading: _,
    error: w,
    refetch: P
  };
}
const My = (t) => typeof t == "function", y = function(t, n) {
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
}, gt = (t) => t, ro = (t) => () => t, eh = /* @__PURE__ */ ro(!0), Oa = /* @__PURE__ */ ro(!1), fd = /* @__PURE__ */ ro(void 0), Cy = fd;
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
      for (let w = 1; w < arguments.length; w++)
        g = arguments[w](g);
      return g;
    }
  }
}
const Ec = (t) => (n, i) => n === i || t(n, i), Iy = /* @__PURE__ */ y(2, (t, n) => Ec((i, s) => t(n(i), n(s)))), Oy = (t) => Ec((n, i) => {
  if (n.length !== i.length)
    return !1;
  for (let s = 0; s < n.length; s++)
    if (!t(n[s], i[s]))
      return !1;
  return !0;
}), ls = "effect/GlobalValue";
let ji;
const ft = (t, n) => (ji || (globalThis[ls] ?? (globalThis[ls] = /* @__PURE__ */ new Map()), ji = globalThis[ls]), ji.has(t) || ji.set(t, n()), ji.get(t)), Ry = (t) => typeof t == "string", Ra = (t) => typeof t == "number", Ny = (t) => typeof t == "bigint", so = My, Ay = (t) => typeof t == "object" && t !== null, oo = (t) => Ay(t) || so(t), X = /* @__PURE__ */ y(2, (t, n) => oo(t) && n in t), dd = /* @__PURE__ */ y(2, (t, n) => X(t, "_tag") && t._tag === n), Vn = (t) => t == null, _d = (t) => typeof t == "string" || X(t, Symbol.iterator), Fy = (t) => X(t, "then") && so(t.then), ao = (t) => `BUG: ${t} - please report an issue at https://github.com/Effect-TS/effect/issues`;
let md = class pd {
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
    return new pd(this.self);
  }
};
const By = 335903614, $y = 4150755663, zy = 1481765933, Dy = 1284865837, Zy = 9007199254740992, Hy = 134217728;
class Wy {
  constructor(n, i, s, a) {
    m(this, "_state");
    return Vn(i) && Vn(n) ? (i = Math.random() * 4294967295 >>> 0, n = 0) : Vn(i) && (i = n, n = 0), Vn(a) && Vn(s) ? (a = this._state ? this._state[3] : $y, s = this._state ? this._state[2] : By) : Vn(a) && (a = s, s = 0), this._state = new Int32Array([0, 0, s >>> 0, ((a || 0) | 1) >>> 0]), this._next(), nh(this._state, this._state[0], this._state[1], n >>> 0, i >>> 0), this._next(), this;
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
    return (n * Hy + i) / Zy;
  }
  /** @internal */
  _next() {
    const n = this._state[0] >>> 0, i = this._state[1] >>> 0;
    jy(this._state, n, i, zy, Dy), nh(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let s = n >>> 18, a = (i >>> 18 | n << 14) >>> 0;
    s = (s ^ n) >>> 0, a = (a ^ i) >>> 0;
    const u = (a >>> 27 | s << 5) >>> 0, h = n >>> 27, d = (-h >>> 0 & 31) >>> 0;
    return (u >>> h | u << d) >>> 0;
  }
}
function jy(t, n, i, s, a) {
  let u = (i >>> 16) * (a & 65535) >>> 0, h = (i & 65535) * (a >>> 16) >>> 0, d = (i & 65535) * (a & 65535) >>> 0, _ = (i >>> 16) * (a >>> 16) + ((h >>> 16) + (u >>> 16)) >>> 0;
  h = h << 16 >>> 0, d = d + h >>> 0, d >>> 0 < h >>> 0 && (_ = _ + 1 >>> 0), u = u << 16 >>> 0, d = d + u >>> 0, d >>> 0 < u >>> 0 && (_ = _ + 1 >>> 0), _ = _ + Math.imul(i, s) >>> 0, _ = _ + Math.imul(n, a) >>> 0, t[0] = _, t[1] = d;
}
function nh(t, n, i, s, a) {
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
    Ql(this, Sr);
    th(this, Sr, n);
  }
  /**
   * @since 3.0.6
   */
  [Na]() {
    return Xl(this, Sr);
  }
}
Sr = new WeakMap();
function Uy(t) {
  if (typeof t == "object" && t !== null && Na in t)
    return t[Na]();
  throw new Error(ao("yieldWrapGet"));
}
const ye = /* @__PURE__ */ ft("effect/Utils/isStructuralRegion", () => ({
  enabled: !1,
  tester: void 0
})), gd = {
  effect_internal_function: (t) => t()
}, Vy = {
  effect_internal_function: (t) => {
    try {
      return t();
    } finally {
    }
  }
};
var pf;
const qy = ((pf = gd.effect_internal_function(() => new Error().stack)) == null ? void 0 : /* @__PURE__ */ pf.includes("effect_internal_function")) === !0, Xt = qy ? gd.effect_internal_function : Vy.effect_internal_function, ma = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap()), tt = /* @__PURE__ */ Symbol.for("effect/Hash"), B = (t) => {
  if (ye.enabled === !0)
    return 0;
  switch (typeof t) {
    case "number":
      return Lc(t);
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
      return t === null ? Ot("null") : t instanceof Date ? Number.isNaN(t.getTime()) ? Ot("Invalid Date") : B(t.toISOString()) : t instanceof URL ? B(t.href) : Gy(t) ? t[tt]() : kc(t);
    default:
      throw new Error(`BUG: unhandled typeof ${typeof t} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, kc = (t) => (ma.has(t) || ma.set(t, Lc(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))), ma.get(t)), ut = (t) => (n) => n * 53 ^ t, co = (t) => t & 3221225471 | t >>> 1 & 1073741824, Gy = (t) => X(t, tt), Lc = (t) => {
  if (t !== t || t === 1 / 0)
    return 0;
  let n = t | 0;
  for (n !== t && (n ^= t * 4294967295); t > 4294967295; )
    n ^= t /= 4294967295;
  return co(n);
}, Ot = (t) => {
  let n = 5381, i = t.length;
  for (; i; )
    n = n * 33 ^ t.charCodeAt(--i);
  return co(n);
}, Ky = (t, n) => {
  let i = 12289;
  for (let s = 0; s < n.length; s++)
    i ^= T(Ot(n[s]), ut(B(t[n[s]])));
  return co(i);
}, yd = (t) => Ky(t, Object.keys(t)), Pr = (t) => {
  let n = 6151;
  for (let i = 0; i < t.length; i++)
    n = T(n, ut(B(t[i])));
  return co(n);
}, kt = function() {
  if (arguments.length === 1) {
    const i = arguments[0];
    return function(s) {
      return Object.defineProperty(i, tt, {
        value() {
          return s;
        },
        enumerable: !1
      }), s;
    };
  }
  const t = arguments[0], n = arguments[1];
  return Object.defineProperty(t, tt, {
    value() {
      return n;
    },
    enumerable: !1
  }), n;
}, J = /* @__PURE__ */ Symbol.for("effect/Equal");
function Y() {
  return arguments.length === 1 ? (t) => Ls(t, arguments[0]) : Ls(arguments[0], arguments[1]);
}
function Ls(t, n) {
  if (t === n)
    return !0;
  const i = typeof t;
  if (i !== typeof n)
    return !1;
  if (i === "object" || i === "function") {
    if (t !== null && n !== null) {
      if (Ms(t) && Ms(n))
        return B(t) === B(n) && t[J](n) ? !0 : ye.enabled && ye.tester ? ye.tester(t, n) : !1;
      if (t instanceof Date && n instanceof Date) {
        const s = t.getTime(), a = n.getTime();
        return s === a || Number.isNaN(s) && Number.isNaN(a);
      } else if (t instanceof URL && n instanceof URL)
        return t.href === n.href;
    }
    if (ye.enabled) {
      if (Array.isArray(t) && Array.isArray(n))
        return t.length === n.length && t.every((s, a) => Ls(s, n[a]));
      if (Object.getPrototypeOf(t) === Object.prototype && Object.getPrototypeOf(t) === Object.prototype) {
        const s = Object.keys(t), a = Object.keys(n);
        if (s.length === a.length) {
          for (const u of s)
            if (!(u in n && Ls(t[u], n[u])))
              return ye.tester ? ye.tester(t, n) : !1;
          return !0;
        }
      }
      return ye.tester ? ye.tester(t, n) : !1;
    }
  }
  return ye.enabled && ye.tester ? ye.tester(t, n) : !1;
}
const Ms = (t) => X(t, J), Mc = () => Y, Lt = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), Wt = (t) => {
  try {
    if (X(t, "toJSON") && so(t.toJSON) && t.toJSON.length === 0)
      return t.toJSON();
    if (Array.isArray(t))
      return t.map(Wt);
  } catch {
    return {};
  }
  return Yy(t);
}, Kt = (t) => JSON.stringify(t, null, 2), ni = (t, n = 2) => {
  if (typeof t == "string")
    return t;
  try {
    return typeof t == "object" ? vd(t, n) : String(t);
  } catch {
    return String(t);
  }
}, vd = (t, n) => {
  let i = [];
  const s = JSON.stringify(t, (a, u) => typeof u == "object" && u !== null ? i.includes(u) ? void 0 : i.push(u) && (vn.fiberRefs !== void 0 && bd(u) ? u[Cc](vn.fiberRefs) : u) : u, n);
  return i = void 0, s;
}, Cc = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable"), bd = (t) => typeof t == "object" && t !== null && Cc in t, vn = /* @__PURE__ */ ft("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
})), Jy = (t, n) => {
  const i = vn.fiberRefs;
  vn.fiberRefs = t;
  try {
    return n();
  } finally {
    vn.fiberRefs = i;
  }
}, Yy = (t) => bd(t) && vn.fiberRefs !== void 0 ? t[Cc](vn.fiberRefs) : t, j = (t, n) => {
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
}, Qi = "Async", uo = "Commit", le = "Failure", ys = "OnFailure", Cs = "OnSuccess", Is = "OnSuccessAndFailure", he = "Success", wd = "Sync", Xy = "Tag", xr = "UpdateRuntimeFlags", Os = "While", tr = "Iterator", Sd = "WithRuntime", vs = "Yield", Ic = "RevertFlags";
let Qy = "3.19.13";
const Oc = () => Qy, tv = /* @__PURE__ */ Symbol.for("effect/Effect"), ev = /* @__PURE__ */ Symbol.for("effect/Stream"), nv = /* @__PURE__ */ Symbol.for("effect/Sink"), iv = /* @__PURE__ */ Symbol.for("effect/Channel"), ii = {
  /* c8 ignore next */
  _R: (t) => t,
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t,
  _V: /* @__PURE__ */ Oc()
}, rv = {
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
}, sv = {
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
  [tv]: ii,
  [ev]: ii,
  [nv]: rv,
  [iv]: sv,
  [J](t) {
    return this === t;
  },
  [tt]() {
    return kt(this, kc(this));
  },
  [Symbol.iterator]() {
    return new md(new Tr(this));
  },
  pipe() {
    return j(this, arguments);
  }
}, Rc = {
  [tt]() {
    return kt(this, yd(this));
  },
  [J](t) {
    const n = Object.keys(this), i = Object.keys(t);
    if (n.length !== i.length)
      return !1;
    for (const s of n)
      if (!(s in t && Y(this[s], t[s])))
        return !1;
    return !0;
  }
}, kr = {
  ...Er,
  _op: uo
}, ov = {
  ...kr,
  ...Rc
}, av = /* @__PURE__ */ function() {
  function t() {
  }
  return t.prototype = kr, t;
}(), Td = /* @__PURE__ */ Symbol.for("effect/Option"), Pd = {
  ...Er,
  [Td]: {
    _A: (t) => t
  },
  [Lt]() {
    return this.toJSON();
  },
  toString() {
    return Kt(this.toJSON());
  }
}, cv = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Pd), {
  _tag: "Some",
  _op: "Some",
  [J](t) {
    return xd(t) && kd(t) && Y(this.value, t.value);
  },
  [tt]() {
    return kt(this, ut(B(this._tag))(B(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: Wt(this.value)
    };
  }
}), uv = /* @__PURE__ */ B("None"), lv = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Pd), {
  _tag: "None",
  _op: "None",
  [J](t) {
    return xd(t) && Ed(t);
  },
  [tt]() {
    return uv;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
}), xd = (t) => X(t, Td), Ed = (t) => t._tag === "None", kd = (t) => t._tag === "Some", Ld = /* @__PURE__ */ Object.create(lv), Aa = (t) => {
  const n = Object.create(cv);
  return n.value = t, n;
}, Md = /* @__PURE__ */ Symbol.for("effect/Either"), Cd = {
  ...Er,
  [Md]: {
    _R: (t) => t
  },
  [Lt]() {
    return this.toJSON();
  },
  toString() {
    return Kt(this.toJSON());
  }
}, hv = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Cd), {
  _tag: "Right",
  _op: "Right",
  [J](t) {
    return Id(t) && Rd(t) && Y(this.right, t.right);
  },
  [tt]() {
    return ut(B(this._tag))(B(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: Wt(this.right)
    };
  }
}), fv = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Cd), {
  _tag: "Left",
  _op: "Left",
  [J](t) {
    return Id(t) && Od(t) && Y(this.left, t.left);
  },
  [tt]() {
    return ut(B(this._tag))(B(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: Wt(this.left)
    };
  }
}), Id = (t) => X(t, Md), Od = (t) => t._tag === "Left", Rd = (t) => t._tag === "Right", dv = (t) => {
  const n = Object.create(fv);
  return n.left = t, n;
}, _v = (t) => {
  const n = Object.create(hv);
  return n.right = t, n;
}, Ue = _v, ri = dv, Xi = Od, hs = Rd, mv = /* @__PURE__ */ y(2, (t, {
  onLeft: n,
  onRight: i
}) => Xi(t) ? n(t.left) : i(t.right)), pv = /* @__PURE__ */ mv({
  onLeft: gt,
  onRight: gt
}), Nd = (t) => t.length > 0, Ad = (t) => (n, i) => n === i ? 0 : t(n, i), gv = /* @__PURE__ */ Ad((t, n) => t < n ? -1 : 1), yv = /* @__PURE__ */ y(2, (t, n) => Ad((i, s) => t(n(i), n(s)))), vv = (t) => y(2, (n, i) => t(n, i) === 1), H = () => Ld, nt = Aa, te = Ed, Fe = kd, an = /* @__PURE__ */ y(2, (t, {
  onNone: n,
  onSome: i
}) => te(t) ? n() : i(t.value)), Je = /* @__PURE__ */ y(2, (t, n) => te(t) ? n() : t.value), bv = /* @__PURE__ */ y(2, (t, n) => te(t) ? nt(n()) : t), Nc = (t) => t == null ? H() : nt(t), mn = /* @__PURE__ */ Je(fd), wv = /* @__PURE__ */ y(2, (t, n) => te(t) ? H() : nt(n(t.value))), Sv = /* @__PURE__ */ y(2, (t, n) => te(t) ? H() : n(t.value)), Tv = (t) => y(2, (n, i) => te(n) ? !1 : t(n.value, i)), Pv = /* @__PURE__ */ Mc(), xv = /* @__PURE__ */ Tv(Pv), Ev = (...t) => t, Ac = (t) => new Array(t), kv = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.max(1, Math.floor(t)), s = new Array(i);
  for (let a = 0; a < i; a++)
    s[a] = n(a);
  return s;
}), $t = (t) => Array.isArray(t) ? t : Array.from(t), Lv = (t) => Array.isArray(t) ? t : [t], Rs = /* @__PURE__ */ y(2, (t, n) => [n, ...t]), Mv = /* @__PURE__ */ y(2, (t, n) => [...t, n]), Fd = /* @__PURE__ */ y(2, (t, n) => $t(t).concat($t(n))), Cv = (t) => t.length === 0, Iv = Cv, Ov = Nd, fe = Nd, Bd = (t, n) => t < 0 || t >= n.length, Rv = (t, n) => Math.floor(Math.min(Math.max(0, t), n.length)), Nv = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.floor(n);
  return Bd(i, t) ? H() : nt(t[i]);
}), $d = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.floor(n);
  if (Bd(i, t))
    throw new Error(`Index ${i} out of bounds`);
  return t[i];
}), er = /* @__PURE__ */ Nv(0), ie = /* @__PURE__ */ $d(0), Av = (t) => fe(t) ? nt(zd(t)) : H(), zd = (t) => t[t.length - 1], si = (t) => t.slice(1), Fv = (t, n) => {
  let i = 0;
  for (const s of t) {
    if (!n(s, i))
      break;
    i++;
  }
  return i;
}, Bv = /* @__PURE__ */ y(2, (t, n) => Zv(t, Fv(t, n))), $v = /* @__PURE__ */ y(2, (t, n) => {
  const i = $t(t);
  return i.slice(Rv(n, i), i.length);
}), ih = (t) => Array.from(t).reverse(), Ns = /* @__PURE__ */ y(2, (t, n) => {
  const i = Array.from(t);
  return i.sort(n), i;
}), rh = /* @__PURE__ */ y(2, (t, n) => zv(t, n, Ev)), zv = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = $t(t), a = $t(n);
  if (fe(s) && fe(a)) {
    const u = [i(ie(s), ie(a))], h = Math.min(s.length, a.length);
    for (let d = 1; d < h; d++)
      u[d] = i(s[d], a[d]);
    return u;
  }
  return [];
}), Dv = /* @__PURE__ */ Mc(), Zv = /* @__PURE__ */ y(2, (t, n) => {
  const i = Array.from(t), s = Math.floor(n);
  return fe(i) ? s >= 1 ? Hv(i, s) : [[], i] : [i, []];
}), Hv = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.max(1, Math.floor(n));
  return i >= t.length ? [Wv(t), []] : [Rs(t.slice(1, i), ie(t)), t.slice(i)];
}), Wv = (t) => t.slice(), jv = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = $t(t), a = $t(n);
  return fe(s) ? fe(a) ? Zd(i)(Fd(s, a)) : s : a;
}), bs = /* @__PURE__ */ y(2, (t, n) => jv(t, n, Dv)), oi = () => [], xe = (t) => [t], Xn = /* @__PURE__ */ y(2, (t, n) => t.map(n)), Uv = /* @__PURE__ */ y(2, (t, n) => {
  if (Iv(t))
    return [];
  const i = [];
  for (let s = 0; s < t.length; s++) {
    const a = n(t[s], s);
    for (let u = 0; u < a.length; u++)
      i.push(a[u]);
  }
  return i;
}), Vv = /* @__PURE__ */ Uv(gt), Dd = /* @__PURE__ */ y(3, (t, n, i) => $t(t).reduce((s, a, u) => i(s, a, u), n)), sh = (t, n) => {
  const i = [];
  let s = t, a;
  for (; Fe(a = n(s)); ) {
    const [u, h] = a.value;
    i.push(u), s = h;
  }
  return i;
}, Fc = Oy, Zd = /* @__PURE__ */ y(2, (t, n) => {
  const i = $t(t);
  if (fe(i)) {
    const s = [ie(i)], a = si(i);
    for (const u of a)
      s.every((h) => !n(u, h)) && s.push(u);
    return s;
  }
  return [];
}), qv = (t) => Zd(t, Mc()), wi = /* @__PURE__ */ y(2, (t, n) => $t(t).join(n)), or = gv, Gv = (t) => t.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"), Kv = /* @__PURE__ */ Symbol.for("effect/Context/Tag"), As = /* @__PURE__ */ Symbol.for("effect/Context/Reference"), Jv = "effect/STM", Yv = /* @__PURE__ */ Symbol.for(Jv), Hd = {
  ...Er,
  _op: "Tag",
  [Yv]: ii,
  [Kv]: {
    _Service: (t) => t,
    _Identifier: (t) => t
  },
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [Lt]() {
    return this.toJSON();
  },
  of(t) {
    return t;
  },
  context(t) {
    return jd(this, t);
  }
}, Xv = {
  ...Hd,
  [As]: As
}, Qv = (t) => {
  const n = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const i = new Error();
  Error.stackTraceLimit = n;
  const s = Object.create(Hd);
  return Object.defineProperty(s, "stack", {
    get() {
      return i.stack;
    }
  }), s.key = t, s;
}, tb = () => (t, n) => {
  const i = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const s = new Error();
  Error.stackTraceLimit = i;
  function a() {
  }
  return Object.setPrototypeOf(a, Xv), a.key = t, a.defaultValue = n.defaultValue, Object.defineProperty(a, "stack", {
    get() {
      return s.stack;
    }
  }), a;
}, Wd = /* @__PURE__ */ Symbol.for("effect/Context"), eb = {
  [Wd]: {
    _Services: (t) => t
  },
  [J](t) {
    if (ib(t) && this.unsafeMap.size === t.unsafeMap.size) {
      for (const n of this.unsafeMap.keys())
        if (!t.unsafeMap.has(n) || !Y(this.unsafeMap.get(n), t.unsafeMap.get(n)))
          return !1;
      return !0;
    }
    return !1;
  },
  [tt]() {
    return kt(this, Lc(this.unsafeMap.size));
  },
  pipe() {
    return j(this, arguments);
  },
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(Wt)
    };
  },
  [Lt]() {
    return this.toJSON();
  }
}, ai = (t) => {
  const n = Object.create(eb);
  return n.unsafeMap = t, n;
}, nb = (t) => {
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
}, ib = (t) => X(t, Wd), rb = (t) => X(t, As), sb = /* @__PURE__ */ ai(/* @__PURE__ */ new Map()), ob = () => sb, jd = (t, n) => ai(/* @__PURE__ */ new Map([[t.key, n]])), ab = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = new Map(t.unsafeMap);
  return s.set(n.key, i), ai(s);
}), pa = /* @__PURE__ */ ft("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map()), Bc = (t) => {
  if (pa.has(t.key))
    return pa.get(t.key);
  const n = t.defaultValue();
  return pa.set(t.key, n), n;
}, cb = (t, n) => t.unsafeMap.has(n.key) ? t.unsafeMap.get(n.key) : Bc(n), Ud = /* @__PURE__ */ y(2, (t, n) => {
  if (!t.unsafeMap.has(n.key)) {
    if (As in n) return Bc(n);
    throw nb(n);
  }
  return t.unsafeMap.get(n.key);
}), ub = Ud, lb = /* @__PURE__ */ y(2, (t, n) => t.unsafeMap.has(n.key) ? Aa(t.unsafeMap.get(n.key)) : rb(n) ? Aa(Bc(n)) : Ld), hb = /* @__PURE__ */ y(2, (t, n) => {
  const i = new Map(t.unsafeMap);
  for (const [s, a] of n.unsafeMap)
    i.set(s, a);
  return ai(i);
}), An = Qv, $c = ob, fb = jd, Kn = ab, Vd = ub, qd = Ud, Lr = lb, Gd = hb, zc = tb, Kd = /* @__PURE__ */ Symbol.for("effect/Chunk");
function db(t, n, i, s, a) {
  for (let u = n; u < Math.min(t.length, n + a); u++)
    i[s + u - n] = t[u];
  return i;
}
const Jd = [], _b = (t) => Ec((n, i) => n.length === i.length && bn(n).every((s, a) => t(s, wn(i, a)))), mb = /* @__PURE__ */ _b(Y), pb = {
  [Kd]: {
    _A: (t) => t
  },
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: bn(this).map(Wt)
    };
  },
  [Lt]() {
    return this.toJSON();
  },
  [J](t) {
    return Yd(t) && mb(this, t);
  },
  [tt]() {
    return kt(this, Pr(bn(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray":
        return this.backing.array[Symbol.iterator]();
      case "IEmpty":
        return Jd[Symbol.iterator]();
      default:
        return bn(this)[Symbol.iterator]();
    }
  },
  pipe() {
    return j(this, arguments);
  }
}, Zt = (t) => {
  const n = Object.create(pb);
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
}, Yd = (t) => X(t, Kd), Ne = /* @__PURE__ */ Zt({
  _tag: "IEmpty"
}), Be = () => Ne, ga = (...t) => bb(t), re = (t) => Zt({
  _tag: "ISingleton",
  a: t
}), Xd = (t) => Yd(t) ? t : lo($t(t)), Fa = (t, n, i) => {
  switch (t.backing._tag) {
    case "IArray": {
      db(t.backing.array, 0, n, i, t.length);
      break;
    }
    case "IConcat": {
      Fa(t.left, n, i), Fa(t.right, n, i + t.left.length);
      break;
    }
    case "ISingleton": {
      n[i] = t.backing.a;
      break;
    }
    case "ISlice": {
      let s = 0, a = i;
      for (; s < t.length; )
        n[a] = wn(t, s), s += 1, a += 1;
      break;
    }
  }
}, gb = (t) => {
  switch (t.backing._tag) {
    case "IEmpty":
      return Jd;
    case "IArray":
      return t.backing.array;
    default: {
      const n = new Array(t.length);
      return Fa(t, n, 0), t.backing = {
        _tag: "IArray",
        array: n
      }, t.left = Ne, t.right = Ne, t.depth = 0, n;
    }
  }
}, bn = gb, yb = (t) => {
  switch (t.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return t;
    case "IArray":
      return Zt({
        _tag: "IArray",
        array: ih(t.backing.array)
      });
    case "IConcat":
      return Zt({
        _tag: "IConcat",
        left: Pn(t.backing.right),
        right: Pn(t.backing.left)
      });
    case "ISlice":
      return lo(ih(bn(t)));
  }
}, Pn = yb, vb = /* @__PURE__ */ y(2, (t, n) => n < 0 || n >= t.length ? H() : nt(wn(t, n))), lo = (t) => t.length === 0 ? Be() : t.length === 1 ? re(t[0]) : Zt({
  _tag: "IArray",
  array: t
}), bb = (t) => lo(t), wn = /* @__PURE__ */ y(2, (t, n) => {
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
      return n < t.left.length ? wn(t.left, n) : wn(t.right, n - t.left.length);
    case "ISlice":
      return wn(t.backing.chunk, n + t.backing.offset);
  }
}), wb = /* @__PURE__ */ y(2, (t, n) => Ee(t, re(n))), Se = /* @__PURE__ */ y(2, (t, n) => Ee(re(n), t)), Ba = /* @__PURE__ */ y(2, (t, n) => {
  if (n <= 0)
    return t;
  if (n >= t.length)
    return Ne;
  switch (t.backing._tag) {
    case "ISlice":
      return Zt({
        _tag: "ISlice",
        chunk: t.backing.chunk,
        offset: t.backing.offset + n,
        length: t.backing.length - n
      });
    case "IConcat":
      return n > t.left.length ? Ba(t.right, n - t.left.length) : Zt({
        _tag: "IConcat",
        left: Ba(t.left, n),
        right: t.right
      });
    default:
      return Zt({
        _tag: "ISlice",
        chunk: t,
        offset: n,
        length: t.length - n
      });
  }
}), Ee = /* @__PURE__ */ y(2, (t, n) => {
  if (t.backing._tag === "IEmpty")
    return n;
  if (n.backing._tag === "IEmpty")
    return t;
  const i = n.depth - t.depth;
  if (Math.abs(i) <= 1)
    return Zt({
      _tag: "IConcat",
      left: t,
      right: n
    });
  if (i < -1)
    if (t.left.depth >= t.right.depth) {
      const s = Ee(t.right, n);
      return Zt({
        _tag: "IConcat",
        left: t.left,
        right: s
      });
    } else {
      const s = Ee(t.right.right, n);
      if (s.depth === t.depth - 3) {
        const a = Zt({
          _tag: "IConcat",
          left: t.right.left,
          right: s
        });
        return Zt({
          _tag: "IConcat",
          left: t.left,
          right: a
        });
      } else {
        const a = Zt({
          _tag: "IConcat",
          left: t.left,
          right: t.right.left
        });
        return Zt({
          _tag: "IConcat",
          left: a,
          right: s
        });
      }
    }
  else if (n.right.depth >= n.left.depth) {
    const s = Ee(t, n.left);
    return Zt({
      _tag: "IConcat",
      left: s,
      right: n.right
    });
  } else {
    const s = Ee(t, n.left.left);
    if (s.depth === n.depth - 3) {
      const a = Zt({
        _tag: "IConcat",
        left: s,
        right: n.left.right
      });
      return Zt({
        _tag: "IConcat",
        left: a,
        right: n.right
      });
    } else {
      const a = Zt({
        _tag: "IConcat",
        left: n.left.right,
        right: n.right
      });
      return Zt({
        _tag: "IConcat",
        left: s,
        right: a
      });
    }
  }
}), Sb = (t) => t.length === 0, Ye = (t) => t.length > 0, Qd = /* @__PURE__ */ vb(0), t_ = (t) => wn(t, 0), Ae = t_, Ve = (t) => Ba(t, 1), $a = /* @__PURE__ */ Symbol.for("effect/Duration"), e_ = /* @__PURE__ */ BigInt(0), oh = /* @__PURE__ */ BigInt(24), fs = /* @__PURE__ */ BigInt(60), za = /* @__PURE__ */ BigInt(1e3), ah = /* @__PURE__ */ BigInt(1e6), ch = /* @__PURE__ */ BigInt(1e9), Tb = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/, de = (t) => {
  if (n_(t))
    return t;
  if (Ra(t))
    return xn(t);
  if (Ny(t))
    return ya(t);
  if (Array.isArray(t) && t.length === 2 && t.every(Ra))
    return t[0] === -1 / 0 || t[1] === -1 / 0 || Number.isNaN(t[0]) || Number.isNaN(t[1]) ? ci : t[0] === 1 / 0 || t[1] === 1 / 0 ? kb : ya(BigInt(Math.round(t[0] * 1e9)) + BigInt(Math.round(t[1])));
  if (Ry(t)) {
    const n = Tb.exec(t);
    if (n) {
      const [i, s, a] = n, u = Number(s);
      switch (a) {
        case "nano":
        case "nanos":
          return ya(BigInt(s));
        case "micro":
        case "micros":
          return Lb(BigInt(s));
        case "milli":
        case "millis":
          return xn(u);
        case "second":
        case "seconds":
          return Mb(u);
        case "minute":
        case "minutes":
          return Cb(u);
        case "hour":
        case "hours":
          return Ib(u);
        case "day":
        case "days":
          return Ob(u);
        case "week":
        case "weeks":
          return Rb(u);
      }
    }
  }
  throw new Error("Invalid DurationInput");
}, uh = {
  _tag: "Millis",
  millis: 0
}, Pb = {
  _tag: "Infinity"
}, xb = {
  [$a]: $a,
  [tt]() {
    return kt(this, yd(this.value));
  },
  [J](t) {
    return n_(t) && Zb(this, t);
  },
  toString() {
    return `Duration(${Wb(this)})`;
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
          hrtime: Ab(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [Lt]() {
    return this.toJSON();
  },
  pipe() {
    return j(this, arguments);
  }
}, se = (t) => {
  const n = Object.create(xb);
  return Ra(t) ? isNaN(t) || t <= 0 ? n.value = uh : Number.isFinite(t) ? Number.isInteger(t) ? n.value = {
    _tag: "Millis",
    millis: t
  } : n.value = {
    _tag: "Nanos",
    nanos: BigInt(Math.round(t * 1e6))
  } : n.value = Pb : t <= e_ ? n.value = uh : n.value = {
    _tag: "Nanos",
    nanos: t
  }, n;
}, n_ = (t) => X(t, $a), Eb = (t) => {
  switch (t.value._tag) {
    case "Millis":
      return t.value.millis === 0;
    case "Nanos":
      return t.value.nanos === e_;
    case "Infinity":
      return !1;
  }
}, ci = /* @__PURE__ */ se(0), kb = /* @__PURE__ */ se(1 / 0), ya = (t) => se(t), Lb = (t) => se(t * za), xn = (t) => se(t), Mb = (t) => se(t * 1e3), Cb = (t) => se(t * 6e4), Ib = (t) => se(t * 36e5), Ob = (t) => se(t * 864e5), Rb = (t) => se(t * 6048e5), Fs = (t) => i_(t, {
  onMillis: (n) => n,
  onNanos: (n) => Number(n) / 1e6
}), Nb = (t) => {
  const n = de(t);
  switch (n.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return n.value.nanos;
    case "Millis":
      return BigInt(Math.round(n.value.millis * 1e6));
  }
}, Ab = (t) => {
  const n = de(t);
  switch (n.value._tag) {
    case "Infinity":
      return [1 / 0, 0];
    case "Nanos":
      return [Number(n.value.nanos / ch), Number(n.value.nanos % ch)];
    case "Millis":
      return [Math.floor(n.value.millis / 1e3), Math.round(n.value.millis % 1e3 * 1e6)];
  }
}, i_ = /* @__PURE__ */ y(2, (t, n) => {
  const i = de(t);
  switch (i.value._tag) {
    case "Nanos":
      return n.onNanos(i.value.nanos);
    case "Infinity":
      return n.onMillis(1 / 0);
    case "Millis":
      return n.onMillis(i.value.millis);
  }
}), ho = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = de(t), a = de(n);
  if (s.value._tag === "Infinity" || a.value._tag === "Infinity")
    return i.onMillis(Fs(s), Fs(a));
  if (s.value._tag === "Nanos" || a.value._tag === "Nanos") {
    const u = s.value._tag === "Nanos" ? s.value.nanos : BigInt(Math.round(s.value.millis * 1e6)), h = a.value._tag === "Nanos" ? a.value.nanos : BigInt(Math.round(a.value.millis * 1e6));
    return i.onNanos(u, h);
  }
  return i.onMillis(s.value.millis, a.value.millis);
}), Fb = (t, n) => ho(t, n, {
  onMillis: (i, s) => i === s,
  onNanos: (i, s) => i === s
}), Bb = /* @__PURE__ */ y(2, (t, n) => i_(t, {
  onMillis: (i) => se(i * n),
  onNanos: (i) => se(i * BigInt(n))
})), $b = /* @__PURE__ */ y(2, (t, n) => ho(t, n, {
  onMillis: (i, s) => se(i + s),
  onNanos: (i, s) => se(i + s)
})), zb = /* @__PURE__ */ y(2, (t, n) => ho(t, n, {
  onMillis: (i, s) => i <= s,
  onNanos: (i, s) => i <= s
})), Db = /* @__PURE__ */ y(2, (t, n) => ho(t, n, {
  onMillis: (i, s) => i >= s,
  onNanos: (i, s) => i >= s
})), Zb = /* @__PURE__ */ y(2, (t, n) => Fb(de(t), de(n))), Hb = (t) => {
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
  const i = Nb(n), s = i / ah, a = s / za, u = a / fs, h = u / fs, d = h / oh;
  return {
    days: Number(d),
    hours: Number(h % oh),
    minutes: Number(u % fs),
    seconds: Number(a % fs),
    millis: Number(s % za),
    nanos: Number(i % ah)
  };
}, Wb = (t) => {
  const n = de(t);
  if (n.value._tag === "Infinity")
    return "Infinity";
  if (Eb(n))
    return "0";
  const i = Hb(n), s = [];
  return i.days !== 0 && s.push(`${i.days}d`), i.hours !== 0 && s.push(`${i.hours}h`), i.minutes !== 0 && s.push(`${i.minutes}m`), i.seconds !== 0 && s.push(`${i.seconds}s`), i.millis !== 0 && s.push(`${i.millis}ms`), i.nanos !== 0 && s.push(`${i.nanos}ns`), s.join(" ");
}, En = 5, Dc = /* @__PURE__ */ Math.pow(2, En), jb = Dc - 1, Ub = Dc / 2, Vb = Dc / 4;
function qb(t) {
  return t -= t >> 1 & 1431655765, t = (t & 858993459) + (t >> 2 & 858993459), t = t + (t >> 4) & 252645135, t += t >> 8, t += t >> 16, t & 127;
}
function ui(t, n) {
  return n >>> t & jb;
}
function Yn(t) {
  return 1 << t;
}
function r_(t, n) {
  return qb(t & n - 1);
}
const Gb = (t, n) => ({
  value: t,
  previous: n
});
function Qn(t, n, i, s) {
  let a = s;
  if (!t) {
    const u = s.length;
    a = new Array(u);
    for (let h = 0; h < u; ++h) a[h] = s[h];
  }
  return a[n] = i, a;
}
function s_(t, n, i) {
  const s = i.length - 1;
  let a = 0, u = 0, h = i;
  if (t)
    a = u = n;
  else
    for (h = new Array(s); a < n; ) h[u++] = i[a++];
  for (++a; a <= s; ) h[u++] = i[a++];
  return t && (h.length = s), h;
}
function Kb(t, n, i, s) {
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
class sn {
  constructor() {
    m(this, "_tag", "EmptyNode");
  }
  modify(n, i, s, a, u, h) {
    const d = s(H());
    return te(d) ? new sn() : (++h.value, new Sn(n, a, u, d));
  }
}
function ke(t) {
  return dd(t, "EmptyNode");
}
function Jb(t) {
  return ke(t) || t._tag === "LeafNode" || t._tag === "CollisionNode";
}
function fo(t, n) {
  return ke(t) ? !1 : n === t.edit;
}
class Sn {
  constructor(n, i, s, a) {
    m(this, "edit");
    m(this, "hash");
    m(this, "key");
    m(this, "value");
    m(this, "_tag", "LeafNode");
    this.edit = n, this.hash = i, this.key = s, this.value = a;
  }
  modify(n, i, s, a, u, h) {
    if (Y(u, this.key)) {
      const _ = s(this.value);
      return _ === this.value ? this : te(_) ? (--h.value, new sn()) : fo(this, n) ? (this.value = _, this) : new Sn(n, a, u, _);
    }
    const d = s(H());
    return te(d) ? this : (++h.value, o_(n, i, this.hash, this, a, new Sn(n, a, u, d)));
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
      const _ = fo(this, n), g = this.updateCollisionList(_, n, this.hash, this.children, s, u, h);
      return g === this.children ? this : g.length > 1 ? new Zc(n, this.hash, g) : g[0];
    }
    const d = s(H());
    return te(d) ? this : (++h.value, o_(n, i, this.hash, this, a, new Sn(n, a, u, d)));
  }
  updateCollisionList(n, i, s, a, u, h, d) {
    const _ = a.length;
    for (let w = 0; w < _; ++w) {
      const v = a[w];
      if ("key" in v && Y(h, v.key)) {
        const P = v.value, x = u(P);
        return x === P ? a : te(x) ? (--d.value, s_(n, w, a)) : Qn(n, w, new Sn(i, s, h, x), a);
      }
    }
    const g = u(H());
    return te(g) ? a : (++d.value, Qn(n, _, new Sn(i, s, h, g), a));
  }
}
class li {
  constructor(n, i, s) {
    m(this, "edit");
    m(this, "mask");
    m(this, "children");
    m(this, "_tag", "IndexedNode");
    this.edit = n, this.mask = i, this.children = s;
  }
  modify(n, i, s, a, u, h) {
    const d = this.mask, _ = this.children, g = ui(i, a), w = Yn(g), v = r_(d, w), P = d & w, x = fo(this, n);
    if (!P) {
      const rt = new sn().modify(n, i + En, s, a, u, h);
      return rt ? _.length >= Ub ? Xb(n, g, rt, d, _) : new li(n, d | w, Kb(x, v, rt, _)) : this;
    }
    const C = _[v], I = C.modify(n, i + En, s, a, u, h);
    if (C === I) return this;
    let W = d, lt;
    if (ke(I)) {
      if (W &= ~w, !W) return new sn();
      if (_.length <= 2 && Jb(_[v ^ 1]))
        return _[v ^ 1];
      lt = s_(x, v, _);
    } else
      lt = Qn(x, v, I, _);
    return x ? (this.mask = W, this.children = lt, this) : new li(n, W, lt);
  }
}
class Hc {
  constructor(n, i, s) {
    m(this, "edit");
    m(this, "size");
    m(this, "children");
    m(this, "_tag", "ArrayNode");
    this.edit = n, this.size = i, this.children = s;
  }
  modify(n, i, s, a, u, h) {
    let d = this.size;
    const _ = this.children, g = ui(i, a), w = _[g], v = (w || new sn()).modify(n, i + En, s, a, u, h);
    if (w === v) return this;
    const P = fo(this, n);
    let x;
    if (ke(w) && !ke(v))
      ++d, x = Qn(P, g, v, _);
    else if (!ke(w) && ke(v)) {
      if (--d, d <= Vb)
        return Yb(n, d, g, _);
      x = Qn(P, g, new sn(), _);
    } else
      x = Qn(P, g, v, _);
    return P ? (this.size = d, this.children = x, this) : new Hc(n, d, x);
  }
}
function Yb(t, n, i, s) {
  const a = new Array(n - 1);
  let u = 0, h = 0;
  for (let d = 0, _ = s.length; d < _; ++d)
    if (d !== i) {
      const g = s[d];
      g && !ke(g) && (a[u++] = g, h |= 1 << d);
    }
  return new li(t, h, a);
}
function Xb(t, n, i, s, a) {
  const u = [];
  let h = s, d = 0;
  for (let _ = 0; h; ++_)
    h & 1 && (u[_] = a[d++]), h >>>= 1;
  return u[n] = i, new Hc(t, d + 1, u);
}
function Qb(t, n, i, s, a, u) {
  if (i === a) return new Zc(t, i, [u, s]);
  const h = ui(n, i), d = ui(n, a);
  if (h === d)
    return (_) => new li(t, Yn(h) | Yn(d), [_]);
  {
    const _ = h < d ? [s, u] : [u, s];
    return new li(t, Yn(h) | Yn(d), _);
  }
}
function o_(t, n, i, s, a, u) {
  let h, d = n;
  for (; ; ) {
    const _ = Qb(t, d, i, s, a, u);
    if (typeof _ == "function")
      h = Gb(_, h), d = d + En;
    else {
      let g = _;
      for (; h != null; )
        g = h.value(g), h = h.previous;
      return g;
    }
  }
}
const a_ = "effect/HashMap", Da = /* @__PURE__ */ Symbol.for(a_), t0 = {
  [Da]: Da,
  [Symbol.iterator]() {
    return new _o(this, (t, n) => [t, n]);
  },
  [tt]() {
    let t = B(a_);
    for (const n of this)
      t ^= T(B(n[0]), ut(B(n[1])));
    return kt(this, t);
  },
  [J](t) {
    if (i0(t)) {
      if (t._size !== this._size)
        return !1;
      for (const n of this) {
        const i = T(t, jc(n[0], B(n[0])));
        if (te(i))
          return !1;
        if (!Y(n[1], i.value))
          return !1;
      }
      return !0;
    }
    return !1;
  },
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(Wt)
    };
  },
  [Lt]() {
    return this.toJSON();
  },
  pipe() {
    return j(this, arguments);
  }
}, Wc = (t, n, i, s) => {
  const a = Object.create(t0);
  return a._editable = t, a._edit = n, a._root = i, a._size = s, a;
};
class _o {
  constructor(n, i) {
    m(this, "map");
    m(this, "f");
    m(this, "v");
    this.map = n, this.f = i, this.v = c_(this.map._root, this.f, void 0);
  }
  next() {
    if (te(this.v))
      return {
        done: !0,
        value: void 0
      };
    const n = this.v.value;
    return this.v = Bs(n.cont), {
      done: !1,
      value: n.value
    };
  }
  [Symbol.iterator]() {
    return new _o(this.map, this.f);
  }
}
const Bs = (t) => t ? u_(t[0], t[1], t[2], t[3], t[4]) : H(), c_ = (t, n, i = void 0) => {
  switch (t._tag) {
    case "LeafNode":
      return Fe(t.value) ? nt({
        value: n(t.key, t.value.value),
        cont: i
      }) : Bs(i);
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const s = t.children;
      return u_(s.length, s, 0, n, i);
    }
    default:
      return Bs(i);
  }
}, u_ = (t, n, i, s, a) => {
  for (; i < t; ) {
    const u = n[i++];
    if (u && !ke(u))
      return c_(u, s, [t, n, i, s, a]);
  }
  return Bs(a);
}, e0 = /* @__PURE__ */ Wc(!1, 0, /* @__PURE__ */ new sn(), 0), mo = () => e0, n0 = (t) => {
  const n = h_(mo());
  for (const i of t)
    ar(n, i[0], i[1]);
  return c0(n);
}, i0 = (t) => X(t, Da), r0 = (t) => t && ke(t._root), s0 = /* @__PURE__ */ y(2, (t, n) => jc(t, n, B(n))), jc = /* @__PURE__ */ y(3, (t, n, i) => {
  let s = t._root, a = 0;
  for (; ; )
    switch (s._tag) {
      case "LeafNode":
        return Y(n, s.key) ? s.value : H();
      case "CollisionNode": {
        if (i === s.hash) {
          const u = s.children;
          for (let h = 0, d = u.length; h < d; ++h) {
            const _ = u[h];
            if ("key" in _ && Y(n, _.key))
              return _.value;
          }
        }
        return H();
      }
      case "IndexedNode": {
        const u = ui(a, i), h = Yn(u);
        if (s.mask & h) {
          s = s.children[r_(s.mask, h)], a += En;
          break;
        }
        return H();
      }
      case "ArrayNode": {
        if (s = s.children[ui(a, i)], s) {
          a += En;
          break;
        }
        return H();
      }
      default:
        return H();
    }
}), o0 = /* @__PURE__ */ y(2, (t, n) => Fe(jc(t, n, B(n)))), ar = /* @__PURE__ */ y(3, (t, n, i) => Uc(t, n, () => nt(i))), a0 = /* @__PURE__ */ y(3, (t, n, i) => t._editable ? (t._root = n, t._size = i, t) : n === t._root ? t : Wc(t._editable, t._edit, n, i)), l_ = (t) => new _o(t, (n) => n), Za = (t) => t._size, h_ = (t) => Wc(!0, t._edit + 1, t._root, t._size), c0 = (t) => (t._editable = !1, t), Uc = /* @__PURE__ */ y(3, (t, n, i) => u0(t, n, B(n), i)), u0 = /* @__PURE__ */ y(4, (t, n, i, s) => {
  const a = {
    value: t._size
  }, u = t._root.modify(t._editable ? t._edit : NaN, 0, s, i, n, a);
  return T(t, a0(u, a.value));
}), lh = /* @__PURE__ */ y(2, (t, n) => Uc(t, n, H)), l0 = /* @__PURE__ */ y(2, (t, n) => po(t, mo(), (i, s, a) => ar(i, a, n(s, a)))), h0 = /* @__PURE__ */ y(2, (t, n) => po(t, void 0, (i, s, a) => n(s, a))), po = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = t._root;
  if (s._tag === "LeafNode")
    return Fe(s.value) ? i(n, s.value.value, s.key) : n;
  if (s._tag === "EmptyNode")
    return n;
  const a = [s.children];
  let u;
  for (; u = a.pop(); )
    for (let h = 0, d = u.length; h < d; ) {
      const _ = u[h++];
      _ && !ke(_) && (_._tag === "LeafNode" ? Fe(_.value) && (n = i(n, _.value.value, _.key)) : a.push(_.children));
    }
  return n;
}), f_ = "effect/HashSet", Ha = /* @__PURE__ */ Symbol.for(f_), f0 = {
  [Ha]: Ha,
  [Symbol.iterator]() {
    return l_(this._keyMap);
  },
  [tt]() {
    return kt(this, ut(B(this._keyMap))(B(f_)));
  },
  [J](t) {
    return d0(t) ? Za(this._keyMap) === Za(t._keyMap) && Y(this._keyMap, t._keyMap) : !1;
  },
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(Wt)
    };
  },
  [Lt]() {
    return this.toJSON();
  },
  pipe() {
    return j(this, arguments);
  }
}, go = (t) => {
  const n = Object.create(f0);
  return n._keyMap = t, n;
}, d0 = (t) => X(t, Ha), _0 = /* @__PURE__ */ go(/* @__PURE__ */ mo()), yo = () => _0, m0 = (t) => {
  const n = Vc(yo());
  for (const i of t)
    cr(n, i);
  return qc(n);
}, p0 = (...t) => {
  const n = Vc(yo());
  for (const i of t)
    cr(n, i);
  return qc(n);
}, g0 = /* @__PURE__ */ y(2, (t, n) => o0(t._keyMap, n)), y0 = (t) => Za(t._keyMap), Vc = (t) => go(h_(t._keyMap)), qc = (t) => (t._keyMap._editable = !1, t), d_ = /* @__PURE__ */ y(2, (t, n) => {
  const i = Vc(t);
  return n(i), qc(i);
}), cr = /* @__PURE__ */ y(2, (t, n) => t._keyMap._editable ? (ar(n, !0)(t._keyMap), t) : go(ar(n, !0)(t._keyMap))), __ = /* @__PURE__ */ y(2, (t, n) => t._keyMap._editable ? (lh(n)(t._keyMap), t) : go(lh(n)(t._keyMap))), v0 = /* @__PURE__ */ y(2, (t, n) => d_(t, (i) => {
  for (const s of n)
    __(i, s);
})), b0 = /* @__PURE__ */ y(2, (t, n) => d_(yo(), (i) => {
  w0(t, (s) => cr(i, s));
  for (const s of n)
    cr(i, s);
})), w0 = /* @__PURE__ */ y(2, (t, n) => h0(t._keyMap, (i, s) => n(s))), S0 = /* @__PURE__ */ y(3, (t, n, i) => po(t._keyMap, n, (s, a, u) => i(s, u))), kn = yo, T0 = m0, Gc = p0, P0 = g0, m_ = y0, nr = cr, p_ = __, hh = v0, ur = b0, $s = S0, fh = /* @__PURE__ */ Symbol.for("effect/MutableRef"), x0 = {
  [fh]: fh,
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: Wt(this.current)
    };
  },
  [Lt]() {
    return this.toJSON();
  },
  pipe() {
    return j(this, arguments);
  }
}, Kc = (t) => {
  const n = Object.create(x0);
  return n.current = t, n;
}, hi = (t) => t.current, Jc = /* @__PURE__ */ y(2, (t, n) => (t.current = n, t)), Yc = "effect/FiberId", lr = /* @__PURE__ */ Symbol.for(Yc), zs = "None", Wa = "Runtime", E0 = "Composite", k0 = /* @__PURE__ */ Ot(`${Yc}-${zs}`);
var gf;
let L0 = class {
  constructor() {
    m(this, gf, lr);
    m(this, "_tag", zs);
    m(this, "id", -1);
    m(this, "startTimeMillis", -1);
  }
  [(gf = lr, tt)]() {
    return k0;
  }
  [J](n) {
    return g_(n) && n._tag === zs;
  }
  toString() {
    return Kt(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [Lt]() {
    return this.toJSON();
  }
};
var yf;
class M0 {
  constructor(n, i) {
    m(this, "id");
    m(this, "startTimeMillis");
    m(this, yf, lr);
    m(this, "_tag", Wa);
    this.id = n, this.startTimeMillis = i;
  }
  [(yf = lr, tt)]() {
    return kt(this, Ot(`${Yc}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [J](n) {
    return g_(n) && n._tag === Wa && this.id === n.id && this.startTimeMillis === n.startTimeMillis;
  }
  toString() {
    return Kt(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [Lt]() {
    return this.toJSON();
  }
}
const C0 = /* @__PURE__ */ new L0(), g_ = (t) => X(t, lr), ja = (t) => {
  switch (t._tag) {
    case zs:
      return kn();
    case Wa:
      return Gc(t.id);
    case E0:
      return T(ja(t.left), ur(ja(t.right)));
  }
}, dh = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => Kc(0)), y_ = (t) => Array.from(ja(t)).map((i) => `#${i}`).join(","), I0 = () => {
  const t = hi(dh);
  return T(dh, Jc(t + 1)), new M0(t, Date.now());
}, fi = C0, O0 = y_, v_ = I0, Xc = mo, R0 = n0, N0 = r0, b_ = s0, w_ = ar, S_ = l_, A0 = Uc, F0 = l0, T_ = po, hr = /* @__PURE__ */ Symbol.for("effect/List"), Ua = (t) => $t(t), B0 = (t) => Iy(Fc(t), Ua), $0 = /* @__PURE__ */ B0(Y), z0 = {
  [hr]: hr,
  _tag: "Cons",
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: Ua(this).map(Wt)
    };
  },
  [Lt]() {
    return this.toJSON();
  },
  [J](t) {
    return x_(t) && this._tag === t._tag && $0(this, t);
  },
  [tt]() {
    return kt(this, Pr(Ua(this)));
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
    return j(this, arguments);
  }
}, Ds = (t, n) => {
  const i = Object.create(z0);
  return i.head = t, i.tail = n, i;
}, D0 = /* @__PURE__ */ Ot("Nil"), Z0 = {
  [hr]: hr,
  _tag: "Nil",
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [Lt]() {
    return this.toJSON();
  },
  [tt]() {
    return D0;
  },
  [J](t) {
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
    return j(this, arguments);
  }
}, P_ = /* @__PURE__ */ Object.create(Z0), x_ = (t) => X(t, hr), Ge = (t) => t._tag === "Nil", H0 = (t) => t._tag === "Cons", W0 = () => P_, Ln = (t, n) => Ds(t, n), di = W0, Qc = (t) => Ds(t, P_), j0 = /* @__PURE__ */ y(2, (t, n) => V0(n, t)), U0 = /* @__PURE__ */ y(2, (t, n) => Ln(n, t)), V0 = /* @__PURE__ */ y(2, (t, n) => {
  if (Ge(t))
    return n;
  if (Ge(n))
    return t;
  {
    const i = Ds(n.head, t);
    let s = i, a = n.tail;
    for (; !Ge(a); ) {
      const u = Ds(a.head, t);
      s.tail = u, s = u, a = a.tail;
    }
    return i;
  }
}), q0 = /* @__PURE__ */ y(3, (t, n, i) => {
  let s = n, a = t;
  for (; !Ge(a); )
    s = i(s, a.head), a = a.tail;
  return s;
}), G0 = (t) => {
  let n = di(), i = t;
  for (; !Ge(i); )
    n = U0(n, i.head), i = i.tail;
  return n;
}, tu = /* @__PURE__ */ function() {
  function t(n) {
    n && Object.assign(this, n);
  }
  return t.prototype = Rc, t;
}(), K0 = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function _h(t) {
  return t;
}
const Mr = {
  ...tu.prototype,
  [K0]: {
    _Value: _h,
    _Patch: _h
  }
}, J0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Mr), {
  _tag: "Empty"
}), Y0 = /* @__PURE__ */ Object.create(J0), E_ = () => Y0, X0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Mr), {
  _tag: "AndThen"
}), Q0 = (t, n) => {
  const i = Object.create(X0);
  return i.first = t, i.second = n, i;
}, tw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Mr), {
  _tag: "AddService"
}), ew = (t, n) => {
  const i = Object.create(tw);
  return i.key = t, i.service = n, i;
}, nw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Mr), {
  _tag: "RemoveService"
}), iw = (t) => {
  const n = Object.create(nw);
  return n.key = t, n;
}, rw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Mr), {
  _tag: "UpdateService"
}), sw = (t, n) => {
  const i = Object.create(rw);
  return i.key = t, i.update = n, i;
}, ow = (t, n) => {
  const i = new Map(t.unsafeMap);
  let s = E_();
  for (const [a, u] of n.unsafeMap.entries())
    if (i.has(a)) {
      const h = i.get(a);
      i.delete(a), Y(h, u) || (s = ws(sw(a, () => u))(s));
    } else
      i.delete(a), s = ws(ew(a, u))(s);
  for (const [a] of i.entries())
    s = ws(iw(a))(s);
  return s;
}, ws = /* @__PURE__ */ y(2, (t, n) => Q0(t, n)), aw = /* @__PURE__ */ y(2, (t, n) => {
  if (t._tag === "Empty")
    return n;
  let i = !1, s = re(t);
  const a = new Map(n.unsafeMap);
  for (; Ye(s); ) {
    const h = Ae(s), d = Ve(s);
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
    return ai(a);
  const u = /* @__PURE__ */ new Map();
  for (const [h] of n.unsafeMap)
    a.has(h) && (u.set(h, a.get(h)), a.delete(h));
  for (const [h, d] of a)
    u.set(h, d);
  return ai(u);
}), cw = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function va(t) {
  return t;
}
const vo = {
  ...tu.prototype,
  [cw]: {
    _Value: va,
    _Key: va,
    _Patch: va
  }
}, uw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(vo), {
  _tag: "Empty"
}), lw = /* @__PURE__ */ Object.create(uw), k_ = () => lw, hw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(vo), {
  _tag: "AndThen"
}), fw = (t, n) => {
  const i = Object.create(hw);
  return i.first = t, i.second = n, i;
}, dw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(vo), {
  _tag: "Add"
}), _w = (t) => {
  const n = Object.create(dw);
  return n.value = t, n;
}, mw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(vo), {
  _tag: "Remove"
}), pw = (t) => {
  const n = Object.create(mw);
  return n.value = t, n;
}, gw = (t, n) => {
  const [i, s] = $s([t, k_()], ([a, u], h) => P0(h)(a) ? [p_(h)(a), u] : [a, Va(_w(h))(u)])(n);
  return $s(s, (a, u) => Va(pw(u))(a))(i);
}, Va = /* @__PURE__ */ y(2, (t, n) => fw(t, n)), yw = /* @__PURE__ */ y(2, (t, n) => {
  if (t._tag === "Empty")
    return n;
  let i = n, s = re(t);
  for (; Ye(s); ) {
    const a = Ae(s), u = Ve(s);
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
        i = nr(a.value)(i), s = u;
        break;
      }
      case "Remove":
        i = p_(a.value)(i), s = u;
    }
  }
  return i;
}), vw = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function mh(t) {
  return t;
}
const Cr = {
  ...tu.prototype,
  [vw]: {
    _Value: mh,
    _Patch: mh
  }
}, bw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Cr), {
  _tag: "Empty"
}), ww = /* @__PURE__ */ Object.create(bw), L_ = () => ww, Sw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Cr), {
  _tag: "AndThen"
}), Tw = (t, n) => {
  const i = Object.create(Sw);
  return i.first = t, i.second = n, i;
}, Pw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Cr), {
  _tag: "Append"
}), xw = (t) => {
  const n = Object.create(Pw);
  return n.values = t, n;
}, Ew = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Cr), {
  _tag: "Slice"
}), kw = (t, n) => {
  const i = Object.create(Ew);
  return i.from = t, i.until = n, i;
}, Lw = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Cr), {
  _tag: "Update"
}), Mw = (t, n) => {
  const i = Object.create(Lw);
  return i.index = t, i.patch = n, i;
}, Cw = (t) => {
  let n = 0, i = L_();
  for (; n < t.oldValue.length && n < t.newValue.length; ) {
    const s = t.oldValue[n], a = t.newValue[n], u = t.differ.diff(s, a);
    Y(u, t.differ.empty) || (i = Ss(i, Mw(n, u))), n = n + 1;
  }
  return n < t.oldValue.length && (i = Ss(i, kw(0, n))), n < t.newValue.length && (i = Ss(i, xw($v(n)(t.newValue)))), i;
}, Ss = /* @__PURE__ */ y(2, (t, n) => Tw(t, n)), Iw = /* @__PURE__ */ y(3, (t, n, i) => {
  if (t._tag === "Empty")
    return n;
  let s = n.slice(), a = xe(t);
  for (; Ov(a); ) {
    const u = ie(a), h = si(a);
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
}), Ow = /* @__PURE__ */ Symbol.for("effect/Differ"), Rw = {
  [Ow]: {
    _P: gt,
    _V: gt
  },
  pipe() {
    return j(this, arguments);
  }
}, Si = (t) => {
  const n = Object.create(Rw);
  return n.empty = t.empty, n.diff = t.diff, n.combine = t.combine, n.patch = t.patch, n;
}, Nw = () => Si({
  empty: E_(),
  combine: (t, n) => ws(n)(t),
  diff: (t, n) => ow(t, n),
  patch: (t, n) => aw(n)(t)
}), Aw = () => Si({
  empty: k_(),
  combine: (t, n) => Va(n)(t),
  diff: (t, n) => gw(t, n),
  patch: (t, n) => yw(n)(t)
}), Fw = (t) => Si({
  empty: L_(),
  combine: (n, i) => Ss(n, i),
  diff: (n, i) => Cw({
    oldValue: n,
    newValue: i,
    differ: t
  }),
  patch: (n, i) => Iw(n, i, t)
}), M_ = () => Bw((t, n) => n), Bw = (t) => Si({
  empty: gt,
  combine: (n, i) => n === gt ? i : i === gt ? n : (s) => i(n(s)),
  diff: (n, i) => Y(n, i) ? gt : ro(i),
  patch: (n, i) => t(i, n(i))
}), fr = 255, C_ = 8, qa = (t) => t & fr, Ga = (t) => t >> C_ & fr, Ir = (t, n) => (t & fr) + ((n & t & fr) << C_), $w = /* @__PURE__ */ Ir(0, 0), zw = (t) => Ir(t, t), Dw = (t) => Ir(t, 0), Zw = /* @__PURE__ */ y(2, (t, n) => Ir(qa(t) & ~n, Ga(t))), Hw = /* @__PURE__ */ y(2, (t, n) => t | n), Ww = (t) => ~t >>> 0 & fr, jw = 0, Ti = 1, Uw = 2, I_ = 4, Ka = 16, O_ = 32, Vw = (t) => bo(t, O_), qw = /* @__PURE__ */ y(2, (t, n) => t | n), en = (t) => R_(t) && !Kw(t), R_ = (t) => bo(t, Ti), bo = /* @__PURE__ */ y(2, (t, n) => (t & n) !== 0), N_ = (...t) => t.reduce((n, i) => n | i, 0), Gw = /* @__PURE__ */ N_(jw), ph = (t) => bo(t, I_), Kw = (t) => bo(t, Ka), Ts = /* @__PURE__ */ y(2, (t, n) => Ir(t ^ n, n)), Ps = /* @__PURE__ */ y(2, (t, n) => t & (Ww(qa(n)) | Ga(n)) | qa(n) & Ga(n)), gh = /* @__PURE__ */ Si({
  empty: $w,
  diff: (t, n) => Ts(t, n),
  combine: (t, n) => Hw(n)(t),
  patch: (t, n) => Ps(n, t)
}), Jw = zw, A_ = Dw, yh = Zw, F_ = (t, n) => ({
  _tag: "Par",
  left: t,
  right: n
}), ds = (t, n) => ({
  _tag: "Seq",
  left: t,
  right: n
}), Yw = (t) => {
  let n = Qc(t), i = di();
  for (; ; ) {
    const [s, a] = q0(n, [B_(), di()], ([u, h], d) => {
      const [_, g] = Xw(d);
      return [iS(u, _), j0(h, g)];
    });
    if (i = Qw(i, s), Ge(a))
      return G0(i);
    n = a;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Xw = (t) => {
  let n = t, i = B_(), s = di(), a = di();
  for (; ; )
    switch (n._tag) {
      case "Empty": {
        if (Ge(s))
          return [i, a];
        n = s.head, s = s.tail;
        break;
      }
      case "Par": {
        s = Ln(n.right, s), n = n.left;
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
            n = F_(ds(d, h), ds(_, h));
            break;
          }
          case "Seq": {
            const d = u.left, _ = u.right;
            n = ds(d, ds(_, h));
            break;
          }
          case "Single": {
            n = u, a = Ln(h, a);
            break;
          }
        }
        break;
      }
      case "Single": {
        if (i = nS(i, n), Ge(s))
          return [i, a];
        n = s.head, s = s.tail;
        break;
      }
    }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Qw = (t, n) => {
  if (Ge(t))
    return Qc(ba(n));
  if (rS(n))
    return t;
  const i = lS(t.head), s = sS(n);
  return i.length === 1 && s.length === 1 && Y(i[0], s[0]) ? Ln(uS(t.head, ba(n)), t.tail) : Ln(ba(n), t);
}, tS = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel"), eS = {
  /* c8 ignore next */
  _R: (t) => t
};
var vf;
vf = tS;
class eu {
  constructor(n) {
    m(this, "map");
    m(this, vf, eS);
    this.map = n;
  }
}
const B_ = () => new eu(Xc()), nS = (t, n) => new eu(A0(t.map, n.dataSource, (i) => bv(wv(i, wb(n.blockedRequest)), () => re(n.blockedRequest)))), iS = (t, n) => new eu(T_(t.map, n.map, (i, s, a) => w_(i, a, an(b_(i, a), {
  onNone: () => s,
  onSome: (u) => Ee(s, u)
})))), rS = (t) => N0(t.map), sS = (t) => Array.from(S_(t.map)), ba = (t) => cS(F0(t.map, (n) => re(n))), oS = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential"), aS = {
  /* c8 ignore next */
  _R: (t) => t
};
var bf;
bf = oS;
class $_ {
  constructor(n) {
    m(this, "map");
    m(this, bf, aS);
    this.map = n;
  }
}
const cS = (t) => new $_(t), uS = (t, n) => new $_(T_(n.map, t.map, (i, s, a) => w_(i, a, an(b_(i, a), {
  onNone: () => Be(),
  onSome: (u) => Ee(u, s)
})))), lS = (t) => Array.from(S_(t.map)), hS = (t) => Array.from(t.map), Pi = "Die", Mn = "Empty", xi = "Fail", Ei = "Interrupt", _i = "Parallel", mi = "Sequential", z_ = "effect/Cause", D_ = /* @__PURE__ */ Symbol.for(z_), fS = {
  /* c8 ignore next */
  _E: (t) => t
}, ki = {
  [D_]: fS,
  [tt]() {
    return T(B(z_), ut(B(PS(this))), kt(this));
  },
  [J](t) {
    return dS(t) && TS(this, t);
  },
  pipe() {
    return j(this, arguments);
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
          defect: Wt(this.defect)
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
          failure: Wt(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: Wt(this.left),
          right: Wt(this.right)
        };
    }
  },
  toString() {
    return Or(this);
  },
  [Lt]() {
    return this.toJSON();
  }
}, pi = /* @__PURE__ */ (() => {
  const t = /* @__PURE__ */ Object.create(ki);
  return t._tag = Mn, t;
})(), dr = (t) => {
  const n = Object.create(ki);
  return n._tag = xi, n.error = t, n;
}, Ke = (t) => {
  const n = Object.create(ki);
  return n._tag = Pi, n.defect = t, n;
}, nn = (t) => {
  const n = Object.create(ki);
  return n._tag = Ei, n.fiberId = t, n;
}, wo = (t, n) => {
  const i = Object.create(ki);
  return i._tag = _i, i.left = t, i.right = n, i;
}, we = (t, n) => {
  const i = Object.create(ki);
  return i._tag = mi, i.left = t, i.right = n, i;
}, dS = (t) => X(t, D_), _S = (t) => t._tag === Mn, mS = (t) => t._tag === Pi, pS = (t) => t._tag === Mn ? !0 : gi(t, !0, (n, i) => {
  switch (i._tag) {
    case Mn:
      return nt(n);
    case Pi:
    case xi:
    case Ei:
      return nt(!1);
    default:
      return H();
  }
}), Z_ = (t) => Fe(wS(t)), nu = (t) => ru(void 0, ES)(t), gS = (t) => Pn(gi(t, Be(), (n, i) => i._tag === xi ? nt(T(n, Se(i.error))) : H())), yS = (t) => Pn(gi(t, Be(), (n, i) => i._tag === Pi ? nt(T(n, Se(i.defect))) : H())), vS = (t) => gi(t, kn(), (n, i) => i._tag === Ei ? nt(T(n, nr(i.fiberId))) : H()), bS = (t) => iu(t, (n) => n._tag === xi ? nt(n.error) : H()), H_ = (t) => {
  const n = bS(t);
  switch (n._tag) {
    case "None":
      return Ue(t);
    case "Some":
      return ri(n.value);
  }
}, wS = (t) => iu(t, (n) => n._tag === Ei ? nt(n.fiberId) : H()), vh = (t) => W_(t, {
  onEmpty: pi,
  onFail: () => pi,
  onDie: Ke,
  onInterrupt: nn,
  onSequential: we,
  onParallel: wo
}), SS = (t) => W_(t, {
  onEmpty: pi,
  onFail: Ke,
  onDie: Ke,
  onInterrupt: nn,
  onSequential: we,
  onParallel: wo
}), TS = (t, n) => {
  let i = re(t), s = re(n);
  for (; Ye(i) && Ye(s); ) {
    const [a, u] = T(Ae(i), gi([kn(), Be()], ([_, g], w) => {
      const [v, P] = Ja(w);
      return nt([T(_, ur(v)), T(g, Ee(P))]);
    })), [h, d] = T(Ae(s), gi([kn(), Be()], ([_, g], w) => {
      const [v, P] = Ja(w);
      return nt([T(_, ur(v)), T(g, Ee(P))]);
    }));
    if (!Y(a, h))
      return !1;
    i = u, s = d;
  }
  return !0;
}, PS = (t) => xS(re(t), Be()), xS = (t, n) => {
  for (; ; ) {
    const [i, s] = T(t, Dd([kn(), Be()], ([u, h], d) => {
      const [_, g] = Ja(d);
      return [T(u, ur(_)), T(h, Ee(g))];
    })), a = m_(i) > 0 ? T(n, Se(i)) : n;
    if (Sb(s))
      return Pn(a);
    t = s, n = a;
  }
  throw new Error(ao("Cause.flattenCauseLoop"));
}, iu = /* @__PURE__ */ y(2, (t, n) => {
  const i = [t];
  for (; i.length > 0; ) {
    const s = i.pop(), a = n(s);
    switch (a._tag) {
      case "None": {
        switch (s._tag) {
          case mi:
          case _i: {
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
  return H();
}), Ja = (t) => {
  let n = t;
  const i = [];
  let s = kn(), a = Be();
  for (; n !== void 0; )
    switch (n._tag) {
      case Mn: {
        if (i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case xi: {
        if (s = nr(s, ga(n._tag, n.error)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case Pi: {
        if (s = nr(s, ga(n._tag, n.defect)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case Ei: {
        if (s = nr(s, ga(n._tag, n.fiberId)), i.length === 0)
          return [s, a];
        n = i.pop();
        break;
      }
      case mi: {
        switch (n.left._tag) {
          case Mn: {
            n = n.right;
            break;
          }
          case mi: {
            n = we(n.left.left, we(n.left.right, n.right));
            break;
          }
          case _i: {
            n = wo(we(n.left.left, n.right), we(n.left.right, n.right));
            break;
          }
          default: {
            a = Se(a, n.right), n = n.left;
            break;
          }
        }
        break;
      }
      case _i: {
        i.push(n.right), n = n.left;
        break;
      }
    }
  throw new Error(ao("Cause.evaluateCauseLoop"));
}, ES = {
  emptyCase: eh,
  failCase: Oa,
  dieCase: Oa,
  interruptCase: eh,
  sequentialCase: (t, n, i) => n && i,
  parallelCase: (t, n, i) => n && i
}, bh = "SequentialCase", wh = "ParallelCase", W_ = /* @__PURE__ */ y(2, (t, {
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
})), gi = /* @__PURE__ */ y(3, (t, n, i) => {
  let s = n, a = t;
  const u = [];
  for (; a !== void 0; ) {
    const h = i(s, a);
    switch (s = Fe(h) ? h.value : s, a._tag) {
      case mi: {
        u.push(a.right), a = a.left;
        break;
      }
      case _i: {
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
      case Mn: {
        a.push(Ue(i.emptyCase(n)));
        break;
      }
      case xi: {
        a.push(Ue(i.failCase(n, h.error)));
        break;
      }
      case Pi: {
        a.push(Ue(i.dieCase(n, h.defect)));
        break;
      }
      case Ei: {
        a.push(Ue(i.interruptCase(n, h.fiberId)));
        break;
      }
      case mi: {
        s.push(h.right), s.push(h.left), a.push(ri({
          _tag: bh
        }));
        break;
      }
      case _i: {
        s.push(h.right), s.push(h.left), a.push(ri({
          _tag: wh
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
          case bh: {
            const d = u.pop(), _ = u.pop(), g = i.sequentialCase(n, d, _);
            u.push(g);
            break;
          }
          case wh: {
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
}), Or = (t, n) => nu(t) ? "All fibers interrupted without errors." : U_(t).map(function(i) {
  return (n == null ? void 0 : n.renderErrorCause) !== !0 || i.cause === void 0 ? i.stack : `${i.stack} {
${j_(i.cause, "  ")}
}`;
}).join(`
`), j_ = (t, n) => {
  const i = t.stack.split(`
`);
  let s = `${n}[cause]: ${i[0]}`;
  for (let a = 1, u = i.length; a < u; a++)
    s += `
${n}${i[a]}`;
  return t.cause && (s += ` {
${j_(t.cause, `${n}  `)}
${n}}`), s;
};
class Zs extends globalThis.Error {
  constructor(i) {
    const s = typeof i == "object" && i !== null, a = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(kS(i), s && "cause" in i && typeof i.cause < "u" ? {
      cause: new Zs(i.cause)
    } : void 0);
    m(this, "span");
    this.message === "" && (this.message = "An error has occurred"), Error.stackTraceLimit = a, this.name = i instanceof Error ? i.name : "Error", s && (yi in i && (this.span = i[yi]), Object.keys(i).forEach((u) => {
      u in this || (this[u] = i[u]);
    })), this.stack = CS(`${this.name}: ${this.message}`, i instanceof Error && i.stack ? i.stack : "", this.span);
  }
}
const kS = (t) => {
  if (typeof t == "string")
    return t;
  if (typeof t == "object" && t !== null && t instanceof Error)
    return t.message;
  try {
    if (X(t, "toString") && so(t.toString) && t.toString !== Object.prototype.toString && t.toString !== globalThis.Array.prototype.toString)
      return t.toString();
  } catch {
  }
  return vd(t);
}, LS = /\((.*)\)/g, MS = /* @__PURE__ */ ft("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap()), CS = (t, n, i) => {
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
      const d = MS.get(u);
      if (typeof d == "function") {
        const _ = d();
        if (typeof _ == "string") {
          const g = _.matchAll(LS);
          let w = !1;
          for (const [, v] of g)
            w = !0, s.push(`    at ${u.name} (${v})`);
          w || s.push(`    at ${u.name} (${_.replace(/^at /, "")})`);
        } else
          s.push(`    at ${u.name}`);
      } else
        s.push(`    at ${u.name}`);
      u = mn(u.parent), h++;
    }
  }
  return s.join(`
`);
}, yi = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation"), U_ = (t) => ru(t, void 0, {
  emptyCase: () => [],
  dieCase: (n, i) => [new Zs(i)],
  failCase: (n, i) => [new Zs(i)],
  interruptCase: () => [],
  parallelCase: (n, i, s) => [...i, ...s],
  sequentialCase: (n, i, s) => [...i, ...s]
}), So = "Pending", V_ = "Done", IS = "effect/Deferred", OS = /* @__PURE__ */ Symbol.for(IS), RS = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, NS = (t) => ({
  _tag: So,
  joiners: t
}), AS = (t) => ({
  _tag: V_,
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
const q_ = (t, n) => {
  const i = new jt("Blocked");
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}, FS = (t) => {
  const n = new jt("RunBlocked");
  return n.effect_instruction_i0 = t, n;
}, vi = /* @__PURE__ */ Symbol.for("effect/Effect");
class BS {
  constructor(n, i) {
    m(this, "patch");
    m(this, "op");
    m(this, "_op", Ic);
    this.patch = n, this.op = i;
  }
}
var wf;
class jt {
  constructor(n) {
    m(this, "_op");
    m(this, "effect_instruction_i0");
    m(this, "effect_instruction_i1");
    m(this, "effect_instruction_i2");
    m(this, "trace");
    m(this, wf, ii);
    this._op = n;
  }
  [(wf = vi, J)](n) {
    return this === n;
  }
  [tt]() {
    return kt(this, kc(this));
  }
  pipe() {
    return j(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: Wt(this.effect_instruction_i0),
      effect_instruction_i1: Wt(this.effect_instruction_i1),
      effect_instruction_i2: Wt(this.effect_instruction_i2)
    };
  }
  toString() {
    return Kt(this.toJSON());
  }
  [Lt]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Rr(new Tr(this));
  }
}
var Sf;
class G_ {
  constructor(n) {
    m(this, "_op");
    m(this, "effect_instruction_i0");
    m(this, "effect_instruction_i1");
    m(this, "effect_instruction_i2");
    m(this, "trace");
    m(this, Sf, ii);
    this._op = n, this._tag = n;
  }
  [(Sf = vi, J)](n) {
    return Lo(n) && n._op === "Failure" && // @ts-expect-error
    Y(this.effect_instruction_i0, n.effect_instruction_i0);
  }
  [tt]() {
    return T(
      // @ts-expect-error
      Ot(this._tag),
      // @ts-expect-error
      ut(B(this.effect_instruction_i0)),
      kt(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return j(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return Kt(this.toJSON());
  }
  [Lt]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Rr(new Tr(this));
  }
}
var Tf;
class K_ {
  constructor(n) {
    m(this, "_op");
    m(this, "effect_instruction_i0");
    m(this, "effect_instruction_i1");
    m(this, "effect_instruction_i2");
    m(this, "trace");
    m(this, Tf, ii);
    this._op = n, this._tag = n;
  }
  [(Tf = vi, J)](n) {
    return Lo(n) && n._op === "Success" && // @ts-expect-error
    Y(this.effect_instruction_i0, n.effect_instruction_i0);
  }
  [tt]() {
    return T(
      // @ts-expect-error
      Ot(this._tag),
      // @ts-expect-error
      ut(B(this.effect_instruction_i0)),
      kt(this)
    );
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return j(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: Wt(this.value)
    };
  }
  toString() {
    return Kt(this.toJSON());
  }
  [Lt]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Rr(new Tr(this));
  }
}
const su = (t) => X(t, vi), oe = (t) => {
  const n = new jt(Sd);
  return n.effect_instruction_i0 = t, n;
}, $S = /* @__PURE__ */ y(3, (t, n, i) => xo((s) => A(t, (a) => A(X_(At(() => s(n(a)))), (u) => At(() => i(a, u)).pipe(On({
  onFailure: (h) => {
    switch (u._tag) {
      case le:
        return ae(we(u.effect_instruction_i0, h));
      case he:
        return ae(h);
    }
  },
  onSuccess: () => u
})))))), Cn = /* @__PURE__ */ y(2, (t, n) => A(t, () => Q(n))), Nr = (t) => Cn(t, void 0), J_ = function() {
  const t = new jt(uo);
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
      throw new Error(ao("you're not supposed to end up here"));
  }
  return t;
}, Hs = (t, n = fi) => {
  const i = new jt(Qi);
  let s;
  return i.effect_instruction_i0 = (a) => {
    s = t(a);
  }, i.effect_instruction_i1 = n, im(i, (a) => su(s) ? s : Le);
}, zS = (t, n = fi) => At(() => Hs(t, n)), In = (t, n = fi) => J_(t, function() {
  let i, s;
  function a(_) {
    i ? i(_) : s === void 0 && (s = _);
  }
  const u = new jt(Qi);
  u.effect_instruction_i0 = (_) => {
    i = _, s && _(s);
  }, u.effect_instruction_i1 = n;
  let h, d;
  return this.effect_instruction_i0.length !== 1 ? (d = new AbortController(), h = Xt(() => this.effect_instruction_i0(a, d.signal))) : h = Xt(() => this.effect_instruction_i0(a)), h || d ? im(u, (_) => (d && d.abort(), h ?? Le)) : u;
}), DS = /* @__PURE__ */ y(2, (t, n) => {
  const i = new jt(ys);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}), _r = /* @__PURE__ */ y(2, (t, n) => Ar(t, {
  onFailure: n,
  onSuccess: Q
})), Sh = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation"), Y_ = (t, n) => Fe(n) ? new Proxy(t, {
  has(i, s) {
    return s === yi || s === Sh || s in i;
  },
  get(i, s) {
    return s === yi ? n.value : s === Sh ? t : i[s];
  }
}) : t, Ws = (t) => oo(t) && !(yi in t) ? oe((n) => ae(Ke(Y_(t, bm(n))))) : ae(Ke(t)), ZS = (t) => HS(() => Ke(new ST(t))), mr = (t) => Ar(t, {
  onFailure: (n) => Q(ri(n)),
  onSuccess: (n) => Q(Ue(n))
}), X_ = (t) => US(t, {
  onFailure: bt,
  onSuccess: Bt
}), Ft = (t) => oo(t) && !(yi in t) ? oe((n) => ae(dr(Y_(t, bm(n))))) : ae(dr(t)), To = (t) => A(z(t), Ft), ae = (t) => {
  const n = new G_(le);
  return n.effect_instruction_i0 = t, n;
}, HS = (t) => A(z(t), ae), WS = /* @__PURE__ */ oe((t) => Q(t.id())), Q_ = (t) => oe((n) => t(n.id())), A = /* @__PURE__ */ y(2, (t, n) => {
  const i = new jt(Cs);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n, i;
}), jS = (t) => {
  const n = new jt("OnStep");
  return n.effect_instruction_i0 = t, n;
}, tm = (t) => A(t, gt), US = /* @__PURE__ */ y(2, (t, n) => On(t, {
  onFailure: (i) => Q(n.onFailure(i)),
  onSuccess: (i) => Q(n.onSuccess(i))
})), On = /* @__PURE__ */ y(2, (t, n) => {
  const i = new jt(Is);
  return i.effect_instruction_i0 = t, i.effect_instruction_i1 = n.onFailure, i.effect_instruction_i2 = n.onSuccess, i;
}), Ar = /* @__PURE__ */ y(2, (t, n) => On(t, {
  onFailure: (i) => {
    if (yS(i).length > 0)
      return ae(SS(i));
    const a = gS(i);
    return a.length > 0 ? n.onFailure(t_(a)) : ae(i);
  },
  onSuccess: n.onSuccess
})), rn = /* @__PURE__ */ y(2, (t, n) => At(() => {
  const i = $t(t), s = Ac(i.length);
  let a = 0;
  return Cn(cu({
    while: () => a < i.length,
    body: () => n(i[a], a),
    step: (u) => {
      s[a++] = u;
    }
  }), s);
})), Po = /* @__PURE__ */ y(2, (t, n) => At(() => {
  const i = $t(t);
  let s = 0;
  return cu({
    while: () => s < i.length,
    body: () => n(i[s], s),
    step: () => {
      s++;
    }
  });
})), em = (t) => {
  const n = new jt(xr);
  return n.effect_instruction_i0 = Jw(Ti), n.effect_instruction_i1 = () => t, n;
}, yt = /* @__PURE__ */ y(2, (t, n) => A(t, (i) => z(() => n(i)))), nm = /* @__PURE__ */ y(2, (t, n) => Ar(t, {
  onFailure: (i) => To(() => n.onFailure(i)),
  onSuccess: (i) => z(() => n.onSuccess(i))
})), ou = /* @__PURE__ */ y(2, (t, n) => On(t, {
  onFailure: (i) => {
    const s = H_(i);
    switch (s._tag) {
      case "Left":
        return To(() => n(s.left));
      case "Right":
        return ae(s.right);
    }
  },
  onSuccess: Q
})), au = /* @__PURE__ */ y(2, (t, n) => xo((i) => On(i(t), {
  onFailure: (s) => {
    const a = bt(s);
    return On(n(a), {
      onFailure: (u) => bt(we(s, u)),
      onSuccess: () => a
    });
  },
  onSuccess: (s) => {
    const a = Bt(s);
    return qe(n(a), a);
  }
}))), im = /* @__PURE__ */ y(2, (t, n) => au(t, pm({
  onFailure: (i) => nu(i) ? Nr(n(vS(i))) : Le,
  onSuccess: () => Le
}))), VS = (t) => qS(t, gt), qS = /* @__PURE__ */ y(2, (t, n) => Ar(t, {
  onFailure: (i) => Ws(n(i)),
  onSuccess: Q
})), Q = (t) => {
  const n = new K_(he);
  return n.effect_instruction_i0 = t, n;
}, At = (t) => {
  const n = new jt(uo);
  return n.commit = t, n;
}, z = (t) => {
  const n = new jt(wd);
  return n.effect_instruction_i0 = t, n;
}, rm = /* @__PURE__ */ y((t) => t.length === 3 || t.length === 2 && !(oo(t[1]) && "onlyEffect" in t[1]), (t, n) => A(t, (i) => {
  const s = typeof n == "function" ? n(i) : n;
  return su(s) ? Cn(s, i) : Fy(s) ? Hs((a) => {
    s.then((u) => a(Q(i)), (u) => a(Ft(new mm(u, "An unknown error occurred in Effect.tap"))));
  }) : Q(i);
})), GS = (t) => oe((n) => {
  const i = n.getFiberRef(Xa), s = T(i, Je(() => n.scope()));
  return t(Eo(Xa, nt(s)));
}), sm = (t) => {
  const n = new jt(xr);
  return n.effect_instruction_i0 = A_(Ti), n.effect_instruction_i1 = () => t, n;
}, xo = (t) => J_(t, function() {
  const n = new jt(xr);
  return n.effect_instruction_i0 = A_(Ti), n.effect_instruction_i1 = (i) => R_(i) ? Xt(() => this.effect_instruction_i0(em)) : Xt(() => this.effect_instruction_i0(sm)), n;
}), Le = /* @__PURE__ */ Q(void 0), KS = (t) => {
  const n = new jt(xr);
  return n.effect_instruction_i0 = t, n.effect_instruction_i1 = void 0, n;
}, cu = (t) => {
  const n = new jt(Os);
  return n.effect_instruction_i0 = t.while, n.effect_instruction_i1 = t.body, n.effect_instruction_i2 = t.step, n;
}, JS = (t) => At(() => {
  const n = new jt(tr);
  return n.effect_instruction_i0 = t(), n;
}), YS = function() {
  const t = arguments.length === 1 ? arguments[0] : arguments[1].bind(arguments[0]);
  return JS(() => t(T));
}, uu = (t) => {
  const n = new jt(vs);
  return typeof (t == null ? void 0 : t.priority) < "u" ? mT(n, t.priority) : n;
}, om = /* @__PURE__ */ y(2, (t, n) => A(t, (i) => yt(n, (s) => [i, s]))), lu = /* @__PURE__ */ y(2, (t, n) => A(t, (i) => Cn(n, i))), qe = /* @__PURE__ */ y(2, (t, n) => A(t, () => n)), XS = /* @__PURE__ */ y(3, (t, n, i) => A(t, (s) => yt(n, (a) => i(s, a)))), am = (t) => A(WS, (n) => T(t, cm(n))), cm = /* @__PURE__ */ y(2, (t, n) => A(t.interruptAsFork(n), () => t.await)), QS = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return j(this, arguments);
  }
}, tT = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return j(this, arguments);
  }
}, eT = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return j(this, arguments);
  }
}, um = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return j(this, arguments);
  }
}, lm = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return j(this, arguments);
  }
}, hm = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return j(this, arguments);
  }
}, nT = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return j(this, arguments);
  }
}, iT = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return j(this, arguments);
  }
}, rT = "effect/FiberRef", sT = /* @__PURE__ */ Symbol.for(rT), oT = {
  /* c8 ignore next */
  _A: (t) => t
}, hu = (t) => oe((n) => Bt(n.getFiberRef(t))), fu = /* @__PURE__ */ y(2, (t, n) => A(hu(t), n)), Th = /* @__PURE__ */ y(2, (t, n) => aT(t, () => [void 0, n])), aT = /* @__PURE__ */ y(2, (t, n) => oe((i) => {
  const [s, a] = n(i.getFiberRef(t));
  return i.setFiberRef(t, a), Q(s);
})), Eo = /* @__PURE__ */ y(3, (t, n, i) => $S(lu(hu(n), Th(n, i)), () => t, (s) => Th(n, s))), ce = (t, n) => Li(t, {
  differ: M_(),
  fork: (n == null ? void 0 : n.fork) ?? gt,
  join: n == null ? void 0 : n.join
}), cT = (t) => {
  const n = Aw();
  return Li(t, {
    differ: n,
    fork: n.empty
  });
}, uT = (t) => {
  const n = Fw(M_());
  return Li(t, {
    differ: n,
    fork: n.empty
  });
}, fm = (t) => {
  const n = Nw();
  return Li(t, {
    differ: n,
    fork: n.empty
  });
}, Li = (t, n) => ({
  ...kr,
  [sT]: oT,
  initial: t,
  commit() {
    return hu(this);
  },
  diff: (s, a) => n.differ.diff(s, a),
  combine: (s, a) => n.differ.combine(s, a),
  patch: (s) => (a) => n.differ.patch(s, a),
  fork: n.fork,
  join: n.join ?? ((s, a) => a)
}), lT = (t) => Li(t, {
  differ: gh,
  fork: gh.empty
}), Fr = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => fm($c())), du = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => ce(0)), hT = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => ce(2048)), fT = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => ce(Xc())), dT = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => ce(lm)), _T = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => ce(di())), mT = /* @__PURE__ */ y(2, (t, n) => Eo(t, du, n)), pT = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => ce("unbounded")), gT = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => ce(!0)), yT = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => ce(nt(hm))), vT = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/versionMismatchErrorLogLevel"), () => ce(nt(um))), Ya = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => uT(oi())), Xa = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => ce(H(), {
  fork: () => H(),
  join: (t, n) => t
})), _s = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => ce(pi, {
  fork: () => pi,
  join: (t, n) => t
})), bT = (t, n) => t.addFinalizer(() => Nr(n)), wT = (t, n) => t.close(n), ko = (t, n) => t.fork(n), dm = /* @__PURE__ */ function() {
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
    [Lt]() {
      return this.toString !== globalThis.Error.prototype.toString ? this.stack ? `${this.toString()}
${this.stack.split(`
`).slice(1).join(`
`)}` : this.toString() : "Bun" in globalThis ? Or(dr(this), {
        renderErrorCause: !0
      }) : this;
    }
  }
  return Object.assign(t.prototype, ov), t;
}(), _m = (t, n) => {
  class i extends dm {
    constructor() {
      super(...arguments);
      m(this, "_tag", n);
    }
  }
  return Object.assign(i.prototype, t), i.prototype.name = n, i;
}, Ph = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException"), ST = /* @__PURE__ */ _m({
  [Ph]: Ph
}, "RuntimeException"), TT = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException"), PT = (t) => X(t, TT), xh = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement"), _u = /* @__PURE__ */ _m({
  [xh]: xh
}, "NoSuchElementException"), Eh = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException"), mm = /* @__PURE__ */ function() {
  class t extends dm {
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
    [Eh]: Eh,
    name: "UnknownException"
  }), t;
}(), Lo = (t) => su(t) && "_tag" in t && (t._tag === "Success" || t._tag === "Failure"), xT = (t) => t._tag === "Success", ET = (t) => {
  switch (t._tag) {
    case le:
      return Z_(t.effect_instruction_i0);
    case he:
      return !1;
  }
}, kh = (t, n) => MT(t, n != null && n.parallel ? wo : we), Lh = (t) => bt(dr(t)), bt = (t) => {
  const n = new G_(le);
  return n.effect_instruction_i0 = t, n;
}, kT = (t) => bt(nn(t)), wa = /* @__PURE__ */ y(2, (t, n) => {
  switch (t._tag) {
    case le:
      return bt(t.effect_instruction_i0);
    case he:
      return Bt(n(t.effect_instruction_i0));
  }
}), pm = /* @__PURE__ */ y(2, (t, {
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
}, gn = /* @__PURE__ */ Bt(void 0), LT = /* @__PURE__ */ y(3, (t, n, {
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
}), MT = (t, n) => {
  const i = Xd(t);
  return Ye(i) ? T(Ve(i), Dd(T(Ae(i), wa(re)), (s, a) => T(s, LT(a, {
    onSuccess: (u, h) => T(u, Se(h)),
    onFailure: n
  }))), wa(Pn), wa((s) => bn(s)), nt) : H();
}, CT = (t) => ({
  ...kr,
  [OS]: RS,
  state: Kc(NS([])),
  commit() {
    return gm(this);
  },
  blockingOn: t
}), gm = (t) => zS((n) => {
  const i = hi(t.state);
  switch (i._tag) {
    case V_:
      return n(i.effect);
    case So:
      return i.joiners.push(n), IT(t, n);
  }
}, t.blockingOn), ym = (t, n) => {
  const i = hi(t.state);
  if (i._tag === So) {
    Jc(t.state, AS(n));
    for (let s = 0, a = i.joiners.length; s < a; s++)
      i.joiners[s](n);
  }
}, IT = (t, n) => z(() => {
  const i = hi(t.state);
  if (i._tag === So) {
    const s = i.joiners.indexOf(n);
    s >= 0 && i.joiners.splice(s, 1);
  }
}), OT = /* @__PURE__ */ oe((t) => Bt(t.currentContext)), RT = () => OT, Mi = (t) => A(RT(), t), vm = /* @__PURE__ */ y(2, (t, n) => Eo(Fr, n)(t)), NT = /* @__PURE__ */ y(2, (t, n) => Mi((i) => vm(t, n(i)))), bm = (t) => {
  const n = t.currentSpan;
  return n !== void 0 && n._tag === "Span" ? nt(n) : H();
}, AT = xT, FT = ET, Mh = /* @__PURE__ */ Symbol.for("effect/MutableHashMap"), BT = {
  [Mh]: Mh,
  [Symbol.iterator]() {
    return new mu(this);
  },
  toString() {
    return Kt(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(Wt)
    };
  },
  [Lt]() {
    return this.toJSON();
  },
  pipe() {
    return j(this, arguments);
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
    return n.done ? (this.bucketIterator = new $T(this.self.buckets.values()), this.next()) : n;
  }
  [Symbol.iterator]() {
    return new mu(this.self);
  }
}
class $T {
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
const zT = () => {
  const t = Object.create(BT);
  return t.referential = /* @__PURE__ */ new Map(), t.buckets = /* @__PURE__ */ new Map(), t.bucketsSize = 0, t;
}, pn = /* @__PURE__ */ y(2, (t, n) => {
  if (Ms(n) === !1)
    return t.referential.has(n) ? nt(t.referential.get(n)) : H();
  const i = n[tt](), s = t.buckets.get(i);
  return s === void 0 ? H() : DT(t, s, n);
}), DT = (t, n, i, s = !1) => {
  for (let a = 0, u = n.length; a < u; a++)
    if (i[J](n[a][0])) {
      const h = n[a][1];
      return s && (n.splice(a, 1), t.bucketsSize--), nt(h);
    }
  return H();
}, Ui = /* @__PURE__ */ y(2, (t, n) => Fe(pn(t, n))), Vi = /* @__PURE__ */ y(3, (t, n, i) => {
  if (Ms(n) === !1)
    return t.referential.set(n, i), t;
  const s = n[tt](), a = t.buckets.get(s);
  return a === void 0 ? (t.buckets.set(s, [[n, i]]), t.bucketsSize++, t) : (ZT(t, a, n), a.push([n, i]), t.bucketsSize++, t);
}), ZT = (t, n, i) => {
  for (let s = 0, a = n.length; s < a; s++)
    if (i[J](n[s][0])) {
      n.splice(s, 1), t.bucketsSize--;
      return;
    }
}, HT = "effect/Clock", Ch = /* @__PURE__ */ Symbol.for(HT), Mo = /* @__PURE__ */ An("effect/Clock"), WT = 2 ** 31 - 1, Ih = {
  unsafeSchedule(t, n) {
    const i = Fs(n);
    if (i > WT)
      return Oa;
    let s = !1;
    const a = setTimeout(() => {
      s = !0, t();
    }, i);
    return () => (clearTimeout(a), !s);
  }
}, Oh = /* @__PURE__ */ function() {
  const t = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance > "u" || typeof performance.now != "function")
    return () => BigInt(Date.now()) * t;
  let n;
  return () => (n === void 0 && (n = BigInt(Date.now()) * t - BigInt(Math.round(performance.now() * 1e6))), n + BigInt(Math.round(performance.now() * 1e6)));
}(), jT = /* @__PURE__ */ function() {
  const t = typeof process == "object" && "hrtime" in process && typeof process.hrtime.bigint == "function" ? process.hrtime : void 0;
  if (!t)
    return Oh;
  const n = /* @__PURE__ */ Oh() - /* @__PURE__ */ t.bigint();
  return () => n + t.bigint();
}();
var Pf;
Pf = Ch;
class UT {
  constructor() {
    m(this, Pf, Ch);
    m(this, "currentTimeMillis", /* @__PURE__ */ z(() => this.unsafeCurrentTimeMillis()));
    m(this, "currentTimeNanos", /* @__PURE__ */ z(() => this.unsafeCurrentTimeNanos()));
  }
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return jT();
  }
  scheduler() {
    return Q(Ih);
  }
  sleep(n) {
    return In((i) => {
      const s = Ih.unsafeSchedule(() => i(Le), n);
      return Nr(z(s));
    });
  }
}
const VT = () => new UT(), wm = "And", Sm = "Or", Tm = "InvalidData", Pm = "MissingData", xm = "SourceUnavailable", Em = "Unsupported", qT = "effect/ConfigError", Rh = /* @__PURE__ */ Symbol.for(qT), Ci = {
  _tag: "ConfigError",
  [Rh]: Rh
}, km = (t, n) => {
  const i = Object.create(Ci);
  return i._op = wm, i.left = t, i.right = n, Object.defineProperty(i, "toString", {
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
}, Lm = (t, n) => {
  const i = Object.create(Ci);
  return i._op = Sm, i.left = t, i.right = n, Object.defineProperty(i, "toString", {
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
}, GT = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create(Ci);
  return s._op = Tm, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Invalid data at ${T(this.path, wi(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, Rn = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create(Ci);
  return s._op = Pm, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Missing data at ${T(this.path, wi(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, KT = (t, n, i, s = {
  pathDelim: "."
}) => {
  const a = Object.create(Ci);
  return a._op = xm, a.path = t, a.message = n, a.cause = i, Object.defineProperty(a, "toString", {
    enumerable: !1,
    value() {
      return `(Source unavailable at ${T(this.path, wi(s.pathDelim))}: "${this.message}")`;
    }
  }), a;
}, JT = (t, n, i = {
  pathDelim: "."
}) => {
  const s = Object.create(Ci);
  return s._op = Em, s.path = t, s.message = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Unsupported operation at ${T(this.path, wi(i.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, yn = /* @__PURE__ */ y(2, (t, n) => {
  switch (t._op) {
    case wm:
      return km(yn(t.left, n), yn(t.right, n));
    case Sm:
      return Lm(yn(t.left, n), yn(t.right, n));
    case Tm:
      return GT([...n, ...t.path], t.message);
    case Pm:
      return Rn([...n, ...t.path], t.message);
    case xm:
      return KT([...n, ...t.path], t.message, t.cause);
    case Em:
      return JT([...n, ...t.path], t.message);
  }
}), YT = {
  _tag: "Empty"
}, Sa = /* @__PURE__ */ y(2, (t, n) => {
  let i = Qc(n), s = t;
  for (; H0(i); ) {
    const a = i.head;
    switch (a._tag) {
      case "Empty": {
        i = i.tail;
        break;
      }
      case "AndThen": {
        i = Ln(a.first, Ln(a.second, i.tail));
        break;
      }
      case "MapName": {
        s = Xn(s, a.f), i = i.tail;
        break;
      }
      case "Nested": {
        s = Rs(s, a.name), i = i.tail;
        break;
      }
      case "Unnested": {
        if (T(er(s), xv(a.name)))
          s = si(s), i = i.tail;
        else
          return ri(Rn(s, `Expected ${a.name} to be in path in ConfigProvider#unnested`));
        break;
      }
    }
  }
  return Ue(s);
}), XT = "Constant", QT = "Fail", tP = "Fallback", eP = "Described", nP = "Lazy", iP = "MapOrFail", rP = "Nested", sP = "Primitive", oP = "Sequence", aP = "HashMap", cP = "ZipWith", js = (t, n) => [...t, ...n], uP = "effect/ConfigProvider", Nh = /* @__PURE__ */ Symbol.for(uP), lP = /* @__PURE__ */ An("effect/ConfigProvider"), hP = "effect/ConfigProviderFlat", Ah = /* @__PURE__ */ Symbol.for(hP), fP = (t) => ({
  [Nh]: Nh,
  pipe() {
    return j(this, arguments);
  },
  ...t
}), dP = (t) => ({
  [Ah]: Ah,
  patch: t.patch,
  load: (n, i, s = !0) => t.load(n, i, s),
  enumerateChildren: t.enumerateChildren
}), _P = (t) => fP({
  load: (n) => A(ve(t, oi(), n, !1), (i) => an(er(i), {
    onNone: () => Ft(Rn(oi(), `Expected a single value having structure: ${n}`)),
    onSome: Q
  })),
  flattened: t
}), mP = (t) => {
  const {
    pathDelim: n,
    seqDelim: i
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, t), s = (_) => T(_, wi(n)), a = (_) => _.split(n), u = () => typeof process < "u" && "env" in process && typeof process.env == "object" ? process.env : {};
  return _P(dP({
    load: (_, g, w = !0) => {
      const v = s(_), P = u(), x = v in P ? nt(P[v]) : H();
      return T(x, ou(() => Rn(_, `Expected ${v} to exist in the process context`)), A((C) => bP(C, _, g, i, w)));
    },
    enumerateChildren: (_) => z(() => {
      const g = u(), P = Object.keys(g).map((x) => a(x.toUpperCase())).filter((x) => {
        for (let C = 0; C < _.length; C++) {
          const I = T(_, $d(C)), W = x[C];
          if (W === void 0 || I !== W)
            return !1;
        }
        return !0;
      }).flatMap((x) => x.slice(_.length, _.length + 1));
      return T0(P);
    }),
    patch: YT
  }));
}, pP = (t, n, i, s) => {
  const a = sh(i.length, (_) => _ >= s.length ? H() : nt([t(_), _ + 1])), u = sh(s.length, (_) => _ >= i.length ? H() : nt([n(_), _ + 1])), h = js(i, a), d = js(s, u);
  return [h, d];
}, gP = (t, n) => {
  let i = n;
  if (i._tag === "Nested") {
    const s = t.slice();
    for (; i._tag === "Nested"; )
      s.push(i.name), i = i.config;
    return s;
  }
  return t;
}, ve = (t, n, i, s) => {
  const a = i;
  switch (a._tag) {
    case XT:
      return Q(xe(a.value));
    case eP:
      return At(() => ve(t, n, a.config, s));
    case QT:
      return Ft(Rn(n, a.message));
    case tP:
      return T(At(() => ve(t, n, a.first, s)), _r((u) => a.condition(u) ? T(ve(t, n, a.second, s), _r((h) => Ft(Lm(u, h)))) : Ft(u)));
    case nP:
      return At(() => ve(t, n, a.config(), s));
    case iP:
      return At(() => T(ve(t, n, a.original, s), A(rn((u) => T(a.mapOrFail(u), ou(yn(gP(n, a.original))))))));
    case rP:
      return At(() => ve(t, js(n, xe(a.name)), a.config, s));
    case sP:
      return T(Sa(n, t.patch), A((u) => T(t.load(u, a, s), A((h) => {
        if (h.length === 0) {
          const d = T(Av(u), Je(() => "<n/a>"));
          return Ft(Rn([], `Expected ${a.description} with name ${d}`));
        }
        return Q(h);
      }))));
    case oP:
      return T(Sa(n, t.patch), A((u) => T(t.enumerateChildren(u), A(SP), A((h) => h.length === 0 ? At(() => yt(ve(t, n, a.config, !0), xe)) : T(rn(h, (d) => ve(t, Mv(n, `[${d}]`), a.config, !0)), yt((d) => {
        const _ = Vv(d);
        return _.length === 0 ? xe(oi()) : xe(_);
      }))))));
    case aP:
      return At(() => T(Sa(n, t.patch), A((u) => T(t.enumerateChildren(u), A((h) => T(h, rn((d) => ve(t, js(u, xe(d)), a.valueConfig, s)), yt((d) => d.length === 0 ? xe(Xc()) : T(wP(d), Xn((_) => R0(rh($t(h), _)))))))))));
    case cP:
      return At(() => T(ve(t, n, a.left, s), mr, A((u) => T(ve(t, n, a.right, s), mr, A((h) => {
        if (Xi(u) && Xi(h))
          return Ft(km(u.left, h.left));
        if (Xi(u) && hs(h))
          return Ft(u.left);
        if (hs(u) && Xi(h))
          return Ft(h.left);
        if (hs(u) && hs(h)) {
          const d = T(n, wi(".")), _ = yP(n, d), [g, w] = pP(_, _, T(u.right, Xn(Ue)), T(h.right, Xn(Ue)));
          return T(g, rh(w), rn(([v, P]) => T(om(v, P), yt(([x, C]) => a.zip(x, C)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
  }
}, yP = (t, n) => (i) => ri(Rn(t, `The element at index ${i} in a sequence at path "${n}" was missing`)), vP = (t, n) => t.split(new RegExp(`\\s*${Gv(n)}\\s*`)), bP = (t, n, i, s, a) => a ? T(vP(t, s), rn((u) => i.parse(u.trim())), ou(yn(n))) : T(i.parse(t), nm({
  onFailure: yn(n),
  onSuccess: xe
})), wP = (t) => Object.keys(t[0]).map((n) => t.map((i) => i[n])), SP = (t) => T(rn(t, PP), nm({
  onFailure: () => oi(),
  onSuccess: Ns(or)
}), mr, yt(pv)), TP = /^(\[(\d+)\])$/, PP = (t) => {
  const n = t.match(TP);
  if (n !== null) {
    const i = n[2];
    return T(i !== void 0 && i.length > 0 ? nt(i) : H(), Sv(xP));
  }
  return H();
}, xP = (t) => {
  const n = Number.parseInt(t);
  return Number.isNaN(n) ? H() : nt(n);
}, Fh = /* @__PURE__ */ Symbol.for("effect/Console"), Mm = /* @__PURE__ */ An("effect/Console"), EP = {
  [Fh]: Fh,
  assert(t, ...n) {
    return z(() => {
      console.assert(t, ...n);
    });
  },
  clear: /* @__PURE__ */ z(() => {
    console.clear();
  }),
  count(t) {
    return z(() => {
      console.count(t);
    });
  },
  countReset(t) {
    return z(() => {
      console.countReset(t);
    });
  },
  debug(...t) {
    return z(() => {
      console.debug(...t);
    });
  },
  dir(t, n) {
    return z(() => {
      console.dir(t, n);
    });
  },
  dirxml(...t) {
    return z(() => {
      console.dirxml(...t);
    });
  },
  error(...t) {
    return z(() => {
      console.error(...t);
    });
  },
  group(t) {
    return t != null && t.collapsed ? z(() => console.groupCollapsed(t == null ? void 0 : t.label)) : z(() => console.group(t == null ? void 0 : t.label));
  },
  groupEnd: /* @__PURE__ */ z(() => {
    console.groupEnd();
  }),
  info(...t) {
    return z(() => {
      console.info(...t);
    });
  },
  log(...t) {
    return z(() => {
      console.log(...t);
    });
  },
  table(t, n) {
    return z(() => {
      console.table(t, n);
    });
  },
  time(t) {
    return z(() => console.time(t));
  },
  timeEnd(t) {
    return z(() => console.timeEnd(t));
  },
  timeLog(t, ...n) {
    return z(() => {
      console.timeLog(t, ...n);
    });
  },
  trace(...t) {
    return z(() => {
      console.trace(...t);
    });
  },
  warn(...t) {
    return z(() => {
      console.warn(...t);
    });
  },
  unsafe: console
}, kP = "effect/Random", Bh = /* @__PURE__ */ Symbol.for(kP), LP = /* @__PURE__ */ An("effect/Random");
var xf;
xf = Bh;
class MP {
  constructor(n) {
    m(this, "seed");
    m(this, xf, Bh);
    m(this, "PRNG");
    this.seed = n, this.PRNG = new Wy(n);
  }
  get next() {
    return z(() => this.PRNG.number());
  }
  get nextBoolean() {
    return yt(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return z(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(n, i) {
    return yt(this.next, (s) => (i - n) * s + n);
  }
  nextIntBetween(n, i) {
    return z(() => this.PRNG.integer(i - n) + n);
  }
  shuffle(n) {
    return CP(n, (i) => this.nextIntBetween(0, i));
  }
}
const CP = (t, n) => At(() => T(z(() => Array.from(t)), A((i) => {
  const s = [];
  for (let a = i.length; a >= 2; a = a - 1)
    s.push(a);
  return T(s, Po((a) => T(n(a), yt((u) => IP(i, a - 1, u)))), Cn(Xd(i)));
}))), IP = (t, n, i) => {
  const s = t[n];
  return t[n] = t[i], t[i] = s, t;
}, OP = (t) => new MP(B(t)), $h = /* @__PURE__ */ Symbol.for("effect/Tracer"), RP = (t) => ({
  [$h]: $h,
  ...t
}), Cm = /* @__PURE__ */ An("effect/Tracer"), Im = /* @__PURE__ */ An("effect/ParentSpan"), zh = /* @__PURE__ */ function() {
  const t = "abcdef0123456789", n = t.length;
  return function(i) {
    let s = "";
    for (let a = 0; a < i; a++)
      s += t.charAt(Math.floor(Math.random() * n));
    return s;
  };
}();
class NP {
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
    }, this.attributes = /* @__PURE__ */ new Map(), this.traceId = i._tag === "Some" ? i.value.traceId : zh(32), this.spanId = zh(16), this.links = Array.from(a);
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
const AP = /* @__PURE__ */ RP({
  span: (t, n, i, s, a, u) => new NP(t, n, i, s, a, u),
  context: (t) => t()
}), FP = /* @__PURE__ */ T(/* @__PURE__ */ $c(), /* @__PURE__ */ Kn(Mo, /* @__PURE__ */ VT()), /* @__PURE__ */ Kn(Mm, EP), /* @__PURE__ */ Kn(LP, /* @__PURE__ */ OP(/* @__PURE__ */ Math.random())), /* @__PURE__ */ Kn(lP, /* @__PURE__ */ mP()), /* @__PURE__ */ Kn(Cm, AP)), Us = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => fm(FP)), BP = (t) => {
  const n = de(t);
  return Om((i) => i.sleep(n));
}, $P = (t) => oe((n) => t(n.currentDefaultServices)), Om = (t) => $P((n) => t(n.unsafeMap.get(Mo.key))), zP = /* @__PURE__ */ Om((t) => t.currentTimeMillis), DP = BP, ZP = zP;
function HP(t) {
  return new on(t);
}
function WP() {
  return HP(/* @__PURE__ */ new Map());
}
const Dh = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var Ef;
Ef = Dh;
class on {
  constructor(n) {
    m(this, "locals");
    m(this, Ef, Dh);
    this.locals = n;
  }
  pipe() {
    return j(this, arguments);
  }
}
const jP = (t, n, i, s = !1) => {
  const a = t;
  let u = n, h = i, d = s, _;
  for (; _ === void 0; )
    if (fe(u) && fe(h)) {
      const g = ie(u)[0], w = si(u), v = ie(h)[0], P = ie(h)[1], x = si(h);
      g.startTimeMillis < v.startTimeMillis ? (h = x, d = !0) : g.startTimeMillis > v.startTimeMillis ? u = w : g.id < v.id ? (h = x, d = !0) : g.id > v.id ? u = w : _ = [P, d];
    } else
      _ = [a.initial, !0];
  return _;
}, UP = /* @__PURE__ */ y(3, (t, n, i) => {
  const s = new Map(t.locals);
  return i.locals.forEach((a, u) => {
    const h = a[0][1];
    if (!a[0][0][J](n)) {
      if (!s.has(u)) {
        if (Y(h, u.initial))
          return;
        s.set(u, [[n, u.join(u.initial, h)]]);
        return;
      }
      const d = s.get(u), [_, g] = jP(u, d, a);
      if (g) {
        const w = u.diff(_, h), v = d[0][1], P = u.join(v, u.patch(w)(v));
        if (!Y(v, P)) {
          let x;
          const C = d[0][0];
          C[J](n) ? x = [[C, P], ...d.slice(1)] : x = [[n, P], ...d], s.set(u, x);
        }
      }
    }
  }), new on(s);
}), VP = /* @__PURE__ */ y(2, (t, n) => {
  const i = /* @__PURE__ */ new Map();
  return Rm(t, i, n), new on(i);
}), Rm = (t, n, i) => {
  t.locals.forEach((s, a) => {
    const u = s[0][1], h = a.patch(a.fork)(u);
    Y(u, h) ? n.set(a, s) : n.set(a, [[i, h], ...s]);
  });
}, Nm = /* @__PURE__ */ y(2, (t, n) => {
  const i = new Map(t.locals);
  return i.delete(n), new on(i);
}), qP = /* @__PURE__ */ y(2, (t, n) => t.locals.has(n) ? nt(ie(t.locals.get(n))[1]) : H()), pr = /* @__PURE__ */ y(2, (t, n) => T(qP(t, n), Je(() => n.initial))), Qa = /* @__PURE__ */ y(2, (t, {
  fiberId: n,
  fiberRef: i,
  value: s
}) => {
  if (t.locals.size === 0)
    return new on(/* @__PURE__ */ new Map([[i, [[n, s]]]]));
  const a = new Map(t.locals);
  return tc(a, n, i, s), new on(a);
}), tc = (t, n, i, s) => {
  const a = t.get(i) ?? [];
  let u;
  if (fe(a)) {
    const [h, d] = ie(a);
    if (h[J](n)) {
      if (Y(d, s))
        return;
      u = [[n, s], ...a.slice(1)];
    } else
      u = [[n, s], ...a];
  } else
    u = [[n, s]];
  t.set(i, u);
}, GP = /* @__PURE__ */ y(2, (t, {
  entries: n,
  forkAs: i
}) => {
  if (t.locals.size === 0)
    return new on(new Map(n));
  const s = new Map(t.locals);
  return i !== void 0 && Rm(t, s, i), n.forEach(([a, u]) => {
    u.length === 1 ? tc(s, u[0][0], a, u[0][1]) : u.forEach(([h, d]) => {
      tc(s, h, a, d);
    });
  }), new on(s);
}), KP = pr, JP = GP, YP = WP, XP = QS, QP = tT, tx = eT, ex = um, nx = lm, ix = hm, rx = nT, sx = iT, ox = /* @__PURE__ */ T(or, /* @__PURE__ */ yv((t) => t.ordinal)), ax = /* @__PURE__ */ vv(ox), cx = (t) => {
  switch (t) {
    case "All":
      return XP;
    case "Debug":
      return ix;
    case "Error":
      return tx;
    case "Fatal":
      return QP;
    case "Info":
      return nx;
    case "Trace":
      return rx;
    case "None":
      return sx;
    case "Warning":
      return ex;
  }
}, Am = (t) => t.replace(/[\s="]/g, "_"), ux = (t) => (n) => `${Am(n.label)}=${t - n.startTime}ms`, lx = Er, hx = av;
class Fm extends hx {
}
const Zh = /* @__PURE__ */ Symbol.for("effect/Readable"), fx = /* @__PURE__ */ Symbol.for("effect/Ref"), dx = {
  /* c8 ignore next */
  _A: (t) => t
};
var kf, Lf, Mf;
class _x extends (Mf = Fm, Lf = fx, kf = Zh, Mf) {
  constructor(i) {
    super();
    m(this, "ref");
    m(this, Lf, dx);
    m(this, kf, Zh);
    m(this, "get");
    this.ref = i, this.get = z(() => hi(this.ref));
  }
  commit() {
    return this.get;
  }
  modify(i) {
    return z(() => {
      const s = hi(this.ref), [a, u] = i(s);
      return s !== u && Jc(u)(this.ref), a;
    });
  }
}
const Bm = (t) => new _x(Kc(t)), mx = (t) => z(() => Bm(t)), ir = (t) => t.get, Ta = /* @__PURE__ */ y(2, (t, n) => t.modify(() => [void 0, n])), px = /* @__PURE__ */ y(2, (t, n) => t.modify((i) => [void 0, n(i)])), $m = "Empty", zm = "Add", Dm = "Remove", Zm = "Update", Hm = "AndThen", gx = {
  _tag: $m
}, yx = (t, n) => {
  const i = new Map(t.locals);
  let s = gx;
  for (const [a, u] of n.locals.entries()) {
    const h = ie(u)[1], d = i.get(a);
    if (d !== void 0) {
      const _ = ie(d)[1];
      Y(_, h) || (s = Pa({
        _tag: Zm,
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
      _tag: Dm,
      fiberRef: a
    })(s);
  return s;
}, Pa = /* @__PURE__ */ y(2, (t, n) => ({
  _tag: Hm,
  first: t,
  second: n
})), vx = /* @__PURE__ */ y(3, (t, n, i) => {
  let s = i, a = xe(t);
  for (; fe(a); ) {
    const u = ie(a), h = si(a);
    switch (u._tag) {
      case $m: {
        a = h;
        break;
      }
      case zm: {
        s = Qa(s, {
          fiberId: n,
          fiberRef: u.fiberRef,
          value: u.value
        }), a = h;
        break;
      }
      case Dm: {
        s = Nm(s, u.fiberRef), a = h;
        break;
      }
      case Zm: {
        const d = pr(s, u.fiberRef);
        s = Qa(s, {
          fiberId: n,
          fiberRef: u.fiberRef,
          value: u.fiberRef.patch(u.patch)(d)
        }), a = h;
        break;
      }
      case Hm: {
        a = Rs(u.first)(Rs(u.second)(h));
        break;
      }
    }
  }
  return s;
}), Wm = "effect/MetricLabel", ec = /* @__PURE__ */ Symbol.for(Wm);
var Cf;
class bx {
  constructor(n, i) {
    m(this, "key");
    m(this, "value");
    m(this, Cf, ec);
    m(this, "_hash");
    this.key = n, this.value = i, this._hash = Ot(Wm + this.key + this.value);
  }
  [(Cf = ec, tt)]() {
    return this._hash;
  }
  [J](n) {
    return Sx(n) && this.key === n.key && this.value === n.value;
  }
  pipe() {
    return j(this, arguments);
  }
}
const wx = (t, n) => new bx(t, n), Sx = (t) => X(t, ec), Tx = (t) => yt(t, (n) => !n), Hh = /* @__PURE__ */ y(3, (t, n, i) => Mi((s) => A(i, (a) => vm(t, T(s, Kn(n, a)))))), Px = DP, xx = /* @__PURE__ */ y(2, (t, n) => On(t, {
  onFailure: (i) => {
    const s = H_(i);
    switch (s._tag) {
      case "Left":
        return qe(n(s.left), ae(i));
      case "Right":
        return ae(i);
    }
  },
  onSuccess: Q
})), Ex = (t) => {
  let n, i;
  typeof t == "function" ? n = t : (n = t.try, i = t.catch);
  const s = (a) => i ? To(() => i(a)) : Ft(new mm(a, "An unknown error occurred in Effect.tryPromise"));
  return n.length >= 1 ? In((a, u) => {
    try {
      n(u).then((h) => a(Q(h)), (h) => a(s(h)));
    } catch (h) {
      a(s(h));
    }
  }) : In((a) => {
    try {
      n().then((u) => a(Q(u)), (u) => a(s(u)));
    } catch (u) {
      a(s(u));
    }
  });
}, kx = "Sequential", Lx = "Parallel", Mx = "ParallelN", jm = {
  _tag: kx
}, Cx = {
  _tag: Lx
}, Ix = (t) => ({
  _tag: Mx,
  parallelism: t
}), nc = jm, ic = Cx, rc = Ix, Ox = yx, Rx = vx, Co = "effect/FiberStatus", Nn = /* @__PURE__ */ Symbol.for(Co), Vs = "Done", Wh = "Running", jh = "Suspended", Nx = /* @__PURE__ */ Ot(`${Co}-${Vs}`);
var If;
class Ax {
  constructor() {
    m(this, If, Nn);
    m(this, "_tag", Vs);
  }
  [(If = Nn, tt)]() {
    return Nx;
  }
  [J](n) {
    return pu(n) && n._tag === Vs;
  }
}
var Of;
class Fx {
  constructor(n) {
    m(this, "runtimeFlags");
    m(this, Of, Nn);
    m(this, "_tag", Wh);
    this.runtimeFlags = n;
  }
  [(Of = Nn, tt)]() {
    return T(B(Co), ut(B(this._tag)), ut(B(this.runtimeFlags)), kt(this));
  }
  [J](n) {
    return pu(n) && n._tag === Wh && this.runtimeFlags === n.runtimeFlags;
  }
}
var Rf;
class Bx {
  constructor(n, i) {
    m(this, "runtimeFlags");
    m(this, "blockingOn");
    m(this, Rf, Nn);
    m(this, "_tag", jh);
    this.runtimeFlags = n, this.blockingOn = i;
  }
  [(Rf = Nn, tt)]() {
    return T(B(Co), ut(B(this._tag)), ut(B(this.runtimeFlags)), ut(B(this.blockingOn)), kt(this));
  }
  [J](n) {
    return pu(n) && n._tag === jh && this.runtimeFlags === n.runtimeFlags && Y(this.blockingOn, n.blockingOn);
  }
}
const $x = /* @__PURE__ */ new Ax(), zx = (t) => new Fx(t), Dx = (t, n) => new Bx(t, n), pu = (t) => X(t, Nn), Zx = (t) => t._tag === Vs, Hx = $x, Um = zx, Wx = Dx, jx = Zx, Ux = /* @__PURE__ */ Symbol.for("effect/Micro"), qs = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit"), Uh = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause"), Vx = {
  _E: gt
};
var Nf;
class Vm extends globalThis.Error {
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
      h = u, d = ni(s, 0), _ = `${h}: ${d}`;
    a.length > 0 && (_ += `
    ${a.join(`
    `)}`);
    super(d);
    m(this, "_tag");
    m(this, "traces");
    m(this, Nf);
    this._tag = i, this.traces = a, this[Uh] = Vx, this.name = h, this.stack = _;
  }
  pipe() {
    return j(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [(Nf = Uh, Lt)]() {
    return this.stack;
  }
}
class qx extends Vm {
  constructor(i, s = []) {
    super("Die", i, s);
    m(this, "defect");
    this.defect = i;
  }
}
const Gx = (t, n = []) => new qx(t, n);
class Kx extends Vm {
  constructor(n = []) {
    super("Interrupt", "interrupted", n);
  }
}
const Jx = (t = []) => new Kx(t), Yx = (t) => t._tag === "Interrupt", Vh = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber"), Xx = {
  _A: gt,
  _E: gt
};
var Af;
Af = Vh;
class Qx {
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
    this.context = n, this.interruptible = i, this[Vh] = Xx;
  }
  getRef(n) {
    return cb(this.context, n);
  }
  addObserver(n) {
    return this._exit ? (n(this._exit), Cy) : (this._observers.push(n), () => {
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
    if (i === ms)
      return;
    const s = qh.interruptChildren && qh.interruptChildren(this);
    if (s !== void 0)
      return this.evaluate(Ks(s, () => i));
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
          s = Ks(rE, () => a);
        }
        if (s = s[sc](this), s === ms) {
          const a = this._yielded;
          return qs in a ? (this._yielded = void 0, a) : ms;
        }
      }
    } catch (a) {
      return X(s, sc) ? oc(a) : oc(`MicroFiber.runLoop: Not a valid effect: ${String(s)}`);
    }
  }
  getCont(n) {
    for (; ; ) {
      const i = this._stack.pop();
      if (!i) return;
      const s = i[Gs] && i[Gs](this);
      if (s) return {
        [n]: s
      };
      if (i[n]) return i;
    }
  }
  yieldWith(n) {
    return this._yielded = n, ms;
  }
  children() {
    return this._children ?? (this._children = /* @__PURE__ */ new Set());
  }
}
const qh = /* @__PURE__ */ ft("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
})), qm = /* @__PURE__ */ Symbol.for("effect/Micro/identifier"), Ht = /* @__PURE__ */ Symbol.for("effect/Micro/args"), sc = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate"), bi = /* @__PURE__ */ Symbol.for("effect/Micro/successCont"), ti = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont"), Gs = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont"), ms = /* @__PURE__ */ Symbol.for("effect/Micro/Yield"), tE = {
  _A: gt,
  _E: gt,
  _R: gt
}, eE = {
  ...lx,
  _op: "Micro",
  [Ux]: tE,
  pipe() {
    return j(this, arguments);
  },
  [Symbol.iterator]() {
    return new md(new Tr(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[qm],
      ...Ht in this ? {
        args: this[Ht]
      } : void 0
    };
  },
  toString() {
    return Kt(this);
  },
  [Lt]() {
    return Kt(this);
  }
};
function nE(t) {
  return oc("Micro.evaluate: Not implemented");
}
const Io = (t) => ({
  ...eE,
  [qm]: t.op,
  [sc]: t.eval ?? nE,
  [bi]: t.contA,
  [ti]: t.contE,
  [Gs]: t.ensure
}), gu = (t) => {
  const n = Io(t);
  return function() {
    const i = Object.create(n);
    return i[Ht] = t.single === !1 ? arguments : arguments[0], i;
  };
}, Gm = (t) => {
  const n = {
    ...Io(t),
    [qs]: qs,
    _tag: t.op,
    get [t.prop]() {
      return this[Ht];
    },
    toJSON() {
      return {
        _id: "MicroExit",
        _tag: t.op,
        [t.prop]: this[Ht]
      };
    },
    [J](i) {
      return aE(i) && i._tag === t.op && Y(this[Ht], i[Ht]);
    },
    [tt]() {
      return kt(this, ut(Ot(t.op))(B(this[Ht])));
    }
  };
  return function(i) {
    const s = Object.create(n);
    return s[Ht] = i, s[bi] = void 0, s[ti] = void 0, s[Gs] = void 0, s;
  };
}, yu = /* @__PURE__ */ Gm({
  op: "Success",
  prop: "value",
  eval(t) {
    const n = t.getCont(bi);
    return n ? n[bi](this[Ht], t) : t.yieldWith(this);
  }
}), Km = /* @__PURE__ */ Gm({
  op: "Failure",
  prop: "cause",
  eval(t) {
    let n = t.getCont(ti);
    for (; Yx(this[Ht]) && n && t.interruptible; )
      n = t.getCont(ti);
    return n ? n[ti](this[Ht], t) : t.yieldWith(this);
  }
}), iE = /* @__PURE__ */ gu({
  op: "Yield",
  eval(t) {
    let n = !1;
    return t.getRef(Su).scheduleTask(() => {
      n || t.evaluate(cE);
    }, this[Ht] ?? 0), t.yieldWith(() => {
      n = !0;
    });
  }
}), rE = /* @__PURE__ */ iE(0), sE = /* @__PURE__ */ yu(void 0), vu = /* @__PURE__ */ gu({
  op: "WithMicroFiber",
  eval(t) {
    return this[Ht](t);
  }
}), Ks = /* @__PURE__ */ y(2, (t, n) => {
  const i = Object.create(oE);
  return i[Ht] = t, i[bi] = n, i;
}), oE = /* @__PURE__ */ Io({
  op: "OnSuccess",
  eval(t) {
    return t._stack.push(this), this[Ht];
  }
}), aE = (t) => X(t, qs), Jm = yu, bu = Km, wu = /* @__PURE__ */ bu(/* @__PURE__ */ Jx()), oc = (t) => bu(Gx(t)), cE = /* @__PURE__ */ Jm(void 0), uE = "setImmediate" in globalThis ? globalThis.setImmediate : (t) => setTimeout(t, 0);
class Ym {
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
    this.tasks.push(n), this.running || (this.running = !0, uE(this.afterScheduled));
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
    return n.currentOpCount >= n.getRef(fE);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    for (; this.tasks.length > 0; )
      this.runTasks();
  }
}
const lE = /* @__PURE__ */ y(2, (t, n) => vu((i) => {
  const s = i.context;
  return i.context = n(s), mE(t, () => (i.context = s, sE));
})), hE = /* @__PURE__ */ y(2, (t, n) => lE(t, Gd(n)));
class fE extends (/* @__PURE__ */ zc()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: () => 2048
})) {
}
class Su extends (/* @__PURE__ */ zc()("effect/Micro/currentScheduler", {
  defaultValue: () => new Ym()
})) {
}
const dE = /* @__PURE__ */ y(2, (t, n) => {
  const i = Object.create(_E);
  return i[Ht] = t, i[bi] = n.onSuccess, i[ti] = n.onFailure, i;
}), _E = /* @__PURE__ */ Io({
  op: "OnSuccessAndFailure",
  eval(t) {
    return t._stack.push(this), this[Ht];
  }
}), mE = /* @__PURE__ */ y(2, (t, n) => gE((i) => dE(i(t), {
  onFailure: (s) => Ks(n(bu(s)), () => Km(s)),
  onSuccess: (s) => Ks(n(Jm(s)), () => yu(s))
}))), Xm = /* @__PURE__ */ gu({
  op: "SetInterruptible",
  ensure(t) {
    if (t.interruptible = this[Ht], t._interrupted && t.interruptible)
      return () => wu;
  }
}), pE = (t) => vu((n) => n.interruptible ? t : (n.interruptible = !0, n._stack.push(Xm(!1)), n._interrupted ? wu : t)), gE = (t) => vu((n) => n.interruptible ? (n.interruptible = !1, n._stack.push(Xm(!0)), t(pE)) : t(gt)), yE = (t, n) => {
  const i = new Qx(Su.context(new Ym()));
  return i.evaluate(t), i;
};
class vE {
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
class bE {
  constructor(n) {
    m(this, "maxNextTickBeforeTimer");
    /**
     * @since 2.0.0
     */
    m(this, "running", !1);
    /**
     * @since 2.0.0
     */
    m(this, "tasks", /* @__PURE__ */ new vE());
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
    return n.currentOpCount > n.getFiberRef(hT) ? n.getFiberRef(du) : !1;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(n, i) {
    this.tasks.scheduleTask(n, i), this.running || (this.running = !0, this.starve());
  }
}
const wE = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new bE(2048)), Qm = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => ce(wE)), tp = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => ce(/* @__PURE__ */ new Map())), Gh = (t, n, i, s) => {
  switch (t) {
    case void 0:
      return n();
    case "unbounded":
      return i();
    case "inherit":
      return fu(pT, (a) => a === "unbounded" ? i() : a > 1 ? s(a) : n());
    default:
      return t > 1 ? s(t) : n();
  }
}, Tu = "InterruptSignal", Pu = "Stateful", xu = "Resume", Eu = "YieldNow", xa = (t) => ({
  _tag: Tu,
  cause: t
}), xs = (t) => ({
  _tag: Pu,
  onFiber: t
}), qn = (t) => ({
  _tag: xu,
  effect: t
}), SE = () => ({
  _tag: Eu
}), TE = "effect/FiberScope", Js = /* @__PURE__ */ Symbol.for(TE);
var Ff;
Ff = Js;
class PE {
  constructor() {
    m(this, Ff, Js);
    m(this, "fiberId", fi);
    m(this, "roots", /* @__PURE__ */ new Set());
  }
  add(n, i) {
    this.roots.add(i), i.addObserver(() => {
      this.roots.delete(i);
    });
  }
}
var Bf;
Bf = Js;
class xE {
  constructor(n, i) {
    m(this, "fiberId");
    m(this, "parent");
    m(this, Bf, Js);
    this.fiberId = n, this.parent = i;
  }
  add(n, i) {
    this.parent.tell(xs((s) => {
      s.addChild(i), i.addObserver(() => {
        s.removeChild(i);
      });
    }));
  }
}
const EE = (t) => new xE(t.id(), t), ku = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new PE()), kE = "effect/Fiber", LE = /* @__PURE__ */ Symbol.for(kE), ME = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, CE = "effect/Fiber", IE = /* @__PURE__ */ Symbol.for(CE), OE = (t) => t.await, ep = (t) => lu(tm(t.await), t.inheritAll);
({
  ...kr
});
const _n = "effect/FiberCurrent", RE = "effect/Logger", NE = /* @__PURE__ */ Symbol.for(RE), AE = {
  /* c8 ignore next */
  _Message: (t) => t,
  /* c8 ignore next */
  _Output: (t) => t
}, Lu = (t) => ({
  [NE]: AE,
  log: t,
  pipe() {
    return j(this, arguments);
  }
}), FE = /^[^\s"=]*$/, BE = (t, n) => ({
  annotations: i,
  cause: s,
  date: a,
  fiberId: u,
  logLevel: h,
  message: d,
  spans: _
}) => {
  const g = (C) => C.match(FE) ? C : t(C), w = (C, I) => `${Am(C)}=${g(I)}`, v = (C, I) => " " + w(C, I);
  let P = w("timestamp", a.toISOString());
  P += v("level", h.label), P += v("fiber", y_(u));
  const x = Lv(d);
  for (let C = 0; C < x.length; C++)
    P += v("message", ni(x[C], n));
  _S(s) || (P += v("cause", Or(s, {
    renderErrorCause: !0
  })));
  for (const C of _)
    P += " " + ux(a.getTime())(C);
  for (const [C, I] of i)
    P += v(C, ni(I, n));
  return P;
}, $E = (t) => `"${t.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`, zE = /* @__PURE__ */ Lu(/* @__PURE__ */ BE($E)), DE = typeof process == "object" && process !== null && typeof process.stdout == "object" && process.stdout !== null;
DE && process.stdout.isTTY;
const np = "effect/MetricBoundaries", ac = /* @__PURE__ */ Symbol.for(np);
var $f;
class ZE {
  constructor(n) {
    m(this, "values");
    m(this, $f, ac);
    m(this, "_hash");
    this.values = n, this._hash = T(Ot(np), ut(Pr(this.values)));
  }
  [($f = ac, tt)]() {
    return this._hash;
  }
  [J](n) {
    return HE(n) && Y(this.values, n.values);
  }
  pipe() {
    return j(this, arguments);
  }
}
const HE = (t) => X(t, ac), WE = (t) => {
  const n = T(t, Fd(re(Number.POSITIVE_INFINITY)), qv);
  return new ZE(n);
}, jE = (t) => T(kv(t.count - 1, (n) => t.start * Math.pow(t.factor, n)), lo, WE), UE = "effect/MetricKeyType", ip = /* @__PURE__ */ Symbol.for(UE), rp = "effect/MetricKeyType/Counter", cc = /* @__PURE__ */ Symbol.for(rp), VE = "effect/MetricKeyType/Frequency", qE = /* @__PURE__ */ Symbol.for(VE), GE = "effect/MetricKeyType/Gauge", KE = /* @__PURE__ */ Symbol.for(GE), sp = "effect/MetricKeyType/Histogram", uc = /* @__PURE__ */ Symbol.for(sp), JE = "effect/MetricKeyType/Summary", YE = /* @__PURE__ */ Symbol.for(JE), op = {
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
};
var zf, Df;
class XE {
  constructor(n, i) {
    m(this, "incremental");
    m(this, "bigint");
    m(this, Df, op);
    m(this, zf, cc);
    m(this, "_hash");
    this.incremental = n, this.bigint = i, this._hash = Ot(rp);
  }
  [(Df = ip, zf = cc, tt)]() {
    return this._hash;
  }
  [J](n) {
    return ap(n);
  }
  pipe() {
    return j(this, arguments);
  }
}
var Zf, Hf;
class QE {
  constructor(n) {
    m(this, "boundaries");
    m(this, Hf, op);
    m(this, Zf, uc);
    m(this, "_hash");
    this.boundaries = n, this._hash = T(Ot(sp), ut(B(this.boundaries)));
  }
  [(Hf = ip, Zf = uc, tt)]() {
    return this._hash;
  }
  [J](n) {
    return cp(n) && Y(this.boundaries, n.boundaries);
  }
  pipe() {
    return j(this, arguments);
  }
}
const tk = (t) => new XE((t == null ? void 0 : t.incremental) ?? !1, (t == null ? void 0 : t.bigint) ?? !1), ek = (t) => new QE(t), ap = (t) => X(t, cc), nk = (t) => X(t, qE), ik = (t) => X(t, KE), cp = (t) => X(t, uc), rk = (t) => X(t, YE), sk = "effect/MetricKey", up = /* @__PURE__ */ Symbol.for(sk), ok = {
  /* c8 ignore next */
  _Type: (t) => t
}, ak = /* @__PURE__ */ Fc(Y);
var Wf;
class Mu {
  constructor(n, i, s, a = []) {
    m(this, "name");
    m(this, "keyType");
    m(this, "description");
    m(this, "tags");
    m(this, Wf, ok);
    m(this, "_hash");
    this.name = n, this.keyType = i, this.description = s, this.tags = a, this._hash = T(Ot(this.name + this.description), ut(B(this.keyType)), ut(Pr(this.tags)));
  }
  [(Wf = up, tt)]() {
    return this._hash;
  }
  [J](n) {
    return ck(n) && this.name === n.name && Y(this.keyType, n.keyType) && Y(this.description, n.description) && ak(this.tags, n.tags);
  }
  pipe() {
    return j(this, arguments);
  }
}
const ck = (t) => X(t, up), uk = (t, n) => new Mu(t, tk(n), Nc(n == null ? void 0 : n.description)), lk = (t, n, i) => new Mu(t, ek(n), Nc(i)), hk = /* @__PURE__ */ y(2, (t, n) => n.length === 0 ? t : new Mu(t.name, t.keyType, t.description, bs(t.tags, n))), fk = "effect/MetricState", Br = /* @__PURE__ */ Symbol.for(fk), lp = "effect/MetricState/Counter", lc = /* @__PURE__ */ Symbol.for(lp), hp = "effect/MetricState/Frequency", hc = /* @__PURE__ */ Symbol.for(hp), fp = "effect/MetricState/Gauge", fc = /* @__PURE__ */ Symbol.for(fp), dp = "effect/MetricState/Histogram", dc = /* @__PURE__ */ Symbol.for(dp), _p = "effect/MetricState/Summary", _c = /* @__PURE__ */ Symbol.for(_p), $r = {
  /* c8 ignore next */
  _A: (t) => t
};
var jf, Uf;
class dk {
  constructor(n) {
    m(this, "count");
    m(this, Uf, $r);
    m(this, jf, lc);
    this.count = n;
  }
  [(Uf = Br, jf = lc, tt)]() {
    return T(B(lp), ut(B(this.count)), kt(this));
  }
  [J](n) {
    return Pk(n) && this.count === n.count;
  }
  pipe() {
    return j(this, arguments);
  }
}
const _k = /* @__PURE__ */ Fc(Y);
var Vf, qf;
class mk {
  constructor(n) {
    m(this, "occurrences");
    m(this, qf, $r);
    m(this, Vf, hc);
    m(this, "_hash");
    this.occurrences = n;
  }
  [(qf = Br, Vf = hc, tt)]() {
    return T(Ot(hp), ut(Pr($t(this.occurrences.entries()))), kt(this));
  }
  [J](n) {
    return xk(n) && _k($t(this.occurrences.entries()), $t(n.occurrences.entries()));
  }
  pipe() {
    return j(this, arguments);
  }
}
var Gf, Kf;
class pk {
  constructor(n) {
    m(this, "value");
    m(this, Kf, $r);
    m(this, Gf, fc);
    this.value = n;
  }
  [(Kf = Br, Gf = fc, tt)]() {
    return T(B(fp), ut(B(this.value)), kt(this));
  }
  [J](n) {
    return Ek(n) && this.value === n.value;
  }
  pipe() {
    return j(this, arguments);
  }
}
var Jf, Yf;
class gk {
  constructor(n, i, s, a, u) {
    m(this, "buckets");
    m(this, "count");
    m(this, "min");
    m(this, "max");
    m(this, "sum");
    m(this, Yf, $r);
    m(this, Jf, dc);
    this.buckets = n, this.count = i, this.min = s, this.max = a, this.sum = u;
  }
  [(Yf = Br, Jf = dc, tt)]() {
    return T(B(dp), ut(B(this.buckets)), ut(B(this.count)), ut(B(this.min)), ut(B(this.max)), ut(B(this.sum)), kt(this));
  }
  [J](n) {
    return kk(n) && Y(this.buckets, n.buckets) && this.count === n.count && this.min === n.min && this.max === n.max && this.sum === n.sum;
  }
  pipe() {
    return j(this, arguments);
  }
}
var Xf, Qf;
class yk {
  constructor(n, i, s, a, u, h) {
    m(this, "error");
    m(this, "quantiles");
    m(this, "count");
    m(this, "min");
    m(this, "max");
    m(this, "sum");
    m(this, Qf, $r);
    m(this, Xf, _c);
    this.error = n, this.quantiles = i, this.count = s, this.min = a, this.max = u, this.sum = h;
  }
  [(Qf = Br, Xf = _c, tt)]() {
    return T(B(_p), ut(B(this.error)), ut(B(this.quantiles)), ut(B(this.count)), ut(B(this.min)), ut(B(this.max)), ut(B(this.sum)), kt(this));
  }
  [J](n) {
    return Lk(n) && this.error === n.error && Y(this.quantiles, n.quantiles) && this.count === n.count && this.min === n.min && this.max === n.max && this.sum === n.sum;
  }
  pipe() {
    return j(this, arguments);
  }
}
const vk = (t) => new dk(t), bk = (t) => new mk(t), wk = (t) => new pk(t), Sk = (t) => new gk(t.buckets, t.count, t.min, t.max, t.sum), Tk = (t) => new yk(t.error, t.quantiles, t.count, t.min, t.max, t.sum), Pk = (t) => X(t, lc), xk = (t) => X(t, hc), Ek = (t) => X(t, fc), kk = (t) => X(t, dc), Lk = (t) => X(t, _c), Mk = "effect/MetricHook", Ck = /* @__PURE__ */ Symbol.for(Mk), Ik = {
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
}, zr = (t) => ({
  [Ck]: Ik,
  pipe() {
    return j(this, arguments);
  },
  ...t
}), Kh = /* @__PURE__ */ BigInt(0), Ok = (t) => {
  let n = t.keyType.bigint ? Kh : 0;
  const i = t.keyType.incremental ? t.keyType.bigint ? (a) => a >= Kh : (a) => a >= 0 : (a) => !0, s = (a) => {
    i(a) && (n = n + a);
  };
  return zr({
    get: () => vk(n),
    update: s,
    modify: s
  });
}, Rk = (t) => {
  const n = /* @__PURE__ */ new Map();
  for (const s of t.keyType.preregisteredWords)
    n.set(s, 0);
  const i = (s) => {
    const a = n.get(s) ?? 0;
    n.set(s, a + 1);
  };
  return zr({
    get: () => bk(n),
    update: i,
    modify: i
  });
}, Nk = (t, n) => {
  let i = n;
  return zr({
    get: () => wk(i),
    update: (s) => {
      i = s;
    },
    modify: (s) => {
      i = i + s;
    }
  });
}, Ak = (t) => {
  const n = t.keyType.boundaries.values, i = n.length, s = new Uint32Array(i + 1), a = new Float64Array(i);
  let u = 0, h = 0, d = Number.MAX_VALUE, _ = Number.MIN_VALUE;
  T(n, Ns(or), Xn((v, P) => {
    a[P] = v;
  }));
  const g = (v) => {
    let P = 0, x = i;
    for (; P !== x; ) {
      const C = Math.floor(P + (x - P) / 2), I = a[C];
      v <= I ? x = C : P = C, x === P + 1 && (v <= a[P] ? x = P : P = x);
    }
    s[P] = s[P] + 1, u = u + 1, h = h + v, v < d && (d = v), v > _ && (_ = v);
  }, w = () => {
    const v = Ac(i);
    let P = 0;
    for (let x = 0; x < i; x++) {
      const C = a[x], I = s[x];
      P = P + I, v[x] = [C, P];
    }
    return v;
  };
  return zr({
    get: () => Sk({
      buckets: w(),
      count: u,
      min: d,
      max: _,
      sum: h
    }),
    update: g,
    modify: g
  });
}, Fk = (t) => {
  const {
    error: n,
    maxAge: i,
    maxSize: s,
    quantiles: a
  } = t.keyType, u = T(a, Ns(or)), h = Ac(s);
  let d = 0, _ = 0, g = 0, w = 0, v = 0;
  const P = (C) => {
    const I = [];
    let W = 0;
    for (; W !== s - 1; ) {
      const lt = h[W];
      if (lt != null) {
        const [rt, dt] = lt, _t = xn(C - rt);
        Db(_t, ci) && zb(_t, i) && I.push(dt);
      }
      W = W + 1;
    }
    return Bk(n, u, Ns(I, or));
  }, x = (C, I) => {
    if (s > 0) {
      d = d + 1;
      const W = d % s;
      h[W] = [I, C];
    }
    w = _ === 0 ? C : Math.min(w, C), v = _ === 0 ? C : Math.max(v, C), _ = _ + 1, g = g + C;
  };
  return zr({
    get: () => Tk({
      error: n,
      quantiles: P(Date.now()),
      count: _,
      min: w,
      max: v,
      sum: g
    }),
    update: ([C, I]) => x(C, I),
    modify: ([C, I]) => x(C, I)
  });
}, Bk = (t, n, i) => {
  const s = i.length;
  if (!fe(n))
    return oi();
  const a = n[0], u = n.slice(1), h = Jh(t, s, H(), 0, a, i), d = xe(h);
  return u.forEach((_) => {
    d.push(Jh(t, s, h.value, h.consumed, _, h.rest));
  }), Xn(d, (_) => [_.quantile, _.value]);
}, Jh = (t, n, i, s, a, u) => {
  let h = t, d = n, _ = i, g = s, w = a, v = u, P = t, x = n, C = i, I = s, W = a, lt = u;
  for (; ; ) {
    if (!fe(v))
      return {
        quantile: w,
        value: H(),
        consumed: g,
        rest: []
      };
    if (w === 1)
      return {
        quantile: w,
        value: nt(zd(v)),
        consumed: g + v.length,
        rest: []
      };
    const rt = ie(v), dt = Bv(v, (mt) => mt === rt), _t = w * d, Et = h / 2 * _t, Mt = g + dt[0].length, ee = Math.abs(Mt - _t);
    if (Mt < _t - Et) {
      P = h, x = d, C = er(v), I = Mt, W = w, lt = dt[1], h = P, d = x, _ = C, g = I, w = W, v = lt;
      continue;
    }
    if (Mt > _t + Et) {
      const mt = te(_) ? nt(rt) : _;
      return {
        quantile: w,
        value: mt,
        consumed: g,
        rest: v
      };
    }
    switch (_._tag) {
      case "None": {
        P = h, x = d, C = er(v), I = Mt, W = w, lt = dt[1], h = P, d = x, _ = C, g = I, w = W, v = lt;
        continue;
      }
      case "Some": {
        const mt = Math.abs(_t - _.value);
        if (ee < mt) {
          P = h, x = d, C = er(v), I = Mt, W = w, lt = dt[1], h = P, d = x, _ = C, g = I, w = W, v = lt;
          continue;
        }
        return {
          quantile: w,
          value: nt(_.value),
          consumed: g,
          rest: v
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
}, $k = "effect/MetricPair", zk = /* @__PURE__ */ Symbol.for($k), Dk = {
  /* c8 ignore next */
  _Type: (t) => t
}, Zk = (t, n) => ({
  [zk]: Dk,
  metricKey: t,
  metricState: n,
  pipe() {
    return j(this, arguments);
  }
}), Hk = "effect/MetricRegistry", Yh = /* @__PURE__ */ Symbol.for(Hk);
var td;
td = Yh;
class Wk {
  constructor() {
    m(this, td, Yh);
    m(this, "map", /* @__PURE__ */ zT());
  }
  snapshot() {
    const n = [];
    for (const [i, s] of this.map)
      n.push(Zk(i, s.get()));
    return n;
  }
  get(n) {
    const i = T(this.map, pn(n), mn);
    if (i == null) {
      if (ap(n.keyType))
        return this.getCounter(n);
      if (ik(n.keyType))
        return this.getGauge(n);
      if (nk(n.keyType))
        return this.getFrequency(n);
      if (cp(n.keyType))
        return this.getHistogram(n);
      if (rk(n.keyType))
        return this.getSummary(n);
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else
      return i;
  }
  getCounter(n) {
    let i = T(this.map, pn(n), mn);
    if (i == null) {
      const s = Ok(n);
      T(this.map, Ui(n)) || T(this.map, Vi(n, s)), i = s;
    }
    return i;
  }
  getFrequency(n) {
    let i = T(this.map, pn(n), mn);
    if (i == null) {
      const s = Rk(n);
      T(this.map, Ui(n)) || T(this.map, Vi(n, s)), i = s;
    }
    return i;
  }
  getGauge(n) {
    let i = T(this.map, pn(n), mn);
    if (i == null) {
      const s = Nk(n, n.keyType.bigint ? BigInt(0) : 0);
      T(this.map, Ui(n)) || T(this.map, Vi(n, s)), i = s;
    }
    return i;
  }
  getHistogram(n) {
    let i = T(this.map, pn(n), mn);
    if (i == null) {
      const s = Ak(n);
      T(this.map, Ui(n)) || T(this.map, Vi(n, s)), i = s;
    }
    return i;
  }
  getSummary(n) {
    let i = T(this.map, pn(n), mn);
    if (i == null) {
      const s = Fk(n);
      T(this.map, Ui(n)) || T(this.map, Vi(n, s)), i = s;
    }
    return i;
  }
}
const jk = () => new Wk(), Uk = "effect/Metric", Vk = /* @__PURE__ */ Symbol.for(Uk), qk = {
  /* c8 ignore next */
  _Type: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _Out: (t) => t
}, Xh = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => jk()), mp = function(t, n, i, s) {
  const a = Object.assign((u) => rm(u, (h) => Yk(a, h)), {
    [Vk]: qk,
    keyType: t,
    unsafeUpdate: n,
    unsafeValue: i,
    unsafeModify: s,
    register() {
      return this.unsafeValue([]), this;
    },
    pipe() {
      return j(this, arguments);
    }
  });
  return a;
}, Oo = (t, n) => pp(uk(t, n)), pp = (t) => {
  let n;
  const i = /* @__PURE__ */ new WeakMap(), s = (a) => {
    if (a.length === 0)
      return n !== void 0 || (n = Xh.get(t)), n;
    let u = i.get(a);
    return u !== void 0 || (u = Xh.get(hk(t, a)), i.set(a, u)), u;
  };
  return mp(t.keyType, (a, u) => s(u).update(a), (a) => s(a).get(), (a, u) => s(u).modify(a));
}, Gk = (t, n, i) => pp(lk(t, n, i)), Kk = /* @__PURE__ */ y(3, (t, n, i) => Jk(t, [wx(n, i)])), Jk = /* @__PURE__ */ y(2, (t, n) => mp(t.keyType, (i, s) => t.unsafeUpdate(i, bs(n, s)), (i) => t.unsafeValue(bs(n, i)), (i, s) => t.unsafeModify(i, bs(n, s)))), Yk = /* @__PURE__ */ y(2, (t, n) => fu(Ya, (i) => z(() => t.unsafeUpdate(n, i))));
({
  ...Rc
});
const Xk = /* @__PURE__ */ y(2, (t, n) => fu(tp, (i) => z(() => {
  if (i.has(t)) {
    const s = i.get(t);
    s.state.completed || (s.state.completed = !0, ym(s.result, n));
  }
}))), Qk = "effect/Supervisor", Ro = /* @__PURE__ */ Symbol.for(Qk), Cu = {
  /* c8 ignore next */
  _T: (t) => t
};
var ed;
ed = Ro;
const zu = class zu {
  constructor(n, i) {
    m(this, "underlying");
    m(this, "value0");
    m(this, ed, Cu);
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
    return new zu(this, T(this.value, yt(n)));
  }
  zip(n) {
    return new Xs(this, n);
  }
};
let Ys = zu;
var nd;
nd = Ro;
const Du = class Du {
  constructor(n, i) {
    m(this, "left");
    m(this, "right");
    m(this, "_tag", "Zip");
    m(this, nd, Cu);
    this.left = n, this.right = i;
  }
  get value() {
    return om(this.left.value, this.right.value);
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
    return new Ys(this, T(this.value, yt(n)));
  }
  zip(n) {
    return new Du(this, n);
  }
};
let Xs = Du;
const gp = (t) => X(t, Ro) && dd(t, "Zip");
var id;
id = Ro;
class t1 {
  constructor(n) {
    m(this, "effect");
    m(this, id, Cu);
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
    return new Ys(this, T(this.value, yt(n)));
  }
  zip(n) {
    return new Xs(this, n);
  }
  onRun(n, i) {
    return n();
  }
}
const e1 = (t) => new t1(t), No = /* @__PURE__ */ ft("effect/Supervisor/none", () => e1(Le)), n1 = Si, yp = "Empty", vp = "AddSupervisor", bp = "RemoveSupervisor", wp = "AndThen", rr = {
  _tag: yp
}, Es = (t, n) => ({
  _tag: wp,
  first: t,
  second: n
}), i1 = (t, n) => r1(n, re(t)), r1 = (t, n) => {
  let i = t, s = n;
  for (; Ye(s); ) {
    const a = Ae(s);
    switch (a._tag) {
      case yp: {
        s = Ve(s);
        break;
      }
      case vp: {
        i = i.zip(a.supervisor), s = Ve(s);
        break;
      }
      case bp: {
        i = mc(i, a.supervisor), s = Ve(s);
        break;
      }
      case wp: {
        s = Se(a.first)(Se(a.second)(Ve(s)));
        break;
      }
    }
  }
  return i;
}, mc = (t, n) => Y(t, n) ? No : gp(t) ? mc(t.left, n).zip(mc(t.right, n)) : t, Qs = (t) => Y(t, No) ? kn() : gp(t) ? T(Qs(t.left), ur(Qs(t.right))) : Gc(t), s1 = (t, n) => {
  if (Y(t, n))
    return rr;
  const i = Qs(t), s = Qs(n), a = T(s, hh(i), $s(rr, (h, d) => Es(h, {
    _tag: vp,
    supervisor: d
  }))), u = T(i, hh(s), $s(rr, (h, d) => Es(h, {
    _tag: bp,
    supervisor: d
  })));
  return Es(a, u);
}, o1 = /* @__PURE__ */ n1({
  empty: rr,
  patch: i1,
  combine: Es,
  diff: s1
}), a1 = /* @__PURE__ */ Oo("effect_fiber_started", {
  incremental: !0
}), Qh = /* @__PURE__ */ Oo("effect_fiber_active"), c1 = /* @__PURE__ */ Oo("effect_fiber_successes", {
  incremental: !0
}), u1 = /* @__PURE__ */ Oo("effect_fiber_failures", {
  incremental: !0
}), l1 = /* @__PURE__ */ Kk(/* @__PURE__ */ Gk("effect_fiber_lifetimes", /* @__PURE__ */ jE({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds"), qi = "Continue", h1 = "Done", tf = "Yield", f1 = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t
}, ps = (t) => {
  throw new Error(`BUG: FiberRuntime - ${ni(t)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
}, We = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp"), je = /* @__PURE__ */ ft("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
})), Gi = {
  [Cs]: (t, n, i) => Xt(() => n.effect_instruction_i1(i)),
  OnStep: (t, n, i) => Bt(Bt(i)),
  [Is]: (t, n, i) => Xt(() => n.effect_instruction_i2(i)),
  [Ic]: (t, n, i) => (t.patchRuntimeFlags(t.currentRuntimeFlags, n.patch), en(t.currentRuntimeFlags) && t.isInterrupted() ? bt(t.getInterruptedCause()) : Bt(i)),
  [Os]: (t, n, i) => (Xt(() => n.effect_instruction_i2(i)), Xt(() => n.effect_instruction_i0()) ? (t.pushStack(n), Xt(() => n.effect_instruction_i1())) : Le),
  [tr]: (t, n, i) => {
    for (; ; ) {
      const s = Xt(() => n.effect_instruction_i0.next(i));
      if (s.done)
        return Bt(s.value);
      const a = Uy(s.value);
      if (Lo(a)) {
        if (a._tag === "Failure")
          return a;
      } else return t.pushStack(n), a;
      i = a.value;
    }
  }
}, d1 = {
  [Tu]: (t, n, i, s) => (t.processNewInterruptSignal(s.cause), en(n) ? bt(s.cause) : i),
  [xu]: (t, n, i, s) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [Pu]: (t, n, i, s) => (s.onFiber(t, Um(n)), i),
  [Eu]: (t, n, i, s) => A(uu(), () => i)
}, _1 = (t) => Po(Yw(t), (n) => Tn(hS(n), ([i, s]) => {
  const a = /* @__PURE__ */ new Map(), u = [];
  for (const d of s) {
    u.push(bn(d));
    for (const _ of d)
      a.set(_.request, _);
  }
  const h = u.flat();
  return Eo(I1(i.runAll(u), h, () => h.forEach((d) => {
    d.listeners.interrupted = !0;
  })), tp, a);
}, !1, !1)), m1 = /* @__PURE__ */ Oc();
var rd, sd;
class Sp extends Fm {
  constructor(i, s, a) {
    super();
    m(this, sd, ME);
    m(this, rd, f1);
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
    if (this.currentRuntimeFlags = a, this._fiberId = i, this._fiberRefs = s, ph(a)) {
      const u = this.getFiberRef(Ya);
      a1.unsafeUpdate(1, u), Qh.unsafeUpdate(1, u);
    }
    this.refreshRefCache();
  }
  commit() {
    return ep(this);
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
    this.tell(qn(i));
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
    return this.ask((i, s) => jx(s) ? i.currentRuntimeFlags : s.runtimeFlags);
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return EE(this);
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
    return this.getFiberRef(_s);
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
      const s = CT(this._fiberId);
      return this.tell(xs((a, u) => {
        ym(s, z(() => i(a, u)));
      })), gm(s);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(i) {
    this._queue.push(i), this._running || (this._running = !0, this.drainQueueLaterOnExecutor());
  }
  get await() {
    return In((i) => {
      const s = (a) => i(Q(a));
      return this.tell(xs((a, u) => {
        a._exitValue !== null ? s(this._exitValue) : a.addObserver(s);
      })), z(() => this.tell(xs((a, u) => {
        a.removeObserver(s);
      })));
    }, this.id());
  }
  get inheritAll() {
    return oe((i, s) => {
      const a = i.id(), u = i.getFiberRefs(), h = s.runtimeFlags, d = this.getFiberRefs(), _ = UP(u, a, d);
      i.setFiberRefs(_);
      const g = i.getFiberRef(of), w = T(
        Ts(h, g),
        // Do not inherit WindDown or Interruption!
        yh(Ti),
        yh(Ka)
      );
      return KS(w);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return z(() => Nc(this._exitValue));
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
    return z(() => this.tell(xa(nn(i))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(i) {
    this.tell(xa(nn(i)));
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
    return this.setFiberRef(of, this.currentRuntimeFlags), this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(i) {
    this._fiberRefs = Nm(this._fiberRefs, i);
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
    this._fiberRefs = Qa(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef: i,
      value: s
    }), this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(Us), this.currentTracer = this.currentDefaultServices.unsafeMap.get(Cm.key), this.currentSupervisor = this.getFiberRef(C1), this.currentScheduler = this.getFiberRef(Qm), this.currentContext = this.getFiberRef(Fr), this.currentSpan = this.currentContext.unsafeMap.get(Im.key);
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
      let s = qi;
      const a = globalThis[_n];
      globalThis[_n] = this;
      try {
        for (; s === qi; )
          s = this._queue.length === 0 ? h1 : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
      } finally {
        this._running = !1, globalThis[_n] = a;
      }
      this._queue.length > 0 && !this._running ? (this._running = !0, s === tf ? (this.drainQueueLaterOnExecutor(), i = !1) : i = !0) : i = !1;
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
      a = d1[u._tag](this, i, a, u);
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
    return !pS(this.getFiberRef(_s));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(i) {
    const s = this.getFiberRef(_s);
    this.setFiberRef(_s, we(s, i));
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
      s.tell(xa(nn(this.id()))), i = !0;
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
          return u.done ? z(() => {
            s = !0;
          }) : Nr(u.value.await);
        },
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(i) {
    if (ph(this.currentRuntimeFlags)) {
      const s = this.getFiberRef(Ya), a = this.id().startTimeMillis, u = Date.now();
      switch (l1.unsafeUpdate(u - a, s), Qh.unsafeUpdate(-1, s), i._tag) {
        case he: {
          c1.unsafeUpdate(1, s);
          break;
        }
        case le: {
          u1.unsafeUpdate(1, s);
          break;
        }
      }
    }
    if (i._tag === "Failure") {
      const s = this.getFiberRef(yT);
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
    return this.getFiberRef(b1);
  }
  log(i, s, a) {
    const u = Fe(a) ? a.value : this.getFiberRef(dT), h = this.getFiberRef(p1);
    if (ax(h, u))
      return;
    const d = this.getFiberRef(_T), _ = this.getFiberRef(fT), g = this.getLoggers(), w = this.getFiberRefs();
    if (m_(g) > 0) {
      const v = Vd(this.getFiberRef(Us), Mo), P = new Date(v.unsafeCurrentTimeMillis());
      Jy(w, () => {
        for (const x of g)
          x.log({
            fiberId: this.id(),
            logLevel: u,
            message: i,
            cause: s,
            context: w,
            spans: d,
            annotations: _,
            date: P
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
        return tf;
      case Tu:
        return this.processNewInterruptSignal(i.cause), this._asyncInterruptor !== null && (this._asyncInterruptor(bt(i.cause)), this._asyncInterruptor = null), qi;
      case xu:
        return this._asyncInterruptor = null, this._asyncBlockingOn = null, this.evaluateEffect(i.effect), qi;
      case Pu:
        return i.onFiber(this, this._exitValue !== null ? Hx : Wx(this.currentRuntimeFlags, this._asyncBlockingOn)), qi;
      default:
        return ps(i);
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
      let s = en(this.currentRuntimeFlags) && this.isInterrupted() ? bt(this.getInterruptedCause()) : i;
      for (; s !== null; ) {
        const a = s, u = this.runLoop(a);
        if (u === We) {
          const h = je.currentOp;
          je.currentOp = null, h._op === vs ? Vw(this.currentRuntimeFlags) ? (this.tell(SE()), this.tell(qn(gn)), s = null) : s = gn : h._op === Qi && (s = null);
        } else {
          this.currentRuntimeFlags = T(this.currentRuntimeFlags, qw(Ka));
          const h = this.interruptAllChildren();
          h !== null ? s = A(h, () => u) : (this._queue.length === 0 ? this.setExitValue(u) : this.tell(qn(u)), s = null);
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
      this.tell(qn(i));
    else {
      this._running = !0;
      const s = globalThis[_n];
      globalThis[_n] = this;
      try {
        this.evaluateEffect(i);
      } finally {
        this._running = !1, globalThis[_n] = s, this._queue.length > 0 && this.drainQueueLaterOnExecutor();
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
    this.tell(qn(i));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(i, s) {
    const a = Ps(i, s);
    return globalThis[_n] = this, this.currentRuntimeFlags = a, a;
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
      a || (a = !0, this.tell(qn(h)));
    };
    en(i) && (this._asyncInterruptor = u);
    try {
      s(u);
    } catch (h) {
      u(ae(Ke(h)));
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
      if (i._op !== ys)
        return i;
      i = this.popStack();
    }
  }
  getNextFailCont() {
    let i = this.popStack();
    for (; i; ) {
      if (i._op !== Cs && i._op !== Os && i._op !== tr)
        return i;
      i = this.popStack();
    }
  }
  [(sd = LE, rd = IE, Xy)](i) {
    return z(() => qd(this.currentContext, i));
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
      const u = yE(hE(i, this.currentContext));
      return u.addObserver((h) => {
        if (h._tag === "Success")
          return a(Bt(h.value));
        switch (h.cause._tag) {
          case "Interrupt":
            return a(bt(nn(fi)));
          case "Fail":
            return a(Ft(h.cause.error));
          case "Die":
            return a(Ws(h.cause.defect));
        }
      }), Hs((h) => {
        a = (d) => {
          h(Le);
        }, u.unsafeInterrupt();
      });
    });
  }
  [wd](i) {
    const s = Xt(() => i.effect_instruction_i0()), a = this.getNextSuccessCont();
    return a !== void 0 ? (a._op in Gi || ps(a), Gi[a._op](this, a, s)) : (je.currentOp = Bt(s), We);
  }
  [he](i) {
    const s = i, a = this.getNextSuccessCont();
    return a !== void 0 ? (a._op in Gi || ps(a), Gi[a._op](this, a, s.effect_instruction_i0)) : (je.currentOp = s, We);
  }
  [le](i) {
    const s = i.effect_instruction_i0, a = this.getNextFailCont();
    if (a !== void 0)
      switch (a._op) {
        case ys:
        case Is:
          return en(this.currentRuntimeFlags) && this.isInterrupted() ? bt(vh(s)) : Xt(() => a.effect_instruction_i1(s));
        case "OnStep":
          return en(this.currentRuntimeFlags) && this.isInterrupted() ? bt(vh(s)) : Bt(bt(s));
        case Ic:
          return this.patchRuntimeFlags(this.currentRuntimeFlags, a.patch), en(this.currentRuntimeFlags) && this.isInterrupted() ? bt(we(s, this.getInterruptedCause())) : bt(s);
        default:
          ps(a);
      }
    else
      return je.currentOp = bt(s), We;
  }
  [Sd](i) {
    return Xt(() => i.effect_instruction_i0(this, Um(this.currentRuntimeFlags)));
  }
  Blocked(i) {
    const s = this.getFiberRefs(), a = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const u = [], h = this._steps[this._steps.length - 1];
      let d = this.popStack();
      for (; d && d._op !== "OnStep"; )
        u.push(d), d = this.popStack();
      this.setFiberRefs(h.refs), this.currentRuntimeFlags = h.flags;
      const _ = Ox(h.refs, s), g = Ts(h.flags, a);
      return Bt(q_(i.effect_instruction_i0, oe((w) => {
        for (; u.length > 0; )
          w.pushStack(u.pop());
        return w.setFiberRefs(Rx(w.id(), w.getFiberRefs())(_)), w.currentRuntimeFlags = Ps(g)(w.currentRuntimeFlags), i.effect_instruction_i1;
      })));
    }
    return xo((u) => A(Tp(FS(i.effect_instruction_i0)), () => u(i.effect_instruction_i1)));
  }
  RunBlocked(i) {
    return _1(i.effect_instruction_i0);
  }
  [xr](i) {
    const s = i.effect_instruction_i0, a = this.currentRuntimeFlags, u = Ps(a, s);
    if (en(u) && this.isInterrupted())
      return bt(this.getInterruptedCause());
    if (this.patchRuntimeFlags(this.currentRuntimeFlags, s), i.effect_instruction_i1) {
      const h = Ts(u, a);
      return this.pushStack(new BS(h, i)), Xt(() => i.effect_instruction_i1(a));
    } else
      return gn;
  }
  [Cs](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  OnStep(i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [ys](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [Is](i) {
    return this.pushStack(i), i.effect_instruction_i0;
  }
  [Qi](i) {
    return this._asyncBlockingOn = i.effect_instruction_i1, this.initiateAsync(this.currentRuntimeFlags, i.effect_instruction_i0), je.currentOp = i, We;
  }
  [vs](i) {
    return this._isYielding = !1, je.currentOp = i, We;
  }
  [Os](i) {
    const s = i.effect_instruction_i0, a = i.effect_instruction_i1;
    return s() ? (this.pushStack(i), a()) : gn;
  }
  [tr](i) {
    return Gi[tr](this, i, void 0);
  }
  [uo](i) {
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
      if (this.currentRuntimeFlags & Uw && this.currentSupervisor.onEffect(this, s), this._queue.length > 0 && (s = this.drainQueueWhileRunning(this.currentRuntimeFlags, s)), !this._isYielding) {
        this.currentOpCount += 1;
        const a = this.currentScheduler.shouldYield(this);
        if (a !== !1) {
          this._isYielding = !0, this.currentOpCount = 0;
          const u = s;
          s = A(uu({
            priority: a
          }), () => u);
        }
      }
      try {
        if (s = this.currentTracer.context(() => {
          if (m1 !== s[vi]._V) {
            const a = this.getFiberRef(vT);
            if (a._tag === "Some") {
              const u = s[vi]._V;
              this.log(`Executing an Effect versioned ${u} with a Runtime of version ${Oc()}, you may want to dedupe the effect dependencies, you can use the language service plugin to detect this at compile time: https://github.com/Effect-TS/language-service`, pi, a);
            }
          }
          return this[s._op](s);
        }, this), s === We) {
          const a = je.currentOp;
          return a._op === vs || a._op === Qi ? We : (je.currentOp = null, a._op === he || a._op === le ? a : bt(Ke(a)));
        }
      } catch (a) {
        s !== We && !X(s, "_op") || !(s._op in this) ? s = ZS(`Not a valid effect: ${ni(s)}`) : PT(a) ? s = bt(we(Ke(a), nn(fi))) : s = Ws(a);
      }
    }
  }
}
const p1 = /* @__PURE__ */ ft("effect/FiberRef/currentMinimumLogLevel", () => ce(cx("Info"))), g1 = (t) => Lu((n) => {
  const i = KP(n.context, Us);
  Vd(i, Mm).unsafe.log(t.log(n));
}), y1 = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => g1(zE)), v1 = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => Lu(({
  annotations: t,
  cause: n,
  context: i,
  fiberId: s,
  logLevel: a,
  message: u
}) => {
  const h = Lr(pr(i, Fr), Im);
  if (h._tag === "None" || h.value._tag === "ExternalSpan")
    return;
  const d = qd(pr(i, Us), Mo), _ = {};
  for (const [g, w] of t)
    _[g] = w;
  _["effect.fiberId"] = O0(s), _["effect.logLevel"] = a.label, n !== null && n._tag !== "Empty" && (_["effect.cause"] = Or(n, {
    renderErrorCause: !0
  })), h.value.event(ni(Array.isArray(u) && u.length === 1 ? u[0] : u), d.unsafeCurrentTimeNanos(), _);
})), b1 = /* @__PURE__ */ ft(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => cT(Gc(y1, v1))), w1 = (t) => {
  if (Array.isArray(t) || _d(t))
    return [t, H()];
  const n = Object.keys(t), i = n.length;
  return [n.map((s) => t[s]), nt((s) => {
    const a = {};
    for (let u = 0; u < i; u++)
      a[n[u]] = s[u];
    return a;
  })];
}, S1 = (t, n, i) => {
  const s = [];
  for (const a of t)
    s.push(mr(a));
  return A(gr(s, gt, {
    concurrency: i == null ? void 0 : i.concurrency,
    batching: i == null ? void 0 : i.batching,
    concurrentFinalizers: i == null ? void 0 : i.concurrentFinalizers
  }), (a) => {
    const u = H(), h = a.length, d = new Array(h), _ = new Array(h);
    let g = !1;
    for (let w = 0; w < h; w++) {
      const v = a[w];
      v._tag === "Left" ? (d[w] = nt(v.left), g = !0) : (_[w] = v.right, d[w] = u);
    }
    return g ? n._tag === "Some" ? Ft(n.value(d)) : Ft(d) : i != null && i.discard ? Le : n._tag === "Some" ? Q(n.value(_)) : Q(_);
  });
}, T1 = (t, n, i) => {
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
}, P1 = (t, n) => {
  const [i, s] = w1(t);
  return (n == null ? void 0 : n.mode) === "validate" ? S1(i, s, n) : (n == null ? void 0 : n.mode) === "either" ? T1(i, s, n) : (n == null ? void 0 : n.discard) !== !0 && s._tag === "Some" ? yt(gr(i, gt, n), s.value) : gr(i, gt, n);
}, gr = /* @__PURE__ */ y((t) => _d(t[0]), (t, n, i) => oe((s) => {
  const a = (i == null ? void 0 : i.batching) === !0 || (i == null ? void 0 : i.batching) === "inherit" && s.getFiberRef(gT);
  return i != null && i.discard ? Gh(i.concurrency, () => Gn(nc, i == null ? void 0 : i.concurrentFinalizers)((u) => a ? Tn(t, (h, d) => u(n(h, d)), !0, !1, 1) : Po(t, (h, d) => u(n(h, d)))), () => Gn(ic, i == null ? void 0 : i.concurrentFinalizers)((u) => Tn(t, (h, d) => u(n(h, d)), a, !1)), (u) => Gn(rc(u), i == null ? void 0 : i.concurrentFinalizers)((h) => Tn(t, (d, _) => h(n(d, _)), a, !1, u))) : Gh(i == null ? void 0 : i.concurrency, () => Gn(nc, i == null ? void 0 : i.concurrentFinalizers)((u) => a ? ef(t, 1, (h, d) => u(n(h, d)), !0) : rn(t, (h, d) => u(n(h, d)))), () => Gn(ic, i == null ? void 0 : i.concurrentFinalizers)((u) => x1(t, (h, d) => u(n(h, d)), a)), (u) => Gn(rc(u), i == null ? void 0 : i.concurrentFinalizers)((h) => ef(t, u, (d, _) => h(n(d, _)), a)));
})), x1 = (t, n, i) => At(() => {
  const s = $t(t), a = new Array(s.length);
  return qe(Tn(s, (h, d) => A(n(h, d), (_) => z(() => a[d] = _)), i, !1), Q(a));
}), Tn = (t, n, i, s, a) => xo((u) => GS((h) => oe((d) => {
  let _ = Array.from(t).reverse(), g = _.length;
  if (g === 0)
    return Le;
  let w = 0, v = !1;
  const P = a ? Math.min(_.length, a) : _.length, x = /* @__PURE__ */ new Set(), C = new Array(), I = () => x.forEach((mt) => {
    mt.currentScheduler.scheduleTask(() => {
      mt.unsafeInterruptAsFork(d.id());
    }, 0);
  }), W = new Array(), lt = new Array(), rt = new Array(), dt = () => {
    const mt = C.filter(({
      exit: wt
    }) => wt._tag === "Failure").sort((wt, it) => wt.index < it.index ? -1 : wt.index === it.index ? 0 : 1).map(({
      exit: wt
    }) => wt);
    return mt.length === 0 && mt.push(gn), mt;
  }, _t = (mt, wt = !1) => {
    const it = sm(h(mt)), U = k1(it, d, d.currentRuntimeFlags, ku);
    return d.currentScheduler.scheduleTask(() => {
      wt && U.unsafeInterruptAsFork(d.id()), U.resume(it);
    }, 0), U;
  }, Et = () => {
    s || (g -= _.length, _ = []), v = !0, I();
  }, Mt = i ? jS : X_, ee = _t(In((mt) => {
    const wt = (U, G) => {
      U._op === "Blocked" ? rt.push(U) : (C.push({
        index: G,
        exit: U
      }), U._op === "Failure" && !v && Et());
    }, it = () => {
      if (_.length > 0) {
        const U = _.pop();
        let G = w++;
        const St = () => {
          const Z = _.pop();
          return G = w++, A(uu(), () => A(Mt(u(n(Z, G))), Tt));
        }, Tt = (Z) => _.length > 0 && (wt(Z, G), _.length > 0) ? St() : Q(Z), Me = A(Mt(u(n(U, G))), Tt), st = _t(Me);
        W.push(st), x.add(st), v && st.currentScheduler.scheduleTask(() => {
          st.unsafeInterruptAsFork(d.id());
        }, 0), st.addObserver((Z) => {
          let N;
          if (Z._op === "Failure" ? N = Z : N = Z.effect_instruction_i0, lt.push(st), x.delete(st), wt(N, G), C.length === g)
            mt(Q(Je(kh(dt(), {
              parallel: !0
            }), () => gn)));
          else if (rt.length + C.length === g) {
            const _e = dt(), $ = rt.map((ot) => ot.effect_instruction_i0).reduce(F_);
            mt(Q(q_($, Tn([Je(kh(_e, {
              parallel: !0
            }), () => gn), ...rt.map((ot) => ot.effect_instruction_i1)], (ot) => ot, i, !0, a))));
          } else
            it();
        });
      }
    };
    for (let U = 0; U < P; U++)
      it();
  }));
  return Nr(au(tm(u(ep(ee))), pm({
    onFailure: (mt) => {
      Et();
      const wt = rt.length + 1, it = Math.min(typeof a == "number" ? a : rt.length, rt.length), U = Array.from(rt);
      return In((G) => {
        let St = 0, Tt = 0;
        const Me = (Z, N) => (_e) => {
          St++, St === wt && G(Bt(bt(mt))), U.length > 0 && N && st();
        }, st = () => {
          _t(U.pop(), !0).addObserver(Me(Tt, !0)), Tt++;
        };
        ee.addObserver(Me(Tt, !1)), Tt++;
        for (let Z = 0; Z < it; Z++)
          st();
      });
    },
    onSuccess: () => rn(lt, (mt) => mt.inheritAll)
  })));
}))), ef = (t, n, i, s) => At(() => {
  const a = $t(t), u = new Array(a.length);
  return qe(Tn(a, (d, _) => yt(i(d, _), (g) => u[_] = g), s, !1, n), Q(u));
}), Tp = (t) => L1(t, ku), E1 = (t, n, i, s = null) => {
  const a = Pp(t, n, i, s);
  return a.resume(t), a;
}, k1 = (t, n, i, s = null) => Pp(t, n, i, s), Pp = (t, n, i, s = null) => {
  const a = v_(), u = n.getFiberRefs(), h = VP(u, a), d = new Sp(a, h, i), _ = pr(h, Fr), g = d.currentSupervisor;
  return g.onStart(_, t, nt(n), d), d.addObserver((v) => g.onEnd(v, d)), (s !== null ? s : T(n.getFiberRef(Xa), Je(() => n.scope()))).add(i, d), d;
}, L1 = (t, n) => oe((i, s) => Q(E1(t, i, s.runtimeFlags, n))), nf = (t) => Mi((n) => an(Lr(n, Dr), {
  onNone: () => t,
  onSome: (i) => {
    switch (i.strategy._tag) {
      case "Parallel":
        return t;
      case "Sequential":
      case "ParallelN":
        return A(ko(i, ic), (s) => Iu(t, s));
    }
  }
})), rf = (t) => (n) => Mi((i) => an(Lr(i, Dr), {
  onNone: () => n,
  onSome: (s) => s.strategy._tag === "ParallelN" && s.strategy.parallelism === t ? n : A(ko(s, rc(t)), (a) => Iu(n, a))
})), Gn = (t, n) => (i) => Mi((s) => an(Lr(s, Dr), {
  onNone: () => i(gt),
  onSome: (a) => {
    if (n === !0) {
      const u = t._tag === "Parallel" ? nf : t._tag === "Sequential" ? sf : rf(t.parallelism);
      switch (a.strategy._tag) {
        case "Parallel":
          return u(i(nf));
        case "Sequential":
          return u(i(sf));
        case "ParallelN":
          return u(i(rf(a.strategy.parallelism)));
      }
    } else
      return i(gt);
  }
})), sf = (t) => Mi((n) => an(Lr(n, Dr), {
  onNone: () => t,
  onSome: (i) => {
    switch (i.strategy._tag) {
      case "Sequential":
        return t;
      case "Parallel":
      case "ParallelN":
        return A(ko(i, nc), (s) => Iu(t, s));
    }
  }
})), Dr = /* @__PURE__ */ An("effect/Scope"), Iu = /* @__PURE__ */ y(2, (t, n) => NT(
  t,
  // @ts-expect-error
  Gd(fb(Dr, n))
)), M1 = (t) => Li(t, {
  differ: o1,
  fork: rr
}), of = /* @__PURE__ */ lT(Gw), C1 = /* @__PURE__ */ M1(No), I1 = (t, n, i) => Q_((s) => A(A(Tp(em(t)), (a) => In((u) => {
  const h = n.map((g) => g.listeners.count), d = () => {
    h.every((g) => g === 0) && n.every((g) => g.result.state.current._tag === "Pending" ? !0 : !!(g.result.state.current._tag === "Done" && Lo(g.result.state.current.effect) && g.result.state.current.effect._tag === "Failure" && Z_(g.result.state.current.effect.cause))) && (_.forEach((g) => g()), i == null || i(), u(am(a)));
  };
  a.addObserver((g) => {
    _.forEach((w) => w()), u(g);
  });
  const _ = n.map((g, w) => {
    const v = (P) => {
      h[w] = P, d();
    };
    return g.listeners.addObserver(v), () => g.listeners.removeObserver(v);
  });
  return d(), z(() => {
    _.forEach((g) => g());
  });
})), () => At(() => {
  const a = n.flatMap((u) => u.state.completed ? [] : [u]);
  return Po(a, (u) => Xk(u.request, kT(s)));
}))), O1 = "effect/ScheduleInterval", to = /* @__PURE__ */ Symbol.for(O1), xp = {
  [to]: to,
  startMillis: 0,
  endMillis: 0
}, Ou = (t, n) => t > n ? xp : {
  [to]: to,
  startMillis: t,
  endMillis: n
}, R1 = /* @__PURE__ */ y(2, (t, n) => N1(t, n) === t), N1 = /* @__PURE__ */ y(2, (t, n) => t.endMillis <= n.startMillis ? t : n.endMillis <= t.startMillis ? n : t.startMillis < n.startMillis ? t : n.startMillis < t.startMillis ? n : t.endMillis <= n.endMillis ? t : n), A1 = (t) => t.startMillis >= t.endMillis, F1 = /* @__PURE__ */ y(2, (t, n) => {
  const i = Math.max(t.startMillis, n.startMillis), s = Math.min(t.endMillis, n.endMillis);
  return Ou(i, s);
}), B1 = (t) => xn(t.endMillis - t.startMillis), $1 = (t) => Ou(t, Number.POSITIVE_INFINITY), af = Ou, Ep = xp, z1 = R1, D1 = A1, Z1 = F1, H1 = B1, W1 = $1, j1 = "effect/ScheduleIntervals", cf = /* @__PURE__ */ Symbol.for(j1), kp = (t) => ({
  [cf]: cf,
  intervals: t
}), U1 = /* @__PURE__ */ y(2, (t, n) => V1(t.intervals, n.intervals, Be())), V1 = (t, n, i) => {
  let s = t, a = n, u = i;
  for (; Ye(s) && Ye(a); ) {
    const h = T(Ae(s), Z1(Ae(a))), d = D1(h) ? u : T(u, Se(h));
    T(Ae(s), z1(Ae(a))) ? s = Ve(s) : a = Ve(a), u = d;
  }
  return kp(Pn(u));
}, pc = (t) => T(t.intervals, Qd, Je(() => Ep)).startMillis, q1 = (t) => T(t.intervals, Qd, Je(() => Ep)).endMillis, G1 = /* @__PURE__ */ y(2, (t, n) => pc(t) < pc(n)), K1 = (t) => Ye(t.intervals), J1 = kp, Y1 = U1, gc = pc, yc = q1, X1 = G1, Q1 = K1, Ru = "Continue", Lp = "Done", tL = (t) => ({
  _tag: Ru,
  intervals: t
}), eL = (t) => ({
  _tag: Ru,
  intervals: J1(re(t))
}), nL = {
  _tag: Lp
}, iL = (t) => t._tag === Ru, rL = (t) => t._tag === Lp, sL = tL, Mp = eL, yr = nL, uf = iL, vr = rL, oL = wT, aL = ko, cL = OE, lf = am, Nu = (t) => function() {
  if (arguments.length === 1) {
    const n = arguments[0];
    return (i, ...s) => t(n, i, ...s);
  }
  return t.apply(this, arguments);
}, Cp = /* @__PURE__ */ Nu((t, n, i) => {
  const s = v_(), a = [[Fr, [[s, t.context]]]];
  i != null && i.scheduler && a.push([Qm, [[s, i.scheduler]]]);
  let u = JP(t.fiberRefs, {
    entries: a,
    forkAs: s
  });
  i != null && i.updateRefs && (u = i.updateRefs(u, s));
  const h = new Sp(s, u, t.runtimeFlags);
  let d = n;
  i != null && i.scope && (d = A(aL(i.scope, jm), (g) => qe(bT(g, Q_((w) => Y(w, h.id()) ? Le : cm(h, w))), au(n, (w) => oL(g, w)))));
  const _ = h.currentSupervisor;
  return _ !== No && (_.onStart(t.context, d, H(), h), h.addObserver((g) => _.onEnd(g, h))), ku.add(t.runtimeFlags, h), (i == null ? void 0 : i.immediate) === !1 ? h.resume(d) : h.start(d), h;
}), Ea = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure"), gs = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var od, ad;
class uL extends Error {
  constructor(i) {
    const s = U_(i)[0];
    super((s == null ? void 0 : s.message) || "An error has occurred");
    m(this, ad);
    m(this, od);
    this[Ea] = Ea, this[gs] = i, this.name = s ? `(FiberFailure) ${s.name}` : "FiberFailure", s != null && s.stack && (this.stack = s.stack);
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[gs].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + Or(this[gs], {
      renderErrorCause: !0
    });
  }
  [(ad = Ea, od = gs, Lt)]() {
    return this.toString();
  }
}
const lL = (t) => {
  const n = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const i = new uL(t);
  return Error.stackTraceLimit = n, i;
}, hL = (t) => {
  const n = t;
  switch (n._op) {
    case "Failure":
    case "Success":
      return n;
    case "Left":
      return Lh(n.left);
    case "Right":
      return Bt(n.right);
    case "Some":
      return Bt(n.value);
    case "None":
      return Lh(new _u());
  }
}, fL = /* @__PURE__ */ Nu((t, n, i) => dL(t, n, i).then((s) => {
  switch (s._tag) {
    case he:
      return s.effect_instruction_i0;
    case le:
      throw lL(s.effect_instruction_i0);
  }
})), dL = /* @__PURE__ */ Nu((t, n, i) => new Promise((s) => {
  const a = hL(n);
  a && s(a);
  const u = Cp(t)(n);
  u.addObserver((h) => {
    s(h);
  }), (i == null ? void 0 : i.signal) !== void 0 && (i.signal.aborted ? u.unsafeInterruptAsFork(u.id()) : i.signal.addEventListener("abort", () => {
    u.unsafeInterruptAsFork(u.id());
  }, {
    once: !0
  }));
}));
class _L {
  constructor(n, i, s) {
    m(this, "context");
    m(this, "runtimeFlags");
    m(this, "fiberRefs");
    this.context = n, this.runtimeFlags = i, this.fiberRefs = s;
  }
  pipe() {
    return j(this, arguments);
  }
}
const mL = (t) => new _L(t.context, t.runtimeFlags, t.fiberRefs), pL = /* @__PURE__ */ N_(Ti, O_, I_), Ip = /* @__PURE__ */ mL({
  context: /* @__PURE__ */ $c(),
  runtimeFlags: pL,
  fiberRefs: /* @__PURE__ */ YP()
}), gL = /* @__PURE__ */ Cp(Ip), yL = /* @__PURE__ */ fL(Ip), vL = "effect/Schedule", Op = /* @__PURE__ */ Symbol.for(vL), bL = (t) => X(t, Op), wL = "effect/ScheduleDriver", SL = /* @__PURE__ */ Symbol.for(wL), vc = {
  start: 0,
  now: 0,
  input: void 0,
  output: void 0,
  elapsed: ci,
  elapsedSincePrevious: ci,
  recurrence: 0
}, hf = /* @__PURE__ */ zc()("effect/Schedule/CurrentIterationMetadata", {
  defaultValue: () => vc
}), TL = {
  /* c8 ignore next */
  _Out: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
}, PL = {
  /* c8 ignore next */
  _Out: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
};
var cd;
cd = Op;
class xL {
  constructor(n, i) {
    m(this, "initial");
    m(this, "step");
    m(this, cd, TL);
    this.initial = n, this.step = i;
  }
  pipe() {
    return j(this, arguments);
  }
}
const ff = (t, n, i, s) => px(t, (a) => a.recurrence === 0 ? {
  now: n,
  input: i,
  output: s,
  recurrence: a.recurrence + 1,
  elapsed: ci,
  elapsedSincePrevious: ci,
  start: n
} : {
  now: n,
  input: i,
  output: s,
  recurrence: a.recurrence + 1,
  elapsed: xn(n - a.start),
  elapsedSincePrevious: xn(n - a.now),
  start: a.start
});
var ud;
ud = SL;
class EL {
  constructor(n, i) {
    m(this, "schedule");
    m(this, "ref");
    m(this, ud, PL);
    m(this, "iterationMeta", /* @__PURE__ */ Bm(vc));
    this.schedule = n, this.ref = i;
  }
  get state() {
    return yt(ir(this.ref), (n) => n[1]);
  }
  get last() {
    return A(ir(this.ref), ([n, i]) => {
      switch (n._tag) {
        case "None":
          return To(() => new _u());
        case "Some":
          return Q(n.value);
      }
    });
  }
  get reset() {
    return Ta(this.ref, [H(), this.schedule.initial]).pipe(lu(Ta(this.iterationMeta, vc)));
  }
  next(n) {
    return T(yt(ir(this.ref), (i) => i[1]), A((i) => T(ZP, A((s) => T(At(() => this.schedule.step(s, n, i)), A(([a, u, h]) => {
      const d = Ta(this.ref, [nt(u), a]);
      if (vr(h))
        return d.pipe(qe(Ft(H())));
      const _ = gc(h.intervals) - s;
      if (_ <= 0)
        return d.pipe(qe(ff(this.iterationMeta, s, n, u)), Cn(u));
      const g = xn(_);
      return T(d, qe(ff(this.iterationMeta, s, n, u)), qe(Px(g)), Cn(u));
    }))))));
  }
}
const Zr = (t, n) => new xL(t, n), kL = /* @__PURE__ */ y(2, (t, n) => LL(t, (i) => z(() => n(i)))), LL = /* @__PURE__ */ y(2, (t, n) => FL(t, (i, s) => yt(n(i), (a) => $b(s, de(a))))), ML = /* @__PURE__ */ y(2, (t, n) => Au(t, (i, s) => z(() => n(i, s)))), Au = /* @__PURE__ */ y(2, (t, n) => Zr(t.initial, (i, s, a) => A(t.step(i, s, a), ([u, h, d]) => vr(d) ? Q([u, h, yr]) : yt(n(s, h), (_) => _ ? [u, h, d] : [u, h, yr])))), CL = (t) => kL(t, (n) => n), IL = (t) => T(mx([H(), t.initial]), yt((n) => new EL(t, n))), OL = (t, n = 2) => {
  const i = de(t);
  return CL(NL(Fu, (s) => Bb(i, Math.pow(n, s))));
}, Rp = /* @__PURE__ */ y(2, (t, n) => RL(t, n, Y1)), RL = /* @__PURE__ */ y(3, (t, n, i) => Zr([t.initial, n.initial], (s, a, u) => T(XS(t.step(s, a, u[0]), n.step(s, a, u[1]), (h, d) => [h, d]), A(([[h, d, _], [g, w, v]]) => uf(_) && uf(v) ? bc(t, n, a, h, d, _.intervals, g, w, v.intervals, i) : Q([[h, g], [d, w], yr]))))), bc = (t, n, i, s, a, u, h, d, _, g) => {
  const w = g(u, _);
  return Q1(w) ? Q([[s, h], [a, d], sL(w)]) : T(u, X1(_)) ? A(t.step(yc(u), i, s), ([v, P, x]) => vr(x) ? Q([[v, h], [P, d], yr]) : bc(t, n, i, v, P, x.intervals, h, d, _, g)) : A(n.step(yc(_), i, h), ([v, P, x]) => vr(x) ? Q([[s, v], [a, P], yr]) : bc(t, n, i, s, a, u, v, P, x.intervals, g));
}, NL = /* @__PURE__ */ y(2, (t, n) => AL(t, (i) => z(() => n(i)))), AL = /* @__PURE__ */ y(2, (t, n) => Zr(t.initial, (i, s, a) => A(t.step(i, s, a), ([u, h, d]) => yt(n(h), (_) => [u, _, d])))), FL = /* @__PURE__ */ y(2, (t, n) => Zr(t.initial, (i, s, a) => A(t.step(i, s, a), ([u, h, d]) => {
  if (vr(d))
    return Q([u, h, d]);
  const _ = d.intervals, g = H1(af(i, gc(_)));
  return yt(n(h, g), (w) => {
    const v = de(w), P = gc(_), x = i + Fs(v), C = x - P, I = Math.max(0, yc(_) + C), W = af(x, I);
    return [u, h, Mp(W)];
  });
}))), Np = (t) => DL(Fu, (n) => n < t), BL = (t, n) => Zr(t, (i, s, a) => z(() => [n(a), a, Mp(W1(i))])), $L = /* @__PURE__ */ y(2, (t, n) => Au(t, (i, s) => Tx(n(i)))), zL = /* @__PURE__ */ y(2, (t, n) => Au(t, (i, s) => n(i))), DL = /* @__PURE__ */ y(2, (t, n) => ML(t, (i, s) => n(s))), ks = /* @__PURE__ */ Symbol.for("effect/Schedule/ScheduleDefect");
var ld;
ld = ks;
class ZL {
  constructor(n) {
    m(this, "error");
    m(this, ld);
    this.error = n, this[ks] = ks;
  }
}
const HL = (t) => X(t, ks), df = (t) => _r(t, (n) => Ws(new ZL(n))), WL = (t) => an(iu(t, (n) => mS(n) && HL(n.defect) ? nt(n.defect) : H()), {
  onNone: () => t,
  onSome: (n) => dr(n.error)
}), jL = (t) => DS(t, (n) => ae(WL(n))), _f = /* @__PURE__ */ y(2, (t, n) => qL(t, n, (i, s) => Ft(i))), UL = /* @__PURE__ */ y(2, (t, n) => bL(n) ? _f(t, n) : jL(_f(t, VL(n)))), VL = (t) => {
  const n = t.schedule ?? Fu, i = t.while ? zL(n, (a) => {
    const u = t.while(a);
    return typeof u == "boolean" ? Q(u) : df(u);
  }) : n, s = t.until ? $L(i, (a) => {
    const u = t.until(a);
    return typeof u == "boolean" ? Q(u) : df(u);
  }) : i;
  return t.times ? Rp(s, Np(t.times)) : s;
}, qL = /* @__PURE__ */ y(3, (t, n, i) => A(IL(n), (s) => Ap(Hh(t, hf, ir(s.iterationMeta)), s, (a, u) => Hh(i(a, u), hf, ir(s.iterationMeta))))), Ap = (t, n, i) => _r(t, (s) => Ar(n.next(s), {
  onFailure: () => T(n.last, VS, A((a) => i(s, a))),
  onSuccess: () => Ap(t, n, i)
})), Fu = /* @__PURE__ */ BL(0, (t) => t + 1), GL = P1, KL = Ft, JL = YS, Fp = Q, eo = z, Bp = _r, YL = UL, XL = Ex, wc = yt, $p = rm, zp = xx, ka = gL, QL = yL, tM = OL, eM = Rp, nM = Np, be = {
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
}, iM = {
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
function Dp(t, n) {
  const { cycleTime: i, redDuration: s, greenDuration: a, yellowDuration: u, phaseOffset: h } = t, d = (n + h) % i;
  if (d < a)
    return {
      phase: "green",
      timeInPhase: d,
      timeUntilGreen: 0
    };
  if (d < a + u) {
    const _ = d - a;
    return {
      phase: "yellow",
      timeInPhase: _,
      timeUntilGreen: u - _ + s
    };
  } else {
    const _ = d - a - u;
    return {
      phase: "red",
      timeInPhase: _,
      timeUntilGreen: s - _
    };
  }
}
function rM() {
  const { MIN_CYCLE_TIME: t, MAX_CYCLE_TIME: n, RED_RATIO: i, GREEN_RATIO: s, YELLOW_DURATION: a } = iM, u = t + Math.random() * (n - t), h = u * i, d = u * s, _ = a, g = Math.random() * u;
  return {
    cycleTime: u,
    redDuration: h,
    greenDuration: d,
    yellowDuration: _,
    phaseOffset: g
  };
}
const Sc = {
  // Current Lime rate (£/min)
  PER_KM: 0.15,
  // Industry average distance rate
  UNLOCK_FEE: 1
  // Standard unlock
}, sM = [
  "https://overpass-api.de/api/interpreter",
  // Main instance (Germany)
  "https://overpass.private.coffee/api/interpreter",
  // No rate limit (Global)
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  // VK Maps (Russia) - no rate limit
  "https://overpass.osm.jp/api/interpreter"
  // Japan instance (Global)
], Xe = {
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
class Zp {
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
function oM(t, n) {
  if (t.length <= 2) return t;
  const i = [t[0]];
  let s = 0;
  for (let a = 1; a < t.length; a++) {
    const [u, h] = t[a - 1], [d, _] = t[a];
    s += sr(h, u, _, d), s >= n && (i.push(t[a]), s = 0);
  }
  return i[i.length - 1] !== t[t.length - 1] && i.push(t[t.length - 1]), i;
}
function aM(t) {
  if (t.length <= 2) return [t];
  const n = [];
  let i = [t[0]], s = 0;
  for (let a = 1; a < t.length; a++) {
    const [u, h] = t[a - 1], [d, _] = t[a], g = sr(h, u, _, d);
    i.push(t[a]), s += g, s >= Xe.CHUNK_DISTANCE_METERS && a < t.length - 1 && (n.push(i), i = [t[a]], s = 0);
  }
  return i.length > 0 && n.push(i), n;
}
function cM(t, n, i) {
  let s = 0, a = 1 / 0, u = 0, h = 0;
  for (let d = 0; d < i.length; d++) {
    const [_, g] = i[d], w = sr(t, n, g, _);
    if (w < a && (a = w, s = d, u = h), d > 0) {
      const [v, P] = i[d - 1];
      h += sr(P, v, g, _);
    }
  }
  return { closestIndex: s, distance: a, distanceFromStart: u };
}
function uM(t) {
  const n = [...t].sort((s, a) => s.distanceFromStart - a.distanceFromStart), i = [];
  for (const s of n) {
    const a = i[i.length - 1];
    (!a || s.distanceFromStart - a.distanceFromStart >= Xe.MIN_DISTANCE_BETWEEN_LIGHTS) && i.push(s);
  }
  return i;
}
function lM(t) {
  const i = oM(t, Xe.SAMPLE_INTERVAL_METERS).map(([s, a]) => `${a},${s}`).join(",");
  return `
    [out:json][timeout:30];
    (
      node["highway"="traffic_signals"](around:${Xe.BUFFER_METERS},${i});
    );
    out body;
  `;
}
function hM(t, n) {
  return XL({
    try: async () => {
      const i = new AbortController(), s = setTimeout(() => i.abort(), Xe.REQUEST_TIMEOUT_MS);
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
    catch: (i) => i instanceof Tc ? i : new Zp(i)
  });
}
const fM = T(
  tM(Xe.INITIAL_RETRY_DELAY_MS),
  eM(nM(Xe.MAX_RETRIES_PER_ENDPOINT))
);
function dM(t, n) {
  return T(
    hM(t, n),
    // Only retry if the error is retryable (5xx, network errors)
    // Immediately fail (and thus failover) on 429 and other 4xx
    YL({
      schedule: fM,
      while: (i) => i.isRetryable
    }),
    zp(
      (i) => eo(() => {
        i.shouldFailover ? console.warn(
          `Endpoint ${t} returned ${i instanceof Tc ? i.statusCode : "error"}, immediately trying next...`
        ) : console.warn(`Endpoint ${t} failed after retries, trying next...`);
      })
    )
  );
}
function _M(t) {
  return sM.reduce(
    (i, s) => T(
      i,
      Bp(() => dM(s, t))
    ),
    // Start with a failing effect to kick off the chain
    KL(new Zp("No endpoints configured"))
  );
}
function mM(t, n) {
  return t.elements.filter((i) => i.type === "node").map((i) => {
    const { closestIndex: s, distance: a, distanceFromStart: u } = cM(
      i.lat,
      i.lon,
      n
    );
    return a > Xe.BUFFER_METERS ? null : {
      id: i.id,
      lat: i.lat,
      lng: i.lon,
      routeIndex: s,
      distanceFromStart: u,
      timing: rM()
    };
  }).filter((i) => i !== null);
}
function pM(t, n) {
  const i = lM(t);
  return T(
    _M(i),
    wc((s) => mM(s, n))
  );
}
function gM(t, n, i) {
  return T(
    pM(t, n),
    $p(
      () => eo(() => {
        console.log(`Chunk ${i} completed successfully`);
      })
    ),
    zp(
      (s) => eo(() => {
        console.warn(`Chunk ${i} failed on all endpoints:`, s);
      })
    ),
    // If all endpoints fail, return empty array for this chunk
    Bp(() => Fp([]))
  );
}
function yM(t) {
  if (t.length === 0)
    return Fp([]);
  const n = aM(t), i = n.map(
    (s, a) => gM(s, t, a)
  );
  return T(
    // Run chunks with controlled concurrency
    GL(i, { concurrency: Xe.MAX_CONCURRENT_REQUESTS }),
    // Flatten results from all chunks
    wc((s) => s.flat()),
    // Deduplicate (chunks may have overlapping results)
    wc(uM),
    $p(
      (s) => eo(() => {
        console.log(
          `Fetched ${s.length} traffic lights from ${n.length} chunks`
        );
      })
    )
  );
}
function vM(t) {
  const [n, i] = Gt([]), [s, a] = Gt(!1), [u, h] = Gt(null), d = It(""), _ = It([]), g = It(null), w = t.length > 0 ? `${t.length}-${t[0][0]},${t[0][1]}-${t[t.length - 1][0]},${t[t.length - 1][1]}` : "";
  return Qt(() => {
    if (t.length === 0) {
      i([]), d.current = "";
      return;
    }
    if (w === d.current)
      return;
    d.current = w, _.current = t, g.current && (ka(lf(g.current)), g.current = null), a(!0), h(null);
    const v = JL(function* () {
      return yield* yM(_.current);
    }), P = ka(v);
    return g.current = P, QL(cL(P)).then((x) => {
      g.current === P && (AT(x) ? i(x.value) : FT(x) ? console.log("Traffic light request was interrupted") : (console.warn("Traffic light fetch failed:", x.cause), i([])), a(!1));
    }), () => {
      g.current && (ka(lf(g.current)), g.current = null);
    };
  }, [t, w]), {
    trafficLights: n,
    isLoading: s,
    error: u
  };
}
function La(t, n, i) {
  let s = 0;
  for (let W = 1; W < i.length; W++) {
    if (i[W] >= n) {
      s = W - 1;
      break;
    }
    s = W - 1;
  }
  if (s >= t.length - 1) {
    const [W, lt] = t[t.length - 1], rt = t[t.length - 2] || t[t.length - 1];
    return {
      lat: lt,
      lng: W,
      bearing: mf(rt[1], rt[0], lt, W),
      segmentIndex: t.length - 1
    };
  }
  const a = i[s], h = i[s + 1] - a, d = n - a, _ = h > 0 ? Math.min(1, d / h) : 0, [g, w] = t[s], [v, P] = t[s + 1], x = w + _ * (P - w), C = g + _ * (v - g), I = mf(w, g, P, v);
  return { lat: x, lng: C, bearing: I, segmentIndex: s };
}
function mf(t, n, i, s) {
  const a = t * Math.PI / 180, u = i * Math.PI / 180, h = (s - n) * Math.PI / 180, d = Math.sin(h) * Math.cos(u), _ = Math.cos(a) * Math.sin(u) - Math.sin(a) * Math.cos(u) * Math.cos(h);
  return (Math.atan2(d, _) * 180 / Math.PI + 360) % 360;
}
function bM(t, n, i, s) {
  const { MAX_SPEED_MS: a, ACCELERATION_RATE: u, DECELERATION_RATE: h, ACCELERATION_TIME: d, BRAKING_TIME: _ } = be, g = 0.5 * u * d * d, w = 0.5 * h * _ * _, v = n - t;
  return i && t < g ? Math.sqrt(2 * u * t) : s && v < w ? Math.sqrt(2 * h * v) : a;
}
function wM({
  coordinates: t,
  cumulativeDistances: n,
  trafficLights: i,
  totalDistance: s,
  simulationSpeed: a
}) {
  const [u, h] = Gt({
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
  }), [d, _] = Gt(null), g = It(null), w = It(0), v = It(0), P = It(0), x = It(!1), C = It(!0), I = It(t), W = It(n), lt = It(i), rt = It(s), dt = It(a);
  Qt(() => {
    I.current = t, W.current = n, lt.current = i, rt.current = s, dt.current = a;
  }, [t, n, i, s, a]);
  const _t = t.length > 0 && n.length > 0, Et = It(""), Mt = Jn(() => {
    g.current && (cancelAnimationFrame(g.current), g.current = null);
    const it = I.current, U = it.length > 0 ? { lat: it[0][1], lng: it[0][0], bearing: 0, segmentIndex: 0 } : null;
    _(U), P.current = 0, x.current = !1, C.current = !0, w.current = 0, h({
      status: "ready",
      currentPosition: U ? [U.lat, U.lng] : [0, 0],
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
  Qt(() => {
    if (!_t) {
      h((G) => ({ ...G, status: "idle" }));
      return;
    }
    const it = t, U = it.length > 0 ? `${it[0][0]},${it[0][1]}-${it[it.length - 1][0]},${it[it.length - 1][1]}` : "";
    U !== Et.current && (Et.current = U, Mt());
  }, [_t, t, Mt]);
  const ee = Jn((it) => {
    w.current === 0 && (w.current = it);
    const G = (it - w.current) / 1e3 * dt.current;
    w.current = it;
    const St = I.current, Tt = W.current, Me = lt.current, st = rt.current;
    h((Z) => {
      if (Z.status !== "playing") return Z;
      if (Z.isWaitingAtLight) {
        const Dt = Z.currentWaitTime + G;
        return Dt >= v.current ? (P.current = Z.distanceTraveled, x.current = !1, C.current = !0, {
          ...Z,
          isWaitingAtLight: !1,
          currentWaitTime: 0,
          totalWaitTime: Z.totalWaitTime + v.current,
          elapsedTime: Z.elapsedTime + G,
          currentSpeed: 0
        }) : {
          ...Z,
          currentWaitTime: Dt,
          elapsedTime: Z.elapsedTime + G,
          currentSpeed: 0
        };
      }
      const N = Me[Z.currentTrafficLightIndex], _e = (N == null ? void 0 : N.distanceFromStart) ?? st, $ = _e - Z.distanceTraveled, ot = 0.5 * be.DECELERATION_RATE * be.BRAKING_TIME * be.BRAKING_TIME;
      $ <= ot && N && !x.current && (x.current = !0);
      const Pt = Z.distanceTraveled - P.current, vt = _e - P.current, at = 0.5 * be.ACCELERATION_RATE * be.ACCELERATION_TIME * be.ACCELERATION_TIME;
      C.current && Pt >= at && (C.current = !1);
      const V = bM(
        Pt,
        vt,
        C.current,
        x.current
      );
      let Ut;
      if (C.current && Pt < at) {
        const ue = (Pt > 0 ? Math.sqrt(2 * Pt / be.ACCELERATION_RATE) : 0) + G, cn = be.ACCELERATION_TIME;
        ue <= cn ? Ut = 0.5 * be.ACCELERATION_RATE * ue * ue - Pt : Ut = V * G;
      } else
        Ut = V * G;
      const Vt = Math.min(Z.distanceTraveled + Ut, st);
      if (N && Vt >= N.distanceFromStart) {
        const Dt = Dp(N.timing, Z.elapsedTime), ue = La(St, N.distanceFromStart, Tt);
        return _(ue), Dt.phase === "green" || Dt.phase === "yellow" && Dt.timeInPhase < 2 ? (P.current = N.distanceFromStart, x.current = !1, {
          ...Z,
          distanceTraveled: N.distanceFromStart,
          routeProgress: N.distanceFromStart / st,
          elapsedTime: Z.elapsedTime + G,
          currentSpeed: Z.currentSpeed,
          // Maintain speed
          isWaitingAtLight: !1,
          currentWaitTime: 0,
          currentTrafficLightIndex: Z.currentTrafficLightIndex + 1,
          // Don't increment lightsEncountered - only count red lights
          currentPosition: [ue.lat, ue.lng]
        }) : (v.current = Dt.timeUntilGreen, {
          ...Z,
          distanceTraveled: N.distanceFromStart,
          routeProgress: N.distanceFromStart / st,
          elapsedTime: Z.elapsedTime + G,
          currentSpeed: 0,
          isWaitingAtLight: !0,
          currentWaitTime: 0,
          currentTrafficLightIndex: Z.currentTrafficLightIndex + 1,
          lightsEncountered: Z.lightsEncountered + 1,
          currentPosition: [ue.lat, ue.lng]
        });
      }
      if (Vt >= st) {
        g.current && (cancelAnimationFrame(g.current), g.current = null);
        const Dt = La(St, st, Tt);
        return _(Dt), {
          ...Z,
          status: "finished",
          distanceTraveled: st,
          routeProgress: 1,
          elapsedTime: Z.elapsedTime + G,
          currentSpeed: 0,
          currentPosition: [Dt.lat, Dt.lng]
        };
      }
      const $e = La(St, Vt, Tt);
      return _($e), {
        ...Z,
        distanceTraveled: Vt,
        routeProgress: Vt / st,
        elapsedTime: Z.elapsedTime + G,
        currentSpeed: V,
        currentPosition: [$e.lat, $e.lng]
      };
    }), g.current = requestAnimationFrame(ee);
  }, []), mt = Jn(() => {
    _t && (h((it) => it.status === "finished" ? it : { ...it, status: "playing" }), w.current = 0, g.current = requestAnimationFrame(ee));
  }, [_t, ee]), wt = Jn(() => {
    g.current && (cancelAnimationFrame(g.current), g.current = null), h((it) => ({ ...it, status: "paused" }));
  }, []);
  return Qt(() => () => {
    g.current && cancelAnimationFrame(g.current);
  }, []), {
    state: u,
    position: d,
    play: mt,
    pause: wt,
    reset: Mt,
    isReady: _t
  };
}
function SM({
  state: t,
  totalDistance: n,
  unlockFee: i,
  perMinuteRate: s
}) {
  return hd(() => {
    const { elapsedTime: a, totalWaitTime: u, currentWaitTime: h, isWaitingAtLight: d } = t, _ = u + (d ? h : 0), g = a / 60, v = (a - _) / 60, P = _ / 60, x = v * s, C = P * s, I = i + g * s, lt = TM(n) / 60, rt = i + lt * s, dt = P * s, _t = n / 1e3, Et = Sc.UNLOCK_FEE + _t * Sc.PER_KM, Mt = i + v * s;
    return {
      unlockFee: i,
      ridingCost: x,
      waitingCost: C,
      totalCost: I,
      idealCost: rt,
      stopRevenue: dt,
      distanceBasedCost: Et,
      motionOnlyCost: Mt
    };
  }, [t, n, i, s]);
}
function TM(t) {
  const { MAX_SPEED_MS: n, ACCELERATION_TIME: i, BRAKING_TIME: s, ACCELERATION_RATE: a, DECELERATION_RATE: u } = be, h = 0.5 * a * i * i, d = 0.5 * u * s * s, _ = h + d;
  if (t <= _) {
    const v = (a + u) / 2;
    return 2 * Math.sqrt(t / v);
  }
  const w = (t - _) / n;
  return i + w + s;
}
function Hp(t, n) {
  const i = It(n);
  Qt(function() {
    n !== i.current && t.attributionControl != null && (i.current != null && t.attributionControl.removeAttribution(i.current), n != null && t.attributionControl.addAttribution(n)), i.current = n;
  }, [
    t,
    n
  ]);
}
function PM(t, n, i) {
  n.center !== i.center && t.setLatLng(n.center), n.radius != null && n.radius !== i.radius && t.setRadius(n.radius);
}
const xM = 1;
function EM(t) {
  return Object.freeze({
    __version: xM,
    map: t
  });
}
function Bu(t, n) {
  return Object.freeze({
    ...t,
    ...n
  });
}
const Wp = Sy(null), jp = Wp.Provider;
function Ao() {
  const t = Ty(Wp);
  if (t == null)
    throw new Error("No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>");
  return t;
}
function Up(t) {
  function n(i, s) {
    const { instance: a, context: u } = t(i).current;
    return io(s, () => a), i.children == null ? null : /* @__PURE__ */ Ia.createElement(jp, {
      value: u
    }, i.children);
  }
  return /* @__PURE__ */ no(n);
}
function kM(t) {
  function n(i, s) {
    const [a, u] = Gt(!1), { instance: h } = t(i, u).current;
    io(s, () => h), Qt(function() {
      a && h.update();
    }, [
      h,
      a,
      i.children
    ]);
    const d = h._contentNode;
    return d ? /* @__PURE__ */ Py(i.children, d) : null;
  }
  return /* @__PURE__ */ no(n);
}
function LM(t) {
  function n(i, s) {
    const { instance: a } = t(i).current;
    return io(s, () => a), null;
  }
  return /* @__PURE__ */ no(n);
}
function $u(t, n) {
  const i = It();
  Qt(function() {
    return n != null && t.instance.on(n), i.current = n, function() {
      i.current != null && t.instance.off(i.current), i.current = null;
    };
  }, [
    t,
    n
  ]);
}
function Fo(t, n) {
  const i = t.pane ?? n.pane;
  return i ? {
    ...t,
    pane: i
  } : t;
}
function MM(t, n) {
  return function(s, a) {
    const u = Ao(), h = t(Fo(s, u), u);
    return Hp(u.map, s.attribution), $u(h.current, s.eventHandlers), n(h.current, u, s, a), h;
  };
}
var CM = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function IM(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Pc = { exports: {} };
/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
(function(t, n) {
  (function(i, s) {
    s(n);
  })(CM, function(i) {
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
    function w(e, r, o) {
      var c = r[1], l = r[0], f = c - l;
      return e === c && o ? e : ((e - l) % f + f) % f + l;
    }
    function v() {
      return !1;
    }
    function P(e, r) {
      if (r === !1)
        return e;
      var o = Math.pow(10, r === void 0 ? 6 : r);
      return Math.round(e * o) / o;
    }
    function x(e) {
      return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
    }
    function C(e) {
      return x(e).split(/\s+/);
    }
    function I(e, r) {
      Object.prototype.hasOwnProperty.call(e, "options") || (e.options = e.options ? u(e.options) : {});
      for (var o in r)
        e.options[o] = r[o];
      return e.options;
    }
    function W(e, r, o) {
      var c = [];
      for (var l in e)
        c.push(encodeURIComponent(o ? l.toUpperCase() : l) + "=" + encodeURIComponent(e[l]));
      return (!r || r.indexOf("?") === -1 ? "?" : "&") + c.join("&");
    }
    var lt = /\{ *([\w_ -]+) *\}/g;
    function rt(e, r) {
      return e.replace(lt, function(o, c) {
        var l = r[c];
        if (l === void 0)
          throw new Error("No value provided for variable " + o);
        return typeof l == "function" && (l = l(r)), l;
      });
    }
    var dt = Array.isArray || function(e) {
      return Object.prototype.toString.call(e) === "[object Array]";
    };
    function _t(e, r) {
      for (var o = 0; o < e.length; o++)
        if (e[o] === r)
          return o;
      return -1;
    }
    var Et = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    function Mt(e) {
      return window["webkit" + e] || window["moz" + e] || window["ms" + e];
    }
    var ee = 0;
    function mt(e) {
      var r = +/* @__PURE__ */ new Date(), o = Math.max(0, 16 - (r - ee));
      return ee = r + o, window.setTimeout(e, o);
    }
    var wt = window.requestAnimationFrame || Mt("RequestAnimationFrame") || mt, it = window.cancelAnimationFrame || Mt("CancelAnimationFrame") || Mt("CancelRequestAnimationFrame") || function(e) {
      window.clearTimeout(e);
    };
    function U(e, r, o) {
      if (o && wt === mt)
        e.call(r);
      else
        return wt.call(window, h(e, r));
    }
    function G(e) {
      e && it.call(window, e);
    }
    var St = {
      __proto__: null,
      extend: a,
      create: u,
      bind: h,
      get lastId() {
        return d;
      },
      stamp: _,
      throttle: g,
      wrapNum: w,
      falseFn: v,
      formatNum: P,
      trim: x,
      splitWords: C,
      setOptions: I,
      getParamString: W,
      template: rt,
      isArray: dt,
      indexOf: _t,
      emptyImageUrl: Et,
      requestFn: wt,
      cancelFn: it,
      requestAnimFrame: U,
      cancelAnimFrame: G
    };
    function Tt() {
    }
    Tt.extend = function(e) {
      var r = function() {
        I(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
      }, o = r.__super__ = this.prototype, c = u(o);
      c.constructor = r, r.prototype = c;
      for (var l in this)
        Object.prototype.hasOwnProperty.call(this, l) && l !== "prototype" && l !== "__super__" && (r[l] = this[l]);
      return e.statics && a(r, e.statics), e.includes && (Me(e.includes), a.apply(null, [c].concat(e.includes))), a(c, e), delete c.statics, delete c.includes, c.options && (c.options = o.options ? u(o.options) : {}, a(c.options, e.options)), c._initHooks = [], c.callInitHooks = function() {
        if (!this._initHooksCalled) {
          o.callInitHooks && o.callInitHooks.call(this), this._initHooksCalled = !0;
          for (var f = 0, p = c._initHooks.length; f < p; f++)
            c._initHooks[f].call(this);
        }
      }, r;
    }, Tt.include = function(e) {
      var r = this.prototype.options;
      return a(this.prototype, e), e.options && (this.prototype.options = r, this.mergeOptions(e.options)), this;
    }, Tt.mergeOptions = function(e) {
      return a(this.prototype.options, e), this;
    }, Tt.addInitHook = function(e) {
      var r = Array.prototype.slice.call(arguments, 1), o = typeof e == "function" ? e : function() {
        this[e].apply(this, r);
      };
      return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(o), this;
    };
    function Me(e) {
      if (!(typeof L > "u" || !L || !L.Mixin)) {
        e = dt(e) ? e : [e];
        for (var r = 0; r < e.length; r++)
          e[r] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
      }
    }
    var st = {
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
                c[l].fn = v;
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
            this._firingCount && (b.fn = v, this._events[e] = c = c.slice()), c.splice(p, 1);
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
    st.addEventListener = st.on, st.removeEventListener = st.clearAllEventListeners = st.off, st.addOneTimeEventListener = st.once, st.fireEvent = st.fire, st.hasEventListeners = st.listens;
    var Z = Tt.extend(st);
    function N(e, r, o) {
      this.x = o ? Math.round(e) : e, this.y = o ? Math.round(r) : r;
    }
    var _e = Math.trunc || function(e) {
      return e > 0 ? Math.floor(e) : Math.ceil(e);
    };
    N.prototype = {
      // @method clone(): Point
      // Returns a copy of the current point.
      clone: function() {
        return new N(this.x, this.y);
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
        return new N(this.x * e.x, this.y * e.y);
      },
      // @method unscaleBy(scale: Point): Point
      // Inverse of `scaleBy`. Divide each coordinate of the current point by
      // each coordinate of `scale`.
      unscaleBy: function(e) {
        return new N(this.x / e.x, this.y / e.y);
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
        return this.x = _e(this.x), this.y = _e(this.y), this;
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
        return "Point(" + P(this.x) + ", " + P(this.y) + ")";
      }
    };
    function $(e, r, o) {
      return e instanceof N ? e : dt(e) ? new N(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new N(e.x, e.y) : new N(e, r, o);
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
        if (e instanceof N || typeof e[0] == "number" || "x" in e)
          r = o = $(e);
        else if (e = zt(e), r = e.min, o = e.max, !r || !o)
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
        return typeof e[0] == "number" || e instanceof N ? e = $(e) : e = zt(e), e instanceof ot ? (r = e.min, o = e.max) : r = o = e, r.x >= this.min.x && o.x <= this.max.x && r.y >= this.min.y && o.y <= this.max.y;
      },
      // @method intersects(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds
      // intersect if they have at least one point in common.
      intersects: function(e) {
        e = zt(e);
        var r = this.min, o = this.max, c = e.min, l = e.max, f = l.x >= r.x && c.x <= o.x, p = l.y >= r.y && c.y <= o.y;
        return f && p;
      },
      // @method overlaps(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds
      // overlap if their intersection is an area.
      overlaps: function(e) {
        e = zt(e);
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
        return zt(
          $(r.x - c, r.y - l),
          $(o.x + c, o.y + l)
        );
      },
      // @method equals(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle is equivalent to the given bounds.
      equals: function(e) {
        return e ? (e = zt(e), this.min.equals(e.getTopLeft()) && this.max.equals(e.getBottomRight())) : !1;
      }
    };
    function zt(e, r) {
      return !e || e instanceof ot ? e : new ot(e, r);
    }
    function Pt(e, r) {
      if (e)
        for (var o = r ? [e, r] : e, c = 0, l = o.length; c < l; c++)
          this.extend(o[c]);
    }
    Pt.prototype = {
      // @method extend(latlng: LatLng): this
      // Extend the bounds to contain the given point
      // @alternative
      // @method extend(otherBounds: LatLngBounds): this
      // Extend the bounds to contain the given bounds
      extend: function(e) {
        var r = this._southWest, o = this._northEast, c, l;
        if (e instanceof at)
          c = e, l = e;
        else if (e instanceof Pt) {
          if (c = e._southWest, l = e._northEast, !c || !l)
            return this;
        } else
          return e ? this.extend(V(e) || vt(e)) : this;
        return !r && !o ? (this._southWest = new at(c.lat, c.lng), this._northEast = new at(l.lat, l.lng)) : (r.lat = Math.min(c.lat, r.lat), r.lng = Math.min(c.lng, r.lng), o.lat = Math.max(l.lat, o.lat), o.lng = Math.max(l.lng, o.lng)), this;
      },
      // @method pad(bufferRatio: Number): LatLngBounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(e) {
        var r = this._southWest, o = this._northEast, c = Math.abs(r.lat - o.lat) * e, l = Math.abs(r.lng - o.lng) * e;
        return new Pt(
          new at(r.lat - c, r.lng - l),
          new at(o.lat + c, o.lng + l)
        );
      },
      // @method getCenter(): LatLng
      // Returns the center point of the bounds.
      getCenter: function() {
        return new at(
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
        return new at(this.getNorth(), this.getWest());
      },
      // @method getSouthEast(): LatLng
      // Returns the south-east point of the bounds.
      getSouthEast: function() {
        return new at(this.getSouth(), this.getEast());
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
        typeof e[0] == "number" || e instanceof at || "lat" in e ? e = V(e) : e = vt(e);
        var r = this._southWest, o = this._northEast, c, l;
        return e instanceof Pt ? (c = e.getSouthWest(), l = e.getNorthEast()) : c = l = e, c.lat >= r.lat && l.lat <= o.lat && c.lng >= r.lng && l.lng <= o.lng;
      },
      // @method intersects(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
      intersects: function(e) {
        e = vt(e);
        var r = this._southWest, o = this._northEast, c = e.getSouthWest(), l = e.getNorthEast(), f = l.lat >= r.lat && c.lat <= o.lat, p = l.lng >= r.lng && c.lng <= o.lng;
        return f && p;
      },
      // @method overlaps(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
      overlaps: function(e) {
        e = vt(e);
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
        return e ? (e = vt(e), this._southWest.equals(e.getSouthWest(), r) && this._northEast.equals(e.getNorthEast(), r)) : !1;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this._southWest && this._northEast);
      }
    };
    function vt(e, r) {
      return e instanceof Pt ? e : new Pt(e, r);
    }
    function at(e, r, o) {
      if (isNaN(e) || isNaN(r))
        throw new Error("Invalid LatLng object: (" + e + ", " + r + ")");
      this.lat = +e, this.lng = +r, o !== void 0 && (this.alt = +o);
    }
    at.prototype = {
      // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
      // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(e, r) {
        if (!e)
          return !1;
        e = V(e);
        var o = Math.max(
          Math.abs(this.lat - e.lat),
          Math.abs(this.lng - e.lng)
        );
        return o <= (r === void 0 ? 1e-9 : r);
      },
      // @method toString(): String
      // Returns a string representation of the point (for debugging purposes).
      toString: function(e) {
        return "LatLng(" + P(this.lat, e) + ", " + P(this.lng, e) + ")";
      },
      // @method distanceTo(otherLatLng: LatLng): Number
      // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
      distanceTo: function(e) {
        return Vt.distance(this, V(e));
      },
      // @method wrap(): LatLng
      // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
      wrap: function() {
        return Vt.wrapLatLng(this);
      },
      // @method toBounds(sizeInMeters: Number): LatLngBounds
      // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
      toBounds: function(e) {
        var r = 180 * e / 40075017, o = r / Math.cos(Math.PI / 180 * this.lat);
        return vt(
          [this.lat - r, this.lng - o],
          [this.lat + r, this.lng + o]
        );
      },
      clone: function() {
        return new at(this.lat, this.lng, this.alt);
      }
    };
    function V(e, r, o) {
      return e instanceof at ? e : dt(e) && typeof e[0] != "object" ? e.length === 3 ? new at(e[0], e[1], e[2]) : e.length === 2 ? new at(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new at(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : r === void 0 ? null : new at(e, r, o);
    }
    var Ut = {
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
        return new at(o, r, c);
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring
      // that its center is within the CRS's bounds.
      // Only accepts actual `L.LatLngBounds` instances, not arrays.
      wrapLatLngBounds: function(e) {
        var r = e.getCenter(), o = this.wrapLatLng(r), c = r.lat - o.lat, l = r.lng - o.lng;
        if (c === 0 && l === 0)
          return e;
        var f = e.getSouthWest(), p = e.getNorthEast(), b = new at(f.lat - c, f.lng - l), S = new at(p.lat - c, p.lng - l);
        return new Pt(b, S);
      }
    }, Vt = a({}, Ut, {
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
    }), $e = 6378137, Dt = {
      R: $e,
      MAX_LATITUDE: 85.0511287798,
      project: function(e) {
        var r = Math.PI / 180, o = this.MAX_LATITUDE, c = Math.max(Math.min(o, e.lat), -o), l = Math.sin(c * r);
        return new N(
          this.R * e.lng * r,
          this.R * Math.log((1 + l) / (1 - l)) / 2
        );
      },
      unproject: function(e) {
        var r = 180 / Math.PI;
        return new at(
          (2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * r,
          e.x * r / this.R
        );
      },
      bounds: function() {
        var e = $e * Math.PI;
        return new ot([-e, -e], [e, e]);
      }()
    };
    function ue(e, r, o, c) {
      if (dt(e)) {
        this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3];
        return;
      }
      this._a = e, this._b = r, this._c = o, this._d = c;
    }
    ue.prototype = {
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
        return r = r || 1, new N(
          (e.x / r - this._b) / this._a,
          (e.y / r - this._d) / this._c
        );
      }
    };
    function cn(e, r, o, c) {
      return new ue(e, r, o, c);
    }
    var jr = a({}, Vt, {
      code: "EPSG:3857",
      projection: Dt,
      transformation: function() {
        var e = 0.5 / (Math.PI * Dt.R);
        return cn(e, 0.5, -e, 0.5);
      }()
    }), Jp = a({}, jr, {
      code: "EPSG:900913"
    });
    function Zu(e) {
      return document.createElementNS("http://www.w3.org/2000/svg", e);
    }
    function Hu(e, r) {
      var o = "", c, l, f, p, b, S;
      for (c = 0, f = e.length; c < f; c++) {
        for (b = e[c], l = 0, p = b.length; l < p; l++)
          S = b[l], o += (l ? "L" : "M") + S.x + " " + S.y;
        o += r ? F.svg ? "z" : "x" : "";
      }
      return o || "M0 0";
    }
    var $o = document.documentElement.style, Ur = "ActiveXObject" in window, Yp = Ur && !document.addEventListener, Wu = "msLaunchUri" in navigator && !("documentMode" in document), zo = Ce("webkit"), ju = Ce("android"), Uu = Ce("android 2") || Ce("android 3"), Xp = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), Qp = ju && Ce("Google") && Xp < 537 && !("AudioNode" in window), Do = !!window.opera, Vu = !Wu && Ce("chrome"), qu = Ce("gecko") && !zo && !Do && !Ur, tg = !Vu && Ce("safari"), Gu = Ce("phantom"), Ku = "OTransition" in $o, eg = navigator.platform.indexOf("Win") === 0, Ju = Ur && "transition" in $o, Zo = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Uu, Yu = "MozPerspective" in $o, ng = !window.L_DISABLE_3D && (Ju || Zo || Yu) && !Ku && !Gu, Ii = typeof orientation < "u" || Ce("mobile"), ig = Ii && zo, rg = Ii && Zo, Xu = !window.PointerEvent && window.MSPointerEvent, Qu = !!(window.PointerEvent || Xu), tl = "ontouchstart" in window || !!window.TouchEvent, sg = !window.L_NO_TOUCH && (tl || Qu), og = Ii && Do, ag = Ii && qu, cg = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, ug = function() {
      var e = !1;
      try {
        var r = Object.defineProperty({}, "passive", {
          get: function() {
            e = !0;
          }
        });
        window.addEventListener("testPassiveEventSupport", v, r), window.removeEventListener("testPassiveEventSupport", v, r);
      } catch {
      }
      return e;
    }(), lg = function() {
      return !!document.createElement("canvas").getContext;
    }(), Ho = !!(document.createElementNS && Zu("svg").createSVGRect), hg = !!Ho && function() {
      var e = document.createElement("div");
      return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
    }(), fg = !Ho && function() {
      try {
        var e = document.createElement("div");
        e.innerHTML = '<v:shape adj="1"/>';
        var r = e.firstChild;
        return r.style.behavior = "url(#default#VML)", r && typeof r.adj == "object";
      } catch {
        return !1;
      }
    }(), dg = navigator.platform.indexOf("Mac") === 0, _g = navigator.platform.indexOf("Linux") === 0;
    function Ce(e) {
      return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
    }
    var F = {
      ie: Ur,
      ielt9: Yp,
      edge: Wu,
      webkit: zo,
      android: ju,
      android23: Uu,
      androidStock: Qp,
      opera: Do,
      chrome: Vu,
      gecko: qu,
      safari: tg,
      phantom: Gu,
      opera12: Ku,
      win: eg,
      ie3d: Ju,
      webkit3d: Zo,
      gecko3d: Yu,
      any3d: ng,
      mobile: Ii,
      mobileWebkit: ig,
      mobileWebkit3d: rg,
      msPointer: Xu,
      pointer: Qu,
      touch: sg,
      touchNative: tl,
      mobileOpera: og,
      mobileGecko: ag,
      retina: cg,
      passiveEvents: ug,
      canvas: lg,
      svg: Ho,
      vml: fg,
      inlineSvg: hg,
      mac: dg,
      linux: _g
    }, el = F.msPointer ? "MSPointerDown" : "pointerdown", nl = F.msPointer ? "MSPointerMove" : "pointermove", il = F.msPointer ? "MSPointerUp" : "pointerup", rl = F.msPointer ? "MSPointerCancel" : "pointercancel", Wo = {
      touchstart: el,
      touchmove: nl,
      touchend: il,
      touchcancel: rl
    }, sl = {
      touchstart: bg,
      touchmove: Vr,
      touchend: Vr,
      touchcancel: Vr
    }, Bn = {}, ol = !1;
    function mg(e, r, o) {
      return r === "touchstart" && vg(), sl[r] ? (o = sl[r].bind(this, o), e.addEventListener(Wo[r], o, !1), o) : (console.warn("wrong event specified:", r), v);
    }
    function pg(e, r, o) {
      if (!Wo[r]) {
        console.warn("wrong event specified:", r);
        return;
      }
      e.removeEventListener(Wo[r], o, !1);
    }
    function gg(e) {
      Bn[e.pointerId] = e;
    }
    function yg(e) {
      Bn[e.pointerId] && (Bn[e.pointerId] = e);
    }
    function al(e) {
      delete Bn[e.pointerId];
    }
    function vg() {
      ol || (document.addEventListener(el, gg, !0), document.addEventListener(nl, yg, !0), document.addEventListener(il, al, !0), document.addEventListener(rl, al, !0), ol = !0);
    }
    function Vr(e, r) {
      if (r.pointerType !== (r.MSPOINTER_TYPE_MOUSE || "mouse")) {
        r.touches = [];
        for (var o in Bn)
          r.touches.push(Bn[o]);
        r.changedTouches = [r], e(r);
      }
    }
    function bg(e, r) {
      r.MSPOINTER_TYPE_TOUCH && r.pointerType === r.MSPOINTER_TYPE_TOUCH && Jt(r), Vr(e, r);
    }
    function wg(e) {
      var r = {}, o, c;
      for (c in e)
        o = e[c], r[c] = o && o.bind ? o.bind(e) : o;
      return e = r, r.type = "dblclick", r.detail = 2, r.isTrusted = !1, r._simulated = !0, r;
    }
    var Sg = 200;
    function Tg(e, r) {
      e.addEventListener("dblclick", r);
      var o = 0, c;
      function l(f) {
        if (f.detail !== 1) {
          c = f.detail;
          return;
        }
        if (!(f.pointerType === "mouse" || f.sourceCapabilities && !f.sourceCapabilities.firesTouchEvents)) {
          var p = fl(f);
          if (!(p.some(function(S) {
            return S instanceof HTMLLabelElement && S.attributes.for;
          }) && !p.some(function(S) {
            return S instanceof HTMLInputElement || S instanceof HTMLSelectElement;
          }))) {
            var b = Date.now();
            b - o <= Sg ? (c++, c === 2 && r(wg(f))) : c = 1, o = b;
          }
        }
      }
      return e.addEventListener("click", l), {
        dblclick: r,
        simDblclick: l
      };
    }
    function Pg(e, r) {
      e.removeEventListener("dblclick", r.dblclick), e.removeEventListener("click", r.simDblclick);
    }
    var jo = Kr(
      ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
    ), Oi = Kr(
      ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
    ), cl = Oi === "webkitTransition" || Oi === "OTransition" ? Oi + "End" : "transitionend";
    function ul(e) {
      return typeof e == "string" ? document.getElementById(e) : e;
    }
    function Ri(e, r) {
      var o = e.style[r] || e.currentStyle && e.currentStyle[r];
      if ((!o || o === "auto") && document.defaultView) {
        var c = document.defaultView.getComputedStyle(e, null);
        o = c ? c[r] : null;
      }
      return o === "auto" ? null : o;
    }
    function ht(e, r, o) {
      var c = document.createElement(e);
      return c.className = r || "", o && o.appendChild(c), c;
    }
    function xt(e) {
      var r = e.parentNode;
      r && r.removeChild(e);
    }
    function qr(e) {
      for (; e.firstChild; )
        e.removeChild(e.firstChild);
    }
    function $n(e) {
      var r = e.parentNode;
      r && r.lastChild !== e && r.appendChild(e);
    }
    function zn(e) {
      var r = e.parentNode;
      r && r.firstChild !== e && r.insertBefore(e, r.firstChild);
    }
    function Uo(e, r) {
      if (e.classList !== void 0)
        return e.classList.contains(r);
      var o = Gr(e);
      return o.length > 0 && new RegExp("(^|\\s)" + r + "(\\s|$)").test(o);
    }
    function K(e, r) {
      if (e.classList !== void 0)
        for (var o = C(r), c = 0, l = o.length; c < l; c++)
          e.classList.add(o[c]);
      else if (!Uo(e, r)) {
        var f = Gr(e);
        Vo(e, (f ? f + " " : "") + r);
      }
    }
    function Ct(e, r) {
      e.classList !== void 0 ? e.classList.remove(r) : Vo(e, x((" " + Gr(e) + " ").replace(" " + r + " ", " ")));
    }
    function Vo(e, r) {
      e.className.baseVal === void 0 ? e.className = r : e.className.baseVal = r;
    }
    function Gr(e) {
      return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
    }
    function me(e, r) {
      "opacity" in e.style ? e.style.opacity = r : "filter" in e.style && xg(e, r);
    }
    function xg(e, r) {
      var o = !1, c = "DXImageTransform.Microsoft.Alpha";
      try {
        o = e.filters.item(c);
      } catch {
        if (r === 1)
          return;
      }
      r = Math.round(r * 100), o ? (o.Enabled = r !== 100, o.Opacity = r) : e.style.filter += " progid:" + c + "(opacity=" + r + ")";
    }
    function Kr(e) {
      for (var r = document.documentElement.style, o = 0; o < e.length; o++)
        if (e[o] in r)
          return e[o];
      return !1;
    }
    function un(e, r, o) {
      var c = r || new N(0, 0);
      e.style[jo] = (F.ie3d ? "translate(" + c.x + "px," + c.y + "px)" : "translate3d(" + c.x + "px," + c.y + "px,0)") + (o ? " scale(" + o + ")" : "");
    }
    function Rt(e, r) {
      e._leaflet_pos = r, F.any3d ? un(e, r) : (e.style.left = r.x + "px", e.style.top = r.y + "px");
    }
    function ln(e) {
      return e._leaflet_pos || new N(0, 0);
    }
    var Ni, Ai, qo;
    if ("onselectstart" in document)
      Ni = function() {
        q(window, "selectstart", Jt);
      }, Ai = function() {
        pt(window, "selectstart", Jt);
      };
    else {
      var Fi = Kr(
        ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
      );
      Ni = function() {
        if (Fi) {
          var e = document.documentElement.style;
          qo = e[Fi], e[Fi] = "none";
        }
      }, Ai = function() {
        Fi && (document.documentElement.style[Fi] = qo, qo = void 0);
      };
    }
    function Go() {
      q(window, "dragstart", Jt);
    }
    function Ko() {
      pt(window, "dragstart", Jt);
    }
    var Jr, Jo;
    function Yo(e) {
      for (; e.tabIndex === -1; )
        e = e.parentNode;
      e.style && (Yr(), Jr = e, Jo = e.style.outlineStyle, e.style.outlineStyle = "none", q(window, "keydown", Yr));
    }
    function Yr() {
      Jr && (Jr.style.outlineStyle = Jo, Jr = void 0, Jo = void 0, pt(window, "keydown", Yr));
    }
    function ll(e) {
      do
        e = e.parentNode;
      while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
      return e;
    }
    function Xo(e) {
      var r = e.getBoundingClientRect();
      return {
        x: r.width / e.offsetWidth || 1,
        y: r.height / e.offsetHeight || 1,
        boundingClientRect: r
      };
    }
    var Eg = {
      __proto__: null,
      TRANSFORM: jo,
      TRANSITION: Oi,
      TRANSITION_END: cl,
      get: ul,
      getStyle: Ri,
      create: ht,
      remove: xt,
      empty: qr,
      toFront: $n,
      toBack: zn,
      hasClass: Uo,
      addClass: K,
      removeClass: Ct,
      setClass: Vo,
      getClass: Gr,
      setOpacity: me,
      testProp: Kr,
      setTransform: un,
      setPosition: Rt,
      getPosition: ln,
      get disableTextSelection() {
        return Ni;
      },
      get enableTextSelection() {
        return Ai;
      },
      disableImageDrag: Go,
      enableImageDrag: Ko,
      preventOutline: Yo,
      restoreOutline: Yr,
      getSizedParentNode: ll,
      getScale: Xo
    };
    function q(e, r, o, c) {
      if (r && typeof r == "object")
        for (var l in r)
          ta(e, l, r[l], o);
      else {
        r = C(r);
        for (var f = 0, p = r.length; f < p; f++)
          ta(e, r[f], o, c);
      }
      return this;
    }
    var Ie = "_leaflet_events";
    function pt(e, r, o, c) {
      if (arguments.length === 1)
        hl(e), delete e[Ie];
      else if (r && typeof r == "object")
        for (var l in r)
          ea(e, l, r[l], o);
      else if (r = C(r), arguments.length === 2)
        hl(e, function(b) {
          return _t(r, b) !== -1;
        });
      else
        for (var f = 0, p = r.length; f < p; f++)
          ea(e, r[f], o, c);
      return this;
    }
    function hl(e, r) {
      for (var o in e[Ie]) {
        var c = o.split(/\d/)[0];
        (!r || r(c)) && ea(e, c, null, null, o);
      }
    }
    var Qo = {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      wheel: !("onwheel" in window) && "mousewheel"
    };
    function ta(e, r, o, c) {
      var l = r + _(o) + (c ? "_" + _(c) : "");
      if (e[Ie] && e[Ie][l])
        return this;
      var f = function(b) {
        return o.call(c || e, b || window.event);
      }, p = f;
      !F.touchNative && F.pointer && r.indexOf("touch") === 0 ? f = mg(e, r, f) : F.touch && r === "dblclick" ? f = Tg(e, f) : "addEventListener" in e ? r === "touchstart" || r === "touchmove" || r === "wheel" || r === "mousewheel" ? e.addEventListener(Qo[r] || r, f, F.passiveEvents ? { passive: !1 } : !1) : r === "mouseenter" || r === "mouseleave" ? (f = function(b) {
        b = b || window.event, ia(e, b) && p(b);
      }, e.addEventListener(Qo[r], f, !1)) : e.addEventListener(r, p, !1) : e.attachEvent("on" + r, f), e[Ie] = e[Ie] || {}, e[Ie][l] = f;
    }
    function ea(e, r, o, c, l) {
      l = l || r + _(o) + (c ? "_" + _(c) : "");
      var f = e[Ie] && e[Ie][l];
      if (!f)
        return this;
      !F.touchNative && F.pointer && r.indexOf("touch") === 0 ? pg(e, r, f) : F.touch && r === "dblclick" ? Pg(e, f) : "removeEventListener" in e ? e.removeEventListener(Qo[r] || r, f, !1) : e.detachEvent("on" + r, f), e[Ie][l] = null;
    }
    function hn(e) {
      return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
    }
    function na(e) {
      return ta(e, "wheel", hn), this;
    }
    function Bi(e) {
      return q(e, "mousedown touchstart dblclick contextmenu", hn), e._leaflet_disable_click = !0, this;
    }
    function Jt(e) {
      return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
    }
    function fn(e) {
      return Jt(e), hn(e), this;
    }
    function fl(e) {
      if (e.composedPath)
        return e.composedPath();
      for (var r = [], o = e.target; o; )
        r.push(o), o = o.parentNode;
      return r;
    }
    function dl(e, r) {
      if (!r)
        return new N(e.clientX, e.clientY);
      var o = Xo(r), c = o.boundingClientRect;
      return new N(
        // offset.left/top values are in page scale (like clientX/Y),
        // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
        (e.clientX - c.left) / o.x - r.clientLeft,
        (e.clientY - c.top) / o.y - r.clientTop
      );
    }
    var kg = F.linux && F.chrome ? window.devicePixelRatio : F.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
    function _l(e) {
      return F.edge ? e.wheelDeltaY / 2 : (
        // Don't trust window-geometry-based delta
        e.deltaY && e.deltaMode === 0 ? -e.deltaY / kg : (
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
    function ia(e, r) {
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
    var Lg = {
      __proto__: null,
      on: q,
      off: pt,
      stopPropagation: hn,
      disableScrollPropagation: na,
      disableClickPropagation: Bi,
      preventDefault: Jt,
      stop: fn,
      getPropagationPath: fl,
      getMousePosition: dl,
      getWheelDelta: _l,
      isExternalTarget: ia,
      addListener: q,
      removeListener: pt
    }, ml = Z.extend({
      // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
      // Run an animation of a given element to a new position, optionally setting
      // duration in seconds (`0.25` by default) and easing linearity factor (3rd
      // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
      // `0.5` by default).
      run: function(e, r, o, c) {
        this.stop(), this._el = e, this._inProgress = !0, this._duration = o || 0.25, this._easeOutPower = 1 / Math.max(c || 0.5, 0.2), this._startPos = ln(e), this._offset = r.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
      },
      // @method stop()
      // Stops the animation (if currently running).
      stop: function() {
        this._inProgress && (this._step(!0), this._complete());
      },
      _animate: function() {
        this._animId = U(this._animate, this), this._step();
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
        G(this._animId), this._inProgress = !1, this.fire("end");
      },
      _easeOut: function(e) {
        return 1 - Math.pow(1 - e, this._easeOutPower);
      }
    }), ct = Z.extend({
      options: {
        // @section Map State Options
        // @option crs: CRS = L.CRS.EPSG3857
        // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
        // sure what it means.
        crs: jr,
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
        r = I(this, r), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = h(this._onResize, this), this._initEvents(), r.maxBounds && this.setMaxBounds(r.maxBounds), r.zoom !== void 0 && (this._zoom = this._limitZoom(r.zoom)), r.center && r.zoom !== void 0 && this.setView(V(r.center), r.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = Oi && F.any3d && !F.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), q(this._proxy, cl, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
      },
      // @section Methods for modifying map state
      // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) with the given
      // animation options.
      setView: function(e, r, o) {
        if (r = r === void 0 ? this._zoom : this._limitZoom(r), e = this._limitCenter(V(e), r, this.options.maxBounds), o = o || {}, this._stop(), this._loaded && !o.reset && o !== !0) {
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
        return e = e || (F.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + e, r);
      },
      // @method zoomOut(delta?: Number, options?: Zoom options): this
      // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomOut: function(e, r) {
        return e = e || (F.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - e, r);
      },
      // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified geographical point on the map
      // stationary (e.g. used internally for scroll zoom and double-click zoom).
      // @alternative
      // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
      setZoomAround: function(e, r, o) {
        var c = this.getZoomScale(r), l = this.getSize().divideBy(2), f = e instanceof N ? e : this.latLngToContainerPoint(e), p = f.subtract(l).multiplyBy(1 - 1 / c), b = this.containerPointToLatLng(l.add(p));
        return this.setView(b, r, { zoom: o });
      },
      _getBoundsCenterZoom: function(e, r) {
        r = r || {}, e = e.getBounds ? e.getBounds() : vt(e);
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
        if (e = vt(e), !e.isValid())
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
        if (this._panAnim || (this._panAnim = new ml(), this._panAnim.on({
          step: this._onPanTransitionStep,
          end: this._onPanTransitionEnd
        }, this)), r.noMoveStart || this.fire("movestart"), r.animate !== !1) {
          K(this._mapPane, "leaflet-pan-anim");
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
        if (o = o || {}, o.animate === !1 || !F.any3d)
          return this.setView(e, r, o);
        this._stop();
        var c = this.project(this.getCenter()), l = this.project(e), f = this.getSize(), p = this._zoom;
        e = V(e), r = r === void 0 ? p : r;
        var b = Math.max(f.x, f.y), S = b * this.getZoomScale(p, r), k = l.distanceTo(c) || 1, O = 1.42, D = O * O;
        function et(Nt) {
          var us = Nt ? -1 : 1, py = Nt ? S : b, gy = S * S - b * b + us * D * D * k * k, yy = 2 * py * D * k, _a = gy / yy, Kl = Math.sqrt(_a * _a + 1) - _a, vy = Kl < 1e-9 ? -18 : Math.log(Kl);
          return vy;
        }
        function Yt(Nt) {
          return (Math.exp(Nt) - Math.exp(-Nt)) / 2;
        }
        function qt(Nt) {
          return (Math.exp(Nt) + Math.exp(-Nt)) / 2;
        }
        function ge(Nt) {
          return Yt(Nt) / qt(Nt);
        }
        var ne = et(0);
        function Un(Nt) {
          return b * (qt(ne) / qt(ne + O * Nt));
        }
        function fy(Nt) {
          return b * (qt(ne) * ge(ne + O * Nt) - Yt(ne)) / D;
        }
        function dy(Nt) {
          return 1 - Math.pow(1 - Nt, 1.5);
        }
        var _y = Date.now(), ql = (et(1) - ne) / O, my = o.duration ? 1e3 * o.duration : 1e3 * ql * 0.8;
        function Gl() {
          var Nt = (Date.now() - _y) / my, us = dy(Nt) * ql;
          Nt <= 1 ? (this._flyToFrame = U(Gl, this), this._move(
            this.unproject(c.add(l.subtract(c).multiplyBy(fy(us) / k)), p),
            this.getScaleZoom(b / Un(us), p),
            { flyTo: !0 }
          )) : this._move(e, r)._moveEnd(!0);
        }
        return this._moveStart(!0, o.noMoveStart), Gl.call(this), this;
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
        return e = vt(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
        var o = this.getCenter(), c = this._limitCenter(o, this._zoom, vt(e));
        return o.equals(c) || this.panTo(c, r), this._enforcingBounds = !1, this;
      },
      // @method panInside(latlng: LatLng, options?: padding options): this
      // Pans the map the minimum amount to make the `latlng` visible. Use
      // padding options to fit the display to more restricted bounds.
      // If `latlng` is already within the (optionally padded) display bounds,
      // the map will not be panned.
      panInside: function(e, r) {
        r = r || {};
        var o = $(r.paddingTopLeft || r.padding || [0, 0]), c = $(r.paddingBottomRight || r.padding || [0, 0]), l = this.project(this.getCenter()), f = this.project(e), p = this.getPixelBounds(), b = zt([p.min.add(o), p.max.subtract(c)]), S = b.getSize();
        if (!b.contains(f)) {
          this._enforcingBounds = !0;
          var k = f.subtract(b.getCenter()), O = b.extend(f).getSize().subtract(S);
          l.x += k.x < 0 ? -O.x : O.x, l.y += k.y < 0 ? -O.y : O.y, this.panTo(this.unproject(l), r), this._enforcingBounds = !1;
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
          var r = e.coords.latitude, o = e.coords.longitude, c = new at(r, o), l = c.toBounds(e.coords.accuracy * 2), f = this._locateOptions;
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
        this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), xt(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (G(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
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
        var o = "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), c = ht("div", o, r || this._mapPane);
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
        return new Pt(r, o);
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
        e = vt(e), o = $(o || [0, 0]);
        var c = this.getZoom() || 0, l = this.getMinZoom(), f = this.getMaxZoom(), p = e.getNorthWest(), b = e.getSouthEast(), S = this.getSize().subtract(o), k = zt(this.project(b, c), this.project(p, c)).getSize(), O = F.any3d ? this.options.zoomSnap : 1, D = S.x / k.x, et = S.y / k.y, Yt = r ? Math.max(D, et) : Math.min(D, et);
        return c = this.getScaleZoom(Yt, c), O && (c = Math.round(c / (O / 100)) * (O / 100), c = r ? Math.ceil(c / O) * O : Math.floor(c / O) * O), Math.max(l, Math.min(f, c));
      },
      // @method getSize(): Point
      // Returns the current size of the map container (in pixels).
      getSize: function() {
        return (!this._size || this._sizeChanged) && (this._size = new N(
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
        return r = r === void 0 ? this._zoom : r, this.options.crs.latLngToPoint(V(e), r);
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
        var r = this.project(V(e))._round();
        return r._subtract(this.getPixelOrigin());
      },
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
      // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
      // CRS's bounds.
      // By default this means longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees.
      wrapLatLng: function(e) {
        return this.options.crs.wrapLatLng(V(e));
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring that
      // its center is within the CRS's bounds.
      // By default this means the center longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees, and the majority of the bounds
      // overlaps the CRS's bounds.
      wrapLatLngBounds: function(e) {
        return this.options.crs.wrapLatLngBounds(vt(e));
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates according to
      // the map's CRS. By default this measures distance in meters.
      distance: function(e, r) {
        return this.options.crs.distance(V(e), V(r));
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
        return this.layerPointToContainerPoint(this.latLngToLayerPoint(V(e)));
      },
      // @method mouseEventToContainerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to the
      // map container where the event took place.
      mouseEventToContainerPoint: function(e) {
        return dl(e, this._container);
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
        var r = this._container = ul(e);
        if (r) {
          if (r._leaflet_id)
            throw new Error("Map container is already initialized.");
        } else throw new Error("Map container not found.");
        q(r, "scroll", this._onScroll, this), this._containerId = _(r);
      },
      _initLayout: function() {
        var e = this._container;
        this._fadeAnimated = this.options.fadeAnimation && F.any3d, K(e, "leaflet-container" + (F.touch ? " leaflet-touch" : "") + (F.retina ? " leaflet-retina" : "") + (F.ielt9 ? " leaflet-oldie" : "") + (F.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
        var r = Ri(e, "position");
        r !== "absolute" && r !== "relative" && r !== "fixed" && r !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
      },
      _initPanes: function() {
        var e = this._panes = {};
        this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Rt(this._mapPane, new N(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (K(e.markerPane, "leaflet-zoom-hide"), K(e.shadowPane, "leaflet-zoom-hide"));
      },
      // private methods that modify map state
      // @section Map state change events
      _resetView: function(e, r, o) {
        Rt(this._mapPane, new N(0, 0));
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
        var r = e ? pt : q;
        r(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && r(window, "resize", this._onResize, this), F.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
      },
      _onResize: function() {
        G(this._resizeRequest), this._resizeRequest = U(
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
          if (c && c.listens(r, !0) && (l && !ia(f, e) || (o.push(c), l)) || f === this._container)
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
          o === "mousedown" && Yo(r), this._fireDOMEvent(e, o);
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
            if (l[p].fire(r, S, !0), S.originalEvent._stopped || l[p].options.bubblingMouseEvents === !1 && _t(this._mouseEvents, r) !== -1)
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
        return ln(this._mapPane) || new N(0, 0);
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
        return zt([
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
        var c = zt(
          this.project(r.getNorthEast(), o),
          this.project(r.getSouthWest(), o)
        ), l = c.min.subtract(e.min), f = c.max.subtract(e.max), p = this._rebound(l.x, -f.x), b = this._rebound(l.y, -f.y);
        return new N(p, b);
      },
      _rebound: function(e, r) {
        return e + r > 0 ? Math.round(e - r) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(r));
      },
      _limitZoom: function(e) {
        var r = this.getMinZoom(), o = this.getMaxZoom(), c = F.any3d ? this.options.zoomSnap : 1;
        return c && (e = Math.round(e / c) * c), Math.max(r, Math.min(o, e));
      },
      _onPanTransitionStep: function() {
        this.fire("move");
      },
      _onPanTransitionEnd: function() {
        Ct(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
      },
      _tryAnimatedPan: function(e, r) {
        var o = this._getCenterOffset(e)._trunc();
        return (r && r.animate) !== !0 && !this.getSize().contains(o) ? !1 : (this.panBy(o, r), !0);
      },
      _createAnimProxy: function() {
        var e = this._proxy = ht("div", "leaflet-proxy leaflet-zoom-animated");
        this._panes.mapPane.appendChild(e), this.on("zoomanim", function(r) {
          var o = jo, c = this._proxy.style[o];
          un(this._proxy, this.project(r.center, r.zoom), this.getZoomScale(r.zoom, 1)), c === this._proxy.style[o] && this._animatingZoom && this._onZoomTransitionEnd();
        }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
      },
      _destroyAnimProxy: function() {
        xt(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
      },
      _animMoveEnd: function() {
        var e = this.getCenter(), r = this.getZoom();
        un(this._proxy, this.project(e, r), this.getZoomScale(r, 1));
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
        return o.animate !== !0 && !this.getSize().contains(l) ? !1 : (U(function() {
          this._moveStart(!0, o.noMoveStart || !1)._animateZoom(e, r, !0);
        }, this), !0);
      },
      _animateZoom: function(e, r, o, c) {
        this._mapPane && (o && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = r, K(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
          center: e,
          zoom: r,
          noUpdate: c
        }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(h(this._onZoomTransitionEnd, this), 250));
      },
      _onZoomTransitionEnd: function() {
        this._animatingZoom && (this._mapPane && Ct(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
      }
    });
    function Mg(e, r) {
      return new ct(e, r);
    }
    var Te = Tt.extend({
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
        return K(r, "leaflet-control"), o.indexOf("bottom") !== -1 ? c.insertBefore(r, c.firstChild) : c.appendChild(r), this._map.on("unload", this.remove, this), this;
      },
      // @method remove: this
      // Removes the control from the map it is currently active on.
      remove: function() {
        return this._map ? (xt(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
      },
      _refocusOnMap: function(e) {
        this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus();
      }
    }), $i = function(e) {
      return new Te(e);
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
        var e = this._controlCorners = {}, r = "leaflet-", o = this._controlContainer = ht("div", r + "control-container", this._container);
        function c(l, f) {
          var p = r + l + " " + r + f;
          e[l + f] = ht("div", p, o);
        }
        c("top", "left"), c("top", "right"), c("bottom", "left"), c("bottom", "right");
      },
      _clearControlPos: function() {
        for (var e in this._controlCorners)
          xt(this._controlCorners[e]);
        xt(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
      }
    });
    var pl = Te.extend({
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
        return Te.prototype.addTo.call(this, e), this._expandIfNotCollapsed();
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
        K(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
        var e = this._map.getSize().y - (this._container.offsetTop + 50);
        return e < this._section.clientHeight ? (K(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : Ct(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
      },
      // @method collapse(): this
      // Collapse the control container if expanded.
      collapse: function() {
        return Ct(this._container, "leaflet-control-layers-expanded"), this;
      },
      _initLayout: function() {
        var e = "leaflet-control-layers", r = this._container = ht("div", e), o = this.options.collapsed;
        r.setAttribute("aria-haspopup", !0), Bi(r), na(r);
        var c = this._section = ht("section", e + "-list");
        o && (this._map.on("click", this.collapse, this), q(r, {
          mouseenter: this._expandSafely,
          mouseleave: this.collapse
        }, this));
        var l = this._layersLink = ht("a", e + "-toggle", r);
        l.href = "#", l.title = "Layers", l.setAttribute("role", "button"), q(l, {
          keydown: function(f) {
            f.keyCode === 13 && this._expandSafely();
          },
          // Certain screen readers intercept the key event and instead send a click event
          click: function(f) {
            Jt(f), this._expandSafely();
          }
        }, this), o || this.expand(), this._baseLayersList = ht("div", e + "-base", c), this._separator = ht("div", e + "-separator", c), this._overlaysList = ht("div", e + "-overlays", c), r.appendChild(c);
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
        qr(this._baseLayersList), qr(this._overlaysList), this._layerControlInputs = [];
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
        e.overlay ? (c = document.createElement("input"), c.type = "checkbox", c.className = "leaflet-control-layers-selector", c.defaultChecked = o) : c = this._createRadioElement("leaflet-base-layers_" + _(this), o), this._layerControlInputs.push(c), c.layerId = _(e.layer), q(c, "click", this._onInputClick, this);
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
          pt(e, "click", Jt), r._preventClick = !1;
        });
      }
    }), Cg = function(e, r, o) {
      return new pl(e, r, o);
    }, ra = Te.extend({
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
        var r = "leaflet-control-zoom", o = ht("div", r + " leaflet-bar"), c = this.options;
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
        var f = ht("a", o, c);
        return f.innerHTML = e, f.href = "#", f.title = r, f.setAttribute("role", "button"), f.setAttribute("aria-label", r), Bi(f), q(f, "click", fn), q(f, "click", l, this), q(f, "click", this._refocusOnMap, this), f;
      },
      _updateDisabled: function() {
        var e = this._map, r = "leaflet-disabled";
        Ct(this._zoomInButton, r), Ct(this._zoomOutButton, r), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (K(this._zoomOutButton, r), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (K(this._zoomInButton, r), this._zoomInButton.setAttribute("aria-disabled", "true"));
      }
    });
    ct.mergeOptions({
      zoomControl: !0
    }), ct.addInitHook(function() {
      this.options.zoomControl && (this.zoomControl = new ra(), this.addControl(this.zoomControl));
    });
    var Ig = function(e) {
      return new ra(e);
    }, gl = Te.extend({
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
        var r = "leaflet-control-scale", o = ht("div", r), c = this.options;
        return this._addScales(c, r + "-line", o), e.on(c.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), o;
      },
      onRemove: function(e) {
        e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
      },
      _addScales: function(e, r, o) {
        e.metric && (this._mScale = ht("div", r, o)), e.imperial && (this._iScale = ht("div", r, o));
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
    }), Og = function(e) {
      return new gl(e);
    }, Rg = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', sa = Te.extend({
      // @section
      // @aka Control.Attribution options
      options: {
        position: "bottomright",
        // @option prefix: String|false = 'Leaflet'
        // The HTML text shown before the attributions. Pass `false` to disable.
        prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (F.inlineSvg ? Rg + " " : "") + "Leaflet</a>"
      },
      initialize: function(e) {
        I(this, e), this._attributions = {};
      },
      onAdd: function(e) {
        e.attributionControl = this, this._container = ht("div", "leaflet-control-attribution"), Bi(this._container);
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
      this.options.attributionControl && new sa().addTo(this);
    });
    var Ng = function(e) {
      return new sa(e);
    };
    Te.Layers = pl, Te.Zoom = ra, Te.Scale = gl, Te.Attribution = sa, $i.layers = Cg, $i.zoom = Ig, $i.scale = Og, $i.attribution = Ng;
    var Oe = Tt.extend({
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
    Oe.addTo = function(e, r) {
      return e.addHandler(r, this), this;
    };
    var Ag = { Events: st }, yl = F.touch ? "touchstart mousedown" : "mousedown", Qe = Z.extend({
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
        this._enabled || (q(this._dragStartTarget, yl, this._onDown, this), this._enabled = !0);
      },
      // @method disable()
      // Disables the dragging ability
      disable: function() {
        this._enabled && (Qe._dragging === this && this.finishDrag(!0), pt(this._dragStartTarget, yl, this._onDown, this), this._enabled = !1, this._moved = !1);
      },
      _onDown: function(e) {
        if (this._enabled && (this._moved = !1, !Uo(this._element, "leaflet-zoom-anim"))) {
          if (e.touches && e.touches.length !== 1) {
            Qe._dragging === this && this.finishDrag();
            return;
          }
          if (!(Qe._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (Qe._dragging = this, this._preventOutline && Yo(this._element), Go(), Ni(), !this._moving)) {
            this.fire("down");
            var r = e.touches ? e.touches[0] : e, o = ll(this._element);
            this._startPoint = new N(r.clientX, r.clientY), this._startPos = ln(this._element), this._parentScale = Xo(o);
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
          var r = e.touches && e.touches.length === 1 ? e.touches[0] : e, o = new N(r.clientX, r.clientY)._subtract(this._startPoint);
          !o.x && !o.y || Math.abs(o.x) + Math.abs(o.y) < this.options.clickTolerance || (o.x /= this._parentScale.x, o.y /= this._parentScale.y, Jt(e), this._moved || (this.fire("dragstart"), this._moved = !0, K(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), K(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(o), this._moving = !0, this._lastEvent = e, this._updatePosition());
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
        Ct(document.body, "leaflet-dragging"), this._lastTarget && (Ct(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), pt(document, "mousemove touchmove", this._onMove, this), pt(document, "mouseup touchend touchcancel", this._onUp, this), Ko(), Ai();
        var r = this._moved && this._moving;
        this._moving = !1, Qe._dragging = !1, r && this.fire("dragend", {
          noInertia: e,
          distance: this._newPos.distanceTo(this._startPos)
        });
      }
    });
    function vl(e, r, o) {
      var c, l = [1, 4, 2, 8], f, p, b, S, k, O, D, et;
      for (f = 0, O = e.length; f < O; f++)
        e[f]._code = dn(e[f], r);
      for (b = 0; b < 4; b++) {
        for (D = l[b], c = [], f = 0, O = e.length, p = O - 1; f < O; p = f++)
          S = e[f], k = e[p], S._code & D ? k._code & D || (et = Xr(k, S, D, r, o), et._code = dn(et, r), c.push(et)) : (k._code & D && (et = Xr(k, S, D, r, o), et._code = dn(et, r), c.push(et)), c.push(S));
        e = c;
      }
      return e;
    }
    function bl(e, r) {
      var o, c, l, f, p, b, S, k, O;
      if (!e || e.length === 0)
        throw new Error("latlngs not passed");
      pe(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
      var D = V([0, 0]), et = vt(e), Yt = et.getNorthWest().distanceTo(et.getSouthWest()) * et.getNorthEast().distanceTo(et.getNorthWest());
      Yt < 1700 && (D = oa(e));
      var qt = e.length, ge = [];
      for (o = 0; o < qt; o++) {
        var ne = V(e[o]);
        ge.push(r.project(V([ne.lat - D.lat, ne.lng - D.lng])));
      }
      for (b = S = k = 0, o = 0, c = qt - 1; o < qt; c = o++)
        l = ge[o], f = ge[c], p = l.y * f.x - f.y * l.x, S += (l.x + f.x) * p, k += (l.y + f.y) * p, b += p * 3;
      b === 0 ? O = ge[0] : O = [S / b, k / b];
      var Un = r.unproject($(O));
      return V([Un.lat + D.lat, Un.lng + D.lng]);
    }
    function oa(e) {
      for (var r = 0, o = 0, c = 0, l = 0; l < e.length; l++) {
        var f = V(e[l]);
        r += f.lat, o += f.lng, c++;
      }
      return V([r / c, o / c]);
    }
    var Fg = {
      __proto__: null,
      clipPolygon: vl,
      polygonCenter: bl,
      centroid: oa
    };
    function wl(e, r) {
      if (!r || !e.length)
        return e.slice();
      var o = r * r;
      return e = zg(e, o), e = $g(e, o), e;
    }
    function Sl(e, r, o) {
      return Math.sqrt(zi(e, r, o, !0));
    }
    function Bg(e, r, o) {
      return zi(e, r, o);
    }
    function $g(e, r) {
      var o = e.length, c = typeof Uint8Array < "u" ? Uint8Array : Array, l = new c(o);
      l[0] = l[o - 1] = 1, aa(e, l, r, 0, o - 1);
      var f, p = [];
      for (f = 0; f < o; f++)
        l[f] && p.push(e[f]);
      return p;
    }
    function aa(e, r, o, c, l) {
      var f = 0, p, b, S;
      for (b = c + 1; b <= l - 1; b++)
        S = zi(e[b], e[c], e[l], !0), S > f && (p = b, f = S);
      f > o && (r[p] = 1, aa(e, r, o, c, p), aa(e, r, o, p, l));
    }
    function zg(e, r) {
      for (var o = [e[0]], c = 1, l = 0, f = e.length; c < f; c++)
        Dg(e[c], e[l]) > r && (o.push(e[c]), l = c);
      return l < f - 1 && o.push(e[f - 1]), o;
    }
    var Tl;
    function Pl(e, r, o, c, l) {
      var f = c ? Tl : dn(e, o), p = dn(r, o), b, S, k;
      for (Tl = p; ; ) {
        if (!(f | p))
          return [e, r];
        if (f & p)
          return !1;
        b = f || p, S = Xr(e, r, b, o, l), k = dn(S, o), b === f ? (e = S, f = k) : (r = S, p = k);
      }
    }
    function Xr(e, r, o, c, l) {
      var f = r.x - e.x, p = r.y - e.y, b = c.min, S = c.max, k, O;
      return o & 8 ? (k = e.x + f * (S.y - e.y) / p, O = S.y) : o & 4 ? (k = e.x + f * (b.y - e.y) / p, O = b.y) : o & 2 ? (k = S.x, O = e.y + p * (S.x - e.x) / f) : o & 1 && (k = b.x, O = e.y + p * (b.x - e.x) / f), new N(k, O, l);
    }
    function dn(e, r) {
      var o = 0;
      return e.x < r.min.x ? o |= 1 : e.x > r.max.x && (o |= 2), e.y < r.min.y ? o |= 4 : e.y > r.max.y && (o |= 8), o;
    }
    function Dg(e, r) {
      var o = r.x - e.x, c = r.y - e.y;
      return o * o + c * c;
    }
    function zi(e, r, o, c) {
      var l = r.x, f = r.y, p = o.x - l, b = o.y - f, S = p * p + b * b, k;
      return S > 0 && (k = ((e.x - l) * p + (e.y - f) * b) / S, k > 1 ? (l = o.x, f = o.y) : k > 0 && (l += p * k, f += b * k)), p = e.x - l, b = e.y - f, c ? p * p + b * b : new N(l, f);
    }
    function pe(e) {
      return !dt(e[0]) || typeof e[0][0] != "object" && typeof e[0][0] < "u";
    }
    function xl(e) {
      return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), pe(e);
    }
    function El(e, r) {
      var o, c, l, f, p, b, S, k;
      if (!e || e.length === 0)
        throw new Error("latlngs not passed");
      pe(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
      var O = V([0, 0]), D = vt(e), et = D.getNorthWest().distanceTo(D.getSouthWest()) * D.getNorthEast().distanceTo(D.getNorthWest());
      et < 1700 && (O = oa(e));
      var Yt = e.length, qt = [];
      for (o = 0; o < Yt; o++) {
        var ge = V(e[o]);
        qt.push(r.project(V([ge.lat - O.lat, ge.lng - O.lng])));
      }
      for (o = 0, c = 0; o < Yt - 1; o++)
        c += qt[o].distanceTo(qt[o + 1]) / 2;
      if (c === 0)
        k = qt[0];
      else
        for (o = 0, f = 0; o < Yt - 1; o++)
          if (p = qt[o], b = qt[o + 1], l = p.distanceTo(b), f += l, f > c) {
            S = (f - c) / l, k = [
              b.x - S * (b.x - p.x),
              b.y - S * (b.y - p.y)
            ];
            break;
          }
      var ne = r.unproject($(k));
      return V([ne.lat + O.lat, ne.lng + O.lng]);
    }
    var Zg = {
      __proto__: null,
      simplify: wl,
      pointToSegmentDistance: Sl,
      closestPointOnSegment: Bg,
      clipSegment: Pl,
      _getEdgeIntersection: Xr,
      _getBitCode: dn,
      _sqClosestPointOnSegment: zi,
      isFlat: pe,
      _flat: xl,
      polylineCenter: El
    }, ca = {
      project: function(e) {
        return new N(e.lng, e.lat);
      },
      unproject: function(e) {
        return new at(e.y, e.x);
      },
      bounds: new ot([-180, -90], [180, 90])
    }, ua = {
      R: 6378137,
      R_MINOR: 6356752314245179e-9,
      bounds: new ot([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
      project: function(e) {
        var r = Math.PI / 180, o = this.R, c = e.lat * r, l = this.R_MINOR / o, f = Math.sqrt(1 - l * l), p = f * Math.sin(c), b = Math.tan(Math.PI / 4 - c / 2) / Math.pow((1 - p) / (1 + p), f / 2);
        return c = -o * Math.log(Math.max(b, 1e-10)), new N(e.lng * r * o, c);
      },
      unproject: function(e) {
        for (var r = 180 / Math.PI, o = this.R, c = this.R_MINOR / o, l = Math.sqrt(1 - c * c), f = Math.exp(-e.y / o), p = Math.PI / 2 - 2 * Math.atan(f), b = 0, S = 0.1, k; b < 15 && Math.abs(S) > 1e-7; b++)
          k = l * Math.sin(p), k = Math.pow((1 - k) / (1 + k), l / 2), S = Math.PI / 2 - 2 * Math.atan(f * k) - p, p += S;
        return new at(p * r, e.x * r / o);
      }
    }, Hg = {
      __proto__: null,
      LonLat: ca,
      Mercator: ua,
      SphericalMercator: Dt
    }, Wg = a({}, Vt, {
      code: "EPSG:3395",
      projection: ua,
      transformation: function() {
        var e = 0.5 / (Math.PI * ua.R);
        return cn(e, 0.5, -e, 0.5);
      }()
    }), kl = a({}, Vt, {
      code: "EPSG:4326",
      projection: ca,
      transformation: cn(1 / 180, 1, -1 / 180, 0.5)
    }), jg = a({}, Ut, {
      projection: ca,
      transformation: cn(1, 0, -1, 0),
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
    Ut.Earth = Vt, Ut.EPSG3395 = Wg, Ut.EPSG3857 = jr, Ut.EPSG900913 = Jp, Ut.EPSG4326 = kl, Ut.Simple = jg;
    var Pe = Z.extend({
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
    ct.include({
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
        e = e ? dt(e) ? e : [e] : [];
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
    var Dn = Pe.extend({
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
    }), Ug = function(e, r) {
      return new Dn(e, r);
    }, ze = Dn.extend({
      addLayer: function(e) {
        return this.hasLayer(e) ? this : (e.addEventParent(this), Dn.prototype.addLayer.call(this, e), this.fire("layeradd", { layer: e }));
      },
      removeLayer: function(e) {
        return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.removeEventParent(this), Dn.prototype.removeLayer.call(this, e), this.fire("layerremove", { layer: e })) : this;
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
        var e = new Pt();
        for (var r in this._layers) {
          var o = this._layers[r];
          e.extend(o.getBounds ? o.getBounds() : o.getLatLng());
        }
        return e;
      }
    }), Vg = function(e, r) {
      return new ze(e, r);
    }, Zn = Tt.extend({
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
        return F.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
      }
    });
    function qg(e) {
      return new Zn(e);
    }
    var Di = Zn.extend({
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
        return typeof Di.imagePath != "string" && (Di.imagePath = this._detectIconPath()), (this.options.imagePath || Di.imagePath) + Zn.prototype._getIconUrl.call(this, e);
      },
      _stripUrl: function(e) {
        var r = function(o, c, l) {
          var f = c.exec(o);
          return f && f[l];
        };
        return e = r(e, /^url\((['"])?(.+)\1\)$/, 2), e && r(e, /^(.*)marker-icon\.png$/, 1);
      },
      _detectIconPath: function() {
        var e = ht("div", "leaflet-default-icon-path", document.body), r = Ri(e, "background-image") || Ri(e, "backgroundImage");
        if (document.body.removeChild(e), r = this._stripUrl(r), r)
          return r;
        var o = document.querySelector('link[href$="leaflet.css"]');
        return o ? o.href.substring(0, o.href.length - 11 - 1) : "";
      }
    }), Ll = Oe.extend({
      initialize: function(e) {
        this._marker = e;
      },
      addHooks: function() {
        var e = this._marker._icon;
        this._draggable || (this._draggable = new Qe(e, e, !0)), this._draggable.on({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).enable(), K(e, "leaflet-marker-draggable");
      },
      removeHooks: function() {
        this._draggable.off({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).disable(), this._marker._icon && Ct(this._marker._icon, "leaflet-marker-draggable");
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      _adjustPan: function(e) {
        var r = this._marker, o = r._map, c = this._marker.options.autoPanSpeed, l = this._marker.options.autoPanPadding, f = ln(r._icon), p = o.getPixelBounds(), b = o.getPixelOrigin(), S = zt(
          p.min._subtract(b).add(l),
          p.max._subtract(b).subtract(l)
        );
        if (!S.contains(f)) {
          var k = $(
            (Math.max(S.max.x, f.x) - S.max.x) / (p.max.x - S.max.x) - (Math.min(S.min.x, f.x) - S.min.x) / (p.min.x - S.min.x),
            (Math.max(S.max.y, f.y) - S.max.y) / (p.max.y - S.max.y) - (Math.min(S.min.y, f.y) - S.min.y) / (p.min.y - S.min.y)
          ).multiplyBy(c);
          o.panBy(k, { animate: !1 }), this._draggable._newPos._add(k), this._draggable._startPos._add(k), Rt(r._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = U(this._adjustPan.bind(this, e));
        }
      },
      _onDragStart: function() {
        this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
      },
      _onPreDrag: function(e) {
        this._marker.options.autoPan && (G(this._panRequest), this._panRequest = U(this._adjustPan.bind(this, e)));
      },
      _onDrag: function(e) {
        var r = this._marker, o = r._shadow, c = ln(r._icon), l = r._map.layerPointToLatLng(c);
        o && Rt(o, c), r._latlng = l, e.latlng = l, e.oldLatLng = this._oldLatLng, r.fire("move", e).fire("drag", e);
      },
      _onDragEnd: function(e) {
        G(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", e);
      }
    }), Qr = Pe.extend({
      // @section
      // @aka Marker options
      options: {
        // @option icon: Icon = *
        // Icon instance to use for rendering the marker.
        // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
        // If not specified, a common instance of `L.Icon.Default` is used.
        icon: new Di(),
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
        I(this, r), this._latlng = V(e);
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
        return this._latlng = V(e), this.update(), this.fire("move", { oldLatLng: r, latlng: this._latlng });
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
        o !== this._icon && (this._icon && this._removeIcon(), c = !0, e.title && (o.title = e.title), o.tagName === "IMG" && (o.alt = e.alt || "")), K(o, r), e.keyboard && (o.tabIndex = "0", o.setAttribute("role", "button")), this._icon = o, e.riseOnHover && this.on({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && q(o, "focus", this._panOnFocus, this);
        var l = e.icon.createShadow(this._shadow), f = !1;
        l !== this._shadow && (this._removeShadow(), f = !0), l && (K(l, r), l.alt = ""), this._shadow = l, e.opacity < 1 && this._updateOpacity(), c && this.getPane().appendChild(this._icon), this._initInteraction(), l && f && this.getPane(e.shadowPane).appendChild(this._shadow);
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
        if (this.options.interactive && (K(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Ll)) {
          var e = this.options.draggable;
          this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new Ll(this), e && this.dragging.enable();
        }
      },
      // @method setOpacity(opacity: Number): this
      // Changes the opacity of the marker.
      setOpacity: function(e) {
        return this.options.opacity = e, this._map && this._updateOpacity(), this;
      },
      _updateOpacity: function() {
        var e = this.options.opacity;
        this._icon && me(this._icon, e), this._shadow && me(this._shadow, e);
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
    function Gg(e, r) {
      return new Qr(e, r);
    }
    var tn = Pe.extend({
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
    }), ts = tn.extend({
      // @section
      // @aka CircleMarker options
      options: {
        fill: !0,
        // @option radius: Number = 10
        // Radius of the circle marker, in pixels
        radius: 10
      },
      initialize: function(e, r) {
        I(this, r), this._latlng = V(e), this._radius = this.options.radius;
      },
      // @method setLatLng(latLng: LatLng): this
      // Sets the position of a circle marker to a new location.
      setLatLng: function(e) {
        var r = this._latlng;
        return this._latlng = V(e), this.redraw(), this.fire("move", { oldLatLng: r, latlng: this._latlng });
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
        return tn.prototype.setStyle.call(this, e), this.setRadius(r), this;
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
    function Kg(e, r) {
      return new ts(e, r);
    }
    var la = ts.extend({
      initialize: function(e, r, o) {
        if (typeof r == "number" && (r = a({}, o, { radius: r })), I(this, r), this._latlng = V(e), isNaN(this.options.radius))
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
        return new Pt(
          this._map.layerPointToLatLng(this._point.subtract(e)),
          this._map.layerPointToLatLng(this._point.add(e))
        );
      },
      setStyle: tn.prototype.setStyle,
      _project: function() {
        var e = this._latlng.lng, r = this._latlng.lat, o = this._map, c = o.options.crs;
        if (c.distance === Vt.distance) {
          var l = Math.PI / 180, f = this._mRadius / Vt.R / l, p = o.project([r + f, e]), b = o.project([r - f, e]), S = p.add(b).divideBy(2), k = o.unproject(S).lat, O = Math.acos((Math.cos(f * l) - Math.sin(r * l) * Math.sin(k * l)) / (Math.cos(r * l) * Math.cos(k * l))) / l;
          (isNaN(O) || O === 0) && (O = f / Math.cos(Math.PI / 180 * r)), this._point = S.subtract(o.getPixelOrigin()), this._radius = isNaN(O) ? 0 : S.x - o.project([k, e - O]).x, this._radiusY = S.y - p.y;
        } else {
          var D = c.unproject(c.project(this._latlng).subtract([this._mRadius, 0]));
          this._point = o.latLngToLayerPoint(this._latlng), this._radius = this._point.x - o.latLngToLayerPoint(D).x;
        }
        this._updateBounds();
      }
    });
    function Jg(e, r, o) {
      return new la(e, r, o);
    }
    var De = tn.extend({
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
        for (var r = 1 / 0, o = null, c = zi, l, f, p = 0, b = this._parts.length; p < b; p++)
          for (var S = this._parts[p], k = 1, O = S.length; k < O; k++) {
            l = S[k - 1], f = S[k];
            var D = c(e, l, f, !0);
            D < r && (r = D, o = c(e, l, f));
          }
        return o && (o.distance = Math.sqrt(r)), o;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
      getCenter: function() {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        return El(this._defaultShape(), this._map.options.crs);
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
        return r = r || this._defaultShape(), e = V(e), r.push(e), this._bounds.extend(e), this.redraw();
      },
      _setLatLngs: function(e) {
        this._bounds = new Pt(), this._latlngs = this._convertLatLngs(e);
      },
      _defaultShape: function() {
        return pe(this._latlngs) ? this._latlngs : this._latlngs[0];
      },
      // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
      _convertLatLngs: function(e) {
        for (var r = [], o = pe(e), c = 0, l = e.length; c < l; c++)
          o ? (r[c] = V(e[c]), this._bounds.extend(r[c])) : r[c] = this._convertLatLngs(e[c]);
        return r;
      },
      _project: function() {
        var e = new ot();
        this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
      },
      _updateBounds: function() {
        var e = this._clickTolerance(), r = new N(e, e);
        this._rawPxBounds && (this._pxBounds = new ot([
          this._rawPxBounds.min.subtract(r),
          this._rawPxBounds.max.add(r)
        ]));
      },
      // recursively turns latlngs into a set of rings with projected coordinates
      _projectLatlngs: function(e, r, o) {
        var c = e[0] instanceof at, l = e.length, f, p;
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
              b = Pl(S[c], S[c + 1], e, c, !0), b && (r[l] = r[l] || [], r[l].push(b[0]), (b[1] !== S[c + 1] || c === p - 2) && (r[l].push(b[1]), l++));
        }
      },
      // simplify each clipped part of the polyline for performance
      _simplifyPoints: function() {
        for (var e = this._parts, r = this.options.smoothFactor, o = 0, c = e.length; o < c; o++)
          e[o] = wl(e[o], r);
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
            if (!(!r && c === 0) && Sl(e, b[l], b[c]) <= S)
              return !0;
        return !1;
      }
    });
    function Yg(e, r) {
      return new De(e, r);
    }
    De._flat = xl;
    var Hn = De.extend({
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
        return bl(this._defaultShape(), this._map.options.crs);
      },
      _convertLatLngs: function(e) {
        var r = De.prototype._convertLatLngs.call(this, e), o = r.length;
        return o >= 2 && r[0] instanceof at && r[0].equals(r[o - 1]) && r.pop(), r;
      },
      _setLatLngs: function(e) {
        De.prototype._setLatLngs.call(this, e), pe(this._latlngs) && (this._latlngs = [this._latlngs]);
      },
      _defaultShape: function() {
        return pe(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
      },
      _clipPoints: function() {
        var e = this._renderer._bounds, r = this.options.weight, o = new N(r, r);
        if (e = new ot(e.min.subtract(o), e.max.add(o)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          for (var c = 0, l = this._rings.length, f; c < l; c++)
            f = vl(this._rings[c], e, !0), f.length && this._parts.push(f);
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
        return r || De.prototype._containsPoint.call(this, e, !0);
      }
    });
    function Xg(e, r) {
      return new Hn(e, r);
    }
    var Ze = ze.extend({
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
        var r = dt(e) ? e : e.features, o, c, l;
        if (r) {
          for (o = 0, c = r.length; o < c; o++)
            l = r[o], (l.geometries || l.geometry || l.features || l.coordinates) && this.addData(l);
          return this;
        }
        var f = this.options;
        if (f.filter && !f.filter(e))
          return this;
        var p = es(e, f);
        return p ? (p.feature = rs(e), p.defaultOptions = p.options, this.resetStyle(p), f.onEachFeature && f.onEachFeature(e, p), this.addLayer(p)) : this;
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
    function es(e, r) {
      var o = e.type === "Feature" ? e.geometry : e, c = o ? o.coordinates : null, l = [], f = r && r.pointToLayer, p = r && r.coordsToLatLng || ha, b, S, k, O;
      if (!c && !o)
        return null;
      switch (o.type) {
        case "Point":
          return b = p(c), Ml(f, e, b, r);
        case "MultiPoint":
          for (k = 0, O = c.length; k < O; k++)
            b = p(c[k]), l.push(Ml(f, e, b, r));
          return new ze(l);
        case "LineString":
        case "MultiLineString":
          return S = ns(c, o.type === "LineString" ? 0 : 1, p), new De(S, r);
        case "Polygon":
        case "MultiPolygon":
          return S = ns(c, o.type === "Polygon" ? 1 : 2, p), new Hn(S, r);
        case "GeometryCollection":
          for (k = 0, O = o.geometries.length; k < O; k++) {
            var D = es({
              geometry: o.geometries[k],
              type: "Feature",
              properties: e.properties
            }, r);
            D && l.push(D);
          }
          return new ze(l);
        case "FeatureCollection":
          for (k = 0, O = o.features.length; k < O; k++) {
            var et = es(o.features[k], r);
            et && l.push(et);
          }
          return new ze(l);
        default:
          throw new Error("Invalid GeoJSON object.");
      }
    }
    function Ml(e, r, o, c) {
      return e ? e(r, o) : new Qr(o, c && c.markersInheritOptions && c);
    }
    function ha(e) {
      return new at(e[1], e[0], e[2]);
    }
    function ns(e, r, o) {
      for (var c = [], l = 0, f = e.length, p; l < f; l++)
        p = r ? ns(e[l], r - 1, o) : (o || ha)(e[l]), c.push(p);
      return c;
    }
    function fa(e, r) {
      return e = V(e), e.alt !== void 0 ? [P(e.lng, r), P(e.lat, r), P(e.alt, r)] : [P(e.lng, r), P(e.lat, r)];
    }
    function is(e, r, o, c) {
      for (var l = [], f = 0, p = e.length; f < p; f++)
        l.push(r ? is(e[f], pe(e[f]) ? 0 : r - 1, o, c) : fa(e[f], c));
      return !r && o && l.length > 0 && l.push(l[0].slice()), l;
    }
    function Wn(e, r) {
      return e.feature ? a({}, e.feature, { geometry: r }) : rs(r);
    }
    function rs(e) {
      return e.type === "Feature" || e.type === "FeatureCollection" ? e : {
        type: "Feature",
        properties: {},
        geometry: e
      };
    }
    var da = {
      toGeoJSON: function(e) {
        return Wn(this, {
          type: "Point",
          coordinates: fa(this.getLatLng(), e)
        });
      }
    };
    Qr.include(da), la.include(da), ts.include(da), De.include({
      toGeoJSON: function(e) {
        var r = !pe(this._latlngs), o = is(this._latlngs, r ? 1 : 0, !1, e);
        return Wn(this, {
          type: (r ? "Multi" : "") + "LineString",
          coordinates: o
        });
      }
    }), Hn.include({
      toGeoJSON: function(e) {
        var r = !pe(this._latlngs), o = r && !pe(this._latlngs[0]), c = is(this._latlngs, o ? 2 : r ? 1 : 0, !0, e);
        return r || (c = [c]), Wn(this, {
          type: (o ? "Multi" : "") + "Polygon",
          coordinates: c
        });
      }
    }), Dn.include({
      toMultiPoint: function(e) {
        var r = [];
        return this.eachLayer(function(o) {
          r.push(o.toGeoJSON(e).geometry.coordinates);
        }), Wn(this, {
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
              var p = rs(f);
              p.type === "FeatureCollection" ? c.push.apply(c, p.features) : c.push(p);
            }
          }
        }), o ? Wn(this, {
          geometries: c,
          type: "GeometryCollection"
        }) : {
          type: "FeatureCollection",
          features: c
        };
      }
    });
    function Cl(e, r) {
      return new Ze(e, r);
    }
    var Qg = Cl, ss = Pe.extend({
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
        this._url = e, this._bounds = vt(r), I(this, o);
      },
      onAdd: function() {
        this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (K(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
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
        return this._map && $n(this._image), this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all overlays.
      bringToBack: function() {
        return this._map && zn(this._image), this;
      },
      // @method setUrl(url: String): this
      // Changes the URL of the image.
      setUrl: function(e) {
        return this._url = e, this._image && (this._image.src = e), this;
      },
      // @method setBounds(bounds: LatLngBounds): this
      // Update the bounds that this ImageOverlay covers
      setBounds: function(e) {
        return this._bounds = vt(e), this._map && this._reset(), this;
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
        var e = this._url.tagName === "IMG", r = this._image = e ? this._url : ht("img");
        if (K(r, "leaflet-image-layer"), this._zoomAnimated && K(r, "leaflet-zoom-animated"), this.options.className && K(r, this.options.className), r.onselectstart = v, r.onmousemove = v, r.onload = h(this.fire, this, "load"), r.onerror = h(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (r.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e) {
          this._url = r.src;
          return;
        }
        r.src = this._url, r.alt = this.options.alt;
      },
      _animateZoom: function(e) {
        var r = this._map.getZoomScale(e.zoom), o = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
        un(this._image, o, r);
      },
      _reset: function() {
        var e = this._image, r = new ot(
          this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
          this._map.latLngToLayerPoint(this._bounds.getSouthEast())
        ), o = r.getSize();
        Rt(e, r.min), e.style.width = o.x + "px", e.style.height = o.y + "px";
      },
      _updateOpacity: function() {
        me(this._image, this.options.opacity);
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
    }), ty = function(e, r, o) {
      return new ss(e, r, o);
    }, Il = ss.extend({
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
        var e = this._url.tagName === "VIDEO", r = this._image = e ? this._url : ht("video");
        if (K(r, "leaflet-image-layer"), this._zoomAnimated && K(r, "leaflet-zoom-animated"), this.options.className && K(r, this.options.className), r.onselectstart = v, r.onmousemove = v, r.onloadeddata = h(this.fire, this, "load"), e) {
          for (var o = r.getElementsByTagName("source"), c = [], l = 0; l < o.length; l++)
            c.push(o[l].src);
          this._url = o.length > 0 ? c : [r.src];
          return;
        }
        dt(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(r.style, "objectFit") && (r.style.objectFit = "fill"), r.autoplay = !!this.options.autoplay, r.loop = !!this.options.loop, r.muted = !!this.options.muted, r.playsInline = !!this.options.playsInline;
        for (var f = 0; f < this._url.length; f++) {
          var p = ht("source");
          p.src = this._url[f], r.appendChild(p);
        }
      }
      // @method getElement(): HTMLVideoElement
      // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
      // used by this overlay.
    });
    function ey(e, r, o) {
      return new Il(e, r, o);
    }
    var Ol = ss.extend({
      _initImage: function() {
        var e = this._image = this._url;
        K(e, "leaflet-image-layer"), this._zoomAnimated && K(e, "leaflet-zoom-animated"), this.options.className && K(e, this.options.className), e.onselectstart = v, e.onmousemove = v;
      }
      // @method getElement(): SVGElement
      // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
      // used by this overlay.
    });
    function ny(e, r, o) {
      return new Ol(e, r, o);
    }
    var Re = Pe.extend({
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
        e && (e instanceof at || dt(e)) ? (this._latlng = V(e), I(this, r)) : (I(this, e), this._source = r), this.options.content && (this._content = this.options.content);
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
        this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && me(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && me(this._container, 1), this.bringToFront(), this.options.interactive && (K(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
      },
      onRemove: function(e) {
        e._fadeAnimated ? (me(this._container, 0), this._removeTimeout = setTimeout(h(xt, void 0, this._container), 200)) : xt(this._container), this.options.interactive && (Ct(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
        return this._latlng = V(e), this._map && (this._updatePosition(), this._adjustPan()), this;
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
        return this._map && $n(this._container), this;
      },
      // @method bringToBack: this
      // Brings this overlay to the back of other overlays (in the same map pane).
      bringToBack: function() {
        return this._map && zn(this._container), this;
      },
      // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
      _prepareOpen: function(e) {
        var r = this._source;
        if (!r._map)
          return !1;
        if (r instanceof ze) {
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
          this._zoomAnimated ? Rt(this._container, e.add(o)) : r = r.add(e).add(o);
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
    }), Pe.include({
      _initOverlay: function(e, r, o, c) {
        var l = o;
        return l instanceof e ? (I(l, c), l._source = this) : (l = r && !c ? r : new e(c, this), l.setContent(o)), l;
      }
    });
    var os = Re.extend({
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
        return e = arguments.length ? e : this._source._map, !e.hasLayer(this) && e._popup && e._popup.options.autoClose && e.removeLayer(e._popup), e._popup = this, Re.prototype.openOn.call(this, e);
      },
      onAdd: function(e) {
        Re.prototype.onAdd.call(this, e), e.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof tn || this._source.on("preclick", hn));
      },
      onRemove: function(e) {
        Re.prototype.onRemove.call(this, e), e.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof tn || this._source.off("preclick", hn));
      },
      getEvents: function() {
        var e = Re.prototype.getEvents.call(this);
        return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (e.preclick = this.close), this.options.keepInView && (e.moveend = this._adjustPan), e;
      },
      _initLayout: function() {
        var e = "leaflet-popup", r = this._container = ht(
          "div",
          e + " " + (this.options.className || "") + " leaflet-zoom-animated"
        ), o = this._wrapper = ht("div", e + "-content-wrapper", r);
        if (this._contentNode = ht("div", e + "-content", o), Bi(r), na(this._contentNode), q(r, "contextmenu", hn), this._tipContainer = ht("div", e + "-tip-container", r), this._tip = ht("div", e + "-tip", this._tipContainer), this.options.closeButton) {
          var c = this._closeButton = ht("a", e + "-close-button", r);
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
        l && c > l ? (r.height = l + "px", K(e, f)) : Ct(e, f), this._containerWidth = this._container.offsetWidth;
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
          var e = this._map, r = parseInt(Ri(this._container, "marginBottom"), 10) || 0, o = this._container.offsetHeight + r, c = this._containerWidth, l = new N(this._containerLeft, -o - this._containerBottom);
          l._add(ln(this._container));
          var f = e.layerPointToContainerPoint(l), p = $(this.options.autoPanPadding), b = $(this.options.autoPanPaddingTopLeft || p), S = $(this.options.autoPanPaddingBottomRight || p), k = e.getSize(), O = 0, D = 0;
          f.x + c + S.x > k.x && (O = f.x + c - k.x + S.x), f.x - O - b.x < 0 && (O = f.x - b.x), f.y + o + S.y > k.y && (D = f.y + o - k.y + S.y), f.y - D - b.y < 0 && (D = f.y - b.y), (O || D) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([O, D]));
        }
      },
      _getAnchor: function() {
        return $(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
      }
    }), iy = function(e, r) {
      return new os(e, r);
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
        return this._initOverlay(os, e, r, o).openOn(this), this;
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
        return this._popup = this._initOverlay(os, this._popup, e, r), this._popupHandlersAdded || (this.on({
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
        return this._popup && (this instanceof ze || (this._popup._source = this), this._popup._prepareOpen(e || this._latlng) && this._popup.openOn(this._map)), this;
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
          fn(e);
          var r = e.layer || e.target;
          if (this._popup._source === r && !(r instanceof tn)) {
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
    var as = Re.extend({
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
        Re.prototype.onAdd.call(this, e), this.setOpacity(this.options.opacity), e.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
      },
      onRemove: function(e) {
        Re.prototype.onRemove.call(this, e), e.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
      },
      getEvents: function() {
        var e = Re.prototype.getEvents.call(this);
        return this.options.permanent || (e.preclick = this.close), e;
      },
      _initLayout: function() {
        var e = "leaflet-tooltip", r = e + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
        this._contentNode = this._container = ht("div", r), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + _(this));
      },
      _updateLayout: function() {
      },
      _adjustPan: function() {
      },
      _setPosition: function(e) {
        var r, o, c = this._map, l = this._container, f = c.latLngToContainerPoint(c.getCenter()), p = c.layerPointToContainerPoint(e), b = this.options.direction, S = l.offsetWidth, k = l.offsetHeight, O = $(this.options.offset), D = this._getAnchor();
        b === "top" ? (r = S / 2, o = k) : b === "bottom" ? (r = S / 2, o = 0) : b === "center" ? (r = S / 2, o = k / 2) : b === "right" ? (r = 0, o = k / 2) : b === "left" ? (r = S, o = k / 2) : p.x < f.x ? (b = "right", r = 0, o = k / 2) : (b = "left", r = S + (O.x + D.x) * 2, o = k / 2), e = e.subtract($(r, o, !0)).add(O).add(D), Ct(l, "leaflet-tooltip-right"), Ct(l, "leaflet-tooltip-left"), Ct(l, "leaflet-tooltip-top"), Ct(l, "leaflet-tooltip-bottom"), K(l, "leaflet-tooltip-" + b), Rt(l, e);
      },
      _updatePosition: function() {
        var e = this._map.latLngToLayerPoint(this._latlng);
        this._setPosition(e);
      },
      setOpacity: function(e) {
        this.options.opacity = e, this._container && me(this._container, e);
      },
      _animateZoom: function(e) {
        var r = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
        this._setPosition(r);
      },
      _getAnchor: function() {
        return $(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
      }
    }), ry = function(e, r) {
      return new as(e, r);
    };
    ct.include({
      // @method openTooltip(tooltip: Tooltip): this
      // Opens the specified tooltip.
      // @alternative
      // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
      // Creates a tooltip with the specified content and options and open it.
      openTooltip: function(e, r, o) {
        return this._initOverlay(as, e, r, o).openOn(this), this;
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
        return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(as, this._tooltip, e, r), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
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
        return this._tooltip && (this instanceof ze || (this._tooltip._source = this), this._tooltip._prepareOpen(e) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
    var Rl = Zn.extend({
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
        if (o.html instanceof Element ? (qr(r), r.appendChild(o.html)) : r.innerHTML = o.html !== !1 ? o.html : "", o.bgPos) {
          var c = $(o.bgPos);
          r.style.backgroundPosition = -c.x + "px " + -c.y + "px";
        }
        return this._setIconStyles(r, "icon"), r;
      },
      createShadow: function() {
        return null;
      }
    });
    function sy(e) {
      return new Rl(e);
    }
    Zn.Default = Di;
    var Zi = Pe.extend({
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
        updateWhenIdle: F.mobile,
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
        return this._map && ($n(this._container), this._setAutoZIndex(Math.max)), this;
      },
      // @method bringToBack: this
      // Brings the tile layer to the bottom of all tile layers.
      bringToBack: function() {
        return this._map && (zn(this._container), this._setAutoZIndex(Math.min)), this;
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
        return e instanceof N ? e : new N(e, e);
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
        if (this._map && !F.ielt9) {
          me(this._container, this.options.opacity);
          var e = +/* @__PURE__ */ new Date(), r = !1, o = !1;
          for (var c in this._tiles) {
            var l = this._tiles[c];
            if (!(!l.current || !l.loaded)) {
              var f = Math.min(1, (e - l.loaded) / 200);
              me(l.el, f), f < 1 ? r = !0 : (l.active ? o = !0 : this._onOpaqueTile(l), l.active = !0);
            }
          }
          o && !this._noPrune && this._pruneTiles(), r && (G(this._fadeFrame), this._fadeFrame = U(this._updateOpacity, this));
        }
      },
      _onOpaqueTile: v,
      _initContainer: function() {
        this._container || (this._container = ht("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
      },
      _updateLevels: function() {
        var e = this._tileZoom, r = this.options.maxZoom;
        if (e !== void 0) {
          for (var o in this._levels)
            o = Number(o), this._levels[o].el.children.length || o === e ? (this._levels[o].el.style.zIndex = r - Math.abs(e - o), this._onUpdateLevel(o)) : (xt(this._levels[o].el), this._removeTilesAtZoom(o), this._onRemoveLevel(o), delete this._levels[o]);
          var c = this._levels[e], l = this._map;
          return c || (c = this._levels[e] = {}, c.el = ht("div", "leaflet-tile-container leaflet-zoom-animated", this._container), c.el.style.zIndex = r, c.origin = l.project(l.unproject(l.getPixelOrigin()), e).round(), c.zoom = e, this._setZoomTransform(c, l.getCenter(), l.getZoom()), v(c.el.offsetWidth), this._onCreateLevel(c)), this._level = c, c;
        }
      },
      _onUpdateLevel: v,
      _onRemoveLevel: v,
      _onCreateLevel: v,
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
        var l = Math.floor(e / 2), f = Math.floor(r / 2), p = o - 1, b = new N(+l, +f);
        b.z = +p;
        var S = this._tileCoordsToKey(b), k = this._tiles[S];
        return k && k.active ? (k.retain = !0, !0) : (k && k.loaded && (k.retain = !0), p > c ? this._retainParent(l, f, p, c) : !1);
      },
      _retainChildren: function(e, r, o, c) {
        for (var l = 2 * e; l < 2 * e + 2; l++)
          for (var f = 2 * r; f < 2 * r + 2; f++) {
            var p = new N(l, f);
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
        F.any3d ? un(e.el, l, c) : Rt(e.el, l);
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
              var O = this._tiles[k].coords;
              (O.z !== this._tileZoom || !S.contains(new N(O.x, O.y))) && (this._tiles[k].current = !1);
            }
            if (Math.abs(o - this._tileZoom) > 1) {
              this._setView(e, o);
              return;
            }
            for (var D = l.min.y; D <= l.max.y; D++)
              for (var et = l.min.x; et <= l.max.x; et++) {
                var Yt = new N(et, D);
                if (Yt.z = this._tileZoom, !!this._isValidTile(Yt)) {
                  var qt = this._tiles[this._tileCoordsToKey(Yt)];
                  qt ? qt.current = !0 : p.push(Yt);
                }
              }
            if (p.sort(function(ne, Un) {
              return ne.distanceTo(f) - Un.distanceTo(f);
            }), p.length !== 0) {
              this._loading || (this._loading = !0, this.fire("loading"));
              var ge = document.createDocumentFragment();
              for (et = 0; et < p.length; et++)
                this._addTile(p[et], ge);
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
        return vt(this.options.bounds).overlaps(c);
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
        var r = this._tileCoordsToNwSe(e), o = new Pt(r[0], r[1]);
        return this.options.noWrap || (o = this._map.wrapLatLngBounds(o)), o;
      },
      // converts tile coordinates to key for the tile cache
      _tileCoordsToKey: function(e) {
        return e.x + ":" + e.y + ":" + e.z;
      },
      // converts tile cache key to coordinates
      _keyToTileCoords: function(e) {
        var r = e.split(":"), o = new N(+r[0], +r[1]);
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
        K(e, "leaflet-tile");
        var r = this.getTileSize();
        e.style.width = r.x + "px", e.style.height = r.y + "px", e.onselectstart = v, e.onmousemove = v, F.ielt9 && this.options.opacity < 1 && me(e, this.options.opacity);
      },
      _addTile: function(e, r) {
        var o = this._getTilePos(e), c = this._tileCoordsToKey(e), l = this.createTile(this._wrapCoords(e), h(this._tileReady, this, e));
        this._initTile(l), this.createTile.length < 2 && U(h(this._tileReady, this, e, null, l)), Rt(l, o), this._tiles[c] = {
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
        o = this._tiles[c], o && (o.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (me(o.el, 0), G(this._fadeFrame), this._fadeFrame = U(this._updateOpacity, this)) : (o.active = !0, this._pruneTiles()), r || (K(o.el, "leaflet-tile-loaded"), this.fire("tileload", {
          tile: o.el,
          coords: e
        })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), F.ielt9 || !this._map._fadeAnimated ? U(this._pruneTiles, this) : setTimeout(h(this._pruneTiles, this), 250)));
      },
      _getTilePos: function(e) {
        return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
      },
      _wrapCoords: function(e) {
        var r = new N(
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
    function oy(e) {
      return new Zi(e);
    }
    var jn = Zi.extend({
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
        this._url = e, r = I(this, r), r.detectRetina && F.retina && r.maxZoom > 0 ? (r.tileSize = Math.floor(r.tileSize / 2), r.zoomReverse ? (r.zoomOffset--, r.minZoom = Math.min(r.maxZoom, r.minZoom + 1)) : (r.zoomOffset++, r.maxZoom = Math.max(r.minZoom, r.maxZoom - 1)), r.minZoom = Math.max(0, r.minZoom)) : r.zoomReverse ? r.minZoom = Math.min(r.maxZoom, r.minZoom) : r.maxZoom = Math.max(r.minZoom, r.maxZoom), typeof r.subdomains == "string" && (r.subdomains = r.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
          r: F.retina ? "@2x" : "",
          s: this._getSubdomain(e),
          x: e.x,
          y: e.y,
          z: this._getZoomForUrl()
        };
        if (this._map && !this._map.options.crs.infinite) {
          var o = this._globalTileRange.max.y - e.y;
          this.options.tms && (r.y = o), r["-y"] = o;
        }
        return rt(this._url, a(r, this.options));
      },
      _tileOnLoad: function(e, r) {
        F.ielt9 ? setTimeout(h(e, this, null, r), 0) : e(null, r);
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
          if (this._tiles[e].coords.z !== this._tileZoom && (r = this._tiles[e].el, r.onload = v, r.onerror = v, !r.complete)) {
            r.src = Et;
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
          return r.el.setAttribute("src", Et), Zi.prototype._removeTile.call(this, e);
      },
      _tileReady: function(e, r, o) {
        if (!(!this._map || o && o.getAttribute("src") === Et))
          return Zi.prototype._tileReady.call(this, e, r, o);
      }
    });
    function Nl(e, r) {
      return new jn(e, r);
    }
    var Al = jn.extend({
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
        var l = r.detectRetina && F.retina ? 2 : 1, f = this.getTileSize();
        o.width = f.x * l, o.height = f.y * l, this.wmsParams = o;
      },
      onAdd: function(e) {
        this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
        var r = this._wmsVersion >= 1.3 ? "crs" : "srs";
        this.wmsParams[r] = this._crs.code, jn.prototype.onAdd.call(this, e);
      },
      getTileUrl: function(e) {
        var r = this._tileCoordsToNwSe(e), o = this._crs, c = zt(o.project(r[0]), o.project(r[1])), l = c.min, f = c.max, p = (this._wmsVersion >= 1.3 && this._crs === kl ? [l.y, l.x, f.y, f.x] : [l.x, l.y, f.x, f.y]).join(","), b = jn.prototype.getTileUrl.call(this, e);
        return b + W(this.wmsParams, b, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + p;
      },
      // @method setParams(params: Object, noRedraw?: Boolean): this
      // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
      setParams: function(e, r) {
        return a(this.wmsParams, e), r || this.redraw(), this;
      }
    });
    function ay(e, r) {
      return new Al(e, r);
    }
    jn.WMS = Al, Nl.wms = ay;
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
        this._container || (this._initContainer(), K(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
        F.any3d ? un(this._container, f, o) : Rt(this._container, f);
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
    }), Fl = He.extend({
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
        q(e, "mousemove", this._onMouseMove, this), q(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), q(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
      },
      _destroyContainer: function() {
        G(this._redrawRequest), delete this._ctx, xt(this._container), pt(this._container), delete this._container;
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
          var e = this._bounds, r = this._container, o = e.getSize(), c = F.retina ? 2 : 1;
          Rt(r, e.min), r.width = c * o.x, r.height = c * o.y, r.style.width = o.x + "px", r.style.height = o.y + "px", F.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
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
        this._map && (this._extendRedrawBounds(e), this._redrawRequest = this._redrawRequest || U(this._redraw, this));
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
        r && (Ct(this._container, "leaflet-interactive"), this._fireEvent([r], e, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
      },
      _handleMouseHover: function(e, r) {
        if (!this._mouseHoverThrottled) {
          for (var o, c, l = this._drawFirst; l; l = l.next)
            o = l.layer, o.options.interactive && o._containsPoint(r) && (c = o);
          c !== this._hoveredLayer && (this._handleMouseOut(e), c && (K(this._container, "leaflet-interactive"), this._fireEvent([c], e, "mouseover"), this._hoveredLayer = c)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(h(function() {
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
    function Bl(e) {
      return F.canvas ? new Fl(e) : null;
    }
    var Hi = function() {
      try {
        return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(e) {
          return document.createElement("<lvml:" + e + ' class="lvml">');
        };
      } catch {
      }
      return function(e) {
        return document.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }(), cy = {
      _initContainer: function() {
        this._container = ht("div", "leaflet-vml-container");
      },
      _update: function() {
        this._map._animatingZoom || (He.prototype._update.call(this), this.fire("update"));
      },
      _initPath: function(e) {
        var r = e._container = Hi("shape");
        K(r, "leaflet-vml-shape " + (this.options.className || "")), r.coordsize = "1 1", e._path = Hi("path"), r.appendChild(e._path), this._updateStyle(e), this._layers[_(e)] = e;
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
        l.stroked = !!c.stroke, l.filled = !!c.fill, c.stroke ? (r || (r = e._stroke = Hi("stroke")), l.appendChild(r), r.weight = c.weight + "px", r.color = c.color, r.opacity = c.opacity, c.dashArray ? r.dashStyle = dt(c.dashArray) ? c.dashArray.join(" ") : c.dashArray.replace(/( *, *)/g, " ") : r.dashStyle = "", r.endcap = c.lineCap.replace("butt", "flat"), r.joinstyle = c.lineJoin) : r && (l.removeChild(r), e._stroke = null), c.fill ? (o || (o = e._fill = Hi("fill")), l.appendChild(o), o.color = c.fillColor || c.color, o.opacity = c.fillOpacity) : o && (l.removeChild(o), e._fill = null);
      },
      _updateCircle: function(e) {
        var r = e._point.round(), o = Math.round(e._radius), c = Math.round(e._radiusY || o);
        this._setPath(e, e._empty() ? "M0 0" : "AL " + r.x + "," + r.y + " " + o + "," + c + " 0," + 65535 * 360);
      },
      _setPath: function(e, r) {
        e._path.v = r;
      },
      _bringToFront: function(e) {
        $n(e._container);
      },
      _bringToBack: function(e) {
        zn(e._container);
      }
    }, cs = F.vml ? Hi : Zu, Wi = He.extend({
      _initContainer: function() {
        this._container = cs("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = cs("g"), this._container.appendChild(this._rootGroup);
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
        var r = e._path = cs("path");
        e.options.className && K(r, e.options.className), e.options.interactive && K(r, "leaflet-interactive"), this._updateStyle(e), this._layers[_(e)] = e;
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
        this._setPath(e, Hu(e._parts, r));
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
        $n(e._path);
      },
      _bringToBack: function(e) {
        zn(e._path);
      }
    });
    F.vml && Wi.include(cy);
    function $l(e) {
      return F.svg || F.vml ? new Wi(e) : null;
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
        return this.options.preferCanvas && Bl(e) || $l(e);
      }
    });
    var zl = Hn.extend({
      initialize: function(e, r) {
        Hn.prototype.initialize.call(this, this._boundsToLatLngs(e), r);
      },
      // @method setBounds(latLngBounds: LatLngBounds): this
      // Redraws the rectangle with the passed bounds.
      setBounds: function(e) {
        return this.setLatLngs(this._boundsToLatLngs(e));
      },
      _boundsToLatLngs: function(e) {
        return e = vt(e), [
          e.getSouthWest(),
          e.getNorthWest(),
          e.getNorthEast(),
          e.getSouthEast()
        ];
      }
    });
    function uy(e, r) {
      return new zl(e, r);
    }
    Wi.create = cs, Wi.pointsToPath = Hu, Ze.geometryToLayer = es, Ze.coordsToLatLng = ha, Ze.coordsToLatLngs = ns, Ze.latLngToCoords = fa, Ze.latLngsToCoords = is, Ze.getFeature = Wn, Ze.asFeature = rs, ct.mergeOptions({
      // @option boxZoom: Boolean = true
      // Whether the map can be zoomed to a rectangular area specified by
      // dragging the mouse while pressing the shift key.
      boxZoom: !0
    });
    var Dl = Oe.extend({
      initialize: function(e) {
        this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
      },
      addHooks: function() {
        q(this._container, "mousedown", this._onMouseDown, this);
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
        this._clearDeferredResetState(), this._resetState(), Ni(), Go(), this._startPoint = this._map.mouseEventToContainerPoint(e), q(document, {
          contextmenu: fn,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseMove: function(e) {
        this._moved || (this._moved = !0, this._box = ht("div", "leaflet-zoom-box", this._container), K(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
        var r = new ot(this._point, this._startPoint), o = r.getSize();
        Rt(this._box, r.min), this._box.style.width = o.x + "px", this._box.style.height = o.y + "px";
      },
      _finish: function() {
        this._moved && (xt(this._box), Ct(this._container, "leaflet-crosshair")), Ai(), Ko(), pt(document, {
          contextmenu: fn,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseUp: function(e) {
        if (!(e.which !== 1 && e.button !== 1) && (this._finish(), !!this._moved)) {
          this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(h(this._resetState, this), 0);
          var r = new Pt(
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
    ct.addInitHook("addHandler", "boxZoom", Dl), ct.mergeOptions({
      // @option doubleClickZoom: Boolean|String = true
      // Whether the map can be zoomed in by double clicking on it and
      // zoomed out by double clicking while holding shift. If passed
      // `'center'`, double-click zoom will zoom to the center of the
      //  view regardless of where the mouse was.
      doubleClickZoom: !0
    });
    var Zl = Oe.extend({
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
    ct.addInitHook("addHandler", "doubleClickZoom", Zl), ct.mergeOptions({
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
    var Hl = Oe.extend({
      addHooks: function() {
        if (!this._draggable) {
          var e = this._map;
          this._draggable = new Qe(e._mapPane, e._container), this._draggable.on({
            dragstart: this._onDragStart,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this), this._draggable.on("predrag", this._onPreDragLimit, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), e.on("zoomend", this._onZoomEnd, this), e.whenReady(this._onZoomEnd, this));
        }
        K(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
      },
      removeHooks: function() {
        Ct(this._map._container, "leaflet-grab"), Ct(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
          var r = vt(this._map.options.maxBounds);
          this._offsetLimit = zt(
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
          var l = this._lastPos.subtract(this._positions[0]), f = (this._lastTime - this._times[0]) / 1e3, p = o.easeLinearity, b = l.multiplyBy(p / f), S = b.distanceTo([0, 0]), k = Math.min(o.inertiaMaxSpeed, S), O = b.multiplyBy(k / S), D = k / (o.inertiaDeceleration * p), et = O.multiplyBy(-D / 2).round();
          !et.x && !et.y ? r.fire("moveend") : (et = r._limitOffset(et, r.options.maxBounds), U(function() {
            r.panBy(et, {
              duration: D,
              easeLinearity: p,
              noMoveStart: !0,
              animate: !0
            });
          }));
        }
      }
    });
    ct.addInitHook("addHandler", "dragging", Hl), ct.mergeOptions({
      // @option keyboard: Boolean = true
      // Makes the map focusable and allows users to navigate the map with keyboard
      // arrows and `+`/`-` keys.
      keyboard: !0,
      // @option keyboardPanDelta: Number = 80
      // Amount of pixels to pan when pressing an arrow key.
      keyboardPanDelta: 80
    });
    var Wl = Oe.extend({
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
        q(document, "keydown", this._onKeyDown, this);
      },
      _removeHooks: function() {
        pt(document, "keydown", this._onKeyDown, this);
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
          fn(e);
        }
      }
    });
    ct.addInitHook("addHandler", "keyboard", Wl), ct.mergeOptions({
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
    var jl = Oe.extend({
      addHooks: function() {
        q(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
      },
      removeHooks: function() {
        pt(this._map._container, "wheel", this._onWheelScroll, this);
      },
      _onWheelScroll: function(e) {
        var r = _l(e), o = this._map.options.wheelDebounceTime;
        this._delta += r, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
        var c = Math.max(o - (+/* @__PURE__ */ new Date() - this._startTime), 0);
        clearTimeout(this._timer), this._timer = setTimeout(h(this._performZoom, this), c), fn(e);
      },
      _performZoom: function() {
        var e = this._map, r = e.getZoom(), o = this._map.options.zoomSnap || 0;
        e._stop();
        var c = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), l = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(c)))) / Math.LN2, f = o ? Math.ceil(l / o) * o : l, p = e._limitZoom(r + (this._delta > 0 ? f : -f)) - r;
        this._delta = 0, this._startTime = null, p && (e.options.scrollWheelZoom === "center" ? e.setZoom(r + p) : e.setZoomAround(this._lastMousePos, r + p));
      }
    });
    ct.addInitHook("addHandler", "scrollWheelZoom", jl);
    var ly = 600;
    ct.mergeOptions({
      // @section Touch interaction options
      // @option tapHold: Boolean
      // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
      tapHold: F.touchNative && F.safari && F.mobile,
      // @option tapTolerance: Number = 15
      // The max number of pixels a user can shift his finger during touch
      // for it to be considered a valid tap.
      tapTolerance: 15
    });
    var Ul = Oe.extend({
      addHooks: function() {
        q(this._map._container, "touchstart", this._onDown, this);
      },
      removeHooks: function() {
        pt(this._map._container, "touchstart", this._onDown, this);
      },
      _onDown: function(e) {
        if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
          var r = e.touches[0];
          this._startPos = this._newPos = new N(r.clientX, r.clientY), this._holdTimeout = setTimeout(h(function() {
            this._cancel(), this._isTapValid() && (q(document, "touchend", Jt), q(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", r));
          }, this), ly), q(document, "touchend touchcancel contextmenu", this._cancel, this), q(document, "touchmove", this._onMove, this);
        }
      },
      _cancelClickPrevent: function e() {
        pt(document, "touchend", Jt), pt(document, "touchend touchcancel", e);
      },
      _cancel: function() {
        clearTimeout(this._holdTimeout), pt(document, "touchend touchcancel contextmenu", this._cancel, this), pt(document, "touchmove", this._onMove, this);
      },
      _onMove: function(e) {
        var r = e.touches[0];
        this._newPos = new N(r.clientX, r.clientY);
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
    ct.addInitHook("addHandler", "tapHold", Ul), ct.mergeOptions({
      // @section Touch interaction options
      // @option touchZoom: Boolean|String = *
      // Whether the map can be zoomed by touch-dragging with two fingers. If
      // passed `'center'`, it will zoom to the center of the view regardless of
      // where the touch events (fingers) were. Enabled for touch-capable web
      // browsers.
      touchZoom: F.touch,
      // @option bounceAtZoomLimits: Boolean = true
      // Set it to false if you don't want the map to zoom beyond min/max zoom
      // and then bounce back when pinch-zooming.
      bounceAtZoomLimits: !0
    });
    var Vl = Oe.extend({
      addHooks: function() {
        K(this._map._container, "leaflet-touch-zoom"), q(this._map._container, "touchstart", this._onTouchStart, this);
      },
      removeHooks: function() {
        Ct(this._map._container, "leaflet-touch-zoom"), pt(this._map._container, "touchstart", this._onTouchStart, this);
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
          this._animRequest = U(p, this, !0), Jt(e);
        }
      },
      _onTouchEnd: function() {
        if (!this._moved || !this._zooming) {
          this._zooming = !1;
          return;
        }
        this._zooming = !1, G(this._animRequest), pt(document, "touchmove", this._onTouchMove, this), pt(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
      }
    });
    ct.addInitHook("addHandler", "touchZoom", Vl), ct.BoxZoom = Dl, ct.DoubleClickZoom = Zl, ct.Drag = Hl, ct.Keyboard = Wl, ct.ScrollWheelZoom = jl, ct.TapHold = Ul, ct.TouchZoom = Vl, i.Bounds = ot, i.Browser = F, i.CRS = Ut, i.Canvas = Fl, i.Circle = la, i.CircleMarker = ts, i.Class = Tt, i.Control = Te, i.DivIcon = Rl, i.DivOverlay = Re, i.DomEvent = Lg, i.DomUtil = Eg, i.Draggable = Qe, i.Evented = Z, i.FeatureGroup = ze, i.GeoJSON = Ze, i.GridLayer = Zi, i.Handler = Oe, i.Icon = Zn, i.ImageOverlay = ss, i.LatLng = at, i.LatLngBounds = Pt, i.Layer = Pe, i.LayerGroup = Dn, i.LineUtil = Zg, i.Map = ct, i.Marker = Qr, i.Mixin = Ag, i.Path = tn, i.Point = N, i.PolyUtil = Fg, i.Polygon = Hn, i.Polyline = De, i.Popup = os, i.PosAnimation = ml, i.Projection = Hg, i.Rectangle = zl, i.Renderer = He, i.SVG = Wi, i.SVGOverlay = Ol, i.TileLayer = jn, i.Tooltip = as, i.Transformation = ue, i.Util = St, i.VideoOverlay = Il, i.bind = h, i.bounds = zt, i.canvas = Bl, i.circle = Jg, i.circleMarker = Kg, i.control = $i, i.divIcon = sy, i.extend = a, i.featureGroup = Vg, i.geoJSON = Cl, i.geoJson = Qg, i.gridLayer = oy, i.icon = qg, i.imageOverlay = ty, i.latLng = V, i.latLngBounds = vt, i.layerGroup = Ug, i.map = Mg, i.marker = Gg, i.point = $, i.polygon = Xg, i.polyline = Yg, i.popup = iy, i.rectangle = uy, i.setOptions = I, i.stamp = _, i.svg = $l, i.svgOverlay = ny, i.tileLayer = Nl, i.tooltip = ry, i.transformation = cn, i.version = s, i.videoOverlay = ey;
    var hy = window.L;
    i.noConflict = function() {
      return window.L = hy, this;
    }, window.L = i;
  });
})(Pc, Pc.exports);
var Fn = Pc.exports;
const Hr = /* @__PURE__ */ IM(Fn);
function Wr(t, n, i) {
  return Object.freeze({
    instance: t,
    context: n,
    container: i
  });
}
function Bo(t, n) {
  return n == null ? function(s, a) {
    const u = It();
    return u.current || (u.current = t(s, a)), u;
  } : function(s, a) {
    const u = It();
    u.current || (u.current = t(s, a));
    const h = It(s), { instance: d } = u.current;
    return Qt(function() {
      h.current !== s && (n(d, s, h.current), h.current = s);
    }, [
      d,
      s,
      a
    ]), u;
  };
}
function Vp(t, n) {
  Qt(function() {
    return (n.layerContainer ?? n.map).addLayer(t.instance), function() {
      var u;
      (u = n.layerContainer) == null || u.removeLayer(t.instance), n.map.removeLayer(t.instance);
    };
  }, [
    n,
    t
  ]);
}
function qp(t) {
  return function(i) {
    const s = Ao(), a = t(Fo(i, s), s);
    return Hp(s.map, i.attribution), $u(a.current, i.eventHandlers), Vp(a.current, s), a;
  };
}
function OM(t, n) {
  const i = It();
  Qt(function() {
    if (n.pathOptions !== i.current) {
      const a = n.pathOptions ?? {};
      t.instance.setStyle(a), i.current = a;
    }
  }, [
    t,
    n
  ]);
}
function RM(t) {
  return function(i) {
    const s = Ao(), a = t(Fo(i, s), s);
    return $u(a.current, i.eventHandlers), Vp(a.current, s), OM(a.current, i), a;
  };
}
function NM(t, n) {
  const i = Bo(t, n), s = qp(i);
  return Up(s);
}
function AM(t, n) {
  const i = Bo(t), s = MM(i, n);
  return kM(s);
}
function Gp(t, n) {
  const i = Bo(t, n), s = RM(i);
  return Up(s);
}
function FM(t, n) {
  const i = Bo(t, n), s = qp(i);
  return LM(s);
}
function BM(t, n, i) {
  const { opacity: s, zIndex: a } = n;
  s != null && s !== i.opacity && t.setOpacity(s), a != null && a !== i.zIndex && t.setZIndex(a);
}
function Kp() {
  return Ao().map;
}
function $M(t) {
  const n = Kp();
  return Qt(function() {
    return n.on(t), function() {
      n.off(t);
    };
  }, [
    n,
    t
  ]), n;
}
const zM = Gp(function({ center: n, children: i, ...s }, a) {
  const u = new Fn.CircleMarker(n, s);
  return Wr(u, Bu(a, {
    overlayContainer: u
  }));
}, PM);
function xc() {
  return xc = Object.assign || function(t) {
    for (var n = 1; n < arguments.length; n++) {
      var i = arguments[n];
      for (var s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s]);
    }
    return t;
  }, xc.apply(this, arguments);
}
function DM({ bounds: t, boundsOptions: n, center: i, children: s, className: a, id: u, placeholder: h, style: d, whenReady: _, zoom: g, ...w }, v) {
  const [P] = Gt({
    className: a,
    id: u,
    style: d
  }), [x, C] = Gt(null);
  io(v, () => (x == null ? void 0 : x.map) ?? null, [
    x
  ]);
  const I = Jn((lt) => {
    if (lt !== null && x === null) {
      const rt = new Fn.Map(lt, w);
      i != null && g != null ? rt.setView(i, g) : t != null && rt.fitBounds(t, n), _ != null && rt.whenReady(_), C(EM(rt));
    }
  }, []);
  Qt(() => () => {
    x == null || x.map.remove();
  }, [
    x
  ]);
  const W = x ? /* @__PURE__ */ Ia.createElement(jp, {
    value: x
  }, s) : h ?? null;
  return /* @__PURE__ */ Ia.createElement("div", xc({}, P, {
    ref: I
  }), W);
}
const ZM = /* @__PURE__ */ no(DM), br = NM(function({ position: n, ...i }, s) {
  const a = new Fn.Marker(n, i);
  return Wr(a, Bu(s, {
    overlayContainer: a
  }));
}, function(n, i, s) {
  i.position !== s.position && n.setLatLng(i.position), i.icon != null && i.icon !== s.icon && n.setIcon(i.icon), i.zIndexOffset != null && i.zIndexOffset !== s.zIndexOffset && n.setZIndexOffset(i.zIndexOffset), i.opacity != null && i.opacity !== s.opacity && n.setOpacity(i.opacity), n.dragging != null && i.draggable !== s.draggable && (i.draggable === !0 ? n.dragging.enable() : n.dragging.disable());
}), HM = Gp(function({ positions: n, ...i }, s) {
  const a = new Fn.Polyline(n, i);
  return Wr(a, Bu(s, {
    overlayContainer: a
  }));
}, function(n, i, s) {
  i.positions !== s.positions && n.setLatLngs(i.positions);
}), wr = AM(function(n, i) {
  const s = new Fn.Popup(n, i.overlayContainer);
  return Wr(s, i);
}, function(n, i, { position: s }, a) {
  Qt(function() {
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
      var w;
      i.map.off({
        popupopen: d,
        popupclose: _
      }), (w = i.overlayContainer) == null || w.unbindPopup(), i.map.removeLayer(h);
    };
  }, [
    n,
    i,
    a,
    s
  ]);
}), WM = FM(function({ url: n, ...i }, s) {
  const a = new Fn.TileLayer(n, Fo(i, s));
  return Wr(a, s);
}, function(n, i, s) {
  BM(n, i, s);
  const { url: a } = i;
  a != null && a !== s.url && n.setUrl(a);
});
function jM({ bounds: t }) {
  const n = Kp();
  return Qt(() => {
    t && n.fitBounds(t, { padding: [50, 50] });
  }, [n, t]), null;
}
const UM = [51.5074, -0.1278], VM = 13;
function qM({ bounds: t, center: n, zoom: i, children: s }) {
  return /* @__PURE__ */ R(
    ZM,
    {
      center: n || UM,
      zoom: i || VM,
      style: { width: "100%", height: "100%" },
      scrollWheelZoom: !0,
      children: [
        /* @__PURE__ */ M(
          WM,
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        ),
        /* @__PURE__ */ M(jM, { bounds: t }),
        s
      ]
    }
  );
}
function GM(t) {
  return t.map(([n, i]) => [i, n]);
}
const KM = Hr.divIcon({
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
}), JM = Hr.divIcon({
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
function YM({ coordinates: t, startLocation: n, endLocation: i }) {
  if (t.length === 0) return null;
  const s = GM(t);
  return /* @__PURE__ */ R(ei, { children: [
    /* @__PURE__ */ M(
      HM,
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
    n && /* @__PURE__ */ M(br, { position: [n.lat, n.lng], icon: KM, children: /* @__PURE__ */ R(wr, { children: [
      /* @__PURE__ */ M("strong", { children: "Start:" }),
      " ",
      n.label || "Starting point"
    ] }) }),
    i && /* @__PURE__ */ M(br, { position: [i.lat, i.lng], icon: JM, children: /* @__PURE__ */ R(wr, { children: [
      /* @__PURE__ */ M("strong", { children: "End:" }),
      " ",
      i.label || "Destination"
    ] }) })
  ] });
}
const XM = (t) => {
  const n = t ? "#ef4444" : "#32de84", i = t ? "rgba(239, 68, 68, 0.6)" : "rgba(50, 222, 132, 0.6)", s = t ? "animation: bike-pulse 1s ease-in-out infinite;" : "";
  return Hr.divIcon({
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
function QM({ position: t, isWaiting: n = !1 }) {
  if (!t) return null;
  const i = XM(n);
  return /* @__PURE__ */ M(
    br,
    {
      position: [t.lat, t.lng],
      icon: i,
      zIndexOffset: 1e3
    }
  );
}
const Ki = {
  red: "#ef4444",
  yellow: "#f59e0b",
  green: "#22c55e",
  passed: "#6b7280"
};
function tC({
  trafficLights: t,
  currentIndex: n,
  isWaitingAtLight: i,
  elapsedTime: s
}) {
  return /* @__PURE__ */ M(ei, { children: t.map((a, u) => {
    const h = u < n - (i ? 0 : 1), d = i && u === n - 1, _ = u >= n;
    let g, w;
    if (h)
      g = Ki.passed, w = "Passed";
    else if (d)
      g = Ki.red, w = "Waiting...";
    else if (_) {
      const v = Dp(a.timing, s);
      g = Ki[v.phase], w = `${v.phase.charAt(0).toUpperCase() + v.phase.slice(1)}`;
    } else
      g = Ki.passed, w = "Passed";
    return /* @__PURE__ */ M(
      zM,
      {
        center: [a.lat, a.lng],
        radius: 7,
        pathOptions: {
          color: h ? Ki.passed : "#1f2937",
          fillColor: g,
          fillOpacity: h ? 0.4 : 0.9,
          weight: 2
        },
        children: /* @__PURE__ */ M(wr, { children: /* @__PURE__ */ R("div", { children: [
          /* @__PURE__ */ R("strong", { children: [
            "Traffic Light #",
            u + 1
          ] }),
          /* @__PURE__ */ M("br", {}),
          /* @__PURE__ */ M("span", { style: { color: g }, children: w }),
          /* @__PURE__ */ M("br", {}),
          /* @__PURE__ */ R("small", { children: [
            Math.round(a.distanceFromStart),
            "m from start"
          ] })
        ] }) })
      },
      a.id
    );
  }) });
}
const eC = "_container_1nb8y_2", nC = "_mapSection_1nb8y_12", iC = "_mapOverlay_1nb8y_18", rC = "_infoPanel_1nb8y_26", sC = "_costDisplay_1nb8y_38", oC = "_costMain_1nb8y_46", aC = "_costLabel_1nb8y_53", cC = "_costValue_1nb8y_60", uC = "_costComparison_1nb8y_66", lC = "_costRow_1nb8y_71", hC = "_costRowLabel_1nb8y_79", fC = "_costRowValue_1nb8y_83", dC = "_stopRevenue_1nb8y_88", _C = "_liveRevenue_1nb8y_93", mC = "_revenueGrow_1nb8y_1", pC = "_timeStats_1nb8y_107", gC = "_statItem_1nb8y_115", yC = "_statLabel_1nb8y_120", vC = "_statValue_1nb8y_128", bC = "_statWaiting_1nb8y_133", wC = "_waitingIndicator_1nb8y_138", SC = "_waitingDot_1nb8y_150", TC = "_pulse_1nb8y_1", PC = "_finishedSummary_1nb8y_164", xC = "_summaryTitle_1nb8y_172", EC = "_summaryText_1nb8y_178", kC = "_routeStats_1nb8y_184", LC = "_progressContainer_1nb8y_192", MC = "_progressBar_1nb8y_198", CC = "_progressFill_1nb8y_206", IC = "_progressText_1nb8y_213", OC = "_statsGrid_1nb8y_221", RC = "_statBox_1nb8y_228", NC = "_statBoxLabel_1nb8y_233", AC = "_statBoxValue_1nb8y_241", FC = "_statBoxSub_1nb8y_248", BC = "_controls_1nb8y_255", $C = "_controlButtons_1nb8y_266", zC = "_controlButton_1nb8y_266", DC = "_primaryButton_1nb8y_289", ZC = "_secondaryButton_1nb8y_299", HC = "_speedControl_1nb8y_311", WC = "_speedLabel_1nb8y_318", jC = "_speedSlider_1nb8y_323", UC = "_statusIndicator_1nb8y_344", VC = "_statusDot_1nb8y_352", qC = "_statusIdle_1nb8y_359", GC = "_statusLoading_1nb8y_360", KC = "_statusReady_1nb8y_361", JC = "_statusPlaying_1nb8y_362", YC = "_statusPaused_1nb8y_363", XC = "_statusFinished_1nb8y_364", QC = "_locationPicker_1nb8y_367", tI = "_pickerTitle_1nb8y_376", eI = "_pickerButtons_1nb8y_383", nI = "_pickerButton_1nb8y_383", iI = "_pickerActive_1nb8y_408", rI = "_pickerSet_1nb8y_413", sI = "_pickerDot_1nb8y_417", oI = "_pickerHint_1nb8y_423", aI = "_clearButton_1nb8y_433", cI = "_loading_1nb8y_452", uI = "_loadingSpinner_1nb8y_466", lI = "_spin_1nb8y_1", hI = "_error_1nb8y_481", fI = "_errorTitle_1nb8y_492", dI = "_errorMessage_1nb8y_497", _I = "_alternativePricing_1nb8y_502", mI = "_altPricingTitle_1nb8y_510", pI = "_altPricingTable_1nb8y_518", gI = "_altPricingRow_1nb8y_524", yI = "_altPricingLabel_1nb8y_532", vI = "_altPricingValue_1nb8y_536", bI = "_altPricingDivider_1nb8y_541", wI = "_altPricingHighlight_1nb8y_547", SI = "_altPricingNote_1nb8y_564", TI = "_shareButtons_1nb8y_572", PI = "_shareTitle_1nb8y_580", xI = "_shareButtonGroup_1nb8y_588", EI = "_shareButton_1nb8y_572", kI = "_shareTwitter_1nb8y_616", LI = "_shareLinkedIn_1nb8y_625", MI = "_shareCopy_1nb8y_634", E = {
  container: eC,
  mapSection: nC,
  mapOverlay: iC,
  infoPanel: rC,
  costDisplay: sC,
  costMain: oC,
  costLabel: aC,
  costValue: cC,
  costComparison: uC,
  costRow: lC,
  costRowLabel: hC,
  costRowValue: fC,
  stopRevenue: dC,
  liveRevenue: _C,
  revenueGrow: mC,
  timeStats: pC,
  statItem: gC,
  statLabel: yC,
  statValue: vC,
  statWaiting: bC,
  waitingIndicator: wC,
  waitingDot: SC,
  pulse: TC,
  finishedSummary: PC,
  summaryTitle: xC,
  summaryText: EC,
  routeStats: kC,
  progressContainer: LC,
  progressBar: MC,
  progressFill: CC,
  progressText: IC,
  statsGrid: OC,
  statBox: RC,
  statBoxLabel: NC,
  statBoxValue: AC,
  statBoxSub: FC,
  controls: BC,
  controlButtons: $C,
  controlButton: zC,
  primaryButton: DC,
  secondaryButton: ZC,
  speedControl: HC,
  speedLabel: WC,
  speedSlider: jC,
  statusIndicator: UC,
  statusDot: VC,
  statusIdle: qC,
  statusLoading: GC,
  statusReady: KC,
  statusPlaying: JC,
  statusPaused: YC,
  statusFinished: XC,
  locationPicker: QC,
  pickerTitle: tI,
  pickerButtons: eI,
  pickerButton: nI,
  pickerActive: iI,
  pickerSet: rI,
  pickerDot: sI,
  pickerHint: oI,
  clearButton: aI,
  loading: cI,
  loadingSpinner: uI,
  spin: lI,
  error: hI,
  errorTitle: fI,
  errorMessage: dI,
  alternativePricing: _I,
  altPricingTitle: mI,
  altPricingTable: pI,
  altPricingRow: gI,
  altPricingLabel: yI,
  altPricingValue: vI,
  altPricingDivider: bI,
  altPricingHighlight: wI,
  altPricingNote: SI,
  shareButtons: TI,
  shareTitle: PI,
  shareButtonGroup: xI,
  shareButton: EI,
  shareTwitter: kI,
  shareLinkedIn: LI,
  shareCopy: MI
};
function Ji(t) {
  return `£${t.toFixed(2)}`;
}
function Ma(t) {
  const n = Math.floor(t / 60), i = Math.floor(t % 60);
  return `${n}:${i.toString().padStart(2, "0")}`;
}
function CI({ costs: t, state: n, perMinuteRate: i }) {
  const { status: s, elapsedTime: a, totalWaitTime: u, currentWaitTime: h, isWaitingAtLight: d, lightsEncountered: _ } = n, g = u + (d ? h : 0), w = s === "finished", v = h / 60 * i;
  return /* @__PURE__ */ R("div", { className: E.costDisplay, children: [
    /* @__PURE__ */ R("div", { className: E.costMain, children: [
      /* @__PURE__ */ M("div", { className: E.costLabel, children: "Current Cost" }),
      /* @__PURE__ */ M("div", { className: E.costValue, children: Ji(t.totalCost) })
    ] }),
    /* @__PURE__ */ R("div", { className: E.costComparison, children: [
      /* @__PURE__ */ R("div", { className: E.costRow, children: [
        /* @__PURE__ */ M("span", { className: E.costRowLabel, children: "Uninterrupted ride:" }),
        /* @__PURE__ */ M("span", { className: E.costRowValue, children: Ji(t.idealCost) })
      ] }),
      /* @__PURE__ */ R("div", { className: `${E.costRow} ${E.stopRevenue}`, children: [
        /* @__PURE__ */ M("span", { className: E.costRowLabel, children: "Stop-time revenue:" }),
        /* @__PURE__ */ M("span", { className: E.costRowValue, children: Ji(t.stopRevenue) })
      ] })
    ] }),
    /* @__PURE__ */ R("div", { className: E.timeStats, children: [
      /* @__PURE__ */ R("div", { className: E.statItem, children: [
        /* @__PURE__ */ M("span", { className: E.statLabel, children: "Ride time" }),
        /* @__PURE__ */ M("span", { className: E.statValue, children: Ma(a) })
      ] }),
      /* @__PURE__ */ R("div", { className: E.statItem, children: [
        /* @__PURE__ */ M("span", { className: E.statLabel, children: "Time stopped" }),
        /* @__PURE__ */ M("span", { className: `${E.statValue} ${E.statWaiting}`, children: Ma(g) })
      ] }),
      /* @__PURE__ */ R("div", { className: E.statItem, children: [
        /* @__PURE__ */ M("span", { className: E.statLabel, children: "Traffic lights" }),
        /* @__PURE__ */ M("span", { className: E.statValue, children: _ })
      ] })
    ] }),
    d && /* @__PURE__ */ R("div", { className: E.waitingIndicator, children: [
      /* @__PURE__ */ M("div", { className: E.waitingDot }),
      /* @__PURE__ */ M("span", { children: "Stopped at light" }),
      /* @__PURE__ */ R("span", { className: E.liveRevenue, children: [
        "+",
        Ji(v)
      ] })
    ] }),
    w && /* @__PURE__ */ R("div", { className: E.finishedSummary, children: [
      /* @__PURE__ */ M("div", { className: E.summaryTitle, children: "Ride Complete" }),
      /* @__PURE__ */ R("div", { className: E.summaryText, children: [
        "Stopped at ",
        /* @__PURE__ */ M("strong", { children: _ }),
        " traffic light",
        _ !== 1 ? "s" : "",
        " for ",
        /* @__PURE__ */ M("strong", { children: Ma(g) }),
        ". Stop-time revenue: ",
        /* @__PURE__ */ M("strong", { children: Ji(t.stopRevenue) }),
        "."
      ] })
    ] })
  ] });
}
function Ca(t) {
  return t >= 1e3 ? `${(t / 1e3).toFixed(2)} km` : `${Math.round(t)} m`;
}
function II(t) {
  return `${(t * 2.237).toFixed(1)} mph`;
}
function OI({ state: t, totalDistance: n, totalTrafficLights: i }) {
  const { distanceTraveled: s, currentSpeed: a, routeProgress: u, currentTrafficLightIndex: h } = t, d = n - s, _ = i - h, g = Math.round(u * 100);
  return /* @__PURE__ */ R("div", { className: E.routeStats, children: [
    /* @__PURE__ */ R("div", { className: E.progressContainer, children: [
      /* @__PURE__ */ M("div", { className: E.progressBar, children: /* @__PURE__ */ M(
        "div",
        {
          className: E.progressFill,
          style: { width: `${g}%` }
        }
      ) }),
      /* @__PURE__ */ R("span", { className: E.progressText, children: [
        g,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ R("div", { className: E.statsGrid, children: [
      /* @__PURE__ */ R("div", { className: E.statBox, children: [
        /* @__PURE__ */ M("span", { className: E.statBoxLabel, children: "Distance" }),
        /* @__PURE__ */ M("span", { className: E.statBoxValue, children: Ca(s) }),
        /* @__PURE__ */ R("span", { className: E.statBoxSub, children: [
          "of ",
          Ca(n)
        ] })
      ] }),
      /* @__PURE__ */ R("div", { className: E.statBox, children: [
        /* @__PURE__ */ M("span", { className: E.statBoxLabel, children: "Speed" }),
        /* @__PURE__ */ M("span", { className: E.statBoxValue, children: II(a) }),
        /* @__PURE__ */ R("span", { className: E.statBoxSub, children: [
          "max ",
          be.MAX_SPEED_MPH,
          " mph"
        ] })
      ] }),
      /* @__PURE__ */ R("div", { className: E.statBox, children: [
        /* @__PURE__ */ M("span", { className: E.statBoxLabel, children: "Remaining" }),
        /* @__PURE__ */ M("span", { className: E.statBoxValue, children: Ca(d) }),
        /* @__PURE__ */ R("span", { className: E.statBoxSub, children: [
          _,
          " lights ahead"
        ] })
      ] })
    ] })
  ] });
}
function Yi(t) {
  return `£${t.toFixed(2)}`;
}
function RI({ costs: t, totalDistance: n }) {
  const i = n / 1e3;
  return /* @__PURE__ */ R("div", { className: E.alternativePricing, children: [
    /* @__PURE__ */ M("div", { className: E.altPricingTitle, children: "Pricing Model Comparison" }),
    /* @__PURE__ */ R("div", { className: E.altPricingTable, children: [
      /* @__PURE__ */ R("div", { className: E.altPricingRow, children: [
        /* @__PURE__ */ M("span", { className: E.altPricingLabel, children: "Per-minute (current)" }),
        /* @__PURE__ */ M("span", { className: E.altPricingValue, children: Yi(t.totalCost) })
      ] }),
      /* @__PURE__ */ R("div", { className: E.altPricingRow, children: [
        /* @__PURE__ */ R("span", { className: E.altPricingLabel, children: [
          "Per-distance (",
          Yi(Sc.PER_KM),
          "/km)"
        ] }),
        /* @__PURE__ */ M("span", { className: E.altPricingValue, children: Yi(t.distanceBasedCost) })
      ] }),
      /* @__PURE__ */ R("div", { className: E.altPricingRow, children: [
        /* @__PURE__ */ M("span", { className: E.altPricingLabel, children: "Motion-only" }),
        /* @__PURE__ */ M("span", { className: E.altPricingValue, children: Yi(t.motionOnlyCost) })
      ] })
    ] }),
    /* @__PURE__ */ M("div", { className: E.altPricingDivider }),
    /* @__PURE__ */ R("div", { className: `${E.altPricingRow} ${E.altPricingHighlight}`, children: [
      /* @__PURE__ */ M("span", { className: E.altPricingLabel, children: "Stop-time revenue" }),
      /* @__PURE__ */ M("span", { className: E.altPricingValue, children: Yi(t.stopRevenue) })
    ] }),
    /* @__PURE__ */ R("div", { className: E.altPricingNote, children: [
      "Distance: ",
      i.toFixed(2),
      " km"
    ] })
  ] });
}
function NI(t) {
  return `£${t.toFixed(2)}`;
}
function AI(t) {
  const n = Math.floor(t / 60), i = Math.floor(t % 60);
  return n === 0 ? `${i}s` : `${n}m ${i}s`;
}
function FI(t) {
  return `${(t / 1e3).toFixed(1)}km`;
}
function BI({ totalDistance: t, stopCount: n, stopTime: i, stopRevenue: s }) {
  const [a, u] = Gt(!1), h = `My ${FI(t)} Lime ride:
Stopped at ${n} traffic light${n !== 1 ? "s" : ""} for ${AI(i)}.
Stop-time revenue: ${NI(s)}.

Lime charges by the minute. See your own ride costs:`, d = typeof window < "u" ? window.location.href : "", _ = () => {
    const v = `https://twitter.com/intent/tweet?text=${encodeURIComponent(h)}&url=${encodeURIComponent(d)}`;
    window.open(v, "_blank", "width=550,height=420");
  }, g = () => {
    const v = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(d)}`;
    window.open(v, "_blank", "width=550,height=420");
  }, w = async () => {
    const v = `${h}
${d}`;
    try {
      await navigator.clipboard.writeText(v), u(!0), setTimeout(() => u(!1), 2e3);
    } catch {
      const P = document.createElement("textarea");
      P.value = v, document.body.appendChild(P), P.select(), document.execCommand("copy"), document.body.removeChild(P), u(!0), setTimeout(() => u(!1), 2e3);
    }
  };
  return /* @__PURE__ */ R("div", { className: E.shareButtons, children: [
    /* @__PURE__ */ M("div", { className: E.shareTitle, children: "Share your ride" }),
    /* @__PURE__ */ R("div", { className: E.shareButtonGroup, children: [
      /* @__PURE__ */ R(
        "button",
        {
          className: `${E.shareButton} ${E.shareTwitter}`,
          onClick: _,
          title: "Share on X (Twitter)",
          children: [
            /* @__PURE__ */ M("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) }),
            /* @__PURE__ */ M("span", { children: "Tweet" })
          ]
        }
      ),
      /* @__PURE__ */ R(
        "button",
        {
          className: `${E.shareButton} ${E.shareLinkedIn}`,
          onClick: g,
          title: "Share on LinkedIn",
          children: [
            /* @__PURE__ */ M("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }) }),
            /* @__PURE__ */ M("span", { children: "LinkedIn" })
          ]
        }
      ),
      /* @__PURE__ */ R(
        "button",
        {
          className: `${E.shareButton} ${E.shareCopy}`,
          onClick: w,
          title: "Copy to clipboard",
          children: [
            /* @__PURE__ */ R("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
function $I({
  status: t,
  onPlay: n,
  onPause: i,
  onReset: s,
  isReady: a,
  simulationSpeed: u,
  onSpeedChange: h
}) {
  const d = t === "playing", _ = t === "finished", g = t === "paused";
  return /* @__PURE__ */ R("div", { className: E.controls, children: [
    /* @__PURE__ */ R("div", { className: E.controlButtons, children: [
      !_ && /* @__PURE__ */ M(
        "button",
        {
          className: `${E.controlButton} ${E.primaryButton}`,
          onClick: d ? i : n,
          disabled: !a,
          children: d ? /* @__PURE__ */ R(ei, { children: [
            /* @__PURE__ */ M(DI, {}),
            " Pause"
          ] }) : /* @__PURE__ */ R(ei, { children: [
            /* @__PURE__ */ M(zI, {}),
            " ",
            g ? "Resume" : "Start Ride"
          ] })
        }
      ),
      (g || _) && /* @__PURE__ */ R(
        "button",
        {
          className: `${E.controlButton} ${E.secondaryButton}`,
          onClick: s,
          children: [
            /* @__PURE__ */ M(ZI, {}),
            " Reset"
          ]
        }
      )
    ] }),
    h && /* @__PURE__ */ R("div", { className: E.speedControl, children: [
      /* @__PURE__ */ R("label", { className: E.speedLabel, children: [
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
          onChange: (w) => h(Number(w.target.value)),
          className: E.speedSlider
        }
      )
    ] }),
    /* @__PURE__ */ R("div", { className: E.statusIndicator, children: [
      /* @__PURE__ */ M("span", { className: `${E.statusDot} ${E[`status${t.charAt(0).toUpperCase() + t.slice(1)}`]}` }),
      /* @__PURE__ */ R("span", { className: E.statusText, children: [
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
function zI() {
  return /* @__PURE__ */ M("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M8 5v14l11-7z" }) });
}
function DI() {
  return /* @__PURE__ */ M("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M6 4h4v16H6V4zm8 0h4v16h-4V4z" }) });
}
function ZI() {
  return /* @__PURE__ */ M("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ M("path", { d: "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" }) });
}
function HI({ mode: t, onStartChange: n, onEndChange: i }) {
  return $M({
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
const WI = Hr.divIcon({
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
}), jI = Hr.divIcon({
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
function UI({
  startLocation: t,
  endLocation: n,
  onStartChange: i,
  onEndChange: s,
  isEnabled: a,
  pickerMode: u,
  onModeChange: h
}) {
  return a ? /* @__PURE__ */ R(ei, { children: [
    /* @__PURE__ */ M(
      HI,
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
    t && /* @__PURE__ */ M(br, { position: [t.lat, t.lng], icon: WI, children: /* @__PURE__ */ M(wr, { children: "Start location" }) }),
    n && /* @__PURE__ */ M(br, { position: [n.lat, n.lng], icon: jI, children: /* @__PURE__ */ M(wr, { children: "End location" }) })
  ] }) : null;
}
function VI({
  startLocation: t,
  endLocation: n,
  pickerMode: i,
  onModeChange: s,
  onClear: a
}) {
  const u = t || n, h = t && n;
  return /* @__PURE__ */ R("div", { className: E.locationPicker, children: [
    /* @__PURE__ */ M("div", { className: E.pickerTitle, children: "Set Route" }),
    /* @__PURE__ */ R("div", { className: E.pickerButtons, children: [
      /* @__PURE__ */ R(
        "button",
        {
          className: `${E.pickerButton} ${i === "start" ? E.pickerActive : ""} ${t ? E.pickerSet : ""}`,
          onClick: () => s(i === "start" ? null : "start"),
          children: [
            /* @__PURE__ */ M("span", { className: E.pickerDot, style: { background: "#22c55e" } }),
            t ? "Start set" : "Set start"
          ]
        }
      ),
      /* @__PURE__ */ R(
        "button",
        {
          className: `${E.pickerButton} ${i === "end" ? E.pickerActive : ""} ${n ? E.pickerSet : ""}`,
          onClick: () => s(i === "end" ? null : "end"),
          children: [
            /* @__PURE__ */ M("span", { className: E.pickerDot, style: { background: "#ef4444" } }),
            n ? "End set" : "Set end"
          ]
        }
      )
    ] }),
    i && /* @__PURE__ */ R("div", { className: E.pickerHint, children: [
      "Click on the map to set ",
      i,
      " location"
    ] }),
    u && !h && /* @__PURE__ */ R("div", { className: E.pickerHint, children: [
      !t && "Click to set start location",
      !n && t && "Now click to set end location"
    ] }),
    u && /* @__PURE__ */ M("button", { className: E.clearButton, onClick: a, children: "Clear locations" })
  ] });
}
const qI = 1, GI = 0.2, KI = 10;
function eO({
  startLocation: t,
  endLocation: n,
  unlockFee: i = qI,
  perMinuteRate: s = GI,
  simulationSpeed: a = KI,
  width: u = "100%",
  height: h = 600,
  showControls: d = !0,
  allowLocationPicker: _ = !0
}) {
  const [g, w] = Gt(null), [v, P] = Gt(null), [x, C] = Gt(
    t ? n ? null : "end" : "start"
  ), [I, W] = Gt(a), lt = t || g || void 0, rt = n || v || void 0, dt = _ && (!t || !n), {
    route: _t,
    coordinates: Et,
    cumulativeDistances: Mt,
    isLoading: ee,
    error: mt
  } = Ly(lt, rt), {
    trafficLights: wt,
    isLoading: it,
    error: U
  } = vM(Et), G = (_t == null ? void 0 : _t.distance) || 0, {
    state: St,
    position: Tt,
    play: Me,
    pause: st,
    reset: Z,
    isReady: N
  } = wM({
    coordinates: Et,
    cumulativeDistances: Mt,
    trafficLights: wt,
    totalDistance: G,
    simulationSpeed: I
  }), _e = SM({
    state: St,
    totalDistance: G,
    unlockFee: i,
    perMinuteRate: s
  }), $ = hd(() => {
    if (Et.length < 2) return;
    let at = 1 / 0, V = -1 / 0, Ut = 1 / 0, Vt = -1 / 0;
    for (const [$e, Dt] of Et)
      at = Math.min(at, Dt), V = Math.max(V, Dt), Ut = Math.min(Ut, $e), Vt = Math.max(Vt, $e);
    return [
      [at, Ut],
      [V, Vt]
    ];
  }, [Et]), ot = ee || it, zt = mt || U, Pt = {
    width: typeof u == "number" ? `${u}px` : u,
    height: typeof h == "number" ? `${h}px` : h
  }, vt = () => {
    w(null), P(null), C("start");
  };
  return /* @__PURE__ */ M("div", { className: E.container, style: Pt, children: /* @__PURE__ */ R("div", { className: E.mapSection, children: [
    /* @__PURE__ */ R(qM, { bounds: $, children: [
      dt && /* @__PURE__ */ M(
        UI,
        {
          startLocation: g,
          endLocation: v,
          onStartChange: w,
          onEndChange: P,
          isEnabled: dt,
          pickerMode: x,
          onModeChange: C
        }
      ),
      /* @__PURE__ */ M(
        YM,
        {
          coordinates: Et,
          startLocation: lt,
          endLocation: rt
        }
      ),
      /* @__PURE__ */ M(
        tC,
        {
          trafficLights: wt,
          currentIndex: St.currentTrafficLightIndex,
          isWaitingAtLight: St.isWaitingAtLight,
          elapsedTime: St.elapsedTime
        }
      ),
      /* @__PURE__ */ M(
        QM,
        {
          position: Tt,
          isWaiting: St.isWaitingAtLight
        }
      )
    ] }),
    dt && /* @__PURE__ */ M("div", { className: E.mapOverlay, children: /* @__PURE__ */ M(
      VI,
      {
        startLocation: g,
        endLocation: v,
        pickerMode: x,
        onModeChange: C,
        onClear: vt
      }
    ) }),
    /* @__PURE__ */ R("div", { className: E.infoPanel, children: [
      ot && /* @__PURE__ */ R("div", { className: E.loading, children: [
        /* @__PURE__ */ M("div", { className: E.loadingSpinner }),
        /* @__PURE__ */ M("span", { children: ee ? "Finding route..." : "Detecting traffic lights..." })
      ] }),
      zt && !ot && /* @__PURE__ */ R("div", { className: E.error, children: [
        /* @__PURE__ */ M("div", { className: E.errorTitle, children: "Error" }),
        /* @__PURE__ */ M("div", { className: E.errorMessage, children: zt })
      ] }),
      !ot && !zt && _t && /* @__PURE__ */ R(ei, { children: [
        d && /* @__PURE__ */ M(
          $I,
          {
            status: St.status,
            onPlay: Me,
            onPause: st,
            onReset: Z,
            isReady: N,
            simulationSpeed: I,
            onSpeedChange: W
          }
        ),
        /* @__PURE__ */ M(CI, { costs: _e, state: St, perMinuteRate: s }),
        /* @__PURE__ */ M(
          OI,
          {
            state: St,
            totalDistance: G,
            totalTrafficLights: wt.length
          }
        ),
        St.status === "finished" && /* @__PURE__ */ M(RI, { costs: _e, totalDistance: G }),
        St.status === "finished" && /* @__PURE__ */ M(
          BI,
          {
            totalDistance: G,
            stopCount: St.lightsEncountered,
            stopTime: St.totalWaitTime,
            stopRevenue: _e.stopRevenue
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  be as BIKE_PHYSICS,
  eO as LimeBikeSimulator
};
