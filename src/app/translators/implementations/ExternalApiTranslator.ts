import { injectable } from "tsyringe";
import { Transform, TransformCallback } from "node:stream";

import { loggerInfo } from "../../../utils/logger";
import { geolocationApi } from "../../../apis/geolocation.api";
import { DataSourceInput } from "../../readers/types/DataSourceInput";
import { GeolocationResponseApi } from "../types/GeolocationResponseApi";
import { GeolocationOutput } from "../../writers/types/GeolocationOutput";

@injectable()
export class ExternalApiTranslator extends Transform {
  constructor() {
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

      callback(null, geolocation);
    } catch (error) {
      callback(new Error("Error on get data from external api.."));
    }
  }
}
