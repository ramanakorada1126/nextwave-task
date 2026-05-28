const { Router } = require("express");
const { authRouter } = require("./auth");
const { tasksRouter } = require("./tasks");

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", tasksRouter);

module.exports = { apiRouter };
