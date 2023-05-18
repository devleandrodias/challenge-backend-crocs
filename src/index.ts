import { Message } from "kafkajs";

import { kafka } from "./configs/kafka.config";
import { redisClient } from "./configs/redis.config";

import { EventInput } from "./models/EventInput";
import { LocationOutput } from "./models/LocationOutput";

import { EKafkaTopics } from "./infrastructure/kafka/topics/EKafkaTopics";

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

// * Producer message on kafka topic (Output)
async function producerLocationOutput(
  input: EventInput,
  output: LocationOutput
) {
  const producer = kafka.producer();

  await producer.connect();

  const messageLocation: Message = {
    key: input.clientId,
    value: JSON.stringify(output),
  };

  await producer.send({
    topic: EKafkaTopics.LOCATION_OUTPUT,
    messages: [messageLocation],
  });

  await producer.disconnect();
}

async function main() {
  // Read IPs from kafka topic consumer (Input)
  const consumer = kafka.consumer({ groupId: "event-input" });

  await consumer.connect();

  await consumer.subscribe({
    topic: EKafkaTopics.EVENTS_INPUT,
  });

  await consumer.run({
    eachMessage: async ({ message, topic, partition }) => {
      console.log(
        `Receiving message: TOPIC: [${topic}] | Partition [${partition}]`
      );

      const eventInput = JSON.parse(
        message.value?.toString() || ""
      ) as EventInput;

      console.log(eventInput);

      // Verify on cache if IP already exists
      redisClient.on("error", (err) => console.log("Redis Client Error", err));

      await redisClient.connect();

      const locationOutputCache = await redisClient.get(eventInput.ip);

      // If exists => Get data from cache
      if (locationOutputCache) {
        console.log(`[IP: ${eventInput.ip}] - Found in cache`);

        await producerLocationOutput(
          eventInput,
          JSON.parse(locationOutputCache)
        );
      }

      // If not exists => Get data from api
      if (!locationOutputCache) {
        console.log(`[IP: ${eventInput.ip}] - Not found in cache`);

        // Get geographical locations by IP
        const locationOutputApi = await fakeApi(eventInput);

        // Set location in cache
        redisClient.set(eventInput.ip, JSON.stringify(locationOutputApi));

        await producerLocationOutput(eventInput, locationOutputApi);
      }
    },
  });
}

main();
