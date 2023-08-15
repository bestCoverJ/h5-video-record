import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";
// import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    basicSsl(),
    vue(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    https: true,
    proxy: {
      // api是自行设置的请求前缀，任何请求路径以/api开头的请求将被代理到对应的target目标
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
