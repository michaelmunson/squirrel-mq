import { PgClientParams } from "../../pg";
import { API } from "../api";

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

