import "dotenv/config";
import express from "express";
import connectToDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();

const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

connectToDB().then(() =>
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
);
