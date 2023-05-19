import { injectable } from "tsyringe";
import { RedisClientType, createClient } from "redis";

import { envs } from "../configs/env.config";

export interface IRedisService {
  getInstance(): RedisClientType;
}

@injectable()
export class RedisService implements IRedisService {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({ url: envs.redisServerUrl });

    this.redisClient.on("error", (err) =>
      console.log("Redis Client Error", err)
    );
  }

  getInstance(): RedisClientType {
    return this.redisClient;
  }
}
