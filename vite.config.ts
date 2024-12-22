import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath, URL } from "url";
import { spawn } from "child_process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    {
      name: "start-mcp-server",
      configureServer(server) {
        const mcpServerPath = fileURLToPath(
          new URL("./src/api/index.ts", import.meta.url)
        );
        const mcpServer = spawn("npx", ["tsx", mcpServerPath]);

        mcpServer.stdout.on("data", (data) => {
          console.log(`MCP Server: ${data}`);
        });

        mcpServer.stderr.on("data", (data) => {
          console.error(`MCP Server Error: ${data}`);
        });

        mcpServer.on("close", (code) => {
          console.log(`MCP Server exited with code ${code}`);
        });

        server.watcher.on("restart", () => {
          mcpServer.kill();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
