const { hango } = require("../framework/hango");
const fs = require("fs");
const path = require("path");

const antistickerFile = path.join(__dirname, "../data/antisticker.json");

// Load data
function loadAntiSticker() {
  if (!fs.existsSync(antistickerFile)) return { groups: {} };
  return JSON.parse(fs.readFileSync(antistickerFile));
}

// Save data
function saveAntiSticker(data) {
  fs.writeFileSync(antistickerFile, JSON.stringify(data, null, 2));
}

// Command
hango({
  nomCom: "antisticker",
  categorie: "Group",
  reaction: "❌",
}, async (dest, hn, commandeOptions) => {

  const { repondre, arg, ms, estAdmin } = commandeOptions;
  const groupId = ms.key.remoteJid;

  // Check group
  if (!groupId.endsWith("@g.us")) {
    return repondre("❗This command can only be used in group chats.");
  }

  // ✅ Use estAdmin (FIX)
  if (!estAdmin) {
    return repondre("⛔Only group admins can use this command.");
  }

  const data = loadAntiSticker();
  const action = (arg[0] || "").toLowerCase();

  if (action === "on") {
    data.groups = data.groups || {};
    data.groups[groupId] = { active: true };
    saveAntiSticker(data);
    repondre("✅ Antisticker has been activated for this group.");
  } else if (action === "off") {
    if (data.groups && data.groups[groupId]) {
      delete data.groups[groupId];
      saveAntiSticker(data);
      repondre("❎ Antisticker has been deactivated for this group.");
    } else {
      repondre("ℹ️ Antisticker is not active in this group.");
    }
  } else {
    repondre("⚠️ Usage: antisticker on / off");
  }
});