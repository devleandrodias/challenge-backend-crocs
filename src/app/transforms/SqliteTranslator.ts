import sqlite3 from "sqlite3";

import { inject, injectable } from "tsyringe";
import { Transform, TransformCallback } from "node:stream";

import { loggerInfo } from "../../utils/logger";
import { constants } from "../constants/constants";
import { getFilePath } from "../../utils/getFilePath";
import { DataSourceInput } from "../../types/DataSourceInput";
import { GeolocationOutput } from "../../types/GeolocationOutput";
import { GeolocationResponseSqlite } from "../../types/GeolocationSqliteResponse";

@injectable()
export class SqliteTransform extends Transform {
  constructor(
    // @ts-ignore
    @inject("RedisService") private redisService: IRedisService
  ) {
    super({ objectMode: true });
  }

  async _transform(
    chunk: DataSourceInput,
    _: BufferEncoding,
    callback: TransformCallback
  ): Promise<void> {
    loggerInfo({
      type: "info",
      log: `[TRANSLATOR: Sqlite]: Translating data - IP [${chunk.ip}]`,
    });

    const locationInCache = await this.redisService.getLocation(chunk.ip);

    if (locationInCache) {
      loggerInfo({
        type: "warning",
        log: `[IP: ${chunk.ip}]: Already exists in cache`,
      });

      callback(null);
    } else {
      const databasePath = getFilePath(constants.TRANSLATOR_PATH, "IPs.sqlite");
      const db = new sqlite3.Database(databasePath);
      const query = `SELECT * FROM Ips WHERE ip = ?`;

      db.get<GeolocationResponseSqlite>(query, [chunk.ip], async (err, row) => {
        if (err) {
          callback(
            new Error("An error occurred while reading the data from sqlite")
          );

          return;
        }

        const geolocation: GeolocationOutput = {
          ip: chunk.ip,
          clientId: chunk.clientId,
          timestamp: chunk.timestamp,
          city: row.city,
          region: row.state,
          country: row.country,
          latitude: row.latitude,
          longitude: row.longitude,
        };

        await this.redisService.setLocation(geolocation);

        callback(null, geolocation);
      });

      db.close();
    }
  }
}
