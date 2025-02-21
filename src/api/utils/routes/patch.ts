import { Table } from '../../../schema';
import { API } from '../../api';
import { sql } from '../../../utils';

export const createPatchRoute = (api:API, name: string, table: Table) => {
  api.app.patch(`${api.config.prefix}/${name}/:id`, async (req, res) => {
    try {
      let iterator = 2;
      const id = req.params.id;
      const setStatment = Object.keys(req.body).map((key) => `${key} = $${iterator++}`).join(', ');
      const values = Object.values(req.body);
      const statement = sql`
        UPDATE ${name} SET ${setStatment} WHERE id = $1;
        RETURNING *;
      `;
      const result = await api.client.query(statement, [id, ...values]);
      res.status(200).send(result.rows[0]);
    }
    catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });
}