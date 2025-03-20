import { ExtractType } from "./types";

export class Column<Name extends string, Rest extends string> {
  constructor(public readonly definition: `${Name} ${Rest}`) {}
  default(value:ExtractType<Rest>){
    return this
  }
}

export const col = <T extends `${string} ${string}`>(def: T) : (
  T extends `${infer Name} ${infer Rest}` ? Column<Name, Rest> : never
) => new Column(def) as any;
