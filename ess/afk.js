'use strict';
// AFK state store (file backed, replaces the old shared database).
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'afk.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function save(data) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('[afk] unable to persist state:', e.message);
  }
}

function recordId(id) {
  return String(id);
}

async function addOrUpdateAfk(id, message, lien) {
  const data = load();
  const key = recordId(id);
  const prev = data[key] || { etat: 'off' };
  data[key] = { ...prev, message: message || '', lien: lien || '' };
  save(data);
  return data[key];
}

async function getAfkById(id) {
  const data = load();
  return data[recordId(id)] || null;
}

async function changeAfkState(id, etat) {
  const data = load();
  const key = recordId(id);
  if (!data[key]) return 'not defined';
  data[key].etat = etat;
  save(data);
  return 'succes';
}

module.exports = { addOrUpdateAfk, getAfkById, changeAfkState };
