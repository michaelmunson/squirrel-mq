type TypeMap = {
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
type Type = keyof TypeMap;
type FieldOptions<T, Nullable extends boolean = true, IsArray extends boolean = false> = {
    default?: T;
    nullable?: Nullable;
    unique?: boolean;
    primaryKey?: boolean;
    references?: `${string}(${string})`;
    withTimezone?: boolean;
    generatedAlwaysAsIdentity?: boolean;
    generatedByDefaultAsIdentity?: boolean;
    array?: IsArray;
};
type Field<T, Nullable extends boolean = true, IsArray extends boolean = false> = {
    type: Type;
    argument?: any;
    options?: FieldOptions<T, Nullable, IsArray>;
};
type CustomField<T = any> = {
    type: '$';
    value?: T;
    statement: string;
};
type ExtractFieldType<F extends Field<any, any, any> | CustomField<any>> = (F extends Field<infer T, infer N, infer A> ? ((A extends true ? T[] : T) | (N extends true ? null : never)) : (F extends CustomField<infer T> ? T : never));
type ExtractFieldArgument<F extends Field<any, any, any>> = F extends Field<infer _, infer A, infer _> ? A : never;
type DefaultOptions = {
    'CURRENT_TIMESTAMP': string;
    'gen_random_uuid()': string;
};

export type { CustomField as C, DefaultOptions as D, ExtractFieldType as E, FieldOptions as F, TypeMap as T, Type as a, Field as b, ExtractFieldArgument as c };
