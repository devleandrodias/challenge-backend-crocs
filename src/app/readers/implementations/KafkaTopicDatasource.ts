import { Readable } from "node:stream";

import { loggerInfo } from "../../../utils/logger";
import { kafka } from "../../../configs/kafka.config";
import { parseStringToObj } from "../../../utils/parser";
import { DataSourceInput } from "../types/DataSourceInput";
import { KafkaDatasourceInput } from "../types/KafkaDatasourceInput";
import { EKafkaTopics } from "../../../shared/infra/kafka/EKafkaTopics";
import { EKafkaGroupId } from "../../../shared/infra/kafka/EKafkaGroupIds";

export class KafkaTopicDatasource extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  async _read(): Promise<void> {
    loggerInfo({
      type: "info",
      log: `[READER: Kafka]: Reading data from kafka topic`,
    });

    const consumer = kafka.consumer({ groupId: EKafkaGroupId.EVENT_INPUT });

    await consumer.connect();
    await consumer.subscribe({ topic: EKafkaTopics.EVENTS_INPUT });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = parseStringToObj<KafkaDatasourceInput>(
          message.value?.toString() || ""
        );

        const dataSourceInput: DataSourceInput = {
          ip: value.ip,
          timestamp: value.timestamp,
          clientId: message.key?.toString() || "",
        };

        this.push(dataSourceInput);
      },
    });

    await consumer.disconnect();

    this.push(null);
  }
}
