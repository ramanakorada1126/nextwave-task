const Joi = require("joi");

const registerSchema = Joi.object({
  org_name: Joi.string().min(2).max(120).required(),
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(200).required(),
}).prefs({ abortEarly: false, convert: true });

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
}).prefs({ abortEarly: false, convert: true });

const refreshSchema = Joi.object({
  refresh_token: Joi.string().min(10).required(),
}).prefs({ abortEarly: false, convert: true });

module.exports = { registerSchema, loginSchema, refreshSchema };
