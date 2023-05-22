import "reflect-metadata";

import { KafkaTopicWriter } from "../../src/app/writers/KafkaTopicWriter";
import { GeolocationOutput } from "../../src/types/GeolocationOutput";
import { KafkaService } from "../../src/shared/infra/KafkaService";

describe("[KafkaTopicWriter]", () => {
  let kafkaTopicWriter: KafkaTopicWriter;
  let producerLocationSpy: jest.SpyInstance;

  beforeAll(() => {
    kafkaTopicWriter = new KafkaTopicWriter();
    producerLocationSpy = jest.spyOn(
      KafkaService.prototype,
      "produceLocationOutputMessage"
    );
  });

  it("should be defined", () => {
    expect(kafkaTopicWriter).toBeDefined();
  });

  it("should send data to a kafka topic", async () => {
    producerLocationSpy.mockResolvedValueOnce(undefined);

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

    kafkaTopicWriter._write(geolotionOutput, "utf8", (err) => {
      if (err) {
        console.error(err);
      }

      expect(producerLocationSpy).toHaveBeenCalledWith(geolotionOutput);
    });
  });
});
