import express from 'express';
import { SchemaInput } from '../schema';
import { APIConfig } from './types';
import { PgClient } from '../pg';
import { createSchemaRoutes } from './routes/utils';
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

export class API<Schema extends SchemaInput = any, > {
  readonly app: express.Application;
  readonly client: PgClient;
  config: APIConfig = DEFAULT_CONFIG;
  constructor(readonly schema: Schema, config: APIConfig = DEFAULT_CONFIG) {
    this.config = mergeDeep(DEFAULT_CONFIG, config);
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    this.app = app;
    this.client = new PgClient(config.client);
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
    Object.entries(this.schema).forEach(([name, table]) => {
      createSchemaRoutes(this , name, table);
    });
  }

  configure(config: APIConfig) {
    Object.assign(this.config, config);
    this.initialize();
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

export const createAPI = <Schema extends SchemaInput>(schema: Schema, config: APIConfig = DEFAULT_CONFIG) => {
  return new API(schema, config);
}