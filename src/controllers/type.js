const { Type } = require("../db.js");
const fetch = require("node-fetch");

async function fetchTypes() {
  try {
    const db = await Type.findAll();
    await fetch(`https://pokeapi.co/api/v2/type`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (db.length === 0) {
          const values = response.results.map(({ name }, index) => {
            return { id: index, name };
          });
          initTypes(values);
        }
      })
      .finally();
    return await Type.findAll();
  } catch (error) {
    throw Error("Error");
  }
}

async function initTypes(apiType) {
  await Type.bulkCreate(apiType);
}

module.exports = {
  fetchTypes,
};
