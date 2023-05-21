import "reflect-metadata";

import colors from "colors";
import readline from "node:readline";
import { container } from "tsyringe";

import { MenuOptions } from "../shared/types/MenuOptions";

// Readers
import { CsvDatasource } from "./readers/implementations/CsvDatasource";
import { JsonlDatasource } from "./readers/implementations/JsonlDatasource";
import { KafkaTopicDatasource } from "./readers/implementations/KafkaTopicDatasource";

// Writers
import { CsvWriter } from "./writers/implementations/CsvWriter";
import { JsonlWriter } from "./writers/implementations/JsonlWriter";
import { KafkaTopicWriter } from "./writers/implementations/KafkaTopicWriter";

// Translators
import { CsvTranslator } from "./translators/implementations/CsvTranslator";
import { SqliteTranslator } from "./translators/implementations/SqliteTranslator";
import { ExternalApiTranslator } from "./translators/implementations/ExternalApiTranslator";

// Services
import { TrackingIpPipeline } from "../services/TrackingIpPipeline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const translatorOptions = {
  csv: CsvTranslator,
  sqlite: SqliteTranslator,
  externalApi: ExternalApiTranslator,
};

const datasourceOptions = {
  csv: CsvDatasource,
  jsonl: JsonlDatasource,
  kafka: KafkaTopicDatasource,
};

const writerOptions = {
  csv: CsvWriter,
  jsonl: JsonlWriter,
  kafka: KafkaTopicWriter,
};

function showMenuTitle(title: string): void {
  console.log(colors.bold(colors.green(title)));
}

function createOptionsMenu(options: MenuOptions[]): void {
  options.forEach((op) => {
    console.log(colors.bold(`${op.key} - ${op.description}`));
  });
}

function resolveDepencies(
  optionRead: string,
  optionWrite: string,
  optionTranslate: string
): void {
  container.register("DataSource", {
    useClass: datasourceOptions[optionRead as "csv" | "jsonl" | "kafka"],
  });

  container.register("WriterOutput", {
    useClass: writerOptions[optionWrite as "csv" | "jsonl" | "kafka"],
  });

  container.register("Translator", {
    useClass:
      translatorOptions[optionTranslate as "csv" | "sqlite" | "externalApi"],
  });

  container.registerSingleton(TrackingIpPipeline);
}

function verifyOptionIsValid(option: string): boolean {
  console.clear();

  if (option === "exit") {
    console.log(colors.red("Exiting..."));
    return false;
  }

  if (option === "invalid") {
    console.log(colors.red("Invalid option. Please try again..."));
    return false;
  }

  return true;
}

async function translateOption(): Promise<string> {
  const menuOptions: MenuOptions[] = [
    { key: "1", description: "Translate using csv file" },
    { key: "2", description: "Translate using sqlite" },
    { key: "3", description: "Translate using external api" },
    { key: "0", description: "Quit" },
  ];

  createOptionsMenu(menuOptions);

  return new Promise((resolve) => {
    rl.question(colors.yellow(`\nSelect an option: `), (answer) => {
      switch (answer) {
        case "1":
          resolve("csv");
          break;
        case "2":
          resolve("sqlite");
          break;
        case "3":
          resolve("externalApi");
        case "0":
          resolve("exit");
          break;
        default:
          resolve("invalid");
          break;
      }
    });
  });
}

async function readDatasourceOption(): Promise<string> {
  const menuOptions: MenuOptions[] = [
    { key: "1", description: "Read datasource from csv file" },
    { key: "2", description: "Read datasource from jsonl file" },
    { key: "3", description: "Read datasource from Kafka topic" },
    { key: "0", description: "Quit" },
  ];

  createOptionsMenu(menuOptions);

  return new Promise((resolve) => {
    rl.question(colors.yellow(`\nSelect an option: `), (answer) => {
      switch (answer) {
        case "1":
          resolve("csv");
          break;
        case "2":
          resolve("jsonl");
          break;
        case "3":
          resolve("kafka");
          break;
        case "0":
          resolve("exit");
          break;
        default:
          resolve("invalid");
          break;
      }
    });
  });
}

async function writeOutputOption(): Promise<string> {
  const menuOptions: MenuOptions[] = [
    { key: "1", description: "Write in csv file" },
    { key: "2", description: "Write in json file" },
    { key: "3", description: "Write in topic topic" },
    { key: "0", description: "Quit" },
  ];

  createOptionsMenu(menuOptions);

  return new Promise((resolve) => {
    rl.question(colors.yellow(`\nSelect an option: `), (answer) => {
      switch (answer) {
        case "1":
          resolve("csv");
          break;
        case "2":
          resolve("jsonl");
          break;
        case "3":
          resolve("kafka");
          break;
        case "0":
          resolve("exit");
          break;
        default:
          resolve("invalid");
          break;
      }
    });
  });
}

async function startCli() {
  console.clear();

  showMenuTitle("--- [Backend Challenge] Crocs / [Translaton] ---\n");
  const optionTranslation = await translateOption();
  if (!verifyOptionIsValid(optionTranslation)) {
    rl.close();
    return;
  }

  showMenuTitle("--- [Backend Challenge] Crocs / [Input Stream] ---\n");
  const optionRead = await readDatasourceOption();
  if (!verifyOptionIsValid(optionRead)) {
    rl.close();
    return;
  }

  showMenuTitle("--- [Backend Challenge] Crocs / [Output Stream] ---\n");
  const optionWrite = await writeOutputOption();
  if (!verifyOptionIsValid(optionWrite)) {
    rl.close();
    return;
  }

  resolveDepencies(optionRead, optionWrite, optionTranslation);

  await container.resolve(TrackingIpPipeline).run();
}

startCli().then(() => {
  rl.close();
});
