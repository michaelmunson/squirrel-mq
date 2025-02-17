export type * from './fields'
export type * from './table'
import { ExtractFieldType } from './fields';
import { type TableMap, type Table, PostgresTableMap } from "./table";

export type SchemaInput = Record<string, Table>

export type SchemaType<T extends SchemaInput> = {
  [K in keyof T]: {
    [K2 in keyof T[K]]: ExtractFieldType<T[K][K2]>
  }
}

export class SchemaMap extends Map<string, TableMap> {
  constructor(schemaMap: SchemaMap) {
    super(schemaMap);
  }
} 

export class PostgresSchemaMap extends Map<string, PostgresTableMap>{
  constructor(schemaMap: PostgresSchemaMap) {
    super(schemaMap);
  }
}