#!/usr/bin/env node

import sqrl from 'commander';
import { generate } from './commands';

sqrl
  .addCommand(generate);

(async () => {
  await sqrl.parseAsync(process.argv);
})();
