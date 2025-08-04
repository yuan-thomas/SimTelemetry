import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  define: {
    // expose env vars for WebSocket URL & horizon
    // For dev: use localhost:8765, for production: use same hostname as served page
    "import.meta.env.VITE_WS_URL": JSON.stringify(process.env.NODE_ENV === 'production' ? null : 'ws://localhost:8765/telemetry'),
    "import.meta.env.VITE_REALTIME_SEC": "30"
  }
});
