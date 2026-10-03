const { hango } = require("../framework/hango");
const eco = require("../lib/monay");

hango({
  nomCom: "shop",
  desc: "View available shop items",
  categorie: "Economy",
  reaction: "🛒"
}, async (dest, hn, commandeOptions) => {
  const { repondre, auteurMessage, nomAuteurMessage } = commandeOptions;

  try {
    // Define 7 shop lists
    const shopLists = [
      [
        { id: 1, name: "Fish Rod", price: 5000 },
        { id: 2, name: "Shovel", price: 7000 },
        { id: 3, name: "Fishing Net", price: 12000 },
        { id: 4, name: "Magic Bait", price: 15000 }
      ],
      [
        { id: 1, name: "Pickaxe", price: 8000 },
        { id: 2, name: "Helmet", price: 5000 },
        { id: 3, name: "Backpack", price: 15000 },
        { id: 4, name: "Lantern", price: 4000 }
      ],
      [
        { id: 1, name: "Sword", price: 12000 },
        { id: 2, name: "Shield", price: 10000 },
        { id: 3, name: "Potion", price: 7000 },
        { id: 4, name: "Armor", price: 20000 }
      ],
      [
        { id: 1, name: "Bow", price: 10000 },
        { id: 2, name: "Arrow Pack", price: 5000 },
        { id: 3, name: "Quiver", price: 12000 },
        { id: 4, name: "Boots", price: 8000 }
      ],
      [
        { id: 1, name: "Magic Scroll", price: 15000 },
        { id: 2, name: "Spell Book", price: 20000 },
        { id: 3, name: "Wand", price: 10000 },
        { id: 4, name: "Crystal Ball", price: 25000 }
      ],
      [
        { id: 1, name: "Hammer", price: 7000 },
        { id: 2, name: "Nails Pack", price: 3000 },
        { id: 3, name: "Workbench", price: 12000 },
        { id: 4, name: "Gloves", price: 5000 }
      ],
      [
        { id: 1, name: "Torch", price: 2000 },
        { id: 2, name: "Rope", price: 4000 },
        { id: 3, name: "Map", price: 6000 },
        { id: 4, name: "Compass", price: 8000 }
      ]
    ];

    // Pick a random shop list
    const shopItems = shopLists[Math.floor(Math.random() * shopLists.length)];

    // Build shop message with user name
    let msg = `👋 Hello ${nomAuteurMessage}!\n\n🛒 *Available Items*\n────────────────────────\n`;
    for (const item of shopItems) {
      msg += `🆔 *${item.id}* – ${item.name}\n💰 Price: ${item.price.toLocaleString()} NF\n\n`;
    }

    msg += `_Use .buy <ID> to purchase an item._`;

    // Send shop list with mention
    await hn.sendMessage(dest, {
      text: msg,
      mentions: [auteurMessage]
    });

  } catch (e) {
    console.error("SHOP COMMAND ERROR:", e);
    repondre("⚠️ Failed to open the shop. Try again later.");
  }
});
