/**

//══════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                      //
//                                         Ｖ：1．2．2                                                   //
//                                                                                                      //
//    ███████╗██╗     ██╗████████╗███████╗ ██████╗██╗  ██╗██╗    ██╗██╗███████╗      ██╗   ██╗██╗  ██╗  //
//    ██╔════╝██║     ██║╚══██╔══╝██╔════╝██╔════╝██║  ██║██║    ██║██║╚══███╔╝      ██║   ██║██║  ██║  //
//    █████╗  ██║     ██║   ██║   █████╗  ██║     ███████║██║ █╗ ██║██║  ███╔╝ █████╗██║   ██║███████║  //
//    ██╔══╝  ██║     ██║   ██║   ██╔══╝  ██║     ██╔══██║██║███╗██║██║ ███╔╝  ╚════╝╚██╗ ██╔╝██╔══██║  //
//    ███████╗███████╗██║   ██║   ███████╗╚██████╗██║  ██║╚███╔███╔╝██║███████╗       ╚████╔╝ ██║  ██║  //
//    ╚══════╝╚══════╝╚═╝   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝╚══════╝        ╚═══╝  ╚═╝  ╚═╝  //
//                                                                                                      //
//                                                                                                      //
//══════════════════════════════════════════════════════════════════════════════════════════════════════//

CURRENTLY RUNNING ON BETA VERSION!!
*
   * @project_name : EliTechWiz-V4
   * @author : EliTechWiz
   * @youtube : https://www.youtube.com/c/@eliahhango
   * @infoription : EliTechWiz ,A Multi-functional whatsapp user bot.
   * @version 1.2.2 
*
   * Licensed under the  GPL-3.0 License;
* 
   * ┌┤Created By EliTechWiz.
   * © 2025 EliTechWiz ✭ ⛥.
   * plugin date : 28/3/2025
* 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
**/

const { hango } = require("../framework/hango");
const conf = require(__dirname + "/../set");
const Levels = require("discord-xp");

hango({
    nomCom: "rank",
    aliases: ["checkrank", "level"],
    desc: "Check your current rank and level in the group.",
    categorie: "rank",
    reaction: "⭐",
}, async (dest, hn, context) => {
    const { repondre, arg } = context;
    
    if (!global.isMongodb) {
        return repondre("❌ MongoDB connection required for rank system!");
    }
    
    try {
        // Get user's rank data
        const user = dest.reply_message ? dest.reply_message.sender : dest.sender;
        const userRank = await Levels.fetch(user, "RandomXP");
        
        if (!userRank) {
            return repondre("❌ You haven't earned any XP yet!");
        }
        
        // Format and send rank info
        const rankInfo = `
*🎯 RANK INFORMATION*
👤 *User*: ${dest.pushName}
📊 *Level*: ${userRank.level}
⭐ *XP*: ${userRank.xp} / ${Levels.xpFor(userRank.level + 1)}
`;
        
        await repondre(rankInfo);
        
    } catch (error) {
        console.error("Rank command error:", error);
        return repondre("❌ Error fetching rank data!");
    }
});

// Ranking functionality
let bots = false;
const { 
	smd, 
	tlang, 
	prefix,
	bot_
	} = require('../lib')
const Levels = require("discord-xp");
var isLvl;
async function levelss() {
    try{ 
       if(isMongodb)(
		isLvl = await Levels.setURL(mongodb || "mongodb://uwrr2obvrb4kbwnrvimy:rbgieh8nfk7EylXCh2D@byg4ii8uzy5rro8bcdfu-mongodb.services.clever-cloud.com:2008/byg4ii8uzy5rro8bcdfu")
        )
    }catch(e){}
} 
levelss()


//============================================================================
let utd = false;
let groupRankSettings = {};

