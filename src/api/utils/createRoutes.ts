import { Table } from '../../schema';
import { API } from '../api';
import * as routes from './routes';

export const createTableRoutes = (api:API, name: string, table: Table) => {
  routes.createAllRoute(api, name, table);
  routes.createGetRoute(api, name, table);
  routes.createPostRoute(api, name, table);
  routes.createPatchRoute(api, name, table);
  routes.createDeleteRoute(api, name, table);
}
