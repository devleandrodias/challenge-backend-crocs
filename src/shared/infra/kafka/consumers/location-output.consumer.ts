import { EKafkaTopics } from "../EKafkaTopics";
import { EKafkaGroupId } from "../EKafkaGroupIds";

import { loggerInfo } from "../../../../utils/logger";
import { kafka } from "../../../../configs/kafka.config";

(async () => {
  const consumer = kafka.consumer({
    groupId: EKafkaGroupId.LOCATION_OUTPUT,
  });

  await consumer.connect();

  await consumer.subscribe({
    topic: EKafkaTopics.LOCATION_OUTPUT,
  });

  await consumer.run({
    eachMessage: async ({ topic }) => {
      loggerInfo({ log: `Receiving message: TOPIC: [${topic}]` });
    },
  });
})();
