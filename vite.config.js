import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/patala-pay/",
  plugins: [react(), {
    name: 'patala-company-route',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/patala-pay' || req.url?.startsWith('/patala-pay?')) req.url = req.url.replace('/patala-pay', '/patala-pay/');
        next();
      });
    },
  }],
  server: {
    host: "127.0.0.1",
    port: 8085,
  },
});
