const dotenv = require("dotenv");
const Joi = require("joi");

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().integer().positive().default(3000),

  MYSQL_HOST: Joi.string().default("localhost"),
  MYSQL_PORT: Joi.number().integer().positive().default(3306),
  MYSQL_USER: Joi.string().default("root"),
  MYSQL_PASSWORD: Joi.string().default("password"),
  MYSQL_DATABASE: Joi.string().default("task_tracker"),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_TTL_SECONDS: Joi.number().integer().positive().default(900),
  REFRESH_TOKEN_TTL_DAYS: Joi.number().integer().positive().default(14),

  REDIS_URL: Joi.string().default("redis://localhost:6379"),

  SEED_ADMIN: Joi.boolean().truthy("true").falsy("false").default(false),
  SEED_ORG_NAME: Joi.string().default("Demo Org"),
  SEED_ADMIN_EMAIL: Joi.string().email().default("admin@example.com"),
  SEED_ADMIN_PASSWORD: Joi.string().min(8).default("Admin@12345")
})
  .unknown(true)
  .prefs({ abortEarly: false, convert: true });

const { value: env, error } = envSchema.validate(process.env);
if (error) {
  const message = error.details.map((d) => d.message).join("; ");
  throw new Error(`Invalid environment variables: ${message}`);
}

module.exports = { env };
