import sqlite3 from "sqlite3";

import { GeolocationResponseSqlite } from "../../types/GeolocationSqliteResponse";

export interface ISqliteService {
  getLocation(ip: string): Promise<GeolocationResponseSqlite | null>;
  close(): Promise<void>;
}

export class SqliteService implements ISqliteService {
  private db: sqlite3.Database;

  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath);
  }

  async getLocation(ip: string): Promise<GeolocationResponseSqlite | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Ips WHERE ip = ?`;

      this.db.get<GeolocationResponseSqlite>(query, [ip], (err, row) => {
        if (err) {
          reject(err);
        }

        if (!row) {
          resolve(null);
        }

        resolve(row);
      });
    });
  }

  async close(): Promise<void> {
    this.db.close();
  }
}
