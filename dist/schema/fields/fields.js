"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENUM = exports.TIMESTAMP = exports.BOOLEAN = exports.TEXT = exports.SERIAL = exports.VARCHAR = exports.INTEGER = exports.inline = void 0;
const inline = (sql) => ({ type: '$', statement: sql });
exports.inline = inline;
const INTEGER = (options) => ({
    type: 'INTEGER',
    options
});
exports.INTEGER = INTEGER;
const VARCHAR = (value, options) => ({
    type: 'VARCHAR',
    argument: value,
    options
});
exports.VARCHAR = VARCHAR;
const SERIAL = (options) => ({
    type: 'SERIAL',
    options
});
exports.SERIAL = SERIAL;
const TEXT = (options) => ({
    type: 'TEXT',
    options
});
exports.TEXT = TEXT;
const BOOLEAN = (options) => ({
    type: 'BOOLEAN',
    options
});
exports.BOOLEAN = BOOLEAN;
const TIMESTAMP = (options) => ({
    type: 'TIMESTAMP',
    options
});
exports.TIMESTAMP = TIMESTAMP;
const ENUM = (value, options) => ({
    type: 'ENUM',
    argument: value,
    options
});
exports.ENUM = ENUM;
