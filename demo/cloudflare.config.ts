import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    "name": "lime-bike-simulator-demo",
    "compatibilityDate": "2026-10-23",
    "observability": {
      "enabled": true
    },
    "assets": {
      "notFoundHandling": "single-page-application"
    }
  }
});
