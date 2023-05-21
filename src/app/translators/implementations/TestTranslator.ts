import { Transform, Writable } from "node:stream";
import { loggerInfo } from "../../../utils/logger";
import { DataSourceInput } from "../../readers/types/DataSourceInput";
import { injectable } from "tsyringe";
import { GeolocationOutput } from "../../writers/types/GeolocationOutput";

@injectable()
export class TestTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk: DataSourceInput, _: any, cb: any): void {
    loggerInfo({
      type: "info",
      log: "[TRANSLATOR: Test]: Translating data",
    });

    const geolocationOutput: GeolocationOutput = {
      ip: chunk.ip,
      clientId: chunk.clientId,
      timestamp: chunk.timestamp,
      city: "Daytona Beach",
      region: "Florida",
      country: "United States",
      latitude: 29.21082,
      longitude: -81.02283,
    };

    console.log("Translations...", chunk);

    cb(null, geolocationOutput);
  }
}

@injectable()
export class TestWritable extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(chunk: GeolocationOutput, encoding: any, callback: any): void {
    loggerInfo({
      type: "info",
      log: "[WRITER: Test]: Writing data",
    });

    console.log("Writting...", chunk);

    callback(null);
  }
}
