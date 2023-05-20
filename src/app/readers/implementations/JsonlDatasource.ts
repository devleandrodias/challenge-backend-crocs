import { IDataSource } from "../IDataSource";
import { loggerInfo } from "../../../utils/logger";
import { DataSourceInput } from "../types/DataSourceInput";

export class JsonlDatasource implements IDataSource {
  async read(): Promise<DataSourceInput[]> {
    loggerInfo({
      type: "info",
      log: "[READER: Jsonl]: Reading data",
    });

    return [];
  }
}
