const { default: axios } = require("axios");
const { axiosClient } = require("./api");
require("dotenv").config();

async function getContacts() {
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "records/22fe559d-b849-4043-8a52-c35c14665b62",
    headers: {
      "Content-Type": "application/json",
      "x-collection-access-token": "d4eac059-bf9a-437b-b58b-844df11835a1",
    },
  };
  const response = await axiosClient(config)
    .then(function (response) {
      return response.data.data.contacts;
    })
    .catch(function (error) {
      console.log(error);
    });
  return response;
}
module.exports = { getContacts };
