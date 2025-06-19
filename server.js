import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow both localhost (dev) and Vercel (prod)
const corsOptions = {
  origin: [
    "http://localhost:5173", // local dev
    "https://taskmanager-frontend-gamma.vercel.app", // Vercel frontend
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/employees", employeeRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// MongoDB connection + start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
