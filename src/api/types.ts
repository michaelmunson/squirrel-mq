import { PgClientParams } from "../pg";

export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type SnakeToCamelCaseObject<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K] extends object
    ? SnakeToCamelCaseObject<T[K]>
    : T[K];
};

export type FilterQuery<T extends Record<string, string> = Record<string, string>> = {
  page?: number;
  limit?: number;
} & T

export type APIConfig = {
  client?: PgClientParams;
  port?: number;
  prefix?: `/${string}`;
  pagination?: {
    defaultPage?: number;
    defaultLimit?: number;
  }
}