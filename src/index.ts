import { kafka } from "./configs/kafka.config";
import { EKafkaTopics } from "./infrastructure/kafka/topics/EKafkaTopics";
import { EventInput } from "./models/EventInput";

async function main() {
  // Read IPs from kafka topic consumer (Input)
  const consumer = kafka.consumer({ groupId: "event-input" });

  await consumer.connect();

  await consumer.subscribe({
    topic: EKafkaTopics.EVENTS_INPUT,
  });

  await consumer.run({
    eachMessage: async ({ message, topic, partition }) => {
      const response = JSON.parse(
        message.value?.toString() || ""
      ) as EventInput;

      console.log(
        `Receiving message: TOPIC: [${topic}] | Partition [${partition}]`
      );

      console.log(response);
      // Verify on cache if IP already exists (Valid per 30 minutes)
      // If not exists -> Get geographical locations by IP
      // If exists -> Get data from cache
      // Producer message on kafka topic (Output)
    },
  });
}

main();
