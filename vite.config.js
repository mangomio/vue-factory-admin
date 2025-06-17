import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: 'http://192.168.224.232:8080', // 后端 API 地址
        target: "http://ytt2wx.natappfree.cc",
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径
      },
    },
  },
  // devServer: {
  //   before:require('./mock')
  // }
});
