import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const targets = [
  'node_modules/eslint-module-utils/tsconfig.json',
  'node_modules/es-object-atoms/tsconfig.json',
];

for (const target of targets) {
  const filePath = join(process.cwd(), target);

  if (!existsSync(filePath)) {
    continue;
  }

  const original = readFileSync(filePath, 'utf8');
  const updated = original.replace(/"ignoreDeprecations"\s*:\s*"6\.0"/g, '"ignoreDeprecations": "5.0"');

  if (updated !== original) {
    writeFileSync(filePath, updated);
    console.log(`Corrected invalid ignoreDeprecations setting in ${target}`);
  }
}
