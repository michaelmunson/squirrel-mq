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

export type FieldOptions<T = any> = {custom?:string} | {
  default?: T
  nullable?: boolean
  unique?: boolean
  primaryKey?: boolean
  foreignKey?: string,
  serial?: boolean
}

export type Field<T=any, A extends any=never> = {
  type: Type
  value?: A
  options?: FieldOptions<T>
}

export type FieldFunction<T = any, A = never> = (options: FieldOptions<T>) => Field<T,A>
export type ArgFieldFunction<T = any, A = never> = (value: A, options: FieldOptions<T>) => Field<T,A>

export type ExtractFieldType<F extends Field<any,any>> = F extends Field<infer T> ? T : never;
export type ExtractFieldArgument<F extends Field<any,any>> = F extends Field<infer _, infer A> ? A : never;