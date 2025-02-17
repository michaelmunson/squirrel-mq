"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = void 0;
const express_1 = __importDefault(require("express"));
const addTable = (app, name, table) => {
    app.post(`/api/${name}`, (req, res) => {
        console.log(req.body);
        res.send('Hello World');
    });
};
const createApi = (schema) => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    return app;
};
exports.createApi = createApi;
