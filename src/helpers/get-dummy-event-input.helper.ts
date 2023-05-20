import { randomUUID } from "node:crypto";
import { DataSourceInput } from "../types/DataSourceInput";
import { EventInputProducer } from "../shared/infra/kafka/producers/event-input.producer";

(async () => {
  const inputEventMock: DataSourceInput = {
    clientId: randomUUID(),
    timestamp: new Date().getTime(),
    ip: "39.167.59.72",
  };

  await new EventInputProducer().produce({
    key: inputEventMock.clientId,
    value: JSON.stringify(inputEventMock),
  });
})();
