import { loggerInfo } from "../utils/logger";
import { parseStringToObj } from "../utils/parser";
import { LocationOutput } from "../models/LocationOutput";
import { LocationOutputConsumer } from "../shared/infra/kafka/consumers/location-output.consumer";

(async () => {
  await new LocationOutputConsumer().consume(async ({ message, topic }) => {
    loggerInfo({ log: `Receiving message: TOPIC: [${topic}]` });

    console.log(
      parseStringToObj<LocationOutput>(message.value?.toString() || "")
    );
  });
})();
