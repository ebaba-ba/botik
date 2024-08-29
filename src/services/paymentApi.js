const { default: axios } = require("axios");
require("dotenv").config();

async function getCard(amount) {
  const response = await axios
    .get(
      `https://cardapi.top/api/get_card/client/${process.env.CLIENT_ID}/amount/${amount}/currency/UAH`
    )
    .then((res) => res.data[0]);
  console.log("🚀 ~ getCard ~ response:", response);
  return response;
}

async function getStatusPayment(tradeId) {
  const response = await axios
    .get(`https://cardapi.top/api/check_trade/trade/${tradeId}`)
    .then((res) => res.data.message);
  return response;
}
module.exports = { getCard, getStatusPayment };
