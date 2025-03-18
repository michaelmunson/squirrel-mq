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

// src/api/index.ts
var api_exports = {};
__export(api_exports, {
  API: () => API,
  HTTP_METHODS: () => HTTP_METHODS,
  createApi: () => createApi,
  createDefaultRoutes: () => createDefaultRoutes,
  createRoutes: () => createRoutes,
  handler: () => handler
});
module.exports = __toCommonJS(api_exports);

// src/api/types/types.ts
var HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT"];

// src/api/api.ts
var import_express = __toESM(require("express"), 1);

// src/pg/index.ts
var dotenv2 = __toESM(require("dotenv"), 1);

// src/pg/pg.ts
var import_pg = __toESM(require("pg"), 1);
var PgClient = import_pg.default.Client;

// src/utils/utils.ts
var isObject = (value) => typeof value === "object" && value?.toString() === "[object Object]";
var sql = (template, ...args) => {
  return template.map((t, i) => t + (args[i] ?? "")).join("");
};
var snakeToCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
var camelToSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};
var convertRecordKeysToCamelCase = (obj, ignoreKeys = []) => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((o) => convertRecordKeysToCamelCase(o, ignoreKeys));
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [
    ignoreKeys.includes(key) ? key : snakeToCamelCase(key),
    value?.toString() === "[object Object]" ? convertRecordKeysToCamelCase(value, ignoreKeys) : value
  ]));
};
var convertRecordKeysToSnakeCase = (obj, ignoreKeys = []) => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((o) => convertRecordKeysToSnakeCase(o, ignoreKeys));
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [
    ignoreKeys.includes(key) ? key : camelToSnakeCase(key),
    value?.toString() === "[object Object]" ? convertRecordKeysToSnakeCase(value, ignoreKeys) : value
  ]));
};
var mergeDeep = (target, source) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

// src/pg/sqrl.ts
var dotenv = __toESM(require("dotenv"), 1);
dotenv.config();

// src/pg/index.ts
dotenv2.config();

// src/api/routes/default/get.ts
function createGetRoute(api, name, table) {
  const columns = Object.keys(table).join(", ");
  const route = `${api.config.prefix}/${name}/:id`;
  if (!api.hasRoute(route, "GET"))
    api.app.get(route, async (req, res) => {
      try {
        const statement = sql`
          SELECT ${columns} FROM ${name}
          WHERE id = $1;
        `;
        const values = [req.params.id];
        const result = await api.client.query(statement, values);
        if (!result.rows[0]) {
          res.status(404).send({ error: `Resource not found` });
        } else {
          res.status(200).send(result.rows[0]);
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: err });
      }
    });
}

// src/api/routes/default/post.ts
var createPostRoute = (api, name, table) => {
  const route = `${api.config.prefix}/${name}`;
  if (!api.hasRoute(route, "POST")) {
    api.app.post(route, async (req, res) => {
      try {
        let iterator = 1;
        const columns = Object.keys(req.body);
        const values = Object.values(req.body).map(modifyValue);
        const valuesParams = values.map(() => `$${iterator++}`).join(", ");
        let statement = sql`
          INSERT INTO ${name} (${columns.join(", ")})
          VALUES (${valuesParams})
          RETURNING *;
        `;
        const result = await api.client.query(statement, values);
        res.status(201).json(result.rows[0]);
      } catch (err) {
        if (process.env.VERBOSE === "true") console.log(err);
        res.status(500).json(err);
      }
    });
  } else {
    if (process.env.VERBOSE === "true") console.log(`POST ${name} already exists`);
  }
};

