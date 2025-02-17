
import { schemaToSql, SchemaInput } from "../../../schema";
import { SqrlClient } from "../../../client";
import { SchemaDeployerConfig } from "./types";
import { DEFAULT_CONFIG } from "./utils";

export class SchemaDeployer {
  readonly client: SqrlClient;
  constructor(private readonly schema: SchemaInput, private readonly config: SchemaDeployerConfig = DEFAULT_CONFIG) {
    this.client = new SqrlClient(this.config.client);
    if (this.config.autoDeploy) {
      this.client.connect().then(() => {
        this.deploy();
      });
    }
  }

  async initialize() {
    if (!this.client.connected) await this.client.connect();
    const schemaStrings = schemaToSql(this.schema, { dropExisting: true });
    const results = [];
    for (const statement of schemaStrings) {
      const result = await this.client.query(statement);
      results.push(result);
    }
    return results;
  }

  async getChangeSet() {
    if (!this.client.connected) await this.client.connect();
    const tables = await this.client.listTables();
    const schema = await this.client.getSchema();
    console.log(tables);
    console.log(schema);
  }

  async deploy() {
    if (!this.client.connected) await this.client.connect();
    const tables = await this.client.listTables();
    console.log(tables);
  }

}

/*

export const initializeSchema = async (schema: SchemaInput, ...params: ConstructorParameters<typeof Client>) => {
  const client = new Client(...params);
  await client.connect();
  const schemaStrings = constructSqlSchema(schema);
  if (process.env.DEBUG === 'true') {
    console.log(schemaStrings);
  }
  const results = [];
  for (const statement of schemaStrings) {
    const result = await client.query(statement);
    results.push(result);
  }
  await client.end();
  return results;
}

export const readSchema = async (schema: SchemaInput, ...params: ConstructorParameters<typeof Client>) => {
  const client = new Client(...params);
  await client.connect();
  for (const table of Object.keys(schema)) {
    const result = await client.query(sql`
      SELECT * FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = '${table}';
    `);
    console.log(result.rows);
  }
  await client.end();
}

*/

