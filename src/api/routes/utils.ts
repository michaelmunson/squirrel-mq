
import { Table } from '../../schema';
import { API } from '../api';
import { createAllRoute, createGetRoute, createPostRoute, createPatchRoute, createDeleteRoute } from './';

export const createSchemaRoutes = (api:API, name: string, table: Table) => {
  createAllRoute(api, name, table);
  createGetRoute(api, name, table);
  createPostRoute(api, name, table);
  createPatchRoute(api, name, table);
  createDeleteRoute(api, name, table);
}
