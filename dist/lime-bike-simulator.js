import { B as s, L as p } from "./LimeBikeSimulator-6yutZyqr.js";
import { jsx as t } from "react/jsx-runtime";
import { lazy as r, Suspense as o } from "react";
const l = r(
  () => import("./LimeBikeSimulator-6yutZyqr.js").then((e) => e.a).then((e) => ({ default: e.LimeBikeSimulator }))
);
function d({
  fallback: e,
  height: a = 600,
  ...i
}) {
  return /* @__PURE__ */ t(o, { fallback: e ?? /* @__PURE__ */ t(
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
  ), children: /* @__PURE__ */ t(l, { height: a, ...i }) });
}
export {
  s as BIKE_PHYSICS,
  p as LimeBikeSimulator,
  d as LimeBikeSimulatorLazy
};
