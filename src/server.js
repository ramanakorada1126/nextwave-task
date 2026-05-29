const { createApp } = require("./app");
const { env } = require("./config/env");
const { connectDB } = require("./db/connectDb");
const { redis } = require("./cache/redis");


async function main() {
   await connectDB();
 
  if (env.REDIS_ENABLED && redis) {
    await redis.ping();
  }

  const app = createApp();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on :${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

