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
  writersOptions,
  readMenuOptions,
  translateMenuOptions,
} from "./cli.menus";

import { CsvDataSource } from "../readers/CsvDatasource";
import { JsonlDataSource } from "../readers/JsonlDatasource";

import { JsonlWriter } from "../writers/JsonlWriter";
import { KafkaTopicWriter } from "../writers/KafkaTopicWriter";

import { CsvTransform } from "../transforms/CsvTransform";
import { SqliteTransform } from "../transforms/SqliteTranslator";
import { ExternalApiTransform } from "../transforms/ExternalApiTransform";

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

  switch (optionWrite) {
    case "jsonl":
      container.register("WriterOutput", { useClass: JsonlWriter });
      break;
    case "kafka":
      container.register("WriterOutput", { useClass: KafkaTopicWriter });
      break;
  }

  switch (optionRead) {
    case "csv":
      container.register("DataSource", { useClass: CsvDataSource });
      break;
    case "jsonl":
      container.register("DataSource", { useClass: JsonlDataSource });
      break;
  }

  switch (optionTranslate) {
    case "csv":
      container.register("Translator", { useClass: CsvTransform });
      break;
    case "sqlite":
      container.register("Translator", { useClass: SqliteTransform });
      break;
    case "externalApi":
      container.register("Translator", { useClass: ExternalApiTransform });
      break;
  }

  container.registerSingleton<IRedisService>("RedisService", RedisService);

  await container.resolve(TrackingIpService).run();
}

startCli().then(() => {
  rl.close();
});
