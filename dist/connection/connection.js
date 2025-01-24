"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const pg_1 = require("pg");
const codegen_1 = require("../codegen");
const createExtension = (client) => ({
    initialize: async (schema) => {
        const schemaStrings = (0, codegen_1.constructSqlSchema)(schema);
        if (process.env.DEBUG === 'true') {
            console.log(schemaStrings);
        }
        const results = [];
        for (const statement of schemaStrings) {
            const result = await client.query(statement);
            results.push(result);
        }
        return results;
    },
});
const connect = (...params) => {
    const client = new pg_1.Client(...params);
    const extension = createExtension(client);
    Object.assign(client, extension);
    client.connect();
    return client;
};
exports.connect = connect;
