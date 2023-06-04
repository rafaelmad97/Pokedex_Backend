const { Pokemon, Type } = require("../db.js");

const fetch = require("node-fetch");
const PokemonTypes = require("../models/PokemonTypes.js");

async function fetchApiPokemon() {
  return await fetch(`https://pokeapi.co/api/v2/pokemon`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response.results)
    .catch((e) => ({
      error: e.message,
    }))
    .finally();
}

async function fetchDBPokemon() {
  return await Pokemon.findAll()
    .then(async (pokemon) => {
      let values = [];
      for (let i = 0; i < pokemon.length; i++) {
        const fav = await Type.findAll({
          where: {
            id_videogame: pokemon[i].dataValues.id,
          },
        });
        values.push({
          videogames: pokemon[i],
          fav,
        });
      }
      return values;
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
}

async function fetchApiPokemonbyid(id) {
  return await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response)
    .catch((e) => ({
      error: e.message,
    }))
    .finally();
}

async function fetchDbPokemonbyid(id) {
  return await Pokemon.findAll({
    where: {
      id: id,
    },
  })
    .then(async (pokemon) => {
      let values = [];
      for (let i = 0; i < pokemon.length; i++) {
        const fav = await Type.findAll({
          where: {
            id_videogame: pokemon[i].dataValues.id,
          },
        });
        values.push({
          videogames: pokemon[i],
          fav,
        });
      }
      return values;
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
}

async function fetchPokemonApibyName(nombre) {
  if (nombre.length !== 0) {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((response) => {
        return {
          ...response,
          results: response.results.slice(0, 15),
        };
      })
      .catch((e) => ({
        error: e.message,
      }))
      .finally();
  } else {
    return undefined;
  }
}

async function fetchPokemonDbbyName(nombre) {
  if (nombre.length !== 0) {
    return await Pokemon.findAll(
      {
        where: {
          Nombre: {
            [Op.like]: `%${nombre.toLowerCase()}%`,
          },
        },
      },
      { limit: 15 }
    )
      .then(async (pokemon) => {
        let values = [];
        for (let i = 0; i < pokemon.length; i++) {
          const fav = await Type.findAll({
            where: {
              id_type: pokemon[i].dataValues.id,
            },
          });
          values.push({
            videogames: pokemon[i],
            fav,
          });
        }
        return values;
      })
      .catch(() => ({
        error: "error al obtener los datos en la base de datos",
      }));
  } else {
    return undefined;
  }
}

async function createPokemon(values) {
  const { pokemon, types } = values;
  return await Pokemon.create({ ...pokemon })
    .then(async (res) => {
      const pokemonType = types.map((idtype) => {
        return { id_pokemon: res.dataValues.id, id_types: idtype };
      });
      await PokemonTypes.bulkCreate(types);
      return {
        pokemon,
        pokemonType,
      };
    })
    .catch(() => ({
      error: "error al obtener los datos en la base de datos",
    }))
    .finally();
}

module.exports = {
  fetchApiPokemon,
  fetchDBPokemon,
  fetchApiPokemonbyid,
  fetchDbPokemonbyid,
  fetchPokemonApibyName,
  fetchPokemonDbbyName,
  createPokemon,
};
