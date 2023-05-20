import sqlite3 from "sqlite3";
import { injectable } from "tsyringe";

import { ITranslator } from "../ITranslator";
import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { DataSourceInput } from "../../readers/types/DataSourceInput";
import { GeolocationOutput } from "../../writers/types/GeolocationOutput";
import { GeolocationResponseSqlite } from "../types/GeolocationSqliteResponse";

@injectable()
export class SqliteTranslator implements ITranslator {
  async translate(input: DataSourceInput): Promise<GeolocationOutput> {
    loggerInfo({
      type: "info",
      log: "[TRANSLATOR: Sqlite]: Translating data",
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
