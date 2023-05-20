import { GeolocationOutput } from "../../types/GeolocationOutput";

export interface IWriter {
  write(localtion: GeolocationOutput): Promise<void>;
}
