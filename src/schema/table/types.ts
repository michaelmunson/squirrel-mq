import { CustomField, type Field } from "../fields"
export type TableInput = Record<string, Field<any, any> | CustomField<any>>
export type Table<
  T extends TableInput = TableInput
> = T
