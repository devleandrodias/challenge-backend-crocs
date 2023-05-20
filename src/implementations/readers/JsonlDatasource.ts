import { DataSourceInput } from "../../types/DataSourceInput";
import { IDataSource } from "../interfaces/IDataSource";

export class JsonlDatasource implements IDataSource {
  read(): Promise<DataSourceInput[]> {
    throw new Error("Method not implemented.");
  }
}
