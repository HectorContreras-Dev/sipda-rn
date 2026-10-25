import { Router } from "express";
import { register, login, me, deleteAccount } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.delete("/me", authMiddleware, deleteAccount);

export default router;