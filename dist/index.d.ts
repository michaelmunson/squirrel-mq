export type * from './schema';
export * from './connection';
declare const sqrl: {
    readonly inline: <T>(sql: string) => import("./schema").CustomField<T>;
    readonly INTEGER: <N extends boolean>(options?: import("./schema").FieldOptions<number, N>) => import("./schema").Field<number, N>;
    readonly VARCHAR: <N extends boolean>(value: number, options?: import("./schema").FieldOptions<string, N>) => import("./schema").Field<string, N>;
    readonly SERIAL: <N extends boolean>(options?: import("./schema").FieldOptions<number, N>) => import("./schema").Field<number, N>;
    readonly TEXT: <N extends boolean>(options?: import("./schema").FieldOptions<string, N>) => import("./schema").Field<string, N>;
    readonly BOOLEAN: <N extends boolean>(options?: import("./schema").FieldOptions<boolean, N>) => import("./schema").Field<boolean, N>;
    readonly TIMESTAMP: <N extends boolean>(options?: import("./schema").FieldOptions<string, N>) => import("./schema").Field<string, N>;
    readonly ENUM: <T extends readonly string[], N extends boolean>(value: T, options?: import("./schema").FieldOptions<T[number], N>) => {
        type: string;
        argument: T;
        options: import("./schema").FieldOptions<T[number], N> | undefined;
    };
    readonly schema: <T extends import("./schema").SchemaInput>(schema: T) => T;
    readonly table: <T extends import("./schema").Table>(table: T) => T;
};
export default sqrl;
