import { injectable } from "tsyringe";
import { loggerInfo } from "../../utils/logger";
import { IDataSource } from "../interfaces/IDataSource";

@injectable()
export class CsvDatasource implements IDataSource {
  read(): void {
    loggerInfo({
      log: "Reading data from CSV Reader...",
    });
  }
}
