export {}; 
/* import { INTEGER } from "./fields";
import { DEFAULT } from "./fields/options";
import { Table } from "./table";
import { SchemaType } from "./types";

class Schema<T extends Record<string, Table>> {
  constructor(readonly definition: T) {
    this.definition = definition;
  }
}

type SchemaDefinition<S> = S extends Schema<infer T> ? T : never;

const createSchema = <T extends Record<string, any>>(definition: T) => new Schema(definition);

const schema = createSchema({
  users: {
    id: INTEGER({
      primaryKey: true,
      nullable: false,
      default: 0
    })
  }
});

type S = SchemaType<SchemaDefinition<typeof schema>>;

 */