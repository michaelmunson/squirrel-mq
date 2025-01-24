export type TypeMap = {
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
};
export type Type = keyof TypeMap;
export type FieldOptions<T = any> = {
    default?: T;
    nullable?: boolean;
    unique?: boolean;
    primaryKey?: boolean;
    references?: `${string}(${string})`;
    serial?: boolean;
    withTimezone?: boolean;
};
export type Field<T = any, A extends any = never> = {
    type: Type;
    argument?: A;
    options?: FieldOptions<T>;
};
export type CustomField<T = any> = {
    type: '$';
    value?: T;
    statement: string;
};
export type FieldFunction<T = any, A = any> = (options?: FieldOptions<T>) => Field<T, A>;
export type ArgFieldFunction<T = any, A = any> = (value: A, options?: FieldOptions<T>) => Field<T, A>;
export type ExtractFieldType<F extends Field<any, any> | CustomField<any>> = F extends Field<infer T, infer _> ? T : F extends CustomField<infer T> ? T : never;
export type ExtractFieldArgument<F extends Field<any, any>> = F extends Field<infer _, infer A> ? A : never;
