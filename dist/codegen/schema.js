"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructSqlSchema = void 0;
const fieldOptionsToSql = (options) => {
    if (options.primaryKey)
        return 'PRIMARY KEY';
    if (options.references)
        return `REFERENCES ${options.references}`;
    let statement = [];
    statement.push(options.withTimezone ? 'WITH TIME ZONE' : '');
    statement.push(options.nullable ? 'NULL' : 'NOT NULL');
    statement.push(options.unique ? 'UNIQUE' : '');
    statement.push(options.default ? `DEFAULT ${options.default}` : '');
    return statement.filter(Boolean).join(' ');
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
    return Object.entries(schema).map(([name, table]) => tableToSql(name, table));
};
exports.constructSqlSchema = constructSqlSchema;
