import "reflect-metadata";

import { RedisService } from "../../src/services/RedisService";
import { SqliteTransform } from "../../src/app/transforms/SqliteTranslator";

describe("[SqliteTransform]", () => {
  let sqliteTransform: SqliteTransform;

  beforeAll(() => {
    sqliteTransform = new SqliteTransform(new RedisService());
  });

  it("should be defined", () => {
    expect(sqliteTransform).toBeDefined();
  });
});
