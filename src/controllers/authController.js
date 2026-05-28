const { ApiError } = require("../utils/apiError");
const { Organization, User } = require("../models");
const { hashPassword, verifyPassword } = require("../services/passwordService");
const { issueRefreshToken, revokeRefreshToken, rotateRefreshToken, signAccessToken } = require("../services/authService");

async function register(req, res) {
  const body = req.body;

  const existing = await User.findOne({ where: { email: body.email } });
  if (existing) throw new ApiError(409, "CONFLICT", "Email already registered");

  const org = await Organization.create({ name: body.org_name });

  const passwordHash = await hashPassword(body.password);
  
  const user = await User.create({
    orgId: org.id,
    name: body.name,
    email: body.email,
    passwordHash,
    role: "ADMIN"
  });

  const accessToken = signAccessToken(user);
  const { refreshToken } = await issueRefreshToken(user.id);
  return res.status(201).json({ access_token: accessToken, refresh_token: refreshToken });
}

async function login(req, res) {
  const body = req.body;

  const user = await User.findOne({ where: { email: body.email } });
  if (!user) throw new ApiError(401, "UNAUTHORIZED", "Invalid email or password");

  const ok = await verifyPassword(body.password, user.passwordHash);
  if (!ok) throw new ApiError(401, "UNAUTHORIZED", "Invalid email or password");

  const accessToken = signAccessToken(user);
  const { refreshToken } = await issueRefreshToken(user.id);
  return res.json({ access_token: accessToken, refresh_token: refreshToken });
}

async function refresh(req, res) {
  const body = req.body;
  const rotated = await rotateRefreshToken(body.refresh_token);
  return res.json({ access_token: rotated.accessToken, refresh_token: rotated.refreshToken });
}

async function logout(req, res) {
  const body = req.body;
  await revokeRefreshToken(body.refresh_token);
  return res.status(204).send();
}

module.exports = { login, logout, refresh, register };

