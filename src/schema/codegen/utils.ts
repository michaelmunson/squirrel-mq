import { CustomField, Field, FieldOptions } from "../fields";

export const fieldOptionsToSql = (options: FieldOptions<any,any>) : string => {
  let statement = [];
  statement.push(options.withTimezone ? 'WITH TIME ZONE' : '');
  statement.push(options.nullable === false ? 'NOT NULL' : 'NULL');
  statement.push(options.unique ? 'UNIQUE' : '');
  statement.push(options.default ? `DEFAULT ${options.default}` : '');
  statement.push(options.generatedAlwaysAsIdentity ? 'GENERATED ALWAYS AS IDENTITY' : '');
  statement.push(options.generatedByDefaultAsIdentity ? 'GENERATED BY DEFAULT AS IDENTITY' : '');
  statement.push(options.primaryKey ? 'PRIMARY KEY' : '');
  statement.push(options.references ? `REFERENCES ${options.references}` : '');

  if (statement.includes('PRIMARY KEY') || statement.includes(`REFERENCES ${options.references}`)) {
    statement = statement.filter(s => s !== 'NULL' && s !== 'NOT NULL');
  }

  return statement.filter(Boolean).join(' ');
}

export const fieldToSqlType = (field: Field<any,any> | CustomField<any>) : string => {
  if (field.type === '$') {
    return field.statement;
  }
  return `${field.type}${field.options?.array ? '[]' : ''}${field.argument ? `(${field.argument})` : ''} ${fieldOptionsToSql(field.options ?? {})}`;
}