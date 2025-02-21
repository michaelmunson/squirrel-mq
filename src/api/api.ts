import express from 'express';
import { SchemaInput, Table } from '../schema';
import { APIConfig } from './types';
import { PgClient } from '../pg';
import { createTableRoutes } from './utils';
import * as dotenv from 'dotenv';

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
  constructor(readonly schema: Schema, readonly config: APIConfig = DEFAULT_CONFIG) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    this.app = app;
    this.client = new PgClient(config.client);
  }

  private initialize() {
    Object.entries(this.schema).forEach(([name, table]) => {
      createTableRoutes(this, name, table);
    });
  }

  hasRoute(path: string) {
    return this.app._router.stack.some((route: any) => route.route?.path === path);
  }

  async start() : Promise<Error | undefined> {
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