import "reflect-metadata";

import { getFilePath } from "../../src/utils/getFilePath";
import { constants } from "../../src/app/constants/constants";
import { IRedisService } from "../../src/services/RedisService";
import { DataSourceInput } from "../../src/types/DataSourceInput";
import { CsvTransform } from "../../src/app/transforms/CsvTransform";
import { GeolocationOutput } from "../../src/types/GeolocationOutput";
import { RedisInMemoryService } from "../services/RedisInMemoryService";
import { CsvService, ICsvService } from "../../src/services/CsvService";

describe("[CsvTransform]", () => {
  let csvService: ICsvService;
  let redisService: IRedisService;

  let csvTransform: CsvTransform;

  let getLocationSpy: jest.SpyInstance;
  let setLocationSpy: jest.SpyInstance;

  beforeAll(() => {
    csvService = new CsvService(
      getFilePath(constants.TRANSLATOR_PATH, "IPs.csv")
    );

    redisService = new RedisInMemoryService();

    csvTransform = new CsvTransform(redisService, csvService);

    getLocationSpy = jest.spyOn(RedisInMemoryService.prototype, "getLocation");
    setLocationSpy = jest.spyOn(RedisInMemoryService.prototype, "setLocation");
  });

  it("should be defined", () => {
    expect(csvTransform).toBeDefined();
  });

  describe("scenarios with geolocation already exists in cache", () => {
    const ip = "30.46.245.122";
    const clientId = "95cdb0f2-9487-5bfd-aeda-bac27dd406fa";
    const timestamp = new Date().getTime();

    const chunk: DataSourceInput = {
      ip,
      clientId,
      timestamp,
    };

    const geolotionAlreadyInCache: GeolocationOutput = {
      ip,
      clientId,
      timestamp,
      city: "Columbus",
      region: "Ohio",
      country: "United States",
      latitude: 39.97883,
      longitude: -82.89573,
    };

    beforeAll(async () => {
      await redisService.setLocation(geolotionAlreadyInCache);
    });

    afterAll(async () => {
      await redisService.delLocation(ip);
    });

    it("should return null if geolocation already exists in cache", async () => {
      await csvTransform._transform(chunk, "utf-8", (error) => {
        if (error) {
          console.error(error);
        }
      });

      expect(getLocationSpy).toHaveBeenCalledWith(chunk.ip);
      expect(setLocationSpy).not.toHaveBeenCalled();
    });
  });
});
