const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Pokemon",
    {
      ID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Imagen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Vida: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Ataque: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Defensa: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Velocidad: {
        type: DataTypes.STRING,
      },
      Altura: {
        type: DataTypes.STRING,
      },
      Peso: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );
};
