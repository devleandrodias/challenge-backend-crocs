import { ITranslator } from "../interfaces/ITranslator";

export class SqliteTranslator implements ITranslator {
  translate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
