import { loggerInfo } from "../utils/logger";
import { parseStringToObj } from "../utils/parser";
import { GeolocationOutput } from "../app/writers/types/GeolocationOutput";
import { LocationOutputConsumer } from "../shared/infra/kafka/consumers/location-output.consumer";

(async () => {
  await new LocationOutputConsumer().consume(async ({ message, topic }) => {
    loggerInfo({ type: "info", log: `Receiving message: TOPIC: [${topic}]` });

    console.log(
      parseStringToObj<GeolocationOutput>(message.value?.toString() || "")
    );
  });
})();
