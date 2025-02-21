import { Table } from '../../schema';
import { API } from '../api';
import { sql } from '../../utils';

const createAllRoute = (api:API, name: string, table: Table) => {
  const columns = Object.keys(table).join(', ');
  api.app.get(`${api.config.prefix}/${name}`, async (req, res) => {
    try {
      const statement = sql`SELECT ${columns} FROM ${name};`;
      const result = await api.client.query(statement);
      res.status(200).send(result.rows);
    }
    catch (err) {
      res.status(500).send(err);
    }
  });
}

export const createTableRoutes = (api:API, name: string, table: Table) => {
  createAllRoute(api, name, table);

}
