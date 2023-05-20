import { DataSourceInput } from "../readers/types/DataSourceInput";
import { GeolocationOutput } from "../writers/types/GeolocationOutput";

export interface ITranslator {
  translate(input: DataSourceInput): Promise<GeolocationOutput>;
}
