import { Field, SchemaInput } from "../../types";
import { Client } from "pg";

export type SchemaDeployerConfig = {
  autoDeploy?: boolean;
  client?: ConstructorParameters<typeof Client>[0];
}

export type SchemaChange = {changeType: 'CREATE' | 'ALTER' | 'DROP';} & ({
  type: 'TABLE';
  name: string;
  fields: Record<string, Field<any, any>>;
} | {
  type: 'FIELD';
  tableName: string;
  name: string;
  field: Field<any, any>;
})

export type SchemaChangeSet = {
  create: SchemaInput;
  alter: SchemaInput;
  drop: SchemaInput;
}