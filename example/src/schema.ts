import { createSchema, $, INTEGER, TIMESTAMP, VARCHAR, type SchemaType } from "../../src/schema";

const schema = createSchema({
  users: {
    id: INTEGER(),
    firstName: VARCHAR(255),
    lastName: VARCHAR(255),
    email: VARCHAR(255, {}),
    createdAt: TIMESTAMP(),
    updatedAt: $<number>('TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'),
  },
  posts: {
    id: INTEGER(),
    userId: INTEGER({
      references: 'users(id)'
    }),
  }
});

export type Schema = SchemaType<typeof schema>;

export default schema;