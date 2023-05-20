import { loggerInfo } from "../../utils/logger";
import { IDataSource } from "./IDataSource";
import { DataSourceInput } from "../../types/DataSourceInput";

export class KafkaTopicDatasource implements IDataSource {
  async read(): Promise<DataSourceInput[]> {
    loggerInfo({
      type: "info",
      log: "[READER: Kafka]: Reading data",
    });

    return [];
  }
}
