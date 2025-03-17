export { BOOLEAN, ENUM, INTEGER, PK_AUTO_INT, PK_AUTO_UUID, SERIAL, SQL, TEXT, TIMESTAMP, UUID, VARCHAR, defaults } from './schema/fields/index.cjs';
export { C as CustomField, D as DefaultOptions, c as ExtractFieldArgument, E as ExtractFieldType, b as Field, F as FieldOptions, a as Type, T as TypeMap } from './types-D26UMB4E.cjs';
export { e as PostgresSchemaMap, P as PostgresTableMap, S as SchemaInput, d as SchemaMap, c as SchemaType, a as Table, T as TableInput, b as TableMap } from './types-UfZShx_W.cjs';
export { SchemaChange, SchemaDeployerConfig, deploySchema, generateSchemaSql, initializeSchema } from './schema/index.cjs';
import 'pg';

declare const sql: (template: TemplateStringsArray, ...args: any[]) => string;

export { sql };
