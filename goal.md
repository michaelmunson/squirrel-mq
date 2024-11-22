
sql side
```typescript
import { Schema, Table, Database } from '...';
import { id, varchar, timestamp, int, boolean, float, double, json } from '...';

const schema = createSchema({
  user: {
    id: id({ primaryKey: true }),
    name: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    password: varchar({ length: 255 }),
    isActive: boolean({ default: false }),
    createdAt: timestamp({ default: 'CURRENT_TIMESTAMP' }),
    updatedAt: timestamp({ default: 'CURRENT_TIMESTAMP' }),
  },
  post: {
    id: id({ primaryKey: true }),
    title: varchar({ length: 255 }),
    content: json<Record<string, unknown>>(),
  },
  comment: {
    id: id({ primaryKey: true }),
    content: varchar({ length: 255 }),
    postId: id({ foreignKey: 'post.id' }),
  },
  manyToMany: {
    post: {
      postId: id({ foreignKey: 'post.id' }),
      userId: id({ foreignKey: 'user.id' }),
      @primaryKey: ['postId', 'userId'],
    },
  },
});

const schema = createSchema([
  table('user', [
    column('id', id({ primaryKey: true })),
    column('name', varchar({ length: 255 })),
    column('email', varchar({ length: 255 })),
    column('password', varchar({ length: 255 })),
    column('isActive', boolean({ default: false })),
    column('createdAt', timestamp({ default: 'CURRENT_TIMESTAMP' })),
    column('updatedAt', timestamp({ default: 'CURRENT_TIMESTAMP' })),
  ]),
]);

const db = new Database('name', { 
  schema, 
  client: 'mysql', 
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'name',
  },
});
```

mq side
```typescript

```

rest api side
```typescript

```