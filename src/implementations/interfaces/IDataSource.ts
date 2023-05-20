export interface IDataSource {
  read(): Promise<void>;
}
