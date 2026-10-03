const { hango } = require('../framework/hango');
const fs = require('fs');
const path = require('path');
const isOwner = require('../lib/isOwner');

const CONFIG_PATH = path.join(__dirname, '../data/antidelete.json');

function loadConfig() {
    if (!fs.existsSync(CONFIG_PATH)) return { enabled: false };
    return JSON.parse(fs.readFileSync(CONFIG_PATH));
}

function saveConfig(data) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

hango({
    nomCom: "antidelete",
    categorie: "owner",
    reaction: "🗑️",
    desc: "Enable or disable antidelete",
    nomFichier: __filename
}, async (dest, hn, { auteurMessage, arg, message }) => {

    if (!(await isOwner(auteurMessage, hn))) {
        return hn.sendMessage(dest, { text: "*Owner only command*" }, { quoted: message });
    }

    const config = loadConfig();

    if (!arg[0]) {
        return hn.sendMessage(dest, {
            text: `*ANTIDELETE*\n\nStatus: ${config.enabled ? 'ON' : 'OFF'}\n\n.antidelete on\n.antidelete off`
        }, { quoted: message });
    }

    if (arg[0] === 'on') config.enabled = true;
    if (arg[0] === 'off') config.enabled = false;

    saveConfig(config);

    hn.sendMessage(dest, {
        text: `✅ Antidelete ${config.enabled ? 'ENABLED' : 'DISABLED'}`
    }, { quoted: message });
});
