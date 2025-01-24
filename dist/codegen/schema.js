"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructSqlSchema = void 0;
const fieldOptionsToSql = (options) => {
    if (options.primaryKey)
        return 'PRIMARY KEY';
    if (options.references)
        return `REFERENCES ${options.references}`;
    let statement = '';
    statement += options.withTimezone ? 'WITH TIME ZONE' : '';
    statement += (options.nullable) ? 'NULL' : 'NOT NULL';
    statement += options.unique ? 'UNIQUE' : '';
    statement += options.default ? `DEFAULT ${options.default}` : '';
    return statement;
};
const fieldToSql = (field) => {
    if (field.type === '$') {
        return field.statement;
    }
    return `${field.type}${field.argument ? `(${field.argument})` : ''} ${fieldOptionsToSql(field.options ?? {})}`;
};
const tableToSql = (name, table) => {
    const fields = Object.entries(table).map(([key, field]) => `${key} ${fieldToSql(field)}`);
    return `CREATE TABLE ${name} (\n\t${fields.join(',\n\t')}\n);`;
};
const constructSqlSchema = (schema) => {
    return Object.entries(schema).map(([name, table]) => tableToSql(name, table)).join('\n\n');
};
exports.constructSqlSchema = constructSqlSchema;
