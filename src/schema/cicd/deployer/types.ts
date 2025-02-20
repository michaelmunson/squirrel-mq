import { CustomField, Field, SchemaInput, Table } from "../../types";
import { Client } from "pg";

export type SchemaDeployerConfig = {
  autoDeploy?: boolean;
  client?: ConstructorParameters<typeof Client>[0];
}

// export type SchemaChange = {changeType: 'CREATE' | 'ALTER' | 'DROP';} & ({
//   type: 'TABLE';
//   name: string;
//   fields: Record<string, Field<any, any>>;
// } | {
//   type: 'FIELD';
//   tableName: string;
//   name: string;
//   field: Field<any, any>;
// })

type AnyField = Field<any,any> | CustomField<any>

export type SchemaChange = (
  {type: 'CREATE_TABLE', name: string, fields:Table} | 
  {type: 'DROP_TABLE', name:string} | 
  {type: 'ADD_COLUMN', tableName: string, name:string, field:AnyField} |
  {type: 'ALTER_COLUMN', tableName:string, name:string, field:AnyField} |
  {type: 'DROP_COLUMN', tableName:string, name:string}
)
