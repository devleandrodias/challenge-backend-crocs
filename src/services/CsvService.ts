import { parse } from "csv-parse";
import { createReadStream } from "node:fs";

import { GeolocationCsvResponse } from "../types/GeolocationResponseCsv";

export interface ICsvService {
  getLocationByIp(ip: string): Promise<GeolocationCsvResponse | null>;
}

export class CsvService {
  private filePath: string;

  constructor(csvFilePath: string) {
    this.filePath = csvFilePath;
  }

  async getLocationByIp(
    ipInput: string
  ): Promise<GeolocationCsvResponse | null> {
    return new Promise((resolve) => {
      let response: GeolocationCsvResponse | null = null;

      const readStream = createReadStream(this.filePath);

      readStream.pipe(parse()).on("data", async (row: string) => {
        const [ip, latitude, longitude, country, state, city] = row;

        if (ip === ipInput) {
          response = {
            ip,
            city,
            state,
            country,
            latitude: Number(latitude),
            longitude: Number(longitude),
          };
        }
      });

      readStream.on("close", () => {
        resolve(response);
      });
    });
  }
}
