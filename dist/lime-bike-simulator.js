import { B as p, d as f, L as b, P as L, a as S, b as k, c as P, l as y, p as B, r as F, s as x, t as C } from "./LimeBikeSimulator-BT5l6h4h.js";
import { jsx as t } from "react/jsx-runtime";
import { lazy as i, Suspense as l } from "react";
const o = i(
  () => import("./LimeBikeSimulator-BT5l6h4h.js").then((e) => e.e).then((e) => ({ default: e.LimeBikeSimulator }))
);
function u({
  fallback: e,
  height: a = 600,
  ...r
}) {
  return /* @__PURE__ */ t(l, { fallback: e ?? /* @__PURE__ */ t(
    "div",
    {
      style: {
        height: typeof a == "number" ? a : 600,
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666",
        fontSize: 14
      },
      children: "Loading map..."
    }
  ), children: /* @__PURE__ */ t(o, { height: a, ...r }) });
}
export {
  p as BIKE_PHYSICS,
  f as LIME,
  b as LimeBikeSimulator,
  u as LimeBikeSimulatorLazy,
  L as PACE_PROFILES,
  S as billedMinutes,
  k as buildPlan,
  P as createContext,
  y as limeFare,
  B as planFromPrecomputed,
  F as runForecast,
  x as simulateRide,
  C as toPrecomputed
};
