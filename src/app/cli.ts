import "reflect-metadata";

import { container } from "tsyringe";
import readline from "node:readline";

import colors from "colors";

import { MenuOptions } from "../types/MenuOptions";
import { CsvDatasource } from "../implementations/readers/CsvDatasource";
import { TrackingIpService } from "../implementations/TrackingIpService";
import { SqliteDatasource } from "../implementations/readers/SqliteDatasource";
import { JsonFileWriter } from "../implementations/writers/JsonFileWriter";
import { KafkaTopicWriter } from "../implementations/writers/KafkaTopicWriter";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function createOptionsMenu(options: MenuOptions[]) {
  options.forEach((op) => {
    console.log(colors.bold(`${op.key} - ${op.description}`));
  });
}

async function readDatasourceOption(): Promise<string> {
  const menuOptions: MenuOptions[] = [
    { key: "1", description: "Read from CSV file" },
    { key: "2", description: "Read from Sqlite" },
    { key: "0", description: "Quit" },
  ];

  createOptionsMenu(menuOptions);

  return new Promise((resolve) => {
    rl.question(colors.yellow(`\nChoose the location source: `), (answer) => {
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
    rl.question(colors.yellow(`\nChoose the location source: `), (answer) => {
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

const datasourceOptions = {
  csv: CsvDatasource,
  sqlite: SqliteDatasource,
};

const writerOptions = {
  json: JsonFileWriter,
  kafka: KafkaTopicWriter,
};

async function startCli() {
  console.clear();

  console.log(
    colors.bold(
      colors.green("--- Backend Crocs Stream Challenge - [Input] ---\n")
    )
  );

  const optionRead = await readDatasourceOption();

  if (optionRead === "exit") {
    console.clear();
    console.log(colors.red("Exiting..."));
    rl.close();
    return;
  }

  if (optionRead === "invalid") {
    console.clear();
    console.log(colors.red("Invalid option. Please try again..."));
    rl.close();
    return;
  }

  console.clear();

  console.log(
    colors.bold(
      colors.green("--- Backend Crocs Stream Challenge - [Output] ---\n")
    )
  );

  const optionWrite = await writeOutputOption();

  container.register("DataSource", {
    useClass: datasourceOptions[optionRead as "csv" | "sqlite"],
  });

  container.register("WriterOutput", {
    useClass: writerOptions[optionWrite as "json" | "kafka"],
  });

  container.registerSingleton(TrackingIpService);

  const trackingIpService = container.resolve(TrackingIpService);

  console.clear();

  await trackingIpService.execute();
}

startCli().then(() => {
  rl.close();
});
