const { Pokemon, PokemonType } = require("../db.js");
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
        const type = await PokemonType.findAll({
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
        const type = await PokemonType.findAll({
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
        if (response.error !== undefined) {
          return new Array(response);
        }
        return new Array();
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
          const pokemonTypes = await PokemonType.findAll({
            where: {
              id_pokemon: pokemon[i].dataValues.ID,
            },
          })
            .then((res) => res)
            .catch(() => []);
          values.push({
            pokemon: pokemon[i],
            pokemonTypes,
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
