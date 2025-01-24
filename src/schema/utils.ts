import { type SchemaInput } from "./types";

export const createSchema = <T extends SchemaInput>(schema: T) => <const>{...schema};