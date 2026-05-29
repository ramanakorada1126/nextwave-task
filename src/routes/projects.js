const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/rbac");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateBody, validateParams, validateQuery } = require("../validation/validate");
const { createProjectSchema, idParamSchema, listProjectsQuerySchema, updateProjectSchema } = require("../validation/projectSchema");
const projectController = require("../controllers/projectController");

const projectsRouter = Router();

projectsRouter.post(
  "/",
  requireAuth,
  authorizeRoles("ADMIN", "MANAGER"),
  validateBody(createProjectSchema),
  asyncHandler(projectController.create)
);

projectsRouter.get(
  "/",
  requireAuth,
  validateQuery(listProjectsQuerySchema),
  asyncHandler(projectController.list)
);

projectsRouter.get(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(projectController.load),
  asyncHandler(projectController.getById)
);

projectsRouter.patch(
  "/:id",
  requireAuth,
  authorizeRoles("ADMIN", "MANAGER"),
  validateParams(idParamSchema),
  validateBody(updateProjectSchema),
  asyncHandler(projectController.load),
  asyncHandler(projectController.updateById)
);

projectsRouter.delete(
  "/:id",
  requireAuth,
  authorizeRoles("ADMIN", "MANAGER"),
  validateParams(idParamSchema),
  asyncHandler(projectController.load),
  asyncHandler(projectController.removeById)
);

module.exports = { projectsRouter };

