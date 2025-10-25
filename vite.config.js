import { defineConfig } from "vite";

export default defineConfig({
  base: "/deployet/", // ✅ DÜZELTİLMİŞ,
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        signin: "signin.html",
        register: "register.html",
        menu: "menu.html",
        cart: "cart.html",
      },
    },
  },
});
