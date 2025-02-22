# Squirrel MQ

Squirrel MQ is a lightweight, zero-dependency, and type-safe SQL builder for TypeScript.

## Installation

```bash
npm install squirrel-mq
```

## Usage

### Create a Schema
```ts
// schema.ts

import {type SchemaType, AUTO_ID, INTEGER, SERIAL, TEXT, TIMESTAMP, VARCHAR} from 'squirrel-mq/schema';


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

### Deploy the Schema
```ts
import { deploySchema } from 'squirrel-mq/deploy';

deploySchema(SCHEMA);
```

### Deploy the Schema in CI/CD
```ts
import { SchemaDeployer } from 'squirrel-mq/cicd';
import { SCHEMA } from './schema';

const deployer = new SchemaDeployer(SCHEMA);

deployer.deploy().then(() => console.log('Schema Deployed'));
```

### Create an API
```ts
import { createAPI } from 'squirrel-mq/api';
import { SCHEMA } from './schema';

const api = createAPI(SCHEMA, {
  port: 3000,
});

api.start().then(() => console.log(`Server started on port ${api.config.port}`));
```

### Create a Client
```ts
import { createClient } from 'squirrel-mq/client';
import { SCHEMA, type Schema } from './schema';

const client = createClient<Schema>(SCHEMA, {
  baseUrl: 'http://localhost:3000/api/',
  headers: {
    'Authorization': 'Bearer <token>',
  }
});

client.users.list({
  page: 1,
  limit: 10,
  filter: {
    name: {
      ilike: 'C',
    }
  }
}).then(console.log);
``` 
