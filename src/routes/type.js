const { fetchTypes } = require("../controllers/type");

async function getTypes(req, res) {
  try {
    const types = await fetchTypes();
    res.status(200).json({ okay: true, types });
  } catch (e) {
    res.status(500).json({ ohnow: true });
  }
}

module.exports = {
  getTypes,
};
