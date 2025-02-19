# Squirrel MQ

Squirrel MQ is a lightweight, zero-dependency, and type-safe SQL builder for TypeScript.

## Installation

```bash
npm install squirrel-mq
```

## Usage

### Create a schema

```ts
import {AUTO_ID, INTEGER, SchemaType, SERIAL, TEXT, TIMESTAMP, VARCHAR} from 'squirrel-mq';

const tableDefaults = {
  created_at: TIMESTAMP({
    default: 'CURRENT_TIMESTAMP',
    withTimezone: true,
  }),
  updated_at: TIMESTAMP({
    default: 'CURRENT_TIMESTAMP',
    withTimezone: true,
  })
}

export const SCHEMA = {
  users: {
    id: AUTO_ID({unique: true}),
    name: VARCHAR(255),
    email: VARCHAR(255),
    age: INTEGER(),
    ...tableDefaults
  },
  posts: {
    id: SERIAL({primaryKey: true}),
    title: VARCHAR(255),
    content: TEXT(),
    user_id: INTEGER({
      references: 'users(id)',
    }),
    ...tableDefaults
  }
}

export type Schema = SchemaType<typeof SCHEMA>

```