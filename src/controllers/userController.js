const { ApiError } = require("../utils/apiError");
const { User } = require("../models");
const { hashPassword } = require("../services/passwordService");
const { send } = require("../utils/response");

async function create(req, res) {
  const orgId = req.user.orgId;
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new ApiError(409, "CONFLICT", "Email already registered");

  const passwordHash = await hashPassword(password);
  const user = await User.create({ orgId, name, email, passwordHash, role });

  const safe = {
    id: user.id,
    orgId: user.orgId,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return send(res, { status: 201, message: "User created", data: safe });
}

async function list(req, res) {
  const orgId = req.user.orgId;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
  const offset = (safePage - 1) * safeLimit;

  const { rows, count } = await User.findAndCountAll({
    where: { orgId },
    attributes: ["id", "orgId", "name", "email", "role", "createdAt", "updatedAt"],
    limit: safeLimit,
    offset,
    order: [["id", "DESC"]]
  });

  return send(res, {
    status: 200,
    message: "OK",
    data: { page: safePage, limit: safeLimit, total: count, data: rows }
  });
}

async function load(req, _res, next) {
  const orgId = req.user.orgId;
  const id = Number(req.params.id);
  const user = await User.findOne({
    where: { id, orgId },
    attributes: ["id", "orgId", "name", "email", "role", "createdAt", "updatedAt"]
  });
  if (!user) return next(new ApiError(404, "NOT_FOUND", "User not found"));
  req.targetUser = user;
  return next();
}

async function getById(req, res) {
  return send(res, { status: 200, message: "OK", data: req.targetUser });
}

async function updateById(req, res) {
  const orgId = req.user.orgId;
  const id = Number(req.params.id);

  const user = await User.findOne({ where: { id, orgId } });
  if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.role !== undefined) user.role = req.body.role;
  await user.save();

  return send(res, {
    status: 200,
    message: "User updated",
    data: {
    id: user.id,
    orgId: user.orgId,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
    }
  });
}

module.exports = { create, getById, list, load, updateById };
