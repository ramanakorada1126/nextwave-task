const { Task, User, Project } = require("../models");
const { ApiError } = require("../utils/apiError");

async function assertUserInOrg(orgId, userId) {
  const user = await User.findOne({ where: { id: userId, orgId } });
  if (!user) throw new ApiError(400, "VALIDATION_ERROR", "assigneeId must be a user in the organization");
}

async function assertProjectInOrg(orgId, projectId) {
  if (projectId == null) return;
  const project = await Project.findOne({ where: { id: projectId, orgId } });
  if (!project) throw new ApiError(400, "VALIDATION_ERROR", "projectId must belong to the organization");
}

async function createTask({ orgId, createdById, title, description, priority, status, assigneeId, projectId, dueDate }) {
  await assertUserInOrg(orgId, assigneeId);
  await assertProjectInOrg(orgId, projectId);
  return Task.create({
    orgId,
    createdById,
    title,
    description,
    priority,
    status,
    assigneeId,
    projectId,
    dueDate
  });
}

async function getTaskById({ orgId, id }) {
  return Task.findOne({ where: { id, orgId } });
}

async function updateTaskById({ orgId, id, patch }) {
  const task = await Task.findOne({ where: { id, orgId } });
  if (!task) return null;

  if (patch.assigneeId !== undefined) {
    await assertUserInOrg(orgId, patch.assigneeId);
  }
  if (patch.projectId !== undefined) {
    await assertProjectInOrg(orgId, patch.projectId);
  }

  Object.assign(task, patch);
  await task.save();
  return task;
}

async function deleteTaskById({ orgId, id }) {
  const deleted = await Task.destroy({ where: { id, orgId } });
  return deleted > 0;
}

async function listTasks({ orgId, page, limit, status, priority, assigneeId }) {
  const where = { orgId };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assigneeId) where.assigneeId = assigneeId;

  const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const safeLimitRaw = Number(limit);
  const safeLimit = Number.isFinite(safeLimitRaw) && safeLimitRaw > 0 ? Math.min(safeLimitRaw, 100) : 20;
  const offset = (safePage - 1) * safeLimit;
  const { rows, count } = await Task.findAndCountAll({
    where,
    limit: safeLimit,
    offset,
    order: [["id", "DESC"]]
  });

  return { rows, count, page: safePage, limit: safeLimit };
}

module.exports = { createTask, deleteTaskById, getTaskById, listTasks, updateTaskById };
