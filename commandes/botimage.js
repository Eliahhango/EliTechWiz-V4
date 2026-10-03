const { hango } = require(__dirname + '/../framework/hango');
const isOwner = require(__dirname + '/../lib/isOwner');
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const DATA_FILE = path.join(DATA_DIR, "botimage.json");

// Create data folder
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load saved image
function loadBotImages() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(
                DATA_FILE,
                JSON.stringify({}, null, 2)
            );
            return {};
        }

        return JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );

    } catch (err) {
        console.error("❌ BotImage Load Error:", err);
        return {};
    }
}

// Save image
function saveBotImages(data) {
    try {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(data, null, 2)
        );

        return true;

    } catch (err) {
        console.error("❌ BotImage Save Error:", err);
        return false;
    }
}

hango({
        nomCom: "botimage",
        aliases: ["setbotimage", "setmenuimage"],
        categorie: "General",
        reaction: "🖼️"
    },

    async (chatId, hn, commandeOptions) => {

        const {
            ms,
            repondre,
            arg
        } = commandeOptions;

        try {

            // ================================
            // OWNER CHECK
            // ================================
            const sender =
                ms.key.participant ||
                ms.key.remoteJid;

            const allowed = await isOwnerOrSudo(
                sender,
                hn,
                ms.key.remoteJid
            );

            if (!allowed) {
                return repondre(
                    "❌ Only the bot owner can use this command."
                );
            }

            // ================================
            // GET URL
            // ================================
            const imageUrl =
                arg && arg.length
                    ? arg.join(" ").trim()
                    : "";

            if (!imageUrl) {
                return repondre(
                    "⚠️ Please provide an image URL.\n\nExample:\n.botimage https://example.com/image.jpg"
                );
            }

            // ================================
            // VALIDATE URL
            // ================================
            let parsedUrl;

            try {
                parsedUrl = new URL(imageUrl);
            } catch (e) {
                return repondre(
                    "❌ Invalid image URL."
                );
            }

            if (
                parsedUrl.protocol !== "http:" &&
                parsedUrl.protocol !== "https:"
            ) {
                return repondre(
                    "❌ Only HTTP/HTTPS image URLs are supported."
                );
            }

            // ================================
            // BOT ID
            // ================================
            const botId =
                hn.user?.id ||
                hn.user?.jid ||
                "default";

            // ================================
            // SAVE IMAGE
            // ================================
            const botImages = loadBotImages();

            botImages[botId] = imageUrl;

            const saved = saveBotImages(botImages);

            if (!saved) {
                return repondre(
                    "❌ Failed to save bot image."
                );
            }

            // ================================
            // SUCCESS
            // ================================
            return repondre(
                `✅ Bot Display Picture Updated Successfully!\n\n🖼️ Image URL:\n${imageUrl}`
            );

        } catch (err) {

            console.error(
                "❌ BotImage Error:",
                err
            );

            return repondre(
                "❌ Error updating bot image."
            );
        }
    }
);
