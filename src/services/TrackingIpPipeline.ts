import { injectable, inject } from "tsyringe";
import { Readable, Writable, Transform } from "node:stream";

import { loggerInfo } from "../utils/logger";

@injectable()
export class TrackingIpPipeline {
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

    this._writer.on("finish", () => {
      loggerInfo({
        type: "success",
        log: "Successfully written!",
      });
    });

    this._writer.on("error", (_) => {
      loggerInfo({
        type: "error",
        log: "Error when trying to write",
      });
    });
  }
}
