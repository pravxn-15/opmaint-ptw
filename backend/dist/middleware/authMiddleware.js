"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                message: "JWT_SECRET is not configured",
            });
        }
        const token = header.slice(7);
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded === "string" ||
            typeof decoded.userId !== "string") {
            return res.status(401).json({
                message: "Invalid token payload",
            });
        }
        const payload = decoded;
        const user = await db_1.default.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                role: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                message: "Account unavailable",
            });
        }
        req.user = {
            id: user.id,
            role: user.role,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map