// Function to check if ranking is enabled for a specific group
async function isRankEnabled(groupJid) {
    try {
        if (!groupRankSettings[groupJid]) {
            // Get group settings from database or initialize if not found
            const settings = await bot_.findOne({ id: `rank_${groupJid}` }) || 
                            await bot_.new({ id: `rank_${groupJid}`, enabled: 'true' });
            groupRankSettings[groupJid] = settings.enabled === 'true';
        }
        return groupRankSettings[groupJid];
    } catch (e) {
        console.error("Error checking rank status:", e);
        return false;
    }
}

// Command to toggle ranking system on/off for groups
hango({
    nomCom: "togglerank",
    desc: "Toggle ranking system on/off for current group",
    categorie: "group",
    use: "<on/off>",
    filename: __filename,
}, async (dest, hn, commandOptions) => {
    const { arg, repondre } = commandOptions;
    try {
        if (!global.isMongodb) return await repondre(dest.isCreator ? 
            `*_Add MONGODB_URI to use these cmds_*` : 
            `*_Please ask my Owner to add MONGODB_URI!_*`);
        
        if (!dest.isGroup) return await repondre("*_This command is only for groups!_*");
        
        // Check if user has admin rights or is the bot creator
        const isAdmin = dest.isCreator || await dest.isAdmin();
        if (!isAdmin) return await repondre("*_This command is only for admins!_*");
        
        const groupJid = dest.chat;
        const toggle = arg.toLowerCase().split()[0].trim();
        
        // Get current settings or create new if not found
        const settings = await bot_.findOne({ id: `rank_${groupJid}` }) || 
                        await bot_.new({ id: `rank_${groupJid}`, enabled: 'true' });
        
        if (toggle === 'on' || toggle === 'enable' || toggle === 'act') {
            if (settings.enabled === 'true') {
                return await repondre("*Ranking system already enabled for this group!*");
            }
            
            await bot_.updateOne({ id: `rank_${groupJid}` }, { enabled: 'true' });
            groupRankSettings[groupJid] = true;
            return await repondre("*Ranking system successfully enabled for this group!*");
            
        } else if (toggle === 'off' || toggle === 'disable' || toggle === 'deact') {
            if (settings.enabled === 'false') {
                return await repondre("*Ranking system already disabled for this group!*");
            }
            
            await bot_.updateOne({ id: `rank_${groupJid}` }, { enabled: 'false' });
            groupRankSettings[groupJid] = false;
            return await repondre("*Ranking system successfully disabled for this group!*");
            
        } else {
            // If no parameter provided, show current status
            const status = settings.enabled === 'true' ? 'enabled' : 'disabled';
            return await repondre(`*Ranking system is currently ${status} for this group!*\n\n*Use _${prefix}togglerank on/off_ to change settings.*`);
        }
    } catch (e) {
        console.error(`Error in togglerank command: ${e}`);
        await repondre("*Error occurred while toggling rank system!*");
    }
});

// Command to toggle level-up notifications
hango({
    nomCom: "levelup",
    desc: "turn On/Off level-up notifications",
    fromMe: true,
    categorie: "level",
    use: "<on/off>",
    filename: __filename,
}, async (dest, hn, commandOptions) => {
    const { arg, repondre } = commandOptions;
    try {
        if (!global.isMongodb) return await repondre(dest.isCreator ? 
            `*_Add MONGODB_URI to use these cmds_*` : 
            `*_Please ask my Owner to add MONGODB_URI!_*`);
            
        let bgmm = await bot_.findOne({ id: `bot_${dest.user}` }) || 
                  await bot_.new({ id: `bot_${dest.user}` });
                  
        let toggle = arg.toLowerCase().split()[0].trim();
        utd = true;
        
        if (toggle === 'on' || toggle === 'enable' || toggle === 'act') {
            if (bgmm.levelup === 'true') return await repondre("*Level-up notifications already enabled!*");
            await bot_.updateOne({ id: `bot_${dest.user}` }, { levelup: 'true' });
            return await repondre("*Level-up notifications successfully enabled*");
            
        } else if (toggle === 'off' || toggle === 'disable' || toggle === 'deact') {
            if (bgmm.levelup === 'false') return await repondre("*Level-up notifications already disabled*");
            await bot_.updateOne({ id: `bot_${dest.user}` }, { levelup: 'false' });
            return await repondre("*Level-up notifications successfully deactivated*");
            
        } else {
            return await repondre(`*_Use on/off to enable/disable level-up notifications!_*`);
        }
    } catch (e) { 
        await error(`${e}\n\nCommand: levelup`, e);
    }
});

