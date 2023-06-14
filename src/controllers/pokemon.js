const { Pokemon, PokemonTypes } = require("../db.js");
const { Op } = require("sequelize");
const fetch = require("node-fetch");

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
    .then((response) => {
      const data = response.results.map(async (pokemon) => {
        return await fetch(pokemon.url).then((res) => res.json());
      });
      return Promise.all(data).then((res) => res);
    })
    .then((data) => data)
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
        const type = await PokemonTypes.findAll({
          where: {
            id_pokemon: pokemon[i].dataValues.ID,
          },
        })
          .then((res) => res)
          .catch(() => []);
        values.push({
          pokemon: pokemon[i],
          type,
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
      ID: id,
    },
  })
    .then(async (pokemon) => {
      let values = [];
      for (let i = 0; i < pokemon.length; i++) {
        const type = await PokemonTypes.findAll({
          where: {
            id_pokemon: pokemon[i].dataValues.ID,
          },
        })
          .then((res) => res)
          .catch(() => []);
        values.push({
          pokemon: pokemon[i],
          type,
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
  var reg = /^[a-z]+$/i;
  if (nombre.length !== 0 && reg.test(nombre)) {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((response) => new Array(response))
      .catch((e) => new Array())
      .finally();
  } else {
    return [];
  }
}

async function fetchPokemonDbbyName(nombre) {
  if (nombre.length !== 0) {
    return await Pokemon.findAll(
      {
        where: {
          Nombre: {
            [Op.like]: `%${nombre}%`,
          },
        },
      },
      { limit: 15 }
    )
      .then(async (pokemon) => {
        let values = [];
        for (let i = 0; i < pokemon.length; i++) {
          const pokemontypes = await PokemonTypes.findAll({
            where: {
              id_pokemon: pokemon[i].dataValues.ID,
            },
          })
            .then((res) => res)
            .catch(() => []);
          values.push({
            pokemon: pokemon[i],
            pokemonTypes: pokemontypes,
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
  return await Pokemon.create(pokemon)
    .then(async (res) => {
      const pokemontypes = types.map((idtype) => {
        return { id_pokemon: res.dataValues.ID, id_types: idtype };
      });
      await PokemonTypes.bulkCreate(pokemontypes);
      return {
        pokemon,
        pokemontypes,
        message: "Pokemon añadido correctamente",
      };
    })
    .catch((e) => ({
      error: "error " + e.message,
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
