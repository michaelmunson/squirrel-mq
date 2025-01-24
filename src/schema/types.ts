export type * from './fields'
export type * from './table'
import { type Table } from "./table";

export type Schema = Record<string, Table>