// Command to show user's profile
hango({
    nomCom: "profile",
    info: "Shows profile of user",
    type: "level",
    use: "<@user>",
    filename: __filename,
}, async (dest, hn, commandOptions) => {
    const { repondre } = commandOptions;
    try {       
        if (!global.isMongodb) return await repondre(dest.isCreator ? 
            `*_Add MONGODB_URI to use these cmds_*` : 
            `*_Please ask my Owner to add MONGODB_URI!_*`);
            
        // If in a group, check if ranking is enabled
        if (dest.isGroup) {
            const rankEnabled = await isRankEnabled(dest.chat);
            if (!rankEnabled && !dest.isCreator) {
                return await repondre("*Ranking system is disabled in this group!*");
            }
        }
        
        let meh = dest.sender;
        if (dest.isCreator) { 
            meh = dest.reply_message ? dest.reply_message.sender : 
                 dest.mentionedJid[0] ? dest.mentionedJid[0] : dest.sender; 
        }
        
        var bio = await hn.fetchStatus(meh);
        var bioo = bio.status;
       
        const userq = await Levels.fetch(meh, "RandomXP");
        const lvpoints = userq.level;
        var role = "GOD✨";
        
        if (lvpoints <= 2) { var role = "🏳Citizen"; } 
        else if (lvpoints <= 4) { var role = "👼Baby Wizard"; } 
        else if (lvpoints <= 6) { var role = "🧙‍♀️Wizard"; } 
        else if (lvpoints <= 8) { var role = "🧙‍♂️Wizard Lord"; }
        else if (lvpoints <= 10) { var role = "🧚🏻Baby Mage"; } 
        else if (lvpoints <= 12) { var role = "🧜Mage"; } 
        else if (lvpoints <= 14) { var role = "🧜‍♂️Master of Mage"; } 
        else if (lvpoints <= 16) { var role = "🌬Child of Nobel"; } 
        else if (lvpoints <= 18) { var role = "❄Nobel"; }
        else if (lvpoints <= 20) { var role = "⚡Speed of Elite"; } 
        else if (lvpoints <= 22) { var role = "🎭Elite"; } 
        else if (lvpoints <= 24) { var role = "🥇Ace I"; }
        else if (lvpoints <= 26) { var role = "🥈Ace II"; } 
        else if (lvpoints <= 28) { var role = "🥉Ace Master"; }
        else if (lvpoints <= 30) { var role = "🎖Ace Dominator"; } 
        else if (lvpoints <= 32) { var role = "🏅Ace Elite"; }
        else if (lvpoints <= 34) { var role = "🏆Ace Supreme"; }
        else if (lvpoints <= 36) { var role = "💍Supreme I"; }
        else if (lvpoints <= 38) { var role = "💎Supreme II"; } 
        else if (lvpoints <= 40) { var role = "🔮Supreme Master"; } 
        else if (lvpoints <= 42) { var role = "🛡Legend III"; } 
        else if (lvpoints <= 44) { var role = "🏹Legend II"; } 
        else if (lvpoints <= 46) { var role = "⚔Legend"; } 
        else if (lvpoints <= 55) { var role = "🐉Immortal"; }
    
        let ttms = userq.xp / 8;
        var pfp = await dest.getpp(meh);
        var naam_ser;
        try { 
            naam_ser = await hn.getName(meh); 
        } catch { 
            naam_ser = "User"; 
        }
            
        const profile = `
*Hii ${dest.senderName || "there"},*

*Here is profile information*
*👤Username:* ${naam_ser}
*⚡Bio:* ${bioo}
*🧩Role:* ${role}
*🍁Level:* ${userq.level || "infinity"}
*📥Total Messages:* ${ttms || "infinity"}
*Powered by ${tlang().title}*
`;
            
        hn.sendMessage(dest.chat, { 
            image: { url: pfp },
            caption: profile 
        }, { quoted: dest });
        
    } catch(e) { 
        await error(`${e}\n\ncommand: profile`, e, `*ERR: Can't fetch data!*`); 
    }
});

