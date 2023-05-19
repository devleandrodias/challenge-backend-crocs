import { Message, Partitioners } from "kafkajs";

import { EKafkaTopics } from "../EKafkaTopics";
import { kafka } from "../../../../configs/kafka.config";

export class LocationOutputProducer {
  async produce(message: Message) {
    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    await producer.connect();

    await producer.send({
      topic: EKafkaTopics.LOCATION_OUTPUT,
      messages: [message],
    });

    await producer.disconnect();
  }
}
