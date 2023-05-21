import { injectable } from "tsyringe";
import { Transform, Writable, Readable } from "node:stream";

import { loggerInfo } from "../utils/logger";
import { DataSourceInput } from "../app/readers/types/DataSourceInput";
import { GeolocationOutput } from "../app/writers/types/GeolocationOutput";

@injectable()
export class TestReadable extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read(): void {
    loggerInfo({ type: "info", log: "[READER: Test]: Reading data" });

    const data1: DataSourceInput = {
      ip: "59.90.255.63",
      timestamp: 1684196387094,
      clientId: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
    };

    const data2: DataSourceInput = {
      ip: "192.98.251.204",
      timestamp: 1684196387094,
      clientId: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
    };

    const data3: DataSourceInput = {
      ip: "149.107.176.192",
      timestamp: 1684196387094,
      clientId: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
    };

    this.push(data1);
    this.push(data2);
    this.push(data3);
    this.push(null);
  }
}

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
