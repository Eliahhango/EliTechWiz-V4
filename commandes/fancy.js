const { hango } = require("../framework/hango");
const fancy = require("../commandes/style");

hango({ nomCom: "fancy", categorie: "Fun", reaction: "〽️" }, async (dest, hn, commandeOptions) => {
    const { arg, repondre, prefixe } = commandeOptions;
    const id = arg[0]?.match(/\d+/)?.join('');
    const text = arg.slice(1).join(" ");

    try {
        if (id === undefined || text === undefined) {
            return await repondre(`\nExemple : ${prefixe}fancy 10 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰\n` + String.fromCharCode(8206).repeat(4001) + fancy.list('*𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰*', fancy));
        }

        const selectedStyle = fancy[parseInt(id) - 1];
        if (selectedStyle) {
            return await repondre(fancy.apply(selectedStyle, text));
        } else {
            return await repondre('_Style introuvable :(_');
        }
    } catch (error) {
        console.error(error);
        return await repondre('_Une erreur s\'est produite :(_');
    }
});
