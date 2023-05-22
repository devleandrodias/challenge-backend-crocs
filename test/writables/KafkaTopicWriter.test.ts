import "reflect-metadata";

import { KafkaTopicWriter } from "../../src/app/writers/implementations/KafkaTopicWriter";

describe("[KafkaTopicWriter]", () => {
  let kafkaTopicWriter: KafkaTopicWriter;

  beforeAll(() => {
    kafkaTopicWriter = new KafkaTopicWriter();
  });

  it("should be defined", () => {
    expect(kafkaTopicWriter).toBeDefined();
  });
});
