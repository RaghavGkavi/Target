import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getUserData,
  saveUserData,
  updateUserData,
  checkUserData,
} from "./routes/userData";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // User data sync routes
  app.get("/api/users/:userId/data", getUserData);
  app.post("/api/users/:userId/data", saveUserData);
  app.patch("/api/users/:userId/data", updateUserData);
  app.get("/api/users/:userId/exists", checkUserData);

  return app;
}
