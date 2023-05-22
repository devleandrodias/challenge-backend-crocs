import "reflect-metadata";

import { JsonlDataSource } from "../../src/app/readers/JsonlDatasource";
import { JsonlDataSourceInput } from "../../src/types/JsonlDatasourceInput";
import { DataSourceInput } from "../../src/types/DataSourceInput";

describe("[JsonlDataSource]", () => {
  let jsonlDataSource: JsonlDataSource;

  let dataChunks: DataSourceInput[];
  let expectedData: DataSourceInput[];

  beforeAll(() => {
    jsonlDataSource = new JsonlDataSource();

    expectedData = [
      {
        ip: "59.90.255.63",
        timestamp: 1684196387094,
        clientId: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
      },
    ];

    dataChunks = [];
  });

  it.skip("should read data from jsonl file", () => {
    jsonlDataSource.on("data", (row: JsonlDataSourceInput) => {
      dataChunks.push({
        ip: row.ip,
        clientId: row.id,
        timestamp: row.timestamp,
      });
    });

    jsonlDataSource.on("end", () => {
      expect(dataChunks).toEqual(expectedData);
    });

    jsonlDataSource._read();
  });
});
