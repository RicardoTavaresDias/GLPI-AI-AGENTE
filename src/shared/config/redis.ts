import { createClient } from "redis"
import { env } from "./env"

const redisClient = createClient({
  url: `redis://:${env.PASSWORD_REDIS}@${env.HOST_REDIS}:${env.PORT_REDIS}`
})

redisClient.on("error", (err) => console.error("Redis Client Error", err))
redisClient.on("connect", () => console.log("Redis conectado!"))
redisClient.on("ready", () => console.log("Redis pronto para uso!"))

async function connectRedis() {
  await redisClient.connect()
}

connectRedis()

export { redisClient, connectRedis }
