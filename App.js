import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import User from "./models/User.js";
import "./models/index.js";
import path from "path";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import certificatesRoutes from "./routes/certificatesRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/profile", profileRoutes);
app.use("/certificates", certificatesRoutes);
app.use("/skills", skillsRoutes);
app.use("/projects", projectRoutes);

//UPLOAD FILE
app.use("/uploads", express.static("uploads"));

//TEST API
app.get("/", (req, res) => {
  res.send("API is running...");
});

sequelize.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.log("Error: " + err));

sequelize.sync()
  .then(() => console.log("Table created"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});