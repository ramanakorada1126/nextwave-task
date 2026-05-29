const { Router } = require("express");
const { authRouter } = require("./auth");
const { tasksRouter } = require("./tasks");
const { usersRouter } = require("./users");
const { projectsRouter } = require("./projects");

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", tasksRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/projects", projectsRouter);

module.exports = { apiRouter };
