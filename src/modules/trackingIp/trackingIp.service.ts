import { loggerInfo } from "../../utils/logger";
import { EventInput } from "../../models/EventInput";
import { redisClient } from "../../configs/redis.config";
import { TrackingIpRepository } from "./trackingIp.repository";

export class TrackingIpService {
  private trackingIpRepository: TrackingIpRepository;

  constructor() {
    this.trackingIpRepository = new TrackingIpRepository();
  }

  async track(eventInput: EventInput) {
    const { ip, clientId } = eventInput;

    const location = await this.trackingIpRepository.getLocationByCache(ip);

    if (location) {
      loggerInfo({ log: `[IP: ${ip}] - Found in cache` });

      await this.trackingIpRepository.saveLocation(clientId, location);
    }

    if (!location) {
      loggerInfo({
        log: `[IP: ${ip}] - NOT found in cache, getting location informations from API`,
      });

      const output = await this.trackingIpRepository.getLocationByApi(
        eventInput
      );

      await redisClient.set(ip, JSON.stringify(output), {
        EX: 30,
        NX: true,
      });

      await this.trackingIpRepository.saveLocation(clientId, output);
    }

    await redisClient.disconnect();
  }
}
