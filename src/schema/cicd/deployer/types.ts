import { SchemaInput } from "../../types";
import { Client } from "pg";

export type SchemaDeployerConfig = {
  autoDeploy?: boolean;
  client?: ConstructorParameters<typeof Client>[0];
}

export type SchemaChangeSet = {
  create: SchemaInput;
  alter: SchemaInput;
  drop: SchemaInput;
}