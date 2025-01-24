import type { Field, FieldOptions } from "./types"

export const int = (options: FieldOptions = {}) : Field<number> => ({
    type: 'INTEGER',
    options
})

export const varchar = (num: number, options: FieldOptions<string> = {}) : Field<string> => ({
    type: 'VARCHAR',
    value: num,
    options
  })

export const bool = (options: FieldOptions<boolean> = {}) : Field<boolean> => ({
    type: 'BOOLEAN',
    options
  })