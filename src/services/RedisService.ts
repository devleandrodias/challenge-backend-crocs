import { injectable } from "tsyringe";
import { RedisClientType, createClient } from "redis";

import { envs } from "../configs/env.config";
import { loggerInfo } from "../utils/logger";
import { parseStringToObj } from "../utils/parser";
import { GeolocationOutput } from "../types/GeolocationOutput";

export interface IRedisService {
  setLocation(location: GeolocationOutput): Promise<void>;
  getLocation(ip: string): Promise<GeolocationOutput | null>;
  delLocation(ip: string): Promise<void>;
}

const MAX_TIME_IN_CACHE_SECONDS: number = 60 * 30;

@injectable()
export class RedisService implements IRedisService {
  public client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: envs.redisServerUrl,
    });

    this.client.connect();
  }

  async setLocation(location: GeolocationOutput): Promise<void> {
    const diff = new Date().getTimezoneOffset();

    const currentTime = new Date().getTime() - diff;

    if (location.timestamp <= currentTime) {
      loggerInfo({
        type: "warning",
        log: "The provided timestamp has already passed. The record will not be saved to Redis.",
      });
      return;
    }

    const expirationTimestamp = location.timestamp + MAX_TIME_IN_CACHE_SECONDS;

    await this.client.set(location.ip, JSON.stringify(location), {
      EX: expirationTimestamp,
      NX: true,
    });
  }

  async getLocation(ip: string): Promise<GeolocationOutput | null> {
    const location = await this.client.get(ip);

    if (location) {
      return parseStringToObj<GeolocationOutput>(location);
    }

    return null;
  }

  async delLocation(ip: string): Promise<void> {
    await this.client.del(ip);
  }
}
