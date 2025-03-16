export {createRoutes, handler} from './routes/utils';

export const getFullPath = (path: string, prefix: string = '/api') => {
  return `${prefix}${path.startsWith('/') ? '' : '/'}${path}`;
}