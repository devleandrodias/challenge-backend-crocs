import "reflect-metadata";

import { RedisService } from "../../src/app/services/RedisService";
import { SqliteTransform } from "../../src/app/transforms/implementations/SqliteTranslator";

describe("[SqliteTransform]", () => {
  let sqliteTransform: SqliteTransform;

  beforeAll(() => {
    sqliteTransform = new SqliteTransform(new RedisService());
  });

  it("should be defined", () => {
    expect(sqliteTransform).toBeDefined();
  });
});
