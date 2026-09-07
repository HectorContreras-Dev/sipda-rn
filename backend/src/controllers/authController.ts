import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { pool } from "../config/db";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middlewares/authMiddleware";

//Validacion de datos de registro con Zod / REGISTRO.....................
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

//Controlador para el registro de usuarios
export async function register(req: Request, res: Response) {

    //Validacion de datos
  const parseResult = registerSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parseResult.error.issues });
  }

  const { name, email, password } = parseResult.data;

  //Verificacion de correo existente
  const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

  if (existingUser.rows.length > 0) {
    return res.status(409).json({ error: "Ya existe un usuario con ese correo" });
  }

  //HASH PASSWORD
  const passwordHash = await bcrypt.hash(password, 10);

  //Insercion de usuario en la base de datos y generacion de token JWT
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, passwordHash]
  );

  const newUser = result.rows[0];
  const token = generateToken(newUser.id);

  res.status(201).json({ user: newUser, token });
}

//Controlador para el login de usuarios / LOGIN............................

//Validacion de datos de login con Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parseResult.error.issues });
  }

  const { email, password } = parseResult.data;


  //Verificacion de usuario y contraseña en la base de datos
  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email]
  );

  //Verificacion de existencia de usuario y coincidencia de contraseña
  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }
  
  const user = result.rows[0];
  const passwordMatches = await bcrypt.compare(password, user.password_hash); //Comparacion de la contraseña ingresada con el hash almacenado en la base de datos

  if (!passwordMatches) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  //Generacion de token JWT para el usuario autenticado
  const token = generateToken(user.id);


  //Envio de respuesta con el token y los datos del usuario
  res.status(200).json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
}

//Controlador para obtener los datos del usuario autenticado / ME............

export async function me(req: AuthRequest, res: Response) {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [req.userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.status(200).json({ user: result.rows[0] });
}