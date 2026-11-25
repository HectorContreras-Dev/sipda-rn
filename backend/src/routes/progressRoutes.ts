import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getProgress, resetMyProgress } from "../controllers/attemptController";

const router = Router();

router.get("/", authMiddleware, getProgress);
router.delete("/", authMiddleware, resetMyProgress);

export default router;