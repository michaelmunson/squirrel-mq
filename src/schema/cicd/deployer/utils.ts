import { FieldSchema } from "../../../client/types";
import { createTableSql, dropTableSql, alterTableAddFieldSql, alterTableDropFieldSql, alterTableAlterFieldSql } from "../../codegen/table";
import { Field, PostgresSchemaMap, PostgresTableMap, SchemaInput, SchemaMap } from "../../types";
import { SchemaChange, SchemaDeployerConfig } from "./types";

export const DEFAULT_CONFIG: SchemaDeployerConfig = {
  autoDeploy: false,
}

export const getSchemaChangeset = (newSchema: SchemaInput, currentSchema: PostgresSchemaMap) : SchemaChange[] => {
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
        } else if (newTable[field].type !== '$') {
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

export const convertSchemaChangesetToSql = (changeset: SchemaChange[]) : string[] => {
  const statements:string[] = [];
  for (const change of changeset){
    if (change.type === 'CREATE_TABLE'){
      statements.push(createTableSql(change.name, change.fields));
    }
    else if (change.type === 'DROP_TABLE'){
      statements.push(dropTableSql(change.name));
    }
    else if (change.type === 'ADD_COLUMN'){
      statements.push(alterTableAddFieldSql(change.tableName, change.name, change.field));
    }
    else if (change.type === 'DROP_COLUMN'){
      statements.push(alterTableDropFieldSql(change.tableName, change.name));
    }
    else if (change.type === 'ALTER_COLUMN'){
      statements.push(...alterTableAlterFieldSql(change.tableName, change.name, change.field));
    }
  }
  return statements;
}