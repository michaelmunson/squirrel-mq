import { Client } from "pg";
import { SchemaInput } from "../schema";
export type SqrlConnection = Client & ReturnType<typeof createExtension>;
declare const createExtension: (client: Client) => {
    readonly initialize: (schema: SchemaInput) => Promise<import("pg").QueryResult<any>[]>;
};
export declare const connect: (config?: string | import("pg").ClientConfig | undefined) => SqrlConnection;
export {};
