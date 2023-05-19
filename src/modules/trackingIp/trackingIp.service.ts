import { loggerInfo } from "../../utils/logger";
import { EventInput } from "../../models/EventInput";
import { redisClient } from "../../configs/redis.config";
import { LocationOutput } from "../../models/LocationOutput";
import { TrackingIpRepository } from "./trackingIp.repository";

export class TrackingIpService {
  private trackingIpRepository: TrackingIpRepository;

  constructor() {
    this.trackingIpRepository = new TrackingIpRepository();
  }

  async fakeApi(input: EventInput): Promise<LocationOutput> {
    return {
      ip: input.ip,
      clientId: input.clientId,
      timestamp: input.timestamp,
      city: "San Francisco",
      country: "United States",
      region: "California",
      latitude: 37.7749,
      longitude: -122.4194,
    };
  }

  async producerMessageIfFoundInCache(
    input: EventInput,
    output: LocationOutput
  ) {
    const { ip, clientId } = input;

    loggerInfo({ log: `[IP: ${ip}] - Found in cache` });

    await this.trackingIpRepository.saveLocation(clientId, output);
  }

  async producerMessageIfNotFoundInCache(input: EventInput) {
    const { ip, clientId } = input;
    const trackingIpRepository = new TrackingIpRepository();

    loggerInfo({
      log: `[IP: ${ip}] - NOT found in cache, getting location informations from API`,
    });

    const output = await this.fakeApi(input);

    await redisClient.set(input.ip, JSON.stringify(output), {
      EX: 30,
      NX: true,
    });

    await trackingIpRepository.saveLocation(clientId, output);
  }

  async track(eventInput: EventInput) {
    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    await redisClient.connect();

    const locationOutputCache = await redisClient.get(eventInput.ip);

    if (locationOutputCache) {
      this.producerMessageIfFoundInCache(
        eventInput,
        JSON.parse(locationOutputCache) as LocationOutput
      );
    }

    if (!locationOutputCache) {
      this.producerMessageIfNotFoundInCache(eventInput);
    }

    await redisClient.disconnect();
  }
}
