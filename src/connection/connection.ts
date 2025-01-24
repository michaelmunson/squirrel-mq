import {Client} from "pg";
import {SchemaInput} from "../schema";
import {constructSqlSchema} from "../codegen";

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