// Command to show user's rank
hango({
    nomCom: "userrank",
    aliases: ["myrank"],
    info: "Sends rank card of user",
    type: "level",
    use: "<@user>",
    filename: __filename,
}, async (dest, hn, commandOptions) => {
    const { repondre } = commandOptions;
    try {
        if (!global.isMongodb) return await repondre(dest.isCreator ? 
            `*_Please add MONGODB_URI to use this feature_*` : 
            `*_Please ask my Owner to add MONGODB_URI!_*`);
            
        // If in a group, check if ranking is enabled
        if (dest.isGroup) {
            const rankEnabled = await isRankEnabled(dest.chat);
            if (!rankEnabled && !dest.isCreator) {
                return await repondre("*Ranking system is disabled in this group!*");
            }
        }
            
        let meh = dest.sender;
        if (dest.isCreator) { 
            meh = dest.reply_message ? dest.reply_message.sender : 
                 dest.mentionedJid[0] ? dest.mentionedJid[0] : dest.sender; 
        }
          
        const userq = await Levels.fetch(meh, "RandomXP");
        const lvpoints = userq.level;
        var role = "GOD✨";
        
        if (lvpoints <= 2) { var role = "🏳Citizen"; } 
        else if (lvpoints <= 4) { var role = "👼Baby Wizard"; } 
        else if (lvpoints <= 6) { var role = "🧙‍♀️Wizard"; } 
        else if (lvpoints <= 8) { var role = "🧙‍♂️Wizard Lord"; }
        else if (lvpoints <= 10) { var role = "🧚🏻Baby Mage"; } 
        else if (lvpoints <= 12) { var role = "🧜Mage"; } 
        else if (lvpoints <= 14) { var role = "🧜‍♂️Master of Mage"; } 
        else if (lvpoints <= 16) { var role = "🌬Child of Nobel"; } 
        else if (lvpoints <= 18) { var role = "❄Nobel"; }
        else if (lvpoints <= 20) { var role = "⚡Speed of Elite"; } 
        else if (lvpoints <= 22) { var role = "🎭Elite"; } 
        else if (lvpoints <= 24) { var role = "🥇Ace I"; }
        else if (lvpoints <= 26) { var role = "🥈Ace II"; } 
        else if (lvpoints <= 28) { var role = "🥉Ace Master"; }
        else if (lvpoints <= 30) { var role = "🎖Ace Dominator"; } 
        else if (lvpoints <= 32) { var role = "🏅Ace Elite"; }
        else if (lvpoints <= 34) { var role = "🏆Ace Supreme"; }
        else if (lvpoints <= 36) { var role = "💍Supreme I"; }
        else if (lvpoints <= 38) { var role = "💎Supreme II"; } 
        else if (lvpoints <= 40) { var role = "🔮Supreme Master"; } 
        else if (lvpoints <= 42) { var role = "🛡Legend III"; } 
        else if (lvpoints <= 44) { var role = "🏹Legend II"; } 
        else if (lvpoints <= 46) { var role = "⚔Legend"; } 
        else if (lvpoints <= 55) { var role = "🐉Immortal"; }
    
        let disc = meh.substring(3, 7);
        var ppuser = await dest.getpp(meh);
        var naam_ser;
        try { 
            naam_ser = await hn.getName(meh); 
        } catch { 
            naam_ser = "User"; 
        }
        let ttms = userq.xp / 8;
          
        var textr = `*Hii ${tlang().greet || "there"} ,🌟 ${naam_ser || "Sir_"}∆${disc}'s* Exp\n\n*🌟Role*: ${role}\n*🟢Exp*: ${userq.xp || "infinity"} / ${Levels.xpFor((userq.level || 0) + 1)}\n*🏡Level*: ${userq.level || "infinity"}\n*Total Messages:* ${ttms || "infinity"}\n`;
          
        await hn.sendMessage(dest.chat, { 
            image: { url: ppuser }, 
            caption: textr 
        }, { quoted: dest });
          
    } catch(e) { 
        console.error(`Error in userrank command: ${e}`);
        await repondre("*ERR: Can't fetch rank data!*");
    }
});

