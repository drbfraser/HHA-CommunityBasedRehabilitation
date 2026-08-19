import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        dedupe: ["react", "react-dom"],
        alias: {
            "@cbr/common": path.resolve(__dirname, "../common/src"),
            history: path.resolve(__dirname, "node_modules/history"),
        },
    },
    server: {
        port: 3000,
        fs: {
            allow: [path.resolve(__dirname), path.resolve(__dirname, "../common/src")],
        },
    },
    build: {
        outDir: "build",
    },
});