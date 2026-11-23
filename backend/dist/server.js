"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({
        message: "Opmaint PTW API is running",
    });
});
app.get("/api/health", async (_req, res) => {
    try {
        await db_1.default.$queryRaw `SELECT 1`;
        res.json({
            status: "OK",
            database: "Connected",
        });
    }
    catch {
        res.status(500).json({
            status: "ERROR",
            database: "Disconnected",
        });
    }
});
const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map