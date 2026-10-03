const { hango } = require("../framework/hango");
const { saveDatabase } = require("../lib/core"); 

hango({
  nomCom: "setprefix",
  categorie: "Owner",
}, async (dest, hn, commandeOptions) => {
    const { ms, repondre, arg, superUser, nomCom } = commandeOptions;

  // 🔒 Only bot owner
  if (!superUser) return repondre("⛔ *Only the bot owner can use this command*.");

  // 🔹 Ensure DB exists
  if (!global.db) return repondre("⚠️ Database not loaded.");
  if (!global.db.settings) global.db.settings = { prefix: ".", botname: "MyBot" };

  // 🔹 No argument
  if (!arg || arg.length < 1) {
    return repondre(
      `Example: ${global.db.settings.prefix}${nomCom} !\n\n- This will change the bot prefix to *!*\n- Use *${global.db.settings.prefix}${nomCom} none* to remove the prefix`
    );
  }

  let newPrefix = arg[0].toString();

  // 🔹 Handle "none" / "noprefix"
  if (newPrefix.toLowerCase() === "none" || newPrefix.toLowerCase() === "noprefix") {
    newPrefix = "";
  } else if (newPrefix.length > 3) {
    return repondre("⚠️ Prefix should be 1-3 characters long.");
  }

  // 🔹 Update global DB
  global.db.settings.prefix = newPrefix;

  // 🔹 Update runtime prefix variable (optional) ili bot aanze kutumia mara moja
  global.prefix = newPrefix;

  // 🔹 Save DB
  saveDatabase();

  // ✅ Respond
  repondre(`✅ Prefix changed to *${newPrefix || "No Prefix"}* successfully.`);
});