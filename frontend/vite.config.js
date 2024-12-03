import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { DEV } from "./src/app/config";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "/home/user/aiclient-prototype/prod/", "");
  const define = !DEV
    ? {
        "process.env": env,
      }
    : {};
  return {
    define: define,
    plugins: [react()],
    server: {
      host: true,
    },
  };
});
