import { Table } from '../../../schema';
import { API } from '../../api';
import { sql } from '../../../utils';
import { modifyValue } from '../utils';

export const createPostRoute = (api:API, name: string, table: Table) => {
  const route = `${api.config.prefix}/${name}`;
  if (!api.hasRoute(route, 'POST')) {
    api.app.post(route, async (req, res) => {
      try {
        let iterator = 1;
        const columns = Object.keys(req.body);
        const values = Object.values(req.body).map(modifyValue);
        const valuesParams = values.map(() => `$${iterator++}`).join(', ');
        let statement = sql`
          INSERT INTO ${name} (${columns.join(', ')})
          VALUES (${valuesParams})
          RETURNING *;
        `;
        const result = await api.client.query(statement, values);
        res.status(201).json(result.rows[0]);
      }
      catch (err) {
        if (process.env.VERBOSE === 'true') console.log(err);
        res.status(500).json(err);
      }
    });
  } else {
    if (process.env.VERBOSE === 'true') console.log(`POST ${name} already exists`);
  }
}