import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createAttempt } from "../controllers/attemptController";

const router = Router();

//Todas las rutas de intentos necesitan sesion
router.use(authMiddleware);

router.post("/", createAttempt);

export default router;