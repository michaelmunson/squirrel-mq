import { RequestHandler } from "express";
import { convertRecordKeysToSnakeCase } from "../../utils/utils";
import { convertRecordKeysToCamelCase } from "../../utils/utils";

export const caseConversionMiddleware = ({inCase, outCase}: {inCase: 'snake' | 'camel', outCase: 'snake' | 'camel'}): RequestHandler => {
  return function (req, res, next){
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
  }
}