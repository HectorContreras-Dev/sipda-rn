import { Response } from "express";
import { z } from "zod";
import { pool } from "../config/db";
import { AuthRequest } from "../middlewares/authMiddleware";

//Validacion del intento que manda el modo prueba
const attemptSchema = z.object({
  letter_id: z.number().int().positive(),
  is_correct: z.boolean(),
  //El frontend manda la confianza de 0 a 1 (0.87 = 87%)
  confidence: z.number().min(0).max(1),
});

//Guardar un intento del modo prueba / POST /api/attempts
export async function createAttempt(req: AuthRequest, res: Response) {
  const parseResult = attemptSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parseResult.error.issues });
  }

  const { letter_id, is_correct, confidence } = parseResult.data;

  //La columna es DECIMAL(5,2): se guarda como porcentaje con 2 decimales (0.8734 -> 87.34)
  const confidencePercent = Math.round(confidence * 10000) / 100;

  try {
    //El user_id sale del token, nunca del body: nadie puede guardar intentos a nombre de otro
    const result = await pool.query(
      `INSERT INTO attempts (user_id, letter_id, is_correct, confidence)
       VALUES ($1, $2, $3, $4)
       RETURNING id, letter_id, is_correct, confidence, created_at`,
      [req.userId, letter_id, is_correct, confidencePercent]
    );

    res.status(201).json({ attempt: result.rows[0] });
  } catch (error) {
    //23503 = la letra no existe en la tabla letters (llave foranea)
    if (error instanceof Error && "code" in error && error.code === "23503") {
      return res.status(400).json({ error: "La letra no existe" });
    }
    throw error;
  }
}

//Aciertos en el modo prueba que se necesitan para dar una letra por completada
const CORRECT_TO_COMPLETE = 1;

//Progreso del usuario, calculado al momento sobre attempts / GET /api/progress
export async function getProgress(req: AuthRequest, res: Response) {
  //Una fila por letra practicada: cuantos intentos y cuantos aciertos
  const result = await pool.query(
    `SELECT a.letter_id, l.letter,
            COUNT(*)::int AS attempts,
            COUNT(*) FILTER (WHERE a.is_correct)::int AS correct
     FROM attempts a
     JOIN letters l ON l.id = a.letter_id
     WHERE a.user_id = $1
     GROUP BY a.letter_id, l.letter
     ORDER BY a.letter_id`,
    [req.userId]
  );

  const letters = result.rows;
  const totalAttempts = letters.reduce((sum, item) => sum + item.attempts, 0);
  const totalCorrect = letters.reduce((sum, item) => sum + item.correct, 0);

  res.status(200).json({
    letters,
    completed_letter_ids: letters
      .filter((item) => item.correct >= CORRECT_TO_COMPLETE)
      .map((item) => item.letter_id),
    total_attempts: totalAttempts,
    //Precision = porcentaje de intentos correctos (null si todavia no hay intentos)
    accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null,
  });
}

//El usuario borra su propio progreso (la cuenta se conserva) / DELETE /api/progress
export async function resetMyProgress(req: AuthRequest, res: Response) {
  //Transaccion: se borra todo o no se borra nada
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM attempts WHERE user_id = $1", [req.userId]);
    await client.query("DELETE FROM quiz_results WHERE user_id = $1", [req.userId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  res.status(204).send();
}