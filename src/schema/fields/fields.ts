import type { Field, CustomField, FieldOptions } from "./types"

export const inline = <T>(sql:string) : CustomField<T> => ({type: '$', statement: sql})

export const INTEGER = <N extends boolean>(options?:FieldOptions<number,N>):Field<number,N> => ({
    type: 'INTEGER',
    options
});

export const VARCHAR = <N extends boolean>(value:number, options?:FieldOptions<string,N>):Field<string,N> => ({
    type: 'VARCHAR',
    argument: value,
    options
});

export const SERIAL = <N extends boolean>(options?:FieldOptions<number,N>):Field<number,N> => ({
    type: 'SERIAL',
    options
});

export const TEXT = <N extends boolean>(options?:FieldOptions<string,N>):Field<string,N> => ({
    type: 'TEXT',
    options
});

export const BOOLEAN = <N extends boolean>(options?:FieldOptions<boolean,N>):Field<boolean,N> => ({
    type: 'BOOLEAN',
    options
});

export const TIMESTAMP = <N extends boolean>(options?:FieldOptions<string,N>):Field<string,N> => ({
    type: 'TIMESTAMP',
    options
});

export const ENUM = <T extends readonly string[], N extends boolean>(value:T, options?:FieldOptions<T[number],N>) => ({
    type: 'ENUM',
    argument: value,
    options
});
