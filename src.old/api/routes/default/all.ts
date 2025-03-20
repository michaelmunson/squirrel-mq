import { Table } from '../../../schema';
import { API } from '../../api';
import { convertRecordKeysToSnakeCase, sql } from '../../../utils';
import { AllQuery, FilterOperator, FilterParams } from '../../types';

type FilterStatementMap = Record<FilterOperator, (field: string, value: any, index: number) => { statment: string, values: any[] }>;

const filterStatementMap: FilterStatementMap = {
  eq: (field: string, value: any, index: number) => {
    return { statment: `${field} = $${index}`, values: [value] };
  },
  ne: (field: string, value: any, index: number) => {
    return { statment: `${field} != $${index}`, values: [value] };
  },
  gt: (field: string, value: any, index: number) => {
    return { statment: `${field} > $${index}`, values: [value] };
  },
  gte: (field: string, value: any, index: number) => {
    return { statment: `${field} >= $${index}`, values: [value] };
  },
  lt: (field: string, value: any, index: number) => {
    return { statment: `${field} < $${index}`, values: [value] };
  },
  lte: (field: string, value: any, index: number) => {
    return { statment: `${field} <= $${index}`, values: [value] };
  },
  in: (field: string, value: any[], index: number) => {
    return { statment: `${field} IN (${value.map((v, i) => sql`$${index + i}`).join(',')})`, values: value };
  },
  like: (field: string, value: any, index: number) => {
    return { statment: `${field} LIKE $${index}`, values: [`%${value}%`] };
  },
  ilike: (field: string, value: any, index: number) => {
    return { statment: `${field} ILIKE $${index}`, values: [`%${value}%`] };
  },
}

const getFilterStatements = (filter: FilterParams<Record<string, string>>, index: number = 3): { statments: string[], values: any[] } => {
  const statementArray: string[] = [];
  const statementValues: any[] = [];
  filter = convertRecordKeysToSnakeCase(filter, ['AND', 'OR', 'NOT']);
  for (const [key, value] of Object.entries(filter)) {
    if (key.toUpperCase() === 'AND' || key.toUpperCase() === 'OR') {
      const subStatements: string[] = [];
      for (const v of value) {
        const { statments, values } = getFilterStatements(v, index);
        subStatements.push(...statments);
        statementValues.push(...values);
        index += values.length;
      }
      const statement = `(${subStatements.join(` ${key.toUpperCase()} `)})`;
      statementArray.push(statement);
    }
    else if (key.toUpperCase() === 'NOT') {
      const { statments, values } = getFilterStatements(value, index);
      statementArray.push(`NOT ${statments.join(' ')}`);
      statementValues.push(...values);
    }
    else {
      for (const op in value) {
        const { statment, values } = filterStatementMap[op as FilterOperator](key, value[op], index);
        statementArray.push(statment);
        statementValues.push(...values);
        index += values.length;
      }
    }
  }
  return { statments: statementArray, values: statementValues };
}

export const createAllRoute = (api: API, name: string, table: Table) => {
  const columns = Object.keys(table).join(', ');
  const route = `${api.config.prefix}/${name}`;
  if (!api.hasRoute(route, 'GET'))
    api.app.get(route, async (req, res) => {
      try {
        const { page = api.config.pagination?.defaultPage ?? 1, limit = api.config.pagination?.defaultLimit ?? 10, filter = '{}' } = req.query as AllQuery;
        const filterObject = JSON.parse(filter) as FilterParams<Record<string, string>>;
        const { statments, values: statementValues } = getFilterStatements(filterObject);
        const statement = [
          sql`SELECT ${columns} FROM ${name}`,
          ...statments.length > 0 ? [sql`WHERE ${statments.join(' AND ')}`] : [],
          sql`LIMIT $1 OFFSET $2`,
        ].join(' ');
        const values = [limit, (page - 1) * limit, ...statementValues];
        const result = await api.client.query(statement, values);
        res.status(200).json(result.rows);
      }
      catch (err) {
        if (process.env.VERBOSE === 'true') console.error(err);
        res.status(500).json(err);
      }
    });
}
