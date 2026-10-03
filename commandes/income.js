const { hango } = require("../framework/hango");
const { summary, setBudget, delBudget, isValidDate } = require("../lib/budget");

//========================= INCOME =========================//
hango({
    nomCom: "income",
    categorie: "Budget",
    desc: "To set income",
    reaction: "💰",
  },
  async (dest, hn, commandeOptions) => {
    const { repondre, arg, auteurMessage } = commandeOptions;
    const [type, amount, remark] = arg.join(" ").split(",");

    if (!type || !amount || isNaN(amount)) {
      return repondre(
        "*Missing type*\n*Example : income type,amount,remark*\n*income salary,500*\n\n*remark is optional*"
      );
    }

    const res = await setBudget(
      auteurMessage,
      "income",
      type.trim(),
      amount.trim(),
      remark?.trim()
    );
    await repondre(`*Income of current month is ${res}*`);
  }
);

//========================= EXPENSE =========================//
hango({
    nomCom: "expense",
    categorie: "Budget",
    desc: "To set expense",
    reaction: "💸",
  },
  async (dest, hn, commandeOptions) => {
    const { repondre, arg, auteurMessage } = commandeOptions;
    const [type, amount, remark] = arg.join(" ").split(",");

    if (!type || !amount || isNaN(amount)) {
      return repondre(
        "*Missing type*\n*Example : expense type,amount,remark*\n*expense food,200,lunch*\n\n*remark is optional*"
      );
    }

    const res = await setBudget(
      auteurMessage,
      "expense",
      type.trim(),
      amount.trim(),
      remark?.trim()
    );
    await repondre(`*Expense of current month is ${res}*`);
  }
);

//========================= DELETE BUDGET =========================//
hango({
    nomCom: "delbudget",
    categorie: "Budget",
    desc: "To delete income | expense",
    reaction: "🗑",
  },
  async (dest, hn, commandeOptions) => {
    const { repondre, arg, auteurMessage } = commandeOptions;
    const id = arg[0];

    if (!id) {
      return repondre(
        "*Example : delbudget id*\n\n*Id from summary*\n*To update amount re-enter again instead of deletion*"
      );
    }

    const res = await delBudget(auteurMessage, id);
    if (!res) return repondre(`_${id} not in list._`);
    await repondre(`_${id} removed from the list._`);
  }
);

//========================= SUMMARY =========================//
hango({
    nomCom: "summary",
    categorie: "Budget",
    desc: "To get summary of budget",
    reaction: "📊",
  },
  async (dest, hn, commandeOptions) => {
    const { repondre, arg, auteurMessage, ms } = commandeOptions;
    const [from, to] = arg.join(" ").split(",");

    if (arg.length && (!isValidDate(from) || !isValidDate(to))) {
      return repondre(`*Example : summary 1 May 2023, 3 May 2023*`);
    }

    const budget = await summary(auteurMessage, from, to);

    await hn.sendMessage(
      dest,
      {
        document: Buffer.from(budget),
        fileName: "summary.pdf",
        mimetype: "application/pdf",
      },
      { quoted: ms }
    );
  }
);
