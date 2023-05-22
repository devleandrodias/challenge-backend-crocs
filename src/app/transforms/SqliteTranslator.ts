import { inject, injectable } from "tsyringe";
import { Transform, TransformCallback } from "node:stream";

import { loggerInfo } from "../../utils/logger";
import { constants } from "../constants/constants";
import { getFilePath } from "../../utils/getFilePath";
import { IRedisService } from "../../services/RedisService";
import { DataSourceInput } from "../../types/DataSourceInput";
import { GeolocationOutput } from "../../types/GeolocationOutput";

import {
  ISqliteService,
  SqliteService,
} from "../../shared/infra/SqliteService";

@injectable()
export class SqliteTransform extends Transform {
  constructor(
    // @ts-ignore
    @inject("RedisService") private redisService: IRedisService,
    private sqliteService: ISqliteService
  ) {
    super({ objectMode: true });

    this.sqliteService = new SqliteService(
      getFilePath(constants.TRANSLATOR_PATH, "IPs.sqlite")
    );
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

      callback();
      return;
    }

    try {
      const location = await this.sqliteService.getLocation(chunk.ip);

      if (!location) {
        callback();
        return;
      }

      const geolocationOutput: GeolocationOutput = {
        ip: chunk.ip,
        clientId: chunk.clientId,
        timestamp: chunk.timestamp,
        city: location.city,
        region: location.state,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      await this.redisService.setLocation(geolocationOutput);

      callback(null, geolocationOutput);
    } catch (error) {
      callback(
        new Error("An error occurred while reading the data from sqlite")
      );
    }
  }
}
