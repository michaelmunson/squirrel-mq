import { Table } from '../../../schema';
import { API } from '../../api';
import { convertRecordKeysToSnakeCase, sql } from '../../../utils';
import { AllQuery, Filter, FilterOperator, FilterParams } from '../../types';
import { getBetweenCurlyBraces } from './utils';

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
 * 
 * name=and{name=eq:value; name=gt:value;}
 * name=or{name=eq:value; name=neq:value;}
 * and={name=eq:value; name=gt:value;}
*/
// const getFilterAndOrStatement = (field:string, value:string, index:number, type: 'AND' | 'OR') : [sql:string, ...values:any[]] => {
//   const values = getBetweenCurlyBraces(value).split(';');
//   const statementArray:string[] = [];
//   const statementValues:any[] = [];
//   values.forEach((v) => {
//     if (v.startsWith('AND')) {
//       const [statement, ...values] = getFilterAndOrStatement(field, v, index, 'AND');
//       statementArray.push(statement);
//       statementValues.push(...values);
//     }
//     else if (v.startsWith('OR')) {
//       const [statement, ...values] = getFilterAndOrStatement(field, v, index, 'OR');
//       statementArray.push(statement);
//       statementValues.push(...values);
//     }
//     else {
//       const [statement, ...values] = getFilterStatement(field, v, index);
//       statementArray.push(statement);
//       statementValues.push(...values);
//     }

//   });
//   return [sql`(${statementArray.join(` ${type.toUpperCase()} `)})`, ...statementValues];
// }

// const getFilterStatement = (field:string, value:string, index:number) : [sql:string, ...values:any[]] => {
  // if (field === 'AND' || field === 'OR') {
  //   return getFilterAndOrStatement(field, value, index, field);
  // }
  // else if (value.startsWith('eq:')) {
  //   return [sql`${field} = $${index}`, value.slice(3)];
  // }
  // else if (value.startsWith('neq:')) {
  //   return [sql`${field} != $${index}`, value.slice(3)];
  // }
  // else if (value.startsWith('gt:')) {
  //   return [sql`${field} > $${index}`, value.slice(3)];
  // }
  // else if (value.startsWith('gte:')) {
  //   return [sql`${field} >= $${index}`, value.slice(4)];
  // }
  // else if (value.startsWith('lt:')) {
  //   return [sql`${field} < $${index}`, value.slice(3)];
  // }
  // else if (value.startsWith('lte:')) {
  //   return [sql`${field} <= $${index}`, value.slice(4)];
  // }
  // else if (value.startsWith('in:')) {
  //   const values = value.slice(3).split(',');
  //   return [sql`${field} IN (${values.map((v, i) => sql`$${index + i}`).join(',')})`, ...values];
  // }
  // else if (value.startsWith('like:')) {
  //   return [sql`${field} LIKE $${index}`, `%${value.slice(5)}%`];
  // }
  // else if (value.startsWith('ilike:')) {
  //   return [sql`${field} ILIKE $${index}`, `%${value.slice(6)}%`];
  // }
  // else {
  //   return [sql`${field} = $${index}`, value];
  // }
// }

// const getFilterStatementArray = (query:Record<string, string>) : [string[], any[]] => {
//   const statementArray:string[] = [];
//   const statementValues:any[] = [];
//   let index = 3;
//   Object.entries(query).forEach(([key, value]) => {
//     const [statement, ...values] = getFilterStatement(key, value, index);
//     statementArray.push(statement);
//     statementValues.push(...values);
//     index += values.length;
//   }); 
//   return [statementArray, statementValues];
// }

type FilterStatementMap = Record<FilterOperator, (field:string, value:any, index:number) => {statment: string, values: any[]}>;

const filterStatementMap:FilterStatementMap = {
  eq: (field:string, value:any, index:number) => {
    return {statment: `${field} = $${index}`, values: [value]};
  },
  ne: (field:string, value:any, index:number) => {
    return {statment: `${field} != $${index}`, values: [value]};
  },
  gt: (field:string, value:any, index:number) => {
    return {statment: `${field} > $${index}`, values: [value]};
  },
  gte: (field:string, value:any, index:number) => {
    return {statment: `${field} >= $${index}`, values: [value]};
  },
  lt: (field:string, value:any, index:number) => {
    return {statment: `${field} < $${index}`, values: [value]};
  },
  lte: (field:string, value:any, index:number) => {
    return {statment: `${field} <= $${index}`, values: [value]};
  },
  in: (field:string, value:any[], index:number) => {
    return {statment: `${field} IN (${value.map((v, i) => sql`$${index + i}`).join(',')})`, values: value};
  },
  like: (field:string, value:any, index:number) => {
    return {statment: `${field} LIKE $${index}`, values: [`%${value}%`]};
  },
  ilike: (field:string, value:any, index:number) => {
    return {statment: `${field} ILIKE $${index}`, values: [`%${value}%`]};
  },
}

const getFilterStatements = (filter:FilterParams<Record<string, string>>, index:number = 3) : {statments: string[], values: any[]} => {
  const statementArray:string[] = [];
  const statementValues:any[] = [];
  filter = convertRecordKeysToSnakeCase(filter, ['AND', 'OR', 'NOT']);
  for (const [key, value] of Object.entries(filter)){
    if (key.toUpperCase() === 'AND' || key.toUpperCase() === 'OR'){
      const subStatements:string[] = [];
      for (const v of value){
        const {statments, values} = getFilterStatements(v, index);
        subStatements.push(...statments);
        statementValues.push(...values);
        index += values.length;
      }
      const statement = `(${subStatements.join(` ${key.toUpperCase()} `)})`;
      statementArray.push(statement);
    }
    else if (key.toUpperCase() === 'NOT'){
      const {statments, values} = getFilterStatements(value, index);
      statementArray.push(`NOT ${statments.join(' ')}`);
      statementValues.push(...values);
    }
    else {
      for (const op in value){
        const {statment, values} = filterStatementMap[op as FilterOperator](key, value[op], index);
        statementArray.push(statment);
        statementValues.push(...values);
        index += values.length;
      }
    }
  }
  return {statments: statementArray, values: statementValues};
}

export const createAllRoute = (api:API, name: string, table: Table) => {
  const columns = Object.keys(table).join(', ');
  const route = `${api.config.prefix}/${name}`;
  if (!api.hasRoute(route)) api.app.get(route, async (req, res) => {
    try {
      const {page=api.config.pagination?.defaultPage ?? 1, limit=api.config.pagination?.defaultLimit ?? 10, filter = '{}'} = req.query as AllQuery;
      const filterObject = JSON.parse(filter) as FilterParams<Record<string, string>>;
      const {statments, values:statementValues} = getFilterStatements(filterObject);
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
      console.error(err);
      res.status(500).json(err);
    }
  });
}
