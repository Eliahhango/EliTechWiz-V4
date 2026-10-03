const { hango } = require("../framework/hango");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/antistatusmention.json");

// Load data
function loadData() {
  if (!fs.existsSync(filePath)) return { groups: {} };
  return JSON.parse(fs.readFileSync(filePath));
}

// Save data
function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Command
hango({
  nomCom: "antistatusmention",
  categorie: "Group",
  reaction: "⚠️",
}, async (dest, hn, commandeOptions) => {

  const { repondre, arg, ms, estAdmin } = commandeOptions;
  const groupId = ms.key.remoteJid;

  // Check group
  if (!groupId.endsWith("@g.us")) {
    return repondre("❗This command can only be used in group chats.");
  }

  // Admin check (SAME AS ANTISTICKER)
  if (!estAdmin) {
    return repondre("⛔Only group admins can use this command.");
  }

  const data = loadData();
  const option = (arg[0] || "").toLowerCase();

  if (!data.groups[groupId]) {
    data.groups[groupId] = { status: "off", action: "warn", warn_limit: 3 };
  }

  // ================= ON =================
  if (option === "on") {
    data.groups[groupId].status = "on";
    saveData(data);
    return repondre("✅ Anti-status-mention enabled");
  }

  // ================= OFF =================
  if (option === "off") {
    data.groups[groupId].status = "off";
    saveData(data);
    return repondre("❌ Anti-status-mention disabled");
  }

  // ================= ACTION =================
  if (option === "action") {
    const actionType = (arg[1] || "").toLowerCase();

    if (!["remove", "delete", "warn"].includes(actionType)) {
      return repondre("⚠️ Use: antistatusmention action remove/delete/warn");
    }

    data.groups[groupId].action = actionType;
    saveData(data);
    return repondre(`✅ Action set to *${actionType}*`);
  }

  // ================= LIMIT =================
  if (option === "limit") {
    const limit = parseInt(arg[1]);

    if (isNaN(limit) || limit < 1) {
      return repondre("⚠️ Example: antistatusmention limit 3");
    }

    data.groups[groupId].warn_limit = limit;
    saveData(data);
    return repondre(`✅ Warn limit set to *${limit}*`);
  }

  // ================= DEFAULT =================
  repondre(`⚙️ Anti Status Mention

Usage:
antistatusmention on
antistatusmention off
antistatusmention action remove/delete/warn
antistatusmention limit 3`);
});