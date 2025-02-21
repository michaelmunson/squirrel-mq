import { PgClientParams } from "../client";

export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type SnakeToCamelCaseObject<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K] extends object
    ? SnakeToCamelCaseObject<T[K]>
    : T[K];
};

export type APIConfig = {
  client?: PgClientParams;
  port?: number;
  prefix?: `/${string}`;
}