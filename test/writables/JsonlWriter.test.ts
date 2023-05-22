import "reflect-metadata";

import { readFile, unlink } from "fs/promises";

import { getFilePath } from "../../src/utils/getFilePath";
import { constants } from "../../src/app/constants/constants";
import { JsonlWriter } from "../../src/app/writers/implementations/JsonlWriter";
import { GeolocationOutput } from "../../src/app/writers/types/GeolocationOutput";

describe("[JsonlWriter]", () => {
  let jsonlWriter: JsonlWriter;

  const fileOutputPath = getFilePath(
    constants.OUTPUT_PATH_TESTS,
    "output.jsonl"
  );

  beforeAll(() => {
    jsonlWriter = new JsonlWriter();
  });

  afterAll(async () => {
    await unlink(fileOutputPath);
  });

  it("should be defined", () => {
    expect(jsonlWriter).toBeDefined();
  });

  it("should write data to the JSONL file", async () => {
    const geolotionOutput: GeolocationOutput = {
      ip: "30.46.245.122",
      clientId: "95cdb0f2-9487-5bfd-aeda-bac27dd406fa",
      city: "Columbus",
      region: "Ohio",
      country: "United States",
      latitude: 39.97883,
      longitude: -82.89573,
      timestamp: new Date().getTime(),
    };

    const writer = new JsonlWriter();

    await new Promise<void>((resolve, reject) => {
      writer._write(geolotionOutput, "utf8", (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    writer.on("finish", async () => {
      const fileContent = await readFile(fileOutputPath, "utf-8");
      const expectedLine = JSON.stringify(geolotionOutput) + "\n";
      expect(fileContent).toContain(expectedLine);
    });
  });
});
