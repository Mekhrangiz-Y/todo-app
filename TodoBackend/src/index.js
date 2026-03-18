import "dotenv/config";
import express from "express";
import cors from "cors";
import { sequelize } from "./db.js";
import { taskRouter } from "./routes/tasks.js";
import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middleware/require.Auth.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        process.env.CLIENT_URL,
      ].filter(Boolean);

      const isVercelPreview =
        origin && origin.endsWith(".vercel.app");

      if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/tasks", requireAuth, taskRouter);

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true, db: "connected" });
  } catch {
    res.status(500).json({ ok: false, db: "disconnected" });
  }
});

app.get("/", (req, res) => {
  res.send("API is running. Try /health or /tasks");
});

app.get("/hey", (req, res) => {
  res.send("HEYY");
});

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync();
    console.log("✅ Models synced");

    app.listen(PORT, () => {
      console.log(`🚀 API running on port ${PORT}`);
    });
  } catch (e) {
    console.error("❌ Startup failed:", e);
    process.exit(1);
  }
}

start();