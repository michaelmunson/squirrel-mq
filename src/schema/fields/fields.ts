import type { Field, CustomField, FieldOptions } from "./types";

export const SQL = <T>(sql:string) : CustomField<T> => ({type: '$', statement: sql})

/**
 * @description
 * - Auto-incrementing integer primary key
 */
export const PK_AUTO_INT = (options?:FieldOptions<number,false>):Field<number,false> => ({
    type: 'INTEGER',
    options: {
        ...options,
        generatedAlwaysAsIdentity: true,
        primaryKey: true,
    }
});

/**
 * @description
 * - Auto-incrementing UUID primary key
 */
export const PK_AUTO_UUID = (options?:FieldOptions<string,false>):Field<string,false> => ({
    type: 'UUID',
    options: {
        ...options,
        primaryKey: true,
        default: 'gen_random_uuid()',
    }
});

/**
 * @description
 * - UUID
 */
export const UUID = <N extends boolean, A extends boolean>(options?:FieldOptions<string,N,A>):Field<string,N,A> => ({
    type: 'UUID',
    options
});

/**
 * @description
 * - Integer
 */
export const INTEGER = <N extends boolean, A extends boolean>(options?:FieldOptions<number,N,A>):Field<number,N,A> => <const>({
    type: 'INTEGER',
    options
});

/**
 * @description
 * - VARCHAR
 */
export const VARCHAR = <N extends boolean, A extends boolean>(value:number, options?:FieldOptions<string,N,A>):Field<string,N,A> => ({
    type: 'VARCHAR',
    argument: value,
    options
});

/**
 * @description
 * - SERIAL
 */
export const SERIAL = <N extends boolean, A extends boolean>(options?:FieldOptions<number,N,A>):Field<number,N,A> => ({
    type: 'SERIAL',
    options
});

/**
 * @description
 * - TEXT
 */
export const TEXT = <N extends boolean, A extends boolean>(options?:FieldOptions<string,N,A>):Field<string,N,A> => ({
    type: 'TEXT',
    options
});

/**
 * @description
 * - BOOLEAN
 */
export const BOOLEAN = <N extends boolean, A extends boolean>(options?:FieldOptions<boolean,N,A>):Field<boolean,N,A> => ({
    type: 'BOOLEAN',
    options
});

/**
 * @description
 * - TIMESTAMP
 */
export const TIMESTAMP = <N extends boolean, A extends boolean>(options?:FieldOptions<string,N,A>):Field<string,N,A> => ({
    type: 'TIMESTAMP',
    options
});

/**
 * @description
 * - ENUM
 */
export const ENUM = <T extends readonly string[], N extends boolean>(value:T, options?:FieldOptions<T[number],N>) => ({
    type: 'ENUM',
    argument: value,
    options
});
