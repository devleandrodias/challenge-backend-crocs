import { EventInput } from "../../models/EventInput";
import { redisClient } from "../../configs/redis.config";
import { LocationOutput } from "../../models/LocationOutput";
import { parseObjToString, parseStringToObj } from "../../utils/parser";

import { LocationOutputProducer } from "../../shared/infra/kafka/producers/location-output.producer";

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
    return {
      ip: eventInput.ip,
      clientId: eventInput.clientId,
      timestamp: eventInput.timestamp,
      city: "San Francisco",
      country: "United States",
      region: "California",
      latitude: 37.7749,
      longitude: -122.4194,
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

// REDIS -> Cache

// API -> Integracao

// KAFKA -> Fila
