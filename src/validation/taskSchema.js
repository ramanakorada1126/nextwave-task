const Joi = require("joi");
const { TaskPriorities, TaskStatuses } = require("../config/constants");

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
}).prefs({ abortEarly: false, convert: true });

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow("", null).max(5000).default(null),
  priority: Joi.string()
    .valid(...TaskPriorities)
    .default("MEDIUM"),
  status: Joi.string()
    .valid(...TaskStatuses)
    .default("TODO"),
  assigneeId: Joi.number().integer().positive().required(),
  projectId: Joi.number().integer().positive().allow(null).default(null),
  dueDate: Joi.date().iso().greater("now").allow(null).default(null)
}).prefs({ abortEarly: false, convert: true });

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().allow("", null).max(5000),
  priority: Joi.string().valid(...TaskPriorities),
  status: Joi.string().valid(...TaskStatuses),
  assigneeId: Joi.number().integer().positive(),
  projectId: Joi.number().integer().positive().allow(null),
  dueDate: Joi.date().iso().greater("now").allow(null)
})
  .min(1)
  .prefs({ abortEarly: false, convert: true });

const listTasksQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid(...TaskStatuses),
  priority: Joi.string().valid(...TaskPriorities),
  assigneeId: Joi.number().integer().positive()
}).prefs({ abortEarly: false, convert: true });

module.exports = { createTaskSchema, idParamSchema, listTasksQuerySchema, updateTaskSchema };
