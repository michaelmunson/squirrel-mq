"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const sql = (template, ...args) => {
    return template.map((t, i) => t + (args[i] ?? '')).join('');
};
exports.sql = sql;
