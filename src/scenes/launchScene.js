const { getDistricts } = require("../services/districtsApi");
const { citiesButtons, contactsButton } = require("../buttons/buttons");
const { Scenes, Markup } = require("telegraf");
const { localization } = require("../localization/localization");
const { startCitiesScene } = require("./command");
const { getContacts } = require("../services/contactsApi");

const launchScene = new Scenes.BaseScene("launch");

launchScene.enter((ctx) => {
  ctx.session.myData = {};
  console.log("LAUNCH SCENE ENTER");

  ctx.replyWithHTML(`${localization.launch}`, citiesButtons);
});

(function handleAction() {
  return Object.keys(localization.cities).map((key) =>
    launchScene.action(key, async (ctx) => {
      console.log("🚀 ~ launchScene.action ~ key:", key);
      // await ctx.reply(`${localization.youSelect} ${localization.cities[key]}`);

      const districts = await getDistricts(key);
      ctx.session.myData.city = key;
      ctx.session.myData.districts = districts;
      await ctx.answerCbQuery();
      ctx.session.myData.prevScene = "launch";

      return ctx.scene.enter("products");
    })
  );
})();
launchScene.action(localization.employment, async (ctx) => {
  const contacts = await getContacts();
  console.log("🚀 ~ launchScene.action ~ contacts:", contacts);
  ctx.replyWithHTML(
    localization.questionFor,
    Markup.inlineKeyboard([[Markup.button.url("👨‍💻 Admin", contacts[0].link)]])
  );
});
launchScene.leave((ctx) => {
  ctx.session.myData.prevScene = "launch";

  console.log("LAUNCH SCENE LEAVE");
});

// What to do if user entered a raw message or picked some other option?
launchScene.use((ctx) =>
  ctx.replyWithMarkdown("Please choose either Movie or Theater")
);
module.exports = { launchScene };
