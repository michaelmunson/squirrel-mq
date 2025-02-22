import { SchemaType } from "../schema";
import { ListParams } from "../api/types";

export type ClientConfig<CamelCase extends boolean = true> = {
  
}

export type Client<T extends SchemaType<any>> = {
  [K in keyof T]: {
    get: (id: string) => Promise<T[K]>;
    list: (params: ListParams<T[K]>) => Promise<T[K][]>;
    create: (data: T[K]) => Promise<T[K]>;
    update: (id: string, data: T[K]) => Promise<T[K]>;
    delete: (id: string) => Promise<T[K]>;
  }
};
