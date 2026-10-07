import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const readJson = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const portableKeys = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  return Object.fromEntries(
    m[1].split(/\r?\n/).filter(Boolean).map((line) => {
      const i = line.indexOf(':');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
}

test('plugin.json has required metadata', () => {
  const p = readJson('.claude-plugin/plugin.json');
  assert.match(p.name, kebab);
  assert.match(p.version, /^\d+\.\d+\.\d+$/);
  assert.ok(p.description);
  assert.ok(p.author?.name);
  assert.equal(p.license, 'MIT');
});

test('marketplace.json lists this plugin from the repo root', () => {
  const m = readJson('.claude-plugin/marketplace.json');
  const p = readJson('.claude-plugin/plugin.json');
  assert.match(m.name, kebab);
  assert.ok(m.owner?.name);
  const entry = m.plugins.find((e) => e.name === p.name);
  assert.ok(entry, `no marketplace entry named ${p.name}`);
  assert.equal(entry.source, './');
});

test('CHANGELOG has an entry for the manifest version', () => {
  const { version } = readJson('.claude-plugin/plugin.json');
  assert.match(readFileSync(join(root, 'CHANGELOG.md'), 'utf8'), new RegExp(`## \\[${version.replaceAll('.', '\\.')}\\]`));
});

const skills = readdirSync(join(root, 'skills'), { withFileTypes: true }).filter((d) => d.isDirectory());

test('at least one skill exists', () => assert.ok(skills.length > 0));

for (const dir of skills) {
  test(`skill ${dir.name} follows the Agent Skills spec`, () => {
    const fm = frontmatter(readFileSync(join(root, 'skills', dir.name, 'SKILL.md'), 'utf8'));
    assert.ok(fm, 'SKILL.md must open with --- frontmatter');
    assert.equal(fm.name, dir.name, 'name must equal folder name');
    assert.match(fm.name, kebab);
    assert.ok(fm.name.length <= 64);
    assert.ok(fm.description, 'description required');
    assert.ok(fm.description.length <= 1024, `description is ${fm.description.length} chars`);
    for (const key of Object.keys(fm)) assert.ok(portableKeys.has(key), `non-portable key: ${key}`);
  });
}

test('hooks reference files that exist', () => {
  const text = readFileSync(join(root, 'hooks/hooks.json'), 'utf8');
  const hooks = JSON.parse(text).hooks;
  assert.ok(hooks.SessionStart?.length);
  for (const [, rel] of text.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^"\\]+)/g)) {
    assert.ok(existsSync(join(root, rel)), `missing ${rel}`);
  }
});
