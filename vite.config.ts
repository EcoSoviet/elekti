import vue from "@vitejs/plugin-vue";
import { FontaineTransform } from "fontaine";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    FontaineTransform.vite({
      fallbacks: [
        "Inter",
        "Inter Variable",
        "Inter Tight Variable",
        "Helvetica Neue",
        "Arial",
        "Roboto",
        "Segoe UI",
        "system-ui",
      ],
      resolvePath: (id) => (id.startsWith("/") ? "." + id : id),
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  cacheDir: ".vite",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/vue")) {
            return "vue";
          }
          if (id.includes("node_modules/vue-router")) {
            return "vue-router";
          }
          if (id.includes("node_modules/pinia")) {
            return "pinia";
          }
          if (id.includes("node_modules/vue-i18n")) {
            return "vue-i18n";
          }
          if (id.includes("node_modules/zod")) {
            return "zod";
          }
          if (id.includes("node_modules/lucide-vue-next")) {
            return "lucide-icons";
          }
          if (id.includes("/data/") && id.endsWith(".json")) {
            return "data";
          }
          if (id.includes("/translations/") && id.endsWith(".json")) {
            return "i18n-data";
          }
        },
      },
      onwarn(warning, warn) {
        if (
          warning.code === "IMPORT_IS_UNDEFINED" &&
          warning.message.includes("vue-i18n")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
