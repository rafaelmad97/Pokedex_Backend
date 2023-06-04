const { Router } = require("express");
const { getPokemon, getPokemonbyId, postPokemon } = require("./pokemon");
const { getTypes } = require("./type");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/pokemon/:idPokemon", getPokemonbyId);
router.get("/pokemon/", getPokemon);
router.post("/pokemon", postPokemon);
router.get("/types/", getTypes);

module.exports = router;
