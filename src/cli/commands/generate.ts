import {createCommand} from 'commander';
import fs from 'fs';
import { findRootDir } from '../utils/fs';
import { constructSqlSchema } from '../../codegen/schema';
import path from 'path';
import * as ts from 'typescript';

const DEFAULT_INPUT = './schema.ts';
const DEFAULT_OUTPUT = './schema.sql';

const action = async (options: {output: string}, input: string[]) => {
  const inputPath = input[0] ?? DEFAULT_INPUT;
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }
  const rootDir = findRootDir(inputPath);
  const tsSchema = fs.readFileSync(path.resolve(inputPath), 'utf8');
  const compiled = ts.transpileModule(tsSchema, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
    },
  });
  fs.writeFileSync(path.resolve(rootDir, 'schema.js'), compiled.outputText);
  const schema = require(path.resolve(rootDir, 'schema.js'));
  console.log(schema);
}

export default 
createCommand('schemagen')
  .description('Generate a schema from your schema.ts file')
  .option('-o, --output <path>', 'The path to the output file')
  .action(action);