// src/api/routes/default/all.ts
var filterStatementMap = {
  eq: (field, value, index) => {
    return { statment: `${field} = $${index}`, values: [value] };
  },
  ne: (field, value, index) => {
    return { statment: `${field} != $${index}`, values: [value] };
  },
  gt: (field, value, index) => {
    return { statment: `${field} > $${index}`, values: [value] };
  },
  gte: (field, value, index) => {
    return { statment: `${field} >= $${index}`, values: [value] };
  },
  lt: (field, value, index) => {
    return { statment: `${field} < $${index}`, values: [value] };
  },
  lte: (field, value, index) => {
    return { statment: `${field} <= $${index}`, values: [value] };
  },
  in: (field, value, index) => {
    return { statment: `${field} IN (${value.map((v, i) => sql`$${index + i}`).join(",")})`, values: value };
  },
  like: (field, value, index) => {
    return { statment: `${field} LIKE $${index}`, values: [`%${value}%`] };
  },
  ilike: (field, value, index) => {
    return { statment: `${field} ILIKE $${index}`, values: [`%${value}%`] };
  }
};
var getFilterStatements = (filter, index = 3) => {
  const statementArray = [];
  const statementValues = [];
  filter = convertRecordKeysToSnakeCase(filter, ["AND", "OR", "NOT"]);
  for (const [key, value] of Object.entries(filter)) {
    if (key.toUpperCase() === "AND" || key.toUpperCase() === "OR") {
      const subStatements = [];
      for (const v of value) {
        const { statments, values } = getFilterStatements(v, index);
        subStatements.push(...statments);
        statementValues.push(...values);
        index += values.length;
      }
      const statement = `(${subStatements.join(` ${key.toUpperCase()} `)})`;
      statementArray.push(statement);
    } else if (key.toUpperCase() === "NOT") {
      const { statments, values } = getFilterStatements(value, index);
      statementArray.push(`NOT ${statments.join(" ")}`);
      statementValues.push(...values);
    } else {
      for (const op in value) {
        const { statment, values } = filterStatementMap[op](key, value[op], index);
        statementArray.push(statment);
        statementValues.push(...values);
        index += values.length;
      }
    }
  }
  return { statments: statementArray, values: statementValues };
};
var createAllRoute = (api, name, table) => {
  const columns = Object.keys(table).join(", ");
  const route = `${api.config.prefix}/${name}`;
  if (!api.hasRoute(route, "GET"))
    api.app.get(route, async (req, res) => {
      try {
        const { page = api.config.pagination?.defaultPage ?? 1, limit = api.config.pagination?.defaultLimit ?? 10, filter = "{}" } = req.query;
        const filterObject = JSON.parse(filter);
        const { statments, values: statementValues } = getFilterStatements(filterObject);
        const statement = [
          sql`SELECT ${columns} FROM ${name}`,
          ...statments.length > 0 ? [sql`WHERE ${statments.join(" AND ")}`] : [],
          sql`LIMIT $1 OFFSET $2`
        ].join(" ");
        const values = [limit, (page - 1) * limit, ...statementValues];
        const result = await api.client.query(statement, values);
        res.status(200).json(result.rows);
      } catch (err) {
        if (process.env.VERBOSE === "true") console.error(err);
        res.status(500).json(err);
      }
    });
};

// src/api/routes/default/patch.ts
var createPatchRoute = (api, name, table) => {
  const route = `${api.config.prefix}/${name}/:id`;
  if (!api.hasRoute(route, "PATCH")) api.app.patch(route, async (req, res) => {
    try {
      let iterator = 2;
      const id = req.params.id;
      const setStatment = Object.keys(req.body).map((key) => `${key} = $${iterator++}`).join(", ");
      const values = Object.values(req.body).map(modifyValue);
      const statement = sql`
        UPDATE ${name} SET ${setStatment} WHERE id = $1;
        RETURNING *;
      `;
      const result = await api.client.query(statement, [id, ...values]);
      res.status(200).json(result.rows[0]);
    } catch (err) {
      if (process.env.VERBOSE === "true") console.log(err);
      res.status(500).json(err);
    }
  });
};

// src/api/routes/default/delete.ts
var createDeleteRoute = (api, name, table) => {
  const route = `${api.config.prefix}/${name}/:id`;
  if (!api.hasRoute(route, "DELETE")) api.app.delete(route, async (req, res) => {
    try {
      const id = req.params.id;
      const statement = sql`
        DELETE FROM ${name}
        WHERE id = $1
        RETURNING *;
      `;
      const result = await api.client.query(statement, [id]);
      const rows = result.rows;
      if (!rows[0]) {
        res.status(404).json({ error: `Resource not found` });
      } else {
        res.status(200).json(rows[0]);
      }
    } catch (err) {
      if (process.env.VERBOSE === "true") console.log(err);
      res.status(500).json(err);
    }
  });
};

