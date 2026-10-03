'use strict';
// Compatibility barrel for commands that import `../lib`.
//
// Historically this path resolved to a large helper module that exposed the
// command registrar plus a handful of small stores.  Everything a command
// actually imports from here is re-exported below.

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { hango, cm } = require('../framework/hango');
const set = require('../set');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'libstore.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

/* ------------------------------------------------------------------ */
/* generic JSON stores                                                 */
/* ------------------------------------------------------------------ */

function readFile(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return fallback;
  }
}

function writeFile(file, data) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('[lib] unable to persist', path.basename(file), '-', e.message);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* notes: add / list / delete                                          */
/* ------------------------------------------------------------------ */

function chatIdOf(message) {
  return (
    (message && (message.chat || message.jid || message.remoteJid)) ||
    (message && message.key && message.key.remoteJid) ||
    'default'
  );
}

const note = {
  async addnote(message, text) {
    const notes = readFile(NOTES_FILE, []);
    const id = notes.length ? Number(notes[notes.length - 1].id) + 1 : 1;
    notes.push({ id, chat: chatIdOf(message), text });
    writeFile(NOTES_FILE, notes);
    return { msg: `✅ Note saved with ID ${id}`, id };
  },
  async allnotes(message, selector) {
    const chat = chatIdOf(message);
    const notes = readFile(NOTES_FILE, []).filter((n) => n.chat === chat);
    if (selector && selector !== 'all') {
      const found = notes.find((n) => String(n.id) === String(selector));
      return { msg: found ? `*Note ${found.id}*\n${found.text}` : `❌ Note ${selector} not found.` };
    }
    if (!notes.length) return { msg: '📭 No notes saved yet.' };
    return {
      msg: notes.map((n) => `*${n.id}.* ${n.text}`).join('\n'),
      notes
    };
  },
  async delnote(message, id) {
    const chat = chatIdOf(message);
    const notes = readFile(NOTES_FILE, []);
    const next = notes.filter((n) => !(n.chat === chat && String(n.id) === String(id)));
    if (next.length === notes.length) return { msg: `❌ Note ${id} not found.` };
    writeFile(NOTES_FILE, next);
    return { msg: `🗑️ Note ${id} deleted.` };
  },
  async delallnote(message) {
    const chat = chatIdOf(message);
    const notes = readFile(NOTES_FILE, []);
    const next = notes.filter((n) => n.chat !== chat);
    writeFile(NOTES_FILE, next);
    return { msg: `🗑️ Deleted ${notes.length - next.length} note(s).` };
  }
};

/* ------------------------------------------------------------------ */
/* per-chat bot settings (used by rank / antidelete style commands)    */
/* ------------------------------------------------------------------ */

function makeBotStore() {
  const memory = readFile(STORE_FILE, {});
  const persist = () => writeFile(STORE_FILE, memory);

  const api = {
    async findOne(query) {
      const id = query && query.id;
      return memory[id] || null;
    },
    async new(doc) {
      if (!doc || doc.id === undefined) return null;
      if (!memory[doc.id]) memory[doc.id] = doc;
      persist();
      return memory[doc.id];
    },
    async updateOne(query, patch) {
      const id = query && query.id;
      if (!memory[id]) return null;
      memory[id] = { ...memory[id], ...(patch || {}) };
      persist();
      return memory[id];
    },
    async deleteOne(query) {
      const id = query && query.id;
      if (memory[id] === undefined) return null;
      const prev = memory[id];
      delete memory[id];
      persist();
      return prev;
    }
  };

  return new Proxy(api, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === 'symbol') return undefined;
      return memory[prop];
    },
    set(target, prop, value) {
      memory[prop] = value;
      persist();
      return true;
    }
  });
}

/* ------------------------------------------------------------------ */
/* small AI helpers                                                    */
/* ------------------------------------------------------------------ */

async function openaiRequest(payload) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not configured');
  const res = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
    headers: { Authorization: `Bearer ${key}` },
    timeout: 60000
  });
  return res.data;
}

async function getGPTResponse(prompt, model = 'gpt-4o-mini') {
  const data = await openaiRequest({
    model,
    messages: [{ role: 'user', content: String(prompt) }],
    temperature: 0.7
  });
  return data.choices[0].message.content;
}

async function getDallEResponse(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not configured');
  const res = await axios.post(
    'https://api.openai.com/v1/images/generations',
    { model: 'dall-e-3', prompt: String(prompt), n: 1, size: '1024x1024' },
    { headers: { Authorization: `Bearer ${key}` }, timeout: 120000 }
  );
  return res.data.data[0].url;
}

async function botpic() {
  return set.DP || set.URL || set.BOT || '';
}

const stor = Object.assign(
  async function stor(key, value) {
    const memory = readFile(STORE_FILE, {});
    if (value === undefined) return memory[key];
    memory[key] = value;
    writeFile(STORE_FILE, memory);
    return value;
  },
  {
    async get(key) {
      const memory = readFile(STORE_FILE, {});
      return memory[key];
    },
    async set(key, value) {
      const memory = readFile(STORE_FILE, {});
      memory[key] = value;
      writeFile(STORE_FILE, memory);
      return value;
    }
  }
);

module.exports = {
  // registrar aliases
  smd: hango,
  cmd: hango,
  command: hango,
  bot: hango,
  commands: cm,

  // settings / misc
  prefix: set.PREFIXE || '.',
  Config: set,
  config: set,
  settings: set,
  tlang: {},
  botpic,
  isGroup: (jid) => typeof jid === 'string' && /@g\.us$/.test(jid),

  // stores
  bot_: makeBotStore(),
  note,
  stor,

  // AI
  getGPTResponse,
  getDallEResponse
};
