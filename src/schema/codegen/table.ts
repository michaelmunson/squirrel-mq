import { sql, Table } from "../..";
import { CustomField, Field } from "../fields";
import { fieldToSqlType } from "./utils";

export const createTableSql =  (name: string, table: Table) : string => {
  const fields = Object.entries(table).map(([key, field]) => `${key} ${fieldToSqlType(field)}`);
  return sql`CREATE TABLE ${name} (\n\t${fields.join(',\n\t')}\n);`
}

export const dropTableSql = (name: string) : string => {
  return sql`DROP TABLE ${name};`;
}

export const alterTableAddFieldSql = (tableName: string, fieldName: string, field: Field<any,any> | CustomField<any>) => {
  return sql`ALTER TABLE ${tableName} ADD COLUMN ${fieldName} ${fieldToSqlType(field)};`;
}
export const alterTableDropFieldSql = (tableName: string, fieldName: string) => {
  return sql`ALTER TABLE ${tableName} DROP COLUMN ${fieldName};`;
}
export const alterTableAlterFieldSql = (tableName: string, fieldName: string, field: Field<any,any>) : string[] => {
  const statements = [
    sql`ALTER TABLE ${tableName} ALTER COLUMN ${fieldName} SET DATA TYPE ${field.type}${field.argument ? `(${field.argument})` : ''};`,
    sql`ALTER TABLE ${tableName} ALTER COLUMN ${fieldName} SET ${field.options?.nullable ? 'NULL' : 'NOT NULL'};`,
  ];
  if (field.options?.default) {
    statements.push(sql`ALTER TABLE ${tableName} ALTER COLUMN ${fieldName} SET DEFAULT ${field.options.default};`);
  }
  if (field.options?.unique) {
    statements.push(sql`ALTER TABLE ${tableName} ADD CONSTRAINT unique_${fieldName} UNIQUE (${fieldName});`);
  }
  return statements;
}