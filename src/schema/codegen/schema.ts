import { SchemaInput } from "..";
import { sql } from "../../utils";
import { SchemaToSqlConfig } from "./types";
import { createTableSql } from "./table";

export const generateSchemaSql = (schema: SchemaInput, config?: SchemaToSqlConfig) : string[] => {
  return Object.entries(schema).map(([name, table]) => [
    config?.dropExisting ? sql`DROP TABLE IF EXISTS ${name} CASCADE;` : '',
    createTableSql(name, table)
  ]).flat().filter(Boolean);
}
