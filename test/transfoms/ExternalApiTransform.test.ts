import "reflect-metadata";

import { RedisService } from "../../src/app/services/RedisService";
import { ExternalApiTransform } from "../../src/app/transforms/implementations/ExternalApiTransform";

describe("[ExternalApiTransform]", () => {
  let externalApiTransform: ExternalApiTransform;

  beforeAll(() => {
    externalApiTransform = new ExternalApiTransform(new RedisService());
  });

  it("should be defined", () => {
    expect(externalApiTransform).toBeDefined();
  });
});
