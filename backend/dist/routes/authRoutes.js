"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.get("/me", authMiddleware_1.protect, (req, res) => {
    res.json({ user: req.user });
});
router.get("/admin-check", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("ADMIN"), (_req, res) => {
    res.json({ message: "Admin access granted" });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map