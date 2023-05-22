import { Writable } from "node:stream";
import { injectable } from "tsyringe";

import { loggerInfo } from "../../utils/logger";
import { GeolocationOutput } from "../../types/GeolocationOutput";
import { IKafkaService, KafkaService } from "../../shared/infra/KafkaService";

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

    await new KafkaService().produceLocationOutputMessage(chunk);

    callback(null);
  }
}
