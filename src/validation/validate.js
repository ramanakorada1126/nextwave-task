const { ApiError } = require("../utils/apiError");

function validateBody(schema) {
  return (req, _res, next) => {
    const { value, error } = schema.validate(req.body);
    if (error) {
      const message = error.details?.[0]?.message ?? "Invalid request body";
      return next(new ApiError(400, "VALIDATION_ERROR", message));
    }
    req.body = value;
    return next();
  };
}

function validateQuery(schema) {
  return (req, _res, next) => {
    const { value, error } = schema.validate(req.query);
    if (error) {
      const message = error.details?.[0]?.message ?? "Invalid query parameters";
      return next(new ApiError(400, "VALIDATION_ERROR", message));
    }
    req.query = value;
    return next();
  };
}

function validateParams(schema) {
  return (req, _res, next) => {
    const { value, error } = schema.validate(req.params);
    if (error) {
      const message = error.details?.[0]?.message ?? "Invalid route parameters";
      return next(new ApiError(400, "VALIDATION_ERROR", message));
    }
    req.params = value;
    return next();
  };
}

module.exports = { validateBody, validateParams, validateQuery };
