import { inject, injectable } from "tsyringe";
import { Transform, TransformCallback } from "node:stream";

import { loggerInfo } from "../../utils/logger";
import { geolocationApi } from "../../apis/geolocation.api";
import { DataSourceInput } from "../../types/DataSourceInput";
import { GeolocationOutput } from "../../types/GeolocationOutput";
import { GeolocationResponseApi } from "../../types/GeolocationResponseApi";

@injectable()
export class ExternalApiTransform extends Transform {
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
      log: `[TRANSLATOR: External API]: Translating data - IP [${chunk.ip}]`,
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
      const { data } = await geolocationApi.get<GeolocationResponseApi>(
        `${chunk.ip}`
      );

      const geolocation: GeolocationOutput = {
        ip: chunk.ip,
        clientId: chunk.clientId,
        timestamp: chunk.timestamp,
        city: data.city,
        country: data.country,
        region: data.regionName,
        latitude: data.lat,
        longitude: data.lon,
      };

      await this.redisService.setLocation(geolocation);

      callback(null, geolocation);
    } catch (error) {
      callback(new Error("Error on get data from external api.."));
    }
  }
}
