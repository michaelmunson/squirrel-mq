import { Client } from 'pg';
import { b as Field, C as CustomField, E as ExtractFieldType } from './types-D26UMB4E.js';

type FieldSchema = {
    table_catalog: string;
    table_schema: string;
    table_name: string;
    column_name: string;
    ordinal_position: number;
    column_default: string;
    is_nullable: string;
    data_type: string;
    character_maximum_length: number;
    character_octet_length: number;
    numeric_precision: number;
    numeric_precision_radix: number;
    numeric_scale: number;
    datetime_precision: unknown;
    interval_type: unknown;
    interval_precision: unknown;
    character_set_catalog: unknown;
    character_set_schema: unknown;
    character_set_name: unknown;
    collation_catalog: unknown;
    collation_schema: unknown;
    collation_name: unknown;
    domain_catalog: unknown;
    domain_schema: unknown;
    domain_name: unknown;
    udt_catalog: string;
    udt_schema: string;
    udt_name: string;
    scope_catalog: unknown;
    scope_schema: unknown;
    scope_name: unknown;
    maximum_cardinality: unknown;
    dtd_identifier: string;
    is_self_referencing: string;
    is_identity: string;
    identity_generation: unknown;
    identity_start: unknown;
    identity_increment: unknown;
    identity_maximum: unknown;
    identity_minimum: unknown;
    identity_cycle: string;
    is_generated: string;
    generation_expression: unknown;
    is_updatable: string;
};

type TableInput = Record<string, Field<any, any> | CustomField<any>>;
type Table<T extends TableInput = TableInput> = T;
declare class TableMap extends Map<string, Field<any, any>> {
    constructor(tableMap: TableMap);
}
declare class PostgresTableMap extends Map<string, FieldSchema> {
    constructor(tableMap: PostgresTableMap);
}

type PgClientParams = ConstructorParameters<typeof Client>[0];

type SchemaInput = Record<string, Table>;
type SchemaType<T extends SchemaInput> = {
    [K in keyof T]: {
        [K2 in keyof T[K]]: ExtractFieldType<T[K][K2]>;
    };
};
declare class SchemaMap extends Map<string, TableMap> {
    constructor(schemaMap: SchemaMap);
}
declare class PostgresSchemaMap extends Map<string, PostgresTableMap> {
    constructor(schemaMap: PostgresSchemaMap);
}

export { PostgresTableMap as P, type SchemaInput as S, type TableInput as T, type Table as a, TableMap as b, type SchemaType as c, SchemaMap as d, PostgresSchemaMap as e, type PgClientParams as f };
