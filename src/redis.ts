import IORedis from "ioredis";

const {
  REDIS_HOST = "127.0.0.1",
  REDIS_PORT = "6379",
  REDIS_PASSWORD,
  REDIS_DB = "0",
} = process.env;

export const redisConnection = new IORedis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
  db: Number(REDIS_DB),
  maxRetriesPerRequest: null,
});
