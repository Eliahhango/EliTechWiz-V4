const { hango } = require("../framework/hango");

hango({
    nomCom: "person",
    aliases: ["userinfo", "profile"],
    desc: "Get complete user profile information",
    categorie: "Utility"
},
async (dest, hn, commandOptions) => {
    const { repondre, arg, ms, auteurMsg, verifGroupe, nomAuteurMessage, msgRepondu, auteurMsgRepondu, infosGroupe } = commandOptions;
    try {
        // 0. CHECK IF USER PROVIDED TARGET
        if (!msgRepondu && !arg[0]) {
            return repondre(
`❗ Usage:    .person <number>    .person @user (in group)   Or reply a user's message with .person`
            );
        }

        // 1. DETERMINE TARGET USER
        let userJid = msgRepondu ? auteurMsgRepondu : 
                      (arg[0] ? arg[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net" : auteurMsg);

        // 2. VERIFY USER EXISTS
        const [user] = await hn.onWhatsApp(userJid).catch(() => []);
        if (!user?.exists) return repondre("❌ User not found on WhatsApp");

        // 3. GET PROFILE PICTURE
        let ppUrl;
        try {
            ppUrl = await hn.profilePictureUrl(userJid, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        // 4. GET NAME (fixed using sample logic + hn.getName)
        let userName = "Unknown";
        try {
            userName = await hn.getName(userJid);
        } catch {
            if (msgRepondu) {
                userName = "@" + userJid.split("@")[0]; // kama mfano wako
            } else if (nomAuteurMessage) {
                userName = nomAuteurMessage; // jina la mwenye message
            } else if (verifGroupe) {
                const member = infosGroupe.participants.find(p => p.id === userJid);
                if (member?.name) userName = member.name;
                else if (member?.notify) userName = member.notify;
                else if (member?.pushname) userName = member.pushname;
            } else {
                userName = userJid.split("@")[0];
            }
        }

        // 5. GET BIO/ABOUT
        let bio = {};
        try {
            const statusData = await hn.fetchStatus(userJid).catch(() => null);
            if (statusData?.status) {
                bio = {
                    text: statusData.status,
                    type: "Personal",
                    updated: statusData.setAt ? new Date(statusData.setAt * 1000) : null
                };
            } else {
                const businessProfile = await hn.getBusinessProfile(userJid).catch(() => null);
                if (businessProfile?.description) {
                    bio = {
                        text: businessProfile.description,
                        type: "Business",
                        updated: null
                    };
                }
            }
        } catch (e) {
            console.log("Bio fetch error:", e);
        }

        // 6. GROUP ROLE
        let groupRole = "";
        if (verifGroupe) {
            const participant = infosGroupe.participants.find(p => p.id === userJid);
            groupRole = participant?.admin ? "👑 Admin" : "👥 Member";
        }

        // 7. FORMAT OUTPUT
        const formattedBio = bio.text ? 
            `${bio.text}\n└─ 📌 ${bio.type} Bio${bio.updated ? ` | 🕒 ${bio.updated.toLocaleString()}` : ''}` : 
            "No bio available";

        const userInfo = `
*GC MEMBER INFORMATION 🧊*

📛 *Name:* ${userName}
🔢 *Number:* ${userJid.replace(/@.+/, '')}
📌 *Account Type:* ${user.isBusiness ? "💼 Business" : user.isEnterprise ? "🏢 Enterprise" : "👤 Personal"}

*📝 About:*
${formattedBio}

*⚙️ Account Info:*
✅ Registered: ${user.isUser ? "Yes" : "No"}
🛡️ Verified: ${user.verifiedName ? "✅ Verified" : "❌ Not verified"}
${verifGroupe ? `👥 *Group Role:* ${groupRole}` : ''}
`.trim();

        // 8. SEND RESULT
        await hn.sendMessage(dest, {
            image: { url: ppUrl },
            caption: userInfo,
            mentions: [userJid]
        }, { quoted: ms });

    } catch (e) {
        console.error("Person command error:", e);
        repondre(`❌ Error: ${e.message || "Failed to fetch profile"}`);
    }
});
