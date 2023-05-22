import "reflect-metadata";

import { getFilePath } from "../../src/utils/getFilePath";
import { constants } from "../../src/app/constants/constants";

import { IRedisService } from "../../src/services/RedisService";
import { DataSourceInput } from "../../src/types/DataSourceInput";
import { SqliteTransform } from "../../src/app/transforms/SqliteTranslator";
import { GeolocationOutput } from "../../src/types/GeolocationOutput";
import { RedisInMemoryService } from "../services/RedisInMemoryService";

import {
  ISqliteService,
  SqliteService,
} from "../../src/shared/infra/SqliteService";

import { GeolocationResponseSqlite } from "../../src/types/GeolocationSqliteResponse";

describe("[SqliteTransform]", () => {
  let redisService: IRedisService;
  let sqliteService: ISqliteService;

  let sqliteTransform: SqliteTransform;

  let getLocationFromSqliteSpy: jest.SpyInstance;
  let getLocationFromRedisSpy: jest.SpyInstance;
  let setLocationFromRedisSpy: jest.SpyInstance;

  beforeAll(() => {
    sqliteService = new SqliteService(
      getFilePath(constants.TRANSLATOR_PATH, "IPs.sqlite")
    );

    redisService = new RedisInMemoryService();

    sqliteTransform = new SqliteTransform(redisService, sqliteService);

    getLocationFromSqliteSpy = jest.spyOn(
      SqliteService.prototype,
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

  const ip = "30.46.245.122";
  const clientId = "95cdb0f2-9487-5bfd-aeda-bac27dd406fa";
  const timestamp = new Date().getTime();

  const chunk: DataSourceInput = { ip, clientId, timestamp };

  const geolocationInCache: GeolocationOutput = {
    ip,
    clientId,
    timestamp,
    city: "Columbus",
    region: "Ohio",
    country: "United States",
    latitude: 39.97883,
    longitude: -82.89573,
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

  it("should return empty callback if geolocation already exists in cache", async () => {
    getLocationFromRedisSpy.mockResolvedValueOnce(geolocationInCache);

    await sqliteTransform._transform(chunk, "utf-8", (error) => {
      if (error) {
        console.error(error);
      }
    });

    expect(getLocationFromRedisSpy).toHaveBeenCalledWith(chunk.ip);
    expect(setLocationFromRedisSpy).not.toHaveBeenCalled();
  });

  it("should return empty callback if geolocation not found in sqlite", async () => {
    getLocationFromRedisSpy.mockResolvedValueOnce(undefined);
    getLocationFromSqliteSpy.mockResolvedValueOnce(null);

    await sqliteTransform._transform(chunk, "utf-8", (error) => {
      if (error) {
        console.error(error);
      }
    });

    expect(setLocationFromRedisSpy).not.toHaveBeenCalled();
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
});
