import { PgClientParams } from "../../pg";
import { API } from "../api";
export * from "./extensions";

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'] as const;

export type HTTPMethod = typeof HTTP_METHODS[number];

export type AllQuery = {
  page?: number;
  limit?: number;
  filter?: string;
}

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like' | 'ilike';

export type Filter<T> = (
  {eq: T} |
  {ne: T} |
  {gt: T} |
  {gte: T} |
  {lt: T} |
  {lte: T} |
  {in: T[]} |
  {like: T} |
  {ilike: T}
)

export type FilterParams<T> = Partial<{
  [K in keyof T]: Filter<T[K]>
}> | {
  AND?: FilterParams<T>[];
} | {
  OR?: FilterParams<T>[];
} | {
  NOT?: FilterParams<T>;
}

export type ListParams<T> = {
  page?: number;
  limit?: number;
  filter?: FilterParams<T>;
}

export type APIConfig = {
  client?: PgClientParams;
  /**
   * @description The port to run the API on
   */
  port?: number;
  /**
   * @description The prefix to use for the API
   * @example '/api'
   * @default '/api'
  */
  prefix?: `/${string}`;
  /**
   * @description The case conversion to use for the API
   * @example { in: 'snake', out: 'camel' }
   */
  caseConversion?: {
    in: 'snake' | 'camel';
    out: 'snake' | 'camel';
  }
  /**
   * @description The pagination to use for the API
   * @example { defaultPage: 1, defaultLimit: 10 }
   */
  pagination?: {
    defaultPage?: number;
    defaultLimit?: number;
  }
  /**
   * @description The header to use for the API
   * @example 'Authorization'
   * @default 'Authorization'
   */
  tokenHeader?: string;
}

export type APISchema<T extends API> = T extends API<infer S> ? S : never;

export type APIRoute<T extends API> = T extends API<infer S, infer E> ? (
  keyof S extends string ? (keyof S | keyof ReturnType<E> | `${keyof S}/:id`) : never
) : never

export type APIRoutes<T extends API> = APIRoute<T>[]

export type APIRouteMethods<T extends API> = T extends API<infer S, infer E> ? (
  keyof S extends string ? {
    [key in (keyof S | keyof ReturnType<E> | `${keyof S}/:id`)]: {
      GET: (keyof (S[keyof S]))[];
      POST: keyof (S[keyof S]);
      PUT: keyof (S[keyof S]);
      PATCH: keyof (S[keyof S]);
      DELETE: keyof (S[keyof S]);
    }
  } : never
) : never;
