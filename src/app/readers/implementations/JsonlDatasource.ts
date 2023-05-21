import readline from "node:readline";
import { Readable } from "node:stream";
import { createReadStream } from "node:fs";

import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { DataSourceInput } from "../types/DataSourceInput";
import { JsonlDataSourceInput } from "../types/JsonlDatasourceInput";

export class JsonlDatasource extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read(): void {
    loggerInfo({
      type: "info",
      log: `[READER: Jsonl]: Reading data from jsonl file`,
    });

    const fileInputPath = getFilePath(
      constants.DATASOURCE_INPUT_PATH,
      "input-test.jsonl"
    );

    const rl = readline.createInterface({
      input: createReadStream(fileInputPath),
      output: process.stdout,
      terminal: false,
    });

    rl.on("line", (line) => {
      const row: JsonlDataSourceInput = JSON.parse(line);

      const dataSourceInput: DataSourceInput = {
        ip: row.ip,
        clientId: row.id,
        timestamp: row.timestamp,
      };

      this.push(dataSourceInput);
    });

    rl.on("close", () => {
      this.push(null);
    });
  }
}
