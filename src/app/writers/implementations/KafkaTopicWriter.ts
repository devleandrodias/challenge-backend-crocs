import { injectable } from "tsyringe";

import { IWriter } from "../IWriter";
import { loggerInfo } from "../../../utils/logger";
import { GeolocationOutput } from "../types/GeolocationOutput";

@injectable()
export class KafkaTopicWriter implements IWriter {
  async write(localtion: GeolocationOutput): Promise<void> {
    loggerInfo({
      type: "info",
      log: "[WRITER: Kafka]: Writing data",
    });
  }

  // Temporary files
  // async getLocationByCache(ip: string): Promise<GeolocationOutput | null> {
  //   redisClient.on("error", (err) => console.log("Redis Client Error", err));

  //   await redisClient.connect();

  //   const location = await redisClient.get(ip);

  //   await redisClient.disconnect();

  //   if (location === null) {
  //     return null;
  //   }

  //   return parseStringToObj<GeolocationOutput>(location);
  // }

  // async getLocationByApi(
  //   eventInput: DataSourceInput
  // ): Promise<GeolocationOutput> {
  //   const { data } = await geolocationApi.get<GeolocationResponseApi>(
  //     `${eventInput.ip}`
  //   );

  //   return {
  //     ip: eventInput.ip,
  //     clientId: eventInput.clientId,
  //     timestamp: eventInput.timestamp,
  //     city: data.city,
  //     country: data.country,
  //     region: data.regionName,
  //     latitude: data.lat,
  //     longitude: data.lon,
  //   };
  // }

  // async saveLocationOutputOnCache(ip: string, output: GeolocationOutput) {
  //   redisClient.on("error", (err) => console.log("Redis Client Error", err));

  //   await redisClient.connect();

  //   await redisClient.set(ip, parseObjToString(output), {
  //     EX: 30,
  //     NX: true,
  //   });

  //   await redisClient.disconnect();
  // }

  // async producerLocationOutput(
  //   clientId: string,
  //   output: GeolocationOutput
  // ): Promise<void> {
  //   await new LocationOutputProducer().produce({
  //     key: clientId,
  //     value: parseObjToString(output),
  //   });
  // }
}
