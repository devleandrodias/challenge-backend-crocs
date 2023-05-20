import { injectable } from "tsyringe";

import { loggerInfo } from "../../utils/logger";
import { ITranslator } from "../../interfaces/ITranslator";
import { geolocationApi } from "../../apis/geolocation.api";
import { DataSourceInput } from "../../types/DataSourceInput";
import { GeolocationOutput } from "../../types/GeolocationOutput";
import { GeolocationResponseApi } from "../../types/GeolocationResponseApi";

@injectable()
export class ExternalApiTranslator implements ITranslator {
  async translate(input: DataSourceInput): Promise<GeolocationOutput> {
    loggerInfo({
      type: "info",
      log: "[TRANSLATOR: External API]: Translating data",
    });

    try {
      const { data } = await geolocationApi.get<GeolocationResponseApi>(
        `${input.ip}`
      );

      const geolocation: GeolocationOutput = {
        ip: input.ip,
        clientId: input.clientId,
        timestamp: input.timestamp,
        city: data.city,
        country: data.country,
        region: data.regionName,
        latitude: data.lat,
        longitude: data.lon,
      };

      return geolocation;
    } catch (error) {
      throw new Error("An error occurred while calling external api...");
    }
  }
}
