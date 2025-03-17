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
export {
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
};
//# sourceMappingURL=index.js.map