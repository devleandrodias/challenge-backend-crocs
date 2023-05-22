import { Writable } from "node:stream";
import { injectable } from "tsyringe";

import { Message, Partitioners } from "kafkajs";
import { loggerInfo } from "../../utils/logger";
import { kafka } from "../../configs/kafka.config";
import { parseObjToString } from "../../utils/parser";
import { EKafkaTopics } from "../../shared/enuns/EKafkaTopics";
import { GeolocationOutput } from "../../types/GeolocationOutput";

@injectable()
export class KafkaTopicWriter extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  async _write(
    chunk: GeolocationOutput,
    _: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): Promise<void> {
    loggerInfo({
      type: "info",
      log: `[WRITER: Kafka]: Writing data - IP [${chunk.ip}]`,
    });

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

    callback(null);
  }
}
