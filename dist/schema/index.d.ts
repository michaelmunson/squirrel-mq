export { BOOLEAN, ENUM, INTEGER, JSONB, PK_AUTO_INT, PK_AUTO_UUID, SERIAL, SQL, TEXT, TIMESTAMP, UUID, VARCHAR } from './fields/index.js';
import { b as Field, C as CustomField } from '../types-W554HBlq.js';
export { D as DefaultOptions, c as ExtractFieldArgument, E as ExtractFieldType, F as FieldOptions, a as Type, T as TypeMap } from '../types-W554HBlq.js';
import { f as PgClient, g as PgClientParams, e as PostgresSchemaMap, a as Table, S as SchemaInput } from '../types-Drqv8FGe.js';
export { P as PostgresTableMap, d as SchemaMap, c as SchemaType, T as TableInput, b as TableMap } from '../types-Drqv8FGe.js';
import { Client, QueryResult } from 'pg';

declare class SqrlPgClient extends PgClient {
    connected: boolean;
    constructor(params: PgClientParams);
    connect(): Promise<void>;
    listTables(): Promise<string[]>;
    getSchema(): Promise<PostgresSchemaMap>;
}

type SchemaDeployerConfig = {
    autoDeploy?: boolean;
    client?: ConstructorParameters<typeof Client>[0];
};
type F = Field<any, any>;
type SchemaChange = ({
    type: 'CREATE_TABLE';
    name: string;
    fields: Table;
} | {
    type: 'DROP_TABLE';
    name: string;
} | {
    type: 'ADD_COLUMN';
    tableName: string;
    name: string;
    field: F | CustomField<any>;
} | {
    type: 'ALTER_COLUMN';
    tableName: string;
    name: string;
    field: F;
} | {
    type: 'DROP_COLUMN';
    tableName: string;
    name: string;
});

declare class SchemaDeployer {
    private readonly schema;
    private readonly config;
    readonly client: SqrlPgClient;
    constructor(schema: SchemaInput, config?: SchemaDeployerConfig);
    initialize(): Promise<QueryResult<any>[]>;
    getChangeSet(): Promise<SchemaChange[]>;
    deploy(_changeSet?: SchemaChange[]): Promise<Map<string, Error | QueryResult<any>>>;
}
/**
 * @description
 * Initialize the schema
 * # WARNING - This will drop all existing tables and recreate them
 */
declare function initializeSchema(...params: ConstructorParameters<typeof SchemaDeployer>): Promise<QueryResult<any>[]>;
/**
 * @description
 * - Deploys the schema
 * - This method preserves existing tables and only adds/removes/updates columns
 * @env ```
    PGUSER=
    PGPASSWORD=
    PGDATABASE=
    PGHOST=
    PGPORT=
  ```
 */
declare function deploySchema(...params: ConstructorParameters<typeof SchemaDeployer>): Promise<Map<string, Error | QueryResult<any>>>;

type SchemaToSqlConfig = {
    dropExisting?: boolean;
};

declare const generateSchemaSql: (schema: SchemaInput, config?: SchemaToSqlConfig) => string[];

export { CustomField, Field, PostgresSchemaMap, type SchemaChange, type SchemaDeployerConfig, SchemaInput, Table, deploySchema, generateSchemaSql, initializeSchema };
