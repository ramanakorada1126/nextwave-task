const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");
const { apiRouter } = require("./routes");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  // Swagger UI documentation
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Health check endpoint
  app.get("/api/v1/health", (req, res) =>
    res.json({ status: 200, message: "OK", data: { ok: true, name: "Nextwave Task Tracker API" } }),
  );

  app.use("/api/v1", apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
