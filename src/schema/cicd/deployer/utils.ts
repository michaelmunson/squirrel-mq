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
  
}

export const standardizeFieldSchema = (fieldSchema: FieldSchema) => {
  return {
    name: fieldSchema.column_name,
    type: fieldSchema.type,
    nullable: fieldSchema.nullable,
  }
}