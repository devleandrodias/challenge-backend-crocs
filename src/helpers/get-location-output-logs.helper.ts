import { loggerInfo } from "../utils/logger";
import { LocationOutputConsumer } from "../shared/infra/kafka/consumers/location-output.consumer";

(async () => {
  await new LocationOutputConsumer().consume(async ({ topic }) => {
    loggerInfo({ log: `Receiving message: TOPIC: [${topic}]` });
  });
})();
