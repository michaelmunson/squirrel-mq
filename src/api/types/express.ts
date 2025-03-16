import { RequestHandler } from "express";

export type RequestParams = Parameters<RequestHandler>;
export type RequestFunction = (...args: RequestParams) => Promise<void>;
