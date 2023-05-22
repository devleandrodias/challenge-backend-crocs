import "reflect-metadata";

import { IRedisService } from "../../src/services/RedisService";
import { DataSourceInput } from "../../src/types/DataSourceInput";
import { GeolocationOutput } from "../../src/types/GeolocationOutput";

import { getFilePath } from "../../src/utils/getFilePath";
import { constants } from "../../src/app/constants/constants";
import { RedisInMemoryService } from "../services/RedisInMemoryService";
import { SqliteTransform } from "../../src/app/transforms/SqliteTranslator";

import {
  ISqliteService,
  SqliteService,
} from "../../src/shared/infra/SqliteService";
import { SqliteInMemoryService } from "../services/SqliteInMemoryService";
import { GeolocationResponseSqlite } from "../../src/types/GeolocationSqliteResponse";

describe("[SqliteTransform]", () => {
  let redisService: IRedisService;
  let sqliteService: ISqliteService;

  let sqliteTransform: SqliteTransform;

  let getLocationFromRedisSpy: jest.SpyInstance;
  let setLocationFromRedisSpy: jest.SpyInstance;

  let getLocationFromSqliteSpy: jest.SpyInstance;

  beforeAll(() => {
    redisService = new RedisInMemoryService();

    sqliteService = new SqliteService(
      getFilePath(constants.TRANSLATOR_PATH, "IPs.sqlite")
    );

    sqliteTransform = new SqliteTransform(redisService, sqliteService);

    getLocationFromSqliteSpy = jest.spyOn(
      SqliteInMemoryService.prototype,
      "getLocation"
    );

    getLocationFromRedisSpy = jest.spyOn(
      RedisInMemoryService.prototype,
      "getLocation"
    );

    setLocationFromRedisSpy = jest.spyOn(
      RedisInMemoryService.prototype,
      "setLocation"
    );
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
      await sqliteTransform._transform(chunk, "utf-8", (error) => {
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

    const geolocationResponseSqlite: GeolocationResponseSqlite = {
      ip: "30.46.245.122",
      city: "Columbus",
      state: "Ohio",
      longitude: -82.89573,
      latitude: 39.97883,
      country: "United States",
    };

    const geolotionOutput: GeolocationOutput = {
      ip,
      clientId,
      timestamp,
      city: geolocationResponseSqlite.city,
      region: geolocationResponseSqlite.state,
      country: geolocationResponseSqlite.country,
      latitude: geolocationResponseSqlite.latitude,
      longitude: geolocationResponseSqlite.longitude,
    };

    it("should parse data source data to geolocation output", async () => {
      setLocationFromRedisSpy.mockResolvedValueOnce(undefined);
      getLocationFromSqliteSpy.mockResolvedValueOnce(geolocationResponseSqlite);

      await sqliteTransform._transform(chunk, "utf-8", (error) => {
        if (error) {
          console.error(error);
        }
      });

      expect(getLocationFromRedisSpy).toHaveBeenCalledWith(chunk.ip);
      expect(setLocationFromRedisSpy).toHaveBeenCalledWith(geolotionOutput);
    });

    it("should stop transform stream if sqlite return an error", async () => {
      getLocationFromSqliteSpy.mockRejectedValueOnce(null);

      await sqliteTransform._transform(chunk, "utf-8", (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toEqual(
          new Error("An error occurred while reading the data from sqlite")
        );
      });
    });
  });
});
