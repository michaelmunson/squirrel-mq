import { SchemaType } from "../schema";
import { API, ListParams, ApiExtensionMethods, RequestHandler, ApiExtensionRecord } from "../api";

type ClientCustomRoutes<M extends ApiExtensionMethods> = {
  [K in keyof M]: M[K] extends RequestHandler<infer _, infer Output, infer Input> ? (
    Input extends undefined ? () => Promise<Output> : (input: Input) => Promise<Output>
  ) : never;
}

export type ApiClientConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
}

export type BaseApiClient<T extends SchemaType<any>, E extends ApiExtensionRecord> = {
  models: {
    [K in keyof T]: {
      get: (id:T[K]['id']) => Promise<T[K]>;
      list: (params: ListParams<T[K]>) => Promise<T[K][]>;
      create: (data: T[K]) => Promise<T[K]>;
      update: (id: string, data: T[K]) => Promise<T[K]>;
      delete: (id: string) => Promise<T[K]>;
    }
  },
  custom: <R extends keyof E>(route: R) => ClientCustomRoutes<E[R]>
}

export type ApiSchema<T extends API> = T extends API<infer S> ? SchemaType<S> : never;
export type ApiExtensions<T extends API> = T extends API<infer S, infer E> ? ReturnType<E> : never;
export type ApiClient<T extends API> = BaseApiClient<ApiSchema<T>, ApiExtensions<T>>;