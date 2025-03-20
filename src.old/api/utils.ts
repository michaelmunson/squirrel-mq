import { APIConfig, ApiExtensionFunction } from './types';

export {createRoutes, handler} from './routes/utils';

export const getFullPath = (path: string, prefix: string = '/api') => {
  return `${prefix}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const createApiExtension = <E extends ApiExtensionFunction>(extensionFn: E) => {
  return extensionFn;
}

export const createApiConfig = (config: APIConfig) => {
  return config;
}