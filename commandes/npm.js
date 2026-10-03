const { hango } = require("../framework/hango");
const axios = require("axios");

hango({
    nomCom: "npm",
    categorie: "convertion",
    reaction: "📦",
    desc: "Search for a package on npm.",
    use: ".npm <package-name>"
  },
  async (dest, hn, commandOptions) => {
    const { ms, arg, reply } = commandOptions;

    try {
      // Check if a package name is provided
      if (!arg || !arg[0]) {
        return reply("⚠️ Please provide the name of the npm package you want to search for.\n\nExample: .npm express");
      }

      const packageName = arg.join(" ");
      const apiUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

      // Fetch package details from npm registry
      const response = await axios.get(apiUrl);
      if (response.status !== 200) {
        throw new Error("Package not found or an error occurred.");
      }

      const packageData = response.data;
      const latestVersion = packageData["dist-tags"].latest;
      const description = packageData.description || "No description available.";
      const npmUrl = `https://www.npmjs.com/package/${packageName}`;
      const license = packageData.license || "Unknown";
      const repository = packageData.repository ? packageData.repository.url : "Not available";

      // Create the response message
      const message = `
*EliTechWiz-V4 NPM SEARCH*

*🔰 NPM PACKAGE:* ${packageName}
*📄 DESCRIPTION:* ${description}
*⏸️ LAST VERSION:* ${latestVersion}
*🪪 LICENSE:* ${license}
*🪩 REPOSITORY:* ${repository}
*🔗 NPM URL:* ${npmUrl}
`;

      await hn.sendMessage(dest, { text: message }, { quoted: ms });

    } catch (error) {
      console.error("Error:", error);

      const errorMessage = `
*❌ NPM Command Error Logs*

*Error Message:* ${error.message}
*Timestamp:* ${new Date().toISOString()}
`;

      await hn.sendMessage(dest, { text: errorMessage }, { quoted: ms });
      reply("❌ An error occurred while fetching the npm package details.");
    }
  }
);
