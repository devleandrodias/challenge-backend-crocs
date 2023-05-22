import "reflect-metadata";

import { JsonlDataSource } from "../../src/app/readers/JsonlDatasource";

describe("[JsonlDataSource]", () => {
  let jsonlDataSource: JsonlDataSource;

  beforeAll(() => {
    jsonlDataSource = new JsonlDataSource();
  });

  it("should be defined", () => {
    expect(jsonlDataSource).toBeDefined();
  });
});
