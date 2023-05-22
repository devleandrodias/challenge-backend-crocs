import { Message, Partitioners } from "kafkajs";

import { kafka } from "../../configs/kafka.config";
import { EKafkaTopics } from "../enuns/EKafkaTopics";
import { parseObjToString } from "../../utils/parser";
import { GeolocationOutput } from "../../types/GeolocationOutput";

export interface IKafkaService {
  produceLocationOutputMessage(message: GeolocationOutput): Promise<void>;
}

export class KafkaService implements IKafkaService {
  async produceLocationOutputMessage(chunk: GeolocationOutput): Promise<void> {
    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    await producer.connect();

    const key = chunk.clientId;

    Reflect.deleteProperty(chunk, "clientId");

    const value = parseObjToString<GeolocationOutput>(chunk);

    const message: Message = { key, value };

    await producer.send({
      topic: EKafkaTopics.LOCATION_OUTPUT,
      messages: [message],
    });

    await producer.disconnect();
  }
}
