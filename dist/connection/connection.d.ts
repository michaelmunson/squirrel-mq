import { SchemaInput } from "../schema";
export declare const initializeSchema: (schema: SchemaInput, config?: string | import("pg").ClientConfig | undefined) => Promise<import("pg").QueryResult<any>[]>;
