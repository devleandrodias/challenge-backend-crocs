import { inject, injectable } from "tsyringe";

import { IWriter } from "../interfaces/IWriter";
import { IDataSource } from "../interfaces/IDataSource";

@injectable()
export class TrackingIpService {
  private _writerOutput: IWriter;
  private _dataSource: IDataSource;

  constructor(
    // @ts-ignore
    @inject("DataSource") dataSource: IDataSource,
    // @ts-ignore
    @inject("WriterOutput") writerOutput: IWriter
  ) {
    this._dataSource = dataSource;
    this._writerOutput = writerOutput;
  }

  async execute() {
    await this._dataSource.read();
    await this._writerOutput.write();
  }
}
