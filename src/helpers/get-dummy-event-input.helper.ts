import { randomUUID } from "node:crypto";
import { EventInput } from "../models/EventInput";
import { EventInputProducer } from "../shared/infra/kafka/producers/event-input.producer";

(async () => {
  const inputEventMock: EventInput = {
    clientId: randomUUID(),
    timestamp: new Date().getTime(),
    ip: "177.200.70.73",
  };

  await new EventInputProducer().produce({
    key: inputEventMock.clientId,
    value: JSON.stringify(inputEventMock),
  });
})();
