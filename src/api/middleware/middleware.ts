import { RequestHandler } from "express";

type RequestHandlerParams = Parameters<RequestHandler>;
type JsonMiddlewareReturn = ((body: any) => any) | [statusCode: number, bodyFn: ((body: any) => any)] | Readonly<[statusCode: number, bodyFn: ((body: any) => any)]> | void;
export type JsonMiddleware = (...args: RequestHandlerParams) => JsonMiddlewareReturn | Promise<JsonMiddlewareReturn>;

/**
 * @example
 * ```ts
 * 
  createJsonMiddleware((req, res) => {
    req.body = req.body;
    return (body) => ({
      ...body,
      fish: 'goose'
    })
  }) 
 * ```
*/ 
export const createJsonMiddleware = (handler: JsonMiddleware) : RequestHandler => {
  return async function (req, res, next){
    const jsonHandler = await handler(req, res, next);
    const json = res.json;
    const status = res.status;
    if (typeof jsonHandler === 'function') {
      res.json = (body: any) => {
        return json.call(res, (jsonHandler as ((body: any) => any))(body));
      }
    }
    else if (Array.isArray(jsonHandler)) {
      const [statusCode, bodyFn] = jsonHandler;
      res.json = (body: any) => {
        return json.call(res, bodyFn ? bodyFn(body) : body);
      }
      res.status = (_: number) => {
        return status.call(res, statusCode);
      }
    }
    next();
  }
}
