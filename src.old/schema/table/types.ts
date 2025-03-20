import { FieldSchema } from "../../pg/types";
import { CustomField, type Field } from "../fields"
export type TableInput = Record<string, Field<any, any, any> | CustomField<any>>
export type Table<
  T extends TableInput = TableInput
> = T

export class TableMap extends Map<string, Field<any, any, any>> {
  constructor(tableMap: TableMap) {
    super(tableMap);
  }
}

export class PostgresTableMap extends Map<string, FieldSchema> {
  constructor(tableMap:PostgresTableMap){
    super(tableMap)
  }
}