const { Scenes, Markup } = require("telegraf");
const { getDistricts } = require("../services/districtsApi");
const { dynamicButtons } = require("../buttons/buttons");
const { localization } = require("../localization/localization");
const { getProducts } = require("../services/productsApi");

const productsScene = new Scenes.BaseScene("products");

productsScene.enter(async (ctx) => {
  console.log("PRODUCTS SCENE ENTER");

  let products = await getProducts(ctx.session.myData.city, "products");
  console.log("🚀 ~ productsScene.enter ~ products:", products);
  if (products && products.length > 0) {
    ctx.session.myData.products = products;
    await ctx.replyWithHTML(
      localization.labels.city +
        localization.cities[ctx.session.myData.city] +
        "\n\n➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ \n\n" +
        localization.selectProducts,
      dynamicButtons(products?.flat())
    );

    await getProducts(ctx.session.myData.city);
  }
});

(function handleAction() {
  const actions = [
    "Жижка чейзер 1",
    "Жижка чейзер 0.5",
    "Жижка чейзер 3",
    "Повернутися назад ↩️",
  ];
  return actions.map((action) =>
    productsScene.action(action, async (ctx) => {
      console.log("🚀 ~ productsScene.action ~ action:", action);
      if (action.toLowerCase().includes("Повернутися назад ↩️")) {
        productsScene.leave((ctx) => {
          console.log("PRODUCTS SCENE LEAVE");
        });
        productsScene.enter(ctx.session.myData.prevScene);
      } else {
        ctx.session.myData.selectedProduct = action;

        await ctx.answerCbQuery();
        return ctx.scene.enter("districts");
      }
    })
  );
})();

productsScene.leave((ctx) => {
  ctx.session.myData.prevScene = "products";

  console.log("PRODUCTS SCENE LEAVE");
});

// What to do if user entered a raw message or picked some other option?
productsScene.use((ctx) => {});
module.exports = { productsScene };
