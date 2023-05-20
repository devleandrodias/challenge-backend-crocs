import { injectable } from "tsyringe";

import { loggerInfo } from "../../utils/logger";
import { IWriter } from "../../interfaces/IWriter";
import { GeolocationOutput } from "../../types/GeolocationOutput";

@injectable()
export class KafkaTopicWriter implements IWriter {
  async write(localtion: GeolocationOutput): Promise<void> {
    loggerInfo({
      type: "info",
      log: "[WRITER: Kafka]: Translating data",
    });
  }
}
