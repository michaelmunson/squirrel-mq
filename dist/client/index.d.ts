import { A as API, a as ApiExtensionRecord, L as ListParams, k as ApiExtensionMethods } from '../extensions-BEOVY3yu.js';
import { c as SchemaType } from '../types-DZcucQnq.js';
import { RequestHandler } from 'express';
import 'pg';
import '../types-D26UMB4E.js';

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
  import { createClient } from "squirrel-mq/client";
  import api from "./api";

  const client = createClient(api, {
    baseUrl: 'http://localhost:3000/',
    headers: {
      'Authorization': 'Bearer 1234567890',
    }
  });

  client.models.posts.get(1).then(r => console.log(r));

  client.models.posts.create({
    title: 'My Post',
    content: 'This is a post',
  }).then(r => console.log(r));

  client.custom('/example-users').post({
    age: 20,
    name: 'John Doe',
    email: 'john.doe@example.com',
    id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).then(r => console.log(r));
  ```
 */
declare const createClient: <A extends API>(api: A, config: ApiClientConfig) => ApiClient<A>;

export { type ApiClient, type ApiClientConfig, type ApiExtensions, type ApiSchema, type BaseApiClient, createClient };
