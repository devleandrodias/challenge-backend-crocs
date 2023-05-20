import { IDataSource } from "../../interfaces/IDataSource";
import { DataSourceInput } from "../../types/DataSourceInput";

export class JsonlDatasource implements IDataSource {
  read(): Promise<DataSourceInput[]> {
    throw new Error("Method not implemented.");
  }
}
