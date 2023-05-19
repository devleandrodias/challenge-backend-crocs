import { kafka } from "./configs/kafka.config";
import { redisClient } from "./configs/redis.config";

import { EventInput } from "./models/EventInput";
import { LocationOutput } from "./models/LocationOutput";

import { loggerInfo } from "./utils/logger";
import { EKafkaTopics } from "./shared/infra/kafka/topics/EKafkaTopics";
import { TrackingIpRepository } from "./modules/trackingIp/trackingIp.repository";

async function fakeApi(input: EventInput): Promise<LocationOutput> {
  return {
    ip: input.ip,
    clientId: input.clientId,
    timestamp: input.timestamp,
    city: "San Francisco",
    country: "United States",
    region: "California",
    latitude: 37.7749,
    longitude: -122.4194,
  };
}

async function producerMessageIfFoundInCache(
  input: EventInput,
  output: LocationOutput
) {
  const { ip, clientId } = input;
  const trackingIpRepository = new TrackingIpRepository();

  loggerInfo({ log: `[IP: ${ip}] - Found in cache` });
  await trackingIpRepository.saveLocation(clientId, output);
}

async function producerMessageIfNotFoundInCache(input: EventInput) {
  const { ip, clientId } = input;
  const trackingIpRepository = new TrackingIpRepository();

  loggerInfo({
    log: `[IP: ${ip}] - NOT found in cache, getting location informations from API`,
  });

  const output = await fakeApi(input);

  await redisClient.set(input.ip, JSON.stringify(output), { EX: 30, NX: true });
  await trackingIpRepository.saveLocation(clientId, output);
}

(async () => {
  const consumer = kafka.consumer({ groupId: "event-input" });
  await consumer.connect();
  await consumer.subscribe({ topic: EKafkaTopics.EVENTS_INPUT });

  await consumer.run({
    eachMessage: async ({ message, topic, partition }) => {
      loggerInfo({
        log: `Receiving message: TOPIC: [${topic}] | Partition [${partition}]`,
      });

      const eventInput = JSON.parse(
        message.value?.toString() || ""
      ) as EventInput;

      redisClient.on("error", (err) => console.log("Redis Client Error", err));

      await redisClient.connect();

      const locationOutputCache = await redisClient.get(eventInput.ip);

      if (locationOutputCache) {
        producerMessageIfFoundInCache(
          eventInput,
          JSON.parse(locationOutputCache) as LocationOutput
        );
      }

      if (!locationOutputCache) {
        producerMessageIfNotFoundInCache(eventInput);
      }

      await redisClient.disconnect();
    },
  });
})();
