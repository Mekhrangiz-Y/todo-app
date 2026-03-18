import "dotenv/config";
import express from "express";
import cors from "cors";//do research
import { sequelize } from "./db.js";
import { taskRouter } from "./routes/tasks.js";
import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middleware/require.Auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/tasks", requireAuth, taskRouter);
app.get("/health", (req, res) => res.json({ ok: true }));
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

    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("❌ DB connection failed:", e);
    process.exit(1);
  }
}

start();
