export type * from './schema';
declare const sqrl: {
    readonly connect: (url: string, options?: import("postgres").Options<Record<string, import("postgres").PostgresType<any>>> | undefined) => import("./connection").SqrlConnection;
    readonly inline: <T>(sql: string) => import("./schema").CustomField<T>;
    readonly INTEGER: import("./schema").FieldFunction<number>;
    readonly VARCHAR: import("./schema").ArgFieldFunction<string, number>;
    readonly SERIAL: import("./schema").FieldFunction<number>;
    readonly TEXT: import("./schema").FieldFunction<string>;
    readonly BOOLEAN: import("./schema").FieldFunction<boolean>;
    readonly TIMESTAMP: import("./schema").FieldFunction<string>;
    readonly ENUM: <T extends readonly string[]>(value: T, options: T[number]) => {
        readonly type: "ENUM";
        readonly value: T;
        readonly options: T[number];
    };
    readonly schema: <T extends import("./schema").SchemaInput>(schema: T) => T;
    readonly table: <T extends import("./schema").Table>(table: T) => T;
};
export default sqrl;
