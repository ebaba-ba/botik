const { default: axios } = require("axios");
const { axiosClient } = require("./api");
require("dotenv").config();

async function getDistricts(city) {
  try {
    const reponse = await axiosClient
      .get("/collections/0684f89a-a3cd-4d5c-ac26-da02e921b3ca/records", {
        headers: {
          "x-collection-access-token": process.env.TOKEN_DISTRICTS,
        },
      })
      .then(function (response) {
        return response.data.records[0].data;
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log("🚀 ~ getDistricts ~ reponse:", reponse);

    return reponse[`${city}`];
  } catch (error) {
    console.log("ERROR", error);
  }
}
async function getCities() {
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url:
      "https://api.myjson.online/v1/records/e0d549e9-d36b-4afb-a624-3cecc1767806",
    headers: {
      "Content-Type": "application/json",
      "x-collection-access-token": process.env.TOKEN_CITIES,
    },
  };

  const response = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  console.log("🚀 ~ getCities ~ response:", response);
  return response.data.cities;
}
module.exports = { getDistricts, getCities };
