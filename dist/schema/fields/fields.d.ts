import type { Field, CustomField, FieldOptions } from "./types";
export declare const inline: <T>(sql: string) => CustomField<T>;
export declare const INTEGER: <N extends boolean>(options?: FieldOptions<number, N>) => Field<number, N>;
export declare const VARCHAR: <N extends boolean>(value: number, options?: FieldOptions<string, N>) => Field<string, N>;
export declare const SERIAL: <N extends boolean>(options?: FieldOptions<number, N>) => Field<number, N>;
export declare const TEXT: <N extends boolean>(options?: FieldOptions<string, N>) => Field<string, N>;
export declare const BOOLEAN: <N extends boolean>(options?: FieldOptions<boolean, N>) => Field<boolean, N>;
export declare const TIMESTAMP: <N extends boolean>(options?: FieldOptions<string, N>) => Field<string, N>;
export declare const ENUM: <T extends readonly string[], N extends boolean>(value: T, options?: FieldOptions<T[number], N>) => {
    type: string;
    argument: T;
    options: FieldOptions<T[number], N> | undefined;
};
