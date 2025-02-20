import { FieldSchema } from "../../../client/types";
import { Field, PostgresSchemaMap, PostgresTableMap, SchemaInput, SchemaMap } from "../../types";
import { SchemaChange, SchemaDeployerConfig } from "./types";

export const DEFAULT_CONFIG: SchemaDeployerConfig = {
  autoDeploy: false,
}

export const compareSchema = (newSchema: SchemaInput, currentSchema: PostgresSchemaMap) : SchemaChange[] => {
  const changeSet:SchemaChange[] = [];
  // CREATE
  for (const table in newSchema) {
    if (!currentSchema.has(table)) {
      changeSet.push({
        type: 'CREATE_TABLE',
        name: table,
        fields: newSchema[table],
      });
    }
    else {
      const currentTable = currentSchema.get(table)!;
      const newTable = newSchema[table]!;
      for (const [field] of currentTable.entries()) {
        if (!(field in newTable)) {
          changeSet.push({
            type: 'DROP_COLUMN',
            tableName: table,
            name: field
          });
        }
      }
      for (const field in newTable){
        if (!currentTable.has(field)){
          changeSet.push({
            type: 'ADD_COLUMN',
            tableName: table,
            name: field,
            field: newTable[field]
          })
        } else {
          changeSet.push({
            type: 'ALTER_COLUMN',
            tableName: table,
            name: field,
            field: newTable[field]
          })
        }
      }
    }
  }
  // DROP
  for (const table in currentSchema) {
    if (!(table in newSchema)) {
      changeSet.push({
        type: 'DROP_TABLE',
        name: table
      });
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