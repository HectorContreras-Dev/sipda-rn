import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/requireAdmin";
import { listUsers, setBlocked, resetProgress, deleteUser } from "../controllers/adminController";

const router = Router();

//Todas las rutas de este archivo pasan primero por los dos candados
router.use(authMiddleware, requireAdmin);
router.get("/users", listUsers);
router.patch("/users/:id/block", setBlocked);
router.delete("/users/:id/progress", resetProgress);
router.delete("/users/:id", deleteUser);

export default router;