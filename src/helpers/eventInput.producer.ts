import { randomUUID } from "node:crypto";
import { Message, Partitioners } from "kafkajs";

import { kafka } from "../configs/kafka.config";
import { EventInput } from "../models/EventInput";
import { EKafkaTopics } from "../shared/enuns/EKafkaTopics";

(async () => {
  const inputEventMock: EventInput = {
    clientId: randomUUID(),
    timestamp: new Date().getTime(),
    ip: "177.200.70.73",
  };

  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();

  const messageLocation: Message = {
    key: inputEventMock.clientId,
    value: JSON.stringify(inputEventMock),
  };

  await producer.send({
    topic: EKafkaTopics.EVENTS_INPUT,
    messages: [messageLocation],
  });

  await producer.disconnect();
})();
