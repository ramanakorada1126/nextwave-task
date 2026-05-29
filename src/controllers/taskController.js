const taskService = require("../services/taskService");
const { env } = require("../config/env");
const { getJson, invalidateAssigneeTaskListCache, setJson } = require("../cache/redis");
const { send } = require("../utils/response");

async function create(req, res) {
  const orgId = req.user.orgId;
  const createdById = req.user.userId;
  const task = await taskService.createTask({ orgId, createdById, ...req.body });
  await invalidateAssigneeTaskListCache(orgId, task.assigneeId);
  return send(res, { status: 201, message: "Task created", data: task });
}

async function getById(req, res) {
  return send(res, { status: 200, message: "OK", data: req.task });
}

async function updateById(req, res) {
  const orgId = req.user.orgId;
  const previousAssigneeId = req.task.assigneeId;
  Object.assign(req.task, req.body);
  await req.task.save();
  await invalidateAssigneeTaskListCache(orgId, previousAssigneeId);
  if (req.task.assigneeId !== previousAssigneeId) {
    await invalidateAssigneeTaskListCache(orgId, req.task.assigneeId);
  }
  return send(res, { status: 200, message: "Task updated", data: req.task });
}

async function removeById(req, res) {
  const orgId = req.user.orgId;
  const assigneeId = req.task.assigneeId;
  await req.task.destroy();
  await invalidateAssigneeTaskListCache(orgId, assigneeId);
  return send(res, { status: 200, message: "Task deleted", data: null });
}

async function list(req, res) {
  const orgId = req.user.orgId;
  const { page, limit, status, priority, assigneeId } = req.query;
  const canCache = env.REDIS_ENABLED && assigneeId;
  const cacheKey = canCache
    ? `tasklist:${orgId}:${assigneeId}:${page}:${limit}:${status ?? ""}:${priority ?? ""}`
    : null;

  if (cacheKey) {
    try {
      const cached = await getJson(cacheKey);
      if (cached) return send(res, { status: 200, message: "OK", data: cached, cached: true });
    } catch {
      // ignore cache errors
    }
  }

  const result = await taskService.listTasks({ orgId, page, limit, status, priority, assigneeId });
  const payload = { page: result.page, limit: result.limit, total: result.count, data: result.rows };

  if (cacheKey) {
    try {
      await setJson(cacheKey, payload, env.REDIS_TASKLIST_TTL_SECONDS);
    } catch {
      // ignore cache errors
    }
  }

  return send(res, { status: 200, message: "OK", data: payload, cached: false });
}

module.exports = { create, getById, list, removeById, updateById };
