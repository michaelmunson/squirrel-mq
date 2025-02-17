import { PgClient, PgClientParams } from "./pg";
import { sql } from "../utils";
import { SchemaInput } from "../schema";
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

  async listTables() {
    if (!this.connected) throw new SqrlClientError('Client not connected');
    const result = await this.query(sql`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
    `);
    return result.rows;
  }

  async readSchema(schema: SchemaInput) {
    if (!this.connected) throw new SqrlClientError('Client not connected');
    const results: any[][] = [];
    for (const table of Object.keys(schema)) {
      const result = await this.query(sql`
        SELECT * FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = '${table}';
      `);

      results.push(result.rows);
    }
    return results;
  }
}

export const createSqrlClient = (params: PgClientParams) => {
  return new SqrlClient(params);
}