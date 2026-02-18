import express from "express";
// import cors from "cors"; 
import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";

const app = express();

// app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);

export default app;
