import type { FieldFunction, ArgFieldFunction, Field, CustomField } from "./types"

export const INTEGER:FieldFunction<number> = (options) => <const>({
    type: 'INTEGER',
    options
});

export const VARCHAR:ArgFieldFunction<string, number> = (value, options) => <const>({
    type: 'VARCHAR',
    argument: value,
    options
});

export const SERIAL:FieldFunction<number> = (options) => <const>({
    type: 'SERIAL',
    options
});

export const TEXT:FieldFunction<string> = (options) => <const>({
    type: 'TEXT',
    options
});

export const BOOLEAN:FieldFunction<boolean> = (options) => <const>({
    type: 'BOOLEAN',
    options
});

export const TIMESTAMP:FieldFunction<string> = (options) => <const>({
    type: 'TIMESTAMP',
    options
});

export const ENUM = <T extends readonly string[]>(value:T, options:T[number]) => <const>({
    type: 'ENUM',
    value,
    options
});

export const $ = <T>(sql:string) : CustomField<T> => ({type: '$', statement: sql})