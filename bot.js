const { Telegraf, Scenes, session } = require("telegraf");
const { launchScene } = require("./src/scenes/launchScene");
const { districtsScene } = require("./src/scenes/districtsScene");
const { productsScene } = require("./src/scenes/productsScene");
const { reservationScene } = require("./src/scenes/reservationScene");
const { paymentScene } = require("./src/scenes/paymentScene");

require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([
  launchScene,
  productsScene,
  districtsScene,
  reservationScene,
  paymentScene,
]);

const setupBot = () => {
  bot.use(session());
  bot.use(stage.middleware());
  bot.use((ctx, next) => {
    next();
  });
  bot.command("start", async (ctx) => {
    try {
      ctx.scene.enter("launch");
    } catch (error) {}
  });
  return bot;
};
module.exports = {
  setupBot,
};
