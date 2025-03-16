import { PgClientParams } from "../pg";

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
  port?: number;
  prefix?: `/${string}`;
  caseConversion?: {
    in: 'snake' | 'camel';
    out: 'snake' | 'camel';
  }
  pagination?: {
    defaultPage?: number;
    defaultLimit?: number;
  }
  tokenHeader?: string;
}
