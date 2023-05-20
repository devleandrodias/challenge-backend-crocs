import { inject, injectable } from "tsyringe";

import { IDataSource } from "./interfaces/IDataSource";

@injectable()
export class TrackingIpService {
  private _dataSource: IDataSource;

  // @ts-ignore
  constructor(@inject("DataSource") dataSource: IDataSource) {
    this._dataSource = dataSource;
  }

  async execute() {
    this._dataSource.read();
  }
}
