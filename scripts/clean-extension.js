const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const extensionDir = path.join(root, 'extension');
const archiveExtByTarget = {
  chrome: '.zip',
  firefox: '.xpi',
  opera: '.crx',
  safari: '.zip',
};

function remove(targetPath) {
  fs.rmSync(targetPath, { recursive: true, force: true });
}

const targets = process.argv.slice(2);

if (targets.length === 0) {
  remove(extensionDir);
  process.exit(0);
}

targets.forEach(target => {
  const archiveExt = archiveExtByTarget[target];

  if (!archiveExt) {
    throw new Error(`Unknown build target: ${target}`);
  }

  remove(path.join(extensionDir, target));
  remove(path.join(extensionDir, `${target}${archiveExt}`));
});
