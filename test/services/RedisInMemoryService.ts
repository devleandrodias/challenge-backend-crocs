import { IRedisService } from "../../src/app/services/RedisService";
import { GeolocationOutput } from "../../src/app/writers/types/GeolocationOutput";

export class RedisInMemoryService implements IRedisService {
  private geolocationOutputCache: GeolocationOutput[] = [];

  async setLocation(location: GeolocationOutput): Promise<void> {
    this.geolocationOutputCache.push(location);
  }

  async getLocation(ip: string): Promise<GeolocationOutput | null> {
    const geolocation = this.geolocationOutputCache.find(
      (location) => location.ip === ip
    );

    if (!geolocation) {
      return null;
    }

    return geolocation;
  }

  async delLocation(ip: string): Promise<void> {
    this.geolocationOutputCache = this.geolocationOutputCache.filter(
      (location) => location.ip !== ip
    );
  }
}
