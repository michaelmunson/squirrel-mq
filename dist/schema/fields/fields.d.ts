import type { FieldFunction, ArgFieldFunction, CustomField } from "./types";
export declare const INTEGER: FieldFunction<number>;
export declare const VARCHAR: ArgFieldFunction<string, number>;
export declare const SERIAL: FieldFunction<number>;
export declare const TEXT: FieldFunction<string>;
export declare const BOOLEAN: FieldFunction<boolean>;
export declare const TIMESTAMP: FieldFunction<string>;
export declare const ENUM: <T extends readonly string[]>(value: T, options: T[number]) => {
    readonly type: "ENUM";
    readonly value: T;
    readonly options: T[number];
};
export declare const $: <T>(sql: string) => CustomField<T>;
