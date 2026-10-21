//Debe ir primero: carga el .env antes de que otros modulos lean process.env
import "dotenv/config";

import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

if (!process.env.JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

//Middleware de errores (va despues de las rutas): responde siempre en JSON
const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  //Body que no es JSON valido
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no es JSON válido" });
  }

  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
