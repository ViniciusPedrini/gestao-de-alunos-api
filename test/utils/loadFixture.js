import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadFixture(nomeArquivo) {
  const caminho = path.join(__dirname, '..', 'fixtures', nomeArquivo);
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}
