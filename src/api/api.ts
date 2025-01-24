import express from 'express';
import { SchemaInput, Table } from '../schema';

const addTable = (app: express.Application, name: string, table: Table) => {
  app.post(`/api/${name}`, (req, res) => {
    console.log(req.body);
    res.send('Hello World');
  });
}

export const createApi = (schema: SchemaInput) => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  return app;
}