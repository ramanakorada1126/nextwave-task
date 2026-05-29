const { ApiError } = require("../utils/apiError");
const { Project } = require("../models");
const { send } = require("../utils/response");

async function create(req, res) {
  const orgId = req.user.orgId;
  const { name, description } = req.body;
  const project = await Project.create({ orgId, name, description });
  return send(res, { status: 201, message: "Project created", data: project });
}

async function list(req, res) {
  const orgId = req.user.orgId;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
  const offset = (safePage - 1) * safeLimit;

  const { rows, count } = await Project.findAndCountAll({
    where: { orgId },
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
  const project = await Project.findOne({ where: { id, orgId } });
  if (!project) return next(new ApiError(404, "NOT_FOUND", "Project not found"));
  req.project = project;
  return next();
}

async function getById(req, res) {
  return send(res, { status: 200, message: "OK", data: req.project });
}

async function updateById(req, res) {
  Object.assign(req.project, req.body);
  await req.project.save();
  return send(res, { status: 200, message: "Project updated", data: req.project });
}

async function removeById(req, res) {
  await req.project.destroy();
  return send(res, { status: 200, message: "Project deleted", data: null });
}

module.exports = { create, getById, list, load, removeById, updateById };