// src/api/routes/utils.ts
var modifyValue = (value) => {
  if (Array.isArray(value)) {
    return `{${value.join(",")}}`;
  } else if (value?.toString() === "[object Object]") {
    return JSON.stringify(value);
  }
  return value;
};
var createDefaultRoutes = (api, name, table) => {
  createAllRoute(api, name, table);
  createGetRoute(api, name, table);
  createPostRoute(api, name, table);
  createPatchRoute(api, name, table);
  createDeleteRoute(api, name, table);
};
var createRoutes = (ext) => ({ ...ext });
var handler = (reqFn) => reqFn;

// src/api/api.ts
var dotenv3 = __toESM(require("dotenv"), 1);

// src/api/middleware/caseConversion.ts
var caseConversionMiddleware = ({ inCase, outCase }) => {
  return function(req, res, next) {
    if (inCase === "snake") {
      req.body = convertRecordKeysToSnakeCase(req.body);
    } else if (inCase === "camel") {
      req.body = convertRecordKeysToCamelCase(req.body);
    }
    const json = res.json;
    res.json = (body) => {
      return json.call(res, outCase === "camel" ? convertRecordKeysToCamelCase(body) : convertRecordKeysToSnakeCase(body));
    };
    next();
  };
};

// src/api/middleware/middleware.ts
var createJsonMiddleware = (handler2) => {
  return async function(req, res, next) {
    const jsonHandler = await handler2(req, res, next);
    const json = res.json;
    const status = res.status;
    if (typeof jsonHandler === "function") {
      res.json = (body) => {
        return json.call(res, jsonHandler(body));
      };
    } else if (Array.isArray(jsonHandler)) {
      const [statusCode, bodyFn] = jsonHandler;
      res.json = (body) => {
        return json.call(res, bodyFn ? bodyFn(body) : body);
      };
      res.status = (_) => {
        return status.call(res, statusCode);
      };
    }
    next();
  };
};

// src/api/utils.ts
var getFullPath = (path, prefix = "/api") => {
  return `${prefix}${path.startsWith("/") ? "" : "/"}${path}`;
};

