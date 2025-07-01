import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import connectToDB from "./lib/db.js";

const app = express();

const PORT = process.env.PORT ?? 4000;

app.use("/api/auth", authRoutes);

connectToDB().then(() =>
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
);
