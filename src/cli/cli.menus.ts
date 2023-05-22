import { MenuOptions } from "../shared/types/MenuOptions";

export const translateMenuOptions: MenuOptions[] = [
  { key: "1", value: "csv", description: "Translate using csv file" },
  { key: "2", value: "sqlite", description: "Translate using sqlite" },
  {
    key: "3",
    value: "externalApi",
    description: "Translate using external api",
  },
  { key: "0", value: "exit", description: "Quit" },
];

export const readMenuOptions: MenuOptions[] = [
  { key: "1", value: "csv", description: "Read datasource from csv file" },
  { key: "2", value: "jsonl", description: "Read datasource from jsonl file" },
  { key: "0", value: "exit", description: "Quit" },
];

export const writersOptions: MenuOptions[] = [
  { key: "1", value: "jsonl", description: "Write in jsonl file" },
  { key: "2", value: "kafka", description: "Write in topic topic" },
  { key: "0", value: "exit", description: "Quit" },
];
