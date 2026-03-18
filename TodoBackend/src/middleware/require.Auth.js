import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ message: "Missing Authorization header" });

    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ message: "Authorization must be : Bearer <token>" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
