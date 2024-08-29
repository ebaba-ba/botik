const { Scenes } = require("telegraf");
const { getStatusPayment } = require("../services/paymentApi");
const { getProduct, deleteProduct } = require("../services/productsApi");
const { localization } = require("../localization/localization");

const paymentScene = new Scenes.BaseScene("payment");

paymentScene.enter(async (ctx) => {
  ctx.session.myData.prevScene = "payment";

  console.log("PAYMENT SCENE ENTER");
  const product = await getProduct(ctx.session.myData.RECORDS_ID);
  if (product?.data.img)
    ctx.replyWithHTML(
      `${localization.paymentSucces}\n${
        localization.labels.city +
        localization.cities[`${ctx.session.myData.city}`] +
        "\n" +
        localization.labels.district +
        ctx.session.myData.district +
        "\n" +
        localization.labels.product +
        ctx.session.myData.selectedProduct +
        "\n" +
        product?.data.img
      }`
    );
  await ctx.scene.leave();
  return ctx.scene.enter("launch");
});
module.exports = { paymentScene };
