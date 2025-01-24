import postgres, {Sql} from "postgres";
import {SchemaInput} from "../schema";
import {constructSqlSchema} from "../codegen";

export type SqrlConnection = Sql & ReturnType<typeof createExtension>;

const createExtension = (sql: Sql) => <const>({
  initialize: async (schema: SchemaInput) => {
    const schemaStrings = constructSqlSchema(schema);
    if (process.env.DEBUG === 'true') {
      console.log(schemaStrings);
    }
    return Promise.all(schemaStrings.map(statement => sql`${statement}`));
  },
});

export const connect = (...params: Parameters<typeof postgres>) : SqrlConnection => {
  const sql = postgres(...params);
  const extension = createExtension(sql);
  Object.assign(sql, extension);
  return sql as SqrlConnection;
}