// src/api/api.ts
dotenv3.config();
var DEFAULT_CONFIG = {
  port: 3e3,
  prefix: "/api",
  pagination: {
    defaultPage: 1,
    defaultLimit: 10
  }
};
var API = class {
  constructor(schema, extensionFn, config4 = DEFAULT_CONFIG) {
    this.schema = schema;
    this.extensionFn = extensionFn;
    this.config = mergeDeep(DEFAULT_CONFIG, config4);
    this.extensionFn = extensionFn;
  }
  app = void 0;
  client = void 0;
  config = DEFAULT_CONFIG;
  authHandler;
  initDefaultRoutes() {
    Object.entries(this.schema).forEach(([name, table]) => {
      createDefaultRoutes(this, name, table);
    });
  }
  initExtensions() {
    const extensions = this.extensionFn(this);
    Object.entries(extensions).forEach(([name, methods]) => {
      const { get, post, patch, delete: del, put } = methods;
      if (get) {
        this.app.get(getFullPath(name, this.config.prefix), get);
      }
      if (post) {
        this.app.post(getFullPath(name, this.config.prefix), post);
      }
      if (patch) {
        this.app.patch(getFullPath(name, this.config.prefix), patch);
      }
      if (del) {
        this.app.delete(getFullPath(name, this.config.prefix), del);
      }
      if (put) {
        this.app.put(getFullPath(name, this.config.prefix), put);
      }
    });
  }
  initMiddleware() {
    if (this.config.caseConversion) {
      const inCase = this.config.caseConversion?.in;
      const outCase = this.config.caseConversion?.out;
      this.app.use(caseConversionMiddleware({ inCase, outCase }));
    }
  }
  initAuth() {
    if (!this.authHandler) return;
    const handler2 = this.authHandler(this.client);
    this.app.use(
      createJsonMiddleware(async function(req, res, next) {
        return await handler2(req, res, next);
      })
    );
  }
  initialize() {
    this.initAuth();
    this.initMiddleware();
    this.initExtensions();
    this.initDefaultRoutes();
  }
  /**
   * @description 
   * - Create a function that checks if the request matches the route and method.
   * - Useful for middleware.
   * @example
   * ```typescript
   * const isOp = api.createOpChecker(req);
   * 
   * if (isOp('users/:id', 'GET')) {
   *   // Do something
   * }
   * ```
   */
  createOpChecker(req) {
    return (route, method = [...HTTP_METHODS]) => this.isOp(req, route, method);
  }
  /**
   * @description 
   * - Check if the request matches the route and method.
   * - Useful for middleware.
   * @example
   * ```typescript
   * api.isOp(req, 'users', 'GET');
   * ```
   */
  isOp(req, route, method = [...HTTP_METHODS]) {
    const routes = Array.isArray(route) ? route : [route];
    const methods = Array.isArray(method) ? method : [method];
    const { method: reqMethod, route: reqRoute } = this.describeRequest(req);
    return routes.some((r) => r === reqRoute) && methods.some((m) => m === reqMethod);
  }
  /**
   * @description Configure the API
   * @example
   * ```typescript
   * api.configure({port: 3001});
   * ```
   */
  configure(config4) {
    const mergedConfig = mergeDeep(this.config, config4);
    this.config = mergedConfig;
  }
  /**
   * @description Check if the API has a route
   * @example
   * ```typescript
   * api.hasRoute('/users');
   * ```
   */
  hasRoute(path, method) {
    return this.app._router.stack.some((route) => route.route?.path === path && route.route?.methods[method]);
  }
  /**
   * @description Remove the API's prefix from a path
   * @example
   * ```typescript
   * api.relpath(req);
   * // '/api/users' --> 'users'
   * ```
   */
  relpath(path) {
    let newPath;
    if (typeof path === "string") {
      newPath = path.replace(this.config.prefix ?? "", "");
    } else {
      newPath = path.path.replace(this.config.prefix ?? "", "");
    }
    return newPath.startsWith("/") ? newPath.slice(1) : newPath;
  }
  /**
   * @description Describe the operation of a request
   * @example
   * ```typescript
   * const {path, method} =api.describeReqOp(req);
   * ```
   */
  describeRequest(req) {
    let route = void 0;
    const match = this.app._router.stack.find(
      (layer) => layer.route && layer.route.path && req.path.match(layer.regexp)
    );
    if (match) {
      route = this.relpath(match.route.path);
    }
    const path = this.relpath(req);
    const method = req.method;
    return { path, method, route };
  }
  /**
   * @description Add a middleware to the API that will help authorize requests
   * @returns ```ts
    type Return = (
        // Return a status code and a function that will be called with the body of the response
        [statusCode: number, bodyFunction: (body: any) => any] |
        // Return a function that will be called with the body of the response
        (body: any) => any
    )
   * ```
   * @example
   * ```typescript
    api.auth(client => async (req, res, next) => {
      const unauthorized = () => [401, () => ({error: 'Unauthorized'})];
      const isOp = api.createOpChecker(req);
      const token = req.headers['authorization'];
      const {path} = api.describeRequest(req)
      // Do not use a users email as your auth token, just an example
      const user: Schema['users'] = await client.query('select * from users where email = $1', [token]).then(({rows}) => rows[0]);
      if (!user) return unauthorized();
      if (isOp('users/:id', 'GET')) {
        if (user.id.toString() !== path.split('/').pop())
          return unauthorized();
      }
    });
   * ```
   */
  auth(handler2) {
    this.authHandler = handler2;
  }
  /**
   * @description Start the API Server
   * @example
   * ```typescript
   * api.start().then((err) => {
   *   if (err) {
   *     console.error(err);
   *   }
   *   else {
   *     console.log(`API is running on port ${api.config.port}`);
   *   }
   * });
   * ```
   */
  async start() {
    const app = (0, import_express.default)();
    app.use(import_express.default.json());
    app.use(import_express.default.urlencoded({ extended: true }));
    this.app = app;
    this.client = new PgClient(this.config.client);
    await this.client.connect();
    this.initialize();
    return new Promise((resolve) => {
      this.app.listen(this.config.port, (...args) => {
        resolve(...args);
      });
    });
  }
};
var createApi = (schema, extensionFn, config4 = DEFAULT_CONFIG) => {
  return new API(schema, extensionFn, config4);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  API,
  HTTP_METHODS,
  createApi,
  createDefaultRoutes,
  createRoutes,
  handler
});
//# sourceMappingURL=index.cjs.map