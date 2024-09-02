//Buttons for bot

const { Markup } = require("telegraf");
const { localization } = require("../localization/localization");

const citiesButtons = Markup.inlineKeyboard([
  ...Object.entries(localization.cities).map((city) => [
    Markup.button.callback(city[1], city[0]),
  ]),
  [Markup.button.callback(localization.employment, localization.employment)],
])
  .oneTime()
  .resize();
// const dynamicButtons = (districts) =>
//   Markup.inlineKeyboard([
//     ...districts.map((district) => [
//       Markup.button.callback(String(district), String(district)),
//     ]),
//   ]);
const dynamicButtons = (districts) =>
  Markup.inlineKeyboard(
    districts.map((district) =>
      Markup.button.callback(String(district), String(district))
    )
  );
const contactsButton = Markup.inlineKeyboard("sd", [
  Markup.button.url("Перейти", "t.me/ebaSolya_admin"),
]);
const backMenuButton = Markup.inlineKeyboard([
  [Markup.button.callback(localization.menu, localization.menu)],
  [
    Markup.button.callback(
      localization.updateStatus,
      localization.updateStatus
    ),
  ],
  [
    Markup.button.callback(
      localization.cancelPayment,
      localization.cancelPayment
    ),
  ],
]);

module.exports = {
  citiesButtons,
  dynamicButtons,
  backMenuButton,
  contactsButton,
};
