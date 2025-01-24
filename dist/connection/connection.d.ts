import postgres, { Sql } from "postgres";
import { SchemaInput } from "../schema";
export type SqrlConnection = Sql & ReturnType<typeof createExtension>;
declare const createExtension: (sql: Sql) => {
    readonly initialize: (schema: SchemaInput) => Promise<postgres.RowList<postgres.Row[]>>;
};
export declare const connect: (url: string, options?: postgres.Options<Record<string, postgres.PostgresType<any>>> | undefined) => SqrlConnection;
export {};
