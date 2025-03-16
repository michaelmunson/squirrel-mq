import { Table } from '../../../schema';
import { API } from '../../api';
import { sql } from '../../../utils';

export function createGetRoute(api: API, name: string, table: Table) {
  const columns = Object.keys(table).join(', ');
  const route = `${api.config.prefix}/${name}/:id`;
  if (!api.hasRoute(route))
    api.app.get(route, async (req, res) => {
      try {
        const statement = (
          sql`
          SELECT ${columns} FROM ${name}
          WHERE id = $1;
        `
        );
        const values = [req.params.id];
        const result = await api.client.query(statement, values);
        if (!result.rows[0]) {
          res.status(404).send({ error: `Resource not found` });
        }
        else {
          res.status(200).send(result.rows[0]);
        }
      }
      catch (err) {
        console.log(err);
        res.status(500).send({ error: err });
      }
    });
}