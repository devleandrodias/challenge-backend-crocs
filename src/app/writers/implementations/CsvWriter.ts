import { Transform } from "node:stream";
import { createWriteStream } from "node:fs";

import { injectable } from "tsyringe";

import { IWriter } from "../IWriter";
import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { GeolocationOutput } from "../../../types/GeolocationOutput";

@injectable()
export class CsvWriter implements IWriter {
  async write(localtion: GeolocationOutput): Promise<void> {
    loggerInfo({
      type: "info",
      log: "[WRITER: Csv]: Writing data",
    });

    const fileOutputPath = getFilePath(constants.OUTPUT_PATH, "output.csv");

    const writeStream = createWriteStream(fileOutputPath);

    const csvTransform = new Transform({
      objectMode: true,
      transform(chunk, _, callback) {
        const {
          ip,
          city,
          country,
          latitude,
          longitude,
          timestamp,
          clientId: id,
          region: state,
        } = chunk as GeolocationOutput;

        const csvRow = [
          timestamp,
          id,
          ip,
          latitude,
          longitude,
          country,
          state,
          city,
        ].join(",");

        callback(null, csvRow + "\n");
      },
    });

    const headerRow = "timestamp,id,ip,latitude,longitude,country,state,city\n";
    writeStream.write(headerRow);

    csvTransform.pipe(writeStream);
    csvTransform.write(localtion);
    csvTransform.end();

    writeStream.on("error", (_) => {
      loggerInfo({
        type: "error",
        log: "Error creating CSV file:",
      });
    });

    writeStream.on("finish", () => {
      loggerInfo({
        type: "success",
        log: "CSV file successfully saved!",
      });
    });
  }
}
