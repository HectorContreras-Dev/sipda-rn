import { Response, NextFunction } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "./authMiddleware";

//Va DESPUES de authMiddleware: ese ya dijo quien es (req.userId), este revisa si es admin.
//Se consulta la base de datos en cada peticion: si se le quita el rol a alguien, pierde el acceso al instante
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const result = await pool.query("SELECT role FROM users WHERE id = $1", [req.userId]);

  //403 = sabemos quien eres, pero no tienes permiso
  if (result.rows[0]?.role !== "admin") {
    return res.status(403).json({ error: "No tienes permiso para entrar aquí" });
  }

  next();
}