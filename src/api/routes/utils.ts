
import { Table } from '../../schema';
import { API } from '../api';
import { createAllRoute, createGetRoute, createPostRoute, createPatchRoute, createDeleteRoute } from './';
import { RouteExtensionRecord } from '../types/extensions';
import { RequestHandler } from 'express';

export const createDefaultRoutes = (api:API, name: string, table: Table) => {
  createAllRoute(api, name, table);
  createGetRoute(api, name, table);
  createPostRoute(api, name, table);
  createPatchRoute(api, name, table);
  createDeleteRoute(api, name, table);
}

/**
 * @example
 * ```typescript
  import { handler as $, createRoutes } from "../routes/utils";

  const routes = createRoutes({
    'fish': {
      get: $<{a:1}>(async (req, res) => {
        res.status(200).json({
          a: 1
        });
      })
    },
    'fish/trout': {
      get: $<{a:1}>(async (req, res) => {
        res.status(200).json({
          a: 1
        });
      })
    },
    'goblin': {
      post: $<{a:1}>(async (req, res) => {
        res.status(200).json({
          a: 1
        });
      })
    },
    'goblin/potter': {
      get: $<{a:1}>(async (req, res) => {
        res.status(200).json({
          a: 1
        });
      })
    }
  });
  * ```
*/
export const createRoutes = <T extends RouteExtensionRecord>(ext: T) => <const>{...ext};
export const handler = <Output,Input = undefined>(reqFn:RequestHandler<any, Output, Input>) => reqFn;