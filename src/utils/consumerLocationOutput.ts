import { kafka } from "../configs/kafka.config";
import { LocationOutput } from "../models/LocationOutput";
import { EKafkaTopics } from "../infrastructure/kafka/topics/EKafkaTopics";

async function run() {
  const consumer = kafka.consumer({ groupId: "location-output" });

  await consumer.connect();

  await consumer.subscribe({
    topic: EKafkaTopics.LOCATION_OUTPUT,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `Receiving message: TOPIC: [${topic}] | Partition [${partition}]`
      );

      const locationOutput = JSON.parse(
        message.value?.toString() || ""
      ) as LocationOutput;

      console.log(locationOutput);
    },
  });
}

run();
