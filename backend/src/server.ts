import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

import { pool } from "./config/db";

pool.query("SELECT NOW()")
  .then((res) => console.log("Conectado a la base de datos:", res.rows[0]))
  .catch((err) => console.error("Error conectando a la base de datos:", err));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});