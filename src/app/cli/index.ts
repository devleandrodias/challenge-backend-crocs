import "reflect-metadata";

import readline from "node:readline";
import { container } from "tsyringe";

import { TrackingIpService } from "../services/TrackingIpService";

import {
  showMenuTitle,
  getMenuOptions,
  createMenuOptions,
  verifyOptionIsValid,
} from "./cli.utils";

import {
  writerOptions,
  datasourceOptions,
  translatorOptions,
} from "./cli.options";

import {
  writersOptions,
  readMenuOptions,
  translateMenuOptions,
} from "./cli.menus";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function resolveDepencies(
  optionRead: string,
  optionWrite: string,
  optionTranslate: string
): void {
  container.register("DataSource", {
    useClass: datasourceOptions[optionRead as "csv" | "jsonl"],
  });

  container.register("WriterOutput", {
    useClass: writerOptions[optionWrite as "jsonl" | "kafka"],
  });

  container.register("Translator", {
    useClass:
      translatorOptions[optionTranslate as "csv" | "sqlite" | "externalApi"],
  });
}

async function startCli() {
  console.clear();

  showMenuTitle("--- [Backend Challenge] Crocs / [Translaton] ---\n");
  createMenuOptions(translateMenuOptions);
  const optionTranslation = await getMenuOptions(translateMenuOptions, rl);
  if (!verifyOptionIsValid(optionTranslation)) {
    rl.close();
    return;
  }

  showMenuTitle("--- [Backend Challenge] Crocs / [Input Stream] ---\n");
  createMenuOptions(readMenuOptions);
  const optionRead = await getMenuOptions(readMenuOptions, rl);
  if (!verifyOptionIsValid(optionRead)) {
    rl.close();
    return;
  }

  showMenuTitle("--- [Backend Challenge] Crocs / [Output Stream] ---\n");
  createMenuOptions(writersOptions);
  const optionWrite = await getMenuOptions(writersOptions, rl);
  if (!verifyOptionIsValid(optionWrite)) {
    rl.close();
    return;
  }

  resolveDepencies(optionRead, optionWrite, optionTranslation);
  container.registerSingleton(TrackingIpService);
  await container.resolve(TrackingIpService).run();
}

startCli().then(() => {
  rl.close();
});
