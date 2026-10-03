const { hango } = require("../framework/hango");

hango({
  nomCom: "updates2",
  categorie: "Owner"
}, async (dest, hn, commandeOptions) => {
  const { ms, repondre, arg, superUser } = commandeOptions;

  if (!superUser) return repondre("⛔ Only the bot owner can use this command.");

  if (!HEROKU_API_KEY || !HEROKU_APP_NAME) {
    return repondre("⚠️ HEROKU_API_KEY or HEROKU_APP_NAME is not set.");
  }

  const subcommand = arg && arg[0] ? arg[0].toLowerCase() : "";

  try {
    // ===== UPDATE NOW =====
    if (subcommand === "now") {
      await repondre("🚀 Updating bot now. Please wait 1-2 minutes...");

      await axios.post(
        `https://api.heroku.com/apps/${HEROKU_APP_NAME}/builds`,
        {
          source_blob: {
            url: "https://github.com/Eliahhango/EliTechWiz-V4/tarball/main"
          }
        },
        {
          headers: {
            Authorization: `Bearer ${HEROKU_API_KEY}`,
            Accept: "application/vnd.heroku+json; version=3",
            "Content-Type": "application/json"
          }
        }
      );

      return repondre("✅ Redeploy triggered successfully!");
    }

    // ===== CHECK UPDATE =====
    const githubRes = await axios.get(
      "https://api.github.com/repos/Eliahhango/EliTechWiz-V4/commits/main"
    );

    const latestCommit = githubRes.data;
    const latestSha = latestCommit.sha;

    const herokuRes = await axios.get(
      `https://api.heroku.com/apps/${HEROKU_APP_NAME}/builds`,
      {
        headers: {
          Authorization: `Bearer ${HEROKU_API_KEY}`,
          Accept: "application/vnd.heroku+json; version=3"
        }
      }
    );

    const lastBuild = herokuRes.data[0];
    const deployedUrl = lastBuild?.source_blob?.url || "";

    const alreadyDeployed = deployedUrl.includes(latestSha);

    if (alreadyDeployed) {
      return repondre("✅ Bot is already up to date with the latest commit.");
    }

    return repondre(
      `🆕 New commit found!\n\n*Message:* ${latestCommit.commit.message}\n*Author:* ${latestCommit.commit.author.name}\n\nType *.update now* to update your bot.`
    );

  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.log("Update failed:", errMsg);
    return repondre("❌ Error: " + errMsg);
  }
});
