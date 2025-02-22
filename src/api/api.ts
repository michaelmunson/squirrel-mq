import express from 'express';
import { SchemaInput, Table } from '../schema';
import { APIConfig } from './types';
import { PgClient } from '../pg';
import { createTableRoutes } from './utils';
import * as dotenv from 'dotenv';
import { convertRecordKeysToCamelCase, convertRecordKeysToSnakeCase } from '../utils';

dotenv.config();

const DEFAULT_CONFIG: APIConfig = {
  port: 3000,
  prefix: '/api',
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
  }
}

export class API<Schema extends SchemaInput = SchemaInput> {
  readonly app: express.Application;
  readonly client: PgClient;
  readonly config: APIConfig;
  constructor(readonly schema: Schema, config: APIConfig = DEFAULT_CONFIG) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    this.app = app;
    this.client = new PgClient(config.client);
  }

  private applyMiddleware() {
    if (this.config.caseConversion) {
      const inCase = this.config.caseConversion?.in;
      const outCase = this.config.caseConversion?.out;
      this.app.use(function (req, res, next) {
        if (inCase === 'snake') {
          req.body = convertRecordKeysToSnakeCase(req.body);
        }
        else if (inCase === 'camel') {
          req.body = convertRecordKeysToCamelCase(req.body);
        }
        const json = res.json;
        res.json = (body: any) => {
          return json.call(res, outCase === 'camel' ? convertRecordKeysToCamelCase(body) : convertRecordKeysToSnakeCase(body));
        }
        next();
      });
    }
  }

  private initialize() {
    this.applyMiddleware();
    Object.entries(this.schema).forEach(([name, table]) => {
      createTableRoutes(this, name, table);
    });
  }

  hasRoute(path: string) {
    return this.app._router.stack.some((route: any) => route.route?.path === path);
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