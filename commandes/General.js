const { hango } = require("../framework/hango");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../ess/sudo");
const conf = require("../set");

hango({ nomCom: "owner", categorie: "General", reaction: "👑" }, async (dest, hn, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;
    
    const thsudo = await isSudoTableNotEmpty();

    if (thsudo) {
        let msg = `*╭─────❰ 👑 OWNER INFO 👑 ❱─────╮*
│
│ *👤 MAIN OWNER*
│ • @${conf.NUMERO_OWNER}
│
│ *💫 SUPER USERS*
`;
        
        let sudos = await getAllSudoNumbers();

        for (const sudo of sudos) {
            if (sudo) {
                sudonumero = sudo.replace(/[^0-9]/g, '');
                msg += `│ • @${sudonumero}\n`;
            }
        }
        
        msg += `│
╰────────────────────────╯`;

        const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g) + "@s.whatsapp.net";
        const mentionedJid = sudos.concat([ownerjid]);

        hn.sendMessage(
            dest,
            {
                image: { url: mybotpic() },
                caption: msg,
                mentions: mentionedJid
            }
        );
    } else {
        const vcard =
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN:' + conf.OWNER_NAME + '\n' +
            'ORG:𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4;\n' +
            'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' +
            'END:VCARD';
        hn.sendMessage(dest, {
            contacts: {
                displayName: conf.OWNER_NAME,
                contacts: [{ vcard }],
            },
        }, { quoted: ms });
    }
});

hango({ nomCom: "dev", categorie: "General", reaction: "👨‍💻" }, async (dest, hn, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    const devs = [
        { nom: "Eliah", numero: "255617834510" },
        { nom: "Eliah", numero: "255755566045" }
    ];

    let message = `*╭─────❰ 👨‍💻 DEVELOPERS 👨‍💻 ❱─────╮*
│
│ *Welcome to 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4*
│ *Development Support Center!*
│
│ *Available Developers:*\n`;

    for (const dev of devs) {
        message += `│ • ${dev.nom}
│   wa.me/${dev.numero}
│
`;
    }
    
    message += `╰────────────────────────╯`;

    var lien = mybotpic();
    if (lien.match(/\.(mp4|gif)$/i)) {
        try {
            hn.sendMessage(dest, { video: { url: lien }, caption: message }, { quoted: ms });
        } catch (e) {
            console.log("🔴 Error in menu: " + e);
            repondre("🔴 Error occurred: " + e);
        }
    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            hn.sendMessage(dest, { image: { url: lien }, caption: message }, { quoted: ms });
        } catch (e) {
            console.log("🔴 Error in menu: " + e);
            repondre("🔴 Error occurred: " + e);
        }
    } else {
        repondre("❌ Invalid media link");
    }
});

hango({ nomCom: "support", categorie: "General", reaction: "💫" }, async (dest, hn, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions;

    const supportMessage = `*╭─────❰ 🌟 SUPPORT LINKS 🌟 ❱─────╮*
│
│ *📢 Official Channel*
│ • https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s
│
│ *👥 Community Group*
│ • https://chat.whatsapp.com/Lh5EQEYJn5VIa4atNRPBm5
│
│ *🎥 YouTube Channel*
│ • https://youtube.com/@eliahhango
│
│ *Powered by 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4* ✨
╰────────────────────────╯`;

    repondre(supportMessage);
    await hn.sendMessage(auteurMessage, {
        text: `*Thank you for choosing 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4!* 🌟\nMake sure to check out all our support links for the best experience!`,
        quoted: ms
    });
});
