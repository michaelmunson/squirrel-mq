"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const fs_2 = require("../utils/fs");
const path_1 = __importDefault(require("path"));
const ts = __importStar(require("typescript"));
const DEFAULT_INPUT = './schema.ts';
const DEFAULT_OUTPUT = './schema.sql';
const action = async (options, input) => {
    const inputPath = input[0] ?? DEFAULT_INPUT;
    if (!fs_1.default.existsSync(inputPath)) {
        console.error(`File not found: ${inputPath}`);
        process.exit(1);
    }
    const rootDir = (0, fs_2.findRootDir)(inputPath);
    const tsSchema = fs_1.default.readFileSync(path_1.default.resolve(inputPath), 'utf8');
    const compiled = ts.transpileModule(tsSchema, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
        },
    });
    fs_1.default.writeFileSync(path_1.default.resolve(rootDir, 'schema.js'), compiled.outputText);
    const schema = require(path_1.default.resolve(rootDir, 'schema.js'));
    console.log(schema);
};
exports.default = (0, commander_1.createCommand)('schemagen')
    .description('Generate a schema from your schema.ts file')
    .option('-o, --output <path>', 'The path to the output file')
    .action(action);
