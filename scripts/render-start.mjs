import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 10000);
const host = "0.0.0.0";

const staticDir = path.join(rootDir, "artifacts", "profil-finder", "dist", "public");
const indexFile = path.join(staticDir, "index.html");

function exists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
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
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

if (!exists(indexFile)) {
  console.error(`[render-start] Build output not found: ${indexFile}`);
  console.error("[render-start] Run the build command before starting the service.");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  let filePath = path.normalize(path.join(staticDir, requestedPath));

  if (!filePath.startsWith(staticDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (!exists(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = indexFile;
  }

  res.writeHead(200, { "Content-Type": contentType(filePath) });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`[render-start] Static ProfilFinder app served from ${staticDir}`);
  console.log(`[render-start] Listening on ${host}:${port}`);
});
