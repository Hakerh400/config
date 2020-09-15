'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const O = require('omikron');
const config = require('./config');

const hase = name => {
  const pth = getExe(name, 0);
  return name !== null;
};

const getExe = (name, force=0) => {
  const notFound = () => {
    if(force === 0) return null;
    missingExe(name, force);
  };

  assert(O.has(config, 'exe'));

  const {exe} = config;

  assert(exe !== null && typeof exe === 'object');
  assert(O.has(exe, name));

  const pth = exe[name];
  if(pth === null) return notFound();

  assert(typeof pth === 'string');
  assert(path.isAbsolute(pth));

  if(!fs.existsSync(pth)) return notFound();

  return pth
};

const missingExe = name => {
  O.error(
    `Unable to find a valid ${O.sf(name)} executable.\n` +
    `Please add the full path to your ${O.sf(name)} executable file\n` +
    `into "node_modules/@hakerh400/config/src/config.json"\n` +
    `Note: use forward slashes in the path name, even if\n` +
    `you are using Windows`
  );
};

module.exports = Object.assign(config, {
  getExe,
  missingExe,
});