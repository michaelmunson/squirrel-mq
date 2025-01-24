import { CustomField, Field, FieldOptions, SchemaInput, Table } from "../schema";

const fieldOptionsToSql = (options: FieldOptions) : string => {

  if (options.primaryKey) return 'PRIMARY KEY';
  if (options.references) return `REFERENCES ${options.references}`;
  let statement = [];
  statement.push(options.withTimezone ? 'WITH TIME ZONE' : '');
  statement.push(options.nullable ? 'NULL' : 'NOT NULL');
  statement.push(options.unique ? 'UNIQUE' : '');
  statement.push(options.default ? `DEFAULT ${options.default}` : '');
  return statement.filter(Boolean).join(' ');
}

const fieldToSql = (field: Field | CustomField) : string => {
  if (field.type === '$') {
    return field.statement
  }
  return `${field.type}${field.argument ? `(${field.argument})` : ''} ${fieldOptionsToSql(field.options ?? {})}`
}

const tableToSql = (name: string, table: Table) : string => {
  const fields = Object.entries(table).map(([key, field]) => `${key} ${fieldToSql(field)}`);
  return `CREATE TABLE ${name} (\n\t${fields.join(',\n\t')}\n);`
}

export const constructSqlSchema = (schema: SchemaInput) : string[] => {
  return Object.entries(schema).map(([name, table]) => tableToSql(name, table));
}
