const Redis = require("ioredis");
const { env } = require("../config/env");

const redis = env.REDIS_ENABLED
  ? new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true
    })
  : null;

async function invalidateAssigneeTaskListCache(orgId, assigneeId) {
  if (!redis) return;
  const pattern = `tasklist:${orgId}:${assigneeId}:*`;
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", "200");
    cursor = nextCursor;
    if (keys.length) await redis.del(keys);
  } while (cursor !== "0");
}

async function getJson(key) {
  if (!redis) return null;
  const raw = await redis.get(key);
  if (!raw) return null;
  return JSON.parse(raw);
}

async function setJson(key, value, ttlSeconds) {
  if (!redis) return;
  const raw = JSON.stringify(value);
  await redis.set(key, raw, "EX", ttlSeconds);
}

module.exports = { getJson, invalidateAssigneeTaskListCache, redis, setJson };
