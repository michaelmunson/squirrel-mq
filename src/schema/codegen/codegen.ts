import { CustomField, Field, FieldOptions, SchemaInput, Table } from "..";
import { sql } from "../../utils";
import { SchemaToSqlConfig } from "./types";

const fieldOptionsToSql = (options: FieldOptions<any,any>) : string => {
  if (options.primaryKey) return 'PRIMARY KEY';
  if (options.references) return `REFERENCES ${options.references}`;
  let statement = [];
  statement.push(options.withTimezone ? 'WITH TIME ZONE' : '');
  statement.push(options.nullable ? 'NULL' : 'NOT NULL');
  statement.push(options.unique ? 'UNIQUE' : '');
  statement.push(options.default ? `DEFAULT ${options.default}` : '');
  return statement.filter(Boolean).join(' ');
}

export const fieldToSql = (field: Field<any,any> | CustomField<any>) : string => {
  if (field.type === '$') {
    return field.statement
  }
  return `${field.type}${field.argument ? `(${field.argument})` : ''} ${fieldOptionsToSql(field.options ?? {})}`
}

export const tableToSql = (name: string, table: Table) : string => {
  const fields = Object.entries(table).map(([key, field]) => `${key} ${fieldToSql(field)}`);
  return sql`CREATE TABLE ${name} (\n\t${fields.join(',\n\t')}\n);`
}

export const schemaToSql = (schema: SchemaInput, config?: SchemaToSqlConfig) : string[] => {
  return Object.entries(schema).map(([name, table]) => [
    config?.dropExisting ? sql`DROP TABLE IF EXISTS ${name} CASCADE;` : '',
    tableToSql(name, table)
  ]).flat().filter(Boolean);
}
