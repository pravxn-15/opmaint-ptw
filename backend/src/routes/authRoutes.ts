
import { Router } from "express";
import { login, register } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json({ user: (req as any).user });
});

router.get(
  "/admin-check",
  protect,
  authorize("ADMIN"),
  (_req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default router;
