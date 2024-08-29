const { getDistricts } = require("../services/districtsApi");
const { citiesButtons } = require("../buttons/buttons");
const { Scenes } = require("telegraf");
const { localization } = require("../localization/localization");
const { startCitiesScene } = require("./command");

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
launchScene.action(localization.employment, (ctx) => {
  ctx.replyWithHTML(localization.employmentInfo + "<a>@Fjhgi_bot</a>");
  return ctx.sendContact("");
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
