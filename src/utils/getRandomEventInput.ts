import { randomUUID } from "node:crypto";

import { EventInput } from "../models/EventInput";

const eventInputExample: EventInput = {
  clientId: randomUUID(),
  timestamp: new Date().getTime(),
  ip: "177.200.70.73",
};

console.log(JSON.stringify(eventInputExample));
