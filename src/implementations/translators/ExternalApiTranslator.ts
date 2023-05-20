import { ITranslator } from "../interfaces/ITranslator";

export class ExternalApiTranslator implements ITranslator {
  translate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
