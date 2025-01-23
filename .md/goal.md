
# DB Creation Option 1
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

const db = createDb('name', { 
  schema, 
  client: 'mysql',
});
```

# DB Creation Option 2
```typescript


class User extends Table {
  @PrimaryKey
  id = id()
  name = varchar(255)
  job:Job = json()
}

class Pet extends Table {
  @PrimaryKey
  id = id()
  name = varchar(255)
  @ForeignKey(User)
  owner = id()
  @Authq
  authorization()
}

export {User}
```
