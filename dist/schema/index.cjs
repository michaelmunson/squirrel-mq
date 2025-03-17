"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  BOOLEAN: () => BOOLEAN,
  ENUM: () => ENUM,
  INTEGER: () => INTEGER,
  PK_AUTO_INT: () => PK_AUTO_INT,
  PK_AUTO_UUID: () => PK_AUTO_UUID,
  PostgresTableMap: () => PostgresTableMap,
  SERIAL: () => SERIAL,
  SQL: () => SQL,
  TEXT: () => TEXT,
  TIMESTAMP: () => TIMESTAMP,
  TableMap: () => TableMap,
  UUID: () => UUID,
  VARCHAR: () => VARCHAR,
  deploySchema: () => deploySchema,
  generateSchemaSql: () => generateSchemaSql,
  initializeSchema: () => initializeSchema
});
module.exports = __toCommonJS(schema_exports);

// src/schema/fields/fields.ts
var SQL = (sql2) => ({ type: "$", statement: sql2 });
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

// src/schema/table/types.ts
var TableMap = class extends Map {
  constructor(tableMap) {
    super(tableMap);
  }
};
var PostgresTableMap = class extends Map {
  constructor(tableMap) {
    super(tableMap);
  }
};

// src/pg/index.ts
var dotenv2 = __toESM(require("dotenv"), 1);

// src/pg/pg.ts
var import_pg = __toESM(require("pg"), 1);
var PgClient = import_pg.default.Client;

// src/utils/utils.ts
var sql = (template, ...args) => {
  return template.map((t, i) => t + (args[i] ?? "")).join("");
};

// src/pg/sqrl.ts
var dotenv = __toESM(require("dotenv"), 1);
dotenv.config();
var SqrlClientError = class extends Error {
  constructor(message) {
    super(message);
  }
};
var SqrlPgClient = class extends PgClient {
  connected = false;
  constructor(params) {
    super(params);
  }
  async connect() {
    const result = await super.connect();
    this.connected = true;
    return result;
  }
  async listTables() {
    if (!this.connected) throw new SqrlClientError("Client not connected");
    const result = await this.query(sql`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
    `);
    return result.rows.map((row) => row.table_name);
  }
  async getSchema() {
    if (!this.connected) throw new SqrlClientError("Client not connected");
    const tables = await this.listTables();
    const schemaObject = /* @__PURE__ */ new Map();
    for (const table of tables) {
      const result = await this.query(sql`
        SELECT * FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = '${table}';
      `);
      if (result.rows.length !== 0) {
        const tableMap = /* @__PURE__ */ new Map();
        result.rows.forEach((row) => {
          tableMap.set(row.column_name, row);
        });
        schemaObject.set(table, tableMap);
      }
    }
    return schemaObject;
  }
};

// src/pg/index.ts
dotenv2.config();

// src/schema/codegen/utils.ts
var fieldOptionsToSql = (options) => {
  let statement = [];
  statement.push(options.withTimezone ? "WITH TIME ZONE" : "");
  statement.push(options.nullable === false ? "NOT NULL" : "NULL");
  statement.push(options.unique ? "UNIQUE" : "");
  statement.push(options.default ? `DEFAULT ${options.default}` : "");
  statement.push(options.generatedAlwaysAsIdentity ? "GENERATED ALWAYS AS IDENTITY" : "");
  statement.push(options.generatedByDefaultAsIdentity ? "GENERATED BY DEFAULT AS IDENTITY" : "");
  statement.push(options.primaryKey ? "PRIMARY KEY" : "");
  statement.push(options.references ? `REFERENCES ${options.references}` : "");
  if (statement.includes("PRIMARY KEY") || statement.includes(`REFERENCES ${options.references}`)) {
    statement = statement.filter((s) => s !== "NULL" && s !== "NOT NULL");
  }
  return statement.filter(Boolean).join(" ");
};
var fieldToSqlType = (field) => {
  if (field.type === "$") {
    return field.statement;
  }
  return `${field.type}${field.options?.array ? "[]" : ""}${field.argument ? `(${field.argument})` : ""} ${fieldOptionsToSql(field.options ?? {})}`;
};

// src/schema/codegen/table.ts
var createTableSql = (name, table) => {
  const fields = Object.entries(table).map(([key, field]) => `${key} ${fieldToSqlType(field)}`);
  return sql`CREATE TABLE ${name} (\n\t${fields.join(",\n	")}\n);`;
};
var dropTableSql = (name) => {
  return sql`DROP TABLE ${name};`;
};
var alterTableAddFieldSql = (tableName, fieldName, field) => {
  return sql`ALTER TABLE ${tableName} ADD COLUMN ${fieldName} ${fieldToSqlType(field)};`;
};
var alterTableDropFieldSql = (tableName, fieldName) => {
  return sql`ALTER TABLE ${tableName} DROP COLUMN ${fieldName};`;
};
var alterTableAlterFieldSql = (tableName, fieldName, field) => {
  const statements = [
    sql`ALTER TABLE ${tableName} ALTER COLUMN ${fieldName} SET DATA TYPE ${field.type}${field.argument ? `(${field.argument})` : ""};`,
    field.options?.nullable === false ? sql`ALTER TABLE ${tableName} ALTER COLUMN ${fieldName} SET NOT NULL;` : sql`ALTER TABLE ${tableName} ALTER COLUMN ${fieldName} DROP NOT NULL;`
  ];
  if (field.options?.default) {
    statements.push(sql`ALTER TABLE ${tableName} ALTER COLUMN ${fieldName} SET DEFAULT ${field.options.default};`);
  }
  if (field.options?.unique) {
    statements.push(sql`ALTER TABLE ${tableName} ADD CONSTRAINT unique_${fieldName} UNIQUE (${fieldName});`);
  }
  return statements;
};

