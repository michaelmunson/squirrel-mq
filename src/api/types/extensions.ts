import { RequestHandler } from "express";
import { API } from "../api";

export {
  type RequestHandler,
}

export type ApiExtensionMethods = Partial<{
  get: RequestHandler<any, any, any>;
  post: RequestHandler<any, any, any>;
  patch: RequestHandler<any, any, any>;
  delete: RequestHandler<any, any, any>;
  put: RequestHandler<any, any, any>;
}>

/**
 * @description A record of API extension methods that can be used to extend the API
 * @note The keys of the record must not start with a slash
 * @example
 * const api = createApi(schema, (api) => ({
 *   'my-extension': {
 *     get: () => {
 *       return 'Hello World';
 *     }
 *   }
 * }))
 */
export type ApiExtensionRecord = {[k:string]: ApiExtensionMethods} & {[K in `/${string}`]: never}
export type ApiExtensionFunction = (self: API) => ApiExtensionRecord;
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
