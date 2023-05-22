import { injectable } from "tsyringe";
import { RedisClientType, createClient } from "redis";

import { envs } from "../../configs/env.config";
import { parseStringToObj } from "../../utils/parser";
import { GeolocationOutput } from "../writers/types/GeolocationOutput";

export interface IRedisService {
  setLocation(location: GeolocationOutput): Promise<void>;
  getLocation(ip: string): Promise<GeolocationOutput | null>;
  delLocation(ip: string): Promise<void>;
}

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
    await this.client.set(location.ip, JSON.stringify(location), {
      EX: 60,
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
