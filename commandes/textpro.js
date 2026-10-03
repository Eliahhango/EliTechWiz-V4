const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { hango } = require('../framework/hango');

let handler = async (m, { conn, text }) => {
conn.reply(m.chat, Object.entries(await stylizeText(text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text)).map(([name, value]) => `*${name}*\n${value}`).join`\n\n`, m)
}
handler.help = ['style'].map(v => v + ' *<text>*')
handler.tags = ['tools']
handler.command = /^(style(text)?)$/i
//handler.exp = 0
module.exports = handler;
module.exports.default = handler;

const run = async (dest, hn, commandeOptions) => {
  const { ms, arg, msgRepondu, texte } = commandeOptions;
  const quotedText = extractText(msgRepondu);
  const text = arg && arg.length ? arg.join(' ') : '';
  const conn = {
    reply: (chat, content) => hn.sendMessage(chat, { text: content }, { quoted: ms }),
    sendMessage: (chat, content, opts) => hn.sendMessage(chat, content, opts)
  };
  await handler(
    { chat: dest, text: texte || '', quoted: quotedText ? { text: quotedText } : null },
    { conn, text }
  );
};

function extractText(msg) {
  try {
    const m = msg && (msg.message || msg);
    if (!m || typeof m !== 'object') return '';
    if (typeof m.conversation === 'string') return m.conversation;
    if (m.extendedTextMessage && typeof m.extendedTextMessage.text === 'string') return m.extendedTextMessage.text;
    for (const k in m) {
      const v = m[k];
      if (v && typeof v === 'object') {
        if (typeof v.text === 'string') return v.text;
        if (typeof v.caption === 'string') return v.caption;
      }
    }
  } catch (e) { /* ignore */ }
  return '';
}

hango({ nomCom: 'style', categorie: 'General', reaction: '🎨', desc: 'Fancy text styles' }, run);
hango({ nomCom: 'styletext', categorie: 'General', reaction: '🎨', desc: 'Fancy text styles' }, run);

async function stylizeText(text) {
let res = await fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text))
let html = await res.text()
let dom = new JSDOM(html)
let table = dom.window.document.querySelector('table').children[0].children
let obj = {}
for (let tr of table) {
let name = tr.querySelector('.aname').innerHTML
let content = tr.children[1].textContent.replace(/^\n/, '').replace(/\n$/, '')
obj[name + (obj[name] ? ' Reversed' : '')] = content
}
return obj
}
