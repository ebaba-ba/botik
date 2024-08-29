const moment = require("moment");
const { axiosClient } = require("./api");
const qs = require("qs");

require("dotenv").config();
async function getProduct(redordId) {
  console.log("🚀 ~ getProduct ~ redordId:", redordId);
  // Javascript example

  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `/records/${redordId}`,
    headers: {
      "Content-Type": "application/json",
      "x-collection-access-token": "237301c1-0d92-4b51-93f8-d82cfc5881ea",
    },
  };

  const response = await axiosClient(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return response;
}
async function getProducts(groupId = 1, returnType = "products") {
  try {
    let products = [];
    const productAvailability = new Set([]);

    const reponse = await axiosClient
      .get("/collections/2f2f4a3a-b08c-4e07-98c9-aa9a06909cfc/records", {
        headers: {
          "x-collection-access-token": process.env.TOKEN_PRODUCTS,
        },
      })
      .then(function (response) {
        return response.data.records;
      })
      .catch(function (error) {});
    console.log("🚀 ~ getProducts ~ reponse:", reponse);

    reponse.forEach(async (product) => {
      if (product.data.reserved == false)
        productAvailability.add(product.data.groupId);
      else {
        isReservedProduct(product.data.reservedDate) &&
          (await unReservedProduct(product.data, product.id));
      }
    });

    productAvailability.forEach((value) => {
      console.log(value);
      products.push([
        reponse.find(
          (product) =>
            product.data.reserved === false && product.data.groupId === value
        )?.data.name + ` ${value}`,
      ]);
    });

    console.log(
      reponse
        .filter((product) => product.data.groupId === Number(groupId))
        .map((product) => [product.data.district])
    );
    return returnType === "products"
      ? products
      : reponse.filter(
          (product) =>
            product.data.reserved === false &&
            product.data.groupId === Number(groupId)
        );
  } catch (error) {
    console.log("ERROR", error);
  }
}
function isReservedProduct(reservedDate) {
  var diff = moment() - moment(reservedDate);
  var rest = 30 * 60 * 1000 - diff;
  var minutes = Math.round(rest / 1000 / 60);
  return minutes >= 2;
}
async function reservedProduct(product, RECORD_ID) {
  try {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-collection-access-token": process.env.TOKEN_PRODUCTS,
    };
    const data = qs.stringify({
      jsonData: JSON.stringify({
        ...product,
        reserved: true,
        dateReserved: new Date(),
      }),
    });
    axiosClient
      .put(`records/${RECORD_ID}`, data, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("error", error);
      });
    return reponse;
  } catch (error) {}
}
async function unReservedProduct(product, RECORD_ID) {
  try {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-collection-access-token": process.env.TOKEN_PRODUCTS,
    };
    const data = qs.stringify({
      jsonData: JSON.stringify({
        ...product,
        reserved: false,
        dateReserved: null,
      }),
    });
    axiosClient
      .put(`records/${RECORD_ID}`, data, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("error", error);
      });
    return reponse;
  } catch (error) {}
}

async function deleteProduct(RECORD_ID) {
  const headers = {
    "x-collection-access-token": process.env.TOKEN_PRODUCTS,
  };

  axiosClient
    .delete(`records/${RECORD_ID}`, { headers })
    .then((response) => {})
    .catch((error) => {
      console.error("error", error.status);
    });
}
module.exports = {
  getProducts,
  getProduct,
  deleteProduct,
  reservedProduct,
  unReservedProduct,
};
