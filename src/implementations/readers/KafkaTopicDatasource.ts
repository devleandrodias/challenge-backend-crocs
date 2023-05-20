import { DataSourceInput } from "../../types/DataSourceInput";
import { IDataSource } from "../interfaces/IDataSource";

export class KafkaTopicDatasource implements IDataSource {
  async read(): Promise<DataSourceInput[]> {
    throw new Error("Method not implemented.");
  }
}
