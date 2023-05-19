import { EachMessageHandler } from "kafkajs";

import { EKafkaTopics } from "../EKafkaTopics";
import { EKafkaGroupId } from "../EKafkaGroupIds";

import { kafka } from "../../../../configs/kafka.config";

export class EventInputConsumer {
  async consume(eachMessage: EachMessageHandler) {
    const consumer = kafka.consumer({ groupId: EKafkaGroupId.EVENT_INPUT });

    await consumer.connect();
    await consumer.subscribe({ topic: EKafkaTopics.EVENTS_INPUT });
    await consumer.run({ eachMessage });
  }
}
