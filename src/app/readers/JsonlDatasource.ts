import { loggerInfo } from "../../utils/logger";
import { IDataSource } from "../../interfaces/IDataSource";
import { DataSourceInput } from "../../types/DataSourceInput";

export class JsonlDatasource implements IDataSource {
  async read(): Promise<DataSourceInput[]> {
    loggerInfo({
      type: "info",
      log: "[READER: Jsonl]: Reading data",
    });

    return [];
  }
}
