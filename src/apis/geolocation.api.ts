import axios from "axios";

import { envs } from "../configs/env.config";

export const geolocationApi = axios.create({
  baseURL: envs.geolocationApi,
});
