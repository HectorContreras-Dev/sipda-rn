import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  userId?: number;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  let userId: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  //El token puede ser valido, pero la cuenta pudo haberse eliminado o bloqueado despues
  const result = await pool.query("SELECT blocked_at FROM users WHERE id = $1", [userId]);

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  if (result.rows[0].blocked_at) {
    return res.status(403).json({ error: "Tu cuenta está bloqueada" });
  }

  req.userId = userId;
  next();
}