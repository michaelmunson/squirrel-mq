import { SchemaInput, SchemaType } from "../schema";
import { Client, ClientConfig } from "./types";
import { SnakeToCamelCaseObject } from "./utils";

export const createClient = <T extends SchemaType<any>>(schema: SchemaInput, config: ClientConfig = {}) : Client<{[K in keyof T]: SnakeToCamelCaseObject<T[K]>}> => {
  return schema as unknown as Client<{[K in keyof T]: SnakeToCamelCaseObject<T[K]>}>;
}