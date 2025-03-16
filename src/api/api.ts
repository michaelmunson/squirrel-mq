import express, {Request, RequestHandler} from 'express';
import { SchemaInput } from '../schema';
import { APIConfig, ApiExtensionFunction, APIRoutes, APIRouteMethods, APIRoute, HTTPMethod, HTTP_METHODS } from './types';
import { PgClient } from '../pg';
import { createDefaultRoutes } from './routes/utils';
import * as dotenv from 'dotenv';
import { caseConversionMiddleware } from './middleware';
import { mergeDeep } from '../utils';
import { getFullPath as getPath } from './utils';
import { createJsonMiddleware, JsonMiddleware } from './middleware/middleware';

dotenv.config();

const DEFAULT_CONFIG: APIConfig = {
  port: 3000,
  prefix: '/api',
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
  }
}

export class API<Schema extends SchemaInput = any, ExtensionFn extends ApiExtensionFunction = ApiExtensionFunction> {
  readonly app: express.Application;
  readonly client: PgClient;
  config: APIConfig = DEFAULT_CONFIG;
  readonly extensionFn: ExtensionFn;
  constructor(readonly schema: Schema, extensionFn: ExtensionFn, config: APIConfig = DEFAULT_CONFIG) {
    this.config = mergeDeep(DEFAULT_CONFIG, config);
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    this.app = app;
    this.client = new PgClient(config.client);
    this.extensionFn = extensionFn;
  }

  private initDefaultRoutes() {
    Object.entries(this.schema).forEach(([name, table]) => {
      createDefaultRoutes(this, name, table);
    });
  }

  private initExtensions() {
    const extensions = this.extensionFn(this);
    Object.entries(extensions).forEach(([name, methods]) => {
      const {get, post, patch, delete: del, put} = methods;
      if (get) {
        this.app.get(getPath(name, this.config.prefix), get);
      }
      if (post) {
        this.app.post(getPath(name, this.config.prefix), post);
      }
      if (patch) {
        this.app.patch(getPath(name, this.config.prefix), patch);
      }
      if (del) {
        this.app.delete(getPath(name, this.config.prefix), del);
      }
      if (put) {
        this.app.put(getPath(name, this.config.prefix), put);
      }
    });
  }

  private initMiddleware() {
    if (this.config.caseConversion) {
      const inCase = this.config.caseConversion?.in;
      const outCase = this.config.caseConversion?.out;
      this.app.use(caseConversionMiddleware({inCase, outCase}));
    }
  }

  private initialize() {
    this.initMiddleware();
    this.initExtensions();
    this.initDefaultRoutes();
  }

  createOpChecker(req:Request) {
    return (
      route: Parameters<typeof this.isOp>[1],
      method: Parameters<typeof this.isOp>[2] = [...HTTP_METHODS]
    ) => this.isOp(req, route, method);
  }

  isOp(req: Request, route: APIRoute<this>[] | APIRoute<this>, method:HTTPMethod | HTTPMethod[] = [...HTTP_METHODS]) {
    const routes = Array.isArray(route) ? route : [route];
    const methods = Array.isArray(method) ? method : [method];
    const {method: reqMethod, route: reqRoute} = this.describeRequest(req);
    return routes.some((r) => r === reqRoute) && methods.some((m) => m === reqMethod);
  }
  /* route<R extends keyof APIRouteMethods<this>, M extends keyof APIRouteMethods<this>[R]>(route:R, method:M) : APIRouteMethods<this>[R][M] {
    return {} as any
  }

  routes() : APIRoutes<this> {
    return {} as any
  } */

  configure(config: APIConfig) {
    const mergedConfig = mergeDeep(this.config, config);
    this.config = mergedConfig;
  }

  hasRoute(path: string) {
    return this.app._router.stack.some((route: any) => route.route?.path === path);
  }

  /**
   * @description Remove the API's prefix from a path
   * @example
   * ```typescript
   * api.relpath(req);
   * // '/api/users' --> 'users'
   * ```
   */
  relpath(path: string | Request) {
    let newPath:string;
    if (typeof path === 'string') {
      newPath = path.replace(this.config.prefix ?? '', '');
    }
    else {
      newPath = path.path.replace(this.config.prefix ?? '', '');
    }
    return newPath.startsWith('/') ? newPath.slice(1) : newPath;
  }

  /**
   * @description Describe the operation of a request
   * @example
   * ```typescript
   * const {path, method} =api.describeReqOp(req);
   * ```
   */
  describeRequest(req: Request) {
    let route:string | undefined = undefined;
    const match = this.app._router.stack.find((layer: any) =>
      layer.route && layer.route.path && req.path.match(layer.regexp)
    );
    if (match) {
      route = this.relpath(match.route.path); // "/users/:id"
    }
    const path = this.relpath(req);
    const method = req.method;
    return {path, method, route};
  }

  /**
   * @description Add a middleware to the API that will be called before the request is processed.
   * @example
   * ```typescript
   * api.auth((req, res) => {
   *   console.log('Request', req.body);
   *   return req.body;
   * });
   * ```
   */
  // auth(handlerOne: (client: PgClient) => RequestHandler) {
  //   this.app.use(handlerOne(this.client));
  // }
  auth(handlerOne: (client: PgClient) => JsonMiddleware<any>) {
    const handler = handlerOne(this.client);
    this.app.use(
      createJsonMiddleware<any>(async function (req, res, next) {
        return await handler(req, res, next);
      })
    );
  }

  async start(): Promise<Error | undefined> {
    await this.client.connect();
    this.initialize();
    return new Promise((resolve, reject) => {
      this.app.listen(this.config.port, (...args) => {
        resolve(...args);
      });
    });
  }
}

/**
 * @description Create a new API instance
 * @example 
 * Define an API
 * ```typescript
  import { schema, type Schema } from "./schema";
  import { createApi, handler as $ } from "../src/api";

  const api = createApi(
    schema,
    ({client}) => ({
      // *note* The keys of the record must not start with a slash
      'example-users': {
        get: $<Schema['users'][]>(async (req, res) => {
          const users = await client.query('SELECT * FROM users WHERE email ilike $1', [`%example.com%`]);
          res.status(200).json(users.rows);
        }),
        post: $<Schema['users'], Schema['users']>(async (req, res) => {
          const user = await client.query('select * from users where id = 2');
          res.status(200).json(user.rows[0]);
        })
      }
    }),
    {
      caseConversion: {
        in: 'snake',
        out: 'camel',
      },
      pagination: {
        defaultPage: 1,
        defaultLimit: 10,
      }
    }
  );

  export default api;
  * ```
  * @example
  * Start the API
  * ```typescript
    import api from './api';

    api.start().then((err) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log(`API is running on port ${api.config.port}`);
      }
    });
  * ```
 */
export const createApi = <Schema extends SchemaInput, ExtensionFn extends ApiExtensionFunction>(schema: Schema, extensionFn: ExtensionFn, config: APIConfig = DEFAULT_CONFIG) => {
  return new API<Schema, ExtensionFn>(schema, extensionFn, config);
}