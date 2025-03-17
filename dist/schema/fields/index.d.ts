import { C as CustomField, F as FieldOptions, b as Field } from '../../types-D26UMB4E.js';
export { D as DefaultOptions, c as ExtractFieldArgument, E as ExtractFieldType, a as Type, T as TypeMap } from '../../types-D26UMB4E.js';

declare const defaults: {};
declare const SQL: <T>(sql: string) => CustomField<T>;
/**
 * @description
 * - Auto-incrementing integer primary key
 */
declare const PK_AUTO_INT: (options?: FieldOptions<number, false>) => Field<number, false>;
/**
 * @description
 * - Auto-incrementing UUID primary key
 */
declare const PK_AUTO_UUID: (options?: FieldOptions<string, false>) => Field<string, false>;
/**
 * @description
 * - UUID
 */
declare const UUID: <N extends boolean>(options?: FieldOptions<string, N>) => Field<string, N>;
/**
 * @description
 * - Integer
 */
declare const INTEGER: <N extends boolean>(options?: FieldOptions<number, N>) => Field<number, N>;
/**
 * @description
 * - VARCHAR
 */
declare const VARCHAR: <N extends boolean>(value: number, options?: FieldOptions<string, N>) => Field<string, N>;
/**
 * @description
 * - SERIAL
 */
declare const SERIAL: (options?: FieldOptions<number, false>) => Field<number, false>;
/**
 * @description
 * - TEXT
 */
declare const TEXT: <N extends boolean>(options?: FieldOptions<string, N>) => Field<string, N>;
/**
 * @description
 * - BOOLEAN
 */
declare const BOOLEAN: <N extends boolean>(options?: FieldOptions<boolean, N>) => Field<boolean, N>;
/**
 * @description
 * - TIMESTAMP
 */
declare const TIMESTAMP: <N extends boolean>(options?: FieldOptions<string, N>) => Field<string, N>;
/**
 * @description
 * - ENUM
 */
declare const ENUM: <T extends readonly string[], N extends boolean>(value: T, options?: FieldOptions<T[number], N>) => {
    type: string;
    argument: T;
    options: FieldOptions<T[number], N> | undefined;
};

export { BOOLEAN, CustomField, ENUM, Field, FieldOptions, INTEGER, PK_AUTO_INT, PK_AUTO_UUID, SERIAL, SQL, TEXT, TIMESTAMP, UUID, VARCHAR, defaults };
