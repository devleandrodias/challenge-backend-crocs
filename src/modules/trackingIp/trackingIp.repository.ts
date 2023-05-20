import { EventInput } from "../../models/EventInput";
import { redisClient } from "../../configs/redis.config";
import { geolocationApi } from "../../apis/geolocation.api";
import { LocationOutput } from "../../models/LocationOutput";
import { parseObjToString, parseStringToObj } from "../../utils/parser";
import { LocationOutputProducer } from "../../shared/infra/kafka/producers/location-output.producer";
import { GeolocationResponse } from "../../types/GeolocationResponse";

export class TrackingIpRepository {
  async getLocationByCache(ip: string): Promise<LocationOutput | null> {
    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    await redisClient.connect();

    const location = await redisClient.get(ip);

    await redisClient.disconnect();

    if (location === null) {
      return null;
    }

    return parseStringToObj<LocationOutput>(location);
  }

  async getLocationByApi(eventInput: EventInput): Promise<LocationOutput> {
    const { data } = await geolocationApi.get<GeolocationResponse>(
      `${eventInput.ip}`
    );

    return {
      ip: eventInput.ip,
      clientId: eventInput.clientId,
      timestamp: eventInput.timestamp,
      city: data.city,
      country: data.country,
      region: data.regionName,
      latitude: data.lat,
      longitude: data.lon,
    };
  }

  async saveLocationOutputOnCache(ip: string, output: LocationOutput) {
    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    await redisClient.connect();

    await redisClient.set(ip, parseObjToString(output), {
      EX: 30,
      NX: true,
    });

    await redisClient.disconnect();
  }

  async producerLocationOutput(
    clientId: string,
    output: LocationOutput
  ): Promise<void> {
    await new LocationOutputProducer().produce({
      key: clientId,
      value: parseObjToString(output),
    });
  }
}
