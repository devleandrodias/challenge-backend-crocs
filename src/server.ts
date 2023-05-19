import { loggerInfo } from "./utils/logger";
import { EventInput } from "./models/EventInput";
import { parseStringToObj } from "./utils/parser";
import { TrackingIpService } from "./modules/trackingIp/trackingIp.service";
import { EventInputConsumer } from "./shared/infra/kafka/consumers/event-input.consumer";

(async () => {
  const trackingIpService = new TrackingIpService();

  await new EventInputConsumer().consume(async ({ message, topic }) => {
    loggerInfo({ log: `Receiving message: TOPIC: [${topic}]` });

    const eventInput = parseStringToObj<EventInput>(
      message.value?.toString() || ""
    );

    await trackingIpService.track(eventInput);
  });
})();
