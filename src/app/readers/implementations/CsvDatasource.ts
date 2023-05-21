import readline from "node:readline";

import { createReadStream } from "node:fs";
import { Readable, Transform, pipeline } from "node:stream";

import { parse } from "csv-parse";
import { injectable } from "tsyringe";

import { IDataSource } from "../IDataSource";
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

    // const fileInputPath = getFilePath(
    //   constants.DATASOURCE_INPUT_PATH,
    //   "input-test.csv"
    // );

    // const rl = readline.createInterface({
    //   input: createReadStream(fileInputPath),
    //   output: process.stdout,
    //   terminal: false,
    // });

    // rl.on("line", (line) => {
    //   const data: DataSourceInput = {
    //     ip: "59.90.255.63",
    //     timestamp: 1684196387094,
    //     clientId: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
    //   };

    //   console.log("READER: ", data);

    //   this.push(data);
    // });

    // rl.on("close", () => {
    //   this.push(null);
    // });

    const data1: DataSourceInput = {
      ip: "59.90.255.63",
      timestamp: 1684196387094,
      clientId: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
    };

    const data2: DataSourceInput = {
      ip: "59.90.255.64",
      timestamp: 1684196387094,
      clientId: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
    };

    const data3: DataSourceInput = {
      ip: "59.90.255.65",
      timestamp: 1684196387094,
      clientId: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
    };

    this.push(data1);
    this.push(data2);
    this.push(data3);
    this.push(null);
  }
}
