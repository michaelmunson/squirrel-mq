import { A as API, a as ApiExtensionRecord, L as ListParams, l as ApiExtensionMethods, b as ApiExtensionFunction, c as APIConfig } from '../types-CYPL2Ame.cjs';
import { c as SchemaType, S as SchemaInput } from '../types-Dw9Q3g5N.cjs';
import { RequestHandler } from 'express';
import 'pg';
import '../types-W554HBlq.cjs';

type ClientCustomRoutes<M extends ApiExtensionMethods> = {
    [K in keyof M]: M[K] extends RequestHandler<infer _, infer Output, infer Input> ? (Input extends undefined ? () => Promise<Output> : (input: Input) => Promise<Output>) : never;
};
type ApiClientConfig = {
    baseUrl: string;
    headers?: Record<string, string>;
};
type BaseApiClient<T extends SchemaType<any>, E extends ApiExtensionRecord> = {
    models: {
        [K in keyof T]: {
            get: (id: T[K]['id']) => Promise<T[K]>;
            list: (params: ListParams<T[K]>) => Promise<T[K][]>;
            create: (data: T[K]) => Promise<T[K]>;
            update: (id: string, data: T[K]) => Promise<T[K]>;
            delete: (id: string) => Promise<T[K]>;
        };
    };
    custom: <R extends keyof E>(route: R) => ClientCustomRoutes<E[R]>;
};
type ApiSchema<T extends API> = T extends API<infer S> ? SchemaType<S> : never;
type ApiExtensions<T extends API> = T extends API<infer S, infer E> ? ReturnType<E> : never;
type ApiClient<T extends API> = BaseApiClient<ApiSchema<T>, ApiExtensions<T>>;

/**
 * @description
 * Create a frontend client for the API, allowing easy access to the API's models and custom routes.
 * @example
 * ```ts
  import { createClient } from "squirrelify/client";
  import { extensions, config} from "./api";
  import { schema } from "./schema";

  const client = createClient({schema, extensions, config}, {
    baseUrl: 'http://localhost:3000/',
    headers: {
      'Authorization': 'Bearer 1234567890',
    }
  });

  client.models.posts.get('abc-12').then(r => console.log(r));

  client.custom('example-users').post({
    age: 20,
    name: 'John Doe',
    email: 'john.doe@example.com',
    id: 'abc-123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).then(r => console.log(r));
  ```
 */
declare const createClient: <S extends SchemaInput, E extends ApiExtensionFunction>(api: {
    schema: S;
    extensions: E;
    config: APIConfig;
}, config: ApiClientConfig) => ApiClient<API<S, E>>;

export { type ApiClient, type ApiClientConfig, type ApiExtensions, type ApiSchema, type BaseApiClient, createClient };
