import "dotenv/config";
import express from "express";
import connectToDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app, server } from "./lib/socket.js";
import path from "path";

const PORT = process.env.PORT ?? 4000;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("__dirname:", __dirname);
  console.log("Static path:", path.join(__dirname, "../frontend/dist"));
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectToDB().then(() =>
  server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
);
