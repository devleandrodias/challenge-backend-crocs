import { inject, injectable } from "tsyringe";
import { Transform, TransformCallback } from "node:stream";

import { loggerInfo } from "../../utils/logger";
import { constants } from "../constants/constants";
import { getFilePath } from "../../utils/getFilePath";
import { IRedisService } from "../../services/RedisService";
import { DataSourceInput } from "../../types/DataSourceInput";
import { GeolocationOutput } from "../../types/GeolocationOutput";
import { CsvService, ICsvService } from "../../services/CsvService";

@injectable()
export class CsvTransform extends Transform {
  constructor(
    // @ts-ignore
    @inject("RedisService") private redisService: IRedisService,
    private csvService: ICsvService
  ) {
    super({ objectMode: true });
    this.csvService = new CsvService(
      getFilePath(constants.TRANSLATOR_PATH, "IPs.csv")
    );
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

    const response = await this.csvService.getLocationByIp(chunk.ip);

    if (!response) {
      callback();
      return;
    }

    const geolocation: GeolocationOutput = {
      ip: chunk.ip,
      clientId: chunk.clientId,
      timestamp: chunk.timestamp,
      city: response.city,
      country: response.country,
      region: response.state,
      latitude: response.latitude,
      longitude: response.longitude,
    };

    await this.redisService.setLocation(geolocation);

    callback(null, geolocation);
  }
}
