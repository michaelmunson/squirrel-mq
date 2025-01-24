import { type Table } from "./types"

export const createTable = <T extends Table>(table: T) => <const>{...table};

