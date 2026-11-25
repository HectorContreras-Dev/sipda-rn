import { Response } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { AuthRequest } from "../middlewares/authMiddleware";

//Lista de usuarios con su numero de intentos / GET /api/admin/users
export async function listUsers(_req: AuthRequest, res: Response) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.last_name, u.email, u.role, u.blocked_at, u.created_at,
            COUNT(a.id)::int AS attempts
     FROM users u
     LEFT JOIN attempts a ON a.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );

  res.status(200).json({ users: result.rows });
}

//Revisa que el usuario de la URL (:id) exista y que se pueda modificar.
//Si no se puede, responde el error y regresa null
async function getTargetId(req: AuthRequest, res: Response): Promise<number | null> {
  const targetId = Number(req.params.id);

  if (!Number.isInteger(targetId) || targetId <= 0) {
    res.status(400).json({ error: "Id de usuario inválido" });
    return null;
  }

  if (targetId === req.userId) {
    res.status(400).json({ error: "No puedes hacer esto con tu propia cuenta" });
    return null;
  }

  const result = await pool.query("SELECT role FROM users WHERE id = $1", [targetId]);

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return null;
  }

  if (result.rows[0].role === "admin") {
    res.status(403).json({ error: "No puedes modificar a otro administrador" });
    return null;
  }

  return targetId;
}

//Bloquear o desbloquear / PATCH /api/admin/users/:id/block  body: { blocked: true | false }
const blockSchema = z.object({
  blocked: z.boolean(),
});

export async function setBlocked(req: AuthRequest, res: Response) {
  const parseResult = blockSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const targetId = await getTargetId(req, res);
  if (targetId === null) return;

  //Bloquear = guardar la fecha de hoy. Desbloquear = dejarla vacia (NULL)
  const result = await pool.query(
    "UPDATE users SET blocked_at = CASE WHEN $2::boolean THEN NOW() ELSE NULL END WHERE id = $1 RETURNING blocked_at",
    [targetId, parseResult.data.blocked]
  );

  res.status(200).json({ blocked_at: result.rows[0].blocked_at });
}

//Borrar progreso (la cuenta se conserva) / DELETE /api/admin/users/:id/progress
export async function resetProgress(req: AuthRequest, res: Response) {
  const targetId = await getTargetId(req, res);
  if (targetId === null) return;

  //Transaccion: se borra todo o no se borra nada
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM attempts WHERE user_id = $1", [targetId]);
    await client.query("DELETE FROM quiz_results WHERE user_id = $1", [targetId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  res.status(204).send();
}

//Eliminar usuario y su progreso / DELETE /api/admin/users/:id
export async function deleteUser(req: AuthRequest, res: Response) {
  const targetId = await getTargetId(req, res);
  if (targetId === null) return;

  //Igual que deleteAccount: primero lo que apunta a users, luego el usuario
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM attempts WHERE user_id = $1", [targetId]);
    await client.query("DELETE FROM quiz_results WHERE user_id = $1", [targetId]);
    await client.query("DELETE FROM users WHERE id = $1", [targetId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  res.status(204).send();
}