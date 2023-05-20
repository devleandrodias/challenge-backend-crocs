import "reflect-metadata";

import { container } from "tsyringe";

import readline from "node:readline";

import colors from "colors";

import { MenuOptions } from "../types/MenuOptions";
import { CsvDatasource } from "../implementations/readers/CsvDatasource";
import { TrackingIpService } from "../implementations/TrackingIpService";
import { JsonFileWriter } from "../implementations/writers/JsonFileWriter";
import { SqliteDatasource } from "../implementations/readers/SqliteDatasource";
import { KafkaTopicWriter } from "../implementations/writers/KafkaTopicWriter";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const datasourceOptions = {
  csv: CsvDatasource,
  sqlite: SqliteDatasource,
};

const writerOptions = {
  json: JsonFileWriter,
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

function resolveDepencies(optionRead: string, optionWrite: string): void {
  container.register("DataSource", {
    useClass: datasourceOptions[optionRead as "csv" | "sqlite"],
  });

  container.register("WriterOutput", {
    useClass: writerOptions[optionWrite as "json" | "kafka"],
  });

  container.registerSingleton(TrackingIpService);
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

async function readDatasourceOption(): Promise<string> {
  const menuOptions: MenuOptions[] = [
    { key: "1", description: "Read from CSV file" },
    { key: "2", description: "Read from Sqlite" },
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
    { key: "1", description: "Write response in json file" },
    { key: "2", description: "Write response in kafka topic" },
    { key: "0", description: "Quit" },
  ];

  createOptionsMenu(menuOptions);

  return new Promise((resolve) => {
    rl.question(colors.yellow(`\nSelect an option: `), (answer) => {
      switch (answer) {
        case "1":
          resolve("json");
          break;
        case "2":
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

  showMenuTitle("--- [Backend Challenge] Crocs / [Input] ---\n");
  const optionRead = await readDatasourceOption();
  if (!verifyOptionIsValid(optionRead)) {
    rl.close();
    return;
  }

  showMenuTitle("--- [Backend Challenge] Crocs / [Output] ---\n");
  const optionWrite = await writeOutputOption();
  if (!verifyOptionIsValid(optionWrite)) {
    rl.close();
    return;
  }

  resolveDepencies(optionRead, optionWrite);

  await container.resolve(TrackingIpService).execute();
}

startCli().then(() => {
  rl.close();
});
