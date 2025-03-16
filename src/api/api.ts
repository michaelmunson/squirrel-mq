import express from 'express';
import { SchemaInput } from '../schema';
import { APIConfig, RouteExtensionRecord } from './types';
import { PgClient } from '../pg';
import { createDefaultRoutes } from './routes/utils';
import * as dotenv from 'dotenv';
import { PreAuthFunction } from './auth/types';
import { caseConversionMiddleware } from './middleware';
import { mergeDeep } from '../utils';

dotenv.config();

const DEFAULT_CONFIG: APIConfig = {
  port: 3000,
  prefix: '/api',
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
  }
}

export class API<Schema extends SchemaInput = any, Extensions extends RouteExtensionRecord = {}> {
  readonly app: express.Application;
  readonly client: PgClient;
  config: APIConfig = DEFAULT_CONFIG;
  constructor(readonly schema: Schema, readonly extensions: Extensions = {} as Extensions, config: APIConfig = DEFAULT_CONFIG) {
    this.config = mergeDeep(DEFAULT_CONFIG, config);
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    this.app = app;
    this.client = new PgClient(config.client);
  }

  private initDefaultRoutes() {
    Object.entries(this.schema).forEach(([name, table]) => {
      createDefaultRoutes(this, name, table);
    });
  }

  private initExtensions() {
    Object.entries(this.extensions).forEach(([name, {get, post, patch, delete: del, put}]) => {
      if (get) {
        this.app.get(name, get(this.client));
      }
      if (post) {
        this.app.post(name, post(this.client));
      }
      if (patch) {
        this.app.patch(name, patch(this.client));
      }
      if (del) {
        this.app.delete(name, del(this.client));
      }
      if (put) {
        this.app.put(name, put(this.client));
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

export const createApi = <Schema extends SchemaInput, Extensions extends RouteExtensionRecord = {}>(schema: Schema, extensions: Extensions, config: APIConfig = DEFAULT_CONFIG) => {
  return new API<Schema, Extensions>(schema, extensions, config);
}