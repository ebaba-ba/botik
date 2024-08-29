const { citiesButtons, dynamicButtons } = require("../buttons/buttons");
const { Composer, Scenes } = require("telegraf");
const { localization } = require("../localization/localization");
const { getProducts } = require("../services/productsApi");
const districtsScene = new Scenes.BaseScene("districts");

districtsScene.enter(async (ctx) => {
  console.log("DISTRICTSS SCENE ENTER");
  const groupId = ctx.session.myData.selectedProduct.match(
    /(\b(1|0\.5)\b)|\b(3)\b/g
  )[0];
  const products = groupId && (await getProducts(groupId, "districts"));
  const productsSet = new Set(
    products
      .filter((product) => product.data.groupId === Number(groupId))
      .map((product) => product.data.district)
  );
  const buttonProducts = [];

  productsSet.forEach((value) => buttonProducts.push([value]));
  console.log("buttonProducts", buttonProducts);

  ctx.session.myData.product = products[0].data;
  ctx.session.myData.RECORDS_ID = products[0].id;
  console.log(
    "🚀 ~ districtsScene.enter ~ products:",
    ctx.session.myData.product
  );
  if (products && products.length > 0) {
    await ctx.replyWithHTML(
      localization.labels.city +
        localization.cities[`${ctx.session.myData.city}`] +
        "\n" +
        localization.labels.product +
        ctx.session.myData.selectedProduct +
        "\n" +
        localization.labels.price +
        ctx.session.myData.product.price +
        " грн." +
        "\n\n➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ \n\n" +
        localization.selectDistricts,
      dynamicButtons(buttonProducts.map((button) => button))
    );
  }
});
(function handleAction() {
  const actions = ["Гришківці", "Завідня", "Повернутися назад ↩️"];
  console.log("🚀 ~ handleAction ~ actions:", actions);
  return actions.map((action) =>
    districtsScene.action(action, async (ctx) => {
      if (action == "Повернутися назад ↩️") {
        console.log(ctx.session.myData.prevScene);
        districtsScene.leave();
        districtsScene.enter(ctx.session.myData.prevScene);
      } else {
        ctx.session.myData.district = action;

        await ctx.answerCbQuery();
        return ctx.scene.enter("reservation");
      }
    })
  );
})();
districtsScene.leave((ctx) => {
  ctx.session.myData.prevScene = "districts";

  console.log("PRODUCTS SCENE LEAVE");
});

// What to do if user entered a raw message or picked some other option?
districtsScene.use((ctx) => {});
module.exports = { districtsScene };
