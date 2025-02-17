"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSchema = void 0;
const pg_1 = require("pg");
const codegen_1 = require("../codegen");
const initializeSchema = async (schema, ...params) => {
    const client = new pg_1.Client(...params);
    await client.connect();
    const schemaStrings = (0, codegen_1.constructSqlSchema)(schema);
    if (process.env.DEBUG === 'true') {
        console.log(schemaStrings);
    }
    const results = [];
    for (const statement of schemaStrings) {
        const result = await client.query(statement);
        results.push(result);
    }
    await client.end();
    return results;
};
exports.initializeSchema = initializeSchema;
