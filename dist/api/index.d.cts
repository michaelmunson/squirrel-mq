import { A as API, a as ApiExtensionRecord, b as ApiExtensionFunction, c as APIConfig } from '../types-CYPL2Ame.cjs';
export { i as APIRoute, k as APIRouteMethods, j as APIRoutes, h as APISchema, e as AllQuery, l as ApiExtensionMethods, f as Filter, F as FilterOperator, g as FilterParams, d as HTTPMethod, H as HTTP_METHODS, L as ListParams, m as createApi } from '../types-CYPL2Ame.cjs';
import * as qs from 'qs';
import { a as Table } from '../types-Dw9Q3g5N.cjs';
import { RequestHandler } from 'express';
export { RequestHandler } from 'express';
import 'pg';
import '../types-W554HBlq.cjs';

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

declare const createApiExtension: <E extends ApiExtensionFunction>(extensionFn: E) => E;
declare const createApiConfig: (config: APIConfig) => APIConfig;

export { API, APIConfig, ApiExtensionFunction, ApiExtensionRecord, createApiConfig, createApiExtension, createDefaultRoutes, createRoutes, handler };
