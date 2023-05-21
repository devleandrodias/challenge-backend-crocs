import { kafka } from "../configs/kafka.config";
import { parseStringToObj } from "../utils/parser";
import { EKafkaTopics } from "../shared/infra/kafka/EKafkaTopics";
import { EKafkaGroupId } from "../shared/infra/kafka/EKafkaGroupIds";
import { GeolocationOutput } from "../app/writers/types/GeolocationOutput";

(async () => {
  console.clear();

  const consumer = kafka.consumer({ groupId: EKafkaGroupId.LOCATION_OUTPUT });

  await consumer.connect();
  await consumer.subscribe({ topic: EKafkaTopics.LOCATION_OUTPUT });
  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(
        parseStringToObj<GeolocationOutput>(message.value?.toString() || "")
      );
    },
  });
})();
