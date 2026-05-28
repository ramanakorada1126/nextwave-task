const { createApp } = require("./app");
const { env } = require("./config/env");

// NOTE: Redis is temporarily disabled.
// const { redis } = require("./cache/redis");
// const { seedIfNeeded } = require("./startup/seed");


const app = createApp();

const PORT = process.env.PORT
console.log(PORT)

app.listen(PORT,()=>{
    console.log(`server hitting 💥 on http://localhost:${PORT}`)
})


