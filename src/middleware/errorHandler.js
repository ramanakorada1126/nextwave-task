const { ApiError } = require("../utils/apiError");

function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ status: err.status, code: err.code, message: err.message });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ status: 500, code: "INTERNAL_ERROR", message: "Something went wrong" });
}

module.exports = { errorHandler };
