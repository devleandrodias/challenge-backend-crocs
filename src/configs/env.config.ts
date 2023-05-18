import env from "env-var";

export const envs = {
  kafkaBrokers: env.get("KAFKA_BROKERS").required().asString(),
  kafkaClientId: env.get("KAFKA_CLIENT_ID").required().asString(),
  redisServerUrl: env.get("REDIS_SERVER_URL").required().asString(),
};
