const { Scenes, Markup } = require("telegraf");
const { getDistricts } = require("../services/districtsApi");
const { dynamicButtons, backMenuButton } = require("../buttons/buttons");
const { localization } = require("../localization/localization");
const {
  getProducts,
  reservedProduct,
  unReservedProduct,
} = require("../services/productsApi");
const { getCard, getStatusPayment } = require("../services/paymentApi");

const reservationScene = new Scenes.BaseScene("reservation");

reservationScene.enter(async (ctx) => {
  ctx.session.myData.prevScene = "reservation";
  console.log("reservation SCENE ENTER");
  const [hour, minutes, seconds] = [
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds(),
  ];
  await reservedProduct(
    ctx.session.myData.product,
    ctx.session.myData.RECORDS_ID
  );
  const cardNumber = await getCard(ctx.session.myData.product.price);
  ctx.session.myData.trade = cardNumber.trade;

  await ctx.replyWithHTML(
    localization.labels.city +
      localization.cities[`${ctx.session.myData.city}`] +
      "\n" +
      localization.labels.district +
      ctx.session.myData.district +
      "\n" +
      localization.labels.product +
      ctx.session.myData.selectedProduct +
      "\n" +
      localization.labels.price +
      cardNumber.amount +
      " грн." +
      "\n\n➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ \n\n" +
      localization.labels.request +
      new Date().valueOf().toString().substring(0, 10) +
      "\n" +
      localization.labels.wallet +
      +`${cardNumber.card_number}` +
      "\n" +
      localization.reservationDate +
      `${
        hour + 2 > 24
          ? new Date().getDate() + 1 + "." + new Date().getMonth()
          : new Date().getDate() + "." + new Date().getMonth()
      } | ${hour + 2 > 24 ? hour - 24 + 2 : hour + 2}:${minutes}:${seconds}` +
      "\n\n➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ ➖ \n\n" +
      localization.reservationInfo +
      "\n\n" +
      localization.reservatuinDoneInfo,

    backMenuButton
  );
  await getProducts(ctx.session.myData.city);
});
reservationScene.action(localization.menu, async (ctx) => {
  await ctx.scene.leave();
  return ctx.scene.enter("launch");
});

reservationScene.action(localization.cancelPayment, async (ctx) => {
  ctx.replyWithHTML(
    localization.cancelPaymentQuestion,
    dynamicButtons([localization.yes, localization.no])
  );
});

reservationScene.action(localization.yes, async (ctx) => {
  await unReservedProduct(
    ctx.session.myData.product,
    ctx.session.myData.RECORDS_ID
  );
  await ctx.replyWithHTML(localization.cancelPaynebtDone);
  await ctx.scene.leave();
  return ctx.scene.enter("launch");
});

reservationScene.action(localization.updateStatus, async (ctx) => {
  let status = "";
  while (status != "succes") {
    status = await getStatusPayment(ctx.session.myData.trade);
    if (status === "succes") {
      log("succes");
      await ctx.scene.leave();
      return ctx.scene.enter("payment");
    } else {
      return ctx.replyWithHTML(localization.paymentStillProcesing);
    }
  }
});
reservationScene.action("Повернутися назад ↩️", async (ctx) => {
  reservationScene.leave((ctx) => {
    console.log("RESERV SCENE LEAVE");
  });
  return reservationScene.enter(ctx.session.myData.prevScene);
});
reservationScene.leave((ctx) => {
  ctx.session.myData.prevScene = "reservation";

  console.log("reservation SCENE LEAVE");
});

// What to do if user entered a raw message or picked some other option?
reservationScene.use((ctx) => {});
module.exports = { reservationScene };
