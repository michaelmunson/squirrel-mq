export type TypeMap = {
  INTEGER: number
  VARCHAR: string
  BOOLEAN: boolean
  ENUM: string
  TIMESTAMP: string
  FLOAT: number
  DATE: string
  TIME: string
  DATETIME: string
  SERIAL: number
  TEXT: string
}

export type Type = keyof TypeMap

export type FieldOptions<T, Nullable extends boolean = true> = {
  default?: T
  nullable?: Nullable
  unique?: boolean
  primaryKey?: boolean
  references?: `${string}(${string})`,
  withTimezone?: boolean,
  generatedAlwaysAsIdentity?: boolean,
  generatedByDefaultAsIdentity?: boolean,

}

export type Field<T, Nullable extends boolean = true> = {
  type: Type
  argument?: any
  options?: FieldOptions<T, Nullable>
}

export type CustomField<T=any> = {
  type: '$'
  value?: T
  statement: string
}

export type ExtractFieldType<F extends Field<any,any> | CustomField<any>> = (
  F extends Field<infer T, infer N> ? (
    T | (N extends true ? null : never)
  ) : (
    F extends CustomField<infer T> ? T : never
  )
)

export type ExtractFieldArgument<F extends Field<any,any>> = F extends Field<infer _, infer A> ? A : never;

