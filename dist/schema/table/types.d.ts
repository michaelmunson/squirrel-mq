import { CustomField, type Field } from "../fields";
export type Table = Record<string, Field<any, any> | CustomField<any>>;