// Command to show leaderboard
smd({
    cmdname: "leaderboard",
    alias: ["deck", "top"],
    info: "To check leaderboard",
    type: "level",
	use:"<number>",
    filename: __filename,
},
async(message, text) => {
    try {
        if (!global.isMongodb) return await message.reply(message.isCreator ? 
            `*_Add MONGODB_URI to use these cmds_*` : 
            `*_Please ask my Owner to add MONGODB_URI!_*`);
            
        // If in a group, check if ranking is enabled
        if (message.isGroup) {
            const rankEnabled = await isRankEnabled(message.chat);
            if (!rankEnabled && !message.isCreator) {
                return await message.reply("*Ranking system is disabled in this group!*");
            }
        }
          
        // Default to showing top 5, but allow user to specify different number
        const limit = parseInt(text) || 5;
        const fetchlb = await Levels.fetchLeaderboard("RandomXP", limit);
        
        let leadtext = `
*-------------------------------*
*----● LeaderBoard (Top ${limit}) ● -----*
*-------------------------------*
\n\n`;

        for (let i = 0; i < fetchlb.length; i++) {
            const lvpoints = fetchlb[i].level;
            var role = "GOD✨";
            
            if (lvpoints <= 2) { var role = "🏳Citizen"; } 
            else if (lvpoints <= 4) { var role = "👼Baby Wizard"; } 
            else if (lvpoints <= 6) { var role = "🧙‍♀️Wizard"; } 
            else if (lvpoints <= 8) { var role = "🧙‍♂️Wizard Lord"; }
            else if (lvpoints <= 10) { var role = "🧚🏻Baby Mage"; } 
            else if (lvpoints <= 12) { var role = "🧜Mage"; } 
            else if (lvpoints <= 14) { var role = "🧜‍♂️Master of Mage"; } 
            else if (lvpoints <= 16) { var role = "🌬Child of Nobel"; } 
            else if (lvpoints <= 18) { var role = "❄Nobel"; }
            else if (lvpoints <= 20) { var role = "⚡Speed of Elite"; } 
            else if (lvpoints <= 22) { var role = "🎭Elite"; } 
            else if (lvpoints <= 24) { var role = "🥇Ace I"; }
            else if (lvpoints <= 26) { var role = "🥈Ace II"; } 
            else if (lvpoints <= 28) { var role = "🥉Ace Master"; }
            else if (lvpoints <= 30) { var role = "🎖Ace Dominator"; } 
            else if (lvpoints <= 32) { var role = "🏅Ace Elite"; }
            else if (lvpoints <= 34) { var role = "🏆Ace Supreme"; }
            else if (lvpoints <= 36) { var role = "💍Supreme I"; }
            else if (lvpoints <= 38) { var role = "💎Supreme II"; } 
            else if (lvpoints <= 40) { var role = "🔮Supreme Master"; } 
            else if (lvpoints <= 42) { var role = "🛡Legend III"; } 
            else if (lvpoints <= 44) { var role = "🏹Legend II"; } 
            else if (lvpoints <= 46) { var role = "⚔Legend"; } 
            else if (lvpoints <= 55) { var role = "🐉Immortal"; }
            
            var naam_ser;
            try { 
                naam_ser = await message.bot.getName(fetchlb[i].userID); 
            } catch { 
                naam_ser = fetchlb[i].userID?.split("@")[0] || "Unknown"; 
            }
            
            leadtext += `*${i + 1}● Name*: ${naam_ser}
*● Level*: ${fetchlb[i].level}
*● Points*: ${fetchlb[i].xp}
*● Role*: ${role}
*● Total messages*: ${fetchlb[i].xp / 8}
\n`;
        }
        
        await message.reply(leadtext);
        
    } catch(e) { 
        await message.error(`${e}\n\ncommand: leaderboard`, e, `*Can't fetch data, make sure MONGODB_URI added!!*`); 
    }
});

