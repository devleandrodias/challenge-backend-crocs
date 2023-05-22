import { Writable } from "node:stream";
import { createWriteStream } from "node:fs";

import { injectable } from "tsyringe";

import { loggerInfo } from "../../../utils/logger";
import { constants } from "../../constants/constants";
import { getFilePath } from "../../../utils/getFilePath";
import { GeolocationOutput } from "../types/GeolocationOutput";

@injectable()
export class JsonlWriter extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(
    chunk: GeolocationOutput,
    _: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    loggerInfo({
      type: "info",
      log: `[WRITER: Jsonl]: Writing data - IP [${chunk.ip}]`,
    });

    const fileOutputPath = getFilePath(
      constants.OUTPUT_PATH_TESTS,
      "output.jsonl"
    );

    const writeStream = createWriteStream(fileOutputPath, { flags: "a" });

    writeStream.write(JSON.stringify(chunk) + "\n");
    writeStream.end();

    callback(null);
  }
}
