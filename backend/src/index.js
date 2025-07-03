import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import connectToDB from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

connectToDB().then(() =>
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
);
