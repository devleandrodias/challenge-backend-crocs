import { loggerInfo } from "../../utils/logger";
import { EventInput } from "../../models/EventInput";
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

      await this.trackingIpRepository.producerLocationOutput(
        clientId,
        location
      );
    }

    if (!location) {
      loggerInfo({
        log: `[IP: ${ip}] - NOT found in cache, getting location informations from API`,
      });

      const output = await this.trackingIpRepository.getLocationByApi(
        eventInput
      );

      await this.trackingIpRepository.saveLocationOutputOnCache(
        clientId,
        output
      );

      await this.trackingIpRepository.producerLocationOutput(clientId, output);
    }
  }
}
