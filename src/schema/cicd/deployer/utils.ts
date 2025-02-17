import { FieldSchema } from "../../../client/types";
import { PostgresSchemaMap, PostgresTableMap, SchemaInput, SchemaMap } from "../../types";
import { SchemaChangeSet, SchemaDeployerConfig } from "./types";

export const DEFAULT_CONFIG: SchemaDeployerConfig = {
  autoDeploy: false,
}

export const compareSchema = (newSchema: SchemaInput, currentSchema: PostgresSchemaMap) : SchemaChangeSet => {
  const changeSet:SchemaChangeSet = {
    create: {},
    alter: {},
    drop: {},
  }
  // CREATE
  for (const table in newSchema) {
    if (!currentSchema.has(table)) {
      changeSet.create[table] = newSchema[table];
    }
  }
  // ALTER
  for (const table in newSchema) {
    const alterChanges:SchemaChangeSet['alter'] = {};
    const currentTable = currentSchema.get(table);
    if (currentTable) {
      for (const [field, fieldSchema] of currentTable.entries()) {
        
      }
    }
  }
  return changeSet;
}

export const standardizeFieldSchema = (fieldSchema: FieldSchema) => {
  const mapping = {
    'character varying' : 'varchar',
    'text' : 'text',
    'integer' : 'int',
    'bigint' : 'bigint',
    'float' : 'float',
    'double precision' : 'double',
    'serial' : 'integer',
  };
  fieldSchema['data_type'] = mapping[fieldSchema['data_type'] as keyof typeof mapping] ?? fieldSchema['data_type'];
  return fieldSchema;
}