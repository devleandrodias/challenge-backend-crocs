import { Message, Partitioners } from "kafkajs";
import { kafka } from "../../configs/kafka.config";
import { EventInput } from "../../models/EventInput";
import { redisClient } from "../../configs/redis.config";
import { LocationOutput } from "../../models/LocationOutput";
import { EKafkaTopics } from "../../shared/enuns/EKafkaTopics";

export class TrackingIpRepository {
  async getLocationByCache(ip: string): Promise<LocationOutput | null> {
    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    await redisClient.connect();

    const location = await redisClient.get(ip);

    await redisClient.disconnect();

    if (location === null) {
      return null;
    }

    return JSON.parse(location) as LocationOutput;
  }

  async getLocationByApi(eventInput: EventInput): Promise<LocationOutput> {
    return {
      ip: eventInput.ip,
      clientId: eventInput.clientId,
      timestamp: eventInput.timestamp,
      city: "San Francisco",
      country: "United States",
      region: "California",
      latitude: 37.7749,
      longitude: -122.4194,
    };
  }

  async saveLocationOutputOnCache(ip: string, output: LocationOutput) {
    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    await redisClient.connect();

    await redisClient.set(ip, JSON.stringify(output), {
      EX: 30,
      NX: true,
    });

    await redisClient.disconnect();
  }

  async producerLocationOutput(
    clientId: string,
    output: LocationOutput
  ): Promise<void> {
    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    await producer.connect();

    const messageLocation: Message = {
      key: clientId,
      value: JSON.stringify(output),
    };

    await producer.send({
      topic: EKafkaTopics.LOCATION_OUTPUT,
      messages: [messageLocation],
    });

    await producer.disconnect();
  }
}
