import { inject, injectable } from "tsyringe";

import { IWriter } from "../app/writers/IWriter";
import { IDataSource } from "../app/readers/IDataSource";
import { ITranslator } from "../app/translators/ITranslator";

@injectable()
export class TrackingIpService {
  private readonly _writerOutput: IWriter;
  private readonly _dataSource: IDataSource;
  private readonly _translator: ITranslator;

  constructor(
    // @ts-ignore
    @inject("DataSource") dataSource: IDataSource,
    // @ts-ignore
    @inject("WriterOutput") writerOutput: IWriter,
    // @ts-ignore
    @inject("Translator") translator: ITranslator
  ) {
    this._translator = translator;
    this._dataSource = dataSource;
    this._writerOutput = writerOutput;
  }

  async execute() {
    await this._dataSource.read();

    const location = await this._translator.translate({
      ip: "149.107.176.192",
      clientId: "ee526cba-4846-5a1f-bd30-5397a63ce383",
      timestamp: 1684196954664,
    });

    console.log(location);

    await this._writerOutput.write(location);
  }
}
