# Squirrel MQ

Squirrel MQ is a lightweight, zero-dependency, and type-safe SQL builder for TypeScript.

## Installation

```bash
npm install squirrel-mq
```

## [Complete Documentation](https://michaelmunson.github.io/squirrel-mq/)

## Usage

### Step 1: Define the Schema
```ts
// schema.ts
import {AUTO_ID, INTEGER, SERIAL, TEXT, TIMESTAMP, VARCHAR} from 'squirrel-mq/schema/fields';
import { SchemaType } from 'squirrel-mq/schema';

const tableDefaults = {
  created_at: TIMESTAMP({
    default: 'CURRENT_TIMESTAMP',
    withTimezone: true,
    nullable: false,
  }),
  updated_at: TIMESTAMP({
    default: 'CURRENT_TIMESTAMP',
    withTimezone: true,
    nullable: false,
  })
}

export const schema = {
  users: {
    id: PK_AUTO_UUID(),
    name: VARCHAR(255, {nullable: false}),
    email: VARCHAR(255),
    age: INTEGER(),
    ...tableDefaults
  },
  posts: {
    id: PK_AUTO_UUID(),
    title: VARCHAR(255),
    content: TEXT(),
    user_id: UUID({
      references: 'users(id)',
    }),
    ...tableDefaults
  }
}

export type Schema = SchemaType<typeof schema>
```

### Step 2: Deploy the Schema
```ts
// schema.deploy.ts
import {schema} from "squirrel-mq/schema";
import { deploySchema } from "squirrel-mq/schema/cicd/deployer";

(async () => {
  const changeSet = await deploySchema(schema);
  console.log(changeSet);
})();
```

### Step 3: Create an API
```ts
// api.ts
import { schema, type Schema } from "squirrel-mq/schema";
import { createApi, handler as $ } from "squirrel-mq/api";

const api = createApi(
  schema,
  ({client}) => ({
    'example-users': {
      get: $<Schema['users'][]>(async (req, res) => {
        const users = await client.query('SELECT * FROM users WHERE email ilike $1', [`%example.com%`]);
        res.status(200).json(users.rows);
      }),
      post: $<Schema['users'], Schema['users']>(async (req, res) => {
        const user = await client.query('select * from users where id = 2');
        res.status(200).json(user.rows[0]);
      })
    }
  }),
  {
    caseConversion: {
      in: 'snake',
      out: 'camel',
    },
    pagination: {
      defaultPage: 1,
      defaultLimit: 10,
    }
  }
);

api.auth(client => async (req, res, next) => {
  const unauthorized = () => <const>[401, () => ({error: 'Unauthorized'})];
  const isOp = api.createOpChecker(req);
  const token = req.headers['authorization'];
  const {path} = api.describeRequest(req)
  // Do not use a users email as your auth token, just an example
  const user: Schema['users'] = await client.query('select * from users where email = $1', [token]).then(({rows}) => rows[0]);
  if (!user) return unauthorized(); 
  if (isOp('users/:id', 'GET')) {
    if (user.id.toString() !== path.split('/').pop())
      return unauthorized();
  }
});

export default api;
```

### Step 4: Start the API
```ts
// serve.ts
import api from 'squirrel-mq/api';

api.start().then((err) => {
  if (err) {
    console.error(err);
  }
  else {
    console.log(`API is running on port ${api.config.port}`);
  }
});
```

### Step 5: Create a Client
```ts
// client.ts
import { createClient } from "squirrel-mq/client";
import api from "squirrel-mq/api";

const client = createClient(api, {
  baseUrl: 'http://localhost:3000/',
  headers: {
    'Authorization': 'Bearer 1234567890',
  }
});

client.models.posts.get(1).then(r => console.log(r));

client.custom('/example-users').post({
  age: 20,
  name: 'John Doe',
  email: 'john.doe@example.com',
  id: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}).then(r => console.log(r));
``` 
