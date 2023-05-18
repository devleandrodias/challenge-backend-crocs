import { createClient } from "redis";

import { envs } from "./env.config";

export const redisClient = createClient({ url: envs.redisServerUrl });
