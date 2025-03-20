import { Table, table } from "./table";
import { col, Column } from "./column";
export class Schema<Tables extends Table<any,any>[]> {
  constructor(public readonly tables: Tables) {}
}

const schema = <T extends Table<any,any>[]>(...tables: T) : Schema<T> => new Schema(tables) as any

const s = schema(
  table('users')(
    col('id integer'),
    col('name varchar(255)'),
  ),
  table('posts')(
    col('id integer'),
    col('title varchar(255)'),
    col('body text'),
    col('user_id integer'),
  )
);

type TableType<T extends Table<any,any>> = T extends Table<infer Name, infer Columns> ? (
  {
    [K in keyof Columns]: Columns[K] extends Column<infer Name, infer Rest> ? Column<Name, Rest> : never
  }
) : never;

type SchemaType<S extends Schema<any>> = S extends Schema<infer T> ? (
  {
    [K in keyof T]: T[K] extends Table<infer Name, infer Columns> ? TableType<T[K]> : never
  }
) : never;

type S = SchemaType<typeof s>;

const s2 = new Schema(s.tables);

