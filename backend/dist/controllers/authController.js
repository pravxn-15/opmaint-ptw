"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const generateToken_1 = require("../utils/generateToken");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                message: "Valid name, email and password are required",
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await db_1.default.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const user = await db_1.default.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                passwordHash,
                role: "REQUESTER",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        const token = (0, generateToken_1.generateToken)(user.id, user.role);
        return res.status(201).json({
            message: "Registration successful",
            token,
            user,
        });
    }
    catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: "Registration failed",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await db_1.default.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const token = (0, generateToken_1.generateToken)(user.id, user.role);
        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Login failed",
        });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map