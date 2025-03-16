import { RequestHandler } from "express";

type RequestHandlerParams = Parameters<RequestHandler>;
type JsonMiddlewareReturn<R = void> = ((body: any) => any) | [statusCode: number, bodyFn: ((body: any) => any)] | R;
export type JsonMiddleware<R = void> = (...args: RequestHandlerParams) => JsonMiddlewareReturn<R> | Promise<JsonMiddlewareReturn<R>>;

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
export const createJsonMiddleware = <R = void>(handler: JsonMiddleware<R>) : RequestHandler => {
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
      res.status = (statusCode: number) => {
        return status.call(res, statusCode);
      }
    }
    next();
  }
}

