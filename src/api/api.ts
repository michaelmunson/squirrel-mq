import express from 'express';
import { SchemaInput } from '../schema';
import { APIConfig, ApiExtensionFunction, ApiExtensionRecord } from './types';
import { PgClient } from '../pg';
import { createDefaultRoutes } from './routes/utils';
import * as dotenv from 'dotenv';
import { PreAuthFunction } from './auth/types';
import { caseConversionMiddleware } from './middleware';
import { mergeDeep } from '../utils';
import { getFullPath as getPath } from './utils';
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

  configure(config: APIConfig) {
    const mergedConfig = mergeDeep(this.config, config);
    this.config = mergedConfig;
  }

  hasRoute(path: string) {
    return this.app._router.stack.some((route: any) => route.route?.path === path);
  }

  preAuth(rules: PreAuthFunction<Schema>) {
    return;
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

export const createApi = <Schema extends SchemaInput, ExtensionFn extends ApiExtensionFunction>(schema: Schema, extensionFn: ExtensionFn, config: APIConfig = DEFAULT_CONFIG) => {
  return new API<Schema, ExtensionFn>(schema, extensionFn, config);
}