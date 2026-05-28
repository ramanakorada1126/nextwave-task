const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Missing Authorization header",
      });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    console.log("payload from user for token verification",payload)
    req.user = {
      userId: payload.sub,
      orgId: payload.orgId,
      role: payload.role,
    };
    return next();
  } catch {
    return res
      .status(401)
      .json({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
  }
}

module.exports = { requireAuth };
