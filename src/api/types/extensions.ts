import { RequestFunction } from "./express";


export type ExtensionMethods = Partial<{
  GET: RequestFunction;
  POST: RequestFunction;
  PATCH: RequestFunction;
  DELETE: RequestFunction;
  PUT: RequestFunction;
}>

export type Extension = {
  [key: string]: {
    index: ExtensionMethods;
    children: Extension;
  }
}

const ext = (index: ExtensionMethods, children: Extension = {}) => <const>({
  index,
  children
})

const extension: Extension = {
  fish: ext({
    GET: async (req, res, next) => {
      res.status(200).json({
        message: 'Hello World'
      });
    }
  },{
    trout: ext({
      GET: async (req, res, next) => {
        res.status(200).json({
          message: 'Hello World'
        });
      }
    })
  })
};

type ParsePathToObject<T extends string> =
  T extends `${infer First}/${infer Rest}`
    ? { [key in First]: ParsePathToObject<Rest> }
    : { [key in T]: {} };

// Example usage:
type ParsedPath = ParsePathToObject<'api/fish/trout'>;
// Result:
// type ParsedPath = {
//   api: {
//     fish: {
//       trout: {};
//     };
//   };
// }
