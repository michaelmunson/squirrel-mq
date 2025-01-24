#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const commands_1 = require("./commands");
commander_1.default
    .addCommand(commands_1.generate);
(async () => {
    await commander_1.default.parseAsync(process.argv);
})();
