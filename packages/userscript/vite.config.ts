import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "Save YouTube Video to Obsidian (Dev)",
        namespace: "Violentmonkey Scripts",
        icon: "https://www.youtube.com/s/desktop/5af4fee3/img/favicon.ico",
        version: "1.0.0",
        match: ["https://www.youtube.com/watch*"],
        author: "Darsh Gupta",
        description: "Save YouTube videos to Obsidian",
        grant: ["GM_xmlhttpRequest", "GM_setValue", "GM_getValue", "GM_addValueChangeListener"],
      },
    }),
  ],
});
