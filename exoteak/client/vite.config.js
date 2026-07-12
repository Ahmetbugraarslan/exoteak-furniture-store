import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Gelistirme sirasinda /api ve /uploads isteklerini backend'e yonlendir.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
      "/uploads": "http://localhost:4000",
    },
  },
});
