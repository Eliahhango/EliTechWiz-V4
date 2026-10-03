const { hango } = require('../framework/hango');
const fs = require('fs-extra');

hango({
    nomCom: "groupinfo",
    categorie: "Group",
    reaction: "👥",
    nomFichier: __filename
}, async (dest, hn, commandeOptions) => {
    const { repondre, ms } = commandeOptions;

    // Check if it's a group chat
    if (!dest.endsWith('@g.us')) {
        return repondre("❌ This command can only be used in group chats.");
    }

    try {
        const groupMeta = await hn.groupMetadata(dest);

        const groupName = groupMeta.subject || "Unknown Group";
        const groupDesc = groupMeta.desc || "No description available.";

        // Extract group admins
        const groupAdmins = groupMeta.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => `@${p.id.split('@')[0]}`)
            .join(', ') || "No admins found.";

        // Get group profile picture (if any)
        let groupPP;
        try {
            groupPP = await hn.profilePictureUrl(dest, 'image');
        } catch {
            groupPP = null;
        }

        const infoText = `👥 *Group Information*\n\n` +
                         `📛 *Name:* ${groupName}\n` +
                         `📝 *Description:* ${groupDesc}\n` +
                         `🛡️ *Admins:* ${groupAdmins}`;

        if (groupPP) {
            await hn.sendMessage(dest, {
                image: { url: groupPP },
                caption: infoText,
                mentions: groupMeta.participants.map(p => p.id)
            });
        } else {
            await repondre(infoText);
        }

    } catch (err) {
        console.error("❌ Error fetching group info:", err);
        await repondre(`❌ Error fetching group information:\n${err.message}`);
    }
});

// Log to confirm the command is loaded
console.log("✅ groupinfo command loaded successfully");
