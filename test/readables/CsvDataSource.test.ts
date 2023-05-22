import "reflect-metadata";

import { CsvDataSource } from "../../src/app/readers/CsvDatasource";

describe("[CsvDataSource]", () => {
  let csvDataSource: CsvDataSource;

  beforeAll(() => {
    csvDataSource = new CsvDataSource();
  });

  it("should be defined", () => {
    expect(csvDataSource).toBeDefined();
  });
});
