import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const apiDir = path.join(rootDir, "artifacts", "api-server");

const child = spawn("pnpm", ["--dir", apiDir, "start"], {
  cwd: apiDir,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "production",
    PORT: process.env.PORT || "10000",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`[render-start] API server stopped with signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 0);
});
