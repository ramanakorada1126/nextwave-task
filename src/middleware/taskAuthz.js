const { ApiError } = require("../utils/apiError");
const { Task } = require("../models");
const { canTransition } = require("../utils/taskStatus");

async function loadTask(req, _res, next) {
  const orgId = req.user.orgId;
  const id = Number(req.params.id);
  const task = await Task.findOne({ where: { id, orgId } });
  if (!task) return next(new ApiError(404, "NOT_FOUND", "Task not found"));
  req.task = task;
  return next();
}

function requireTaskReadAccess(req, _res, next) {
  const role = req.user.role;
  if (role === "MEMBER" && req.task.assigneeId !== req.user.userId) {
    return next(new ApiError(403, "FORBIDDEN", "MEMBER can only access tasks assigned to them"));
  }
  return next();
}

function requireTaskUpdateAccess(req, _res, next) {
  const role = req.user.role;
  if (role === "MEMBER" && req.task.assigneeId !== req.user.userId) {
    return next(new ApiError(403, "FORBIDDEN", "MEMBER can only update tasks assigned to them"));
  }
  return next();
}

function requireTaskDeleteAccess(req, _res, next) {
  const role = req.user.role;
  if (role === "MEMBER") {
    return next(new ApiError(403, "FORBIDDEN", "Insufficient permissions"));
  }
  return next();
}

function enforceTaskUpdateRules(req, _res, next) {
  const patch = req.body;

  if (req.user.role === "MEMBER") {
    const allowed = new Set(["status", "description"]);
    const forbiddenKeys = Object.keys(patch).filter((k) => !allowed.has(k));
    if (forbiddenKeys.length) {
      return next(new ApiError(403, "FORBIDDEN", "MEMBER can only update assigned task status/description"));
    }
  }

  if ((patch.assigneeId !== undefined || patch.projectId !== undefined) && req.user.role === "MEMBER") {
    return next(new ApiError(403, "FORBIDDEN", "Insufficient permissions"));
  }

  if (patch.status && patch.status !== req.task.status) {
    const ok = canTransition(req.task.status, patch.status);
    if (!ok) {
      return next(new ApiError(400, "VALIDATION_ERROR", "Invalid status transition"));
    }

    const isAssignee = req.user.userId === req.task.assigneeId;
    const isManager = req.user.role === "MANAGER";
    if (!isAssignee && !isManager) {
      return next(new ApiError(403, "FORBIDDEN", "Only assignee or MANAGER can change task status"));
    }
  }

  return next();
}

module.exports = {
  enforceTaskUpdateRules,
  loadTask,
  requireTaskDeleteAccess,
  requireTaskReadAccess,
  requireTaskUpdateAccess
};
