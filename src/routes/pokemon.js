const {
  fetchApiPokemon,
  fetchDBPokemon,
  fetchApiPokemonbyid,
  fetchDbPokemonbyid,
  fetchPokemonApibyName,
  fetchPokemonDbbyName,
  createPokemon,
} = require("../controllers/pokemon");

async function getPokemon(req, res) {
  const { name } = req.query;
  if (name === undefined) {
    const database = await fetchDBPokemon();
    const api = await fetchApiPokemon();
    res.status(200).json({ database, api });
  } else {
    const db = await fetchPokemonDbbyName(name);
    const api = await fetchPokemonApibyName(name);

    return res.status(200).json({ api: [...api], db: db, name });
  }
}

async function getPokemonbyId(req, res) {
  const { idPokemon } = req.params;
  try {
    const db = await fetchDbPokemonbyid(idPokemon);
    const api = await fetchApiPokemonbyid(idPokemon);
    res.status(200).json({ api, db });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function postPokemon(req, res) {
  try {
    const result = await createPokemon(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  getPokemon,
  getPokemonbyId,
  postPokemon,
};
