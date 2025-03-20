import { Field, PK_AUTO_UUID, VARCHAR } from "../fields";

type Table = Record<string, Field<any, any, any>>

const createTable = <T extends Table>(table:T) : T extends {
  [K in keyof T]: T[K] extends Field<infer FieldType, infer Nullable, infer Array> ? Field<FieldType, Nullable, Array> : never
} ? T : never => table as any

const table = createTable({
  name: VARCHAR(255, {nullable: false}),
});

const name = VARCHAR(255, {nullable: false});

