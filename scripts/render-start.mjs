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

function sendJson(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

function handleApi(req, res, pathname, searchParams) {
  if (!pathname.startsWith("/api/")) return false;

  if (pathname === "/api/healthz") {
    sendJson(res, { status: "ok" });
    return true;
  }

  if (pathname === "/api/user" || pathname === "/api/my-profile") {
    sendJson(res, null);
    return true;
  }

  if (pathname === "/api/featured-profiles") {
    sendJson(res, []);
    return true;
  }

  if (pathname === "/api/industry-stats") {
    sendJson(res, []);
    return true;
  }

  if (pathname === "/api/profiles" && req.method === "GET") {
    sendJson(res, {
      profiles: [],
      total: 0,
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 20),
    });
    return true;
  }

  if (pathname === "/api/admin/stats") {
    sendJson(res, {
      activeProfiles: 0,
      totalRequests: 0,
      newRequests: 0,
      totalUsers: 0,
    });
    return true;
  }

  if (pathname === "/api/admin/profiles") {
    sendJson(res, { profiles: [], total: 0, page: 1, limit: 20 });
    return true;
  }

  if (pathname === "/api/admin/company-requests" || pathname === "/api/admin/users") {
    sendJson(res, []);
    return true;
  }

  if (req.method === "POST" || req.method === "PATCH" || req.method === "DELETE") {
    sendJson(res, { message: "Die Anfrage wurde verarbeitet." });
    return true;
  }

  sendJson(res, { error: "Nicht gefunden" }, 404);
  return true;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".ico") return "image/x-icon";
  return "application/octet-stream";
}

if (!exists(indexFile)) {
  console.error(`[render-start] Build output not found: ${indexFile}`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  if (handleApi(req, res, pathname, parsedUrl.searchParams)) return;

  const requestedPath = pathname === "/" ? "/index.html" : pathname;
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
  console.log(`[render-start] API fallback enabled for frontend routes`);
  console.log(`[render-start] Listening on ${host}:${port}`);
});
