import { loggerInfo } from "../utils/logger";
import { kafka } from "../configs/kafka.config";
import { EKafkaTopics } from "../shared/infra/kafka/topics/EKafkaTopics";

(async () => {
  const consumer = kafka.consumer({ groupId: "location-output" });
  await consumer.connect();
  await consumer.subscribe({ topic: EKafkaTopics.LOCATION_OUTPUT });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      loggerInfo({
        log: `Receiving message: TOPIC: [${topic}] | Partition [${partition}]`,
      });

      console.log(JSON.parse(message.value?.toString() || ""));
    },
  });
})();
