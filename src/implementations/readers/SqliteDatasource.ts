import { injectable } from "tsyringe";
import { loggerInfo } from "../../utils/logger";
import { IDataSource } from "../interfaces/IDataSource";

@injectable()
export class SqliteDatasource implements IDataSource {
  read(): void {
    loggerInfo({
      log: "Read data from sqlite database...",
    });
  }
}
