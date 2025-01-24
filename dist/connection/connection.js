"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const postgres_1 = __importDefault(require("postgres"));
const codegen_1 = require("../codegen");
const createExtension = (sql) => ({
    initialize: async (schema) => {
        const schemaString = (0, codegen_1.constructSqlSchema)(schema);
        if (process.env.DEBUG === 'true') {
            console.log(schemaString);
        }
        return await sql `${schemaString}`;
    },
});
const connect = (...params) => {
    const sql = (0, postgres_1.default)(...params);
    const extension = createExtension(sql);
    Object.assign(sql, extension);
    return sql;
};
exports.connect = connect;
