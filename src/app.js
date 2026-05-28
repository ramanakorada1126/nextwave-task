const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");
const { apiRouter } = require("./routes");
const { connectDB } = require("./db/connectDb");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) =>
    res.json({ ok: true, message: "Welcome to Nextwave Task Tracker API" }),
  );

  app.use(apiRouter);

  //db connection
  connectDB();

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
