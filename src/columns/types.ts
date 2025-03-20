import { sql } from "../../src.old";

type BuiltInTypes = {
  INTEGER: number;
  VARCHAR: string;
  BOOLEAN: boolean;
  ENUM: string;
  TIMESTAMP: string;
  FLOAT: number;
  DATE: string;
  TIME: string;
  DATETIME: string;
  SERIAL: number;
  TEXT: string;
  UUID: string;
  JSONB: Record<any, any>;
};

type TypeName = keyof BuiltInTypes;

type SimpleExtractType<T extends string> = Uppercase<T> extends TypeName ? BuiltInTypes[Uppercase<T>] : never;

type ExtractBaseType<T extends string> = (
  T extends `${infer TN} ${infer Rest}` ? (
    SimpleExtractType<TN> | ExtractBaseType<Rest>
  ) : T extends TypeName ? SimpleExtractType<T> : never
) | (
  T extends `${infer TN}(${infer Rest}` ? (
    ExtractBaseType<TN>
  ) : never
);

type ExtractNullableModifier<T extends string> = (
  Uppercase<T> extends `${infer BaseType}NOT NULL${infer Rest}` ? 
  never
  : Uppercase<T> extends `${infer BaseType}PRIMARY KEY${infer Rest}` ?
  never
  : null
)

type ExtractCompleteType<T extends string> = (
  T extends `${infer Type}[]${infer Rest}`
  ? ExtractBaseType<Type>[]
  :  ExtractBaseType<T>
) | ExtractNullableModifier<T>


export type ExtractType<T extends string> = ExtractCompleteType<Uppercase<T>>


export type ExtractName<T extends string> = T extends `${infer Name} ${infer _}` ? (
  Name
  // Field<Name, ExtractType<Rest>>
) : never;

class Column<Name extends string, Rest extends string, Type extends ExtractType<Rest> = ExtractType<Rest>> {
  constructor(public field: `${Name} ${Rest}`) {}
  default(value:Type){
    return this
  }
}

const table = <T extends [...string[]]>(...columns: T) : {
  [K in keyof T]: T[K] extends `${infer Name} ${infer Rest}` ? Column<Name, Rest> : never
} => [] as any;


const t = table(
  sql`users text[]`,
  sql`id integer`,
  sql`name varchar(255)`,
  sql`email varchar(255)`,
  sql`password varchar(255)`,
  sql`created_at timestamp`,
  sql`updated_at timestamp`,
)
