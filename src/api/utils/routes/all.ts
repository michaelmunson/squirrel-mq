import { Table } from '../../../schema';
import { API } from '../../api';
import { sql } from '../../../utils';
import { FilterQuery } from '../../types';

/**
 * name=eq:value
 * name=neq:value
 * name=gt:value
 * name=gte:value
 * name=lt:value
 * name=lte:value
 * name=in:value1,value2,value3
 * name=like:value
 * name=ilike:value
 */

const getFilterStatement = (field:string, value:string, index:number) : [sql:string, ...values:any[]] => {
  if (value.startsWith('eq:')) {
    return [sql`${field} = $${index}`, value.slice(3)];
  }
  else if (value.startsWith('neq:')) {
    return [sql`${field} != $${index}`, value.slice(3)];
  }
  else if (value.startsWith('gt:')) {
    return [sql`${field} > $${index}`, value.slice(3)];
  }
  else if (value.startsWith('gte:')) {
    return [sql`${field} >= $${index}`, value.slice(4)];
  }
  else if (value.startsWith('lt:')) {
    return [sql`${field} < $${index}`, value.slice(3)];
  }
  else if (value.startsWith('lte:')) {
    return [sql`${field} <= $${index}`, value.slice(4)];
  }
  else if (value.startsWith('in:')) {
    const values = value.slice(3).split(',');
    return [sql`${field} IN (${values.map((v, i) => sql`$${index + i}`).join(',')})`, ...values];
  }
  else if (value.startsWith('like:')) {
    return [sql`${field} LIKE $${index}`, `%${value.slice(5)}%`];
  }
  else if (value.startsWith('ilike:')) {
    return [sql`${field} ILIKE $${index}`, `%${value.slice(6)}%`];
  }
  else {
    return [sql`${field} = $${index}`, value];
  }
}

const getFilterStatementArray = (query:Record<string, string>) : [string[], any[]] => {
  const statementArray:string[] = [];
  const statementValues:any[] = [];
  let index = 3;
  Object.entries(query).forEach(([key, value]) => {
    const [statement, ...values] = getFilterStatement(key, value, index);
    statementArray.push(statement);
    statementValues.push(...values);
    index += values.length;
  }); 
  return [statementArray, statementValues];
}

export const createAllRoute = (api:API, name: string, table: Table) => {
  const columns = Object.keys(table).join(', ');
  api.app.get(`${api.config.prefix}/${name}`, async (req, res) => {
    try {
      const {page=api.config.pagination?.defaultPage ?? 1, limit=api.config.pagination?.defaultLimit ?? 10, ...query} = req.query as FilterQuery<Record<string, string>>;
      const [statementArray, statementValues] = getFilterStatementArray(query);
      const statement = [
        sql`SELECT ${columns} FROM ${name}`,
        ...statementArray.length > 0 ? [sql`WHERE ${statementArray.join(' AND ')}`] : [],
        sql`LIMIT $1 OFFSET $2`,
      ].join(' ');
      console.log(statement, statementValues);
      const values = [limit, (page - 1) * limit, ...statementValues];
      const result = await api.client.query(statement, values);
      res.status(200).send(result.rows);
    }
    catch (err) {
      res.status(500).send(err);
    }
  });
}