const Joi = require("joi");

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
}).prefs({ abortEarly: false, convert: true });

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(200).required(),
  role: Joi.string().valid("MANAGER", "MEMBER").required()
}).prefs({ abortEarly: false, convert: true });

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(120),
  role: Joi.string().valid("ADMIN", "MANAGER", "MEMBER")
})
  .min(1)
  .prefs({ abortEarly: false, convert: true });

const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
}).prefs({ abortEarly: false, convert: true });

module.exports = { createUserSchema, idParamSchema, listUsersQuerySchema, updateUserSchema };

