import { jsx as n, Fragment as m } from "react/jsx-runtime";
import { useState as u, useEffect as d } from "react";
function c({
  fallback: o,
  height: e = 600,
  ...i
}) {
  const [r, a] = u(null);
  d(() => {
    import("./LimeBikeSimulator-6yutZyqr.js").then((t) => t.a).then((t) => {
      a(() => t.LimeBikeSimulator);
    }), import("./LimeBikeSimulator.module-C8DGL4Vo.js");
  }, []);
  const l = /* @__PURE__ */ n(
    "div",
    {
      style: {
        height: typeof e == "number" ? e : 600,
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
  );
  return r ? /* @__PURE__ */ n(r, { height: e, ...i }) : /* @__PURE__ */ n(m, { children: o ?? l });
}
export {
  c as LimeBikeSimulator,
  c as default
};
