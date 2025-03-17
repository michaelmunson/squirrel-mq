import express, { RequestHandler, Request } from 'express';
import { S as SchemaInput, f as PgClient, g as PgClientParams } from './types-3bJz3i28.js';

type RequestHandlerParams = Parameters<RequestHandler>;
type JsonMiddlewareReturn = ((body: any) => any) | [statusCode: number, bodyFn: ((body: any) => any)] | Readonly<[statusCode: number, bodyFn: ((body: any) => any)]> | void;
type JsonMiddleware = (...args: RequestHandlerParams) => JsonMiddlewareReturn | Promise<JsonMiddlewareReturn>;

/**
 * ---
 * @see {@link createApi}
 * ---
 */
declare class API<Schema extends SchemaInput = any, ExtensionFn extends ApiExtensionFunction = ApiExtensionFunction> {
    readonly schema: Schema;
    readonly app: express.Application;
    readonly client: InstanceType<typeof PgClient>;
    config: APIConfig;
    readonly extensionFn: ExtensionFn;
    constructor(schema: Schema, extensionFn: ExtensionFn, config?: APIConfig);
    private initDefaultRoutes;
    private initExtensions;
    private initMiddleware;
    private initialize;
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
    createOpChecker(req: Request): (route: Parameters<typeof this.isOp>[1], method?: Parameters<typeof this.isOp>[2]) => boolean;
    /**
     * @description
     * - Check if the request matches the route and method.
     * - Useful for middleware.
     * @example
     * ```typescript
     * api.isOp(req, 'users', 'GET');
     * ```
     */
    isOp(req: Request, route: APIRoute<this>[] | APIRoute<this>, method?: HTTPMethod | HTTPMethod[]): boolean;
    /**
     * @description Configure the API
     * @example
     * ```typescript
     * api.configure({port: 3001});
     * ```
     */
    configure(config: APIConfig): void;
    /**
     * @description Check if the API has a route
     * @example
     * ```typescript
     * api.hasRoute('/users');
     * ```
     */
    hasRoute(path: string): any;
    /**
     * @description Remove the API's prefix from a path
     * @example
     * ```typescript
     * api.relpath(req);
     * // '/api/users' --> 'users'
     * ```
     */
    relpath(path: string | Request): string;
    /**
     * @description Describe the operation of a request
     * @example
     * ```typescript
     * const {path, method} =api.describeReqOp(req);
     * ```
     */
    describeRequest(req: Request): {
        path: string;
        method: string;
        route: string | undefined;
    };
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
    auth(handlerOne: (client: InstanceType<typeof PgClient>) => JsonMiddleware): void;
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
    start(): Promise<Error | undefined>;
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
declare const createApi: <Schema extends SchemaInput, ExtensionFn extends ApiExtensionFunction>(schema: Schema, extensionFn: ExtensionFn, config?: APIConfig) => API<Schema, ExtensionFn>;

declare const HTTP_METHODS: readonly ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT"];
type HTTPMethod = typeof HTTP_METHODS[number];
type AllQuery = {
    page?: number;
    limit?: number;
    filter?: string;
};
type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like' | 'ilike';
type Filter<T> = ({
    eq: T;
} | {
    ne: T;
} | {
    gt: T;
} | {
    gte: T;
} | {
    lt: T;
} | {
    lte: T;
} | {
    in: T[];
} | {
    like: T;
} | {
    ilike: T;
});
type FilterParams<T> = Partial<{
    [K in keyof T]: Filter<T[K]>;
}> | {
    AND?: FilterParams<T>[];
} | {
    OR?: FilterParams<T>[];
} | {
    NOT?: FilterParams<T>;
};
type ListParams<T> = {
    page?: number;
    limit?: number;
    filter?: FilterParams<T>;
};
type APIConfig = {
    client?: PgClientParams;
    /**
     * @description The port to run the API on
     */
    port?: number;
    /**
     * @description The prefix to use for the API
     * @example '/api'
     * @default '/api'
    */
    prefix?: `/${string}`;
    /**
     * @description The case conversion to use for the API
     * @example { in: 'snake', out: 'camel' }
     */
    caseConversion?: {
        in: 'snake' | 'camel';
        out: 'snake' | 'camel';
    };
    /**
     * @description The pagination to use for the API
     * @example { defaultPage: 1, defaultLimit: 10 }
     */
    pagination?: {
        defaultPage?: number;
        defaultLimit?: number;
    };
    /**
     * @description The header to use for the API
     * @example 'Authorization'
     * @default 'Authorization'
     */
    tokenHeader?: string;
};
type APISchema<T extends API> = T extends API<infer S> ? S : never;
type APIRoute<T extends API> = T extends API<infer S, infer E> ? (keyof S extends string ? (keyof S | keyof ReturnType<E> | `${keyof S}/:id`) : never) : never;
type APIRoutes<T extends API> = APIRoute<T>[];
type APIRouteMethods<T extends API> = T extends API<infer S, infer E> ? (keyof S extends string ? {
    [key in (keyof S | keyof ReturnType<E> | `${keyof S}/:id`)]: {
        GET: (keyof (S[keyof S]))[];
        POST: keyof (S[keyof S]);
        PUT: keyof (S[keyof S]);
        PATCH: keyof (S[keyof S]);
        DELETE: keyof (S[keyof S]);
    };
} : never) : never;

type ApiExtensionMethods = Partial<{
    get: RequestHandler<any, any, any>;
    post: RequestHandler<any, any, any>;
    patch: RequestHandler<any, any, any>;
    delete: RequestHandler<any, any, any>;
    put: RequestHandler<any, any, any>;
}>;
/**
 * @description A record of API extension methods that can be used to extend the API
 * @note The keys of the record must not start with a slash
 * @example
 * const api = createApi(schema, (api) => ({
 *   'my-extension': {
 *     get: () => {
 *       return 'Hello World';
 *     }
 *   }
 * }))
 */
type ApiExtensionRecord = {
    [k: string]: ApiExtensionMethods;
} & {
    [K in `/${string}`]: never;
};
type ApiExtensionFunction = (self: API) => ApiExtensionRecord;

export { API as A, type FilterOperator as F, HTTP_METHODS as H, type ListParams as L, type ApiExtensionRecord as a, type HTTPMethod as b, type AllQuery as c, type Filter as d, type FilterParams as e, type APIConfig as f, type APISchema as g, type APIRoute as h, type APIRoutes as i, type APIRouteMethods as j, type ApiExtensionMethods as k, type ApiExtensionFunction as l, createApi as m };
