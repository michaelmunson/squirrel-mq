
import { createSchemaSql, SchemaInput } from "../../../schema";
import { SqrlPgClient } from "../../../pg";
import { SchemaChange, SchemaDeployerConfig } from "./types";
import { getSchemaChangeset, DEFAULT_CONFIG, convertSchemaChangesetToSql } from "./utils";

export class SchemaDeployer {
  readonly client: SqrlPgClient;
  constructor(private readonly schema: SchemaInput, private readonly config: SchemaDeployerConfig = DEFAULT_CONFIG) {
    this.client = new SqrlPgClient(this.config.client);
    if (this.config.autoDeploy) {
      this.client.connect().then(() => {
        this.deploy();
      });
    }
  }

  async initialize() {
    if (!this.client.connected) await this.client.connect();
    const schemaStrings = createSchemaSql(this.schema, { dropExisting: true });
    const results = [];
    for (const statement of schemaStrings) {
      const result = await this.client.query(statement);
      results.push(result);
    }
    return results;
  }

  async getChangeSet() {
    if (!this.client.connected) await this.client.connect();
    const currentSchema = await this.client.getSchema();
    const changeSet = getSchemaChangeset(this.schema, currentSchema);
    return changeSet;
  }

  async deploy(_changeSet?: SchemaChange[]) {
    if (!this.client.connected) await this.client.connect();
    const changeSet = _changeSet ?? await this.getChangeSet();
    const statements = convertSchemaChangesetToSql(changeSet);
    const results = [];
    for (const statement of statements) {
      try {
        const result = await this.client.query(statement);
        results.push(result);
      } catch (error) {
        results.push(error);
      }
    }
    return results;
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

