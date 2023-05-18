import { Message } from "kafkajs";
import { kafka } from "./configs/kafka.config";
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

      // Get geographical locations by IP
      const location = await fakeApi(eventInput);

      /**
       * Verify on cache if IP already exists (Valid per 30 minutes)
       * If not exists => Get data from api
       * If exists => Get data from cache
       */

      // Producer message on kafka topic (Output)
      const producer = kafka.producer();

      await producer.connect();

      const messageLocation: Message = {
        key: eventInput.clientId,
        value: JSON.stringify(location),
      };

      await producer.send({
        topic: EKafkaTopics.LOCATION_OUTPUT,
        messages: [messageLocation],
      });

      await producer.disconnect();
    },
  });
}

main();
