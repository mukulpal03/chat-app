import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

const PORT = process.env.PORT ?? 4000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
