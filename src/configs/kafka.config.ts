import { Kafka } from "kafkajs";

import { envs } from "./env.config";

export const kafka = new Kafka({
  clientId: envs.kafkaClientId,
  brokers: envs.kafkaBrokers.split(","),
});
