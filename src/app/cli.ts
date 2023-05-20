import "reflect-metadata";

import { container } from "tsyringe";
import readline from "node:readline";

import colors from "colors";

import { CsvDatasource } from "../implementations/readers/CsvDatasource";
import { TrackingIpService } from "../implementations/TrackingIpService";
import { SqliteDatasource } from "../implementations/readers/SqliteDatasource";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function readDatasourceOption(): Promise<string> {
  const datasourceOptions = [
    {
      key: "1",
      description: "Read from CSV file",
    },
    {
      key: "2",
      description: "Read from Sqlite",
    },
    {
      key: "0",
      description: "Quit",
    },
  ];

  datasourceOptions.forEach((op) => {
    console.log(colors.bold(`${op.key} - ${op.description}`));
  });

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

const datasourceOptions = {
  csv: CsvDatasource,
  sqlite: SqliteDatasource,
};

async function startCli() {
  console.clear();

  console.log(
    colors.bold(colors.green("--- Backend Crocs Stream Challenge ---\n"))
  );

  const datasourceOption = await readDatasourceOption();

  if (datasourceOption === "exit") {
    console.clear();
    console.log(colors.red("Exiting..."));
    rl.close();
    return;
  }

  if (datasourceOption === "invalid") {
    console.clear();
    console.log(colors.red("Invalid option. Please try again..."));
    rl.close();
    return;
  }

  container.register("DataSource", {
    useClass: datasourceOptions[datasourceOption as "csv" | "sqlite"],
  });

  container.registerSingleton(TrackingIpService);

  const trackingIpService = container.resolve(TrackingIpService);

  console.clear();

  await trackingIpService.execute();
}

startCli().then(() => {
  rl.close();
});
