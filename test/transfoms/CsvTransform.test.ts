import "reflect-metadata";

import { getFilePath } from "../../src/utils/getFilePath";
import { constants } from "../../src/app/constants/constants";
import { IRedisService } from "../../src/services/RedisService";
import { DataSourceInput } from "../../src/types/DataSourceInput";
import { CsvTransform } from "../../src/app/transforms/CsvTransform";
import { GeolocationOutput } from "../../src/types/GeolocationOutput";
import { RedisInMemoryService } from "../services/RedisInMemoryService";
import { CsvService, ICsvService } from "../../src/services/CsvService";
import { GeolocationResponseCsv } from "../../src/types/GeolocationResponseCsv";

describe("[CsvTransform]", () => {
  let csvService: ICsvService;
  let redisService: IRedisService;

  let csvTransform: CsvTransform;

  let getLocationFromCsvSpy: jest.SpyInstance;
  let getLocationFromRedisSpy: jest.SpyInstance;
  let setLocationFromRedisSpy: jest.SpyInstance;

  beforeAll(() => {
    csvService = new CsvService(
      getFilePath(constants.TRANSLATOR_PATH, "IPs.csv")
    );

    redisService = new RedisInMemoryService();

    csvTransform = new CsvTransform(redisService, csvService);

    getLocationFromCsvSpy = jest.spyOn(CsvService.prototype, "getLocationByIp");

    getLocationFromRedisSpy = jest.spyOn(
      RedisInMemoryService.prototype,
      "getLocation"
    );

    setLocationFromRedisSpy = jest.spyOn(
      RedisInMemoryService.prototype,
      "setLocation"
    );
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

      expect(getLocationFromRedisSpy).toHaveBeenCalledWith(chunk.ip);
      expect(setLocationFromRedisSpy).not.toHaveBeenCalled();
    });
  });

  describe("scenarios without geolocation in cache", () => {
    const ip = "30.46.245.122";
    const clientId = "95cdb0f2-9487-5bfd-aeda-bac27dd406fa";
    const timestamp = new Date().getTime();

    const chunk: DataSourceInput = {
      ip,
      clientId,
      timestamp,
    };

    const geolocationResponseCsv: GeolocationResponseCsv = {
      ip,
      state: "Ohio",
      city: "Whitehall",
      country: "United States",
      longitude: 39.9747,
      latitude: -82.8947,
    };

    const geolotionNotInCache: GeolocationOutput = {
      ip,
      clientId,
      timestamp,
      city: geolocationResponseCsv.city,
      region: geolocationResponseCsv.state,
      country: geolocationResponseCsv.country,
      latitude: geolocationResponseCsv.latitude,
      longitude: geolocationResponseCsv.longitude,
    };

    it("should parse data source data to geolotion output", async () => {
      getLocationFromCsvSpy.mockResolvedValueOnce(geolocationResponseCsv);

      await csvTransform._transform(chunk, "utf-8", (error) => {
        if (error) {
          console.error(error);
        }
      });

      expect(getLocationFromRedisSpy).toHaveBeenCalledWith(chunk.ip);
      expect(setLocationFromRedisSpy).toHaveBeenCalledWith(geolotionNotInCache);

      await redisService.delLocation(chunk.ip);
    });
  });
});
