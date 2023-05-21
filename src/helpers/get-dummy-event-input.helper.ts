import { Message, Partitioners } from "kafkajs";

import { kafka } from "../configs/kafka.config";
import { EKafkaTopics } from "../shared/infra/kafka/EKafkaTopics";
import { KafkaDatasourceInput } from "../app/readers/types/KafkaDatasourceInput";

(async () => {
  const data1: KafkaDatasourceInput = {
    timestamp: 1684196387094,
    ip: "59.90.255.63",
  };

  const data2: KafkaDatasourceInput = {
    timestamp: 1684197342630,
    ip: "214.183.104.21",
  };

  const messages: Message[] = [
    {
      key: "1a301e29-6d6f-5e47-b130-e8fb5c0b1ee2",
      value: JSON.stringify(data1),
    },
    {
      key: "1f15b7d4-6481-50ea-84dc-3555326ee3fe",
      value: JSON.stringify(data2),
    },
  ];

  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();
  await producer.send({ topic: EKafkaTopics.EVENTS_INPUT, messages });
  await producer.disconnect();
})();
