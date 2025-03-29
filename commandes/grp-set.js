const { hango } = require("../framework/hango");
// const { getGroupe } = require("../ess/groupe"); 
const conf = require("../set");

hango({
    nomCom: "opentime",
    reaction: "😌",
    categorie: "group"
}, async (dest, hn, context) => {
    var { repondre, arg, verifGroupe, verifAdmin } = context;
    try {
        if (!verifGroupe) return repondre('This command is meant for groups.');
        if (!verifAdmin) return repondre('This command is meant for admins.');

        let timer;
        const args = arg.split(' '); // Ensure args are split if input is like '10 second'

        if (args[1] === 'second') {
            timer = args[0] * 1000;
        } else if (args[1] === 'minute') {
            timer = args[0] * 60000;
        } else if (args[1] === 'hour') {
            timer = args[0] * 3600000;
        } else if (args[1] === 'day') {
            timer = args[0] * 86400000;
        } else {
            return repondre('Please select a valid time unit: second, minute, hour, or day.\nExample: 10 second');
        }

        repondre(`Open time of ${arg} starting from now...`);

        setTimeout(() => {
            const openMessage = `*⏰ Open Time 🗿*\nGroup was opened by the bot. Now all members can send messages.`;
            hn.groupSettingUpdate(dest, 'not_announcement');
            repondre(openMessage);
        }, timer);

        await hn.sendMessage(dest, { react: { text: '✅', key: hn.key } });

    } catch (e) {
        console.error(e);
        repondre('An error occurred!');
    }
});

hango({
    nomCom: "closetime",
    reaction: "😌",
    categorie: "group"
}, async (dest, hn, context) => {
    var { repondre, arg, verifGroupe, verifAdmin } = context;
    try {
        if (!verifGroupe) return repondre('This command is meant for groups.');
        if (!verifAdmin) return repondre('This command is meant for admins.');

        let timer;
        const args = arg.split(' '); // Ensure args are split if input is like '10 second'

        if (args[1] === 'second') {
            timer = args[0] * 1000;
        } else if (args[1] === 'minute') {
            timer = args[0] * 60000;
        } else if (args[1] === 'hour') {
            timer = args[0] * 3600000;
        } else if (args[1] === 'day') {
            timer = args[0] * 86400000;
        } else {
            return repondre('Please select a valid time unit: second, minute, hour, or day.\nExample: 10 second');
        }

        repondre(`Close time of ${arg} starting from now...`);

        setTimeout(() => {
            const closeMessage = `*⏰ Close Time 🗿*\nThe group has been successfully closed.`;
            hn.groupSettingUpdate(dest, 'announcement');
            repondre(closeMessage);
        }, timer);

        await hn.sendMessage(dest, { react: { text: '✅', key: hn.key } });

    } catch (e) {
        console.error(e);
        repondre('An error occurred!');
    }
});
