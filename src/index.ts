import { createSchema, createTable } from './schema';
import * as fields from './schema/fields/fields';
export type * from './schema';
export * from './connection';

const sqrl = <const>{
  schema: createSchema,
  table: createTable,
  ...fields,
}

export default sqrl;