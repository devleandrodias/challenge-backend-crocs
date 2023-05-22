import "reflect-metadata";

import { geolocationApi } from "../../src/apis/geolocation.api";
import { IRedisService } from "../../src/services/RedisService";
import { DataSourceInput } from "../../src/types/DataSourceInput";
import { GeolocationOutput } from "../../src/types/GeolocationOutput";
import { RedisInMemoryService } from "../services/RedisInMemoryService";
import { GeolocationResponseApi } from "../../src/types/GeolocationResponseApi";
import { ExternalApiTransform } from "../../src/app/transforms/ExternalApiTransform";

describe("[ExternalApiTransform]", () => {
  let redisService: IRedisService;
  let externalApiTransform: ExternalApiTransform;

  let getLocationSpy: jest.SpyInstance;
  let setLocationSpy: jest.SpyInstance;
  let getGeolocationApiSpy: jest.SpyInstance;

  beforeAll(() => {
    redisService = new RedisInMemoryService();
    externalApiTransform = new ExternalApiTransform(redisService);

    getGeolocationApiSpy = jest.spyOn(geolocationApi, "get");

    getLocationSpy = jest.spyOn(RedisInMemoryService.prototype, "getLocation");
    setLocationSpy = jest.spyOn(RedisInMemoryService.prototype, "setLocation");
  });

  it("should be defined", () => {
    expect(externalApiTransform).toBeDefined();
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
      await externalApiTransform._transform(chunk, "utf-8", (error) => {
        if (error) {
          console.error(error);
        }
      });

      expect(getLocationSpy).toHaveBeenCalledWith(chunk.ip);
      expect(setLocationSpy).not.toHaveBeenCalled();
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

    const geolocationResponseApi: GeolocationResponseApi = {
      status: "success",
      country: "United States",
      countryCode: "US",
      region: "OH",
      regionName: "Ohio",
      city: "Whitehall",
      zip: "43218",
      lat: 39.9747,
      lon: -82.8947,
      timezone: "America/New_York",
      isp: "DoD Network Information Center",
      org: "DoD Network Information Center",
      as: "AS749 DoD Network Information Center",
      query: "30.46.245.122",
    };

    const geolotionNotInCache: GeolocationOutput = {
      ip,
      clientId,
      timestamp,
      city: geolocationResponseApi.city,
      region: geolocationResponseApi.regionName,
      country: geolocationResponseApi.country,
      latitude: geolocationResponseApi.lat,
      longitude: geolocationResponseApi.lon,
    };

    it("should parse data source data to geolotion output", async () => {
      getGeolocationApiSpy.mockResolvedValueOnce({
        data: geolocationResponseApi,
      });

      await externalApiTransform._transform(chunk, "utf-8", (error) => {
        if (error) {
          console.error(error);
        }
      });

      expect(getLocationSpy).toHaveBeenCalledWith(chunk.ip);
      expect(setLocationSpy).toHaveBeenCalledWith(geolotionNotInCache);

      await redisService.delLocation(chunk.ip);
    });

    it("should stop transform stream if api return an error", async () => {
      getGeolocationApiSpy.mockRejectedValueOnce(undefined);

      await externalApiTransform._transform(chunk, "utf-8", (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toEqual(
          new Error("Error on get data from external api..")
        );
      });
    });
  });
});
