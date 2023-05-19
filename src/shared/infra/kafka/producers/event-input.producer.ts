import { Message, Partitioners } from "kafkajs";

import { EKafkaTopics } from "../EKafkaTopics";
import { kafka } from "../../../../configs/kafka.config";

export class EventInputProducer {
  async produce(message: Message) {
    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    await producer.connect();

    await producer.send({
      topic: EKafkaTopics.EVENTS_INPUT,
      messages: [message],
    });

    await producer.disconnect();
  }
}
