import { loggerInfo } from "../../../../utils/logger";
import { kafka } from "../../../../configs/kafka.config";
import { EventInput } from "../../../../models/EventInput";
import { parseStringToObj } from "../../../../utils/parser";
import { TrackingIpService } from "../../../../modules/trackingIp/trackingIp.service";

import { EKafkaTopics } from "../EKafkaTopics";
import { EKafkaGroupId } from "../EKafkaGroupIds";

(async () => {
  const trackingIpService = new TrackingIpService();

  const consumer = kafka.consumer({
    groupId: EKafkaGroupId.EVENT_INPUT,
  });

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
