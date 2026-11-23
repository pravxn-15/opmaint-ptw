import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Opmaint PTW API is running",
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "OK",
      database: "Connected",
    });
  } catch {
    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});