import { A as API, a as ApiExtensionRecord } from '../extensions-C547I1TK.js';
export { f as APIConfig, h as APIRoute, j as APIRouteMethods, i as APIRoutes, g as APISchema, c as AllQuery, l as ApiExtensionFunction, k as ApiExtensionMethods, d as Filter, F as FilterOperator, e as FilterParams, b as HTTPMethod, H as HTTP_METHODS, L as ListParams, m as createApi } from '../extensions-C547I1TK.js';
import * as qs from 'qs';
import { a as Table } from '../types-Drqv8FGe.js';
import { RequestHandler } from 'express';
export { RequestHandler } from 'express';
import 'pg';
import '../types-W554HBlq.js';

declare const createDefaultRoutes: (api: API, name: string, table: Table) => void;
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
declare const createRoutes: <T extends ApiExtensionRecord>(ext: T) => T;
declare const handler: <Output, Input = undefined>(reqFn: RequestHandler<any, Output, Input>) => RequestHandler<any, Output, Input, qs.ParsedQs, Record<string, any>>;

export { API, ApiExtensionRecord, createDefaultRoutes, createRoutes, handler };
