import "reflect-metadata";

import { RedisService } from "../../src/app/services/RedisService";
import { CsvTransform } from "../../src/app/transforms/CsvTransform";

describe("[CsvTransform]", () => {
  let csvTransform: CsvTransform;

  beforeAll(() => {
    csvTransform = new CsvTransform(new RedisService());
  });

  it("should be defined", () => {
    expect(csvTransform).toBeDefined();
  });
});
