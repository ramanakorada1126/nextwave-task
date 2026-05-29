const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/rbac");
const { validateBody, validateParams, validateQuery } = require("../validation/validate");
const { createUserSchema, idParamSchema, listUsersQuerySchema, updateUserSchema } = require("../validation/userSchema");
const { asyncHandler } = require("../utils/asyncHandler");
const userController = require("../controllers/userController");

const usersRouter = Router();

usersRouter.post(
  "/user",
  requireAuth,
  authorizeRoles("ADMIN"),
  validateBody(createUserSchema),
  asyncHandler(userController.create)
);

usersRouter.get(
  "/",
  requireAuth,
  authorizeRoles("ADMIN"),
  validateQuery(listUsersQuerySchema),
  asyncHandler(userController.list)
);

usersRouter.get(
  "/:id",
  requireAuth,
  authorizeRoles("ADMIN"),
  validateParams(idParamSchema),
  asyncHandler(userController.load),
  asyncHandler(userController.getById)
);

usersRouter.patch(
  "/:id",
  requireAuth,
  authorizeRoles("ADMIN"),
  validateParams(idParamSchema),
  validateBody(updateUserSchema),
  asyncHandler(userController.updateById)
);

module.exports = { usersRouter };
