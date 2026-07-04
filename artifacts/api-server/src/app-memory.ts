import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import router from "./routes";
import { logger } from "./lib/logger";

declare module "express-session" {
  interface SessionData {
    userId: number;
    isAdmin: boolean;
  }
}

const app = express();
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const staticDir = path.resolve(dirname, "..", "..", "profil-finder", "dist", "public");

app.use(pinoHttp({ logger }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "profil-finder-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
}));

app.use("/api", router);
app.use(express.static(staticDir));
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
    return;
  }
  res.sendFile(path.join(staticDir, "index.html"));
});

export default app;
