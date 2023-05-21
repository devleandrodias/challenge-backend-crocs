import { CsvDatasource } from "../readers/implementations/CsvDatasource";
import { JsonlDatasource } from "../readers/implementations/JsonlDatasource";

import { CsvTranslator } from "../translators/implementations/CsvTranslator";
import { SqliteTranslator } from "../translators/implementations/SqliteTranslator";
import { ExternalApiTranslator } from "../translators/implementations/ExternalApiTranslator";

import { JsonlWriter } from "../writers/implementations/JsonlWriter";
import { KafkaTopicWriter } from "../writers/implementations/KafkaTopicWriter";

export const translatorOptions = {
  csv: CsvTranslator,
  sqlite: SqliteTranslator,
  externalApi: ExternalApiTranslator,
};

export const datasourceOptions = {
  csv: CsvDatasource,
  jsonl: JsonlDatasource,
};

export const writerOptions = {
  jsonl: JsonlWriter,
  kafka: KafkaTopicWriter,
};