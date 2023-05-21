import { Readable } from "node:stream";
import { createReadStream } from "node:fs";

import { parse } from "csv-parse";
import { injectable } from "tsyringe";

import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { DataSourceInput } from "../types/DataSourceInput";

@injectable()
export class CsvDatasource extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read(): void {
    loggerInfo({ type: "info", log: "[READER: Csv]: Reading data" });

    const fileInputPath = getFilePath(
      constants.DATASOURCE_INPUT_PATH,
      "input-test.csv"
    );

    let isFirstLine = true;

    createReadStream(fileInputPath)
      .pipe(parse())
      .on("data", (row) => {
        if (isFirstLine) {
          isFirstLine = false;
          return;
        }

        const [timestamp, clientId, ip] = row;

        const data: DataSourceInput = {
          ip,
          clientId,
          timestamp: Number(timestamp),
        };

        this.push(data);
      })
      .on("end", () => {
        this.push(null);
      });
  }
}
