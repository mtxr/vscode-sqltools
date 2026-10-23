const fs = require('fs');
const path = require('path');

const extensionDirectory = path.join(__dirname, '..', 'packages', 'extension');
const manifest = readJson(path.join(extensionDirectory, 'package.json'));
const english = readJson(path.join(extensionDirectory, 'package.nls.json'));
const spanish = readJson(path.join(extensionDirectory, 'package.nls.es.json'));
const fields = new Set([
  'displayName',
  'description',
  'title',
  'category',
  'markdownDescription',
  'name',
  'contents',
  'enumDescriptions',
]);
const references = new Set();

walk(manifest);
assertSameKeys(references, new Set(Object.keys(english)), 'English catalog');
assertSameKeys(references, new Set(Object.keys(spanish)), 'Spanish catalog');

for (const key of references) {
  assertTokensMatch(english[key], spanish[key], key, /command:[^)\s]+/g, 'command URI');
  assertTokensMatch(english[key], spanish[key], key, /https?:\/\/[^\s)]+/g, 'URL');
}

console.log(`Localization catalogs are synchronized (${references.size} keys).`);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function walk(value, pathParts = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, pathParts.concat(index)));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => walk(item, pathParts.concat(key)));
    return;
  }

  const field = pathParts[pathParts.length - 1];
  const isRootName = pathParts.length === 1 && field === 'name';
  if (typeof value !== 'string' || !fields.has(field) || isRootName || pathParts.includes('badges')) {
    return;
  }

  const match = /^%([^%]+)%$/.exec(value);
  if (!match) {
    throw new Error(`Expected a localization reference at ${pathParts.join('.')}.`);
  }
  references.add(match[1]);
}

function assertSameKeys(actual, expected, label) {
  const missing = [...actual].filter(key => !expected.has(key));
  const extra = [...expected].filter(key => !actual.has(key));
  if (missing.length || extra.length) {
    throw new Error(
      `${label} keys are out of sync. Missing: ${missing.join(', ') || 'none'}. Extra: ${extra.join(', ') || 'none'}.`
    );
  }
}

function assertTokensMatch(englishValue, spanishValue, key, expression, tokenName) {
  const englishTokens = englishValue.match(expression) || [];
  const spanishTokens = spanishValue.match(expression) || [];
  if (englishTokens.join('\n') !== spanishTokens.join('\n')) {
    throw new Error(`${tokenName} mismatch in ${key}.`);
  }
}
