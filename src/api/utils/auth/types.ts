import { SchemaInput } from "../../../schema/types";

export type AuthConfig<Schema extends SchemaInput = SchemaInput> = {
  tokenHeader:string;
  rules: {}
}
