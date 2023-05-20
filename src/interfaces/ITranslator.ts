import { DataSourceInput } from "../types/DataSourceInput";
import { GeolocationOutput } from "../types/GeolocationOutput";

export interface ITranslator {
  translate(input: DataSourceInput): Promise<GeolocationOutput>;
}
