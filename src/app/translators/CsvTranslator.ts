import { injectable } from "tsyringe";

import { loggerInfo } from "../../utils/logger";
import { ITranslator } from "../../interfaces/ITranslator";
import { DataSourceInput } from "../../types/DataSourceInput";
import { GeolocationOutput } from "../../types/GeolocationOutput";

@injectable()
export class CsvTranslator implements ITranslator {
  async translate(input: DataSourceInput): Promise<GeolocationOutput> {
    loggerInfo({
      type: "info",
      log: "Translating data using csv translator...",
    });

    throw new Error("Method not implemented!");
  }
}
