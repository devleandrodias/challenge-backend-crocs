import { IWriter } from "../../interfaces/IWriter";

export class CsvWriter implements IWriter {
  write(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
