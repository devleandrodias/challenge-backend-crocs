import { Transform } from "node:stream";
import { createWriteStream } from "node:fs";

import { injectable } from "tsyringe";

import { loggerInfo } from "../../utils/logger";
import { IWriter } from "../../interfaces/IWriter";
import { constants } from "../constants/constants";
import { getFilePath } from "../../utils/getFilePath";
import { GeolocationOutput } from "../../types/GeolocationOutput";

@injectable()
export class JsonlWriter implements IWriter {
  async write(localtion: GeolocationOutput): Promise<void> {
    loggerInfo({
      type: "info",
      log: "[WRITER: Jsonl]: Translating data",
    });

    const fileOutputPath = getFilePath(constants.OUTPUT_PATH, "output.jsonl");

    const writeStream = createWriteStream(fileOutputPath);

    const jsonlTransform = new Transform({
      objectMode: true,
      transform(chunk, _, callback) {
        callback(null, chunk + "\n");
      },
    });

    jsonlTransform.pipe(writeStream);
    jsonlTransform.write(JSON.stringify(localtion));
    jsonlTransform.end();

    writeStream.on("error", (_) => {
      loggerInfo({
        type: "error",
        log: "Error creating JSONL file:",
      });
    });

    writeStream.on("finish", () => {
      loggerInfo({
        type: "success",
        log: "JSONL file successfully saved!",
      });
    });
  }
}
