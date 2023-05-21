import sqlite3 from "sqlite3";
import { injectable } from "tsyringe";
import { Transform, TransformCallback } from "node:stream";

import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { DataSourceInput } from "../../readers/types/DataSourceInput";
import { GeolocationOutput } from "../../writers/types/GeolocationOutput";
import { GeolocationResponseSqlite } from "../types/GeolocationSqliteResponse";

@injectable()
export class SqliteTranslator extends Transform {
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
      log: "[TRANSLATOR: Sqlite]: Translating data",
    });

    const databasePath = getFilePath(constants.TRANSLATOR_PATH, "IPs.sqlite");
    const db = new sqlite3.Database(databasePath);
    const query = `SELECT * FROM Ips WHERE ip = ?`;

    db.get<GeolocationResponseSqlite>(query, [chunk.ip], (err, row) => {
      if (err) {
        loggerInfo({
          type: "error",
          log: `An error occurred while reading the data from sqlite`,
        });
        return;
      }

      const geolocationOutput: GeolocationOutput = {
        ip: chunk.ip,
        clientId: chunk.clientId,
        timestamp: chunk.timestamp,
        city: row.city,
        region: row.state,
        country: row.country,
        latitude: row.latitude,
        longitude: row.longitude,
      };

      callback(null, geolocationOutput);
    });

    db.close();
  }
}
