import { Writable } from "node:stream";
import { injectable } from "tsyringe";

import { Message, Partitioners } from "kafkajs";
import { loggerInfo } from "../../../utils/logger";
import { kafka } from "../../../configs/kafka.config";
import { parseObjToString } from "../../../utils/parser";
import { GeolocationOutput } from "../types/GeolocationOutput";
import { EKafkaTopics } from "../../../shared/enuns/EKafkaTopics";

@injectable()
export class KafkaTopicWriter extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  async _write(
    chunk: GeolocationOutput,
    _: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): Promise<void> {
    loggerInfo({
      type: "info",
      log: `[WRITER: Kafka]: Writing data - IP [${chunk.ip}]`,
    });

    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    await producer.connect();

    const key = chunk.clientId;

    Reflect.deleteProperty(chunk, "clientId");

    const value = parseObjToString<GeolocationOutput>(chunk);

    const message: Message = { key, value };

    await producer.send({
      topic: EKafkaTopics.LOCATION_OUTPUT,
      messages: [message],
    });

    await producer.disconnect();

    callback(null);
  }

  // ! Temporary files

  // * Obeter dados do cache
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

  // * Obter dados da API Externa
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

  // * Salvar dados no cache
  // async saveLocationOutputOnCache(ip: string, output: GeolocationOutput) {
  //   redisClient.on("error", (err) => console.log("Redis Client Error", err));

  //   await redisClient.connect();

  //   await redisClient.set(ip, parseObjToString(output), {
  //     EX: 30,
  //     NX: true,
  //   });

  //   await redisClient.disconnect();
  // }
}
