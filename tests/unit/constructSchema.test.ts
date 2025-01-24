import { constructSqlSchema } from "../../src/codegen/schema";
import { INTEGER, TIMESTAMP, VARCHAR, $ } from "../../src/schema/fields/fields";
import { createSchema } from "../../src/schema/utils";

describe('constructSchema', () => {
  it('should construct a schema', () => {
    const schema = createSchema({
      users: {
        id: INTEGER(),
        firstName: VARCHAR(255),
        lastName: VARCHAR(255),
        email: VARCHAR(255),
        createdAt: TIMESTAMP(),
        updatedAt: TIMESTAMP(),
        cust: $<number>('TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'),
      },
      posts: {
        id: INTEGER(),
        userId: INTEGER({
          references: 'users(id)'
        }),
      }
    });

    const sql = constructSqlSchema(schema);

    expect(sql).toBe(
      `CREATE TABLE users (\n\tid INTEGER NOT NULL,\n\tfirstName VARCHAR(255) NOT NULL,\n\tlastName VARCHAR(255) NOT NULL,\n\temail VARCHAR(255) NOT NULL,\n\tcreatedAt TIMESTAMP NOT NULL,\n\tupdatedAt TIMESTAMP NOT NULL,\n\tcust TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE posts (\n\tid INTEGER NOT NULL,\n\tuserId INTEGER REFERENCES users(id)\n);`
    )
  })
})