import { type Request, type Response, type NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Nicht angemeldet" });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Nicht angemeldet" });
    return;
  }
  if (!req.session?.isAdmin) {
    res.status(403).json({ error: "Kein Zugriff" });
    return;
  }
  next();
}
