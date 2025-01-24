"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../../src/schema");
var schema = (0, schema_1.createSchema)({
    users: {
        id: (0, schema_1.INTEGER)(),
        firstName: (0, schema_1.VARCHAR)(255),
        lastName: (0, schema_1.VARCHAR)(255),
        email: (0, schema_1.VARCHAR)(255, {}),
        createdAt: (0, schema_1.TIMESTAMP)(),
        updatedAt: (0, schema_1.$)('TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'),
    },
    posts: {
        id: (0, schema_1.INTEGER)(),
        userId: (0, schema_1.INTEGER)({
            references: 'users(id)'
        }),
    }
});
exports.default = schema;
