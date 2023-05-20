import { IDataSource } from "../../interfaces/IDataSource";
import { DataSourceInput } from "../../types/DataSourceInput";

export class KafkaTopicDatasource implements IDataSource {
  async read(): Promise<DataSourceInput[]> {
    throw new Error("Method not implemented.");
  }
}
