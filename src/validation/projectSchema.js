const Joi = require("joi");

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
}).prefs({ abortEarly: false, convert: true });

const createProjectSchema = Joi.object({
  name: Joi.string().min(2).max(140).required(),
  description: Joi.string().allow("", null).max(5000).default(null)
}).prefs({ abortEarly: false, convert: true });

const updateProjectSchema = Joi.object({
  name: Joi.string().min(2).max(140),
  description: Joi.string().allow("", null).max(5000)
})
  .min(1)
  .prefs({ abortEarly: false, convert: true });

const listProjectsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
}).prefs({ abortEarly: false, convert: true });

module.exports = { createProjectSchema, idParamSchema, listProjectsQuerySchema, updateProjectSchema };

