import sqlite3 from "sqlite3";
import { injectable } from "tsyringe";

import { loggerInfo } from "../../utils/logger";
import { constants } from "../constants/constants";
import { getFilePath } from "../../utils/getFilePath";
import { ITranslator } from "../../interfaces/ITranslator";
import { DataSourceInput } from "../../types/DataSourceInput";
import { GeolocationOutput } from "../../types/GeolocationOutput";
import { GeolocationResponseSqlite } from "../../types/GeolocationSqliteResponse";

@injectable()
export class SqliteTranslator implements ITranslator {
  async translate(input: DataSourceInput): Promise<GeolocationOutput> {
    loggerInfo({
      type: "info",
      log: "Translating data using sqlite database...",
    });

    const databasePath = getFilePath(constants.TRANSLATOR_PATH, "IPs.sqlite");

    const db = new sqlite3.Database(databasePath);

    const query = `SELECT * FROM Ips WHERE ip = ?`;

    return new Promise<GeolocationOutput>((resolve, reject) => {
      db.get<GeolocationResponseSqlite>(query, [input.ip], (err, row) => {
        if (err) {
          loggerInfo({
            type: "error",
            log: `An error occurred while reading the data from sqlite`,
          });

          reject(err);
          return;
        }

        const geolocationOutput: GeolocationOutput = {
          ip: input.ip,
          clientId: input.clientId,
          timestamp: input.timestamp,
          city: row.city,
          region: row.state,
          country: row.country,
          latitude: row.latitude,
          longitude: row.longitude,
        };

        resolve(geolocationOutput);
      });

      db.close();
    });
  }
}
