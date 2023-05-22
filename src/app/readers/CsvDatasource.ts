import readline from "node:readline";

import { injectable } from "tsyringe";
import { Readable } from "node:stream";
import { createReadStream } from "node:fs";

import { loggerInfo } from "../../utils/logger";
import { constants } from "../constants/constants";
import { getFilePath } from "../../utils/getFilePath";
import { DataSourceInput } from "../../types/DataSourceInput";

@injectable()
export class CsvDataSource extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  private parseDataString(dataString: string): {
    timestamp: number;
    clientId: string;
    ip: string | null;
  } {
    const [timestampStr, clientId, ip] = dataString.split(",");
    const timestamp = parseInt(timestampStr);
    return { timestamp, clientId, ip };
  }

  _read(): void {
    loggerInfo({ type: "info", log: "[READER: Csv]: Reading data" });

    const fileInputPath = getFilePath(
      constants.DATASOURCE_INPUT_PATH,
      "input-test.csv"
    );

    let isFirstLine = true;

    const rl = readline.createInterface({
      input: createReadStream(fileInputPath),
      output: process.stdout,
      terminal: false,
    });

    rl.on("line", (line) => {
      if (isFirstLine) {
        isFirstLine = false;
        return;
      }

      const { timestamp, clientId, ip } = this.parseDataString(line);

      if (!ip) {
        return;
      }

      const data: DataSourceInput = {
        ip,
        clientId,
        timestamp: Number(timestamp),
      };

      this.push(data);
    });

    rl.on("close", () => {
      this.push(null);
    });
  }
}
