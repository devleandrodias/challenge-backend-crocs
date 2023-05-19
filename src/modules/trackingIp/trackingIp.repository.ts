import { Message, Partitioners } from "kafkajs";
import { kafka } from "../../configs/kafka.config";
import { LocationOutput } from "../../models/LocationOutput";
import { EKafkaTopics } from "../../shared/infra/kafka/topics/EKafkaTopics";

export class TrackingIpRepository {
  async saveLocation(clientId: string, output: LocationOutput) {
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
