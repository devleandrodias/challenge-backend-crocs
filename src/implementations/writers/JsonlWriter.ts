import { injectable } from "tsyringe";

import { IWriter } from "../interfaces/IWriter";

@injectable()
export class JsonlWriter implements IWriter {
  async write(): Promise<void> {
    console.log("Writting response in Json file...");
  }
}
