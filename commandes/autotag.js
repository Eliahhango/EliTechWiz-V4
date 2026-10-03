const fs = require("fs");
const { hango } = require("../framework/hango");

const filePath = "./data/autotag.json";
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}");
let db = JSON.parse(fs.readFileSync(filePath));

const warningDB = new Map(); // Warning tracker

hango({
  nomCom: "autotag",
  categorie: "Group",
  reaction: "✅",
  desc: "Toggle Auto Tag Protection in groups"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre } = commandeOptions;
  const groupId = dest;

  if (!groupId.endsWith("@g.us")) {
    await repondre("❌ This command only works in groups.");
    return;
  }

  if (!arg[0] || !["on", "off", "status"].includes(arg[0].toLowerCase())) {
    await repondre(`⚠️ Usage:\n.autotag on\n.autotag off\n.autotag status`);
    return;
  }

  const action = arg[0].toLowerCase();

  if (action === "status") {
    const status = db[groupId] === "on" ? "ENABLED ✅" : "DISABLED ❌";
    await repondre(`🛡️ Auto Tag Protection is currently: ${status}`);
    return;
  }

  db[groupId] = action;
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
  await repondre(`✅ Auto Tag Protection is now *${action.toUpperCase()}*`);
});
