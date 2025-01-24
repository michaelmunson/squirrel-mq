import { createSchema, $, INTEGER, TIMESTAMP, VARCHAR } from "../../src/schema";
var schema = createSchema({
    users: {
        id: INTEGER(),
        firstName: VARCHAR(255),
        lastName: VARCHAR(255),
        email: VARCHAR(255, {}),
        createdAt: TIMESTAMP(),
        updatedAt: $('TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'),
    },
    posts: {
        id: INTEGER(),
        userId: INTEGER({
            references: 'users(id)'
        }),
    }
});
export default schema;
