import { Table } from '../../../schema';
import { API } from '../../api';
import { sql } from '../../../utils';

export const createDeleteRoute = (api:API, name: string, table: Table) => {
  api.app.delete(`${api.config.prefix}/${name}/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      const statement = sql`
        DELETE FROM ${name} WHERE id = $1;
        RETURNING *;
      `;
      const result = await api.client.query(statement, [id]);
      const rows = result.rows;
      if (!rows[0]) {
        res.status(404).send({error: `Resource not found`});
      }
      else {
        res.status(200).send(rows[0]);
      }
    }
    catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });
}