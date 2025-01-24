import type { ExtractFieldType, Field, FieldFunction, FieldOptions, ArgFieldFunction } from "./types"
import { constructFieldFn } from "./utils"

export const INTEGER:FieldFunction<number> = (options) => <const>({
    type: 'INTEGER',
    options
});

export const VARCHAR:ArgFieldFunction<string, number> = (value, options) => <const>({
    type: 'VARCHAR',
    value,
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

export const ENUM:FieldFunction<any, readonly string[]> = <T>(options:T) => <const>({
    type: 'ENUM',
    options
});