import { col, Column } from "../column";

export class Table<Name extends string, Columns extends Column<any,any>[]> {
  constructor(public readonly name: Name, public readonly columns: Columns) {}
}

export const table = <Name extends string>(name: Name) => (
  <T extends Column<any,any>[]>(...columns: T) : Table<Name, T> => new Table(name, columns) as any
)

const t = table('users')(
  col('id integer'),
  col('name varchar(255)'),
  col('email varchar(255)'),
  col('created_at timestamp'),
  col('updated_at timestamp')
)

// const table = <Name extends string, T extends Column<any,any>[]>(name: Name, columns: T) : (
//   Table<Name, T>
// ) => ({}) as any

// const t = table('users',[
//   col('id integer'),
//   col('name varchar(255)'),
//   col('email varchar(255)'),
//   col('created_at timestamp'),
//   col('updated_at timestamp')
// ])
