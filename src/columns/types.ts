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

type ExtractTypeRecursive<T extends string> = (
  T extends `${infer BaseType}[]` ? ExtractTypeRecursive<BaseType>[] :
  T extends `${infer TN} ${infer Rest}` ? (
    SimpleExtractType<TN> | ExtractTypeRecursive<Rest>
  ) : T extends TypeName ? SimpleExtractType<T> : never
);

export type ExtractType<T extends string> = (
  ExtractTypeRecursive<T>
) | (
  Uppercase<T> extends `${string}NOT NULL${string}` ? 
  never 
  : Uppercase<T> extends `${string}PRIMARY KEY${string}` ?
  never
  : null
);


export type ExtractName<T extends string> = T extends `${infer Name} ${infer _}` ? (
  Name
  // Field<Name, ExtractType<Rest>>
) : never;

class Field<Name extends string, Rest extends string, Type extends ExtractType<Uppercase<Rest>>> {
  constructor(public field: `${Name} ${Rest}`) {}
}

const f = new Field('users integer not null')