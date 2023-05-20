import fs from "node:fs";
import { Transform } from "node:stream";

import { parse } from "csv-parse";
import { injectable } from "tsyringe";

import { IDataSource } from "../IDataSource";
import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { DataSourceInput } from "../types/DataSourceInput";

@injectable()
export class CsvDatasource implements IDataSource {
  async read(): Promise<DataSourceInput[]> {
    loggerInfo({
      type: "info",
      log: "[READER: Csv]: Reading data",
    });

    const fileInputPath = getFilePath(
      constants.DATASOURCE_INPUT_PATH,
      "input.csv"
    );

    const dataSourceInput: DataSourceInput[] = [];

    const readStream = fs.createReadStream(fileInputPath);

    const convertCsvToDataSourceInput = new Transform({
      objectMode: true,
      async transform(chunk, _, callback) {
        const [timestamp, clientId, ip] = chunk;
        dataSourceInput.push({ ip, clientId, timestamp });
        callback();
      },
    });

    readStream.pipe(parse()).pipe(convertCsvToDataSourceInput);

    readStream.on("end", () => {
      loggerInfo({ type: "success", log: "CSV file read completed" });
    });

    return dataSourceInput;
  }
}
