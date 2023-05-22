import { ISqliteService } from "../../src/shared/infra/SqliteService";
import { GeolocationResponseSqlite } from "../../src/types/GeolocationSqliteResponse";

export class SqliteInMemoryService implements ISqliteService {
  private database: GeolocationResponseSqlite[] = [];

  async getLocation(ip: string): Promise<GeolocationResponseSqlite | null> {
    const data = this.database.find((db) => db.ip === ip);

    if (!data) {
      return null;
    }

    return data;
  }

  close(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
