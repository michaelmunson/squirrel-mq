import { RequestHandler } from "express";
import { PgClient } from "../../pg";

export type RouteExtensionMethods = Partial<{
  get: (client?: PgClient) => RequestHandler<any, any, any>;
  post: (client?: PgClient) => RequestHandler<any, any, any>;
  patch: (client?: PgClient) => RequestHandler<any, any, any>;
  delete: (client?: PgClient) => RequestHandler<any, any, any>;
  put: (client?: PgClient) => RequestHandler<any, any, any>;
}>

export type RouteExtensionRecord = Record<string, RouteExtensionMethods>;

/*

export type ParsePathToObject<T extends string> =
  T extends `${infer First}/${infer Rest}`
    ? { [key in First]: ParsePathToObject<Rest> }
    : { [key in T]: {} };


export type ParsedExtensionRecord<T extends ExtensionRecord> = {
  [K in keyof T]: K extends string ? (
    ParsePathToObject<K>
  ) : never;
}[keyof T];

*/
