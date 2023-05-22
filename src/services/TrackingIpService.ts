import { injectable, inject } from "tsyringe";
import { Readable, Writable, Transform } from "node:stream";

import { loggerInfo } from "../utils/logger";

export interface ITrackingIpService {
  run(): Promise<void>;
}

@injectable()
export class TrackingIpService {
  constructor(
    // @ts-ignore
    @inject("WriterOutput") private writer: Writable,
    // @ts-ignore
    @inject("DataSource") private reader: Readable,
    // @ts-ignore
    @inject("Translator") private translator: Transform
  ) {}

  async run(): Promise<void> {
    this.reader.pipe(this.translator).pipe(this.writer);

    this.reader.on("end", () => {
      loggerInfo({
        type: "success",
        log: "[READER] - Data source successfully read!",
      });
    });

    this.reader.on("error", () => {
      loggerInfo({
        type: "error",
        log: "[READER] - An error occurred while trying to read from the database!",
      });
    });

    this.translator.on("finish", () => {
      loggerInfo({
        type: "success",
        log: "[TRANSLATOR] - Successfully transformed!",
      });
    });

    this.translator.on("error", () => {
      loggerInfo({
        type: "error",
        log: "[TRANSLATOR] - Error when trying to transform",
      });
    });

    this.writer.on("finish", () => {
      loggerInfo({
        type: "success",
        log: "[WRITER] - Successfully written!",
      });
    });

    this.writer.on("error", () => {
      loggerInfo({
        type: "error",
        log: "[WRITER] - Error when trying to write",
      });
    });
  }
}
