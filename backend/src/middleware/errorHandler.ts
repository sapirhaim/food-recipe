import { NextFunction, Request, Response } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error("🔥 Error:", err);
  res.status(500).json({ message: "Server error", detail: err?.message || String(err) });
}
