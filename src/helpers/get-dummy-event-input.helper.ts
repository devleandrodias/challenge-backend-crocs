import { randomUUID } from "node:crypto";
import { EventInput } from "../models/EventInput";
import { EventInputProducer } from "../shared/infra/kafka/producers/event-input.producer";

(async () => {
  const inputEventMock: EventInput = {
    clientId: randomUUID(),
    timestamp: new Date().getTime(),
    ip: "39.167.59.72",
  };

  await new EventInputProducer().produce({
    key: inputEventMock.clientId,
    value: JSON.stringify(inputEventMock),
  });
})();
