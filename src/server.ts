import { loggerInfo } from "./utils/logger";
import { kafka } from "./configs/kafka.config";
import { EventInput } from "./models/EventInput";
import { parseStringToObj } from "./utils/parser";
import { EKafkaTopics } from "./shared/infra/kafka/EKafkaTopics";
import { TrackingIpService } from "./modules/trackingIp/trackingIp.service";

(async () => {
  const trackingIpService = new TrackingIpService();

  const consumer = kafka.consumer({ groupId: "event-input" });

  await consumer.connect();
  await consumer.subscribe({ topic: EKafkaTopics.EVENTS_INPUT });

  await consumer.run({
    eachMessage: async ({ message, topic }) => {
      loggerInfo({ log: `Receiving message: TOPIC: [${topic}]` });

      const eventInput = parseStringToObj<EventInput>(
        message.value?.toString() || ""
      );

      await trackingIpService.track(eventInput);
    },
  });
})();
