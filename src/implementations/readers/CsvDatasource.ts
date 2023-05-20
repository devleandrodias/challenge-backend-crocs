import fs from "node:fs";
import { Transform } from "node:stream";

import { parse } from "csv-parse";
import { injectable } from "tsyringe";

import { loggerInfo } from "../../utils/logger";
import { IDataSource } from "../interfaces/IDataSource";
import { geolocationApi } from "../../apis/geolocation.api";
import { GeolocationResponse } from "../../types/GeolocationResponse";

@injectable()
export class CsvDatasource implements IDataSource {
  async read(): Promise<void> {
    loggerInfo({ log: "Reading data from CSV Reader..." });

    const fileInputPath = "src/data/IPs-api.csv";
    const filtOutputPath = "src/output/IPs.json";

    const readStream = fs.createReadStream(fileInputPath);
    const writeStream = fs.createWriteStream(filtOutputPath);

    const csvToJsonTransform = new Transform({
      objectMode: true,
      async transform(chunk, _, callback) {
        const [ip] = chunk;

        const { data } = await geolocationApi.get<GeolocationResponse>(`${ip}`);

        const obj = {
          ip,
          clientId: ip,
          timestamp: Math.random() * 100,
          city: data.city,
          country: data.country,
          region: data.regionName,
          latitude: data.lat,
          longitude: data.lon,
        };

        this.push(JSON.stringify(obj) + "\n");

        callback();
      },
    });

    readStream.pipe(parse()).pipe(csvToJsonTransform).pipe(writeStream);

    readStream.on("end", () => {
      console.log("CSV file read completed..");
    });

    writeStream.on("finish", () => {
      console.log("Conversion to JSON completed.");
    });
  }
}
