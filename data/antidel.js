'use strict';
// Anti-delete scope settings (gc / dm), persisted in data/antidelete.json.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'antidelete.json');
const DEFAULTS = { gc: false, dm: false };

let store = { ...DEFAULTS };

function load() {
  try {
    store = { ...DEFAULTS, ...JSON.parse(fs.readFileSync(FILE, 'utf8')) };
  } catch (e) {
    store = { ...DEFAULTS };
  }
}

function save() {
  try {
    fs.writeFileSync(FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error('[antidel] unable to persist settings:', e.message);
  }
}

load();

function initializeAntiDeleteSettings() {
  load();
}

async function getAnti(scope) {
  load();
  return !!store[scope];
}

async function setAnti(scope, value) {
  load();
  const next = !!value;
  if (store[scope] !== next) {
    store[scope] = next;
    save();
  }
  return store[scope];
}

module.exports = { getAnti, setAnti, initializeAntiDeleteSettings };
