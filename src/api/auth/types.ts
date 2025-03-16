import { SchemaInput } from "../../schema/types";

type AuthRuleAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
type AuthRuleAllow<T> = boolean | ((keyof T)[]);

export type PreAuthRules<Schema extends SchemaInput = SchemaInput> = Partial<{
  [K in keyof Schema]: Partial<Record<AuthRuleAction, AuthRuleAllow<Schema[K]>>>
}>

export type PreAuthFunction<Schema extends SchemaInput = SchemaInput> = (token: string) => PreAuthRules<Schema>;