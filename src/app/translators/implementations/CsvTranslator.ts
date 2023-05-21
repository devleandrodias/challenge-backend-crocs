import { createReadStream } from "node:fs";
import { Transform, TransformCallback } from "node:stream";

import { parse } from "csv-parse";
import { injectable } from "tsyringe";

import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { DataSourceInput } from "../../readers/types/DataSourceInput";
import { GeolocationOutput } from "../../writers/types/GeolocationOutput";

@injectable()
export class CsvTranslator extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(
    chunk: DataSourceInput,
    _: BufferEncoding,
    callback: TransformCallback
  ): void {
    loggerInfo({
      type: "info",
      log: `[TRANSLATOR: Csv]: Translating data - IP [${chunk.ip}]`,
    });

    const fileInputPath = getFilePath(constants.TRANSLATOR_PATH, "IPs.csv");

    const readStream = createReadStream(fileInputPath);

    readStream.pipe(parse()).on("data", (row) => {
      const [ip, latitude, longitude, country, state, city] = row;

      if (ip === chunk.ip) {
        const location: GeolocationOutput = {
          ip: chunk.ip,
          clientId: chunk.clientId,
          timestamp: chunk.timestamp,
          city,
          country,
          region: state,
          latitude: Number(latitude),
          longitude: Number(longitude),
        };

        callback(null, location);
      }
    });
  }
}
