import { PgClient, PgClientParams } from "./pg";
import { sql } from "../utils";
import { SchemaInput, SchemaMap, Table, TableMap } from "../schema";
class SqrlClientError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class SqrlClient extends PgClient {
  connected = false;
  constructor(params: PgClientParams) {
    super(params);
  }

  async connect(){
    const result = await super.connect();
    this.connected = true;
    return result;
  }

  async listTables() : Promise<string[]> {
    if (!this.connected) throw new SqrlClientError('Client not connected');
    const result = await this.query(sql`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
    `);
    return result.rows.map((row: any) => row.table_name);
  }

  async getDeployedSchema() {
    if (!this.connected) throw new SqrlClientError('Client not connected');
    const tables = await this.listTables();
    const schemaObject:SchemaMap = new Map();
    for (const table of tables) {
      const result = await this.query(sql`
        SELECT * FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = '${table}';
      `);

      if (result.rows.length !== 0){
        const tableMap:TableMap = new Map();
        result.rows.forEach((row) => {
          tableMap.set(row.column_name, row);
        });
        schemaObject.set(table, tableMap);
      }
    }
    return schemaObject;
  }
}

export const createSqrlClient = (params: PgClientParams) => {
  return new SqrlClient(params);
}