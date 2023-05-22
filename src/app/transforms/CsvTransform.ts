import { createReadStream } from "node:fs";
import { Transform, TransformCallback } from "node:stream";

import { parse } from "csv-parse";
import { inject, injectable } from "tsyringe";

import { loggerInfo } from "../../utils/logger";
import { constants } from "../constants/constants";
import { getFilePath } from "../../utils/getFilePath";
import { IRedisService } from "../../services/RedisService";
import { DataSourceInput } from "../../types/DataSourceInput";
import { GeolocationOutput } from "../../types/GeolocationOutput";

@injectable()
export class CsvTransform extends Transform {
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
      log: `[TRANSLATOR: Csv]: Translating data - IP [${chunk.ip}]`,
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

    const fileInputPath = getFilePath(constants.TRANSLATOR_PATH, "IPs.csv");
    const readStream = createReadStream(fileInputPath);

    readStream.pipe(parse()).on("data", async (row) => {
      const [ip, latitude, longitude, country, state, city] = row;

      if (ip === chunk.ip) {
        const geolocation: GeolocationOutput = {
          ip: chunk.ip,
          clientId: chunk.clientId,
          timestamp: chunk.timestamp,
          city,
          country,
          region: state,
          latitude: Number(latitude),
          longitude: Number(longitude),
        };

        await this.redisService.setLocation(geolocation);

        callback(null, geolocation);
      }
    });
  }
}
