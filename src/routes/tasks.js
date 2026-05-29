const { Router } = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/rbac");
const {
  validateBody,
  validateParams,
  validateQuery,
} = require("../validation/validate");
const {
  createTaskSchema,
  idParamSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} = require("../validation/taskSchema");
const taskController = require("../controllers/taskController");
const {
  enforceTaskUpdateRules,
  loadTask,
  requireTaskDeleteAccess,
  requireTaskReadAccess,
  requireTaskUpdateAccess,
} = require("../middleware/taskAuthz");

const tasksRouter = Router();

function scopeMemberList(req, _res, next) {
  if (req.user.role === "MEMBER") {
    req.query.assigneeId = req.user.userId;
  }
  return next();
}

tasksRouter.post(
  "/",
  requireAuth,
  authorizeRoles("ADMIN", "MANAGER"),
  validateBody(createTaskSchema),
  asyncHandler(taskController.create),
);

tasksRouter.get(
  "/",
  requireAuth,
  validateQuery(listTasksQuerySchema),
  scopeMemberList,
  asyncHandler(taskController.list),
);

tasksRouter.get(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(loadTask),
  requireTaskReadAccess,
  asyncHandler(taskController.getById),
);

tasksRouter.patch(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateTaskSchema),
  asyncHandler(loadTask),
  requireTaskUpdateAccess,
  enforceTaskUpdateRules,
  asyncHandler(taskController.updateById),
);

tasksRouter.delete(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(loadTask),
  requireTaskDeleteAccess,
  asyncHandler(taskController.removeById),
);

module.exports = { tasksRouter };
