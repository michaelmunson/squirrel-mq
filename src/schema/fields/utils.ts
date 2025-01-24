import { FieldFunction } from "./types";

export const constructFieldFn = <V,T>(fn: FieldFunction<V,T>) => fn;