//============================================================================
//============================================================================

// Handle text messages to award XP
hango({ 
    on: "text" 
}, async (dest, hn, commandOptions) => {
    try {
        // Don't process if not in a group or if MongoDB is not set up
        if (!dest.isGroup || !global.isMongodb) return;
        
        // Check if ranking is enabled for this group
        const rankEnabled = await isRankEnabled(dest.chat);
        if (!rankEnabled) return;
        
        // Initialize the bots object if needed
        if (!bots || utd) { 
            bots = await bot_.findOne({id: `bot_${dest.user}` }); 
            utd = false;
        }
        if (!bots) return;
        
        // Award XP for each message
        const randomXp = 8;
        const hasLeveledUp = await Levels.appendXp(dest.sender, "RandomXP", randomXp);
        
        // If user has leveled up, send notification if enabled
        if (hasLeveledUp) {
            const sck1 = await Levels.fetch(dest.sender, "RandomXP");
            const lvpoints = sck1.level;
            var role = "GOD";
            
            if (lvpoints <= 2) { var role = "🏳Citizen"; } 
            else if (lvpoints <= 4) { var role = "👼Baby Wizard"; } 
            else if (lvpoints <= 6) { var role = "🧙‍♀️Wizard"; } 
            else if (lvpoints <= 8) { var role = "🧙‍♂️Wizard Lord"; } 
            else if (lvpoints <= 10) { var role = "🧚🏻Baby Mage"; } 
            else if (lvpoints <= 12) { var role = "🧜Mage"; } 
            else if (lvpoints <= 14) { var role = "🧜‍♂️Master of Mage"; } 
            else if (lvpoints <= 16) { var role = "🌬Child of Nobel"; } 
            else if (lvpoints <= 18) { var role = "❄Nobel"; } 
            else if (lvpoints <= 20) { var role = "⚡Speed of Elite"; }
            else if (lvpoints <= 22) { var role = "🎭Elite"; } 
            else if (lvpoints <= 24) { var role = "🥇Ace I"; } 
            else if (lvpoints <= 26) { var role = "🥈Ace II"; } 
            else if (lvpoints <= 28) { var role = "🥉Ace Master"; }
            else if (lvpoints <= 30) { var role = "🎖Ace Dominator"; }
            else if (lvpoints <= 32) { var role = "🏅Ace Elite"; }
            else if (lvpoints <= 34) { var role = "🏆Ace Supreme"; } 
            else if (lvpoints <= 36) { var role = "💍Supreme I"; }
            else if (lvpoints <= 38) { var role = "💎Supreme II"; } 
            else if (lvpoints <= 40) { var role = "🔮Supreme Master"; } 
            else if (lvpoints <= 42) { var role = "🛡Legend III"; } 
            else if (lvpoints <= 44) { var role = "🏹Legend II"; } 
            else if (lvpoints <= 46) { var role = "⚔Legend"; } 
            else if (lvpoints <= 55) { var role = "🐉Immortal"; }
            
            // Send level-up notification if enabled
            if (bots.levelup && bots.levelup === "true") {
                await hn.sendUi(dest.chat, {
                    caption: `
╔════◇
║ *Wow, Someone just*
║ *leveled Up huh⭐*
║ *👤Name*: ${dest.pushName}
║ *🎐Level*: ${sck1.level}🍭
║ *🛑Exp*: ${sck1.xp} / ${Levels.xpFor((sck1.level || 0) + 1)}
║ *📍Role*: *${role}*
║ *Enjoy🥳*
╚════════════╝ `
                }, { quoted: dest });
            }
        }
    } catch(e) {
        console.error("Error in XP handling:", e);
    }
});
