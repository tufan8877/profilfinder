import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const port = String(process.env.PORT || 10000);
const host = "0.0.0.0";

const ignoredDirs = new Set([
  ".git",
  "node_modules",
  ".cache",
  ".next",
  ".turbo",
  ".vercel",
  ".render",
]);

function exists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function walkDirectories(startDir, maxDepth = 5) {
  const results = [];

  function walk(currentDir, depth) {
    if (depth > maxDepth) return;

    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (ignoredDirs.has(entry.name)) continue;

      const fullPath = path.join(currentDir, entry.name);
      results.push(fullPath);
      walk(fullPath, depth + 1);
    }
  }

  walk(startDir, 0);
  return results;
}

function findStartableWorkspacePackage() {
  const packageDirs = [rootDir, ...walkDirectories(rootDir)].filter((dir) =>
    exists(path.join(dir, "package.json")),
  );

  const candidates = packageDirs
    .map((dir) => ({ dir, pkg: readJson(path.join(dir, "package.json")) }))
    .filter(({ dir, pkg }) => {
      if (!pkg?.scripts?.start) return false;
      if (dir === rootDir) return false;
      if (pkg.name === "@workspace/scripts") return false;
      return true;
    })
    .sort((a, b) => {
      const score = (item) => {
        const rel = path.relative(rootDir, item.dir).replaceAll("\\", "/");
        if (rel.startsWith("artifacts/")) return 0;
        if (rel.startsWith("apps/")) return 1;
        if (rel.includes("server") || rel.includes("api")) return 2;
        return 3;
      };
      return score(a) - score(b);
    });

  return candidates[0] || null;
}

function spawnProcess(command, args, cwd) {
  console.log(`[render-start] Starting: ${command} ${args.join(" ")} in ${cwd}`);
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || "production",
      PORT: port,
    },
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`[render-start] Process stopped with signal ${signal}`);
      process.exit(1);
    }
    process.exit(code ?? 0);
  });
}

function findServerEntry() {
  const dirs = [rootDir, ...walkDirectories(rootDir, 4)];
  const entryNames = [
    "dist/index.js",
    "dist/server/index.js",
    "build/index.js",
    "build/server/index.js",
    "server/index.js",
    "server/index.mjs",
    "index.js",
  ];

  for (const dir of dirs) {
    for (const entry of entryNames) {
      const fullPath = path.join(dir, entry);
      if (exists(fullPath)) return fullPath;
    }
  }

  return null;
}

function findStaticDir() {
  const dirs = [rootDir, ...walkDirectories(rootDir, 4)];
  const staticNames = ["dist/public", "dist", "build", "public", "client/dist", "client/build"];

  for (const dir of dirs) {
    for (const staticName of staticNames) {
      const staticDir = path.join(dir, staticName);
      if (exists(path.join(staticDir, "index.html"))) return staticDir;
    }
  }

  return null;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    default:
      return "application/octet-stream";
  }
}

function serveStatic(staticDir) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
    let filePath = path.normalize(path.join(staticDir, requestedPath));

    if (!filePath.startsWith(staticDir)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (!exists(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(staticDir, "index.html");
    }

    try {
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal Server Error");
    }
  });

  server.listen(Number(port), host, () => {
    console.log(`[render-start] Static app served from ${staticDir}`);
    console.log(`[render-start] Listening on ${host}:${port}`);
  });
}

function serveFallback() {
  const message = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ProfilFinder.at - Render bereit</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f8fafc; color: #111827; }
    main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    section { max-width: 720px; background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
    h1 { margin: 0 0 12px; color: #0f5ea8; }
    p { line-height: 1.6; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 6px; }
  </style>
</head>
<body>
  <main>
    <section>
      <h1>ProfilFinder.at ist auf Render erreichbar</h1>
      <p>Render konnte den Dienst starten, aber in diesem Repository wurde noch kein fertiger Web-App-Startpunkt gefunden.</p>
      <p>Lade bitte den vollständigen ProfilFinder-Code hoch, z. B. mit <code>server/index.ts</code>, <code>dist/index.js</code> oder einem App-Paket mit eigenem <code>start</code>-Script.</p>
    </section>
  </main>
</body>
</html>`;

  const server = http.createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(message);
  });

  server.listen(Number(port), host, () => {
    console.warn("[render-start] No application entry point found. Serving fallback page.");
    console.log(`[render-start] Listening on ${host}:${port}`);
  });
}

const workspacePackage = findStartableWorkspacePackage();
if (workspacePackage) {
  spawnProcess("pnpm", ["--dir", workspacePackage.dir, "start"], workspacePackage.dir);
} else {
  const serverEntry = findServerEntry();
  if (serverEntry) {
    spawnProcess("node", [serverEntry], path.dirname(serverEntry));
  } else {
    const staticDir = findStaticDir();
    if (staticDir) {
      serveStatic(staticDir);
    } else {
      serveFallback();
    }
  }
}
