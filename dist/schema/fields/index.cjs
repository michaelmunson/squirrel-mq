"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/schema/fields/index.ts
var fields_exports = {};
__export(fields_exports, {
  BOOLEAN: () => BOOLEAN,
  ENUM: () => ENUM,
  INTEGER: () => INTEGER,
  PK_AUTO_INT: () => PK_AUTO_INT,
  PK_AUTO_UUID: () => PK_AUTO_UUID,
  SERIAL: () => SERIAL,
  SQL: () => SQL,
  TEXT: () => TEXT,
  TIMESTAMP: () => TIMESTAMP,
  UUID: () => UUID,
  VARCHAR: () => VARCHAR
});
module.exports = __toCommonJS(fields_exports);

// src/schema/fields/fields.ts
var SQL = (sql) => ({ type: "$", statement: sql });
var PK_AUTO_INT = (options) => ({
  type: "INTEGER",
  options: {
    ...options,
    generatedAlwaysAsIdentity: true,
    primaryKey: true
  }
});
var PK_AUTO_UUID = (options) => ({
  type: "UUID",
  options: {
    ...options,
    primaryKey: true,
    default: "gen_random_uuid()"
  }
});
var UUID = (options) => ({
  type: "UUID",
  options
});
var INTEGER = (options) => ({
  type: "INTEGER",
  options
});
var VARCHAR = (value, options) => ({
  type: "VARCHAR",
  argument: value,
  options
});
var SERIAL = (options) => ({
  type: "SERIAL",
  options
});
var TEXT = (options) => ({
  type: "TEXT",
  options
});
var BOOLEAN = (options) => ({
  type: "BOOLEAN",
  options
});
var TIMESTAMP = (options) => ({
  type: "TIMESTAMP",
  options
});
var ENUM = (value, options) => ({
  type: "ENUM",
  argument: value,
  options
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BOOLEAN,
  ENUM,
  INTEGER,
  PK_AUTO_INT,
  PK_AUTO_UUID,
  SERIAL,
  SQL,
  TEXT,
  TIMESTAMP,
  UUID,
  VARCHAR
});
//# sourceMappingURL=index.cjs.map