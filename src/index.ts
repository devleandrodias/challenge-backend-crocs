import { loggerInfo } from "./utils/logger";
import { kafka } from "./configs/kafka.config";
import { EventInput } from "./models/EventInput";
import { EKafkaTopics } from "./shared/infra/kafka/topics/EKafkaTopics";
import { TrackingIpService } from "./modules/trackingIp/trackingIp.service";

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

      const trackingIpService = new TrackingIpService();

      await trackingIpService.track(eventInput);
    },
  });
})();
