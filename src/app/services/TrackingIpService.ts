import { injectable, inject } from "tsyringe";
import { Readable, Writable, Transform } from "node:stream";

import { loggerInfo } from "../../utils/logger";

export interface ITrackingIpService {
  run(): Promise<void>;
}

@injectable()
export class TrackingIpService {
  private readonly _writer: Writable;
  private readonly _reader: Readable;
  private readonly _translator: Transform;

  constructor(
    // @ts-ignore
    @inject("WriterOutput") writer: Writable,
    // @ts-ignore
    @inject("DataSource") reader: Readable,
    // @ts-ignore
    @inject("Translator") translator: Transform
  ) {
    this._writer = writer;
    this._reader = reader;
    this._translator = translator;
  }

  async run(): Promise<void> {
    this._reader.pipe(this._translator).pipe(this._writer);

    this._reader.on("end", () => {
      loggerInfo({
        type: "success",
        log: "[READER] - Data source successfully read!",
      });
    });

    this._reader.on("error", () => {
      loggerInfo({
        type: "error",
        log: "[READER] - An error occurred while trying to read from the database!",
      });
    });

    this._translator.on("finish", () => {
      loggerInfo({
        type: "success",
        log: "[TRANSLATOR] - Successfully transformed!",
      });
    });

    this._translator.on("error", (_) => {
      loggerInfo({
        type: "error",
        log: "[TRANSLATOR] - Error when trying to transform",
      });
    });

    this._writer.on("finish", () => {
      loggerInfo({
        type: "success",
        log: "[WRITER] - Successfully written!",
      });
    });

    this._writer.on("error", (_) => {
      loggerInfo({
        type: "error",
        log: "[WRITER] - Error when trying to write",
      });
    });
  }
}
