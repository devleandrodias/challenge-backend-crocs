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

import { IRedisService, RedisService } from "../services/RedisService";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function startCli() {
  console.clear();

  showMenuTitle("--- [Backend Challenge] Crocs / [Translaton] ---\n");
  createMenuOptions(translateMenuOptions);
  const optionTranslate = await getMenuOptions(translateMenuOptions, rl);
  if (!verifyOptionIsValid(optionTranslate)) {
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

  container.registerSingleton<IRedisService>("RedisService", RedisService);

  await container.resolve(TrackingIpService).run();
}

startCli().then(() => {
  rl.close();
});
