// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // 👉 PRODUÇÃO: assets sob /static/
  base: mode === "production" ? "/static/" : "/",

  server: {
    host: "::",
    port: 8080,
    // proxy só vale no DEV
    proxy: {
      "/api": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/accounts": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/admin": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/static": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/media": { target: "http://127.0.0.1:8000", changeOrigin: true },
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
