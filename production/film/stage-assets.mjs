// Restore the private production inputs without putting source ads in the website.
import {readFile, mkdir, copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)));
const source = process.argv[2];
if (!source) throw new Error('Pass the original film-production/public directory.');
const manifest = JSON.parse(await readFile(resolve(root, 'asset-manifest.json'), 'utf8'));
for (const asset of manifest.assets) {
  const bytes = await readFile(resolve(source, asset.path));
  const digest = createHash('sha256').update(bytes).digest('hex');
  if (digest !== asset.sha256) throw new Error(`Source mismatch: ${asset.path}`);
  const target = resolve(root, 'public', asset.path);
  await mkdir(dirname(target), {recursive: true});
  await copyFile(resolve(source, asset.path), target);
}
console.log(`Staged ${manifest.assets.length} verified production assets.`);
