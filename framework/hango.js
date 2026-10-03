var tabCmds = [];
let cm = [];

/*
 * Command registry.
 *
 * Two registration schemas land in this file:
 *   1. native  -> hango({ nomCom: "x", categorie, reaction }, async (dest, hn, opts) => {})
 *   2. upstream -> cmd/smd({ pattern|cmdname|on, alias, category, react }, handler)
 *
 * Schema 2 is normalised here so every command is reachable from the dispatcher,
 * and its handler is adapted to the (dest, hn, commandeOptions) call convention.
 */

// upstream sometimes registers a regex as the pattern ("gpt ?(.*)") - the dispatcher
// matches plain text, so keep only the leading literal token
function literalName(name) {
    if (!/[\^$?*|\[\]()]/.test(name)) return name;
    const m = name.match(/^([A-Za-z0-9_-]+)/);
    return m ? m[1] : name;
}

function digits(v) {
    return String(v === null || v === undefined ? '' : v).replace(/[^0-9]/g, '');
}

function messageText(ms, mtype) {
    try {
        if (!ms || !ms.message) return '';
        const m = ms.message;
        if (typeof m.conversation === 'string') return m.conversation;
        if (mtype && m[mtype] && typeof m[mtype].text === 'string') return m[mtype].text;
        if (mtype && m[mtype] && typeof m[mtype].caption === 'string') return m[mtype].caption;
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

function buildContext(dest, hn, opts, nomCom) {
    opts = opts || {};
    const ms = opts.ms || null;
    const texte = typeof opts.texte === 'string' ? opts.texte : messageText(ms, opts.mtype);
    const args = Array.isArray(opts.arg) ? opts.arg : (texte ? texte.trim().split(/ +/).slice(1) : []);
    const q = args.join(' ');
    const sender = opts.auteurMessage || (ms && ms.key && ms.key.participant) || (ms && ms.key && ms.key.remoteJid) || '';
    const botJid = opts.idBot || '';
    const isOwner = !!opts.superUser;
    const groupMeta = opts.infosGroupe && typeof opts.infosGroupe === 'object' ? opts.infosGroupe : {};
    const participants = Array.isArray(groupMeta.participants) ? groupMeta.participants : [];
    const groupAdmins = participants
        .filter((p) => p && p.admin)
        .map((p) => p.id || p.jid || p.phoneNumber)
        .filter(Boolean);

    const reply = function (t, o) {
        if (typeof opts.repondre === 'function') return opts.repondre(typeof t === 'string' ? t : JSON.stringify(t), o);
        return hn.sendMessage(dest, { text: String(t) }, { quoted: ms });
    };
    const send = function (to, content, o) {
        if (to === undefined || to === null) to = dest;
        if (typeof content === 'string') content = { text: content };
        return hn.sendMessage(to, content, o);
    };
    const react = function (emoji) {
        try { return hn.sendMessage(dest, { react: { text: emoji, key: ms && ms.key } }); } catch (e) { return undefined; }
    };
    const error = function (e) {
        console.log('command error [' + nomCom + ']: ' + (e && e.message ? e.message : e));
    };

    // message model handed to 2nd/3rd handler slots
    const model = {
        key: ms ? ms.key : null,
        message: ms ? ms.message : null,
        id: ms && ms.key ? ms.key.id : null,
        from: dest, chat: dest, jid: dest,
        sender: sender, user: sender,
        senderNumber: digits(sender), num: digits(sender),
        bot: hn, client: hn, conn: hn, socket: hn,
        body: texte, text: texte, texte: texte,
        args: args, arg: args, q: q, query: q, match: q,
        prefix: opts.prefixe || '',
        command: nomCom, cmd: nomCom, mnu: nomCom,
        pushname: opts.nomAuteurMessage || '',
        isGroup: !!opts.verifGroupe,
        isCreator: isOwner, isOwner: isOwner, isMe: isOwner, fromMe: isOwner,
        quoted: opts.msgRepondu || null,
        mentionedJid: sender ? [sender] : [],
        ms: ms, mtype: opts.mtype,
        reply: reply, send: send, react: react, error: error,
        replyText: reply, sendMessage: send,
        delete: function (o) { return hn.sendMessage(dest, o); },
    };

    // 4th slot handed to `cmd`-style handlers
    const context = {
        from: dest, l: args, quoted: opts.msgRepondu || null, body: texte,
        isCmd: true, command: nomCom, args: args, q: q, text: q,
        isGroup: !!opts.verifGroupe,
        sender: sender, senderNumber: digits(sender),
        botNumber: digits(botJid), botNumber2: digits(botJid),
        pushname: opts.nomAuteurMessage || '',
        isMe: isOwner, isOwner: isOwner, isCreator: isOwner, fromMe: isOwner,
        groupMetadata: groupMeta, groupName: opts.nomGroupe || groupMeta.subject || '',
        participants: participants, groupAdmins: groupAdmins,
        isBotAdmins: !!opts.verifhangoAdmin, isAdmins: !!opts.verifAdmin,
        reply: reply, send: send, react: react, error: error, mnu: nomCom,
        prefix: opts.prefixe, texte: texte, ms: ms, mtype: opts.mtype,
        nomCom: nomCom,
    };

    return { conn: hn, mek: ms, m: model, message: model, text: q, context: context, reply: reply };
}

function adaptHandler(fn, nomCom, style) {
    const arity = typeof fn === 'function' ? fn.length : 0;
    const second = function (c) {
        return { text: c.text, match: c.text, args: c.message.args, q: c.text, query: c.text,
                 prefix: c.message.prefix, command: nomCom };
    };
    return function (dest, hn, opts) {
        const c = buildContext(dest, hn, opts, nomCom);
        if (style === 'smd') return arity <= 1 ? fn(c.message, second(c)) : fn(c.message, c.text);
        if (style === 'cmd') {
            if (arity >= 4) return fn(c.conn, c.mek, c.m, c.context);
            if (arity === 3) return fn(c.conn, c.mek, c.m);
            return arity <= 1 ? fn(c.message, second(c)) : fn(c.message, c.text);
        }
        if (arity >= 4) return fn(c.conn, c.mek, c.m, c.context);
        if (arity === 3) return fn(c.conn, c.mek, c.m);
        if (arity <= 1) return fn(c.message, second(c));
        return fn(c.message, c.text);
    };
}

function hango(obj, fonctions) {
    let infoComs = obj && typeof obj === 'object' ? obj : {};

    // normalise the upstream schema (pattern / cmdname / alias / on)
    const isUpstream = !infoComs.nomCom &&
        (infoComs.pattern || infoComs.cmdname || infoComs.alias || infoComs.on);
    if (!infoComs.nomCom) {
        const candidate = infoComs.pattern || infoComs.cmdname ||
            (Array.isArray(infoComs.alias) && infoComs.alias.length ? infoComs.alias[0] : null);
        if (candidate) infoComs.nomCom = literalName(String(candidate));
        else if (infoComs.on) infoComs.nomCom = '\u0000on:' + infoComs.on; // hook only, never user-matchable
    }
    if (infoComs.nomCom !== undefined && infoComs.nomCom !== null) {
        infoComs.nomCom = String(infoComs.nomCom).toLowerCase();
    }

    if (!infoComs.categorie) infoComs.categorie = infoComs.category || infoComs.Categorie || infoComs.type || 'General';
    if (!infoComs.reaction) infoComs.reaction = infoComs.react || '🥶';
    if (!infoComs.alias && infoComs.aliases) infoComs.alias = infoComs.aliases;
    // some modules put the handler inside the options object instead of the 2nd argument
    if (!fonctions && typeof infoComs.handler === 'function') {
        fonctions = infoComs.handler;
        if (!infoComs.__style) infoComs.__style = 'smd';
    }
    const style = infoComs.__style;
    infoComs.fonction = (style || isUpstream) && typeof fonctions === 'function'
        ? adaptHandler(fonctions, infoComs.nomCom || '', style)
        : fonctions;
    if (infoComs.on && !infoComs.pattern && !infoComs.cmdname) infoComs.onHook = true;

    cm.push(infoComs);
    return infoComs;
}

module.exports = { hango, Module: hango, cm };
