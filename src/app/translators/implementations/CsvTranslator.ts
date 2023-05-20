import fs from "node:fs";

import { parse } from "csv-parse";
import { injectable } from "tsyringe";

import { ITranslator } from "../ITranslator";
import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { DataSourceInput } from "../../../types/DataSourceInput";
import { GeolocationOutput } from "../../../types/GeolocationOutput";

@injectable()
export class CsvTranslator implements ITranslator {
  async translate(input: DataSourceInput): Promise<GeolocationOutput> {
    loggerInfo({
      type: "info",
      log: "[TRANSLATOR: Csv]: Translating data",
    });

    return new Promise((resolve, reject) => {
      const fileInputPath = getFilePath(constants.TRANSLATOR_PATH, "IPs.csv");

      const readStream = fs.createReadStream(fileInputPath, "utf-8");

      const csvStream = readStream.pipe(parse());

      let location: GeolocationOutput;

      csvStream.on("data", (row: string) => {
        const [ip, latitude, longitude, country, state, city] = row;

        if (ip === input.ip) {
          location = {
            ip: input.ip,
            clientId: input.clientId,
            timestamp: input.timestamp,
            city,
            country,
            region: state,
            latitude: Number(latitude),
            longitude: Number(longitude),
          };
        }
      });

      csvStream.on("end", () => {
        resolve(location);
      });

      readStream.on("error", (error) => {
        reject(error);
      });
    });
  }
}
