import fs from "node:fs";
import sqlite3 from "sqlite3";
import { injectable } from "tsyringe";
import { Transform } from "node:stream";

import { loggerInfo } from "../../utils/logger";
import { IDataSource } from "../interfaces/IDataSource";
import { geolocationApi } from "../../apis/geolocation.api";
import { GeolocationApiResponse } from "../../types/GeolocationApiResponse";

@injectable()
export class SqliteDatasource implements IDataSource {
  async read(): Promise<void> {
    loggerInfo({ log: "Read data from sqlite database..." });

    const databasePath = "src/data/IPs.sqlite";
    const filtOutputPath = "src/output/IPs-sqlite.json";

    const db = new sqlite3.Database(databasePath);

    const writeStream = fs.createWriteStream(filtOutputPath);

    const transformStream = new Transform({
      objectMode: true,
      async transform(chunk, _, callback) {
        const { ip } = chunk;

        const { data } = await geolocationApi.get<GeolocationApiResponse>(
          `${ip}`
        );

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

    db.all("SELECT * FROM IPs", (err, rows) => {
      if (err) {
        console.error("An error occurred while reading the data:", err);
        return;
      }

      transformStream.pipe(writeStream);

      rows.forEach((row) => {
        transformStream.write(row);
      });

      transformStream.end();

      transformStream.on("end", () => {
        console.log("Conversion to JSON completed.");
        db.close();
      });

      transformStream.on("error", (error) => {
        console.error("An error occurred during the conversion:", error);
        db.close();
      });

      writeStream.on("finish", () => {
        console.log("Conversion to JSON completed.");
      });
    });
  }
}
