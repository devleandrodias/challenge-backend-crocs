import { loggerInfo } from "./utils/logger";
import { parseStringToObj } from "./utils/parser";
import { DataSourceInput } from "./types/DataSourceInput";
import { TrackingIpService } from "./modules/trackingIp/trackingIp.service";
import { EventInputConsumer } from "./shared/infra/kafka/consumers/event-input.consumer";

(async () => {
  const trackingIpService = new TrackingIpService();

  await new EventInputConsumer().consume(async ({ message, topic }) => {
    loggerInfo({ log: `Receiving message: TOPIC: [${topic}]` });

    const eventInput = parseStringToObj<DataSourceInput>(
      message.value?.toString() || ""
    );

    await trackingIpService.track(eventInput);
  });
})();
