import { type Schema } from "./types";

export const createSchema = <T extends Schema>(schema: T) => <const>{...schema};