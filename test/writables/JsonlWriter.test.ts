import "reflect-metadata";

import { JsonlWriter } from "../../src/app/writers/implementations/JsonlWriter";

describe("[JsonlWriter]", () => {
  let jsonlWriter: JsonlWriter;

  beforeAll(() => {
    jsonlWriter = new JsonlWriter();
  });

  it("should be defined", () => {
    expect(jsonlWriter).toBeDefined();
  });
});
