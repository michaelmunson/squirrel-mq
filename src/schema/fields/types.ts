export type Type = (
  'INTEGER' |
  'VARCHAR' |
  'BOOLEAN' |
  'ENUM' |
  'TIMESTAMP' |
  'FLOAT' |
  'DATE' |
  'TIME' |
  'DATETIME'
)

export type FieldOptions<T = any> = {custom?:string} | {
  default?: T
  nullable?: boolean
  unique?: boolean
  primaryKey?: boolean
  foreignKey?: string,
  serial?: boolean
}

export type Field<V = any, T = any> = {
  type: Type
  value?: V
  options?: FieldOptions<T>
}