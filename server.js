import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();

const app = express(); // ✅ define app first
const PORT = process.env.PORT || 5000;

// ✅ Use CORS middleware after defining app
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/employees", employeeRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});


// MongoDB connection + start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

  app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});
