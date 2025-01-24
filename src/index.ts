import { createSchema, createTable } from './schema';
import * as fields from './schema/fields/fields';
export type * from './schema';
import { connect } from './connection';

const sqrl = <const>{
  schema: createSchema,
  table: createTable,
  ...fields,
  connect,
}

export default sqrl;