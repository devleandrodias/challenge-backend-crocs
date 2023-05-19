import { EachMessageHandler } from "kafkajs";

import { EKafkaTopics } from "../EKafkaTopics";
import { EKafkaGroupId } from "../EKafkaGroupIds";

import { kafka } from "../../../../configs/kafka.config";

export class LocationOutputConsumer {
  async consume(eachMessage: EachMessageHandler) {
    const consumer = kafka.consumer({ groupId: EKafkaGroupId.LOCATION_OUTPUT });

    await consumer.connect();
    await consumer.subscribe({ topic: EKafkaTopics.LOCATION_OUTPUT });
    await consumer.run({ eachMessage });
  }
}
