import { Table } from '../../../schema';
import { API } from '../../api';
import { sql } from '../../../utils';

export const createPostRoute = (api:API, name: string, table: Table) => {
  api.app.post(`${api.config.prefix}/${name}`, async (req, res) => {
    try {
      console.log(req.body);
      let iterator = 1;
      const columns = Object.keys(req.body);
      const values = Object.values(req.body);
      const valuesParams = values.map(() => `$${iterator++}`).join(', ');
      let statement = sql`
        INSERT INTO ${name} (${columns.join(', ')})
        VALUES (${valuesParams})
        RETURNING *;
      `;
      const result = await api.client.query(statement, values);
      res.status(201).send(result.rows[0]);
    }
    catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });
}