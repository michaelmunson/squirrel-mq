"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRootDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const findRootDir = (input) => {
    if (input === '/') {
        console.error('No output directory found');
        process.exit(1);
    }
    const parsed = path_1.default.parse(input);
    const dir = path_1.default.resolve(parsed.dir);
    const files = fs_1.default.readdirSync(dir);
    if (files.includes('package.json')) {
        return dir;
    }
    return (0, exports.findRootDir)(dir);
};
exports.findRootDir = findRootDir;
