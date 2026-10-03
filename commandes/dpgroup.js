const { hango } = require('../framework/hango');
const fs = require('fs-extra');

// dpgroup Command - Group Display Picture
hango({
    nomCom: "dpgroup",
    categorie: "Group",
    reaction: "🖼️",
    nomFichier: __filename
}, async (dest, hn, commandeOptions) => {
    const { repondre, ms, auteurMessage } = commandeOptions;

    if (!dest.includes('@g.us')) {
        return repondre("❌ This command can only be used in group chats.");
    }

    try {
        const groupId = dest;
        const groupMetadata = await hn.groupMetadata(groupId);
        const groupName = groupMetadata.subject || "Unknown Group";

        const groupPP = await hn.profilePictureUrl(groupId, 'image').catch(() => null);

        if (groupPP) {
            await hn.sendMessage(dest, {
                image: { url: groupPP },
                caption: `🖼️ *Group Profile Picture*\n\n📛 *Group Name:* ${groupName}`
            });
        } else {
            await repondre("❌ This group does not have a profile picture or it is hidden.");
        }
    } catch (err) {
        console.error("Error fetching group profile picture:", err);
        await repondre(`❌ An error occurred while fetching the group profile picture: ${err.message}`);
    }
});
