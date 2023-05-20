import { DataSourceInput } from "../../types/DataSourceInput";

export interface IDataSource {
  read(): Promise<DataSourceInput[]>;
}
