import { C as CustomField, F as FieldOptions, b as Field } from '../../types-W554HBlq.cjs';
export { D as DefaultOptions, c as ExtractFieldArgument, E as ExtractFieldType, a as Type, T as TypeMap } from '../../types-W554HBlq.cjs';

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
declare const UUID: <N extends boolean, A extends boolean = false>(options?: FieldOptions<string, N, A>) => Field<string, N, A>;
/**
 * @description
 * - Integer
 */
declare const INTEGER: <N extends boolean, A extends boolean = false>(options?: FieldOptions<number, N, A>) => Field<number, N, A>;
/**
 * @description
 * - VARCHAR
 */
declare const VARCHAR: <N extends boolean, A extends boolean = false>(value: number, options?: FieldOptions<string, N, A>) => Field<string, N, A>;
/**
 * @description
 * - SERIAL
 */
declare const SERIAL: <N extends boolean, A extends boolean = false>(options?: FieldOptions<number, N, A>) => Field<number, N, A>;
/**
 * @description
 * - TEXT
 */
declare const TEXT: <N extends boolean, A extends boolean = false>(options?: FieldOptions<string, N, A>) => Field<string, N, A>;
/**
 * @description
 * - BOOLEAN
 */
declare const BOOLEAN: <N extends boolean, A extends boolean = false>(options?: FieldOptions<boolean, N, A>) => Field<boolean, N, A>;
/**
 * @description
 * - TIMESTAMP
 */
declare const TIMESTAMP: <N extends boolean, A extends boolean = false>(options?: FieldOptions<string, N, A>) => Field<string, N, A>;
/**
 * @description
 * - ENUM
 */
declare const ENUM: <T extends readonly string[], N extends boolean = false>(value: T, options?: FieldOptions<T[number], N>) => {
    type: string;
    argument: T;
    options: FieldOptions<T[number], N> | undefined;
};
/**
 * @description
 * - JSONB
 */
declare const JSONB: <T extends Record<any, any>, N extends boolean = false>(options?: FieldOptions<T, N, false>) => Field<T, N, false>;

export { BOOLEAN, CustomField, ENUM, Field, FieldOptions, INTEGER, JSONB, PK_AUTO_INT, PK_AUTO_UUID, SERIAL, SQL, TEXT, TIMESTAMP, UUID, VARCHAR };
