import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/require.Auth.js";

export const authRouter = express.Router();

function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

authRouter.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});


authRouter.post("/register", async (req, res) => {
  try {
    const username = String(req.body.username ?? "").trim();
    const email = String(req.body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password ?? "");

    if (!username)
      return res.status(400).json({ message: "username is required" });
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!password)
      return res.status(400).json({ message: "passwword is required " });
    if (username.length < 3 || username.length > 30) {
      return res
        .status(400)
        .json({ message: "username must be between 3 to 30" });
    }
    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ message: "email should include" });
    }
    if (password.length < 8) {
     return res.status(400).json({ message: "password must be at least 8 chars" });

    }
    const existingByEmail = await User.findOne({ where: { email } });
    if (existingByEmail)
      return res.status(409).json({ message: "email is already registerd" });

    const existingByUserName = await User.findOne({ where: { username } });
    if (existingByUserName)
      return res.status(409).json({ message: "username is already in use" });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password_hash });
    const token = signToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      }, //why we are not passing thenpassword here
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "failed to register" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const login = String(req.body.login ?? "").trim();
    const password = String(req.body.password ?? "");
    if (!login) return res.status(400).json({ message: "login is required" });
    if (!password)
      return res.status(400).json({ message: "password is required" });
    const isEmail = login.includes("@");
    const where = isEmail
      ? { email: login.toLowerCase() }
      : { username: login };
    const user = await User.findOne({ where });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      }, //why we are not passing thenpassword here
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "failed to login" });
  }
});

