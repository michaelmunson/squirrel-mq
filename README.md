# Squirrel MQ

Squirrel MQ is a lightweight, zero-dependency, and type-safe SQL builder for TypeScript.

## Installation

```bash
npm install squirrel-mq
```

## Usage

### Create a schema

```ts
import $, { SchemaType } from "squirrel-mq";
import {constructSqlSchema} from "squirrel-mq/codegen";

const schema = {
  users: {
    id: $.SERIAL({primaryKey: true}),
    firstName: $.VARCHAR(255, {nullable: false}),
    lastName: $.VARCHAR(255, {nullable: false}),
    email: $.VARCHAR(255, {
      unique: true,
      nullable: false,
    }),
    createdAt: $.TIMESTAMP({nullable: false}),
    updatedAt: $.inline<number>('TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'),
    age: $.INTEGER(),
  },
  posts: {
    id: $.SERIAL({primaryKey: true}),
    userId: $.SERIAL({
      references: 'users(id)'
    }),
  }
};

export type Schema = SchemaType<typeof schema>;

console.log(constructSqlSchema(schema)); // output the sql schema 
```