// src/schema/cicd/deployer/utils.ts
var DEFAULT_CONFIG = {
  autoDeploy: false
};
var getSchemaChangeset = (newSchema, currentSchema) => {
  const changeSet = [];
  for (const table in newSchema) {
    if (!currentSchema.has(table)) {
      changeSet.push({
        type: "CREATE_TABLE",
        name: table,
        fields: newSchema[table]
      });
    } else {
      const currentTable = currentSchema.get(table);
      const newTable = newSchema[table];
      for (const [field] of currentTable.entries()) {
        if (!(field in newTable)) {
          changeSet.push({
            type: "DROP_COLUMN",
            tableName: table,
            name: field
          });
        }
      }
      for (const field in newTable) {
        if (!currentTable.has(field)) {
          changeSet.push({
            type: "ADD_COLUMN",
            tableName: table,
            name: field,
            field: newTable[field]
          });
        } else if (newTable[field].type !== "$") {
          changeSet.push({
            type: "ALTER_COLUMN",
            tableName: table,
            name: field,
            field: newTable[field]
          });
        }
      }
    }
  }
  for (const table in currentSchema) {
    if (!(table in newSchema)) {
      changeSet.push({
        type: "DROP_TABLE",
        name: table
      });
    }
  }
  return changeSet;
};
var convertSchemaChangesetToSql = (changeset) => {
  const statements = [];
  for (const change of changeset) {
    if (change.type === "CREATE_TABLE") {
      statements.push(createTableSql(change.name, change.fields));
    } else if (change.type === "DROP_TABLE") {
      statements.push(dropTableSql(change.name));
    } else if (change.type === "ADD_COLUMN") {
      statements.push(alterTableAddFieldSql(change.tableName, change.name, change.field));
    } else if (change.type === "DROP_COLUMN") {
      statements.push(alterTableDropFieldSql(change.tableName, change.name));
    } else if (change.type === "ALTER_COLUMN") {
      statements.push(...alterTableAlterFieldSql(change.tableName, change.name, change.field));
    }
  }
  return statements;
};

// src/schema/cicd/deployer/deployer.ts
var SchemaDeployer = class {
  constructor(schema, config3 = DEFAULT_CONFIG) {
    this.schema = schema;
    this.config = config3;
    this.client = new SqrlPgClient(this.config.client);
    if (this.config.autoDeploy) {
      this.client.connect().then(() => {
        this.deploy();
      });
    }
  }
  client;
  async initialize() {
    if (!this.client.connected) await this.client.connect();
    const schemaStrings = generateSchemaSql(this.schema, { dropExisting: true });
    const results = [];
    for (const statement of schemaStrings) {
      const result = await this.client.query(statement);
      results.push(result);
    }
    await this.client.end();
    return results;
  }
  async getChangeSet() {
    if (!this.client.connected) await this.client.connect();
    const currentSchema = await this.client.getSchema();
    const changeSet = getSchemaChangeset(this.schema, currentSchema);
    return changeSet;
  }
  async deploy(_changeSet) {
    if (!this.client.connected) await this.client.connect();
    const changeSet = _changeSet ?? await this.getChangeSet();
    const statements = convertSchemaChangesetToSql(changeSet);
    const results = /* @__PURE__ */ new Map();
    for (const statement of statements) {
      try {
        const result = await this.client.query(statement);
        results.set(statement, result);
      } catch (error) {
        results.set(statement, error);
      }
    }
    await this.client.end();
    return results;
  }
};
async function initializeSchema(...params) {
  const deployer = new SchemaDeployer(...params);
  try {
    return await deployer.initialize();
  } catch (error) {
    console.error(error);
    deployer.client.end();
    process.exit(1);
  } finally {
    deployer.client.end();
  }
}
async function deploySchema(...params) {
  const deployer = new SchemaDeployer(...params);
  try {
    return await deployer.deploy();
  } catch (error) {
    console.error(error);
    deployer.client.end();
    process.exit(1);
  }
}

// src/schema/codegen/schema.ts
var generateSchemaSql = (schema, config3) => {
  return Object.entries(schema).map(([name, table]) => [
    config3?.dropExisting ? sql`DROP TABLE IF EXISTS ${name} CASCADE;` : "",
    createTableSql(name, table)
  ]).flat().filter(Boolean);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BOOLEAN,
  ENUM,
  INTEGER,
  PK_AUTO_INT,
  PK_AUTO_UUID,
  PostgresTableMap,
  SERIAL,
  SQL,
  TEXT,
  TIMESTAMP,
  TableMap,
  UUID,
  VARCHAR,
  deploySchema,
  generateSchemaSql,
  initializeSchema
});
//# sourceMappingURL=index.cjs.map