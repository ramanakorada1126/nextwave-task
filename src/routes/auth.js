const { Router } = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { Organization, User } = require("../models");
const { hashPassword, verifyPassword } = require("../services/passwordService");
const {
  issueRefreshToken,
  revokeRefreshToken,
  rotateRefreshToken,
  signAccessToken,
} = require("../services/authService");
const Joi = require("joi");
const { validateBody } = require("../validation/validate");
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require("../validation/authSchema");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.post("/refresh", validateBody(refreshSchema), refresh);

authRouter.post("/logout", validateBody(refreshSchema), logout);

module.exports = { authRouter };
