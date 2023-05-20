import { injectable } from "tsyringe";
import { loggerInfo } from "../../utils/logger";
import { IDataSource } from "../interfaces/IDataSource";

@injectable()
export class SqliteDatasource implements IDataSource {
  async read(): Promise<void> {
    loggerInfo({
      log: "Read data from sqlite database...",
    });
  }
}
