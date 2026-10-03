const { hango } = require('../framework/hango');  
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../ess/alive'); 
const moment = require("moment-timezone"); 
const s = require(__dirname + "/../set");


hango({ nomCom: 'soon', categorie: 'General' }, async (dest, hn, commandeOptions) => {

const { ms, arg, repondre, superUser, getProfilePicture, sender } = commandeOptions;
    const data = await getDataFromAlive();
    
    let profilePicUrl;
    try {
        profilePicUrl = await getProfilePicture(sender);
    } catch (e) {
        profilePicUrl = null;
    }
    
    const userNumber = sender.split('@')[0];
    const countryCode = userNumber.slice(0, userNumber.length - 9);
    
    if (!arg || !arg[0] || arg.join('') === '') {
        if (data) {
            const { message, lien } = data;
            var mode = (s.MODE).toLowerCase() !== "yes" ? "private" : "public";
            moment.tz.setDefault('Etc/GMT');
            const temps = moment().format('HH:mm:ss');
            const date = moment().format('DD/MM/YYYY');
            const alivemsg = `

Owner : ${s.OWNER_NAME} Mode : ${mode} Date : ${date} Hours(GMT) : ${temps}

${message}

EliTechWiz-V4-BOT`;

if (lien.match(/\.(mp4|gif)$/i)) {
                try {
                    hn.sendMessage(dest, { video: { url: lien }, caption: alivemsg }, { quoted: ms });
                } catch (e) {
                    console.log("🥵🥵 Menu erreur " + e);
                    repondre("🥵🥵 Menu erreur " + e);
                }
            } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                try {
                    hn.sendMessage(dest, { image: { url: lien }, caption: alivemsg }, { quoted: ms });
                } catch (e) {
                    console.log("🥵🥵 Menu erreur " + e);
                    repondre("🥵🥵 Menu erreur " + e);
                }
            } else {
                repondre(alivemsg);
            }
        } else {
            if (!superUser) {
                repondre("if not why you commanded it (bitch)");
                return;
            }
            if (profilePicUrl) {
                hn.sendMessage(dest, {
                    image: { url: profilePicUrl },
                    caption: `You are my friend \n*Number:* +${userNumber}\n*Country:* ${countryCode}`
                }, { quoted: ms });
            } else {
                repondre("you are a gay (bitch) if not why u recommend it *may the fuck be with you*\nWhy didn't you set a profile picture? You're not my friend!");
            }
        }
    } else {
        if (!superUser) {
            repondre("EliTechWiz-V4");
            return;
        }
        const texte = arg.join(' ').split(';')[0];
        const tlien = arg.join(' ').split(';')[1];
        await addOrUpdateDataInAlive(texte, tlien);
        repondre('you are a gay (bitch) if not why u recommend it *may the fuck be with you*');
    }
});

